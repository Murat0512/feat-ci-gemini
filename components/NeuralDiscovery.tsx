
import React, { useState } from 'react';
import { Key, ShieldAlert, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, Search, Info, CheckCircle2, X, Calendar, FileSearch, Target, Flame } from 'lucide-react';
import { runNeuralDiscovery } from '../services/geminiService';
import { Language } from '../types';

interface NeuralDiscoveryProps {
  auditContext?: string;
  language?: Language;
}

const NeuralDiscovery: React.FC<NeuralDiscoveryProps> = ({ auditContext, language = 'English' }) => {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryData, setDiscoveryData] = useState<any>(null);

  const handleRunDiscovery = async () => {
    if (!auditContext) {
      alert("Evidence extraction requires a Tactical Audit context.");
      return;
    }
    setIsDiscovering(true);
    try {
      const result = await runNeuralDiscovery(auditContext, language as Language);
      setDiscoveryData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 12: Evidence Locker</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Discovery <span className="text-emerald-500">Vault.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Extract "Smoking Gun" evidence and obligation timelines from deep context.</p>
        </div>
        {discoveryData && (
          <button onClick={() => setDiscoveryData(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Reset Vault</button>
        )}
      </div>

      {!discoveryData ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent opacity-30" />
          <div className={`w-32 h-32 mx-auto rounded-[40px] border border-white/5 flex items-center justify-center text-emerald-500 shadow-2xl mb-8 transition-all duration-700 ${isDiscovering ? 'bg-emerald-600/20 scale-110 animate-pulse' : 'bg-white/5'}`}>
            <Key size={64} />
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Access Signal Intelligence</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
              "Establish a discovery link to extract exact supporting evidence for claims and visualize the timeline of contractual obligations."
            </p>
          </div>
          <button 
            onClick={handleRunDiscovery}
            disabled={isDiscovering || !auditContext}
            className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 mx-auto hover:bg-emerald-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
          >
            {isDiscovering ? <Loader2 className="animate-spin" size={32}/> : <Target size={32} />}
            {isDiscovering ? 'Analyzing Signals...' : 'Initialize Discovery'}
          </button>
          {!auditContext && <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest italic mt-4">Audit context required for evidence extraction.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in slide-in-from-bottom-6 duration-1000">
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={18} className="text-emerald-500" /> Evidence Depth
                 </h4>
                 
                 <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 text-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Signal Clarity</span>
                    <div className="text-7xl font-black italic tracking-tighter mt-4 text-emerald-500">
                      {discoveryData.discoveryScore}%
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Obligation Timeline</h5>
                    <div className="space-y-4">
                       {discoveryData.milestones.map((m: any, i: number) => (
                         <div key={i} className="flex gap-4 relative">
                            {i !== discoveryData.milestones.length - 1 && <div className="absolute left-1.5 top-6 bottom-0 w-px bg-white/5" />}
                            <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${m.urgency === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-indigo-500'}`} />
                            <div>
                               <p className="text-[10px] font-black text-white italic uppercase">{m.date}</p>
                               <p className="text-[11px] text-gray-500 italic mt-0.5">{m.event}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-3 space-y-8">
              <div className="bg-[#0f0f0f] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden h-full flex flex-col">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Search size={240} className="text-emerald-500" /></div>
                 
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10">
                       <FileSearch size={32} />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Extracted Evidence Ledger</span>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Smoking Gun Inventory</h3>
                    </div>
                 </div>

                 <div className="space-y-6 flex-1">
                    {discoveryData.evidenceLocker.map((e: any, i: number) => (
                      <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[40px] hover:border-emerald-500/30 transition-all group">
                         <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                               <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${e.category === 'Liability' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : e.category === 'Benefit' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20'}`}>
                                  {e.category}
                               </div>
                               <h5 className="text-lg font-black text-white uppercase italic tracking-tight">{e.claim}</h5>
                            </div>
                            <button onClick={() => navigator.clipboard.writeText(e.sourceText)} className="p-3 bg-white/5 rounded-xl text-gray-600 hover:text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100"><Zap size={16}/></button>
                         </div>
                         <div className="bg-white/[0.02] border-l-2 border-emerald-500/30 p-6 rounded-r-3xl italic text-gray-400 text-sm leading-relaxed">
                            "{e.sourceText}"
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest">Protocol: Discovery-Alpha Sync</span>
                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">
                       Generate Detailed Evidence Report <ChevronRight size={12} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NeuralDiscovery;
