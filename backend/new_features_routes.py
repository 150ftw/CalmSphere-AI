from fastapi import APIRouter, HTTPException, Request
from typing import List
from datetime import datetime, timezone, timedelta
from models import (
    Appointment, JournalEntry, CommunityPost, CommunityComment,
    WeeklyInsight, UserGoal
)
from auth_middleware import get_current_user_id
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter()

# Will be set from server.py
db = None

def set_db(database):
    global db
    db = database

# Appointment Routes
@router.post("/appointments/book")
async def book_appointment(appointment_data: dict, request: Request):
    user_id = await get_current_user_id(request)
    
    appointment = Appointment(
        user_id=user_id,
        counselor_name=appointment_data.get('counselor_name'),
        appointment_date=datetime.fromisoformat(appointment_data['appointment_date']),
        appointment_type=appointment_data.get('appointment_type', 'campus'),
        notes=appointment_data.get('notes')
    )
    
    appt_dict = appointment.model_dump()
    appt_dict['appointment_date'] = appt_dict['appointment_date'].isoformat()
    appt_dict['created_at'] = appt_dict['created_at'].isoformat()
    
    # Filter to match Supabase schema (remove reminder_sent)
    allowed_keys = {'id', 'user_id', 'counselor_name', 'appointment_date', 'appointment_type', 'status', 'notes', 'created_at'}
    filtered_appt = {k: v for k, v in appt_dict.items() if k in allowed_keys}
    
    try:
        db.table("appointments").insert(filtered_appt).execute()
    except Exception as e:
        print(f"Error booking appointment: {e}")
        raise HTTPException(status_code=500, detail="Failed to book appointment")
        
    return appointment

@router.get("/appointments")
async def get_appointments(request: Request):
    user_id = await get_current_user_id(request)
    
    try:
        response = db.table("appointments").select("*").eq("user_id", user_id).order("appointment_date", desc=True).limit(100).execute()
        appointments = response.data or []
        
        for appt in appointments:
            if 'id' in appt:
                del appt['id']
            if isinstance(appt.get('appointment_date'), str):
                appt['appointment_date'] = datetime.fromisoformat(appt['appointment_date'])
            if isinstance(appt.get('created_at'), str):
                appt['created_at'] = datetime.fromisoformat(appt['created_at'])
        
        return appointments
    except Exception as e:
        print(f"Error getting appointments: {e}")
        return []

@router.patch("/appointments/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: str,
    status: str,
    request: Request
):
    user_id = await get_current_user_id(request)
    
    try:
        result = db.table("appointments").update({"status": status}).eq("id", appointment_id).eq("user_id", user_id).execute()
        
        # Supabase Python client returns data on success, usually empty list if no match
        # If no matched row was updated, data is empty
        if not result.data:
            raise HTTPException(status_code=404, detail="Appointment not found")
            
        return {"message": "Status updated"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Error updating appointment status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update appointment")

# Journal Routes
@router.post("/journal/entries")
async def create_journal_entry(entry_data: dict, request: Request):
    user_id = await get_current_user_id(request)
    
    # Simple sentiment analysis
    content_lower = entry_data['content'].lower()
    sentiment = "neutral"
    positive_words = ['happy', 'good', 'great', 'better', 'joy', 'grateful', 'peaceful']
    negative_words = ['sad', 'bad', 'worse', 'angry', 'anxious', 'depressed', 'worried']
    
    pos_count = sum(1 for word in positive_words if word in content_lower)
    neg_count = sum(1 for word in negative_words if word in content_lower)
    
    if pos_count > neg_count:
        sentiment = "positive"
    elif neg_count > pos_count:
        sentiment = "negative"
    
    entry = JournalEntry(
        user_id=user_id,
        title=entry_data.get('title'),
        content=entry_data['content'],
        prompt_type=entry_data.get('prompt_type', 'free'),
        sentiment=sentiment,
        tags=entry_data.get('tags', []),
        is_private=entry_data.get('is_private', True)
    )
    
    entry_dict = entry.model_dump()
    entry_dict['created_at'] = entry_dict['created_at'].isoformat()
    
    # Filter to match Supabase schema
    allowed_keys = {'id', 'user_id', 'title', 'content', 'prompt_type', 'sentiment', 'tags', 'is_private', 'created_at'}
    filtered_entry = {k: v for k, v in entry_dict.items() if k in allowed_keys}
    
    try:
        db.table("journal_entries").insert(filtered_entry).execute()
    except Exception as e:
        print(f"Error creating journal entry: {e}")
        raise HTTPException(status_code=500, detail="Failed to create journal entry")
        
    return entry

@router.get("/journal/entries")
async def get_journal_entries(request: Request):
    user_id = await get_current_user_id(request)
    
    try:
        response = db.table("journal_entries").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(100).execute()
        entries = response.data or []
        
        for entry in entries:
            if 'id' in entry:
                del entry['id']
            if isinstance(entry.get('created_at'), str):
                entry['created_at'] = datetime.fromisoformat(entry['created_at'])
        
        return entries
    except Exception as e:
        print(f"Error getting journal entries: {e}")
        return []

@router.get("/journal/prompts")
async def get_journal_prompts(request: Request):
    await get_current_user_id(request)  # Verify auth
    prompts = [
        {"type": "reflection", "prompt": "What are three things that went well today and why?"},
        {"type": "gratitude", "prompt": "What am I grateful for right now?"},
        {"type": "challenge", "prompt": "What challenge am I facing and what resources do I have to overcome it?"},
        {"type": "emotion", "prompt": "What emotions am I feeling and where do I feel them in my body?"},
        {"type": "growth", "prompt": "What did I learn about myself this week?"},
        {"type": "future", "prompt": "What am I looking forward to and how can I prepare for it?"}
    ]
    return prompts

# Community Routes
@router.post("/community/posts")
async def create_community_post(post_data: dict, request: Request):
    user_id = await get_current_user_id(request)
    
    # Generate anonymous username
    username_display = post_data.get('username_display', f"Anonymous_{user_id[:8]}")
    
    post = CommunityPost(
        user_id=user_id,
        username_display=username_display,
        category=post_data['category'],
        title=post_data['title'],
        content=post_data['content'],
        is_anonymous=post_data.get('is_anonymous', True)
    )
    
    post_dict = post.model_dump()
    post_dict['created_at'] = post_dict['created_at'].isoformat()
    
    try:
        db.table("community_posts").insert(post_dict).execute()
    except Exception as e:
        print(f"Error creating post: {e}")
        raise HTTPException(status_code=500, detail="Failed to create post")
        
    return post

@router.get("/community/posts")
async def get_community_posts(category: str = None, request: Request = None):
    if request:
        await get_current_user_id(request)  # Verify auth
    
    try:
        query = db.table("community_posts").select("*")
        if category:
            query = query.eq("category", category)
            
        response = query.order("created_at", desc=True).limit(50).execute()
        posts = response.data or []
        
        for post in posts:
            if 'id' in post:
                del post['id']
            if isinstance(post.get('created_at'), str):
                post['created_at'] = datetime.fromisoformat(post['created_at'])
        
        return posts
    except Exception as e:
        print(f"Error getting posts: {e}")
        return []

@router.post("/community/posts/{post_id}/like")
async def like_post(post_id: str, request: Request):
    await get_current_user_id(request)  # Verify auth
    
    try:
        # First get current likes
        response = db.table("community_posts").select("likes_count").eq("id", post_id).limit(1).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Post not found")
            
        current_likes = response.data[0].get("likes_count", 0)
        
        # Then update with incremented value
        db.table("community_posts").update({"likes_count": current_likes + 1}).eq("id", post_id).execute()
        
        return {"message": "Liked"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Error liking post: {e}")
        raise HTTPException(status_code=500, detail="Failed to like post")

@router.post("/community/posts/{post_id}/comments")
async def add_comment(post_id: str, comment_data: dict, request: Request):
    user_id = await get_current_user_id(request)
    username_display = comment_data.get('username_display', f"Anonymous_{user_id[:8]}")
    
    comment = CommunityComment(
        post_id=post_id,
        user_id=user_id,
        username_display=username_display,
        content=comment_data['content']
    )
    
    comment_dict = comment.model_dump()
    comment_dict['created_at'] = comment_dict['created_at'].isoformat()
    
    # Filter to match Supabase schema (remove likes_count)
    allowed_keys = {'id', 'post_id', 'user_id', 'username_display', 'content', 'created_at'}
    filtered_comment = {k: v for k, v in comment_dict.items() if k in allowed_keys}
    
    try:
        db.table("community_comments").insert(filtered_comment).execute()
        
        # Update comment count
        # Get current count first
        response = db.table("community_posts").select("comments_count").eq("id", post_id).limit(1).execute()
        if response.data:
            current_comments = response.data[0].get("comments_count", 0)
            db.table("community_posts").update({"comments_count": current_comments + 1}).eq("id", post_id).execute()
            
    except Exception as e:
        print(f"Error adding comment: {e}")
        raise HTTPException(status_code=500, detail="Failed to add comment")
    
    return comment

@router.get("/community/posts/{post_id}/comments")
async def get_comments(post_id: str, request: Request):
    await get_current_user_id(request)  # Verify auth
    
    try:
        response = db.table("community_comments").select("*").eq("post_id", post_id).order("created_at", desc=False).limit(100).execute()
        comments = response.data or []
        
        for comment in comments:
            if 'id' in comment:
                del comment['id']
            if isinstance(comment.get('created_at'), str):
                comment['created_at'] = datetime.fromisoformat(comment['created_at'])
        
        return comments
    except Exception as e:
        print(f"Error getting comments: {e}")
        return []

# Insights Routes
@router.get("/insights/weekly")
async def get_weekly_insight(request: Request):
    user_id = await get_current_user_id(request)
    
    # Calculate current week
    now = datetime.now(timezone.utc)
    week_start = now - timedelta(days=now.weekday())
    week_end = week_start + timedelta(days=7)
    
    try:
        response = db.table("mood_entries").select("*").eq("user_id", user_id).gte("timestamp", week_start.isoformat()).lte("timestamp", week_end.isoformat()).execute()
        mood_entries = response.data or []
    except Exception as e:
        print(f"Error getting mood entries for insights: {e}")
        mood_entries = []
    
    if not mood_entries:
        return {"message": "Not enough data for insights"}
    
    # Calculate average mood
    avg_mood = sum(entry['mood_rating'] for entry in mood_entries) / len(mood_entries)
    
    # Determine trend
    if len(mood_entries) >= 3:
        first_half = mood_entries[:len(mood_entries)//2]
        second_half = mood_entries[len(mood_entries)//2:]
        
        avg_first = sum(e['mood_rating'] for e in first_half) / len(first_half)
        avg_second = sum(e['mood_rating'] for e in second_half) / len(second_half)
        
        if avg_second > avg_first + 1:
            trend = "improving"
        elif avg_second < avg_first - 1:
            trend = "declining"
        else:
            trend = "stable"
    else:
        trend = "stable"
    
    # Identify triggers
    all_tags = []
    for entry in mood_entries:
        all_tags.extend(entry.get('tags', []))
    
    tag_counts = {}
    for tag in all_tags:
        tag_counts[tag] = tag_counts.get(tag, 0) + 1
    
    triggers = [tag for tag, count in sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:3]]
    
    # Generate recommendations
    recommendations = []
    if avg_mood < 5:
        recommendations.append("Consider scheduling time for self-care activities")
        recommendations.append("Try a breathing exercise from the self-help modules")
    if trend == "declining":
        recommendations.append("Reach out to a friend or campus counselor for support")
    if 'Exam' in triggers or 'Study' in triggers:
        recommendations.append("Take regular study breaks and practice time management")
    
    insight = WeeklyInsight(
        user_id=user_id,
        week_start=week_start,
        week_end=week_end,
        average_mood=round(avg_mood, 1),
        mood_trend=trend,
        assessment_summary={},
        triggers_identified=triggers,
        recommendations=recommendations
    )
    
    return insight

# Goals Routes
@router.post("/goals")
async def create_goal(goal_data: dict, request: Request):
    user_id = await get_current_user_id(request)
    
    goal = UserGoal(
        user_id=user_id,
        goal_type=goal_data['goal_type'],
        target_value=goal_data['target_value'],
        current_value=goal_data.get('current_value', 0),
        deadline=datetime.fromisoformat(goal_data['deadline']) if goal_data.get('deadline') else None
    )
    
    goal_dict = goal.model_dump()
    goal_dict['created_at'] = goal_dict['created_at'].isoformat()
    if goal_dict.get('deadline'):
        goal_dict['deadline'] = goal_dict['deadline'].isoformat()
    
    # Filter to match Supabase schema
    allowed_keys = {'id', 'user_id', 'goal_type', 'target_value', 'current_value', 'deadline', 'status', 'created_at'}
    filtered_goal = {k: v for k, v in goal_dict.items() if k in allowed_keys}
    
    try:
        db.table("user_goals").insert(filtered_goal).execute()
    except Exception as e:
        print(f"Error creating goal: {e}")
        raise HTTPException(status_code=500, detail="Failed to create goal")
        
    return goal

@router.get("/goals")
async def get_goals(request: Request):
    user_id = await get_current_user_id(request)
    
    try:
        response = db.table("user_goals").select("*").eq("user_id", user_id).eq("status", "active").limit(100).execute()
        goals = response.data or []
        
        for goal in goals:
            if 'id' in goal:
                del goal['id']
            if isinstance(goal.get('deadline'), str):
                goal['deadline'] = datetime.fromisoformat(goal['deadline'])
                
        return goals
    except Exception as e:
        print(f"Error getting goals: {e}")
        return []
