
import React, { useState } from 'react';
import { Globe, ShieldCheck, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, ExternalLink, Download, FileCode, CheckCircle2, Lock, Cpu, Rocket, AlertTriangle, Github } from 'lucide-react';

const NeuralDeploy: React.FC = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const steps = [
    "Pruning TypeScript overhead...",
    "Injecting Gemini 3.0 Pro Protocols...",
    "Synthesizing Static Lattice Assets...",
    "Verifying AES-4096 Sovereign Link...",
    "Applying Production Compression..."
  ];

  const handleBuild = () => {
    setIsBuilding(true);
    setBuildStep(0);
    
    const interval = setInterval(() => {
      setBuildStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsBuilding(false);
          setIsReady(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const exportVercelConfig = () => {
    const config = {
      "version": 2,
      "routes": [
        { "handle": "filesystem" },
        { "src": "/(.*)", "dest": "/index.html" }
      ]
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vercel.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 21: Production Sovereignty</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Neural <span className="text-emerald-500">Deploy.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Compile, secure, and broadcast your tactical node to the public web.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Deployment Checklist */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Globe size={120} /></div>
            <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
              <Rocket size={18} className="text-emerald-500" /> Readiness Sync
            </h4>
            
            <div className="space-y-6">
               {[
                 { label: "Environment Key Protection", status: "Verified" },
                 { label: "Static Asset Compilation", status: "Pending" },
                 { label: "SPA Router Mapping", status: "Ready" },
                 { label: "Google Grounding Logic", status: "Internalized" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase italic">{item.label}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-gray-600'}`}>{item.status}</span>
                 </div>
               ))}
            </div>

            <button 
              onClick={handleBuild}
              disabled={isBuilding}
              className="w-full py-6 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-4 text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-30"
            >
              {isBuilding ? <Loader2 className="animate-spin" size={20}/> : <Zap size={20} fill="currentColor" />}
              {isBuilding ? 'Compiling Production Lattice...' : 'Initiate Build Sequence'}
            </button>
          </div>
        </div>

        {/* Right: The Guide */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-[#0f0f0f] border border-white/10 rounded-[64px] p-12 md:p-16 shadow-2xl relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Terminal size={240} className="text-emerald-500" /></div>
              
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10">
                    <Globe size={32} />
                 </div>
                 <div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Broadcast Protocol v1.0</span>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Public Sovereignty Guide</h3>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <h5 className="text-[11px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500" /> Step 1: Code Commitment
                       </h5>
                       <p className="text-sm font-medium text-gray-400 italic leading-relaxed">
                          Initialize a Git repository and push your LexiScan code to <span className="text-white font-black">GitHub</span> or <span className="text-white font-black">GitLab</span>.
                       </p>
                    </div>
                    <div className="space-y-4">
                       <h5 className="text-[11px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500" /> Step 2: Establish Hosting
                       </h5>
                       <p className="text-sm font-medium text-gray-400 italic leading-relaxed">
                          Link your repository to <span className="text-emerald-500 font-black">Vercel</span> or <span className="text-emerald-500 font-black">Netlify</span>. They will detect the Vite configuration automatically.
                       </p>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                       <h5 className="text-[11px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                          <AlertTriangle size={14} className="text-amber-500" /> Step 3: Key Injection
                       </h5>
                       <p className="text-sm font-medium text-gray-400 italic leading-relaxed">
                          In the hosting dashboard, add an Environment Variable named <span className="text-amber-500 font-black">API_KEY</span>. This is the only way to power the neural engines in public space.
                       </p>
                    </div>
                    <div className="space-y-4">
                       <h5 className="text-[11px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                          <Download size={14} className="text-indigo-500" /> Step 4: Routing Sync
                       </h5>
                       <button 
                        onClick={exportVercelConfig}
                        className="w-full p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center justify-between group hover:bg-indigo-500/10 transition-all"
                       >
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Download vercel.json</span>
                          <FileCode size={16} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                       </button>
                    </div>
                 </div>
              </div>

              {isBuilding && (
                <div className="mt-12 p-8 bg-black/60 border border-white/5 rounded-[32px] animate-pulse">
                   <div className="flex items-center gap-4 mb-4">
                      <Loader2 className="animate-spin text-emerald-500" size={16} />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{steps[buildStep]}</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${(buildStep + 1) * 20}%` }} />
                   </div>
                </div>
              )}

              {isReady && (
                <div className="mt-12 p-12 bg-emerald-500/5 border border-emerald-500/20 rounded-[40px] flex items-center justify-between shadow-2xl animate-in zoom-in duration-500">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-xl shadow-emerald-500/20"><CheckCircle2 size={32} /></div>
                      <div>
                         <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Production Build Optimized</h4>
                         <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Node ready for global broadcast.</p>
                      </div>
                   </div>
                   <button className="px-10 py-5 bg-white text-black font-black rounded-3xl uppercase tracking-widest text-xs shadow-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-3">
                      View Deployment Spec <ChevronRight size={16} />
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Production Infrastructure Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {[
          { icon: Github, title: "Git Sovereignty", desc: "Keep your code local or private. Use production branches for stability." },
          { icon: Lock, title: "SSL Certification", desc: "LexiScan mandates HTTPS links. Production hosting provides auto-SSL." },
          { icon: Cpu, title: "Edge Performance", desc: "Public deployment utilizes global CDNs to reduce neural latency to sub-20ms." }
        ].map((item, i) => (
          <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] flex items-start gap-6 group hover:border-emerald-500/30 transition-all">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all shrink-0 shadow-xl"><item.icon size={24} /></div>
            <div>
               <h4 className="text-lg font-black text-white uppercase italic mb-2 tracking-tight">{item.title}</h4>
               <p className="text-sm text-gray-600 font-medium italic leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeuralDeploy;
