import uuid as _uuid
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
    id: _uuid.UUID
    email: EmailStr
    full_name: str
    role: UserRole
    is_verified: bool
    is_premium: bool
    auth_provider: str
    total_xp: int
    badges: list = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Authentication schemas
# ---------------------------------------------------------------------------

class Token(BaseModel):
    """Returned by both /login and /auth/google endpoints."""
    access_token: str
    token_type: str = "bearer"
    role: str


class GoogleAuthRequest(BaseModel):
    """Body payload sent by the frontend after Google Sign-In."""
    credential: str
    role: str | None = None
