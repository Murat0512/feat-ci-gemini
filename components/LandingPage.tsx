
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Zap, Globe, Cpu, ChevronRight, ArrowUpRight, BarChart3, FileText, CheckCircle2, Lock, Sparkles, MessageSquare, PlayCircle, MousePointer2, ChevronDown, Shield, Database, Fingerprint, Activity, Network, Layers, GitCompare, Terminal, AlertTriangle, Search, Command, Rocket } from 'lucide-react';

interface LandingPageProps {
  onEnterSuite: () => void;
  isActivated: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterSuite, isActivated }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScanning, setIsScanning] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = ['intelligence', 'ecosystem', 'security'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          if (entry.target.id === 'intelligence') setIsScanning(true);
        }
      });
    }, { threshold: 0.1 });

    const targets = document.querySelectorAll('.reveal-on-scroll');
    targets.forEach(t => observer.observe(t));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      targets.forEach(t => observer.unobserve(t));
    };
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Cinematic Overlays */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000 opacity-60"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.12) 0%, transparent 40%)`
        }}
      />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/[0.02] via-transparent to-transparent" />
      </div>

      {/* Advanced Navigation */}
      <nav className="fixed top-0 inset-x-0 z-[100] h-20 border-b border-white/5 bg-[#020202]/60 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)]">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none">LexiScan <span className="text-indigo-500">AI</span></span>
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">v7.1.0 Neural Stable</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['intelligence', 'ecosystem', 'security'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item)} 
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeSection === item ? 'text-white' : 'text-gray-600 hover:text-gray-300'}`}
              >
                {item}
                {activeSection === item && <div className="absolute -bottom-8 inset-x-0 h-0.5 bg-indigo-500 animate-in fade-in zoom-in duration-500" />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">System Operational</span>
            </div>
            <button 
              onClick={onEnterSuite}
              className="px-8 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-indigo-700 transition-all flex items-center gap-3 group shadow-xl shadow-indigo-600/30 active:scale-95"
              title="Access Nerve Center Dashboard"
            >
              {isActivated ? '⚡ Dashboard' : '🔗 Establish Link'} 
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
        {/* Scroll Progress Bar */}
        <div className="h-[1px] bg-white/10 w-full relative">
           <div className="absolute h-full bg-indigo-500 transition-all duration-100" style={{ width: `${Math.min(100, (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%` }} />
        </div>
      </nav>

      {/* Hero Section: Explanatory Upgrade */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-8 pt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[500px] bg-indigo-600/5 blur-[160px] rounded-full animate-pulse-soft pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-[0.3em] uppercase mb-12 animate-in fade-in slide-in-from-top-6 duration-700 mx-auto">
            <Terminal size={12} /> Legal Scrutiny & Brand Synthesis Lab
          </div>
          
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-black tracking-tighter leading-[0.82] mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 uppercase">
            <span className="block text-white">AUDIT.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-indigo-400 bg-300% animate-shimmer">DEFEND.</span>
            <span className="block text-white">PROJECT.</span>
          </h1>

          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-gray-500 font-medium mb-16 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400 leading-relaxed italic">
            "An autonomous neural ecosystem for <span className="text-white">scrutinizing complex legal risk</span> and <span className="text-white">synthesizing high-fidelity commercial assets</span>. Scrutinize predatory clauses, generate optimized provisions, and project your brand identity with surgical precision."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-600">
            <button 
              onClick={onEnterSuite}
              className="group relative px-16 py-8 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-black rounded-[32px] text-xl hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)] hover:shadow-[0_40px_80px_-15px_rgba(79,70,229,0.5)] active:scale-95 flex items-center gap-4 border border-indigo-500/50 hover:border-indigo-400"
              title="Access Nerve Center - Your AI Legal Command Hub"
            >
              <span>Access Nerve Center</span>
              <Zap size={22} fill="currentColor" className="group-hover:scale-125 transition-transform"/>
              <div className="absolute -inset-1 bg-indigo-600/50 rounded-[32px] blur-lg opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
            </button>
            <button onClick={() => scrollTo('intelligence')} className="px-12 py-8 bg-white/5 border border-white/20 text-white font-black rounded-[32px] text-xl hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-3">
              Learn More <Command size={18} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Intelligence Section: Interactive Audit Simulator */}
      <section id="intelligence" className="py-40 md:py-60 px-8 border-t border-white/5 bg-[#0f0f2e] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="reveal-on-scroll">
              <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">The Nerve Center: Module 01</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">ELIMINATE <br /><span className="text-indigo-500">LIABILITY TRAPS.</span></h2>
              <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed max-w-xl">LexiScan performs sub-second topography mapping on legal documents, identifying malicious clauses and generating fortified counter-provisions to shield your commercial interests.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Risk Mapping", val: "Sub-Second Delta", icon: ShieldCheck },
                  { title: "Legal Grounding", val: "2024 Precedent Sync", icon: Globe }
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                    <stat.icon className="text-indigo-400 mb-4" size={24} />
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{stat.title}</h4>
                    <p className="text-white font-black text-sm uppercase">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-on-scroll relative">
              <div className="absolute -inset-4 bg-indigo-500/10 blur-[100px] rounded-full" />
              <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[48px] p-8 shadow-2xl overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                   <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                   </div>
                   <div className="text-[9px] text-indigo-400 font-black uppercase tracking-widest animate-pulse">Scanning Document Content...</div>
                </div>
                
                <div className="space-y-4 opacity-50">
                   <p className="text-gray-500"><span className="text-indigo-500">SECTION 8.2:</span> INDEMNIFICATION CLAUSE</p>
                   <div className="h-4 bg-white/5 rounded-lg w-full relative overflow-hidden">
                      {isScanning && <div className="absolute inset-y-0 left-0 bg-red-500/40 w-1/3 animate-scan-fast" />}
                   </div>
                   <p className="text-gray-500">User agrees to hold LexiCorp harmless against all...</p>
                   <div className="h-4 bg-white/5 rounded-lg w-[85%] relative overflow-hidden">
                      {isScanning && <div className="absolute inset-y-0 left-0 bg-red-500/40 w-1/2 animate-scan-delay" />}
                   </div>
                   
                   <div className={`mt-10 p-6 rounded-2xl border transition-all duration-700 ${isScanning ? 'bg-red-500/10 border-red-500/30 translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <div className="flex items-center gap-3 text-red-500 font-black mb-2">
                        <AlertTriangle size={14} /> 
                        <span className="text-[10px] uppercase tracking-widest">Liability Trap Detected</span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed italic">"Clause 8.2 shifts unreasonable financial risk to the user. Recommended rebuttal: Strike 'all damages' and insert 'capped at 1x contract value'."</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section: Dynamic Data Flow */}
      <section id="ecosystem" className="py-40 md:py-60 px-8 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32 reveal-on-scroll">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">ONE LINK. <br /><span className="text-indigo-500">FULL SOVEREIGNTY.</span></h2>
            <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">"A unified operational flow from risk mitigation to brand deployment."</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center reveal-on-scroll">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[48px] p-12 text-center group hover:border-indigo-500/30 transition-all shadow-2xl h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-400 group-hover:scale-110 transition-transform"><Shield size={32} /></div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Audit Audit</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">High-fidelity legal mapping and semantic provision re-building.</p>
              </div>
              <div className="pt-8 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-indigo-500 flex items-center justify-center gap-2">
                <Activity size={12} /> Scrutiny Module
              </div>
            </div>

            <div className="relative flex flex-col items-center">
               <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_80px_rgba(79,70,229,0.4)] animate-pulse relative z-10"><Zap size={40} fill="currentColor" /></div>
               <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20 hidden lg:block" />
               <div className="mt-12 text-center">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.5em] mb-4 block">Handshake Bridge</span>
                  <div className="flex gap-2 justify-center">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-75" />
                    <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-150" />
                    <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-300" />
                  </div>
               </div>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 rounded-[48px] p-12 text-center group hover:border-violet-500/30 transition-all shadow-2xl h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-violet-400 group-hover:scale-110 transition-transform"><Layers size={32} /></div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Nexus Lab</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">Neural synthesis of cinematic brand assets and high-conversion copy.</p>
              </div>
              <div className="pt-8 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-violet-500 flex items-center justify-center gap-2">
                <Rocket size={12} /> Projection Module
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section: Command Center */}
      <section id="security" className="py-40 md:py-60 px-8 border-t border-white/5 bg-[#050505] relative overflow-hidden">
        <div className="absolute bottom-0 right-0 p-40 opacity-5 pointer-events-none"><Fingerprint size={400} /></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="reveal-on-scroll">
              <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500 mb-8"><Lock size={32} /></div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">DATA <br /><span className="text-indigo-500">FORTRESS.</span></h2>
              <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed">Your neural fingerprints remain within the secure link. LexiScan v7.1.0 utilizes zero-retention architecture with local-first encryption protocols to ensure operational privacy.</p>
              
              <div className="space-y-4">
                 {[
                   "Zero-Knowledge Audit Protocols",
                   "Hardware-Accelerated AES-4096 Encryption",
                   "Neural Path Fingerprinting",
                   "Immutable Data Sovereignty"
                 ].map((text, i) => (
                   <div key={i} className="flex items-center gap-4 text-gray-500">
                     <CheckCircle2 size={16} className="text-emerald-500" />
                     <span className="text-sm font-black uppercase tracking-widest">{text}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="reveal-on-scroll">
               <div className="bg-black/60 border border-white/10 rounded-[48px] p-12 shadow-2xl backdrop-blur-xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                     <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                  </div>
                  
                  <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-12 flex items-center gap-3"><Activity size={14}/> Neural Link Integrity</h3>
                  
                  <div className="space-y-10">
                     {[
                       { label: "Encryption Depth", val: "4096-bit RSA", color: "indigo" },
                       { label: "Link Latency", val: "14ms Sync Delay", color: "emerald" },
                       { label: "State Sync", val: "Locked & Verified", color: "amber" }
                     ].map((item, i) => (
                       <div key={i}>
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                             <span className={`text-[9px] font-black text-${item.color}-400 uppercase`}>{item.val}</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className={`h-full bg-${item.color}-500 w-[70%] animate-pulse`} />
                          </div>
                       </div>
                     ))}
                  </div>
                  
                  <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[8px] font-mono text-gray-600">ID: SEC-LX-990-ALPHA</span>
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1 bg-indigo-500/20 rounded-full" />)}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA: Final Impact */}
      <section className="py-40 px-8 bg-gradient-to-b from-[#050505] to-[#000000] flex flex-col items-center text-center">
        <div className="max-w-5xl reveal-on-scroll">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-16 leading-[0.85]">COMMAND THE <br /><span className="text-indigo-500">ADVANTAGE.</span></h2>
          <button 
            onClick={onEnterSuite}
            className="group relative px-20 py-8 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-black rounded-[40px] text-2xl md:text-3xl hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-[0_30px_80px_-15px_rgba(79,70,229,0.4)] active:scale-95 flex items-center gap-6 mx-auto border border-indigo-500/50 hover:border-indigo-400"
            title="Launch Nerve Center Dashboard"
          >
            <span>Launch Nerve Center</span>
            <Zap size={32} fill="currentColor" className="group-hover:rotate-12 group-hover:scale-110 transition-transform" />
            <div className="absolute -inset-1 bg-indigo-600/50 rounded-[40px] blur-lg opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
          </button>
          <p className="mt-12 text-gray-600 font-black uppercase text-[10px] tracking-[0.5em]">Enterprise Neural Licenses Available</p>
        </div>
      </section>

      <footer className="py-20 px-8 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
              <ShieldCheck size={24} className="text-gray-500" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">LexiScan Intelligence Suite</p>
              <p className="text-[9px] text-gray-600 uppercase font-black">Powered by Neural Stability v7.1.0-STABLE</p>
            </div>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
             <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-white transition-colors">Return to Top</button>
             <span className="text-indigo-500">Protocol: Enterprise v7.1.0</span>
          </div>
        </div>
      </footer>

      <style>{`
        .reveal-on-scroll {
          transform: translateY(40px);
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-active {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 12s linear infinite;
        }
        .bg-300% { background-size: 300% auto; }
        
        @keyframes scan {
           0% { left: -100%; opacity: 0; }
           50% { opacity: 1; }
           100% { left: 100%; opacity: 0; }
        }
        .animate-scan-fast { animation: scan 3s infinite linear; }
        .animate-scan-delay { animation: scan 3s infinite linear 1.5s; }
      `}</style>
    </div>
  );
};

export default LandingPage;
