// Daily routines — the small, repeatable habits that sit *around* the training
// plan: mobility, the pre-session warm-up, prehab "injury insurance", the
// post-session flush, and an evening wind-down. Static + shared (like recovery
// data); per-user completion is tracked daily in localStorage (see
// useRoutineLog), not here.
//
// A routine: { id, name, icon, accent, cadence, when, blurb, steps }
// A step:    { name, detail, time }   ← `time` is a short prescription label
//
// `cadence` groups the routines in the UI so it's obvious which are everyday
// habits ('daily') and which hang off a training session ('session').
// `accent` values come from the focus palette in src/data/domain.js so the page
// reads in the same colours as the rest of the app.

export const routines = [
  {
    id: 'morning',
    name: 'Morning Mobility',
    icon: '🌅',
    accent: '#6EE7B7',
    cadence: 'daily',
    when: 'On waking, daily',
    blurb: 'Wake the joints up and undo the night. Six minutes, every day — the cheapest performance gain you have.',
    steps: [
      { name: 'Cat–Cow', detail: 'Slow spinal flexion/extension, breathe with it.', time: '10 reps' },
      { name: 'World’s Greatest Stretch', detail: 'Lunge, rotate to the sky, reach. Opens hips and T-spine.', time: '5 each side' },
      { name: 'Ankle Circles', detail: 'Both directions — primes the Achilles before any load.', time: '15 each way' },
      { name: '90/90 Hip Switches', detail: 'Seated, rotate knees side to side. Internal/external hip rotation.', time: '8 each side' },
      { name: 'Glute Bridge', detail: 'Squeeze at the top, slow lower. Switches the glutes on for the day.', time: '12 reps' },
    ],
  },
  {
    id: 'warmup',
    name: 'Pre-Training Warm-Up',
    icon: '🔥',
    accent: '#FB923C',
    cadence: 'session',
    when: 'Before every session & match',
    blurb: 'RAMP it up — raise the heart rate, activate, mobilise, potentiate. Never train or play cold.',
    steps: [
      { name: 'Easy Jog / Skips', detail: 'Raise core temp and heart rate. Build, don’t sprint.', time: '3 min' },
      { name: 'Leg Swings', detail: 'Front-to-back and side-to-side, controlled range.', time: '10 each' },
      { name: 'Walking Lunge + Reach', detail: 'Dynamic length through hips and quads.', time: '6 each side' },
      { name: 'A-Skips', detail: 'Crisp knee drive, stiff ankle — wakes the running mechanics.', time: '2 × 15m' },
      { name: 'Build-Up Strides', detail: 'Accelerate to ~85%, ease off. Potentiate before speed/power work.', time: '3 × 20m' },
    ],
  },
  {
    id: 'prehab',
    name: 'Prehab Circuit',
    icon: '🦵',
    accent: '#F87171',
    cadence: 'session',
    when: 'Training days (or 3×/week)',
    blurb: 'Injury insurance for the parts that keep a footballer off the pitch: hamstrings, groin, calves. Non-negotiable.',
    steps: [
      { name: 'Nordic Hamstring Curl', detail: 'Eccentric lower under control. The single best hamstring protector.', time: '3 × 4–5' },
      { name: 'Copenhagen Plank', detail: 'Side plank, top leg on a bench. Gold-standard groin/adductor work.', time: '3 × 15–20s' },
      { name: 'Single-Leg Calf Raise', detail: 'Weighted, full range. Achilles and calf resilience.', time: '3 × 10' },
      { name: 'Single-Leg Balance', detail: 'Eyes closed or on a pillow. Ankle proprioception.', time: '30s each' },
      { name: 'Couch Stretch', detail: 'Fights the desk/driving hip-flexor tightness.', time: '45s each' },
    ],
  },
  {
    id: 'cooldown',
    name: 'Post-Session Flush',
    icon: '🧊',
    accent: '#38BDF8',
    cadence: 'session',
    when: 'After training & matches',
    blurb: 'Bring the system down and start recovery now, not tomorrow. Light and brief — don’t add fatigue.',
    steps: [
      { name: 'Easy Spin / Walk', detail: 'Flush the legs, drop the heart rate gradually.', time: '5 min' },
      { name: 'Quad & Hip-Flexor Stretch', detail: 'Static hold, breathe out into it.', time: '30s each' },
      { name: 'Hamstring Stretch', detail: 'Gentle — you’re lengthening, not forcing.', time: '30s each' },
      { name: 'Calf Stretch', detail: 'Against a wall, straight and bent knee.', time: '30s each' },
      { name: 'Foam Roll', detail: 'Quads, calves, ITB, glutes. 5 min total on what you trained.', time: '5 min' },
    ],
  },
  {
    id: 'evening',
    name: 'Evening Wind-Down',
    icon: '🌙',
    accent: '#A78BFA',
    cadence: 'daily',
    when: 'Before bed',
    blurb: 'Prime sleep — the biggest recovery lever there is. Calm the nervous system and lengthen what training shortened.',
    steps: [
      { name: 'Couch Stretch', detail: 'Hip flexors again — they take a beating from sitting and sprinting.', time: '45s each' },
      { name: 'Figure-4 Glute Stretch', detail: 'Lying on your back, ankle over knee.', time: '45s each' },
      { name: 'Child’s Pose + Reach', detail: 'Decompress the lower back and lats.', time: '60s' },
      { name: '4-7-8 Breathing', detail: 'Inhale 4s, hold 7s, exhale 8s. Down-regulates for sleep.', time: '4 rounds' },
      { name: 'Screens Off', detail: 'Dim the lights, cool the room (~18°C). Same bedtime, ±30 min.', time: '—' },
    ],
  },
];
