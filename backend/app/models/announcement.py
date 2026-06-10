import uuid
from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.session import Base


class Announcement(Base):
    __tablename__ = "announcements"

    # --- Identity ---
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    # --- Foreign Keys ---
    class_id = Column(
        UUID(as_uuid=True),
        ForeignKey("classes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # --- Content & Pin details ---
    content = Column(Text, nullable=False)
    is_pinned = Column(Boolean, nullable=False, default=False)
    pinned_until = Column(DateTime(timezone=True), nullable=True)

    # --- Timestamps ---
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # --- Relationships ---
    classroom = relationship("Class", back_populates="announcements", lazy="selectin")

    def __repr__(self) -> str:
        return (
            f"<Announcement id={self.id} class_id={self.class_id} "
            f"is_pinned={self.is_pinned}>"
        )
