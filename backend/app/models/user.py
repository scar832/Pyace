import enum
import uuid
from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from app.database.session import Base


class UserRole(str, enum.Enum):
    TEACHER = "teacher"
    STUDENT = "student"


class User(Base):
    __tablename__ = "users"

    # --- Identity ---
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)

    # --- Account status ---
    is_verified = Column(Boolean, nullable=False, default=False)
    is_premium = Column(Boolean, nullable=False, default=False)
    auth_provider = Column(String, nullable=False, default="password")

    # --- Gamification ---
    total_xp = Column(Integer, nullable=False, default=0)
    badges = Column(JSONB, nullable=False, server_default="[]")

    # --- Relationships ---
    # Classes where this user is the instructor
    classes_taught = relationship(
        "Class",
        foreign_keys="Class.instructor_id",
        back_populates="instructor",
        lazy="selectin",
    )

    # Classes where this user is the prefect (TA lead)
    classes_as_prefect = relationship(
        "Class",
        foreign_keys="Class.prefect_id",
        back_populates="prefect",
        lazy="selectin",
    )

    # Enrollment records for this user (as student / TA)
    enrollments = relationship(
        "ClassEnrollment",
        foreign_keys="ClassEnrollment.student_id",
        back_populates="student",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} role={self.role.value}>"
