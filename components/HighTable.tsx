
import React, { useState } from 'react';
import { Users, ShieldAlert, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, Scale, Building2, Radio, CheckCircle2, X } from 'lucide-react';
import { runHighTableConsensus } from '../services/geminiService';
import { Language } from '../types';

interface HighTableProps {
  auditContext?: string;
  language?: Language;
}

const HighTable: React.FC<HighTableProps> = ({ auditContext, language = 'English' }) => {
  const [isConvening, setIsConvening] = useState(false);
  const [consensus, setConsensus] = useState<any>(null);

  const handleConvene = async () => {
    if (!auditContext) {
      alert("Executive consensus requires a Tactical Audit context.");
      return;
    }
    setIsConvening(true);
    try {
      const result = await runHighTableConsensus(auditContext, language as Language);
      setConsensus(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConvening(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 10: Executive Consensus</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">The <span className="text-amber-500">High Table.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">Simulate a multi-agent executive debate to reach unified commercial directives.</p>
        </div>
        {consensus && (
          <button onClick={() => setConsensus(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Dismiss Table</button>
        )}
      </div>

      {!consensus ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-30" />
          <div className={`w-32 h-32 mx-auto rounded-[40px] border border-white/5 flex items-center justify-center text-amber-500 shadow-2xl mb-8 transition-all duration-700 ${isConvening ? 'bg-amber-600/20 scale-110 animate-pulse' : 'bg-white/5'}`}>
            <Users size={64} />
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Convene the Executive Panel</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
              "Establish a neural link to 3 specialized agents. They will debate risk, commercial opportunity, and compliance before issuing a final Go/No-Go directive."
            </p>
          </div>
          <button 
            onClick={handleConvene}
            disabled={isConvening || !auditContext}
            className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 mx-auto hover:bg-amber-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
          >
            {isConvening ? <Loader2 className="animate-spin" size={32}/> : <Zap size={32} fill="currentColor" />}
            {isConvening ? 'Simulating Debate...' : 'Initialize Consensus'}
          </button>
          {!auditContext && <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest italic mt-4">Audit context required to convene the table.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in slide-in-from-bottom-6 duration-1000">
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={18} className="text-amber-500" /> Consensus Index
                 </h4>
                 
                 <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 text-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Unified Approval</span>
                    <div className={`text-7xl font-black italic tracking-tighter mt-4 ${consensus.consensusScore > 50 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {consensus.consensusScore}%
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Point of Contention</h5>
                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
                       <Radio size={14} className="text-amber-500 mt-1 shrink-0" />
                       <span className="text-[11px] font-bold text-gray-300 italic group-hover:text-white">"{consensus.keyContentionPoint}"</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-3 space-y-8">
              <div className="bg-[#0f0f0f] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                 <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                    <Terminal size={20} className="text-amber-500" />
                    <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Neural Debate Log</h3>
                 </div>
                 <div className="space-y-8">
                    {consensus.debateLog.map((log: any, i: number) => (
                      <div key={i} className="flex gap-6 animate-in slide-in-from-left-4" style={{ animationDelay: `${i * 200}ms` }}>
                         <div className="shrink-0 flex flex-col items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${log.agent === 'Senior Partner' ? 'bg-red-500/10 border-red-500/20 text-red-500' : log.agent === 'Commercial Director' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                               {log.agent === 'Senior Partner' ? <Scale size={20}/> : log.agent === 'Commercial Director' ? <Building2 size={20}/> : <ShieldAlert size={20}/>}
                            </div>
                            <div className="w-px flex-1 bg-white/5" />
                         </div>
                         <div className="pb-8">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">{log.agent}</span>
                            <p className="text-lg font-medium italic text-gray-300 leading-relaxed">"{log.argument}"</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-amber-600/5 border border-amber-500/20 rounded-[56px] p-12 flex items-center gap-10 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><BrainCircuit size={200}/></div>
                 <div className="w-20 h-20 bg-amber-500 rounded-[32px] flex items-center justify-center text-black shadow-2xl shadow-amber-600/20 shrink-0"><CheckCircle2 size={40}/></div>
                 <div className="flex-1">
                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.4em] mb-4 block">Unified Executive Directive</span>
                    <p className="text-white text-2xl font-black italic leading-relaxed tracking-tight">{consensus.unifiedDirective}</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HighTable;
