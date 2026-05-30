import { usePlan } from '../contexts/PlanContext';
import { matchDayIndexOf, matchPosition } from '../utils/coaching';
import { DAY_TO_INDEX, weekdayIndex } from '../utils/dates';

// Derives today's training context from the active (scheduled) program so other
// sections (nutrition, recovery) can adapt to it.
export function useToday() {
  const { phases, currentPhase, currentWeek, activeProgram, loading } = usePlan();

  if (currentWeek == null || !phases.length) {
    return { scheduled: false, loading, programName: activeProgram?.name ?? null };
  }

  const todayIndex = weekdayIndex();
  const phase = phases[currentPhase] ?? phases[0];
  const day = phase.days.find((d) => DAY_TO_INDEX[d.day] === todayIndex) ?? null;
  const match = matchPosition(todayIndex, matchDayIndexOf(phase.days));

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
