
import React, { useState, useMemo } from 'react';
import { Gavel, ShieldAlert, Loader2, Zap, AlertTriangle, Scale, BookOpen, BrainCircuit, ChevronRight, Terminal, Info, ExternalLink, TrendingDown, TrendingUp, X } from 'lucide-react';
import { projectJudicialOutcome } from '../services/geminiService';
import { Language } from '../types';

interface CourtroomProjectionProps {
  auditContext?: string;
  language?: Language;
}

const CourtroomProjection: React.FC<CourtroomProjectionProps> = ({ auditContext, language = 'English' }) => {
  const [isProjecting, setIsProjecting] = useState(false);
  const [projection, setProjection] = useState<any>(null);

  const handleRunProjection = async () => {
    if (!auditContext) {
      console.warn("Courtroom projection requires audit context");
      alert("⚖️ Context Required: Complete a Tactical Audit first to enable judicial projection.");
      return;
    }
    setIsProjecting(true);
    try {
      // Cast language to Language to satisfy the type requirement of projectJudicialOutcome
      const result = await projectJudicialOutcome(auditContext, language as Language);
      setProjection(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProjecting(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score > 80) return 'text-emerald-500';
    if (score > 50) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-violet-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 09: Outcome Projection</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">Gavel <span className="text-violet-500">Engine.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">Simulate judicial interpretations across diverse legal archetypes.</p>
        </div>
        {projection && (
          <button onClick={() => setProjection(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">New Projection</button>
        )}
      </div>

      {!projection ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-600 to-transparent opacity-30" />
          <div className={`w-32 h-32 mx-auto rounded-[40px] border border-white/5 flex items-center justify-center text-violet-500 shadow-2xl mb-8 transition-all duration-700 ${isProjecting ? 'bg-violet-600/20 scale-110 animate-pulse' : 'bg-white/5'}`}>
            <Gavel size={64} />
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Project Verdict Probability</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
              "Establish a neural link to forecast how this document would be interpreted in a 2025 judicial challenge."
            </p>
          </div>
          <button 
            onClick={handleRunProjection}
            disabled={isProjecting || !auditContext}
            className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 mx-auto hover:bg-violet-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
          >
            {isProjecting ? <Loader2 className="animate-spin" size={32}/> : <Zap size={32} fill="currentColor" />}
            {isProjecting ? 'Projecting Outcomes...' : 'Run Gavel Engine'}
          </button>
          {!auditContext && <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest italic mt-4">Audit context required for simulation.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-6 duration-1000">
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Scale size={18} className="text-violet-500" /> Outcome Scorecard
                 </h4>
                 
                 <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 text-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Survives Challenge</span>
                    <div className={`text-7xl font-black italic tracking-tighter mt-4 ${projection.verdictProbability > 50 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {projection.verdictProbability}%
                    </div>
                    <div className="mt-6 flex justify-center">
                       {projection.verdictProbability > 50 ? <TrendingUp className="text-emerald-500" /> : <TrendingDown className="text-red-500" />}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">At-Risk Terminology</h5>
                    <div className="space-y-3">
                       {projection.loadBearingClauses.map((clause: string, i: number) => (
                         <div key={i} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-3 group hover:bg-red-500/10 transition-all">
                            <ShieldAlert size={14} className="text-red-500" />
                            <span className="text-[11px] font-bold text-gray-300 italic group-hover:text-white">"{clause}"</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 grid grid-cols-1 gap-8">
              {projection.judges.map((judge: any, i: number) => (
                <div key={i} className="bg-[#0f0f0f] border border-white/10 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-all">
                      <Scale size={120} />
                   </div>
                   <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/20 shadow-xl">
                            <BrainCircuit size={28} />
                         </div>
                         <div>
                            <span className="text-[9px] font-black text-violet-400 uppercase tracking-[0.4em]">Judicial Perspective</span>
                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{judge.archetype}</h4>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest block mb-1">Confidence</span>
                         <span className={`text-xl font-black ${getConfidenceColor(judge.confidence)}`}>{judge.confidence}%</span>
                      </div>
                   </div>
                   <div className="bg-black/40 border border-white/5 rounded-3xl p-8 shadow-inner italic leading-relaxed text-gray-400 font-medium">
                      "{judge.ruling}"
                   </div>
                   <div className="mt-8 flex justify-end">
                      <button className="flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">
                         View Reference <ChevronRight size={12} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default CourtroomProjection;
