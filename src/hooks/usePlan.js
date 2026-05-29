import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROGRAMS } from '../data/seeds';
import {
  resolveActiveProgram,
  resolvePosition,
  getTotalWeeks,
  getPhaseForWeek as phaseForWeek,
  addDays,
  toISODate,
} from '../utils/schedule';

// Single source of truth for plan access + calendar positioning.
//
// Programs live in Supabase (table `programs`). On first load for a user with
// zero programs, the static DEFAULT_PROGRAMS are seeded as drafts (no dates).
// "What do I do today" is resolved by date from the scheduled program — there
// is no manual week counter.
//
// Return shape is preserved for components (phases/coachNotes/focusColors/
// totalWeeks/getPhaseForWeek) plus calendar fields (currentWeek/currentPhase).

const DEFAULT_REPEATING_WEEKS = 30; // season length when scheduling a repeating program

// Fetch a user's programs; seed the defaults (as drafts) on first load.
// Pure data loader — no React state — so callers control when state updates.
async function loadPrograms(userId) {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[usePlan] failed to load programs:', error.message, error);
    return [];
  }
  if (data && data.length > 0) return data;

  const seeded = DEFAULT_PROGRAMS.map((p, i) => ({ ...p, user_id: userId, sort_order: i }));
  const { data: inserted, error: seedError } = await supabase
    .from('programs')
    .upsert(seeded, { onConflict: 'user_id,id' })
    .select();
  if (seedError) {
    console.error('[usePlan] failed to seed default programs:', seedError.message, seedError);
    return [];
  }
  return inserted ?? seeded;
}

export function usePlan(userId, today = new Date()) {
  const [programs, setPrograms] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) return;
    const next = await loadPrograms(userId);
    setPrograms(next);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    loadPrograms(userId).then((next) => {
      if (cancelled) return;
      setPrograms(next);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const list = programs ?? [];

  // The program scheduled across today (date-based), if any.
  const scheduledProgram = resolveActiveProgram(list, today);
  // What to render: the scheduled program, else the build-up so a new user sees
  // something and can start it.
  const displayProgram =
    scheduledProgram ?? list.find((p) => p.id === 'buildup') ?? list[0] ?? null;
  // Position only exists when a program is actually scheduled.
  const position = scheduledProgram ? resolvePosition(scheduledProgram, today) : null;

  // Schedule a program from a chosen start date (end date is derived from its
  // length). startISO is 'YYYY-MM-DD'.
  async function scheduleProgram(programId, startISO) {
    const program = list.find((p) => p.id === programId);
    if (!program || !userId || !startISO) return;
    const weeks =
      program.type === 'repeating' ? DEFAULT_REPEATING_WEEKS : getTotalWeeks(program);
    const { error } = await supabase
      .from('programs')
      .update({
        start_date: startISO,
        end_date: addDays(startISO, weeks * 7 - 1),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('id', programId);
    if (error) {
      console.error('[usePlan] scheduleProgram failed:', error.message, error);
      return;
    }
    await refetch();
  }

  // Schedule a program from today.
  function startPlan(programId = displayProgram?.id) {
    return scheduleProgram(programId, toISODate(today));
  }

  // ── Editor CRUD ──
  async function createProgram(program) {
    if (!userId) return false;
    const { error } = await supabase
      .from('programs')
      .insert({ ...program, user_id: userId, sort_order: list.length });
    if (error) { console.error('[usePlan] createProgram failed:', error.message, error); return false; }
    await refetch();
    return true;
  }

  async function updateProgram(id, fields) {
    if (!userId) return false;
    const { error } = await supabase
      .from('programs')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('id', id);
    if (error) { console.error('[usePlan] updateProgram failed:', error.message, error); return false; }
    await refetch();
    return true;
  }

  async function deleteProgram(id) {
    if (!userId) return false;
    const { error } = await supabase.from('programs').delete().eq('user_id', userId).eq('id', id);
    if (error) { console.error('[usePlan] deleteProgram failed:', error.message, error); return false; }
    await refetch();
    return true;
  }

  // Unschedule a program (back to draft).
  async function resetPlan(programId = (scheduledProgram ?? displayProgram)?.id) {
    if (!programId || !userId) return;
    await supabase
      .from('programs')
      .update({ start_date: null, end_date: null, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('id', programId);
    await refetch();
  }

  return {
    programs: list,
    activeProgram: displayProgram,
    scheduledProgram,
    phases: displayProgram?.structure?.phases ?? [],
    coachNotes: displayProgram?.structure?.coachNotes ?? [],
    focusColors: displayProgram?.structure?.focusColors ?? {},
    totalWeeks: getTotalWeeks(displayProgram),
    getPhaseForWeek: (week) => phaseForWeek(displayProgram, week),
    position,
    currentWeek: position?.week ?? null,
    currentPhase: position?.phaseIndex ?? null,
    loading,
    today,
    startPlan,
    scheduleProgram,
    resetPlan,
    createProgram,
    updateProgram,
    deleteProgram,
    refetch,
  };
}
