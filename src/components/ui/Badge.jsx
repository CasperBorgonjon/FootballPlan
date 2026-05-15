export default function Badge({ children, style, ...rest }) {
  return (
    <span className="badge" style={style} {...rest}>
      {children}
    </span>
  );
}
