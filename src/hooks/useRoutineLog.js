import { useState, useCallback } from 'react';
import { toISODate } from '../utils/schedule';

// Daily routine completion, tracked per user in localStorage only — these are
// lightweight habits that reset every day, so there's no need to sync them to
// the cloud (mirrors how useSession keeps the active-session timer local).
//
// Stored shape: { [`${routineId}:${stepIndex}`]: true } under a date-stamped
// key, so a new day starts with a clean slate automatically.

const keyFor = (userId, dateISO) => `fp_routines_${userId ?? 'anon'}_${dateISO}`;

function read(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function write(storageKey, value) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    /* quota / private mode — completion is non-critical */
  }
}

export function useRoutineLog(userId, date = new Date()) {
  const storageKey = keyFor(userId, toISODate(date));
  const [done, setDone] = useState(() => read(storageKey));

  const stepKey = (routineId, stepIndex) => `${routineId}:${stepIndex}`;

  const isStepDone = useCallback(
    (routineId, stepIndex) => !!done[stepKey(routineId, stepIndex)],
    [done]
  );

  const toggleStep = useCallback(
    (routineId, stepIndex) => {
      setDone((prev) => {
        const k = stepKey(routineId, stepIndex);
        const next = { ...prev };
        if (next[k]) delete next[k];
        else next[k] = true;
        write(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  // How many steps of a routine are checked off today.
  const completedCount = useCallback(
    (routineId, totalSteps) => {
      let n = 0;
      for (let i = 0; i < totalSteps; i++) if (done[stepKey(routineId, i)]) n++;
      return n;
    },
    [done]
  );

  // Clear one routine's checks (e.g. to run it again).
  const resetRoutine = useCallback(
    (routineId, totalSteps) => {
      setDone((prev) => {
        const next = { ...prev };
        for (let i = 0; i < totalSteps; i++) delete next[stepKey(routineId, i)];
        write(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  return { isStepDone, toggleStep, completedCount, resetRoutine };
}
