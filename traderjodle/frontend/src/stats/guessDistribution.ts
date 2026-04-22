export type WinBucketKey = '1' | '2' | '3' | '4' | '5' | '6';

export type GuessDistributionStats = {
  wins: Record<WinBucketKey, number>;
  failures: number;
  currentStreak: number;
  maxStreak: number;
};

const STORAGE_KEY = 'traderjodle-guess-distribution';

function defaultStats(): GuessDistributionStats {
  return {
    wins: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 },
    failures: 0,
    currentStreak: 0,
    maxStreak: 0,
  };
}

function readNonNegInt(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return null;
  return Math.floor(value);
}

export function totalWins(stats: GuessDistributionStats): number {
  return (Object.keys(stats.wins) as WinBucketKey[]).reduce((sum, k) => sum + stats.wins[k], 0);
}

export function gamesPlayed(stats: GuessDistributionStats): number {
  return totalWins(stats) + stats.failures;
}

/** Rounded whole percent; 0 if no games played. */
export function winPercent(stats: GuessDistributionStats): number {
  const n = gamesPlayed(stats);
  if (n === 0) return 0;
  return Math.round((totalWins(stats) / n) * 100);
}

export function loadDistribution(): GuessDistributionStats {
  if (typeof window === 'undefined') {
    return defaultStats();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStats();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return defaultStats();
    const obj = parsed as Record<string, unknown>;
    const wins = { ...defaultStats().wins };
    if (obj.wins && typeof obj.wins === 'object') {
      const w = obj.wins as Record<string, unknown>;
      for (const k of Object.keys(wins) as WinBucketKey[]) {
        const v = w[k];
        if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
          wins[k] = Math.floor(v);
        }
      }
    }
    let failures = 0;
    if (typeof obj.failures === 'number' && Number.isFinite(obj.failures) && obj.failures >= 0) {
      failures = Math.floor(obj.failures);
    }
    const currentStreak = readNonNegInt(obj.currentStreak) ?? 0;
    const parsedMax = readNonNegInt(obj.maxStreak) ?? 0;
    const maxStreak = Math.max(parsedMax, currentStreak);
    return { wins, failures, currentStreak, maxStreak };
  } catch {
    return defaultStats();
  }
}

function saveDistribution(data: GuessDistributionStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function recordWin(guessCount: number): GuessDistributionStats {
  const data = loadDistribution();
  const n = Math.min(6, Math.max(1, Math.round(guessCount)));
  const key = String(n) as WinBucketKey;
  data.wins[key] = (data.wins[key] ?? 0) + 1;
  const currentStreak = data.currentStreak + 1;
  const maxStreak = Math.max(data.maxStreak, currentStreak);
  const next: GuessDistributionStats = {
    wins: { ...data.wins },
    failures: data.failures,
    currentStreak,
    maxStreak,
  };
  saveDistribution(next);
  return next;
}

export function recordLoss(): GuessDistributionStats {
  const data = loadDistribution();
  const next: GuessDistributionStats = {
    wins: { ...data.wins },
    failures: data.failures + 1,
    currentStreak: 0,
    maxStreak: data.maxStreak,
  };
  saveDistribution(next);
  return next;
}
