// Date + weekday helpers shared by the calendar engine (schedule.js) and the
// UI. Kept in one place so a timezone / off-by-one fix lands everywhere at once.

// Parse a 'YYYY-MM-DD' string (or Date) into a local Date at midnight, so day
// math isn't thrown off by timezones / DST.
export function toLocalDate(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const [y, m, d] = String(value).split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Monday-indexed weekday (MON=0 … SUN=6) to match the plan's day order.
export function weekdayIndex(date = new Date()) {
  return (toLocalDate(date).getDay() + 6) % 7;
}

// Plan day keys → Monday-first index, and → short display label.
export const DAY_TO_INDEX = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };
export const DAY_SHORT = { MON: 'Mon', TUE: 'Tue', WED: 'Wed', THU: 'Thu', FRI: 'Fri', SAT: 'Sat', SUN: 'Sun' };
