import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Sparkles, ArrowLeft, ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/input';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, register, user, loading: authLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  // Parallax effect for login card
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize Native Google Sign-In
  useEffect(() => {
    const initGoogle = () => {
      if (window.google && !isRegister) {
        window.google.accounts.id.initialize({
          client_id: "935921317184-at852s89dj1om80ea6vencbj260nmt8j.apps.googleusercontent.com",
          callback: handleGoogleSuccess
        });
        
        const googleBtn = document.getElementById("googleSignInDiv");
        if (googleBtn) {
          window.google.accounts.id.renderButton(
            googleBtn,
            { theme: "outline", size: "large", shape: "pill", width: "320" }
          );
        }
      }
    };

    // Give the script a moment to load if it hasn't yet
    const timer = setTimeout(initGoogle, 500);
    return () => clearTimeout(timer);
  }, [isRegister]);

  // If user already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success("Welcome to the sanctuary.");
      navigate('/dashboard');
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error("Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password);
        toast.success("Sanctuary identity created.");
        navigate('/onboarding');
      } else {
        await login(formData.email, formData.password);
        toast.success("Welcome back to the sanctuary.");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.detail || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        <div className="mesh-bg opacity-30" />
        <div className="text-center z-10">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-10 shadow-2xl"></div>
          <h2 className="font-fraunces text-4xl italic text-primary">Entering the Sanctuary...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="mesh-bg opacity-30" />
      <div className="aura-blob top-1/4 right-0 opacity-20 animate-pulse" />
      <div className="aura-blob bottom-1/4 left-0 opacity-20" />
      
      <div 
        className="w-full max-w-lg z-10 transition-transform duration-75"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      >
        <div className="luxury-card p-12 md:p-16 relative overflow-hidden">
          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center gap-3 group cursor-pointer mb-8" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-fraunces text-2xl font-bold tracking-tight text-primary">CalmSphere AI</span>
            </div>
            <h1 className="font-fraunces text-4xl italic text-primary mb-4">
              {isRegister ? "Begin Your Path." : "Welcome Home."}
            </h1>
            <p className="text-base text-primary/40 font-fraunces">The sanctuary is yours.</p>
          </div>

          {!isRegister && (
            <div className="flex justify-center mb-10 relative z-10 scale-110">
              <div id="googleSignInDiv"></div>
            </div>
          )}

          {!isRegister && (
            <div className="relative mb-10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-primary/5"></div></div>
              <span className="relative bg-white px-6 text-[8px] font-black tracking-[0.4em] uppercase text-primary/20">or enter via identity</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6 relative z-10">
            {isRegister && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                <Input
                  required
                  autoComplete="new-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  className="bg-transparent border-none border-b border-primary/10 pl-16 pr-8 py-8 text-2xl font-fraunces italic text-primary placeholder:text-primary/60 w-full focus:ring-0 focus:border-primary/30 transition-all rounded-none"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
              <Input
                required
                type="email"
                autoComplete="new-email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="bg-transparent border-none border-b border-primary/10 pl-16 pr-8 py-8 text-2xl font-fraunces italic text-primary placeholder:text-primary/60 w-full focus:ring-0 focus:border-primary/30 transition-all rounded-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
              <Input
                required
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="bg-transparent border-none border-b border-primary/10 pl-16 pr-8 py-8 text-2xl font-fraunces italic text-primary placeholder:text-primary/60 w-full focus:ring-0 focus:border-primary/30 transition-all rounded-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white rounded-full py-6 text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 disabled:opacity-30 mt-8"
            >
              {loading ? "Establishing Connection..." : (isRegister ? "Create Sanctuary Identity" : "Enter Sanctuary")} 
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-[10px] font-black tracking-widest uppercase text-primary/70 hover:text-primary transition-all underline decoration-primary/10 underline-offset-8"
            >
              {isRegister ? "Already have an identity? Enter here" : "No identity yet? Begin path here"}
            </button>
          </div>
        </div>

        <div className="mt-8 luxury-card p-8 border-primary/5 bg-primary/5">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-[9px] font-bold text-primary/70 tracking-wide leading-relaxed">
              Your identity is protected by <span className="text-primary font-black">Sovereign Encryption</span>. 
              We never share your personal path with third parties.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 mx-auto text-[9px] font-black tracking-[0.3em] uppercase text-primary/60 hover:text-primary transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            Return to Horizon
          </button>
        </div>
      </div>
    </div>
  );
}
