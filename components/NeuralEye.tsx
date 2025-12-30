import React, { useState, useRef, useEffect } from 'react';
import { Camera, ShieldAlert, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, Maximize, X, CameraOff, RefreshCw, FileText, CheckCircle2, ScanLine } from 'lucide-react';
import { analyzePhysicalDocument } from '../services/geminiService';
import { Language } from '../types';

interface NeuralEyeProps {
  language?: Language;
  onAuditExtracted?: (result: string) => void;
}

const NeuralEye: React.FC<NeuralEyeProps> = ({ language = 'English', onAuditExtracted }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError("Optical Access Denied. Verify camera permissions.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
    setCapturedImage(`data:image/jpeg;base64,${base64}`);
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzePhysicalDocument(base64, language as Language);
      setAnalysisResult(result);
      if (onAuditExtracted) onAuditExtracted(result);
    } catch (err) {
      setError("Neural Transmission Interrupted.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    startCamera();
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 22: Hardware Scrutiny</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Neural <span className="text-cyan-400">Eye.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Bridge physical documents into digital scrutiny via real-time optical audit.</p>
        </div>
        {(capturedImage || analysisResult) && (
          <button onClick={resetScanner} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all flex items-center gap-2">
            <RefreshCw size={14} /> Re-Initialize Lens
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-4 relative overflow-hidden shadow-2xl aspect-[4/3] group">
            {error ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                <CameraOff size={64} className="text-red-500" />
                <p className="text-xl font-black text-white uppercase italic">{error}</p>
                <button onClick={startCamera} className="px-8 py-3 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest">Retry Link</button>
              </div>
            ) : capturedImage ? (
              <img src={capturedImage} className="w-full h-full object-cover rounded-[48px] grayscale contrast-125" alt="Captured document" />
            ) : (
              <div className="relative h-full w-full overflow-hidden rounded-[48px]">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-cyan-400/40 rounded-tl-xl" />
                  <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-cyan-400/40 rounded-tr-xl" />
                  <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-cyan-400/40 rounded-bl-xl" />
                  <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-cyan-400/40 rounded-br-xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-80 border-2 border-dashed border-white/10 rounded-3xl" />
                  </div>
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest italic">Optical Link Stable: 1080p</span>
                  </div>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-8">
                  <div className="relative">
                     <Loader2 className="animate-spin text-cyan-400" size={80}/>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <ScanLine className="text-cyan-400/50 animate-pulse" size={32} />
                     </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white uppercase italic tracking-tighter">Deciphering Text Lattice...</p>
                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.5em] animate-pulse">OCR Scrutiny Active</p>
                  </div>
                  <div className="absolute inset-x-0 h-1 bg-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-[scan_2s_linear_infinite]" />
              </div>
            )}
          </div>

          {!capturedImage && !error && (
            <button 
              onClick={captureFrame} 
              className="w-full py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-6"
            >
              <Camera size={32} /> Execute Optical Audit
            </button>
          )}
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl flex-1 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-5"><BrainCircuit size={120} className="text-cyan-400" /></div>
            <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
               <Terminal size={20} className="text-cyan-400" />
               <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Scrutiny Stream</h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 font-mono text-[11px] leading-relaxed italic text-gray-500">
              {analysisResult ? (
                <div className="space-y-6 prose prose-invert max-w-none">
                   {analysisResult.split('\n').map((line, i) => {
                     if (line.startsWith('# ')) return <h4 key={i} className="text-lg font-black text-white uppercase italic tracking-tight border-b border-white/5 pb-2 mb-4">{line.replace('# ', '')}</h4>;
                     if (line.startsWith('## ')) return <h5 key={i} className="text-cyan-400 font-black uppercase tracking-widest mt-6">{line.replace('## ', '')}</h5>;
                     return <p key={i} className="mb-2">{line}</p>;
                   })}
                </div>
              ) : isAnalyzing ? (
                <div className="space-y-4">
                   <p className="animate-pulse">{`>> Detecting Clause Boundaries...`}</p>
                   <p className="animate-pulse delay-75">{`>> Extracting Entity Signatures...`}</p>
                   <p className="animate-pulse delay-150">{`>> Cross-referencing Precedents...`}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                   <Maximize size={64} className="mb-6" />
                   <p className="text-sm font-black uppercase tracking-widest">Awaiting Capture</p>
                </div>
              )}
            </div>

            {analysisResult && (
              <div className="mt-10 pt-8 border-t border-white/5">
                 <button className="w-full py-4 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all">
                    <CheckCircle2 size={14}/> Push to Boardroom Memo
                 </button>
              </div>
            )}
          </div>

          <div className="bg-[#050505] border border-white/5 rounded-[48px] p-8 space-y-6">
             <div className="flex items-center gap-3 text-cyan-400/40">
                <Activity size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Lens Specs</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <span className="text-[8px] font-black text-gray-700 uppercase block mb-1">OCR Model</span>
                   <p className="text-[10px] font-bold text-gray-500 italic">Gemini 2.5 Flash</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <span className="text-[8px] font-black text-gray-700 uppercase block mb-1">Shutter Latency</span>
                   <p className="text-[10px] font-bold text-gray-500 italic">~420ms Link</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.2); border-radius: 10px; }
        
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NeuralEye;