
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Settings, ShieldCheck, Mic2, Wrench, EyeOff, BarChart3, LogOut, GitCompare, Home, ChevronRight, Swords, Presentation, User, Archive, Search, Radar, HardDrive, Layers, Hammer, Book, FileDiff, ShieldAlert, Rocket, Activity, Zap, Cpu, Wifi, Gavel, Users, ShieldX, Key, Radio, Network, MessageSquare, Fingerprint, Edit3, Map as MapIcon, Ghost, Globe, Camera } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isActivated: boolean;
  user?: { email: string; name: string } | null;
  isCreatorMode: boolean;
  toggleCreatorMode: () => void;
  onLogout: () => void;
  onHome?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isActivated, user, isCreatorMode, toggleCreatorMode, onLogout, onHome }) => {
  const [load, setLoad] = useState(14);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(12, Math.min(28, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const userItems = [
    { id: AppView.DASHBOARD, label: 'Nerve Center', icon: LayoutDashboard },
    { id: AppView.PROJECT_HUB, label: 'Workspaces', icon: Layers },
    { id: AppView.SOVEREIGN_MAP, label: 'Sovereign Map', icon: MapIcon },
    { id: AppView.NEURAL_EYE, label: 'Neural Eye', icon: Camera },
    { id: AppView.NEURAL_DEPLOY, label: 'Go Public', icon: Globe },
    { id: AppView.NEURAL_MASK, label: 'Neural Mask', icon: Ghost },
    { id: AppView.NEURAL_COMMAND, label: 'Neural Command', icon: MessageSquare },
    { id: AppView.NEURAL_SANDBOX, label: 'Clause Sandbox', icon: Edit3 },
    { id: AppView.LEGAL_AUDIT, label: 'Tactical Audit', icon: FileText },
    { id: AppView.NEURAL_FORENSICS, label: 'Neural Forensics', icon: Fingerprint },
    { id: AppView.REDLINE_MASTER, label: 'Redline Master', icon: FileDiff },
    { id: AppView.RISK_ASSESSMENT, label: 'Risk Assessment', icon: ShieldAlert },
    { id: AppView.OMISSION_RADAR, label: 'Omission Radar', icon: Radio },
    { id: AppView.SOVEREIGN_GRAPH, label: 'Sovereign Graph', icon: Network },
    { id: AppView.NEURAL_DISCOVERY, label: 'Discovery Vault', icon: Key },
    { id: AppView.BREACH_SCENARIOS, label: 'Zero-Day Ledger', icon: ShieldX },
    { id: AppView.HIGH_TABLE, label: 'High Table', icon: Users },
    { id: AppView.COURTROOM_PROJECTION, label: 'Gavel Engine', icon: Gavel },
    { id: AppView.MARKETING_SUITE, label: 'Nexus Lab', icon: Rocket },
    { id: AppView.PRECEDENT_FORGE, label: 'Precedent Forge', icon: Hammer },
    { id: AppView.NEURAL_LIBRARY, label: 'Standard Library', icon: Book },
    { id: AppView.NEURAL_VAULT, label: 'Neural Vault', icon: Archive },
    { id: AppView.COMPLIANCE_RADAR, label: 'Compliance Radar', icon: Radar },
    { id: AppView.ADVERSARY_DOSSIER, label: 'Entity Dossier', icon: Search },
    { id: AppView.COMPARATIVE_ANALYSIS, label: 'War-Room', icon: GitCompare },
    { id: AppView.NEGOTIATION_DUEL, label: 'Strategic Duel', icon: Swords },
    { id: AppView.LIVE_CONSULT, label: 'Neural Consult', icon: Mic2 },
    { id: AppView.BOARDROOM_MEMO, label: 'Boardroom Memo', icon: Presentation },
    { id: AppView.SETTINGS, label: 'Preferences', icon: Settings },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="w-72 bg-[#020202] border-r border-white/5 flex flex-col h-screen sticky top-0 z-50 select-none">
      <div className="p-8 pb-12">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onHome}>
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-600/20 group-hover:rotate-6 transition-transform">
            <ShieldCheck className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white uppercase leading-none">LexiScan <span className="text-indigo-500">AI</span></h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black">Sovereign Link</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-none pb-8 custom-scrollbar">
        <div className="px-4 mb-4">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700">Operations Suite</span>
        </div>
        
        {userItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-white/5 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
              }`}
            >
              <div className={`transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'group-hover:text-gray-300'}`}>
                <Icon size={18} />
              </div>
              <span className="font-bold text-[13px] tracking-tight uppercase">{item.label}</span>
              {isActive && (
                <div className="ml-auto">
                  <ChevronRight size={14} className="text-indigo-500" />
                </div>
              )}
            </button>
          );
        })}

        {isCreatorMode && (
          <div className="mt-10 pt-8 border-t border-white/5 space-y-1">
            <div className="px-4 mb-4 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">Root Terminal</span>
              <button onClick={toggleCreatorMode} className="text-gray-600 hover:text-white transition-colors"><EyeOff size={10} /></button>
            </div>
            <button
              onClick={() => setView(AppView.CREATOR_STUDIO)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                currentView === AppView.CREATOR_STUDIO 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' 
                  : 'text-gray-500 hover:text-amber-400 hover:bg-amber-500/[0.02]'
              }`}
            >
              <Wrench size={18} />
              <span className="font-bold text-[13px] tracking-tight uppercase">Admin Studio</span>
            </button>
          </div>
        )}
      </nav>

      <div className="p-6 space-y-3">
        {user && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-4 flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform relative">
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                  <Zap size={8} fill="currentColor" />
               </div>
               {getInitials(user.name)}
            </div>
            <div className="overflow-hidden">
               <p className="text-xs font-black text-white truncate uppercase italic">{user.name}</p>
               <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black uppercase text-indigo-400">Neural Authority: v12.0</span>
               </div>
            </div>
          </div>
        )}

        <div className="p-5 bg-black/40 border border-white/5 rounded-3xl space-y-4">
           <div>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[8px] font-black uppercase text-gray-600">Infrastructure Load</span>
                 <span className="text-[8px] font-mono text-indigo-400">{load}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${load}%` }} />
              </div>
           </div>
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Wifi size={10} className="text-emerald-500" />
                 <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Linked</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
           </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all font-black text-[11px] uppercase tracking-widest"
        >
          <LogOut size={16} />
          <span>Terminate Session</span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Sidebar;
