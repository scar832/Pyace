import random
import string

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.deps import get_current_user
from app.database.session import get_db
from app.models.classroom import Class, ClassEnrollment, EnrollmentRole
from app.models.user import User, UserRole
from app.schemas.classroom import ClassCreate, ClassResponse, EnrollmentResponse

from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/classes", tags=["Classes"])


# ---------------------------------------------------------------------------
# POST /classes — Create a new class (instructors only)
# ---------------------------------------------------------------------------

@router.post("/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
async def create_class(
    payload: ClassCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new class.

    Only users with the **teacher** role can create classes.
    A unique 6-character alphanumeric ``class_code`` is auto-generated
    by the backend — the client does not supply it.
    """
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can create classes",
        )

    # Generate a collision-safe class code
    _alphabet = string.ascii_uppercase + string.digits
    while True:
        candidate = ''.join(random.choices(_alphabet, k=6))
        existing = await db.execute(
            select(Class).where(Class.class_code == candidate)
        )
        if existing.scalars().first() is None:
            class_code = candidate
            break

    new_class = Class(
        class_name=payload.class_name,
        description=payload.description,
        img_link=payload.img_link,
        class_code=class_code,
        instructor_id=current_user.id,
    )

    db.add(new_class)
    await db.commit()
    await db.refresh(new_class)
    return new_class


# ---------------------------------------------------------------------------
# GET /classes — List classes for the current user
# ---------------------------------------------------------------------------

@router.get("/", response_model=list[ClassResponse])
async def list_classes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the classes visible to the current user.

    * **Instructors** — all classes they own.
    * **Students** — all classes they are enrolled in.
    """
    if current_user.role == UserRole.TEACHER:
        result = await db.execute(
            select(Class)
            .options(joinedload(Class.instructor))
            .where(Class.instructor_id == current_user.id)
        )
        return result.scalars().all()

    # Student path — join through ClassEnrollment
    result = await db.execute(
        select(Class)
        .join(ClassEnrollment, ClassEnrollment.class_id == Class.id)
        .options(joinedload(Class.instructor))
        .where(ClassEnrollment.student_id == current_user.id)
    )
    return result.scalars().all()


# ---------------------------------------------------------------------------
# POST /classes/join — Enrol a student in a class by code
# ---------------------------------------------------------------------------

class JoinClassBody(BaseModel):
    class_code: str


@router.post("/join", response_model=ClassResponse, status_code=status.HTTP_200_OK)
async def join_class(
    body: JoinClassBody,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Enrol the current user in a class using its invite code.

    Only **students** can join a class via this endpoint.

    Raises:
        403 — if the caller is not a student.
        404 — if no class matches the supplied ``class_code``.
        400 — if the student is already enrolled.
    """
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can join a class",
        )

    # Look up the class
    result = await db.execute(
        select(Class).where(Class.class_code == body.class_code)
    )
    target_class = result.scalars().first()

    if target_class is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found — check the invite code and try again",
        )

    # Guard against duplicate enrolment
    existing = await db.execute(
        select(ClassEnrollment).where(
            ClassEnrollment.class_id == target_class.id,
            ClassEnrollment.student_id == current_user.id,
        )
    )
    if existing.scalars().first() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this class",
        )

    # Create the enrolment record
    enrolment = ClassEnrollment(
        class_id=target_class.id,
        student_id=current_user.id,
        role=EnrollmentRole.student,
    )
    db.add(enrolment)
    await db.commit()
    await db.refresh(target_class)
    return target_class
