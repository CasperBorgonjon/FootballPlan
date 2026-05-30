import { describe, it, expect } from 'vitest';
import { generateProgram } from './programGenerator';

const findDay = (phase, label) => phase.days.find((d) => d.label === label);
const findEx = (day, name) => day.exercises.find((e) => e.name === name);

describe('generateProgram — linear (pre-season)', () => {
  const prog = generateProgram({
    seasonPhase: 'pre', daysPerWeek: 4,
    equipment: ['Barbell', 'Dumbbell', 'Band', 'None'],
  });

  it('is a linear program with deload weeks interleaved', () => {
    expect(prog.type).toBe('linear');
    const phases = prog.structure.phases;
    // base, deload, strength, deload, speed
    expect(phases).toHaveLength(5);
    expect(phases[1].deload).toBe(true);
    expect(phases[3].deload).toBe(true);
    expect(phases[1].weeks.start).toBe(4);
    expect(phases[3].weeks.start).toBe(8);
  });

  it('week numbering is contiguous across phases and deloads', () => {
    const weeks = prog.structure.phases.flatMap((p) =>
      Array.from({ length: p.weeks.end - p.weeks.start + 1 }, (_, i) => p.weeks.start + i));
    expect(weeks).toEqual(Array.from({ length: weeks.length }, (_, i) => i + 1));
  });

  it('deload cuts volume on the main lift but keeps reps', () => {
    const base = findDay(prog.structure.phases[0], 'Lower Strength');
    const deload = findDay(prog.structure.phases[1], 'Lower Strength');
    const baseSquat = findEx(base, 'Back Squat');
    const deloadSquat = findEx(deload, 'Back Squat');
    expect(Number(deloadSquat.sets)).toBeLessThan(Number(baseSquat.sets));
    expect(deloadSquat.reps).toBe(baseSquat.reps);
  });

  it('phases genuinely differ: the speed phase trims strength volume', () => {
    const baseLower = findDay(prog.structure.phases[0], 'Lower Strength');
    const speedLower = findDay(prog.structure.phases[4], 'Lower Strength');
    expect(speedLower.exercises.length).toBeLessThan(baseLower.exercises.length);
  });

  it('rep scheme on the main lift shifts base → strength → speed', () => {
    const reps = (i) => findEx(findDay(prog.structure.phases[i], 'Lower Strength'), 'Back Squat').reps;
    expect(reps(0)).toBe('10'); // base
    expect(reps(2)).toBe('5');  // strength
    expect(reps(4)).toBe('3');  // speed
  });
});

describe('generateProgram — position emphasis', () => {
  const opts = { seasonPhase: 'pre', daysPerWeek: 4, equipment: ['Barbell', 'Dumbbell', 'Band', 'None'] };
  const speedDayLen = (position) => {
    const prog = generateProgram({ ...opts, position });
    return findDay(prog.structure.phases[0], 'Speed & Acceleration').exercises.length;
  };

  it('a winger gets extra speed work vs no position', () => {
    expect(speedDayLen('Winger')).toBeGreaterThan(speedDayLen(null));
  });

  it('position adds a coach note explaining the emphasis', () => {
    const prog = generateProgram({ ...opts, position: 'Goalkeeper' });
    expect(prog.structure.coachNotes.join(' ')).toMatch(/goalkeeper/i);
  });
});

describe('generateProgram — weakness prehab', () => {
  it('weaves a hamstring exercise into lower days', () => {
    const prog = generateProgram({ seasonPhase: 'pre', daysPerWeek: 4, equipment: ['Barbell', 'Dumbbell'], weakness: 'hamstring' });
    const lower = findDay(prog.structure.phases[0], 'Lower Strength');
    expect(findEx(lower, 'Single-leg RDL')).toBeTruthy();
  });
});

describe('generateProgram — in-season', () => {
  const prog = generateProgram({ seasonPhase: 'in', daysPerWeek: 4, equipment: ['Dumbbell', 'Band'] });

  it('is a single repeating maintenance week with no deload', () => {
    expect(prog.type).toBe('repeating');
    expect(prog.structure.phases).toHaveLength(1);
    expect(prog.structure.phases[0].deload).toBeUndefined();
  });

  it('trims each day to its essentials', () => {
    for (const d of prog.structure.phases[0].days) {
      expect(d.exercises.length).toBeLessThanOrEqual(4);
    }
  });
});

describe('generateProgram — no duplicate drills within a day', () => {
  it('never lists the same exercise twice in one day, even with sparse kit', () => {
    const prog = generateProgram({ seasonPhase: 'pre', daysPerWeek: 6, equipment: [] });
    for (const phase of prog.structure.phases) {
      for (const day of phase.days) {
        const names = day.exercises.map((e) => e.name);
        expect(new Set(names).size).toBe(names.length);
      }
    }
  });
});
