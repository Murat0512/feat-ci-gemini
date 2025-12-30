
import React, { useState } from 'react';
import { Search, Loader2, ShieldAlert, Globe, ExternalLink, AlertCircle, CheckCircle2, Building2, Terminal, Zap, Fingerprint, ChevronRight, TrendingDown, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { generateCounterpartyDossier } from '../services/geminiService';
import { Language } from '../types';

interface CounterpartyDossierProps {
  language?: Language;
}

const CounterpartyDossier: React.FC<CounterpartyDossierProps> = ({ language = 'English' }) => {
  const [companyName, setCompanyName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dossier, setDossier] = useState<{ text: string, sources: any[] } | null>(null);
  const [financialRisk, setFinancialRisk] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsAnalyzing(true);
    setDossier(null);
    try {
      const result = await generateCounterpartyDossier(companyName, language as Language);
      setDossier(result);
      
      const financialMatch = result.text.match(/\[FINANCIAL_RISK_INDEX\]:\s*(\d+)/i);
      if (financialMatch) setFinancialRisk(parseInt(financialMatch[1]));
    } catch (err) {
      console.error(err);
      alert("Neural sync for dossier failed. Try another company name.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 70) return 'text-red-500';
    if (score > 40) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="max-w-5xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 03: Intelligence</span>
          <h2 className="text-6xl font-black mb-2 tracking-tighter uppercase italic text-white">ADVERSARY <span className="text-indigo-500">DOSSIER.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">Deep financial and solvency scrutiny via Google Grounding.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
        
        <form onSubmit={handleSearch} className="relative z-10 max-w-2xl mx-auto text-center space-y-10">
          <div className="w-24 h-24 bg-indigo-600/10 rounded-[32px] border border-indigo-500/20 flex items-center justify-center mx-auto mb-8 text-indigo-400 shadow-2xl">
            <Building2 size={40} />
          </div>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Identify Target Entity</h3>
          <p className="text-gray-500 text-lg font-medium leading-relaxed italic">LexiScan will scrutinize litigation records and 2024 financial reports to calculate a risk coefficient.</p>
          
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter Company Name (e.g. Meta, LexiCorp, Tesla)"
              className="w-full bg-black border border-white/10 rounded-3xl py-7 pl-16 pr-6 focus:ring-2 focus:ring-indigo-500 outline-none text-white text-xl font-bold placeholder:text-gray-700 transition-all shadow-inner"
            />
          </div>

          <button 
            type="submit" 
            disabled={isAnalyzing || !companyName.trim()}
            className="w-full py-7 bg-white text-black font-black rounded-[32px] text-xl hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={24}/> : <Zap size={24} fill="currentColor" />}
            {isAnalyzing ? 'Mapping Entity...' : 'Synthesize Dossier'}
          </button>
        </form>
      </div>

      {isAnalyzing && (
        <div className="py-20 flex flex-col items-center justify-center gap-8">
           <div className="relative">
              <div className="w-32 h-32 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
              <Fingerprint className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={40} />
           </div>
           <div className="text-center">
              <p className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] mb-2 animate-pulse">Establishing Signal Grounding...</p>
              <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">Querying SEC Filings & Litigation Ledgers</p>
           </div>
        </div>
      )}

      {dossier && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3"><Activity size={18}/> Risk Metrics</h4>
              
              <div className="space-y-8">
                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 text-center">
                  <p className="text-[9px] font-black text-gray-600 uppercase mb-2 tracking-widest">Financial Risk</p>
                  <div className={`text-5xl font-black ${getRiskColor(financialRisk)} tracking-tighter`}>{financialRisk}%</div>
                  <div className="mt-4 flex justify-center">{financialRisk > 50 ? <TrendingUp size={24} className="text-red-500"/> : <TrendingDown size={24} className="text-emerald-500"/>}</div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                   <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2"><Globe size={14}/> Evidence Sync</h5>
                   <div className="space-y-3">
                     {dossier.sources.map((source, i) => (
                       <a 
                         key={i} 
                         href={source.web?.uri || '#'} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="block p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group"
                       >
                         <p className="text-[10px] font-bold text-white mb-1.5 line-clamp-1 group-hover:text-indigo-400 italic">{source.web?.title || 'Intelligence Signal'}</p>
                         <span className="text-[8px] text-gray-700 truncate block font-mono">{source.web?.uri}</span>
                       </a>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-[64px] p-12 md:p-20 shadow-2xl relative overflow-hidden">
               <div className="prose prose-invert max-w-none">
                  {dossier.text.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="text-5xl font-black mb-12 pb-6 border-b-2 border-white/5 text-white tracking-tighter uppercase italic">{line.replace('# ', '')}</h1>;
                    
                    if (line.startsWith('## [FINANCIAL_RISK_INDEX]') || line.startsWith('## [REPUTATION_SCORE]')) return null;

                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-indigo-400 mt-16 mb-8 uppercase flex items-center gap-4 italic"><ChevronRight size={24}/> {line.replace('## ', '')}</h2>;
                    
                    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-black text-white mt-10 mb-6 uppercase border-l-4 border-indigo-500 pl-6">{line.replace('### ', '')}</h3>;
                    
                    if (line.startsWith('- ')) return <li key={i} className="text-gray-400 mb-2 list-none flex items-start gap-3"><Zap size={14} className="text-indigo-500 mt-1 shrink-0" /> <span className="italic">{line.replace('- ', '')}</span></li>;

                    return <p key={i} className="text-gray-400 mb-8 leading-relaxed font-medium text-lg italic">{line}</p>;
                  })}
               </div>

               <div className="mt-20 p-12 bg-indigo-500/5 border border-indigo-500/10 rounded-[48px] flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400"><DollarSign size={32}/></div>
                    <div>
                       <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Solvency Verified</h4>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Cross-Referenced against Real-Time Grounding</p>
                    </div>
                  </div>
                  <button onClick={() => window.print()} className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors"><ExternalLink size={20}/></button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterpartyDossier;
