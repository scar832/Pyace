from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.core.config import settings
from typing import AsyncGenerator

# ---------------------------------------------------------------------------
# Build a clean database URL for asyncpg
# ---------------------------------------------------------------------------
# Neon appends ?sslmode=require&channel_binding=require — asyncpg doesn't
# understand those query params.  We strip them and pass SSL via connect_args.
# ---------------------------------------------------------------------------

db_url = settings.DATABASE_URL

# Ensure database URL is using asyncpg driver
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Parse and strip params that asyncpg can't handle
parsed = urlparse(db_url)
query_params = parse_qs(parsed.query)

ssl_required = query_params.pop("sslmode", [None])[0] in ("require", "verify-full", "verify-ca")
query_params.pop("channel_binding", None)

clean_query = urlencode({k: v[0] for k, v in query_params.items()})
clean_url = urlunparse(parsed._replace(query=clean_query))

# Build connect_args with SSL if the original URL requested it
connect_args = {}
if ssl_required:
    import ssl as _ssl
    ssl_ctx = _ssl.create_default_context()
    connect_args["ssl"] = ssl_ctx

# Create the async engine
engine = create_async_engine(clean_url, echo=True, connect_args=connect_args)

# Create async sessionmaker
SessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

# Declarative Base for models
Base = declarative_base()

# Async database session dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
