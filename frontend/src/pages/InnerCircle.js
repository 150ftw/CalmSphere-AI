import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Crown, 
  Star, 
  Gem, 
  Users, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  Heart
} from 'lucide-react';

const InnerCircle = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tiers = [
    { 
      name: "Sanctuary", 
      desc: "Fundamental care for the modern mind.",
      price: "Free",
      benefits: ["Daily AI check-ins", "Neural soundscapes", "Private journal"],
      accent: "rgba(255,255,255,0.05)"
    },
    { 
      name: "Grove", 
      desc: "Deepened support for consistent peace.",
      price: "$9/mo",
      featured: true,
      benefits: ["Unlimited sessions", "Advanced analytics", "Sleep sanctuary", "Community clusters"],
      accent: "rgba(212, 122, 96, 0.1)"
    },
    { 
      name: "Horizon", 
      desc: "The ultimate tier of personalized wellness.",
      price: "$19/mo",
      benefits: ["Health concierge", "Priority latency", "Wearable sync", "Family sanctuary"],
      accent: "rgba(147, 197, 253, 0.1)"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-secondary selection:text-white overflow-hidden">
      {/* Dynamic Star Field Background */}
      <div className="absolute inset-0 z-0">
        <div className="mesh-bg opacity-10" />
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="glow-particle"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              "--duration": `${Math.random() * 20 + 10}s`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`
            }}
          />
        ))}
      </div>

      {/* Premium Back Nav */}
      <nav className="fixed top-0 w-full z-50 px-8 py-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group text-[9px] font-black tracking-[0.3em] uppercase text-white/40 hover:text-white transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Sanctuary
          </button>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-secondary" />
            <span className="font-fraunces text-xl font-bold">Inner Circle.</span>
          </div>
        </div>
      </nav>

      {/* Hero Section - Exclusive Dark */}
      <section className="relative pt-60 pb-40 px-6 z-10">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-[0.4em] uppercase mb-12">
            <Gem className="w-3 h-3 text-secondary" />
            <span>The Black Label Experience</span>
          </div>
          <h1 className="font-fraunces text-7xl md:text-[11rem] leading-[0.8] mb-16 italic">
            Belong to the <br />
            <span className="text-secondary">Pulse.</span>
          </h1>
          <p className="text-2xl text-white/40 leading-relaxed font-fraunces max-w-2xl mx-auto mb-20">
            "We don't just provide a service. We provide a circle. A high-end community of students and researchers dedicated to mental sovereignty."
          </p>
        </div>
      </section>

      {/* Membership Tiers - Horizontal Scroll or Grid */}
      <section className="relative pb-60 px-6 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <div 
                key={i} 
                className={`relative p-16 rounded-[4rem] border transition-all duration-700 hover:-translate-y-4 group overflow-hidden ${tier.featured ? 'bg-white text-primary border-white scale-105 z-20' : 'bg-white/5 text-white border-white/10'}`}
              >
                {/* Decorative background glow for tier */}
                <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 pointer-events-none" style={{ background: tier.accent }} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 ${tier.featured ? 'bg-primary/5 text-secondary' : 'bg-white/10 text-secondary'}`}>
                    {i === 0 ? <Users className="w-6 h-6" /> : i === 1 ? <Crown className="w-6 h-6" /> : <Gem className="w-6 h-6" />}
                  </div>
                  <h3 className="text-3xl font-fraunces italic mb-4">{tier.name}</h3>
                  <p className={`text-sm mb-12 opacity-60`}>{tier.desc}</p>
                  <div className="text-5xl font-fraunces mb-16">{tier.price}</div>
                  
                  <div className="space-y-6 mb-20">
                    {tier.benefits.map((b, j) => (
                      <div key={j} className="flex items-center gap-4 text-sm font-medium">
                        <ShieldCheck className="w-4 h-4 text-secondary" />
                        {b}
                      </div>
                    ))}
                  </div>
                  
                  <button className={`w-full py-6 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${tier.featured ? 'bg-primary text-white hover:scale-105 shadow-2xl' : 'bg-white text-primary hover:bg-secondary hover:text-white'}`}>
                    Select {tier.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stats - Dark Contrast */}
      <section className="py-40 bg-white text-primary relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-32 items-center">
            <div>
              <h2 className="font-fraunces text-5xl md:text-7xl italic mb-10">The Global <br />Network.</h2>
              <p className="text-xl text-primary/50 leading-relaxed mb-12">
                Join a network of over <span className="text-primary font-bold">2,400+ members</span> across the world's leading academic institutions. We are a sanctuary built on collective peace.
              </p>
              <div className="flex gap-12 pt-10 border-t border-primary/5">
                <div>
                  <div className="text-4xl font-fraunces text-secondary mb-2 italic">120+</div>
                  <div className="text-[9px] font-black tracking-widest uppercase opacity-40">Universities</div>
                </div>
                <div>
                  <div className="text-4xl font-fraunces text-secondary mb-2 italic">12k+</div>
                  <div className="text-[9px] font-black tracking-widest uppercase opacity-40">Shared Sessions</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-[3rem] overflow-hidden luxury-card shadow-xl">
                  <img src={`https://images.unsplash.com/photo-${i === 0 ? '1511632765486-a01980e01a18' : i === 1 ? '1529156069898-49953e39b3ac' : i === 2 ? '1523240715639-99a8086f7344' : '1517486808906-6ca8b3f04846'}?q=80&w=800`} className="w-full h-full object-cover" alt="Community" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call */}
      <section className="py-60 text-center px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <Star className="w-16 h-16 text-secondary mx-auto mb-12 animate-pulse" />
          <h2 className="font-fraunces text-6xl md:text-8xl mb-16 italic">Ready to <br />Belong?</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-secondary text-white px-16 py-8 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-2xl"
          >
            Enter the Circle
          </button>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center relative z-10">
        <div className="text-[9px] font-black tracking-widest uppercase text-white/20">
          &copy; 2026 CalmSphere AI — The Inner Circle Experience.
        </div>
      </footer>
    </div>
  );
};

export default InnerCircle;
