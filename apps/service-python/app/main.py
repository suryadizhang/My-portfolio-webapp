import os
import sys
import uuid
import logging

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .routes import analytics, chat, health, resume

# Configure logging
logging.basicConfig(
    level=logging.INFO if os.getenv("LOG_LEVEL", "info").upper() == "INFO" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Validate critical environment variables
def validate_environment():
    """Validate environment configuration on startup"""
    warnings = []
    
    if not os.getenv("OPENAI_API_KEY"):
        warnings.append("OPENAI_API_KEY not set - AI chat features will be unavailable")
    
    if not os.getenv("KV_REST_API_URL") or not os.getenv("KV_REST_API_TOKEN"):
        warnings.append("KV_REST_API_URL/TOKEN not set - Analytics will use in-memory fallback")
    
    if not os.getenv("RESUME_SIGNING_SECRET"):
        warnings.append("RESUME_SIGNING_SECRET not set - Signed resume downloads disabled")
    
    if warnings:
        logger.warning("⚠️  Configuration warnings:")
        for warn in warnings:
            logger.warning(f"  - {warn}")
    else:
        logger.info("✅ All environment variables configured")

# Validate on startup
validate_environment()

app = FastAPI(
    title="Portfolio API",
    description="FastAPI backend for portfolio with AI chat, RAG, and analytics",
    version="1.0.0",
    docs_url="/docs" if os.getenv("NODE_ENV") != "production" else None,  # Hide docs in prod
    redoc_url="/redoc" if os.getenv("NODE_ENV") != "production" else None
)

# CORS configuration
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]
logger.info(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler for better error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle uncaught exceptions gracefully"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "ok": False,
            "error": "Internal server error",
            "message": str(exc) if os.getenv("NODE_ENV") != "production" else "An error occurred"
        }
    )

@app.middleware("http")
async def add_session_id(request: Request, call_next):
    """Add session ID cookie if not present"""
    response = await call_next(request)

    # Check if session ID cookie exists
    sid = request.cookies.get("sid")
    if not sid:
        sid = str(uuid.uuid4())
        response.set_cookie(
            "sid",
            sid,
            httponly=True,
            samesite="lax",
            secure=False,  # Set to True in production with HTTPS
            max_age=86400 * 365  # 1 year
        )

    return response

# Include routers
app.include_router(health.router, prefix="", tags=["health"])
app.include_router(chat.router, prefix="/ai", tags=["chat"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(resume.router, prefix="", tags=["resume"])

@app.get("/")
async def root():
    return {"message": "Portfolio API is running", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
