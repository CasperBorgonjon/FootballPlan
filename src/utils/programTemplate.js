// Non-component helpers for the program editor — kept out of the component
// file so fast-refresh stays happy.

export const DEFAULT_FOCUS_COLORS = {
  Strength: '#F59E0B', Endurance: '#38BDF8', Power: '#A78BFA',
  Speed: '#FB923C', Recovery: '#6EE7B7',
};

export function blankProgram() {
  return {
    id: '', name: 'New Program', type: 'linear', color: '#5DFFB1',
    start_date: null, end_date: null,
    structure: {
      focusColors: DEFAULT_FOCUS_COLORS,
      coachNotes: [],
      phases: [{
        name: 'PHASE 1', label: 'New Phase', weeks: { start: 1, end: 1 },
        weeksLabel: '', color: '#5DFFB1',
        days: [{ day: 'MON', label: 'Session', focus: 'Strength', exercises: [] }],
      }],
    },
  };
}

export function slugify(name, existingIds) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'program';
  let id = base; let n = 2;
  while (existingIds.includes(id)) id = `${base}-${n++}`;
  return id;
}
