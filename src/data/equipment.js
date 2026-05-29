// Equipment awareness, per the reference's "plan around your equipment calendar".
//
// Principle: equipment availability changes the *type* of stimulus, not whether
// you train. Strength is built with a barbell and maintained with almost
// anything as long as intent stays high.
//
// Full kit = weekends + the winter break. Portable kit = weekdays the rest of
// the season. On a portable day, barbell lifts get flagged with a swap.
//
// Detection is name-based so it works on the programs already in Supabase
// without a reseed. Edit the swaps / winter dates here as needed.

const BARBELL_SWAPS = {
  'Back Squat': 'Goblet squat or Bulgarian split squat (DB)',
  'Front Squat': 'Goblet squat (DB)',
  'Romanian Deadlift': 'Single-leg RDL or DB RDL',
  'Barbell Bench Press': 'DB floor / bench press, or weighted push-ups',
  'Barbell Row': 'DB row or band row',
};

export function equipmentInfo(exerciseName) {
  const swap = BARBELL_SWAPS[exerciseName];
  return swap ? { needsBarbell: true, swap } : { needsBarbell: false, swap: null };
}

// Winter break — a mini full-equipment build block. Edit to your real dates.
export const WINTER_BREAK = { start: '2026-12-15', end: '2027-01-11' };

function toLocal(value) {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  const [y, m, d] = String(value).split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Full kit available on this date? Weekend (Sat/Sun) or inside the winter break.
export function isFullKit(date, winter = WINTER_BREAK) {
  const d = toLocal(date);
  const weekday = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
  if (weekday >= 5) return true;
  const start = toLocal(winter.start);
  const end = toLocal(winter.end);
  return d >= start && d <= end;
}
