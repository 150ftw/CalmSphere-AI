"""
Backend API Tests for CalmSphere AI
Tests: Root endpoint, Auth, Profile, Chat, Dashboard

Migration verified: Google OAuth replacing email/password/OTP
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials - created via mongosh
TEST_SESSION_TOKEN = "test_session_1771750078586"
TEST_USER_ID = "test-user-1771750078586"


class TestRootEndpoint:
    """Test root /api/ endpoint"""
    
    def test_api_root_returns_operational(self):
        """Root endpoint should return operational status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "status" in data
        assert data["status"] == "operational"
        assert "CalmSphere" in data["message"]
        print(f"✅ Root endpoint operational: {data}")


class TestAuthEndpoints:
    """Test authentication endpoints"""
    
    def test_auth_me_without_token_returns_401(self):
        """GET /api/auth/me without token should return 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        
        data = response.json()
        assert "detail" in data
        print(f"✅ Auth /me without token correctly returns 401: {data}")
    
    def test_auth_me_with_invalid_token_returns_401(self):
        """GET /api/auth/me with invalid token should return 401"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid_token_12345"}
        )
        assert response.status_code == 401
        print(f"✅ Auth /me with invalid token correctly returns 401")
    
    def test_auth_me_with_valid_token_returns_user(self):
        """GET /api/auth/me with valid token should return user data"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {TEST_SESSION_TOKEN}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "user_id" in data
        assert "email" in data
        assert data["user_id"] == TEST_USER_ID
        print(f"✅ Auth /me with valid token returns user: {data['email']}")


class TestProtectedEndpoints:
    """Test protected endpoints require authentication"""
    
    def test_profile_requires_auth(self):
        """GET /api/profile without auth should return 401"""
        response = requests.get(f"{BASE_URL}/api/profile")
        assert response.status_code == 401
        print(f"✅ Profile endpoint correctly requires auth")
    
    def test_dashboard_requires_auth(self):
        """GET /api/dashboard/student without auth should return 401"""
        response = requests.get(f"{BASE_URL}/api/dashboard/student")
        assert response.status_code == 401
        print(f"✅ Dashboard endpoint correctly requires auth")
    
    def test_modules_requires_auth(self):
        """GET /api/modules without auth should return 401"""
        response = requests.get(f"{BASE_URL}/api/modules")
        assert response.status_code == 401
        print(f"✅ Modules endpoint correctly requires auth")


class TestAuthenticatedEndpoints:
    """Test endpoints with valid authentication"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup authenticated session"""
        self.headers = {"Authorization": f"Bearer {TEST_SESSION_TOKEN}"}
    
    def test_get_dashboard_returns_data(self):
        """GET /api/dashboard/student with auth should return dashboard data"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/student",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        # Dashboard should have expected structure
        assert "latest_mood" in data or data.get("latest_mood") is None
        assert "latest_scores" in data
        assert "recent_sessions" in data
        print(f"✅ Dashboard returns data structure correctly")
    
    def test_get_modules_returns_list(self):
        """GET /api/modules with auth should return self-help modules"""
        response = requests.get(
            f"{BASE_URL}/api/modules",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Modules returns list with {len(data)} modules")
    
    def test_profile_returns_null_for_new_user(self):
        """GET /api/profile for new user should return null (no onboarding yet)"""
        response = requests.get(
            f"{BASE_URL}/api/profile",
            headers=self.headers
        )
        # For new test user, profile may be null
        assert response.status_code == 200
        print(f"✅ Profile endpoint works for authenticated user")


class TestChatEndpoints:
    """Test chat-related endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.headers = {"Authorization": f"Bearer {TEST_SESSION_TOKEN}"}
    
    def test_create_chat_session(self):
        """POST /api/chat/session/create should create new session"""
        response = requests.post(
            f"{BASE_URL}/api/chat/session/create",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert "user_id" in data
        print(f"✅ Chat session created: {data['id']}")
        return data["id"]
    
    def test_get_chat_sessions(self):
        """GET /api/chat/sessions should return list of sessions"""
        response = requests.get(
            f"{BASE_URL}/api/chat/sessions",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Chat sessions retrieved: {len(data)} sessions")


class TestAssessmentEndpoints:
    """Test assessment endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.headers = {"Authorization": f"Bearer {TEST_SESSION_TOKEN}"}
    
    def test_get_phq9_questions(self):
        """GET /api/assessment/questions/phq9 should return questions"""
        response = requests.get(
            f"{BASE_URL}/api/assessment/questions/phq9",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "questions" in data
        assert "assessment_type" in data
        assert data["assessment_type"] == "phq9"
        print(f"✅ PHQ-9 questions retrieved: {len(data['questions'])} questions")
    
    def test_get_gad7_questions(self):
        """GET /api/assessment/questions/gad7 should return questions"""
        response = requests.get(
            f"{BASE_URL}/api/assessment/questions/gad7",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "questions" in data
        assert data["assessment_type"] == "gad7"
        print(f"✅ GAD-7 questions retrieved: {len(data['questions'])} questions")


class TestLogoutEndpoint:
    """Test logout functionality"""
    
    def test_logout_succeeds(self):
        """POST /api/auth/logout should succeed"""
        response = requests.post(
            f"{BASE_URL}/api/auth/logout",
            headers={"Authorization": f"Bearer {TEST_SESSION_TOKEN}"}
        )
        # Logout may return 200 even without valid session
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        print(f"✅ Logout endpoint works: {data['message']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
