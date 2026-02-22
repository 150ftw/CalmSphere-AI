import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logMood } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Smile, Meh, Frown } from 'lucide-react';
import { toast } from 'sonner';

const MOOD_TAGS = [
  'Exam', 'Sleep', 'Social', 'Family', 'Exercise', 'Work', 'Study', 'Relationship'
];

export default function MoodLog() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await logMood({
        mood_rating: rating,
        tags: selectedTags,
        note: note || undefined
      });
      toast.success('Mood logged successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const getMoodIcon = () => {
    if (rating >= 7) return <Smile className="w-12 h-12 text-primary" />;
    if (rating >= 4) return <Meh className="w-12 h-12 text-accent" />;
    return <Frown className="w-12 h-12 text-chart-1" />;
  };

  return (
    <div className="min-h-screen bg-background bg-noise">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button
            data-testid="back-btn"
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="hover:bg-muted/50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-fraunces text-4xl md:text-5xl font-normal mb-4">How are you feeling?</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Track your mood to understand patterns over time
        </p>

        <form data-testid="mood-log-form" onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-float p-8 border border-border/40">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              {getMoodIcon()}
            </div>
            <div className="text-center mb-4">
              <span className="text-6xl font-bold text-primary">{rating}</span>
              <span className="text-muted-foreground ml-2">/ 10</span>
            </div>
            <input
              data-testid="mood-rating-slider"
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #4A6C58 0%, #4A6C58 ${(rating - 1) * 11.11}%, #E8E8E4 ${(rating - 1) * 11.11}%, #E8E8E4 100%)`
              }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">What's affecting your mood? (optional)</label>
            <div className="flex flex-wrap gap-2">
              {MOOD_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  data-testid={`mood-tag-${tag.toLowerCase()}`}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Add a note (optional)</label>
            <Input
              data-testid="mood-note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling? Any thoughts to capture?"
              className="w-full bg-white/50 border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl h-12 px-4"
            />
          </div>

          <Button
            data-testid="save-mood-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-lg font-medium shadow-soft hover:shadow-float transition-all"
          >
            {loading ? 'Saving...' : 'Log Mood'}
          </Button>
        </form>
      </div>
    </div>
  );
}