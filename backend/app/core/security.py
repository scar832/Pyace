import bcrypt
from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from fastapi import HTTPException, status
from google.oauth2 import id_token
from google.auth.transport.requests import Request as GoogleRequest

from app.core.config import settings


# ---------------------------------------------------------------------------
# Password hashing / verification (bcrypt)
# ---------------------------------------------------------------------------

def get_password_hash(password: str) -> str:
    """Hash a plain-text password using bcrypt.

    bcrypt is the industry standard — intentionally slow to make
    brute-force attacks impractical.
    """
    # bcrypt requires bytes, not str
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a stored bcrypt hash."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


# ---------------------------------------------------------------------------
# JWT access-token creation
# ---------------------------------------------------------------------------

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT access token.

    Args:
        data: Payload claims to encode (e.g. {"sub": user_email}).
        expires_delta: Optional custom expiry; falls back to the
                       ACCESS_TOKEN_EXPIRE_MINUTES setting.

    Returns:
        Encoded JWT string.
    """
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


# ---------------------------------------------------------------------------
# Google OAuth2 token verification
# ---------------------------------------------------------------------------

def verify_google_token(token: str) -> dict:
    """Verify a Google OAuth2 ID token and return its payload.

    Uses Google's public certificates to validate the token signature,
    expiry, issuer, and audience.

    Raises:
        HTTPException 401 if the token is invalid or expired.
    """
    try:
        payload = id_token.verify_oauth2_token(
            token,
            GoogleRequest(),
            settings.GOOGLE_CLIENT_ID,
        )
        return payload
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )
