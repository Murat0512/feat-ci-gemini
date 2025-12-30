
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Swords, Shield, Zap, Loader2, Mic, MicOff, AlertCircle, CheckCircle2, Waves, Terminal, Info, BrainCircuit, X, MessageSquare, Flame, Upload, FileText, GitCompare, RotateCcw, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { compareLegalDocuments } from '../services/geminiService';
import { Language } from '../types';

interface NegotiationDuelProps {
  auditContext?: string;
  comparisonResult?: string;
  language?: string;
}

const NegotiationDuel: React.FC<NegotiationDuelProps> = ({ auditContext: initialAuditContext, comparisonResult: initialComparison, language = 'English' }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'advisor' | 'adversary' | 'user'>('user');
  const [transcripts, setTranscripts] = useState<{ role: string, text: string }[]>([]);
  const [lastTranscript, setLastTranscript] = useState('');
  const [showBriefing, setShowBriefing] = useState(true);
  
  const [localComparisonResult, setLocalComparisonResult] = useState<string | null>(initialComparison || null);
  const [isAnalyzingLocal, setIsAnalyzingLocal] = useState(false);
  
  const [baselineFile, setBaselineFile] = useState<{name: string, data: string} | null>(null);
  const [counterFile, setCounterFile] = useState<{name: string, data: string} | null>(null);

  const [isDraggingBaseline, setIsDraggingBaseline] = useState(false);
  const [isDraggingCounter, setIsDraggingCounter] = useState(false);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const processFile = (file: File, type: 'baseline' | 'counter') => {
    if (!file || file.type !== 'application/pdf') {
      alert("Please provide a valid PDF document.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (type === 'baseline') setBaselineFile({ name: file.name, data: base64 });
      else setCounterFile({ name: file.name, data: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleRunComparison = async () => {
    if (!baselineFile || !counterFile) return;
    setIsAnalyzingLocal(true);
    try {
      const result = await compareLegalDocuments(baselineFile.data, counterFile.data, language as Language);
      setLocalComparisonResult(result);
      setShowBriefing(true);
    } catch (err) {
      console.error(err);
      alert("Failed to compare documents for the duel.");
    } finally {
      setIsAnalyzingLocal(false);
    }
  };

  const startDuel = async () => {
    if (!localComparisonResult) {
       alert("Synchronize documents first to establish a tactical baseline.");
       return;
    }

    setIsConnecting(true);
    setTranscripts([{ role: 'system', text: 'Initializing Dual-Agent Duel Protocol...' }]);
    setShowBriefing(false);
    
    try {
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = outputAudioContext;
      inputAudioContextRef.current = inputAudioContext;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            sessionPromise.then(s => {
              s.sendRealtimeInput({
                text: `INITIALIZE DUEL: We are analyzing these document deltas: ${localComparisonResult}.
                The [ADVERSARY] should begin.
                The [ADVISOR] should then follow with a calm, professional British tactical response. 
                Commence transmission in ${language}.`
              });
            });
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) {
                const text = msg.serverContent.outputTranscription.text;
                setLastTranscript(prev => prev + text);
                
                const lowerText = text.toLowerCase();
                if (lowerText.includes('[adversary]') || lowerText.includes('adversary:')) setActiveSpeaker('adversary');
                else if (lowerText.includes('[advisor]') || lowerText.includes('advisor:')) setActiveSpeaker('advisor');
            }

            const base64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64 && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (msg.serverContent?.turnComplete) {
              const fullText = lastTranscript;
              const role = fullText.toLowerCase().includes('adversary') ? 'adversary' : 'advisor';
              setTranscripts(prev => [...prev, { role, text: fullText.replace(/\[ADVERSARY\]|\[ADVISOR\]/gi, '').trim() }]);
              setActiveSpeaker('user');
              setLastTranscript('');
            }

            if (msg.serverContent?.interrupted) {
              for (const s of sourcesRef.current.values()) { try { s.stop(); } catch(e){} }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => console.error(e),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          outputAudioTranscription: {},
          systemInstruction: `You are the Strategic Neural Duel Engine. You must verbally simulate TWO distinct professional legal personalities:

          1. THE ADVERSARY: Prefix with "[ADVERSARY]". Tone: Firm, serious, professional opposing counsel.
          2. THE ADVISOR: Prefix with "[ADVISOR]". Tone: Calm, sophisticated, understated British strategist. 
          
          MANDATORY LINGUISTIC RULES:
          - Use a restrained, professional British tone. Avoid being "over-the-top" or caricatured.
          - Use standard British business English.
          - ADVISOR is your tactical support; ADVERSARY is the challenge.
          
          Context: ${localComparisonResult}. Language: ${language}.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopDuel = () => {
    setIsActive(false);
    if (sessionRef.current) try { sessionRef.current.close(); } catch(e){}
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setTranscripts(prev => [...prev, { role: 'system', text: 'Duel Severed.' }]);
  };

  useEffect(() => {
    return () => {
      stopDuel();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
         <div className="reveal-on-scroll">
            <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 05: Stress-Test</span>
            <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">Strategic <span className="text-red-500">Duel.</span></h2>
            <p className="text-gray-500 text-lg font-medium italic">Simulate adversarial friction to identify structural weaknesses.</p>
         </div>
         {(isActive || localComparisonResult) && (
           <div className="flex items-center gap-6">
              {localComparisonResult && !isActive && (
                <button onClick={() => { setLocalComparisonResult(null); setBaselineFile(null); setCounterFile(null); }} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all flex items-center gap-2">
                  <RotateCcw size={14} /> Re-Initialize
                </button>
              )}
              {isActive && (
                <button onClick={stopDuel} className="px-8 py-4 bg-red-600 text-white font-black rounded-2xl flex items-center gap-3 uppercase text-xs tracking-widest shadow-2xl shadow-red-600/20 active:scale-95 transition-all">
                    <X size={18} /> Sever Link
                </button>
              )}
           </div>
         )}
      </div>

      {!localComparisonResult && !isAnalyzingLocal && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in zoom-in duration-700">
           <div className="relative group">
              <input type="file" id="duel-baseline-upload" onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0], 'baseline'); e.target.value = ''; }} accept="application/pdf" className="hidden" />
              <label htmlFor="duel-baseline-upload" onDragOver={(e) => { e.preventDefault(); setIsDraggingBaseline(true); }} onDragLeave={() => setIsDraggingBaseline(false)} onDrop={(e) => { e.preventDefault(); setIsDraggingBaseline(false); const f = e.dataTransfer.files[0]; if(f) processFile(f, 'baseline'); }} className={`border-2 border-dashed rounded-[64px] p-16 flex flex-col items-center justify-center cursor-pointer transition-all h-[400px] relative overflow-hidden block ${baselineFile ? 'border-emerald-500 bg-emerald-500/10' : isDraggingBaseline ? 'border-indigo-500 bg-indigo-500/20 scale-[1.02] shadow-[0_0_40px_rgba(79,70,229,0.3)]' : 'border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.02]'}`}>
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${baselineFile || isDraggingBaseline ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'bg-white/5 text-gray-700'}`}><Shield size={40} /></div>
                  <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{baselineFile ? baselineFile.name : 'Inject Baseline'}</h4>
                  <p className="text-gray-600 text-sm font-bold uppercase tracking-widest mt-2">Sovereign Position</p>
              </label>
           </div>
           <div className="relative group">
              <input type="file" id="duel-counter-upload" onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0], 'counter'); e.target.value = ''; }} accept="application/pdf" className="hidden" />
              <label htmlFor="duel-counter-upload" onDragOver={(e) => { e.preventDefault(); setIsDraggingCounter(true); }} onDragLeave={() => setIsDraggingCounter(false)} onDrop={(e) => { e.preventDefault(); setIsDraggingCounter(false); const f = e.dataTransfer.files[0]; if(f) processFile(f, 'counter'); }} className={`border-2 border-dashed rounded-[64px] p-16 flex flex-col items-center justify-center cursor-pointer transition-all h-[400px] relative overflow-hidden block ${counterFile ? 'border-red-600 bg-red-600/10' : isDraggingCounter ? 'border-red-600 bg-red-600/20 scale-[1.02] shadow-[0_0_40px_rgba(220,38,38,0.3)]' : 'border-white/10 hover:border-red-600/30 hover:bg-white/[0.02]'}`}>
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${counterFile || isDraggingCounter ? 'bg-red-600 text-white shadow-xl shadow-red-500/20' : 'bg-white/5 text-gray-700'}`}><GitCompare size={40} /></div>
                  <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{counterFile ? counterFile.name : 'Inject Counter'}</h4>
                  <p className="text-gray-600 text-sm font-bold uppercase tracking-widest mt-2">Adversarial Offer</p>
              </label>
           </div>
           {baselineFile && counterFile && (
             <div className="lg:col-span-2 flex justify-center animate-in fade-in duration-500">
                <button onClick={handleRunComparison} className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 hover:bg-indigo-600 hover:text-white transition-all active:scale-95">
                  <Zap size={32} fill="currentColor" /> Map Combat Deltas
                </button>
             </div>
           )}
        </div>
      )}

      {isAnalyzingLocal && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-32 flex flex-col items-center justify-center space-y-8">
           <Loader2 className="animate-spin text-indigo-500" size={80} />
           <p className="text-2xl font-black text-white uppercase italic animate-pulse">Computing Neural Differences...</p>
        </div>
      )}

      {localComparisonResult && !isAnalyzingLocal && (
        <div className="space-y-12">
          {/* Tactical Briefing Section */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl transition-all">
             <button onClick={() => setShowBriefing(!showBriefing)} className="w-full p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors border-b border-white/5">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20"><Terminal size={24}/></div>
                   <div className="text-left">
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Tactical Comparison Briefing</h4>
                      <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Deciphered Deltas Ready for Duel</p>
                   </div>
                </div>
                {showBriefing ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
             </button>
             {showBriefing && (
               <div className="p-12 prose prose-invert max-w-none bg-black/40 animate-in slide-in-from-top-4 duration-500">
                  {localComparisonResult.split('\n').map((line, i) => (
                    <p key={i} className="text-gray-400 text-lg font-medium italic leading-relaxed mb-4">{line}</p>
                  ))}
               </div>
             )}
          </div>

          {/* VS Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[550px] relative">
            <div className={`relative bg-[#0a0a0a] border-2 rounded-[64px] p-12 flex flex-col items-center justify-center transition-all duration-700 ${activeSpeaker === 'advisor' ? 'border-indigo-500 shadow-[0_0_100px_rgba(79,70,229,0.3)]' : 'border-white/5 opacity-40'}`}>
              <div className="absolute top-10 left-12 flex items-center gap-3">
                <Shield className="text-indigo-400" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Strategic Advisor</span>
              </div>
              <div className={`w-32 h-32 rounded-[40px] flex items-center justify-center mb-8 border-2 transition-all ${activeSpeaker === 'advisor' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500 animate-pulse' : 'bg-white/5 text-gray-700 border-transparent'}`}>
                <BrainCircuit size={64} />
              </div>
              <h4 className="text-3xl font-black text-white uppercase italic mb-2 tracking-tighter">ADVISOR</h4>
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">Coaching & Strategic Support</p>
            </div>

            <div className={`relative bg-[#0a0a0a] border-2 rounded-[64px] p-12 flex flex-col items-center justify-center transition-all duration-700 ${activeSpeaker === 'adversary' ? 'border-red-600 shadow-[0_0_100px_rgba(220,38,38,0.3)]' : 'border-white/5 opacity-40'}`}>
              <div className="absolute top-10 right-12 flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Opposing Counsel</span>
                <span className="text-red-500"><Swords size={20} /></span>
              </div>
              <div className={`w-32 h-32 rounded-[40px] flex items-center justify-center mb-8 border-2 transition-all ${activeSpeaker === 'adversary' ? 'bg-red-600/20 text-red-500 border-red-600 animate-pulse' : 'bg-white/5 text-gray-700 border-transparent'}`}>
                <Swords size={64} />
              </div>
              <h4 className="text-3xl font-black text-white uppercase italic mb-2 tracking-tighter">ADVERSARY</h4>
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">Adversarial Friction</p>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center font-black italic text-2xl shadow-2xl border-4 border-black">VS</div>
            </div>
          </div>

          {!isActive && !isConnecting && (
            <div className="flex justify-center animate-in slide-in-from-bottom-6 duration-700">
              <button onClick={startDuel} className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-3xl uppercase italic tracking-tighter shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center gap-8">
                  Establish Neural Link <Zap size={36} fill="currentColor" />
              </button>
            </div>
          )}

          {isConnecting && (
            <div className="flex flex-col items-center gap-8 py-10">
              <Loader2 size={80} className="animate-spin text-indigo-500" />
              <div className="text-center">
                 <p className="text-2xl font-black text-white uppercase tracking-widest animate-pulse italic">Synchronizing Personalities...</p>
                 <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] mt-2">Connecting to Secure Modality Engine</p>
              </div>
            </div>
          )}

          {isActive && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-700">
              <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-[56px] p-12 h-[450px] flex flex-col shadow-inner relative overflow-hidden group">
                  <div className="absolute top-8 left-10 flex items-center gap-3">
                    <Terminal size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">Signal Log</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-8 pr-6 custom-scrollbar mt-10">
                      {transcripts.map((t, i) => (
                        <div key={i} className={`flex gap-8 animate-in slide-in-from-bottom-4 duration-500 ${t.role === 'system' ? 'opacity-30 border-b border-white/5 pb-4' : ''}`}>
                          <div className={`text-[9px] font-black uppercase tracking-widest shrink-0 mt-2 w-24 px-3 py-1 rounded-lg border text-center ${t.role === 'adversary' ? 'text-red-500 border-red-500/20 bg-red-500/5' : t.role === 'advisor' ? 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5' : 'text-gray-600 border-white/5'}`}>
                              {t.role}
                          </div>
                          <p className="text-gray-300 text-xl font-medium leading-relaxed italic">{t.text}</p>
                        </div>
                      ))}
                      {lastTranscript && (
                        <div className="flex gap-8 animate-pulse border-l-2 border-indigo-500/20 pl-6">
                          <div className="text-[9px] font-black uppercase tracking-widest shrink-0 mt-2 w-24 px-3 py-1 rounded-lg border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-center">Inbound</div>
                          <p className="text-indigo-400/60 text-xl font-medium leading-relaxed italic">{lastTranscript}...</p>
                        </div>
                      )}
                  </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/10 rounded-[56px] p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Waves size={160} /></div>
                  <div className={`p-10 rounded-[40px] border-2 transition-all duration-500 flex flex-col items-center justify-center gap-8 ${activeSpeaker === 'user' ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_50px_rgba(79,70,229,0.2)]' : 'bg-black/40 border-white/5 opacity-40'}`}>
                    <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center transition-all ${activeSpeaker === 'user' ? 'bg-indigo-600 text-white shadow-2xl animate-bounce' : 'bg-white/5 text-gray-700'}`}>
                        <Mic size={48} />
                    </div>
                    <div className="text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 block mb-2">Neural Input</span>
                        <h5 className="text-lg font-black text-white italic tracking-widest uppercase">Transmitting Rebuttal</h5>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-white/5 text-center">
                     <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.3em]">Latency: 18ms Linked</p>
                  </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }
      `}</style>
    </div>
  );
};

export default NegotiationDuel;
