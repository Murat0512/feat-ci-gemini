import React, { useState, useRef, useEffect } from 'react';
/* FIXED: Updated import to use the correct @google/genai module */
import { GoogleGenAI } from '@google/genai';
import { 
  Swords, Shield, Zap, Loader2, Mic, MicOff, Waves, Terminal, 
  BrainCircuit, X, GitCompare, RotateCcw, ChevronDown, ChevronUp 
} from 'lucide-react';
import { compareLegalDocuments } from '../services/geminiService';
import { Language } from '../types';

interface NegotiationDuelProps {
  auditContext?: string;
  comparisonResult?: string;
  language?: string;
}

const NegotiationDuel: React.FC<NegotiationDuelProps> = ({ 
  auditContext: initialAuditContext, 
  comparisonResult: initialComparison, 
  language = 'English' 
}) => {
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
      /* FIXED: Signature match for service function */
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

      /* FIXED: Modern SDK Initialization */
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            /* FIXED: Explicitly typed 'e' to satisfy TS7006 */
            scriptProcessor.onaudioprocess = (e: any) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              
              /* FIXED: Explicitly typed 's' to satisfy TS7006 */
              sessionPromise.then((s: any) => s.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            /* FIXED: Explicitly typed 's' to satisfy TS7006 */
            sessionPromise.then((s: any) => {
              s.sendRealtimeInput({
                text: `INITIALIZE DUEL: Document deltas: ${localComparisonResult}.
                Simulate [ADVERSARY] (firm counsel) and [ADVISOR] (British strategist).
                Language: ${language}.`
              });
            });
          },
          onmessage: async (msg: any) => {
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
          /* FIXED: Explicitly typed 'e' to satisfy TS7006 */
          onerror: (e: any) => console.error(e),
        },
        config: {
          /* FIXED: Used string array or direct cast to resolve TS2820 */
          responseModalities: ["audio"] as any,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          outputAudioTranscription: {},
          systemInstruction: `You are the Strategic Neural Duel Engine. Simulate ADVERSARY and ADVISOR personas.`
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
    return () => stopDuel();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
          <div>
             <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 05: Stress-Test</span>
             <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">Strategic <span className="text-red-500">Duel.</span></h2>
             <p className="text-gray-500 text-lg font-medium italic">Identify structural weaknesses through adversarial friction.</p>
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
               <label htmlFor="duel-baseline-upload" className={`border-2 border-dashed rounded-[64px] p-16 flex flex-col items-center justify-center cursor-pointer transition-all h-[400px] relative overflow-hidden block ${baselineFile ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-indigo-500/30'}`}>
                   <Shield size={40} className="mb-6 text-indigo-500" />
                   <h4 className="text-xl font-black text-white uppercase italic">{baselineFile ? baselineFile.name : 'Inject Baseline'}</h4>
               </label>
            </div>
            <div className="relative group">
               <input type="file" id="duel-counter-upload" onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0], 'counter'); e.target.value = ''; }} accept="application/pdf" className="hidden" />
               <label htmlFor="duel-counter-upload" className={`border-2 border-dashed rounded-[64px] p-16 flex flex-col items-center justify-center cursor-pointer transition-all h-[400px] relative overflow-hidden block ${counterFile ? 'border-red-600 bg-red-600/10' : 'border-white/10 hover:border-red-600/30'}`}>
                   <GitCompare size={40} className="mb-6 text-red-500" />
                   <h4 className="text-xl font-black text-white uppercase italic">{counterFile ? counterFile.name : 'Inject Counter'}</h4>
               </label>
            </div>
            {baselineFile && counterFile && (
              <div className="lg:col-span-2 flex justify-center animate-in fade-in">
                 <button onClick={handleRunComparison} className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl hover:bg-indigo-600 hover:text-white transition-all">
                   <Zap size={32} fill="currentColor" className="mr-4" /> Map Combat Deltas
                 </button>
              </div>
            )}
        </div>
      )}

      {isAnalyzingLocal && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-32 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500 mb-8" size={80} />
            <p className="text-2xl font-black text-white uppercase italic animate-pulse">Computing Neural Differences...</p>
        </div>
      )}

      {localComparisonResult && !isAnalyzingLocal && (
        <div className="space-y-12">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
             <button onClick={() => setShowBriefing(!showBriefing)} className="w-full p-8 flex items-center justify-between hover:bg-white/[0.02]">
                <div className="flex items-center gap-6">
                   <Terminal size={24} className="text-indigo-400" />
                   <h4 className="text-xl font-black text-white uppercase italic">Tactical Briefing</h4>
                </div>
                {showBriefing ? <ChevronUp /> : <ChevronDown />}
             </button>
             {showBriefing && (
               <div className="p-12 prose prose-invert max-w-none bg-black/40">
                  {localComparisonResult.split('\n').map((line, i) => (
                    <p key={i} className="text-gray-400 text-lg italic mb-4">{line}</p>
                  ))}
               </div>
             )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[550px] relative">
            <div className={`relative bg-[#0a0a0a] border-2 rounded-[64px] p-12 flex flex-col items-center justify-center transition-all ${activeSpeaker === 'advisor' ? 'border-indigo-500' : 'border-white/5 opacity-40'}`}>
              <BrainCircuit size={64} className="mb-8 text-indigo-400" />
              <h4 className="text-3xl font-black text-white uppercase italic mb-2">ADVISOR</h4>
              <p className="text-gray-600 text-[10px] font-black uppercase">Coaching & Strategic Support</p>
            </div>

            <div className={`relative bg-[#0a0a0a] border-2 rounded-[64px] p-12 flex flex-col items-center justify-center transition-all ${activeSpeaker === 'adversary' ? 'border-red-600' : 'border-white/5 opacity-40'}`}>
              <Swords size={64} className="mb-8 text-red-500" />
              <h4 className="text-3xl font-black text-white uppercase italic mb-2">ADVERSARY</h4>
              <p className="text-gray-600 text-[10px] font-black uppercase">Adversarial Friction</p>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center font-black italic text-2xl border-4 border-black">VS</div>
            </div>
          </div>

          {!isActive && !isConnecting && (
            <div className="flex justify-center">
              <button onClick={startDuel} className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-3xl uppercase italic shadow-2xl hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-8">
                  Establish Neural Link <Zap size={36} fill="currentColor" />
              </button>
            </div>
          )}

          {isActive && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-[56px] p-12 h-[450px] flex flex-col">
                  <div className="flex items-center gap-3 mb-10">
                    <Terminal size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black uppercase text-gray-700">Signal Log</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-8 pr-6 custom-scrollbar">
                      {transcripts.map((t, i) => (
                        <div key={i} className="flex gap-8">
                          <div className={`text-[9px] font-black uppercase shrink-0 w-24 px-3 py-1 rounded-lg border text-center ${t.role === 'adversary' ? 'text-red-500 border-red-500/20' : 'text-indigo-400 border-indigo-400/20'}`}>
                              {t.role}
                          </div>
                          <p className="text-gray-300 text-xl italic">{t.text}</p>
                        </div>
                      ))}
                      {lastTranscript && (
                        <div className="flex gap-8 animate-pulse">
                          <div className="text-[9px] font-black uppercase shrink-0 w-24 px-3 py-1 rounded-lg border border-indigo-500/20 text-indigo-400 text-center">Inbound</div>
                          <p className="text-indigo-400/60 text-xl italic">{lastTranscript}...</p>
                        </div>
                      )}
                  </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/10 rounded-[56px] p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                  <Waves className="absolute top-0 right-0 p-12 opacity-5" size={160} />
                  <div className={`p-10 rounded-[40px] border-2 transition-all flex flex-col items-center justify-center gap-8 ${activeSpeaker === 'user' ? 'bg-indigo-600/10 border-indigo-500' : 'opacity-40'}`}>
                    <Mic size={48} className={activeSpeaker === 'user' ? 'animate-bounce text-indigo-500' : 'text-gray-700'} />
                    <h5 className="text-lg font-black text-white italic tracking-widest uppercase">Transmitting Rebuttal</h5>
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NegotiationDuel;