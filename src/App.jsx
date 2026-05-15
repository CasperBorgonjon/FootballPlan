import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import TrainingSection from './components/TrainingSection';
import NutritionSection from './components/NutritionSection';
import RecoverySection from './components/RecoverySection';
import LoginPage from './components/LoginPage';
import MainNav from './components/MainNav';

const SECTIONS = [
  { id: 'training', label: 'Training',  icon: '⚽', Component: TrainingSection,  needsUser: true },
  { id: 'food',     label: 'Nutrition', icon: '🥗', Component: NutritionSection, needsUser: false },
  { id: 'recovery', label: 'Recovery',  icon: '🔋', Component: RecoverySection,  needsUser: false },
];

function AppInner() {
  const { user, loading } = useAuth();
  const [activeId, setActiveId] = useState('training');

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-text">Loading…</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const active = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];
  const ActiveComponent = active.Component;

  return (
    <>
      <MainNav sections={SECTIONS} active={activeId} onSelect={setActiveId} variant="top" />

      <div className="page-content">
        <ActiveComponent {...(active.needsUser ? { userId: user.id } : {})} />
      </div>

      <MainNav sections={SECTIONS} active={activeId} onSelect={setActiveId} variant="bottom" />

      <button id="sign-out-btn" onClick={() => supabase.auth.signOut()}>
        Sign out
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
