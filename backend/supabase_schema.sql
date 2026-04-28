-- Users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    picture TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles (Onboarding data)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
    year TEXT,
    branch TEXT,
    concerns JSONB,
    consent_given BOOLEAN DEFAULT FALSE,
    timezone TEXT,
    onboarding_completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions (Auth)
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Config Settings
CREATE TABLE public.config_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crisis_hotline TEXT NOT NULL,
    campus_counselor_phone TEXT NOT NULL,
    campus_counselor_email TEXT NOT NULL,
    risk_threshold_high INTEGER NOT NULL,
    risk_threshold_medium INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default config
INSERT INTO public.config_settings (crisis_hotline, campus_counselor_phone, campus_counselor_email, risk_threshold_high, risk_threshold_medium)
VALUES ('1800-599-0019', 'Contact your campus health center', 'Available through campus resources', 15, 10);

-- Assessment Results
CREATE TABLE public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    assessment_type TEXT NOT NULL,
    responses JSONB NOT NULL,
    total_score INTEGER NOT NULL,
    severity TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Sessions
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    risk_level TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood Entries
CREATE TABLE public.mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    mood_rating INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),
    tags JSONB,
    note TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments (New Feature)
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    counselor_name TEXT,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    appointment_type TEXT DEFAULT 'campus',
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal Entries (New Feature)
CREATE TABLE public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    prompt_type TEXT DEFAULT 'free',
    sentiment TEXT DEFAULT 'neutral',
    tags JSONB,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts (New Feature)
CREATE TABLE public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    username_display TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Comments (New Feature)
CREATE TABLE public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    username_display TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Goals (New Feature)
CREATE TABLE public.user_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    goal_type TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    deadline TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
