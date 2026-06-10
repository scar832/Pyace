import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import case, and_, or_
from sqlalchemy.sql import func

from app.core.deps import get_current_user
from app.database.session import get_db
from app.models.classroom import Class
from app.models.user import User, UserRole
from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementResponse
from app.routers.assignments import check_class_access

router = APIRouter(prefix="/classes/{class_id}/announcements", tags=["Announcements"])


@router.post("/", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
async def create_announcement(
    class_id: uuid.UUID,
    payload: AnnouncementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new classroom announcement.

    - Must be the classroom instructor.
    - If ``pinned_until`` is provided, ``is_pinned`` is automatically forced to True.
    """
    classroom = await check_class_access(class_id, current_user, db)

    # Must be classroom instructor
    if current_user.role != UserRole.TEACHER or classroom.instructor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the instructor of this class can create announcements",
        )

    # Force is_pinned if pinned_until is set
    is_pinned = payload.is_pinned
    if payload.pinned_until is not None:
        is_pinned = True

    new_announcement = Announcement(
        class_id=class_id,
        content=payload.content,
        is_pinned=is_pinned,
        pinned_until=payload.pinned_until,
    )

    db.add(new_announcement)
    await db.commit()
    await db.refresh(new_announcement)
    return new_announcement


@router.get("/", response_model=list[AnnouncementResponse])
async def list_announcements(
    class_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List classroom announcements.

    - Accessible to both instructors and enrolled students.
    - Smart sorting: active pins go first (is_pinned is True AND (pinned_until is None OR pinned_until > now)),
      then ordered by created_at descending.
    """
    await check_class_access(class_id, current_user, db)

    # Sort logic: Active pin condition
    active_pin_cond = and_(
        Announcement.is_pinned == True,
        or_(
            Announcement.pinned_until.is_(None),
            Announcement.pinned_until > func.now(),
        ),
    )

    stmt = (
        select(Announcement)
        .where(Announcement.class_id == class_id)
        .order_by(
            case(
                (active_pin_cond, 1),
                else_=0,
            ).desc(),
            Announcement.created_at.desc(),
        )
    )

    result = await db.execute(stmt)
    return result.scalars().all()


@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_announcement(
    class_id: uuid.UUID,
    announcement_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a classroom announcement.

    - Must be the classroom instructor.
    """
    classroom = await check_class_access(class_id, current_user, db)

    # Must be classroom instructor
    if current_user.role != UserRole.TEACHER or classroom.instructor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the instructor of this class can delete announcements",
        )

    stmt = select(Announcement).where(
        Announcement.id == announcement_id,
        Announcement.class_id == class_id,
    )
    result = await db.execute(stmt)
    announcement = result.scalars().first()

    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement not found in this class",
        )

    await db.delete(announcement)
    await db.commit()
    return None
