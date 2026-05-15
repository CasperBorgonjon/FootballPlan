// Badge / accent style helpers — keeps tinted-bg pattern in one place.
export const tintBg = (color) => `${color}20`;
export const tintBorder = (color) => `1px solid ${color}40`;

export const badgeStyle = (color) => ({
  color,
  background: tintBg(color),
  border: tintBorder(color),
});
