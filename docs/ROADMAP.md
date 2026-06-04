# Roadmap — what to build next

A forward-looking map for FootballPlanApp. Written because "what should I add?" is hard
to answer from inside the code. This groups ideas by theme, says what already exists so you
don't rebuild it, and ends with a prioritised shortlist.

Guiding principle (from how the app has landed so far): **turn knowledge into action.**
Standalone reference text scores low. Every new feature should *do* something with the data
the app already has — a suggestion, an automation, an inline tip — not just display more of it.

---

## Where the app is today

The daily loop is already complete and surprisingly deep:

- **Train** — today's day auto-resolved from the calendar, readiness check-in with
  auto-regulation (green/amber/red → push/trim/back off), per-exercise logging, "last time"
  recall, progression suggestions (`→ Xkg`), PR badges, match-position tapering (MD±n),
  equipment-aware swaps, rest timer, plate calculator, session timer.
- **Plan** — program CRUD, the Program Generator wizard, the Program Editor, scheduling,
  seed programs (buildup / in-season), and the Guide.
- **Fuel** — static nutrition content.
- **Body** — static recovery content + five checkable daily Routines (localStorage, resets daily).
- **Progress** — lift progression sparklines, readiness history strip, summary stats, metrics panel.

So the foundation — plan → today → log → auto-regulate → review — is built. What's missing is
mostly **focus, closing the loop, and depth in the thin areas (Fuel, Body, sharing).**

---

## Theme 1 — Close the training loop

The pieces exist but the athlete still has to assemble them. Make the app drive the session.

- **Workout Mode** *(still the highest-leverage unbuilt feature)*. A focused, full-screen,
  exercise-by-exercise flow for use *during* training: one movement at a time, last time's
  weight/reps front and centre, the progression suggestion pre-filled, the rest timer auto-starting
  between sets, swipe/▸ to advance, log inline. Today everything's there but spread across a dense
  list — this turns it into a guided session. Builds on `RestTimer`, `useSession`,
  `suggestProgression`, `useWorkoutLog`.
- **Accept-the-suggestion in one tap.** The app already computes `→ Xkg`. Let the athlete tap it
  to fill the weight field instead of retyping. Tiny change, removes friction from every set.
- **Set-by-set logging.** Today it's one weight/reps per exercise. Real sessions vary
  (e.g. 60×5, 65×5, 70×3). Optional per-set rows would make progression and 1RM estimates honest.
- **End-of-session summary.** When a day completes, show what changed: PRs hit, total tonnage,
  how the session compared to last week, readiness vs. outcome. Closes the loop emotionally.

## Theme 2 — Make progression proactive, not just reactive

`suggestProgression` reacts to the last set. Push it toward planning ahead.

- **Deload / fatigue detection.** Watch readiness trend + missed-rep frequency and proactively
  suggest a deload week, rather than only backing off on a red day.
- **Weekly preview.** "This week vs. last week" — what loads to expect, where you're due to
  progress. Turns the plan into a heads-up instead of a surprise each day.
- **Auto-progression across weeks.** Pre-seed next week's target weights from this week's results
  + phase rep scheme, shown as a target the athlete confirms or overrides.

## Theme 3 — Fill out the thin sections (Fuel & Body)

Both are static today. Per the action-over-reference principle, make them *respond to the plan.*

- **Fuel that reacts to the day.** Heavy strength day vs. recovery day vs. match day should change
  the fueling guidance and rough calorie/protein target. Match-day +N hours pre/post timing.
  Even a simple "today is a hard day → eat like this" beats a static macro page.
- **Body that reacts to readiness.** Routines already suggest based on `useToday` + readiness —
  extend that: red readiness or heavy legs → surface the recovery flush / mobility routine on the
  Train screen, not just under Body.
- **Hydration / sleep nudge.** You already collect sleep in the check-in. Close that loop with a
  target and a streak, instead of only charting it after the fact.

## Theme 4 — Motivation & retention

A personal app lives or dies on whether you open it tomorrow.

- **Streaks & consistency.** Sessions completed, check-ins logged, routines done — lightweight,
  already-tracked data, no new tables.
- **Milestones / PR celebration.** The PR badge exists in-line; make hitting one a moment
  (toast, history of PRs on Progress).
- **"Today" home hub.** A single landing card: today's focus, readiness prompt if not filled,
  next session CTA, one nudge. Right now the app opens straight into the Training list.

## Theme 5 — Depth in Progress

- **Per-exercise drill-down.** Tap a lift → full history, est. 1RM trend (you have `oneRepMax.js`),
  rep PRs, volume over time.
- **Readiness vs. performance correlation.** "You lift heaviest after 8h+ sleep" — turns the
  check-in data into an insight that justifies filling it in.
- **Phase / block review.** When a program ends, a recap: total volume, biggest gains, adherence.

## Theme 6 — Platform & polish

- **PWA / installable + offline.** The log is already offline-safe; making it an installable PWA
  with an icon and offline shell would make it feel like a real training app on the phone.
- **Notifications / reminders.** Local reminder to check in or train (needs PWA first).
- **Calendar export.** Push scheduled sessions / match days to Google Calendar.
- **Sharing / coach view (bigger).** Read-only share of a program or a week. The data model is
  currently single-user-per-account — this is the one idea that touches the schema, so scope it
  deliberately if you go there.

---

## Suggested order

Ranked by leverage (impact ÷ effort), action-first:

1. **Accept-the-suggestion in one tap** — trivial, removes friction from every set. Do it first.
2. **Workout Mode** — the marquee feature; makes the in-session experience real.
3. **End-of-session summary** — closes the loop, cheap once Workout Mode exists.
4. **"Today" home hub** — reframes the whole app around the daily action.
5. **Fuel reacts to the day** — biggest upgrade to the weakest section.
6. **Streaks + PR history** — retention, all from existing data.
7. **Deload detection / weekly preview** — proactive coaching, the next depth step.

Later / bigger bets: per-exercise drill-down, PWA + notifications, coach-view sharing.

---

## How to use this doc

When you're unsure what to build, pick the top unbuilt item from "Suggested order" that still
sounds exciting. Cross things off as they ship and re-rank — the list is meant to be edited.
Keep the bar: does it turn data the app already has into an action? If not, it's probably a
reference page, and those underperform here.
