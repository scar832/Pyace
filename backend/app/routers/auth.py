from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.session import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserResponse, Token, GoogleAuthRequest
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    verify_google_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ---------------------------------------------------------------------------
# POST /auth/register — email + password sign-up
# ---------------------------------------------------------------------------

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if a user with this email already exists
    query = select(User).where(User.email == user_in.email)
    result = await db.execute(query)
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password — never store plaintext
    hashed_password = get_password_hash(user_in.password)

    # Create new user instance with the bcrypt hash
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role,
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


# ---------------------------------------------------------------------------
# POST /auth/login — email + password login (JWT)
# ---------------------------------------------------------------------------

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Authenticate with email (username field) and password.

    Returns a signed JWT access token on success.
    """
    # Lookup user by email (OAuth2 spec uses 'username' as the field name)
    query = select(User).where(User.email == form_data.username)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, role=user.role.value)


# ---------------------------------------------------------------------------
# POST /auth/google — Google One-Tap / OAuth sign-in
# ---------------------------------------------------------------------------

@router.post("/google", response_model=Token)
async def google_auth(
    body: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db),
):
    """Verify a Google ID token, log in or auto-register the user,
    and return a JWT access token.
    """
    # 1. Verify the Google credential
    google_payload = verify_google_token(body.credential)

    google_email: str = google_payload["email"]
    google_name: str = google_payload.get("name", "")
    google_picture: str = google_payload.get("picture", "")

    # 2. Check if user already exists
    query = select(User).where(User.email == google_email)
    result = await db.execute(query)
    user = result.scalars().first()

    # 3. Auto-register if this is a first-time Google sign-in
    if not user:
        # Map the frontend role to the backend enum (default: student)
        selected_role = UserRole.STUDENT
        if body.role and body.role.lower() in ("teacher", "instructor"):
            selected_role = UserRole.TEACHER

        user = User(
            email=google_email,
            full_name=google_name,
            role=selected_role,
            auth_provider="google",
            is_verified=True,
            hashed_password="none",  # No password for Google-only accounts
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # 4. Issue JWT
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, role=user.role.value)
