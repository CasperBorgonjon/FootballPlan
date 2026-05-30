import { describe, it, expect } from 'vitest';
import {
  readinessFrom, recommendation, matchPosition, matchDayIndexOf,
  suggestedRest, restLabel, suggestProgression,
} from './coaching';

describe('readinessFrom', () => {
  it('returns null without a usable check-in', () => {
    expect(readinessFrom(null)).toBeNull();
    expect(readinessFrom({ sleep_hours: '' })).toBeNull();
  });
  it('scores a strong day green', () => {
    expect(readinessFrom({ sleep_hours: 8, legs: 'fresh', energy: 'good' }))
      .toEqual({ level: 'green', total: 6 });
  });
  it('scores a middling day amber', () => {
    expect(readinessFrom({ sleep_hours: 7, legs: 'normal', energy: 'ok' }).level).toBe('amber');
  });
  it('scores a poor day red', () => {
    expect(readinessFrom({ sleep_hours: 5, legs: 'heavy', energy: 'low' }).level).toBe('red');
  });
  it('heavy legs can never read fully green', () => {
    // 2 (sleep) + 0 (heavy) + 2 (energy) = 4 → amber, not green.
    expect(readinessFrom({ sleep_hours: 8, legs: 'heavy', energy: 'good' }).level).toBe('amber');
  });
});

describe('recommendation', () => {
  it('greenlights progression off-season, but holds back in-season', () => {
    expect(recommendation('green', 'linear').text).toMatch(/progression/i);
    expect(recommendation('green', 'repeating').text).toMatch(/reps in reserve|failure/i);
  });
  it('adds a match-day note when a match is in play', () => {
    expect(recommendation('green', 'repeating', { phase: 'match' }).note).toMatch(/match day/i);
    expect(recommendation('amber', 'linear', { phase: 'taper' }).note).toMatch(/tomorrow/i);
  });
});

describe('matchPosition', () => {
  it('labels days relative to the match', () => {
    expect(matchPosition(4, 4)).toMatchObject({ phase: 'match' });
    expect(matchPosition(3, 4)).toMatchObject({ phase: 'taper' });   // MD-1
    expect(matchPosition(5, 4)).toMatchObject({ phase: 'recovery' }); // MD+1
    expect(matchPosition(2, 4)).toMatchObject({ phase: 'build' });    // MD-2
    expect(matchPosition(6, 4)).toMatchObject({ phase: 'normal' });   // MD+2
  });
  it('returns null when there is no match day', () => {
    expect(matchPosition(0, -1)).toBeNull();
    expect(matchPosition(0, null)).toBeNull();
  });
});

describe('matchDayIndexOf', () => {
  it('finds the day carrying a match commitment', () => {
    const days = [
      { commitments: [{ type: 'team' }] },
      {},
      { commitments: [{ type: 'match' }] },
    ];
    expect(matchDayIndexOf(days)).toBe(2);
  });
  it('returns -1 when no day has a match', () => {
    expect(matchDayIndexOf([{}, { commitments: [{ type: 'team' }] }])).toBe(-1);
  });
});

describe('suggestedRest', () => {
  it('gives full recovery to speed and power', () => {
    expect(suggestedRest('Speed', '5')).toBe(240);
    expect(suggestedRest('Power', '3')).toBe(180);
  });
  it('rests strength longer for low reps', () => {
    expect(suggestedRest('Strength', '5')).toBe(180);
    expect(suggestedRest('Strength', '10')).toBe(90);
  });
  it('keeps conditioning rest short', () => {
    expect(suggestedRest('Endurance', '12')).toBe(45);
  });
  it('defaults to 90s for anything else', () => {
    expect(suggestedRest('Recovery', '10')).toBe(90);
  });
});

describe('restLabel', () => {
  it('formats minutes at/over 2 min, seconds below', () => {
    expect(restLabel(240)).toBe('4 min');
    expect(restLabel(180)).toBe('3 min');
    expect(restLabel(90)).toBe('90s');
    expect(restLabel(45)).toBe('45s');
  });
});

describe('suggestProgression', () => {
  const last = { weight: '80', reps: '5' };

  it('adds load on a green day when reps were hit', () => {
    expect(suggestProgression(last, 'green', '5')).toMatchObject({ dir: 'up', weight: 82.5 });
  });
  it('treats no check-in like green', () => {
    expect(suggestProgression(last, null, '5').dir).toBe('up');
  });
  it('holds when last session missed reps', () => {
    expect(suggestProgression({ weight: '80', reps: '3' }, 'green', '5')).toMatchObject({ dir: 'hold', weight: 80 });
  });
  it('holds on amber and backs off on red', () => {
    expect(suggestProgression(last, 'amber', '5').dir).toBe('hold');
    expect(suggestProgression(last, 'red', '5')).toMatchObject({ dir: 'down', weight: 72.5 });
  });
  it('returns null for time/distance work or no history', () => {
    expect(suggestProgression({ weight: '0', reps: '30m' }, 'green', '30m')).toBeNull();
    expect(suggestProgression(null, 'green', '5')).toBeNull();
    expect(suggestProgression({ weight: '' }, 'green', '5')).toBeNull();
  });
});
