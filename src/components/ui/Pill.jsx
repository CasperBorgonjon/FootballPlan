// Shared pill button used by nutrition tabs, recovery tabs, food-day toggle,
// and phase tabs. Active = colored bg + black text. Inactive = card bg + sub text.
export default function Pill({
  active,
  color = '#5BF0A5',
  onClick,
  className = 'food-pill',
  style,
  children,
  ...rest
}) {
  return (
    <button
      className={className}
      onClick={onClick}
      style={{
        background: active ? color : 'var(--bg-card)',
        color: active ? '#000' : 'var(--text-sub)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
