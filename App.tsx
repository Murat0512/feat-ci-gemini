
import React, { useState, useEffect, useCallback, lazy, Suspense, useRef, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import AuthGate from './components/AuthGate';
import LandingPage from './components/LandingPage';
import { AppView, Language, RiskProfile, HistoricAudit, GlobalProvision, Project } from './types';
import { supabase, isCloudConfigured } from './services/supabaseClient';
import { bundleProjectForMarketplace } from './services/exportService';
import { synthesizePortfolioRisk } from './services/geminiService';
import { 
  Zap, LogOut, X, AlertTriangle, FileText, Settings as SettingsIcon, 
  Terminal, Activity, TrendingUp, ShieldCheck, Radar, Users, 
  ArrowUpRight, CheckCircle2, Info, Bell, Shield, ArrowRight, History, Fingerprint, BrainCircuit, GitCompare, Trophy,
  Activity as ActivityIcon, LayoutGrid, Rocket, Target, ShieldAlert, HeartPulse, Sparkles, Star, Swords, Presentation, Key, Archive,
  ExternalLink, Search, Loader2, Globe, Cpu, Clock, ChevronRight, DatabaseZap, HardDrive, Cloud, CloudOff, Layers, MousePointer2, TrendingDown, Hammer, Map, Globe2,
  Book, FileDiff, Command, Clapperboard, Wifi, BarChart3, ShieldEllipsis, MessageSquare, AlertCircle, Radio, Gavel, ShieldX, Network, Edit3, Ghost, Camera
} from 'lucide-react';

const LegalAudit = lazy(() => import('./components/LegalAudit'));
const NeuralConsult = lazy(() => import('./components/NeuralConsult'));
const CreatorTools = lazy(() => import('./components/CreatorTools'));
const ComparativeAnalysis = lazy(() => import('./components/ComparativeAnalysis'));
const NegotiationDuel = lazy(() => import('./components/NegotiationDuel'));
const BoardroomMemo = lazy(() => import('./components/BoardroomMemo'));
const NeuralVault = lazy(() => import('./components/NeuralVault'));
const CounterpartyDossier = lazy(() => import('./components/CounterpartyDossier'));
const ComplianceRadar = lazy(() => import('./components/ComplianceRadar'));
const DashboardPulse = lazy(() => import('./components/DashboardPulse'));
const PrecedentForge = lazy(() => import('./components/PrecedentForge'));
const NeuralLibrary = lazy(() => import('./components/NeuralLibrary'));
const RedlineMaster = lazy(() => import('./components/RedlineMaster'));
const RiskAssessment = lazy(() => import('./components/RiskAssessment'));
const ProjectHub = lazy(() => import('./components/ProjectHub'));
const MarketingSuite = lazy(() => import('./components/MarketingSuite'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const CourtroomProjection = lazy(() => import('./components/CourtroomProjection'));
const HighTable = lazy(() => import('./components/HighTable'));
const BreachScenarios = lazy(() => import('./components/BreachScenarios'));
const NeuralDiscovery = lazy(() => import('./components/NeuralDiscovery'));
const OmissionRadar = lazy(() => import('./components/OmissionRadar'));
const SovereignGraph = lazy(() => import('./components/SovereignGraph'));
const NeuralCommand = lazy(() => import('./components/NeuralCommand'));
const NeuralForensics = lazy(() => import('./components/NeuralForensics'));
const NeuralSandbox = lazy(() => import('./components/NeuralSandbox'));
const PortfolioSynthesis = lazy(() => import('./components/PortfolioSynthesis'));
const SettingsView = lazy(() => import('./components/SettingsView'));
const SovereignMap = lazy(() => import('./components/SovereignMap'));
const NeuralMask = lazy(() => import('./components/NeuralMask'));
const NeuralDeploy = lazy(() => import('./components/NeuralDeploy'));
const NeuralEye = lazy(() => import('./components/NeuralEye'));

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

const ModuleLoader = ({ message = "Synchronizing Command Link..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-500">
    <div className="relative">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
      <div className="absolute inset-0 flex items-center justify-center">
        <ActivityIcon size={16} className="text-indigo-400 animate-pulse" />
      </div>
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/50">{message}</p>
  </div>
);

const RiskLattice: React.FC<{ profile: RiskProfile }> = ({ profile }) => {
  const points = [
    { label: 'Liability', value: profile.liability || 0 },
    { label: 'Termination', value: profile.termination || 0 },
    { label: 'Compliance', value: profile.compliance || 0 },
    { label: 'Litigation', value: profile.litigation || 0 },
    { label: 'Loopholes', value: profile.loopholes || 0 },
  ];

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2;
    const r = (Math.max(5, value) / 100) * 40;
    return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
  };

  const pathData = points.map((p, i) => getCoordinates(i, p.value)).join(' ');

  return (
    <div className="relative w-44 h-44 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
         <div className="w-16 h-16 border border-indigo-500/20 rounded-full animate-ping" />
         <div className="absolute w-20 h-20 border border-indigo-500/10 rounded-full animate-spin-slow" />
      </div>
      
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
        {[25, 50, 75, 100].map(r => (
          <polygon key={r} points={points.map((_, i) => getCoordinates(i, r)).join(' ')} fill="none" stroke="white" strokeWidth="0.1" strokeOpacity="0.1" />
        ))}
        {points.map((_, i) => (
          <line key={i} x1="50" y1="50" x2={getCoordinates(i, 100).split(',')[0]} y2={getCoordinates(i, 100).split(',')[1]} stroke="white" strokeWidth="0.1" strokeOpacity="0.1" />
        ))}
        <polygon points={pathData} fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="1" className="animate-pulse" />
        {points.map((p, i) => {
          const [x, y] = getCoordinates(i, p.value).split(',');
          return <circle key={i} cx={x} cy={y} r="1.5" fill={p.value > 70 ? '#f43f5e' : '#6366f1'} />;
        })}
      </svg>
      {points.map((p, i) => {
        const [x, y] = getCoordinates(i, 120).split(',');
        return (
          <div key={i} className="absolute text-[5px] font-black uppercase tracking-widest text-gray-700" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
            {p.label}
          </div>
        );
      })}
      
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
};

const TacticalMap: React.FC<{ audits: HistoricAudit[], onFocusJurisdiction: (j: string) => void }> = ({ audits, onFocusJurisdiction }) => {
  const regions = [
    { name: 'NORTH AMERICA', x: 20, y: 35, keys: ['us', 'america', 'canada'] },
    { name: 'EUROPE', x: 50, y: 30, keys: ['eu', 'europe', 'uk', 'germany', 'france'] },
    { name: 'ASIA', x: 75, y: 40, keys: ['asia', 'china', 'japan', 'singapore'] },
    { name: 'OCEANIA', x: 80, y: 70, keys: ['australia', 'oceania', 'nz'] },
  ];

  const getRegionStatus = (keys: string[]) => {
    const hits = audits.filter(a => {
      const text = (a.analysisText + ' ' + (a.jurisdiction || '')).toLowerCase();
      return keys.some(k => text.includes(k));
    });
    if (hits.length === 0) return { color: 'rgba(255,255,255,0.05)', count: 0 };
    const avg = hits.reduce((acc, c) => acc + (c.score || 0), 0) / hits.length;
    let color = 'rgba(16, 185, 129, 0.4)'; 
    if (avg > 75) color = 'rgba(239, 68, 68, 0.6)'; 
    else if (avg > 50) color = 'rgba(245, 158, 11, 0.6)'; 
    return { color, count: hits.length };
  };

  return (
    <div className="relative w-full h-40 bg-black/40 rounded-[32px] border border-white/5 overflow-hidden">
       <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '12px 12px' }} />
       <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500/20 animate-scanner pointer-events-none" />
       {regions.map(r => {
         const status = getRegionStatus(r.keys);
         return (
           <div 
            key={r.name} 
            onClick={() => onFocusJurisdiction(r.name)}
            className="absolute flex flex-col items-center gap-1 group cursor-pointer" 
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
           >
              <div className={`w-3 h-3 rounded-full ${status.count > 0 ? 'animate-pulse' : ''} transition-all duration-1000 shadow-2xl relative`} style={{ backgroundColor: status.color }}>
                 {status.count > 0 && <div className={`absolute inset-[-4px] rounded-full border border-${status.color.includes('239') ? 'red' : 'emerald'}-500/40 animate-ping`} />}
              </div>
              <span className="text-[5px] font-black text-gray-700 tracking-widest group-hover:text-white transition-colors uppercase">{r.name}</span>
           </div>
         );
       })}
       <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <Globe2 size={10} className="text-indigo-500" />
          <span className="text-[7px] font-black text-gray-700 uppercase tracking-widest">Tactical SIGINT Feed</span>
       </div>
       <style>{`
         @keyframes scanner { 0% { top: 0; } 100% { top: 100%; } }
         .animate-scanner { animation: scanner 3s infinite linear; }
       `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [portfolioPosture, setPortfolioPosture] = useState<string | null>(null);
  const [forgeContext, setForgeContext] = useState<{ type: string; clause: string } | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [nodesOnline, setNodesOnline] = useState(4);
  
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('lexiscan_projects');
      return saved ? JSON.parse(saved) : [
        { id: 'DEFAULT', name: 'Global Workspace', description: 'Primary tactical landing node.', timestamp: new Date().toLocaleDateString(), riskIndex: 0 }
      ];
    } catch { return []; }
  });
  const [currentProjectId, setCurrentProjectId] = useState<string>(() => {
    return localStorage.getItem('lexiscan_active_project') || 'DEFAULT';
  });

  const [provisions, setProvisions] = useState<GlobalProvision[]>(() => {
    try {
      const saved = localStorage.getItem('lexiscan_provisions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [user, setUser] = useState<{ email: string; name: string; id: string } | null>(() => {
    try {
      const saved = localStorage.getItem('lexiscan_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [auditHistory, setAuditHistory] = useState<HistoricAudit[]>([]);
  const [latestAuditResult, setLatestAuditResult] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<Language>('English');
  const [latestComparison, setLatestComparison] = useState<string | null>(null);
  const [pushedContext, setPushedContext] = useState<string>('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [isCreatorMode, setIsCreatorMode] = useState(false);

  const cloudActive = isCloudConfigured();

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const nodeInterval = setInterval(() => {
       setNodesOnline(prev => Math.max(3, Math.min(6, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 10000);
    return () => clearInterval(nodeInterval);
  }, []);

  useEffect(() => {
    if (auditHistory.length === 0) return;
    setProjects(prev => prev.map(p => {
      const pAudits = auditHistory.filter(a => a.projectId === p.id);
      if (pAudits.length === 0) return p;
      const avg = Math.round(pAudits.reduce((acc, curr) => acc + curr.score, 0) / pAudits.length);
      return { ...p, riskIndex: avg };
    }));
  }, [auditHistory]);

  useEffect(() => {
    localStorage.setItem('lexiscan_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('lexiscan_active_project', currentProjectId);
  }, [currentProjectId]);

  useEffect(() => {
    localStorage.setItem('lexiscan_history_local', JSON.stringify(auditHistory));
  }, [auditHistory]);

  const vaultStats = useMemo(() => {
    const currentAudits = auditHistory.filter(a => a.projectId === currentProjectId || currentProjectId === 'DEFAULT');
    if (currentAudits.length === 0) return { avgRisk: 0, criticalCount: 0, profile: { liability: 0, termination: 0, compliance: 0, litigation: 0, loopholes: 0 } };
    const total = currentAudits.reduce((acc, curr) => acc + (curr.score || 0), 0);
    
    const getVectorScore = (keywords: string[]) => {
        const matchingAudits = currentAudits.filter(a => {
            const text = (a.analysisText || "").toLowerCase();
            return keywords.some(k => text.includes(k.toLowerCase()));
        });
        return Math.min(100, Math.round((matchingAudits.length / currentAudits.length) * 100));
    };

    return {
      avgRisk: Math.round(total / currentAudits.length),
      criticalCount: currentAudits.filter(a => (a.score || 0) > 75).length,
      profile: {
        liability: getVectorScore(['liability', 'indemnify', 'damages']),
        termination: getVectorScore(['terminate', 'cancellation', 'at will']),
        compliance: getVectorScore(['regulatory', 'compliance', 'gdpr', 'fines']),
        litigation: getVectorScore(['lawsuit', 'arbitration', 'dispute']),
        loopholes: getVectorScore(['ambiguous', 'vague', 'undefined'])
      }
    };
  }, [auditHistory, currentProjectId]);

  useEffect(() => {
    localStorage.setItem('lexiscan_provisions', JSON.stringify(provisions));
  }, [provisions]);

  const fetchCloudData = useCallback(async (userId: string) => {
    if (!supabase || !userId || userId.startsWith('LOCAL-')) return;
    setIsSyncing(true);
    try {
      const { data: aData } = await supabase.from('audits').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (aData) {
        setAuditHistory(aData.map((d: any) => ({
          id: d.id, projectId: d.project_id || 'DEFAULT', fileName: d.file_name, timestamp: new Date(d.created_at).toLocaleString(),
          score: d.score, level: d.level, color: d.color, analysisText: d.analysis_text || "", jurisdiction: d.jurisdiction
        })));
      }
      const { data: pData } = await supabase.from('projects').select('*').eq('user_id', userId);
      if (pData && pData.length > 0) {
        setProjects(pData.map((p: any) => ({
          id: p.id, name: p.name, description: p.description, timestamp: new Date(p.created_at).toLocaleDateString(), riskIndex: p.risk_index || 0
        })));
      }
      const { data: provData } = await supabase.from('provisions').select('*').eq('user_id', userId);
      if (provData) {
        setProvisions(provData.map((p: any) => ({
          id: p.id, category: p.category, originalClause: p.original_clause, safeClause: p.safe_clause, timestamp: new Date(p.created_at).toLocaleString(), tags: p.tags || []
        })));
      }
    } catch (err) { console.error(err); } finally { setIsSyncing(false); }
  }, []);

  const handleAddProvision = async (prov: Omit<GlobalProvision, 'id' | 'timestamp'>) => {
    const newProv = { ...prov, id: `PROV-${Date.now()}`, timestamp: new Date().toLocaleString(), tags: [] };
    setProvisions(prev => [newProv, ...prev]);
    addToast("Provision Committed to Library", "success");

    if (cloudActive && supabase && user && !user.id.startsWith('LOCAL-')) {
       setIsSyncing(true);
       try {
         await supabase.from('provisions').insert([{
           user_id: user.id,
           category: prov.category,
           original_clause: prov.originalClause,
           safe_clause: prov.safeClause,
           tags: []
         }]);
       } catch (err) { console.error("Cloud provision sync failed", err); }
       finally { setIsSyncing(false); }
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoadingSession(true);
      
      // Load local cache immediately
      const savedHistory = localStorage.getItem('lexiscan_history_local');
      if (savedHistory) setAuditHistory(JSON.parse(savedHistory));

      if (cloudActive && supabase) {
        // 1. Initial Session Check
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userObj = { id: session.user.id, email: session.user.email || '', name: session.user.user_metadata.name || 'User' };
          setUser(userObj);
          localStorage.setItem('lexiscan_user', JSON.stringify(userObj));
          await fetchCloudData(session.user.id);
        }

        // 2. Global Auth Listener (Catches redirects from Email confirmation)
        supabase.auth.onAuthStateChange(async (event, session) => {
           if (event === 'SIGNED_IN' && session?.user) {
              const userObj = { id: session.user.id, email: session.user.email || '', name: session.user.user_metadata.name || 'User' };
              setUser(userObj);
              localStorage.setItem('lexiscan_user', JSON.stringify(userObj));
              await fetchCloudData(session.user.id);
              setCurrentView(AppView.DASHBOARD);
              setIsAuthOpen(false);
              addToast("Neural Identity Synchronized", "success");
           }
           if (event === 'SIGNED_OUT') {
              setUser(null);
              localStorage.removeItem('lexiscan_user');
              setCurrentView(AppView.LANDING);
           }
        });
      }
      setIsLoadingSession(false);
    };
    init();
  }, [cloudActive, fetchCloudData, addToast]);

  const handleAuditComplete = async (result: string, fileName: string, jurisdiction?: string): Promise<string> => {
    const scoreMatch = result.match(/\[EXPOSURE_SCORE\]:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    let level = 'LOW', color = 'emerald';
    if (score > 75) { level = 'CRITICAL'; color = 'red'; }
    else if (score > 50) { level = 'ELEVATED'; color = 'amber'; }
    
    const localId = `LOCAL-${Date.now()}`;
    setAuditHistory(prev => [{ id: localId, projectId: currentProjectId, fileName, timestamp: new Date().toLocaleString(), score, level, color, analysisText: result, jurisdiction }, ...prev]);
    setLatestAuditResult(result);

    if (cloudActive && supabase && user && !user.id.startsWith('LOCAL-')) {
       setIsSyncing(true);
       try {
         await supabase.from('audits').insert([{
           user_id: user.id,
           project_id: currentProjectId,
           file_name: fileName,
           score, level, color,
           analysis_text: result,
           jurisdiction
         }]);
       } catch (err) { console.error("Cloud audit sync failed", err); }
       finally { setIsSyncing(false); }
    }
    return localId;
  };

  const handleSynthesize = async (selectedAudits: HistoricAudit[]) => {
    setIsSynthesizing(true);
    setPortfolioPosture(null);
    setCurrentView(AppView.PORTFOLIO_SYNTHESIS);
    try {
      const result = await synthesizePortfolioRisk(selectedAudits, targetLanguage);
      setPortfolioPosture(result);
    } catch (err) {
      addToast("Portfolio synthesis failed.", "error");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCreateProject = async (name: string, desc: string) => {
    const id = `NODE-${Date.now()}`;
    const newProject: Project = { id, name, description: desc, timestamp: new Date().toLocaleDateString(), riskIndex: 0 };
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(id);
    addToast(`Workspace ${name} Initialized`, "success");
    setCurrentView(AppView.DASHBOARD);

    if (cloudActive && supabase && user && !user.id.startsWith('LOCAL-')) {
       setIsSyncing(true);
       try {
         await supabase.from('projects').insert([{ id, user_id: user.id, name, description: desc, risk_index: 0 }]);
       } catch (err) { console.error("Cloud project sync failed", err); }
       finally { setIsSyncing(false); }
    }
  };

  const activeProject = useMemo(() => projects.find(p => p.id === currentProjectId) || projects[0], [projects, currentProjectId]);

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING: return <LandingPage isActivated={!!user} onEnterSuite={() => { if (user) setCurrentView(AppView.DASHBOARD); else setIsAuthOpen(true); }} />;
      case AppView.LEGAL_AUDIT: return <Suspense fallback={<ModuleLoader />}><LegalAudit language={targetLanguage} savedAnalysis={latestAuditResult} onAuditComplete={handleAuditComplete} onStartConsult={() => setCurrentView(AppView.LIVE_CONSULT)} onError={(e) => addToast(e.message, "error")} onSaveProvision={handleAddProvision} /></Suspense>;
      case AppView.NEURAL_LIBRARY: return <Suspense fallback={<ModuleLoader />}><NeuralLibrary provisions={provisions} onDelete={(id) => setProvisions(prev => prev.filter(p => p.id !== id))} onAdd={handleAddProvision} /></Suspense>;
      case AppView.REDLINE_MASTER: return <Suspense fallback={<ModuleLoader />}><RedlineMaster language={targetLanguage} onRedlineComplete={() => addToast("Redline Analysis Committed", "success")} /></Suspense>;
      case AppView.RISK_ASSESSMENT: return <Suspense fallback={<ModuleLoader />}><RiskAssessment auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>;
      case AppView.PROJECT_HUB: return <Suspense fallback={<ModuleLoader />}><ProjectHub projects={projects} currentProjectId={currentProjectId} onSelectProject={(id) => { setCurrentProjectId(id); setCurrentView(AppView.DASHBOARD); }} onCreateProject={handleCreateProject} onDeleteProject={(id) => setProjects(prev => prev.filter(p => p.id !== id))} /></Suspense>;
      case AppView.MARKETING_SUITE: return <Suspense fallback={<ModuleLoader />}><MarketingSuite language={targetLanguage} initialContext={latestAuditResult || undefined} /></Suspense>;
      case AppView.DASHBOARD:
        const projectAudits = auditHistory.filter(a => a.projectId === currentProjectId || currentProjectId === 'DEFAULT');
        return (
          <div className="py-8 space-y-12 animate-in fade-in duration-500 pb-20">
            <header className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 bg-[#0a0a0a] border border-white/10 rounded-[64px] p-12 relative overflow-hidden flex flex-col justify-between min-h-[520px] shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-4 mb-10">
                    <div className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-3">
                       <Cloud size={14} className={isSyncing ? "text-indigo-400 animate-pulse" : "text-emerald-400"} />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">{isSyncing ? "Neural Sync..." : "Cloud Link: Persistent"}</span>
                    </div>
                    <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                       <Layers size={14} className="text-gray-400" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Node: {activeProject?.name}</span>
                    </div>
                  </div>
                  <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] text-white uppercase italic">NERVE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">CENTER.</span></h1>
                  <div className="relative w-full group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-indigo-500 transition-colors" size={24} />
                    <input 
                      type="text" 
                      value={dashboardSearch} 
                      onChange={(e) => setDashboardSearch(e.target.value)} 
                      onFocus={() => setIsCommandPaletteOpen(true)}
                      placeholder="Search Vault or Type Cmd+K..." 
                      className="w-full bg-transparent border border-white/10 bg-white/5 rounded-full py-6 pl-16 pr-12 text-lg font-bold text-white outline-none italic transition-all focus:border-indigo-500/50" 
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <Command size={14} className="text-gray-600" />
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">K</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 z-10 mt-10">
                  <button onClick={() => setCurrentView(AppView.LEGAL_AUDIT)} className="px-14 py-7 bg-white text-black font-black rounded-[32px] hover:bg-indigo-600 hover:text-white transition-all text-xl">Start Scrutiny</button>
                  {projectAudits.length > 1 && (
                    <button onClick={() => handleSynthesize(projectAudits)} className="px-14 py-7 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 font-black rounded-[32px] text-xl flex items-center gap-4 hover:bg-indigo-600 hover:text-white transition-all">
                       <Zap size={20} fill="currentColor" /> Generate Posture
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-10 flex flex-col justify-between items-center shadow-2xl relative group overflow-hidden">
                <div className="relative z-10 flex flex-col items-center w-full space-y-4">
                  <div className="w-full">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4 block text-center">Jurisdiction SIGINT</span>
                    <TacticalMap audits={projectAudits} onFocusJurisdiction={(j) => addToast(`Radar scanning focused on: ${j}`, 'info')} />
                  </div>
                  <div className="w-full border-t border-white/5 pt-6 relative">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4 block text-center">Neural Risk Matrix</span>
                    <RiskLattice profile={vaultStats.profile} />
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-5xl font-black text-white italic tracking-tighter">{provisions.length}</span>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Standard Library</p>
                  </div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[ 
                    { title: "Neural Eye", icon: Camera, view: AppView.NEURAL_EYE, color: "cyan" },
                    { title: "Neural Deploy", icon: Globe, view: AppView.NEURAL_DEPLOY, color: "emerald" },
                    { title: "Neural Mask", icon: Ghost, view: AppView.NEURAL_MASK, color: "fuchsia" },
                    { title: "Sovereign Map", icon: Map, view: AppView.SOVEREIGN_MAP, color: "emerald" },
                    { title: "Neural Command", icon: MessageSquare, view: AppView.NEURAL_COMMAND, color: "cyan" },
                    { title: "Clause Sandbox", icon: Edit3, view: AppView.NEURAL_SANDBOX, color: "indigo" },
                    { title: "Tactical Audit", icon: FileText, view: AppView.LEGAL_AUDIT, color: "indigo" }, 
                    { title: "Neural Forensics", icon: Fingerprint, view: AppView.NEURAL_FORENSICS, color: "emerald" },
                    { title: "Redline Master", icon: FileDiff, view: AppView.REDLINE_MASTER, color: "indigo" },
                  ].map(card => (
                    <button key={card.title} onClick={() => setCurrentView(card.view)} className="bg-[#0f0f0f] border border-white/5 rounded-[48px] p-10 text-left hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all group shadow-xl">
                      <div className={`w-12 h-12 rounded-2xl bg-${card.color}-500/10 flex items-center justify-center text-${card.color}-400 mb-8`}><card.icon size={24} /></div>
                      <h4 className="text-xl font-black text-white mb-2 uppercase italic">{card.title}</h4>
                    </button>
                  ))}
               </div>
               <div className="lg:col-span-1 h-full min-h-[600px] flex flex-col gap-8">
                 <Suspense fallback={<div className="h-full bg-white/5 animate-pulse rounded-[48px]" />}>
                   <DashboardPulse jurisdiction="Global" recentAudits={projectAudits} />
                 </Suspense>
                 
                 <div className="bg-[#0a0a0a] border border-red-500/20 rounded-[40px] p-8 shadow-2xl relative overflow-hidden flex-1 group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity"><Radio size={48} className="text-red-500 animate-pulse" /></div>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"><AlertCircle size={18}/></div>
                       <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Flash Traffic</h4>
                    </div>
                    <div className="space-y-4">
                       {vaultStats.criticalCount > 0 ? (
                         <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl shadow-inner">
                            <p className="text-[10px] font-black text-red-400 uppercase leading-relaxed italic animate-pulse">Immediate Action Required: {vaultStats.criticalCount} Critical Exposures detected in node '{activeProject?.name}'.</p>
                         </div>
                       ) : (
                         <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <p className="text-[10px] font-black text-emerald-400 uppercase italic">All tactical channels clear. Infrastructure integrity verified at 100%.</p>
                         </div>
                       )}
                       <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                          <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">SIGINT STATUS: ACTIVE</span>
                          <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">ENCRYPTION: AES-4096</span>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
            
            {projectAudits.length > 0 && (
              <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[56px] p-12 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><ShieldEllipsis size={200}/></div>
                 <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20 shrink-0"><BarChart3 size={48}/></div>
                 <div className="flex-1">
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] mb-4 block">Executive Briefing</span>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Neural Workspace Health</h3>
                    <p className="text-gray-500 text-lg font-medium italic leading-relaxed max-w-3xl">This workspace contains {projectAudits.length} tactical audits. Average risk exposure is currently <span className="text-white font-black">{vaultStats.avgRisk}%</span>. Litigation probability is elevated in {vaultStats.criticalCount} areas. Recommendation: Launch Portfolio Synthesis for a full executive posture.</p>
                 </div>
                 <button onClick={() => handleSynthesize(projectAudits)} className="px-10 py-6 bg-white text-black font-black rounded-3xl uppercase tracking-widest text-sm shadow-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shrink-0">Run Posture</button>
              </div>
            )}
          </div>
        );
      default:
        const views: any = {
          [AppView.LIVE_CONSULT]: <Suspense fallback={<ModuleLoader />}><NeuralConsult auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>,
          [AppView.COMPARATIVE_ANALYSIS]: <Suspense fallback={<ModuleLoader />}><ComparativeAnalysis language={targetLanguage} onComparisonComplete={(res) => setLatestComparison(res)} /></Suspense>,
          [AppView.NEGOTIATION_DUEL]: <Suspense fallback={<ModuleLoader />}><NegotiationDuel auditContext={latestAuditResult || undefined} comparisonResult={latestComparison || undefined} language={targetLanguage} /></Suspense>,
          [AppView.BOARDROOM_MEMO]: <Suspense fallback={<ModuleLoader />}><BoardroomMemo auditResult={latestAuditResult || undefined} comparisonResult={latestComparison || undefined} language={targetLanguage} /></Suspense>,
          [AppView.CREATOR_STUDIO]: <Suspense fallback={<ModuleLoader />}><CreatorTools onExport={() => bundleProjectForMarketplace({})} isExporting={false} adminStats={{revenue: 0, licenses: 0}} language={targetLanguage} initialContext={pushedContext} orders={[]} setOrders={() => {}} onGenerateKey={() => ""} onOrderFulfilled={() => {}} onOrderRefunded={() => {}} price={0} /></Suspense>,
          [AppView.NEURAL_VAULT]: <Suspense fallback={<ModuleLoader />}><NeuralVault audits={auditHistory.filter(a => a.projectId === currentProjectId || currentProjectId === 'DEFAULT')} onLoadAudit={(a) => { setLatestAuditResult(a.analysisText); setCurrentView(AppView.LEGAL_AUDIT); }} onDeleteAudit={(id) => setAuditHistory(prev => prev.filter(a => a.id !== id))} onImportVault={(audits) => setAuditHistory(prev => [...audits, ...prev])} onAction={(a, view) => { setLatestAuditResult(a.analysisText); setCurrentView(view); }} onSynthesize={handleSynthesize} /></Suspense>,
          [AppView.COMPLIANCE_RADAR]: <Suspense fallback={<ModuleLoader />}><ComplianceRadar auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>,
          [AppView.ADVERSARY_DOSSIER]: <Suspense fallback={<ModuleLoader />}><CounterpartyDossier language={targetLanguage} /></Suspense>,
          [AppView.PRECEDENT_FORGE]: <Suspense fallback={<ModuleLoader />}><PrecedentForge language={targetLanguage} initialRisk={forgeContext} /></Suspense>,
          [AppView.COURTROOM_PROJECTION]: <Suspense fallback={<ModuleLoader />}><CourtroomProjection auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>,
          [AppView.HIGH_TABLE]: <Suspense fallback={<ModuleLoader />}><HighTable auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>,
          [AppView.BREACH_SCENARIOS]: <Suspense fallback={<ModuleLoader />}><BreachScenarios auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>,
          [AppView.NEURAL_DISCOVERY]: <Suspense fallback={<ModuleLoader />}><NeuralDiscovery auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>,
          [AppView.OMISSION_RADAR]: <Suspense fallback={<ModuleLoader />}><OmissionRadar auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>,
          [AppView.SOVEREIGN_GRAPH]: <Suspense fallback={<ModuleLoader />}><SovereignGraph auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>,
          [AppView.NEURAL_COMMAND]: <Suspense fallback={<ModuleLoader />}><NeuralCommand vaultContext={auditHistory} language={targetLanguage} /></Suspense>,
          [AppView.NEURAL_FORENSICS]: <Suspense fallback={<ModuleLoader />}><NeuralForensics audits={auditHistory} language={targetLanguage} /></Suspense>,
          [AppView.NEURAL_SANDBOX]: <Suspense fallback={<ModuleLoader />}><NeuralSandbox provisions={provisions} language={targetLanguage} /></Suspense>,
          [AppView.PORTFOLIO_SYNTHESIS]: <Suspense fallback={<ModuleLoader />}><PortfolioSynthesis audits={auditHistory.filter(a => a.projectId === currentProjectId || currentProjectId === 'DEFAULT')} language={targetLanguage} /></Suspense>,
          [AppView.SETTINGS]: <Suspense fallback={<ModuleLoader />}><SettingsView user={user} onLogout={() => setShowLogoutConfirm(true)} /></Suspense>,
          [AppView.SOVEREIGN_MAP]: <Suspense fallback={<ModuleLoader />}><SovereignMap language={targetLanguage} /></Suspense>,
          [AppView.NEURAL_MASK]: <Suspense fallback={<ModuleLoader />}><NeuralMask auditContext={latestAuditResult || undefined} language={targetLanguage} /></Suspense>,
          [AppView.NEURAL_DEPLOY]: <Suspense fallback={<ModuleLoader />}><NeuralDeploy /></Suspense>,
          [AppView.NEURAL_EYE]: <Suspense fallback={<ModuleLoader />}><NeuralEye onAuditExtracted={(res) => { setLatestAuditResult(res); addToast("Audit Signal Acquired", "success"); }} /></Suspense>
        };
        return views[currentView] || null;
    }
  };

  if (isLoadingSession) return <div className="h-screen w-screen bg-[#020202] flex items-center justify-center"><ModuleLoader message="Syncing Neural Identity..." /></div>;
  if (isAuthOpen) return <AuthGate onAuthSuccess={async (u) => { setUser({...u, id: u.id || `LOCAL-${Date.now()}`}); setIsAuthOpen(false); if (u.id) await fetchCloudData(u.id); setCurrentView(AppView.DASHBOARD); }} />;
  if (currentView === AppView.LANDING) return renderView();

  return (
    <div className="flex min-h-screen bg-[#020202] text-white selection:bg-indigo-500/30">
      <Sidebar currentView={currentView} setView={setCurrentView} isActivated={!!user} user={user} isCreatorMode={isCreatorMode} toggleCreatorMode={() => setIsCreatorMode(!isCreatorMode)} onLogout={() => setShowLogoutConfirm(true)} onHome={() => setCurrentView(AppView.LANDING)} />
      <main className="flex-1 overflow-auto px-12 pb-20">
        <header className="h-28 flex items-center justify-between border-b border-white/5 mb-12 sticky top-0 bg-[#020202]/90 backdrop-blur-3xl z-40">
          <div className="flex items-center gap-6">
            <span className="text-[14px] font-black uppercase text-indigo-500 italic">{currentView.replace('_', ' ')}</span>
            <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <Wifi size={12} className={isSyncing ? "text-indigo-400 animate-pulse" : "text-emerald-500"} />
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{isSyncing ? "Syncing Workspace..." : "Link Stable"}</span>
               </div>
               <div className="w-px h-4 bg-white/10" />
               <div className="flex items-center gap-2">
                  <Cpu size={12} className="text-indigo-400" />
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{nodesOnline} Nodes Unified</span>
               </div>
            </div>
          </div>
          <button onClick={() => setIsCommandPaletteOpen(true)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group hover:border-indigo-500/40 transition-all shadow-xl">
            <Command size={14} className="text-gray-500 group-hover:text-indigo-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Command Palette</span>
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-black text-gray-600">K</kbd>
          </button>
        </header>
        <div className="max-w-7xl mx-auto">{renderView()}</div>
      </main>

      <Suspense fallback={null}>
        <CommandPalette 
          isOpen={isCommandPaletteOpen} 
          onClose={() => setIsCommandPaletteOpen(false)} 
          setView={setCurrentView}
          projects={projects}
          onSelectProject={(id) => { setCurrentProjectId(id); addToast(`Switched to node: ${id}`, 'info'); }}
          audits={auditHistory}
          onLoadAudit={(a) => { setLatestAuditResult(a.analysisText); setCurrentView(AppView.LEGAL_AUDIT); }}
        />
      </Suspense>

      {(portfolioPosture || isSynthesizing) && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in">
           <div className="max-w-4xl w-full bg-[#0a0a0a] border border-white/10 rounded-[64px] p-12 md:p-20 relative shadow-2xl shadow-indigo-500/10 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setPortfolioPosture(null)} className="absolute top-12 right-12 text-gray-500 hover:text-white transition-colors">
                <X size={32} />
              </button>
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                    <Layers size={32} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">PORTFOLIO <span className="text-indigo-500">POSTURE.</span></h3>
                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest mt-1">Neural Macro Synthesis</p>
                 </div>
              </div>
              {isSynthesizing ? (
                <div className="flex flex-col items-center justify-center py-20 gap-8">
                   <Loader2 className="animate-spin text-indigo-500" size={64} />
                   <p className="text-xl font-black text-white uppercase italic tracking-widest animate-pulse">Aggregating Global Risk Vectors...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                   {portfolioPosture?.split('\n').map((line, i) => {
                     if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-white uppercase italic mb-8 border-b border-white/5 pb-4">{line.replace('# ', '')}</h1>;
                     if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-black text-indigo-400 mt-10 mb-4 uppercase">{line.replace('## ', '')}</h2>;
                     return <p key={i} className="text-gray-400 text-lg leading-relaxed mb-6 font-medium italic">{line}</p>;
                   })}
                   <div className="mt-12 pt-12 border-t border-white/5 text-center">
                      <button onClick={() => setPortfolioPosture(null)} className="px-12 py-5 bg-white text-black font-black rounded-[32px] text-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95">Acknowledge Posture</button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
      {toasts.map(toast => (<div key={toast.id} className="fixed bottom-12 right-12 z-[200] bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 px-10 py-6 rounded-[32px] flex items-center gap-6 animate-in slide-in-from-right-16 shadow-2xl border-l-4 border-l-indigo-600"><CheckCircle2 size={24} className="text-indigo-400" /><span className="text-[12px] font-black uppercase text-white italic">{toast.message}</span></div>))}
      {showLogoutConfirm && (<div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-black/98 backdrop-blur-3xl animate-in fade-in"><div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center shadow-2xl"><div className="w-28 h-28 bg-red-500/10 rounded-[40px] flex items-center justify-center mb-12 mx-auto text-red-500 shadow-2xl"><AlertTriangle size={64} /></div><h2 className="text-5xl font-black mb-6 text-white uppercase italic">Sever Link?</h2><button onClick={() => { localStorage.removeItem('lexiscan_user'); window.location.reload(); }} className="w-full py-7 bg-red-600 text-white font-black rounded-[32px] shadow-2xl hover:bg-red-500 transition-all text-xl uppercase mb-4">Sever Connection</button><button onClick={() => setShowLogoutConfirm(false)} className="w-full py-7 bg-white/5 text-white font-black rounded-[32px] hover:bg-white/10 transition-all text-xl uppercase">Maintain Link</button></div></div>)}
    </div>
  );
};

export default App;
