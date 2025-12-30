
import React, { useState, useEffect, useRef } from 'react';
import { Key, Copy, Check, Send, Mail, Download, Package, RefreshCw, ShieldCheck, ShoppingCart, UserCheck, Terminal, Server, Globe, CheckCircle2, Loader2, X, ExternalLink, FileText, ListFilter, Zap, Sparkles, RotateCcw, AlertCircle, Ban, Truck, Users, DollarSign, ArrowRight, Plus, Hash, Layers, Rocket, Image as ImageIcon, Archive, FlaskConical, Play, Code, Volume2, ShieldAlert, Activity, GitCompare } from 'lucide-react';
import MarketingSuite from './MarketingSuite';
import { Language } from '../types';

interface Order {
  id: string;
  name: string;
  email: string;
  amount: string;
  status: 'pending' | 'fulfilled' | 'refunded';
  timestamp: string;
}

interface BrandAsset {
  id: string;
  type: 'image' | 'text' | 'audio';
  content: string;
  prompt: string;
  timestamp: string;
}

interface CreatorToolsProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onGenerateKey: (name: string) => string;
  onExport: () => void;
  isExporting: boolean;
  onOrderFulfilled: (amount: number) => void;
  onOrderRefunded: (amount: number) => void;
  price: number;
  adminStats?: { revenue: number, licenses: number };
  language: Language;
  initialContext?: string;
}

const CreatorTools: React.FC<CreatorToolsProps> = ({ 
  orders, 
  setOrders, 
  onGenerateKey, 
  onExport, 
  isExporting, 
  onOrderFulfilled, 
  onOrderRefunded, 
  price, 
  adminStats,
  language,
  initialContext
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'fulfillment' | 'brand_lab'>('fulfillment');
  const [labSubTab, setLabSubTab] = useState<'generate' | 'archive'>('generate');
  
  const [brandArchive, setBrandArchive] = useState<BrandAsset[]>(() => {
    const saved = localStorage.getItem('lexiscan_brand_archive');
    return saved ? JSON.parse(saved) : [];
  });

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  
  const [intakeName, setIntakeName] = useState('');
  const [intakeEmail, setIntakeEmail] = useState('');
  const [showIntake, setShowIntake] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const [isBusy, setIsBusy] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [orderToRefund, setOrderToRefund] = useState<Order | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<BrandAsset | null>(null);

  const formattedPrice = `£${price}.00`;
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (initialContext) {
      setActiveAdminTab('brand_lab');
      setTerminalLogs(prev => [...prev, "[HANDSHAKE] Audit context received. Syncing Brand Lab..."]);
    }
  }, [initialContext]);

  useEffect(() => {
    localStorage.setItem('lexiscan_brand_archive', JSON.stringify(brandArchive));
  }, [brandArchive]);

  useEffect(() => {
    if (terminalLogs.length === 0) {
      setTerminalLogs([
        "[SYSTEM] Nexus Command Node v5.0.1 Stable.",
        "[SECURITY] All administrative links are encrypted via AES-4096.",
        "[SYNC] Global state verified against blockchain ledger.",
        "----------------------------------------------------------"
      ]);
    }
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleAssetGenerated = (asset: Omit<BrandAsset, 'id'>) => {
    const newAsset = { ...asset, id: `ASSET-${Date.now()}` };
    setBrandArchive(prev => [newAsset, ...prev]);
    setTerminalLogs(prev => [...prev, `[ARCHIVE] New ${asset.type.toUpperCase()} committed to neural vault.`]);
  };

  const getCodeSnippet = (asset: BrandAsset) => {
    if (asset.type === 'image') {
      return `<img src="${asset.content.substring(0, 50)}..." alt="LexiScan Neural Asset" class="nexus-asset rounded-3xl" />`;
    } else if (asset.type === 'text') {
      return `<p class="lexiscan-copy text-gray-300">${asset.content}</p>`;
    }
    return `<!-- Nexus Audio: Play via Neural Engine JS v5.0 -->`;
  };

  const playAudio = async (base64: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    await ctx.resume();

    const binaryString = atob(base64);
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

  const addNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeName || !intakeEmail) return;

    const newId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: newId,
      name: intakeName,
      email: intakeEmail,
      amount: formattedPrice,
      status: 'pending',
      timestamp: 'JUST NOW'
    };

    setOrders(prev => [newOrder, ...prev]);
    setTerminalLogs(prev => [...prev, `[INBOUND] Order verified: ${newId} (${intakeName})`]);
    setJustAdded(intakeName);
    setIntakeName('');
    setIntakeEmail('');
    setTimeout(() => setJustAdded(null), 2500);
  };

  const handleGenerate = (name?: string, email?: string) => {
    const targetName = name || customerName;
    if (!targetName) return;
    const key = onGenerateKey(targetName);
    setGeneratedKey(key);
    if (email) setCustomerEmail(email);
    setCopied(false);
    setDispatchSuccess(false);
  };

  const selectOrderForProcessing = (order: Order) => {
    setActiveOrderId(order.id);
    setCustomerName(order.name);
    setCustomerEmail(order.email);
    handleGenerate(order.name, order.email);
    setTerminalLogs(prev => [...prev, `[SYSTEM] Processing order context: ${order.id}`, `[SYSTEM] Constructing neural key for identity: ${order.name}...`]);
  };

  const processRefund = async () => {
    if (!orderToRefund) return;
    const orderId = orderToRefund.id;
    setOrderToRefund(null);
    setIsBusy(true);
    setTerminalLogs(prev => [...prev, `[INIT] Financial rollback: ${orderId}`]);
    await new Promise(resolve => setTimeout(resolve, 800));
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'refunded' as const } : o));
    onOrderRefunded(price);
    setIsBusy(false);
    setTerminalLogs(prev => [...prev, `[SUCCESS] ${orderId} state: REFUNDED`]);
  };

  const simulateDispatch = async () => {
    if (!customerEmail || !generatedKey || !activeOrderId) return;
    setIsBusy(true);
    setTerminalLogs(prev => [...prev, "--- BEGIN NEURAL TRANSMISSION ---", "Encrypting link..."]);
    setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, status: 'fulfilled' as const } : o));
    onOrderFulfilled(price);

    const logs = ["Searching SMTP relays...", `Target active: ${customerEmail}`, "Payload locking...", "Handshake success: 100%"];
    for (const log of logs) {
      setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const subject = encodeURIComponent(`LexiScan AI - Enterprise Nexus Key`);
    const body = encodeURIComponent(`Hello ${customerName},\n\nYour purchase is confirmed. Your unique neural activation key for LexiScan AI v6.0 Nexus Edition is now active.\n\nLICENSE KEY: ${generatedKey}\n\nEstablish your link at the activation gate.\n\nBest regards,\nLexiScan Admin`);
    window.location.href = `mailto:${customerEmail}?subject=${subject}&body=${body}`;

    setIsBusy(false);
    setDispatchSuccess(true);
    setTimeout(() => { setCustomerName(''); setCustomerEmail(''); setGeneratedKey(''); setActiveOrderId(null); }, 1000);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 pb-32 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div className="reveal-on-scroll">
          <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Neural Module 00: Admin</span>
          <h2 className="text-6xl font-black mb-2 tracking-tighter uppercase italic text-white">NEXUS <span className="text-indigo-500">TERMINAL.</span></h2>
          <p className="text-gray-500 text-lg font-medium">Elevated command interface for infrastructure management.</p>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-[32px] p-2 backdrop-blur-3xl shadow-2xl">
           <button onClick={() => setActiveAdminTab('fulfillment')} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeAdminTab === 'fulfillment' ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-gray-500 hover:text-white'}`}>Fulfillment</button>
           <button onClick={() => setActiveAdminTab('brand_lab')} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeAdminTab === 'brand_lab' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-500 hover:text-white'}`}>Nexus Lab</button>
        </div>
      </div>

      {activeAdminTab === 'fulfillment' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-in slide-in-from-left-6 duration-700">
          <div className="xl:col-span-2 space-y-10">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[56px] p-12 shadow-2xl relative overflow-hidden min-h-[600px]">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3"><ListFilter size={18}/> Order Pipeline</h3>
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowIntake(!showIntake)} className={`p-3 rounded-2xl border transition-all ${showIntake ? 'bg-indigo-500 border-indigo-400 text-white shadow-xl shadow-indigo-500/30' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}><Plus size={20} /></button>
                  <div className="text-[10px] text-indigo-400 font-black px-5 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 uppercase tracking-[0.2em]">{orders.filter(o => o.status === 'pending').length} Active Tasks</div>
                </div>
              </div>

              {showIntake && (
                <form onSubmit={addNewOrder} className="mb-12 p-10 bg-indigo-500/5 border border-indigo-500/20 rounded-[40px] animate-in slide-in-from-top-4 duration-500 relative shadow-inner">
                  {justAdded && <div className="absolute inset-0 bg-indigo-600/98 flex items-center justify-center z-20 animate-in fade-in zoom-in duration-300 rounded-[40px]"><div className="text-center"><CheckCircle2 size={48} className="mx-auto text-white mb-4" /><p className="text-white font-black uppercase text-xl tracking-tighter italic">Inbound Verified: {justAdded}</p></div></div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Identity Name</label>
                      <input type="text" required value={intakeName} onChange={(e) => setIntakeName(e.target.value)} placeholder="e.g. Atlas Corp" className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Relay Point</label>
                      <input type="email" required value={intakeEmail} onChange={(e) => setIntakeEmail(e.target.value)} placeholder="e.g. systems@atlas.io" className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-6"><button type="button" onClick={() => setShowIntake(false)} className="px-10 py-4 text-[11px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors">Abort</button><button type="submit" className="px-12 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-500 transition-all">Inject Signal</button></div>
                </form>
              )}

              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="py-32 text-center opacity-10 flex flex-col items-center"><ShoppingCart size={100} className="mb-8" /><p className="text-xl font-black uppercase tracking-widest italic">Pipeline Clear</p></div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className={`p-8 rounded-[40px] border transition-all flex items-center justify-between group ${order.id === activeOrderId && order.status === 'pending' ? 'bg-indigo-500/10 border-indigo-500/50 shadow-2xl' : order.status === 'refunded' ? 'bg-red-500/5 border-red-500/10 opacity-50' : order.status === 'fulfilled' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/[0.03] border-white/10 hover:border-white/20'}`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all ${order.status === 'fulfilled' ? 'bg-emerald-500/20 text-emerald-400' : order.status === 'refunded' ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white'}`}>
                          {order.status === 'fulfilled' ? <CheckCircle2 size={28} /> : order.status === 'refunded' ? <Ban size={28} /> : <ShoppingCart size={28} />}
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-white italic">{order.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">{order.id}</span>
                             <div className="w-1 h-1 bg-white/10 rounded-full" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500/60">{order.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-right flex flex-col items-end">
                           <span className="text-[9px] font-black text-gray-700 uppercase mb-1">Fee Captured</span>
                           <p className="text-xl font-black text-white">{order.amount}</p>
                        </div>
                        {order.status === 'pending' ? (
                          <button disabled={activeOrderId !== null && activeOrderId !== order.id} onClick={() => selectOrderForProcessing(order)} className={`px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl ${order.id === activeOrderId ? 'bg-indigo-600 text-white' : 'bg-white text-black hover:bg-indigo-600 hover:text-white'} disabled:opacity-30`}>{order.id === activeOrderId ? 'Processing...' : 'Secure'}</button>
                        ) : (
                          <div className="px-6 py-3 bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5">{order.status}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-white/10 rounded-[56px] p-12 flex items-center justify-between shadow-2xl group hover:border-indigo-500/30 transition-all">
              <div className="max-w-md"><h3 className="text-3xl font-black mb-3 text-white uppercase tracking-tighter italic">Enterprise Sync</h3><p className="text-gray-500 text-base font-medium italic leading-relaxed">Prepare source-bundle for professional local deployment.</p></div>
              <button onClick={onExport} disabled={isExporting} className="px-12 py-7 bg-white text-black font-black rounded-[32px] flex items-center gap-5 text-xl hover:bg-indigo-600 hover:text-white transition-all shadow-2xl">{isExporting ? <Loader2 className="animate-spin" size={24}/> : <Download size={24} />} Master Code</button>
            </div>
          </div>

          <div className="space-y-10">
            <div className={`bg-[#0a0a0a] border rounded-[56px] p-12 space-y-10 shadow-2xl relative overflow-hidden transition-all duration-700 ${activeOrderId ? 'border-indigo-500/40 bg-indigo-500/[0.05] shadow-indigo-500/20' : 'border-white/10'}`}>
              {dispatchSuccess && <div className="absolute inset-0 z-50 bg-[#050505]/98 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500"><div className="w-24 h-24 bg-emerald-500/20 rounded-[32px] flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20"><CheckCircle2 size={48} /></div><h3 className="text-3xl font-black text-white italic">RELAY SUCCESS</h3><button onClick={() => setDispatchSuccess(false)} className="mt-10 px-12 py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-indigo-600 hover:text-white transition-all">Sever Console</button></div>}
              <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] flex items-center gap-3"><Mail className="text-indigo-400" size={16} /> License Handshake</h3>
              <div className="space-y-5">
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Target Identity" className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-black italic text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" />
                <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Relay point (client@node.io)" className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-black italic text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" />
              </div>
              <button onClick={() => handleGenerate()} className="w-full py-5 bg-white/[0.03] border border-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all uppercase tracking-[0.3em] text-[10px]"><RefreshCw size={14} /> Re-Calculate Sequence</button>
              
              {generatedKey && (
                <div className="p-10 bg-indigo-500/5 border border-indigo-500/20 rounded-[40px] space-y-8 animate-in fade-in duration-500">
                  <div className="bg-black/80 border border-white/10 rounded-2xl p-8 font-mono text-indigo-400 font-black tracking-[0.3em] text-center text-xl relative group shadow-inner">
                    <span className="relative z-10">{generatedKey}</span>
                    <button onClick={copyKey} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-all">{copied ? <Check size={20} /> : <Copy size={20} />}</button>
                  </div>
                  <button onClick={simulateDispatch} disabled={isBusy || !customerEmail} className="w-full py-7 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-4 hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 text-lg">
                    {isBusy ? <Loader2 className="animate-spin" size={24}/> : <Send size={24} />}
                    Relay Access
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-black border border-white/10 rounded-[56px] p-10 shadow-2xl h-[400px] flex flex-col overflow-hidden relative group">
               <div className="absolute top-8 left-10 flex items-center gap-3">
                  <Terminal size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">Root Log Feed</span>
               </div>
               <div className="mt-12 flex-1 overflow-y-auto font-mono text-[10px] space-y-3 pr-4 scrollbar-none custom-scrollbar">
                 {terminalLogs.map((log, i) => (
                   <div key={i} className={`flex items-start gap-4 transition-opacity duration-300 ${i === terminalLogs.length - 1 ? 'text-indigo-400' : 'text-indigo-900'}`}>
                     <span className="text-indigo-800 font-black opacity-30">></span>
                     <span className="leading-relaxed italic">{log}</span>
                   </div>
                 ))}
                 <div ref={terminalEndRef} />
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-6 duration-700">
           <div className="mb-12 p-12 bg-indigo-600/10 border border-indigo-500/20 rounded-[64px] flex items-center justify-between shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><ShieldCheck size={160} /></div>
             <div className="flex items-center gap-10">
                <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 animate-pulse"><Sparkles size={40}/></div>
                <div>
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">NEXUS <span className="text-indigo-500">LAB.</span></h3>
                   <div className="flex items-center gap-4 mt-4">
                      <button onClick={() => setLabSubTab('generate')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${labSubTab === 'generate' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'bg-white/5 text-gray-600 hover:text-white'}`}>Synthesis</button>
                      <button onClick={() => setLabSubTab('archive')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${labSubTab === 'archive' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'bg-white/5 text-gray-600 hover:text-white'}`}>Neural Archive ({brandArchive.length})</button>
                   </div>
                </div>
             </div>
             <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-1">Status</span>
                <span className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 italic">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-indigo-500/50 animate-pulse" /> Active Node
                </span>
             </div>
           </div>

           {labSubTab === 'generate' ? (
             <MarketingSuite language={language} onAssetGenerated={handleAssetGenerated} initialContext={initialContext} />
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in duration-1000">
                {brandArchive.length === 0 ? (
                  <div className="col-span-full py-48 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[64px] flex flex-col items-center justify-center opacity-20 text-center">
                    <Archive size={100} className="mb-8" />
                    <h4 className="text-3xl font-black uppercase tracking-[0.2em] italic">Archive Clear</h4>
                    <p className="text-sm font-medium mt-2">No synthetic assets committed to neural storage yet.</p>
                  </div>
                ) : (
                  brandArchive.map((asset) => (
                    <div key={asset.id} className="bg-[#0a0a0a] border border-white/5 rounded-[48px] overflow-hidden group hover:border-indigo-500/40 transition-all flex flex-col shadow-2xl hover:shadow-indigo-500/10">
                      <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/40">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                              {asset.type === 'image' && <ImageIcon size={18}/>}
                              {asset.type === 'text' && <FileText size={18}/>}
                              {asset.type === 'audio' && <Volume2 size={18}/>}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">{asset.timestamp}</span>
                         </div>
                         <button onClick={() => setBrandArchive(prev => prev.filter(a => a.id !== asset.id))} className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><X size={20}/></button>
                      </div>
                      
                      <div className="flex-1 p-8">
                         {asset.type === 'image' && (
                           <img src={asset.content} className="w-full h-56 object-cover rounded-[32px] mb-6 grayscale-[0.2] group-hover:grayscale-0 transition-all shadow-xl" alt="Neural projection" />
                         )}
                         {asset.type === 'audio' && (
                           <div className="h-56 bg-indigo-500/[0.03] rounded-[32px] flex items-center justify-center mb-6 border border-indigo-500/10 shadow-inner group-hover:bg-indigo-500/5 transition-all">
                              <button onClick={() => playAudio(asset.content)} className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"><Play fill="currentColor" size={32}/></button>
                           </div>
                         )}
                         {asset.type === 'text' && (
                           <div className="h-56 bg-black/60 p-8 rounded-[32px] mb-6 overflow-y-auto border border-white/5 shadow-inner">
                              <p className="text-sm font-black text-gray-400 leading-relaxed italic">{asset.content}</p>
                           </div>
                         )}
                         <h5 className="text-xs font-black text-white mb-2 uppercase tracking-tighter truncate italic">{asset.prompt}</h5>
                         <p className="text-[9px] text-gray-700 uppercase font-black tracking-[0.4em]">UUID: {asset.id}</p>
                      </div>

                      <div className="p-8 pt-0 grid grid-cols-2 gap-4">
                         <button onClick={() => { const l = document.createElement('a'); l.href = asset.content; l.download = `nexus-${asset.type}-${asset.id}.png`; l.click(); }} className="py-4 bg-white/5 hover:bg-white text-black hover:text-black transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl">
                            <Download size={14}/> Fetch
                         </button>
                         <button onClick={() => setSelectedSnippet(asset)} className="py-4 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all border border-indigo-500/20">
                            <Code size={14}/> Deploy
                         </button>
                      </div>
                    </div>
                  ))
                )}
             </div>
           )}
        </div>
      )}

      {selectedSnippet && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-8 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="max-w-2xl w-full bg-[#0a0a0a] border border-indigo-500/30 rounded-[64px] p-16 relative shadow-2xl shadow-indigo-500/20">
              <button onClick={() => setSelectedSnippet(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors"><X size={40}/></button>
              <div className="flex items-center gap-8 mb-12">
                 <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-400 shadow-2xl border border-indigo-500/20"><Code size={40}/></div>
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">DEPLOYMENT <br /><span className="text-indigo-500">SNIPPET.</span></h3>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mt-3">Infrastructure-Ready Code</p>
                 </div>
              </div>
              
              <div className="space-y-10">
                 <div className="bg-black border border-white/10 rounded-[32px] p-10 font-mono text-sm text-indigo-400 leading-relaxed break-all relative group shadow-inner">
                    <code className="italic">{getCodeSnippet(selectedSnippet)}</code>
                    <button onClick={() => { navigator.clipboard.writeText(getCodeSnippet(selectedSnippet)); alert("Snippet synchronized to clipboard."); }} className="absolute top-6 right-6 p-4 bg-indigo-500/20 text-indigo-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white shadow-xl"><Copy size={20}/></button>
                 </div>
                 <p className="text-xs text-gray-500 font-medium italic leading-relaxed">Push this neural asset directly to your front-end repository. Base64 encoding provides immediate latency reduction and offline availability.</p>
                 <button onClick={() => setSelectedSnippet(null)} className="w-full py-7 bg-white text-black font-black rounded-3xl uppercase tracking-[0.4em] text-[12px] shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95">Deactivate Terminal</button>
              </div>
           </div>
        </div>
      )}

      {orderToRefund && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="max-w-md w-full bg-[#0a0a0a] border border-red-500/20 rounded-[64px] p-16 text-center shadow-2xl">
            <div className="w-24 h-24 bg-red-500/10 rounded-[32px] flex items-center justify-center mb-10 mx-auto text-red-500 shadow-xl shadow-red-500/5"><AlertCircle size={48} /></div>
            <h2 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter italic">REVERSE FLOW?</h2>
            <p className="text-gray-500 text-lg mb-12 font-medium italic">"Severing license access for <span className="text-white font-bold">{orderToRefund.name}</span> will permanently wipe associated neural signatures."</p>
            <div className="space-y-4">
              <button onClick={processRefund} className="w-full py-6 bg-red-600 text-white font-black rounded-3xl shadow-xl hover:bg-red-500 transition-all active:scale-95 text-xl uppercase tracking-widest">Confirm Rollback</button>
              <button onClick={() => setOrderToRefund(null)} className="w-full py-6 bg-white/5 text-white font-black rounded-3xl hover:bg-white/10 transition-all text-xl uppercase tracking-widest">Abort Termination</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorTools;
