export default function Pill({ active, onClick, className = '', children, ...rest }) {
  return (
    <button
      className={`pill${active ? ' is-active' : ''} ${className}`.trim()}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
