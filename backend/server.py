from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

# CRITICAL: Load environment variables BEFORE importing local modules
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from models import (
    UserProfile, ChatMessage, ChatSession,
    AssessmentResult, MoodEntry, SelfHelpModule, ConfigSettings,
    SendMessageRequest, SubmitAssessmentRequest,
    MoodEntryRequest
)
from risk_engine import detect_risk_level, get_crisis_response, get_high_risk_response
from content_selector import (
    get_assessment_questions, calculate_assessment_score,
    get_self_help_modules, select_modules_for_user
)

from emergentintegrations.llm.chat import LlmChat, UserMessage as LlmUserMessage
import new_features_routes
import google_auth
from auth_middleware import get_current_user_id

from supabase import create_client, Client

# Supabase connection
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')

if not supabase_url or not supabase_key:
    # Fallback placeholders if env vars are missing to prevent crash on import
    supabase_url = "https://placeholder.supabase.co"
    supabase_key = "placeholder_key"
    
supabase: Client = create_client(supabase_url, supabase_key)
db = supabase  # Alias for easier refactoring

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# LLM System message
SYSTEM_MESSAGE = """You are CalmSphere AI, a supportive mental health companion for college students. Your role is to:

1. Listen empathetically and without judgment
2. Validate feelings and experiences
3. Ask clarifying questions to understand their situation better
4. Provide supportive, evidence-based coping strategies when appropriate
5. Be warm, genuine, and human in your responses
6. Keep responses concise (2-4 sentences usually)
7. NEVER diagnose mental health conditions
8. NEVER recommend medications
9. NEVER claim to be a therapist or doctor
10. Encourage professional help when appropriate
11. Focus on self-help, psycho-education, and healthy coping strategies

Remember: You are a supportive tool, not a replacement for professional mental health care. Be caring, but maintain appropriate boundaries."""

# Helper functions
async def get_config() -> dict:
    try:
        response = supabase.table("config_settings").select("*").limit(1).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
    except Exception as e:
        logger.error(f"Error getting config: {e}")
        
    return {
        "crisis_hotline": "1800-599-0019",  # KIRAN Mental Health Helpline
        "campus_counselor_phone": "Contact your campus health center",
        "campus_counselor_email": "Available through campus resources",
        "risk_threshold_high": 15,
        "risk_threshold_medium": 10
    }

async def get_latest_scores(user_id: str) -> dict:
    scores = {}
    for assessment_type in ['phq9', 'gad7', 'stress']:
        try:
            response = supabase.table("assessment_results").select("total_score").eq("user_id", user_id).eq("assessment_type", assessment_type).order("timestamp", desc=True).limit(1).execute()
            if response.data and len(response.data) > 0:
                scores[assessment_type] = response.data[0]['total_score']
        except Exception as e:
            logger.error(f"Error getting scores for {assessment_type}: {e}")
            
    return scores

# Include Google Auth routes
google_auth.set_db(db)
app.include_router(google_auth.router, prefix="/api/auth", tags=["auth"])

# Profile Routes
@api_router.post("/profile/onboarding")
async def complete_onboarding(profile_data: dict, request: Request):
    user_id = await get_current_user_id(request)
    
    profile = UserProfile(
        user_id=user_id,
        year=profile_data.get('year'),
        branch=profile_data.get('branch'),
        concerns=profile_data.get('concerns', []),
        consent_given=profile_data.get('consent_given', False),
        timezone=profile_data.get('timezone'),
        onboarding_completed=True
    )
    
    profile_dict = profile.model_dump()
    profile_dict['created_at'] = profile_dict['created_at'].isoformat()
    
    try:
        # Check if user already exists
        response = supabase.table("user_profiles").select("*").eq("user_id", user_id).execute()
        if response.data and len(response.data) > 0:
            supabase.table("user_profiles").update(profile_dict).eq("user_id", user_id).execute()
        else:
            supabase.table("user_profiles").insert(profile_dict).execute()
    except Exception as e:
        logger.error(f"Error saving profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to save profile")
        
    return {"message": "Onboarding completed", "profile": profile}

@api_router.get("/profile")
async def get_profile(request: Request):
    user_id = await get_current_user_id(request)
    try:
        response = supabase.table("user_profiles").select("*").eq("user_id", user_id).limit(1).execute()
        if response.data and len(response.data) > 0:
            # Remove id column if it exists to match old behavior
            profile = response.data[0]
            if 'id' in profile:
                del profile['id']
            return profile
    except Exception as e:
        logger.error(f"Error getting profile: {e}")
    return None

# Chat Routes
@api_router.post("/chat/session/create")
async def create_chat_session(request: Request):
    user_id = await get_current_user_id(request)
    
    session = ChatSession(user_id=user_id)
    session_dict = session.model_dump()
    
    # Filter to match Supabase schema
    allowed_keys = {'id', 'user_id', 'created_at', 'updated_at'}
    filtered_session = {k: v for k, v in session_dict.items() if k in allowed_keys}
    
    filtered_session['created_at'] = filtered_session['created_at'].isoformat()
    filtered_session['updated_at'] = filtered_session['updated_at'].isoformat()
    
    try:
        supabase.table("chat_sessions").insert(filtered_session).execute()
    except Exception as e:
        logger.error(f"Error creating chat session: {e}")
        raise HTTPException(status_code=500, detail="Failed to create chat session")
    
    return session

@api_router.get("/chat/sessions")
async def get_chat_sessions(request: Request):
    user_id = await get_current_user_id(request)
    try:
        response = supabase.table("chat_sessions").select("*").eq("user_id", user_id).order("updated_at", desc=True).limit(50).execute()
        sessions = response.data or []
        
        for session in sessions:
            if 'id' in session:
                del session['id']
            if isinstance(session.get('created_at'), str):
                session['created_at'] = datetime.fromisoformat(session['created_at'])
            if isinstance(session.get('updated_at'), str):
                session['updated_at'] = datetime.fromisoformat(session['updated_at'])
        
        return sessions
    except Exception as e:
        logger.error(f"Error getting chat sessions: {e}")
        return []

@api_router.get("/chat/session/{session_id}/messages")
async def get_chat_messages(session_id: str, request: Request):
    await get_current_user_id(request)  # Verify user is authenticated
    try:
        response = supabase.table("chat_messages").select("*").eq("session_id", session_id).order("timestamp", desc=False).limit(1000).execute()
        messages = response.data or []
        
        for msg in messages:
            if 'id' in msg:
                del msg['id']
            if isinstance(msg.get('timestamp'), str):
                msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
        
        return messages
    except Exception as e:
        logger.error(f"Error getting chat messages: {e}")
        return []

@api_router.post("/chat/send")
async def send_message(request_data: SendMessageRequest, request: Request):
    user_id = await get_current_user_id(request)
    
    # Detect risk
    risk_level, risk_score = detect_risk_level(request_data.message)
    
    # Save user message
    user_message = ChatMessage(
        session_id=request_data.session_id,
        user_id=user_id,
        role="user",
        content=request_data.message,
        risk_level=risk_level
    )
    
    user_msg_dict = user_message.model_dump()
    user_msg_dict['timestamp'] = user_msg_dict['timestamp'].isoformat()
    
    # Filter to match Supabase schema
    msg_allowed_keys = {'id', 'session_id', 'user_id', 'role', 'content', 'risk_level', 'timestamp'}
    filtered_user_msg = {k: v for k, v in user_msg_dict.items() if k in msg_allowed_keys}
    
    try:
        supabase.table("chat_messages").insert(filtered_user_msg).execute()
        
        # Update session timestamp
        supabase.table("chat_sessions").update(
            {"updated_at": datetime.now(timezone.utc).isoformat()}
        ).eq("id", request_data.session_id).execute()
    except Exception as e:
        logger.error(f"Error saving user message or updating session: {e}")
    
    # Handle crisis
    if risk_level == 'crisis':
        config = await get_config()
        crisis_msg = get_crisis_response(config)
        
        assistant_message = ChatMessage(
            session_id=request_data.session_id,
            user_id=user_id,
            role="assistant",
            content=crisis_msg,
            risk_level="crisis"
        )
        
        assist_msg_dict = assistant_message.model_dump()
        assist_msg_dict['timestamp'] = assist_msg_dict['timestamp'].isoformat()
        
        # Filter to match Supabase schema
        msg_allowed_keys = {'id', 'session_id', 'user_id', 'role', 'content', 'risk_level', 'timestamp'}
        filtered_assist_msg = {k: v for k, v in assist_msg_dict.items() if k in msg_allowed_keys}
        
        try:
            supabase.table("chat_messages").insert(filtered_assist_msg).execute()
        except Exception as e:
            logger.error(f"Error saving crisis message: {e}")
            
        return {
            "message": assistant_message,
            "risk_level": "crisis",
            "show_crisis_resources": True
        }
    
    # Get conversation history for context to LLM (optional, but good for context windows)
    # history = supabase.table("chat_messages").select("role, content").eq("session_id", request_data.session_id).order("timestamp", desc=True).limit(20).execute()
    
    # Call LLM
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=api_key,
            session_id=request_data.session_id,
            system_message=SYSTEM_MESSAGE
        ).with_model("openai", "gpt-5.2")
        
        llm_message = LlmUserMessage(text=request_data.message)
        response = await chat.send_message(llm_message)
        
        # Add high risk note if needed
        if risk_level == 'high':
            response += "\n\n" + get_high_risk_response()
        
    except Exception as e:
        logger.error(f"LLM error: {e}")
        response = "I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please reach out to a crisis hotline or emergency services immediately."
    
    # Save assistant response
    assistant_message = ChatMessage(
        session_id=request_data.session_id,
        user_id=user_id,
        role="assistant",
        content=response,
        risk_level=risk_level
    )
    
    assist_msg_dict = assistant_message.model_dump()
    assist_msg_dict['timestamp'] = assist_msg_dict['timestamp'].isoformat()
    
    # Filter to match Supabase schema
    msg_allowed_keys = {'id', 'session_id', 'user_id', 'role', 'content', 'risk_level', 'timestamp'}
    filtered_assist_msg = {k: v for k, v in assist_msg_dict.items() if k in msg_allowed_keys}
    
    try:
        supabase.table("chat_messages").insert(filtered_assist_msg).execute()
    except Exception as e:
        logger.error(f"Error saving assistant message: {e}")

    
    # Get recommended modules
    latest_scores = await get_latest_scores(user_id)
    modules = select_modules_for_user(latest_scores, "stable", risk_level)
    
    return {
        "message": assistant_message,
        "risk_level": risk_level,
        "recommended_modules": modules[:2] if modules else [],
        "show_crisis_resources": risk_level in ['crisis', 'high']
    }

# Assessment Routes
@api_router.get("/assessment/questions/{assessment_type}")
async def get_questions(assessment_type: str, request: Request):
    await get_current_user_id(request)  # Verify user is authenticated
    questions = get_assessment_questions(assessment_type)
    if not questions:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {"assessment_type": assessment_type, "questions": questions}

@api_router.post("/assessment/submit")
async def submit_assessment(request_data: SubmitAssessmentRequest, request: Request):
    user_id = await get_current_user_id(request)
    
    total_score, severity = calculate_assessment_score(request_data.assessment_type, request_data.responses)
    
    result = AssessmentResult(
        user_id=user_id,
        assessment_type=request_data.assessment_type,
        responses=request_data.responses,
        total_score=total_score,
        severity=severity
    )
    
    result_dict = result.model_dump()
    result_dict['timestamp'] = result_dict['timestamp'].isoformat()
    try:
        supabase.table("assessment_results").insert(result_dict).execute()
    except Exception as e:
        logger.error(f"Error saving assessment: {e}")
        raise HTTPException(status_code=500, detail="Failed to save assessment")
    
    return result

@api_router.get("/assessment/history/{assessment_type}")
async def get_assessment_history(assessment_type: str, request: Request):
    user_id = await get_current_user_id(request)
    
    try:
        response = supabase.table("assessment_results").select("*").eq("user_id", user_id).eq("assessment_type", assessment_type).order("timestamp", desc=True).limit(50).execute()
        results = response.data or []
        
        for result in results:
            if 'id' in result:
                del result['id']
            if isinstance(result.get('timestamp'), str):
                result['timestamp'] = datetime.fromisoformat(result['timestamp'])
        
        return results
    except Exception as e:
        logger.error(f"Error getting assessment history: {e}")
        return []

# Mood Routes
@api_router.post("/mood/log")
async def log_mood(request_data: MoodEntryRequest, request: Request):
    user_id = await get_current_user_id(request)
    
    entry = MoodEntry(
        user_id=user_id,
        mood_rating=request_data.mood_rating,
        tags=request_data.tags,
        note=request_data.note
    )
    
    entry_dict = entry.model_dump()
    entry_dict['timestamp'] = entry_dict['timestamp'].isoformat()
    try:
        supabase.table("mood_entries").insert(entry_dict).execute()
    except Exception as e:
        logger.error(f"Error saving mood log: {e}")
        raise HTTPException(status_code=500, detail="Failed to save mood log")
    
    return entry

@api_router.get("/mood/history")
async def get_mood_history(request: Request):
    user_id = await get_current_user_id(request)
    
    try:
        response = supabase.table("mood_entries").select("*").eq("user_id", user_id).order("timestamp", desc=True).limit(100).execute()
        entries = response.data or []
        
        for entry in entries:
            if 'id' in entry:
                del entry['id']
            if isinstance(entry.get('timestamp'), str):
                entry['timestamp'] = datetime.fromisoformat(entry['timestamp'])
        
        return entries
    except Exception as e:
        logger.error(f"Error getting mood history: {e}")
        return []

# Self-help modules
@api_router.get("/modules")
async def get_modules(request: Request):
    await get_current_user_id(request)  # Verify user is authenticated
    return get_self_help_modules()

# Dashboard data
@api_router.get("/dashboard/student")
async def get_student_dashboard(request: Request):
    user_id = await get_current_user_id(request)
    
    # Get latest mood
    latest_mood = None
    try:
        mood_response = supabase.table("mood_entries").select("*").eq("user_id", user_id).order("timestamp", desc=True).limit(1).execute()
        if mood_response.data and len(mood_response.data) > 0:
            latest_mood = mood_response.data[0]
            if 'id' in latest_mood:
                del latest_mood['id']
    except Exception as e:
        logger.error(f"Error getting latest mood: {e}")
    
    # Get latest scores
    latest_scores = await get_latest_scores(user_id)
    
    # Get recent sessions
    recent_sessions = []
    try:
        session_response = supabase.table("chat_sessions").select("*").eq("user_id", user_id).order("updated_at", desc=True).limit(5).execute()
        raw_sessions = session_response.data or []
        for session in raw_sessions:
            if 'id' in session:
                del session['id']
            recent_sessions.append(session)
    except Exception as e:
        logger.error(f"Error getting recent sessions: {e}")
        
    return {
        "latest_mood": latest_mood,
        "latest_scores": latest_scores,
        "recent_sessions": recent_sessions
    }

# Admin Analytics Routes
@api_router.get("/admin/analytics")
async def get_analytics(request: Request):
    user_id = await get_current_user_id(request)
    # Note: Role-based access can be implemented by checking user's role in DB
    
    # Supabase doesn't easily support dynamic grouping via the REST API for generic aggregations
    # like MongoDB's pipeline. To keep this migration simple without requiring SQL RPC functions,
    # we fetch the severities and do the grouping in Python.
    
    phq9_dist = []
    gad7_dist = []
    total_users = 0
    total_sessions = 0
    total_assessments = 0
    
    try:
        # Aggregate PHQ-9 scores
        phq9_response = supabase.table("assessment_results").select("severity").eq("assessment_type", "phq9").execute()
        if phq9_response.data:
            counts = {}
            for item in phq9_response.data:
                sev = item.get("severity", "unknown")
                counts[sev] = counts.get(sev, 0) + 1
            phq9_dist = [{"_id": k, "count": v} for k, v in counts.items()]
            
        # Aggregate GAD-7 scores
        gad7_response = supabase.table("assessment_results").select("severity").eq("assessment_type", "gad7").execute()
        if gad7_response.data:
            counts = {}
            for item in gad7_response.data:
                sev = item.get("severity", "unknown")
                counts[sev] = counts.get(sev, 0) + 1
            gad7_dist = [{"_id": k, "count": v} for k, v in counts.items()]
            
        # Counts (Supabase supports count='exact' in the client)
        user_count_resp = supabase.table("users").select("*", count="exact").limit(1).execute()
        total_users = user_count_resp.count if hasattr(user_count_resp, 'count') and user_count_resp.count is not None else len(supabase.table("users").select("user_id").execute().data or [])
        
        session_count_resp = supabase.table("chat_sessions").select("*", count="exact").limit(1).execute()
        total_sessions = session_count_resp.count if hasattr(session_count_resp, 'count') and session_count_resp.count is not None else len(supabase.table("chat_sessions").select("session_id").execute().data or [])
        
        assess_count_resp = supabase.table("assessment_results").select("*", count="exact").limit(1).execute()
        total_assessments = assess_count_resp.count if hasattr(assess_count_resp, 'count') and assess_count_resp.count is not None else len(supabase.table("assessment_results").select("id").execute().data or [])
        
    except Exception as e:
        logger.error(f"Error getting analytics: {e}")
    
    return {
        "phq9_distribution": phq9_dist,
        "gad7_distribution": gad7_dist,
        "total_users": total_users,
        "total_sessions": total_sessions,
        "total_assessments": total_assessments
    }

@api_router.get("/admin/config")
async def get_admin_config(request: Request):
    await get_current_user_id(request)  # Verify user is authenticated
    return await get_config()

@api_router.post("/admin/config")
async def update_config(config_data: dict, request: Request):
    await get_current_user_id(request)  # Verify user is authenticated
    
    config_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    try:
        # Supabase doesn't have a simple delete_all, but we can delete where id is not null
        supabase.table("config_settings").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        supabase.table("config_settings").insert(config_data).execute()
    except Exception as e:
        logger.error(f"Error updating config: {e}")
        raise HTTPException(status_code=500, detail="Failed to update config")
    
    return {"message": "Config updated"}

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "CalmSphere AI API", "status": "operational"}

# Include new features routes
new_features_routes.set_db(db)
app.include_router(new_features_routes.router, prefix="/api")

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ] + os.environ.get('CORS_ORIGINS', '').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    pass # Supabase REST client doesn't require explicit shutdown like Motor