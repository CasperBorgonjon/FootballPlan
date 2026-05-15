// 1RM formulas. Use whichever fits.
// Epley:    1RM = w * (1 + r/30)
// Brzycki:  1RM = w * 36 / (37 - r)
export const epley = (weight, reps) => weight * (1 + reps / 30);
export const brzycki = (weight, reps) => (weight * 36) / (37 - reps);

// Percentage table for a given 1RM (used by lifts → %).
export function percentages(oneRm, steps = [60, 65, 70, 75, 80, 85, 90, 95]) {
  return steps.map((pct) => ({ pct, weight: Math.round((oneRm * pct) / 100) }));
}
