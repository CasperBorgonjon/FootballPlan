import { useState } from 'react';
import { generateProgram } from '../utils/programGenerator';

// Wizard that collects the athlete variables and builds a program from them.
// It doesn't save — it hands the generated program up so the existing editor
// can open it for review and tweaks before anything is written.

const SEASONS = [
  { id: 'off', label: 'Off-season', hint: 'No matches — biggest window to build. Longer base, full arc.' },
  { id: 'pre', label: 'Pre-season', hint: 'Building toward the season. Classic 10-week base → strength → speed.' },
  { id: 'in',  label: 'In-season',  hint: 'Matches every week. A light, repeating maintenance week.' },
];

const DAYS = [3, 4, 5, 6];

const EQUIPMENT = [
  { id: 'Barbell',  label: 'Barbell' },
  { id: 'Dumbbell', label: 'Dumbbells' },
  { id: 'Band',     label: 'Bands' },
  { id: 'None',     label: 'Field / sprints' },
];

const POSITIONS = ['', 'Fullback', 'Winger', 'Striker', 'Midfielder', 'Centre-back', 'Goalkeeper'];

const WEAKNESSES = [
  { id: '',          label: 'None / balanced' },
  { id: 'hamstring', label: 'Hamstrings' },
  { id: 'groin',     label: 'Groin / adductors' },
  { id: 'ankle',     label: 'Ankles / calves' },
  { id: 'aerobic',   label: 'Aerobic / engine' },
];

export default function ProgramGenerator({ onGenerate, onCancel }) {
  const [seasonPhase, setSeasonPhase] = useState('pre');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [equipment, setEquipment] = useState(['Barbell', 'Dumbbell', 'Band', 'None']);
  const [position, setPosition] = useState('');
  const [weakness, setWeakness] = useState('');

  const toggleEquip = (id) =>
    setEquipment((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));

  function handleGenerate() {
    const program = generateProgram({
      seasonPhase,
      daysPerWeek,
      equipment,
      position: position || null,
      weakness: weakness || null,
    });
    onGenerate(program);
  }

  const seasonHint = SEASONS.find((s) => s.id === seasonPhase)?.hint;

  return (
    <div className="editor">
      <div className="editor-bar">
        <button className="btn btn--ghost btn--sm" onClick={onCancel}>← Cancel</button>
        <button className="btn btn--primary btn--sm" onClick={handleGenerate}>Generate →</button>
      </div>

      <div className="hero">
        <div className="hero-eyebrow">Generate</div>
        <h1 className="hero-title">Build my <em>program</em></h1>
        <div className="hero-sub">
          Answer a few variables and the app drafts a periodised program — phased blocks, a deload
          after each, and exercises chosen for your kit and position. It opens in the editor as a
          starting point to fine-tune before saving — not a finished prescription.
        </div>
      </div>

      <div className="editor-card gen-step">
        <div className="gen-q">Where are you in the season?</div>
        <div className="edit-seg gen-seg">
          {SEASONS.map((s) => (
            <button key={s.id} className={seasonPhase === s.id ? 'is-on' : ''} onClick={() => setSeasonPhase(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <p className="edit-hint">{seasonHint}</p>
      </div>

      <div className="editor-card gen-step">
        <div className="gen-q">How many days a week can you train?</div>
        <div className="edit-seg gen-seg">
          {DAYS.map((d) => (
            <button key={d} className={daysPerWeek === d ? 'is-on' : ''} onClick={() => setDaysPerWeek(d)}>
              {d} days
            </button>
          ))}
        </div>
        <p className="edit-hint">More isn’t always better — pick what you can recover from week after week.</p>
      </div>

      <div className="editor-card gen-step">
        <div className="gen-q">What equipment do you have?</div>
        <div className="gen-chips">
          {EQUIPMENT.map((e) => (
            <button
              key={e.id}
              className={`pill${equipment.includes(e.id) ? ' is-active' : ''}`}
              onClick={() => toggleEquip(e.id)}
            >
              {equipment.includes(e.id) ? '✓ ' : ''}{e.label}
            </button>
          ))}
        </div>
        <p className="edit-hint">Bodyweight work is always included. Pick everything else you can access.</p>
      </div>

      <div className="editor-card gen-step">
        <div className="edit-grid">
          <label className="edit-field edit-field--grow">
            <span>Position (optional)</span>
            <select value={position} onChange={(e) => setPosition(e.target.value)}>
              {POSITIONS.map((p) => <option key={p} value={p}>{p || 'Any / not sure'}</option>)}
            </select>
          </label>
          <label className="edit-field edit-field--grow">
            <span>Biggest weak point (optional)</span>
            <select value={weakness} onChange={(e) => setWeakness(e.target.value)}>
              {WEAKNESSES.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
            </select>
          </label>
        </div>
        <p className="edit-hint">
          Position adds extra emphasis on the day that matters most for your role (sprint, power,
          strength or conditioning). A weak point pulls in extra targeted prehab.
        </p>
      </div>

      <button className="btn btn--primary gen-cta" onClick={handleGenerate}>
        Generate my program →
      </button>
    </div>
  );
}
