import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const hasProcessed = useRef(false);

  // If user already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Handle OAuth callback - check for session_id in URL hash
  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.includes('session_id=') && !hasProcessed.current) {
      hasProcessed.current = true;
      const sessionId = hash.split('session_id=')[1]?.split('&')[0];
      if (sessionId) {
        handleGoogleCallback(sessionId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  const handleGoogleCallback = async (sessionId) => {
    setLoading(true);
    try {
      // Exchange session_id for user data
      const response = await axios.post(
        `${API_URL}/api/auth/session`,
        {},
        {
          headers: {
            'X-Session-ID': sessionId
          }
        }
      );

      const { session_token, user: userData } = response.data;
      
      // Store session and user data
      loginUser(userData, session_token);
      
      toast.success(`Welcome, ${userData.name || 'User'}!`);
      
      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname);
      
      // Check if user needs onboarding
      try {
        const profileResponse = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${session_token}` }
        });
        
        if (profileResponse.data?.onboarding_completed) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } catch (e) {
        // Profile not found, go to onboarding
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.');
      hasProcessed.current = false;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/login';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-noise flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-card rounded-2xl shadow-float p-8 border border-border/40">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="font-fraunces text-2xl font-normal mb-2">Signing you in...</h2>
            <p className="text-muted-foreground">Please wait while we set up your account</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-noise flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-float p-8 border border-border/40">
          <div className="text-center mb-8">
            <h1 className="font-fraunces text-4xl font-normal mb-2">Welcome to CalmSphere</h1>
            <p className="text-muted-foreground">Sign in to continue your wellness journey</p>
          </div>

          <Button
            data-testid="google-signin-btn"
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-full py-6 text-lg font-medium shadow-soft hover:shadow-float transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        <div className="mt-6 bg-muted/30 rounded-xl p-4 border border-border/40">
          <p className="text-sm text-muted-foreground text-center">
            CalmSphere AI is a <strong>supportive tool</strong>, not a replacement for professional mental health care. 
            In crisis, contact KIRAN: <strong>1800-599-0019</strong>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-primary"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
