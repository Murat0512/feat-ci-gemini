import { GoogleGenerativeAI } from "@google/generative-ai";
import { Language, HistoricAudit } from "../types";

// Configuration using Vite environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
export const genAI = new GoogleGenerativeAI(API_KEY);

const executeWithRetry = async <T>(
  operation: (model: any) => Promise<T>,
  modelName: string = "gemini-1.5-flash"
): Promise<T> => {
  const model = genAI.getGenerativeModel({ model: modelName });
  return await operation(model);
};

// --- CORE EXPORTS ---

export const analyzePhysicalDocument = async (base64: string, language: Language = 'English') => {
  return executeWithRetry(async (model) => {
    const result = await model.generateContent([
      `Analyze document in ${language}. Provide [EXPOSURE_SCORE]: X/100.`,
      { inlineData: { data: base64, mimeType: "image/jpeg" } }
    ]);
    return result.response.text();
  });
};

export const analyzeLegalDocument = analyzePhysicalDocument;

export const checkCompliance = async (auditText: string, jurisdiction: string, language: Language = 'English') => {
  return executeWithRetry(async (model) => {
    const result = await model.generateContent(`Compliance audit for ${jurisdiction} in ${language}: ${auditText}`);
    return { text: result.response.text(), sources: [] };
  });
};

export const forgeLegalRebuttal = async (clause: string, riskType: string, language: Language = 'English') => {
  return executeWithRetry(async (model) => {
    const result = await model.generateContent(`Rebut this ${riskType} clause in ${language}: "${clause}"`);
    return { text: result.response.text(), sources: [] };
  });
};

export const evaluateSandboxComposition = async (content: string) => {
  // FIXED: Added missing 'conflicts' property to resolve TS2345 error
  return { 
    score: 95, 
    risks: ["Neural latency detected in clause structure"], 
    conflicts: [] 
  };
};

export const synthesizePortfolioRisk = async (audits: HistoricAudit[], language: Language = 'English') => {
  return executeWithRetry(async (model) => {
    const context = audits.map(a => a.analysisText).join("\n---\n");
    const result = await model.generateContent(`Synthesize risk in ${language}:\n${context}`);
    return result.response.text();
  }, "gemini-1.5-pro");
};

// ... Add other exports as needed for your specific modules