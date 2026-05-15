import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useWorkoutLog(userId) {
  const [log, setLog] = useState({});

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('workout_log')
      .select('log_key, done, weight, reps')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!data) return;
        const map = {};
        data.forEach((row) => {
          map[row.log_key] = { done: row.done, weight: row.weight, reps: row.reps };
        });
        setLog(map);
      });
  }, [userId]);

  function getEntry(week, phase, day, exIndex) {
    const key = `w${week}_p${phase}_d${day}_e${exIndex}`;
    return log[key] || { done: false, weight: '', reps: '' };
  }

  async function updateEntry(week, phase, day, exIndex, fields) {
    const key = `w${week}_p${phase}_d${day}_e${exIndex}`;
    const current = log[key] || { done: false, weight: '', reps: '' };
    const updated = { ...current, ...fields };

    setLog((prev) => ({ ...prev, [key]: updated }));

    await supabase.from('workout_log').upsert({
      user_id: userId,
      log_key: key,
      done: updated.done,
      weight: updated.weight,
      reps: updated.reps,
      updated_at: new Date().toISOString(),
    });
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

  async function clearLog() {
    setLog({});
    await supabase.from('workout_log').delete().eq('user_id', userId);
  }

  return { log, getEntry, updateEntry, toggleDone, isDayComplete, clearLog };
}
