import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as svc from '../geminiService';

describe('analyzeLegalDocument & compareLegalDocuments', () => {
  let originalGetModel: any;

  beforeEach(() => {
    originalGetModel = svc.genAI.getGenerativeModel;
  });

  afterEach(() => {
    svc.genAI.getGenerativeModel = originalGetModel;
    vi.resetAllMocks();
  });

  it('analyzeLegalDocument returns model text', async () => {
    const mockText = 'Audit result: OK';
    svc.genAI.getGenerativeModel = vi.fn(() => ({
      generateContent: vi.fn(async (_prompt: any) => ({ response: { text: () => mockText } }))
    })) as any;

    const out = await svc.analyzeLegalDocument('base64-data', 'English');
    expect(out).toBe(mockText);
  });

  it('compareLegalDocuments returns comparison text using pro model', async () => {
    const mockText = 'Comparison: docs equal';
    svc.genAI.getGenerativeModel = vi.fn(() => ({
      generateContent: vi.fn(async (_prompt: any) => ({ response: { text: () => mockText } }))
    })) as any;

    const out = await svc.compareLegalDocuments('doc1', 'doc2', 'English');
    expect(out).toBe(mockText);
  });
});