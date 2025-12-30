import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Activity, Radio, Loader2, ExternalLink, Globe } from 'lucide-react';

const DashboardPulse: React.FC<{ jurisdiction: string; recentAudits?: any[] }> = ({ jurisdiction, recentAudits = [] }) => {
  const [signals, setSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Provide two regulatory news updates for ${jurisdiction} regarding AI in 2025.`,
          config: { tools: [{ googleSearch: {} }] }
        });

        // Correct path to search grounding results
        const metadata = response.candidates?.[0]?.groundingMetadata;
        const chunks = metadata?.groundingChunks || [];

        const externalSignals = chunks.map((chunk: any) => ({
          title: chunk.web?.title || "Regulatory Signal Detected",
          uri: chunk.web?.uri || "#",
          type: 'external'
        }));

        setSignals(externalSignals);
      } catch (err) {
        console.error("Signal fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSignals();
  }, [jurisdiction]);

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl h-full flex flex-col">
       {/* UI code remains the same */}
    </div>
  );
};

export default DashboardPulse;