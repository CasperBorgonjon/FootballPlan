import { useState, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlanProvider } from './contexts/PlanContext';
import { supabase } from './lib/supabase';
import LoginPage from './components/LoginPage';
import MainNav from './components/MainNav';
import SubNav from './components/SubNav';

// Sections are code-split: only the active one's bundle (and its data — plan,
// nutrition, recovery, exercise library) is fetched, keeping the initial load
// small. The rest load on demand when the user navigates to them.
const TrainingSection = lazy(() => import('./components/TrainingSection'));
const ProgramsSection = lazy(() => import('./components/ProgramsSection'));
const GuideSection = lazy(() => import('./components/GuideSection'));
const ProgressSection = lazy(() => import('./components/ProgressSection'));
const NutritionSection = lazy(() => import('./components/NutritionSection'));
const RecoverySection = lazy(() => import('./components/RecoverySection'));
const RoutinesSection = lazy(() => import('./components/RoutinesSection'));

// The seven destinations. needsUser passes the authed userId to sections that
// still own per-user data hooks (logs, readiness, progress). Plan/today data no
// longer needs it — it comes from PlanProvider context.
const SECTIONS = {
  training: { label: 'Training',  Component: TrainingSection,  needsUser: true },
  plan:     { label: 'Programs',  Component: ProgramsSection,  needsUser: false },
  guide:    { label: 'Guide',     Component: GuideSection,     needsUser: false },
  food:     { label: 'Nutrition', Component: NutritionSection, needsUser: false },
  recovery: { label: 'Recovery',  Component: RecoverySection,  needsUser: true },
  routines: { label: 'Routines',  Component: RoutinesSection,  needsUser: true },
  progress: { label: 'Progress',  Component: ProgressSection,  needsUser: true },
};

// Primary navigation groups those seven destinations into five logical hubs
// that follow the daily loop: do the session (Train), set it up (Plan), fuel it
// (Fuel), look after the body around it (Body), then review (Progress). Hubs
// with more than one section reveal a secondary nav (SubNav) at the top of the
// page. This keeps the primary bar — and especially the mobile bottom bar — to
// five items in a sensible order rather than seven flat tabs.
const GROUPS = [
  { id: 'train',    label: 'Train',    icon: '⚽', sections: ['training'] },
  { id: 'plan',     label: 'Plan',     icon: '🗓', sections: ['plan', 'guide'] },
  { id: 'fuel',     label: 'Fuel',     icon: '🥗', sections: ['food'] },
  { id: 'body',     label: 'Body',     icon: '🧘', sections: ['recovery', 'routines'] },
  { id: 'progress', label: 'Progress', icon: '📈', sections: ['progress'] },
];

const groupOf = (sectionId) =>
  GROUPS.find((g) => g.sections.includes(sectionId)) ?? GROUPS[0];

function AppInner() {
  const { user, loading } = useAuth();
  const [activeId, setActiveId] = useState('training');
  // Remember the last section opened inside each multi-section hub, so tapping
  // a hub returns you to where you left off rather than always resetting.
  const [lastByGroup, setLastByGroup] = useState({});

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-text">Loading…</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const goToSection = (sectionId) => {
    setActiveId(sectionId);
    setLastByGroup((m) => ({ ...m, [groupOf(sectionId).id]: sectionId }));
  };

  const goToGroup = (groupId) => {
    const g = GROUPS.find((x) => x.id === groupId);
    if (!g || g.sections.includes(activeId)) return; // already inside this hub
    goToSection(lastByGroup[groupId] ?? g.sections[0]);
  };

  const activeGroup = groupOf(activeId);
  const active = SECTIONS[activeId];
  const ActiveComponent = active.Component;
  const showSubNav = activeGroup.sections.length > 1;

  return (
    <PlanProvider userId={user.id}>
      <header className="app-header">
        <div className="app-header-brand">
          <span className="app-header-mark">◆</span>
          <span className="app-header-title">PLAN</span>
        </div>
        <MainNav groups={GROUPS} active={activeGroup.id} onSelect={goToGroup} variant="top" />
        <div className="app-header-actions">
          <button className="app-header-signout" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </header>

      <div className="page-content">
        {showSubNav && (
          <SubNav
            items={activeGroup.sections.map((id) => ({ id, label: SECTIONS[id].label }))}
            active={activeId}
            onSelect={goToSection}
          />
        )}
        <Suspense fallback={<div className="loading-inline">Loading…</div>}>
          <ActiveComponent {...(active.needsUser ? { userId: user.id } : {})} />
        </Suspense>
      </div>

      <MainNav groups={GROUPS} active={activeGroup.id} onSelect={goToGroup} variant="bottom" />
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
