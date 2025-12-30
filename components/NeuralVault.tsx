
import React, { useState, useRef } from 'react';
import { Archive, Trash2, ExternalLink, Calendar, FileText, ShieldAlert, ChevronRight, Search, LayoutGrid, List, Sparkles, Loader2, X, Info, DatabaseZap, Download, Upload, ShieldCheck, Zap, History, RefreshCw, Move, Layers, Check, AlertCircle, Swords, Mic2, Square, CheckSquare } from 'lucide-react';
import { HistoricAudit, AppView } from '../types';
import { searchVaultIntelligence } from '../services/geminiService';

interface NeuralVaultProps {
  audits: HistoricAudit[];
  onLoadAudit: (audit: HistoricAudit) => void;
  onDeleteAudit: (id: string) => void;
  onImportVault?: (importedAudits: HistoricAudit[]) => void;
  onAction?: (audit: HistoricAudit, view: AppView) => void;
  onSynthesize?: (selected: HistoricAudit[]) => void;
}

const NeuralVault: React.FC<NeuralVaultProps> = ({ audits, onLoadAudit, onDeleteAudit, onImportVault, onAction, onSynthesize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [matchedIds, setMatchedIds] = useState<string[] | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setMatchedIds(null);
      return;
    }
    if (audits.length === 0) return;
    setIsSearching(true);
    try {
      const results = await searchVaultIntelligence(audits, searchQuery);
      setMatchedIds(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExportVault = () => {
    if (audits.length === 0) return;
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(audits, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.download = `LexiScan_Vault_Backup_${new Date().toISOString().slice(0,10)}.nexus`;
      linkElement.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export Failed:", err);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setMatchedIds(null);
  };

  const filteredAudits = matchedIds 
    ? audits.filter(a => matchedIds.includes(a.id))
    : audits;

  const isArchiveEmpty = audits.length === 0;

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="reveal-on-scroll">
          <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Archive Management</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">Neural <span className="text-indigo-500">Vault.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">Historical scrutiny archive and global signal ledger.</p>
        </div>
        <div className="flex items-center gap-4">
           <input type="file" id="import-nexus-master" onChange={(e) => {
             const file = e.target.files?.[0];
             if (!file) return;
             const r = new FileReader();
             r.onload = (ev) => {
               try {
                 const json = JSON.parse(ev.target?.result as string);
                 if (Array.isArray(json) && onImportVault) onImportVault(json);
               } catch (err) { console.error(err); }
             };
             r.readAsText(file);
           }} className="hidden" accept=".nexus,.json,application/json" />
           <label htmlFor="import-nexus-master" className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all flex items-center gap-2 group shadow-xl cursor-pointer">
             <Upload size={14} /> Inject Backup
           </label>
           <div className="px-8 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-4 shadow-2xl">
              <div className={`w-2 h-2 rounded-full ${isArchiveEmpty ? 'bg-gray-700' : 'bg-indigo-500 animate-pulse'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">{audits.length} Records Committed</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          <div className={`bg-[#0a0a0a] border rounded-[40px] p-2 shadow-2xl relative group overflow-hidden transition-all duration-500 ${isArchiveEmpty ? 'border-white/5 opacity-60' : 'border-white/10'}`}>
             <form onSubmit={handleSearch} className="relative z-10 flex items-center gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"><Search size={24} /></div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isArchiveEmpty ? "Archive empty. Perform an audit..." : "Natural Language Vault Search..."}
                    className="w-full bg-transparent border-none py-7 pl-20 pr-6 focus:ring-0 outline-none text-white text-xl font-bold placeholder:text-gray-800 transition-all italic"
                  />
                </div>
                <div className="flex gap-2 pr-4">
                  {searchQuery && <button type="button" onClick={clearSearch} className="p-4 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>}
                  <button type="submit" disabled={isSearching || !searchQuery.trim()} className="px-10 py-5 bg-white text-black font-black rounded-[28px] text-[11px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 disabled:opacity-30 shadow-2xl">
                    {isSearching ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16} />} Neural Scan
                  </button>
                </div>
             </form>
          </div>

          {filteredAudits.length === 0 ? (
            <div className="py-48 bg-[#0a0a0a] border-2 border-dashed border-white/5 rounded-[64px] flex flex-col items-center justify-center text-center opacity-20"><Archive size={100} className="mb-8" /><h4 className="text-4xl font-black uppercase tracking-tighter italic">VAULT OFFLINE</h4></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
              {filteredAudits.map((audit) => (
                <div key={audit.id} onClick={() => toggleSelect(audit.id)} className={`bg-[#0a0a0a] border rounded-[48px] p-10 flex flex-col justify-between group hover:border-indigo-500/30 transition-all shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 cursor-pointer ${selectedIds.has(audit.id) ? 'border-indigo-500 bg-indigo-500/5 shadow-indigo-500/20 scale-[1.02]' : 'border-white/5'}`}>
                   <div className="relative z-10">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           {selectedIds.has(audit.id) ? <CheckSquare className="text-indigo-500" size={20}/> : <Square className="text-gray-800" size={20}/>}
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">{audit.timestamp}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteAudit(audit.id); }} className="text-gray-800 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                     </div>
                     <div className="flex items-center gap-6 mb-10">
                        <div className={`w-16 h-16 rounded-2xl bg-${audit.color}-500/10 border border-${audit.color}-500/20 flex items-center justify-center text-${audit.color}-500 shadow-xl group-hover:scale-110 transition-transform`}><FileText size={28} /></div>
                        <div className="overflow-hidden">
                           <h4 className="text-xl font-black text-white truncate italic uppercase tracking-tight">{audit.fileName}</h4>
                           <div className="flex items-center gap-4 mt-1">
                              <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Global Ledger</span>
                              {onAction && (
                                <div className="flex items-center gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); onAction(audit, AppView.NEGOTIATION_DUEL); }} className="text-red-500/40 hover:text-red-500 transition-colors" title="Launch Duel"><Swords size={10}/></button>
                                  <button onClick={(e) => { e.stopPropagation(); onAction(audit, AppView.LIVE_CONSULT); }} className="text-indigo-500/40 hover:text-indigo-500 transition-colors" title="Launch Consult"><Mic2 size={10}/></button>
                                </div>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="flex items-end justify-between border-t border-white/5 pt-8">
                        <div>
                           <span className="text-[9px] font-black uppercase text-gray-700 mb-1 block">Risk Score</span>
                           <span className={`text-4xl font-black text-${audit.color}-500 tracking-tighter`}>{audit.score}%</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onLoadAudit(audit); }} className="p-5 bg-white/5 text-gray-500 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl"><ExternalLink size={20} /></button>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><DatabaseZap size={120} /></div>
              <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] flex items-center gap-3"><ShieldCheck size={16} className="text-emerald-500" /> State Control</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium italic">"Physicalize your intelligence or perform a complete archive extraction."</p>
              <button onClick={handleExportVault} disabled={isArchiveEmpty || isExporting} className="w-full py-6 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl disabled:opacity-20">{isExporting ? <Loader2 className="animate-spin" size={18}/> : <Download size={18} />} Extract Master</button>
           </div>
           <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[48px] p-10 space-y-8">
              <div className="flex items-center gap-3"><RefreshCw size={16} className="text-indigo-400" /><span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Integrity Log</span></div>
              <div className="space-y-4 font-mono text-[9px] text-gray-600"><p className="flex justify-between"><span>Active Sync</span> <span className="text-emerald-500">Verified</span></p><p className="flex justify-between"><span>Selection</span> <span className="text-white">{selectedIds.size} Active</span></p></div>
           </div>
        </div>
      </div>

      {selectedIds.size >= 2 && onSynthesize && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] w-full max-w-2xl animate-in slide-in-from-bottom-12 duration-500">
           <div className="bg-[#0f0f0f]/90 backdrop-blur-2xl border border-indigo-500/30 rounded-[40px] p-6 flex items-center justify-between shadow-2xl shadow-indigo-500/20">
              <div className="flex items-center gap-6 pl-4">
                 <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20"><Layers size={24}/></div>
                 <div>
                    <h5 className="text-lg font-black text-white uppercase italic tracking-tighter">{selectedIds.size} Audits Linked</h5>
                    <p className="text-[9px] font-black uppercase text-indigo-400/60 tracking-widest">Macro-Synthesis Ready</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setSelectedIds(new Set())} className="text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest px-4">Discard</button>
                 <button onClick={() => onSynthesize(audits.filter(a => selectedIds.has(a.id)))} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-3xl flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">
                    <Zap size={16} fill="currentColor"/> Portfolio Posture
                 </button>
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

export default NeuralVault;
