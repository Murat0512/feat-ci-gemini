import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as svc from '../geminiService';
import { HistoricAudit } from '../../types';

describe('synthesizePortfolioRisk', () => {
  let originalGetModel: any;

  beforeEach(() => {
    // Preserve existing method
    originalGetModel = svc.genAI.getGenerativeModel;
  });

  afterEach(() => {
    svc.genAI.getGenerativeModel = originalGetModel;
    vi.resetAllMocks();
  });

  it('calls the model and returns the generated posture text', async () => {
    const sampleAudits: HistoricAudit[] = [
      { id: 'A1', projectId: 'P', fileName: 'contract.pdf', timestamp: 't', score: 85, level: 'high', color: 'red', analysisText: 'issue' },
      { id: 'A2', projectId: 'P', fileName: 'nda.pdf', timestamp: 't', score: 40, level: 'medium', color: 'yellow', analysisText: 'minor' }
    ];

    // Mock the model
    const mockText = '# Executive Portfolio Posture\n## Aggregate Risk: 62%\n- Total audits: 2\n- Critical vectors: 1';

    svc.genAI.getGenerativeModel = vi.fn(() => ({
      generateContent: vi.fn(async (_prompt: any) => ({ response: { text: () => mockText } }))
    })) as any;

    const out = await svc.synthesizePortfolioRisk(sampleAudits, 'English');
    expect(out).toBe(mockText);
    // ensure the model was invoked
    expect((svc.genAI.getGenerativeModel as any).mock.calls.length).toBeGreaterThan(0);
  });

  it('propagates model errors', async () => {
    const sampleAudits: HistoricAudit[] = [];
    svc.genAI.getGenerativeModel = vi.fn(() => ({
      generateContent: vi.fn(async () => { throw new Error('model failed'); })
    })) as any;

    await expect(svc.synthesizePortfolioRisk(sampleAudits, 'English')).rejects.toThrow('model failed');
  });
});

describe('generateSonicIdentity', () => {
  let originalBtoa: any;

  beforeEach(() => {
    originalBtoa = (globalThis as any).btoa;
    // Provide a Node-safe btoa for the test environment
    if (!originalBtoa) {
      (globalThis as any).btoa = (input: string) => Buffer.from(input, 'binary').toString('base64');
    }
  });

  afterEach(() => {
    (globalThis as any).btoa = originalBtoa;
  });

  it('returns a deterministic placeholder and encodes input', async () => {
    const out = await svc.generateSonicIdentity('hello-world');
    expect(out.startsWith('AUDIO_SIGNAL_PLACEHOLDER_')).toBe(true);
    expect(out).toContain('AUDIO_SIGNAL_PLACEHOLDER_');
    // Same input yields same output
    const out2 = await svc.generateSonicIdentity('hello-world');
    expect(out2).toBe(out);
  });
});