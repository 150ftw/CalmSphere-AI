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
    
    await db.appointments.insert_one(appt_dict)
    return appointment

@router.get("/appointments")
async def get_appointments(request: Request):
    user_id = await get_current_user_id(request)
    appointments = await db.appointments.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("appointment_date", -1).to_list(100)
    
    for appt in appointments:
        if isinstance(appt.get('appointment_date'), str):
            appt['appointment_date'] = datetime.fromisoformat(appt['appointment_date'])
        if isinstance(appt.get('created_at'), str):
            appt['created_at'] = datetime.fromisoformat(appt['created_at'])
    
    return appointments

@router.patch("/appointments/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: str,
    status: str,
    request: Request
):
    user_id = await get_current_user_id(request)
    result = await db.appointments.update_one(
        {"id": appointment_id, "user_id": user_id},
        {"$set": {"status": status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    return {"message": "Status updated"}

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
    
    await db.journal_entries.insert_one(entry_dict)
    return entry

@router.get("/journal/entries")
async def get_journal_entries(request: Request):
    user_id = await get_current_user_id(request)
    entries = await db.journal_entries.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    for entry in entries:
        if isinstance(entry.get('created_at'), str):
            entry['created_at'] = datetime.fromisoformat(entry['created_at'])
    
    return entries

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
    
    await db.community_posts.insert_one(post_dict)
    return post

@router.get("/community/posts")
async def get_community_posts(category: str = None, request: Request = None):
    if request:
        await get_current_user_id(request)  # Verify auth
    
    query = {}
    if category:
        query['category'] = category
    
    posts = await db.community_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(50)
    
    for post in posts:
        if isinstance(post.get('created_at'), str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
    
    return posts

@router.post("/community/posts/{post_id}/like")
async def like_post(post_id: str, request: Request):
    await get_current_user_id(request)  # Verify auth
    result = await db.community_posts.update_one(
        {"id": post_id},
        {"$inc": {"likes_count": 1}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {"message": "Liked"}

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
    
    await db.community_comments.insert_one(comment_dict)
    
    # Update comment count
    await db.community_posts.update_one(
        {"id": post_id},
        {"$inc": {"comments_count": 1}}
    )
    
    return comment

@router.get("/community/posts/{post_id}/comments")
async def get_comments(post_id: str, request: Request):
    await get_current_user_id(request)  # Verify auth
    comments = await db.community_comments.find(
        {"post_id": post_id},
        {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    
    for comment in comments:
        if isinstance(comment.get('created_at'), str):
            comment['created_at'] = datetime.fromisoformat(comment['created_at'])
    
    return comments

# Insights Routes
@router.get("/insights/weekly")
async def get_weekly_insight(request: Request):
    user_id = await get_current_user_id(request)
    
    # Calculate current week
    now = datetime.now(timezone.utc)
    week_start = now - timedelta(days=now.weekday())
    week_end = week_start + timedelta(days=7)
    
    # Get mood data for the week
    mood_entries = await db.mood_entries.find(
        {
            "user_id": user_id,
            "timestamp": {"$gte": week_start.isoformat(), "$lte": week_end.isoformat()}
        },
        {"_id": 0}
    ).to_list(100)
    
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
    
    await db.user_goals.insert_one(goal_dict)
    return goal

@router.get("/goals")
async def get_goals(request: Request):
    user_id = await get_current_user_id(request)
    goals = await db.user_goals.find(
        {"user_id": user_id, "status": "active"},
        {"_id": 0}
    ).to_list(100)
    
    return goals
