
import React, { useState } from 'react';
import { ShieldX, AlertTriangle, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, Bug, FileCode, CheckCircle2, X } from 'lucide-react';
import { runBreachSimulation } from '../services/geminiService';
import { Language } from '../types';

interface BreachScenariosProps {
  auditContext?: string;
  language?: Language;
}

const BreachScenarios: React.FC<BreachScenariosProps> = ({ auditContext, language = 'English' }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const handleRunSimulation = async () => {
    if (!auditContext) {
      alert("Adversarial simulation requires a Tactical Audit context.");
      return;
    }
    setIsSimulating(true);
    try {
      const result = await runBreachSimulation(auditContext, language as Language);
      setSimulation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-pink-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 11: Breach Red-Teaming</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">Zero-Day <span className="text-pink-500">Ledger.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">Discover non-obvious catastrophic exploits and generate legal patches.</p>
        </div>
        {simulation && (
          <button onClick={() => setSimulation(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Reset Simulation</button>
        )}
      </div>

      {!simulation ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-600 to-transparent opacity-30" />
          <div className={`w-32 h-32 mx-auto rounded-[40px] border border-white/5 flex items-center justify-center text-pink-500 shadow-2xl mb-8 transition-all duration-700 ${isSimulating ? 'bg-pink-600/20 scale-110 animate-pulse' : 'bg-white/5'}`}>
            <ShieldX size={64} />
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Initialize Breach Protocol</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
              "Red-team your document to identify 'Zero-Day' loopholes—catastrophic scenarios where standard legal protections are bypassed or exploited."
            </p>
          </div>
          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating || !auditContext}
            className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 mx-auto hover:bg-pink-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
          >
            {isSimulating ? <Loader2 className="animate-spin" size={32}/> : <Bug size={32} />}
            {isSimulating ? 'Searching Exploits...' : 'Run Breach Simulation'}
          </button>
          {!auditContext && <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest italic mt-4">Tactical context required for exploit discovery.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in slide-in-from-bottom-6 duration-1000">
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={18} className="text-pink-500" /> Vulnerability Heat
                 </h4>
                 
                 <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 text-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Exploit Surface</span>
                    <div className={`text-7xl font-black italic tracking-tighter mt-4 ${simulation.vulnerabilityIndex > 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {simulation.vulnerabilityIndex}%
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Active Exploits</h5>
                    <div className="flex flex-col gap-2">
                       {simulation.scenarios.map((s: any, i: number) => (
                         <button 
                          key={s.id} 
                          onClick={() => setActiveScenario(i)}
                          className={`p-4 rounded-2xl border text-left transition-all ${activeScenario === i ? 'bg-pink-500/10 border-pink-500/50 shadow-xl' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                         >
                            <div className="flex items-center justify-between mb-1">
                               <span className="text-[9px] font-black uppercase">{s.impact}</span>
                               <Bug size={10} className={activeScenario === i ? 'text-pink-500' : 'text-gray-800'} />
                            </div>
                            <p className="text-[11px] font-bold italic line-clamp-1">{s.name}</p>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-3 space-y-8">
              <div className="bg-[#0f0f0f] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden h-full flex flex-col">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Zap size={240} className="text-pink-500" /></div>
                 
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/20 rounded-3xl flex items-center justify-center text-pink-500 shadow-xl shadow-pink-500/10">
                       <AlertTriangle size={32} />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em]">Exploit Zero-Day Detected</span>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{simulation.scenarios[activeScenario].name}</h3>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                    <div className="space-y-6">
                       <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-3">
                          <Terminal size={14} className="text-pink-500" /> Exploit Vector
                       </h4>
                       <div className="bg-black/40 border border-white/5 rounded-3xl p-8 shadow-inner italic leading-relaxed text-gray-400 font-medium text-lg">
                          "{simulation.scenarios[activeScenario].exploit}"
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-3">
                          <FileCode size={14} className="text-emerald-500" /> Neural Patch
                       </h4>
                       <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 shadow-inner italic leading-relaxed text-emerald-400 font-medium text-lg relative group">
                          "{simulation.scenarios[activeScenario].patch}"
                          <button 
                            onClick={() => navigator.clipboard.writeText(simulation.scenarios[activeScenario].patch)}
                            className="absolute top-4 right-4 p-2 bg-emerald-500/10 text-emerald-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-black"
                          >
                             <Zap size={14} fill="currentColor"/>
                          </button>
                       </div>
                       <p className="text-[10px] text-gray-600 font-medium italic">This patch closes the semantic gap identifying in the exploit vector.</p>
                    </div>
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest">Protocol: Red-Team Alpha</span>
                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">
                       Commit Patches to Vault <ChevronRight size={12} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BreachScenarios;
