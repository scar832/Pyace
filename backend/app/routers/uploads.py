"""
Uploads router — authenticated file upload endpoints.

Endpoint:
    POST /uploads/image
        Accepts multipart/form-data, proxies the file to Cloudinary via the
        file_storage service, and returns the secure CDN URL.
"""
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.deps import get_current_user
from app.models.user import User
from app.services.file_storage import upload_image, upload_file

router = APIRouter(prefix="/uploads", tags=["Uploads"])

_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
_MAX_SIZE_BYTES = 8 * 1024 * 1024  # 8 MB


# ---------------------------------------------------------------------------
# POST /uploads/image
# ---------------------------------------------------------------------------

@router.post("/image", status_code=status.HTTP_200_OK)
async def upload_image_endpoint(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload a cover image to Cloudinary.

    - Requires authentication (any role).
    - Accepted MIME types: JPEG, PNG, WebP, GIF.
    - Maximum file size: 8 MB.

    Returns:
        ``{ "url": "<cloudinary_secure_url>" }``
    """
    # ── MIME type guard ─────────────────────────────────────────────────────
    if file.content_type not in _ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported file type '{file.content_type}'. "
                "Accepted: image/jpeg, image/png, image/webp, image/gif."
            ),
        )

    # ── Size guard (peek at Content-Length header if provided) ──────────────
    # We also guard after reading in the service, but catching it here avoids
    # reading a huge file into memory unnecessarily.
    if file.size and file.size > _MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File exceeds the 8 MB size limit.",
        )

    # ── Delegate to the service layer ───────────────────────────────────────
    try:
        secure_url = await upload_image(file, folder_name="pyace/classes")
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Image upload failed: {exc}",
        )

    return {"url": secure_url}


# ---------------------------------------------------------------------------
# POST /uploads/file
# ---------------------------------------------------------------------------

@router.post("/file", status_code=status.HTTP_200_OK)
async def upload_file_endpoint(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload a generic file (PDF, ZIP, DOCX, etc.) to Cloudinary.

    - Requires authentication (any role).
    - Maximum file size: 8 MB.

    Returns:
        ``{ "url": "<cloudinary_secure_url>" }``
    """
    if file.size and file.size > _MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File exceeds the 8 MB size limit.",
        )

    try:
        secure_url = await upload_file(file, folder_name="pyace/assignments")
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"File upload failed: {exc}",
        )

    return {"url": secure_url}
