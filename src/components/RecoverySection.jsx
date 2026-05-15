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
  const activeTabMeta = recoveryData.tabs.find((t) => t.id === activeTab);

  return (
    <div className="section-content">
      <div className="metabar">
        <div className="metabar-left">
          <span className="metabar-tag">RECOVERY</span>
          <span className="metabar-dot">·</span>
          <span>Adaptation system</span>
        </div>
        <div className="metabar-right">{activeTabMeta.label.toUpperCase()}</div>
      </div>

      <div className="hero">
        <div>
          <div className="hero-eyebrow">Soccer · Recovery & Tracking</div>
          <h1 className="hero-title">
            {tabData.title.split(' ')[0]} — <em>{tabData.title.split(' ').slice(1).join(' ').toLowerCase()}</em>
          </h1>
          <div className="hero-sub">{tabData.sub}</div>
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

      <div className="footer-bar">
        <div>USE WITH TRAINING & NUTRITION</div>
        <div>12-WEEK BLOCK</div>
      </div>
    </div>
  );
}
