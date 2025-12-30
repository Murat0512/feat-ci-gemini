/**
 * AI Service Wrapper with Consistency Tracking
 * Wraps all Gemini service calls with validation and metrics
 */

import {
  analyzeLegalDocument as rawAnalyzeLegalDocument,
  compareLegalDocuments as rawCompareLegalDocuments,
  synthesizePortfolioRisk as rawSynthesizePortfolioRisk,
  checkCompliance as rawCheckCompliance,
  forgeLegalRebuttal as rawForgeLegalRebuttal,
  generateCounterpartyDossier as rawGenerateCounterpartyDossier,
} from './geminiService';
import { consistencyChecker, consistencyLogger, validators } from './consistencyChecker';
import { Language, HistoricAudit } from '../types';

/**
 * Wrapped: synthesizePortfolioRisk with consistency validation
 */
export const synthesizePortfolioRiskWithValidation = async (
  audits: HistoricAudit[],
  language: Language = 'English'
): Promise<string> => {
  const startTime = consistencyLogger.startTiming();
  
  try {
    const result = await rawSynthesizePortfolioRisk(audits, language);

    // Validate output
    const { isValid, failures } = consistencyChecker.validateResponse(
      'synthesizePortfolioRisk',
      `${audits.length} audits in ${language}`,
      result,
      [
        validators.hasMarkdownHeading,
        validators.minLength(100),
        (output) => !output.includes('[ERROR]'), // No error markers
      ]
    );

    if (isValid) {
      consistencyChecker.recordSuccess();
      consistencyLogger.log('synthesizePortfolioRisk', 'success', `Processed ${audits.length} audits`);
    } else {
      consistencyChecker.recordFailure();
      consistencyLogger.log('synthesizePortfolioRisk', 'warning', failures.join('; '));
    }

    consistencyLogger.endTiming(startTime, 'synthesizePortfolioRisk');
    return result;
  } catch (error) {
    consistencyChecker.recordFailure();
    consistencyLogger.log('synthesizePortfolioRisk', 'failure', `${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Wrapped: checkCompliance with consistency validation
 */
export const checkComplianceWithValidation = async (
  text: string,
  jurisdiction: string,
  language: Language = 'English'
): Promise<{ text: string; sources: any[] }> => {
  const startTime = consistencyLogger.startTiming();

  try {
    const result = await rawCheckCompliance(text, jurisdiction, language);

    const { isValid, failures } = consistencyChecker.validateResponse(
      'checkCompliance',
      `${jurisdiction}: ${text.substring(0, 50)}...`,
      JSON.stringify(result),
      [
        (output) => {
          try {
            const parsed = JSON.parse(output);
            return parsed.text && parsed.sources !== undefined;
          } catch {
            return false;
          }
        },
        validators.minLength(50),
      ]
    );

    if (isValid) {
      consistencyChecker.recordSuccess();
      consistencyLogger.log('checkCompliance', 'success', `Checked ${jurisdiction} compliance`);
    } else {
      consistencyChecker.recordFailure();
      consistencyLogger.log('checkCompliance', 'warning', failures.join('; '));
    }

    consistencyLogger.endTiming(startTime, 'checkCompliance');
    return result;
  } catch (error) {
    consistencyChecker.recordFailure();
    consistencyLogger.log('checkCompliance', 'failure', `${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Wrapped: compareLegalDocuments with consistency validation
 */
export const compareDocumentsWithValidation = async (
  doc1: string,
  doc2: string,
  language: Language = 'English'
): Promise<string> => {
  const startTime = consistencyLogger.startTiming();

  try {
    const result = await rawCompareLegalDocuments(doc1, doc2, language);

    const { isValid, failures } = consistencyChecker.validateResponse(
      'compareDocuments',
      `Comparing 2 documents in ${language}`,
      result,
      [
        validators.minLength(100),
        (output) => !output.includes('[ERROR]'),
        (output) => /[A-Z]/g.test(output), // Contains uppercase
      ]
    );

    if (isValid) {
      consistencyChecker.recordSuccess();
      consistencyLogger.log('compareDocuments', 'success', 'Comparison completed');
    } else {
      consistencyChecker.recordFailure();
      consistencyLogger.log('compareDocuments', 'warning', failures.join('; '));
    }

    consistencyLogger.endTiming(startTime, 'compareDocuments');
    return result;
  } catch (error) {
    consistencyChecker.recordFailure();
    consistencyLogger.log('compareDocuments', 'failure', `${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Wrapped: analyzeLegalDocument with consistency validation
 */
export const analyzeDocumentWithValidation = async (
  base64: string,
  language: Language = 'English'
): Promise<string> => {
  const startTime = consistencyLogger.startTiming();

  try {
    const result = await rawAnalyzeLegalDocument(base64, language);

    const { isValid, failures } = consistencyChecker.validateResponse(
      'analyzeDocument',
      `Image analysis in ${language}`,
      result,
      [
        validators.minLength(50),
        (output) => !output.includes('[ERROR]'),
      ]
    );

    if (isValid) {
      consistencyChecker.recordSuccess();
      consistencyLogger.log('analyzeDocument', 'success', 'Document analyzed');
    } else {
      consistencyChecker.recordFailure();
      consistencyLogger.log('analyzeDocument', 'warning', failures.join('; '));
    }

    consistencyLogger.endTiming(startTime, 'analyzeDocument');
    return result;
  } catch (error) {
    consistencyChecker.recordFailure();
    consistencyLogger.log('analyzeDocument', 'failure', `${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Wrapped: generateCounterpartyDossier with consistency validation
 */
export const generateDossierWithValidation = async (
  entity: string,
  language: Language = 'English'
): Promise<{ text: string; sources: any[] }> => {
  const startTime = consistencyLogger.startTiming();

  try {
    const result = await rawGenerateCounterpartyDossier(entity, language);

    const { isValid, failures } = consistencyChecker.validateResponse(
      'generateDossier',
      `Dossier for ${entity}`,
      JSON.stringify(result),
      [
        (output) => {
          try {
            const parsed = JSON.parse(output);
            return parsed.text && parsed.sources !== undefined;
          } catch {
            return false;
          }
        },
        validators.minLength(50),
        (output) => output.toLowerCase().includes(entity.toLowerCase()),
      ]
    );

    if (isValid) {
      consistencyChecker.recordSuccess();
      consistencyLogger.log('generateDossier', 'success', `Generated dossier for ${entity}`);
    } else {
      consistencyChecker.recordFailure();
      consistencyLogger.log('generateDossier', 'warning', failures.join('; '));
    }

    consistencyLogger.endTiming(startTime, 'generateDossier');
    return result;
  } catch (error) {
    consistencyChecker.recordFailure();
    consistencyLogger.log('generateDossier', 'failure', `${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Get consistency report
 */
export const getConsistencyReport = () => {
  return consistencyChecker.generateReport();
};

/**
 * Reset metrics
 */
export const resetConsistencyMetrics = () => {
  consistencyChecker.reset();
  consistencyLogger.log('system', 'success', 'Consistency metrics reset');
};

/**
 * Export metrics for monitoring
 */
export const getConsistencyMetrics = () => {
  return consistencyChecker.getMetrics();
};
