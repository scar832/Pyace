import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.database.session import Base


class UserRole(str, enum.Enum):
    TEACHER = "teacher"
    STUDENT = "student"


class User(Base):
    __tablename__ = "users"

    # --- Identity ---
    id = Column(Integer, primary_key=True, index=True)
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

    # --- Relationships (will be fully wired when Class / Enrollment models exist) ---
    # A teacher owns many classrooms
    # classrooms = relationship("Classroom", back_populates="teacher")

    # A student is enrolled in many classrooms via an enrollment join table
    # enrollments = relationship("Enrollment", back_populates="student")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} role={self.role.value}>"
