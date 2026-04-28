from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str = Field(default_factory=lambda: f"user_{uuid.uuid4().hex[:12]}")
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    year: Optional[str] = None
    branch: Optional[str] = None
    concerns: List[str] = []
    consent_given: bool = False
    timezone: Optional[str] = None
    onboarding_completed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: str
    role: str
    content: str
    risk_level: Optional[str] = None
    risk_score: Optional[int] = None
    sentiment: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: Optional[str] = "New Conversation"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AssessmentResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    assessment_type: str
    responses: dict
    total_score: int
    severity: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MoodEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    mood_rating: int
    tags: List[str] = []
    note: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SelfHelpModule(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    module_type: str
    description: str
    content: dict
    tags: List[str] = []
    difficulty: str = "beginner"

class ConfigSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    crisis_hotline: str = "1800-599-0019"
    campus_counselor_phone: Optional[str] = None
    campus_counselor_email: Optional[str] = None
    risk_threshold_high: int = 15
    risk_threshold_medium: int = 10
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SendMessageRequest(BaseModel):
    session_id: str
    message: str

class SubmitAssessmentRequest(BaseModel):
    assessment_type: str
    responses: dict

class MoodEntryRequest(BaseModel):
    mood_rating: int
    tags: List[str] = []
    note: Optional[str] = None

# Enhanced Features Models

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    counselor_name: Optional[str] = None
    appointment_date: datetime
    appointment_type: str
    status: str = "scheduled"
    notes: Optional[str] = None
    reminder_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class JournalEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: Optional[str] = None
    content: str
    prompt_type: Optional[str] = None
    sentiment: Optional[str] = None
    tags: List[str] = []
    is_private: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommunityPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    username_display: str
    category: str
    title: str
    content: str
    is_anonymous: bool = True
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommunityComment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    post_id: str
    user_id: str
    username_display: str
    content: str
    likes_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WeeklyInsight(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    week_start: datetime
    week_end: datetime
    average_mood: float
    mood_trend: str
    assessment_summary: dict
    triggers_identified: List[str] = []
    recommendations: List[str] = []
    risk_prediction: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserGoal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    goal_type: str
    target_value: int
    current_value: int
    deadline: Optional[datetime] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))