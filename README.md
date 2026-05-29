# Plan — Training Console

A personal training app for a footballer (fullback): build or pick a training program, follow it day-by-day, log your work, and have the app **auto-regulate** around your real week — your sleep, how your legs feel, where the match is, and what equipment you have that day. Nutrition and recovery guidance adapt to the same daily context.

Built with React 19 + Vite, data synced to Supabase, installable as a phone app (PWA).

---

## The daily loop

> **Pick a plan (preset or your own) → schedule it → the app tells you what to do today, adjusted to how you feel → log it → watch your progress.**

Everything is driven by the **calendar**: each program has a start date, and the app works out which week/day you're on automatically. You never advance weeks by hand.

---

## Pages

The app has five sections (top tabs on desktop, bottom bar on mobile).

### ⚽ Training — *what to do today*

Your home base. Shows today's session for whatever program is currently scheduled.

- **Status bar** — the active program, current week (e.g. `Week 04 / 10`) and phase. If nothing is scheduled yet, a **Start plan** button schedules the build-up from today.
- **Today's readiness** *(auto-regulation)* — log **sleep hours**, **legs** (fresh/normal/heavy) and **energy** (good/ok/low). The app turns it into a green / amber / red signal and a recommendation:
  - **Green** → train as planned (push for progression, or explosive intent in-season).
  - **Amber** → "trim it — drop a set, keep the intensity."
  - **Red** → back off / keep it light. In-season it reminds you: *never rob the match for a maintenance lift.*
  - Before a match it nudges you to protect the **two nights of sleep** beforehand.
- **Phase tabs** — for build-up-style programs, jump between phases to preview them (a banner reminds you when you're previewing, not on your current week). Hidden for repeating in-season programs.
- **Week rail** — the 7 days, color-dotted by focus, with **Today** marked and ✓ on completed days. Tap a day to view it.
- **Day panel** — the session: focus, title, exercise count and estimated time, plus a **match-week tag** in-season (`MD-1 · Taper`, `Match day`, `MD+1 · Recovery`).
  - **Start session / End** — times your session; auto-stops when every exercise is done.
  - **Timer** — opens a rest timer **pre-set to the day's goal** (heavy strength ≈ 3 min, power 3 min, speed 4 min, conditioning 45 s).
  - **Commitments** — team training / match shown as fixed events.
  - **Exercise rows** — each shows sets×reps, a **suggested rest**, and a **Log** button for weight + reps. Tick the checkbox when done. On **portable-kit days** (weekdays outside the winter break), barbell lifts show a **swap suggestion** (e.g. *No barbell today → goblet / Bulgarian split squat*).
- **Reset plan** — unschedules the program (your logged weights are kept).

### 🗓 Plan — *manage and build programs*

Where you choose, schedule, and edit programs.

- **Program cards** — each shows type (Linear / Repeating), structure, and live status: **Active now / Scheduled / Ended / Not scheduled**.
- **Schedule** — pick a **start date** and hit Schedule; the end date is worked out from the program's length. **Reschedule** or **Unschedule** anytime. If two programs overlap, the most recently started one wins.
- **+ New program** — build one from scratch.
- **Edit / Duplicate / Delete** — open the editor, clone a program as a new draft, or remove one.

**The editor** lets you build a program entirely in-app:
- Program **name**, **type** (Linear = weeks progress through phases; Repeating = one weekly cycle all season), and **color**.
- **Phases** (linear) — add/remove/rename, set each phase's **week range**.
- **Days** — add/remove, pick the **weekday**, set the **label** and **focus** (Strength / Power / Speed / Endurance / Recovery).
- **Exercises** — **+ From library** opens a searchable, filterable menu of ~70 fullback exercises (by muscle group, type, equipment) you can drop in with one tap; **+ Blank** for custom entries. Edit name / sets / reps / note, reorder with ↑ ↓, remove with ✕.
- **Commitments** — add team-training or match events with times.
- **Save** writes back to the cloud. Existing exercises keep their IDs, so **logged weights survive edits and reordering**.

### 📈 Progress — *what your logging adds up to*

Turns the data you log into feedback (read-only).

- **Stat cards** — lifts logged, exercises completed, average sleep, total check-ins.
- **Lift progression** — every exercise you've logged a weight on, with a **sparkline over weeks**, your **best**, and the **change** since you started. Grouped by name, so a lift stays one line across phases.
- **Readiness** — how many days were good / moderate / low, plus a colored strip of your recent check-ins.
- **Program selector** — switch which program's lifts you're viewing.

### 🥗 Nutrition — *fuel for today*

Reference fuelling that adapts to today's session.

- **Today banner** — auto-selects **training-day vs rest-day** fuel based on whether today is a real session, and explains why (e.g. *"Strength session today — training-day fuel"*, *"Match day — fuel up, hydrate"*). You can still toggle manually.
- **Macro targets** for the selected day type.
- **Meal categories** (breakfast, pre/post-session, lunch/dinner, snacks…) with food options, plus sample-day timing and core principles.

### 🔋 Recovery — *the right lever today*

Sleep, body care, prehab, mental, tracking and supplement guidance — with a contextual nudge on top.

- **Today banner** points you to the most relevant tab and message, with a button to jump there:
  - **Day before a match** → protect sleep (the two nights before).
  - **Match day / day after** → fuel & warm up / flush the legs.
  - **Deload week** → cut volume, keep intensity.
  - **Low readiness** (from your check-in) → prioritise sleep, back off.
  - **Training day** → don't skip Nordics, Copenhagens, calves.
- **Tabs** — Sleep, Body Care, Prehab, Mental, Tracking, Supps — evidence-based reference cards.

---

## Preset programs

Two come seeded on first login (both editable):

- **Pre-Season Build-Up** — *linear*, 3 phases over 10 weeks (Base → Strength/Speed → Peak).
- **In-Season Maintenance** — *repeating* weekly cycle built around **team training Tue/Thu** and a **Friday match**: one real strength day, a power/upper day, recovery and rest, with maintenance volume.

---

## Setup

Requires Node and a Supabase project.

```bash
npm install
npm run dev        # dev server (http://localhost:5173/FootballPlan/)
npm run build      # production build → dist/
npm run preview    # preview the production build (service worker active)
npm run lint       # ESLint
npm run deploy     # build + publish to the gh-pages branch
```

Create `.env.local`:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase tables

Run in the Supabase SQL editor (grants are required so the API roles can see the tables):

```sql
-- Programs (one tree per program, per user)
create table programs (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null,
  type text not null check (type in ('linear','repeating')),
  start_date date, end_date date, color text, sort_order int default 0,
  structure jsonb not null,
  created_at timestamptz default now(), updated_at timestamptz default now(),
  primary key (user_id, id)
);
alter table programs enable row level security;
create policy "own programs" on programs for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.programs to authenticated;

-- Daily readiness check-ins
create table daily_checkin (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  sleep_hours numeric, legs text, energy text, note text,
  updated_at timestamptz default now(),
  primary key (user_id, date)
);
alter table daily_checkin enable row level security;
create policy "own checkins" on daily_checkin for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.daily_checkin to authenticated;
```

```sql
-- Test results + bodyweight (Progress → Tests & bodyweight)
create table metrics (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  metric text not null,
  value numeric not null,
  updated_at timestamptz default now(),
  primary key (user_id, date, metric)
);
alter table metrics enable row level security;
create policy "own metrics" on metrics for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.metrics to authenticated;
```

The app also uses a `workout_log` table (weights/reps/done, keyed `{programId}_w{week}_{exerciseId}`). If it doesn't exist yet, create one with `(user_id uuid, log_key text, done bool, weight text, reps text, updated_at timestamptz, primary key (user_id, log_key))`, RLS + the same grant. Logging is offline-safe: edits are cached in `localStorage` and synced when back online.

### Install as a phone app

Build and serve (`npm run build` then `npm run preview`, or deploy), then on your phone open the URL and use **Add to Home Screen** (iOS Safari) or **Install app** (Android Chrome). It launches fullscreen; the app shell works offline, and your data syncs when you're back online.

---

## How it works (for editing)

- **`src/data/`** — `seeds.js` (default programs), `exerciseLibrary.js` (the picker menu), `nutrition.js`, `recovery.js`, `equipment.js` (barbell swaps + winter-break dates).
- **`src/utils/`** — `schedule.js` (calendar math), `coaching.js` (readiness, match position, rest), `logKey.js`.
- **`src/hooks/`** — `usePlan` (programs + scheduling + CRUD), `useWorkoutLog`, `useReadiness`, `useProgressData`, `useToday`.
- Programs live in Supabase, so editing in-app is the source of truth; the files under `src/data/` are just the starting seeds.

To export the current plan for offline tweaking, see `plan-export.json` in the project root.
