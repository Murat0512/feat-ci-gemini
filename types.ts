
export enum AppView {
  LANDING = 'landing',
  DASHBOARD = 'dashboard',
  LEGAL_AUDIT = 'legal_audit',
  MARKETING_SUITE = 'marketing_suite',
  SETTINGS = 'settings',
  LIVE_CONSULT = 'live_consult',
  CREATOR_STUDIO = 'creator_studio',
  COMPARATIVE_ANALYSIS = 'comparative_analysis',
  NEGOTIATION_DUEL = 'negotiation_duel',
  BOARDROOM_MEMO = 'boardroom_memo',
  NEURAL_VAULT = 'neural_vault',
  ADVERSARY_DOSSIER = 'adversary_dossier',
  COMPLIANCE_RADAR = 'compliance_radar',
  PORTFOLIO_POSTURE = 'portfolio_posture',
  PORTFOLIO_SYNTHESIS = 'portfolio_synthesis',
  PRECEDENT_FORGE = 'precedent_forge',
  NEURAL_LIBRARY = 'neural_library',
  REDLINE_MASTER = 'redline_master',
  RISK_ASSESSMENT = 'risk_assessment',
  PROJECT_HUB = 'project_hub',
  COURTROOM_PROJECTION = 'courtroom_projection',
  HIGH_TABLE = 'high_table',
  BREACH_SCENARIOS = 'breach_scenarios',
  NEURAL_DISCOVERY = 'neural_discovery',
  OMISSION_RADAR = 'omission_radar',
  SOVEREIGN_GRAPH = 'sovereign_graph',
  NEURAL_COMMAND = 'neural_command',
  NEURAL_FORENSICS = 'neural_forensics',
  NEURAL_SANDBOX = 'neural_sandbox',
  MULTI_DOC_INVESTIGATOR = 'multi_doc_investigator',
  SOVEREIGN_MAP = 'sovereign_map',
  NEURAL_MASK = 'neural_mask',
  NEURAL_EYE = 'neural_eye',
  ADMIN = 'admin'
}

export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Chinese' | 'Japanese' | 'Portuguese';

export interface GlobalProvision {
  id: string;
  category: string;
  originalClause: string;
  safeClause: string;
  timestamp: string;
  tags: string[];
}

export interface HistoricAudit {
  id: string;
  projectId: string; 
  fileName: string;
  timestamp: string;
  score: number;
  level: string;
  color: string;
  analysisText: string;
  jurisdiction?: string;
  redlineData?: string;
}

export interface RiskProfile {
  liability: number;
  termination: number;
  compliance: number;
  litigation: number;
  loopholes: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  riskIndex: number;
}
