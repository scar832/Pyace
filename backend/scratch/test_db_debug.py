import asyncio
import asyncpg
import logging
import sys

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("db_debug")

async def main():
    dsn = "postgresql://neondb_owner:npg_q0c9UaCbMOXR@ep-calm-bonus-aq1980ka.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
    logger.info("Starting connection to %s", dsn)
    try:
        conn = await asyncpg.connect(dsn, timeout=60)
        logger.info("Connected successfully!")
        val = await conn.fetchval("SELECT 1")
        logger.info("Fetchval select 1: %s", val)
        await conn.close()
    except Exception as e:
        logger.exception("Connection failed")

if __name__ == "__main__":
    asyncio.run(main())
