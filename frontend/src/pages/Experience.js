import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Moon, 
  Sun, 
  Wind, 
  Coffee, 
  Anchor, 
  Waves,
  Heart,
  Compass
} from 'lucide-react';

const Experience = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const rituals = [
    { 
      time: "08:00 AM", 
      title: "Morning Calibration", 
      desc: "Begin your day with a soft vocal check-in. Calmi mirrors your energy and suggests a soundscape to set your baseline focus.",
      icon: <Sun />
    },
    { 
      time: "02:00 PM", 
      title: "Mid-Day Stillness", 
      desc: "A 5-minute guided breathing ritual that adapts to your physiological stress markers in real-time.",
      icon: <Wind />
    },
    { 
      time: "09:00 PM", 
      title: "The Deceleration", 
      desc: "Interactive sleep stories that slow down in pace as your breathing synchronizes with the narration.",
      icon: <Moon />
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
            <Sparkles className="w-5 h-5 text-secondary" />
            <span className="font-fraunces text-xl font-bold">Experience.</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-black tracking-[0.3em] uppercase mb-10">
            <Compass className="w-3 h-3 text-secondary" />
            <span>The Journey Inward</span>
          </div>
          <h1 className="font-fraunces text-6xl md:text-9xl mb-12 italic">
            A Day in <br />
            <span className="text-secondary">Stillness.</span>
          </h1>
          <p className="text-xl text-primary/40 leading-relaxed font-fraunces max-w-2xl mx-auto">
            "Experience a digital space that doesn't demand your attention, but restores it. This is what it feels like to live with CalmSphere AI."
          </p>
        </div>
      </section>

      {/* Full Width Visual */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="aspect-[21/9] rounded-[4rem] overflow-hidden luxury-card shadow-2xl relative">
            <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000" className="w-full h-full object-cover opacity-80" alt="Meditation" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            <div className="absolute bottom-20 left-20">
              <div className="text-[10px] font-black tracking-widest uppercase text-white/60 mb-4">— Current Ritual</div>
              <h2 className="text-4xl md:text-6xl font-fraunces text-white italic">The Art of Listening.</h2>
            </div>
          </div>
        </div>
      </section>

      {/* The Ritual Timeline */}
      <section className="py-40 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-32">
            {rituals.map((ritual, i) => (
              <div key={i} className={`flex flex-col md:flex-row gap-20 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary mb-10">
                    {ritual.icon}
                  </div>
                  <div className="text-[10px] font-black tracking-widest uppercase text-secondary mb-4 italic">{ritual.time}</div>
                  <h3 className="text-4xl md:text-6xl font-fraunces italic mb-8">{ritual.title}</h3>
                  <p className="text-xl text-primary/50 leading-relaxed">{ritual.desc}</p>
                </div>
                <div className="md:w-1/2 w-full">
                  <div className="aspect-square rounded-[3rem] overflow-hidden luxury-card group">
                    <img 
                      src={`https://images.unsplash.com/photo-${i === 0 ? '1494438639946-1ebd1d20bf85' : i === 1 ? '1518199266791-5375a83190b7' : '1506126613408-eca07ce68773'}?q=80&w=1000`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                      alt="Ritual" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Breath */}
      <section className="py-40 bg-muted/30">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <Waves className="w-16 h-16 text-primary/10 mx-auto mb-10" />
          <h2 className="font-fraunces text-5xl md:text-7xl mb-12 italic">Return to <br />your Rhythm.</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-16 py-8 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-2xl"
          >
            Experience Calmi
          </button>
        </div>
      </section>

      <footer className="py-20 border-t border-primary/5 text-center">
        <div className="text-[9px] font-black tracking-widest uppercase text-primary/20">
          &copy; 2026 CalmSphere AI Sanctuary — Designed for Humanity.
        </div>
      </footer>
    </div>
  );
};

export default Experience;
