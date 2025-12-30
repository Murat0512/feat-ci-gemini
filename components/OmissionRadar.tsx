
import React, { useState } from 'react';
import { Radio, ShieldAlert, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, Target, Code, Copy, Check, X } from 'lucide-react';
import { runVoidScan } from '../services/geminiService';
import { Language } from '../types';

interface OmissionRadarProps {
  auditContext?: string;
  language?: Language;
}

const OmissionRadar: React.FC<OmissionRadarProps> = ({ auditContext, language = 'English' }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [voidData, setVoidData] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleRunScan = async () => {
    if (!auditContext) {
      alert("Void scanning requires a Tactical Audit context.");
      return;
    }
    setIsScanning(true);
    try {
      const result = await runVoidScan(auditContext, language as Language);
      setVoidData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 13: Structural Integrity</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Omission <span className="text-cyan-400">Radar.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Audit the "Negative Space" of your document for missing protections.</p>
        </div>
        {voidData && (
          <button onClick={() => setVoidData(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Clear Radar</button>
        )}
      </div>

      {!voidData ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />
          
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className={`absolute inset-0 rounded-full border-2 border-cyan-400/20 flex items-center justify-center transition-all duration-700 ${isScanning ? 'scale-110' : ''}`}>
               <Radio size={80} className={`text-cyan-400 ${isScanning ? 'animate-pulse' : 'opacity-40'}`} />
            </div>
            {isScanning && (
              <div className="absolute inset-0 border-r-4 border-cyan-400 rounded-full animate-[spin_2s_linear_infinite]" />
            )}
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Audit Legal Voids</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
              "Most risks are not what is in the document, but what is missing. The Radar will find structural gaps and provide Injection Blocks."
            </p>
          </div>
          
          <button 
            onClick={handleRunScan}
            disabled={isScanning || !auditContext}
            className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 mx-auto hover:bg-cyan-500 hover:text-white transition-all active:scale-95 disabled:opacity-30"
          >
            {isScanning ? <Loader2 className="animate-spin" size={32}/> : <Target size={32} />}
            {isScanning ? 'Pinging Nodes...' : 'Initialize Void Scan'}
          </button>
          {!auditContext && <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest italic mt-4">Audit context required for structural analysis.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in slide-in-from-bottom-6 duration-1000">
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={18} className="text-cyan-400" /> Structural Load
                 </h4>
                 
                 <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 text-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Integrity Index</span>
                    <div className={`text-7xl font-black italic tracking-tighter mt-4 ${voidData.structuralIntegrity > 70 ? 'text-emerald-500' : voidData.structuralIntegrity > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                      {voidData.structuralIntegrity}%
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Gap Locations</h5>
                    <div className="space-y-3">
                       {voidData.omissions.map((o: any, i: number) => (
                         <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase italic truncate">{o.name}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-3 space-y-8">
              <div className="bg-[#0f0f0f] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden h-full flex flex-col">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Radio size={240} className="text-cyan-400" /></div>
                 
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-cyan-400/10 border border-cyan-400/20 rounded-3xl flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-400/10">
                       <ShieldAlert size={32} />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Voids Detected in Infrastructure</span>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Missing Protections</h3>
                    </div>
                 </div>

                 <div className="space-y-8 flex-1">
                    {voidData.omissions.map((o: any, i: number) => (
                      <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[40px] group transition-all hover:border-cyan-400/30">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                               <h5 className="text-xl font-black text-white uppercase italic tracking-tight mb-4 flex items-center gap-3">
                                  <ChevronRight size={18} className="text-cyan-400" /> {o.name}
                               </h5>
                               <p className="text-sm font-medium text-gray-500 italic leading-relaxed">
                                  {o.risk}
                               </p>
                            </div>
                            <div className="space-y-4">
                               <div className="flex items-center justify-between mb-2">
                                  <span className="text-[9px] font-black uppercase text-gray-700 tracking-widest flex items-center gap-2"><Code size={12}/> Injection Block</span>
                                  <button 
                                    onClick={() => copyToClipboard(o.injectionBlock, i)}
                                    className="p-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all"
                                  >
                                    {copiedId === i ? <Check size={14}/> : <Copy size={14}/>}
                                  </button>
                               </div>
                               <div className="bg-cyan-400/[0.03] border border-cyan-400/20 p-6 rounded-3xl font-mono text-xs text-cyan-400/80 italic leading-relaxed shadow-inner max-h-40 overflow-y-auto custom-scrollbar">
                                  "{o.injectionBlock}"
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest">Protocol: Void-Alpha 1.0</span>
                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">
                       Commit Injection Blocks to Vault <ChevronRight size={12} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default OmissionRadar;
