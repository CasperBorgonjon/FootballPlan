export const focusColors = {
  Strength: '#F59E0B',
  Endurance: '#38BDF8',
  Power: '#A78BFA',
  Speed: '#FB923C',
  Recovery: '#6EE7B7',
};

export const coachNotes = [
  'Build your aerobic base and movement foundations. Weights are moderate — perfect your form now. Every rep should be controlled and deliberate.',
  'Load goes up, rest periods get more structured. Sprint sessions are hard — full recovery between reps. This is where you actually get faster.',
  'Sharpen everything. High speed, low volume. Feel fast and light. Don\'t add load — express what you\'ve built.',
];

// Phase week ranges are data-driven now ({ start, end }) so custom phases /
// different block lengths are a data change, not a code change.
// Each exercise has a stable `id` — required for editable plans, reorder,
// and per-exercise notes/PR tracking down the road.
export const trainingPlan = {
  phases: [
    {
      name: 'PHASE 1',
      label: 'Base & Movement Quality',
      weeks: { start: 1, end: 3 },
      weeksLabel: 'Weeks 1–3',
      color: '#5BF0A5',
      days: [
        {
          day: 'MON', label: 'Strength — Lower Body', focus: 'Strength',
          exercises: [
            { id: 'p1_mon_squat', name: 'Back Squat', sets: '3', reps: '8', note: '65–70% 1RM, feel the movement' },
            { id: 'p1_mon_rdl', name: 'Romanian Deadlift', sets: '3', reps: '10', note: 'slow 3s eccentric, hinge focus' },
            { id: 'p1_mon_bss', name: 'Bulgarian Split Squat', sets: '3', reps: '8', note: 'each leg, bodyweight only' },
            { id: 'p1_mon_nordic', name: 'Nordic Hamstring Curl', sets: '3', reps: '4', note: 'slow lower only, use hands to return' },
            { id: 'p1_mon_calf', name: 'Single-Leg Calf Raise', sets: '3', reps: '12', note: 'each leg, full range' },
          ],
        },
        {
          day: 'TUE', label: 'Aerobic Base — Steady Run', focus: 'Endurance',
          exercises: [
            { id: 'p1_tue_easyrun', name: 'Easy run', sets: '1', reps: '30 min', note: '65–70% max HR, comfortable pace' },
            { id: 'p1_tue_strides', name: 'Strides', sets: '4', reps: '60m', note: 'after run, relaxed acceleration' },
            { id: 'p1_tue_hipcircles', name: 'Walking hip circles', sets: '2', reps: '10', note: 'each direction' },
            { id: 'p1_tue_quadstretch', name: 'Quad + hip flexor stretch', sets: '3', reps: '45s', note: 'each side' },
            { id: 'p1_tue_calfstretch', name: 'Calf stretch (wall)', sets: '3', reps: '45s', note: 'each leg' },
          ],
        },
        {
          day: 'WED', label: 'Strength — Upper & Core', focus: 'Strength',
          exercises: [
            { id: 'p1_wed_bench', name: 'Barbell Bench Press', sets: '3', reps: '10', note: '65–70% 1RM, full ROM' },
            { id: 'p1_wed_pullup', name: 'Pull-Ups', sets: '3', reps: '5', note: 'full ROM — use band if needed' },
            { id: 'p1_wed_row', name: 'Barbell Row', sets: '3', reps: '10', note: 'bent-over, controlled' },
            { id: 'p1_wed_ohp', name: 'DB Overhead Press', sets: '3', reps: '12', note: '10kg DBs, no arching' },
            { id: 'p1_wed_deadbug', name: 'Dead Bug', sets: '3', reps: '8', note: 'each side, slow and controlled' },
            { id: 'p1_wed_copenhagen', name: 'Copenhagen Plank', sets: '3', reps: '15s', note: 'each side, build the groin' },
          ],
        },
        {
          day: 'THU', label: 'Speed — Mechanics Only', focus: 'Speed',
          exercises: [
            { id: 'p1_thu_askip', name: 'A-skip', sets: '3', reps: '20m', note: 'slow and deliberate, form first' },
            { id: 'p1_thu_bskip', name: 'B-skip', sets: '3', reps: '20m', note: 'extend and claw the ground' },
            { id: 'p1_thu_fallstart', name: 'Falling starts', sets: '5', reps: '15m', note: 'lean until you have to go, relaxed' },
            { id: 'p1_thu_accel', name: 'Acceleration sprints', sets: '6', reps: '20m', note: '85% effort — not flat out yet' },
            { id: 'p1_thu_shuffle', name: 'Lateral shuffle', sets: '3', reps: '10m', note: 'each direction, low hips' },
            { id: 'p1_thu_boxjump', name: 'Box jumps', sets: '3', reps: '4', note: 'moderate height, focus on landing' },
          ],
        },
        {
          day: 'FRI', label: 'Conditioning — Aerobic Base', focus: 'Endurance',
          exercises: [
            { id: 'p1_fri_tempo', name: 'Tempo run', sets: '3', reps: '5 min', note: '75–80% max HR, 2 min jog rest' },
            { id: 'p1_fri_bound', name: 'Bounding', sets: '3', reps: '20m', note: 'build power, full extension' },
            { id: 'p1_fri_bandwalk', name: 'Lateral band walks', sets: '3', reps: '12', note: 'each direction, hip activation' },
            { id: 'p1_fri_plank', name: 'Plank hold', sets: '3', reps: '40s', note: 'quality over duration' },
            { id: 'p1_fri_hipstretch', name: 'Hip flexor stretch', sets: '3', reps: '45s', note: 'couch stretch each side' },
          ],
        },
        {
          day: 'SAT', label: 'Full-Body Power & Mobility', focus: 'Power',
          exercises: [
            { id: 'p1_sat_squatjump', name: 'Squat Jump', sets: '3', reps: '5', note: 'bodyweight, land softly' },
            { id: 'p1_sat_dbrdl', name: 'DB Romanian Deadlift', sets: '3', reps: '10', note: '10kg DBs, hinge pattern' },
            { id: 'p1_sat_pullneg', name: 'Pull-Up Negatives', sets: '3', reps: '4', note: '5s lowering, tendon adaptation' },
            { id: 'p1_sat_broad', name: 'Broad Jump', sets: '3', reps: '4', note: 'focus on takeoff mechanics' },
            { id: 'p1_sat_trot', name: 'Thoracic rotation', sets: '2', reps: '10', note: 'each side, open the upper back' },
            { id: 'p1_sat_stretch', name: 'Full body stretch', sets: '1', reps: '15 min', note: 'hip, hamstring, calf, shoulder' },
          ],
        },
      ],
    },
    {
      name: 'PHASE 2',
      label: 'Strength & Speed Development',
      weeks: { start: 4, end: 6 },
      weeksLabel: 'Weeks 4–6',
      color: '#F59E0B',
      days: [
        {
          day: 'MON', label: 'Strength — Lower Power', focus: 'Strength',
          exercises: [
            { id: 'p2_mon_squat', name: 'Back Squat', sets: '4', reps: '6', note: '78–80% 1RM, controlled' },
            { id: 'p2_mon_rdl', name: 'Romanian Deadlift', sets: '4', reps: '8', note: 'pause 1s at bottom' },
            { id: 'p2_mon_bss', name: 'Bulgarian Split Squat', sets: '3', reps: '8', note: 'each leg, add DBs now' },
            { id: 'p2_mon_nordic', name: 'Nordic Hamstring Curl', sets: '3', reps: '5', note: 'slow lower, small pause at top' },
            { id: 'p2_mon_calf', name: 'Single-Leg Calf Raise', sets: '3', reps: '12', note: 'add DB if easy' },
          ],
        },
        {
          day: 'TUE', label: 'Sprint — Max Speed Development', focus: 'Speed',
          exercises: [
            { id: 'p2_tue_warmup', name: 'Dynamic warmup', sets: '1', reps: '10 min', note: 'skips, high knees, leg swings' },
            { id: 'p2_tue_fly20', name: 'Flying 20s', sets: '6', reps: '20m', note: 'build 20m, sprint 20m — full 3 min rest' },
            { id: 'p2_tue_topspeed', name: 'Top-speed runs', sets: '5', reps: '40m', note: '100% effort, walk back rest' },
            { id: 'p2_tue_decel', name: 'Sprint + decelerate', sets: '5', reps: '30m', note: 'hard stop at end — knee control' },
            { id: 'p2_tue_lat', name: 'Lateral sprint + plant', sets: '5', reps: '10m', note: 'each direction' },
          ],
        },
        {
          day: 'WED', label: 'HIIT — Aerobic Power', focus: 'Endurance',
          exercises: [
            { id: 'p2_wed_3030', name: '30-30 intervals', sets: '10', reps: '30s on/30s off', note: '90% max HR on effort' },
            { id: 'p2_wed_hill', name: 'Hill sprints (or stairs)', sets: '6', reps: '10s', note: 'all-out, walk down rest' },
            { id: 'p2_wed_sqjump', name: 'Squat jumps', sets: '3', reps: '6', note: 'between interval sets' },
            { id: 'p2_wed_roll', name: 'Foam roll', sets: '1', reps: '10 min', note: 'quads, calves, ITB, glutes' },
            { id: 'p2_wed_stretch', name: 'Stretch', sets: '1', reps: '10 min', note: 'hamstring + hip flexor focus' },
          ],
        },
        {
          day: 'THU', label: 'Strength — Upper & Core', focus: 'Strength',
          exercises: [
            { id: 'p2_thu_bench', name: 'Barbell Bench Press', sets: '4', reps: '6', note: '78–80% 1RM, explosive push' },
            { id: 'p2_thu_pullup', name: 'Weighted Pull-Ups', sets: '3', reps: '5', note: 'add weight via bag/belt' },
            { id: 'p2_thu_row', name: 'Barbell Row', sets: '4', reps: '8', note: 'squeeze at top 1s' },
            { id: 'p2_thu_lat', name: 'DB Lateral Raise', sets: '3', reps: '12', note: '10kg, controlled' },
            { id: 'p2_thu_pallof', name: 'Pallof Press', sets: '3', reps: '10', note: 'each side, rotational stability' },
            { id: 'p2_thu_copenhagen', name: 'Copenhagen Plank', sets: '3', reps: '22s', note: 'each side' },
          ],
        },
        {
          day: 'FRI', label: 'Conditioning — Match Simulation', focus: 'Endurance',
          exercises: [
            { id: 'p2_fri_101010', name: '10-10-10 run', sets: '8', reps: '10s sprint/10s jog/10s walk', note: 'mimics match demands' },
            { id: 'p2_fri_tempo', name: 'Tempo run', sets: '3', reps: '6 min', note: '80% HR, 2 min rest' },
            { id: 'p2_fri_react', name: 'Reactive lateral shuffle', sets: '4', reps: '8m', note: 'change direction on cue' },
            { id: 'p2_fri_slrdl', name: 'Single-leg RDL', sets: '3', reps: '8', note: 'each leg, DB, balance focus' },
            { id: 'p2_fri_9090', name: 'Hip 90-90 stretch', sets: '2', reps: '60s', note: 'each side' },
          ],
        },
        {
          day: 'SAT', label: 'Explosive Power & Mobility', focus: 'Power',
          exercises: [
            { id: 'p2_sat_expsquat', name: 'Squat (explosive)', sets: '4', reps: '4', note: '80% 1RM, drive hard out of hole' },
            { id: 'p2_sat_depth', name: 'Depth Jump', sets: '3', reps: '4', note: 'step off box, react on landing' },
            { id: 'p2_sat_broad', name: 'Broad Jump', sets: '4', reps: '5', note: 'maximum effort' },
            { id: 'p2_sat_pullsit', name: 'Pull-Up + L-Sit hold', sets: '3', reps: '5+10s', note: 'upper body + core combo' },
            { id: 'p2_sat_mobility', name: 'Full mobility session', sets: '1', reps: '20 min', note: 'hip flexors, ankles, thoracic' },
          ],
        },
      ],
    },
    {
      name: 'PHASE 3',
      label: 'Peak Speed & Pre-Season Readiness',
      weeks: { start: 7, end: 10 },
      weeksLabel: 'Weeks 7–10',
      color: '#F87171',
      days: [
        {
          day: 'MON', label: 'Strength — Peak Lower', focus: 'Strength',
          exercises: [
            { id: 'p3_mon_squat', name: 'Back Squat', sets: '4', reps: '3', note: '85–88% 1RM, explosive intent' },
            { id: 'p3_mon_rdl', name: 'Romanian Deadlift', sets: '3', reps: '5', note: 'controlled, heavier' },
            { id: 'p3_mon_bss', name: 'Bulgarian Split Squat', sets: '3', reps: '6', note: 'each leg, heavy DBs' },
            { id: 'p3_mon_nordic', name: 'Nordic Hamstring Curl', sets: '3', reps: '6', note: 'maintain every week' },
            { id: 'p3_mon_calf', name: 'Single-Leg Calf Raise', sets: '3', reps: '10', note: 'weighted' },
          ],
        },
        {
          day: 'TUE', label: 'Sprint — Maximum Velocity', focus: 'Speed',
          exercises: [
            { id: 'p3_tue_warmup', name: 'Sprint mechanics warmup', sets: '1', reps: '10 min', note: 'A/B skips, wickets' },
            { id: 'p3_tue_fly30', name: 'Flying 30s', sets: '5', reps: '30m', note: '30m build-up then 30m max — full 4 min rest' },
            { id: 'p3_tue_5m', name: '5m explosive starts', sets: '8', reps: '5m', note: 'react start, pure acceleration' },
            { id: 'p3_tue_tdrill', name: 'Agility: T-drill', sets: '5', reps: '1', note: 'record time, full rest' },
            { id: 'p3_tue_decel', name: 'Deceleration runs', sets: '4', reps: '30m', note: 'sprint then hard stop, knee control' },
          ],
        },
        {
          day: 'WED', label: 'Conditioning — High Intensity', focus: 'Endurance',
          exercises: [
            { id: 'p3_wed_5min', name: '5-minute run test', sets: '1', reps: '5 min', note: 'max distance — benchmark vs Week 1' },
            { id: 'p3_wed_4020', name: '40-20 intervals', sets: '8', reps: '40s on/20s off', note: '95% max HR' },
            { id: 'p3_wed_bound', name: 'Bounding', sets: '3', reps: '20m', note: 'explosive, full extension' },
            { id: 'p3_wed_hurdle', name: 'Lateral hurdle jumps', sets: '3', reps: '8', note: 'each direction, reactive' },
            { id: 'p3_wed_cooldown', name: 'Cooldown jog + stretch', sets: '1', reps: '15 min', note: '' },
          ],
        },
        {
          day: 'THU', label: 'Strength + Recovery', focus: 'Recovery',
          exercises: [
            { id: 'p3_thu_bench', name: 'Barbell Bench Press', sets: '3', reps: '4', note: '83–85% 1RM, peak strength' },
            { id: 'p3_thu_pullup', name: 'Pull-Ups', sets: '3', reps: '6', note: 'weighted, smooth' },
            { id: 'p3_thu_jog', name: 'Easy jog', sets: '1', reps: '15 min', note: 'very easy — flushing the legs' },
            { id: 'p3_thu_roll', name: 'Foam rolling', sets: '1', reps: '12 min', note: 'quads, calves, ITB, glutes' },
            { id: 'p3_thu_contrast', name: 'Contrast shower', sets: '1', reps: '8 min', note: '2 min hot / 1 min cold x 3' },
          ],
        },
        {
          day: 'FRI', label: 'Activation — Pre-Season Prep', focus: 'Speed',
          exercises: [
            { id: 'p3_fri_sprintact', name: 'Short sprint activation', sets: '5', reps: '15m', note: '80% effort, sharp not hard' },
            { id: 'p3_fri_cuts', name: 'Lateral cuts', sets: '4', reps: '5m', note: 'each direction, sharp plant' },
            { id: 'p3_fri_sqjump', name: 'Squat jumps', sets: '3', reps: '5', note: 'light and reactive' },
            { id: 'p3_fri_pullup', name: 'Pull-Ups', sets: '3', reps: '5', note: 'smooth, no strain' },
            { id: 'p3_fri_stretch', name: 'Full stretch + breathwork', sets: '1', reps: '15 min', note: 'calm the nervous system' },
          ],
        },
        {
          day: 'SAT', label: 'Time Trial & Full Fitness Test', focus: 'Endurance',
          exercises: [
            { id: 'p3_sat_warmup', name: 'Dynamic warmup', sets: '1', reps: '15 min', note: 'full body activation' },
            { id: 'p3_sat_30m', name: '30m sprint (3 attempts)', sets: '3', reps: '30m', note: 'record best — compare to Week 1' },
            { id: 'p3_sat_vert', name: 'Vertical jump test', sets: '3', reps: '1', note: 'record best' },
            { id: 'p3_sat_cooper', name: '12-minute Cooper run', sets: '1', reps: '12 min', note: 'max distance — VO2 proxy' },
            { id: 'p3_sat_cooldown', name: 'Cooldown + stretch', sets: '1', reps: '15 min', note: 'you earned it' },
          ],
        },
      ],
    },
  ],
};

// Derived constants. Anywhere code asks "how long is the block?" it should
// read from here — never hard-code 10.
export const TOTAL_WEEKS = trainingPlan.phases.at(-1).weeks.end;

// Derived from data — adding a phase needs no code change here.
export function getPhaseForWeek(week) {
  const idx = trainingPlan.phases.findIndex((p) => week >= p.weeks.start && week <= p.weeks.end);
  return idx === -1 ? trainingPlan.phases.length - 1 : idx;
}
