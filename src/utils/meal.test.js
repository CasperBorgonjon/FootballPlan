import { describe, it, expect } from 'vitest';
import { kcalOf, sumMeal, macroStatus, proteinPlan } from './meal';
import { FOODS } from '../data/foods';

describe('kcalOf', () => {
  it('derives calories from macros (4/4/9)', () => {
    expect(kcalOf({ p: 30, c: 40, f: 10 })).toBe(30 * 4 + 40 * 4 + 10 * 9);
  });
  it('treats missing macros as zero', () => {
    expect(kcalOf({})).toBe(0);
  });
});

describe('sumMeal', () => {
  it('adds a single food to its own macros', () => {
    const t = sumMeal(['chicken_breast']);
    const f = FOODS.chicken_breast;
    expect(t).toEqual({ kcal: kcalOf(f), p: f.p, c: f.c, f: f.f });
  });
  it('counts duplicates', () => {
    const one = sumMeal(['eggs']);
    const two = sumMeal(['eggs', 'eggs']);
    expect(two.p).toBe(one.p * 2);
    expect(two.kcal).toBe(one.kcal * 2);
  });
  it('skips unknown ids', () => {
    expect(sumMeal(['not_a_food'])).toEqual({ kcal: 0, p: 0, c: 0, f: 0 });
  });
});

describe('macroStatus', () => {
  const range = { low: 100, high: 150 };
  it('flags below the low end as under', () => {
    expect(macroStatus(80, range).status).toBe('under');
  });
  it('flags inside the band as in', () => {
    expect(macroStatus(120, range).status).toBe('in');
  });
  it('flags past the high end as over', () => {
    expect(macroStatus(170, range).status).toBe('over');
  });
  it('caps the progress fraction at 1', () => {
    expect(macroStatus(300, range).pct).toBe(1);
  });
});

describe('proteinPlan', () => {
  it('adds portions until it reaches the target low end', () => {
    const { picks, protein } = proteinPlan(60, ['eggs', 'greek_yogurt']);
    expect(protein).toBeGreaterThanOrEqual(60);
    expect(picks.length).toBeGreaterThan(0);
  });
  it('rotates through the staples rather than repeating one', () => {
    const { picks } = proteinPlan(100, ['chicken_breast', 'eggs']);
    expect(new Set(picks).size).toBeGreaterThan(1);
  });
  it('terminates safely if a target can never be met', () => {
    // staples with tiny protein + an unreachable target → bounded by the 40 cap
    const { picks } = proteinPlan(99999, ['berries']);
    expect(picks.length).toBeLessThanOrEqual(40);
  });
});
