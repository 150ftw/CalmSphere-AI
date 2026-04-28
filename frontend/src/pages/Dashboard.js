import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudentDashboard, createChatSession } from '../api';
import { Button } from '../components/ui/button';
import { MessageCircleHeart, Activity, Smile, TrendingUp, LogOut, Calendar, BookOpen, Users, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getStudentDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.error('Failed to load dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = async () => {
    try {
      const response = await createChatSession();
      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-noise flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-noise">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <h1 className="font-fraunces text-2xl font-medium">CalmSphere AI</h1>
          <div className="flex items-center gap-4">
            {user?.picture && (
              <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
            )}
            <span className="text-sm text-muted-foreground">Hello, {user?.name || user?.username || 'User'}</span>
            <Button
              data-testid="logout-btn"
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="hover:bg-muted/50 rounded-full"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div data-testid="student-dashboard" className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="font-fraunces text-4xl md:text-5xl font-normal mb-4">
            Welcome back, {user?.name?.split(' ')[0] || user?.username || 'User'}
          </h2>
          <p className="text-lg text-muted-foreground">
            How are you feeling today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button
            data-testid="start-chat-btn"
            onClick={startNewChat}
            className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
          >
            <MessageCircleHeart className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-fraunces text-xl font-medium mb-1">Talk to Calmi</h3>
            <p className="text-primary-foreground/80 text-sm">Start a supportive conversation</p>
          </button>

          <button
            data-testid="take-assessment-btn"
            onClick={() => navigate('/assessments')}
            className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
          >
            <Activity className="w-8 h-8 mb-3 text-secondary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-fraunces text-xl font-medium mb-1">Take Assessment</h3>
            <p className="text-muted-foreground text-sm">Check your mental health</p>
          </button>

          <button
            data-testid="log-mood-btn"
            onClick={() => navigate('/mood')}
            className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
          >
            <Smile className="w-8 h-8 mb-3 text-accent group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-fraunces text-xl font-medium mb-1">Log Mood</h3>
            <p className="text-muted-foreground text-sm">Track how you're feeling</p>
          </button>

          <button
            data-testid="view-progress-btn"
            onClick={() => navigate('/progress')}
            className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
          >
            <TrendingUp className="w-8 h-8 mb-3 text-chart-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-fraunces text-xl font-medium mb-1">View Progress</h3>
            <p className="text-muted-foreground text-sm">See your wellness trends</p>
          </button>
        </div>

        {/* New Features Row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button
            data-testid="appointments-btn"
            onClick={() => navigate('/appointments')}
            className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
          >
            <Calendar className="w-8 h-8 mb-3 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-fraunces text-xl font-medium mb-1">Appointments</h3>
            <p className="text-muted-foreground text-sm">Book counseling sessions</p>
          </button>

          <button
            data-testid="journal-btn"
            onClick={() => navigate('/journal')}
            className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
          >
            <BookOpen className="w-8 h-8 mb-3 text-secondary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-fraunces text-xl font-medium mb-1">Journal</h3>
            <p className="text-muted-foreground text-sm">Reflect & track your journey</p>
          </button>

          <button
            data-testid="community-btn"
            onClick={() => navigate('/community')}
            className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
          >
            <Users className="w-8 h-8 mb-3 text-accent group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-fraunces text-xl font-medium mb-1">Community</h3>
            <p className="text-muted-foreground text-sm">Connect with peers</p>
          </button>

          <button
            data-testid="insights-btn"
            onClick={() => navigate('/insights')}
            className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
          >
            <Sparkles className="w-8 h-8 mb-3 text-chart-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <h3 className="font-fraunces text-xl font-medium mb-1">Insights</h3>
            <p className="text-muted-foreground text-sm">Weekly wellness report</p>
          </button>
        </div>

        {/* Latest Mood & Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft">
            <h3 className="font-fraunces text-2xl font-medium mb-4">Latest Mood</h3>
            {dashboard?.latest_mood ? (
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-5xl font-bold text-primary">{dashboard.latest_mood.mood_rating}</div>
                  <div className="text-sm text-muted-foreground">out of 10</div>
                </div>
                {dashboard.latest_mood.tags && dashboard.latest_mood.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dashboard.latest_mood.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-muted/50 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No mood entries yet. Log your first mood!</p>
            )}
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft">
            <h3 className="font-fraunces text-2xl font-medium mb-4">Latest Scores</h3>
            {dashboard?.latest_scores && Object.keys(dashboard.latest_scores).length > 0 ? (
              <div className="space-y-3">
                {dashboard.latest_scores.phq9 !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">PHQ-9 (Depression)</span>
                    <span className="font-medium text-lg">{dashboard.latest_scores.phq9}</span>
                  </div>
                )}
                {dashboard.latest_scores.gad7 !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">GAD-7 (Anxiety)</span>
                    <span className="font-medium text-lg">{dashboard.latest_scores.gad7}</span>
                  </div>
                )}
                {dashboard.latest_scores.stress !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Stress Scale</span>
                    <span className="font-medium text-lg">{dashboard.latest_scores.stress}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No assessments taken yet. Take your first assessment!</p>
            )}
          </div>
        </div>

        {/* Self-Help Resources */}
        <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft">
          <h3 className="font-fraunces text-2xl font-medium mb-4">Self-Help Resources</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/modules')}
              className="p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all text-left"
            >
              <h4 className="font-medium mb-1">Breathing Exercises</h4>
              <p className="text-sm text-muted-foreground">Calm your mind in minutes</p>
            </button>
            <button
              onClick={() => navigate('/modules')}
              className="p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all text-left"
            >
              <h4 className="font-medium mb-1">CBT Techniques</h4>
              <p className="text-sm text-muted-foreground">Challenge negative thoughts</p>
            </button>
            <button
              onClick={() => navigate('/modules')}
              className="p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all text-left"
            >
              <h4 className="font-medium mb-1">Sleep Hygiene</h4>
              <p className="text-sm text-muted-foreground">Improve your rest</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}