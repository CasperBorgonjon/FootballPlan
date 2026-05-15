import { useEffect, useState } from 'react';

const STORAGE_KEY = 'fp_active_session';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStored(value) {
  if (value == null) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function sessionKey(week, phase, day) {
  return `w${week}_p${phase}_d${day}`;
}

export function useSession(week, phase, day) {
  const [session, setSession] = useState(readStored);
  const [now, setNow] = useState(() => Date.now());

  const key = week != null ? sessionKey(week, phase, day) : null;
  const active = session && session.key === key;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  function start() {
    if (!key) return;
    const next = { key, startedAt: Date.now() };
    setSession(next);
    writeStored(next);
  }

  function stop() {
    setSession(null);
    writeStored(null);
  }

  const elapsedSec = active ? Math.floor((now - session.startedAt) / 1000) : 0;

  return { active, elapsedSec, start, stop, startedAt: active ? session.startedAt : null };
}

export function formatElapsed(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
