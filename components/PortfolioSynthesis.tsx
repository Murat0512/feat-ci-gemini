
import React, { useState, useEffect, useMemo } from 'react';
import { Layers, Zap, Loader2, BarChart3, TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, Terminal, ChevronRight, Activity, BrainCircuit, Info, Target, PieChart, Database } from 'lucide-react';
import { synthesizePortfolioRisk } from '../services/geminiService';
import { HistoricAudit, Language } from '../types';

interface PortfolioSynthesisProps {
  audits: HistoricAudit[];
  language?: Language;
}

const PortfolioSynthesis: React.FC<PortfolioSynthesisProps> = ({ audits, language = 'English' }) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [posture, setPosture] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (audits.length === 0) return { avg: 0, total: 0, critical: 0 };
    const avg = Math.round(audits.reduce((acc, curr) => acc + curr.score, 0) / audits.length);
    const critical = audits.filter(a => a.score > 70).length;
    return { avg, total: audits.length, critical };
  }, [audits]);

  const handleSynthesize = async () => {
    if (audits.length < 2) {
      alert("At least two audit signatures are required for macro-synthesis.");
      return;
    }
    setIsSynthesizing(true);
    try {
      const result = await synthesizePortfolioRisk(audits, language as Language);
      setPosture(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-violet-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 08: Macro Intelligence</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Portfolio <span className="text-violet-500">Synthesis.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Aggregate workspace signals into a single unified commercial posture.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KPI Cards */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Database size={80} /></div>
           <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest block mb-4">Ingested Nodes</span>
           <div className="text-6xl font-black text-white italic tracking-tighter mb-2">{stats.total}</div>
           <p className="text-xs text-gray-500 font-medium italic">Active workspace signatures</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={80} /></div>
           <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest block mb-4">Aggregate Risk</span>
           <div className={`text-6xl font-black italic tracking-tighter mb-2 ${stats.avg > 50 ? 'text-red-500' : 'text-emerald-500'}`}>{stats.avg}%</div>
           <p className="text-xs text-gray-500 font-medium italic">Workspace exposure mean</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldAlert size={80} /></div>
           <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest block mb-4">Critical Vectors</span>
           <div className="text-6xl font-black text-red-500 italic tracking-tighter mb-2">{stats.critical}</div>
           <p className="text-xs text-gray-500 font-medium italic">High-alert exposure points</p>
        </div>
      </div>

      {!posture ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-600 to-transparent opacity-30" />
          <div className={`w-32 h-32 mx-auto rounded-[40px] border border-white/5 flex items-center justify-center text-violet-500 shadow-2xl mb-8 transition-all duration-700 ${isSynthesizing ? 'bg-violet-600/20 scale-110 animate-pulse' : 'bg-white/5'}`}>
            <BrainCircuit size={64} />
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Generate Macro Posture</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
              "Establish a neural link to analyze all {stats.total} audit signatures simultaneously. Identify cross-contract liabilities and systemic risks."
            </p>
          </div>
          <button 
            onClick={handleSynthesize}
            disabled={isSynthesizing || audits.length < 2}
            className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 mx-auto hover:bg-violet-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
          >
            {isSynthesizing ? <Loader2 className="animate-spin" size={32}/> : <Zap size={32} fill="currentColor" />}
            {isSynthesizing ? 'Aggregating Signals...' : 'Initialize Synthesis'}
          </button>
          {audits.length < 2 && <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest italic mt-4">Two or more audits required for macro analysis.</p>}
        </div>
      ) : (
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[64px] p-12 md:p-20 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-6 duration-1000">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><BarChart3 size={240} className="text-violet-500" /></div>
           <button onClick={() => setPosture(null)} className="absolute top-12 right-12 text-gray-700 hover:text-white transition-colors">
              <X size={32} />
           </button>
           
           <div className="prose prose-invert max-w-none">
              {posture.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-4xl md:text-5xl font-black mb-12 pb-6 border-b-2 border-white/5 text-white tracking-tighter uppercase italic">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-violet-400 mt-16 mb-8 uppercase flex items-center gap-4 italic"><ChevronRight size={24}/> {line.replace('## ', '')}</h2>;
                if (line.startsWith('- ')) return <li key={i} className="text-gray-400 mb-2 list-none flex items-start gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5"><Zap size={16} className="text-violet-500 mt-1 shrink-0" /> <span className="text-lg font-medium italic">{line.replace('- ', '')}</span></li>;
                return <p key={i} className="text-gray-500 mb-8 leading-relaxed font-medium text-xl italic">{line}</p>;
              })}
           </div>

           <div className="mt-20 pt-12 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-500 border border-violet-500/20 shadow-xl"><Terminal size={32}/></div>
                 <div>
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Macro Posture Locked</h4>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Calculated across {stats.total} Neural Nodes</p>
                 </div>
              </div>
              <button onClick={() => window.print()} className="px-10 py-5 bg-white text-black font-black rounded-3xl uppercase tracking-widest text-xs shadow-xl hover:bg-violet-600 hover:text-white transition-all">Export Executive Posture</button>
           </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

export default PortfolioSynthesis;
