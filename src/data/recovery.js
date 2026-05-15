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
      sub: 'The most underused performance tool in football.',
      cards: [
        {
          title: 'Nightly Targets', priority: 'CRITICAL', pColor: '#F87171',
          items: [
            { l: 'Duration', d: '8–9 hours every night. Non-negotiable for a 6-day plan.' },
            { l: 'Consistency', d: 'Same bedtime and wake time — even weekends. Rhythm matters.' },
            { l: 'Environment', d: 'Cool room (65–68°F), fully dark, no screens 30 min before bed.' },
            { l: 'Pre-sleep', d: 'No caffeine after 2pm. Magnesium glycinate 300mg 30 min before bed.' },
          ],
        },
        {
          title: 'Sleep & Soccer Performance', priority: 'IMPORTANT', pColor: '#F59E0B',
          items: [
            { l: 'Reaction time', d: 'Sleep-deprived players make 20–30% slower decisions on the pitch.' },
            { l: 'Sprint speed', d: 'Top speed drops measurably after even one night under 7 hours.' },
            { l: 'Injury risk', d: 'Athletes sleeping under 8hrs are 1.7x more likely to get injured.' },
            { l: 'Track it', d: 'Free apps: Sleep Cycle or Apple/Google Health. Even just logging hours works.' },
          ],
        },
        {
          title: 'Nap Protocol', priority: 'OPTIONAL', pColor: '#6EE7B7',
          items: [
            { l: 'When', d: 'After lunch on double-session or very hard training days.' },
            { l: 'Duration', d: '20 min (power nap) or 90 min (full cycle). Avoid anything in between.' },
            { l: 'Timing', d: 'Never after 3pm — it will wreck your night sleep.' },
          ],
        },
      ],
    },
    body: {
      accent: '#38BDF8',
      title: 'Body Care & Recovery',
      sub: 'What you do between sessions determines how fast you adapt.',
      cards: [
        {
          title: 'Cold & Contrast Therapy', priority: 'HIGH IMPACT', pColor: '#F59E0B',
          items: [
            { l: 'Cold shower', d: '2–3 min cold at end of shower — do this daily after training.' },
            { l: 'Ice bath', d: '10–12 min at 54–59°F — best within 1hr post-session for sore legs.' },
            { l: 'Contrast therapy', d: 'Alternate 2 min hot / 1 min cold × 3 rounds — great for tired legs.' },
            { l: 'Avoid', d: 'Ice baths right after strength sessions — they blunt muscle adaptation.' },
          ],
        },
        {
          title: 'Foam Rolling & Soft Tissue', priority: 'DAILY', pColor: '#5BF0A5',
          items: [
            { l: 'Morning routine', d: '10 min daily — quads, calves, hamstrings, ITB, glutes, thoracic spine.' },
            { l: 'Post-session', d: '5 min on whatever you just trained.' },
            { l: 'Tools', d: 'Foam roller (medium density) + lacrosse ball for glutes and calves.' },
            { l: 'Sports massage', d: 'Once per month minimum. Targets scar tissue and adhesions that rolling misses.' },
          ],
        },
        {
          title: 'Deload Weeks', priority: 'EVERY 4TH WEEK', pColor: '#A78BFA',
          items: [
            { l: 'When', d: 'Week 4 and Week 8 of your 12-week block.' },
            { l: 'How', d: 'Drop volume by 40%. Keep the same weights/intensity — just fewer sets.' },
            { l: 'Why', d: 'Supercompensation happens during deloads, not during hard weeks. Don\'t skip.' },
            { l: 'Active rest', d: 'Light jog, swimming, cycling, mobility work. Full rest is counterproductive.' },
          ],
        },
      ],
    },
    prehab: {
      accent: '#F87171',
      title: 'Prehab & Injury Prevention',
      sub: 'The injuries that end soccer seasons. Address them before they happen.',
      cards: [
        {
          title: 'Hamstrings', priority: 'CRITICAL — #1 SOCCER INJURY', pColor: '#F87171',
          items: [
            { l: 'Why', d: 'Hamstring tears are the most common time-loss injury in professional soccer.' },
            { l: 'Nordic curls', d: '3×6 twice per week — the single best hamstring injury prevention exercise.' },
            { l: 'Eccentric focus', d: 'Always control the lowering phase of any hamstring exercise.' },
            { l: 'Flexibility', d: '90-90 stretch + standing stretch — 45s holds, daily.' },
            { l: 'Load management', d: 'Never sprint at max intensity without a thorough warmup.' },
          ],
        },
        {
          title: 'Groin & Adductors', priority: 'HIGH RISK IN SOCCER', pColor: '#F59E0B',
          items: [
            { l: 'Why', d: 'Lateral movements and crossing put huge load on groin. Often chronically tight.' },
            { l: 'Copenhagen plank', d: '3×20s each side — gold standard for groin injury prevention.' },
            { l: 'Adductor squeeze', d: '3×15 with ball between knees — daily activation.' },
            { l: 'Hip flexor stretch', d: 'Couch stretch 2×45s each side — every single day.' },
          ],
        },
        {
          title: 'Ankles & Knees', priority: 'HIGH', pColor: '#F59E0B',
          items: [
            { l: 'Ankle circles', d: '30 reps each direction daily — before any session, no exceptions.' },
            { l: 'Single-leg balance', d: '30s each leg on a foam pad — builds proprioception.' },
            { l: 'Terminal knee ext.', d: '3×15 with band — protects patellar tendon.' },
            { l: 'Calf raises', d: 'Single-leg, slow eccentric — 3×15. Prevents Achilles issues.' },
          ],
        },
        {
          title: 'Shoulders & Neck', priority: 'MEDIUM', pColor: '#6EE7B7',
          items: [
            { l: 'Why', d: 'Headers and physical duels put stress on neck and shoulder stability.' },
            { l: 'Neck isometrics', d: '4 directions × 10s holds — 3× per week.' },
            { l: 'Band pull-aparts', d: '3×20 — daily, no equipment needed.' },
            { l: 'Rotator cuff circuit', d: 'Y-T-W raises, external rotation — 3×12 twice per week.' },
          ],
        },
      ],
    },
    mental: {
      accent: '#A78BFA',
      title: 'Mental Performance',
      sub: 'The edge that separates good players from great ones.',
      cards: [
        {
          title: 'Visualization', priority: 'HIGH IMPACT', pColor: '#F59E0B',
          items: [
            { l: 'What', d: 'Mental rehearsal of movements, decisions, and scenarios on the pitch.' },
            { l: 'When', d: '5–10 min before bed or in the morning. Daily habit beats occasional long sessions.' },
            { l: 'How', d: 'Close eyes. See the pitch in first-person. Replay your best game moments. Feel your best pass, sprint, finish.' },
            { l: 'Game prep', d: 'Night before a match: visualize your specific assignments, your runs, winning your duels.' },
          ],
        },
        {
          title: 'Stress & Cortisol', priority: 'RECOVERY KILLER', pColor: '#F87171',
          items: [
            { l: 'Why it matters', d: 'Chronic stress = elevated cortisol = slower recovery, muscle breakdown, disrupted sleep.' },
            { l: 'Breathwork', d: '4-7-8 breathing: inhale 4s, hold 7s, exhale 8s — 4 rounds before bed.' },
            { l: 'Social recovery', d: 'Time with friends and family actively lowers cortisol — treat it like training.' },
            { l: 'Nature', d: '20 min outside (no phone) measurably reduces cortisol levels.' },
            { l: 'Avoid', d: 'Heavy social media and news consumption spikes cortisol throughout the day.' },
          ],
        },
        {
          title: 'Focus & Pre-Session Routine', priority: 'BUILD THIS HABIT', pColor: '#A78BFA',
          items: [
            { l: 'Pre-session ritual', d: 'Same warmup music, same dynamic movements, same mental cues. Consistency trains the nervous system to switch on.' },
            { l: 'Process goals', d: 'Focus only on what you control: your pressing, your movement, your touch. Not outcomes.' },
            { l: 'Session journal', d: '3 min after training: one thing done well, one thing to improve. Compounds over 12 weeks.' },
          ],
        },
      ],
    },
    tracking: {
      accent: '#38BDF8',
      title: 'Tracking & Testing',
      sub: "You can't improve what you don't measure.",
      cards: [
        {
          title: 'Strength Testing', priority: 'START OF EACH PHASE', pColor: '#F59E0B',
          items: [
            { l: 'When', d: 'Test 1RM at weeks 1, 5, and 9 — before each new phase begins.' },
            { l: 'Key lifts', d: 'Back squat, deadlift, bench press — your baseline numbers.' },
            { l: 'Why', d: 'Percentage-based training (85%, 90%) is only accurate if your 1RM is up-to-date.' },
            { l: 'Log everything', d: 'Date, weight, sets, reps, RPE (1–10 scale). Use Strong App, JEFIT, or notes.' },
          ],
        },
        {
          title: 'Athletic Testing', priority: 'EVERY 4 WEEKS', pColor: '#F59E0B',
          items: [
            { l: '30m sprint time', d: 'Your primary speed metric. Test with phone timer or partner. 3 attempts, record best.' },
            { l: 'Vertical jump', d: 'Standing vertical — lower body power indicator. Simple phone measurement.' },
            { l: '505 agility test', d: 'Change-of-direction speed — 5m in, turn, 5m out. Critical for soccer.' },
            { l: 'Yo-Yo test', d: 'Intermittent fitness test — tracks your match-level aerobic capacity.' },
          ],
        },
        {
          title: 'Body & Recovery Monitoring', priority: 'WEEKLY', pColor: '#38BDF8',
          items: [
            { l: 'Bodyweight', d: 'Weigh daily, same time (morning, before eating). Track the 7-day average, not the daily number.' },
            { l: 'Resting heart rate', d: 'Elevated RHR in the morning = under-recovered. Pull back intensity that day.' },
            { l: 'HRV', d: 'Heart Rate Variability — most accurate readiness metric. Free with Apple Health or Garmin.' },
            { l: 'Subjective score', d: 'Rate 1–10 each morning: energy, soreness, mood. Patterns reveal overtraining early.' },
            { l: 'Progress photos', d: 'Front, side, back — same lighting, every 4 weeks.' },
          ],
        },
      ],
    },
    supps: {
      accent: '#5BF0A5',
      title: 'Supplementation',
      sub: 'Only what actually works. No gimmicks.',
      cards: [
        {
          title: 'Tier 1 — Take These', priority: 'EVIDENCE-BASED', pColor: '#5BF0A5',
          items: [
            { l: 'Creatine monohydrate', d: '5g daily, every day. The most researched supplement in sport. Improves sprint power and recovery.' },
            { l: 'Vitamin D3', d: '2000–4000 IU daily. Most athletes are deficient. Impacts immunity, testosterone, recovery.' },
            { l: 'Magnesium glycinate', d: '300–400mg before bed. Sleep quality, muscle cramps, nervous system recovery.' },
            { l: 'Omega-3 (fish oil)', d: '2–3g EPA/DHA daily. Reduces inflammation, supports joint health — very relevant for soccer load.' },
            { l: 'Protein powder', d: 'Whey post-session, casein at night — only if you can\'t hit targets from food alone.' },
          ],
        },
        {
          title: 'Tier 2 — Consider These', priority: 'MODERATE EVIDENCE', pColor: '#F59E0B',
          items: [
            { l: 'Caffeine', d: '3–5mg/kg, 30–45 min pre-session. Natural performance enhancer. Don\'t overuse.' },
            { l: 'Beta-alanine', d: '3.2g/day. Reduces fatigue during high-intensity intervals. Causes tingling — harmless.' },
            { l: 'Beetroot juice', d: 'Strong evidence for endurance athletes. 300–500ml 2–3 hrs pre-session. Improves VO2 efficiency.' },
            { l: 'Tart cherry juice', d: '8oz before bed. Reduces muscle soreness and inflammation — ideal for heavy training blocks.' },
            { l: 'Electrolyte mix', d: 'On hard days — sodium, potassium, magnesium. Skip the sugary sports drinks.' },
          ],
        },
        {
          title: 'Skip These', priority: 'SAVE YOUR MONEY', pColor: '#F87171',
          items: [
            { l: 'Most pre-workouts', d: 'Mostly caffeine + filler. Just drink coffee.' },
            { l: 'BCAAs', d: 'Completely redundant if your protein intake is adequate. Waste of money.' },
            { l: 'Fat burners', d: 'Off-season is for building. And they don\'t work anyway.' },
            { l: 'Testosterone boosters', d: 'No credible evidence. Placebo at best.' },
            { l: 'Proprietary blends', d: 'Underdosed, hidden ingredient amounts. Always skip.' },
          ],
        },
        {
          title: 'Timing Guide', priority: 'REFERENCE', pColor: '#38BDF8',
          items: [
            { l: 'Morning', d: 'Vitamin D3 + Omega-3 + Zinc (with breakfast)' },
            { l: 'Pre-session', d: 'Caffeine (45 min before), Beta-alanine, Creatine, Beetroot juice' },
            { l: 'Post-session', d: 'Whey protein, Creatine (if not taken pre)' },
            { l: 'Night', d: 'Magnesium glycinate, Casein protein, Tart cherry juice' },
          ],
        },
      ],
    },
  },
};
