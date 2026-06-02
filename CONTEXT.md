# CONTEXT

The domain language and structure of FootballPlanApp. Read this before naming concepts
in issues, refactors, hypotheses, or tests — use the terms below as defined, don't drift
to synonyms.

This is a personal football (soccer) strength & conditioning planner: a single-user-per-account
React SPA that turns a periodised training plan into "what do I do today", lets the athlete log
their work, and auto-regulates load against a daily readiness check-in. One athlete is both the
coach's voice and the user.

## Ubiquitous language

### Plan structure (static + per-user data)

- **Program** — a complete training block the athlete follows. Shape:
  `{ id, name, type, color, start_date, end_date, structure: { phases, coachNotes, focusColors } }`.
  Programs live in Supabase (`programs` table); the static **seed programs** in `src/data/seeds.js`
  (`buildup`, `inseason`) are inserted as **drafts** on a user's first load and become editable copies.
- **Program type** — `'linear'` or `'repeating'`. A **linear** program (e.g. the pre-season build-up)
  has a fixed length derived from its phases and ends. A **repeating** program (e.g. in-season
  maintenance) is one weekly rhythm that repeats for the scheduled span; it has no intrinsic length.
- **Phase** — a contiguous block of weeks within a program, e.g. base / strength / speed. Shape includes
  `{ name, label, weeks: { start, end }, color, days }`. A program is an ordered list of phases.
- **Day** — one weekday inside a phase: `{ day, label, focus, coachNote, exercises, commitments? }`.
  `day` is a weekday string from `WEEKDAYS` (`MON`…`SUN`, Monday-first).
- **Exercise** — one logged movement: `{ id, name, sets, reps, note }`. The `id` is **stable** and
  load-bearing (see Log key) — never derive it from list position.
- **Commitment** — a fixed, externally-imposed event on a day (`type: 'team' | 'match'`), e.g. team
  training or a match. Commitments are informational and explain why the athlete's own volume drops that
  day. They are **not** logged like exercises.
- **Focus** — the training quality a day targets. Controlled vocabulary in `src/data/domain.js`
  (`FOCUS_TYPES`): `Strength`, `Power`, `Speed`, `Endurance`, `Recovery`. Each maps to a color
  (`DEFAULT_FOCUS_COLORS`), overridable per program via `structure.focusColors`. Import these constants —
  a typo'd focus is a missing-reference error, not a silently uncolored day.
- **Coach note** — short prose guidance attached to a program (`coachNotes`) or a day (`coachNote`).

### Scheduling & positioning (calendar-driven)

- **Scheduling** a program sets its `start_date`; `end_date` is derived from its length (repeating
  programs default to a 30-week season). An unscheduled program has null dates and is a **draft**.
- **Active / scheduled program** — the program whose date range covers today. If several overlap, the
  most recently started one wins. `resolveActiveProgram` in `src/utils/schedule.js`.
- **Display program** — what the UI renders: the scheduled program, else the `buildup` draft, so a new
  user always sees something to start.
- **Position** — where today lands inside a scheduled program: `{ week, phaseIndex, dayIndex }`, derived
  purely from `start_date`. **There is no stored week counter** — week is always computed from the date.
  (Note: `CLAUDE.md` still describes an older `useWeekTracker` / `w{week}_p{phase}_d{day}_e{exIndex}`
  model; the calendar-driven `PlanContext` replaced it. Trust the code.)

### Logging & progression

- **Workout log** — per-user record of what was actually done, one entry per exercise per week:
  `{ done, weight, reps }`. Stored in Supabase `workout_log`, mirrored to localStorage, and
  **offline-safe**: edits queue locally and flush when back online.
- **Log key** — the entry's identity: `` `${programId}_w${week}_${exerciseId}` `` (`src/utils/logKey.js`).
  Keyed by stable exercise id, not position, so programs can be reordered/edited without orphaning logged
  weights. Format is load-bearing — don't change it.
- **Readiness / daily check-in** — the athlete's self-report for a day: `{ sleep_hours, legs, energy, note }`
  (`legs`: fresh/normal/heavy, `energy`: good/ok/low). Stored in `daily_checkin`, one row per user per day.
  Scored into a **readiness level** — `green` / `amber` / `red` (`readinessFrom` in `src/utils/coaching.js`).
  Poor sleep or heavy legs hard-caps the level below green.
- **Auto-regulation** — adjusting today's work to readiness: green → push/progress, amber → trim a set,
  red → back off. `recommendation()` and `suggestProgression()` in `coaching.js`.
- **Progression** — the suggested next working weight from the last logged set + today's readiness:
  up (+2.5kg, only if reps were hit), hold, or down (~10% on red). Non-weighted work (sprints, planks,
  time/distance) has no progression.
- **Match position** — a day's relation to the week's match, expressed as **MD±n**: `MD-1 · Taper`,
  `Match day`, `MD+1 · Recovery`, etc. (`matchPosition` in `coaching.js`). Drives taper/recovery notes.
- **Session** — an in-progress workout timer for the current day, tracked in localStorage only
  (`useSession`, key `w{week}_p{phase}_d{day}`). Not persisted to the cloud.
- **1RM** — one-rep max, estimated via Epley/Brzycki (`src/utils/oneRepMax.js`); used to render
  percentage tables for working loads.

## App surface

Seven top-level **sections** (no router; `activeId` state in `App.jsx`), each a tab:
`training`, `plan`, `guide`, `progress`, `food` (Nutrition), `recovery`, `routines`. Sections marked
`needsUser` require auth. Mobile uses a fixed bottom nav; desktop a top nav.

- **Routine** — a short, repeatable daily habit *around* the plan (morning mobility, pre-training
  warm-up, prehab circuit, post-session flush, evening wind-down). Defined statically in
  `src/data/routines.js` as ordered **steps** `{ name, detail, time }`. Per-user daily completion is
  tracked in localStorage only (`useRoutineLog`, date-stamped key — resets each day), never cloud-synced.

## Architecture

- **React 19 + Vite SPA**, deployed to GitHub Pages under `/FootballPlan/`. No test suite for the app;
  pure utils have Vitest tests (`*.test.js` in `src/utils/`).
- **Auth** — Supabase, via `src/contexts/AuthContext.jsx` (`useAuth() → { user, loading }`).
  All content is gated behind a session; `LoginPage` otherwise.
- **Plan state** — `src/contexts/PlanContext.jsx` is the single source of truth for plan access and
  calendar positioning. Mounted once near the root; consumers read via `usePlan()`. It owns fetch/seed
  of programs and all program CRUD (create/update/delete/schedule/reset).
- **Pure domain logic** lives in `src/utils/` (`schedule`, `coaching`, `oneRepMax`, `plates`,
  `programGenerator`, `dates`) — no React, no IO, testable in isolation. Controlled vocabulary in
  `src/data/domain.js`. Prefer adding logic here over inside components.
- **Hooks** wrap Supabase tables: `useWorkoutLog`, `useReadiness`, plus `useLocalStorage` for theme.

### Supabase tables

| Table           | Grain                | Key columns                                         |
|-----------------|----------------------|-----------------------------------------------------|
| `programs`      | one row per program  | `user_id`, `id`, `type`, `start_date`, `end_date`, `structure`, `sort_order` |
| `workout_log`   | one row per log key   | `user_id`, `log_key`, `done`, `weight`, `reps`     |
| `daily_checkin` | one row per user/day  | `user_id`, `date`, `sleep_hours`, `legs`, `energy`, `note` |

## Terms to avoid / keep straight

- Don't say "week counter" or "current week setting" — week is **derived from the date**, never stored.
- "Program" ≠ "Phase" ≠ "Day". A program contains phases; a phase contains days; a day contains exercises.
- "Commitment" (team training / match) is not an "exercise" and is never logged.
- "Draft" = scheduled-but-not, i.e. null `start_date`. Don't call an unscheduled program "inactive".
- Static `src/data/*` (training, nutrition, recovery, guide) is the **same for all users** — editing it
  changes everyone's plan. Per-user state lives only in Supabase tables.
