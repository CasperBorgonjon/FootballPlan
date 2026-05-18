import { useState, useMemo, useEffect } from 'react';
import { usePlan } from '../hooks/usePlan';
import { useWeekTracker } from '../hooks/useWeekTracker';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import { useSessionNotes } from '../hooks/useSessionNotes';
import { useSession, formatElapsed } from '../hooks/useSession';
import RestTimer from './RestTimer';

const DAY_TO_INDEX = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };
const TODAY_INDEX = (new Date().getDay() + 6) % 7;

const COACH_NAME = 'Coach Mario';
const COACH_INITIALS = 'MA';

function splitTitle(label) {
  const idx = label.indexOf(' — ');
  if (idx === -1) return [label, null];
  return [label.slice(0, idx), label.slice(idx + 3)];
}

function splitNote(note) {
  if (!note) return ['', ''];
  const idx = note.indexOf(',');
  if (idx === -1) return [note, ''];
  return [note.slice(0, idx).trim(), note.slice(idx + 1).trim()];
}

function ExerciseRow({ ex, exIndex, week, phaseIndex, dayIndex, log, isBrowsing }) {
  const { getEntry, toggleDone, updateEntry } = log;
  const tracked = week && !isBrowsing;
  const entry = tracked ? getEntry(week, phaseIndex, dayIndex, exIndex) : null;
  const [editing, setEditing] = useState(false);
  const [load, note] = splitNote(ex.note);
  const num = String(exIndex + 1).padStart(2, '0');

  return (
    <div className={`ex-row${entry?.done ? ' is-done' : ''}`}>
      {tracked ? (
        <button
          className={`ex-check${entry?.done ? ' is-done' : ''}`}
          onClick={() => toggleDone(week, phaseIndex, dayIndex, exIndex)}
          aria-label={entry?.done ? 'Mark undone' : 'Mark done'}
        >
          {entry?.done ? '✓' : ''}
        </button>
      ) : (
        <span className="ex-check" aria-hidden style={{ visibility: 'hidden' }} />
      )}

      <span className="ex-num">{num}</span>

      <div className="ex-info">
        <div className="ex-info-name">{ex.name}</div>
      </div>

      <div className="ex-sets-cell">
        <div className="ex-col-label">Sets × Reps</div>
        <div className="ex-col-value">
          {ex.sets}<span className="x">×</span>{ex.reps}
        </div>
      </div>

      <div className="ex-load-cell">
        <div className="ex-col-label">Load</div>
        <div className="ex-col-value ex-col-value--text">{load || '—'}</div>
      </div>

      <div className="ex-note-cell ex-note">{note || load}</div>

      <div className="ex-log">
        {tracked ? (
          editing ? (
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
            <button
              className={`ex-log-btn${entry?.weight ? ' has-value' : ''}`}
              onClick={() => setEditing(true)}
            >
              {entry?.weight ? `${entry.weight}kg · ${entry.reps}` : '+ Log'}
            </button>
          )
        ) : (
          <span className="ex-log-btn" style={{ opacity: 0.4 }}>—</span>
        )}
      </div>
    </div>
  );
}

export default function TrainingSection({ userId }) {
  const { phases, coachNotes, totalWeeks } = usePlan();
  const { currentWeek, currentPhase, startPlan, completeWeek, resetPlan } = useWeekTracker(userId);
  const log = useWorkoutLog(userId);
  useSessionNotes(userId);

  const [showTimer, setShowTimer] = useState(false);
  const [activePhase, setActivePhase] = useState(() => currentPhase ?? 0);
  const [activeDay, setActiveDay] = useState(() => Math.min(TODAY_INDEX, 5));
  const session = useSession(currentWeek, activePhase, activeDay);

  const [prevPhase, setPrevPhase] = useState(currentPhase);
  if (currentPhase !== prevPhase) {
    setPrevPhase(currentPhase);
    if (currentPhase != null) {
      setActivePhase(currentPhase);
    }
  }

  const phase = phases[activePhase];
  const day = phase.days[activeDay] ?? phase.days[0];
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

  useEffect(() => {
    if (dayComplete && session.active) session.stop();
  }, [dayComplete, session]);

  const [titleHead, titleTail] = splitTitle(day.label);
  const sessionLetter = String.fromCharCode(65 + activeDay);
  const estMinutes = Math.max(20, day.exercises.length * 10);
  const weekDisplay = currentWeek ?? 1;

  return (
    <div className="section-content">
      {!currentWeek && (
        <div className="idle-banner">
          <div className="idle-banner-text">
            <b>Track your 12-week block.</b> Start the plan to log workouts.
          </div>
          <button className="btn btn--primary" onClick={startPlan}>Start Plan →</button>
        </div>
      )}

      <div className="hero">
        <div>
          <div className="hero-eyebrow">
            Week {String(weekDisplay).padStart(2, '0')} / {totalWeeks} · {phase.label}
          </div>
          <h1 className="hero-title">
            {titleHead}{titleTail && ' — '}
            {titleTail && <em>{titleTail}</em>}
          </h1>
          <div className="hero-sub">{day.focus}</div>
        </div>
      </div>

      <div className="phase-progress">
        <div className="phase-progress-track">
          {Array.from({ length: totalWeeks }, (_, i) => {
            const w = i + 1;
            const cls = currentWeek == null
              ? ''
              : w < currentWeek ? 'is-done'
              : w === currentWeek ? 'is-current'
              : '';
            return <div key={w} className={`phase-progress-seg ${cls}`} />;
          })}
        </div>
        <div className="phase-progress-labels">
          {phases.map((p, i) => (
            <button
              key={p.name}
              className={i === activePhase ? 'is-active' : ''}
              onClick={() => { setActivePhase(i); setActiveDay(0); }}
            >
              P{i + 1} · {p.label.split(' ')[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Browsing banner */}
      {isBrowsing && (
        <div className="browsing-banner">
          <span>Browsing {phases[activePhase].name}</span>
          <button onClick={() => { setActivePhase(currentPhase); setActiveDay(0); }}>
            ← Back to Week {currentWeek}
          </button>
        </div>
      )}

      {/* 7-day strip */}
      <div className="week-strip">
        {phase.days.map((d, i) => {
          const complete = tracking
            ? log.isDayComplete(currentWeek, activePhase, i, d.exercises.length)
            : false;
          const isToday = !isBrowsing && DAY_TO_INDEX[d.day] === TODAY_INDEX;
          const cls = [
            'day-card',
            i === activeDay && 'is-active',
            complete && 'is-done',
          ].filter(Boolean).join(' ');
          return (
            <button key={d.day} className={cls} onClick={() => setActiveDay(i)}>
              <div className="day-card-day">{d.day}</div>
              <div className="day-card-label">{splitTitle(d.label)[0]}</div>
              <div className="day-card-foot">
                <span className="day-card-dot" />
                {isToday && <span className="day-card-today">TODAY</span>}
                {complete && !isToday && <span className="day-card-today">DONE</span>}
              </div>
            </button>
          );
        })}
        {/* Sunday rest filler */}
        <div className="day-card is-rest">
          <div className="day-card-day">SUN</div>
          <div className="day-card-label">Rest</div>
          <div className="day-card-foot"><span className="day-card-dot" /></div>
        </div>
      </div>

      {/* Session block */}
      <div className="session">
        <div className="session-head">
          <div className="session-head-left">
            <div className="session-icon">{sessionLetter}</div>
            <div>
              <div className="session-name">
                Session {sessionLetter} · <b>{day.focus.toUpperCase()}</b>
              </div>
              <div className="session-meta">
                <b>{day.exercises.length}</b> exercises · ~{estMinutes} min
              </div>
            </div>
          </div>
          <div className="session-actions">
            <button className="btn btn--ghost" onClick={() => setShowTimer(true)}>
              ⏱ Rest Timer · 90s
            </button>
            {tracking && allDaysComplete && currentWeek < totalWeeks ? (
              <button className="btn btn--primary" onClick={completeWeek}>
                Next Week →
              </button>
            ) : tracking && dayComplete ? (
              <span className="btn btn--primary" style={{ pointerEvents: 'none' }}>
                Day Complete ✓
              </span>
            ) : session.active ? (
              <button className="btn btn--primary" onClick={session.stop}>
                ■ End · {formatElapsed(session.elapsedSec)}
              </button>
            ) : (
              <button
                className="btn btn--primary"
                onClick={session.start}
                disabled={!tracking}
              >
                Start Session →
              </button>
            )}
          </div>
        </div>

        <div className="ex-list">
          {day.exercises.map((ex, i) => (
            <ExerciseRow
              key={ex.id ?? ex.name}
              ex={ex}
              exIndex={i}
              week={currentWeek}
              phaseIndex={activePhase}
              dayIndex={activeDay}
              log={log}
              isBrowsing={isBrowsing}
            />
          ))}
        </div>

        {day.coachNote && (
          <div className="coach-note coach-note--day">
            <div className="coach-avatar">{COACH_INITIALS}</div>
            <div className="coach-note-body">
              <div className="coach-note-label">Day Note · {day.day}</div>
              <div className="coach-note-text">{day.coachNote}</div>
            </div>
          </div>
        )}

        <div className="coach-note">
          <div className="coach-avatar">{COACH_INITIALS}</div>
          <div className="coach-note-body">
            <div className="coach-note-label">{COACH_NAME} · Phase Note</div>
            <div className="coach-note-text">{coachNotes[activePhase]}</div>
          </div>
        </div>
      </div>

      {currentWeek && (
        <div className="footer-bar">
          <button
            className="reset-btn"
            onClick={() => {
              if (confirm('Reset plan? All workout logs will be cleared.')) {
                resetPlan();
                log.clearLog();
              }
            }}
          >
            ↺ Reset Plan
          </button>
        </div>
      )}

      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
    </div>
  );
}
