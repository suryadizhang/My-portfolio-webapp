from datetime import datetime
from typing import Tuple

from .kv import kv


async def log_page_view(slug: str) -> None:
    """Log a page view for a specific slug"""
    key = f"analytics:views:{slug}"
    await kv.incr(key)
    print(f"Analytics: Page view logged for {slug}")

async def get_page_views(slug: str) -> int:
    """Get page view count for a specific slug"""
    key = f"analytics:views:{slug}"
    return await kv.get_int(key)

async def toggle_like(slug: str, session_id: str) -> Tuple[bool, int]:
    """Toggle like status for a slug and session ID

    Returns:
        Tuple of (is_liked, total_count)
    """
    likes_set_key = f"set:likes:{slug}"

    # Check if user already liked this
    is_currently_liked = await kv.sismember(likes_set_key, session_id)

    if is_currently_liked:
        # Remove like
        await kv.srem(likes_set_key, session_id)
        liked = False
    else:
        # Add like
        await kv.sadd(likes_set_key, session_id)
        liked = True

    # Get total count
    total_count = await kv.scard(likes_set_key)

    print(f"Analytics: Like toggled for {slug} by {session_id[:8]}... - Liked: {liked}, Total: {total_count}")

    return liked, total_count

async def get_like_status(slug: str, session_id: str) -> Tuple[bool, int]:
    """Get like status for a slug and session ID

    Returns:
        Tuple of (is_liked, total_count)
    """
    likes_set_key = f"set:likes:{slug}"

    is_liked = await kv.sismember(likes_set_key, session_id)
    total_count = await kv.scard(likes_set_key)

    return is_liked, total_count

async def log_resume_download() -> None:
    """Log a resume download"""
    key = "analytics:resume:downloads"
    await kv.incr(key)
    print("Analytics: Resume download logged")

async def get_resume_downloads() -> int:
    """Get total resume download count"""
    key = "analytics:resume:downloads"
    return await kv.get_int(key)

async def log_chat_session() -> None:
    """Log a chat session for today"""
    today = datetime.now().strftime("%Y-%m-%d")
    key = f"analytics:chat:sessions:{today}"
    await kv.incr(key)
    print(f"Analytics: Chat session logged for {today}")

async def log_chat_tokens(token_count: int) -> None:
    """Log chat token usage for today"""
    today = datetime.now().strftime("%Y-%m-%d")
    key = f"analytics:chat:tokens:{today}"
    await kv.incr(key, token_count)
    print(f"Analytics: {token_count} tokens logged for {today}")

async def get_chat_stats(days: int = 7) -> dict:
    """Get chat statistics for the last N days"""
    stats = {
        "sessions_by_day": {},
        "tokens_by_day": {},
        "total_sessions": 0,
        "total_tokens": 0
    }

    from datetime import timedelta
    today = datetime.now()

    for i in range(days):
        date = (today - timedelta(days=i)).strftime("%Y-%m-%d")

        sessions_key = f"analytics:chat:sessions:{date}"
        tokens_key = f"analytics:chat:tokens:{date}"

        sessions = await kv.get_int(sessions_key)
        tokens = await kv.get_int(tokens_key)

        stats["sessions_by_day"][date] = sessions
        stats["tokens_by_day"][date] = tokens
        stats["total_sessions"] += sessions
        stats["total_tokens"] += tokens

    return stats
