import { useState } from 'react';
import { routines } from '../data/routines';
import { useToday } from '../hooks/useToday';
import { useReadiness } from '../hooks/useReadiness';
import { useRoutineLog } from '../hooks/useRoutineLog';
import { readinessFrom } from '../utils/coaching';
import Pill from './ui/Pill';
import Badge from './ui/Badge';

// Point the athlete at the most relevant routine for today, given how they
// reported feeling and where today sits in the training/match week.
function suggestRoutine(today, level) {
  if (level === 'red') {
    return { id: 'morning', title: 'You flagged low readiness', text: 'Keep it gentle — mobility only. Skip hard prehab today and let recovery catch up.' };
  }
  if (today.scheduled) {
    const m = today.match?.phase;
    if (m === 'match') return { id: 'warmup', title: 'Match day', text: 'Warm up properly before kick-off — this is what the week was for.' };
    if (m === 'recovery') return { id: 'cooldown', title: 'Day after the match', text: 'Flush the legs. Easy movement and soft tissue, nothing hard.' };
    if (today.dayType === 'training') return { id: 'warmup', title: 'Training day', text: 'Don’t go in cold — RAMP up first, then hit your prehab around the session.' };
    if (today.dayType === 'rest') return { id: 'evening', title: 'Rest day', text: 'Light mobility and a proper wind-down. Sleep does the work today.' };
  }
  return { id: 'morning', title: 'Start the day right', text: 'Six minutes of mobility before anything else.' };
}

function StepRow({ routineId, index, step, done, accent, onToggle }) {
  return (
    <div className={`ex-row${done ? ' is-done' : ''}`}>
      <button
        className={`ex-check${done ? ' is-done' : ''}`}
        onClick={() => onToggle(routineId, index)}
        aria-label={done ? 'Mark undone' : 'Mark done'}
        style={done ? { background: accent, borderColor: accent } : undefined}
      >
        {done ? '✓' : ''}
      </button>
      <div className="ex-main">
        <span className="ex-name">{step.name}</span>
        <div className="ex-note">{step.detail}</div>
      </div>
      <div className="ex-prescribe">
        <span className="ex-sr">{step.time}</span>
      </div>
    </div>
  );
}

export default function RoutinesSection({ userId }) {
  const today = useToday();
  const { checkin } = useReadiness(userId);
  const { isStepDone, toggleStep, completedCount, resetRoutine } = useRoutineLog(userId);

  const suggestion = suggestRoutine(today, readinessFrom(checkin)?.level);
  const [activeId, setActiveId] = useState(suggestion.id);

  const active = routines.find((r) => r.id === activeId) ?? routines[0];
  const activeDoneCount = completedCount(active.id, active.steps.length);
  const activeComplete = activeDoneCount === active.steps.length;
  const suggestedLabel = routines.find((r) => r.id === suggestion.id)?.name;

  return (
    <div className="section-content">
      <div className="hero">
        <div>
          <div className="hero-eyebrow">Daily Routines</div>
          <h1 className="hero-title">
            {active.name.split(' ')[0]} —{' '}
            <em>{active.name.split(' ').slice(1).join(' ').toLowerCase()}</em>
          </h1>
          <div className="hero-sub">{active.blurb}</div>
        </div>
      </div>

      <div className="today-banner today-banner--rec">
        <div className="today-banner-main">
          <span className="today-banner-title">{suggestion.title}</span>
          <span className="today-banner-text">{suggestion.text}</span>
        </div>
        {suggestion.id !== activeId && (
          <button className="btn btn--sm today-banner-btn" onClick={() => setActiveId(suggestion.id)}>
            {suggestedLabel} →
          </button>
        )}
      </div>

      <div className="rec-tabs">
        {routines.map((r) => {
          const n = completedCount(r.id, r.steps.length);
          const full = n === r.steps.length;
          return (
            <Pill key={r.id} active={activeId === r.id} onClick={() => setActiveId(r.id)}>
              {r.icon} {r.name} {full ? '✓' : n > 0 ? `· ${n}/${r.steps.length}` : ''}
            </Pill>
          );
        })}
      </div>

      <div className="rec-content">
        <div className="rec-card">
          <div className="rec-card-head">
            <div>
              <div className="rec-card-title">{active.name}</div>
              <div className="routine-when">{active.when}</div>
            </div>
            <div className="routine-head-meta">
              <Badge style={activeComplete ? { color: active.accent, borderColor: active.accent } : undefined}>
                {activeComplete ? 'DONE ✓' : `${activeDoneCount}/${active.steps.length}`}
              </Badge>
              {activeDoneCount > 0 && (
                <button
                  className="btn btn--sm btn--ghost"
                  onClick={() => resetRoutine(active.id, active.steps.length)}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="routine-steps">
            {active.steps.map((step, i) => (
              <StepRow
                key={step.name}
                routineId={active.id}
                index={i}
                step={step}
                done={isStepDone(active.id, i)}
                accent={active.accent}
                onToggle={toggleStep}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
