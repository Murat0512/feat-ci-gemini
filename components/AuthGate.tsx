
import React, { useState, useEffect } from 'react';
import { supabase, isCloudConfigured } from '../services/supabaseClient';
import { ShieldCheck, Mail, Lock, ArrowRight, Fingerprint, UserPlus, LogIn, Loader2, Zap, Activity, Shield, Eye, EyeOff, RefreshCw, AlertCircle, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';

interface AuthGateProps {
  onAuthSuccess: (user: { email: string; name: string; id?: string }) => void;
  cloudAllowed?: boolean;
}

const AuthGate: React.FC<AuthGateProps> = ({ onAuthSuccess, cloudAllowed = true }) => {
  const [mode, setMode] = useState<'login' | 'register'>('register'); // Default to register for new users
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const cloudActive = cloudAllowed && isCloudConfigured();

  useEffect(() => {
    const checkConnection = async () => {
      if (!cloudActive || !supabase) {
        setIsOnline(false);
        return;
      }
      const { error } = await supabase.from('projects').select('count', { count: 'exact', head: true }).limit(1);
      if (error && error.code === 'PGRST301') setIsOnline(true);
      else if (error) setIsOnline(false);
      else setIsOnline(true);
    };
    checkConnection();
  }, [cloudActive]);

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setErrorMessage('');
  };

  const handleSovereignBypass = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onAuthSuccess({ 
        email: email || 'sovereign@node.local', 
        name: name || email.split('@')[0] || 'Sovereign User', 
        id: `LOCAL-${Date.now()}` 
      });
      setIsProcessing(false);
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');
    
    if (!cloudActive || !supabase) {
      handleSovereignBypass();
      return;
    }

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { name: name },
            emailRedirectTo: window.location.origin
          }
        });
        
        if (error) throw error;

        // Supabase always requires email confirmation unless disabled in settings
        if (data.user) {
          if (data.session) {
            // Auto-confirmed (only if email confirmation is disabled in Supabase settings)
            onAuthSuccess({ email: data.user.email!, name: name, id: data.user.id });
          } else {
            // Email confirmation required (default behavior)
            setIsProcessing(false);
            setErrorMessage("✅ REGISTRATION SUCCESSFUL! Check your email to confirm your account and activate your neural identity.");
            setEmail('');
            setPassword('');
            setName('');
            // Auto-switch to login mode after 3 seconds
            setTimeout(() => {
              setMode('login');
              setErrorMessage('');
            }, 4000);
            return;
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          onAuthSuccess({ 
            email: data.user.email!, 
            name: data.user.user_metadata.name || data.user.email!.split('@')[0],
            id: data.user.id
          });
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message.toUpperCase());
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020202] z-[1000] flex items-center justify-center p-6 overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full animate-pulse-soft transition-colors duration-1000 ${mode === 'login' ? 'bg-indigo-600/10' : 'bg-emerald-600/10'}`} />
      </div>

      <div className={`max-w-xl w-full bg-[#0a0a0a] border rounded-[64px] p-8 md:p-12 relative shadow-2xl animate-in zoom-in-95 duration-700 transition-all my-auto ${mode === 'login' ? 'border-white/10' : 'border-emerald-500/20 shadow-emerald-500/5'}`}>
        
        <div className="absolute top-10 inset-x-0 flex justify-center pointer-events-none">
           <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-500 ${isOnline ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500/40' : 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'}`}>
              {isOnline ? <Wifi size={10}/> : <WifiOff size={10}/>}
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">{isOnline ? 'Cloud Link Ready' : 'Local Only Mode'}</span>
           </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 shadow-2xl relative group overflow-hidden transition-colors ${mode === 'login' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Fingerprint className="text-white relative z-10" size={40} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-3 text-center">
            {mode === 'login' ? 'Access Vault' : 'Commit Identity'}
          </h2>
          <p className="text-gray-500 text-center text-base font-medium italic max-w-sm">
            {mode === 'login' 
              ? 'Synchronize your tactical intelligence.' 
              : 'Register to record your audits and sync across devices.'}
          </p>
        </div>

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-10">
             <div className="relative">
                <Loader2 size={80} className={`${mode === 'login' ? 'text-indigo-600' : 'text-emerald-600'} animate-spin`} />
                <Fingerprint className={`absolute inset-0 m-auto opacity-20 ${mode === 'login' ? 'text-indigo-400' : 'text-emerald-400'}`} size={32} />
             </div>
             <p className={`text-sm font-black uppercase tracking-[0.4em] animate-pulse text-center ${mode === 'login' ? 'text-indigo-400' : 'text-emerald-400'}`}>
               Calibrating Identity...
             </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className={`p-5 rounded-3xl border ${errorMessage.includes('✅') ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 'border-red-500/20 bg-red-500/10 text-red-500'} text-[10px] font-black text-center italic uppercase tracking-widest flex items-center justify-center gap-2 animate-in ${errorMessage.includes('✅') ? 'slide-in-from-top-4' : 'shake'} duration-300`}>
                {errorMessage.includes('✅') ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {errorMessage}
              </div>
            )}
            
            {mode === 'register' && (
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors"><UserPlus size={20} /></div>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Legal Entity Name / Username" 
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-6 outline-none text-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold placeholder:text-gray-700" 
                />
              </div>
            )}
            
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors"><Mail size={20} /></div>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email Address" 
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-6 outline-none text-white focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder:text-gray-700" 
              />
            </div>

            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors"><Lock size={20} /></div>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-14 outline-none text-white focus:ring-2 focus:ring-indigo-500 transition-all font-bold" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              type="submit" 
              className={`w-full py-7 font-black rounded-[32px] transition-all flex items-center justify-center gap-4 text-xl shadow-2xl active:scale-95 group uppercase italic tracking-tighter ${mode === 'login' ? 'bg-white text-black hover:bg-indigo-600 hover:text-white' : 'bg-emerald-500 text-black hover:bg-emerald-400'}`}
            >
              {mode === 'login' ? <LogIn size={24} /> : <Zap size={24} fill="currentColor" />}
              {mode === 'login' ? 'Initialize Access' : 'Establish Signature'}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={toggleMode} 
            className={`font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 mx-auto ${mode === 'login' ? 'text-emerald-500 hover:text-emerald-400' : 'text-indigo-400 hover:text-white'}`}
          >
            <RefreshCw size={14} className={mode === 'register' ? 'rotate-180' : ''} />
            {mode === 'login' ? 'No Signature? Register Node' : 'Existing Member? Access Vault'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
