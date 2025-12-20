import { describe, it, expect } from 'vitest';
import * as FA from '../financialAnalysis';

const sampleTxs = [
  { value: 100, isOutgoing: true, timestamp: new Date('2023-01-01'), hash: '', from: '', to: '', gasUsed: '', token: '' },
  { value: 50, isOutgoing: false, timestamp: new Date('2023-01-01'), hash: '', from: '', to: '', gasUsed: '', token: '' },
  { value: 200, isOutgoing: true, timestamp: new Date('2023-01-02'), hash: '', from: '', to: '', gasUsed: '', token: '' },
];

describe('financialAnalysis utilities', () => {
  it('calculateAverage returns 0 for empty array', () => {
    expect(FA.calculateAverage([])).toBe(0);
  });

  it('calculateTotalSpent returns 0 for all incoming', () => {
    const txs = [
      { value: 10, isOutgoing: false, timestamp: new Date('2023-01-01'), hash: '', from: '', to: '', gasUsed: '', token: '' },
      { value: 20, isOutgoing: false, timestamp: new Date('2023-01-01'), hash: '', from: '', to: '', gasUsed: '', token: '' },
    ];
    expect(FA.calculateTotalSpent(txs)).toBe(0);
  });

  it('calculateTotalReceived returns 0 for all outgoing', () => {
    const txs = [
      { value: 10, isOutgoing: true, timestamp: new Date('2023-01-01'), hash: '', from: '', to: '', gasUsed: '', token: '' },
      { value: 20, isOutgoing: true, timestamp: new Date('2023-01-01'), hash: '', from: '', to: '', gasUsed: '', token: '' },
    ];
    expect(FA.calculateTotalReceived(txs)).toBe(0);
  });

  it('findMostActiveDay returns undefined for empty array', () => {
    expect(FA.findMostActiveDay([])).toBeUndefined();
  });

  it('findMostActiveDay handles single transaction', () => {
    const txs = [
      { value: 5, isOutgoing: true, timestamp: new Date('2023-06-01'), hash: '', from: '', to: '', gasUsed: '', token: '' }
    ];
    expect(FA.findMostActiveDay(txs)).toBe('Thu Jun 01 2023');
  });
  it('calculateAverage returns correct average', () => {
        expect(FA['calculateAverage'](sampleTxs)).toBeCloseTo(116.666, 1);
  });

  it('calculateTotalSpent returns sum of outgoing', () => {
        expect(FA['calculateTotalSpent'](sampleTxs)).toBe(300);
  });

  it('calculateTotalReceived returns sum of incoming', () => {
        expect(FA['calculateTotalReceived'](sampleTxs)).toBe(50);
  });

  it('findMostActiveDay returns day with most txs', () => {
        expect(FA['findMostActiveDay'](sampleTxs)).toBe('Sun Jan 01 2023');
  });
});
