
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Zap, Terminal, BrainCircuit, Activity, ChevronRight, X, Sparkles, Command, ShieldCheck, Cpu } from 'lucide-react';
import { runNeuralCommandStream } from '../services/geminiService';
import { HistoricAudit, Language } from '../types';

interface NeuralCommandProps {
  vaultContext: HistoricAudit[];
  language?: Language;
}

const NeuralCommand: React.FC<NeuralCommandProps> = ({ vaultContext, language = 'English' }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinkingText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsProcessing(true);
    setThinkingText('Establishing neural pathway...');

    let fullAiResponse = '';
    try {
      await runNeuralCommandStream(
        userMsg, 
        vaultContext, 
        (chunk: string) => {
          setThinkingText(''); // Clear initial status
          fullAiResponse += chunk;
          setThinkingText(fullAiResponse); // Use thinkingText as the "streaming" buffer
        },
        language as Language
      );
      setMessages(prev => [...prev, { role: 'ai', text: fullAiResponse }]);
      setThinkingText('');
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Signal disruption detected. Command failed." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 15: Central Command</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Neural <span className="text-cyan-400">Command.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Unified workspace intelligence co-pilot.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-[700px]">
        {/* Main Chat Panel */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-[64px] flex flex-col shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />
          
          <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
            {messages.length === 0 && !thinkingText && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-8">
                 <BrainCircuit size={120} className="text-cyan-400" />
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black uppercase italic tracking-widest">Awaiting Command</h3>
                    <p className="text-lg font-medium">Linked to {vaultContext.length} active audit records.</p>
                 </div>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-6 animate-in slide-in-from-bottom-4 duration-500 ${m.role === 'ai' ? 'items-start' : 'items-start flex-row-reverse'}`}>
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-xl ${m.role === 'ai' ? 'bg-cyan-500/10 border border-cyan-400/20 text-cyan-400' : 'bg-white/5 border border-white/10 text-gray-500'}`}>
                  {m.role === 'ai' ? <Cpu size={24}/> : <ShieldCheck size={24}/>}
                </div>
                <div className={`max-w-[80%] p-8 rounded-[40px] italic text-lg leading-relaxed ${m.role === 'ai' ? 'bg-white/[0.03] border border-white/5 text-gray-300' : 'bg-indigo-600 text-white shadow-2xl'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {thinkingText && (
              <div className="flex gap-6 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center shadow-xl animate-pulse">
                  <Cpu size={24}/>
                </div>
                <div className="max-w-[80%] p-8 rounded-[40px] bg-white/[0.03] border border-white/5 text-gray-400 italic text-lg leading-relaxed">
                  {thinkingText}
                  <span className="inline-block w-2 h-5 bg-cyan-400 ml-2 animate-pulse align-middle" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-10 border-t border-white/5 bg-black/40">
             <div className="relative group">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Inquire about vault risks or specific clauses..."
                  className="w-full bg-black border border-white/10 rounded-full py-7 pl-10 pr-24 text-xl font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500 italic shadow-inner transition-all"
                />
                <button 
                  type="submit" 
                  disabled={isProcessing || !inputText.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all shadow-2xl active:scale-90 disabled:opacity-30"
                >
                  <Send size={24} />
                </button>
             </div>
          </form>
        </div>

        {/* Intelligence Context Panel */}
        <div className="space-y-8">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10 relative overflow-hidden group h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Terminal size={160} /></div>
              <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                 <Activity size={18} className="text-cyan-400" /> System Context
              </h4>
              
              <div className="space-y-6">
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Active Workspace</span>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl"><Zap size={20}/></div>
                       <p className="text-lg font-black text-white italic uppercase truncate">Project Nexus-Alpha</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Ingested Nodes</h5>
                    <div className="space-y-3 h-[300px] overflow-y-auto custom-scrollbar pr-2">
                       {vaultContext.length > 0 ? vaultContext.map((a, i) => (
                         <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-cyan-400/30 transition-all">
                            <div className={`w-2 h-2 rounded-full ${a.score > 70 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase italic truncate">{a.fileName}</span>
                         </div>
                       )) : (
                         <p className="text-[10px] font-black uppercase text-gray-800 italic">No nodes available.</p>
                       )}
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                 <div className="flex items-center gap-3 text-[9px] font-black text-gray-700 uppercase tracking-widest">
                    <Command size={14}/> CMD-LINK ACTIVE
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NeuralCommand;
