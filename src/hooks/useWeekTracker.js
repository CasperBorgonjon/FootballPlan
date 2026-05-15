import { useLocalStorage } from './useLocalStorage';
import { trainingPlan } from '../data/training';

export const TOTAL_WEEKS = 10;

// Returns which phase index a given week (1-based) belongs to
export function getPhaseForWeek(week) {
  const boundaries = [3, 6, 10]; // phase 1: wks 1-3, phase 2: 4-6, phase 3: 7-10
  for (let i = 0; i < boundaries.length; i++) {
    if (week <= boundaries[i]) return i;
  }
  return trainingPlan.phases.length - 1;
}

export function useWeekTracker() {
  const [startDate, setStartDate] = useLocalStorage('plan_start_date', null);

  const currentWeek = startDate
    ? Math.min(
        Math.max(1, Math.ceil((Date.now() - new Date(startDate).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1),
        TOTAL_WEEKS
      )
    : null;

  const currentPhase = currentWeek != null ? getPhaseForWeek(currentWeek) : null;

  function startPlan() {
    setStartDate(new Date().toISOString());
  }

  function resetPlan() {
    setStartDate(null);
  }

  return { startDate, currentWeek, currentPhase, startPlan, resetPlan };
}
