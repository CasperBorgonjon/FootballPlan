// Calorie + macro math for the nutrition planner. Pure functions, no React.
//
// Approach: Mifflin-St Jeor BMR → multiply by an activity factor for maintenance
// (TDEE) → shift by the athlete's goal. Protein and fat are anchored to bodyweight;
// carbs flex to fill the rest. Everything is returned as a { low, high } RANGE
// rather than a single number — a band is far easier to hit day to day than an
// exact target. Rest days carb-cycle down, the core principle the plan preaches.

export const SEXES = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
];

export const ACTIVITY_LEVELS = [
  { id: 'light', label: 'Light', factor: 1.375, hint: '1–2 sessions a week, otherwise mostly sitting.' },
  { id: 'moderate', label: 'Moderate', factor: 1.55, hint: '3–4 sessions a week. The typical amateur footballer.' },
  { id: 'high', label: 'High', factor: 1.725, hint: '5–6 sessions plus matches, or an active job.' },
  { id: 'athlete', label: 'Very high', factor: 1.9, hint: 'Twice-a-day training, or training on top of a physical job.' },
];

export const GOALS = [
  { id: 'cut', label: 'Lose fat', pct: -0.2, hint: 'Strip fat — ~20% under maintenance, protein kept high to hold muscle.' },
  { id: 'recomp', label: 'Lean & build', pct: -0.08, hint: 'Lose fat and add muscle together — a small deficit with high protein.' },
  { id: 'maintain', label: 'Maintain', pct: 0, hint: 'Hold weight, fuel performance and recovery.' },
  { id: 'gain', label: 'Build muscle', pct: 0.1, hint: 'Lean bulk — ~10% over maintenance to add size and strength.' },
];

// Protein/fat per kg of bodyweight as a range, how wide the calorie band is, and
// how far rest-day calories drop below a training day (the carb-cycle). Tuned for
// a hard-training footballer who wants to stay lean.
const PROTEIN_PER_KG = { low: 2.2, high: 2.6 };
const FAT_PER_KG = { low: 0.8, high: 1.0 };
const CALORIE_BAND = 0.035; // ±3.5% around the calorie centre
const REST_DAY_FACTOR = 0.82;

const round5 = (x) => Math.round(x / 5) * 5;
const round10 = (x) => Math.round(x / 10) * 10;

export const findActivity = (id) => ACTIVITY_LEVELS.find((a) => a.id === id) ?? ACTIVITY_LEVELS[1];
export const findGoal = (id) => GOALS.find((g) => g.id === id) ?? GOALS[2];

// Mifflin-St Jeor resting metabolic rate, in kcal/day.
export function bmr({ sex, age, height, weight }) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return sex === 'female' ? base - 161 : base + 5;
}

// Total daily energy expenditure — BMR scaled by how active you are.
export function tdee(profile, activityId) {
  return bmr(profile) * findActivity(activityId).factor;
}

// Build the { calories, protein, carbs, fat } ranges for a calorie centre.
// Protein and fat come straight off bodyweight. Carbs are the swing macro: they
// fill whatever calories are left, so the carb range tracks the calorie band.
function macroRange(calories, weight) {
  const protein = { low: round5(weight * PROTEIN_PER_KG.low), high: round5(weight * PROTEIN_PER_KG.high) };
  const fat = { low: round5(weight * FAT_PER_KG.low), high: round5(weight * FAT_PER_KG.high) };
  const proteinMid = (protein.low + protein.high) / 2;
  const fatMid = (fat.low + fat.high) / 2;

  const calLow = calories * (1 - CALORIE_BAND);
  const calHigh = calories * (1 + CALORIE_BAND);
  const carbAt = (cal) => Math.max(0, (cal - proteinMid * 4 - fatMid * 9) / 4);

  return {
    calories: { low: round10(calLow), high: round10(calHigh) },
    protein,
    carbs: { low: round5(carbAt(calLow)), high: round5(carbAt(calHigh)) },
    fat,
  };
}

// Is this profile complete enough to compute from?
export function isProfileComplete(p) {
  return !!(
    p &&
    Number(p.age) > 0 &&
    Number(p.height) > 0 &&
    Number(p.weight) > 0 &&
    !!p.sex
  );
}

// The headline result: maintenance plus a training-day and rest-day macro range.
// Returns null until the profile has enough to work with.
export function nutritionTargets(profile) {
  if (!isProfileComplete(profile)) return null;

  const p = {
    sex: profile.sex,
    age: Number(profile.age),
    height: Number(profile.height),
    weight: Number(profile.weight),
  };

  const maintenance = tdee(p, profile.activity);
  const goalPct = findGoal(profile.goal).pct;
  const trainingCalories = maintenance * (1 + goalPct);
  const restCalories = trainingCalories * REST_DAY_FACTOR;

  return {
    bmr: round10(bmr(p)),
    maintenance: round10(maintenance),
    training: macroRange(trainingCalories, p.weight),
    rest: macroRange(restCalories, p.weight),
  };
}
