import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { logKey } from '../utils/logKey';

const EMPTY = { done: false, weight: '', reps: '' };

const readLS = (k) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } };
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota / private mode */ } };

// Workout log keyed by program id + week + stable exercise id.
// Offline-safe: edits are mirrored to localStorage and queued, so logging never
// loses data on poor signal; the queue flushes to Supabase when back online.
export function useWorkoutLog(userId, programId) {
  const lsKey = userId ? `fp_log_${userId}` : null;
  const qKey = userId ? `fp_logq_${userId}` : null;
  // Lazily hydrate from cache so there's no synchronous setState in the effect
  // (and so an offline reload keeps your last state instantly).
  const [log, setLog] = useState(() => (lsKey ? readLS(lsKey) || {} : {}));

  const flush = useCallback(async () => {
    if (!qKey || !navigator.onLine) return;
    const queue = readLS(qKey) || [];
    if (!queue.length) return;
    const remaining = [];
    for (const item of queue) {
      const { error } = await supabase.from('workout_log').upsert(item, { onConflict: 'user_id,log_key' });
      if (error) remaining.push(item);
    }
    writeLS(qKey, remaining);
  }, [qKey]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    supabase.from('workout_log').select('log_key, done, weight, reps').eq('user_id', userId).then(({ data }) => {
      if (cancelled || !data) return;
      const server = {};
      data.forEach((r) => { server[r.log_key] = { done: r.done, weight: r.weight, reps: r.reps }; });
      // Keep any unsynced local edits on top of server data.
      (readLS(qKey) || []).forEach((it) => { server[it.log_key] = { done: it.done, weight: it.weight, reps: it.reps }; });
      setLog(server);
      writeLS(lsKey, server);
      flush();
    });

    const onOnline = () => flush();
    window.addEventListener('online', onOnline);
    return () => { cancelled = true; window.removeEventListener('online', onOnline); };
  }, [userId, lsKey, qKey, flush]);

  const k = (week, exId) => logKey(programId, week, exId);

  function getEntry(week, exId) {
    return log[k(week, exId)] || EMPTY;
  }

  async function updateEntry(week, exId, fields) {
    const key = k(week, exId);
    const next = { ...(log[key] || EMPTY), ...fields };
    const nextMap = { ...log, [key]: next };
    setLog(nextMap);
    if (lsKey) writeLS(lsKey, nextMap);

    const item = { user_id: userId, log_key: key, done: next.done, weight: next.weight, reps: next.reps, updated_at: new Date().toISOString() };
    // Queue first (so an offline edit survives), then try to sync.
    if (qKey) writeLS(qKey, [...(readLS(qKey) || []).filter((x) => x.log_key !== key), item]);

    if (navigator.onLine) {
      const { error } = await supabase.from('workout_log').upsert(item, { onConflict: 'user_id,log_key' });
      if (!error && qKey) writeLS(qKey, (readLS(qKey) || []).filter((x) => x.log_key !== key));
    }
  }

  function toggleDone(week, exId) {
    const current = log[k(week, exId)] || EMPTY;
    updateEntry(week, exId, { done: !current.done });
  }

  function isDayComplete(week, exIds) {
    if (!exIds.length) return false;
    return exIds.every((id) => log[k(week, id)]?.done);
  }

  // Most recent prior week (same program) where this exercise had a weight.
  function lastEntryFor(week, exId) {
    if (!programId) return null;
    const prefix = `${programId}_w`;
    let best = null;
    for (const key in log) {
      if (!key.startsWith(prefix)) continue;
      const val = log[key];
      if (!val || !val.weight) continue;
      const rest = key.slice(prefix.length);
      const us = rest.indexOf('_');
      if (us < 0) continue;
      const wk = Number(rest.slice(0, us));
      const id = rest.slice(us + 1);
      if (id !== exId || wk >= week) continue;
      if (!best || wk > best.week) best = { week: wk, weight: val.weight, reps: val.reps };
    }
    return best;
  }

  async function clearLog() {
    setLog({});
    if (lsKey) writeLS(lsKey, {});
    if (qKey) writeLS(qKey, []);
    await supabase.from('workout_log').delete().eq('user_id', userId);
  }

  return { log, getEntry, updateEntry, toggleDone, isDayComplete, lastEntryFor, clearLog };
}
