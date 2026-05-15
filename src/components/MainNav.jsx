// Shared top/bottom nav. Section list comes from App's section registry.
export default function MainNav({ sections, active, onSelect, variant }) {
  const isBottom = variant === 'bottom';
  return (
    <nav className={`main-nav main-nav--${variant}`}>
      {sections.map((s) => (
        <button
          key={s.id}
          className={active === s.id ? 'active' : ''}
          onClick={() => onSelect(s.id)}
          style={isBottom ? { '--accent': s.accent } : undefined}
        >
          {isBottom ? (
            <>
              <span className="bottom-nav-icon">{s.icon}</span>
              <span className="bottom-nav-label">{s.label}</span>
            </>
          ) : (
            <>{s.icon} {s.label}</>
          )}
        </button>
      ))}
    </nav>
  );
}
