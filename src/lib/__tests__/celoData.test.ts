import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as CD from '../celoData';

describe('celoData', () => {
  const address = '0xabc' as `0x${string}`;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    vi.resetAllMocks();
    originalEnv = { ...process.env };
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it('getTransactionHistory returns parsed transactions', async () => {
    process.env.NEXT_PUBLIC_CELOSCAN_API_KEY = 'key';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: '1',
        result: [
          { hash: 'h1', from: address, to: '0x2', value: '1000000000000000000', timeStamp: '1700000000', gasUsed: '21000' }
        ]
      })
    }));
    const txs = await CD.getTransactionHistory(address, 1);
    expect(txs.length).toBe(1);
    expect(txs[0].value).toBe(1);
    expect(txs[0].token).toBe('CELO');
  });

  it('getTransactionHistory returns [] if API key missing', async () => {
    delete process.env.NEXT_PUBLIC_CELOSCAN_API_KEY;
    const txs = await CD.getTransactionHistory(address, 1);
    expect(txs).toEqual([]);
  });

  it('getTokenBalances returns celo and cusd balances', async () => {
    const fakeClient = {
      getBalance: vi.fn().mockResolvedValue('1000000000000000000'),
      readContract: vi.fn().mockResolvedValue('2000000000000000000'),
    };
    const result = await CD.getTokenBalances(address, fakeClient);
    expect(result.celo).toBe(1);
    expect(result.cusd).toBe(2);
  });
});
