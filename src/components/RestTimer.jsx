import { useState, useEffect, useRef } from 'react';

const PRESETS = [30, 60, 90, 120, 180];

export default function RestTimer({ onClose }) {
  const [selected, setSelected] = useState(90);
  const [timeLeft, setTimeLeft] = useState(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, timeLeft]);

  function start() {
    setTimeLeft(selected);
    setRunning(true);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(null);
  }

  const display = timeLeft != null ? timeLeft : selected;
  const mins = String(Math.floor(display / 60)).padStart(2, '0');
  const secs = String(display % 60).padStart(2, '0');
  const progress = timeLeft != null ? timeLeft / selected : 1;
  const isDone = timeLeft === 0;

  const circumference = 2 * Math.PI * 54;

  return (
    <div className="timer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="timer-modal">
        <div className="timer-header">
          <span className="timer-title">REST TIMER</span>
          <button className="timer-close" onClick={onClose}>✕</button>
        </div>

        {/* Circular progress */}
        <div className="timer-circle-wrap">
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-row)" strokeWidth="6" />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={isDone ? '#F87171' : '#5BF0A5'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s' }}
            />
          </svg>
          <div className="timer-time" style={{ color: isDone ? '#F87171' : 'var(--text)' }}>
            {isDone ? 'GO!' : `${mins}:${secs}`}
          </div>
        </div>

        {/* Presets */}
        {!running && timeLeft == null && (
          <div className="timer-presets">
            {PRESETS.map((s) => (
              <button
                key={s}
                className="timer-preset-btn"
                onClick={() => setSelected(s)}
                style={{
                  background: selected === s ? '#5BF0A5' : 'var(--bg-row)',
                  color: selected === s ? '#000' : 'var(--text-sub)',
                }}
              >
                {s < 60 ? `${s}s` : `${s / 60}m`}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="timer-controls">
          {!running && timeLeft == null && (
            <button className="timer-btn timer-btn--start" onClick={start}>START</button>
          )}
          {running && (
            <button className="timer-btn timer-btn--reset" onClick={reset}>RESET</button>
          )}
          {!running && timeLeft != null && (
            <>
              <button className="timer-btn timer-btn--start" onClick={start}>RESTART</button>
              <button className="timer-btn timer-btn--reset" onClick={reset}>CHANGE</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
