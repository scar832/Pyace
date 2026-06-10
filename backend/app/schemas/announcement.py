import uuid as _uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AnnouncementCreate(BaseModel):
    content: str
    is_pinned: bool = False
    pinned_until: Optional[datetime] = None


class AnnouncementResponse(BaseModel):
    id: _uuid.UUID
    class_id: _uuid.UUID
    content: str
    is_pinned: bool
    pinned_until: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
