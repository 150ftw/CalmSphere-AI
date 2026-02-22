import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJournalEntries, createJournalEntry, getJournalPrompts } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, BookOpen, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

export default function Journal() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', tags: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [entriesRes, promptsRes] = await Promise.all([getJournalEntries(), getJournalPrompts()]);
      setEntries(entriesRes.data);
      setPrompts(promptsRes.data);
    } catch (error) {
      console.error('Failed to load journal data', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJournalEntry(formData);
      toast.success('Journal entry saved!');
      setShowNew(false);
      setFormData({ title: '', content: '', tags: [] });
      loadData();
    } catch (error) {
      toast.error('Failed to save entry');
    }
  };

  return (
    <div className="min-h-screen bg-background bg-noise">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Button data-testid="back-btn" onClick={() => navigate('/dashboard')} variant="ghost" className="hover:bg-muted/50 rounded-full">
            <ArrowLeft className="w-5 h-5 mr-2" />Back
          </Button>
          <Button data-testid="new-entry-btn" onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
            New Entry
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-fraunces text-4xl md:text-5xl font-normal mb-4">Journal</h1>
        <p className="text-lg text-muted-foreground mb-8">Reflect on your thoughts and track your journey</p>

        {/* Writing Prompts */}
        {!showNew && prompts.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-accent" />
              <h3 className="font-medium">Writing Prompts</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {prompts.slice(0, 4).map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowNew(true);
                    setFormData({ ...formData, title: p.type, content: `${p.prompt}\n\n` });
                  }}
                  className="p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all text-left text-sm"
                >
                  {p.prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {showNew && (
          <div className="bg-card rounded-2xl shadow-float p-8 border border-border/40 mb-8">
            <h2 className="font-fraunces text-2xl font-medium mb-6">New Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Title (optional)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/50 border-border/60 rounded-xl h-12 px-4"
              />
              <textarea
                required
                placeholder="Write your thoughts..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full bg-white/50 border border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl p-4 resize-none"
              />
              <div className="flex gap-3">
                <Button type="button" onClick={() => setShowNew(false)} variant="outline" className="flex-1 rounded-full">Cancel</Button>
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">Save Entry</Button>
              </div>
            </form>
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft">
              {entry.title && <h3 className="font-medium text-lg mb-2">{entry.title}</h3>}
              <p className="text-muted-foreground mb-3 whitespace-pre-wrap">{entry.content.substring(0, 300)}{entry.content.length > 300 ? '...' : ''}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{new Date(entry.created_at).toLocaleDateString('en-IN')}</span>
                {entry.sentiment && <span className={`px-2 py-1 rounded-full ${
                  entry.sentiment === 'positive' ? 'bg-chart-4/10 text-chart-4' :
                  entry.sentiment === 'negative' ? 'bg-chart-1/10 text-chart-1' :
                  'bg-muted/50'
                }`}>{entry.sentiment}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}