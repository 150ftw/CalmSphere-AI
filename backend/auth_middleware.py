from fastapi import Request, HTTPException, Depends
from typing import Optional
from auth import verify_token, security

async def get_current_user_id(request: Request) -> str:
    """
    Extract user_id from JWT token for protected routes.
    Now completely independent of external auth services.
    """
    # Use verify_token logic to decode the JWT
    # We manualy extract to stay compatible with existing function signature
    auth_header = request.headers.get("authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        # Extract token from Bearer header
        token = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else auth_header
        from auth import jwt, JWT_SECRET, JWT_ALGORITHM
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
            
        return user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")