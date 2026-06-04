import { describe, it, expect } from 'vitest';
import { bmr, tdee, nutritionTargets, isProfileComplete } from './calories';

// Reference athlete: 20yo male, 180cm, 75kg.
const athlete = { sex: 'male', age: 20, height: 180, weight: 75 };

describe('bmr (Mifflin-St Jeor)', () => {
  it('computes the male formula', () => {
    // 10*75 + 6.25*180 - 5*20 + 5 = 750 + 1125 - 100 + 5 = 1780
    expect(bmr(athlete)).toBe(1780);
  });
  it('applies the female offset', () => {
    // male 1780 → female is 166 lower (+5 becomes -161)
    expect(bmr({ ...athlete, sex: 'female' })).toBe(1780 - 166);
  });
});

describe('tdee', () => {
  it('scales BMR by the activity factor', () => {
    // 1780 * 1.55 (moderate)
    expect(tdee(athlete, 'moderate')).toBeCloseTo(1780 * 1.55);
  });
  it('falls back to moderate for an unknown activity id', () => {
    expect(tdee(athlete, 'nonsense')).toBeCloseTo(1780 * 1.55);
  });
});

describe('isProfileComplete', () => {
  it('rejects missing fields', () => {
    expect(isProfileComplete({ age: 20, height: 180 })).toBe(false);
    expect(isProfileComplete(null)).toBe(false);
  });
  it('accepts a full profile', () => {
    expect(isProfileComplete(athlete)).toBe(true);
  });
});

describe('nutritionTargets', () => {
  it('returns null for an incomplete profile', () => {
    expect(nutritionTargets({ age: 20 })).toBe(null);
  });

  it('returns every macro as a low–high range', () => {
    const t = nutritionTargets({ ...athlete, activity: 'moderate', goal: 'recomp' });
    for (const day of [t.training, t.rest]) {
      for (const macro of [day.calories, day.protein, day.carbs, day.fat]) {
        expect(macro.low).toBeLessThanOrEqual(macro.high);
      }
    }
  });

  it('holds protein constant across day types', () => {
    const t = nutritionTargets({ ...athlete, activity: 'moderate', goal: 'maintain' });
    // protein is bodyweight-driven, so it doesn't change with the carb-cycle
    expect(t.training.protein).toEqual(t.rest.protein);
    // 75kg at 2.2–2.6 g/kg → ~165–195g
    expect(t.training.protein.low).toBe(165);
    expect(t.training.protein.high).toBe(195);
  });

  it('carb-cycles rest days below training days', () => {
    const t = nutritionTargets({ ...athlete, activity: 'moderate', goal: 'maintain' });
    expect(t.rest.carbs.high).toBeLessThan(t.training.carbs.high);
    expect(t.rest.calories.high).toBeLessThan(t.training.calories.high);
  });

  it('raises calories for a build goal vs a cut', () => {
    const gain = nutritionTargets({ ...athlete, activity: 'moderate', goal: 'gain' });
    const cut = nutritionTargets({ ...athlete, activity: 'moderate', goal: 'cut' });
    expect(gain.training.calories.low).toBeGreaterThan(cut.training.calories.high);
  });

  it('never returns negative carbs', () => {
    // tiny, very light person → low calories, but carbs floor at 0 not below
    const t = nutritionTargets({ sex: 'female', age: 60, height: 150, weight: 45, activity: 'light', goal: 'cut' });
    expect(t.training.carbs.low).toBeGreaterThanOrEqual(0);
    expect(t.rest.carbs.low).toBeGreaterThanOrEqual(0);
  });
});
