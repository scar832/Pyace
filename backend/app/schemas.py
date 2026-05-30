from pydantic import BaseModel, EmailStr
from typing import Optional


# -------------------------
# USER SCHEMAS
# -------------------------

class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "student"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    full_name: str
    email: EmailStr
    role: str


# -------------------------
# CLASS SCHEMAS
# -------------------------

class ClassCreate(BaseModel):
    name: str
    description: Optional[str] = None
    instructor_email: EmailStr


class ClassResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    instructor_email: EmailStr


# -------------------------
# GRADING SCHEMAS
# -------------------------

class CodeSubmission(BaseModel):
    student_email: EmailStr
    class_id: int
    question: str
    code: str
    language: str = "python"


class GradingResponse(BaseModel):
    student_email: EmailStr
    class_id: int
    score: Optional[float] = None
    feedback: str