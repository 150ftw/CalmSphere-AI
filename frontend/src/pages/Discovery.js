import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Compass, 
  Play, 
  Search, 
  Filter, 
  Waves, 
  Brain, 
  Moon, 
  Wind,
  Plus
} from 'lucide-react';

const Discovery = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const items = [
    { title: "Alpha Waves", cat: "Focus", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000", icon: <Brain /> },
    { title: "Oceanic Breath", cat: "Rest", img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000", icon: <Waves /> },
    { title: "Midnight Forest", cat: "Sleep", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000", icon: <Moon /> },
    { title: "Zen Garden", cat: "Focus", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000", icon: <Wind /> },
    { title: "Celestial Loop", cat: "Sleep", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000", icon: <Sparkles /> },
    { title: "Rain of Thought", cat: "Rest", img: "https://images.unsplash.com/photo-1523240715639-99a8086f7344?q=80&w=1000", icon: <Play /> }
  ];

  const filteredItems = filter === 'All' ? items : items.filter(i => i.cat === filter);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-primary selection:bg-primary selection:text-white overflow-hidden">
      {/* Visual Header */}
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Discovery" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-[#F8FAFC]" />
        
        <nav className="absolute top-0 w-full z-50 px-8 py-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group text-[9px] font-black tracking-[0.3em] uppercase text-primary/40 hover:text-primary transition-all">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><ArrowLeft className="w-4 h-4" /></div>
              Sanctuary
            </button>
            <div className="flex items-center gap-2"><Compass className="w-5 h-5 text-secondary" /><span className="font-fraunces text-xl font-bold">Discovery.</span></div>
          </div>
        </nav>

        <div className="relative z-10 text-center px-6">
          <h1 className="font-fraunces text-7xl md:text-9xl mb-8 italic">The Toolkit.</h1>
          <p className="text-xl text-primary/40 font-fraunces max-w-xl mx-auto">Explore our curated collection of sensory rituals and neuro-feedback tools.</p>
        </div>
      </header>

      {/* Filter System */}
      <section className="py-10 border-b border-primary/5 sticky top-0 z-40 bg-[#F8FAFC]/80 backdrop-blur-md px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-10">
            {['All', 'Focus', 'Rest', 'Sleep'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[9px] font-black tracking-[0.3em] uppercase transition-all ${filter === cat ? 'text-primary' : 'text-primary/20 hover:text-primary/40'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4 text-primary/20">
            <Search className="w-4 h-4" />
            <span className="text-[9px] font-black tracking-widest uppercase">Search Library</span>
          </div>
        </div>
      </section>

      {/* Discovery Gallery */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.map((item, i) => (
              <div key={i} className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden luxury-card cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700">
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="absolute bottom-10 left-10 right-10 translate-y-10 group-hover:translate-y-0 transition-all duration-700">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[9px] font-black tracking-widest uppercase text-secondary mb-2 italic">— {item.cat}</div>
                      <h3 className="text-3xl font-fraunces text-white italic">{item.title}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-xl group-hover:rotate-12 transition-transform">
                      {item.icon}
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-10 right-10 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:bg-white hover:text-primary transition-all">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loading Momentum */}
      <section className="py-40 text-center">
        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-10 animate-spin-slow">
          <Sparkles className="w-10 h-10 text-secondary/30" />
        </div>
        <p className="text-[9px] font-black tracking-[0.4em] uppercase text-primary/20">Discovery Endless Peace</p>
      </section>

      <footer className="py-20 border-t border-primary/5 text-center">
        <div className="text-[9px] font-black tracking-widest uppercase text-primary/20">
          &copy; 2026 CalmSphere AI — Exploring the Modern Mind.
        </div>
      </footer>
    </div>
  );
};

export default Discovery;
