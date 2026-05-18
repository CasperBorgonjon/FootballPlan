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
            { l: 'Duration', d: '8–9 hours every night. Non-negotiable for progress.' },
            { l: 'Consistency', d: 'Same bedtime/wake time within ~30 min, weekends included.' },
            { l: 'Environment', d: 'Cool room (~18°C), dark, quiet. Earplugs if needed.' },
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
            { l: 'When', d: 'After lunch on hard days if tired.' },
            { l: 'Duration', d: '20 min (power nap) or 90 min (full cycle). Avoid after 3pm.' },
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
            { l: 'Protocol', d: '10–12 min at 12–15°C. Conditioning/Sprint days only.' },
            { l: 'AVOID', d: 'Do not use after strength sessions (Mon, Thu). Blunts muscle adaptation.' },
            { l: 'Cold Shower', d: 'Optional. 2–3 min at end of shower if you enjoy it.' },
          ],
        },
        {
          title: 'Soft Tissue', priority: 'MODEST BENEFIT', pColor: '#5BF0A5',
          items: [
            { l: 'Foam Rolling', d: 'Not a daily 20-min commitment. Use for acute mobility and DOMS.' },
            { l: 'Protocol', d: '5 min on whatever you are about to train (pre) or just trained (post).' },
            { l: 'Tools', d: 'Medium-density foam roller + lacrosse ball for glutes/T-spine.' },
          ],
        },
        {
          title: 'Deload Weeks', priority: 'WEEK 4 & 8', pColor: '#A78BFA',
          items: [
            { l: 'The Rule', d: 'Drop volume 40%. Keep weight/intensity. Fewer sets per exercise.' },
            { l: 'Why', d: 'Adaptation happens during recovery weeks. Don\'t skip them.' },
            { l: 'Options', d: 'Light jog, swim, cycle, mobility, yoga.' },
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
            { l: 'Nordic Curls', d: 'Phase 1: 3x3-4. Phase 2: 2x5. Phase 3: 1x6 maintenance.' },
            { l: 'Evidence', d: 'Proven ~50% reduction in hamstring injuries (Petersen et al 2011).' },
            { l: 'Eccentrics', d: 'Always control the lowering phase of all hinge movements.' },
          ],
        },
        {
          title: 'Groin & Adductors', priority: 'HIGH RISK', pColor: '#F59E0B',
          items: [
            { l: 'Copenhagen Plank', d: 'Gold standard. Phase 1: 3x15s. Phase 2: 3x22s.' },
            { l: 'Couch Stretch', d: '2x45s each side daily — fights desk/driving posture.' },
          ],
        },
        {
          title: 'Ankles & Knees', priority: 'MEDIUM', pColor: '#6EE7B7',
          items: [
            { l: 'Proprioception', d: 'Single-leg balance on a pillow (30s each leg).' },
            { l: 'Calf Raises', d: 'Already in program; crucial for Achilles health.' },
            { l: 'Warmup', d: '30 ankle circles each direction before every session.' },
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
            { l: 'Protocol', d: '5–10 min daily. First-person, replay best moments, feel the movement.' },
            { l: 'Goal', d: 'Skill acquisition and confidence building.' },
          ],
        },
        {
          title: 'Stress & Breathwork', priority: 'RECOVERY', pColor: '#F87171',
          items: [
            { l: 'Breathwork', d: '4-7-8 breathing (inhale 4s, hold 7s, exhale 8s) x 4 rounds before bed.' },
            { l: 'Nature', d: '20 min outside lowers cortisol (Hunter et al 2019).' },
            { l: 'Social', d: 'Time with friends/family is a strong predictor of recovery.' },
          ],
        },
        {
          title: 'Pre-Session Routine', priority: 'Nervous System', pColor: '#A78BFA',
          items: [
            { l: 'Routine', d: 'Same warmup, music, and first 2-3 cues to switch the brain on.' },
            { l: 'Process Focus', d: 'Focus on what you control, not the outcome.' },
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
            { l: 'Week 1', d: 'Estimate 1RM via 8-rep + RIR protocol. Don\'t test cold.' },
            { l: 'Week 5', d: 'True 1RM test for primary lifts.' },
            { l: 'Metrics', d: 'Back squat, Bench press, Deadlift (optional).' },
          ],
        },
        {
          title: 'Athletic Testing', priority: 'WEEKS 1, 5, 9', pColor: '#F59E0B',
          items: [
            { l: '30m Sprint', d: 'Primary speed metric. 3 attempts, record best.' },
            { l: 'Vertical Jump', d: '3 attempts — lower body power indicator.' },
            { l: '505 Agility', d: '5m in, turn, 5m out — change of direction.' },
          ],
        },
        {
          title: 'Daily Monitoring', priority: 'CONSISTENCY', pColor: '#38BDF8',
          items: [
            { l: 'Bodyweight', d: 'Daily on waking. Track 7-day average, not single days.' },
            { l: 'Wellness', d: 'Rate 1–10: Energy, soreness, mood, sleep quality.' },
            { l: 'Resting HR', d: 'Elevated AM HR can indicate under-recovery.' },
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
            { l: 'Creatine', d: '5g daily, any time. Sprint power, recovery, and brain function.' },
            { l: 'Vitamin D3', d: '2000–4000 IU daily with food. Crucial in Belgium/winter.' },
            { l: 'Omega-3', d: '2–3g combined EPA+DHA daily. Inflammation and joint health.' },
          ],
        },
        {
          title: 'Tier 2 — Optional', priority: 'SPECIFIC USE', pColor: '#F59E0B',
          items: [
            { l: 'Caffeine', d: '1–3 mg/kg, 30–45 min pre-session. 80–240mg for 80kg athlete.' },
            { l: 'Whey Protein', d: 'Convenient food source to hit daily protein targets.' },
            { l: 'Magnesium', d: '300–400mg glycinate before bed if you find it helps sleep.' },
          ],
        },
        {
          title: 'Tier 3 — Probably Not', priority: 'LOW ROI', pColor: '#38BDF8',
          items: [
            { l: 'Beta-alanine', d: 'Useful for 1-4 min efforts, less so for sprint repeats.' },
            { l: 'Beetroot Juice', d: '1-3% endurance gain. Real but small.' },
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
