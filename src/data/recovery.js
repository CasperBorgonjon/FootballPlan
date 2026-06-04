// Recovery reference — the "what / how / when" rulebook that sits behind the
// active daily routines (see src/data/routines.js for the checkable habits).
// Each item: { l: the lever, d: how to do it, when?: when it applies }.
// `when` is optional — only the actionable items carry it; evidence/context
// notes (what's overrated, why something works) deliberately don't.
export const recoveryData = {
  tabs: [
    { id: 'sleep', label: 'Sleep', icon: '😴' },
    { id: 'body', label: 'Body Care', icon: '🧊' },
    { id: 'prehab', label: 'Prehab', icon: '🦵' },
    { id: 'mental', label: 'Mental', icon: '🧠' },
    { id: 'tracking', label: 'Tracking', icon: '📊' },
    { id: 'supps', label: 'Supps', icon: '💊' },
  ],
  content: {
    sleep: {
      accent: '#6EE7B7',
      title: 'Sleep Protocol',
      sub: 'The single biggest recovery lever you have.',
      cards: [
        {
          title: 'Nightly Targets', priority: 'HIGHEST', pColor: '#F87171',
          items: [
            { l: 'Duration', d: '8–9 hours every night. Non-negotiable for progress.', when: 'Every night' },
            { l: 'Consistency', d: 'Same bedtime/wake time within ~30 min, weekends included.', when: 'Daily, incl. weekends' },
            { l: 'Environment', d: 'Cool room (~18°C), dark, quiet. Earplugs if needed.', when: 'Every night' },
          ],
        },
        {
          title: 'What Actually Matters', priority: 'IMPORTANT', pColor: '#F59E0B',
          items: [
            { l: 'Total hours', d: '8–9 hours is the sweet spot for athletic recovery.' },
            { l: 'Consistency', d: 'The body thrives on a predictable circadian rhythm.' },
            { l: 'Mental State', d: 'Not being wired at bedtime. Calm the nervous system.' },
          ],
        },
        {
          title: 'Overrated Advice', priority: 'CONTEXT', pColor: '#38BDF8',
          items: [
            { l: 'Blue Light', d: 'Research suggests the effect of screens is small; what matters is if the content is stressful (emails/doomscrolling).' },
            { l: 'Injury Stats', d: 'The "1.7x injury risk" stat comes from one 2014 study. The direction is right, but the exact number isn\'t gospel.' },
          ],
        },
        {
          title: 'Nap Protocol', priority: 'OPTIONAL', pColor: '#6EE7B7',
          items: [
            { l: 'When', d: 'After lunch on hard days if you\'re tired.', when: 'Hard days, post-lunch' },
            { l: 'Duration', d: '20 min (power nap) or 90 min (full cycle).', when: 'Before 3pm' },
          ],
        },
      ],
    },
    body: {
      accent: '#38BDF8',
      title: 'Body Care & Recovery',
      sub: 'Adaptation happens during recovery, not training.',
      cards: [
        {
          title: 'Cold Therapy', priority: 'HONEST TAKE', pColor: '#F59E0B',
          items: [
            { l: 'Evidence', d: 'Less impactful than claimed. Good for soreness, minimal for performance.' },
            { l: 'Protocol', d: '10–12 min at 12–15°C. Good for flushing legs after hard conditioning.', when: 'Sprint & conditioning days' },
            { l: 'AVOID', d: 'Do not ice after strength sessions — cold blunts the muscle-building adaptation you just trained for.', when: 'Not after lifting (Mon/Thu)' },
            { l: 'Cold Shower', d: 'A 2–3 min cold finish to a shower if you enjoy it. Optional, low stakes.', when: 'Anytime, optional' },
          ],
        },
        {
          title: 'Soft Tissue', priority: 'MODEST BENEFIT', pColor: '#5BF0A5',
          items: [
            { l: 'Foam Rolling', d: 'Not a daily 20-min ritual — use it to free up a tight or sore area.', when: 'When stiff or sore' },
            { l: 'Protocol', d: '5 min on whatever you are about to train (pre) or just trained (post).', when: 'Around sessions' },
            { l: 'Tools', d: 'Medium-density foam roller + lacrosse ball for glutes/T-spine.' },
          ],
        },
        {
          title: 'Deload Weeks', priority: 'WEEK 4 & 8', pColor: '#A78BFA',
          items: [
            { l: 'The Rule', d: 'Drop volume ~40%. Keep weight/intensity. Fewer sets per exercise.', when: 'Weeks 4 & 8' },
            { l: 'Why', d: 'Adaptation happens during recovery weeks. Don\'t skip them.' },
            { l: 'Active Options', d: 'Light jog, swim, cycle, mobility, or yoga to stay loose.', when: 'Across the deload week' },
          ],
        },
      ],
    },
    prehab: {
      accent: '#F87171',
      title: 'Prehab & Injury Prevention',
      sub: 'Address the #1 time-loss injuries in soccer.',
      cards: [
        {
          title: 'Hamstrings', priority: 'CRITICAL', pColor: '#F87171',
          items: [
            { l: 'Nordic Curls', d: 'Phase 1: 3×3–4. Phase 2: 2×5. Phase 3: 1×6 maintenance. Control the lower.', when: 'Training days' },
            { l: 'Eccentrics', d: 'Always control the lowering phase of every hinge — that\'s where the protection comes from.', when: 'Every hinge movement' },
            { l: 'Evidence', d: 'Proven ~50% reduction in hamstring injuries (Petersen et al 2011).' },
          ],
        },
        {
          title: 'Groin & Adductors', priority: 'HIGH RISK', pColor: '#F59E0B',
          items: [
            { l: 'Copenhagen Plank', d: 'Side plank, top leg on a bench. Phase 1: 3×15s. Phase 2: 3×22s.', when: 'Training days' },
            { l: 'Couch Stretch', d: '2×45s each side — fights desk/driving hip-flexor tightness.', when: 'Daily' },
          ],
        },
        {
          title: 'Ankles & Knees', priority: 'MEDIUM', pColor: '#6EE7B7',
          items: [
            { l: 'Proprioception', d: 'Single-leg balance on a pillow, 30s each leg.', when: 'Most days' },
            { l: 'Calf Raises', d: 'Already in the program; crucial for Achilles health.', when: 'Training days' },
            { l: 'Ankle Circles', d: '30 each direction to mobilise the ankle before load.', when: 'Before every session' },
          ],
        },
      ],
    },
    mental: {
      accent: '#A78BFA',
      title: 'Mental Performance',
      sub: 'Pick 1-2 things that suit you.',
      cards: [
        {
          title: 'Visualization', priority: 'MODERATE EVIDENCE', pColor: '#F59E0B',
          items: [
            { l: 'Protocol', d: '5–10 min. First-person, replay best moments, feel the movement.', when: 'Daily or pre-match' },
            { l: 'Goal', d: 'Skill acquisition and confidence building.' },
          ],
        },
        {
          title: 'Stress & Breathwork', priority: 'RECOVERY', pColor: '#F87171',
          items: [
            { l: 'Breathwork', d: '4-7-8 breathing (inhale 4s, hold 7s, exhale 8s) × 4 rounds.', when: 'Before bed' },
            { l: 'Nature', d: '20 min outside lowers cortisol (Hunter et al 2019).', when: 'When stressed' },
            { l: 'Social', d: 'Time with friends/family is a strong predictor of recovery.', when: 'Weekly' },
          ],
        },
        {
          title: 'Pre-Session Routine', priority: 'NERVOUS SYSTEM', pColor: '#A78BFA',
          items: [
            { l: 'Routine', d: 'Same warmup, music, and first 2–3 cues to switch the brain on.', when: 'Before every session' },
            { l: 'Process Focus', d: 'Focus on what you control, not the outcome.', when: 'During play' },
          ],
        },
      ],
    },
    tracking: {
      accent: '#38BDF8',
      title: 'Tracking & Testing',
      sub: 'Measure progress across the 10 weeks.',
      cards: [
        {
          title: 'Strength Testing', priority: 'WEEKS 1, 5, 9', pColor: '#F59E0B',
          items: [
            { l: 'Week 1', d: 'Estimate 1RM via 8-rep + RIR protocol. Don\'t test cold.', when: 'Week 1' },
            { l: 'Week 5', d: 'True 1RM test for primary lifts.', when: 'Week 5' },
            { l: 'Lifts', d: 'Back squat, bench press, deadlift (optional).' },
          ],
        },
        {
          title: 'Athletic Testing', priority: 'WEEKS 1, 5, 9', pColor: '#F59E0B',
          items: [
            { l: '30m Sprint', d: 'Primary speed metric. 3 attempts, record best.', when: 'Weeks 1, 5, 9' },
            { l: 'Vertical Jump', d: '3 attempts — lower-body power indicator.', when: 'Weeks 1, 5, 9' },
            { l: '505 Agility', d: '5m in, turn, 5m out — change of direction.', when: 'Weeks 1, 5, 9' },
          ],
        },
        {
          title: 'Daily Monitoring', priority: 'CONSISTENCY', pColor: '#38BDF8',
          items: [
            { l: 'Bodyweight', d: 'Weigh on waking. Track the 7-day average, not single days.', when: 'Daily, on waking' },
            { l: 'Wellness', d: 'Rate 1–10: energy, soreness, mood, sleep quality.', when: 'Daily (use the check-in)' },
            { l: 'Resting HR', d: 'Elevated morning HR can flag under-recovery.', when: 'Daily, on waking' },
          ],
        },
      ],
    },
    supps: {
      accent: '#5BF0A5',
      title: 'Supplementation',
      sub: 'The last 5%. Get sleep, food, and training right first.',
      cards: [
        {
          title: 'Tier 1 — Take These', priority: 'STRICTLY EVIDENCE', pColor: '#5BF0A5',
          items: [
            { l: 'Creatine', d: '5g, any time of day. Sprint power, recovery, and brain function.', when: 'Daily' },
            { l: 'Vitamin D3', d: '2000–4000 IU with food. Crucial in Belgium/winter.', when: 'Daily with a meal' },
            { l: 'Omega-3', d: '2–3g combined EPA+DHA. Inflammation and joint health.', when: 'Daily with a meal' },
          ],
        },
        {
          title: 'Tier 2 — Optional', priority: 'SPECIFIC USE', pColor: '#F59E0B',
          items: [
            { l: 'Caffeine', d: '1–3 mg/kg. ~80–240mg for an 80kg athlete.', when: '30–45 min pre-session' },
            { l: 'Whey Protein', d: 'A convenient food source to hit daily protein targets.', when: 'When short on protein' },
            { l: 'Magnesium', d: '300–400mg glycinate if you find it helps sleep.', when: 'Before bed' },
          ],
        },
        {
          title: 'Tier 3 — Probably Not', priority: 'LOW ROI', pColor: '#38BDF8',
          items: [
            { l: 'Beta-alanine', d: 'Useful for 1–4 min efforts, less so for sprint repeats.' },
            { l: 'Beetroot Juice', d: '1–3% endurance gain. Real but small.' },
            { l: 'Tart Cherry', d: 'Modest DOMS reduction. Expensive and sugary.' },
          ],
        },
        {
          title: 'Skip Entirely', priority: 'SAVE MONEY', pColor: '#F87171',
          items: [
            { l: 'BCAAs', d: 'Redundant if total protein is adequate.' },
            { l: 'Pre-workouts', d: 'Underdosed caffeine + filler. Drink coffee.' },
            { l: 'Test Boosters', d: 'No credible evidence.' },
          ],
        },
      ],
    },
  },
};
