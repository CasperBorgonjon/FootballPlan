import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { toISODate } from '../utils/schedule';

// Daily readiness check-in, one row per user per day.
// Table: daily_checkin (user_id, date, sleep_hours, legs, energy, note).
export function useReadiness(userId, date = new Date()) {
  const dateISO = toISODate(date);
  const [checkin, setCheckin] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    supabase
      .from('daily_checkin')
      .select('sleep_hours, legs, energy, note')
      .eq('user_id', userId)
      .eq('date', dateISO)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('[useReadiness] load failed:', error.message);
        setCheckin(data ?? null);
        setLoaded(true);
      });
    return () => { cancelled = true; };
  }, [userId, dateISO]);

  const save = useCallback(
    async (fields) => {
      const next = { ...(checkin ?? {}), ...fields };
      setCheckin(next);
      if (!userId) return;
      const { error } = await supabase.from('daily_checkin').upsert(
        {
          user_id: userId,
          date: dateISO,
          sleep_hours: next.sleep_hours === '' ? null : next.sleep_hours,
          legs: next.legs ?? null,
          energy: next.energy ?? null,
          note: next.note ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,date' }
      );
      if (error) console.error('[useReadiness] save failed:', error.message);
    },
    [checkin, userId, dateISO]
  );

  return { checkin, loaded, save };
}
