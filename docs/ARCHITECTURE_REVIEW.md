# Architecture Review & Hardening Checklist

A snapshot of where the codebase can be made more maintainable. The app works
and is well-seamed; these are the things that will bite as it keeps growing.
Ordered by leverage. Nothing here is urgent — it's a roadmap, not a fire.

Legend: **P0** = do before building much more · **P1** = worth doing soon ·
**P2** = nice to have / optional.

> **Status (2026-05-30):** P0 and the structural P1s are **done** — #1 PlanProvider,
> #2 dead code, #3 `dates.js`, #4 tests (Vitest, 32 passing), #5 `domain.js`,
> #6 README SQL. The remaining open items are all **P2 / optional** (#7–#10).
> Each completed section is marked ✅ below.

---

## P0 — Structural

### 1. Single source of truth for programs (`PlanProvider` context) — ✅ DONE
Implemented as `src/contexts/PlanContext.jsx` (mirrors `AuthContext`), mounted
once in `App.jsx` inside `AuthProvider`. `usePlan()` is now a zero-arg context
consumer; the old `src/hooks/usePlan.js` was removed. The 5 consumers no longer
fetch/seed independently.

**Problem.** `usePlan(userId)` is called independently in five places —
`TrainingSection`, `ProgramsSection`, `ProgressSection`, and `useToday` (which
both `NutritionSection` and `RecoverySection` use). Each call:
- fires its own Supabase fetch of `programs` on mount, and
- runs its own "seed defaults if empty" branch, and
- holds its own copy of state that can drift from the others.

So a normal app load triggers ~5 program fetches and up to 5 seed upserts, and
"the active program" is computed independently in each subtree.

**Fix.** Promote `usePlan` to a React **context provider** mounted once near the
app root (inside `AuthProvider`). Fetch/seed once; expose the same API via
`usePlan()` that reads from context. Components stop taking `userId` for plan
data.

**Files.** `src/hooks/usePlan.js` → split into `PlanProvider` + `usePlan()`
consumer; wrap in `src/App.jsx`; update the 5 consumers.
**Effort.** Medium. **Payoff.** High — correctness (one consistent state) +
fewer network calls.

### 2. Delete dead code — ✅ DONE
Removed all four stub hooks and the unused `training.js` exports
(`TOTAL_WEEKS`, `getPhaseForWeek`). Profile / photo-log / body-metrics intent is
tracked in the project roadmap (memory) rather than left as misleading stubs —
when profile persistence is built it gets a real, wired hook.

Unused stub hooks with no importers anywhere:
- `src/hooks/usePhotoLog.js`
- `src/hooks/useProfile.js`
- `src/hooks/useUserMetrics.js`
- `src/hooks/useSessionNotes.js` (was removed from `TrainingSection`)

Also unused now: `TOTAL_WEEKS` and `getPhaseForWeek` exported from
`src/data/training.js` (the live versions live in `src/utils/schedule.js`).

**Fix.** Remove them. If any represent a real future intent (photos, profile,
body metrics), track them as issues instead of leaving stubs that look wired.
**Effort.** Trivial. **Payoff.** Medium — a lean tree reads as intentional, not
"vibe-coded."

---

## P1 — Consistency & safety

### 3. Consolidate duplicated helpers/constants — ✅ DONE
`src/utils/dates.js` now owns `toLocalDate`, `weekdayIndex`, `DAY_TO_INDEX`,
`DAY_SHORT`; `schedule.js`, `useToday`, `TrainingSection`, and `equipment.js`
import from it. No more duplicated weekday math.

- `DAY_TO_INDEX` / `TODAY_INDEX` are defined in **both** `TrainingSection.jsx`
  and `useToday.js`.
- `toLocalDate` exists in **both** `schedule.js` and `equipment.js`.
- Weekday math (`(getDay()+6)%7`) is repeated.

**Fix.** One `src/utils/dates.js` (or extend `schedule.js`) exporting
`toLocalDate`, `weekdayIndex`, `DAY_TO_INDEX`, `TODAY_INDEX`, `DAY_SHORT`.
Import everywhere. **Effort.** Low. **Payoff.** Medium — one place to fix a
date bug.

### 4. Tests for the load-bearing pure logic — ✅ DONE
Vitest added (`npm test` / `npm run test:run`). `schedule.test.js` and
`coaching.test.js` cover `resolvePosition` (linear/repeating/clamp),
`resolveActiveProgram` (none/one/overlap), `readinessFrom` thresholds,
`matchPosition` offsets, and `suggestedRest` — 32 tests passing.

`schedule.js` (calendar → week/phase/day, active-program resolution, overlap
"latest start wins") and `coaching.js` (readiness scoring, match position,
suggested rest) are pure and **high-risk**: a subtle off-by-one in week math
silently shows the wrong day.

**Fix.** Add **Vitest** + a focused suite:
- `resolvePosition` for linear vs repeating, week boundaries, clamping.
- `resolveActiveProgram` with no/one/overlapping programs.
- `readinessFrom` thresholds + the "poor sleep caps at amber" rule.
- `matchPosition` offsets; `suggestedRest` by focus/reps.

**Files.** `src/utils/*.test.js`; add `"test": "vitest"` to `package.json`.
**Effort.** Low–medium. **Payoff.** High — these are exactly the functions you'll
keep editing.

### 5. Centralize the domain vocabulary — ✅ DONE
`src/data/domain.js` exports `FOCUS_TYPES`, `DEFAULT_FOCUS_COLORS`, and
`WEEKDAYS`; `ProgramEditor`, `programTemplate`, and `programGenerator` import
them instead of re-typing literals.

Focus types (`Strength/Power/Speed/Endurance/Recovery`), equipment types, and
day keys are string literals scattered across `coaching.js`, `equipment.js`,
`exerciseLibrary.js`, `ProgramEditor.jsx`, and `focusColors`. A typo
(`"Strenght"`) fails silently.

**Fix.** A small `src/data/constants.js` (or `domain.js`) exporting the
canonical lists; import them. **Effort.** Low. **Payoff.** Medium.

### 6. `workout_log` is assumed but undocumented — ✅ DONE
README now has the full `CREATE TABLE workout_log` + RLS + grant block alongside
the other tables.

The app reads/writes `workout_log` but the table isn't in the setup SQL (only
`programs` and `daily_checkin` are). A fresh environment would break.

**Fix.** Add its `CREATE TABLE` + RLS + grant to `README.md` (sketch already
noted there). **Effort.** Trivial.

---

## P2 — Polish / optional

### 7. Error handling is console-only
Supabase failures `console.error` and silently no-op (e.g. a failed save looks
like nothing happened). Fine for a personal app; if it ever has other users,
add lightweight UI error/toast states. **Effort.** Medium. **Payoff.** Low for
now.

### 8. Data-fetch breadth
`useWorkoutLog` and `useProgressData` each `select` **all** of a user's
`workout_log` rows. Trivial at current scale; if logs grow large, scope queries
by program/recent weeks. **Effort.** Low. **Payoff.** Low until data grows.

### 9. `index.css` is one ~1,100-line file
Works fine and is consistent, but splitting by area (base / training / plan /
nutrition / recovery / editor) would ease navigation. Purely organizational.
**Effort.** Low. **Payoff.** Low.

### 10. Types / contracts
No TypeScript or PropTypes. A full TS migration is **not** recommended for a
solo app (slows iteration), but JSDoc `@typedef`s for the core shapes
(`Program`, `Phase`, `Day`, `Exercise`, `Commitment`) would document the data
model and give editor autocomplete cheaply. **Effort.** Low–medium. **Payoff.**
Medium for future-you.

---

## Explicitly *not* worth doing now
- Full TypeScript migration.
- A state-management library (Redux/Zustand) — context covers it.
- Splitting into a backend/API layer — Supabase + RLS is the right amount.
- Component-library adoption — the bespoke CSS is cohesive and small.

## Suggested order if/when you act
1. ✅ **#2 dead code** (5 min, clears noise) →
2. ✅ **#3 helpers** + **#5 constants** (small, enables the rest) →
3. ✅ **#1 PlanProvider** (the real architectural win) →
4. ✅ **#4 tests** (lock it in) →
5. ✅ **#6 README SQL** — all done. P2 (#7–#10) remain, optional.

The natural next pick from P2 is **#10 JSDoc typedefs** for `Program` / `Phase` /
`Day` / `Exercise` — cheap documentation + editor autocomplete for the core data
model, now that the domain vocabulary lives in one place (`domain.js`).
