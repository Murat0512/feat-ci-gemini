
import React, { useState, useEffect } from 'react';
import { Hammer, Zap, Loader2, ShieldAlert, Globe, ExternalLink, ChevronRight, Terminal, Info, ShieldCheck, Flame, Search, History, Sparkles, X, Activity } from 'lucide-react';
import { forgeLegalRebuttal } from '../services/geminiService';
import { Language } from '../types';

interface PrecedentForgeProps {
  language?: Language;
  initialRisk?: { type: string; clause: string };
}

const PrecedentForge: React.FC<PrecedentForgeProps> = ({ language = 'English', initialRisk }) => {
  const [riskType, setRiskType] = useState(initialRisk?.type || '');
  const [clauseText, setClauseText] = useState(initialRisk?.clause || '');
  const [isForging, setIsForging] = useState(false);
  const [rebuttal, setRebuttal] = useState<{ text: string; sources: any[] } | null>(null);

  const commonRisks = ['Liability Shift', 'Non-Compete', 'IP Grab', 'Automatic Renewal', 'Class Action Waiver'];

  const handleForge = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clauseText.trim() || !riskType.trim()) return;

    setIsForging(true);
    setRebuttal(null);
    try {
      const result = await forgeLegalRebuttal(clauseText, riskType, language as Language);
      setRebuttal(result);
    } catch (err) {
      console.error(err);
      alert("Forge synchronization failed. Data nodes are oscillating.");
    } finally {
      setIsForging(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 05: Combat</span>
          <h2 className="text-6xl font-black mb-2 tracking-tighter uppercase italic text-white">PRECEDENT <span className="text-orange-500">FORGE.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">Construct high-status rebuttals using real-world legal ammunition.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30" />
            
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3 mb-10"><Flame size={18} className="text-orange-500" /> The Anvil</h3>
            
            <form onSubmit={handleForge} className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2">Risk Classification</label>
                  <div className="flex flex-wrap gap-2">
                    {commonRisks.map(r => (
                      <button 
                        key={r} 
                        type="button"
                        onClick={() => setRiskType(r)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${riskType === r ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-white/5 text-gray-500 hover:text-white border border-white/5'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={riskType} 
                    onChange={(e) => setRiskType(e.target.value)} 
                    placeholder="Custom Risk Category..." 
                    className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:ring-1 focus:ring-orange-500 shadow-inner italic" 
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2">Target Clause</label>
                  <textarea 
                    value={clauseText}
                    onChange={(e) => setClauseText(e.target.value)}
                    placeholder="Paste the problematic clause here..."
                    className="w-full bg-black border border-white/10 rounded-3xl p-6 h-48 text-sm text-gray-400 font-medium outline-none focus:ring-1 focus:ring-orange-500 shadow-inner italic leading-relaxed"
                  />
               </div>

               <button 
                type="submit" 
                disabled={isForging || !clauseText.trim()}
                className="w-full py-7 bg-white text-black font-black rounded-[32px] text-xl hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30"
               >
                  {isForging ? <Loader2 className="animate-spin" size={24}/> : <Hammer size={24} />}
                  {isForging ? 'Forging Argument...' : 'Initialize Forge'}
               </button>
            </form>
          </div>

          <div className="bg-black border border-white/5 rounded-[48px] p-10 shadow-inner relative overflow-hidden">
             <div className="absolute top-10 left-10 flex items-center gap-3">
                <Terminal size={14} className="text-orange-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">Neural Log Feed</span>
             </div>
             <div className="mt-12 h-40 overflow-y-auto font-mono text-[9px] text-gray-600 space-y-3 pr-4 custom-scrollbar italic leading-relaxed">
                {isForging ? (
                  <div className="space-y-2">
                    <p className="animate-pulse text-orange-500">>> Establishing Precedent Grounding...</p>
                    <p className="animate-pulse text-orange-500 delay-100">>> Searching 2024 Appellate Decisions...</p>
                    <p className="animate-pulse text-orange-500 delay-300">>> Identifying Unconscionability Gaps...</p>
                  </div>
                ) : rebuttal ? 'Forge cycle complete. Rebuttal active.' : 'Forge idle. Awaiting tactical input...'}
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="bg-[#0f0f0f] border border-white/10 rounded-[64px] p-12 md:p-20 shadow-2xl relative overflow-hidden min-h-[750px]">
              {isForging && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center">
                   <div className="relative w-64 h-64 mb-12">
                      <div className="absolute inset-0 border-8 border-orange-500/10 rounded-full" />
                      <div className="absolute inset-0 border-t-8 border-orange-500 rounded-full animate-spin shadow-[0_0_50px_rgba(249,115,22,0.4)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Hammer size={80} className="text-orange-500 animate-pulse" />
                      </div>
                   </div>
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter animate-pulse">Tempering Tactical Strategy...</h3>
                </div>
              )}

              {rebuttal ? (
                <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-6 duration-700">
                   {rebuttal.text.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="text-5xl font-black mb-12 pb-6 border-b-2 border-white/5 text-white tracking-tighter uppercase italic">{line.replace('# ', '')}</h1>;
                    
                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-orange-500 mt-16 mb-8 uppercase flex items-center gap-4 italic"><ChevronRight size={24}/> {line.replace('## ', '')}</h2>;
                    
                    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-black text-white mt-10 mb-6 uppercase border-l-4 border-orange-500 pl-6">{line.replace('### ', '')}</h3>;
                    
                    if (line.startsWith('- ')) return <li key={i} className="text-gray-400 mb-4 list-none p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-start gap-4 hover:border-orange-500/30 transition-all"><Zap size={18} className="text-orange-500 mt-1 shrink-0" /> <span className="text-lg font-medium italic">{line.replace('- ', '')}</span></li>;

                    return <p key={i} className="text-gray-400 mb-8 leading-relaxed font-medium text-lg italic">{line}</p>;
                  })}

                  <div className="mt-20 pt-12 border-t border-white/5">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 flex items-center gap-3"><Globe size={18}/> Intelligence Ammunition</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rebuttal.sources.map((source, i) => (
                        <a 
                          key={i} 
                          href={source.web?.uri || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-orange-500/40 hover:bg-orange-500/5 transition-all group"
                        >
                          <p className="text-[11px] font-bold text-white mb-2 line-clamp-1 group-hover:text-orange-500 italic">{source.web?.title || 'Case Precedent'}</p>
                          <span className="text-[9px] text-gray-600 truncate block font-mono">{source.web?.uri}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : !isForging && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                   <Hammer size={160} />
                   <h3 className="text-4xl font-black uppercase tracking-tighter mt-12 italic">Forge Standby</h3>
                   <p className="text-xl font-medium mt-4">Initialize anvil sequence to construct tactical rebuttals.</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(249, 115, 22, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PrecedentForge;
