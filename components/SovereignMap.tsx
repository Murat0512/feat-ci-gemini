
import React, { useState, useEffect, useRef } from 'react';
import { Map as MapIcon, ShieldAlert, Loader2, Zap, Terminal, ChevronRight, Activity, BrainCircuit, Globe, Target, MapPin, Navigation, Info, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { getGeoLegalIntelligence } from '../services/geminiService';
import { Language } from '../types';

interface SovereignMapProps {
  language?: Language;
}

const SovereignMap: React.FC<SovereignMapProps> = ({ language = 'English' }) => {
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInitialize = () => {
    setIsSyncing(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation infrastructure not detected.");
      setIsSyncing(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const result = await getGeoLegalIntelligence(latitude, longitude, language as Language);
          setGeoData(result);
        } catch (err) {
          setError("Neural link to geo-nodes failed.");
        } finally {
          setIsSyncing(false);
        }
      },
      (err) => {
        setError("Location link denied. Enable GPS permissions.");
        setIsSyncing(false);
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 19: Geo-Legal SIGINT</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Sovereign <span className="text-emerald-500">Map.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Ground legal risk in physical geography via real-time proximity scanning.</p>
        </div>
      </div>

      {!geoData ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent opacity-30" />
          
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className={`absolute inset-0 rounded-full border-2 border-emerald-500/20 flex items-center justify-center transition-all duration-700 ${isSyncing ? 'scale-110' : ''}`}>
               <Globe size={80} className={`text-emerald-500 ${isSyncing ? 'animate-pulse' : 'opacity-40'}`} />
            </div>
            {isSyncing && (
              <div className="absolute inset-0 border-r-4 border-emerald-500 rounded-full animate-[spin_3s_linear_infinite]" />
            )}
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Establish Location Link</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
              "Detecting local legal environment... Establish a link to analyze regional statutes, nearby courts, and jurisdictional risk factors."
            </p>
          </div>
          
          {error && (
            <div className="max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 animate-in shake duration-300">
               <AlertCircle size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
            </div>
          )}

          <button 
            onClick={handleInitialize}
            disabled={isSyncing}
            className="px-20 py-8 bg-white text-black font-black rounded-[40px] text-2xl uppercase italic shadow-2xl flex items-center gap-6 mx-auto hover:bg-emerald-600 hover:text-white transition-all active:scale-95 disabled:opacity-30"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={32}/> : <Navigation size={32} />}
            {isSyncing ? 'Syncing Coordinates...' : 'Initialize Geo-Pulse'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in slide-in-from-bottom-6 duration-1000">
           {/* Jurisdiction Sidebar */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><MapPin size={120} /></div>
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={18} className="text-emerald-500" /> Regional Posture
                 </h4>
                 
                 <div className="space-y-8">
                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 text-center shadow-inner">
                       <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest block mb-2">Detected Jurisdiction</span>
                       <div className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{geoData.jurisdiction}</div>
                    </div>

                    <div className="space-y-4">
                       <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Local Statute Sync</span>
                       <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl italic text-[11px] text-gray-400 leading-relaxed font-medium">
                          "{geoData.localStatuteSync}"
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl space-y-8">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.4em] flex items-center gap-3">
                    <ShieldAlert size={18} className="text-red-500" /> Geo-Risk Heat
                 </h4>
                 <div className="space-y-3">
                    {geoData.regionalRisks.map((risk: any, i: number) => (
                      <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-2">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-white italic truncate uppercase">{risk.name}</span>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${risk.threatLevel === 'HIGH' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>{risk.threatLevel}</span>
                         </div>
                         <p className="text-[10px] text-gray-500 italic leading-snug">{risk.summary}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Tactical Map Visualization */}
           <div className="lg:col-span-3 space-y-8">
              <div className="bg-[#050505] border border-white/10 rounded-[64px] shadow-2xl h-[500px] relative overflow-hidden group">
                 {/* CSS/SVG Tactical Map Grid */}
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                 <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 to-transparent" />
                 
                 {/* Radar Pulse */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-ping" />
                    <div className="absolute inset-[-100px] border border-emerald-500/10 rounded-full animate-[ping_4s_infinite]" />
                    <div className="absolute inset-[-200px] border border-emerald-500/5 rounded-full animate-[ping_6s_infinite]" />
                 </div>

                 {/* Simulated Map Markers for Hubs */}
                 {geoData.hubs.map((hub: any, i: number) => {
                    const randomX = 20 + (Math.random() * 60);
                    const randomY = 20 + (Math.random() * 60);
                    return (
                      <div key={i} className="absolute flex flex-col items-center gap-2 group/marker cursor-pointer" style={{ left: `${randomX}%`, top: `${randomY}%` }}>
                         <div className="w-3 h-3 bg-white rounded-full shadow-2xl group-hover/marker:scale-150 transition-transform relative">
                            <div className="absolute inset-[-6px] border border-white/40 rounded-full animate-pulse" />
                         </div>
                         <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap z-20">
                            <p className="text-[10px] font-black text-white uppercase italic">{hub.name}</p>
                            <p className="text-[8px] text-emerald-400 uppercase tracking-widest">{hub.type}</p>
                         </div>
                      </div>
                    );
                 })}

                 {/* Map Overlay Text */}
                 <div className="absolute bottom-10 left-12 flex items-center gap-3">
                    <Terminal size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">SIGINT TOPOGRAPHY ACTIVE</span>
                 </div>
              </div>

              {/* Hub Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {geoData.hubs.map((hub: any, i: number) => (
                   <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <a href={hub.mapsUri} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-black transition-all">
                            <ExternalLink size={14}/>
                         </a>
                      </div>
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-2 block">{hub.type}</span>
                      <h5 className="text-sm font-black text-white uppercase italic leading-tight mb-4">{hub.name}</h5>
                      <div className="flex items-center gap-2 text-[9px] font-medium text-gray-600 italic">
                         <MapPin size={10}/>
                         <span className="truncate">{hub.address}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SovereignMap;
