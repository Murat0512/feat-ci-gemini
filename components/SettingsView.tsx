
import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, User, Shield, Terminal, Cpu, Globe, RefreshCw, LogOut, Wifi, Database, Key, Activity, HeartPulse, HardDrive, Bell, Phone, Briefcase, MapPin, FileText } from 'lucide-react';

interface SettingsViewProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
  initialProfile?: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
    location: string;
    bio: string;
    notifications: boolean;
  };
  onSaveProfile?: (profile: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
    location: string;
    bio: string;
    notifications: boolean;
  }) => Promise<void> | void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onLogout, initialProfile, onSaveProfile }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'security'>('profile');
  const [profileData, setProfileData] = useState({
    fullName: initialProfile?.fullName || user?.name || '',
    email: initialProfile?.email || user?.email || '',
    phone: initialProfile?.phone || localStorage.getItem('user_phone') || '',
    company: initialProfile?.company || localStorage.getItem('user_company') || '',
    jobTitle: initialProfile?.jobTitle || localStorage.getItem('user_jobTitle') || '',
    location: initialProfile?.location || localStorage.getItem('user_location') || '',
    bio: initialProfile?.bio || localStorage.getItem('user_bio') || '',
    notifications: initialProfile?.notifications ?? true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!initialProfile) return;
    setProfileData(prev => ({ ...prev, ...initialProfile }));
  }, [initialProfile]);

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (onSaveProfile) {
        await onSaveProfile(profileData);
      } else {
        localStorage.setItem('user_phone', profileData.phone);
        localStorage.setItem('user_company', profileData.company);
        localStorage.setItem('user_jobTitle', profileData.jobTitle);
        localStorage.setItem('user_location', profileData.location);
        localStorage.setItem('user_bio', profileData.bio);
        localStorage.setItem('user_notifications', profileData.notifications ? 'true' : 'false');
      }
      // Show success feedback
      setTimeout(() => setIsSaving(false), 800);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setIsSaving(false);
    }
  };

  const systemMetrics = [
    { label: "Infrastructure Load", val: "14%", icon: Cpu },
    { label: "Neural Latency", val: "18ms", icon: Activity },
    { label: "Cloud Sync", val: "Persistent", icon: Globe },
    { label: "Archive Integrity", val: "100%", icon: HardDrive }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 18: System sovereignty</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">System <span className="text-indigo-500">Settings.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic mt-4">Manage node identity, neural parameters, and security protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'profile', label: 'Identity', icon: User },
            { id: 'system', label: 'Nodes', icon: Terminal },
            { id: 'security', label: 'Security', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] transition-all font-black text-[11px] uppercase tracking-widest ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-[#0a0a0a] border border-white/5 text-gray-500 hover:text-white'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-5 rounded-[24px] bg-red-600/5 border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all font-black text-[11px] uppercase tracking-widest mt-8"
          >
            <LogOut size={18} />
            Terminate
          </button>
        </div>

        <div className="lg:col-span-3 space-y-8">
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><SettingsIcon size={120} /></div>
              
              {activeTab === 'profile' && (
                <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                   <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-[32px] bg-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                         {profileData.fullName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">{profileData.fullName || 'Anonymous User'}</h3>
                         <p className="text-indigo-400 font-bold italic">{profileData.email || 'sovereign@node.local'}</p>
                      </div>
                   </div>

                   <div className="pt-12 border-t border-white/5 space-y-8">
                      <div>
                        <h4 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-2"><User size={20} className="text-indigo-400" /> Personal Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2">Full Name</label>
                              <input 
                                type="text" 
                                value={profileData.fullName}
                                onChange={(e) => handleProfileChange('fullName', e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2">Email Address</label>
                              <input 
                                type="email" 
                                value={profileData.email}
                                disabled
                                className="w-full bg-black border border-white/10 rounded-2xl p-5 text-gray-500 font-bold outline-none opacity-50 cursor-not-allowed" 
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2 flex items-center gap-2"><Phone size={12} /> Phone Number</label>
                              <input 
                                type="tel" 
                                value={profileData.phone}
                                onChange={(e) => handleProfileChange('phone', e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2 flex items-center gap-2"><MapPin size={12} /> Location</label>
                              <input 
                                type="text" 
                                value={profileData.location}
                                onChange={(e) => handleProfileChange('location', e.target.value)}
                                placeholder="City, Country"
                                className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2 flex items-center gap-2"><Briefcase size={12} /> Company</label>
                              <input 
                                type="text" 
                                value={profileData.company}
                                onChange={(e) => handleProfileChange('company', e.target.value)}
                                placeholder="Organization Name"
                                className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2 flex items-center gap-2"><Briefcase size={12} /> Job Title</label>
                              <input 
                                type="text" 
                                value={profileData.jobTitle}
                                onChange={(e) => handleProfileChange('jobTitle', e.target.value)}
                                placeholder="e.g., Legal Counsel"
                                className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                              />
                           </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-2"><FileText size={20} className="text-indigo-400" /> Bio & Description</h4>
                        <div className="space-y-3">
                           <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2">Professional Bio</label>
                           <textarea 
                             value={profileData.bio}
                             onChange={(e) => handleProfileChange('bio', e.target.value)}
                             placeholder="Tell us about yourself..."
                             className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24" 
                           />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-2"><Bell size={20} className="text-indigo-400" /> Preferences</h4>
                        <div className="flex items-center justify-between p-5 bg-black border border-white/10 rounded-2xl">
                           <span className="text-sm font-bold text-gray-400 italic">Email Notifications</span>
                           <button 
                             onClick={() => handleProfileChange('notifications', !profileData.notifications)}
                             className={`w-12 h-6 rounded-full relative transition-all ${profileData.notifications ? 'bg-indigo-600' : 'bg-white/10'}`}
                           >
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profileData.notifications ? 'right-1' : 'left-1'}`} />
                           </button>
                        </div>
                      </div>
                   </div>

                   <button 
                     onClick={handleSaveProfile}
                     disabled={isSaving}
                     className="px-10 py-5 bg-white text-black font-black rounded-[32px] text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                   >
                     {isSaving ? 'Saving...' : 'Save Personal Details'}
                   </button>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-4"><Cpu size={24} className="text-indigo-400" /> Infrastructure Diagnostics</h3>
                   <div className="grid grid-cols-2 gap-6">
                      {systemMetrics.map((m, i) => (
                        <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[32px] flex flex-col gap-4">
                           <div className="flex items-center gap-3">
                              <m.icon size={16} className="text-indigo-400" />
                              <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">{m.label}</span>
                           </div>
                           <div className="text-3xl font-black text-white italic">{m.val}</div>
                        </div>
                      ))}
                   </div>
                   <div className="p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[32px] flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400"><RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" /></div>
                         <div>
                            <h4 className="text-lg font-black text-white uppercase italic">Neural Sync Pulse</h4>
                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Re-calculate node weights</p>
                         </div>
                      </div>
                      <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-indigo-600 transition-all">Pulse</button>
                   </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-4"><Shield size={24} className="text-indigo-400" /> Security Protocol</h3>
                   <div className="space-y-6">
                      <div className="p-8 bg-black border border-white/5 rounded-[40px] flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Key size={24} /></div>
                            <div>
                               <h4 className="text-lg font-black text-white uppercase italic">Hardware Key Isolation</h4>
                               <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Biometric link required for decryption</p>
                            </div>
                         </div>
                         <div className="w-12 h-6 bg-white/5 border border-white/10 rounded-full relative cursor-pointer hover:bg-white/10 transition-all"><div className="absolute left-1 top-1 w-4 h-4 bg-gray-700 rounded-full" /></div>
                      </div>
                      <div className="p-8 bg-black border border-white/5 rounded-[40px] flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500"><Wifi size={24} /></div>
                            <div>
                               <h4 className="text-lg font-black text-white uppercase italic">Zero-Retention Mode</h4>
                               <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Wipe document data post-session</p>
                            </div>
                         </div>
                         <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer shadow-lg shadow-emerald-500/20"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
