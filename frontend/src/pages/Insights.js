import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWeeklyInsight } from '../api';
import { Button } from '../components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function Insights() {
  const navigate = useNavigate();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsight();
  }, []);

  const loadInsight = async () => {
    try {
      const response = await getWeeklyInsight();
      setInsight(response.data);
    } catch (error) {
      console.error('Failed to load insight', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background bg-noise flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!insight || insight.message) {
    return (
      <div className="min-h-screen bg-background bg-noise">
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button data-testid="back-btn" onClick={() => navigate('/dashboard')} variant="ghost" className="hover:bg-muted/50 rounded-full">
              <ArrowLeft className="w-5 h-5 mr-2" />Back
            </Button>
          </div>
        </header>
        <div data-testid="no-data-message" className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-muted-foreground">Not enough data yet. Log moods and take assessments to generate insights!</p>
        </div>
      </div>
    );
  }

  const TrendIcon = insight.mood_trend === 'improving' ? TrendingUp : insight.mood_trend === 'declining' ? TrendingDown : Minus;

  return (
    <div className="min-h-screen bg-background bg-noise">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button data-testid="back-btn" onClick={() => navigate('/dashboard')} variant="ghost" className="hover:bg-muted/50 rounded-full">
            <ArrowLeft className="w-5 h-5 mr-2" />Back
          </Button>
        </div>
      </header>

      <div data-testid="insights-content" className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-fraunces text-4xl md:text-5xl font-normal mb-4">Weekly Insights</h1>
        <p className="text-lg text-muted-foreground mb-12">
          {new Date(insight.week_start).toLocaleDateString('en-IN')} - {new Date(insight.week_end).toLocaleDateString('en-IN')}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Mood</h3>
            <div className="text-5xl font-bold text-primary mb-2">{insight.average_mood}</div>
            <p className="text-sm text-muted-foreground">out of 10</p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Trend</h3>
            <div className="flex items-center gap-3 mb-2">
              <TrendIcon className="w-10 h-10 text-primary" />
              <span className="text-3xl font-bold capitalize">{insight.mood_trend}</span>
            </div>
          </div>
        </div>

        {insight.triggers_identified && insight.triggers_identified.length > 0 && (
          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft mb-8">
            <h3 className="font-fraunces text-2xl font-medium mb-4">Common Triggers</h3>
            <div className="flex flex-wrap gap-2">
              {insight.triggers_identified.map((trigger, i) => (
                <span key={i} className="px-4 py-2 bg-muted/50 rounded-full text-sm">{trigger}</span>
              ))}
            </div>
          </div>
        )}

        {insight.recommendations && insight.recommendations.length > 0 && (
          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft">
            <h3 className="font-fraunces text-2xl font-medium mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {insight.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}