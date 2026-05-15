import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import TrainingSection from './components/TrainingSection';
import NutritionSection from './components/NutritionSection';
import RecoverySection from './components/RecoverySection';
import LoginPage from './components/LoginPage';
import MainNav from './components/MainNav';

// One registry — adding a section (metrics, photos, coach view) is a single
// entry here, no if-chain edits.
const SECTIONS = [
  { id: 'training', label: 'Training',  icon: '⚽', accent: '#5BF0A5', headerLabel: 'COMPLETE PLAN',     Component: TrainingSection,  needsUser: true },
  { id: 'food',     label: 'Nutrition', icon: '🥗', accent: '#F59E0B', headerLabel: 'NUTRITION GUIDE',   Component: NutritionSection, needsUser: false },
  { id: 'recovery', label: 'Recovery',  icon: '🔋', accent: '#A78BFA', headerLabel: 'RECOVERY & TRACKING', Component: RecoverySection,  needsUser: false },
];

function AppInner() {
  const { user, loading } = useAuth();
  const [activeId, setActiveId] = useState('training');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-text">LOADING...</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const active = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];
  const ActiveComponent = active.Component;

  return (
    <>
      <div id="main-header">
        <div className="header-eyebrow">FULLBACK · OFF-SEASON · 6 DAYS/WEEK · NO BALL WORK</div>
        <div className="header-title">
          SOCCER<br />
          <span style={{ color: active.accent }}>{active.headerLabel}</span>
        </div>
      </div>

      <MainNav sections={SECTIONS} active={activeId} onSelect={setActiveId} variant="top" />

      <div className="page-content">
        <ActiveComponent {...(active.needsUser ? { userId: user.id } : {})} />
      </div>

      <MainNav sections={SECTIONS} active={activeId} onSelect={setActiveId} variant="bottom" />

      <button
        id="theme-toggle"
        onClick={() => setIsDark((d) => !d)}
        title="Toggle light/dark"
      >
        {isDark ? '🌙' : '🌑'}
      </button>

      <button
        id="sign-out-btn"
        onClick={() => supabase.auth.signOut()}
        title="Sign out"
      >
        ↩
      </button>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
