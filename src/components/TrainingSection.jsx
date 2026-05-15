import { useState } from 'react';
import { trainingPlan, focusColors, coachNotes } from '../data/training';

function ExerciseRow({ ex, color, isLast }) {
  return (
    <div className={`ex-row${isLast ? ' ex-row--last' : ''}`}>
      <div className="ex-name">{ex.name}</div>
      <div className="ex-sets" style={{ color }}>{ex.sets}</div>
      <div className="ex-reps">{ex.reps}</div>
      <div className="ex-note">{ex.note}</div>
    </div>
  );
}

export default function TrainingSection() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeDay, setActiveDay] = useState(0);

  const phase = trainingPlan.phases[activePhase];
  const day = phase.days[activeDay];

  function handlePhase(i) {
    setActivePhase(i);
    setActiveDay(0);
  }

  return (
    <div className="section-content">
      {/* Phase tabs */}
      <div className="phase-tabs">
        {trainingPlan.phases.map((p, i) => (
          <button
            key={p.name}
            className="phase-tab"
            onClick={() => handlePhase(i)}
            style={{
              background: activePhase === i ? p.color : 'var(--bg-card)',
              color: activePhase === i ? '#000' : 'var(--text-dim)',
            }}
          >
            <div>{p.name}</div>
            <div className="phase-tab-weeks">{p.weeks}</div>
          </button>
        ))}
      </div>

      {/* Phase label */}
      <div className="phase-label-wrap">
        <span style={{ color: phase.color, fontWeight: 700 }}>{phase.name}</span>
        <span className="phase-desc"> — {phase.label}</span>
      </div>

      {/* Day tabs */}
      <div className="day-tabs">
        {phase.days.map((d, i) => (
          <button
            key={d.day}
            className="day-tab"
            onClick={() => setActiveDay(i)}
            style={{
              background: activeDay === i ? 'var(--bg-row)' : 'transparent',
              borderColor: activeDay === i ? phase.color : 'var(--border2)',
              color: activeDay === i ? 'var(--text)' : 'var(--text-sub)',
            }}
          >
            {d.day}
          </button>
        ))}
      </div>

      {/* Day content */}
      <div className="day-content">
        <div className="day-header">
          <div>
            <div className="day-label">{day.label}</div>
            <div className="day-sub">{day.day} · {phase.weeks}</div>
          </div>
          <span
            className="badge"
            style={{
              color: focusColors[day.focus],
              background: `${focusColors[day.focus]}20`,
              border: `1px solid ${focusColors[day.focus]}40`,
            }}
          >
            {day.focus.toUpperCase()}
          </span>
        </div>

        <div className="exercise-table">
          <div className="exercise-table-header">
            <div>EXERCISE</div>
            <div style={{ textAlign: 'center' }}>SETS</div>
            <div style={{ textAlign: 'center' }}>REPS/DUR</div>
            <div style={{ textAlign: 'right' }}>NOTE</div>
          </div>
          <div>
            {day.exercises.map((ex, i) => (
              <ExerciseRow
                key={ex.name}
                ex={ex}
                color={phase.color}
                isLast={i === day.exercises.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="coach-note" style={{ borderLeftColor: phase.color }}>
          <div className="coach-note-label">COACH'S NOTE</div>
          <div className="coach-note-text">{coachNotes[activePhase]}</div>
        </div>
      </div>

      <div className="footer-bar">
        <div>SUN = FULL REST</div>
        <div>12-WEEK BLOCK</div>
      </div>
    </div>
  );
}
