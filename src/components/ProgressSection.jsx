import { useState } from 'react';
import { usePlan } from '../contexts/PlanContext';
import { useProgressData, parseLogKey } from '../hooks/useProgressData';
import { readinessFrom } from '../utils/coaching';
import Sparkline from './Sparkline';
import MetricsPanel from './MetricsPanel';

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}{sub && <span className="stat-sub">{sub}</span>}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function ProgressSection({ userId }) {
  const { programs, activeProgram, loading: planLoading } = usePlan();
  const { log, checkins, loading } = useProgressData(userId);
  const [picked, setPicked] = useState(null);

  if (planLoading || loading) {
    return <div className="section"><div className="loading-inline">Loading progress…</div></div>;
  }

  const selectedId = picked ?? activeProgram?.id ?? programs[0]?.id ?? null;
  const program = programs.find((p) => p.id === selectedId);

  // id → exercise name for the selected program
  const idToName = {};
  program?.structure?.phases.forEach((ph) =>
    ph.days.forEach((d) => d.exercises.forEach((e) => { idToName[e.id] = e.name; }))
  );

  // Logged rows belonging to the selected program
  const rows = log
    .map((r) => ({ ...r, parsed: parseLogKey(r.log_key) }))
    .filter((r) => r.parsed && r.parsed.programId === selectedId);

  // Group weighted entries by exercise NAME (unifies a lift across phases)
  const byName = {};
  rows.forEach((r) => {
    const w = parseFloat(r.weight);
    const name = idToName[r.parsed.exerciseId];
    if (!name || !r.weight || Number.isNaN(w)) return;
    (byName[name] ??= []).push({ week: r.parsed.week, weight: w, reps: r.reps });
  });
  const lifts = Object.entries(byName)
    .map(([name, pts]) => {
      pts.sort((a, b) => a.week - b.week);
      const ws = pts.map((p) => p.weight);
      const first = pts[0].weight;
      const latest = pts.at(-1);
      return { name, pts, latest, best: Math.max(...ws), delta: latest.weight - first };
    })
    .sort((a, b) => b.pts.length - a.pts.length || a.name.localeCompare(b.name));

  const liftsLogged = rows.filter((r) => r.weight && !Number.isNaN(parseFloat(r.weight))).length;
  const completed = rows.filter((r) => r.done).length;

  // Readiness (daily, program-independent)
  const rd = checkins.map((c) => ({ date: c.date, level: readinessFrom(c)?.level, sleep: Number(c.sleep_hours) }));
  const sleeps = rd.map((r) => r.sleep).filter((n) => !Number.isNaN(n));
  const avgSleep = sleeps.length ? (sleeps.reduce((a, b) => a + b, 0) / sleeps.length).toFixed(1) : null;
  const counts = { green: 0, amber: 0, red: 0 };
  rd.forEach((r) => { if (r.level) counts[r.level] += 1; });
  const recent = rd.filter((r) => r.level).slice(-14);

  return (
    <div className="section-content">
      <div className="hero">
        <div className="hero-eyebrow">Progress</div>
        <h1 className="hero-title">Your <em>numbers</em></h1>
        <div className="hero-sub">What your logging adds up to. Pick a program to see its lifts.</div>
      </div>

      {programs.length > 1 && (
        <select className="progress-select" value={selectedId ?? ''} onChange={(e) => setPicked(e.target.value)}>
          {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      )}

      <div className="progress-stats">
        <StatCard label="Lifts logged" value={liftsLogged} />
        <StatCard label="Exercises done" value={completed} />
        <StatCard label="Avg sleep" value={avgSleep ?? '—'} sub={avgSleep ? 'h' : ''} />
        <StatCard label="Check-ins" value={checkins.length} />
      </div>

      <div className="progress-block">
        <div className="progress-block-head">Lift progression</div>
        {lifts.length === 0 ? (
          <div className="progress-empty">No weights logged for this program yet. Log a few on the Training tab and they’ll show up here.</div>
        ) : (
          <div className="lift-list">
            {lifts.map((lift) => (
              <div key={lift.name} className="lift-row">
                <div className="lift-info">
                  <div className="lift-name">{lift.name}</div>
                  <div className="lift-meta">
                    best {lift.best}kg
                    {lift.pts.length > 1 && (
                      <span className={`lift-delta${lift.delta >= 0 ? ' is-up' : ' is-down'}`}>
                        {lift.delta >= 0 ? '+' : ''}{lift.delta}kg
                      </span>
                    )}
                  </div>
                </div>
                <Sparkline values={lift.pts.map((p) => p.weight)} unit="kg" />
                <div className="lift-latest">
                  <div className="lift-latest-val">{lift.latest.weight}<i>kg</i></div>
                  <div className="lift-latest-sub">{lift.latest.reps ? `${lift.latest.reps} reps` : 'latest'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="progress-block">
        <div className="progress-block-head">Readiness</div>
        {checkins.length === 0 ? (
          <div className="progress-empty">No check-ins yet. Fill in “Today’s readiness” on the Training tab.</div>
        ) : (
          <div className="readiness-summary">
            <div className="rd-counts">
              <span className="rd-count is-green">{counts.green} good</span>
              <span className="rd-count is-amber">{counts.amber} moderate</span>
              <span className="rd-count is-red">{counts.red} low</span>
            </div>
            {recent.length > 0 && (
              <div className="rd-strip">
                {recent.map((r) => <span key={r.date} className={`rd-strip-dot is-${r.level}`} title={`${r.date} · ${r.level}`} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <MetricsPanel userId={userId} />
    </div>
  );
}
