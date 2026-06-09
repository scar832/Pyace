import cloudinary
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, classes, uploads

# ---------------------------------------------------------------------------
# Configure Cloudinary once at startup (before any router imports it)
# ---------------------------------------------------------------------------
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

app = FastAPI(
    title="Pyace API",
    description="Backend API for Pyace - Gamified EdTech LMS Platform",
    version="0.1.0",
)

# Configure CORS Middleware (development settings — restrict origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(classes.router)
app.include_router(uploads.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Pyace API",
        "status": "online",
        "version": "0.1.0",
    }
