
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from ..core.analytics import (
    get_chat_stats,
    get_like_status,
    get_page_views,
    get_resume_downloads,
    log_page_view,
    toggle_like,
)

router = APIRouter()

class PageViewRequest(BaseModel):
    slug: str

class LikeRequest(BaseModel):
    slug: str

class PageViewResponse(BaseModel):
    count: int

class LikeResponse(BaseModel):
    liked: bool
    count: int

class ResumeAnalyticsResponse(BaseModel):
    downloads: int

class AnalyticsSummaryResponse(BaseModel):
    viewsBySlug: dict
    likesTop: list
    resumeDownloads: dict
    chat: dict

@router.post("/views", response_model=PageViewResponse)
async def log_page_view_endpoint(request: PageViewRequest):
    """Log a page view for a specific slug"""
    await log_page_view(request.slug)
    count = await get_page_views(request.slug)
    return PageViewResponse(count=count)

@router.get("/views", response_model=PageViewResponse)
async def get_page_views_endpoint(slug: str):
    """Get page view count for a specific slug"""
    count = await get_page_views(slug)
    return PageViewResponse(count=count)

@router.post("/likes", response_model=LikeResponse)
async def toggle_like_endpoint(request: Request, like_request: LikeRequest):
    """Toggle like status for a slug using session ID"""
    session_id = request.cookies.get("sid")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")

    liked, count = await toggle_like(like_request.slug, session_id)
    return LikeResponse(liked=liked, count=count)

@router.get("/likes", response_model=LikeResponse)
async def get_like_status_endpoint(request: Request, slug: str):
    """Get like status for a slug using session ID"""
    session_id = request.cookies.get("sid")
    if not session_id:
        # Return default state for users without session
        return LikeResponse(liked=False, count=0)

    liked, count = await get_like_status(slug, session_id)
    return LikeResponse(liked=liked, count=count)

@router.get("/resume", response_model=ResumeAnalyticsResponse)
async def get_resume_analytics():
    """Get resume download analytics"""
    downloads = await get_resume_downloads()
    return ResumeAnalyticsResponse(downloads=downloads)

@router.get("/summary", response_model=AnalyticsSummaryResponse)
async def get_analytics_summary(range: str = "7d"):
    """Get comprehensive analytics summary"""
    # Parse range (for now, just support days)
    try:
        days = int(range.rstrip('d'))
    except ValueError:
        days = 7

    # Get chat statistics
    chat_stats = await get_chat_stats(days)

    # Get resume downloads
    resume_downloads = await get_resume_downloads()

    return AnalyticsSummaryResponse(
        viewsBySlug={},  # TODO: Implement if needed
        likesTop=[],     # TODO: Implement if needed
        resumeDownloads={
            "total": resume_downloads,
            "daily": []  # TODO: Implement daily breakdown
        },
        chat={
            "sessionsDaily": [
                {"date": date, "count": count}
                for date, count in chat_stats["sessions_by_day"].items()
            ],
            "tokensDaily": [
                {"date": date, "count": count}
                for date, count in chat_stats["tokens_by_day"].items()
            ],
            "totalSessions": chat_stats["total_sessions"],
            "totalTokens": chat_stats["total_tokens"]
        }
    )

@router.get("/privacy")
async def get_privacy_info():
    """Get privacy information about analytics collection"""
    return {
        "message": "Privacy & Analytics Information",
        "description": "We collect minimal, anonymous analytics to improve the portfolio experience:",
        "collected_data": [
            "Page view counters per project/page (no personal data)",
            "Like counts using anonymous session IDs (stored in cookies)",
            "Resume download counts (aggregate only)",
            "Chat usage statistics (sessions and token counts, no conversation content)",
            "IP addresses for rate limiting (not stored permanently)"
        ],
        "data_usage": [
            "All counters are anonymous and aggregate",
            "Session IDs are random UUIDs, not linked to personal information",
            "No tracking across devices or persistent user identification",
            "Data is used only for portfolio analytics and improvement"
        ],
        "user_control": [
            "You can disable page view tracking in localStorage",
            "Clear cookies to reset session ID and like preferences",
            "No data is shared with third parties"
        ]
    }
