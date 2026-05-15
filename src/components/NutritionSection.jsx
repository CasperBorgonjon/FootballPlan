import { useState } from 'react';
import { nutritionData } from '../data/nutrition';
import Pill from './ui/Pill';

const TRAINING_ACCENT = '#5BF0A5';

function MacroStrip({ macros }) {
  return (
    <div className="macro-strip">
      {macros.map((m) => (
        <div key={m.l} className="macro-item">
          <div className="macro-value" style={{ color: m.c }}>
            {m.v}<span className="macro-unit">{m.u}</span>
          </div>
          <div className="macro-label">{m.l.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
}

function FoodSection({ sec, catColor }) {
  const isAvoid = sec.name.includes('Avoid');
  return (
    <div>
      <div className="block-header">
        <div
          className="block-header-name"
          style={{ color: isAvoid ? '#F87171' : 'var(--text-dim)' }}
        >
          {isAvoid ? '⚠ ' : ''}{sec.name.toUpperCase()}
        </div>
        <div className="block-header-count">{sec.items.length} options</div>
      </div>
      {sec.items.map((item) => (
        <div key={item} className="food-item">
          <div
            className="food-dot"
            style={{ background: isAvoid ? '#F87171' : catColor }}
          />
          <div
            className="food-item-text"
            style={{ color: isAvoid ? 'var(--text-sub)' : 'var(--text)' }}
          >
            {item}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NutritionSection() {
  const [foodDay, setFoodDay] = useState('training');
  const [activeCat, setActiveCat] = useState('pre');

  const data = nutritionData[foodDay];
  const cat = data.categories.find((c) => c.id === activeCat) || data.categories[0];

  function handleFoodDay(type) {
    setFoodDay(type);
    setActiveCat(nutritionData[type].categories[0].id);
  }

  return (
    <div className="section-content">
      {/* Day type toggle */}
      <div className="food-toggle-wrap">
        <Pill active={foodDay === 'training'} color={TRAINING_ACCENT} onClick={() => handleFoodDay('training')}>
          ⚡ Training Day
        </Pill>
        <Pill active={foodDay === 'rest'} color={TRAINING_ACCENT} onClick={() => handleFoodDay('rest')}>
          😴 Rest Day
        </Pill>
      </div>

      <MacroStrip macros={data.macros} />

      <div className="meal-cards">
        {/* Category pills */}
        <div className="cat-pills">
          {data.categories.map((c) => (
            <Pill key={c.id} active={activeCat === c.id} color={c.color} onClick={() => setActiveCat(c.id)}>
              {c.icon} {c.label}
            </Pill>
          ))}
        </div>

        {/* Active category card */}
        <div className="section-block" style={{ borderLeft: `4px solid ${cat.color}` }}>
          <div className="cat-card-header">
            <div>
              <div className="cat-card-title">{cat.label}</div>
              <div className="cat-card-sub" style={{ color: cat.color }}>
                {cat.time} · {cat.goal}
              </div>
            </div>
            <div className="cat-card-icon">{cat.icon}</div>
          </div>
          {cat.sections.map((sec) => (
            <FoodSection key={sec.name} sec={sec} catColor={cat.color} />
          ))}
        </div>
      </div>

      {/* Principles */}
      <div className="principles-wrap">
        <div className="principles-heading">CORE PRINCIPLES</div>
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
