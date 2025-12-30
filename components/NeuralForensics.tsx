
import React, { useState } from 'react';
import { Fingerprint, ShieldCheck, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, HardDrive, FileText, Download, CheckCircle2, X, Lock } from 'lucide-react';
import { generateForensicManifest } from '../services/geminiService';
import { HistoricAudit, Language } from '../types';

interface NeuralForensicsProps {
  audits: HistoricAudit[];
  language?: Language;
}

const NeuralForensics: React.FC<NeuralForensicsProps> = ({ audits, language = 'English' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [manifest, setManifest] = useState<string | null>(null);

  const handleGenerateManifest = async () => {
    if (audits.length === 0) {
      alert("Operational history required to generate manifest.");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateForensicManifest(audits, language as Language);
      setManifest(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getHash = (id: string) => {
    return `LX-${id.substring(0, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 16: Chain of Custody</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Neural <span className="text-emerald-500">Forensics.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Compliance audit trail and cryptographic-style operational logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-12 shadow-2xl relative overflow-hidden h-full flex flex-col">
              <div className="flex items-center justify-between mb-12">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                    <HardDrive size={24} className="text-emerald-500" /> Operational Log
                 </h3>
                 <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{audits.length} Events Logged</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar max-h-[600px]">
                 {audits.length > 0 ? audits.map((a, i) => (
                   <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl group hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                               <CheckCircle2 size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-white uppercase italic">{a.fileName}</p>
                               <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">{a.timestamp}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-[8px] font-mono text-emerald-500/40 uppercase block">NODE SIGNATURE</span>
                            <span className="text-[10px] font-mono text-gray-600 font-bold">{getHash(a.id)}</span>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                         <div className="flex items-center gap-2">
                            <Activity size={10} className="text-gray-600" />
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Scrutiny Depth: {a.score}%</span>
                         </div>
                         <div className="flex items-center gap-2 justify-end">
                            <Lock size={10} className="text-gray-600" />
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Verified AES-4096</span>
                         </div>
                      </div>
                   </div>
                 )) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-20">
                      <Fingerprint size={120} />
                      <h4 className="text-2xl font-black uppercase tracking-widest mt-8">No Signatures Found</h4>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><BrainCircuit size={120} /></div>
              <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                 <ShieldCheck size={18} className="text-emerald-500" /> Compliance Manifest
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed italic">Synthesize all workspace operations into a single Due Diligence Manifest for disclosure.</p>
              <button 
                onClick={handleGenerateManifest}
                disabled={isGenerating || audits.length === 0}
                className="w-full py-6 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-4 text-[12px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-20"
              >
                 {isGenerating ? <Loader2 className="animate-spin" size={20}/> : <Zap size={20} fill="currentColor" />}
                 {isGenerating ? 'Computing History...' : 'Synthesize Manifest'}
              </button>
           </div>

           {manifest && (
             <div className="bg-[#0f0f0f] border border-emerald-500/20 rounded-[48px] p-10 shadow-2xl animate-in slide-in-from-right-4 duration-500 relative overflow-hidden">
                <button onClick={() => setManifest(null)} className="absolute top-8 right-8 text-gray-700 hover:text-white transition-colors"><X size={20}/></button>
                <div className="prose prose-invert max-w-none">
                   {manifest.split('\n').map((line, i) => {
                     if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-black text-white uppercase italic mb-6 tracking-tighter border-b border-white/5 pb-4">{line.replace('# ', '')}</h1>;
                     if (line.startsWith('## ')) return <h2 key={i} className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 mt-8">{line.replace('## ', '')}</h2>;
                     return <p key={i} className="text-[11px] font-medium text-gray-400 italic leading-relaxed mb-4">{line}</p>;
                   })}
                </div>
                <div className="mt-8 pt-8 border-t border-white/5">
                   <button onClick={() => window.print()} className="w-full py-4 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
                      <Download size={14}/> Export Disclosure PDF
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NeuralForensics;
