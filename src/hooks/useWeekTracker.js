import { useLocalStorage } from './useLocalStorage';
import { trainingPlan } from '../data/training';

export const TOTAL_WEEKS = 10;

export function getPhaseForWeek(week) {
  const boundaries = [3, 6, 10];
  for (let i = 0; i < boundaries.length; i++) {
    if (week <= boundaries[i]) return i;
  }
  return trainingPlan.phases.length - 1;
}

export function useWeekTracker() {
  const [currentWeek, setCurrentWeek] = useLocalStorage('plan_current_week', null);

  const currentPhase = currentWeek != null ? getPhaseForWeek(currentWeek) : null;

  function startPlan() {
    setCurrentWeek(1);
  }

  function completeWeek() {
    setCurrentWeek((w) => Math.min(w + 1, TOTAL_WEEKS));
  }

  function resetPlan() {
    setCurrentWeek(null);
  }

  return { currentWeek, currentPhase, startPlan, completeWeek, resetPlan };
}
