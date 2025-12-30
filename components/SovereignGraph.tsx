
import React, { useState } from 'react';
import { Network, ShieldAlert, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, Target, Users, Share2, Building2, UserCheck, AlertTriangle } from 'lucide-react';
import { runSovereignGraph } from '../services/geminiService';
import { Language } from '../types';

interface SovereignGraphProps {
  auditContext?: string;
  language?: Language;
}

const SovereignGraph: React.FC<SovereignGraphProps> = ({ auditContext, language = 'English' }) => {
  const [isMapping, setIsMapping] = useState(false);
  const [graphData, setGraphData] = useState<any>(null);

  const handleRunMap = async () => {
    if (!auditContext) {
      console.warn("Entity mapping requires audit context");
      alert("🕸️ Context Required: Entity mapping requires an active Tactical Audit.");
      return;
    }
    setIsMapping(true);
    try {
      const result = await runSovereignGraph(auditContext, language as Language);
      setGraphData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMapping(false);
    }
  };

  const getWeightColor = (weight: number) => {
    if (weight > 70) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (weight > 40) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 14: Liability Physics</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Sovereign <span className="text-indigo-400">Graph.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Extract entity clusters and visualize the flow of legal obligation.</p>
        </div>
        {graphData && (
          <button onClick={() => setGraphData(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Reset Topology</button>
        )}
      </div>

      {!graphData ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-30" />
          <div className={`w-32 h-32 mx-auto rounded-[40px] border border-white/5 flex items-center justify-center text-indigo-400 shadow-2xl mb-8 transition-all duration-700 ${isMapping ? 'bg-indigo-600/20 scale-110 animate-pulse' : 'bg-white/5'}`}>
            <Network size={64} />
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Map Entity Relationships</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
              "Establish a neural link to identify all parties and affiliates within the contract. LexiScan will calculate the weight of liability each entity carries."
            </p>
          </div>
          <button 
            onClick={handleRunMap}
            disabled={isMapping || !auditContext}
            className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 mx-auto hover:bg-indigo-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
          >
            {isMapping ? <Loader2 className="animate-spin" size={32}/> : <Share2 size={32} />}
            {isMapping ? 'Mapping Topology...' : 'Initialize Topology Scan'}
          </button>
          {!auditContext && <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest italic mt-4">Audit context required for relationship mapping.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in slide-in-from-bottom-6 duration-1000">
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={18} className="text-indigo-400" /> Graph Load
                 </h4>
                 
                 <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 text-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Network Density</span>
                    <div className="text-7xl font-black italic tracking-tighter mt-4 text-indigo-400">
                      {graphData.systemLoad}%
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Liability Hotspot</h5>
                    <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4">
                       <AlertTriangle size={20} className="text-red-500 shrink-0" />
                       <div>
                          <p className="text-[10px] font-black text-red-400 uppercase">Master Node</p>
                          <p className="text-sm font-bold text-white italic truncate">{graphData.primaryLiabilityNode}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-3 space-y-8">
              <div className="bg-[#0f0f0f] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden h-full flex flex-col">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Network size={240} className="text-indigo-500" /></div>
                 
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
                       <Building2 size={32} />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Entity Inventory</span>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Neural Relationship Map</h3>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    {graphData.entities.map((e: any, i: number) => (
                      <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[40px] hover:border-indigo-500/30 transition-all group flex flex-col justify-between">
                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                  <h5 className="text-lg font-black text-white uppercase italic tracking-tight">{e.name}</h5>
                               </div>
                               <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getWeightColor(e.liabilityWeight)}`}>
                                  Exposure: {e.liabilityWeight}%
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-1">
                                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Role</span>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase italic">{e.role}</p>
                               </div>
                               <div className="space-y-1 text-right">
                                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Jurisdiction</span>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase italic">{e.jurisdiction}</p>
                               </div>
                            </div>
                         </div>
                         <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4">
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Connected To:</span>
                            <div className="flex -space-x-2">
                               {e.connections.map((cid: string, idx: number) => (
                                 <div key={idx} className="w-6 h-6 rounded-lg bg-indigo-600 border-2 border-black flex items-center justify-center text-[8px] font-black text-white shadow-xl" title={`Linked to Entity ID: ${cid}`}>
                                    {cid[0]}
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest">Protocol: Graph-Alpha Sync</span>
                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">
                       Deep Scan UBO Records <ChevronRight size={12} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SovereignGraph;
