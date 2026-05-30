// Canonical domain vocabulary — the single source for the controlled strings
// the plan is built from. Import these instead of re-typing literals, so a typo
// (e.g. "Strenght") is a missing-reference error rather than a focus that
// silently has no color or a day that never matches.

// Training qualities a day can target. Must stay in sync with the keys of
// DEFAULT_FOCUS_COLORS below.
export const FOCUS_TYPES = ['Strength', 'Power', 'Speed', 'Endurance', 'Recovery'];

// Default color per focus, used when a program doesn't define its own.
export const DEFAULT_FOCUS_COLORS = {
  Strength: '#F59E0B', Endurance: '#38BDF8', Power: '#A78BFA',
  Speed: '#FB923C', Recovery: '#6EE7B7',
};

// Plan weekdays, Monday-first to match the training week.
export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
