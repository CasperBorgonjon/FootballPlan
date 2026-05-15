// Central log-key generator.
// Today: planId defaults to 'default' but is omitted from the key so existing
// rows keep working. When multi-plan support lands, change ONE place here.
export function logKey(week, phaseIdx, dayIdx, exIdx, planId = 'default') {
  return planId === 'default'
    ? `w${week}_p${phaseIdx}_d${dayIdx}_e${exIdx}`
    : `pl${planId}_w${week}_p${phaseIdx}_d${dayIdx}_e${exIdx}`;
}
