import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeOnboarding } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';

const CONCERNS = [
  'Academic Stress',
  'Anxiety',
  'Depression',
  'Sleep Problems',
  'Relationship Issues',
  'Family Problems',
  'Social Isolation',
  'Time Management',
  'Career Anxiety',
  'Other'
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    year: '',
    branch: '',
    concerns: [],
    consent_given: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const toggleConcern = (concern) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.consent_given) {
      toast.error('Please provide consent to continue');
      return;
    }

    try {
      await completeOnboarding(formData);
      toast.success('Welcome to CalmSphere AI!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to complete onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-background bg-noise flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-2xl shadow-float p-8 md:p-12 border border-border/40">
          {step === 1 && (
            <div data-testid="onboarding-step-1" className="space-y-6 animate-fade-in">
              <h2 className="font-fraunces text-3xl font-normal mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground mb-6">This helps us personalize your experience</p>

              <div>
                <label className="block text-sm font-medium mb-2">Academic Year</label>
                <Input
                  data-testid="year-input"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g., Freshman, Sophomore, Junior, Senior"
                  className="w-full bg-white/50 border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl h-12 px-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Field of Study</label>
                <Input
                  data-testid="branch-input"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g., Computer Science, Psychology, Biology"
                  className="w-full bg-white/50 border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl h-12 px-4"
                />
              </div>

              <Button
                data-testid="next-step-btn"
                onClick={() => setStep(2)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-lg font-medium shadow-soft hover:shadow-float transition-all"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div data-testid="onboarding-step-2" className="space-y-6 animate-fade-in">
              <h2 className="font-fraunces text-3xl font-normal mb-2">What brings you here?</h2>
              <p className="text-muted-foreground mb-6">Select all that apply (optional)</p>

              <div className="grid grid-cols-2 gap-3">
                {CONCERNS.map((concern) => (
                  <button
                    key={concern}
                    data-testid={`concern-${concern.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => toggleConcern(concern)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.concerns.includes(concern)
                        ? 'border-primary bg-primary/5'
                        : 'border-border/40 hover:border-primary/30'
                    }`}
                  >
                    <span className="text-sm font-medium">{concern}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  data-testid="back-btn"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 bg-white/50 hover:bg-white/70 rounded-full py-6 text-lg font-medium border-border/60"
                >
                  Back
                </Button>
                <Button
                  data-testid="next-step-2-btn"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-lg font-medium shadow-soft hover:shadow-float transition-all"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div data-testid="onboarding-step-3" className="space-y-6 animate-fade-in">
              <h2 className="font-fraunces text-3xl font-normal mb-2">Important Information</h2>
              
              <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                <h3 className="font-medium text-lg">Understanding CalmSphere AI</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• CalmSphere AI is a <strong>supportive tool</strong>, not a replacement for professional therapy</li>
                  <li>• We do not diagnose conditions or prescribe medications</li>
                  <li>• Your conversations are private and can be pseudonymous</li>
                  <li>• In crisis situations, we provide immediate resources and encourage professional help</li>
                  <li>• Counselors may access anonymized, aggregated data only</li>
                </ul>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  data-testid="consent-checkbox"
                  checked={formData.consent_given}
                  onCheckedChange={(checked) => setFormData({ ...formData, consent_given: checked })}
                  id="consent"
                  className="mt-1"
                />
                <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                  I understand that CalmSphere AI is a self-help tool and not a substitute for professional mental health care. 
                  I acknowledge that in case of emergency, I should contact crisis services or emergency services immediately.
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  data-testid="back-btn-2"
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 bg-white/50 hover:bg-white/70 rounded-full py-6 text-lg font-medium border-border/60"
                >
                  Back
                </Button>
                <Button
                  data-testid="complete-onboarding-btn"
                  onClick={handleSubmit}
                  disabled={!formData.consent_given}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-lg font-medium shadow-soft hover:shadow-float transition-all disabled:opacity-50"
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}