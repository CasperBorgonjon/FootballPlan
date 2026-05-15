import { useState, useEffect } from 'react';
import TrainingSection from './components/TrainingSection';
import NutritionSection from './components/NutritionSection';
import RecoverySection from './components/RecoverySection';

const SECTIONS = [
  { id: 'training', label: '⚽ Training' },
  { id: 'food', label: '🥗 Nutrition' },
  { id: 'recovery', label: '🔋 Recovery' },
];

const accentMap = {
  training: '#5BF0A5',
  food: '#F59E0B',
  recovery: '#A78BFA',
};

const labelMap = {
  training: 'COMPLETE PLAN',
  food: 'NUTRITION GUIDE',
  recovery: 'RECOVERY & TRACKING',
};

export default function App() {
  const [activeSection, setActiveSection] = useState('training');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <>
      <div id="main-header">
        <div className="header-eyebrow">FULLBACK · OFF-SEASON · 6 DAYS/WEEK · NO BALL WORK</div>
        <div className="header-title">
          SOCCER<br />
          <span style={{ color: accentMap[activeSection] }}>{labelMap[activeSection]}</span>
        </div>
      </div>

      <nav className="main-nav">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={activeSection === s.id ? 'active' : ''}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {activeSection === 'training' && <TrainingSection />}
      {activeSection === 'food' && <NutritionSection />}
      {activeSection === 'recovery' && <RecoverySection />}

      <button
        id="theme-toggle"
        onClick={() => setIsDark((d) => !d)}
        title="Toggle light/dark mode"
      >
        {isDark ? '🌙' : '🌑'}
      </button>
    </>
  );
}
