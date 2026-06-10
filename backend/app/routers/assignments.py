import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.deps import get_current_user
from app.database.session import get_db
from app.models.classroom import Class, ClassEnrollment
from app.models.user import User, UserRole
from app.models.assignment import Assignment
from app.schemas.assignment import AssignmentCreate, AssignmentResponse

router = APIRouter(prefix="/classes/{class_id}/assignments", tags=["Assignments"])


async def check_class_access(
    class_id: uuid.UUID,
    user: User,
    db: AsyncSession,
) -> Class:
    """Helper function to verify class access.
    
    - If the class does not exist, raises a 404 NOT FOUND.
    - If the user is a teacher, verifies they are the class instructor.
    - If the user is a student, verifies they have a ClassEnrollment record.
    - Otherwise raises a 403 FORBIDDEN.
    """
    stmt = select(Class).where(Class.id == class_id)
    result = await db.execute(stmt)
    classroom = result.scalars().first()
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found",
        )

    if user.role == UserRole.TEACHER:
        if classroom.instructor_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the instructor of this class has access",
            )
    else:
        # Check student enrollment
        enrollment_stmt = select(ClassEnrollment).where(
            ClassEnrollment.class_id == class_id,
            ClassEnrollment.student_id == user.id,
        )
        enrollment_result = await db.execute(enrollment_stmt)
        if not enrollment_result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not enrolled in this class",
            )
    return classroom


@router.post("/", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    class_id: uuid.UUID,
    payload: AssignmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new assignment.
    
    Must be the instructor of the class.
    """
    classroom = await check_class_access(class_id, current_user, db)
    if current_user.role != UserRole.TEACHER or classroom.instructor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the instructor of this class can create assignments",
        )

    new_assignment = Assignment(
        class_id=class_id,
        title=payload.title,
        description=payload.description,
        resource_url=payload.resource_url,
        due_date=payload.due_date,
        max_score=payload.max_score if payload.max_score is not None else 100,
        is_published=payload.is_published if payload.is_published is not None else True,
    )
    db.add(new_assignment)
    await db.commit()
    await db.refresh(new_assignment)
    return new_assignment


@router.get("/", response_model=list[AssignmentResponse])
async def list_assignments(
    class_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List assignments.
    
    Instructors can see all assignments.
    Enrolled students only see published assignments.
    Ordered by due_date ascending.
    """
    await check_class_access(class_id, current_user, db)

    stmt = select(Assignment).where(Assignment.class_id == class_id)
    if current_user.role != UserRole.TEACHER:
        stmt = stmt.where(Assignment.is_published == True)

    stmt = stmt.order_by(Assignment.due_date.asc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assignment(
    class_id: uuid.UUID,
    assignment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an assignment.
    
    Must be the instructor.
    """
    classroom = await check_class_access(class_id, current_user, db)
    if current_user.role != UserRole.TEACHER or classroom.instructor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the instructor of this class can delete assignments",
        )

    stmt = select(Assignment).where(
        Assignment.id == assignment_id,
        Assignment.class_id == class_id
    )
    result = await db.execute(stmt)
    assignment = result.scalars().first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found in this class",
        )

    await db.delete(assignment)
    await db.commit()
    return None
