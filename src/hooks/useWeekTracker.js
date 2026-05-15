import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { trainingPlan } from '../data/training';

export const TOTAL_WEEKS = 10;

export function getPhaseForWeek(week) {
  const boundaries = [3, 6, 10];
  for (let i = 0; i < boundaries.length; i++) {
    if (week <= boundaries[i]) return i;
  }
  return trainingPlan.phases.length - 1;
}

export function useWeekTracker(userId) {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('week_tracker')
      .select('current_week')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        setCurrentWeek(data?.current_week ?? null);
        setLoaded(true);
      });
  }, [userId]);

  const currentPhase = currentWeek != null ? getPhaseForWeek(currentWeek) : null;

  async function startPlan() {
    const week = 1;
    setCurrentWeek(week);
    await supabase.from('week_tracker').upsert({ user_id: userId, current_week: week, updated_at: new Date().toISOString() });
  }

  async function completeWeek() {
    const next = Math.min((currentWeek ?? 1) + 1, TOTAL_WEEKS);
    setCurrentWeek(next);
    await supabase.from('week_tracker').upsert({ user_id: userId, current_week: next, updated_at: new Date().toISOString() });
  }

  async function resetPlan() {
    setCurrentWeek(null);
    await supabase.from('week_tracker').delete().eq('user_id', userId);
  }

  return { currentWeek, currentPhase, loaded, startPlan, completeWeek, resetPlan };
}
