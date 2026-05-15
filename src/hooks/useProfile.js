import { useState } from 'react';

// User profile — position, equipment, schedule, weaknesses.
// Drives position-aware programming + AI plan generation later.
// Wire to `profiles` table:
//   (user_id, position, equipment text[], days_per_week, weaknesses text[], season_phase)
export function useProfile(_userId) {
  const [profile, setProfile] = useState({
    position: null,         // 'fullback' | 'striker' | 'keeper' | ...
    equipment: [],          // ['barbell','dumbbells','box','sprints_field']
    daysPerWeek: 6,
    weaknesses: [],         // ['hamstring','left_foot','aerobic']
    seasonPhase: 'off',     // 'off' | 'pre' | 'in'
  });

  function update(fields) {
    setProfile((p) => ({ ...p, ...fields }));
    // TODO: upsert into supabase.from('profiles')
  }

  return { profile, update };
}
