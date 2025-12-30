
import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, FileText, Layers, Zap, X, ChevronRight, Hash, Mic2, ShieldAlert, Rocket, Archive } from 'lucide-react';
import { AppView, Project, HistoricAudit } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: AppView) => void;
  projects: Project[];
  onSelectProject: (id: string) => void;
  audits: HistoricAudit[];
  onLoadAudit: (audit: HistoricAudit) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, setView, projects, onSelectProject, audits, onLoadAudit }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigationItems = [
    { id: AppView.DASHBOARD, label: 'Nerve Center', icon: Zap },
    { id: AppView.LEGAL_AUDIT, label: 'Tactical Audit', icon: FileText },
    { id: AppView.REDLINE_MASTER, label: 'Redline Master', icon: FileText },
    { id: AppView.RISK_ASSESSMENT, label: 'Risk Assessment', icon: ShieldAlert },
    { id: AppView.MARKETING_SUITE, label: 'Nexus Lab', icon: Rocket },
    { id: AppView.NEURAL_VAULT, label: 'Neural Vault', icon: Archive },
  ];

  const filteredNav = navigationItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredAudits = audits.filter(a => 
    a.fileName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const totalItems = filteredNav.length + filteredProjects.length + filteredAudits.length;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setSelectedIndex(prev => (prev + 1) % totalItems);
      if (e.key === 'ArrowUp') setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
      if (e.key === 'Enter') executeSelection();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalItems]);

  const executeSelection = () => {
    let currentPos = 0;
    
    // Check Navigation
    if (selectedIndex < filteredNav.length) {
      setView(filteredNav[selectedIndex].id);
      onClose();
      return;
    }
    currentPos += filteredNav.length;

    // Check Projects
    if (selectedIndex < currentPos + filteredProjects.length) {
      onSelectProject(filteredProjects[selectedIndex - currentPos].id);
      onClose();
      return;
    }
    currentPos += filteredProjects.length;

    // Check Audits
    if (selectedIndex < currentPos + filteredAudits.length) {
      onLoadAudit(filteredAudits[selectedIndex - currentPos]);
      onClose();
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-start justify-center pt-[15vh] px-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-top-4 duration-500">
        <div className="relative border-b border-white/5 group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500">
            <Search size={20} />
          </div>
          <input 
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search audits..."
            className="w-full bg-transparent py-6 pl-16 pr-6 text-lg font-bold text-white outline-none italic placeholder:text-gray-800"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-black text-gray-500 uppercase tracking-widest">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4 space-y-6">
          {filteredNav.length > 0 && (
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700 ml-4 mb-3 block">Navigation</span>
              <div className="space-y-1">
                {filteredNav.map((item, idx) => (
                  <button 
                    key={item.id} 
                    onClick={() => { setView(item.id); onClose(); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedIndex === idx ? 'bg-white/5 border border-white/10 shadow-xl' : 'border border-transparent hover:bg-white/[0.02]'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedIndex === idx ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                        <item.icon size={16} />
                      </div>
                      <span className={`text-sm font-bold uppercase tracking-tight italic ${selectedIndex === idx ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
                    </div>
                    {selectedIndex === idx && <ChevronRight size={14} className="text-indigo-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length > 0 && (
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700 ml-4 mb-3 block">Switch Workspace</span>
              <div className="space-y-1">
                {filteredProjects.map((p, idx) => {
                  const globalIdx = filteredNav.length + idx;
                  return (
                    <button 
                      key={p.id} 
                      onClick={() => { onSelectProject(p.id); onClose(); }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedIndex === globalIdx ? 'bg-white/5 border border-white/10 shadow-xl' : 'border border-transparent hover:bg-white/[0.02]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedIndex === globalIdx ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                          <Layers size={16} />
                        </div>
                        <span className={`text-sm font-bold uppercase tracking-tight italic ${selectedIndex === globalIdx ? 'text-white' : 'text-gray-500'}`}>{p.name}</span>
                      </div>
                      <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">{p.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredAudits.length > 0 && (
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700 ml-4 mb-3 block">Neural Vault Hits</span>
              <div className="space-y-1">
                {filteredAudits.map((a, idx) => {
                  const globalIdx = filteredNav.length + filteredProjects.length + idx;
                  return (
                    <button 
                      key={a.id} 
                      onClick={() => { onLoadAudit(a); onClose(); }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedIndex === globalIdx ? 'bg-white/5 border border-white/10 shadow-xl' : 'border border-transparent hover:bg-white/[0.02]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedIndex === globalIdx ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                          <FileText size={16} />
                        </div>
                        <div className="text-left">
                          <span className={`text-sm font-bold uppercase tracking-tight italic block truncate max-w-[300px] ${selectedIndex === globalIdx ? 'text-white' : 'text-gray-500'}`}>{a.fileName}</span>
                          <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">{a.timestamp}</span>
                        </div>
                      </div>
                      <div className={`text-[10px] font-black ${a.score > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{a.score}%</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-12 text-center opacity-20">
              <Command size={48} className="mx-auto mb-4" />
              <p className="text-sm font-black uppercase tracking-[0.3em] italic">No neural signatures found</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><ChevronRight size={10} className="text-indigo-500"/> Navigate</span>
            <span className="flex items-center gap-1.5"><Zap size={10} className="text-indigo-500"/> Select</span>
          </div>
          <span className="text-[8px] font-mono text-gray-800 uppercase tracking-widest">LexiScan Command Link v8.0</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
