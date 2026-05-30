// Barbell plate + warm-up math. Pure functions, no React.

// Standard kg plates, heaviest first (per side of the bar).
export const STANDARD_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

// Greedily decompose the load you need ON EACH SIDE of the bar into plates.
// Returns { ok, perSide: number[], remainder } — remainder > 0 means the target
// can't be made exactly with the available plates.
export function platesPerSide(total, bar = 20, available = STANDARD_PLATES) {
  const t = Number(total);
  if (!Number.isFinite(t) || t < bar) return { ok: false, perSide: [], remainder: 0 };
  let side = (t - bar) / 2;
  const perSide = [];
  for (const p of available) {
    while (side >= p - 1e-9) {
      perSide.push(p);
      side = +(side - p).toFixed(3);
    }
  }
  return { ok: true, perSide, remainder: +side.toFixed(3) };
}

// Collapse [25,25,10] → [{ plate: 25, count: 2 }, { plate: 10, count: 1 }] for display.
export function groupPlates(perSide) {
  const out = [];
  for (const p of perSide) {
    const last = out[out.length - 1];
    if (last && last.plate === p) last.count += 1;
    else out.push({ plate: p, count: 1 });
  }
  return out;
}

// A simple warm-up ramp up to the working weight. Bar → 40 → 60 → 80%.
export function warmupRamp(work, bar = 20) {
  const w = Number(work);
  if (!Number.isFinite(w) || w <= bar) return [];
  const round = (x) => Math.round(x / 2.5) * 2.5;
  return [
    { label: 'Bar', weight: bar, reps: 8 },
    { label: '40%', weight: round(w * 0.4), reps: 5 },
    { label: '60%', weight: round(w * 0.6), reps: 3 },
    { label: '80%', weight: round(w * 0.8), reps: 2 },
  ].filter((s) => s.weight > bar || s.label === 'Bar');
}
