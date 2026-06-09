from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User

# ---------------------------------------------------------------------------
# OAuth2 scheme — points clients at the login endpoint for token acquisition
# ---------------------------------------------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ---------------------------------------------------------------------------
# Reusable dependency: resolve the current authenticated user from a JWT
# ---------------------------------------------------------------------------

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Decode the Bearer JWT and return the corresponding User row.

    Raises:
        HTTP 401 — if the token is missing, malformed, expired, or the
                   user encoded in the token no longer exists in the DB.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Fetch the user from the database
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if user is None:
        raise credentials_exception

    return user
