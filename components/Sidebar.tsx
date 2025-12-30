
import React from 'react';
import { LayoutDashboard, FileText, Settings, ShieldCheck, Mic2, Wrench, EyeOff, BarChart3, LogOut, GitCompare, Home, ChevronRight, Swords, Presentation, User, Archive, Search, Radar, HardDrive, Layers, Hammer, Book, FileDiff, ShieldAlert, Rocket, Activity, Zap, Cpu, Wifi, Gavel, Users, ShieldX, Key, Radio, Network, MessageSquare, Fingerprint, Edit3, Map as MapIcon, Ghost, Camera } from 'lucide-react';
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
  isOwner?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isActivated, user, isCreatorMode, toggleCreatorMode, onLogout, onHome, isOwner }) => {
  const sections = [
    {
      title: 'Command',
      items: [
        { id: AppView.DASHBOARD, label: 'Nerve Center', icon: LayoutDashboard },
        { id: AppView.PROJECT_HUB, label: 'Workspaces', icon: Layers },
      ],
    },
    {
      title: 'Intel & Mapping',
      items: [
        { id: AppView.SOVEREIGN_MAP, label: 'Sovereign Map', icon: MapIcon },
        { id: AppView.SOVEREIGN_GRAPH, label: 'Sovereign Graph', icon: Network },
        { id: AppView.NEURAL_DISCOVERY, label: 'Discovery Vault', icon: Key },
        { id: AppView.ADVERSARY_DOSSIER, label: 'Entity Dossier', icon: Search },
      ],
    },
    {
      title: 'Audit & Controls',
      items: [
        { id: AppView.LEGAL_AUDIT, label: 'Tactical Audit', icon: FileText },
        { id: AppView.REDLINE_MASTER, label: 'Redline Master', icon: FileDiff },
        { id: AppView.OMISSION_RADAR, label: 'Omission Radar', icon: Radio },
        { id: AppView.RISK_ASSESSMENT, label: 'Risk Assessment', icon: ShieldAlert },
        { id: AppView.COMPLIANCE_RADAR, label: 'Compliance Radar', icon: Radar },
      ],
    },
    {
      title: 'Drafting & Sandbox',
      items: [
        { id: AppView.NEURAL_SANDBOX, label: 'Clause Sandbox', icon: Edit3 },
        { id: AppView.PRECEDENT_FORGE, label: 'Precedent Forge', icon: Hammer },
        { id: AppView.NEURAL_LIBRARY, label: 'Standard Library', icon: Book },
      ],
    },
    {
      title: 'Negotiation & Strategy',
      items: [
        { id: AppView.COMPARATIVE_ANALYSIS, label: 'War-Room', icon: GitCompare },
        { id: AppView.NEGOTIATION_DUEL, label: 'Strategic Duel', icon: Swords },
        { id: AppView.BOARDROOM_MEMO, label: 'Boardroom Memo', icon: Presentation },
        { id: AppView.HIGH_TABLE, label: 'High Table', icon: Users },
      ],
    },
    {
      title: 'Forensics & Disputes',
      items: [
        { id: AppView.NEURAL_FORENSICS, label: 'Neural Forensics', icon: Fingerprint },
        { id: AppView.BREACH_SCENARIOS, label: 'Zero-Day Ledger', icon: ShieldX },
        { id: AppView.COURTROOM_PROJECTION, label: 'Gavel Engine', icon: Gavel },
      ],
    },
    {
      title: 'Creative & GTM',
      items: [
        { id: AppView.MARKETING_SUITE, label: 'Nexus Lab', icon: Rocket },
      ],
    },
    {
      title: 'Deployment & Visibility',
      items: [
        { id: AppView.NEURAL_MASK, label: 'Neural Mask', icon: Ghost },
        { id: AppView.NEURAL_EYE, label: 'Neural Eye', icon: Camera },
        { id: AppView.NEURAL_COMMAND, label: 'Neural Command', icon: MessageSquare },
        { id: AppView.NEURAL_VAULT, label: 'Neural Vault', icon: Archive },
      ],
    },
    {
      title: 'Live Ops',
      items: [
        { id: AppView.LIVE_CONSULT, label: 'Neural Consult', icon: Mic2 },
      ],
    },
    {
      title: 'System',
      items: [
        { id: AppView.SETTINGS, label: 'Preferences', icon: Settings },
        ...(isOwner ? [{ id: AppView.ADMIN, label: 'Owner Console', icon: BarChart3 }] : []),
      ],
    },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="fixed left-6 top-6 w-72 h-[calc(100vh-3rem)] bg-[#0a0a1f]/90 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col z-50 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.8)] select-none overflow-hidden">
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

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto scrollbar-none pb-8 custom-scrollbar">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-4 mb-1">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700">{section.title}</span>
            </div>
            {section.items.map((item) => {
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
          </div>
        ))}
      </nav>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Sidebar;
