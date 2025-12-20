import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as SP from '../selfProtocol';

describe('selfProtocol verifyIdentity', () => {
  const address = '0x123' as `0x${string}`;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    vi.resetAllMocks();
    originalEnv = { ...process.env };
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns mockIdentity if useMocks is true', async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = 'true';
    const result = await SP.verifyIdentity(address);
    expect(result).toHaveProperty('verified');
  });

  it('uses SDK if available and apiKey present', async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = 'false';
    process.env.NEXT_PUBLIC_SELF_API_KEY = 'key';
    const sdkVerify = vi.fn().mockResolvedValue({ isVerified: true, reputationScore: 42 });
    class FakeSDK {
      verifyIdentity;
      constructor() { this.verifyIdentity = sdkVerify; }
    }
    vi.stubGlobal('import', vi.fn().mockResolvedValue({ SelfSDK: FakeSDK }));
    const result = await SP.verifyIdentity(address, FakeSDK);
    expect(result.verified).toBe(true);
    expect(result.reputation).toBe(42);
  });

  it('falls back to REST if SDK or apiKey missing', async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = 'false';
    process.env.NEXT_PUBLIC_SELF_VERIFY_URL = 'http://test';
    vi.stubGlobal('import', vi.fn().mockRejectedValue(new Error('fail')));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ isVerified: true, reputationScore: 99 }) }));
    const result = await SP.verifyIdentity(address);
    expect(result.verified).toBe(true);
    expect(result.reputation).toBe(99);
  });

  it('returns verified false if REST fails', async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = 'false';
    process.env.NEXT_PUBLIC_SELF_VERIFY_URL = 'http://test';
    vi.stubGlobal('import', vi.fn().mockRejectedValue(new Error('fail')));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const result = await SP.verifyIdentity(address);
    expect(result.verified).toBe(false);
  });
});
