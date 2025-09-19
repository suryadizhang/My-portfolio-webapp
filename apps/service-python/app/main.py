from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routes
from .routes import health, chat, analytics, resume

app = FastAPI(
    title="Portfolio API",
    description="FastAPI backend for portfolio with AI chat, RAG, and analytics",
    version="1.0.0"
)

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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