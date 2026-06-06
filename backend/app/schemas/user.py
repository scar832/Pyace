from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole


class UserCreate(UserBase):
    password: str = Field(min_length=6, description="Raw password before hashing")


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole
    is_verified: bool
    is_premium: bool
    auth_provider: str
    total_xp: int
    badges: list = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
