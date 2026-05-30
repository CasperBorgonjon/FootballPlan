import { useState, useEffect } from 'react';
import { usePlan } from '../contexts/PlanContext';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import { useReadiness } from '../hooks/useReadiness';
import { useSession, formatElapsed } from '../hooks/useSession';
import { addDays } from '../utils/schedule';
import { DAY_TO_INDEX, DAY_SHORT, weekdayIndex } from '../utils/dates';
import {
  readinessFrom, recommendation, matchPosition, matchDayIndexOf,
  suggestedRest, restLabel, suggestProgression,
} from '../utils/coaching';
import { equipmentInfo, isFullKit } from '../data/equipment';
import RestTimer from './RestTimer';
import PlateCalculator from './PlateCalculator';

const TODAY_INDEX = weekdayIndex();

function dayTitle(label) {
  const idx = label.indexOf(' — ');
  return idx === -1 ? label : label.slice(idx + 3);
}

/* ── Readiness check-in + auto-regulation ── */
const LEGS = [['fresh', 'Fresh'], ['normal', 'Normal'], ['heavy', 'Heavy']];
const ENERGY = [['good', 'Good'], ['ok', 'OK'], ['low', 'Low']];

function ReadinessCard({ userId, date, programType, match }) {
  const { checkin, save } = useReadiness(userId, date);
  const readiness = readinessFrom(checkin);
  const rec = readiness ? recommendation(readiness.level, programType, match) : null;

  return (
    <div className={`readiness${readiness ? ` is-${readiness.level}` : ''}`}>
      <div className="readiness-head">
        <span className="readiness-eyebrow">Today’s readiness</span>
        {readiness && <span className={`readiness-dot is-${readiness.level}`} />}
      </div>

      <div className="readiness-inputs">
        <label className="rd-field">
          <span>Sleep</span>
          <div className="rd-sleep">
            <input
              type="number" min="0" max="14" step="0.5" inputMode="decimal"
              value={checkin?.sleep_hours ?? ''}
              placeholder="—"
              onChange={(e) => save({ sleep_hours: e.target.value })}
            />
            <i>h</i>
          </div>
        </label>
        <label className="rd-field">
          <span>Legs</span>
          <div className="rd-seg">
            {LEGS.map(([v, l]) => (
              <button key={v} className={checkin?.legs === v ? 'is-on' : ''} onClick={() => save({ legs: v })}>{l}</button>
            ))}
          </div>
        </label>
        <label className="rd-field">
          <span>Energy</span>
          <div className="rd-seg">
            {ENERGY.map(([v, l]) => (
              <button key={v} className={checkin?.energy === v ? 'is-on' : ''} onClick={() => save({ energy: v })}>{l}</button>
            ))}
          </div>
        </label>
      </div>

      {rec ? (
        <div className="readiness-rec">
          <div className="readiness-rec-title">{rec.title}</div>
          <div className="readiness-rec-text">{rec.text}</div>
          {rec.note && <div className="readiness-rec-note">{rec.note}</div>}
        </div>
      ) : (
        <div className="readiness-rec readiness-rec--empty">
          Log how you slept and feel to get today’s call.
        </div>
      )}
    </div>
  );
}

function CommitmentRow({ commitment }) {
  const isMatch = commitment.type === 'match';
  return (
    <div className={`commitment commitment--${commitment.type}`}>
      <span className="commitment-tag">{isMatch ? 'Match' : 'Team'}</span>
      <span className="commitment-label">{commitment.label}</span>
      {(commitment.start || commitment.end) && (
        <span className="commitment-time">
          {commitment.start}{commitment.end ? `–${commitment.end}` : ''}
        </span>
      )}
    </div>
  );
}

function ExerciseRow({ ex, week, log, tracked, accent, restSec, equip, last, level, bestPrior }) {
  const { getEntry, toggleDone, updateEntry } = log;
  const entry = tracked ? getEntry(week, ex.id) : null;
  const [editing, setEditing] = useState(false);

  const suggestion = tracked ? suggestProgression(last, level, ex.reps) : null;
  const curWeight = parseFloat(String(entry?.weight || '').replace(',', '.'));
  const isPR = tracked && Number.isFinite(curWeight) && curWeight > 0 && bestPrior > 0 && curWeight > bestPrior;

  return (
    <div className={`ex-row${entry?.done ? ' is-done' : ''}`}>
      {tracked ? (
        <button
          className={`ex-check${entry?.done ? ' is-done' : ''}`}
          onClick={() => toggleDone(week, ex.id)}
          aria-label={entry?.done ? 'Mark undone' : 'Mark done'}
          style={entry?.done ? { background: accent, borderColor: accent } : undefined}
        >
          {entry?.done ? '✓' : ''}
        </button>
      ) : (
        <span className="ex-check ex-check--static" aria-hidden />
      )}

      <div className="ex-main">
        <div className="ex-name">{ex.name}</div>
        {ex.note && <div className="ex-note">{ex.note}</div>}
        {equip?.needsBarbell && (
          <div className="ex-swap">No barbell today → {equip.swap}</div>
        )}
      </div>

      <div className="ex-prescribe">
        <span className="ex-sr">{ex.sets}<i>×</i>{ex.reps}{isPR && <span className="ex-pr">🏆 PR</span>}</span>
        {last && (
          <span className="ex-last">last {last.weight}kg{last.reps ? ` × ${last.reps}` : ''}</span>
        )}
        {suggestion && !entry?.done && (
          <span className={`ex-suggest ex-suggest--${suggestion.dir}`} title={suggestion.reason}>
            → {suggestion.weight}kg
          </span>
        )}
        {!last && !suggestion && restSec && (
          <span className="ex-rest">rest {restLabel(restSec)}</span>
        )}
      </div>

      <div className="ex-log">
        {tracked ? (
          editing ? (
            <div className="ex-log-inputs">
              <input
                className="ex-log-input" placeholder="kg"
                value={entry?.weight || ''}
                onChange={(e) => updateEntry(week, ex.id, { weight: e.target.value })}
                autoFocus
              />
              <input
                className="ex-log-input" placeholder="reps"
                value={entry?.reps || ''}
                onChange={(e) => updateEntry(week, ex.id, { reps: e.target.value })}
              />
              <button className="ex-log-save" onClick={() => setEditing(false)}>✓</button>
            </div>
          ) : (
            <button
              className={`ex-log-btn${entry?.weight ? ' has-value' : ''}`}
              onClick={() => setEditing(true)}
            >
              {entry?.weight ? `${entry.weight}kg · ${entry.reps}` : 'Log'}
            </button>
          )
        ) : (
          <span className="ex-log-btn is-muted">—</span>
        )}
      </div>
    </div>
  );
}

export default function TrainingSection({ userId }) {
  const {
    activeProgram, phases, focusColors, totalWeeks,
    currentWeek, currentPhase, today, startPlan, resetPlan,
  } = usePlan();
  const log = useWorkoutLog(userId, activeProgram?.id);
  const { checkin } = useReadiness(userId, today);
  const readinessLevel = readinessFrom(checkin)?.level ?? null;

  const multiPhase = phases.length > 1;

  const [showTimer, setShowTimer] = useState(false);
  const [showPlates, setShowPlates] = useState(false);
  const [activePhase, setActivePhase] = useState(() => currentPhase ?? 0);
  const [activeDay, setActiveDay] = useState(() => Math.min(TODAY_INDEX, 6));
  const session = useSession(currentWeek, activePhase, activeDay);

  const [prevPhase, setPrevPhase] = useState(currentPhase);
  if (currentPhase !== prevPhase) {
    setPrevPhase(currentPhase);
    if (currentPhase != null) setActivePhase(currentPhase);
  }

  const phase = phases[activePhase] ?? phases[0];
  const day = phase?.days[activeDay] ?? phase?.days[0];

  const isBrowsing = currentPhase != null && activePhase !== currentPhase;
  const tracking = currentWeek != null && !isBrowsing;

  const dayExerciseIds = (d) => d.exercises.map((e) => e.id);
  const dayComplete =
    tracking && day ? log.isDayComplete(currentWeek, dayExerciseIds(day)) : false;

  useEffect(() => {
    if (dayComplete && session.active) session.stop();
  }, [dayComplete, session]);

  if (!day) {
    return <div className="section"><div className="loading-inline">Loading plan…</div></div>;
  }

  const accent = focusColors[day.focus] || 'var(--accent)';
  const hasExercises = day.exercises.length > 0;
  const estMinutes = Math.max(20, day.exercises.length * 10);
  const weekDisplay = currentWeek ?? 1;

  // Match position (in-season programs carry a match commitment)
  const matchIdx = matchDayIndexOf(phase.days);
  const selectedMatch = matchPosition(activeDay, matchIdx);
  const todayMatch = matchPosition(TODAY_INDEX, matchIdx);

  // Equipment availability for the selected day's real date (this week)
  const dayDateISO = addDays(today, activeDay - TODAY_INDEX);
  const fullKit = isFullKit(dayDateISO);

  // Smart rest default for the day's primary goal
  const dayRest = suggestedRest(day.focus, day.exercises[0]?.reps);

  return (
    <div className="section">
      <div className="status-bar">
        <div className="status-program">{activeProgram?.name ?? 'Training'}</div>
        {currentWeek != null ? (
          <div className="status-meta">
            <span className="status-week">
              Week <b>{String(weekDisplay).padStart(2, '0')}</b>
              {totalWeeks ? ` / ${totalWeeks}` : ''}
            </span>
            {multiPhase && <span className="status-phase">{phase.label}</span>}
          </div>
        ) : (
          <button className="btn btn--primary btn--sm" onClick={() => startPlan()}>Start plan</button>
        )}
      </div>

      {tracking && (
        <ReadinessCard
          userId={userId}
          date={today}
          programType={activeProgram?.type}
          match={todayMatch}
        />
      )}

      {multiPhase && (
        <div className="phase-tabs">
          {phases.map((p, i) => (
            <button
              key={p.name}
              className={`phase-tab${i === activePhase ? ' is-active' : ''}`}
              onClick={() => { setActivePhase(i); setActiveDay(0); }}
            >
              <span className="phase-tab-num">P{i + 1}</span>
              <span className="phase-tab-label">{p.label}</span>
            </button>
          ))}
        </div>
      )}

      {isBrowsing && (
        <div className="browsing-banner">
          <span>Previewing {phases[activePhase].name} — not your current week</span>
          <button onClick={() => { setActivePhase(currentPhase); setActiveDay(0); }}>Back to current</button>
        </div>
      )}

      <div className="week-rail">
        {phase.days.map((d, i) => {
          const complete = tracking && d.exercises.length > 0
            ? log.isDayComplete(currentWeek, dayExerciseIds(d))
            : false;
          const isToday = !isBrowsing && DAY_TO_INDEX[d.day] === TODAY_INDEX;
          const dAccent = focusColors[d.focus] || 'var(--text-3)';
          return (
            <button
              key={d.day}
              className={`day-pill${i === activeDay ? ' is-active' : ''}${complete ? ' is-done' : ''}`}
              onClick={() => setActiveDay(i)}
            >
              <span className="day-pill-name">{DAY_SHORT[d.day]}</span>
              <span className="day-pill-dot" style={{ background: dAccent }} />
              {isToday && <span className="day-pill-today">Today</span>}
              {complete && !isToday && <span className="day-pill-check">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="day-panel">
        <div className="day-head">
          <div className="day-head-info">
            <div className="day-tags">
              <span className="day-focus" style={{ color: accent }}>{day.focus}</span>
              {selectedMatch && (
                <span className={`md-tag md-tag--${selectedMatch.phase}`}>{selectedMatch.label}</span>
              )}
            </div>
            <h1 className="day-title">{dayTitle(day.label)}</h1>
            <div className="day-sub">
              {hasExercises
                ? `${day.exercises.length} exercises · ~${estMinutes} min`
                : 'No personal work scheduled'}
            </div>
          </div>
          <div className="day-actions">
            <button className="btn btn--ghost" onClick={() => setShowPlates(true)}>Plates</button>
            <button className="btn btn--ghost" onClick={() => setShowTimer(true)}>Timer</button>
            {tracking && hasExercises && dayComplete ? (
              <span className="btn btn--done">Complete ✓</span>
            ) : session.active ? (
              <button className="btn btn--primary" onClick={session.stop}>End · {formatElapsed(session.elapsedSec)}</button>
            ) : (
              <button
                className="btn btn--primary"
                onClick={session.start}
                disabled={!tracking || !hasExercises}
              >
                Start session
              </button>
            )}
          </div>
        </div>

        {day.commitments?.length > 0 && (
          <div className="commitments">
            {day.commitments.map((c) => <CommitmentRow key={c.id} commitment={c} />)}
          </div>
        )}

        {hasExercises && (
          <div className="ex-list">
            {day.exercises.map((ex) => {
              const equip = !fullKit ? equipmentInfo(ex.name) : { needsBarbell: false };
              const multiSet = parseInt(ex.sets, 10) > 1;
              return (
                <ExerciseRow
                  key={ex.id ?? ex.name}
                  ex={ex}
                  week={currentWeek}
                  log={log}
                  tracked={tracking}
                  accent={accent}
                  restSec={multiSet ? suggestedRest(day.focus, ex.reps) : null}
                  equip={equip}
                  last={tracking ? log.lastEntryFor(currentWeek, ex.id) : null}
                  level={readinessLevel}
                  bestPrior={tracking ? log.bestWeightBefore(currentWeek, ex.id) : 0}
                />
              );
            })}
          </div>
        )}
      </div>

      {currentWeek != null && (
        <div className="section-footer">
          <button
            className="reset-btn"
            onClick={() => {
              if (confirm('Reset plan? This unschedules the program. Logged weights are kept.')) {
                resetPlan();
              }
            }}
          >
            Reset plan
          </button>
        </div>
      )}

      {showTimer && <RestTimer onClose={() => setShowTimer(false)} defaultSeconds={dayRest} />}
      {showPlates && <PlateCalculator onClose={() => setShowPlates(false)} />}
    </div>
  );
}
