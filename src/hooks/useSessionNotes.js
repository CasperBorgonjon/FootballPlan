import { useState } from 'react';

// Per-session notes ("felt strong", "knee tight").
// Stub: in-memory only. Wire to a Supabase `session_notes` table with
// columns (user_id, plan_id, week, phase_idx, day_idx, note, updated_at).
// Key shape matches logKey() but at the day level.
export function useSessionNotes(_userId, _planId = 'default') {
  const [notes, setNotes] = useState({});

  const noteKey = (week, phaseIdx, dayIdx) => `w${week}_p${phaseIdx}_d${dayIdx}`;

  function getNote(week, phaseIdx, dayIdx) {
    return notes[noteKey(week, phaseIdx, dayIdx)] || '';
  }

  function setNote(week, phaseIdx, dayIdx, text) {
    setNotes((prev) => ({ ...prev, [noteKey(week, phaseIdx, dayIdx)]: text }));
    // TODO: upsert into supabase.from('session_notes')
  }

  return { getNote, setNote };
}
