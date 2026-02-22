import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoodHistory, getAssessmentHistory } from '../api';
import { Button } from '../components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Progress() {
  const navigate = useNavigate();
  const [moodHistory, setMoodHistory] = useState([]);
  const [phq9History, setPhq9History] = useState([]);
  const [gad7History, setGad7History] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mood, phq9, gad7] = await Promise.all([
        getMoodHistory(),
        getAssessmentHistory('phq9'),
        getAssessmentHistory('gad7')
      ]);

      setMoodHistory(mood.data.reverse());
      setPhq9History(phq9.data.reverse());
      setGad7History(gad7.data.reverse());
    } catch (error) {
      console.error('Failed to load progress data', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoodData = () => {
    return moodHistory.slice(-30).map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: entry.mood_rating
    }));
  };

  const formatAssessmentData = (data) => {
    return data.slice(-10).map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: entry.total_score
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-noise flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-noise">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <Button
            data-testid="back-btn"
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="hover:bg-muted/50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div data-testid="progress-page" className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="mb-12">
          <h1 className="font-fraunces text-4xl md:text-5xl font-normal mb-4">Your Progress</h1>
          <p className="text-lg text-muted-foreground">
            Track your mental wellness journey over time
          </p>
        </div>

        {/* Mood Trend */}
        <div className="bg-card rounded-2xl shadow-soft border border-border/40 p-8 mb-8">
          <h2 className="font-fraunces text-2xl font-medium mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Mood Trend (Last 30 Days)
          </h2>
          {moodHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatMoodData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E2DE" />
                <XAxis dataKey="date" stroke="#6B7C70" style={{ fontSize: '12px' }} />
                <YAxis domain={[1, 10]} stroke="#6B7C70" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E2DE',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#4A6C58"
                  strokeWidth={3}
                  dot={{ fill: '#4A6C58', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No mood entries yet. Start logging your mood to see trends!
            </p>
          )}
        </div>

        {/* PHQ-9 History */}
        <div className="bg-card rounded-2xl shadow-soft border border-border/40 p-8 mb-8">
          <h2 className="font-fraunces text-2xl font-medium mb-6">PHQ-9 Depression Scores</h2>
          {phq9History.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatAssessmentData(phq9History)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E2DE" />
                <XAxis dataKey="date" stroke="#6B7C70" style={{ fontSize: '12px' }} />
                <YAxis domain={[0, 27]} stroke="#6B7C70" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E2DE',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#E09F7D"
                  strokeWidth={3}
                  dot={{ fill: '#E09F7D', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No PHQ-9 assessments yet. Take your first assessment!
            </p>
          )}
        </div>

        {/* GAD-7 History */}
        <div className="bg-card rounded-2xl shadow-soft border border-border/40 p-8">
          <h2 className="font-fraunces text-2xl font-medium mb-6">GAD-7 Anxiety Scores</h2>
          {gad7History.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatAssessmentData(gad7History)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E2DE" />
                <XAxis dataKey="date" stroke="#6B7C70" style={{ fontSize: '12px' }} />
                <YAxis domain={[0, 21]} stroke="#6B7C70" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E2DE',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#A4C3D2"
                  strokeWidth={3}
                  dot={{ fill: '#A4C3D2', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No GAD-7 assessments yet. Take your first assessment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}