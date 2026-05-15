import { useLocalStorage } from './useLocalStorage';

// Key: "log_w{week}_p{phase}_d{day}_e{exIndex}"
// Value: { done: bool, weight: string, reps: string }

export function useWorkoutLog() {
  const [log, setLog] = useLocalStorage('workout_log', {});

  function getKey(week, phase, day, exIndex) {
    return `w${week}_p${phase}_d${day}_e${exIndex}`;
  }

  function getEntry(week, phase, day, exIndex) {
    return log[getKey(week, phase, day, exIndex)] || { done: false, weight: '', reps: '' };
  }

  function updateEntry(week, phase, day, exIndex, fields) {
    const key = getKey(week, phase, day, exIndex);
    setLog((prev) => ({
      ...prev,
      [key]: { ...getEntry(week, phase, day, exIndex), ...fields },
    }));
  }

  function toggleDone(week, phase, day, exIndex) {
    const entry = getEntry(week, phase, day, exIndex);
    updateEntry(week, phase, day, exIndex, { done: !entry.done });
  }

  function isDayComplete(week, phase, day, totalExercises) {
    return Array.from({ length: totalExercises }, (_, i) =>
      getEntry(week, phase, day, i).done
    ).every(Boolean);
  }

  function clearLog() {
    setLog({});
  }

  return { log, getEntry, updateEntry, toggleDone, isDayComplete, clearLog };
}
