
import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Zap, Loader2, ShieldCheck, AlertTriangle, Trash2, Plus, ArrowRight, Download, Terminal, BrainCircuit, Activity, Book, X, Save, Check } from 'lucide-react';
import { evaluateSandboxComposition } from '../services/geminiService';
import { GlobalProvision, Language } from '../types';

interface NeuralSandboxProps {
  provisions: GlobalProvision[];
  language?: Language;
}

const NeuralSandbox: React.FC<NeuralSandboxProps> = ({ provisions, language = 'English' }) => {
  const [composition, setComposition] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [riskData, setRiskData] = useState<{ score: number, risks: string[], conflicts: string[] } | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const evaluationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (composition.length > 20) {
      if (evaluationTimerRef.current) clearTimeout(evaluationTimerRef.current);
      evaluationTimerRef.current = window.setTimeout(runEvaluation, 2000);
    } else {
      setRiskData(null);
    }
  }, [composition]);

  const runEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const result = await evaluateSandboxComposition(composition, language as Language);
      setRiskData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const insertProvision = (prov: GlobalProvision) => {
    setComposition(prev => prev + (prev ? '\n\n' : '') + prov.safeClause);
  };

  const handleExport = () => {
    const blob = new Blob([composition], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LexiScan_Composition_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 17: Clause Composer</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Clause <span className="text-indigo-400">Sandbox.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Draft documents with real-time neural risk scoring and library integration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 h-[750px]">
        {/* Provision Library Sidebar */}
        <div className="lg:col-span-1 bg-[#0a0a0a] border border-white/10 rounded-[48px] p-8 shadow-2xl flex flex-col overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                 <Book size={18} className="text-indigo-400" /> Neural Library
              </h4>
              <span className="text-[8px] font-black text-gray-800 uppercase px-3 py-1 bg-white/5 rounded-full">{provisions.length} Nodes</span>
           </div>
           <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {provisions.length > 0 ? provisions.map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => insertProvision(p)}
                  className="w-full p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={14} className="text-indigo-400" /></div>
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{p.category}</span>
                   </div>
                   <p className="text-[10px] font-bold text-gray-400 italic line-clamp-3 group-hover:text-gray-200">"{p.safeClause}"</p>
                </button>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-20 px-6">
                   <Book size={64} className="mb-6" />
                   <p className="text-[10px] font-black uppercase tracking-widest italic leading-relaxed">No provisions in standard library. commit nodes in Module 01.</p>
                </div>
              )}
           </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-[64px] relative overflow-hidden flex flex-col shadow-2xl">
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-30" />
           
           <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl"><Edit3 size={20}/></div>
                 <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 block">Active Composition</span>
                    <h5 className="text-[11px] font-black text-white uppercase italic">Draft_Nexus_01.txt</h5>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setComposition('')} className="p-3 bg-white/5 rounded-xl text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
              </div>
           </div>

           <div className="flex-1 relative">
              <textarea 
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                placeholder="Begin drafting your document or inject provisions from the library..."
                className="w-full h-full bg-transparent p-12 text-lg font-medium text-gray-300 outline-none focus:ring-0 italic leading-relaxed custom-scrollbar resize-none font-serif"
              />
              {!composition && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                   <Edit3 size={200} />
                </div>
              )}
           </div>

           <div className="p-8 border-t border-white/5 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-8">
                 <span className="text-[8px] font-mono text-gray-700 tracking-widest uppercase">WORDS: {composition.split(/\s+/).filter(x => x).length}</span>
                 <span className="text-[8px] font-mono text-gray-700 tracking-widest uppercase">SYMBOLS: {composition.length}</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleExport}
                  disabled={!composition}
                  className="px-8 py-3 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 hover:text-white transition-all shadow-xl disabled:opacity-30"
                >
                   <Download size={14}/> Export Draft
                </button>
              </div>
           </div>
        </div>

        {/* Neural Analytics Sidebar */}
        <div className="lg:col-span-1 space-y-8 flex flex-col">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10 relative overflow-hidden flex-1 flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5"><BrainCircuit size={120} /></div>
              <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                 <Activity size={18} className="text-indigo-400" /> Real-Time Analytics
              </h4>

              <div className="flex-1 flex flex-col gap-10 justify-center">
                 <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-12 text-center shadow-inner relative group overflow-hidden">
                    {isEvaluating && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-[40px] z-10 gap-3 backdrop-blur-sm">
                         <Loader2 className="animate-spin text-indigo-500" size={32}/>
                         <span className="text-[8px] font-black uppercase text-indigo-400 animate-pulse tracking-widest">Neural Scrutiny...</span>
                      </div>
                    )}
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest block mb-4">Neural Exposure Score</span>
                    <div className={`text-7xl font-black italic tracking-tighter transition-colors duration-1000 ${!riskData ? 'text-gray-800' : riskData.score > 50 ? 'text-red-500' : riskData.score > 20 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {riskData ? (riskData.score < 10 ? `0${riskData.score}` : riskData.score) : '00'}%
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                       <h5 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Identified Risks</h5>
                       {riskData && <span className="text-[8px] font-black text-gray-800 uppercase">{riskData.risks.length + riskData.conflicts.length} Signals</span>}
                    </div>
                    <div className="space-y-3 h-64 overflow-y-auto custom-scrollbar pr-2">
                       {riskData && riskData.risks.length > 0 ? riskData.risks.map((r, i) => (
                         <div key={i} className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl animate-in slide-in-from-right-2 duration-300">
                            <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                            <span className="text-[10px] font-bold text-gray-400 italic leading-snug">{r}</span>
                         </div>
                       )) : riskData && riskData.conflicts.length > 0 ? null : (
                         <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                            <ShieldCheck size={48} className="mb-4" />
                            <p className="text-[8px] font-black uppercase tracking-widest italic">No Risks Acquired</p>
                         </div>
                       )}
                       
                       {riskData && riskData.conflicts.map((c, i) => (
                         <div key={`c-${i}`} className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl animate-in slide-in-from-right-2 duration-300">
                            <Zap size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-[10px] font-bold text-gray-400 italic leading-snug">{c}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                 <div className="flex items-center gap-3 text-[9px] font-black text-gray-800 uppercase tracking-widest">
                    <Terminal size={12}/> Analysis v1.0 Stable
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }
      `}</style>
    </div>
  );
};

export default NeuralSandbox;
