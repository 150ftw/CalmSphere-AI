from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
import uuid
from datetime import datetime, timezone

from auth import hash_password, verify_password, create_access_token, verify_token
from models import User
from fastapi import Header
from typing import Optional
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter()
db = None
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')

def set_db(database_client):
    global db
    db = database_client

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    credential: str

@router.post("/register")
async def register(user_data: UserRegister):
    # Check if user already exists
    try:
        existing_user = db.table("users").select("*").eq("email", user_data.email).execute()
        if existing_user.data and len(existing_user.data) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        new_user_id = f"user_{uuid.uuid4().hex[:12]}"
        hashed_pwd = hash_password(user_data.password)
        
        new_user = {
            "user_id": new_user_id,
            "email": user_data.email,
            "name": user_data.name,
            "password_hash": hashed_pwd,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        db.table("users").insert(new_user).execute()
        
        # Create access token
        access_token = create_access_token(data={"sub": new_user_id, "email": user_data.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": new_user_id,
                "email": user_data.email,
                "name": user_data.name
            }
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/login")
async def login(credentials: UserLogin):
    try:
        # Find user
        response = db.table("users").select("*").eq("email", credentials.email).execute()
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = response.data[0]
        
        # Verify password
        if not user.get("password_hash") or not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": user["user_id"], "email": user["email"]})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user["user_id"],
                "email": user["email"],
                "name": user.get("name")
            }
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@router.post("/google")
async def google_auth(auth_data: GoogleAuthRequest):
    try:
        # Verify the ID Token from Google
        idinfo = id_token.verify_oauth2_token(
            auth_data.credential, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        email = idinfo['email']
        name = idinfo.get('name', email.split('@')[0])
        picture = idinfo.get('picture')
        
        # Check if user exists
        response = db.table("users").select("*").eq("email", email).execute()
        user = response.data[0] if response.data and len(response.data) > 0 else None
        
        if user:
            user_id = user["user_id"]
        else:
            # Create new user for first-time Google sign-in
            user_id = f"user_{uuid.uuid4().hex[:12]}"
            new_user = {
                "user_id": user_id,
                "email": email,
                "name": name,
                "picture": picture,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            db.table("users").insert(new_user).execute()
            
        # Create sovereign JWT
        access_token = create_access_token(data={"sub": user_id, "email": email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user_id,
                "email": email,
                "name": name,
                "picture": picture
            }
        }
    except Exception as e:
        print(f"Direct Google Auth error: {e}")
        raise HTTPException(status_code=401, detail="Invalid Google credentials")

@router.get("/me")
async def get_me(token_payload: dict = Depends(verify_token)):
    user_id = token_payload.get("sub")
    try:
        response = db.table("users").select("*").eq("user_id", user_id).limit(1).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = response.data[0]
        if 'id' in user:
            del user['id']
        if 'password_hash' in user:
            del user['password_hash']
            
        return user
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Auth me error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user data")

@router.post("/logout")
async def logout():
    # For JWT, logout is primarily handled by the client clearing the token.
    # In more complex setups, we could add a blacklist here.
    return {"message": "Logged out successfully"}
