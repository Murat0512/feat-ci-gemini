
import React, { useState } from 'react';
import { Ghost, ShieldAlert, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, Eye, EyeOff, Lock, Unlock, Download, RefreshCw, AlertCircle, FileSearch } from 'lucide-react';
import { runNeuralMaskScan } from '../services/geminiService';
import { Language } from '../types';

interface NeuralMaskProps {
  auditContext?: string;
  language?: Language;
}

const NeuralMask: React.FC<NeuralMaskProps> = ({ auditContext, language = 'English' }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [maskData, setMaskData] = useState<any>(null);
  const [revealedNodes, setRevealedNodes] = useState<Set<number>>(new Set());

  const handleRunScan = async () => {
    if (!auditContext) {
      alert("Privacy mask requires a Tactical Audit context.");
      return;
    }
    setIsScanning(true);
    try {
      const result = await runNeuralMaskScan(auditContext, language as Language);
      setMaskData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleReveal = (index: number) => {
    const next = new Set(revealedNodes);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setRevealedNodes(next);
  };

  const handleExport = () => {
    if (!maskData) return;
    const blob = new Blob([maskData.anonymizedSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LexiScan_Anonymized_Export_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-fuchsia-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 20: Privacy Sovereignty</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Neural <span className="text-fuchsia-500">Mask.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Autonomous PII detection and high-fidelity synthetic anonymization.</p>
        </div>
        {maskData && (
          <button onClick={() => { setMaskData(null); setRevealedNodes(new Set()); }} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Reset Mask</button>
        )}
      </div>

      {!maskData ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-600 to-transparent opacity-30" />
          <div className={`w-32 h-32 mx-auto rounded-[40px] border border-white/5 flex items-center justify-center text-fuchsia-500 shadow-2xl mb-8 transition-all duration-700 ${isScanning ? 'bg-fuchsia-600/20 scale-110 animate-pulse' : 'bg-white/5'}`}>
            <Ghost size={64} />
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Initialize Privacy Scrutiny</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
              "Detect sensitive PII clusters and generate synthetic aliases. Enable zero-knowledge collaboration without risking structural data exposure."
            </p>
          </div>
          <button 
            onClick={handleRunScan}
            disabled={isScanning || !auditContext}
            className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 mx-auto hover:bg-fuchsia-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
          >
            {isScanning ? <Loader2 className="animate-spin" size={32}/> : <Lock size={32} />}
            {isScanning ? 'Scrubbing Identity...' : 'Generate Neural Mask'}
          </button>
          {!auditContext && <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest italic mt-4">Audit context required for privacy masking.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in slide-in-from-bottom-6 duration-1000">
           {/* Sidebar Stats */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={18} className="text-fuchsia-500" /> Identity Density
                 </h4>
                 
                 <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 text-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Exposure Level</span>
                    <div className={`text-7xl font-black italic tracking-tighter mt-4 ${maskData.privacyScore > 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {maskData.privacyScore}%
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Sensitive Clusters</h5>
                    <div className="space-y-3">
                       {['Identity', 'Financial', 'Location', 'Contact'].map((type) => {
                         const count = maskData.piiNodes.filter((n: any) => n.type === type).length;
                         return (
                           <div key={type} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                              <span className="text-[10px] font-bold text-gray-400 uppercase italic">{type}</span>
                              <span className="text-[10px] font-black text-white">{count} Nodes</span>
                           </div>
                         );
                       })}
                    </div>
                 </div>
              </div>
           </div>

           {/* Main Display */}
           <div className="lg:col-span-3 space-y-8">
              <div className="bg-[#0f0f0f] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden h-full flex flex-col">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Ghost size={240} className="text-fuchsia-500" /></div>
                 
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-3xl flex items-center justify-center text-fuchsia-500 shadow-xl shadow-fuchsia-500/10">
                       <Lock size={32} />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.4em]">PII Inventory Scrubbed</span>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Synthetic Anonymization</h3>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    {maskData.piiNodes.map((n: any, i: number) => (
                      <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[40px] hover:border-fuchsia-500/30 transition-all group flex flex-col justify-between">
                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <div className="px-4 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">{n.type}</div>
                               <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${n.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>Risk: {n.riskLevel}</div>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-1">
                                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Original Data</span>
                                  <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                                     <p className={`text-sm font-bold text-white italic transition-all duration-500 ${revealedNodes.has(i) ? 'blur-0 opacity-100' : 'blur-md opacity-20'}`}>{n.original}</p>
                                     <button onClick={() => toggleReveal(i)} className="text-gray-600 hover:text-white transition-colors relative z-10">
                                        {revealedNodes.has(i) ? <Eye size={16}/> : <EyeOff size={16}/>}
                                     </button>
                                  </div>
                               </div>
                               <div className="space-y-1">
                                  <span className="text-[8px] font-black text-fuchsia-500 uppercase tracking-widest">Synthetic Mask</span>
                                  <div className="bg-fuchsia-500/5 p-4 rounded-2xl border border-fuchsia-500/20">
                                     <p className="text-sm font-black text-fuchsia-400 italic">"{n.masked}"</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Terminal size={14} className="text-fuchsia-500" />
                       <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">DISCLOSURE-ALPHA READY</span>
                    </div>
                    <button 
                      onClick={handleExport}
                      className="px-8 py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-fuchsia-600 hover:text-white transition-all shadow-xl"
                    >
                       <Download size={14}/> Export Anonymized Summary
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NeuralMask;
