import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TOTAL_WEEKS, getPhaseForWeek } from '../data/training';

// Re-export so existing imports keep working.
export { TOTAL_WEEKS, getPhaseForWeek };

// planId reserved for multi-plan support — today every user has one default plan.
export function useWeekTracker(userId, _planId = 'default') {
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

  async function saveWeek(week) {
    setCurrentWeek(week);
    await supabase.from('week_tracker').upsert({
      user_id: userId,
      current_week: week,
      updated_at: new Date().toISOString(),
    });
  }

  const startPlan = () => saveWeek(1);
  const completeWeek = () => saveWeek(Math.min((currentWeek ?? 1) + 1, TOTAL_WEEKS));

  async function resetPlan() {
    setCurrentWeek(null);
    await supabase.from('week_tracker').delete().eq('user_id', userId);
  }

  return { currentWeek, currentPhase, loaded, startPlan, completeWeek, resetPlan };
}
