// Calendar engine — pure functions, no React, no Supabase.
//
// A program is { id, type: 'linear'|'repeating', start_date, end_date,
//   structure: { phases, coachNotes, focusColors } }.
// Positioning is calendar-driven: "what do I do today" is derived from the
// program's start_date, never from a stored week counter.

// Parse a 'YYYY-MM-DD' (or Date) into a local date at midnight, so day math
// isn't thrown off by timezones / DST.
function toLocalDate(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const [y, m, d] = String(value).split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Whole days from a to b (b - a). Negative if b is before a.
export function daysBetween(a, b) {
  const ms = toLocalDate(b) - toLocalDate(a);
  return Math.round(ms / 86400000);
}

// 'YYYY-MM-DD' for a Date (local), for writing date columns.
export function toISODate(date) {
  const d = toLocalDate(date);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// 'YYYY-MM-DD' n days after the given date.
export function addDays(date, n) {
  const d = toLocalDate(date);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

// Monday-indexed weekday (MON=0 … SUN=6) to match the plan's day order.
export function weekdayIndex(date = new Date()) {
  return (toLocalDate(date).getDay() + 6) % 7;
}

export function phasesOf(program) {
  return program?.structure?.phases ?? [];
}

// Linear programs end at the last phase's last week. Repeating programs have
// no fixed length — their span comes from the scheduled date range.
export function getTotalWeeks(program) {
  if (!program) return 0;
  if (program.type === 'repeating') {
    if (!program.start_date || !program.end_date) return 0;
    return Math.max(1, Math.ceil((daysBetween(program.start_date, program.end_date) + 1) / 7));
  }
  const phases = phasesOf(program);
  return phases.length ? phases.at(-1).weeks.end : 0;
}

// Which phase index a given week falls into. Falls back to the last phase.
export function getPhaseForWeek(program, week) {
  const phases = phasesOf(program);
  const idx = phases.findIndex((p) => week >= p.weeks.start && week <= p.weeks.end);
  return idx === -1 ? Math.max(0, phases.length - 1) : idx;
}

// The program scheduled across `date` (start_date..end_date inclusive). If
// several overlap, the most recently started one wins — so scheduling a new
// block takes over from an older one still nominally running.
export function resolveActiveProgram(programs, date = new Date()) {
  if (!programs?.length) return null;
  const covering = programs.filter(
    (p) =>
      p.start_date &&
      p.end_date &&
      daysBetween(p.start_date, date) >= 0 &&
      daysBetween(date, p.end_date) >= 0
  );
  if (!covering.length) return null;
  return covering.reduce((latest, p) =>
    daysBetween(latest.start_date, p.start_date) > 0 ? p : latest
  );
}

// Where `date` lands inside a scheduled program: { week, phaseIndex, dayIndex }.
// Returns null for an unscheduled (draft) program.
export function resolvePosition(program, date = new Date()) {
  if (!program?.start_date) return null;
  const daysSince = Math.max(0, daysBetween(program.start_date, date));
  const dayIndex = weekdayIndex(date);
  const rawWeek = Math.floor(daysSince / 7) + 1;

  if (program.type === 'repeating') {
    return { week: rawWeek, phaseIndex: 0, dayIndex };
  }
  const week = Math.min(Math.max(1, rawWeek), getTotalWeeks(program));
  return { week, phaseIndex: getPhaseForWeek(program, week), dayIndex };
}
