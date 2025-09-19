from fastapi import APIRouter, Request, HTTPException, Query
from fastapi.responses import StreamingResponse, FileResponse
import os
from pathlib import Path
from ..core.analytics import log_resume_download
from ..core.signing import signer

router = APIRouter()

@router.get("/resume")
async def download_resume(request: Request, token: str = Query(None)):
    """Download resume PDF with optional token verification"""
    
    # Check if signed downloads are required
    signed_downloads = os.getenv("SIGNED_DOWNLOADS", "false").lower() == "true"
    
    if signed_downloads:
        if not token:
            raise HTTPException(
                status_code=403, 
                detail="Token required for resume download"
            )
        
        # Verify token
        try:
            payload = signer.verify(token)
            # Check if token is for resume download
            if payload.get("sub") != "resume_download":
                raise HTTPException(
                    status_code=403,
                    detail="Invalid token type"
                )
        except HTTPException:
            raise  # Re-raise HTTP exceptions
        except Exception as e:
            raise HTTPException(
                status_code=403,
                detail=f"Token verification failed: {str(e)}"
            )
    
    # Log the download
    await log_resume_download()
    
    # Look for resume file in multiple possible locations
    possible_paths = [
        "../../apps/web/public/resume.pdf",  # Relative to service-python
        "../web/public/resume.pdf",          # Alternative relative path
        "./resume.pdf",                       # Local copy
        "/app/resume.pdf"                     # Docker path
    ]
    
    resume_path = None
    for path in possible_paths:
        full_path = Path(path).resolve()
        if full_path.exists():
            resume_path = full_path
            break
    
    if not resume_path:
        raise HTTPException(
            status_code=404,
            detail="Resume file not found. Please contact the site administrator."
        )
    
    # Get filename from environment or use default
    filename = os.getenv("RESUME_FILENAME", "Suryadi_Zhang_Resume.pdf")
    
    return FileResponse(
        path=resume_path,
        filename=filename,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=\"{filename}\""
        }
    )

@router.post("/resume/generate-token")
async def generate_resume_token():
    """Generate a signed token for resume download"""
    
    # Check if signing is enabled
    if not signer.enabled:
        return {"message": "Signed downloads disabled", "token": None}
    
    try:
        token = signer.sign({
            "sub": "resume_download",
            "purpose": "download_resume"
        }, expires_in=300)  # 5 minutes
        
        return {
            "token": token,
            "expires_in": 300,
            "message": "Token generated successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate token: {str(e)}"
        )