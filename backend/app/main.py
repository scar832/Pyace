from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth

app = FastAPI(
    title="Pyace API",
    description="Backend API for Pyace - Gamified EdTech LMS Platform",
    version="0.1.0"
)

# Configure CORS Middleware (development settings)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev. Will restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Pyace API",
        "status": "online",
        "version": "0.1.0"
    }
