import { useState } from 'react';
import {
  EXERCISE_LIBRARY, MUSCLE_GROUPS, EXERCISE_TYPES, EQUIPMENT_TYPES,
} from '../data/exerciseLibrary';

// Modal for picking exercises from the library into a day. Adds on click and
// stays open so several can be added in a row; Done closes.
export default function ExercisePicker({ onAdd, onClose }) {
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState('All');
  const [type, setType] = useState('All');
  const [equip, setEquip] = useState('All');
  const [added, setAdded] = useState(0);

  const query = q.trim().toLowerCase();
  const results = EXERCISE_LIBRARY.filter((e) =>
    (muscle === 'All' || e.muscle === muscle) &&
    (type === 'All' || e.type === type) &&
    (equip === 'All' || e.equipment === equip) &&
    (!query || e.name.toLowerCase().includes(query))
  );

  function pick(ex) {
    onAdd(ex);
    setAdded((n) => n + 1);
  }

  return (
    <div className="picker-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="picker-modal">
        <div className="picker-head">
          <span className="picker-title">Exercise library</span>
          <button className="timer-close" onClick={onClose}>✕</button>
        </div>

        <input
          className="picker-search" type="text" autoFocus
          placeholder="Search exercises…"
          value={q} onChange={(e) => setQ(e.target.value)}
        />

        <div className="picker-filters">
          <select className="picker-select" value={muscle} onChange={(e) => setMuscle(e.target.value)}>
            <option value="All">All muscles</option>
            {MUSCLE_GROUPS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="picker-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">All types</option>
            {EXERCISE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="picker-select" value={equip} onChange={(e) => setEquip(e.target.value)}>
            <option value="All">Any equipment</option>
            {EQUIPMENT_TYPES.map((q2) => <option key={q2} value={q2}>{q2 === 'None' ? 'No equipment' : q2}</option>)}
          </select>
        </div>

        <div className="picker-list">
          {results.length === 0 ? (
            <div className="picker-empty">No matches.</div>
          ) : (
            results.map((ex) => (
              <button key={ex.id} className="picker-item" onClick={() => pick(ex)}>
                <div className="picker-item-main">
                  <div className="picker-item-name">{ex.name}</div>
                  <div className="picker-item-tags">
                    <span>{ex.muscle}</span>
                    <span className="dot">·</span>
                    <span>{ex.equipment === 'None' ? 'No equipment' : ex.equipment}</span>
                    <span className="dot">·</span>
                    <span>{ex.type}</span>
                  </div>
                </div>
                <span className="picker-item-sr">{ex.sets}×{ex.reps}</span>
                <span className="picker-item-add">+</span>
              </button>
            ))
          )}
        </div>

        <div className="picker-foot">
          <span className="picker-count">{added > 0 ? `${added} added` : `${results.length} exercises`}</span>
          <button className="btn btn--primary btn--sm" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
