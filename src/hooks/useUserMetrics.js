import { useState } from 'react';

// Body metrics + readiness check-ins.
// Stub: in-memory. Wire to a `user_metrics` table:
//   (user_id, date, weight_kg, rhr, hrv, sleep_hours, readiness_1to10, soreness, mood)
// Daily entry — one row per user per date.
export function useUserMetrics(_userId) {
  const [entries, setEntries] = useState({});

  function getEntry(dateIso) {
    return entries[dateIso] || null;
  }

  function logEntry(dateIso, fields) {
    setEntries((prev) => ({ ...prev, [dateIso]: { ...(prev[dateIso] || {}), ...fields } }));
    // TODO: upsert into supabase.from('user_metrics')
  }

  return { entries, getEntry, logEntry };
}
