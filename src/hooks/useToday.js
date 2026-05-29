import { usePlan } from './usePlan';
import { matchDayIndexOf, matchPosition } from '../utils/coaching';

const DAY_TO_INDEX = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };
const TODAY_INDEX = (new Date().getDay() + 6) % 7;

// Derives today's training context from the active (scheduled) program so other
// sections (nutrition, recovery) can adapt to it.
export function useToday(userId) {
  const plan = usePlan(userId);
  const { phases, currentPhase, currentWeek, activeProgram, loading } = plan;

  if (currentWeek == null || !phases.length) {
    return { scheduled: false, loading, programName: activeProgram?.name ?? null };
  }

  const phase = phases[currentPhase] ?? phases[0];
  const day = phase.days.find((d) => DAY_TO_INDEX[d.day] === TODAY_INDEX) ?? null;
  const match = matchPosition(TODAY_INDEX, matchDayIndexOf(phase.days));

  let dayType = 'rest';
  if (day) {
    const hasLoad = day.exercises.some(
      (e) => (parseInt(e.sets, 10) || 0) > 0 && !/no training/i.test(e.name)
    );
    const hasCommit = (day.commitments?.length || 0) > 0;
    dayType = hasLoad || hasCommit ? 'training' : 'rest';
  }

  return {
    scheduled: true,
    loading,
    day,
    dayType,
    match,
    week: currentWeek,
    programType: activeProgram?.type,
    programName: activeProgram?.name,
  };
}
