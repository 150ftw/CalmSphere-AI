# CalmSphere AI - Product Requirements Document

## Overview
CalmSphere AI is a web-based mental health and well-being assistant designed for college students, aligned with UN SDG-3 (Good Health & Well-being).

## Core Architecture
- **Frontend**: React with Tailwind CSS, Shadcn/UI components
- **Backend**: FastAPI with Python
- **Database**: MongoDB
- **Authentication**: Emergent-managed Google OAuth
- **AI Chat**: OpenAI GPT-5.2 via Emergent LLM Key

## User Roles
1. **Student User**: Access to AI chat, assessments, mood logging, journaling, community, appointments
2. **Counselor/Admin User**: Anonymized dashboard with aggregated analytics

## Indian Localization
- Crisis Hotline: KIRAN 1800-599-0019
- Emergency: 112
- Cultural context adapted for Indian college students

---

## Completed Features (December 2024)

### Authentication ✅
- [x] Google OAuth via Emergent-managed Auth (https://auth.emergentagent.com/)
- [x] Session-based authentication with Bearer token
- [x] Auto-redirect for authenticated users
- [x] Secure logout functionality
- [x] URL hash-based session_id handling for OAuth callback

### Core UI ✅
- [x] Landing page with calming design
- [x] Login page with "Continue with Google" button
- [x] Dashboard page with 8 feature cards
- [x] Navigation and routing

### Backend Infrastructure ✅
- [x] FastAPI server with CORS
- [x] MongoDB connection
- [x] Auth middleware for protected routes
- [x] Profile management API
- [x] Chat session management API
- [x] Assessment submission API (PHQ-9, GAD-7, Stress)
- [x] Mood logging API
- [x] Self-help modules API

### AI Chat ✅
- [x] LLM integration with GPT-5.2
- [x] Crisis detection with risk engine
- [x] Crisis response with KIRAN helpline

### Assessments ✅
- [x] PHQ-9 (Depression)
- [x] GAD-7 (Anxiety)
- [x] Stress Scale
- [x] History tracking

### New Features (Implemented) ✅
- [x] **Appointments** - Book counseling sessions with campus counselors
- [x] **Journal** - Daily reflections with writing prompts and sentiment analysis
- [x] **Community** - Anonymous peer support forum with categories
- [x] **Insights** - Weekly wellness analytics and recommendations

---

## In Progress / Upcoming (P0)

### Backend Enhancements
- [ ] Email notifications for appointments
- [ ] Advanced sentiment analysis for journal entries
- [ ] Community post moderation system
- [ ] Real-time insights with more data points

---

## Backlog (P1)

### Predictive Analytics
- [ ] Crisis prediction based on assessment patterns
- [ ] User wellness trends visualization
- [ ] Risk alerts for counselors

### Peer Support
- [ ] Anonymous peer matching algorithm
- [ ] Safe chat between peers
- [ ] Moderation system

### Professional Network
- [ ] Therapist marketplace
- [ ] Verified professional profiles
- [ ] Booking integration

---

## Future Tasks (P2)

### Gamification
- [ ] Streaks for daily check-ins
- [ ] Badges and achievements
- [ ] Progress milestones

### Advanced Crisis Detection
- [ ] Enhanced NLP for risk detection
- [ ] Safety planning UI
- [ ] Emergency contact management

### Multi-platform
- [ ] SMS/WhatsApp bot integration
- [ ] Mental health education hub
- [ ] Hindi language support

---

## API Endpoints

### Authentication
- `POST /api/auth/session` - Exchange session_id for user data
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Profile
- `POST /api/profile/onboarding` - Complete onboarding
- `GET /api/profile` - Get user profile

### Chat
- `POST /api/chat/session/create` - Create new chat session
- `GET /api/chat/sessions` - Get all chat sessions
- `GET /api/chat/session/{session_id}/messages` - Get messages
- `POST /api/chat/send` - Send message

### Assessments
- `GET /api/assessment/questions/{type}` - Get questions
- `POST /api/assessment/submit` - Submit assessment
- `GET /api/assessment/history/{type}` - Get history

### Mood
- `POST /api/mood/log` - Log mood entry
- `GET /api/mood/history` - Get mood history

### Modules
- `GET /api/modules` - Get self-help modules

### Dashboard
- `GET /api/dashboard/student` - Get student dashboard data

---

## Tech Stack
- React 18 with React Router
- FastAPI with Uvicorn
- MongoDB with Motor async driver
- Emergent LLM Key for OpenAI GPT-5.2
- Emergent-managed Google OAuth

## Preview URL
https://student-support-40.preview.emergentagent.com
