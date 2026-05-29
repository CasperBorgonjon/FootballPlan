// Central log-key generator.
//
// Keyed by program id + week + the exercise's STABLE id (not its position).
// This is what lets programs be reordered/edited without orphaning logged
// weights. Every exercise in a program carries a stable `id`.
//
// Format: `{programId}_w{week}_{exerciseId}`
export function logKey(programId, week, exerciseId) {
  return `${programId}_w${week}_${exerciseId}`;
}
