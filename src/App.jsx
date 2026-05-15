import { useState, useEffect } from 'react';
import TrainingSection from './components/TrainingSection';
import NutritionSection from './components/NutritionSection';
import RecoverySection from './components/RecoverySection';

const SECTIONS = [
  { id: 'training', label: 'Training', icon: '⚽' },
  { id: 'food', label: 'Nutrition', icon: '🥗' },
  { id: 'recovery', label: 'Recovery', icon: '🔋' },
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

      {/* Top nav — desktop only */}
      <nav className="main-nav main-nav--top">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={activeSection === s.id ? 'active' : ''}
            onClick={() => setActiveSection(s.id)}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </nav>

      <div className="page-content">
        {activeSection === 'training' && <TrainingSection />}
        {activeSection === 'food' && <NutritionSection />}
        {activeSection === 'recovery' && <RecoverySection />}
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="main-nav main-nav--bottom">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={activeSection === s.id ? 'active' : ''}
            onClick={() => setActiveSection(s.id)}
            style={{ '--accent': accentMap[s.id] }}
          >
            <span className="bottom-nav-icon">{s.icon}</span>
            <span className="bottom-nav-label">{s.label}</span>
          </button>
        ))}
      </nav>

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
