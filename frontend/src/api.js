import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Profile
export const completeOnboarding = (data) => api.post('/profile/onboarding', data);
export const getProfile = () => api.get('/profile');

// Chat
export const createChatSession = () => api.post('/chat/session/create');
export const getChatSessions = () => api.get('/chat/sessions');
export const getChatMessages = (sessionId) => api.get(`/chat/session/${sessionId}/messages`);
export const sendMessage = (sessionId, message) => api.post('/chat/send', { session_id: sessionId, message });

// Assessments
export const getAssessmentQuestions = (type) => api.get(`/assessment/questions/${type}`);
export const submitAssessment = (type, responses) => api.post('/assessment/submit', { assessment_type: type, responses });
export const getAssessmentHistory = (type) => api.get(`/assessment/history/${type}`);

// Mood
export const logMood = (data) => api.post('/mood/log', data);
export const getMoodHistory = () => api.get('/mood/history');

// Modules
export const getModules = () => api.get('/modules');

// Dashboard
export const getStudentDashboard = () => api.get('/dashboard/student');

// Admin
export const getAnalytics = () => api.get('/admin/analytics');
export const getAdminConfig = () => api.get('/admin/config');
export const updateAdminConfig = (data) => api.post('/admin/config', data);

// Appointments
export const bookAppointment = (data) => api.post('/appointments/book', data);
export const getAppointments = () => api.get('/appointments');
export const updateAppointmentStatus = (id, status) => api.patch(`/appointments/${id}/status`, null, { params: { status } });

// Journal
export const createJournalEntry = (data) => api.post('/journal/entries', data);
export const getJournalEntries = () => api.get('/journal/entries');
export const getJournalPrompts = () => api.get('/journal/prompts');

// Community
export const createCommunityPost = (data) => api.post('/community/posts', data);
export const getCommunityPosts = (category) => api.get('/community/posts', { params: { category } });
export const likePost = (postId) => api.post(`/community/posts/${postId}/like`);
export const addComment = (postId, data) => api.post(`/community/posts/${postId}/comments`, data);
export const getComments = (postId) => api.get(`/community/posts/${postId}/comments`);

// Insights
export const getWeeklyInsight = () => api.get('/insights/weekly');

// Goals
export const createGoal = (data) => api.post('/goals', data);
export const getGoals = () => api.get('/goals');
