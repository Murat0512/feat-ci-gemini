
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Volume2, Shield, Loader2, BrainCircuit, Info, MessageSquare, Monitor, VideoOff, Activity, Zap, Terminal, Wifi, Lock, ShieldCheck, RefreshCw, AudioLines, Waves, Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { analyzeLegalDocument } from '../services/geminiService';
import { Language } from '../types';

interface NeuralConsultProps {
  auditContext?: string;
  language?: string;
}

const NeuralConsult: React.FC<NeuralConsultProps> = ({ auditContext: initialAuditContext, language = 'English' }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  
  // Local context state to allow direct upload
  const [localAuditContext, setLocalAuditContext] = useState<string | null>(initialAuditContext || null);
  const [isAnalyzingLocal, setIsAnalyzingLocal] = useState(false);
  const [localFileName, setLocalFileName] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const transcriptBufferRef = useRef<string>('');
  const displayedTranscriptRef = useRef<string>('');
  const transcriptTimersRef = useRef<number[]>([]);

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

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert("Please provide a valid PDF document for briefing.");
      return;
    }

    setLocalFileName(file.name);
    setIsAnalyzingLocal(true);
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeLegalDocument(base64, language as Language);
        setLocalAuditContext(result);
      } catch (err) {
        console.error("Analysis Error:", err);
        alert("Failed to analyze the document for briefing.");
      } finally {
        setIsAnalyzingLocal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const startSession = async () => {
    setIsConnecting(true);
    setLastTranscript('Synchronizing neural document context...');
    displayedTranscriptRef.current = '';
    transcriptBufferRef.current = '';
    
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
            setLastTranscript('Neural Link Established. Advisor is analyzing the provided data.');
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              let max = 0;
              for (let i = 0; i < inputData.length; i++) {
                if (Math.abs(inputData[i]) > max) max = Math.abs(inputData[i]);
              }
              setIsUserSpeaking(max > 0.05);

              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            sessionPromise.then((session) => {
                session.sendRealtimeInput({
                    text: `INITIALIZE: You are the lead Strategic Neural Consultant. Introduce yourself with a professional, understated British persona. ${localAuditContext ? `The audit context is: ${localAuditContext}.` : 'I am currently awaiting a briefing PDF.'} Summarize the situation briefly and wait for my prompt.`
                });
            });
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              transcriptBufferRef.current += message.serverContent.outputTranscription.text;
            }

            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                ctx,
                24000,
                1,
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              const delayMs = Math.max(0, (nextStartTimeRef.current - ctx.currentTime) * 1000);
              const chunkText = transcriptBufferRef.current;
              transcriptBufferRef.current = '';

              const timer = window.setTimeout(() => {
                if (chunkText) {
                  displayedTranscriptRef.current += chunkText;
                  setLastTranscript(displayedTranscriptRef.current);
                }
                transcriptTimersRef.current = transcriptTimersRef.current.filter(t => t !== timer);
              }, delayMs);
              
              transcriptTimersRef.current.push(timer);

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              transcriptTimersRef.current.forEach(t => clearTimeout(t));
              transcriptTimersRef.current = [];
              transcriptBufferRef.current = '';
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch (e) {}
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Handshake Error:', e);
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: `You are the Strategic Neural Consultant for LexiScan. Respond verbally in ${language}.
          
          IDENTITY: You are a sharp, professional British legal strategist. Your voice is sophisticated and professional, using Received Pronunciation (RP), but remaining understated and natural.
          
          LINGUISTIC GUIDELINES:
          - Use professional British business English.
          - Avoid over-the-top idioms; maintain a precise and helpful status.
          - Be the intellectual peer of the user.
          
          THE DOCUMENT DATA:
          ${localAuditContext || "No document provided. Ask for a briefing PDF."}
          
          OPERATIONAL DIRECTIVES:
          1. YOU ARE THE DOCUMENT EXPERT. Answer using the provided audit data.
          2. BE TACTICAL. Suggest clever rebuttals and potential pitfalls.
          3. VERBAL PRIORITY. Maintain your sophisticated persona throughout.`
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      alert("Neural sync failed. Check microphone permissions.");
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    setLastTranscript('Connection Severed.');
    displayedTranscriptRef.current = '';
    transcriptBufferRef.current = '';
    transcriptTimersRef.current.forEach(t => clearTimeout(t));
    transcriptTimersRef.current = [];

    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) {}
      sessionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      try { inputAudioContextRef.current.close(); } catch (e) {}
      inputAudioContextRef.current = null;
    }

    for (const source of sourcesRef.current.values()) {
      try { source.stop(); } catch (e) {}
    }
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Neural <span className="text-indigo-500">Consult.</span></h2>
          <p className="text-gray-500 text-lg font-medium">Direct verbal uplink to the Strategic Advisor Engine.</p>
        </div>
        {localAuditContext && (
          <div className="flex items-center gap-4">
             <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Briefing Loaded</span>
             </div>
             <button onClick={() => { setLocalAuditContext(null); setLocalFileName(null); }} className="text-gray-600 hover:text-white transition-colors">
                <X size={20} />
             </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {!localAuditContext && !isAnalyzingLocal ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#0a0a0a] border-2 border-dashed border-white/10 rounded-[64px] p-24 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] hover:border-indigo-500/40 transition-all group relative overflow-hidden h-[500px]"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" className="hidden" />
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-600 transition-all text-gray-500 group-hover:text-white">
                <Upload size={48} />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Brief the Advisor</h3>
              <p className="text-gray-500 text-lg font-medium max-w-sm text-center italic leading-relaxed">Drop a PDF here to synchronize document context before starting the consult.</p>
            </div>
          ) : isAnalyzingLocal ? (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-24 h-[500px] flex flex-col items-center justify-center space-y-8">
               <Loader2 className="animate-spin text-indigo-500" size={64} />
               <div className="text-center">
                  <p className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Analyzing Briefing...</p>
                  <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">{localFileName}</p>
               </div>
            </div>
          ) : (
            <div className="bg-[#0f0f0f] border border-white/10 rounded-[64px] p-12 text-center relative overflow-hidden shadow-2xl min-h-[500px] flex flex-col items-center justify-center group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-40" />
              
              <div className="relative z-10 space-y-12 w-full">
                <div className="flex justify-center">
                  <div className={`relative w-48 h-48 rounded-[64px] flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-indigo-600/20 shadow-[0_0_120px_rgba(79,70,229,0.5)] border border-indigo-500/30' : 'bg-white/5 border border-white/5'}`}>
                    {isActive ? (
                      <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div 
                              key={i} 
                              className={`w-2 bg-indigo-500 rounded-full transition-all duration-300 ${isUserSpeaking ? 'animate-bounce' : 'h-8 opacity-40'}`} 
                              style={{ 
                                height: isUserSpeaking ? `${20 + Math.random() * 60}px` : '32px',
                                animationDelay: `${i * 100}ms`
                              }} 
                            />
                          ))}
                      </div>
                    ) : (
                      <BrainCircuit size={64} className="text-indigo-500 animate-pulse" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic">
                    {isActive ? 'CONSULTATION ACTIVE' : 'CONSULT READY'}
                  </h3>
                  <p className="text-gray-500 text-lg font-medium italic max-w-sm mx-auto leading-relaxed">
                    {isActive ? '"The Advisor is processing your inquiry."' : '"Briefing analyzed. Establish the link to speak with the Advisor."'}
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-6">
                  {!isActive ? (
                    <button 
                      onClick={startSession} 
                      disabled={isConnecting}
                      className="px-16 py-8 bg-white text-black font-black rounded-[40px] flex items-center gap-5 hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 text-2xl"
                    >
                      {isConnecting ? <Loader2 className="animate-spin" size={28}/> : <Zap size={28} fill="currentColor" />}
                      Establish Link
                    </button>
                  ) : (
                    <button 
                      onClick={stopSession}
                      className="px-16 py-8 bg-red-600 text-white font-black rounded-[40px] flex items-center gap-5 hover:bg-red-500 transition-all shadow-2xl active:scale-95 text-2xl"
                    >
                      <MicOff size={28} /> Terminate
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[56px] p-10 shadow-2xl space-y-10">
              <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                 <ShieldCheck size={18} className="text-indigo-500" /> Intelligence Feed
              </h4>
              <div className="space-y-6">
                 <div className="p-6 rounded-[32px] border bg-indigo-600/5 border-indigo-500/10 text-white flex items-center justify-between">
                    <div>
                       <span className="text-[9px] font-black uppercase tracking-widest mb-1 block">Context Status</span>
                       <h5 className="text-sm font-black italic uppercase text-indigo-400 truncate max-w-[120px]">{localAuditContext ? (localFileName || 'SYNCED') : 'AWAITING BRIEFING'}</h5>
                    </div>
                    <Wifi size={20} className={localAuditContext ? 'text-indigo-500' : 'text-gray-800'} />
                 </div>
                 
                 <div className="p-6 rounded-[32px] border bg-emerald-600/5 border-emerald-500/10 text-white flex items-center justify-between">
                    <div>
                       <span className="text-[9px] font-black uppercase tracking-widest mb-1 block">Audio Engine</span>
                       <h5 className="text-sm font-black italic uppercase text-emerald-400">{isActive ? 'LIVE OUTPUT' : 'STANDBY'}</h5>
                    </div>
                    <Activity size={20} className={isActive ? 'text-emerald-500' : 'text-gray-800'} />
                 </div>
              </div>
           </div>

           <div className="bg-[#050505] border border-white/5 rounded-[56px] p-10 h-72 flex flex-col shadow-inner">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Sync Transcription</span>
                <MessageSquare size={14} className="text-indigo-500 opacity-30" />
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-[10px] text-gray-500 space-y-4 pr-4 custom-scrollbar italic leading-relaxed">
                 {lastTranscript || "Advisor is awaiting your briefing or instructions..."}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 bg-indigo-500/5 border border-indigo-500/10 rounded-[48px] flex items-start gap-6 group hover:border-indigo-500/30 transition-all">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform shadow-xl"><Waves size={24} /></div>
          <div>
             <h4 className="text-xl font-black text-white uppercase italic mb-2 tracking-tight">Autonomous Briefing</h4>
             <p className="text-sm text-gray-500 font-medium italic leading-relaxed">Upload any legal briefing PDF directly here. The Advisor will instantly map its content for your verbal consultation.</p>
          </div>
        </div>
        <div className="p-10 bg-indigo-500/5 border border-indigo-500/10 rounded-[48px] flex items-start gap-6 group hover:border-indigo-500/30 transition-all">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform shadow-xl"><AudioLines size={24} /></div>
          <div>
             <h4 className="text-xl font-black text-white uppercase italic mb-2 tracking-tight">Professional British Voice</h4>
             <p className="text-sm text-gray-500 font-medium italic leading-relaxed">All responses are delivered via a high-fidelity, professional British neural voice engine. Sophisticated and natural output for all consultations.</p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
      `}</style>
    </div>
  );
};

export default NeuralConsult;
