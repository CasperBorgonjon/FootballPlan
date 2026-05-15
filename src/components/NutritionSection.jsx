import { useState } from 'react';
import { nutritionData } from '../data/nutrition';
import Pill from './ui/Pill';

function FoodSection({ sec }) {
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
        <div key={item} className={`food-item${isAvoid ? ' is-avoid' : ''}`}>
          <div className="food-item-dot" />
          <div>{item}</div>
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
      <div className="metabar">
        <div className="metabar-left">
          <span className="metabar-tag">NUTRITION</span>
          <span className="metabar-dot">·</span>
          <span>Performance fueling</span>
        </div>
        <div className="metabar-right">{foodDay === 'training' ? 'TRAINING DAY' : 'REST DAY'}</div>
      </div>

      <div className="hero">
        <div>
          <div className="hero-eyebrow">Soccer · Nutrition Guide</div>
          <h1 className="hero-title">
            Fuel — <em>{foodDay === 'training' ? 'training day' : 'rest day'}</em>
          </h1>
          <div className="hero-sub">Macros below are tuned for a 6-day off-season block.</div>
        </div>
      </div>

      <div className="nutrition-toggle">
        <Pill active={foodDay === 'training'} onClick={() => handleFoodDay('training')}>
          ⚡ Training Day
        </Pill>
        <Pill active={foodDay === 'rest'} onClick={() => handleFoodDay('rest')}>
          😴 Rest Day
        </Pill>
      </div>

      <div className="macro-strip">
        {data.macros.map((m) => (
          <div key={m.l} className="macro-item">
            <div className="macro-label">{m.l}</div>
            <div className="macro-value">
              {m.v}<span className="macro-unit">{m.u}</span>
            </div>
          </div>
        ))}
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
          <FoodSection key={sec.name} sec={sec} />
        ))}
      </div>

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
