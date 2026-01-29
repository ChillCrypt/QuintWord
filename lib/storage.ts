export interface GameStats {
  bestTime: number | null;
  totalGames: number;
  totalAttempts: number;
  averageAttempts: number;
}

const STORAGE_PREFIX = "base_wordle_";

export function getStorageKey(address: string): string {
  return `${STORAGE_PREFIX}${address.toLowerCase()}`;
}

export function getStats(address: string): GameStats {
  if (typeof window === "undefined") {
    return {
      bestTime: null,
      totalGames: 0,
      totalAttempts: 0,
      averageAttempts: 0,
    };
  }

  const key = getStorageKey(address);
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    return {
      bestTime: null,
      totalGames: 0,
      totalAttempts: 0,
      averageAttempts: 0,
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      bestTime: null,
      totalGames: 0,
      totalAttempts: 0,
      averageAttempts: 0,
    };
  }
}

export function saveStats(address: string, stats: GameStats): void {
  if (typeof window === "undefined") return;
  
  const key = getStorageKey(address);
  localStorage.setItem(key, JSON.stringify(stats));
}

export function updateStats(
  address: string,
  time: number,
  attempts: number
): GameStats {
  const current = getStats(address);
  const newStats: GameStats = {
    bestTime:
      current.bestTime === null || time < current.bestTime
        ? time
        : current.bestTime,
    totalGames: current.totalGames + 1,
    totalAttempts: current.totalAttempts + attempts,
    averageAttempts:
      (current.totalAttempts + attempts) / (current.totalGames + 1),
  };

  saveStats(address, newStats);
  return newStats;
}
