import React from 'react';
import { ShieldAlert, ScrollText, CheckCircle2, X, Shield, Gavel, EyeOff } from 'lucide-react';

interface TermsModalProps {
  onAccept: () => void;
  onDecline?: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 relative shadow-2xl overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-80 h-80 bg-indigo-500/10 blur-[120px]" />
          <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-emerald-500/10 blur-[140px]" />
        </div>

        <div className="relative z-10 flex items-start gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <ShieldAlert className="text-indigo-300" size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-indigo-300 font-black mb-2">Risk Notice</p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">Please review the Terms of Service & Privacy Policy</h2>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              LexiScan Pro provides informational outputs powered by AI and does not provide legal advice. You remain responsible for how you use the outputs. By continuing, you agree to the terms below.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="p-5 rounded-3xl border border-white/10 bg-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest"><ScrollText size={16} /> Terms (Essentials)</div>
            <ul className="text-gray-300 text-sm space-y-2 list-disc list-inside">
              <li>Service is provided “as is” with no warranties; no attorney–client relationship.</li>
              <li>Outputs may be inaccurate; you must independently review and verify.</li>
              <li>Limit liability to direct damages only; no consequential damages.</li>
              <li>Prohibit unlawful use; upload data only if you have rights to share it.</li>
              <li>Users indemnify provider for claims from their content or misuse.</li>
            </ul>
          </div>
          <div className="p-5 rounded-3xl border border-white/10 bg-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest"><Shield size={16} /> Privacy (Highlights)</div>
            <ul className="text-gray-300 text-sm space-y-2 list-disc list-inside">
              <li>Data may sync to cloud when enabled; Privacy Mode keeps data local-only.</li>
              <li>AI features send provided content to the Gemini API to generate output.</li>
              <li>No selling of personal data; sharing only with service providers (e.g., Supabase, Gemini).</li>
              <li>Request deletion of cloud-stored data; clear local data via your browser/device.</li>
              <li>Do not submit sensitive or third-party data without authorization.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-8 relative z-10">
          <button onClick={onAccept} className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 transition-colors">
            <CheckCircle2 size={16} /> I Agree
          </button>
          <button onClick={onDecline} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-200 font-black uppercase tracking-widest flex items-center gap-2 hover:border-red-400 hover:text-red-300 transition-colors">
            <X size={16} /> Decline
          </button>
          <div className="flex items-center gap-3 text-gray-500 text-xs uppercase tracking-[0.25em]">
            <Gavel size={14} /> Not legal advice
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <EyeOff size={14} /> Keep sensitive data local
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
