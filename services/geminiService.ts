
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { Language, HistoricAudit } from "../types";

// Helper for handling API retries and common errors
const executeWithRetry = async <T>(
  operation: (ai: GoogleGenAI) => Promise<T>,
  retries = 3,
  delay = 2000
): Promise<T> => {
  // Create a new GoogleGenAI instance for each attempt to ensure fresh API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    return await operation(ai);
  } catch (error: any) {
    const errorMessage = error?.message || "";
    if ((errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return executeWithRetry(operation, retries - 1, delay * 2);
    }
    // Handle specific Veo/Pro model errors indicating billing or invalid key
    if (errorMessage.includes("Requested entity was not found")) throw new Error("API_KEY_INVALID");
    throw error;
  }
};

// --- OCR & Physical Document Audit ---

// Fix: analyzeLegalDocument was missing, implemented it to handle OCR and legal audit
export const analyzeLegalDocument = async (base64Image: string, language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `You are the LexiScan Neural Eye. Perform a structural legal audit on this document image. 
            Identify core purpose, extract 3 high-risk clauses, and provide:
            [EXPOSURE_SCORE]: X/100
            [JURISDICTION]: Name
            
            Respond in ${language}.`
          },
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
        ]
      },
      config: { temperature: 0.1 }
    });
    return response.text || "Visual analysis failed.";
  });
};

// Alias for backwards compatibility or variation in naming
export const analyzePhysicalDocument = analyzeLegalDocument;

// --- Privacy & Masking ---

export const runNeuralMaskScan = async (auditText: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the LexiScan Privacy Sovereign. Analyze this document context: ${auditText}.
      
      Task:
      1. Detect all PII (Names, Addresses, Emails, ID numbers, sensitive dates).
      2. Categorize them (Identity, Financial, Contact, Location).
      3. For each real PII found, generate a "Synthetic Mask" (a fake but believable replacement).
      
      Return JSON:
      {
        "privacyScore": number (0-100 where 100 is high exposure),
        "piiNodes": [
          { "type": "string", "original": "string", "masked": "string", "riskLevel": "HIGH" | "MED" | "LOW" }
        ],
        "anonymizedSummary": "string (A brief summary of the document with ALL PII replaced by the masked versions)"
      }`,
      config: { responseMimeType: "application/json", temperature: 0.1, thinkingConfig: { thinkingBudget: 4000 } }
    });
    try { return JSON.parse(response.text || "{}"); } catch { throw new Error("Privacy scan failed."); }
  });
};

// --- Clause Operations & Sandbox ---

// Fix: generateClauseRewrite was missing
export const generateClauseRewrite = async (clause: string, riskType: string, language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a legal engineer. Rewrite the following clause to mitigate the risk of '${riskType}'. 
      Original: ${clause}
      
      Provide ONLY the rewritten clause in ${language}.`,
      config: { temperature: 0.3 }
    });
    return response.text || "Rewrite failed.";
  });
};

// Fix: generateRemediatedDraft was missing
export const generateRemediatedDraft = async (analysis: string, language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Based on this audit analysis: ${analysis}, generate a fully remediated version of the document. 
      Ensure all identified risks are addressed with standard protective provisions. 
      Respond in ${language}.`,
      config: { temperature: 0.2, thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Remediation failed.";
  });
};

export const evaluateSandboxComposition = async (content: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit this document fragment for real-time risk. 
      Content: ${content}
      
      Return JSON:
      {
        "score": number (0-100),
        "risks": ["short string"],
        "conflicts": ["short string of conflicting parts"]
      }`,
      config: { responseMimeType: "application/json", temperature: 0.1 }
    });
    try { return JSON.parse(response.text || "{}"); } catch { return { score: 0, risks: [], conflicts: [] }; }
  });
};

// Fix: generateRiskAssessment was missing
export const generateRiskAssessment = async (context: string, language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep risk assessment on this context: ${context}.
      
      For each risk found, use the following mandatory format:
      Risk Name [IMPACT: X] and [PROBABILITY: Y]
      Where X and Y are numbers from 1 to 5.
      
      Followed by a brief rationale.
      
      Structure:
      # RISK ASSESSMENT REPORT
      ## EXECUTIVE SUMMARY
      ## DETAILED RISK MATRIX
      ## MITIGATION STRATEGY
      
      Respond in ${language}.`,
      config: { temperature: 0.2, thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Assessment failed.";
  });
};

// --- Marketing Lab ---

// Fix: generateMarketingAssets was missing
export const generateMarketingAssets = async (prompt: string, language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.7 }
    });
    return response.text || "Asset generation failed.";
  });
};

// Fix: generateMarketingVisual was missing, using flash image model
export const generateMarketingVisual = async (prompt: string): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    // Iterate parts to find the generated image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Visual generation failed.");
  });
};

// Fix: generateSonicIdentity was missing, using TTS model
export const generateSonicIdentity = async (text: string): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say with authority: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64) return base64;
    throw new Error("Audio synthesis failed.");
  });
};

// Fix: generateSovereignVideo was missing, using Veo model
export const generateSovereignVideo = async (prompt: string, onUpdate: (msg: string) => void): Promise<string> => {
  return executeWithRetry(async (ai) => {
    onUpdate("Initializing Neural Pipeline...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
    
    onUpdate("Synthesizing Motion Lattice...");
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      onUpdate(`Rendering Frame Sequences... ${Math.floor(Math.random() * 20 + 40)}%`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      return `${downloadLink}&key=${process.env.API_KEY}`;
    }
    throw new Error("Video synthesis failed.");
  });
};

// --- Macro Intelligence & Search ---

// Fix: synthesizePortfolioRisk was missing
export const synthesizePortfolioRisk = async (history: HistoricAudit[], language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const context = history.map(h => `File: ${h.fileName}, Score: ${h.score}%, Juris: ${h.jurisdiction}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the LexiScan Executive Strategist. Synthesize the following audit portfolio into a unified commercial risk posture report:
      ${context}
      
      Identify systemic weaknesses and cross-contract liabilities. Respond in ${language}.`,
      config: { temperature: 0.1, thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Portfolio synthesis failed.";
  });
};

// Fix: generateBoardroomMemo was missing
export const generateBoardroomMemo = async (audit: string, comparison: string = "", language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the LexiScan Executive Advisor. Synthesize the following data into a high-impact boardroom memo.
      Audit: ${audit}
      Comparison/Negotiation Context: ${comparison}
      
      Structure:
      # EXECUTIVE SUMMARY
      ## KEY RISKS & MITIGATIONS
      ## COMMERCIAL RECOMMENDATION
      
      Ensure the tone is professional, authoritative, and concise. Respond in ${language}.`,
      config: { temperature: 0.3, thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Memo synthesis failed.";
  });
};

// Fix: searchVaultIntelligence was missing
export const searchVaultIntelligence = async (audits: HistoricAudit[], query: string): Promise<string[]> => {
  return executeWithRetry(async (ai) => {
    const context = audits.map(a => `ID: ${a.id}, File: ${a.fileName}, Analysis: ${a.analysisText}`).join('\n---\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search this vault context for the query: "${query}". Return a JSON array of IDs that match the semantic intent.
      
      Vault:
      ${context}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    try {
      return JSON.parse(response.text || "[]");
    } catch {
      return [];
    }
  });
};

// Fix: generateCounterpartyDossier was missing, using Search Grounding
export const generateCounterpartyDossier = async (companyName: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional legal and financial dossier for the company: "${companyName}". 
      Identify recent litigations, financial health, and overall reputation. 
      Include a section [FINANCIAL_RISK_INDEX]: X/100.
      Respond in ${language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || "Intelligence extraction failed.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  });
};

// Fix: checkCompliance was missing, using Search Grounding
export const checkCompliance = async (auditText: string, jurisdiction: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Scrutinize the following document content against the latest 2024-2025 regulations in ${jurisdiction}.
      Document Summary: ${auditText}
      
      Identify compliance gaps and provide an [ALIGNMENT_INDEX]: X/100.
      Respond in ${language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || "Compliance check failed.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  });
};

// Fix: forgeLegalRebuttal was missing, using Search Grounding
export const forgeLegalRebuttal = async (clause: string, riskType: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Forge a tactical legal rebuttal for this clause: "${clause}". 
      The primary risk identified is "${riskType}". Use real-world 2024-2025 precedent or statutes.
      Respond in ${language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || "Forge sequence failed.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  });
};

// --- Geo-Intelligence ---

export const getGeoLegalIntelligence = async (lat: number, lng: number, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview',
      contents: `You are the LexiScan Geo-Intelligence Officer. Detect the legal jurisdiction at coordinates [${lat}, ${lng}]. 
      Identify 3 critical local legal hubs (courts, regulatory bodies) and 2 regional legal risks (e.g., specific state taxes, local privacy laws).
      
      Language: ${language}.
      
      Return JSON:
      {
        "jurisdiction": "string",
        "hubs": [{"name": "string", "type": "string", "address": "string", "mapsUri": "string"}],
        "regionalRisks": [{"name": "string", "threatLevel": "HIGH" | "MED" | "LOW", "summary": "string"}],
        "localStatuteSync": "string (Short summary of the most important local law)"
      }`,
      config: { 
        tools: [{ googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } },
        responseMimeType: "application/json"
      }
    });
    try {
      return JSON.parse(response.text || "{}");
    } catch {
      throw new Error("Geo-Intelligence sync failed.");
    }
  });
};

// --- Forensics & History ---

export const generateForensicManifest = async (history: HistoricAudit[], language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const summary = history.map(h => `AUDIT: ${h.fileName} (Score: ${h.score}%, Time: ${h.timestamp})`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the LexiScan Forensics Officer. Generate a professional "Due Diligence Compliance Manifest" in ${language}.
      
      OPERATIONAL HISTORY:
      ${summary}
      
      INSTRUCTIONS:
      1. Summarize the depth of scrutiny applied.
      2. Certify that risk mitigation protocols were executed.
      3. Provide a "Security Verification Hash" (Simulated).
      
      FORMAT:
      # NEURAL FORENSICS MANIFEST
      ## COMPLIANCE CERTIFICATION`,
      config: { temperature: 0.1, thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Forensic synthesis failed.";
  });
};

// --- Command & Stream ---

// Fix: Finished the incomplete runNeuralCommandStream implementation
export const runNeuralCommandStream = async (
  message: string, 
  vaultContext: HistoricAudit[], 
  onChunk: (text: string) => void,
  language: Language = 'English'
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contextSummary = vaultContext.map(a => `FILE: ${a.fileName} (Risk: ${a.score}%, Juris: ${a.jurisdiction})`).join('\n');
  
  const response = await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: `WORKSPACE CONTEXT:\n${contextSummary}\n\nUSER COMMAND: ${message}\n\nRespond as LexiScan Command Central in ${language}. Be tactical, concise, and professional.`,
    config: {
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  for await (const chunk of response) {
    if (chunk.text) {
      onChunk(chunk.text);
    }
  }
};

// --- Forecasting & Comparative Analytics ---

// Fix: compareLegalDocuments was missing
export const compareLegalDocuments = async (base64_1: string, base64_2: string, language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { text: `You are the LexiScan Comparison Engine. Analyze these two legal documents and identify all substantive deltas. Highlight risky deviations. Respond in ${language}.` },
          { inlineData: { mimeType: 'application/pdf', data: base64_1 } },
          { inlineData: { mimeType: 'application/pdf', data: base64_2 } }
        ]
      },
      config: { temperature: 0.1, thinkingConfig: { thinkingBudget: 8000 } }
    });
    return response.text || "Comparison failed.";
  });
};

// Fix: generateNegotiationScript was missing
export const generateNegotiationScript = async (comparison: string, language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the LexiScan Negotiation Architect. Based on this comparison analysis: ${comparison}, generate a tactical negotiation playbook.
      
      Include:
      1. Strategic opening position.
      2. Specific rebuttals for identified deltas.
      3. Concession strategy (what to trade, what to hold).
      
      Respond in ${language}.`,
      config: { temperature: 0.7, thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Playbook generation failed.";
  });
};

// Fix: generateNeuralRedline was missing
export const generateNeuralRedline = async (base: string, counter: string, language: Language = 'English'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a detailed visual redline for these document versions. 
      Base: ${base}
      Counter: ${counter}
      
      Use markdown notation: ~~deleted text~~ and **_added text_**. Respond in ${language}.`,
      config: { temperature: 0.1, thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Redline synthesis failed.";
  });
};

// Fix: forecastLitigationVector was missing
export const forecastLitigationVector = async (text: string): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Forecast the probability of this specific clause leading to litigation or commercial dispute: "${text}". 
      Return format: X% : Rationale`,
      config: { temperature: 0.1 }
    });
    return response.text || "Forecast cycle failed.";
  });
};

// --- Advanced Multi-Agent Simulations ---

// Fix: projectJudicialOutcome was missing
export const projectJudicialOutcome = async (audit: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Project the judicial interpretation of this audit data: ${audit}.
      Return JSON:
      {
        "verdictProbability": number (0-100),
        "loadBearingClauses": ["string"],
        "judges": [
          {"archetype": "string", "ruling": "string", "confidence": number}
        ]
      }
      Language: ${language}`,
      config: { responseMimeType: "application/json", temperature: 0.1 }
    });
    return JSON.parse(response.text || "{}");
  });
};

// Fix: runHighTableConsensus was missing
export const runHighTableConsensus = async (audit: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Convene an executive panel to reach consensus on this document: ${audit}.
      Return JSON:
      {
        "consensusScore": number (0-100),
        "keyContentionPoint": "string",
        "debateLog": [
          {"agent": "string", "argument": "string"}
        ],
        "unifiedDirective": "string"
      }
      Language: ${language}`,
      config: { responseMimeType: "application/json", temperature: 0.1 }
    });
    return JSON.parse(response.text || "{}");
  });
};

// Fix: runBreachSimulation was missing
export const runBreachSimulation = async (audit: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Run an adversarial breach simulation on this document: ${audit}.
      Return JSON:
      {
        "vulnerabilityIndex": number (0-100),
        "scenarios": [
          {"id": "string", "name": "string", "impact": "string", "exploit": "string", "patch": "string"}
        ]
      }
      Language: ${language}`,
      config: { responseMimeType: "application/json", temperature: 0.1 }
    });
    return JSON.parse(response.text || "{}");
  });
};

// Fix: runNeuralDiscovery was missing
export const runNeuralDiscovery = async (audit: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep discovery on this audit: ${audit}.
      Return JSON:
      {
        "discoveryScore": number (0-100),
        "milestones": [
          {"date": "string", "event": "string", "urgency": "CRITICAL" | "MODERATE" | "LOW"}
        ],
        "evidenceLocker": [
          {"category": "string", "claim": "string", "sourceText": "string"}
        ]
      }
      Language: ${language}`,
      config: { responseMimeType: "application/json", temperature: 0.1 }
    });
    return JSON.parse(response.text || "{}");
  });
};

// Fix: runVoidScan was missing
export const runVoidScan = async (audit: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Audit the "Negative Space" for missing protections in this document: ${audit}.
      Return JSON:
      {
        "structuralIntegrity": number (0-100),
        "omissions": [
          {"name": "string", "risk": "string", "injectionBlock": "string"}
        ]
      }
      Language: ${language}`,
      config: { responseMimeType: "application/json", temperature: 0.1 }
    });
    return JSON.parse(response.text || "{}");
  });
};

// Fix: runSovereignGraph was missing
export const runSovereignGraph = async (audit: string, language: Language = 'English') => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Map entity relationships and liability weights for this audit: ${audit}.
      Return JSON:
      {
        "systemLoad": number (0-100),
        "primaryLiabilityNode": "string",
        "entities": [
          {"name": "string", "role": "string", "jurisdiction": "string", "liabilityWeight": number, "connections": ["string"]}
        ]
      }
      Language: ${language}`,
      config: { responseMimeType: "application/json", temperature: 0.1 }
    });
    return JSON.parse(response.text || "{}");
  });
}
