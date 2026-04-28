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
    
    try:
        # Find session in database
        response = db.table("user_sessions").select("*").eq("session_token", session_token).limit(1).execute()
        if not response.data:
            return None
            
        session_doc = response.data[0]
        
        # Check expiry
        expires_at = session_doc["expires_at"]
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at)
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        
        if expires_at < datetime.now(timezone.utc):
            # Session expired, delete it
            db.table("user_sessions").delete().eq("session_token", session_token).execute()
            return None
        
        # Get user
        user_id = session_doc.get("user_id")
        user_response = db.table("users").select("*").eq("user_id", user_id).limit(1).execute()
        
        # Fallback for old records where id was used instead of user_id
        if not user_response.data:
            user_response = db.table("users").select("*").eq("id", user_id).limit(1).execute()
            
        if not user_response.data:
            return None
            
        user_doc = user_response.data[0]
        
        if 'id' in user_doc and "user_id" not in user_doc:
            user_doc["user_id"] = user_doc["id"]
            
        if 'id' in user_doc:
            del user_doc['id']
            
        return user_doc
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        return None

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
            raise HTTPException(status_code=400, detail="Incomplete auth data from auth service")
        
        logger.info(f"Processing session for email: {email}")
        
        try:
            # Check if user exists
            user_resp = db.table("users").select("*").eq("email", email).limit(1).execute()
            existing_user = user_resp.data[0] if user_resp.data else None
            
            if existing_user:
                logger.info(f"Found existing user: {email}")
                # Get user_id - handle both old format (id) and new format (user_id)
                user_id = existing_user.get("user_id") or existing_user.get("id")
                
                if not user_id:
                    # Generate new user_id if neither exists
                    user_id = f"user_{uuid.uuid4().hex[:12]}"
                
                # Update existing user
                db.table("users").update({
                    "user_id": user_id,
                    "name": name,
                    "picture": picture
                }).eq("email", email).execute()
            else:
                logger.info(f"Creating new user: {email}")
                # Create new user
                user = User(email=email, name=name, picture=picture)
                user_dict = user.model_dump()
                # Pydantic v2 model_dump can return datetimes, Supabase handles them or we convert
                user_dict["created_at"] = user_dict["created_at"].isoformat()
                db.table("users").insert(user_dict).execute()
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
            
            logger.info(f"Establishing session for user_id: {user_id}")
            # Delete old sessions for this user
            db.table("user_sessions").delete().eq("user_id", user_id).execute()
            
            # Insert new session
            db.table("user_sessions").insert(session_dict).execute()
            
            # Get updated user data
            user_doc_resp = db.table("users").select("*").eq("email", email).limit(1).execute()
            user_doc = user_doc_resp.data[0] if user_doc_resp.data else {}
            if 'id' in user_doc:
                del user_doc['id']
            
            return {
                "session_token": session_token,
                "user": user_doc
            }
        except Exception as db_err:
            logger.error(f"Database error during session exchange: {db_err}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(db_err)}")
        
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
        try:
            db.table("user_sessions").delete().eq("session_token", session_token).execute()
        except Exception as e:
            logger.error(f"Error logging out: {e}")
    
    # Clear cookie
    response.delete_cookie("session_token", path="/")
    
    return {"message": "Logged out successfully"}