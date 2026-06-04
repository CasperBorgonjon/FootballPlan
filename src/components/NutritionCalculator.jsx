import { useState } from 'react';
import { ACTIVITY_LEVELS, GOALS, SEXES, findActivity, findGoal } from '../utils/calories';
import { normalizeDecimal } from '../utils/decimal';

// Body-stats form that drives the personalised macro targets. Reads/writes the
// stored profile through the props handed down from NutritionSection. Collapses
// to a slim summary once the numbers are dialled in, so it stays out of the way.

export default function NutritionCalculator({ profile, updateProfile, resetProfile, targets }) {
  const [open, setOpen] = useState(!targets);
  const hasInput = profile.age || profile.height || profile.weight;

  const num = (key) => (e) => {
    const v = normalizeDecimal(e.target.value);
    if (v === '') return updateProfile({ [key]: '' });
    const n = Number(v);
    if (Number.isFinite(n)) updateProfile({ [key]: Math.max(0, n) });
  };

  return (
    <div className="calc-card">
      <button className="calc-head" onClick={() => setOpen((o) => !o)}>
        <div>
          <div className="calc-head-title">Your numbers</div>
          <div className="calc-head-sub">
            {targets
              ? `${findActivity(profile.activity).label.toLowerCase()} activity · ${findGoal(profile.goal).label.toLowerCase()}`
              : 'Add your stats for personalised calorie + macro targets'}
          </div>
        </div>
        <span className={`calc-chevron${open ? ' is-open' : ''}`}>⌄</span>
      </button>

      {open && (
        <div className="calc-body">
          <div className="calc-grid">
            <label className="calc-field">
              <span>Age</span>
              <input type="number" inputMode="numeric" value={profile.age}
                onChange={num('age')} placeholder="yrs" />
            </label>
            <label className="calc-field">
              <span>Height</span>
              <input type="number" inputMode="numeric" value={profile.height}
                onChange={num('height')} placeholder="cm" />
            </label>
            <label className="calc-field">
              <span>Weight</span>
              <input type="text" inputMode="decimal" value={profile.weight}
                onChange={num('weight')} placeholder="kg" />
            </label>
          </div>

          <div className="calc-field">
            <span>Sex</span>
            <div className="calc-seg">
              {SEXES.map((s) => (
                <button key={s.id} className={profile.sex === s.id ? 'is-on' : ''}
                  onClick={() => updateProfile({ sex: s.id })}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="calc-field">
            <span>Activity level</span>
            <div className="calc-seg calc-seg--wrap">
              {ACTIVITY_LEVELS.map((a) => (
                <button key={a.id} className={profile.activity === a.id ? 'is-on' : ''}
                  onClick={() => updateProfile({ activity: a.id })}>
                  {a.label}
                </button>
              ))}
            </div>
            <p className="calc-hint">{findActivity(profile.activity).hint}</p>
          </div>

          <div className="calc-field">
            <span>Goal</span>
            <div className="calc-seg calc-seg--wrap">
              {GOALS.map((g) => (
                <button key={g.id} className={profile.goal === g.id ? 'is-on' : ''}
                  onClick={() => updateProfile({ goal: g.id })}>
                  {g.label}
                </button>
              ))}
            </div>
            <p className="calc-hint">{findGoal(profile.goal).hint}</p>
          </div>

          {targets ? (
            <div className="calc-result">
              <div className="calc-result-item">
                <div className="calc-result-label">Resting (BMR)</div>
                <div className="calc-result-value">{targets.bmr.toLocaleString()}<i>kcal</i></div>
              </div>
              <div className="calc-result-item">
                <div className="calc-result-label">Maintenance</div>
                <div className="calc-result-value">{targets.maintenance.toLocaleString()}<i>kcal</i></div>
              </div>
            </div>
          ) : (
            <p className="calc-hint">Fill in age, height and weight to see your targets.</p>
          )}

          {hasInput && (
            <button className="calc-reset" onClick={resetProfile}>
              Reset to plan defaults
            </button>
          )}
        </div>
      )}
    </div>
  );
}
