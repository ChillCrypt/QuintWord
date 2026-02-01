"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { GameBoard } from "@/components/GameBoard";
import { Stats } from "@/components/Stats";
import { getStats, updateStats } from "@/lib/storage";
import { GameMode } from "@/lib/words";
import { motion } from "framer-motion";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [stats, setStats] = useState(getStats(address || ""));
  const [gameKey, setGameKey] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>("lite");

  useEffect(() => {
    if (address) {
      setStats(getStats(address));
    }
  }, [address]);

  const handleGameEnd = (time: number, attempts: number) => {
    if (address) {
      const newStats = updateStats(address, time, attempts);
      setStats(newStats);
    }
  };

  const handleNewGame = () => {
    setGameKey((prev) => prev + 1);
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    handleNewGame();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-base-blue to-purple-600 bg-clip-text text-transparent">
            Base Wordle
          </h1>
          <p className="text-xl text-gray-600">
            Игра-головоломка со словами на блокчейне Base
          </p>
          <div className="mt-8">
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, mounted }) => {
                return (
                  <div
                    {...(!mounted && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!mounted || !account || !chain) {
                        return (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openConnectModal}
                            className="bg-gradient-to-r from-base-blue to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
                          >
                            Connect Wallet
                          </motion.button>
                        );
                      }
                      return null;
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
          <div className="mt-12 max-w-2xl text-left space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-center mb-4">Как играть:</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Угадайте слово из 5 букв за 6 попыток</li>
              <li>
                <span className="bg-base-blue text-white px-2 py-1 rounded">Синий</span> — буква на правильном месте
              </li>
              <li>
                <span className="bg-white border-2 border-gray-400 px-2 py-1 rounded">Белый</span> — буква есть в слове, но на другом месте
              </li>
              <li>
                <span className="bg-gray-300 px-2 py-1 rounded">Серый</span> — буквы нет в слове
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-base-blue to-purple-600 bg-clip-text text-transparent">
            Base Wordle
          </h1>
          <div className="flex gap-4 items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewGame}
              className="bg-white border-2 border-base-blue text-base-blue px-4 py-2 rounded-lg font-semibold hover:bg-base-blue hover:text-white transition-colors"
            >
              Новая игра
            </motion.button>
            <ConnectButton />
          </div>
        </motion.div>

        <div className="mb-6 flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange("lite")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              gameMode === "lite"
                ? "bg-base-blue text-white"
                : "bg-white border-2 border-base-blue text-base-blue hover:bg-base-blue hover:text-white"
            }`}
          >
            Lite
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange("hard")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              gameMode === "hard"
                ? "bg-base-blue text-white"
                : "bg-white border-2 border-base-blue text-base-blue hover:bg-base-blue hover:text-white"
            }`}
          >
            Hard
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GameBoard key={gameKey} walletAddress={address || ""} gameMode={gameMode} onGameEnd={handleGameEnd} />
          </div>
          <div>
            <Stats stats={stats} currentTime={0} />
          </div>
        </div>
      </div>
    </div>
  );
}
