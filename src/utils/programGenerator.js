// Program generator — turns a handful of athlete variables into a real,
// editable soccer program. Pure functions, no React, no IO. The output matches
// the program `structure` schema the editor and scheduler already consume:
//
//   { id, name, type, color, start_date, end_date,
//     structure: { focusColors, coachNotes, phases: [{ name, label, weeks,
//       weeksLabel, color, deload?, coachNote?, days: [{ day, label, focus,
//       coachNote?, exercises: [{ id, name, sets, reps, note }] }] }] } }
//
// The design encodes the principles from the Guide tab:
//  - a periodised base → strength → power/speed arc, where each phase genuinely
//    differs (split, volume, and rep scheme change — not just the reps);
//  - a planned deload week after each build block;
//  - speed/power on fresh days, conditioning kept away from heavy lifting;
//  - rep schemes matched to the quality;
//  - prehab driven by the athlete's named weakness;
//  - position-specific emphasis on the relevant day.

import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { DEFAULT_FOCUS_COLORS } from '../data/domain';

const genId = () => `ex_${Math.random().toString(36).slice(2, 9)}`;

// Bodyweight needs no kit, so it's always on the menu. Everything else is
// gated by what the athlete actually has. 'None' is the running/sprints tag.
function isAvailable(ex, equipment) {
  if (ex.equipment === 'Bodyweight') return true;
  return equipment.includes(ex.equipment);
}

// Pick the first library exercise matching a slot that hasn't been used yet
// (the `used` set is shared across the whole week, so days stay varied and a
// drill never repeats). Returns null rather than repeating — better a slightly
// shorter session the athlete fills in than the same drill listed twice.
function pickExercise(slot, equipment, used) {
  const pool = EXERCISE_LIBRARY.filter((ex) => {
    if (!isAvailable(ex, equipment)) return false;
    if (slot.name) return ex.name === slot.name;
    if (slot.muscle && !slot.muscle.includes(ex.muscle)) return false;
    if (slot.type && !slot.type.includes(ex.type)) return false;
    return true;
  });
  return pool.find((ex) => !used.has(ex.id)) ?? null;
}

// Rep scheme for the main compound lifts, by phase. Accessories and prehab keep
// the library's own prescription. This is "reps set the quality" from the Guide.
const PRIMARY_SCHEME = {
  base:     { sets: '3', reps: '10', note: 'moderate load, 2 reps in reserve — build the base' },
  strength: { sets: '4', reps: '5',  note: 'heavy, ~80%, long rest — maximal force' },
  speed:    { sets: '4', reps: '3',  note: 'explosive intent, move the bar fast' },
  inseason: { sets: '3', reps: '4',  note: 'maintain, don’t chase — leave legs for the game' },
};

// Conditioning swaps from aerobic base early to match-specific repeated sprints
// late, mirroring the periodization arc. Several options per phase so a second
// conditioning day (or a midfielder's extra) gets a different session.
const COND_BY_PHASE = {
  base:     ['Easy Run', 'Tempo Run', 'Strides'],
  strength: ['Tempo Run', '30-30 Intervals', 'Hill Sprints'],
  speed:    ['Repeated Sprints (RSA)', 'Hill Sprints', '10-10-10 Run'],
  inseason: ['10-10-10 Run', 'Repeated Sprints (RSA)'],
};

// A "day kind" → its focus tag, label, coaching rationale and slot recipe.
const DAY_KINDS = {
  speed: {
    focus: 'Speed', label: 'Speed & Acceleration',
    note: 'Legs fresh — this is where you get faster. Full recovery between reps; tired sprinting trains slowness.',
    // Sprint drills are the goal; the Power fallback (bodyweight jumps) only
    // gets picked when the athlete has no field/sprints access.
    slots: [
      { name: 'A-skip' },
      { muscle: ['Speed & Agility'], type: ['Speed', 'Power'], role: 'speed' },
      { muscle: ['Speed & Agility'], type: ['Speed', 'Power'], role: 'speed' },
      { muscle: ['Speed & Agility'], type: ['Speed'], role: 'agility' },
      { muscle: ['Speed & Agility'], type: ['Power'], role: 'power' },
    ],
  },
  lower: {
    focus: 'Strength', label: 'Lower Strength',
    note: 'Placed away from your speed day. Heavy, low-rep, long rest — quality over fatigue.',
    slots: [
      { muscle: ['Quads & Legs'], type: ['Strength'], role: 'primary' },
      { muscle: ['Hamstrings'], type: ['Strength'], role: 'primary' },
      { muscle: ['Glutes & Hips'], type: ['Strength', 'Prehab'], role: 'accessory' },
      { name: 'Nordic Hamstring Curl' },
      { muscle: ['Calves'], role: 'accessory' },
      { muscle: ['Core'], role: 'core' },
    ],
  },
  upper: {
    focus: 'Strength', label: 'Upper Strength',
    note: 'Balances the lower-body work and keeps you robust in contact.',
    slots: [
      { muscle: ['Upper Push'], type: ['Strength'], role: 'primary' },
      { muscle: ['Upper Pull'], type: ['Strength'], role: 'primary' },
      { muscle: ['Upper Push', 'Upper Pull'], type: ['Strength'], role: 'accessory' },
      { name: 'Copenhagen Plank' },
      { muscle: ['Core'], role: 'core' },
    ],
  },
  power: {
    focus: 'Power', label: 'Power & Plyometrics',
    note: 'Strength made fast — jumps and bounds moved with max intent. Stop before quality drops.',
    slots: [
      { muscle: ['Speed & Agility'], type: ['Power'], role: 'power' },
      { muscle: ['Speed & Agility'], type: ['Power'], role: 'power' },
      { name: 'Pogo Hops' },
      { muscle: ['Core'], role: 'core' },
    ],
  },
  conditioning: {
    focus: 'Endurance', label: 'Conditioning',
    note: 'The 90-minute engine. Kept off your speed and strength days so it doesn’t blunt them.',
    slots: [{ role: 'cond' }, { role: 'cond' }],
  },
  recovery: {
    focus: 'Recovery', label: 'Recovery & Mobility',
    note: 'An active choice, not a day off. Clears fatigue so the hard days land harder.',
    slots: [
      { muscle: ['Mobility'], role: 'mob' },
      { name: 'Foam Roll' },
      { name: 'Couch Stretch' },
    ],
  },
};

// Per-phase weekly split. Phases genuinely differ: base front-loads
// conditioning and holds back power; strength introduces the power day; the
// speed/peak phase adds sprint/power volume and drops a conditioning day. The
// shared week-used set means a repeated kind (e.g. two speed days) still picks
// different drills.
const PHASE_SPLITS = {
  3: {
    base:     ['speed', 'lower', 'conditioning'],
    strength: ['speed', 'lower', 'upper'],
    speed:    ['speed', 'power', 'lower'],
  },
  4: {
    base:     ['speed', 'lower', 'upper', 'conditioning'],
    strength: ['speed', 'lower', 'upper', 'conditioning'],
    speed:    ['speed', 'power', 'lower', 'upper'],
  },
  5: {
    base:     ['speed', 'lower', 'upper', 'conditioning', 'conditioning'],
    strength: ['speed', 'lower', 'power', 'upper', 'conditioning'],
    speed:    ['speed', 'power', 'speed', 'lower', 'upper'],
  },
  6: {
    base:     ['speed', 'lower', 'upper', 'conditioning', 'conditioning', 'recovery'],
    strength: ['speed', 'lower', 'power', 'upper', 'conditioning', 'recovery'],
    speed:    ['speed', 'power', 'speed', 'lower', 'upper', 'recovery'],
  },
};

// Spread sessions across the week with rest between hard days.
const WEEKDAYS = {
  3: ['MON', 'WED', 'FRI'],
  4: ['MON', 'TUE', 'THU', 'SAT'],
  5: ['MON', 'TUE', 'THU', 'FRI', 'SAT'],
  6: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
};

// Weakness → an extra prehab exercise woven into the relevant day kinds.
const WEAKNESS_PREHAB = {
  hamstring: { name: 'Single-leg RDL', on: ['lower'] },
  groin:     { name: 'Band Adduction', on: ['lower', 'upper'] },
  ankle:     { name: 'Single-Leg Calf Raise', on: ['lower', 'speed'] },
  aerobic:   null, // handled by adding a conditioning day in buildCoachNotes context
};

// Position → an extra emphasis slot on the day that matters most for the role,
// plus a one-line rationale. This is what makes the position input actually
// change the program rather than just annotate it.
const POSITION_EMPHASIS = {
  Fullback:    { day: 'speed', slot: { muscle: ['Speed & Agility'], type: ['Speed'], role: 'speed' }, note: 'Fullback: among the highest sprint distances on the pitch — extra max-speed work.' },
  Winger:      { day: 'speed', slot: { muscle: ['Speed & Agility'], type: ['Speed'], role: 'speed' }, note: 'Winger: repeated max sprints win your duels — extra acceleration volume.' },
  Striker:     { day: 'power', slot: { muscle: ['Speed & Agility'], type: ['Power'], role: 'power' }, note: 'Striker: first-step and jump power decide chances — extra explosive work.' },
  Midfielder:  { day: 'conditioning', slot: { role: 'cond' }, note: 'Midfielder: the biggest engine on the team — extra conditioning.' },
  'Centre-back': { day: 'lower', slot: { muscle: ['Quads & Legs', 'Glutes & Hips'], type: ['Strength'], role: 'accessory' }, note: 'Centre-back: strength and aerial power for duels — extra lower-body work.' },
  Goalkeeper:  { day: 'upper', slot: { muscle: ['Upper Push', 'Upper Pull'], type: ['Strength'], role: 'accessory' }, note: 'Goalkeeper: pressing and pulling strength plus reactive power — extra upper work.' },
};

function exFromLib(lib, override = {}) {
  if (!lib) return null;
  return {
    id: genId(),
    name: lib.name,
    sets: override.sets ?? lib.sets,
    reps: override.reps ?? lib.reps,
    note: override.note ?? lib.note,
  };
}

// Build one day's exercise list for a given phase scheme. `used` is shared
// across the week so drills don't repeat day to day.
function buildDay(kind, phaseKey, equipment, weakness, position, weekday, used) {
  const def = DAY_KINDS[kind];
  const exercises = [];

  let slots = def.slots;
  // Weave in the weakness prehab on the days it belongs to.
  const wk = WEAKNESS_PREHAB[weakness];
  if (wk && wk.on.includes(kind)) slots = [...slots, { name: wk.name }];
  // Add the position emphasis on its target day.
  const pos = POSITION_EMPHASIS[position];
  if (pos && pos.day === kind) slots = [...slots, pos.slot];

  // The speed/peak phase trims accessory volume — you're expressing fitness,
  // not building it.
  const trimAccessories = phaseKey === 'speed';

  for (const slot of slots) {
    if (trimAccessories && slot.role === 'accessory') continue;

    if (slot.role === 'cond') {
      const names = COND_BY_PHASE[phaseKey] ?? COND_BY_PHASE.base;
      const lib = names
        .map((n) => EXERCISE_LIBRARY.find((e) => e.name === n))
        .find((e) => e && !used.has(e.id));
      if (lib) { used.add(lib.id); exercises.push(exFromLib(lib)); }
      continue;
    }

    const lib = pickExercise(slot, equipment, used);
    if (!lib) continue;
    used.add(lib.id);
    const override = slot.role === 'primary' ? PRIMARY_SCHEME[phaseKey] : {};
    exercises.push(exFromLib(lib, override));
  }

  return { day: weekday, label: def.label, focus: def.focus, coachNote: def.note, exercises };
}

function buildDays(split, phaseKey, equipment, weakness, position) {
  const days = WEEKDAYS[split.length] ?? WEEKDAYS[4];
  const used = new Set(); // shared across the week for variety
  return split.map((kind, i) =>
    buildDay(kind, phaseKey, equipment, weakness, position, days[i] ?? 'MON', used));
}

// Halve-ish the set count for a deload, keeping reps (intensity) intact.
function deloadSets(sets) {
  const n = Number(sets);
  if (Number.isNaN(n)) return sets;
  return String(Math.max(1, Math.round(n * 0.6)));
}

// A 1-week deload mirroring the block it follows, with volume cut ~40%.
function deloadPhase(fromPhase, week) {
  return {
    name: 'DELOAD', label: 'Deload — recover & adapt',
    weeks: { start: week, end: week }, weeksLabel: `Week ${week}`,
    color: '#6EE7B7', deload: true,
    coachNote: 'Planned recovery week: same exercises, ~40% less volume (drop a set or two), intensity held. This is where the previous block’s work becomes adaptation — don’t skip it.',
    days: fromPhase.days.map((d) => ({
      ...d,
      coachNote: 'Deload — cut the volume, keep it crisp.',
      exercises: d.exercises.map((e) => ({ ...e, id: genId(), sets: deloadSets(e.sets) })),
    })),
  };
}

const PHASE_META = [
  { key: 'base',     label: 'Base — Build the engine',    color: '#5BF0A5', deloadAfter: true },
  { key: 'strength', label: 'Strength — The foundation',  color: '#F59E0B', deloadAfter: true },
  { key: 'speed',    label: 'Power & Speed — Convert it',  color: '#A78BFA', deloadAfter: false },
];

// Build the full linear phase list, interleaving a deload week after each build
// block. Off-season runs longer blocks than pre-season.
function buildLinearPhases(seasonPhase, daysPerWeek, equipment, weakness, position) {
  const lengths = seasonPhase === 'off' ? [4, 4, 4] : [3, 3, 4];
  const splits = PHASE_SPLITS[daysPerWeek] ?? PHASE_SPLITS[4];
  const phases = [];
  let week = 1;

  PHASE_META.forEach((m, i) => {
    const len = lengths[i];
    const start = week;
    const end = week + len - 1;
    phases.push({
      name: `PHASE ${i + 1}`, label: m.label,
      weeks: { start, end }, weeksLabel: `Weeks ${start}–${end}`, color: m.color,
      days: buildDays(splits[m.key], m.key, equipment, weakness, position),
    });
    week = end + 1;
    if (m.deloadAfter) {
      phases.push(deloadPhase(phases.at(-1), week));
      week += 1;
    }
  });

  return phases;
}

const SEASON_LABEL = { off: 'Off-Season', pre: 'Pre-Season', in: 'In-Season' };
const SEASON_COLOR = { off: '#5BF0A5', pre: '#F59E0B', in: '#38BDF8' };

// Top-level explanation of the choices, so the athlete learns the "why".
function buildCoachNotes({ seasonPhase, daysPerWeek, position, weakness }) {
  const notes = [];
  if (seasonPhase === 'in') {
    notes.push(
      'In-season plan: the matches and team sessions are the real load. Your own work here is maintenance — heavy enough to hold strength and power, light enough to leave fresh legs for the game. If legs feel heavy, cut a set; never rob the match.',
    );
  } else {
    notes.push(
      `${daysPerWeek}-day ${SEASON_LABEL[seasonPhase].toLowerCase()} build. It moves through three phases — base, strength, then power & speed — and each one genuinely shifts: the base phase carries more conditioning and higher reps, the speed phase adds sprint/power volume and trims strength volume so you peak rather than just grind.`,
    );
    notes.push(
      'A deload week is built in after the base and strength blocks: same lifts, ~40% less volume, intensity held. That’s when the work turns into adaptation — it is part of the plan, not a break from it.',
    );
    notes.push(
      'Day order is deliberate: speed and power sit on fresh days, and conditioning is kept away from heavy lifting so the two don’t blunt each other (the interference effect). Always do the fast, explosive work first.',
    );
  }
  if (weakness === 'aerobic') {
    notes.push('Aerobic flagged as a weakness — extra conditioning is built into the base phase. Keep it off your speed and strength days.');
  } else if (weakness && WEAKNESS_PREHAB[weakness]) {
    notes.push(`Targeting your ${weakness} weak point with extra prehab woven into the relevant days. Don’t skip it — it’s the insurance that keeps you on the pitch.`);
  }
  const pos = POSITION_EMPHASIS[position];
  if (pos) notes.push(pos.note);
  return notes;
}

/**
 * Generate a complete, editable program from athlete variables.
 *
 * @param {object} inputs
 * @param {'off'|'pre'|'in'} inputs.seasonPhase
 * @param {3|4|5|6} inputs.daysPerWeek
 * @param {string[]} inputs.equipment   subset of ['Barbell','Dumbbell','Band','None'] ('None' = sprints/field)
 * @param {string|null} inputs.position
 * @param {string|null} inputs.weakness  'hamstring'|'groin'|'ankle'|'aerobic'|null
 * @returns {object} program object with id '' (assigned on save)
 */
export function generateProgram(inputs) {
  const {
    seasonPhase = 'pre',
    daysPerWeek = 4,
    equipment = ['Barbell', 'Dumbbell', 'Band', 'None'],
    position = null,
    weakness = null,
  } = inputs;

  const coachNotes = buildCoachNotes({ seasonPhase, daysPerWeek, position, weakness });
  const name = `${SEASON_LABEL[seasonPhase]} — ${daysPerWeek}-Day`;

  if (seasonPhase === 'in') {
    // Repeating maintenance week: trim each day to its essentials.
    const split = (PHASE_SPLITS[daysPerWeek] ?? PHASE_SPLITS[4]).strength;
    const days = buildDays(split, 'inseason', equipment, weakness, position).map((d) => ({
      ...d,
      exercises: d.exercises.slice(0, 4),
    }));
    return {
      id: '', name, type: 'repeating', color: SEASON_COLOR.in,
      start_date: null, end_date: null,
      structure: {
        focusColors: DEFAULT_FOCUS_COLORS,
        coachNotes,
        phases: [{
          name: 'IN-SEASON', label: 'Weekly Maintenance',
          weeks: { start: 1, end: 1 }, weeksLabel: 'Repeating week',
          color: SEASON_COLOR.in, days,
        }],
      },
    };
  }

  return {
    id: '', name, type: 'linear', color: SEASON_COLOR[seasonPhase],
    start_date: null, end_date: null,
    structure: {
      focusColors: DEFAULT_FOCUS_COLORS,
      coachNotes,
      phases: buildLinearPhases(seasonPhase, daysPerWeek, equipment, weakness, position),
    },
  };
}
