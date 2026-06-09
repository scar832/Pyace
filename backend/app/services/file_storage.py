"""
File storage service — Cloudinary integration.

All Cloudinary configuration is handled once in app/main.py via
cloudinary.config(). Functions here assume the SDK is already configured.
"""
import cloudinary.uploader
from fastapi import UploadFile


async def upload_image(
    file: UploadFile,
    folder_name: str = "pyace/classes",
) -> str:
    """Upload an image file to Cloudinary and return its secure URL.

    Args:
        file:        The multipart file received from the FastAPI endpoint.
        folder_name: Cloudinary folder to store the asset in.

    Returns:
        The ``secure_url`` (HTTPS) of the uploaded image.

    Raises:
        Exception: Re-raised from the Cloudinary SDK on any upload failure.
                   The calling router is responsible for converting this to
                   an appropriate HTTPException.
    """
    contents = await file.read()

    result = cloudinary.uploader.upload(
        contents,
        folder=folder_name,
        resource_type="auto",
    )

    return result["secure_url"]
