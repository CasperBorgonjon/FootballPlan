import { useState } from 'react';
import { nutritionData } from '../data/nutrition';
import { FOODS } from '../data/foods';
import { kcalOf } from '../utils/meal';
import { useToday } from '../hooks/useToday';
import { useNutritionProfile } from '../hooks/useNutritionProfile';
import { nutritionTargets } from '../utils/calories';
import NutritionCalculator from './NutritionCalculator';
import MealBuilder from './MealBuilder';
import Pill from './ui/Pill';

function nutritionContext(today) {
  if (!today.scheduled || !today.day) return null;
  if (today.match?.phase === 'match') {
    return { fuel: 'training', text: 'Match day — fuel up, hydrate, eat your pre-match meal early.' };
  }
  if (today.dayType === 'rest') {
    return { fuel: 'rest', text: `Rest day · ${today.day.focus} — leaner intake, protein stays high.` };
  }
  return { fuel: 'training', text: `${today.day.focus} session today — training-day fuel.` };
}

// A food row resolves its id against the FOODS db: a known id renders with its
// portion, macros and an add-to-plate button; anything else is a plain note line.
function FoodRow({ item, isAvoid, onAddFood }) {
  const food = FOODS[item];
  if (!food) {
    return (
      <div className={`food-item${isAvoid ? ' is-avoid' : ''}`}>
        <div className="food-item-dot" />
        <div>{item}</div>
      </div>
    );
  }
  return (
    <div className="food-item is-food">
      <div className="food-item-dot" />
      <div className="food-item-main">
        <span className="food-item-name">{food.name}</span>
        <span className="food-item-portion">{food.portion}</span>
      </div>
      <div className="food-item-macros">
        <span className="fim-p">{food.p}P</span>
        <span className="fim-c">{food.c}C</span>
        <span className="fim-f">{food.f}F</span>
        <span className="fim-kcal">{kcalOf(food)}</span>
      </div>
      {onAddFood && (
        <button className="food-item-add" onClick={() => onAddFood(item)} aria-label={`Add ${food.name} to plate`}>
          ＋
        </button>
      )}
    </div>
  );
}

function FoodSection({ sec, onAddFood }) {
  const isAvoid = sec.name.includes('Avoid');
  return (
    <div className="food-section">
      <div className="food-section-head">
        <div className={`food-section-name${isAvoid ? ' is-avoid' : ''}`}>
          {isAvoid ? '⚠ ' : ''}{sec.name}
        </div>
        <div className="food-section-count">{sec.items.length} options</div>
      </div>
      {sec.items.map((item) => (
        <FoodRow key={item} item={item} isAvoid={isAvoid} onAddFood={onAddFood} />
      ))}
    </div>
  );
}

// "150–190" — render a { low, high } macro range as a string.
const fmtRange = (r) => `${r.low.toLocaleString()}–${r.high.toLocaleString()}`;

// Personalised macro targets override the plan's static numbers when the athlete
// has filled in their profile. Falls back to the generic plan figures otherwise.
function macrosFor(foodDay, targets, staticMacros) {
  if (!targets) return { macros: staticMacros, personalised: false };
  const t = targets[foodDay];
  return {
    personalised: true,
    macros: [
      { l: 'Calories', v: fmtRange(t.calories), u: 'kcal' },
      { l: 'Protein', v: fmtRange(t.protein), u: 'g' },
      { l: 'Carbs', v: fmtRange(t.carbs), u: 'g' },
      { l: 'Fat', v: fmtRange(t.fat), u: 'g' },
    ],
  };
}

export default function NutritionSection() {
  const today = useToday();
  const ctx = nutritionContext(today);
  const { profile, updateProfile, resetProfile } = useNutritionProfile();
  const [manual, setManual] = useState(null);

  const foodDay = manual ?? ctx?.fuel ?? 'training';
  const [activeCat, setActiveCat] = useState(nutritionData.training.categories[0].id);

  const data = nutritionData[foodDay];
  const cat = data.categories.find((c) => c.id === activeCat) || data.categories[0];

  const targets = nutritionTargets(profile);
  const { macros, personalised } = macrosFor(foodDay, targets, data.macros);

  // The meal-builder plate. Shared so the "+" buttons in the food list feed the
  // same plate the builder tallies. Each entry is a food id; duplicates = portions.
  const [plate, setPlate] = useState([]);
  const addFood = (id) => setPlate((p) => [...p, id]);
  const removeFood = (id) =>
    setPlate((p) => {
      const i = p.indexOf(id);
      if (i < 0) return p;
      return [...p.slice(0, i), ...p.slice(i + 1)];
    });
  const clearPlate = () => setPlate([]);

  function handleFoodDay(type) {
    setManual(type);
    setActiveCat(nutritionData[type].categories[0].id);
  }

  return (
    <div className="section-content">
      <div className="hero">
        <div>
          <div className="hero-eyebrow">Nutrition</div>
          <h1 className="hero-title">
            Fuel — <em>{foodDay === 'training' ? 'training day' : 'rest day'}</em>
          </h1>
        </div>
      </div>

      {ctx && (
        <div className="today-banner">
          <span className="today-banner-tag">Today</span>
          <span className="today-banner-text">{ctx.text}</span>
        </div>
      )}

      <NutritionCalculator
        profile={profile}
        updateProfile={updateProfile}
        resetProfile={resetProfile}
        targets={targets}
      />

      <div className="nutrition-toggle">
        <Pill active={foodDay === 'training'} onClick={() => handleFoodDay('training')}>
          ⚡ Training Day
        </Pill>
        <Pill active={foodDay === 'rest'} onClick={() => handleFoodDay('rest')}>
          😴 Rest Day
        </Pill>
      </div>

      <div className={`macro-strip${personalised ? ' is-range' : ''}`}>
        {macros.map((m) => (
          <div key={m.l} className="macro-item">
            <div className="macro-label">{m.l}</div>
            <div className="macro-value">
              {m.v}<span className="macro-unit">{m.u}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="macro-source">
        {personalised
          ? `Tailored to your profile · ${foodDay === 'training' ? 'training-day' : 'rest-day'} target`
          : 'Generic plan targets — add your stats above to personalise'}
      </div>

      <div className="cat-pills">
        {data.categories.map((c) => (
          <Pill key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
            {c.icon} {c.label}
          </Pill>
        ))}
      </div>

      <div className="cat-card">
        <div className="cat-card-head">
          <div>
            <div className="cat-card-title">{cat.label}</div>
            <div className="cat-card-sub">{cat.time} · {cat.goal}</div>
          </div>
          <div className="cat-card-icon">{cat.icon}</div>
        </div>
        {cat.sections.map((sec) => (
          <FoodSection key={sec.name} sec={sec} onAddFood={addFood} />
        ))}
      </div>

      <MealBuilder
        plate={plate}
        target={targets?.[foodDay] ?? null}
        foodDay={foodDay}
        onAdd={addFood}
        onRemove={removeFood}
        onClear={clearPlate}
      />

      {data.examples && (
        <div className="timing-examples">
          <div className="principles-heading">Sample Day Timing</div>
          <div className="timing-grid">
            {data.examples.map((ex) => (
              <div key={ex.title} className="timing-card">
                <div className="timing-card-title">{ex.title}</div>
                {ex.rows.map((r) => (
                  <div key={r[0] + r[1]} className="timing-row">
                    <span className="timing-time">{r[0]}</span>
                    <span className="timing-meal">{r[1]}</span>
                    <span className="timing-detail">{r[2]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="principles">
        <div className="principles-heading">Core Principles</div>
        <div className="principles-grid">
          {[
            { icon: '🔄', title: 'Carb Cycle', text: 'High carbs on hard days. Cut ~40% on rest days. Protein stays constant.' },
            { icon: '⏰', title: 'Meal Timing', text: 'Eat every 3–4 hrs. Never skip post-session nutrition.' },
            { icon: '💧', title: 'Hydration', text: '3–4L on training days. Sweat loss in soccer is very high.' },
            { icon: '😴', title: 'Sleep = Gains', text: '8–9 hours. Most adaptation happens during sleep, not training.' },
          ].map((p) => (
            <div key={p.title} className="principle-card">
              <div className="principle-icon">{p.icon}</div>
              <div className="principle-title">{p.title}</div>
              <div className="principle-text">{p.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
