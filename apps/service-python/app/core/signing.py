import hmac
import hashlib
import json
import time
import os
from typing import Dict, Any, Optional
from fastapi import HTTPException

class TokenSigner:
    def __init__(self, secret_key: Optional[str] = None):
        self.secret_key = secret_key or os.getenv("RESUME_SIGNING_SECRET")
        if not self.secret_key:
            print("Warning: RESUME_SIGNING_SECRET not configured. Signed downloads disabled.")
            self.enabled = False
        else:
            self.enabled = True
    
    def sign(self, payload: Dict[str, Any], expires_in: int = 3600) -> str:
        """Sign a payload with expiration time
        
        Args:
            payload: Data to sign
            expires_in: Expiration time in seconds (default 1 hour)
        
        Returns:
            Signed token string
        """
        if not self.enabled:
            raise HTTPException(status_code=500, detail="Token signing not configured")
        
        # Add expiration timestamp
        payload_with_exp = {
            **payload,
            "exp": int(time.time()) + expires_in,
            "iat": int(time.time())
        }
        
        # Serialize payload
        payload_json = json.dumps(payload_with_exp, sort_keys=True)
        
        # Create HMAC signature
        signature = hmac.new(
            self.secret_key.encode(),
            payload_json.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Encode payload and signature (simple base64-like encoding)
        import base64
        token_data = base64.b64encode(
            json.dumps({"payload": payload_with_exp, "signature": signature}).encode()
        ).decode()
        
        return token_data
    
    def verify(self, token: str) -> Dict[str, Any]:
        """Verify and decode a signed token
        
        Args:
            token: Signed token string
        
        Returns:
            Decoded payload if valid
        
        Raises:
            HTTPException: If token is invalid or expired
        """
        if not self.enabled:
            raise HTTPException(status_code=500, detail="Token signing not configured")
        
        try:
            import base64
            # Decode token
            token_data = json.loads(base64.b64decode(token.encode()).decode())
            payload = token_data["payload"]
            provided_signature = token_data["signature"]
            
            # Recreate signature
            payload_json = json.dumps(payload, sort_keys=True)
            expected_signature = hmac.new(
                self.secret_key.encode(),
                payload_json.encode(),
                hashlib.sha256
            ).hexdigest()
            
            # Verify signature
            if not hmac.compare_digest(provided_signature, expected_signature):
                raise HTTPException(status_code=403, detail="Invalid token signature")
            
            # Check expiration
            if payload.get("exp", 0) < int(time.time()):
                raise HTTPException(status_code=403, detail="Token expired")
            
            return payload
            
        except json.JSONDecodeError:
            raise HTTPException(status_code=403, detail="Invalid token format")
        except Exception as e:
            raise HTTPException(status_code=403, detail=f"Token verification failed: {str(e)}")

# Global signer instance
signer = TokenSigner()