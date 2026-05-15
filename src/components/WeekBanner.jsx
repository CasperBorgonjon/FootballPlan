import { TOTAL_WEEKS } from '../hooks/useWeekTracker';
import { trainingPlan } from '../data/training';

export default function WeekBanner({ currentWeek, currentPhase, onStart, onReset }) {
  if (!currentWeek) {
    return (
      <div className="week-banner week-banner--idle">
        <div className="week-banner-text">Track your 12-week block</div>
        <button className="week-banner-btn" onClick={onStart}>START PLAN</button>
      </div>
    );
  }

  const phase = trainingPlan.phases[currentPhase];
  const pct = Math.round((currentWeek / TOTAL_WEEKS) * 100);

  return (
    <div className="week-banner" style={{ borderLeftColor: phase.color }}>
      <div className="week-banner-row">
        <div>
          <div className="week-banner-week" style={{ color: phase.color }}>WEEK {currentWeek}</div>
          <div className="week-banner-phase">{phase.name} — {phase.label}</div>
        </div>
        <button className="week-banner-reset" onClick={onReset} title="Reset plan">↺</button>
      </div>
      <div className="week-progress-track">
        <div
          className="week-progress-fill"
          style={{ width: `${pct}%`, background: phase.color }}
        />
      </div>
      <div className="week-progress-label">{currentWeek} / {TOTAL_WEEKS} weeks</div>
    </div>
  );
}
