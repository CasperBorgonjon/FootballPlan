import { useState } from 'react';
import { recoveryData } from '../data/recovery';
import Pill from './ui/Pill';
import Badge from './ui/Badge';

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

export default function RecoverySection() {
  const [activeTab, setActiveTab] = useState('sleep');
  const tabData = recoveryData.content[activeTab];

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
