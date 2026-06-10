import enum
import uuid
from sqlalchemy import Column, String, Text, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.database.session import Base


class ClassStatus(str, enum.Enum):
    active = "active"
    archived = "archived"


class EnrollmentRole(str, enum.Enum):
    student = "student"
    ta = "ta"


class Class(Base):
    __tablename__ = "classes"

    # --- Identity ---
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    class_name = Column(String, nullable=False)
    class_code = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    img_link = Column(String, nullable=True)
    status = Column(Enum(ClassStatus), nullable=False, default=ClassStatus.active)

    # --- Ownership ---
    instructor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )
    prefect_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # --- Timestamps ---
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # --- Relationships ---
    enrollments = relationship(
        "ClassEnrollment",
        back_populates="classroom",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    assignments = relationship(
        "Assignment",
        back_populates="classroom",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    announcements = relationship(
        "Announcement",
        back_populates="classroom",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    instructor = relationship(
        "User",
        foreign_keys=[instructor_id],
        back_populates="classes_taught",
        lazy="selectin",
    )
    prefect = relationship(
        "User",
        foreign_keys=[prefect_id],
        back_populates="classes_as_prefect",
    )

    @property
    def instructor_name(self) -> str:
        return self.instructor.full_name if self.instructor else "Unknown Instructor"

    def __repr__(self) -> str:
        return f"<Class id={self.id} code={self.class_code!r} status={self.status.value}>"


class ClassEnrollment(Base):
    __tablename__ = "class_enrollments"

    # --- Identity ---
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    # --- Foreign Keys ---
    class_id = Column(
        UUID(as_uuid=True),
        ForeignKey("classes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # --- Role & Timing ---
    role = Column(Enum(EnrollmentRole), nullable=False, default=EnrollmentRole.student)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # --- Relationships ---
    classroom = relationship("Class", back_populates="enrollments")
    student = relationship("User", foreign_keys=[student_id], back_populates="enrollments")

    def __repr__(self) -> str:
        return (
            f"<ClassEnrollment class_id={self.class_id} "
            f"student_id={self.student_id} role={self.role.value}>"
        )
