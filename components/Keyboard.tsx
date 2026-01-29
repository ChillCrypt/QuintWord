"use client";

import { LetterState } from "@/lib/game";
import { motion } from "framer-motion";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, LetterState>;
}

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export function Keyboard({ onKeyPress, letterStates }: KeyboardProps) {
  const getKeyColor = (key: string): string => {
    const state = letterStates[key];
    if (state === "correct") {
      return "bg-base-blue text-white";
    } else if (state === "present") {
      return "bg-white border-2 border-gray-400";
    } else if (state === "absent") {
      return "bg-gray-300 text-gray-500";
    }
    return "bg-white border-2 border-gray-300";
  };

  return (
    <div className="flex flex-col gap-2 items-center mt-8">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((key) => {
            const isSpecial = key === "ENTER" || key === "BACKSPACE";
            const width = isSpecial ? "w-20" : "w-10";
            const text = key === "BACKSPACE" ? "⌫" : key;

            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onKeyPress(key)}
                className={`${width} h-12 ${getKeyColor(key)} rounded-lg font-semibold text-sm flex items-center justify-center transition-colors`}
              >
                {text}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
