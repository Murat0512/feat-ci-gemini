
import React, { useState } from 'react';
import { ShieldCheck, Key, ArrowRight, ExternalLink, Lock, ChevronLeft, ShieldAlert, X } from 'lucide-react';

interface LicenseGateProps {
  onActivate: (key: string) => void;
  onAdminRequest?: (password: string) => void;
  onClose?: () => void;
}

const LicenseGate: React.FC<LicenseGateProps> = ({ onActivate, onAdminRequest, onClose }) => {
  const [mode, setMode] = useState<'license' | 'admin'>('license');
  const [key, setKey] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminSubmit = () => {
    if (onAdminRequest) {
      onAdminRequest(password);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-xl w-full bg-[#0a0a0a] border border-white/10 rounded-[48px] p-12 relative shadow-2xl">
        {onClose && (
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        )}

        {mode === 'license' ? (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl shadow-indigo-500/40">
              <ShieldCheck className="text-white" size={40} />
            </div>
            
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black mb-4 tracking-tight text-white">Activate LexiScan Pro</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Enter your unique license key to unlock the professional suite.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Key size={20} />
                </div>
                <input 
                  type="text" 
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="LEXI-XXXX-XXXX-XXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-indigo-500 outline-none text-white font-mono tracking-wider text-lg placeholder:text-gray-700 transition-all"
                />
              </div>

              <button 
                onClick={() => onActivate(key)}
                className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 text-lg group active:scale-[0.98]"
              >
                Activate Software
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-6 border-t border-white/5 text-center">
                <button 
                  onClick={() => setMode('admin')}
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-colors group"
                >
                  <Lock size={14} className="group-hover:scale-110 transition-transform" />
                  Staff / Admin Access
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setMode('license')}
              className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-sm font-bold"
            >
              <ChevronLeft size={16} /> Back to activation
            </button>

            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl">
              <ShieldAlert className="text-amber-500" size={40} />
            </div>
            
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black mb-4 tracking-tight text-white">Admin Terminal</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Enter your Master Access Key to manage licensing and project exports.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminSubmit()}
                  placeholder="Master Access Key"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-amber-500 outline-none text-white font-mono tracking-wider text-lg transition-all"
                  autoFocus
                />
              </div>

              <button 
                onClick={handleAdminSubmit}
                className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 text-lg group active:scale-[0.98]"
              >
                Sign In to Terminal
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 pt-10">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1 group font-semibold"
          >
            Get Free API Key <ExternalLink size={12} className="group-hover:scale-110 transition-transform" />
          </a>
          <div className="w-1 h-1 bg-white/10 rounded-full" />
          <a 
            href="https://ai.google.dev/gemini-api/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1 group font-semibold"
          >
            Developer Docs <ExternalLink size={12} className="group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LicenseGate;
