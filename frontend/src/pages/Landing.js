import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircleHeart, Activity, Shield, Users } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background bg-noise">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-20 pb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <p className="text-sm font-medium tracking-wide uppercase text-muted-foreground/80 mb-4">
                Supporting UN SDG-3: Good Health & Well-being
              </p>
              <h1 className="font-fraunces text-5xl md:text-7xl font-light tracking-tight leading-[1.1] mb-6">
                Your Mental Health
                <span className="text-gradient"> Companion</span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-8">
                CalmSphere AI provides empathetic support, science-backed assessments, and personalized coping strategies for college students navigating stress, anxiety, and life's challenges.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  data-testid="get-started-btn"
                  onClick={() => navigate('/login')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-medium shadow-soft hover:shadow-float hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started
                </Button>
                <Button
                  data-testid="sign-in-btn"
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="bg-white/50 hover:bg-white/70 rounded-full px-8 py-6 text-lg font-medium border-border/60"
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <img
                src="https://images.unsplash.com/photo-1763890498949-efd5d4acb8ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMGNvbGxlZ2UlMjBzdHVkZW50JTIwb3V0ZG9vcnN8ZW58MHx8fHwxNzY4NDYyODQwfDA&ixlib=rb-4.1.0&q=85"
                alt="Student reading peacefully"
                className="rounded-3xl shadow-float w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-32">
        <h2 className="font-fraunces text-4xl md:text-5xl font-normal tracking-tight text-center mb-16">
          Your Well-being Toolkit
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft hover:shadow-float hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircleHeart className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="font-fraunces text-2xl font-medium mb-2">Empathetic AI Chat</h3>
            <p className="text-muted-foreground leading-relaxed">
              Talk to CalmSphere AI anytime. Get supportive, judgment-free conversations when you need them most.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft hover:shadow-float hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-secondary" strokeWidth={1.5} />
            </div>
            <h3 className="font-fraunces text-2xl font-medium mb-2">Self-Assessments</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track your mental health with validated PHQ-9 and GAD-7 assessments. Understand your patterns.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft hover:shadow-float hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="font-fraunces text-2xl font-medium mb-2">Crisis Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              Immediate detection and resources for crisis situations. Your safety is our priority.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft hover:shadow-float hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-full bg-chart-3/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-chart-3" strokeWidth={1.5} />
            </div>
            <h3 className="font-fraunces text-2xl font-medium mb-2">Anonymized Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              Privacy-first design. Use pseudonymous accounts and share only what you're comfortable with.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        <div className="bg-muted/30 rounded-2xl p-8 border border-border/40">
          <h3 className="font-fraunces text-2xl font-medium mb-4">Important Notice</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            CalmSphere AI is a <strong>supportive tool</strong>, not a replacement for professional mental health care. 
            It is <strong>not a substitute for professional therapy</strong> and does not provide 
            medical diagnoses or treatment recommendations.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            If you're experiencing a mental health crisis, please contact KIRAN helpline (1800-599-0019) 
            or your campus counseling center immediately. CalmSphere AI encourages and facilitates connections 
            to professional support when needed.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="text-muted-foreground">
            © 2025 CalmSphere AI | Aligned with UN Sustainable Development Goal 3: Good Health and Well-being
          </p>
        </div>
      </footer>
    </div>
  );
}