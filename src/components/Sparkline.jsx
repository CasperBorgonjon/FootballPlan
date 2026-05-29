// Tiny inline SVG sparkline for a series of numbers.
export default function Sparkline({ values, unit = '', width = 132, height = 36 }) {
  if (!values || values.length === 0) return <span className="spark-flat">—</span>;
  if (values.length === 1) return <span className="spark-flat">{values[0]}{unit}</span>;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 4;
  const coords = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - 2 * pad);
    const y = height - pad - ((v - min) / range) * (height - 2 * pad);
    return [x, y];
  });
  const d = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const [lx, ly] = coords.at(-1);

  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill="var(--accent)" />
    </svg>
  );
}
