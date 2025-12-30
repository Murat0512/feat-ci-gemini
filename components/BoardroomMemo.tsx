import React, { useState, useRef } from 'react';
import { Presentation, Download, ShieldCheck, Zap, Building2, Loader2, Check, FileText, Printer } from 'lucide-react';
import { generateBoardroomMemo } from '../services/geminiService';
import { Language } from '../types';

interface BoardroomMemoProps {
  auditResult?: string;
  comparisonResult?: string;
  language?: string;
}

declare var html2pdf: any;

const BoardroomMemo: React.FC<BoardroomMemoProps> = ({ auditResult, comparisonResult, language = 'English' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [memo, setMemo] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const memoRef = useRef<HTMLDivElement>(null);

  const generateMemo = async () => {
    if (!auditResult) return;
    setIsGenerating(true);
    try {
      const result = await generateBoardroomMemo(auditResult, comparisonResult || "", language as Language);
      setMemo(result);
    } catch (err) {
      console.error("Memo synthesis failed:", err);
      alert("Neural synthesis failed. Please ensure your Audit data is still valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * REVISED EXPORT LOGIC: 
   * Specifically addresses the "Half-Page" and "Left-Clipping" issues.
   */
  const handleExportMaster = async () => {
    if (!memo || !memoRef.current) return;
    
    if (typeof html2pdf === 'undefined') {
      alert("PDF Engine is still initializing.");
      return;
    }

    setIsExporting(true);

    // Save original states
    const originalScrollY = window.scrollY;
    const element = memoRef.current;
    const originalStyle = element.getAttribute('style') || '';
    
    // Scroll to top to prevent the "blank first page" bug
    window.scrollTo(0, 0);

    // 1. FORCE THE LAYOUT INTO A "CAPTURE-READY" STATE
    // We set a fixed width and heavy padding to prevent the clipping seen in your image.
    element.style.width = '800px'; 
    element.style.maxWidth = '800px';
    element.style.padding = '60px 50px'; // Extra left padding (60px) to stop clipping
    element.style.margin = '0 auto';
    element.style.backgroundColor = '#ffffff';
    element.style.borderRadius = '0px';
    element.style.boxShadow = 'none';
    element.classList.add('exporting-active');

    const opt = {
      margin: [10, 10, 10, 10], // Small PDF border
      filename: `LexiScan_Master_Memo_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#ffffff',
        width: 800,
        windowWidth: 800,
        scrollY: 0, // CRITICAL: Prevents blank page issues
        scrollX: 0,
        x: 0,
        y: 0
      },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // Small delay to ensure the browser re-renders the element at the top of the page
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Export failed:", err);
      window.print();
    } finally {
      // Restore the original UI appearance
      element.setAttribute('style', originalStyle);
      element.classList.remove('exporting-active');
      window.scrollTo(0, originalScrollY);
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between no-print">
         <div className="reveal-on-scroll">
            <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Operational Closure</span>
            <h2 className="text-5xl font-black mb-2 tracking-tighter uppercase italic text-white">BOARDROOM <span className="text-emerald-500">MEMO.</span></h2>
            <p className="text-gray-500 text-lg font-medium italic">Synthesize all neural data into a high-impact executive victory report.</p>
         </div>
      </div>

      {!memo ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 text-center space-y-12 shadow-2xl relative overflow-hidden no-print">
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
           <div className="w-40 h-40 mx-auto rounded-[48px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-2xl">
              <Presentation size={80} />
           </div>
           <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Generate Final Report</h3>
              <p className="text-gray-500 text-lg font-medium leading-relaxed italic">LexiScan will analyze your Audit and War-Room outcomes to draft a professional 1-page memo for your Board of Directors or CEO.</p>
           </div>
           <button 
            onClick={generateMemo} 
            disabled={isGenerating || !auditResult}
            className="px-16 py-7 bg-white text-black font-black rounded-[32px] text-xl hover:bg-emerald-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-4 mx-auto disabled:opacity-30"
           >
              {isGenerating ? <Loader2 className="animate-spin" size={24}/> : <Zap size={24} fill="currentColor" />}
              {isGenerating ? 'Synthesizing...' : 'Draft Victory Memo'}
           </button>
           {!auditResult && <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest italic mt-4">Required: Complete a Tactical Audit first.</p>}
        </div>
      ) : (
        <div 
          ref={memoRef}
          className="memo-container bg-white text-black rounded-[48px] p-12 md:p-20 shadow-2xl space-y-12 relative font-serif animate-in zoom-in duration-500 overflow-visible"
          style={{ width: '100%', maxWidth: '850px', margin: '0 auto' }}
        >
           {/* Background Building Seal */}
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-black" data-html2canvas-ignore="true">
             <Building2 size={200} />
           </div>
           
           {/* Document Header */}
           <div className="flex justify-between items-start border-b-2 border-black/10 pb-8">
              <div>
                 <h1 className="text-3xl font-black italic tracking-tighter mb-1 uppercase">LEXISCAN <span className="text-indigo-600">AI</span></h1>
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Neural Risk Infrastructure v7.0</p>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold uppercase tracking-widest text-black">Date: {new Date().toLocaleDateString()}</p>
                 <p className="text-xs font-bold uppercase tracking-widest text-black">Ref: SOV-CLOSURE-99</p>
              </div>
           </div>

           {/* Memo Content Area */}
           <div className="memo-content prose prose-lg max-w-none text-black">
              {memo.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed === '') return <div key={i} className="h-4" />;
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl md:text-3xl font-black uppercase italic mb-6 tracking-tighter text-black break-after-avoid">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-black uppercase mt-10 mb-4 border-b border-black/20 pb-1 text-black break-after-avoid">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-md font-black uppercase mt-6 mb-2 text-indigo-700 break-after-avoid">{line.replace('### ', '')}</h3>;
                if (line.startsWith('- ')) return <li key={i} className="text-base font-medium mb-1 ml-4 text-black list-disc">{line.replace('- ', '')}</li>;
                return <p key={i} className="text-base leading-relaxed mb-4 text-black text-justify break-inside-avoid">{line}</p>;
              })}
           </div>

           {/* Footer / Verification Area */}
           <div className="mt-12 pt-8 border-t-2 border-black/10 flex items-center justify-between no-break">
              <div className="no-print" data-html2canvas-ignore="true">
                 <button 
                  onClick={handleExportMaster}
                  disabled={isExporting}
                  className="px-6 py-3 bg-indigo-600 text-white font-black rounded-xl flex items-center gap-3 text-xs hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
                 >
                    {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                    {isExporting ? 'Finalizing Layout...' : 'Export Master (PDF)'}
                 </button>
              </div>
              <div className="flex items-center gap-3">
                 <ShieldCheck className="text-indigo-600" size={28}/>
                 <div className="text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest block leading-tight text-black">SOVEREIGNTY</span>
                    <span className="text-[9px] font-black uppercase tracking-widest block leading-tight text-gray-400">VERIFIED BY LEXISCAN</span>
                 </div>
              </div>
           </div>
        </div>
      )}
      
      <style>{`
        @media print {
            @page {
                margin: 0; /* Let the container handle margins */
            }

            body {
                margin: 0;
                padding: 0;
                background-color: white !important;
            }

            .memo-container {
                width: 100% !important;
                margin: 0 !important;
                padding: 60px !important;
                position: static !important;
                overflow: visible !important;
                box-sizing: border-box !important;
                border-radius: 0 !important;
                box-shadow: none !important;
            }

            .no-print {
                display: none !important;
            }
        }

        .break-after-avoid { page-break-after: avoid; }
        .break-inside-avoid { page-break-inside: avoid; }
        .no-break { page-break-inside: avoid; }

        .exporting-active .memo-content p {
          font-size: 11pt !important;
          line-height: 1.5 !important;
          color: #000000 !important;
          text-align: justify;
        }
        
        .memo-content li {
          display: list-item;
          list-style-type: disc;
        }
      `}</style>
    </div>
  );
};

export default BoardroomMemo;