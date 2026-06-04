// Secondary navigation for hubs that hold more than one section — Plan
// (Programs / Guide) and Body (Recovery / Routines). Rendered as a segmented
// control so it reads as one level below the primary hub bar and one level
// above any in-content filter pills. This is the single, shared pattern for
// "switch the section within a hub" across the whole app.
export default function SubNav({ items, active, onSelect }) {
  return (
    <div className="sub-nav" role="tablist" aria-label="Section">
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={active === it.id}
          className={`sub-nav-tab${active === it.id ? ' is-active' : ''}`}
          onClick={() => onSelect(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
