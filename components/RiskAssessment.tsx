
import React, { useState, useMemo, useRef } from 'react';
import { ShieldAlert, Zap, Loader2, Download, CheckCircle2, ChevronRight, Activity, Terminal, AlertTriangle, Printer, Layers, Info, History, X, Sparkles, Edit3, FileSearch } from 'lucide-react';
import { generateRiskAssessment } from '../services/geminiService';
import { Language } from '../types';

interface RiskAssessmentProps {
  auditContext?: string;
  language?: Language;
}

declare var html2pdf: any;

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ auditContext, language = 'English' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [assessment, setAssessment] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [manualContext, setManualContext] = useState('');
  const [inputMode, setInputMode] = useState<'audit' | 'manual'>('manual');
  const reportRef = useRef<HTMLDivElement>(null);

  const effectiveContext = inputMode === 'audit' ? auditContext : manualContext;

  const handleGenerate = async () => {
    if (!effectiveContext) return;
    setIsGenerating(true);
    try {
      const result = await generateRiskAssessment(effectiveContext, language as Language);
      setAssessment(result);
    } catch (err) {
      console.error(err);
      alert("Risk synthesis failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const heatmapRisks = useMemo(() => {
    if (!assessment) return [];
    const risks: { name: string; impact: number; prob: number }[] = [];
    const lines = assessment.split('\n');
    lines.forEach(line => {
      const match = line.match(/(.*)\[IMPACT:\s*(\d+)\]\s*and\s*\[PROBABILITY:\s*(\d+)\]/i);
      if (match) {
        risks.push({
          name: match[1].replace(/^[-\d.]+\s*/, '').trim(),
          impact: parseInt(match[2]),
          prob: parseInt(match[3])
        });
      }
    });
    return risks.slice(0, 5);
  }, [assessment]);

  const handleExport = async () => {
    if (!assessment || !reportRef.current) return;
    if (typeof html2pdf === 'undefined') {
      alert("PDF engine isn't ready yet. Falling back to browser print.");
      window.print();
      return;
    }
    setIsExporting(true);
    const element = reportRef.current;
    const originalStyle = element.getAttribute('style') || '';
    window.scrollTo(0, 0);
    
    element.style.width = '850px';
    element.style.padding = '60px';
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';

    const opt = {
      margin: 10,
      filename: `LexiScan_Risk_Assessment_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      element.setAttribute('style', originalStyle);
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between no-print">
         <div>
            <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 07: Exposure</span>
            <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Risk <span className="text-red-500">Assessment.</span></h2>
            <p className="text-gray-500 text-lg font-medium italic mt-4">Deep probability mapping and mitigation synthesis.</p>
         </div>
         {assessment && (
           <button onClick={() => { setAssessment(null); setManualContext(''); }} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">New Assessment</button>
         )}
      </div>

      {!assessment ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex bg-white/5 border border-white/10 rounded-[32px] p-2 w-fit backdrop-blur-3xl shadow-2xl">
            <button 
              onClick={() => setInputMode('manual')} 
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] ${inputMode === 'manual' ? 'bg-red-600 text-white shadow-xl shadow-red-500/30' : 'text-gray-500 hover:text-white'}`}
            >
              <Edit3 size={16} /> From Scratch
            </button>
            <button 
              onClick={() => setInputMode('audit')} 
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] ${inputMode === 'audit' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'text-gray-500 hover:text-white'}`}
            >
              <FileSearch size={16} /> From Tactical Audit
            </button>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-12 md:p-20 shadow-2xl relative overflow-hidden no-print">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />
            
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center">
                <div className={`w-32 h-32 mx-auto rounded-[40px] border border-white/5 flex items-center justify-center text-red-500 shadow-2xl mb-8 transition-all duration-700 ${isGenerating ? 'bg-red-600/20 scale-110 animate-pulse' : 'bg-white/5'}`}>
                  <ShieldAlert size={64} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">
                  {inputMode === 'manual' ? 'Describe the Neural Context' : 'Inherit Audit Context'}
                </h3>
                <p className="text-gray-500 text-lg font-medium italic mt-2">
                  {inputMode === 'manual' 
                    ? '"Provide business details, project scope, or specific risks you want to scrutinize."' 
                    : '"Inheriting data from your most recent Tactical Audit module."'}
                </p>
              </div>

              {inputMode === 'manual' ? (
                <div className="relative group">
                  <textarea 
                    value={manualContext}
                    onChange={(e) => setManualContext(e.target.value)}
                    placeholder="E.g. We are a software startup signing a major partnership agreement with an international cloud provider. The contract includes vague data ownership clauses and high liability caps..."
                    className="w-full h-64 bg-black border border-white/10 rounded-[40px] p-10 text-white text-lg font-medium outline-none focus:ring-2 focus:ring-red-600 italic shadow-inner custom-scrollbar leading-relaxed"
                  />
                  <div className="absolute bottom-6 right-10 text-[9px] font-black text-gray-700 uppercase tracking-widest">Manual Injection Engine</div>
                </div>
              ) : (
                <div className={`p-10 border-2 border-dashed rounded-[40px] text-center transition-all ${auditContext ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 opacity-40'}`}>
                  {auditContext ? (
                    <div className="flex flex-col items-center gap-4">
                      <CheckCircle2 size={40} className="text-emerald-500" />
                      <p className="text-emerald-400 font-black uppercase text-xs tracking-widest">Audit Signal Synchronized</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <AlertTriangle size={40} className="text-gray-600" />
                      <p className="text-gray-600 font-black uppercase text-xs tracking-widest">No active audit found in this node.</p>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={handleGenerate} 
                disabled={isGenerating || !effectiveContext}
                className="w-full py-8 bg-white text-black font-black rounded-[32px] text-2xl hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-6 disabled:opacity-20"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={32}/> : <Zap size={32} fill="currentColor" />}
                {isGenerating ? 'Synthesizing...' : 'Generate Exposure Report'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in slide-in-from-bottom-6 duration-1000">
           {/* Summary & Heatmap Sidebar */}
           <div className="lg:col-span-1 space-y-8 no-print">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={18} className="text-red-500" /> Severity Matrix
                 </h4>
                 
                 <div className="grid grid-cols-5 grid-rows-5 gap-1.5 aspect-square bg-black/40 p-4 rounded-3xl border border-white/5 relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-black text-gray-700 tracking-widest">IMPACT</div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-700 tracking-widest">PROBABILITY</div>
                    {Array.from({ length: 25 }).map((_, i) => {
                      const row = 4 - Math.floor(i / 5);
                      const col = i % 5;
                      const isHigh = row >= 3 && col >= 3;
                      const isMed = (row >= 2 && col >= 2) && !isHigh;
                      const point = heatmapRisks.find(r => (r.prob - 1) === col && (r.impact - 1) === row);

                      return (
                        <div key={i} className={`rounded-md relative transition-all duration-1000 ${isHigh ? 'bg-red-500/10' : isMed ? 'bg-amber-500/10' : 'bg-emerald-500/5'} border border-white/5`}>
                           {point && (
                             <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-ping" />
                                <div className="absolute w-1.5 h-1.5 bg-white rounded-full z-10" />
                             </div>
                           )}
                        </div>
                      );
                    })}
                 </div>

                 <div className="space-y-4">
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Target Vectors</span>
                    {heatmapRisks.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                         <span className="text-[10px] font-bold text-gray-400 truncate max-w-[120px]">{r.name}</span>
                         <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${r.impact * r.prob > 12 ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                            Lvl {r.impact * r.prob}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>

              <button onClick={handleExport} disabled={isExporting} className="w-full py-6 bg-red-600 text-white font-black rounded-3xl flex items-center justify-center gap-4 hover:bg-red-500 transition-all shadow-2xl active:scale-95">
                 {isExporting ? <Loader2 className="animate-spin" size={20}/> : <Download size={20} />}
                 Export Master
              </button>
           </div>

           {/* Main Report Body */}
           <div ref={reportRef} className="lg:col-span-3 bg-[#0f0f0f] border border-white/10 rounded-[64px] p-12 md:p-20 shadow-2xl relative overflow-visible">
              <div className="prose prose-invert max-w-none">
                 {assessment.split('\n').map((line, i) => {
                    const trimmed = line.trim();
                    if (trimmed === '') return <div key={i} className="h-4" />;
                    if (line.startsWith('# ')) return <h1 key={i} className="text-4xl md:text-5xl font-black mb-12 pb-6 border-b-2 border-white/5 text-white tracking-tighter uppercase italic">{line.replace('# ', '')}</h1>;
                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-red-500 mt-16 mb-8 uppercase flex items-center gap-4 italic"><ChevronRight size={24}/> {line.replace('## ', '')}</h2>;
                    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-black text-white mt-10 mb-6 uppercase border-l-4 border-red-600 pl-6">{line.replace('### ', '')}</h3>;
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return (
                        <div key={i} className="flex gap-5 mb-6 p-6 bg-white/[0.02] border border-white/5 rounded-[32px] hover:bg-white/[0.04] transition-all">
                           <div className="mt-1.5 shrink-0"><Zap size={18} className="text-red-500" /></div>
                           <p className="text-gray-300 m-0 text-lg font-medium leading-relaxed italic">{line.replace(/^[-*]\s*/, '')}</p>
                        </div>
                      );
                    }
                    return <p key={i} className="text-gray-500 mb-8 leading-relaxed font-medium text-xl italic">{line}</p>;
                 })}
              </div>

              {/* Validation Seal */}
              <div className="mt-20 pt-12 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20 shadow-xl"><Terminal size={32}/></div>
                    <div>
                       <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Risk Vector Locked</h4>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Autonomous Neural Scrutiny Protocol v8.0</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">Node Signature</span>
                    <p className="text-xs font-mono text-red-500/40">LX-ASSESS-DELTA-9</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(239, 68, 68, 0.2); border-radius: 10px; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default RiskAssessment;
