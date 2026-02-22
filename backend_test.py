#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class CalmSphereAPITester:
    def __init__(self, base_url="https://student-support-40.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.session_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
            self.failed_tests.append({"test": name, "details": details})

    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, params=params)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)
            
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}
            
            return response.status_code < 400, response_data, response.status_code
            
        except Exception as e:
            return False, {"error": str(e)}, 0

    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, data, status = self.make_request('GET', '')
        expected_message = "CalmSphere AI API"
        
        if success and data.get('message') == expected_message:
            self.log_test("Root endpoint", True)
            return True
        else:
            self.log_test("Root endpoint", False, f"Status: {status}, Data: {data}")
            return False

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime("%H%M%S")
        user_data = {
            "email": f"test_user_{timestamp}@example.com",
            "password": "TestPass123!",
            "username": f"testuser_{timestamp}",
            "is_pseudonymous": False,
            "role": "student"
        }
        
        success, data, status = self.make_request('POST', 'auth/register', user_data)
        
        if success and data.get('access_token') and data.get('user'):
            self.token = data['access_token']
            self.user_id = data['user']['id']
            self.log_test("User registration", True)
            return True
        else:
            self.log_test("User registration", False, f"Status: {status}, Data: {data}")
            return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        # First register a user for login test
        timestamp = datetime.now().strftime("%H%M%S")
        email = f"login_test_{timestamp}@example.com"
        password = "LoginTest123!"
        
        # Register user
        user_data = {
            "email": email,
            "password": password,
            "username": f"loginuser_{timestamp}",
            "is_pseudonymous": False,
            "role": "student"
        }
        
        reg_success, reg_data, reg_status = self.make_request('POST', 'auth/register', user_data)
        if not reg_success:
            self.log_test("User login (registration failed)", False, f"Registration failed: {reg_data}")
            return False
        
        # Clear token to test login
        self.token = None
        
        # Test login
        success, data, status = self.make_request('POST', 'auth/login', params={'email': email, 'password': password})
        
        if success and data.get('access_token') and data.get('user'):
            self.token = data['access_token']
            self.user_id = data['user']['id']
            self.log_test("User login", True)
            return True
        else:
            self.log_test("User login", False, f"Status: {status}, Data: {data}")
            return False

    def test_onboarding(self):
        """Test onboarding completion"""
        if not self.token:
            self.log_test("Onboarding (no auth)", False, "No authentication token")
            return False
        
        onboarding_data = {
            "year": "3rd Year",
            "branch": "Computer Science",
            "concerns": ["academic_pressure", "anxiety", "stress"],
            "consent_given": True,
            "timezone": "America/New_York"
        }
        
        success, data, status = self.make_request('POST', 'profile/onboarding', onboarding_data)
        
        if success and data.get('message') == "Onboarding completed":
            self.log_test("Onboarding completion", True)
            return True
        else:
            self.log_test("Onboarding completion", False, f"Status: {status}, Data: {data}")
            return False

    def test_get_profile(self):
        """Test getting user profile"""
        if not self.token:
            self.log_test("Get profile (no auth)", False, "No authentication token")
            return False
        
        success, data, status = self.make_request('GET', 'profile')
        
        if success and data is not None:
            self.log_test("Get profile", True)
            return True
        else:
            self.log_test("Get profile", False, f"Status: {status}, Data: {data}")
            return False

    def test_chat_session_creation(self):
        """Test creating chat session"""
        if not self.token:
            self.log_test("Chat session creation (no auth)", False, "No authentication token")
            return False
        
        success, data, status = self.make_request('POST', 'chat/session/create')
        
        if success and data.get('id'):
            self.session_id = data['id']
            self.log_test("Chat session creation", True)
            return True
        else:
            self.log_test("Chat session creation", False, f"Status: {status}, Data: {data}")
            return False

    def test_send_message(self):
        """Test sending a chat message"""
        if not self.token or not self.session_id:
            self.log_test("Send message (missing auth/session)", False, "Missing token or session ID")
            return False
        
        message_data = {
            "session_id": self.session_id,
            "message": "Hello, I'm feeling a bit stressed about my upcoming exams."
        }
        
        success, data, status = self.make_request('POST', 'chat/send', message_data)
        
        if success and data.get('message') and data['message'].get('content'):
            self.log_test("Send chat message", True)
            return True
        else:
            self.log_test("Send chat message", False, f"Status: {status}, Data: {data}")
            return False

    def test_get_chat_sessions(self):
        """Test getting chat sessions"""
        if not self.token:
            self.log_test("Get chat sessions (no auth)", False, "No authentication token")
            return False
        
        success, data, status = self.make_request('GET', 'chat/sessions')
        
        if success and isinstance(data, list):
            self.log_test("Get chat sessions", True)
            return True
        else:
            self.log_test("Get chat sessions", False, f"Status: {status}, Data: {data}")
            return False

    def test_assessment_questions(self):
        """Test getting assessment questions"""
        if not self.token:
            self.log_test("Assessment questions (no auth)", False, "No authentication token")
            return False
        
        assessment_types = ['phq9', 'gad7', 'stress']
        all_passed = True
        
        for assessment_type in assessment_types:
            success, data, status = self.make_request('GET', f'assessment/questions/{assessment_type}')
            
            if success and data.get('questions') and len(data['questions']) > 0:
                self.log_test(f"Get {assessment_type.upper()} questions", True)
            else:
                self.log_test(f"Get {assessment_type.upper()} questions", False, f"Status: {status}, Data: {data}")
                all_passed = False
        
        return all_passed

    def test_submit_assessment(self):
        """Test submitting an assessment"""
        if not self.token:
            self.log_test("Submit assessment (no auth)", False, "No authentication token")
            return False
        
        # Submit PHQ-9 assessment with sample responses
        assessment_data = {
            "assessment_type": "phq9",
            "responses": {
                "1": 1,  # Several days
                "2": 0,  # Not at all
                "3": 2,  # More than half the days
                "4": 1,  # Several days
                "5": 0,  # Not at all
                "6": 1,  # Several days
                "7": 2,  # More than half the days
                "8": 0,  # Not at all
                "9": 0   # Not at all
            }
        }
        
        success, data, status = self.make_request('POST', 'assessment/submit', assessment_data)
        
        if success and data.get('total_score') is not None and data.get('severity'):
            self.log_test("Submit PHQ-9 assessment", True)
            return True
        else:
            self.log_test("Submit PHQ-9 assessment", False, f"Status: {status}, Data: {data}")
            return False

    def test_mood_logging(self):
        """Test mood logging"""
        if not self.token:
            self.log_test("Mood logging (no auth)", False, "No authentication token")
            return False
        
        mood_data = {
            "mood_rating": 7,
            "tags": ["calm", "focused"],
            "note": "Feeling good after completing my assignment"
        }
        
        success, data, status = self.make_request('POST', 'mood/log', mood_data)
        
        if success and data.get('mood_rating') == 7:
            self.log_test("Mood logging", True)
            return True
        else:
            self.log_test("Mood logging", False, f"Status: {status}, Data: {data}")
            return False

    def test_get_mood_history(self):
        """Test getting mood history"""
        if not self.token:
            self.log_test("Get mood history (no auth)", False, "No authentication token")
            return False
        
        success, data, status = self.make_request('GET', 'mood/history')
        
        if success and isinstance(data, list):
            self.log_test("Get mood history", True)
            return True
        else:
            self.log_test("Get mood history", False, f"Status: {status}, Data: {data}")
            return False

    def test_get_modules(self):
        """Test getting self-help modules"""
        if not self.token:
            self.log_test("Get modules (no auth)", False, "No authentication token")
            return False
        
        success, data, status = self.make_request('GET', 'modules')
        
        if success and isinstance(data, list) and len(data) > 0:
            self.log_test("Get self-help modules", True)
            return True
        else:
            self.log_test("Get self-help modules", False, f"Status: {status}, Data: {data}")
            return False

    def test_student_dashboard(self):
        """Test student dashboard data"""
        if not self.token:
            self.log_test("Student dashboard (no auth)", False, "No authentication token")
            return False
        
        success, data, status = self.make_request('GET', 'dashboard/student')
        
        if success and isinstance(data, dict):
            self.log_test("Student dashboard", True)
            return True
        else:
            self.log_test("Student dashboard", False, f"Status: {status}, Data: {data}")
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting CalmSphere AI Backend API Tests")
        print("=" * 50)
        
        # Basic connectivity
        if not self.test_root_endpoint():
            print("❌ API not accessible, stopping tests")
            return False
        
        # Authentication tests
        if not self.test_user_registration():
            print("❌ Registration failed, stopping tests")
            return False
        
        if not self.test_user_login():
            print("❌ Login failed, continuing with registration token")
        
        # Profile tests
        self.test_onboarding()
        self.test_get_profile()
        
        # Chat tests
        self.test_chat_session_creation()
        self.test_send_message()
        self.test_get_chat_sessions()
        
        # Assessment tests
        self.test_assessment_questions()
        self.test_submit_assessment()
        
        # Mood tests
        self.test_mood_logging()
        self.test_get_mood_history()
        
        # Module and dashboard tests
        self.test_get_modules()
        self.test_student_dashboard()
        
        # Print results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return success_rate >= 80

def main():
    tester = CalmSphereAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())