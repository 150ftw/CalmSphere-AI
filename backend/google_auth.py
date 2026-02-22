from fastapi import APIRouter, HTTPException, Response, Request, Header
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta, timezone
from typing import Optional
import httpx
import logging
import uuid
from models import User, UserSession

logger = logging.getLogger(__name__)

router = APIRouter()

# Will be set from server.py
db = None

def set_db(database):
    global db
    db = database

EMERGENT_AUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"

# Helper function to get session from cookie or header
async def get_current_user(request: Request, authorization: Optional[str] = Header(None)) -> Optional[dict]:
    """
    Get user from session_token (cookie first, then Authorization header)
    """
    session_token = None
    
    # Try cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token and authorization:
        if authorization.startswith("Bearer "):
            session_token = authorization[7:]
        else:
            session_token = authorization
    
    if not session_token:
        return None
    
    # Find session in database
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        return None
    
    # Check expiry
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        # Session expired, delete it
        await db.user_sessions.delete_one({"session_token": session_token})
        return None
    
    # Get user - try user_id first, then fall back to id for old users
    user_id = session_doc.get("user_id")
    user_doc = await db.users.find_one(
        {"$or": [{"user_id": user_id}, {"id": user_id}]},
        {"_id": 0}
    )
    
    if not user_doc:
        return None
    
    # Ensure user_id is in the response
    if "user_id" not in user_doc and "id" in user_doc:
        user_doc["user_id"] = user_doc["id"]
    
    return user_doc

@router.post("/session")
async def exchange_session(x_session_id: str = Header(..., alias="X-Session-ID")):
    """
    Exchange session_id from Emergent Auth for user data
    """
    try:
        # Call Emergent Auth API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                EMERGENT_AUTH_URL,
                headers={"X-Session-ID": x_session_id},
                timeout=10.0
            )
        
        if response.status_code != 200:
            logger.error(f"Auth API returned status {response.status_code}: {response.text}")
            raise HTTPException(status_code=401, detail="Invalid session_id")
        
        auth_data = response.json()
        logger.info(f"Auth data received: {auth_data}")
        
        # Extract user data
        email = auth_data.get("email")
        name = auth_data.get("name", email.split("@")[0] if email else "User")
        picture = auth_data.get("picture")
        session_token = auth_data.get("session_token")
        
        if not all([email, session_token]):
            logger.error(f"Incomplete auth data: email={email}, session_token={bool(session_token)}")
            raise HTTPException(status_code=400, detail="Incomplete auth data")
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": email}, {"_id": 0})
        
        if existing_user:
            # Get user_id - handle both old format (id) and new format (user_id)
            user_id = existing_user.get("user_id") or existing_user.get("id")
            
            if not user_id:
                # Generate new user_id if neither exists
                user_id = f"user_{uuid.uuid4().hex[:12]}"
            
            # Update existing user with new format
            await db.users.update_one(
                {"email": email},
                {"$set": {
                    "user_id": user_id,
                    "name": name,
                    "picture": picture
                }}
            )
        else:
            # Create new user
            user = User(email=email, name=name, picture=picture)
            user_dict = user.model_dump()
            user_dict["created_at"] = user_dict["created_at"].isoformat()
            await db.users.insert_one(user_dict)
            user_id = user.user_id
        
        # Create session
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        session = UserSession(
            user_id=user_id,
            session_token=session_token,
            expires_at=expires_at
        )
        
        session_dict = session.model_dump()
        session_dict["expires_at"] = session_dict["expires_at"].isoformat()
        session_dict["created_at"] = session_dict["created_at"].isoformat()
        
        # Delete old sessions for this user
        await db.user_sessions.delete_many({"user_id": user_id})
        
        # Insert new session
        await db.user_sessions.insert_one(session_dict)
        
        # Get updated user data
        user_doc = await db.users.find_one({"email": email}, {"_id": 0})
        
        return {
            "session_token": session_token,
            "user": user_doc
        }
        
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Auth service timeout")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Session exchange error: {e}")
        raise HTTPException(status_code=500, detail="Session exchange failed")

@router.get("/me")
async def get_me(request: Request, authorization: Optional[str] = Header(None)):
    """
    Get current user from session_token
    """
    user = await get_current_user(request, authorization)
    
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return user

@router.post("/logout")
async def logout(request: Request, response: Response):
    """
    Logout user by deleting session
    """
    session_token = request.cookies.get("session_token")
    
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    
    # Clear cookie
    response.delete_cookie("session_token", path="/")
    
    return {"message": "Logged out successfully"}