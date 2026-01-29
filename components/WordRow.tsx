"use client";

import { LetterGuess } from "@/lib/game";
import { motion } from "framer-motion";

interface WordRowProps {
  guess?: LetterGuess[];
  currentWord?: string;
  isActive?: boolean;
}

export function WordRow({ guess, currentWord, isActive = false }: WordRowProps) {
  const letters = guess || [];
  const displayWord = currentWord || "";

  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2, 3, 4].map((index) => {
        const letter = letters[index]?.letter || displayWord[index] || "";
        const state = letters[index]?.state;

        let bgColor = "bg-white border-2 border-gray-300";
        if (state === "correct") {
          bgColor = "bg-base-blue text-white border-2 border-base-blue";
        } else if (state === "present") {
          bgColor = "bg-white border-2 border-gray-400";
        } else if (state === "absent") {
          bgColor = "bg-gray-300 text-gray-500 border-2 border-gray-300";
        }

        return (
          <motion.div
            key={index}
            initial={isActive ? { scale: 0.8 } : false}
            animate={isActive ? { scale: 1 } : false}
            className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg ${bgColor} ${
              isActive && letter ? "ring-2 ring-base-blue" : ""
            }`}
          >
            {letter}
          </motion.div>
        );
      })}
    </div>
  );
}
