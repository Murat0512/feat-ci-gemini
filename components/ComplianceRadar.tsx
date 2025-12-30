
import React, { useState, useEffect, useRef } from 'react';
import { Radar, ShieldCheck, Globe, Loader2, Zap, AlertTriangle, CheckCircle2, Terminal, ExternalLink, ChevronRight, Fingerprint, Search, Info } from 'lucide-react';
import { checkCompliance } from '../services/geminiService';
import { Language } from '../types';

interface ComplianceRadarProps {
  language?: Language;
  auditContext?: string;
}

const ComplianceRadar: React.FC<ComplianceRadarProps> = ({ language = 'English', auditContext }) => {
  const [jurisdiction, setJurisdiction] = useState('European Union');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<{ text: string, sources: any[] } | null>(null);
  const [radarScore, setRadarScore] = useState(0);

  const jurisdictions = ['United States', 'European Union', 'United Kingdom', 'Asia-Pacific', 'Middle East'];

  const handleRadarScan = async () => {
    if (!auditContext) {
      alert("Please perform a Tactical Audit first to provide document context.");
      return;
    }

    setIsAnalyzing(true);
    setReport(null);
    setRadarScore(0);

    try {
      // Added explicit cast to Language to fix type mismatch error where 'string' was being inferred
      const result = await checkCompliance(auditContext, jurisdiction, language as Language);
      setReport(result);
      
      const scoreMatch = result.text.match(/\[ALIGNMENT_INDEX\]:\s*(\d+)/i);
      if (scoreMatch) setRadarScore(parseInt(scoreMatch[1]));
    } catch (err) {
      console.error(err);
      alert("Radar sync failed. Grounding nodes are congested.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score > 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="reveal-on-scroll">
          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 04: Compliance</span>
          <h2 className="text-6xl font-black mb-2 tracking-tighter uppercase italic text-white">REGULATORY <span className="text-emerald-500">RADAR.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">2024-2025 regulatory cross-referencing via Google Search Grounding.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10 relative overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
             
             <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3"><Globe size={18}/> Targeting Node</h4>
                <div className="space-y-3">
                  {jurisdictions.map(j => (
                    <button 
                      key={j} 
                      onClick={() => setJurisdiction(j)}
                      className={`w-full p-6 rounded-3xl border text-left transition-all text-xs font-black uppercase tracking-widest ${jurisdiction === j ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                    >
                      {j}
                    </button>
                  ))}
                </div>
             </div>

             <button 
              onClick={handleRadarScan} 
              disabled={isAnalyzing || !auditContext}
              className="w-full py-7 bg-white text-black font-black rounded-[32px] text-xl hover:bg-emerald-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30"
             >
                {isAnalyzing ? <Loader2 className="animate-spin" size={24}/> : <Radar size={24} />}
                {isAnalyzing ? 'Scanning Nodes...' : 'Initialize Radar'}
             </button>
             
             {!auditContext && <p className="text-center text-[10px] font-black text-red-500/60 uppercase tracking-widest italic mt-4">Audit context required for scan.</p>}
          </div>

          <div className="bg-black border border-white/5 rounded-[48px] p-10 shadow-inner relative overflow-hidden group">
             <div className="absolute top-10 left-10 flex items-center gap-3">
                <Terminal size={14} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">Radar Feed</span>
             </div>
             <div className="mt-12 h-48 overflow-y-auto font-mono text-[10px] text-gray-500 space-y-4 pr-4 custom-scrollbar italic leading-relaxed">
                {isAnalyzing ? (
                  <div className="space-y-2">
                    <p className="animate-pulse text-emerald-500">{`>> Searching ${jurisdiction} Federal Register...`}</p>
                    <p className="animate-pulse text-emerald-500 delay-100">{`>> Cross-referencing EU AI Act Article 23...`}</p>
                    <p className="animate-pulse text-emerald-500 delay-300">{`>> Calculating Delta Gaps...`}</p>
                    
                  </div>
                ) : report ? 'Regulatory sync successful. See report.' : 'Radar awaiting jurisdiction targeting...'}
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="bg-[#0f0f0f] border border-white/10 rounded-[64px] p-12 md:p-20 shadow-2xl relative overflow-hidden min-h-[700px]">
              {/* Radar UI Effect */}
              {isAnalyzing && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center">
                   <div className="relative w-80 h-80">
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full scale-75" />
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full scale-50" />
                      <div className="absolute inset-0 border-r-4 border-emerald-500 rounded-full animate-radar-sweep" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Fingerprint size={64} className="text-emerald-500 animate-pulse" />
                      </div>
                   </div>
                </div>
              )}

              {report ? (
                <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-6 duration-700">
                   {report.text.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="text-5xl font-black mb-12 pb-6 border-b-2 border-white/5 text-white tracking-tighter uppercase italic">{line.replace('# ', '')}</h1>;
                    
                    if (line.startsWith('## [ALIGNMENT_INDEX]')) {
                      const score = line.split(': ')[1] || '0%';
                      return (
                        <div key={i} className="mb-12 flex items-center gap-6">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Compliance Health:</span>
                           <div className={`px-8 py-2 rounded-full border text-xs font-black uppercase tracking-[0.3em] shadow-xl ${getScoreColor(radarScore)}`}>
                             {score} Alignmed
                           </div>
                        </div>
                      );
                    }

                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-emerald-400 mt-16 mb-8 uppercase flex items-center gap-4 italic"><ChevronRight size={24}/> {line.replace('## ', '')}</h2>;
                    
                    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-black text-white mt-10 mb-6 uppercase border-l-4 border-emerald-500 pl-6">{line.replace('### ', '')}</h3>;
                    
                    return <p key={i} className="text-gray-400 mb-8 leading-relaxed font-medium text-lg italic">{line}</p>;
                  })}

                  <div className="mt-20 pt-12 border-t border-white/5">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 flex items-center gap-3"><ExternalLink size={18}/> Intelligence Sources</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.sources.map((source, i) => (
                        <a 
                          key={i} 
                          href={source.web?.uri || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
                        >
                          <p className="text-[11px] font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400">{source.web?.title || 'Regulatory Evidence'}</p>
                          <span className="text-[9px] text-gray-600 truncate block font-mono italic">{source.web?.uri}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : !isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                   <Radar size={160} />
                   <h3 className="text-4xl font-black uppercase tracking-tighter mt-12 italic">Target Not Acquired</h3>
                   <p className="text-xl font-medium mt-4">Initialize scanning node to establish regulatory sync.</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <style>{`
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-radar-sweep {
          animation: radar-sweep 2s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ComplianceRadar;