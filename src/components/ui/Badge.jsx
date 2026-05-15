import { badgeStyle } from '../../utils/colors';

export default function Badge({ color, children, style, ...rest }) {
  return (
    <span className="badge" style={{ ...badgeStyle(color), ...style }} {...rest}>
      {children}
    </span>
  );
}
