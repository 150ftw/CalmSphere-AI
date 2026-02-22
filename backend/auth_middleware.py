from fastapi import Request, HTTPException
from typing import Optional

async def get_current_user_id(request: Request) -> str:
    """
    Extract user_id from request (for protected routes)
    Imports google_auth to avoid circular dependency
    """
    from google_auth import get_current_user
    
    user = await get_current_user(request, request.headers.get("authorization"))
    
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    return user["user_id"]