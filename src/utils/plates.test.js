import { describe, it, expect } from 'vitest';
import { platesPerSide, groupPlates, warmupRamp } from './plates';

describe('platesPerSide', () => {
  it('decomposes a clean load into plates per side', () => {
    // 100kg on a 20kg bar → 40kg per side → 25 + 15
    expect(platesPerSide(100, 20).perSide).toEqual([25, 15]);
  });
  it('uses multiple of the same plate', () => {
    // 140kg, 20 bar → 60 per side → 25 + 25 + 10
    expect(platesPerSide(140, 20).perSide).toEqual([25, 25, 10]);
  });
  it('flags a load it cannot make exactly', () => {
    const r = platesPerSide(101, 20); // 40.5 per side → 25+15, 0.5 short
    expect(r.remainder).toBeCloseTo(0.5);
  });
  it('returns just the bar for bar-weight input', () => {
    expect(platesPerSide(20, 20)).toEqual({ ok: true, perSide: [], remainder: 0 });
  });
  it('rejects loads below the bar', () => {
    expect(platesPerSide(15, 20).ok).toBe(false);
  });
});

describe('groupPlates', () => {
  it('collapses runs into plate + count', () => {
    expect(groupPlates([25, 25, 10])).toEqual([{ plate: 25, count: 2 }, { plate: 10, count: 1 }]);
  });
});

describe('warmupRamp', () => {
  it('ramps bar → 40 → 60 → 80% of the working weight', () => {
    const ramp = warmupRamp(100, 20).map((s) => s.weight);
    expect(ramp).toEqual([20, 40, 60, 80]);
  });
  it('is empty when the work weight is at/below the bar', () => {
    expect(warmupRamp(20, 20)).toEqual([]);
  });
});
