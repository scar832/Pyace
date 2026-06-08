import asyncio
from logging.config import fileConfig
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context

# --- PyAce Imports ---
from app.core.config import settings
from app.database.session import Base
from app.models.user import User  # noqa: F401

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# ---------------------------------------------------------------------------
# Build a clean database URL for asyncpg
# ---------------------------------------------------------------------------
# Neon (and many cloud Postgres providers) append query params like
# ?sslmode=require&channel_binding=require to the URL.  asyncpg does NOT
# accept those — it uses a `ssl` kwarg instead.  We strip them here and
# pass SSL config through connect_args.
# ---------------------------------------------------------------------------

db_url = settings.DATABASE_URL

# Ensure we're using the asyncpg driver
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Parse the URL and strip params that asyncpg can't handle
parsed = urlparse(db_url)
query_params = parse_qs(parsed.query)

# Detect if SSL was requested before we strip it
ssl_required = query_params.pop("sslmode", [None])[0] in ("require", "verify-full", "verify-ca")
query_params.pop("channel_binding", None)  # asyncpg doesn't support this either

# Rebuild URL without the problematic params
clean_query = urlencode({k: v[0] for k, v in query_params.items()})
clean_url = urlunparse(parsed._replace(query=clean_query))

config.set_main_option("sqlalchemy.url", clean_url)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Point Alembic at our models' metadata for autogenerate support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Create an async engine and run migrations."""

    # Build connect_args with SSL if the original URL requested it
    connect_args = {"statement_cache_size": 0}
    if ssl_required:
        import ssl as _ssl
        ssl_ctx = _ssl.create_default_context()
        connect_args["ssl"] = ssl_ctx

    connectable = create_async_engine(
        clean_url,
        poolclass=pool.NullPool,
        connect_args=connect_args,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
