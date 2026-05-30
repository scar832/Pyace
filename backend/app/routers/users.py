from fastapi import APIRouter, HTTPException
from app.schemas import UserSignup, UserLogin

router = APIRouter()

# -------------------------
# Mock "database"
# -------------------------
fake_users_db = {}

# -------------------------
# SIGNUP
# -------------------------
@router.post("/signup")
def signup(user: UserSignup):
    # Check if user already exists
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    # Save user (in memory)
    fake_users_db[user.email] = {
        "full_name": user.full_name,
        "email": user.email,
        "password": user.password,
        "role": user.role
    }

    return {
        "message": "User created successfully",
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }


# -------------------------
# LOGIN
# -------------------------
@router.post("/login")
def login(user: UserLogin):
    # Check if user exists
    existing_user = fake_users_db.get(user.email)

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check password
    if existing_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "user": {
            "email": existing_user["email"],
            "full_name": existing_user["full_name"],
            "role": existing_user["role"]
        }
    }