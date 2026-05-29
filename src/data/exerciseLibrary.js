// Exercise library for a fullback — drawn from the training reference's
// exercise menu plus the original program exercises. Each entry is tagged by
// muscle group, equipment, and training type so the editor can filter and
// insert it (with sensible default sets/reps/note).
//
// equipment: Bodyweight | Dumbbell | Barbell | Band | None (running/sprints)
// type:      Strength | Power | Speed | Conditioning | Prehab | Core | Mobility

export const MUSCLE_GROUPS = [
  'Quads & Legs', 'Hamstrings', 'Glutes & Hips', 'Adductors / Groin',
  'Calves', 'Core', 'Upper Push', 'Upper Pull', 'Speed & Agility', 'Conditioning', 'Mobility',
];
export const EXERCISE_TYPES = ['Strength', 'Power', 'Speed', 'Conditioning', 'Prehab', 'Core', 'Mobility'];
export const EQUIPMENT_TYPES = ['Bodyweight', 'Dumbbell', 'Barbell', 'Band', 'None'];

const E = (name, muscle, equipment, type, sets, reps, note = '') => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  name, muscle, equipment, type, sets, reps, note,
});

export const EXERCISE_LIBRARY = [
  // ── Quads & Legs ──
  E('Back Squat', 'Quads & Legs', 'Barbell', 'Strength', '4', '5', 'heavy bilateral, drive through midfoot'),
  E('Front Squat', 'Quads & Legs', 'Barbell', 'Strength', '4', '5', 'upright torso, elbows high'),
  E('Goblet Squat', 'Quads & Legs', 'Dumbbell', 'Strength', '3', '10', 'DB at chest, controlled'),
  E('Bulgarian Split Squat', 'Quads & Legs', 'Dumbbell', 'Strength', '3', '8', 'each leg'),
  E('Walking Lunge', 'Quads & Legs', 'Dumbbell', 'Strength', '3', '10', 'each leg'),
  E('Step-up', 'Quads & Legs', 'Dumbbell', 'Strength', '3', '8', 'each leg, knee-high box'),
  E('Pistol Squat', 'Quads & Legs', 'Bodyweight', 'Strength', '3', '5', 'each leg, progress from a box'),
  E('Split Squat', 'Quads & Legs', 'Bodyweight', 'Strength', '3', '10', 'each leg'),
  E('Band-resisted Squat', 'Quads & Legs', 'Band', 'Strength', '3', '12', 'band over bar or around knees'),

  // ── Hamstrings ──
  E('Nordic Hamstring Curl', 'Hamstrings', 'Bodyweight', 'Prehab', '3', '4', 'slow eccentric — #1 injury insurance, every phase'),
  E('Romanian Deadlift', 'Hamstrings', 'Barbell', 'Strength', '4', '8', 'hinge, 3s eccentric'),
  E('DB Romanian Deadlift', 'Hamstrings', 'Dumbbell', 'Strength', '3', '10', 'hinge, controlled'),
  E('Single-leg RDL', 'Hamstrings', 'Dumbbell', 'Strength', '3', '8', 'each leg, balance focus'),
  E('Band Leg Curl', 'Hamstrings', 'Band', 'Prehab', '3', '12', 'anchor band, heel to glute'),
  E('Slider Leg Curl', 'Hamstrings', 'Bodyweight', 'Prehab', '3', '8', 'towel/slider, bridge then curl'),
  E('Hamstring Bridge Walkout', 'Hamstrings', 'Bodyweight', 'Prehab', '3', '8', 'walk feet out holding the bridge'),

  // ── Glutes & Hips ──
  E('Hip Thrust', 'Glutes & Hips', 'Barbell', 'Strength', '4', '8', 'full extension, squeeze at top'),
  E('DB Hip Thrust', 'Glutes & Hips', 'Dumbbell', 'Strength', '3', '10', 'DB on hips'),
  E('Single-leg Hip Thrust', 'Glutes & Hips', 'Bodyweight', 'Prehab', '3', '10', 'each leg'),
  E('Band Hip Abduction', 'Glutes & Hips', 'Band', 'Prehab', '3', '15', 'glute med — controls the knee when you cut'),
  E('Monster Walks', 'Glutes & Hips', 'Band', 'Prehab', '3', '12', 'each direction, band at knees'),
  E('Clamshells', 'Glutes & Hips', 'Band', 'Prehab', '3', '15', 'each side'),

  // ── Adductors / Groin ──
  E('Copenhagen Plank', 'Adductors / Groin', 'Bodyweight', 'Prehab', '3', '20s', 'each side — groin insurance, every phase'),
  E('Band Adduction', 'Adductors / Groin', 'Band', 'Prehab', '3', '12', 'each leg'),
  E('Cossack Squat', 'Adductors / Groin', 'Bodyweight', 'Mobility', '3', '6', 'each side, deep lateral'),
  E('Side-lying Adduction', 'Adductors / Groin', 'Bodyweight', 'Prehab', '3', '12', 'each side'),

  // ── Calves ──
  E('Single-Leg Calf Raise', 'Calves', 'Bodyweight', 'Prehab', '3', '12', 'each leg, full range — Achilles health'),
  E('Weighted Calf Raise', 'Calves', 'Dumbbell', 'Strength', '3', '10', 'add a DB'),
  E('Pogo Hops', 'Calves', 'Bodyweight', 'Power', '3', '20', 'stiff ankles, reactive'),

  // ── Core ──
  E('Pallof Press', 'Core', 'Band', 'Core', '3', '10', 'each side, anti-rotation'),
  E('Suitcase Carry', 'Core', 'Dumbbell', 'Core', '3', '30m', 'each side, anti-lateral-flexion'),
  E('Dead Bug', 'Core', 'Bodyweight', 'Core', '3', '8', 'each side, slow and controlled'),
  E('Bird Dog', 'Core', 'Bodyweight', 'Core', '3', '8', 'each side'),
  E('Side Plank', 'Core', 'Bodyweight', 'Core', '3', '30s', 'each side'),
  E('Hanging Leg Raise', 'Core', 'Bodyweight', 'Core', '3', '8', 'controlled, no swing'),
  E('Plank Hold', 'Core', 'Bodyweight', 'Core', '3', '40s', 'quality over duration'),

  // ── Upper Push ──
  E('Barbell Bench Press', 'Upper Push', 'Barbell', 'Strength', '4', '6', 'full ROM'),
  E('DB Bench Press', 'Upper Push', 'Dumbbell', 'Strength', '3', '8', 'controlled'),
  E('DB Floor Press', 'Upper Push', 'Dumbbell', 'Strength', '3', '8', 'no bench needed'),
  E('Push-up', 'Upper Push', 'Bodyweight', 'Strength', '3', '12', 'scale: decline / archer / deficit'),
  E('DB Overhead Press', 'Upper Push', 'Dumbbell', 'Strength', '3', '8', 'no arching'),
  E('Band Press', 'Upper Push', 'Band', 'Strength', '3', '15', 'anchor behind you'),

  // ── Upper Pull ──
  E('Pull-Ups', 'Upper Pull', 'Bodyweight', 'Strength', '3', '6', 'add weight if easy, band if needed'),
  E('DB Row', 'Upper Pull', 'Dumbbell', 'Strength', '3', '8', 'each side, controlled'),
  E('Band Row', 'Upper Pull', 'Band', 'Strength', '3', '15', 'squeeze the blades'),
  E('Band Lat Pulldown', 'Upper Pull', 'Band', 'Strength', '3', '12', 'anchor a band over a door'),
  E('Inverted Row', 'Upper Pull', 'Bodyweight', 'Strength', '3', '10', 'bar/towel under a table'),
  E('DB Lateral Raise', 'Upper Pull', 'Dumbbell', 'Strength', '3', '12', 'controlled'),

  // ── Speed & Agility ──
  E('Flying Sprint', 'Speed & Agility', 'None', 'Speed', '5', '30m', '15m build-in → max, full rest'),
  E('Acceleration Sprint', 'Speed & Agility', 'None', 'Speed', '6', '20m', 'low start, drive the first steps'),
  E('Band-resisted Sprint', 'Speed & Agility', 'Band', 'Speed', '5', '15m', 'partner or anchor band'),
  E('A-skip', 'Speed & Agility', 'None', 'Speed', '3', '20m', 'mechanics, deliberate'),
  E('B-skip', 'Speed & Agility', 'None', 'Speed', '3', '20m', 'extend and claw the ground'),
  E('Falling Start', 'Speed & Agility', 'None', 'Speed', '5', '15m', 'lean until you go'),
  E('5-10-5 Agility', 'Speed & Agility', 'None', 'Speed', '5', '1', 'change of direction, record time'),
  E('T-drill', 'Speed & Agility', 'None', 'Speed', '5', '1', 'record time, full rest'),
  E('Lateral Shuffle', 'Speed & Agility', 'None', 'Speed', '3', '10m', 'each direction, low hips'),
  E('Cutting Drill', 'Speed & Agility', 'None', 'Speed', '4', '5m', 'sharp plant, each direction'),

  // ── Power / Plyometrics ──
  E('Box Jump', 'Speed & Agility', 'Bodyweight', 'Power', '3', '4', 'focus on the landing'),
  E('Broad Jump', 'Speed & Agility', 'Bodyweight', 'Power', '3', '4', 'horizontal power'),
  E('Squat Jump', 'Speed & Agility', 'Bodyweight', 'Power', '3', '5', 'max intent, soft landing'),
  E('Skater Bound', 'Speed & Agility', 'Bodyweight', 'Power', '3', '6', 'each side, lateral power'),
  E('Depth Jump', 'Speed & Agility', 'Bodyweight', 'Power', '3', '4', 'advanced — only when robust'),
  E('Bounding', 'Speed & Agility', 'None', 'Power', '3', '20m', 'full extension each stride'),

  // ── Conditioning ──
  E('Easy Run', 'Conditioning', 'None', 'Conditioning', '1', '30 min', '65–70% max HR, conversational'),
  E('Tempo Run', 'Conditioning', 'None', 'Conditioning', '3', '5 min', '75–80% HR, jog rest'),
  E('30-30 Intervals', 'Conditioning', 'None', 'Conditioning', '10', '30s on/30s off', '90% max HR on the effort'),
  E('Repeated Sprints (RSA)', 'Conditioning', 'None', 'Conditioning', '6', '30m', 'on 25s rest — match-specific'),
  E('Hill Sprints', 'Conditioning', 'None', 'Conditioning', '6', '10s', 'all-out, walk down rest'),
  E('10-10-10 Run', 'Conditioning', 'None', 'Conditioning', '8', '10s sprint/10s jog/10s walk', 'mimics match demands'),
  E('Strides', 'Conditioning', 'None', 'Speed', '4', '60m', 'relaxed acceleration after a run'),

  // ── Mobility ──
  E('Couch Stretch', 'Mobility', 'Bodyweight', 'Mobility', '2', '45s', 'each side, hip flexor'),
  E('Hip 90-90', 'Mobility', 'Bodyweight', 'Mobility', '2', '60s', 'each side'),
  E('Foam Roll', 'Mobility', 'Bodyweight', 'Mobility', '1', '10 min', 'quads, calves, ITB, glutes'),
  E("World's Greatest Stretch", 'Mobility', 'Bodyweight', 'Mobility', '2', '5', 'each side, full-body opener'),
];
