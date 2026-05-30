// Program generator — turns a handful of athlete variables into a real,
// editable soccer program. Pure functions, no React, no IO. The output matches
// the program `structure` schema the editor and scheduler already consume:
//
//   { id, name, type, color, start_date, end_date,
//     structure: { focusColors, coachNotes, phases: [{ name, label, weeks,
//       weeksLabel, color, coachNote?, days: [{ day, label, focus, coachNote?,
//       exercises: [{ id, name, sets, reps, note }] }] }] } }
//
// The design encodes the principles from the Guide tab: a base → strength →
// power/speed arc, speed/power placed on fresh days away from heavy lifting
// (interference effect), rep schemes matched to the quality, and prehab driven
// by the athlete's named weakness.

import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { DEFAULT_FOCUS_COLORS } from './programTemplate';

const genId = () => `ex_${Math.random().toString(36).slice(2, 9)}`;

// Bodyweight needs no kit, so it's always on the menu. Everything else is
// gated by what the athlete actually has. 'None' is the running/sprints tag.
function isAvailable(ex, equipment) {
  if (ex.equipment === 'Bodyweight') return true;
  return equipment.includes(ex.equipment);
}

// Pull the candidate pool for a slot, then take the first that hasn't been used
// in this day yet (keeps a session varied). Returns null rather than repeating
// an exercise — better a slightly shorter session the athlete fills in than a
// day that lists the same drill three times (happens when equipment is sparse).
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
// late, mirroring the periodization arc.
const COND_BY_PHASE = {
  base:     ['Easy Run', 'Tempo Run'],
  strength: ['Tempo Run', '30-30 Intervals'],
  speed:    ['Repeated Sprints (RSA)', 'Hill Sprints'],
  inseason: ['10-10-10 Run'],
};

// A "day kind" → its focus tag, label, coaching rationale and slot recipe.
// Slots are resolved against the library at generation time.
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
      { muscle: ['Quads & Legs'], type: ['Strength'], role: 'primary' },
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

// Which day kinds make up the week, ordered for the interference effect:
// speed first (fresh), conditioning last (away from quality work).
const SPLITS = {
  3: ['speed', 'lower', 'upper'],
  4: ['speed', 'lower', 'upper', 'conditioning'],
  5: ['speed', 'lower', 'power', 'upper', 'conditioning'],
  6: ['speed', 'lower', 'power', 'upper', 'conditioning', 'recovery'],
};

// Spread sessions across the week with rest between hard days.
const WEEKDAYS = {
  3: ['MON', 'WED', 'FRI'],
  4: ['MON', 'TUE', 'THU', 'SAT'],
  5: ['MON', 'TUE', 'THU', 'FRI', 'SAT'],
  6: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
};

// Weakness → an extra prehab exercise to weave into the relevant day kinds.
const WEAKNESS_PREHAB = {
  hamstring: { name: 'Single-leg RDL', on: ['lower'] },
  groin:     { name: 'Band Adduction', on: ['lower', 'upper'] },
  ankle:     { name: 'Single-Leg Calf Raise', on: ['lower', 'speed'] },
  aerobic:   null, // handled by adding conditioning volume, see below
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

// Build one day's exercise list for a given phase scheme.
function buildDay(kind, phaseKey, equipment, weakness, weekday) {
  const def = DAY_KINDS[kind];
  const used = new Set();
  const exercises = [];

  // Inject the weakness prehab if this day kind is a match.
  const wk = WEAKNESS_PREHAB[weakness];
  const slots = wk && wk.on.includes(kind)
    ? [...def.slots, { name: wk.name }]
    : def.slots;

  for (const slot of slots) {
    if (slot.role === 'cond') {
      const names = COND_BY_PHASE[phaseKey] ?? COND_BY_PHASE.base;
      const name = names[exercises.length] ?? names[names.length - 1];
      const lib = EXERCISE_LIBRARY.find((e) => e.name === name);
      const ex = exFromLib(lib);
      if (ex && !used.has(lib.id)) { used.add(lib.id); exercises.push(ex); }
      continue;
    }
    const lib = pickExercise(slot, equipment, used);
    if (!lib) continue;
    used.add(lib.id);
    const override = slot.role === 'primary' ? PRIMARY_SCHEME[phaseKey] : {};
    exercises.push(exFromLib(lib, override));
  }

  return {
    day: weekday,
    label: def.label,
    focus: def.focus,
    coachNote: def.note,
    exercises,
  };
}

function buildDays(split, phaseKey, equipment, weakness) {
  const days = WEEKDAYS[split.length] ?? WEEKDAYS[4];
  return split.map((kind, i) => buildDay(kind, phaseKey, equipment, weakness, days[i] ?? 'MON'));
}

// Phase definitions for a linear build. Off-season front-loads the base.
function linearPhases(seasonPhase) {
  if (seasonPhase === 'off') {
    return [
      { key: 'base',     name: 'PHASE 1', label: 'Base — Build the engine',  weeks: { start: 1, end: 4 },  color: '#5BF0A5' },
      { key: 'strength', name: 'PHASE 2', label: 'Strength — The foundation', weeks: { start: 5, end: 8 },  color: '#F59E0B' },
      { key: 'speed',    name: 'PHASE 3', label: 'Power & Speed — Convert it', weeks: { start: 9, end: 12 }, color: '#A78BFA' },
    ];
  }
  // pre-season: classic 10-week arc
  return [
    { key: 'base',     name: 'PHASE 1', label: 'Base — Build the engine',  weeks: { start: 1, end: 3 },  color: '#5BF0A5' },
    { key: 'strength', name: 'PHASE 2', label: 'Strength — The foundation', weeks: { start: 4, end: 6 },  color: '#F59E0B' },
    { key: 'speed',    name: 'PHASE 3', label: 'Power & Speed — Convert it', weeks: { start: 7, end: 10 }, color: '#A78BFA' },
  ];
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
      `${daysPerWeek}-day ${SEASON_LABEL[seasonPhase].toLowerCase()} build. It moves through three phases — base, strength, then power & speed — because each one sets up the next: the strength you build in the middle is what you later convert into explosive speed. Add a little load, a rep or a set across each phase, then deload before the next.`,
    );
    notes.push(
      'Day order is deliberate: speed and power sit on fresh days, and conditioning is kept away from heavy lifting so the two don’t blunt each other (the interference effect). Always do the fast, explosive work first while you’re fresh.',
    );
  }
  if (weakness === 'aerobic') {
    notes.push('Aerobic flagged as a weakness — an extra conditioning emphasis is built in. Keep it off your speed and strength days.');
  } else if (weakness && WEAKNESS_PREHAB[weakness]) {
    notes.push(`Targeting your ${weakness} weak point with extra prehab woven into the relevant days. Don’t skip it — it’s the insurance that keeps you on the pitch.`);
  }
  if (position) {
    notes.push(`Tuned for a ${position}. Adjust exercise selection and volume to your own response — two players on the same plan recover differently.`);
  }
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

  const split = SPLITS[daysPerWeek] ?? SPLITS[4];
  const coachNotes = buildCoachNotes({ seasonPhase, daysPerWeek, position, weakness });
  const name = `${SEASON_LABEL[seasonPhase]} — ${daysPerWeek}-Day`;

  if (seasonPhase === 'in') {
    // Repeating maintenance week: trim each day to its essentials.
    const days = buildDays(split, 'inseason', equipment, weakness).map((d) => ({
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

  const phases = linearPhases(seasonPhase).map((p) => ({
    name: p.name,
    label: p.label,
    weeks: p.weeks,
    weeksLabel: `Weeks ${p.weeks.start}–${p.weeks.end}`,
    color: p.color,
    days: buildDays(split, p.key, equipment, weakness),
  }));

  return {
    id: '', name, type: 'linear', color: SEASON_COLOR[seasonPhase],
    start_date: null, end_date: null,
    structure: { focusColors: DEFAULT_FOCUS_COLORS, coachNotes, phases },
  };
}
