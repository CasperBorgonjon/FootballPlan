import { useState } from 'react';
import { DEFAULT_FOCUS_COLORS, slugify } from '../utils/programTemplate';
import ExercisePicker from './ExercisePicker';

const FOCUS_OPTIONS = ['Strength', 'Power', 'Speed', 'Endurance', 'Recovery'];
const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const genId = () => `ex_${Math.random().toString(36).slice(2, 9)}`;
const genCid = () => `c_${Math.random().toString(36).slice(2, 9)}`;

export default function ProgramEditor({ program, isNew, existingIds, onSave, onCancel, onDelete }) {
  const [name, setName] = useState(program.name);
  const [type, setType] = useState(program.type);
  const [color, setColor] = useState(program.color || '#5DFFB1');
  const [phases, setPhases] = useState(program.structure?.phases ?? []);
  const [pickerAt, setPickerAt] = useState(null); // { pi, di } | null

  // All edits clone-and-mutate the phases tree.
  const mutate = (fn) => setPhases((prev) => { const next = structuredClone(prev); fn(next); return next; });

  const setPhase = (pi, patch) => mutate((p) => Object.assign(p[pi], patch));
  const addPhase = () => mutate((p) => {
    const lastEnd = p.at(-1)?.weeks.end ?? 0;
    p.push({
      name: `PHASE ${p.length + 1}`, label: 'New Phase',
      weeks: { start: lastEnd + 1, end: lastEnd + 3 }, weeksLabel: '', color: '#5DFFB1',
      days: [{ day: 'MON', label: 'Session', focus: 'Strength', exercises: [] }],
    });
  });
  const removePhase = (pi) => mutate((p) => p.splice(pi, 1));

  const setDay = (pi, di, patch) => mutate((p) => Object.assign(p[pi].days[di], patch));
  const addDay = (pi) => mutate((p) => p[pi].days.push({ day: 'MON', label: 'Session', focus: 'Strength', exercises: [] }));
  const removeDay = (pi, di) => mutate((p) => p[pi].days.splice(di, 1));

  const setEx = (pi, di, ei, patch) => mutate((p) => Object.assign(p[pi].days[di].exercises[ei], patch));
  const addEx = (pi, di) => mutate((p) => p[pi].days[di].exercises.push({ id: genId(), name: '', sets: '3', reps: '8', note: '' }));
  const addExFromLib = (pi, di, lib) => mutate((p) =>
    p[pi].days[di].exercises.push({ id: genId(), name: lib.name, sets: lib.sets, reps: lib.reps, note: lib.note })
  );
  const removeEx = (pi, di, ei) => mutate((p) => p[pi].days[di].exercises.splice(ei, 1));
  const moveEx = (pi, di, ei, dir) => mutate((p) => {
    const arr = p[pi].days[di].exercises; const j = ei + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[ei], arr[j]] = [arr[j], arr[ei]];
  });

  const addCommit = (pi, di) => mutate((p) => {
    const d = p[pi].days[di];
    (d.commitments ??= []).push({ id: genCid(), type: 'team', label: 'Team training', start: '20:00', end: '21:30' });
  });
  const setCommit = (pi, di, ci, patch) => mutate((p) => Object.assign(p[pi].days[di].commitments[ci], patch));
  const removeCommit = (pi, di, ci) => mutate((p) => p[pi].days[di].commitments.splice(ci, 1));

  function handleSave() {
    if (!name.trim()) return;
    const structure = {
      focusColors: program.structure?.focusColors ?? DEFAULT_FOCUS_COLORS,
      coachNotes: program.structure?.coachNotes ?? [],
      phases,
    };
    const id = isNew ? slugify(name, existingIds) : program.id;
    onSave({ id, name: name.trim(), type, color, structure }, isNew);
  }

  const isLinear = type === 'linear';

  return (
    <div className="editor">
      <div className="editor-bar">
        <button className="btn btn--ghost btn--sm" onClick={onCancel}>← Cancel</button>
        <div className="editor-bar-actions">
          {!isNew && (
            <button
              className="btn btn--sm editor-del"
              onClick={() => { if (confirm(`Delete “${program.name}”? This cannot be undone.`)) onDelete(program.id); }}
            >
              Delete
            </button>
          )}
          <button className="btn btn--primary btn--sm" onClick={handleSave}>Save</button>
        </div>
      </div>

      <div className="editor-card">
        <div className="edit-grid">
          <label className="edit-field edit-field--grow">
            <span>Program name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="edit-field">
            <span>Type</span>
            <div className="edit-seg">
              <button className={isLinear ? 'is-on' : ''} onClick={() => setType('linear')}>Linear</button>
              <button className={!isLinear ? 'is-on' : ''} onClick={() => setType('repeating')}>Repeating</button>
            </div>
          </label>
          <label className="edit-field">
            <span>Color</span>
            <input className="edit-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        </div>
        <p className="edit-hint">
          {isLinear
            ? 'Linear — weeks progress through phases (build-up). Set each phase’s week range.'
            : 'Repeating — one weekly cycle repeats all season (in-season). Usually a single phase.'}
        </p>
      </div>

      {phases.map((phase, pi) => (
        <div key={pi} className="phase-edit">
          <div className="phase-edit-head">
            <input
              className="phase-name-input" type="text" value={phase.label}
              onChange={(e) => setPhase(pi, { label: e.target.value })}
              placeholder="Phase name"
            />
            {isLinear && (
              <div className="phase-weeks">
                <span>Weeks</span>
                <input type="number" min="1" value={phase.weeks.start}
                  onChange={(e) => setPhase(pi, { weeks: { ...phase.weeks, start: +e.target.value } })} />
                <i>–</i>
                <input type="number" min="1" value={phase.weeks.end}
                  onChange={(e) => setPhase(pi, { weeks: { ...phase.weeks, end: +e.target.value } })} />
              </div>
            )}
            {phases.length > 1 && (
              <button className="mini-btn mini-btn--del" onClick={() => removePhase(pi)}>Remove phase</button>
            )}
          </div>

          {phase.days.map((day, di) => (
            <div key={di} className="day-edit">
              <div className="day-edit-head">
                <select value={day.day} onChange={(e) => setDay(pi, di, { day: e.target.value })}>
                  {WEEKDAYS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
                <input className="day-label-input" type="text" value={day.label}
                  onChange={(e) => setDay(pi, di, { label: e.target.value })} placeholder="Day label" />
                <select value={day.focus} onChange={(e) => setDay(pi, di, { focus: e.target.value })}>
                  {FOCUS_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <button className="mini-btn mini-btn--del" onClick={() => removeDay(pi, di)}>✕</button>
              </div>

              {/* Commitments */}
              {(day.commitments ?? []).map((c, ci) => (
                <div key={c.id} className="commit-edit">
                  <select value={c.type} onChange={(e) => setCommit(pi, di, ci, { type: e.target.value })}>
                    <option value="team">Team</option>
                    <option value="match">Match</option>
                  </select>
                  <input type="text" value={c.label} onChange={(e) => setCommit(pi, di, ci, { label: e.target.value })} placeholder="Label" />
                  <input className="time-input" type="text" value={c.start} onChange={(e) => setCommit(pi, di, ci, { start: e.target.value })} placeholder="20:00" />
                  <input className="time-input" type="text" value={c.end} onChange={(e) => setCommit(pi, di, ci, { end: e.target.value })} placeholder="21:30" />
                  <button className="mini-btn mini-btn--del" onClick={() => removeCommit(pi, di, ci)}>✕</button>
                </div>
              ))}

              {/* Exercises */}
              {day.exercises.map((ex, ei) => (
                <div key={ex.id} className="ex-edit">
                  <div className="ex-edit-top">
                    <input className="ex-name-input" type="text" value={ex.name}
                      onChange={(e) => setEx(pi, di, ei, { name: e.target.value })} placeholder="Exercise name" />
                    <input className="num-input" type="text" value={ex.sets}
                      onChange={(e) => setEx(pi, di, ei, { sets: e.target.value })} placeholder="sets" />
                    <i className="ex-edit-x">×</i>
                    <input className="num-input" type="text" value={ex.reps}
                      onChange={(e) => setEx(pi, di, ei, { reps: e.target.value })} placeholder="reps" />
                    <div className="ex-edit-move">
                      <button className="mini-btn" onClick={() => moveEx(pi, di, ei, -1)} disabled={ei === 0}>↑</button>
                      <button className="mini-btn" onClick={() => moveEx(pi, di, ei, 1)} disabled={ei === day.exercises.length - 1}>↓</button>
                      <button className="mini-btn mini-btn--del" onClick={() => removeEx(pi, di, ei)}>✕</button>
                    </div>
                  </div>
                  <input className="ex-note-input" type="text" value={ex.note || ''}
                    onChange={(e) => setEx(pi, di, ei, { note: e.target.value })} placeholder="Note / prescription (optional)" />
                </div>
              ))}

              <div className="day-edit-actions">
                <button className="mini-btn mini-btn--lib" onClick={() => setPickerAt({ pi, di })}>+ From library</button>
                <button className="mini-btn" onClick={() => addEx(pi, di)}>+ Blank</button>
                <button className="mini-btn" onClick={() => addCommit(pi, di)}>+ Commitment</button>
              </div>
            </div>
          ))}

          <button className="mini-btn add-day" onClick={() => addDay(pi)}>+ Add day</button>
        </div>
      ))}

      {isLinear && (
        <button className="btn btn--ghost add-phase" onClick={addPhase}>+ Add phase</button>
      )}

      {pickerAt && (
        <ExercisePicker
          onAdd={(lib) => addExFromLib(pickerAt.pi, pickerAt.di, lib)}
          onClose={() => setPickerAt(null)}
        />
      )}
    </div>
  );
}
