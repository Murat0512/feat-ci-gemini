
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Loader2, GitCompare, ChevronRight, ShieldAlert, AlertCircle, ExternalLink, ArrowRight, CheckCircle2, MessageSquareText, Sparkles, X, ChevronDown, Eye, EyeOff, ShieldCheck, Terminal, Zap, Mic2, Waves } from 'lucide-react';
import { compareLegalDocuments, generateNegotiationScript } from '../services/geminiService';
import NeuralConsult from './NeuralConsult';
import { Language } from '../types';

interface ComparativeAnalysisProps {
  language?: Language;
  onComparisonComplete?: (result: string) => void;
}

const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({ language = 'English', onComparisonComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [showNeuralConsult, setShowNeuralConsult] = useState(false);
  
  const [originalFile, setOriginalFile] = useState<{name: string, data: string} | null>(null);
  const [originalBlobUrl, setOriginalBlobUrl] = useState<string | null>(null);
  const [showOriginalPreview, setShowOriginalPreview] = useState(false);
  const [isDraggingOriginal, setIsDraggingOriginal] = useState(false);

  const [counterFile, setCounterFile] = useState<{name: string, data: string} | null>(null);
  const [counterBlobUrl, setCounterBlobUrl] = useState<string | null>(null);
  const [showCounterPreview, setShowCounterPreview] = useState(false);
  const [isDraggingCounter, setIsDraggingCounter] = useState(false);

  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [negotiationScript, setNegotiationScript] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(false);
  
  const originalRef = useRef<HTMLInputElement>(null);
  const counterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (originalBlobUrl) URL.revokeObjectURL(originalBlobUrl);
      if (counterBlobUrl) URL.revokeObjectURL(counterBlobUrl);
    };
  }, [originalBlobUrl, counterBlobUrl]);

  const processFile = (file: File, type: 'original' | 'counter') => {
    if (!file || file.type !== 'application/pdf') {
      alert("Please provide a valid PDF document.");
      return;
    }
    
    const blobUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (type === 'original') {
        if (originalBlobUrl) URL.revokeObjectURL(originalBlobUrl);
        setOriginalFile({ name: file.name, data: base64 });
        setOriginalBlobUrl(blobUrl);
        setShowOriginalPreview(true);
        setIsDraggingOriginal(false);
      } else {
        if (counterBlobUrl) URL.revokeObjectURL(counterBlobUrl);
        setCounterFile({ name: file.name, data: base64 });
        setCounterBlobUrl(blobUrl);
        setShowCounterPreview(true);
        setIsDraggingCounter(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'original' | 'counter') => {
    const file = e.target.files?.[0];
    if (file) processFile(file, type);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent, type: 'original' | 'counter') => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file, type);
  };

  const onDragOver = (e: React.DragEvent, type: 'original' | 'counter') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'original') setIsDraggingOriginal(true);
    else setIsDraggingCounter(true);
  };

  const onDragLeave = (e: React.DragEvent, type: 'original' | 'counter') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'original') setIsDraggingOriginal(false);
    else setIsDraggingCounter(false);
  };

  const triggerUpload = (e: React.MouseEvent, type: 'original' | 'counter') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'original') originalRef.current?.click();
    else counterRef.current?.click();
  };

  const handleCompare = async () => {
    if (!originalFile || !counterFile) return;
    setIsAnalyzing(true);
    setComparisonResult(null);
    try {
      const result = await compareLegalDocuments(originalFile.data, counterFile.data, language as Language);
      setComparisonResult(result);
      if (onComparisonComplete) onComparisonComplete(result);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  const handleGeneratePlaybook = async () => {
    if (!comparisonResult) return;
    setIsGeneratingScript(true);
    setShowScript(true);
    try {
      const script = await generateNegotiationScript(comparisonResult, language as Language);
      setNegotiationScript(script);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsGeneratingScript(false); 
    }
  };

  const clearSession = () => {
    setComparisonResult(null);
    setOriginalFile(null);
    setCounterFile(null);
    setNegotiationScript(null);
    setShowOriginalPreview(false);
    setShowCounterPreview(false);
    setShowNeuralConsult(false);
    if (originalBlobUrl) URL.revokeObjectURL(originalBlobUrl);
    if (counterBlobUrl) URL.revokeObjectURL(counterBlobUrl);
    setOriginalBlobUrl(null);
    setCounterBlobUrl(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-5xl font-black mb-3 tracking-tighter text-white uppercase italic">Negotiation <span className="text-indigo-500">War-Room</span></h2>
          <p className="text-gray-400 text-lg font-medium">Milestone 3: Precision comparative analysis for tactical advantage.</p>
        </div>
        {(originalFile || counterFile) && (
          <button onClick={clearSession} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            Reset War-Room
          </button>
        )}
      </div>

      {!comparisonResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 animate-in fade-in duration-700">
          <div className="space-y-6">
            <div 
              onClick={(e) => triggerUpload(e, 'original')}
              onDragOver={(e) => onDragOver(e, 'original')}
              onDragLeave={(e) => onDragLeave(e, 'original')}
              onDrop={(e) => onDrop(e, 'original')}
              className={`group border-2 border-dashed rounded-[56px] p-12 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${originalFile ? 'border-emerald-500/50 bg-emerald-500/[0.04]' : isDraggingOriginal ? 'border-emerald-500 bg-emerald-500/20 scale-[1.02]' : 'border-white/10 hover:bg-white/[0.02]'}`}
            >
              <input type="file" ref={originalRef} onChange={(e) => handleFileChange(e, 'original')} accept="application/pdf" className="hidden" />
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-all ${originalFile ? 'bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-gray-500 group-hover:scale-110'}`}>
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-black mb-1 text-white uppercase tracking-tight">{originalFile ? 'Baseline Active' : 'Inject Baseline'}</h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{originalFile ? originalFile.name : 'Target draft for protection'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div 
              onClick={(e) => triggerUpload(e, 'counter')}
              onDragOver={(e) => onDragOver(e, 'counter')}
              onDragLeave={(e) => onDragLeave(e, 'counter')}
              onDrop={(e) => onDrop(e, 'counter')}
              className={`group border-2 border-dashed rounded-[56px] p-12 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${counterFile ? 'border-indigo-500/50 bg-indigo-500/[0.04]' : isDraggingCounter ? 'border-indigo-500 bg-indigo-500/20 scale-[1.02]' : 'border-white/10 hover:bg-white/[0.02]'}`}
            >
              <input type="file" ref={counterRef} onChange={(e) => handleFileChange(e, 'counter')} accept="application/pdf" className="hidden" />
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-all ${counterFile ? 'bg-indigo-500 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'bg-white/5 text-gray-500 group-hover:scale-110'}`}>
                <GitCompare size={36} />
              </div>
              <h3 className="text-xl font-black mb-1 text-white uppercase tracking-tight">{counterFile ? 'Counter Received' : 'Inject Counter'}</h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{counterFile ? counterFile.name : 'Comparative target'}</p>
            </div>
          </div>
        </div>
      )}

      {originalFile && counterFile && !comparisonResult && (
        <div className="flex justify-center pb-12 animate-in fade-in duration-500">
          <button 
            onClick={handleCompare} 
            disabled={isAnalyzing}
            className="px-16 py-6 bg-white text-black font-black rounded-3xl text-xl flex items-center gap-4 shadow-2xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 uppercase italic tracking-tight"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" /> : <Zap size={24} fill="currentColor" />}
            {isAnalyzing ? 'Deciphering Deltas...' : 'Run Comparative Audit'}
          </button>
        </div>
      )}

      {comparisonResult && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="flex flex-wrap items-center justify-between gap-6 bg-[#0a0a0a] border border-white/10 rounded-[48px] p-8 shadow-2xl">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl"><Terminal size={24}/></div>
                <div>
                   <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-1 block">Analysis Ready</span>
                   <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Delta Comparison Active</h4>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowNeuralConsult(!showNeuralConsult)}
                  className={`px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 transition-all active:scale-95 shadow-xl ${showNeuralConsult ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                >
                   {showNeuralConsult ? <X size={18} /> : <Mic2 size={18} />}
                   {showNeuralConsult ? 'Sever Voice Feed' : 'Neural War-Room Feed'}
                </button>
                <button 
                  onClick={handleGeneratePlaybook}
                  disabled={isGeneratingScript}
                  className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs hover:bg-gray-200 transition-all active:scale-95 shadow-xl flex items-center gap-3"
                >
                   {isGeneratingScript ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                   Tactical Playbook
                </button>
             </div>
          </div>

          <div className="bg-[#0f0f0f] border border-white/10 rounded-[64px] p-12 md:p-16 shadow-2xl relative">
            <div className="prose prose-invert max-w-none">
              {comparisonResult.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-4xl md:text-6xl font-black mb-12 pb-6 border-b border-white/10 text-white tracking-tighter uppercase italic">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-indigo-400 mt-16 mb-8 uppercase flex items-center gap-4 italic"><ChevronRight size={24}/> {line.replace('## ', '')}</h2>;
                if (line.startsWith('- ')) return (
                  <div key={i} className="flex gap-5 mb-6 p-6 bg-white/[0.03] border border-white/5 rounded-[32px] hover:bg-white/[0.05] transition-all group hover:border-white/10">
                    <div className="mt-1.5 shrink-0"><CheckCircle2 size={20} className="text-emerald-500" /></div>
                    <p className="text-gray-300 m-0 text-lg font-medium leading-relaxed italic">{line.replace('- ', '')}</p>
                  </div>
                );
                return <p key={i} className="text-gray-500 mb-8 leading-relaxed font-medium text-xl italic">{line}</p>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparativeAnalysis;
