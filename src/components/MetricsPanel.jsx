import { useState } from 'react';
import { useMetrics } from '../hooks/useMetrics';
import Sparkline from './Sparkline';

// The reference's test-week metrics + daily bodyweight. lower=true means a
// smaller number is better (sprint time).
const METRICS = [
  { key: 'bodyweight', label: 'Bodyweight', unit: 'kg', lower: false, step: '0.1' },
  { key: 'sprint30', label: '30m sprint', unit: 's', lower: true, step: '0.01' },
  { key: 'vertical', label: 'Vertical jump', unit: 'cm', lower: false, step: '0.5' },
  { key: 'squat1rm', label: 'Squat 1RM', unit: 'kg', lower: false, step: '1' },
  { key: 'bench1rm', label: 'Bench 1RM', unit: 'kg', lower: false, step: '1' },
];

function MetricCard({ def, history, onSave }) {
  const [val, setVal] = useState('');
  const values = history.map((h) => h.value);
  const latest = history.at(-1)?.value ?? null;
  const best = values.length ? (def.lower ? Math.min(...values) : Math.max(...values)) : null;

  function submit() {
    if (val === '') return;
    onSave(def.key, val);
    setVal('');
  }

  return (
    <div className="metric-card">
      <div className="metric-head">
        <span className="metric-label">{def.label}</span>
        {best != null && <span className="metric-best">best {best}{def.unit}</span>}
      </div>
      <div className="metric-body">
        <div className="metric-latest">
          {latest != null ? <>{latest}<i>{def.unit}</i></> : <span className="metric-none">—</span>}
        </div>
        <Sparkline values={values} unit={def.unit} width={110} height={32} />
      </div>
      <div className="metric-log">
        <input
          type="number" step={def.step} inputMode="decimal"
          placeholder={`Today (${def.unit})`}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button className="mini-btn" onClick={submit}>Log</button>
      </div>
    </div>
  );
}

export default function MetricsPanel({ userId }) {
  const { byMetric, save } = useMetrics(userId);

  return (
    <div className="progress-block">
      <div className="progress-block-head">Tests &amp; bodyweight</div>
      <div className="metric-grid">
        {METRICS.map((def) => (
          <MetricCard key={def.key} def={def} history={byMetric[def.key] ?? []} onSave={save} />
        ))}
      </div>
    </div>
  );
}
