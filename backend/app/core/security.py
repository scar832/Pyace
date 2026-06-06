import bcrypt


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
