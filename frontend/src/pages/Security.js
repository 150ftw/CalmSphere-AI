import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Lock, 
  EyeOff, 
  Fingerprint, 
  Database,
  CloudOff,
  Key,
  ShieldAlert
} from 'lucide-react';

const Security = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const protocols = [
    { 
      title: "RSA-4096 Encryption", 
      desc: "Every interaction is encrypted with military-grade protocols before it ever leaves your device.",
      icon: <Lock />
    },
    { 
      title: "Zero-Knowledge Storage", 
      desc: "We don't hold the keys to your thoughts. Only you can decrypt and access your historical data.",
      icon: <Database />
    },
    { 
      title: "On-Device Processing", 
      desc: "Calmi processes your sentiment and rhythm locally, minimizing cloud exposure for your most private moments.",
      icon: <CloudOff />
    },
    { 
      title: "Data Sovereignty", 
      desc: "You own 100% of your emotional data. Export it or erase it instantly with a single command.",
      icon: <Fingerprint />
    }
  ];

  return (
    <div className="min-h-screen bg-white text-primary selection:bg-primary selection:text-white overflow-hidden">
      <div className="mesh-bg opacity-30" />
      
      {/* Premium Back Nav */}
      <nav className="fixed top-0 w-full z-50 px-8 py-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group text-[9px] font-black tracking-[0.3em] uppercase text-primary/40 hover:text-primary transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Sanctuary
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="font-fraunces text-xl font-bold">Security.</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-black tracking-[0.3em] uppercase mb-10">
            <Key className="w-3 h-3 text-secondary" />
            <span>Built on Trust</span>
          </div>
          <h1 className="font-fraunces text-6xl md:text-9xl mb-12 italic">
            The Fortress <br />
            <span className="text-secondary">of Mind.</span>
          </h1>
          <p className="text-xl text-primary/40 leading-relaxed font-fraunces max-w-2xl mx-auto">
            "Your privacy isn't a feature. It's our foundation. We've built CalmSphere AI to be the most secure space for your inner world."
          </p>
        </div>
      </section>

      {/* The Protocol Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {protocols.map((p, i) => (
              <div key={i} className="luxury-card p-16 hover:bg-primary hover:text-white transition-all group">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-white/10 group-hover:text-white mb-10">
                  {p.icon}
                </div>
                <h3 className="text-3xl font-fraunces italic mb-6">{p.title}</h3>
                <p className="text-lg opacity-50 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Manifesto */}
      <section className="py-40 bg-muted/20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="luxury-card p-20 border-primary/5 relative">
            <ShieldAlert className="w-20 h-20 text-primary/5 absolute top-10 right-10" />
            <h2 className="font-fraunces text-4xl md:text-6xl mb-12 italic">Our Privacy <br />Manifesto.</h2>
            <div className="space-y-10 text-xl text-primary/60 font-fraunces leading-relaxed">
              <p>1. Your data is never sold. Ever.</p>
              <p>2. We use edge-computing to ensure your voice analysis happens on your hardware whenever possible.</p>
              <p>3. We implement quarterly third-party audits of our encryption tunnels.</p>
              <p>4. CalmSphere AI is GDPR, HIPAA, and CCPA compliant by design, not just by policy.</p>
            </div>
            <div className="mt-20 pt-10 border-t border-primary/5">
              <div className="font-black text-[10px] tracking-widest uppercase text-primary/30 italic">Certified Secure — 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 text-center px-6">
        <div className="max-w-2xl mx-auto">
          <EyeOff className="w-12 h-12 text-primary/10 mx-auto mb-10" />
          <h2 className="font-fraunces text-4xl md:text-6xl mb-10 italic">Total Privacy. <br />No Compromise.</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-16 py-8 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-2xl"
          >
            Enter Securely
          </button>
        </div>
      </section>

      <footer className="py-20 border-t border-primary/5 text-center">
        <div className="text-[9px] font-black tracking-widest uppercase text-primary/20">
          &copy; 2026 CalmSphere AI Sanctuary — Encrypted for Peace.
        </div>
      </footer>
    </div>
  );
};

export default Security;
