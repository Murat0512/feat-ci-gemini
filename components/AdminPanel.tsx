import React from 'react';
import { Shield, RefreshCw, EyeOff, CloudOff, BarChart3 } from 'lucide-react';

interface AdminPanelProps {
  stats: { total: number; last7d: number } | null;
  onRefresh: () => void;
  privacyMode: boolean;
  cloudActive: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ stats, onRefresh, privacyMode, cloudActive }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-indigo-400">Owner Console</p>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tight">Telemetry & Access</h1>
          <p className="text-gray-400 mt-2 text-sm">Private view for the configured owner email. Logging is skipped when Privacy Mode is on or cloud is disabled.</p>
        </div>
        <button onClick={onRefresh} className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest flex items-center gap-2 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-colors">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/15">
          <div className="flex items-center gap-3 mb-3 text-emerald-400 uppercase text-[10px] font-black tracking-[0.3em]"><BarChart3 size={16} /> Total Views</div>
          <p className="text-4xl font-black text-white">{stats ? stats.total : '—'}</p>
        </div>
        <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/15">
          <div className="flex items-center gap-3 mb-3 text-indigo-400 uppercase text-[10px] font-black tracking-[0.3em]">7d Active</div>
          <p className="text-4xl font-black text-white">{stats ? stats.last7d : '—'}</p>
        </div>
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black"><Shield size={14} /> Guardrails</div>
          <div className="flex items-center gap-2 text-gray-300 text-sm"><EyeOff size={14} /> Privacy Mode blocks logging.</div>
          <div className="flex items-center gap-2 text-gray-300 text-sm"><CloudOff size={14} /> Cloud must be enabled to record events.</div>
          <p className="text-gray-500 text-xs">Use this panel only for your own operational insight. Do not share or expose end-user data.</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Status</p>
        <div className="flex items-center gap-3 text-sm text-gray-200">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${privacyMode ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>{privacyMode ? 'Privacy: Local Only' : 'Privacy: Off'}</span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${cloudActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{cloudActive ? 'Cloud: Enabled' : 'Cloud: Disabled'}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
