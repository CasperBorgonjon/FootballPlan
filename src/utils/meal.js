// Meal-building math: tally a list of foods and measure it against a macro target.
// Pure functions over the FOODS database. No React.

import { FOODS } from '../data/foods';

// kcal from macros — derived, never stored, so it can't drift from p/c/f.
export const kcalOf = ({ p = 0, c = 0, f = 0 }) => p * 4 + c * 4 + f * 9;

// Sum a list of food ids (duplicates allowed — two chicken breasts = added twice)
// into a single { kcal, p, c, f } total. Unknown ids are skipped.
export function sumMeal(ids) {
  const total = { kcal: 0, p: 0, c: 0, f: 0 };
  for (const id of ids) {
    const food = FOODS[id];
    if (!food) continue;
    total.p += food.p;
    total.c += food.c;
    total.f += food.f;
    total.kcal += kcalOf(food);
  }
  return total;
}

// How a tally sits against a { low, high } target range: a fraction of the way to
// the TOP of the range (so 1 = you've hit the high end), plus a status flag.
//  under  — below the low end
//  in     — inside the band (the sweet spot)
//  over   — past the high end
export function macroStatus(value, range) {
  if (!range) return { pct: 0, status: 'under' };
  const pct = range.high ? value / range.high : 0;
  let status = 'in';
  if (value < range.low) status = 'under';
  else if (value > range.high) status = 'over';
  return { pct: Math.min(1, pct), status };
}

// Greedy "how do I hit my protein" helper: keep adding portions of a staple until
// the running protein total reaches the target's low end. Returns the picks plus
// the protein they deliver. Used by the protein helper to turn a number into food.
export function proteinPlan(targetLow, staples) {
  const picks = [];
  let protein = 0;
  // round-robin through the staples so the suggestion is varied, not 9x eggs
  let i = 0;
  while (protein < targetLow && i < 40) {
    const id = staples[i % staples.length];
    const food = FOODS[id];
    if (food) {
      picks.push(id);
      protein += food.p;
    }
    i += 1;
  }
  return { picks, protein };
}
