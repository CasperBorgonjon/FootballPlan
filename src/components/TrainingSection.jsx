import { useState, useEffect } from 'react';
import { trainingPlan, focusColors, coachNotes } from '../data/training';
import { useWeekTracker, getPhaseForWeek } from '../hooks/useWeekTracker';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import WeekBanner from './WeekBanner';
import RestTimer from './RestTimer';

function ExerciseRow({ ex, exIndex, phase, week, phaseIndex, dayIndex, log, isBrowsing }) {
  const { getEntry, toggleDone, updateEntry } = log;
  const entry = (week && !isBrowsing) ? getEntry(week, phaseIndex, dayIndex, exIndex) : null;
  const [editing, setEditing] = useState(false);

  return (
    <div className={`ex-row${entry?.done ? ' ex-row--done' : ''}`}>
      {week && !isBrowsing && (
        <button
          className={`ex-check${entry?.done ? ' ex-check--done' : ''}`}
          onClick={() => toggleDone(week, phaseIndex, dayIndex, exIndex)}
          style={{ borderColor: entry?.done ? phase.color : 'var(--border2)' }}
        >
          {entry?.done && <span style={{ color: phase.color }}>✓</span>}
        </button>
      )}

      <div className="ex-name" style={{ opacity: entry?.done ? 0.5 : 1 }}>{ex.name}</div>
      <div className="ex-sets" style={{ color: phase.color }}>{ex.sets}</div>
      <div className="ex-reps">{ex.reps}</div>

      {week && !isBrowsing ? (
        <div className="ex-log">
          {editing ? (
            <div className="ex-log-inputs">
              <input
                className="ex-log-input"
                placeholder="kg"
                value={entry?.weight || ''}
                onChange={(e) => updateEntry(week, phaseIndex, dayIndex, exIndex, { weight: e.target.value })}
              />
              <input
                className="ex-log-input"
                placeholder="reps"
                value={entry?.reps || ''}
                onChange={(e) => updateEntry(week, phaseIndex, dayIndex, exIndex, { reps: e.target.value })}
              />
              <button className="ex-log-save" onClick={() => setEditing(false)}>✓</button>
            </div>
          ) : (
            <button className="ex-log-btn" onClick={() => setEditing(true)}>
              {entry?.weight ? `${entry.weight}kg · ${entry.reps}` : '+ log'}
            </button>
          )}
        </div>
      ) : (
        <div className="ex-note">{ex.note}</div>
      )}
    </div>
  );
}

export default function TrainingSection({ userId }) {
  const { currentWeek, currentPhase, startPlan, completeWeek, resetPlan } = useWeekTracker(userId);
  const log = useWorkoutLog(userId);
  const [showTimer, setShowTimer] = useState(false);
  const [activePhase, setActivePhase] = useState(() => currentPhase ?? 0);
  const [activeDay, setActiveDay] = useState(0);

  // Sync active phase when week advances to a new phase
  useEffect(() => {
    if (currentPhase != null) {
      setActivePhase(currentPhase);
      setActiveDay(0);
    }
  }, [currentPhase]);

  const phase = trainingPlan.phases[activePhase];
  const day = phase.days[activeDay];

  // Browsing a phase that isn't your current one
  const isBrowsing = currentPhase != null && activePhase !== currentPhase;

  // All 6 days complete for current week in the current phase
  const allDaysComplete = currentWeek != null && !isBrowsing
    ? trainingPlan.phases[currentPhase].days.every((d, i) =>
        log.isDayComplete(currentWeek, currentPhase, i, d.exercises.length)
      )
    : false;

  const dayComplete = currentWeek && !isBrowsing
    ? log.isDayComplete(currentWeek, activePhase, activeDay, day.exercises.length)
    : false;

  function handlePhase(i) {
    setActivePhase(i);
    setActiveDay(0);
  }

  // Phase status relative to current progress
  function phaseStatus(i) {
    if (currentPhase == null) return 'idle';
    if (i < currentPhase) return 'done';
    if (i === currentPhase) return 'current';
    return 'upcoming';
  }

  return (
    <div className="section-content">
      <div style={{ padding: '12px 16px', background: 'var(--bg-deep)' }}>
        <WeekBanner
          currentWeek={currentWeek}
          currentPhase={currentPhase}
          allDaysComplete={allDaysComplete}
          onStart={startPlan}
          onCompleteWeek={completeWeek}
          onReset={() => {
            if (confirm('Reset plan? All workout logs will be cleared.')) {
              resetPlan();
              log.clearLog();
            }
          }}
        />
      </div>

      {/* Phase tabs */}
      <div className="phase-tabs">
        {trainingPlan.phases.map((p, i) => {
          const status = phaseStatus(i);
          return (
            <button
              key={p.name}
              className={`phase-tab phase-tab--${status}`}
              onClick={() => handlePhase(i)}
              style={{
                background: activePhase === i ? p.color : 'var(--bg-card)',
                color: activePhase === i ? '#000' : status === 'upcoming' ? 'var(--text-faint)' : 'var(--text-dim)',
                opacity: status === 'upcoming' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {status === 'done' && <span style={{ fontSize: 10 }}>✓</span>}
                {status === 'current' && activePhase !== i && <span style={{ fontSize: 8, color: p.color }}>●</span>}
                {p.name}
              </div>
              <div className="phase-tab-weeks">
                {status === 'current' ? `WK ${currentWeek}` : p.weeks}
              </div>
            </button>
          );
        })}
      </div>

      {/* Browsing banner */}
      {isBrowsing && (
        <div className="browsing-banner">
          <span>BROWSING {trainingPlan.phases[activePhase].name}</span>
          <button onClick={() => { setActivePhase(currentPhase); setActiveDay(0); }}>
            ← Back to Week {currentWeek}
          </button>
        </div>
      )}

      {/* Phase label */}
      <div className="phase-label-wrap">
        <span style={{ color: phase.color, fontWeight: 700 }}>{phase.name}</span>
        <span className="phase-desc"> — {phase.label}</span>
      </div>

      {/* Day tabs */}
      <div className="day-tabs">
        {phase.days.map((d, i) => {
          const complete = !isBrowsing && currentWeek
            ? log.isDayComplete(currentWeek, activePhase, i, d.exercises.length)
            : false;
          return (
            <button
              key={d.day}
              className="day-tab"
              onClick={() => setActiveDay(i)}
              style={{
                background: activeDay === i ? 'var(--bg-row)' : 'transparent',
                borderColor: activeDay === i ? phase.color : complete ? phase.color + '60' : 'var(--border2)',
                color: activeDay === i ? 'var(--text)' : 'var(--text-sub)',
              }}
            >
              {complete && <span style={{ fontSize: 8, marginRight: 3 }}>✓</span>}
              {d.day}
            </button>
          );
        })}
      </div>

      {/* Day content */}
      <div className="day-content">
        <div className="day-header">
          <div>
            <div className="day-label">{day.label}</div>
            <div className="day-sub">{day.day} · {phase.weeks}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {dayComplete && (
              <span className="badge" style={{ color: phase.color, background: `${phase.color}20`, border: `1px solid ${phase.color}40` }}>
                DONE ✓
              </span>
            )}
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
        </div>

        <button className="rest-timer-trigger" onClick={() => setShowTimer(true)}>
          ⏱ Rest Timer
        </button>

        <div className="exercise-table">
          <div className={`exercise-table-header${(currentWeek && !isBrowsing) ? ' exercise-table-header--tracked' : ''}`}>
            {currentWeek && !isBrowsing && <div />}
            <div>EXERCISE</div>
            <div style={{ textAlign: 'center' }}>SETS</div>
            <div style={{ textAlign: 'center' }}>REPS/DUR</div>
            <div style={{ textAlign: 'right' }}>{(currentWeek && !isBrowsing) ? 'LOG' : 'NOTE'}</div>
          </div>
          <div>
            {day.exercises.map((ex, i) => (
              <ExerciseRow
                key={ex.name}
                ex={ex}
                exIndex={i}
                phase={phase}
                week={currentWeek}
                phaseIndex={activePhase}
                dayIndex={activeDay}
                log={log}
                isBrowsing={isBrowsing}
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

      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
    </div>
  );
}
