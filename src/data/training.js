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

export const trainingPlan = {
  phases: [
    {
      name: 'PHASE 1',
      label: 'Base & Movement Quality',
      weeks: 'Weeks 1–3',
      color: '#5BF0A5',
      days: [
        {
          day: 'MON', label: 'Strength — Lower Body', focus: 'Strength',
          exercises: [
            { name: 'Back Squat', sets: '3', reps: '8', note: '65–70% 1RM, feel the movement' },
            { name: 'Romanian Deadlift', sets: '3', reps: '10', note: 'slow 3s eccentric, hinge focus' },
            { name: 'Bulgarian Split Squat', sets: '3', reps: '8', note: 'each leg, bodyweight only' },
            { name: 'Nordic Hamstring Curl', sets: '3', reps: '4', note: 'slow lower only, use hands to return' },
            { name: 'Single-Leg Calf Raise', sets: '3', reps: '12', note: 'each leg, full range' },
          ],
        },
        {
          day: 'TUE', label: 'Aerobic Base — Steady Run', focus: 'Endurance',
          exercises: [
            { name: 'Easy run', sets: '1', reps: '30 min', note: '65–70% max HR, comfortable pace' },
            { name: 'Strides', sets: '4', reps: '60m', note: 'after run, relaxed acceleration' },
            { name: 'Walking hip circles', sets: '2', reps: '10', note: 'each direction' },
            { name: 'Quad + hip flexor stretch', sets: '3', reps: '45s', note: 'each side' },
            { name: 'Calf stretch (wall)', sets: '3', reps: '45s', note: 'each leg' },
          ],
        },
        {
          day: 'WED', label: 'Strength — Upper & Core', focus: 'Strength',
          exercises: [
            { name: 'Barbell Bench Press', sets: '3', reps: '10', note: '65–70% 1RM, full ROM' },
            { name: 'Pull-Ups', sets: '3', reps: '5', note: 'full ROM — use band if needed' },
            { name: 'Barbell Row', sets: '3', reps: '10', note: 'bent-over, controlled' },
            { name: 'DB Overhead Press', sets: '3', reps: '12', note: '10kg DBs, no arching' },
            { name: 'Dead Bug', sets: '3', reps: '8', note: 'each side, slow and controlled' },
            { name: 'Copenhagen Plank', sets: '3', reps: '15s', note: 'each side, build the groin' },
          ],
        },
        {
          day: 'THU', label: 'Speed — Mechanics Only', focus: 'Speed',
          exercises: [
            { name: 'A-skip', sets: '3', reps: '20m', note: 'slow and deliberate, form first' },
            { name: 'B-skip', sets: '3', reps: '20m', note: 'extend and claw the ground' },
            { name: 'Falling starts', sets: '5', reps: '15m', note: 'lean until you have to go, relaxed' },
            { name: 'Acceleration sprints', sets: '6', reps: '20m', note: '85% effort — not flat out yet' },
            { name: 'Lateral shuffle', sets: '3', reps: '10m', note: 'each direction, low hips' },
            { name: 'Box jumps', sets: '3', reps: '4', note: 'moderate height, focus on landing' },
          ],
        },
        {
          day: 'FRI', label: 'Conditioning — Aerobic Base', focus: 'Endurance',
          exercises: [
            { name: 'Tempo run', sets: '3', reps: '5 min', note: '75–80% max HR, 2 min jog rest' },
            { name: 'Bounding', sets: '3', reps: '20m', note: 'build power, full extension' },
            { name: 'Lateral band walks', sets: '3', reps: '12', note: 'each direction, hip activation' },
            { name: 'Plank hold', sets: '3', reps: '40s', note: 'quality over duration' },
            { name: 'Hip flexor stretch', sets: '3', reps: '45s', note: 'couch stretch each side' },
          ],
        },
        {
          day: 'SAT', label: 'Full-Body Power & Mobility', focus: 'Power',
          exercises: [
            { name: 'Squat Jump', sets: '3', reps: '5', note: 'bodyweight, land softly' },
            { name: 'DB Romanian Deadlift', sets: '3', reps: '10', note: '10kg DBs, hinge pattern' },
            { name: 'Pull-Up Negatives', sets: '3', reps: '4', note: '5s lowering, tendon adaptation' },
            { name: 'Broad Jump', sets: '3', reps: '4', note: 'focus on takeoff mechanics' },
            { name: 'Thoracic rotation', sets: '2', reps: '10', note: 'each side, open the upper back' },
            { name: 'Full body stretch', sets: '1', reps: '15 min', note: 'hip, hamstring, calf, shoulder' },
          ],
        },
      ],
    },
    {
      name: 'PHASE 2',
      label: 'Strength & Speed Development',
      weeks: 'Weeks 4–6',
      color: '#F59E0B',
      days: [
        {
          day: 'MON', label: 'Strength — Lower Power', focus: 'Strength',
          exercises: [
            { name: 'Back Squat', sets: '4', reps: '6', note: '78–80% 1RM, controlled' },
            { name: 'Romanian Deadlift', sets: '4', reps: '8', note: 'pause 1s at bottom' },
            { name: 'Bulgarian Split Squat', sets: '3', reps: '8', note: 'each leg, add DBs now' },
            { name: 'Nordic Hamstring Curl', sets: '3', reps: '5', note: 'slow lower, small pause at top' },
            { name: 'Single-Leg Calf Raise', sets: '3', reps: '12', note: 'add DB if easy' },
          ],
        },
        {
          day: 'TUE', label: 'Sprint — Max Speed Development', focus: 'Speed',
          exercises: [
            { name: 'Dynamic warmup', sets: '1', reps: '10 min', note: 'skips, high knees, leg swings' },
            { name: 'Flying 20s', sets: '6', reps: '20m', note: 'build 20m, sprint 20m — full 3 min rest' },
            { name: 'Top-speed runs', sets: '5', reps: '40m', note: '100% effort, walk back rest' },
            { name: 'Sprint + decelerate', sets: '5', reps: '30m', note: 'hard stop at end — knee control' },
            { name: 'Lateral sprint + plant', sets: '5', reps: '10m', note: 'each direction' },
          ],
        },
        {
          day: 'WED', label: 'HIIT — Aerobic Power', focus: 'Endurance',
          exercises: [
            { name: '30-30 intervals', sets: '10', reps: '30s on/30s off', note: '90% max HR on effort' },
            { name: 'Hill sprints (or stairs)', sets: '6', reps: '10s', note: 'all-out, walk down rest' },
            { name: 'Squat jumps', sets: '3', reps: '6', note: 'between interval sets' },
            { name: 'Foam roll', sets: '1', reps: '10 min', note: 'quads, calves, ITB, glutes' },
            { name: 'Stretch', sets: '1', reps: '10 min', note: 'hamstring + hip flexor focus' },
          ],
        },
        {
          day: 'THU', label: 'Strength — Upper & Core', focus: 'Strength',
          exercises: [
            { name: 'Barbell Bench Press', sets: '4', reps: '6', note: '78–80% 1RM, explosive push' },
            { name: 'Weighted Pull-Ups', sets: '3', reps: '5', note: 'add weight via bag/belt' },
            { name: 'Barbell Row', sets: '4', reps: '8', note: 'squeeze at top 1s' },
            { name: 'DB Lateral Raise', sets: '3', reps: '12', note: '10kg, controlled' },
            { name: 'Pallof Press', sets: '3', reps: '10', note: 'each side, rotational stability' },
            { name: 'Copenhagen Plank', sets: '3', reps: '22s', note: 'each side' },
          ],
        },
        {
          day: 'FRI', label: 'Conditioning — Match Simulation', focus: 'Endurance',
          exercises: [
            { name: '10-10-10 run', sets: '8', reps: '10s sprint/10s jog/10s walk', note: 'mimics match demands' },
            { name: 'Tempo run', sets: '3', reps: '6 min', note: '80% HR, 2 min rest' },
            { name: 'Reactive lateral shuffle', sets: '4', reps: '8m', note: 'change direction on cue' },
            { name: 'Single-leg RDL', sets: '3', reps: '8', note: 'each leg, DB, balance focus' },
            { name: 'Hip 90-90 stretch', sets: '2', reps: '60s', note: 'each side' },
          ],
        },
        {
          day: 'SAT', label: 'Explosive Power & Mobility', focus: 'Power',
          exercises: [
            { name: 'Squat (explosive)', sets: '4', reps: '4', note: '80% 1RM, drive hard out of hole' },
            { name: 'Depth Jump', sets: '3', reps: '4', note: 'step off box, react on landing' },
            { name: 'Broad Jump', sets: '4', reps: '5', note: 'maximum effort' },
            { name: 'Pull-Up + L-Sit hold', sets: '3', reps: '5+10s', note: 'upper body + core combo' },
            { name: 'Full mobility session', sets: '1', reps: '20 min', note: 'hip flexors, ankles, thoracic' },
          ],
        },
      ],
    },
    {
      name: 'PHASE 3',
      label: 'Peak Speed & Pre-Season Readiness',
      weeks: 'Weeks 7–10',
      color: '#F87171',
      days: [
        {
          day: 'MON', label: 'Strength — Peak Lower', focus: 'Strength',
          exercises: [
            { name: 'Back Squat', sets: '4', reps: '3', note: '85–88% 1RM, explosive intent' },
            { name: 'Romanian Deadlift', sets: '3', reps: '5', note: 'controlled, heavier' },
            { name: 'Bulgarian Split Squat', sets: '3', reps: '6', note: 'each leg, heavy DBs' },
            { name: 'Nordic Hamstring Curl', sets: '3', reps: '6', note: 'maintain every week' },
            { name: 'Single-Leg Calf Raise', sets: '3', reps: '10', note: 'weighted' },
          ],
        },
        {
          day: 'TUE', label: 'Sprint — Maximum Velocity', focus: 'Speed',
          exercises: [
            { name: 'Sprint mechanics warmup', sets: '1', reps: '10 min', note: 'A/B skips, wickets' },
            { name: 'Flying 30s', sets: '5', reps: '30m', note: '30m build-up then 30m max — full 4 min rest' },
            { name: '5m explosive starts', sets: '8', reps: '5m', note: 'react start, pure acceleration' },
            { name: 'Agility: T-drill', sets: '5', reps: '1', note: 'record time, full rest' },
            { name: 'Deceleration runs', sets: '4', reps: '30m', note: 'sprint then hard stop, knee control' },
          ],
        },
        {
          day: 'WED', label: 'Conditioning — High Intensity', focus: 'Endurance',
          exercises: [
            { name: '5-minute run test', sets: '1', reps: '5 min', note: 'max distance — benchmark vs Week 1' },
            { name: '40-20 intervals', sets: '8', reps: '40s on/20s off', note: '95% max HR' },
            { name: 'Bounding', sets: '3', reps: '20m', note: 'explosive, full extension' },
            { name: 'Lateral hurdle jumps', sets: '3', reps: '8', note: 'each direction, reactive' },
            { name: 'Cooldown jog + stretch', sets: '1', reps: '15 min', note: '' },
          ],
        },
        {
          day: 'THU', label: 'Strength + Recovery', focus: 'Recovery',
          exercises: [
            { name: 'Barbell Bench Press', sets: '3', reps: '4', note: '83–85% 1RM, peak strength' },
            { name: 'Pull-Ups', sets: '3', reps: '6', note: 'weighted, smooth' },
            { name: 'Easy jog', sets: '1', reps: '15 min', note: 'very easy — flushing the legs' },
            { name: 'Foam rolling', sets: '1', reps: '12 min', note: 'quads, calves, ITB, glutes' },
            { name: 'Contrast shower', sets: '1', reps: '8 min', note: '2 min hot / 1 min cold x 3' },
          ],
        },
        {
          day: 'FRI', label: 'Activation — Pre-Season Prep', focus: 'Speed',
          exercises: [
            { name: 'Short sprint activation', sets: '5', reps: '15m', note: '80% effort, sharp not hard' },
            { name: 'Lateral cuts', sets: '4', reps: '5m', note: 'each direction, sharp plant' },
            { name: 'Squat jumps', sets: '3', reps: '5', note: 'light and reactive' },
            { name: 'Pull-Ups', sets: '3', reps: '5', note: 'smooth, no strain' },
            { name: 'Full stretch + breathwork', sets: '1', reps: '15 min', note: 'calm the nervous system' },
          ],
        },
        {
          day: 'SAT', label: 'Time Trial & Full Fitness Test', focus: 'Endurance',
          exercises: [
            { name: 'Dynamic warmup', sets: '1', reps: '15 min', note: 'full body activation' },
            { name: '30m sprint (3 attempts)', sets: '3', reps: '30m', note: 'record best — compare to Week 1' },
            { name: 'Vertical jump test', sets: '3', reps: '1', note: 'record best' },
            { name: '12-minute Cooper run', sets: '1', reps: '12 min', note: 'max distance — VO2 proxy' },
            { name: 'Cooldown + stretch', sets: '1', reps: '15 min', note: 'you earned it' },
          ],
        },
      ],
    },
  ],
};
