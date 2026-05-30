import { useState } from 'react';
import { platesPerSide, groupPlates, warmupRamp } from '../utils/plates';

// In-gym helper: type a working weight, see what to load per side of the bar
// and a quick warm-up ramp. Pure UI over utils/plates — no backend.
const BARS = [20, 15, 10];

export default function PlateCalculator({ initialWeight = '', onClose }) {
  const [weight, setWeight] = useState(String(initialWeight || ''));
  const [bar, setBar] = useState(20);

  const { ok, perSide, remainder } = platesPerSide(weight, bar);
  const groups = groupPlates(perSide);
  const ramp = warmupRamp(weight, bar);

  return (
    <div className="picker-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="picker-modal plate-modal">
        <div className="picker-head">
          <span className="picker-title">Plate calculator</span>
          <button className="timer-close" onClick={onClose}>✕</button>
        </div>

        <div className="plate-inputs">
          <label className="plate-field">
            <span>Working weight</span>
            <input
              type="number" inputMode="decimal" autoFocus
              value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="kg"
            />
          </label>
          <label className="plate-field">
            <span>Bar</span>
            <div className="edit-seg">
              {BARS.map((b) => (
                <button key={b} className={bar === b ? 'is-on' : ''} onClick={() => setBar(b)}>{b}kg</button>
              ))}
            </div>
          </label>
        </div>

        <div className="plate-result">
          <div className="plate-result-head">Per side</div>
          {!weight ? (
            <div className="plate-empty">Enter a weight to see the plates.</div>
          ) : !ok ? (
            <div className="plate-empty">That's below the bar ({bar}kg).</div>
          ) : (
            <>
              <div className="plate-chips">
                {groups.length === 0
                  ? <span className="plate-empty">Just the bar.</span>
                  : groups.map((g, i) => (
                      <span key={i} className="plate-chip">{g.count} × {g.plate}kg</span>
                    ))}
              </div>
              {remainder > 0 && (
                <div className="plate-warn">Can't make it exactly — {remainder}kg short per side.</div>
              )}
            </>
          )}
        </div>

        {ramp.length > 0 && (
          <div className="plate-result">
            <div className="plate-result-head">Warm-up ramp</div>
            <div className="plate-ramp">
              {ramp.map((s) => (
                <div key={s.label} className="plate-ramp-row">
                  <span className="plate-ramp-pct">{s.label}</span>
                  <span className="plate-ramp-w">{s.weight}kg</span>
                  <span className="plate-ramp-r">× {s.reps}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
