import { describe, it, expect } from 'vitest';
import {
  daysBetween, toISODate, addDays, weekdayIndex,
  getTotalWeeks, getPhaseForWeek, resolveActiveProgram, resolvePosition,
} from './schedule';

// 2026-01-05 is a Monday — used as a clean week-aligned anchor throughout.
const MON = '2026-01-05';

const linear = {
  id: 'lin', type: 'linear', start_date: MON, end_date: '2026-03-15',
  structure: { phases: [
    { weeks: { start: 1, end: 3 } },
    { weeks: { start: 4, end: 6 } },
    { weeks: { start: 7, end: 10 } },
  ] },
};

const repeating = {
  id: 'rep', type: 'repeating', start_date: MON, end_date: '2026-08-01',
  structure: { phases: [{ weeks: { start: 1, end: 1 } }] },
};

describe('date helpers', () => {
  it('daysBetween counts whole days, signed', () => {
    expect(daysBetween(MON, '2026-01-12')).toBe(7);
    expect(daysBetween('2026-01-12', MON)).toBe(-7);
    expect(daysBetween(MON, MON)).toBe(0);
  });

  it('addDays / toISODate round-trip across a month boundary', () => {
    expect(addDays('2026-01-30', 3)).toBe('2026-02-02');
    expect(toISODate(new Date(2026, 0, 5))).toBe(MON);
  });

  it('weekdayIndex is Monday-first (MON=0 … SUN=6)', () => {
    expect(weekdayIndex(MON)).toBe(0);
    expect(weekdayIndex('2026-01-11')).toBe(6); // the Sunday after
  });
});

describe('getTotalWeeks', () => {
  it('linear = last phase end week', () => {
    expect(getTotalWeeks(linear)).toBe(10);
  });
  it('repeating = scheduled span in weeks', () => {
    const r = { ...repeating, start_date: MON, end_date: '2026-01-18' }; // 14 days
    expect(getTotalWeeks(r)).toBe(2);
  });
  it('null program = 0', () => {
    expect(getTotalWeeks(null)).toBe(0);
  });
});

describe('getPhaseForWeek', () => {
  it('maps weeks to their phase index', () => {
    expect(getPhaseForWeek(linear, 1)).toBe(0);
    expect(getPhaseForWeek(linear, 4)).toBe(1);
    expect(getPhaseForWeek(linear, 9)).toBe(2);
  });
  it('falls back to last phase when out of range', () => {
    expect(getPhaseForWeek(linear, 99)).toBe(2);
  });
});

describe('resolveActiveProgram', () => {
  it('returns null with no programs', () => {
    expect(resolveActiveProgram([], MON)).toBeNull();
    expect(resolveActiveProgram(null, MON)).toBeNull();
  });
  it('returns the single covering program', () => {
    expect(resolveActiveProgram([linear], '2026-01-20')?.id).toBe('lin');
  });
  it('ignores programs that do not cover the date', () => {
    expect(resolveActiveProgram([linear], '2025-12-01')).toBeNull();
  });
  it('on overlap, the most recently started program wins', () => {
    const older = { ...linear, id: 'older', start_date: '2026-01-01', end_date: '2026-06-01' };
    const newer = { ...linear, id: 'newer', start_date: '2026-01-10', end_date: '2026-06-01' };
    expect(resolveActiveProgram([older, newer], '2026-02-01')?.id).toBe('newer');
  });
});

describe('resolvePosition', () => {
  it('returns null for an unscheduled program', () => {
    expect(resolvePosition({ ...linear, start_date: null })).toBeNull();
  });
  it('linear: week + phase advance with the calendar', () => {
    expect(resolvePosition(linear, MON)).toMatchObject({ week: 1, phaseIndex: 0, dayIndex: 0 });
    expect(resolvePosition(linear, '2026-01-26')).toMatchObject({ week: 4, phaseIndex: 1 }); // +21 days
  });
  it('linear: clamps week to the program length', () => {
    expect(resolvePosition(linear, '2026-12-01')).toMatchObject({ week: 10, phaseIndex: 2 });
  });
  it('repeating: week keeps counting, phase stays 0', () => {
    expect(resolvePosition(repeating, '2026-01-26')).toMatchObject({ week: 4, phaseIndex: 0 });
  });
});
