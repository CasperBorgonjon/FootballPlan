import { useState } from 'react';
import { guideData } from '../data/guide';
import Pill from './ui/Pill';
import Badge from './ui/Badge';

// Teaches the principles behind a good soccer program. Vocabulary mirrors the
// Plan builder (program type, phases, focus tags, sets/reps) so the "why" here
// maps onto the variables the user actually sets there.
function GuideCard({ card }) {
  return (
    <div className="rec-card">
      <div className="rec-card-head">
        <div className="rec-card-title">{card.title}</div>
        <Badge style={card.pColor ? { color: card.pColor, borderColor: card.pColor } : undefined}>
          {card.priority}
        </Badge>
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

export default function GuideSection() {
  const [activeTab, setActiveTab] = useState('principles');
  const tabData = guideData.content[activeTab];

  return (
    <div className="section-content">
      <div className="hero">
        <div className="hero-eyebrow">Guide</div>
        <h1 className="hero-title">
          {tabData.title.split(' ').slice(0, -1).join(' ')}{' '}
          <em>{tabData.title.split(' ').slice(-1)}</em>
        </h1>
        <div className="hero-sub">{tabData.sub}</div>
      </div>

      <div className="rec-tabs">
        {guideData.tabs.map((t) => (
          <Pill key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>
            {t.icon} {t.label}
          </Pill>
        ))}
      </div>

      <div className="rec-content">
        {tabData.cards.map((card) => (
          <GuideCard key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
