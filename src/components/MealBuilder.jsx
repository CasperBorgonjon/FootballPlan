import { useMemo, useState } from 'react';
import { FOODS, FOOD_GROUPS, foodsInGroup } from '../data/foods';
import { sumMeal, kcalOf, macroStatus, proteinPlan } from '../utils/meal';

// High-protein staples the "fill my protein" helper draws from.
const PROTEIN_STAPLES = ['chicken_breast', 'eggs', 'greek_yogurt', 'whey', 'lean_beef'];

// Collapse a plate (list of ids, duplicates = portions) into [{ id, count }].
function groupPlate(plate) {
  const counts = {};
  for (const id of plate) counts[id] = (counts[id] || 0) + 1;
  return Object.entries(counts).map(([id, count]) => ({ id, count }));
}

// One macro's progress bar against its { low, high } target range.
function MacroBar({ label, value, unit, range, color }) {
  const { pct, status } = macroStatus(value, range);
  return (
    <div className="mb-macro">
      <div className="mb-macro-top">
        <span className="mb-macro-label">{label}</span>
        <span className={`mb-macro-val mb-${status}`}>
          {Math.round(value)}{unit}
          {range && <i> / {range.low}–{range.high}</i>}
        </span>
      </div>
      <div className="mb-bar">
        <div className={`mb-bar-fill mb-${status}`} style={{ width: `${pct * 100}%`, background: color }} />
      </div>
    </div>
  );
}

export default function MealBuilder({ plate, target, foodDay, onAdd, onRemove, onClear }) {
  const [group, setGroup] = useState('protein');
  const [query, setQuery] = useState('');

  const total = useMemo(() => sumMeal(plate), [plate]);
  const grouped = groupPlate(plate);

  // Search across every food by name; otherwise show the active group.
  const pickIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return Object.keys(FOODS).filter((id) => FOODS[id].name.toLowerCase().includes(q));
    return foodsInGroup(group);
  }, [query, group]);

  // Top up the plate with protein staples until it reaches the target's low end.
  function fillProtein() {
    if (!target) return;
    const remaining = Math.max(0, target.protein.low - total.p);
    if (remaining <= 0) return;
    proteinPlan(remaining, PROTEIN_STAPLES).picks.forEach(onAdd);
  }

  const proteinGap = target ? Math.max(0, target.protein.low - total.p) : 0;
  const dayLabel = foodDay === 'training' ? 'training-day' : 'rest-day';

  return (
    <div className="meal-builder">
      <div className="mb-head">
        <div>
          <div className="mb-title">Build a meal</div>
          <div className="mb-sub">
            {target ? `Tally toward your ${dayLabel} target` : 'Tap foods to tally the macros'}
          </div>
        </div>
        {plate.length > 0 && (
          <button className="mb-clear" onClick={onClear}>Clear</button>
        )}
      </div>

      {/* Live tally */}
      <div className="mb-tally">
        <MacroBar label="Calories" value={total.kcal} unit="" range={target?.calories} color="#5BF0A5" />
        <MacroBar label="Protein" value={total.p} unit="g" range={target?.protein} color="#F59E0B" />
        <MacroBar label="Carbs" value={total.c} unit="g" range={target?.carbs} color="#38BDF8" />
        <MacroBar label="Fat" value={total.f} unit="g" range={target?.fat} color="#A78BFA" />
      </div>

      {/* The plate / shopping list */}
      {grouped.length > 0 ? (
        <div className="mb-plate">
          {grouped.map(({ id, count }) => {
            const food = FOODS[id];
            return (
              <div key={id} className="mb-plate-row">
                <div className="mb-plate-name">
                  {food.name}
                  <span className="mb-plate-portion">{count} × {food.portion}</span>
                </div>
                <div className="mb-plate-kcal">{kcalOf(food) * count} kcal</div>
                <div className="mb-stepper">
                  <button onClick={() => onRemove(id)} aria-label={`Remove one ${food.name}`}>−</button>
                  <span>{count}</span>
                  <button onClick={() => onAdd(id)} aria-label={`Add one ${food.name}`}>＋</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-empty">Your plate is empty — add foods from the list above or the picker below.</div>
      )}

      {/* Protein helper */}
      {target && proteinGap > 0 && (
        <button className="mb-fill" onClick={fillProtein}>
          ⚡ {proteinGap}g protein short — fill it with staples
        </button>
      )}

      {/* Food picker: search + group filter + chip grid (quick wins) */}
      <div className="mb-picker">
        <input
          className="mb-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search any food…"
        />
        {!query && (
          <div className="mb-groups">
            {FOOD_GROUPS.map((g) => (
              <button
                key={g.id}
                className={`mb-group${group === g.id ? ' is-on' : ''}`}
                onClick={() => setGroup(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}
        <div className="mb-chips">
          {pickIds.map((id) => (
            <button key={id} className="mb-chip" onClick={() => onAdd(id)}>
              <span className="mb-chip-name">{FOODS[id].name}</span>
              <span className="mb-chip-macro">{FOODS[id].p}P · {kcalOf(FOODS[id])}kcal</span>
            </button>
          ))}
          {pickIds.length === 0 && <div className="mb-empty">No foods match “{query}”.</div>}
        </div>
      </div>
    </div>
  );
}
