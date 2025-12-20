import { describe, it, expect } from 'vitest';
import * as FA from '../financialAnalysis';

const sampleTxs = [
  { value: 100, isOutgoing: true, timestamp: new Date('2023-01-01') },
  { value: 50, isOutgoing: false, timestamp: new Date('2023-01-01') },
  { value: 200, isOutgoing: true, timestamp: new Date('2023-01-02') },
];

describe('financialAnalysis utilities', () => {
  it('calculateAverage returns correct average', () => {
    // @ts-expect-error partial
    expect(FA['calculateAverage'](sampleTxs)).toBeCloseTo(116.666, 1);
  });

  it('calculateTotalSpent returns sum of outgoing', () => {
    // @ts-expect-error partial
    expect(FA['calculateTotalSpent'](sampleTxs)).toBe(300);
  });

  it('calculateTotalReceived returns sum of incoming', () => {
    // @ts-expect-error partial
    expect(FA['calculateTotalReceived'](sampleTxs)).toBe(50);
  });

  it('findMostActiveDay returns day with most txs', () => {
    // @ts-expect-error partial
    expect(FA['findMostActiveDay'](sampleTxs)).toBe('Sun Jan 01 2023');
  });
});
