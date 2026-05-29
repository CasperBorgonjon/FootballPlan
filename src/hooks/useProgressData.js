import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Pulls everything needed for the Progress view: all workout-log rows and all
// daily check-ins for the user. Read-only.
export function useProgressData(userId) {
  const [log, setLog] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    Promise.all([
      supabase.from('workout_log').select('log_key, done, weight, reps').eq('user_id', userId),
      supabase.from('daily_checkin').select('date, sleep_hours, legs, energy').eq('user_id', userId).order('date', { ascending: true }),
    ]).then(([logRes, checkRes]) => {
      if (cancelled) return;
      if (logRes.error) console.error('[useProgressData] log:', logRes.error.message);
      if (checkRes.error) console.error('[useProgressData] checkins:', checkRes.error.message);
      setLog(logRes.data ?? []);
      setCheckins(checkRes.data ?? []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [userId]);

  return { log, checkins, loading };
}

// Parse a log key `{programId}_w{week}_{exerciseId}`. Program slugs never
// contain underscores, so the first segment is the program id and the second
// is the week.
export function parseLogKey(key) {
  const parts = key.split('_');
  if (parts.length < 3 || !parts[1].startsWith('w')) return null;
  return {
    programId: parts[0],
    week: Number(parts[1].slice(1)),
    exerciseId: parts.slice(2).join('_'),
  };
}
