// Coaching logic derived from the fullback training reference.
// Pure functions: turn the day's variables (readiness, match position,
// equipment, goal) into guidance. No React, no IO.

// ── Readiness / auto-regulation ──────────────────────────────────
// checkin: { sleep_hours, legs: 'fresh'|'normal'|'heavy', energy: 'low'|'ok'|'good' }
export function readinessFrom(checkin) {
  if (!checkin || checkin.sleep_hours == null || checkin.sleep_hours === '') return null;
  const s = Number(checkin.sleep_hours);
  const sleepPts = s >= 8 ? 2 : s >= 6 ? 1 : 0;
  const legsPts = { fresh: 2, normal: 1, heavy: 0 }[checkin.legs] ?? 1;
  const energyPts = { good: 2, ok: 1, low: 0 }[checkin.energy] ?? 1;
  const total = sleepPts + legsPts + energyPts;
  let level = total >= 5 ? 'green' : total >= 3 ? 'amber' : 'red';
  // Hard caps — poor sleep or heavy legs never reads as fully green.
  if ((s < 6 || checkin.legs === 'heavy') && level === 'green') level = 'amber';
  return { level, total };
}

// programType: 'linear' (build-up) | 'repeating' (in-season)
export function recommendation(level, programType, match) {
  const inSeason = programType === 'repeating';
  let title, text;
  if (level === 'green') {
    title = 'Good to go';
    text = inSeason
      ? 'Hit your sets with explosive intent, 1–2 reps in reserve. No training to failure in a match week.'
      : 'Push for progression — add a little load, a rep, or a set on your main lifts.';
  } else if (level === 'amber') {
    title = 'Trim it';
    text = 'Train, but drop a set and keep the intensity. Quality over volume today.';
  } else {
    title = 'Back off';
    text = inSeason
      ? 'Primary lift light or skip it. Never rob the match for a maintenance session.'
      : 'Cut volume ~40% and keep it light, or take the rest day. Recovery is where you adapt.';
  }
  let note = null;
  if (match) {
    if (match.phase === 'taper') note = 'Match tomorrow — keep today light and sharp. Two good nights of sleep matter most now.';
    else if (match.phase === 'match') note = 'Match day. Fuel, hydrate, warm up properly — this is what the week is for.';
    else if (match.phase === 'recovery') note = 'Day after the match — easy recovery only, flush the legs.';
  }
  return { title, text, note };
}

// ── Match-week position ──────────────────────────────────────────
// Given the index of the match day in the week (Mon=0..Sun=6) and a day's
// index, return its position relative to the match.
export function matchPosition(dayIndex, matchDayIndex) {
  if (matchDayIndex == null || matchDayIndex < 0) return null;
  const off = dayIndex - matchDayIndex;
  if (off === 0) return { label: 'Match day', phase: 'match' };
  if (off === -1) return { label: 'MD-1 · Taper', phase: 'taper' };
  if (off === 1) return { label: 'MD+1 · Recovery', phase: 'recovery' };
  if (off < 0) return { label: `MD${off}`, phase: 'build' };
  return { label: `MD+${off}`, phase: 'normal' };
}

// Find which day of a phase holds the match commitment (-1 if none).
export function matchDayIndexOf(days) {
  return days.findIndex((d) => d.commitments?.some((c) => c.type === 'match'));
}

// ── Rest between sets, from goal ─────────────────────────────────
export function suggestedRest(focus, reps) {
  const r = parseInt(reps, 10);
  switch (focus) {
    case 'Speed': return 240;       // max velocity — full recovery
    case 'Power': return 180;       // jumps / explosive — never rush
    case 'Strength': return !Number.isNaN(r) && r <= 5 ? 180 : 90;
    case 'Endurance': return 45;    // conditioning — short rest is the point
    default: return 90;
  }
}

export function restLabel(sec) {
  if (sec >= 120) return `${Math.round(sec / 60)} min`;
  return `${sec}s`;
}

// ── Auto-regulated progression ───────────────────────────────────
// Suggest the next working weight from the last logged set + today's readiness
// level ('green'|'amber'|'red'|null). Conservative on purpose:
//   • green / no check-in → add a little load, but only if last reps were hit;
//   • amber → hold; red → back off ~10%.
// Returns null for non-weighted, time/distance work (sprints, planks) or when
// there's no usable weight history. `last` is { weight, reps } from the log.
export function suggestProgression(last, level, targetReps) {
  if (!last || last.weight == null || last.weight === '') return null;
  const w = parseFloat(String(last.weight).replace(',', '.'));
  if (!Number.isFinite(w) || w <= 0) return null;
  const target = parseInt(targetReps, 10);
  if (!Number.isFinite(target)) return null; // time/distance — no load progression

  const round = (x) => Math.round(x / 2.5) * 2.5;
  const lastReps = parseInt(last.reps, 10);
  const hitReps = !Number.isFinite(lastReps) || lastReps >= target;

  if (level === 'red') return { dir: 'down', weight: round(w * 0.9), reason: 'low readiness — back off' };
  if (level === 'amber') return { dir: 'hold', weight: w, reason: 'keep it steady today' };
  if (!hitReps) return { dir: 'hold', weight: w, reason: 'repeat — hit all your reps first' };
  return { dir: 'up', weight: round(w + 2.5), reason: 'add a little load' };
}
