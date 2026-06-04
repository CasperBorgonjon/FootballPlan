// Primary navigation. Renders the five top-level hubs (Train, Plan, Fuel, Body,
// Progress) — the hub list comes from App's group registry. `active` is the id
// of the hub the current section belongs to. Same component drives the desktop
// top bar and the mobile bottom bar.
export default function MainNav({ groups, active, onSelect, variant }) {
  const isBottom = variant === 'bottom';
  return (
    <nav className={`main-nav main-nav--${variant}`}>
      {groups.map((g) => (
        <button
          key={g.id}
          className={active === g.id ? 'active' : ''}
          onClick={() => onSelect(g.id)}
          aria-current={active === g.id ? 'page' : undefined}
        >
          {isBottom ? (
            <>
              <span className="bottom-nav-icon">{g.icon}</span>
              <span className="bottom-nav-label">{g.label}</span>
            </>
          ) : (
            <>{g.icon} {g.label}</>
          )}
        </button>
      ))}
    </nav>
  );
}
