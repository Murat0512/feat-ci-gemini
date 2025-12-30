
import React, { useState, useEffect, useRef } from 'react';
/* Added missing 'X' icon to the import list from lucide-react */
import { Sparkles, Image as ImageIcon, FileText, Download, Loader2, Play, MonitorPlay, Zap, Key, ExternalLink, RefreshCw, Copy, Check, ShoppingBag, Store, Layers, BarChart3, Rocket, Volume2, Mic, Save, History, Terminal, Share2, Info, ArrowUpRight, Video, Clapperboard, Monitor, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { generateMarketingAssets, generateMarketingVisual, generateSonicIdentity, generateSovereignVideo } from '../services/geminiService';
import { Language } from '../types';

interface MarketingSuiteProps {
  language?: Language;
  onAssetGenerated?: (asset: { type: 'image' | 'text' | 'audio' | 'video', content: string, prompt: string, timestamp: string }) => void;
  initialContext?: string;
}

const MarketingSuite: React.FC<MarketingSuiteProps> = ({ language = 'English', onAssetGenerated, initialContext }) => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'assets' | 'audio' | 'cinematic'>('visuals');
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUpdate, setVideoUpdate] = useState("Awaiting Signal...");
  
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [assets, setAssets] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<'social' | 'ads' | 'listing'>('social');
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const genericScenes = [
    { id: 'modern', name: 'Nexus Corporate', prompt: 'Ultra-modern corporate office with glass walls, sunset light, high-tech holographic overlays, 8k cinematic film look.' },
    { id: 'dynamic', name: 'Neural Flow', prompt: 'Abstract neural network light streaks, vibrant indigo and electric violet, fast kinetic motion, cyberpunk aesthetic, macro lens.' },
    { id: 'trust', name: 'Sovereign Core', prompt: 'Minimalist secure vault with a floating geometric crystal core, representing digital sovereignty, cold studio lighting, hyper-realistic.' }
  ];

  const [visualPrompt, setVisualPrompt] = useState(genericScenes[0].prompt);
  const [videoPrompt, setVideoPrompt] = useState(initialContext || 'A dramatic reveal of a secure digital data vault in a high-tech facility.');
  const [productPrompt, setProductPrompt] = useState(initialContext || 'LexiScan Enterprise Solutions: Secure. Neural. Scalable.');
  const [sonicText, setSonicText] = useState('LexiScan AI. Establish your superiority.');

  useEffect(() => {
    if (initialContext) {
      setProductPrompt(initialContext);
      setVideoPrompt(`Brand cinematic for: ${initialContext}`);
    }
  }, [initialContext]);

  const checkAndGenerateVideo = async () => {
    if (typeof (window as any).aistudio === 'undefined') return;
    
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setShowKeyPrompt(true);
      return;
    }
    handleGenerateVideo();
  };

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setShowKeyPrompt(false);
    handleGenerateVideo(); // Proceed assuming success per guidelines
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoUrl(null);
    try {
      const url = await generateSovereignVideo(videoPrompt, (msg) => setVideoUpdate(msg));
      setVideoUrl(url);
      if (url && onAssetGenerated) {
        onAssetGenerated({ type: 'video', content: url, prompt: videoPrompt, timestamp: new Date().toLocaleTimeString() });
      }
    } catch (err: any) {
      if (err.message === "BILLING_REQUIRED") setShowKeyPrompt(true);
      console.error(err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleGenerateVisual = async () => {
    setIsGeneratingVisual(true);
    setVisualUrl(null);
    try {
      const url = await generateMarketingVisual(visualPrompt);
      setVisualUrl(url);
      if (url && onAssetGenerated) {
        onAssetGenerated({ type: 'image', content: url, prompt: visualPrompt, timestamp: new Date().toLocaleTimeString() });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  const handleGenerateAssets = async () => {
    setIsGeneratingAssets(true);
    setAssets(null);
    try {
      const platformPrompt = `Create high-conversion tactical marketing copy for: ${productPrompt}. Target: ${platform.toUpperCase()}. Language: ${language}.`;
      const result = await generateMarketingAssets(platformPrompt, language as Language);
      setAssets(result);
      if (result && onAssetGenerated) {
        onAssetGenerated({ type: 'text', content: result, prompt: platformPrompt, timestamp: new Date().toLocaleTimeString() });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAssets(false);
    }
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    setAudioBase64(null);
    try {
      const base64 = await generateSonicIdentity(sonicText);
      setAudioBase64(base64);
      if (base64 && onAssetGenerated) {
        onAssetGenerated({ type: 'audio', content: base64, prompt: sonicText, timestamp: new Date().toLocaleTimeString() });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const playAudio = async (base64?: string) => {
    const target = base64 || audioBase64;
    if (!target) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    await ctx.resume();

    const binaryString = atob(target);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 02: Synthesis</span>
          <h2 className="text-6xl font-black mb-2 tracking-tighter uppercase italic text-white">NEXUS <span className="text-indigo-500">LAB.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">Synthetic asset engine for cinematic brand projection.</p>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-[32px] p-2 backdrop-blur-3xl shadow-2xl overflow-x-auto no-scrollbar max-w-full">
          {(['visuals', 'cinematic', 'assets', 'audio'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'text-gray-500 hover:text-white'}`}
            >
              {tab === 'visuals' && <ImageIcon size={16} />}
              {tab === 'cinematic' && <Clapperboard size={16} />}
              {tab === 'assets' && <Rocket size={16} />}
              {tab === 'audio' && <Volume2 size={16} />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'cinematic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-8">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[56px] p-12 space-y-10 shadow-2xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3"><Monitor className="text-indigo-400" size={18} /> Director's Console</h3>
              <div className="space-y-4">
                 <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Cinematic Brief</label>
                 <textarea value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} className="w-full bg-black border border-white/10 rounded-[32px] p-8 h-48 text-white text-lg font-medium outline-none focus:ring-2 focus:ring-indigo-500 italic shadow-inner" placeholder="Describe your brand vision..." />
              </div>
              <button onClick={checkAndGenerateVideo} disabled={isGeneratingVideo} className="group w-full py-7 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-4 text-xl shadow-2xl active:scale-95 transition-all hover:bg-indigo-600 hover:text-white">
                {isGeneratingVideo ? <Loader2 className="animate-spin" size={24}/> : <Clapperboard size={24} className="group-hover:scale-125 transition-transform"/>}
                {isGeneratingVideo ? 'Synthesizing...' : 'Action: Render Video'}
              </button>
              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center gap-4">
                 <Info size={18} className="text-indigo-500 shrink-0" />
                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-relaxed italic">Rendering cinematic motion can take 2-4 minutes. Keep the link established.</p>
              </div>
            </div>
          </div>
          <div className="bg-black border border-white/10 rounded-[64px] p-4 aspect-video relative overflow-hidden shadow-2xl flex items-center justify-center group">
            {isGeneratingVideo && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl gap-8">
                 <div className="relative">
                    <Loader2 className="animate-spin text-indigo-500" size={80}/>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-12 h-12 bg-indigo-500/20 rounded-full animate-ping" />
                    </div>
                 </div>
                 <div className="text-center">
                    <p className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">{videoUpdate}</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 animate-pulse">Veo 3.1 Pro Cloud Logic Active</p>
                 </div>
              </div>
            )}
            {videoUrl ? (
              <div className="h-full w-full relative group">
                <video src={videoUrl} controls className="w-full h-full rounded-[48px] object-cover shadow-2xl" autoPlay loop />
                <div className="absolute bottom-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
                   <a href={videoUrl} download="nexus-cinematic.mp4" className="px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 shadow-2xl hover:bg-indigo-600 hover:text-white transition-all">
                     <Download size={20} /> Fetch MP4
                   </a>
                </div>
              </div>
            ) : !isGeneratingVideo && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                <MonitorPlay size={120} />
                <p className="text-xl font-black uppercase tracking-widest mt-8 italic">Cinematic Viewport Idle</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'visuals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-8">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[56px] p-12 space-y-10 shadow-2xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3"><MonitorPlay className="text-indigo-400" size={18} /> Style Presets</h3>
              <div className="grid grid-cols-1 gap-4">
                {genericScenes.map((t) => (
                  <button key={t.id} onClick={() => setVisualPrompt(t.prompt)} className={`p-8 rounded-[32px] border text-left transition-all ${visualPrompt === t.prompt ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-white/[0.03] border-white/5 hover:border-white/20'}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest mb-3 block ${visualPrompt === t.prompt ? 'text-indigo-400' : 'text-gray-500'}`}>{t.name}</span>
                    <p className={`text-sm leading-relaxed italic ${visualPrompt === t.prompt ? 'text-white' : 'text-gray-500'}`}>{t.prompt}</p>
                  </button>
                ))}
              </div>
              <button onClick={handleGenerateVisual} disabled={isGeneratingVisual} className="group w-full py-7 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-4 text-xl shadow-2xl active:scale-95 transition-all hover:bg-indigo-600 hover:text-white">
                {isGeneratingVisual ? <Loader2 className="animate-spin" size={24}/> : <Sparkles size={24} className="group-hover:scale-125 transition-transform"/>}
                {isGeneratingVisual ? 'Synthesizing...' : 'Project Asset'}
              </button>
            </div>
          </div>
          <div className="bg-black border border-white/10 rounded-[64px] p-4 aspect-video relative overflow-hidden shadow-2xl flex items-center justify-center group">
            {isGeneratingVisual && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl gap-6">
                 <Loader2 className="animate-spin text-indigo-500" size={64}/>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 animate-pulse">Computing Image Lattice...</p>
              </div>
            )}
            {visualUrl ? (
              <div className="h-full w-full relative group">
                <img src={visualUrl} className="w-full h-full rounded-[48px] object-cover contrast-125 brightness-110" alt="Generated visual" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[48px] flex items-end p-12">
                   <button onClick={() => { const l = document.createElement('a'); l.href = visualUrl; l.download = 'nexus-visual.png'; l.click(); }} className="px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 shadow-2xl hover:bg-indigo-600 hover:text-white transition-all">
                     <Download size={20} /> Fetch Master
                   </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                <ImageIcon size={120} />
                <p className="text-xl font-black uppercase tracking-widest mt-8 italic">Neural Viewport Idle</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'audio' && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
            
            <div className={`w-40 h-40 mx-auto rounded-[40px] border border-white/5 flex items-center justify-center text-indigo-400 shadow-2xl transition-all duration-700 ${isGeneratingAudio ? 'bg-indigo-500/20 scale-110 animate-pulse shadow-indigo-500/20' : 'bg-white/5'}`}>
              <Volume2 size={64} />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic">SONIC <span className="text-indigo-500">IDENTITY.</span></h3>
              <p className="text-gray-500 text-lg font-medium italic">"Voice the future with high-fidelity brand synthesis."</p>
            </div>
            <div className="relative">
              <textarea 
                value={sonicText} 
                onChange={(e) => setSonicText(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-[40px] p-10 text-center text-2xl font-black outline-none focus:ring-2 focus:ring-indigo-500 h-48 text-white italic shadow-inner"
                placeholder="Enter tactical slogan..."
              />
              <div className="absolute bottom-6 right-10 text-[9px] font-black text-gray-600 uppercase tracking-widest">Neural Text Source</div>
            </div>
            <div className="flex gap-6">
              <button onClick={handleGenerateAudio} disabled={isGeneratingAudio} className="flex-1 py-7 bg-white text-black font-black rounded-[32px] flex items-center justify-center gap-4 text-xl shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95">
                {isGeneratingAudio ? <Loader2 className="animate-spin" size={24}/> : <Mic size={24} />}
                {isGeneratingAudio ? 'Vocoding...' : 'Synthesize Voice'}
              </button>
              {audioBase64 && (
                <button onClick={() => playAudio()} className="w-32 py-7 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black rounded-[32px] flex items-center justify-center shadow-xl hover:bg-indigo-600 hover:text-white transition-all">
                  <Play size={32} fill="currentColor" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[56px] p-12 space-y-10 shadow-2xl">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic">SMART <span className="text-indigo-500">COPY.</span></h3>
            <div className="grid grid-cols-3 gap-4">
              {['social', 'ads', 'listing'].map(p => (
                <button key={p} onClick={() => setPlatform(p as any)} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-md ${platform === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/5 border-white/5 text-gray-600 hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="space-y-4">
               <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Product Context</label>
               <textarea value={productPrompt} onChange={(e) => setProductPrompt(e.target.value)} className="w-full bg-black border border-white/10 rounded-[32px] p-8 h-56 text-white text-lg font-medium outline-none focus:ring-2 focus:ring-indigo-500 italic shadow-inner" />
            </div>
            <button onClick={handleGenerateAssets} disabled={isGeneratingAssets} className="w-full py-7 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black rounded-3xl flex items-center justify-center gap-4 text-xl shadow-2xl active:scale-95 transition-all">
              {isGeneratingAssets ? <Loader2 className="animate-spin" size={24}/> : <Rocket size={24} />}
              Synthesize Copy
            </button>
          </div>
          <div className="bg-[#050505] border border-white/10 rounded-[56px] p-12 h-full min-h-[500px] overflow-y-auto shadow-inner relative group">
            <div className="absolute top-8 left-8 flex items-center gap-2">
               <Terminal size={12} className="text-indigo-500" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">Output Stream</span>
            </div>
            {assets ? (
              <div className="space-y-10 pt-10">
                <div className="flex justify-end"><button onClick={() => {navigator.clipboard.writeText(assets || ''); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-all">{copied ? 'Synced' : 'Copy Data'}</button></div>
                <div className="prose prose-invert max-w-none text-xl leading-relaxed italic text-gray-300 font-serif">
                   {assets}
                </div>
              </div>
            ) : <div className="h-full flex flex-col items-center justify-center opacity-10 text-center"><FileText size={80} className="mb-6"/><p className="text-xl font-black uppercase tracking-widest italic">Stream Empty</p></div>}
          </div>
        </div>
      )}

      {/* API Key Modal Gate */}
      {showKeyPrompt && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className="max-w-md w-full bg-[#0a0a0a] border border-indigo-500/30 rounded-[64px] p-12 text-center shadow-2xl shadow-indigo-500/20 relative">
              <button onClick={() => setShowKeyPrompt(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-indigo-600/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-indigo-500 shadow-xl border border-indigo-500/20">
                 <ShieldCheck size={40} />
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic mb-4">Enterprise Access</h3>
              <p className="text-gray-500 text-sm font-medium mb-10 italic leading-relaxed">
                High-fidelity video synthesis requires a paid API key from a Google Cloud Project with billing enabled.
              </p>
              <div className="space-y-4">
                 <button onClick={handleSelectKey} className="w-full py-6 bg-white text-black font-black rounded-3xl uppercase tracking-widest text-sm shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95">
                    Select Paid API Key
                 </button>
                 <a 
                   href="https://ai.google.dev/gemini-api/docs/billing" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex items-center justify-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors"
                 >
                    Billing Documentation <ArrowUpRight size={14} />
                 </a>
              </div>
           </div>
        </div>
      )}

      {/* Lab Insight */}
      <div className="mt-20 p-12 bg-indigo-500/5 border border-indigo-500/10 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="max-w-xl">
            <h4 className="text-2xl font-black text-white uppercase italic mb-2 tracking-tight">Direct Context Injection</h4>
            <p className="text-gray-500 text-base font-medium leading-relaxed italic">The Nexus Lab v5.0 can absorb audit data directly from Module 01 to ensure your marketing claims are legally fortified and hyper-targeted.</p>
         </div>
         <div className="flex gap-4">
            <div className="p-4 px-8 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center">
               <span className="text-3xl font-black text-white">400ms</span>
               <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mt-1">Lattice Delay</span>
            </div>
            <div className="p-4 px-8 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center">
               <span className="text-3xl font-black text-white">98%</span>
               <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-1">Linguistic Sync</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MarketingSuite;
