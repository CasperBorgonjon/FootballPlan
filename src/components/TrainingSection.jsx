import { useState, useMemo } from 'react';
import { usePlan } from '../hooks/usePlan';
import { useWeekTracker } from '../hooks/useWeekTracker';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import { useSessionNotes } from '../hooks/useSessionNotes';
import WeekBanner from './WeekBanner';
import RestTimer from './RestTimer';
import Badge from './ui/Badge';

function ExerciseRow({ ex, exIndex, phase, week, phaseIndex, dayIndex, log, isBrowsing }) {
  const { getEntry, toggleDone, updateEntry } = log;
  const tracked = week && !isBrowsing;
  const entry = tracked ? getEntry(week, phaseIndex, dayIndex, exIndex) : null;
  const [editing, setEditing] = useState(false);

  return (
    <div className={`ex-row${entry?.done ? ' ex-row--done' : ''}`}>
      {tracked && (
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

      {tracked ? (
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
  const { phases, coachNotes, focusColors } = usePlan();
  const { currentWeek, currentPhase, startPlan, completeWeek, resetPlan } = useWeekTracker(userId);
  const log = useWorkoutLog(userId);
  // Wired but unused — ready for "Notes per session" feature.
  useSessionNotes(userId);

  const [showTimer, setShowTimer] = useState(false);
  const [activePhase, setActivePhase] = useState(() => currentPhase ?? 0);
  const [activeDay, setActiveDay] = useState(0);

  // Sync active phase when week advances into a new phase. Render-time
  // "storing previous value" pattern from React 19 docs — no effect needed.
  const [prevPhase, setPrevPhase] = useState(currentPhase);
  if (currentPhase !== prevPhase) {
    setPrevPhase(currentPhase);
    if (currentPhase != null) {
      setActivePhase(currentPhase);
      setActiveDay(0);
    }
  }

  const phase = phases[activePhase];
  const day = phase.days[activeDay];
  const isBrowsing = currentPhase != null && activePhase !== currentPhase;
  const tracking = currentWeek && !isBrowsing;

  const allDaysComplete = useMemo(() => {
    if (currentWeek == null || isBrowsing) return false;
    return phases[currentPhase].days.every((d, i) =>
      log.isDayComplete(currentWeek, currentPhase, i, d.exercises.length)
    );
  }, [phases, log, currentWeek, currentPhase, isBrowsing]);

  const dayComplete = tracking
    ? log.isDayComplete(currentWeek, activePhase, activeDay, day.exercises.length)
    : false;

  function handlePhase(i) {
    setActivePhase(i);
    setActiveDay(0);
  }

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

      <div className="phase-tabs">
        {phases.map((p, i) => {
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
                {status === 'current' ? `WK ${currentWeek}` : p.weeksLabel}
              </div>
            </button>
          );
        })}
      </div>

      {isBrowsing && (
        <div className="browsing-banner">
          <span>BROWSING {phases[activePhase].name}</span>
          <button onClick={() => { setActivePhase(currentPhase); setActiveDay(0); }}>
            ← Back to Week {currentWeek}
          </button>
        </div>
      )}

      <div className="phase-label-wrap">
        <span style={{ color: phase.color, fontWeight: 700 }}>{phase.name}</span>
        <span className="phase-desc"> — {phase.label}</span>
      </div>

      <div className="day-tabs">
        {phase.days.map((d, i) => {
          const complete = tracking
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

      <div className="day-content">
        <div className="day-header">
          <div>
            <div className="day-label">{day.label}</div>
            <div className="day-sub">{day.day} · {phase.weeksLabel}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {dayComplete && <Badge color={phase.color}>DONE ✓</Badge>}
            <Badge color={focusColors[day.focus]}>{day.focus.toUpperCase()}</Badge>
          </div>
        </div>

        <button className="rest-timer-trigger" onClick={() => setShowTimer(true)}>
          ⏱ Rest Timer
        </button>

        <div className="exercise-table">
          <div className={`exercise-table-header${tracking ? ' exercise-table-header--tracked' : ''}`}>
            {tracking && <div />}
            <div>EXERCISE</div>
            <div style={{ textAlign: 'center' }}>SETS</div>
            <div style={{ textAlign: 'center' }}>REPS/DUR</div>
            <div style={{ textAlign: 'right' }}>{tracking ? 'LOG' : 'NOTE'}</div>
          </div>
          <div>
            {day.exercises.map((ex, i) => (
              <ExerciseRow
                key={ex.id ?? ex.name}
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
