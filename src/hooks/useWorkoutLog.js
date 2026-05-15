import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logKey } from '../utils/logKey';

const EMPTY = { done: false, weight: '', reps: '' };

// planId reserved for multi-plan support. Today uses 'default' — the
// key format stays backward-compatible so existing rows still match.
export function useWorkoutLog(userId, planId = 'default') {
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

  const k = (week, phase, day, exIdx) => logKey(week, phase, day, exIdx, planId);

  function getEntry(week, phase, day, exIdx) {
    return log[k(week, phase, day, exIdx)] || EMPTY;
  }

  async function updateEntry(week, phase, day, exIdx, fields) {
    const key = k(week, phase, day, exIdx);
    const next = { ...(log[key] || EMPTY), ...fields };
    setLog((prev) => ({ ...prev, [key]: next }));

    await supabase.from('workout_log').upsert(
      {
        user_id: userId,
        log_key: key,
        done: next.done,
        weight: next.weight,
        reps: next.reps,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,log_key' }
    );
  }

  function toggleDone(week, phase, day, exIdx) {
    const key = k(week, phase, day, exIdx);
    const current = log[key] || EMPTY;
    updateEntry(week, phase, day, exIdx, { done: !current.done });
  }

  function isDayComplete(week, phase, day, totalExercises) {
    for (let i = 0; i < totalExercises; i++) {
      if (!(log[k(week, phase, day, i)]?.done)) return false;
    }
    return true;
  }

  async function clearLog() {
    setLog({});
    await supabase.from('workout_log').delete().eq('user_id', userId);
  }

  return { log, getEntry, updateEntry, toggleDone, isDayComplete, clearLog };
}
