import os
from typing import Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class HealthResponse(BaseModel):
    ok: bool
    service: str
    version: str
    environment: str
    config: Dict[str, Any]

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint with configuration validation
    Returns service status and configuration state
    """
    # Check critical configuration
    has_openai = bool(os.getenv("OPENAI_API_KEY"))
    has_kv = bool(os.getenv("KV_REST_API_URL") and os.getenv("KV_REST_API_TOKEN"))
    has_resume_secret = bool(os.getenv("RESUME_SIGNING_SECRET"))
    
    return HealthResponse(
        ok=True,
        service="portfolio-api",
        version="1.0.0",
        environment=os.getenv("NODE_ENV", "development"),
        config={
            "openai_configured": has_openai,
            "kv_storage_configured": has_kv,
            "resume_signing_configured": has_resume_secret,
            "cors_origins": len(os.getenv("ALLOWED_ORIGINS", "").split(","))
        }
    )
