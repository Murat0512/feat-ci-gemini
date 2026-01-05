import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Lightbulb, BookOpen, Zap } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  shortTip: string;
}

interface FeatureGuideProps {
  isOpen: boolean;
  onClose: () => void;
  autoTour?: boolean;
  setAutoTourDone?: (done: boolean) => void;
}

const FeatureGuide: React.FC<FeatureGuideProps> = ({ isOpen, onClose, autoTour = false, setAutoTourDone }) => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [currentTourStep, setCurrentTourStep] = useState(0);

  const features: Feature[] = [
    // Command
    { id: 'dashboard', name: 'Nerve Center', category: 'Command', description: 'Real-time dashboard displaying key metrics, recent audits, and system status at a glance.', icon: '📊', shortTip: 'Overview of your legal AI workspace' },
    { id: 'workspaces', name: 'Workspaces', category: 'Command', description: 'Organize and manage multiple projects, client matters, and deal teams in separate workspaces.', icon: '📁', shortTip: 'Manage projects & client matters' },

    // Intel & Mapping
    { id: 'sovereignmap', name: 'Sovereign Map', category: 'Intel & Mapping', description: 'Visual mapping of legal entities, jurisdiction risks, and regulatory exposure across global operations.', icon: '🗺️', shortTip: 'Map legal entities & jurisdictions' },
    { id: 'sovereigngraph', name: 'Sovereign Graph', category: 'Intel & Mapping', description: 'Network analysis showing relationships, ownership chains, and counterparty interconnections.', icon: '🔗', shortTip: 'Visualize entity relationships' },
    { id: 'discovery', name: 'Discovery Vault', category: 'Intel & Mapping', description: 'Intelligent document discovery and AI-powered insights from uploaded contracts and materials.', icon: '🔑', shortTip: 'AI document discovery & analysis' },
    { id: 'dossier', name: 'Entity Dossier', category: 'Intel & Mapping', description: 'Compile comprehensive counterparty profiles with risk scoring, litigation history, and compliance data.', icon: '🔍', shortTip: 'Build entity intelligence profiles' },

    // Audit & Controls
    { id: 'audit', name: 'Tactical Audit', category: 'Audit & Controls', description: 'AI-powered contract audits identifying missing clauses, risks, and deviations from standards.', icon: '📋', shortTip: 'Audit contracts for completeness' },
    { id: 'redline', name: 'Redline Master', category: 'Audit & Controls', description: 'Track, compare, and manage multiple redline versions with AI-powered diff analysis and suggestions.', icon: '✏️', shortTip: 'Manage contract redlines & versions' },
    { id: 'omission', name: 'Omission Radar', category: 'Audit & Controls', description: 'Detect missing critical clauses and provisions compared to market standards and precedent.', icon: '📡', shortTip: 'Identify missing contract provisions' },
    { id: 'risk', name: 'Risk Assessment', category: 'Audit & Controls', description: 'Quantify and score legal, financial, and operational risks across portfolio of contracts.', icon: '⚠️', shortTip: 'Score & quantify legal risks' },
    { id: 'compliance', name: 'Compliance Radar', category: 'Audit & Controls', description: 'Monitor contracts for regulatory compliance, policy adherence, and governance violations.', icon: '🎯', shortTip: 'Monitor regulatory compliance' },

    // Drafting & Sandbox
    { id: 'sandbox', name: 'Clause Sandbox', category: 'Drafting & Sandbox', description: 'Draft, test, and iterate on contract clauses with AI feedback and market-standard comparisons.', icon: '📝', shortTip: 'Draft & test contract clauses' },
    { id: 'forge', name: 'Precedent Forge', category: 'Drafting & Sandbox', description: 'Build and manage internal precedent libraries, templates, and playbooks for reuse.', icon: '🔨', shortTip: 'Create & manage legal templates' },
    { id: 'library', name: 'Standard Library', category: 'Drafting & Sandbox', description: 'Access curated collection of market-standard clauses, definitions, and boilerplate.', icon: '📚', shortTip: 'Browse standard clauses' },

    // Negotiation & Strategy
    { id: 'warroom', name: 'War-Room', category: 'Negotiation & Strategy', description: 'Side-by-side comparison of contract versions with AI-generated negotiation strategies and trade-off analysis.', icon: '⚔️', shortTip: 'Compare versions & strategize' },
    { id: 'duel', name: 'Strategic Duel', category: 'Negotiation & Strategy', description: 'AI-powered negotiation advisor analyzing counterparty positions and suggesting optimal responses.', icon: '🗡️', shortTip: 'Get AI negotiation advice' },
    { id: 'boardroom', name: 'Boardroom Memo', category: 'Negotiation & Strategy', description: 'Generate executive summaries and strategic memos for stakeholder sign-off and governance.', icon: '📊', shortTip: 'Create executive summaries' },
    { id: 'hightable', name: 'High Table', category: 'Negotiation & Strategy', description: 'Multi-party deal management with stakeholder views, approval workflows, and decision tracking.', icon: '👥', shortTip: 'Manage multi-party deals' },

    // Forensics & Disputes
    { id: 'forensics', name: 'Neural Forensics', category: 'Forensics & Disputes', description: 'AI-powered contract forensics identifying breach triggers, liability exposure, and dispute risks.', icon: '🔬', shortTip: 'Analyze breach & dispute risks' },
    { id: 'zerodaysymptoms', name: 'Zero-Day Ledger', category: 'Forensics & Disputes', description: 'Document breach scenarios, early warning indicators, and remediation pathways.', icon: '⚡', shortTip: 'Track breach scenarios' },
    { id: 'gavel', name: 'Gavel Engine', category: 'Forensics & Disputes', description: 'Predict litigation outcomes and dispute resolution likelihood based on contract and case facts.', icon: '⚖️', shortTip: 'Predict litigation outcomes' },

    // Creative & GTM
    { id: 'nexus', name: 'Nexus Lab', category: 'Creative & GTM', description: 'Marketing automation and go-to-market tools for legal tech and contract intelligence products.', icon: '🚀', shortTip: 'Marketing & GTM automation' },

    // Deployment & Visibility
    { id: 'mask', name: 'Neural Mask', category: 'Deployment & Visibility', description: 'Redact and anonymize sensitive data for external sharing, regulatory filings, and due diligence.', icon: '👻', shortTip: 'Redact sensitive data' },
    { id: 'eye', name: 'Neural Eye', category: 'Deployment & Visibility', description: 'Monitor and track contract status, stakeholder activity, and execution timelines in real-time.', icon: '👁️', shortTip: 'Monitor execution status' },
    { id: 'command', name: 'Neural Command', category: 'Deployment & Visibility', description: 'Control and orchestrate workflows, notifications, and escalations across the platform.', icon: '💬', shortTip: 'Workflow automation & control' },
    { id: 'vault', name: 'Neural Vault', category: 'Deployment & Visibility', description: 'Secure document repository with versioning, access controls, and audit trails.', icon: '🗄️', shortTip: 'Secure document storage' },

    // Live Ops
    { id: 'consult', name: 'Neural Consult', category: 'Live Ops', description: 'Real-time AI-powered legal consulting and contract analysis via voice and text.', icon: '🎤', shortTip: 'Live AI legal consultation' },
  ];

  const categories = Array.from(new Set(features.map(f => f.category)));

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  const activeCategoryFeatures = features.filter(f => f.category === activeCategory);

  const handleNextTour = () => {
    if (currentTourStep < features.length - 1) {
      setCurrentTourStep(currentTourStep + 1);
    } else {
      if (setAutoTourDone) setAutoTourDone(true);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-emerald-500" />
            <h2 className="text-2xl font-black text-white uppercase">Feature Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-64 border-r border-white/10 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentTourStep(0);
                }}
                className={`w-full text-left px-4 py-3 border-b border-white/5 transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-600/20 border-l-2 border-l-emerald-500 text-emerald-400'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Features List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {activeCategoryFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl mt-1">{feature.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{feature.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{feature.description}</p>
                      <div className="flex items-center gap-2 text-xs text-emerald-400/70">
                        <Lightbulb size={14} />
                        <span>{feature.shortTip}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-600 group-hover:text-emerald-500 transition-colors mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Zap size={14} className="text-emerald-500" />
            <span>{activeCategoryFeatures.length} features in this category</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureGuide;
