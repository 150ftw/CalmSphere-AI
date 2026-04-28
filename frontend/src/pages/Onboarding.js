import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeOnboarding } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, ArrowLeft, Brain, ShieldCheck, Heart, Zap, Compass, Moon, Waves } from 'lucide-react';

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

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
      toast.success('Welcome to the Sanctuary.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Calibration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="mesh-bg opacity-30" />
      <div className="aura-blob top-0 right-0 opacity-20" />
      <div className="aura-blob bottom-0 left-0 opacity-20 animate-pulse" />

      <div className="w-full max-w-3xl z-10">
        <div className="luxury-card p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-10 right-10 flex items-center gap-2 opacity-20">
            <Sparkles className="w-4 h-4" />
            <span className="text-[9px] font-black tracking-widest uppercase">Step 0{step} / 03</span>
          </div>

          {step === 1 && (
            <div data-testid="onboarding-step-1" className="animate-fade-in relative z-10">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-10">
                <Compass className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="font-fraunces text-5xl md:text-6xl mb-6 italic">Calibration.</h2>
              <p className="text-xl text-primary/70 leading-relaxed font-fraunces mb-16">Tell us about your current path so we can mirror your rhythm.</p>

              <div className="space-y-10">
                <div>
                  <label className="text-[9px] font-black tracking-[0.3em] uppercase text-primary/70 block mb-4">Academic Year</label>
                  <Input
                    data-testid="year-input"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. Junior"
                    className="newsletter-input border-none px-0 text-2xl font-fraunces italic placeholder:text-primary/10"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black tracking-[0.3em] uppercase text-primary/70 block mb-4">Field of Study</label>
                  <Input
                    data-testid="branch-input"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g. Psychology"
                    className="newsletter-input border-none px-0 text-2xl font-fraunces italic placeholder:text-primary/10"
                  />
                </div>

                <button
                  data-testid="next-step-btn"
                  onClick={() => setStep(2)}
                  disabled={!formData.year || !formData.branch}
                  className="w-full bg-primary text-white rounded-full py-8 text-xs font-black tracking-[0.3em] uppercase shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:hover:scale-100"
                >
                  Continue Calibration <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div data-testid="onboarding-step-2" className="animate-fade-in relative z-10">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-10">
                <Waves className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="font-fraunces text-5xl md:text-6xl mb-6 italic">The Pulse.</h2>
              <p className="text-xl text-primary/70 leading-relaxed font-fraunces mb-12">What frequencies have you been feeling lately?</p>

              <div className="grid grid-cols-2 gap-4 mb-16">
                {CONCERNS.map((concern) => (
                  <button
                    key={concern}
                    onClick={() => toggleConcern(concern)}
                    className={`p-6 rounded-[2rem] border transition-all text-left group ${
                      formData.concerns.includes(concern)
                        ? 'bg-primary text-white border-primary shadow-xl scale-105'
                        : 'bg-white text-primary border-primary/5 hover:border-primary/20'
                    }`}
                  >
                    <div className="text-sm font-bold opacity-80">{concern}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white border border-primary/10 text-primary rounded-full py-8 text-xs font-black tracking-[0.3em] uppercase hover:bg-primary/5 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-primary text-white rounded-full py-8 text-xs font-black tracking-[0.3em] uppercase shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div data-testid="onboarding-step-3" className="animate-fade-in relative z-10">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-10">
                <ShieldCheck className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="font-fraunces text-5xl md:text-6xl mb-6 italic">Trust.</h2>
              
              <div className="bg-primary/5 rounded-[3rem] p-10 mb-12 border border-primary/5">
                <h3 className="text-[10px] font-black tracking-widest uppercase text-primary/60 mb-8 italic">— Sanctuary Protocol</h3>
                <ul className="space-y-6">
                  {[
                    "Supportive tool, not a clinical replacement.",
                    "Conversations are private & end-to-end encrypted.",
                    "Zero-knowledge storage architecture.",
                    "Immediate crisis resources always available."
                  ].map((text, i) => (
                    <li key={i} className="flex gap-4 text-sm font-medium opacity-60">
                      <Zap className="w-4 h-4 text-secondary flex-shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-start gap-4 mb-16 p-4">
                <Checkbox
                  checked={formData.consent_given}
                  onCheckedChange={(checked) => setFormData({ ...formData, consent_given: checked })}
                  id="consent"
                  className="mt-1 border-primary/20"
                />
                <label htmlFor="consent" className="text-[10px] font-bold text-primary/40 tracking-wide leading-relaxed cursor-pointer">
                  I understand that CalmSphere AI is a <span className="text-primary font-black">self-help tool</span> and I acknowledge the crisis protocols.
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-white border border-primary/10 text-primary rounded-full py-8 text-xs font-black tracking-[0.3em] uppercase hover:bg-primary/5 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.consent_given}
                  className="flex-[2] bg-primary text-white rounded-full py-8 text-xs font-black tracking-[0.3em] uppercase shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                >
                  Enter Sanctuary <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3 mt-16">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-700 ${
                  s === step ? 'w-12 bg-secondary shadow-lg' : 'w-4 bg-primary/5'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}