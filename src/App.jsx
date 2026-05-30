import { useState, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlanProvider } from './contexts/PlanContext';
import { supabase } from './lib/supabase';
import LoginPage from './components/LoginPage';
import MainNav from './components/MainNav';

// Sections are code-split: only the active one's bundle (and its data — plan,
// nutrition, recovery, exercise library) is fetched, keeping the initial load
// small. The rest load on demand when the user navigates to them.
const TrainingSection = lazy(() => import('./components/TrainingSection'));
const ProgramsSection = lazy(() => import('./components/ProgramsSection'));
const GuideSection = lazy(() => import('./components/GuideSection'));
const ProgressSection = lazy(() => import('./components/ProgressSection'));
const NutritionSection = lazy(() => import('./components/NutritionSection'));
const RecoverySection = lazy(() => import('./components/RecoverySection'));

// needsUser: passes the authed userId to sections that still own per-user data
// hooks (logs, readiness, progress). Plan/today data no longer needs it — it
// comes from PlanProvider context.
const SECTIONS = [
  { id: 'training', label: 'Training',  icon: '⚽', Component: TrainingSection,  needsUser: true },
  { id: 'plan',     label: 'Plan',      icon: '🗓', Component: ProgramsSection,  needsUser: false },
  { id: 'guide',    label: 'Guide',     icon: '🎓', Component: GuideSection,     needsUser: false },
  { id: 'progress', label: 'Progress',  icon: '📈', Component: ProgressSection,  needsUser: true },
  { id: 'food',     label: 'Nutrition', icon: '🥗', Component: NutritionSection, needsUser: false },
  { id: 'recovery', label: 'Recovery',  icon: '🔋', Component: RecoverySection,  needsUser: true },
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
    <PlanProvider userId={user.id}>
      <header className="app-header">
        <div className="app-header-brand">
          <span className="app-header-mark">◆</span>
          <span className="app-header-title">PLAN</span>
        </div>
        <MainNav sections={SECTIONS} active={activeId} onSelect={setActiveId} variant="top" />
        <div className="app-header-actions">
          <button className="app-header-signout" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </header>

      <div className="page-content">
        <Suspense fallback={<div className="loading-inline">Loading…</div>}>
          <ActiveComponent {...(active.needsUser ? { userId: user.id } : {})} />
        </Suspense>
      </div>

      <MainNav sections={SECTIONS} active={activeId} onSelect={setActiveId} variant="bottom" />
    </PlanProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
