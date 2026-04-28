import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  ArrowLeft, 
  Zap, 
  ShieldCheck, 
  Dna, 
  Activity, 
  Microscope,
  Waves,
  Cpu
} from 'lucide-react';

const Science = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('algorithm');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = {
    algorithm: {
      title: "The Empathy Algorithm",
      desc: "Our proprietary neural network designed to decode the subtle frequencies of human emotion.",
      details: [
        "Real-time speech cadence analysis to detect stress markers.",
        "Linguistic pattern recognition for cognitive load monitoring.",
        "Adaptive response mirroring for genuine empathetic connection.",
        "Multi-modal feedback loops that evolve with your unique rhythm."
      ]
    },
    neuro: {
      title: "Neuro-Feedback Systems",
      desc: "Integrating physiological data with digital environments to create perfect focus states.",
      details: [
        "Synchronization with wearable heart-rate variability (HRV) data.",
        "Binaural soundscapes tuned to Alpha and Theta brainwaves.",
        "Visual environments that adapt color temperature based on cortisol levels.",
        "Guided deceleration journeys for immediate panic reduction."
      ]
    },
    privacy: {
      title: "Privacy by Architecture",
      desc: "Science doesn't have to mean surveillance. Your mind remains yours.",
      details: [
        "RSA-4096 end-to-end encryption for all emotional data.",
        "On-device processing for immediate sentiment detection.",
        "Zero-knowledge storage protocols for historical insights.",
        "Self-sovereign data identity for every sanctuary member."
      ]
    }
  };

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
            <span className="font-fraunces text-xl font-bold">Science.</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-black tracking-[0.3em] uppercase mb-10">
            <Dna className="w-3 h-3 text-secondary" />
            <span>Founded in Neuroscience</span>
          </div>
          <h1 className="font-fraunces text-6xl md:text-9xl mb-12 italic">
            The Digital <br />
            <span className="text-secondary">Consciousness.</span>
          </h1>
          <p className="text-xl text-primary/40 leading-relaxed font-fraunces max-w-2xl mx-auto">
            "We aren't just building a bot. We're building a mirror for the human soul, calibrated by the latest breakthroughs in affective computing."
          </p>
        </div>
      </section>

      {/* Science Interactive Bento */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-4 space-y-4">
              {Object.keys(sections).map((key) => (
                <div 
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`p-10 rounded-[2.5rem] cursor-pointer transition-all border ${activeTab === key ? 'bg-primary text-white border-primary shadow-2xl scale-105' : 'bg-white text-primary border-primary/5 hover:border-primary/20'}`}
                >
                  <div className="text-[9px] font-black tracking-widest uppercase opacity-40 mb-4 italic">— 0{Object.keys(sections).indexOf(key) + 1}</div>
                  <h3 className="text-2xl font-fraunces italic">{sections[key].title}</h3>
                </div>
              ))}
            </div>

            {/* Content Display */}
            <div className="lg:col-span-8 luxury-card p-16 md:p-24 relative overflow-hidden">
              <div className="aura-blob -top-20 -right-20 opacity-20" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-10">
                  {activeTab === 'algorithm' && <Cpu className="w-10 h-10 text-secondary" />}
                  {activeTab === 'neuro' && <Activity className="w-10 h-10 text-secondary" />}
                  {activeTab === 'privacy' && <ShieldCheck className="w-10 h-10 text-secondary" />}
                </div>
                <h2 className="font-fraunces text-4xl md:text-6xl mb-8 italic">{sections[activeTab].title}</h2>
                <p className="text-xl text-primary/50 leading-relaxed mb-16">{sections[activeTab].desc}</p>
                <div className="grid md:grid-cols-2 gap-12">
                  {sections[activeTab].details.map((detail, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <p className="text-sm font-medium leading-relaxed opacity-80">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Science Stats */}
      <section className="py-40 bg-primary text-white relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-24 text-center">
            <div>
              <div className="text-6xl font-fraunces text-secondary mb-4 italic">94%</div>
              <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Sentiment Accuracy</p>
            </div>
            <div>
              <div className="text-6xl font-fraunces text-secondary mb-4 italic">2.4k+</div>
              <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Neural Models Trained</p>
            </div>
            <div>
              <div className="text-6xl font-fraunces text-secondary mb-4 italic">12ms</div>
              <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Emotional Latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 text-center px-6">
        <div className="max-w-2xl mx-auto">
          <Microscope className="w-12 h-12 text-primary/10 mx-auto mb-10" />
          <h2 className="font-fraunces text-4xl md:text-6xl mb-10 italic">Observe. Breathe. <br />Understand.</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-16 py-8 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-2xl"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      <footer className="py-20 border-t border-primary/5 text-center">
        <div className="text-[9px] font-black tracking-widest uppercase text-primary/20">
          &copy; 2026 CalmSphere AI Sanctuary — Built on Empathy.
        </div>
      </footer>
    </div>
  );
};

export default Science;
