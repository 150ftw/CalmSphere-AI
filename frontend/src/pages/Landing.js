import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircleHeart, 
  Brain, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Heart,
  Moon,
  Cloud,
  ChevronRight,
  Plus,
  Compass,
  Wind,
  Github,
  Zap,
  Users,
  Shield,
  Star,
  CheckCircle2,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  HelpCircle,
  ChevronDown,
  Sun,
  Coffee,
  Waves,
  Music,
  BookOpen,
  Feather,
  Anchor,
  Globe,
  Crown,
  Play,
  Search,
  Dna
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const revealRefs = useRef([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [counters, setCounters] = useState({ users: 0, sessions: 0, rating: 0 });
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentAura, setCurrentAura] = useState('Anxious');
  
  // Typewriter logic for Hero Headline
  const [displayText, setDisplayText] = useState('True Aura.');
  const fullText = "True Aura.";
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.id === 'stats-section') {
              startCounters();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const handleTypewriter = () => {
    if (isTyping) return;
    setIsTyping(true);
    setDisplayText('');
    
    let current = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        current += fullText[i];
        setDisplayText(current);
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 150);
  };

  const startCounters = () => {
    let users = 0;
    let sessions = 0;
    let rating = 0;
    const interval = setInterval(() => {
      if (users < 2400) users += 60;
      if (sessions < 50000) sessions += 1250;
      if (rating < 98) rating += 2;
      
      setCounters({ users, sessions, rating });
      
      if (users >= 2400 && sessions >= 50000 && rating >= 98) {
        clearInterval(interval);
      }
    }, 30);
  };

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const auras = [
    { label: 'Anxious', color: '#D47A60', icon: <Waves /> },
    { label: 'Focused', color: '#0F172A', icon: <Brain /> },
    { label: 'Tired', color: '#64748B', icon: <Moon /> },
    { label: 'Inspired', color: '#FCD34D', icon: <Sparkles /> }
  ];

  const tools = [
    { title: "Neural Focus Flow", desc: "AI-generated soundscapes that sync with your brainwaves for deep work.", icon: <Brain /> },
    { title: "Guided Stillness", desc: "A personalized breathing journey that adjusts to your stress levels.", icon: <Wind /> },
    { title: "The Pulse", desc: "Real-time sentiment monitoring that helps you track your emotional rhythm.", icon: <Zap /> },
    { title: "Sleep Sanctuary", desc: "Interactive stories designed to decelerate the mind before rest.", icon: <Moon /> },
    { title: "Emotional Journal", desc: "A private space to offload thoughts, analyzed for patterns over time.", icon: <Feather /> },
    { title: "Global Circle", desc: "Join small, anonymous support clusters facilitated by CalmSphere AI.", icon: <Globe /> }
  ];

  const testimonials = [
    { name: "Sarah J.", role: "Computer Science Student", text: "Calmi actually listens. It's the first time an AI didn't feel like a script." },
    { name: "David M.", role: "Graduate Researcher", text: "The privacy aspect of CalmSphere is what sold me. A truly safe space for my thoughts." },
    { name: "Elena R.", role: "Design Lead", text: "The interface is beautiful, but the empathy from Calmi is what keeps me coming back." }
  ];

  const navLinks = [
    { label: 'Experience', path: '/experience' },
    { label: 'Toolkit', path: '/discovery' },
    { label: 'Science', path: '/science' },
    { label: 'Inner Circle', path: '/inner-circle' },
    { label: 'FAQ', path: '#faq' }
  ];

  return (
    <div className="min-h-screen selection:bg-primary selection:text-white bg-white overflow-hidden">
      {/* Premium Glass Nav */}
      <nav className="fixed top-0 w-full z-50 nav-blur-premium px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-fraunces text-2xl font-bold tracking-tight text-primary">CalmSphere AI</span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((item) => (
              <a 
                key={item.label} 
                href={item.path}
                onClick={(e) => {
                  if (item.path.startsWith('/')) {
                    e.preventDefault();
                    navigate(item.path);
                  }
                }}
                className="text-[9px] font-black tracking-[0.2em] uppercase text-primary/30 hover:text-primary transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-8 py-3 rounded-full text-[9px] font-black tracking-[0.2em] uppercase hover:scale-105 transition-all shadow-xl magnetic-btn"
          >
            Enter Sanctuary
          </button>
        </div>
      </nav>

      {/* Futuristic Hero */}
      <section className="relative min-h-screen flex items-center pt-20 px-6">
        <div className="mesh-bg" />
        <div className="hero-glow" style={{ transform: `translate(${-mousePos.x * 2}px, ${-mousePos.y * 2}px) translate(-50%, -50%)` }} />
        <div className="aura-blob top-1/4 right-0" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }} />
        
        <div className="container mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 z-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-black tracking-[0.3em] uppercase mb-10 staggered-reveal" ref={addToRefs}>
              <Zap className="w-3 h-3 text-secondary" />
              <span>The Next Era of CalmSphere AI</span>
            </div>
            <h1 
              className="font-fraunces text-7xl lg:text-[10rem] leading-[0.85] mb-12 staggered-reveal cursor-default" 
              ref={addToRefs} 
              style={{ transitionDelay: '0.1s' }}
              onMouseEnter={handleTypewriter}
            >
              {displayText.split(' ')[0]} <br />
              <span className="italic text-secondary">
                {displayText.split(' ')[1]}
                {isTyping && <span className="inline-block w-2 h-16 bg-secondary ml-2 animate-pulse" />}
              </span>
            </h1>
            <p className="text-2xl text-primary/50 leading-relaxed mb-16 max-w-xl staggered-reveal" ref={addToRefs} style={{ transitionDelay: '0.2s' }}>
              Meet <span className="text-primary font-black">Calmi,</span> your personal companion inside the first AI sanctuary built to mirror your emotional rhythm.
            </p>
            <div className="flex flex-wrap gap-6 staggered-reveal" ref={addToRefs} style={{ transitionDelay: '0.3s' }}>
              <button onClick={() => navigate('/login')} className="group bg-primary text-white px-12 py-6 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center gap-4 hover:shadow-2xl transition-all magnetic-btn">
                Talk to Calmi <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-8 py-6 rounded-full bg-white/50 backdrop-blur-xl border border-white/80">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-accent overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?u=${i + 60}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-[9px] font-black tracking-widest text-primary/30 uppercase">
                  <span className="text-primary font-black">Join 2,400+</span> Seeking Peace
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative staggered-reveal" ref={addToRefs} style={{ transitionDelay: '0.4s' }}>
            <div 
              className="relative w-full aspect-[4/5] rounded-[4rem] overflow-hidden luxury-card group shadow-2xl"
              style={{ transform: `rotateY(${mousePos.x * 0.2}deg) rotateX(${-mousePos.y * 0.2}deg)` }}
            >
              <div className="lamp-light" />
              <img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]" alt="CalmSphere Sanctuary" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
              <div className="absolute bottom-10 left-10 right-10 luxury-card p-8 translate-y-4 group-hover:translate-y-0 transition-all">
                <div className="text-[9px] font-black tracking-widest text-primary/20 uppercase mb-4 italic">— Talk to Calmi</div>
                <div className="flex gap-4 mb-4">
                  {auras.map((aura) => (
                    <div 
                      key={aura.label}
                      onClick={() => setCurrentAura(aura.label)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all ${currentAura === aura.label ? 'bg-primary text-white scale-110' : 'bg-accent/50 text-primary hover:bg-accent'}`}
                    >
                      {aura.icon}
                    </div>
                  ))}
                </div>
                <div className="text-xl font-fraunces leading-relaxed">"Feeling <span className="text-secondary font-bold">{currentAura}</span> today."</div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-primary/20">Explore CalmSphere</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Trust Logo Bar - Infinite Marquee */}
      <section className="border-y border-primary/5">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...['STANFORD', 'COLUMBIA', 'MIT WELLNESS', 'OXFORD', 'CAMBRIDGE'], ...['STANFORD', 'COLUMBIA', 'MIT WELLNESS', 'OXFORD', 'CAMBRIDGE']].map((logo, i) => (
              <span key={i} className="text-xs font-black tracking-[0.4em] text-primary/60 opacity-60 hover:opacity-100 transition-opacity cursor-default">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* The Tranquility Toolkit */}
      <section id="toolkit" className="py-40">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-32 reveal-on-scroll" ref={addToRefs}>
            <div className="text-[10px] font-black tracking-[0.4em] uppercase text-secondary mb-6">— CalmSphere Toolkit</div>
            <h2 className="font-fraunces text-6xl md:text-8xl mb-10">Advanced <br /><span className="italic text-secondary">Discovery.</span></h2>
            <p className="text-xl text-primary/40 leading-relaxed">A specialized set of tools designed to recalibrate the modern mind within CalmSphere AI.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, i) => (
              <div 
                key={i} 
                className="tool-card reveal-on-scroll cursor-pointer" 
                ref={addToRefs} 
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={() => navigate('/discovery')}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all">
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-fraunces mb-6 italic">{tool.title}</h3>
                <p className="text-primary/50 leading-relaxed text-sm mb-10">{tool.desc}</p>
                <div className="w-8 h-1 bg-secondary/20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scientific Foundation Section */}
      <section id="science" className="py-40 bg-primary text-white overflow-hidden relative">
        <div className="aura-blob top-0 left-0 opacity-10" />
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className="reveal-on-scroll" ref={addToRefs}>
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-10">
                <Brain className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="font-fraunces text-5xl md:text-7xl mb-10 italic">The Empathy <br />Algorithm.</h2>
              <p className="text-xl text-white/40 leading-relaxed mb-12">
                Our proprietary model analyzes over <span className="text-white font-bold">200 points of emotional rhythm</span>—from speech cadence to linguistic patterns—ensuring every interaction with Calmi feels uniquely human.
              </p>
              <div className="grid grid-cols-2 gap-10 border-t border-white/10 pt-12">
                <div>
                  <div className="text-4xl font-fraunces text-secondary mb-2">99.8%</div>
                  <div className="text-[9px] font-black tracking-widest uppercase text-white/20">Pattern Accuracy</div>
                </div>
                <div>
                  <div className="text-4xl font-fraunces text-secondary mb-2">40ms</div>
                  <div className="text-[9px] font-black tracking-widest uppercase text-white/20">Response Latency</div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/science')}
                className="mt-16 text-[10px] font-black tracking-widest uppercase text-secondary hover:text-white flex items-center gap-3 transition-all"
              >
                Read the Whitepaper <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative reveal-on-scroll" ref={addToRefs}>
              <div className="luxury-card bg-white/5 border-white/10 p-12 aspect-square flex flex-col justify-center gap-12">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black tracking-widest uppercase text-white/30">
                      <span>Neural Rhythm {i + 1}</span>
                      <span>{Math.floor(Math.random() * 40) + 60}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary transition-all duration-[2s]" style={{ width: `${Math.random() * 40 + 60}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inner Circle: Membership Tiers */}
      <section id="inner-circle" className="py-40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-32 reveal-on-scroll" ref={addToRefs}>
            <h2 className="font-fraunces text-6xl md:text-8xl mb-8">The Inner <br /><span className="italic text-secondary">Circle.</span></h2>
            <p className="text-xl text-primary/40">Select your depth of sanctuary within CalmSphere AI.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: 'Sanctuary', price: 'Free', features: ['Daily Voice Sessions', 'Neural Soundscapes', 'Private Journal'] },
              { name: 'Grove', price: '$9/mo', featured: true, features: ['Unlimited Sessions', 'Advanced Analytics', 'Sleep Sanctuary', 'Community Circles'] },
              { name: 'Horizon', price: '$19/mo', features: ['Personal Health Concierge', 'Priority Voice Latency', 'Family Sharing', 'Wearable Sync'] }
            ].map((tier, i) => (
              <div 
                key={i} 
                className={`membership-card ${tier.featured ? 'featured' : ''} reveal-on-scroll cursor-pointer`} 
                ref={addToRefs} 
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={() => navigate('/inner-circle')}
              >
                <h3 className="text-2xl font-fraunces mb-4 italic">{tier.name}</h3>
                <div className="text-4xl font-fraunces mb-12">{tier.price}</div>
                <div className="space-y-6 mb-16">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-4 text-sm opacity-60">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      {f}
                    </div>
                  ))}
                </div>
                <button className={`w-full py-5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${tier.featured ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                  Select {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Mission Section */}
      <section className="py-40 bg-muted/30 relative overflow-hidden">
        <div className="aura-blob bottom-0 right-0" />
        <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5 reveal-on-scroll" ref={addToRefs}>
            <div className="aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000" className="w-full h-full object-cover" alt="Foggy Forest" />
            </div>
          </div>
          <div className="lg:col-span-7 reveal-on-scroll" ref={addToRefs}>
            <div className="max-w-2xl">
              <Feather className="w-12 h-12 text-secondary mb-10" />
              <h2 className="font-fraunces text-5xl md:text-7xl mb-10 italic text-primary">A Letter from <br />the Sanctuary.</h2>
              <div className="space-y-8 text-xl text-primary/60 leading-relaxed font-fraunces">
                <p>"CalmSphere AI wasn't born in a lab, but in a moment of noise. We realized that the more connected we became, the less we were truly heard."</p>
                <p>"We built this for the student who feels the weight of tomorrow, for the researcher lost in the data, and for the soul just looking for a quiet place to breathe."</p>
                <p>"Calmi is more than a bot. It's a mirror for your rhythm. And we're here to listen to every beat."</p>
              </div>
              <div className="mt-16">
                <div className="text-xl font-bold italic text-primary">Shivam Sharma</div>
                <div className="text-[10px] font-black tracking-widest uppercase text-primary/20 mt-2">Founder, CalmSphere AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-40">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <div key={i} className="luxury-card p-12 reveal-on-scroll" ref={addToRefs} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-8 text-secondary">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xl font-fraunces leading-relaxed mb-10 text-primary">"{t.text}"</p>
                <div>
                  <div className="font-black text-[10px] tracking-widest uppercase text-primary">{t.name}</div>
                  <div className="text-[10px] font-medium text-primary/30 uppercase mt-1">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-40 bg-muted/20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-24 reveal-on-scroll" ref={addToRefs}>
            <HelpCircle className="w-12 h-12 text-primary/10 mx-auto mb-8" />
            <h2 className="font-fraunces text-5xl md:text-7xl mb-6">Common <br /><span className="italic text-secondary">Questions.</span></h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is my data truly private?", a: "Yes. Every session with Calmi is encrypted end-to-end. We do not store transcripts permanently, and we never sell your data to third parties." },
              { q: "How does Calmi understand emotions?", a: "Calmi uses advanced sentiment analysis and pattern recognition built on neuroscientific research to detect the nuances in your voice and text." },
              { q: "Is CalmSphere AI a replacement for therapy?", a: "No. CalmSphere AI is a supportive platform designed for daily wellness. If you are in crisis, please seek professional clinical help." },
              { q: "Can I use Calmi with my wearable device?", a: "Horizon members can sync Calmi with most major wearable devices to track physiological stress markers in real-time within CalmSphere." }
            ].map((faq, i) => (
              <div 
                key={i} 
                className={`faq-item reveal-on-scroll ${activeFaq === i ? 'active' : ''}`} 
                ref={addToRefs}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-fraunces italic text-primary">{faq.q}</h4>
                  <ChevronDown className={`w-5 h-5 text-primary/20 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </div>
                <div className="faq-answer text-primary/50 leading-relaxed text-lg">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Sanctuary */}
      <section className="py-40 px-6">
        <div className="container mx-auto">
          <div className="luxury-card bg-primary text-white p-24 text-center border-none overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Bloom" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/20 to-primary/60" />
            <div className="mesh-bg opacity-30" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <Compass className="w-16 h-16 text-secondary mx-auto mb-10 animate-bounce-slow" />
              <h2 className="font-fraunces text-6xl md:text-8xl mb-12 italic" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>Bloom.</h2>
              <p className="text-white/70 text-xl leading-relaxed mb-16 font-medium" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Your personal sanctuary is ready when you are. Take the first breath today.</p>
              <button onClick={() => navigate('/login')} className="bg-white text-primary px-16 py-8 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-2xl magnetic-btn">
                Enter CalmSphere AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="py-32 border-t border-primary/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-24 mb-32">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg"><Sparkles className="w-5 h-5 text-white" /></div>
                <span className="font-fraunces text-3xl font-bold text-primary">CalmSphere AI</span>
              </div>
              <p className="text-primary/40 leading-relaxed mb-10 text-lg">Reimagining mental wellness through the lens of empathy and privacy.</p>
              <div className="flex gap-8 text-primary/20">
                <Instagram className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                <Linkedin className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                <Github className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" onClick={() => window.open('https://github.com/150ftw/CalmSphere-AI')} />
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-16">
              {[
                { title: 'Sanctuary', links: [{l: 'Experience', p: '/experience'}, {l: 'Toolkit', p: '/discovery'}, {l: 'Discovery', p: '/discovery'}, {l: 'Security', p: '/security'}] },
                { title: 'Research', links: [{l: 'Neuroscience', p: '/science'}, {l: 'Ethical AI', p: '/science'}, {l: 'Data Policy', p: '/security'}, {l: 'Trust', p: '/security'}] },
                { title: 'Support', links: [{l: 'Help Center', p: '#faq'}, {l: 'Crisis Info', p: '/crisis'}, {l: 'Contact', p: '#'}, {l: 'Status', p: '#'}] }
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-primary/20 mb-8">{col.title}</h4>
                  <div className="space-y-4">
                    {col.links.map((link) => (
                      <a 
                        key={link.l} 
                        href={link.p} 
                        onClick={(e) => {
                          if (link.p.startsWith('/')) {
                            e.preventDefault();
                            navigate(link.p);
                          }
                        }}
                        className="block text-sm font-bold text-primary/30 hover:text-primary transition-colors"
                      >
                        {link.l}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-3">
              <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-primary/20 mb-8">Join the Sanctuary</h4>
              <div className="relative">
                <input type="email" placeholder="Email Address" className="newsletter-input" />
                <button className="absolute right-0 bottom-3 text-primary/40 hover:text-primary transition-colors"><Mail className="w-5 h-5" /></button>
              </div>
              <p className="mt-6 text-[8px] font-black tracking-widest uppercase text-primary/20">Monthly serenity in your inbox.</p>
            </div>
          </div>
          <div className="pt-16 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <p className="text-[9px] font-black tracking-[0.2em] uppercase text-primary/20 italic">"A quiet place for a loud world."</p>
            <div className="max-w-md text-[9px] font-bold tracking-widest uppercase text-primary/10 leading-loose">
              CalmSphere AI is a supportive platform, not a clinical replacement. If you are in crisis, please seek immediate help.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;