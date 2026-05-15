import { trainingPlan, focusColors, coachNotes, TOTAL_WEEKS, getPhaseForWeek } from '../data/training';

// Single source of truth for plan access.
// Today: returns the static `trainingPlan` for planId='default'.
// Later: swap this body to fetch from Supabase `plans` / `plan_phases` /
// `plan_exercises` tables — components keep using the same shape.
//
// Designed to support: editable plans, custom phases, multiple plans
// (in-season vs off-season), coach-shared plans, AI-generated plans.
export function usePlan(_planId = 'default') {
  return {
    plan: trainingPlan,
    phases: trainingPlan.phases,
    focusColors,
    coachNotes,
    totalWeeks: TOTAL_WEEKS,
    getPhaseForWeek,
    loading: false,
  };
}
