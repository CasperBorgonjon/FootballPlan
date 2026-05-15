import { useState } from 'react';
import { recoveryData } from '../data/recovery';
import Pill from './ui/Pill';
import Badge from './ui/Badge';

function RecoveryCard({ card, accent }) {
  return (
    <div className="rec-card">
      <div className="rec-card-head">
        <div className="rec-card-title">{card.title}</div>
        <Badge color={card.pColor}>{card.priority}</Badge>
      </div>
      {card.items.map((item, i) => (
        <div
          key={item.l}
          className={`rec-item${i === card.items.length - 1 ? ' rec-item--last' : ''}`}
        >
          <div className="rec-item-label" style={{ color: accent }}>{item.l}</div>
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
      <div className="rec-tabs-wrap">
        {recoveryData.tabs.map((t) => (
          <Pill
            key={t.id}
            active={activeTab === t.id}
            color={tabData.accent}
            onClick={() => setActiveTab(t.id)}
            className="rec-tab"
          >
            {t.icon} {t.label}
          </Pill>
        ))}
      </div>

      <div className="rec-content">
        <div className="rec-intro" style={{ borderLeft: `4px solid ${tabData.accent}` }}>
          <div className="rec-intro-tag" style={{ color: tabData.accent }}>
            {activeTabMeta.icon} {activeTabMeta.label.toUpperCase()}
          </div>
          <div className="rec-intro-title">{tabData.title}</div>
          <div className="rec-intro-sub">{tabData.sub}</div>
        </div>

        {tabData.cards.map((card) => (
          <RecoveryCard key={card.title} card={card} accent={tabData.accent} />
        ))}

        <div className="rec-footer">USE ALONGSIDE TRAINING & NUTRITION PLANS</div>
      </div>
    </div>
  );
}
