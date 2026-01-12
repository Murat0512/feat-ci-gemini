
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Upload, CheckCircle2, Loader2, Mic2, Globe, Zap, Download, BarChart3, AlertTriangle, FileText, ShieldAlert, ChevronRight, AlertCircle, Info, Search, Link as LinkIcon, ExternalLink, Eye, EyeOff, TrendingDown, TrendingUp, Sparkles, X, History, Terminal, Rocket, ArrowRight, FileDown, ShieldCheck, DatabaseZap, Layers, Plus, Save, Check, FileCode } from 'lucide-react';
import { analyzeLegalDocument, generateClauseRewrite, generateRemediatedDraft } from '../services/geminiService';
import { Language } from '../types';

interface LegalAuditProps {
  language?: Language;
  onAuditComplete?: (result: string, fileName: string, jurisdiction?: string) => Promise<string>;
  onUpdateAudit?: (updatedText: string) => void;
  onStartConsult?: () => void;
  onPushContext?: (context: string) => void;
  onSaveProvision?: (prov: { category: string; originalClause: string; safeClause: string }) => void;
  onError?: (error: Error) => void;
  savedAnalysis?: string | null;
  activeAuditId?: string;
}

const RISK_SCORE_LEVELS = [
  { threshold: 75, level: 'CRITICAL', color: 'red' },
  { threshold: 50, level: 'ELEVATED', color: 'amber' },
  { threshold: 25, level: 'MODERATE', color: 'indigo' },
  { threshold: 0, level: 'LOW', color: 'emerald' }
];

const LOCALIZED_KEYWORDS: Record<Language, Record<string, string[]>> = {
  'English': {
    'Liability Trap': ['liability', 'indemnify', 'damages', 'hold harmless'],
    'Termination Clause': ['terminate', 'termination', 'notice period', 'at will'],
    'Compliance Breach': ['regulatory', 'compliance', 'penalty', 'fines', 'breach'],
    'Liability Risk': ['lawsuit', 'arbitration', 'dispute', 'jurisdiction', 'court'],
    'Contractual Loophole': ['ambiguous', 'vague', 'discretion', 'undefined', 'loophole'],
    'RedFlags': ['liability', 'indemnify', 'damages', 'terminate', 'penalty', 'breach', 'lawsuit', 'arbitration', 'waive']
  },
  'French': { 'Liability Trap': ['responsabilité'], 'Termination Clause': ['résilier'], 'Compliance Breach': ['réglementaire'], 'Liability Risk': ['procès'], 'Contractual Loophole': ['ambigu'], 'RedFlags': ['responsabilité'] },
  'German': { 'Liability Trap': ['haftung'], 'Termination Clause': ['kündigen'], 'Compliance Breach': ['regulatorisch'], 'Liability Risk': ['rechtssache'], 'Contractual Loophole': ['vage'], 'RedFlags': ['haftung'] },
  'Spanish': { 'Liability Trap': ['responsabilidad'], 'Termination Clause': ['terminar'], 'Compliance Breach': ['regulatorio'], 'Liability Risk': ['demanda'], 'Contractual Loophole': ['ambiguo'], 'RedFlags': ['responsabilidad'] },
  'Chinese': { 'Liability Trap': ['责任'], 'Termination Clause': ['终止'], 'Compliance Breach': ['监管'], 'Liability Risk': ['诉讼'], 'Contractual Loophole': ['模糊'], 'RedFlags': ['责任'] },
  'Japanese': { 'Liability Trap': ['責任'], 'Termination Clause': ['終了'], 'Compliance Breach': ['規制'], 'Liability Risk': ['诉訟'], 'Contractual Loophole': ['曖昧'], 'RedFlags': ['责任'] },
  'Portuguese': { 'Liability Trap': ['responsabilidade'], 'Termination Clause': ['terminar'], 'Compliance Breach': ['regulatório'], 'Liability Risk': ['processo'], 'Contractual Loophole': ['ambíguo'], 'RedFlags': ['responsabilidad'] }
};

const LegalAudit: React.FC<LegalAuditProps> = ({ 
  language = 'English', 
  onAuditComplete, 
  onStartConsult, 
  onSaveProvision,
  onError, 
  savedAnalysis
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRemediating, setIsRemediating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(savedAnalysis || null);
  const [remediatedDraft, setRemediatedDraft] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [foundRisks, setFoundRisks] = useState<string[]>([]);
  const [riskScore, setRiskScore] = useState<{level: string, color: string, value: number}>({level: 'Neutral', color: 'gray', value: 0});
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [rewriteResult, setRewriteResult] = useState<string | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeKeywords = useMemo(() => LOCALIZED_KEYWORDS[language as Language] || LOCALIZED_KEYWORDS['English'], [language]);

  useEffect(() => {
    if (analysisResult) calculateRisk(analysisResult);
  }, [analysisResult, activeKeywords]);

  const calculateRisk = (text: string) => {
    let finalValue = 0;
    if (!text) return;
    const scoreMatch = text.match(/\[EXPOSURE_SCORE\]:\s*(\d+)/i);
    if (scoreMatch) finalValue = parseInt(scoreMatch[1]);
    const detected: string[] = [];
    const lowerText = text.toLowerCase();
    ['Liability Trap', 'Termination Clause', 'Compliance Breach', 'Liability Risk', 'Contractual Loophole'].forEach(name => {
      const keywords = (activeKeywords as any)[name];
      if (keywords && keywords.some((term: string) => lowerText.includes(term.toLowerCase()))) {
        detected.push(name);
      }
    });
    setFoundRisks(detected);
    const scoreLevel = RISK_SCORE_LEVELS.find(l => finalValue > l.threshold) || RISK_SCORE_LEVELS[RISK_SCORE_LEVELS.length - 1];
    setRiskScore({ level: scoreLevel.level, color: scoreLevel.color, value: finalValue });
  };

  const processFile = async (file: File) => {
    // Lenient validation: check MIME type OR file extension
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      alert("Invalid format. LexiScan requires a PDF handshake.");
      return;
    }
    setFileName(file.name);
    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onerror = () => {
      const errMsg = `File read error: ${reader.error?.message || 'Unknown'}`;
      console.error(errMsg);
      if (onError) onError(new Error(errMsg));
      setIsAnalyzing(false);
    };
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        if (!base64) {
          throw new Error("Failed to encode file as base64");
        }
        const result = await analyzeLegalDocument(base64, language as Language);
        const jurMatch = result.match(/\[JURISDICTION\]:\s*([^\n\r]+)/i);
        const jurisdiction = jurMatch ? jurMatch[1].trim() : undefined;
        setAnalysisResult(result);
        if (onAuditComplete) await onAuditComplete(result, file.name, jurisdiction);
      } catch (err: any) { 
        if (onError) onError(err); 
        else console.error("Audit error:", err);
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemediateDraft = async () => {
    if (!analysisResult) return;
    setIsRemediating(true);
    try {
      const draft = await generateRemediatedDraft(analysisResult, language as Language);
      setRemediatedDraft(draft);
    } catch (err) { console.error(err); } finally { setIsRemediating(false); }
  };

  const handleRewrite = async (risk: string) => {
    setSelectedRisk(risk);
    setIsRewriting(true);
    setRewriteResult(null);
    try {
      const lines = analysisResult?.split('\n') || [];
      const snippet = lines.find(l => l?.toLowerCase().includes(risk.toLowerCase())) || "Industry standard provision.";
      const result = await generateClauseRewrite(snippet, risk, language as Language);
      setRewriteResult(result);
    } catch (e: any) { if (onError) onError(e); } finally { setIsRewriting(false); }
  };

  const commitToLibrary = () => {
    if (!selectedRisk || !rewriteResult || !onSaveProvision) return;
    onSaveProvision({ category: selectedRisk, originalClause: "From Scrutiny Module", safeClause: rewriteResult });
    setSelectedRisk(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-12 flex items-center justify-between">
        <div className="reveal-on-scroll">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-3 block">Neural Module 01</span>
          <h2 className="text-6xl font-black mb-3 tracking-tighter text-white uppercase italic">TACTICAL <span className="text-indigo-500">SCRUTINY.</span></h2>
          <p className="text-gray-500 text-lg font-medium">Deep structural audit and risk-mapping.</p>
        </div>
        {analysisResult && (
          <button onClick={() => { setAnalysisResult(null); setRemediatedDraft(null); }} className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all shadow-xl"><Plus size={16} /> New Scrutiny</button>
        )}
      </div>

      {!analysisResult && !isAnalyzing && (
        <div 
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) processFile(f); }}
          className={`border-2 border-dashed rounded-[64px] p-32 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden border-white/10 hover:bg-white/[0.02] hover:border-white/20`}
        >
          <input 
            type="file" 
            id="audit-upload-input"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} 
            accept="application/pdf" 
            className="hidden" 
          />
          <label
            htmlFor="audit-upload-input"
            className="absolute inset-0 cursor-pointer"
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
          />
          <Upload className="transition-all duration-500 text-gray-600 group-hover:text-white group-hover:scale-110 mb-8" size={64} />
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Inject PDF Handshake</h3>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] mt-4 text-xs">Drop File or Click Zone</p>
        </div>
      )}

      {isAnalyzing && (
        <div className="h-[500px] flex flex-col items-center justify-center space-y-8 bg-[#0a0a0a] rounded-[64px] border border-white/5 shadow-2xl">
           <div className="relative">
              <Loader2 className="animate-spin text-indigo-500" size={80} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-10 h-10 bg-indigo-500/20 rounded-full animate-ping" />
              </div>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black text-white uppercase italic animate-pulse tracking-tighter">Mapping Combat Deltas...</p>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] mt-2">Accessing Neural Precedent Nodes</p>
           </div>
        </div>
      )}

      {analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="space-y-8">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-12">
               <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 text-center shadow-inner">
                  <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Exposure Index</span>
                  <div className={`text-6xl font-black text-${riskScore.color}-500 tracking-tighter mt-4 italic`}>{riskScore.value}%</div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                     <ShieldAlert size={12} className={`text-${riskScore.color}-500`} />
                     <span className={`text-[10px] font-black uppercase tracking-widest text-${riskScore.color}-500/80`}>{riskScore.level} RISK</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 ml-4 mb-4">Risk Vectors</h4>
                  {foundRisks.length > 0 ? foundRisks.map(r => (
                    <div key={r} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-white/10 transition-all shadow-md">
                       <div className="flex items-center justify-between text-red-400 text-[10px] font-black uppercase tracking-widest mb-2">
                         <span>{r}</span>
                         <button onClick={() => handleRewrite(r)} className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"><Sparkles size={14}/></button>
                       </div>
                    </div>
                  )) : (
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl text-center">
                       <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">No Major Vectors Found</p>
                    </div>
                  )}
               </div>
            </div>
            <button onClick={handleRemediateDraft} disabled={isRemediating} className="w-full py-7 bg-indigo-600 text-white font-black rounded-[32px] flex items-center justify-center gap-4 text-base shadow-2xl active:scale-95 transition-all hover:bg-indigo-500">
              {isRemediating ? <Loader2 className="animate-spin" size={24}/> : <FileCode size={24} />}
              Autonomous Remediator
            </button>
          </div>

          <div className="lg:col-span-3 space-y-12">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-[64px] p-12 md:p-20 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-indigo-500"><Terminal size={200} /></div>
               {remediatedDraft ? (
                 <div className="prose prose-invert max-w-none">
                    <div className="flex items-center justify-between mb-20 border-b border-white/5 pb-12">
                       <h3 className="text-3xl font-black text-indigo-400 uppercase italic tracking-tighter">REMEDIATED <span className="text-white">DRAFT.</span></h3>
                       <button onClick={() => setRemediatedDraft(null)} className="p-4 bg-white/5 rounded-2xl hover:text-red-400 transition-colors shadow-xl"><X/></button>
                    </div>
                    {remediatedDraft.split('\n').map((line, i) => (
                      <p key={i} className="text-gray-300 mb-6 font-mono text-base italic leading-relaxed">{line}</p>
                    ))}
                 </div>
               ) : (
                 <div className="prose prose-invert max-w-none">
                    {analysisResult.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) return <h1 key={i} className="text-5xl font-black mb-12 text-white uppercase italic tracking-tighter">{line.replace('# ', '')}</h1>;
                      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-indigo-400 mt-16 mb-8 uppercase italic border-b border-white/5 pb-4 tracking-tight">{line.replace('## ', '')}</h2>;
                      return <p key={i} className="text-gray-500 mb-8 leading-relaxed font-medium text-lg italic">{line}</p>;
                    })}
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {selectedRisk && (
        <div className="fixed inset-0 z-[4000] bg-black/98 backdrop-blur-xl flex items-center justify-center p-8">
           <div className="max-w-2xl w-full bg-[#0a0a0a] border border-indigo-500/30 rounded-[64px] p-16 relative shadow-2xl shadow-indigo-500/10">
              <button onClick={() => setSelectedRisk(null)} className="absolute top-12 right-12 text-gray-500 hover:text-white transition-colors"><X size={32}/></button>
              <h3 className="text-3xl font-black text-white uppercase mb-12 italic tracking-tighter">Optimizing <span className="text-indigo-500">{selectedRisk}</span></h3>
              <div className="bg-black border border-white/5 rounded-3xl p-8 h-64 overflow-y-auto mb-10 font-mono text-indigo-400 italic shadow-inner custom-scrollbar">
                 {isRewriting ? (
                   <div className="h-full flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-indigo-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 animate-pulse">Forging Safe provision...</p>
                   </div>
                 ) : rewriteResult}
              </div>
              <button onClick={commitToLibrary} className="w-full py-7 bg-white text-black font-black rounded-3xl uppercase text-lg shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95">Commit to Standard Library</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default LegalAudit;
