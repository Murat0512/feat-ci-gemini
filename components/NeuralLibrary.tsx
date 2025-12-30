
import React, { useState, useEffect } from 'react';
import { Book, Search, Plus, Trash2, Copy, Check, ChevronRight, FileText, ShieldCheck, Zap, ArrowRight, X, ExternalLink, Filter, Tags, LayoutGrid, List } from 'lucide-react';
import { GlobalProvision } from '../types';

interface NeuralLibraryProps {
  provisions: GlobalProvision[];
  onDelete: (id: string) => void;
  onAdd: (provision: Omit<GlobalProvision, 'id' | 'timestamp'>) => void;
}

const NeuralLibrary: React.FC<NeuralLibraryProps> = ({ provisions, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const [newProvision, setNewProvision] = useState({
    category: 'Liability',
    originalClause: '',
    safeClause: '',
    tags: [] as string[]
  });

  const categories = ['All', 'Liability', 'Termination', 'IP', 'Compliance', 'Privacy'];

  const filtered = provisions.filter(p => {
    const matchesSearch = p.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.safeClause.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvision.safeClause) return;
    onAdd(newProvision);
    setNewProvision({ category: 'Liability', originalClause: '', safeClause: '', tags: [] });
    setIsAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Standard of Truth</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">Neural <span className="text-indigo-500">Library.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">Your persistent archive of battle-tested sovereign provisions.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="px-10 py-5 bg-white text-black font-black rounded-[32px] flex items-center gap-4 text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
        >
          <Plus size={20} /> Create Provision
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 space-y-10 shadow-2xl">
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3"><Filter size={18}/> Categories</h4>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setFilterCategory(cat)}
                      className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-left transition-all ${filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-2 shadow-2xl relative group overflow-hidden">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                <Search size={22} />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Sovereign Provisions..." 
                className="w-full bg-transparent border-none py-7 pl-20 pr-8 text-xl font-bold text-white outline-none placeholder:text-gray-800 italic"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((p) => (
                <div key={p.id} className="bg-[#0a0a0a] border border-white/5 rounded-[48px] p-10 flex flex-col justify-between group hover:border-indigo-500/30 transition-all shadow-2xl relative overflow-hidden h-[450px]">
                   <div className="relative z-10">
                     <div className="flex items-center justify-between mb-8">
                        <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">{p.category}</span>
                        <button onClick={() => onDelete(p.id)} className="text-gray-800 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                     </div>
                     <div className="space-y-6">
                        <div>
                           <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-2 block">Fixed Provision</span>
                           <div className="bg-black border border-white/5 rounded-3xl p-6 h-48 overflow-y-auto custom-scrollbar font-mono text-sm text-gray-300 italic leading-relaxed">
                              {p.safeClause}
                           </div>
                        </div>
                     </div>
                   </div>
                   <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                      <span className="text-[8px] font-mono text-gray-700">VERSION: 1.0.STABLE</span>
                      <button 
                        onClick={() => handleCopy(p.id, p.safeClause)}
                        className={`p-4 rounded-2xl transition-all shadow-xl ${copiedId === p.id ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-indigo-600 hover:text-white'}`}
                      >
                         {copiedId === p.id ? <Check size={20}/> : <Copy size={20}/>}
                      </button>
                   </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-48 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[64px] flex flex-col items-center justify-center opacity-20">
                   <Book size={80} className="mb-8" />
                   <p className="text-2xl font-black uppercase tracking-widest italic">Standard library empty</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-8 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 relative shadow-2xl">
            <button onClick={() => setIsAdding(false)} className="absolute top-12 right-12 text-gray-500 hover:text-white transition-colors"><X size={40}/></button>
            <h2 className="text-4xl font-black mb-10 text-white uppercase italic tracking-tighter">Forge <span className="text-indigo-500">Standard.</span></h2>
            <form onSubmit={handleAddSubmit} className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Provision Category</label>
                  <select 
                    value={newProvision.category} 
                    onChange={(e) => setNewProvision({...newProvision, category: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-2xl p-6 text-white text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner appearance-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Safe-State Text</label>
                  <textarea 
                    required
                    value={newProvision.safeClause}
                    onChange={(e) => setNewProvision({...newProvision, safeClause: e.target.value})}
                    placeholder="Enter the golden provision text..."
                    className="w-full bg-black border border-white/10 rounded-3xl p-6 h-40 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 italic shadow-inner"
                  />
               </div>
               <button type="submit" className="w-full py-7 bg-white text-black font-black rounded-[32px] text-xl uppercase italic shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95">Commit to Library</button>
            </form>
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

export default NeuralLibrary;
