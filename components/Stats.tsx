"use client";

import { GameStats } from "@/lib/storage";

interface StatsProps {
  stats: GameStats;
  currentTime: number;
}

export function Stats({ stats, currentTime }: StatsProps) {
  const formatTime = (ms: number | null): string => {
    if (ms === null) return "—";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-center">Статистика</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Лучшее время:</span>
          <span className="font-bold text-base-blue">{formatTime(stats.bestTime)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Всего игр:</span>
          <span className="font-bold">{stats.totalGames}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Среднее попыток:</span>
          <span className="font-bold">
            {stats.totalGames > 0
              ? stats.averageAttempts.toFixed(1)
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
