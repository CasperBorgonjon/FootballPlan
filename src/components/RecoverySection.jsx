import { useState } from 'react';
import { recoveryData } from '../data/recovery';
import { useToday } from '../hooks/useToday';
import { useReadiness } from '../hooks/useReadiness';
import { useRoutineLog } from '../hooks/useRoutineLog';
import { readinessFrom } from '../utils/coaching';
import Pill from './ui/Pill';
import Badge from './ui/Badge';

// localStorage routine bucket for today's recovery checklist — reuses the daily
// routine log (auto-resets each day) so ticking a recovery action persists for
// the day without a dedicated table. Keyed by action id, not index, so the list
// can change (e.g. readiness updates) without mis-mapping what's checked.
const REC_BUCKET = 'rec-today';

// Translate today's training context + how the athlete reported feeling into a
// short, concrete recovery checklist: exactly which levers to pull right now,
// and which to AVOID. This is the "action" half of the page — the tabs below
// are the "why / how" reference behind each line.
function recoveryToday(today, level) {
  const out = [];
  const add = (a) => out.push(a);

  // Sleep is the anchor on every single day.
  add({ id: 'sleep', tab: 'sleep', text: 'Sleep 8–9 h tonight', detail: 'Same bedtime ±30 min, cool dark room. Biggest lever you have.' });

  // Low readiness overrides everything — pull back, don't add session work.
  if (level === 'red') {
    add({ id: 'backoff', tab: 'sleep', text: 'Back off — readiness is low', detail: 'Cut volume or take the rest. Recovery beats any session today.' });
    add({ id: 'mobility', tab: 'body', text: 'Gentle mobility / soft tissue only', detail: '5 min easy foam roll. Nothing hard.' });
    add({ id: 'nap', tab: 'sleep', text: 'Nap if you\'re tired', detail: '20 min, before 3pm.' });
    return out;
  }

  const phase = today.scheduled ? today.match?.phase : null;

  if (phase === 'taper') {
    add({ id: 'taper-sleep', tab: 'sleep', text: 'Protect tonight\'s sleep', detail: 'The two nights before a match matter most.' });
    add({ id: 'taper-light', tab: 'body', text: 'Keep today light & sharp', detail: 'No new fatigue — you play tomorrow.' });
    return out;
  }
  if (phase === 'match') {
    add({ id: 'match-warm', tab: 'mental', text: 'Warm up, fuel, hydrate', detail: 'This is what the week was for.' });
    add({ id: 'match-after', tab: 'body', text: 'After the match: rehydrate + easy flush', detail: 'Then sleep — recovery starts tonight.' });
    return out;
  }
  if (phase === 'recovery') {
    add({ id: 'flush', tab: 'body', text: 'Easy flush + soft tissue', detail: '5 min foam roll on what\'s sore. No hard training.' });
  }

  const deload = today.deload || (today.programType === 'linear' && [4, 8].includes(today.week));
  if (deload) {
    add({ id: 'deload', tab: 'body', text: 'Deload week — cut volume ~40%', detail: 'Keep intensity, fewer sets. This is where you adapt.' });
  }

  if (today.dayType === 'training') {
    add({ id: 'prehab', tab: 'prehab', text: 'Prehab insurance', detail: 'Nordics + Copenhagens + calves around the session.' });
    add({ id: 'roll', tab: 'body', text: 'Foam roll 5 min', detail: 'On what you\'re about to train, then again post-session.' });
    if (today.day?.focus === 'Strength') {
      add({ id: 'noice', tab: 'body', avoid: true, text: 'No ice bath after lifting', detail: 'Cold blunts the strength adaptation you just trained for.' });
    } else if (today.day?.focus === 'Speed' || today.day?.focus === 'Endurance') {
      add({ id: 'cold', tab: 'body', text: 'Cold therapy OK today', detail: '10–12 min at 12–15°C after conditioning/sprints if sore.' });
    }
  } else if (today.dayType === 'rest' && !phase) {
    add({ id: 'rest-soft', tab: 'body', text: 'Light mobility + soft tissue', detail: 'Sleep and easy movement do the work today.' });
  }

  return out;
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
          <div className="rec-item-body">
            <div className="rec-item-desc">{item.d}</div>
            {item.when && <span className="rec-item-when">⏱ {item.when}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecoverySection({ userId }) {
  const today = useToday();
  const { checkin } = useReadiness(userId);
  const { isStepDone, toggleStep } = useRoutineLog(userId);
  const level = readinessFrom(checkin)?.level ?? null;

  const [activeTab, setActiveTab] = useState('sleep');
  const tabData = recoveryData.content[activeTab];

  const actions = recoveryToday(today, level);
  const doneCount = actions.filter((a) => isStepDone(REC_BUCKET, a.id)).length;

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

      <div className="rec-today">
        <div className="rec-today-head">
          <span className="rec-today-title">Today&rsquo;s recovery</span>
          <span className="rec-today-count">{doneCount}/{actions.length} done</span>
        </div>
        <div className="rec-today-list">
          {actions.map((a) => {
            const done = isStepDone(REC_BUCKET, a.id);
            return (
              <div
                key={a.id}
                className={`rec-action${done ? ' is-done' : ''}${a.avoid ? ' is-avoid' : ''}`}
              >
                <button
                  className={`rec-action-check${done ? ' is-done' : ''}`}
                  onClick={() => toggleStep(REC_BUCKET, a.id)}
                  aria-label={done ? 'Mark not done' : 'Mark done'}
                >
                  {done ? '✓' : a.avoid ? '✕' : ''}
                </button>
                <div className="rec-action-main">
                  <span className="rec-action-text">
                    {a.avoid && !done && <span className="rec-action-flag">AVOID</span>}
                    {a.text}
                  </span>
                  <span className="rec-action-detail">{a.detail}</span>
                </div>
                {a.tab !== activeTab && (
                  <button
                    className="rec-action-jump"
                    onClick={() => setActiveTab(a.tab)}
                    aria-label={`Open ${recoveryData.tabs.find((t) => t.id === a.tab)?.label} details`}
                  >
                    →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
