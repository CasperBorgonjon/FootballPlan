import { useState } from 'react';
import { recoveryData } from '../data/recovery';
import { useToday } from '../hooks/useToday';
import { useReadiness } from '../hooks/useReadiness';
import { readinessFrom } from '../utils/coaching';
import Pill from './ui/Pill';
import Badge from './ui/Badge';

// Point today at the most relevant recovery lever, given the session, match
// position, deload week, and how the athlete reported feeling.
function recoveryFocus(today, level) {
  if (level === 'red') {
    return { tab: 'sleep', title: 'You flagged low readiness', text: 'Back off today and prioritise sleep — it beats every other recovery tool combined.' };
  }
  if (!today.scheduled) return null;
  const m = today.match?.phase;
  if (m === 'taper') return { tab: 'sleep', title: 'Match tomorrow', text: 'Protect tonight’s sleep and last night’s — the two nights before matter most. Keep today light.' };
  if (m === 'match') return { tab: 'body', title: 'Match day', text: 'Fuel and warm up. Recovery starts after: rehydrate, easy flush, then sleep.' };
  if (m === 'recovery') return { tab: 'body', title: 'Day after the match', text: 'Soft tissue and easy movement to flush the legs. No hard training.' };
  if (today.deload || (today.programType === 'linear' && [4, 8].includes(today.week))) {
    return { tab: 'body', title: 'Deload week', text: 'Cut volume ~40%, keep intensity. This is where adaptation catches up — don’t skip it.' };
  }
  if (today.dayType === 'rest') return { tab: 'sleep', title: 'Rest day', text: 'Sleep and soft tissue do the work today.' };
  return { tab: 'prehab', title: 'Training day', text: 'Don’t skip the insurance — Nordics, Copenhagens and calves keep a fullback on the pitch.' };
}

function RecoveryCard({ card }) {
  return (
    <div className="rec-card">
      <div className="rec-card-head">
        <div className="rec-card-title">{card.title}</div>
        <Badge>{card.priority}</Badge>
      </div>
      {card.items.map((item) => (
        <div key={item.l} className="rec-item">
          <div className="rec-item-label">{item.l}</div>
          <div className="rec-item-desc">{item.d}</div>
        </div>
      ))}
    </div>
  );
}

export default function RecoverySection({ userId }) {
  const today = useToday();
  const { checkin } = useReadiness(userId);
  const focus = recoveryFocus(today, readinessFrom(checkin)?.level);
  const [activeTab, setActiveTab] = useState('sleep');
  const tabData = recoveryData.content[activeTab];
  const focusTabLabel = focus && recoveryData.tabs.find((t) => t.id === focus.tab)?.label;

  return (
    <div className="section-content">
      <div className="hero">
        <div>
          <div className="hero-eyebrow">Recovery</div>
          <h1 className="hero-title">
            {tabData.title.split(' ')[0]} — <em>{tabData.title.split(' ').slice(1).join(' ').toLowerCase()}</em>
          </h1>
        </div>
      </div>

      {focus && (
        <div className="today-banner today-banner--rec">
          <div className="today-banner-main">
            <span className="today-banner-title">{focus.title}</span>
            <span className="today-banner-text">{focus.text}</span>
          </div>
          {focus.tab !== activeTab && (
            <button className="btn btn--sm today-banner-btn" onClick={() => setActiveTab(focus.tab)}>
              {focusTabLabel} →
            </button>
          )}
        </div>
      )}

      <div className="rec-tabs">
        {recoveryData.tabs.map((t) => (
          <Pill key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>
            {t.icon} {t.label}
          </Pill>
        ))}
      </div>

      <div className="rec-content">
        {tabData.cards.map((card) => (
          <RecoveryCard key={card.title} card={card} />
        ))}
      </div>

    </div>
  );
}
