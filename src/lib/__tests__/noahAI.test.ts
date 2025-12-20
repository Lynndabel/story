import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
process.env.NEXT_PUBLIC_NOAHAI_API_KEY = 'mock-key';
import * as NA from '../noahAI';


const API_KEY = 'mock-key';
const BASE_URL = 'https://api.noahai.com';

describe('noahAI utility functions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.NEXT_PUBLIC_NOAHAI_API_KEY = API_KEY;
  });
  afterEach(() => {
  delete process.env.NEXT_PUBLIC_NOAHAI_API_KEY;
});

  it('analyzeSpending calls correct endpoint and returns parsed data', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ recommendations: ['save more'] })
    } as any);
    const result = await NA.analyzeSpending([]);
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/analyze`,
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toHaveProperty('recommendations');
  });

  it('categorizeTransactions calls correct endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ categories: [] }) } as any);
    const result = await NA.categorizeTransactions([]);
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/categorize`,
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toHaveProperty('categories');
  });

  it('predictSpending calls correct endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ trend: 'up' }) } as any);
    const result = await NA.predictSpending([]);
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/predict`,
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toHaveProperty('trend');
  });

  it('getFinancialAdvice calls correct endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ summary: 'advice' }) } as any);
    const result = await NA.getFinancialAdvice({});
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/advice`,
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toHaveProperty('summary');
  });

  it('throws if API_KEY missing', async () => {
    delete process.env.NEXT_PUBLIC_NOAHAI_API_KEY;
    await expect(NA.analyzeSpending([])).rejects.toThrow('NEXT_PUBLIC_NOAHAI_API_KEY missing');
  });

  it('throws if response is not ok', async () => {
    process.env.NEXT_PUBLIC_NOAHAI_API_KEY = API_KEY;
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: false, status: 500, statusText: 'fail' } as any);
    await expect(NA.analyzeSpending([])).rejects.toThrow('NoahAI request failed: 500 fail');
  });
});
