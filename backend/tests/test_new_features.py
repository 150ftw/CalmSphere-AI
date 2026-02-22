"""
Backend API Tests for CalmSphere AI - New Features
Tests: Appointments, Journal, Community, Insights, Goals
"""
import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials - created via mongosh
TEST_SESSION_TOKEN = "test_session_1771750078586"
TEST_USER_ID = "test-user-1771750078586"


@pytest.fixture
def auth_headers():
    """Return authenticated headers"""
    return {"Authorization": f"Bearer {TEST_SESSION_TOKEN}"}


# ============ APPOINTMENT TESTS ============

class TestAppointmentEndpoints:
    """Test appointment booking and management"""
    
    @pytest.fixture(autouse=True)
    def setup(self, auth_headers):
        self.headers = auth_headers
        self.created_appointment_id = None
    
    def test_book_appointment_success(self):
        """POST /api/appointments/book should create appointment"""
        future_date = (datetime.now() + timedelta(days=7)).isoformat()
        response = requests.post(
            f"{BASE_URL}/api/appointments/book",
            headers=self.headers,
            json={
                "counselor_name": "TEST_Dr. TestCounselor",
                "appointment_date": future_date,
                "appointment_type": "campus",
                "notes": "TEST appointment for testing"
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert data["counselor_name"] == "TEST_Dr. TestCounselor"
        assert data["appointment_type"] == "campus"
        assert data["status"] == "scheduled"
        print(f"✅ Appointment booked successfully: {data['id']}")
        return data["id"]
    
    def test_get_appointments_returns_list(self):
        """GET /api/appointments should return list"""
        response = requests.get(
            f"{BASE_URL}/api/appointments",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Appointments retrieved: {len(data)} appointments")
    
    def test_appointments_requires_auth(self):
        """GET /api/appointments without auth should return 401"""
        response = requests.get(f"{BASE_URL}/api/appointments")
        assert response.status_code == 401
        print(f"✅ Appointments endpoint correctly requires auth")
    
    def test_book_appointment_requires_auth(self):
        """POST /api/appointments/book without auth should return 401"""
        future_date = (datetime.now() + timedelta(days=7)).isoformat()
        response = requests.post(
            f"{BASE_URL}/api/appointments/book",
            json={
                "appointment_date": future_date,
                "appointment_type": "campus"
            }
        )
        assert response.status_code == 401
        print(f"✅ Book appointment correctly requires auth")


# ============ JOURNAL TESTS ============

class TestJournalEndpoints:
    """Test journal entries and prompts"""
    
    @pytest.fixture(autouse=True)
    def setup(self, auth_headers):
        self.headers = auth_headers
    
    def test_create_journal_entry_success(self):
        """POST /api/journal/entries should create entry with sentiment analysis"""
        response = requests.post(
            f"{BASE_URL}/api/journal/entries",
            headers=self.headers,
            json={
                "title": "TEST_Happy Day",
                "content": "Today was great! I feel happy and grateful for everything.",
                "tags": ["gratitude", "happiness"]
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert "sentiment" in data
        assert data["sentiment"] == "positive"  # Content has positive words
        print(f"✅ Journal entry created with sentiment: {data['sentiment']}")
    
    def test_create_journal_entry_negative_sentiment(self):
        """POST /api/journal/entries should detect negative sentiment"""
        response = requests.post(
            f"{BASE_URL}/api/journal/entries",
            headers=self.headers,
            json={
                "title": "TEST_Tough Day",
                "content": "Feeling sad and anxious about exams. Everything feels bad.",
                "tags": ["stress"]
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["sentiment"] == "negative"  # Content has negative words
        print(f"✅ Negative sentiment correctly detected")
    
    def test_get_journal_entries_returns_list(self):
        """GET /api/journal/entries should return entries"""
        response = requests.get(
            f"{BASE_URL}/api/journal/entries",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Journal entries retrieved: {len(data)} entries")
    
    def test_get_journal_prompts_returns_prompts(self):
        """GET /api/journal/prompts should return writing prompts"""
        response = requests.get(
            f"{BASE_URL}/api/journal/prompts",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 6  # Should have at least 6 prompts
        assert "type" in data[0]
        assert "prompt" in data[0]
        print(f"✅ Journal prompts retrieved: {len(data)} prompts")
    
    def test_journal_requires_auth(self):
        """Journal endpoints should require authentication"""
        response = requests.get(f"{BASE_URL}/api/journal/entries")
        assert response.status_code == 401
        
        response = requests.get(f"{BASE_URL}/api/journal/prompts")
        assert response.status_code == 401
        print(f"✅ Journal endpoints correctly require auth")


# ============ COMMUNITY TESTS ============

class TestCommunityEndpoints:
    """Test community posts and interactions"""
    
    @pytest.fixture(autouse=True)
    def setup(self, auth_headers):
        self.headers = auth_headers
    
    def test_create_community_post_success(self):
        """POST /api/community/posts should create anonymous post"""
        response = requests.post(
            f"{BASE_URL}/api/community/posts",
            headers=self.headers,
            json={
                "category": "support",
                "title": "TEST_Need Advice",
                "content": "Testing community post functionality"
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert data["category"] == "support"
        assert data["is_anonymous"] == True
        assert "username_display" in data
        assert data["likes_count"] == 0
        assert data["comments_count"] == 0
        print(f"✅ Community post created: {data['id']}")
        return data["id"]
    
    def test_get_community_posts_all(self):
        """GET /api/community/posts should return all posts"""
        response = requests.get(
            f"{BASE_URL}/api/community/posts",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Community posts retrieved: {len(data)} posts")
    
    def test_get_community_posts_by_category(self):
        """GET /api/community/posts?category=support should filter"""
        response = requests.get(
            f"{BASE_URL}/api/community/posts",
            headers=self.headers,
            params={"category": "support"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        # All returned posts should be in 'support' category
        for post in data:
            assert post["category"] == "support"
        print(f"✅ Filtered posts by category: {len(data)} support posts")
    
    def test_like_post(self):
        """POST /api/community/posts/{id}/like should increment likes"""
        # First create a post
        create_response = requests.post(
            f"{BASE_URL}/api/community/posts",
            headers=self.headers,
            json={
                "category": "success",
                "title": "TEST_Like Test Post",
                "content": "This post is for testing likes"
            }
        )
        post_id = create_response.json()["id"]
        
        # Like the post
        like_response = requests.post(
            f"{BASE_URL}/api/community/posts/{post_id}/like",
            headers=self.headers
        )
        assert like_response.status_code == 200
        print(f"✅ Post liked successfully")
    
    def test_add_comment(self):
        """POST /api/community/posts/{id}/comments should add comment"""
        # First create a post
        create_response = requests.post(
            f"{BASE_URL}/api/community/posts",
            headers=self.headers,
            json={
                "category": "support",
                "title": "TEST_Comment Test Post",
                "content": "This post is for testing comments"
            }
        )
        post_id = create_response.json()["id"]
        
        # Add comment
        comment_response = requests.post(
            f"{BASE_URL}/api/community/posts/{post_id}/comments",
            headers=self.headers,
            json={"content": "TEST comment on this post"}
        )
        assert comment_response.status_code == 200
        
        data = comment_response.json()
        assert "id" in data
        assert data["post_id"] == post_id
        print(f"✅ Comment added successfully")
    
    def test_community_requires_auth(self):
        """Community endpoints should require authentication"""
        response = requests.post(
            f"{BASE_URL}/api/community/posts",
            json={"category": "support", "title": "Test", "content": "Test"}
        )
        assert response.status_code == 401
        print(f"✅ Community endpoints correctly require auth")


# ============ INSIGHTS TESTS ============

class TestInsightsEndpoints:
    """Test weekly insights endpoint"""
    
    @pytest.fixture(autouse=True)
    def setup(self, auth_headers):
        self.headers = auth_headers
    
    def test_get_weekly_insight_no_data(self):
        """GET /api/insights/weekly should return message when no data"""
        response = requests.get(
            f"{BASE_URL}/api/insights/weekly",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        # For test user without mood entries, should return message
        if "message" in data:
            assert data["message"] == "Not enough data for insights"
            print(f"✅ Insights returns proper message when no data")
        else:
            # If data exists, check structure
            assert "average_mood" in data or "mood_trend" in data
            print(f"✅ Insights returns data structure")
    
    def test_insights_requires_auth(self):
        """GET /api/insights/weekly without auth should return 401"""
        response = requests.get(f"{BASE_URL}/api/insights/weekly")
        assert response.status_code == 401
        print(f"✅ Insights endpoint correctly requires auth")


# ============ GOALS TESTS ============

class TestGoalsEndpoints:
    """Test user goals endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self, auth_headers):
        self.headers = auth_headers
    
    def test_create_goal_success(self):
        """POST /api/goals should create new goal"""
        future_date = (datetime.now() + timedelta(days=30)).isoformat()
        response = requests.post(
            f"{BASE_URL}/api/goals",
            headers=self.headers,
            json={
                "goal_type": "mood_improvement",
                "target_value": 8,
                "current_value": 5,
                "deadline": future_date
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert data["goal_type"] == "mood_improvement"
        assert data["target_value"] == 8
        assert data["status"] == "active"
        print(f"✅ Goal created: {data['id']}")
    
    def test_get_goals_returns_list(self):
        """GET /api/goals should return active goals"""
        response = requests.get(
            f"{BASE_URL}/api/goals",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Goals retrieved: {len(data)} active goals")
    
    def test_goals_requires_auth(self):
        """Goals endpoints should require authentication"""
        response = requests.get(f"{BASE_URL}/api/goals")
        assert response.status_code == 401
        print(f"✅ Goals endpoints correctly require auth")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
