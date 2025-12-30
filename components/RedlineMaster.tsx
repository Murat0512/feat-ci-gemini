
import React, { useState, useEffect } from 'react';
import { GitCompare, Loader2, Zap, ArrowRight, ShieldAlert, CheckCircle2, History, X, Terminal, FileText, Download, TrendingUp, AlertTriangle } from 'lucide-react';
import { generateNeuralRedline, forecastLitigationVector } from '../services/geminiService';
import { Language } from '../types';

interface RedlineMasterProps {
  language?: Language;
  onRedlineComplete?: (redline: string) => void;
}

const RedlineMaster: React.FC<RedlineMasterProps> = ({ language = 'English', onRedlineComplete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [redlineContent, setRedlineContent] = useState<string | null>(null);
  const [baseDoc, setBaseDoc] = useState('');
  const [counterDoc, setCounterDoc] = useState('');
  
  const [forecastResult, setForecastResult] = useState<{ score: number, rationale: string } | null>(null);
  const [isForecasting, setIsForecasting] = useState(false);

  const handleRunRedline = async () => {
    if (!baseDoc || !counterDoc) return;
    setIsGenerating(true);
    setRedlineContent(null);
    try {
      const result = await generateNeuralRedline(baseDoc, counterDoc, language as Language);
      setRedlineContent(result);
      if (onRedlineComplete) onRedlineComplete(result);
    } catch (err) { console.error(err); } finally { setIsGenerating(false); }
  };

  const runForecast = async (text: string) => {
    setIsForecasting(true);
    try {
      const result = await forecastLitigationVector(text);
      const scoreMatch = result.match(/(\d+)%/);
      setForecastResult({
        score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
        rationale: result.split(': ').slice(1).join(': ') || result
      });
    } catch (err) { console.error(err); } finally { setIsForecasting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 06</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">Redline <span className="text-indigo-500">Master.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">High-fidelity visual track-changes and litigation forecasting.</p>
        </div>
      </div>

      {!redlineContent ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 space-y-6 shadow-2xl">
              <h3 className="text-[11px] font-black uppercase text-gray-600 flex items-center gap-3 tracking-widest"><FileText size={18}/> Base Document Text</h3>
              <textarea 
                value={baseDoc}
                onChange={(e) => setBaseDoc(e.target.value)}
                placeholder="Paste original text..."
                className="w-full h-80 bg-black border border-white/5 rounded-3xl p-8 text-sm text-gray-400 font-mono outline-none focus:ring-2 focus:ring-indigo-500 italic shadow-inner custom-scrollbar"
              />
           </div>
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={120} /></div>
              <h3 className="text-[11px] font-black uppercase text-indigo-500 flex items-center gap-3 tracking-widest"><GitCompare size={18}/> Counter-Offer Text</h3>
              <textarea 
                value={counterDoc}
                onChange={(e) => setCounterDoc(e.target.value)}
                placeholder="Paste adversarial counter-text..."
                className="w-full h-80 bg-black border border-white/5 rounded-3xl p-8 text-sm text-indigo-400/70 font-mono outline-none focus:ring-2 focus:ring-indigo-500 italic shadow-inner custom-scrollbar"
              />
           </div>
           <div className="lg:col-span-2 flex justify-center pt-8">
              <button 
                onClick={handleRunRedline} 
                disabled={isGenerating || !baseDoc || !counterDoc}
                className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center gap-6 disabled:opacity-20"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={32}/> : <GitCompare size={32} />}
                Synthesize Redline
              </button>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           <div className="lg:col-span-3 bg-[#0f0f0f] border border-white/10 rounded-[64px] p-20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-indigo-500"><Terminal size={200} /></div>
              <div className="flex items-center justify-between mb-20 border-b border-white/5 pb-12">
                 <h3 className="text-3xl font-black text-indigo-500 uppercase italic">NEURAL <span className="text-white">REDLINE.</span></h3>
                 <button onClick={() => setRedlineContent(null)} className="p-4 bg-white/5 rounded-2xl hover:text-red-500 transition-colors"><X/></button>
              </div>
              <div className="prose prose-invert max-w-none font-mono text-base leading-relaxed text-gray-400">
                 {redlineContent.split('\n').map((line, i) => {
                    const isRemoved = line.includes('~~');
                    const isAdded = line.includes('**_') || line.includes('_**');
                    return (
                      <p key={i} className={`mb-6 p-4 rounded-xl border transition-all hover:bg-white/5 cursor-pointer ${isRemoved ? 'bg-red-500/5 border-red-500/10 text-red-400 line-through opacity-60' : isAdded ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400 font-bold' : 'border-transparent text-gray-500'}`} onClick={() => runForecast(line)}>
                        {line}
                      </p>
                    );
                 })}
              </div>
           </div>
           
           <div className="space-y-8">
              <div className={`bg-[#0a0a0a] border rounded-[48px] p-10 shadow-2xl transition-all duration-700 ${forecastResult ? 'border-indigo-500 bg-indigo-500/5 shadow-indigo-500/20' : 'border-white/10'}`}>
                 <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><TrendingUp size={16} className="text-indigo-500" /> Litigation Forecast</h4>
                 {isForecasting ? (
                   <div className="py-20 flex flex-col items-center justify-center gap-6">
                      <Loader2 className="animate-spin text-indigo-500" size={48} />
                      <p className="text-[10px] font-black uppercase text-indigo-500/50 animate-pulse tracking-[0.3em]">Querying Precedent...</p>
                   </div>
                 ) : forecastResult ? (
                   <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                      <div className="bg-black/60 rounded-[32px] p-8 text-center border border-white/5">
                         <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest block mb-4">Conflict Probability</span>
                         <div className={`text-6xl font-black italic tracking-tighter ${forecastResult.score > 50 ? 'text-red-500' : 'text-emerald-500'}`}>{forecastResult.score}%</div>
                      </div>
                      <p className="text-sm font-medium text-gray-400 italic leading-relaxed text-center">{forecastResult.rationale}</p>
                      <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                         <div className="flex items-center gap-2 text-red-500/40 font-black uppercase text-[9px] tracking-widest"><AlertTriangle size={10}/> High Risk Vector</div>
                      </div>
                   </div>
                 ) : (
                   <div className="py-20 text-center opacity-10">
                      <Zap size={64} className="mx-auto mb-6" />
                      <p className="text-xs font-black uppercase tracking-widest italic leading-loose">Select a redline segment <br /> to forecast risk.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default RedlineMaster;
