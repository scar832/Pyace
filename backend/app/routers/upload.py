"""
Upload router — handles media file uploads to Cloudinary.

Endpoint:
    POST /upload/image
        Accepts a multipart/form-data file, uploads it to the
        'pyace/class-covers' folder in Cloudinary, and returns the
        secure HTTPS URL to store in Class.img_link.
"""
import cloudinary
import cloudinary.uploader

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel

from app.core.config import settings
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["Upload"])

# Configure Cloudinary once at import time using the settings from .env
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

_ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
_MAX_BYTES = 8 * 1024 * 1024  # 8 MB


class ImageUploadResponse(BaseModel):
    url: str


# ---------------------------------------------------------------------------
# POST /upload/image
# ---------------------------------------------------------------------------

@router.post(
    "/image",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_200_OK,
)
async def upload_image(
    file: UploadFile = File(..., description="Cover image for a class (JPEG / PNG / WebP / GIF, ≤ 8 MB)"),
    current_user: User = Depends(get_current_user),
):
    """Upload a cover image to Cloudinary and return its secure URL.

    - Only authenticated users (any role) may upload.
    - Accepted types: JPEG, PNG, WebP, GIF.
    - Max size: 8 MB.
    """
    # ── Validate MIME type ──────────────────────────────────────────────────
    if file.content_type not in _ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{file.content_type}'. Accepted: JPEG, PNG, WebP, GIF.",
        )

    # ── Read and size-check ─────────────────────────────────────────────────
    data = await file.read()
    if len(data) > _MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File exceeds the 8 MB limit.",
        )

    # ── Upload to Cloudinary ────────────────────────────────────────────────
    try:
        result = cloudinary.uploader.upload(
            data,
            folder="pyace/class-covers",
            resource_type="image",
            # Transformations: cap at 1200 px wide, strip metadata, auto quality
            transformation=[
                {"width": 1200, "crop": "limit"},
                {"quality": "auto", "fetch_format": "auto"},
            ],
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Image upload failed: {exc}",
        )

    return ImageUploadResponse(url=result["secure_url"])
