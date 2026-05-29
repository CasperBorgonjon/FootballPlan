import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { toISODate } from '../utils/schedule';

// Test results + bodyweight, one row per (user, date, metric).
// Table: metrics (user_id, date, metric, value, updated_at).
export function useMetrics(userId) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('metrics')
      .select('date, metric, value')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    if (error) console.error('[useMetrics] load failed:', error.message);
    setRows(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    supabase
      .from('metrics')
      .select('date, metric, value')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('[useMetrics] load failed:', error.message);
        setRows(data ?? []);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  async function save(metric, value, date = new Date()) {
    if (!userId || value === '' || value == null) return;
    const item = { user_id: userId, date: toISODate(date), metric, value: Number(value), updated_at: new Date().toISOString() };
    const { error } = await supabase.from('metrics').upsert(item, { onConflict: 'user_id,date,metric' });
    if (error) { console.error('[useMetrics] save failed:', error.message); return; }
    await refetch();
  }

  // Group by metric → sorted history [{ date, value }]
  const byMetric = {};
  rows.forEach((r) => { (byMetric[r.metric] ??= []).push({ date: r.date, value: Number(r.value) }); });

  return { byMetric, save, loading };
}
