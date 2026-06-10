import uuid as _uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AssignmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    resource_url: Optional[str] = None
    due_date: datetime
    max_score: Optional[int] = 100
    is_published: Optional[bool] = True


class AssignmentResponse(BaseModel):
    id: _uuid.UUID
    class_id: _uuid.UUID
    title: str
    description: Optional[str] = None
    resource_url: Optional[str] = None
    due_date: datetime
    max_score: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
