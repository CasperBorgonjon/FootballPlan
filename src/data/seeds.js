import { trainingPlan, focusColors, coachNotes } from './training';

// Seed programs inserted (as drafts — no dates) the first time a user loads the
// app with zero programs. After that, programs live in Supabase and are the
// source of truth; these are just the starting point.
//
// A program:
//   { id, name, type: 'linear' | 'repeating', color,
//     start_date, end_date,            // null until scheduled
//     structure: { phases, coachNotes, focusColors } }
//
// Days may carry `commitments` — fixed, externally-imposed events (team
// training, matches). They are informational + the reason your own volume
// drops that day. They are NOT logged like exercises.

const buildup = {
  id: 'buildup',
  name: 'Pre-Season Build-Up',
  type: 'linear',
  color: '#5BF0A5',
  start_date: null,
  end_date: null,
  structure: {
    phases: trainingPlan.phases,
    coachNotes,
    focusColors,
  },
};

// In-season: constant weekly rhythm. Team training Tue & Thu 20:00–21:30,
// match Friday night. Your own work (Mon/Wed/Sat) is maintenance volume —
// team sessions + the match carry the conditioning load.
const inseason = {
  id: 'inseason',
  name: 'In-Season Maintenance',
  type: 'repeating',
  color: '#38BDF8',
  start_date: null,
  end_date: null,
  structure: {
    focusColors,
    coachNotes: [
      'In-season: train to stay sharp, not to build. Team sessions and the match are the real load. Keep your own work to maintenance — enough to hold strength and power without digging a hole before Friday. If legs feel heavy, cut a set, never the match.',
    ],
    phases: [
      {
        name: 'IN-SEASON',
        label: 'Weekly Maintenance',
        weeks: { start: 1, end: 1 },
        weeksLabel: 'Repeating week',
        color: '#38BDF8',
        days: [
          {
            day: 'MON', label: 'Strength — Maintenance', focus: 'Strength',
            coachNote: 'Furthest from the match. Only real strength day of the week — keep it heavy-ish but low volume.',
            exercises: [
              { id: 'is_mon_squat', name: 'Back Squat', sets: '3', reps: '4', note: '80% 1RM, explosive — maintain, don\'t chase' },
              { id: 'is_mon_rdl', name: 'Romanian Deadlift', sets: '3', reps: '6', note: 'controlled, hamstring health' },
              { id: 'is_mon_nordic', name: 'Nordic Hamstring Curl', sets: '2', reps: '5', note: 'non-negotiable injury insurance' },
              { id: 'is_mon_calf', name: 'Single-Leg Calf Raise', sets: '3', reps: '10', note: 'weighted, Achilles health' },
              { id: 'is_mon_copenhagen', name: 'Copenhagen Plank', sets: '3', reps: '20s', note: 'each side, groin' },
            ],
          },
          {
            day: 'TUE', label: 'Team Training', focus: 'Recovery',
            coachNote: 'Team session tonight. Save your legs in the day — no extra gym work.',
            commitments: [
              { id: 'is_tue_team', type: 'team', label: 'Team training', start: '20:00', end: '21:30' },
            ],
            exercises: [
              { id: 'is_tue_mobility', name: 'Optional AM mobility', sets: '1', reps: '10 min', note: 'only if stiff — hips, ankles' },
            ],
          },
          {
            day: 'WED', label: 'Power & Upper', focus: 'Power',
            coachNote: 'Mid-week. Keep it snappy — quality reps, full rest, leave feeling fast.',
            exercises: [
              { id: 'is_wed_jump', name: 'Box jumps', sets: '3', reps: '4', note: 'reactive, full recovery — power not fatigue' },
              { id: 'is_wed_bench', name: 'Barbell Bench Press', sets: '3', reps: '5', note: '75–80% 1RM, explosive push' },
              { id: 'is_wed_pullup', name: 'Pull-Ups', sets: '3', reps: '6', note: 'smooth, add weight if easy' },
              { id: 'is_wed_row', name: 'DB Row', sets: '3', reps: '8', note: 'each side, controlled' },
              { id: 'is_wed_pallof', name: 'Pallof Press', sets: '3', reps: '10', note: 'each side, anti-rotation' },
            ],
          },
          {
            day: 'THU', label: 'Team Training', focus: 'Recovery',
            coachNote: 'Team session tonight, match tomorrow. Nothing of your own — stay fresh.',
            commitments: [
              { id: 'is_thu_team', type: 'team', label: 'Team training', start: '20:00', end: '21:30' },
            ],
            exercises: [
              { id: 'is_thu_mobility', name: 'Optional AM mobility', sets: '1', reps: '10 min', note: 'light only — prime for tomorrow' },
            ],
          },
          {
            day: 'FRI', label: 'Match Day', focus: 'Speed',
            coachNote: 'Game tonight. Eat well, hydrate, warm up properly. This is what the week is for.',
            commitments: [
              { id: 'is_fri_match', type: 'match', label: 'Match', start: '20:00', end: '22:00' },
            ],
            exercises: [],
          },
          {
            day: 'SAT', label: 'Recovery & Mobility', focus: 'Recovery',
            coachNote: 'Day after the match. Flush the legs, don\'t train hard.',
            exercises: [
              { id: 'is_sat_spin', name: 'Easy spin or jog', sets: '1', reps: '20 min', note: 'very easy — flush soreness' },
              { id: 'is_sat_roll', name: 'Foam roll full body', sets: '1', reps: '15 min', note: 'quads, calves, ITB, glutes' },
              { id: 'is_sat_stretch', name: 'Mobility flow', sets: '1', reps: '10 min', note: 'hips, hamstrings, ankles' },
            ],
          },
          {
            day: 'SUN', label: 'REST', focus: 'Recovery',
            coachNote: 'Full rest. Recover for the week ahead.',
            exercises: [
              { id: 'is_sun_rest', name: 'No training', sets: '0', reps: '—', note: 'rest, hydrate, eat well' },
            ],
          },
        ],
      },
    ],
  },
};

export const DEFAULT_PROGRAMS = [buildup, inseason];
