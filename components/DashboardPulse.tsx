
import React, { useState, useEffect } from 'react';
import { Globe, Zap, Loader2, ExternalLink, ShieldAlert, Radio, Newspaper, ChevronRight, Activity, Terminal, CheckCircle2, History } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { HistoricAudit } from '../types';

interface NewsItem {
  title: string;
  uri: string;
  type: 'external' | 'internal';
  timestamp?: string;
  level?: 'info' | 'alert' | 'success';
}

interface DashboardPulseProps {
  jurisdiction: string;
  recentAudits?: HistoricAudit[];
}

const DashboardPulse: React.FC<DashboardPulseProps> = ({ jurisdiction, recentAudits = [] }) => {
  const [signals, setSignals] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      setIsLoading(true);
      const compositeSignals: NewsItem[] = [];

      // 1. Inject Internal Milestones from the current Workspace
      recentAudits.slice(0, 3).forEach(audit => {
        compositeSignals.push({
          title: `Audit Committed: ${audit.fileName}`,
          uri: "#",
          type: 'internal',
          timestamp: audit.timestamp,
          level: audit.score > 70 ? 'alert' : 'success'
        });
      });

      // 2. Fetch External Regulatory Signals via Google Search Grounding
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Provide two critical regulatory or legal news updates specifically for the ${jurisdiction} region related to Artificial Intelligence, Data Privacy, or Contract Law in 2024 or 2025. Return a brief list.`,
          config: { tools: [{ googleSearch: {} }] }
        });

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        sources.slice(0, 2).forEach((s: any) => {
          compositeSignals.push({
            title: s.web?.title || "Regulatory Signal Detected",
            uri: s.web?.uri || "#",
            type: 'external',
            level: 'info'
          });
        });
      } catch (err) {
        console.error("External SIGINT Failed", err);
      }

      // Sort: Internal milestones first
      setSignals(compositeSignals.sort((a, b) => (a.type === 'internal' ? -1 : 1)));
      setIsLoading(false);
    };

    fetchSignals();
  }, [jurisdiction, recentAudits]);

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group h-full flex flex-col">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Radio size={120} />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.15)]">
            <Activity size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Intelligence Stream</h3>
            <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.4em] mt-1">Real-time Node SIGINT</p>
          </div>
        </div>
        {isLoading && <Loader2 size={16} className="animate-spin text-indigo-500" />}
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse" />
          ))
        ) : signals.length > 0 ? (
          signals.map((item, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-3xl border transition-all group/item relative overflow-hidden ${
                item.type === 'internal' 
                  ? 'bg-indigo-500/5 border-indigo-500/10 hover:bg-indigo-500/10' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
              }`}
            >
              {item.type === 'internal' && (
                <div className={`absolute left-0 inset-y-0 w-1 ${item.level === 'alert' ? 'bg-red-500' : 'bg-indigo-500'}`} />
              )}
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'internal' ? <Terminal size={10} className="text-indigo-400" /> : <Globe size={10} className="text-gray-500" />}
                    <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${item.type === 'internal' ? 'text-indigo-400' : 'text-gray-600'}`}>
                      {item.type === 'internal' ? 'System Milestone' : 'External Signal'}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-gray-300 leading-tight group-hover/item:text-white transition-colors italic line-clamp-2">
                    {item.title}
                  </p>
                  {item.timestamp && (
                    <span className="text-[8px] font-mono text-gray-700 block mt-1">{item.timestamp}</span>
                  )}
                </div>
                {item.type === 'external' && (
                  <a href={item.uri} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-xl text-gray-600 hover:text-indigo-400 hover:bg-white/10 transition-all shadow-lg active:scale-95">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-12">
            <Radio size={64} className="mb-4 text-gray-500" />
            <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest italic">Signal Flatline...</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
        <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Protocol: Sovereign Link</span>
        <button className="text-[9px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all group/btn">
          Full Log <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

export default DashboardPulse;
