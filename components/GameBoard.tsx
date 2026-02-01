"use client";

import { useState, useEffect, useCallback } from "react";
import { WordRow } from "./WordRow";
import { Keyboard } from "./Keyboard";
import { evaluateGuess, Guess, LetterState } from "@/lib/game";
import { getRandomWord, isValidWord, GameMode } from "@/lib/words";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface GameBoardProps {
  walletAddress: string;
  gameMode: GameMode;
  onGameEnd: (time: number, attempts: number) => void;
}

export function GameBoard({ walletAddress, gameMode, onGameEnd }: GameBoardProps) {
  const [targetWord, setTargetWord] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});

  useEffect(() => {
    const word = getRandomWord(gameMode);
    setTargetWord(word);
    setStartTime(Date.now());
  }, [gameMode]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, gameState]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState !== "playing") return;

      if (key === "ENTER") {
        if (currentGuess.length === 5 && isValidWord(currentGuess, gameMode)) {
          const evaluation = evaluateGuess(currentGuess, targetWord);
          const newGuess: Guess = {
            word: currentGuess,
            letters: evaluation,
          };

          const newGuesses = [...guesses, newGuess];
          setGuesses(newGuesses);

          // Обновляем состояния букв для клавиатуры
          const newLetterStates = { ...letterStates };
          evaluation.forEach(({ letter, state }) => {
            const currentState = newLetterStates[letter];
            if (!currentState || state === "correct") {
              newLetterStates[letter] = state;
            } else if (currentState === "absent" && state === "present") {
              newLetterStates[letter] = state;
            }
          });
          setLetterStates(newLetterStates);

          if (currentGuess === targetWord) {
            setGameState("won");
            const time = Date.now() - startTime;
            onGameEnd(time, newGuesses.length);
            // Эффект конфетти
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } else if (newGuesses.length >= 6) {
            setGameState("lost");
            const time = Date.now() - startTime;
            onGameEnd(time, newGuesses.length);
          }

          setCurrentGuess("");
        }
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, targetWord, guesses, gameState, startTime, letterStates, onGameEnd, gameMode]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleKeyPress("ENTER");
      } else if (e.key === "Backspace") {
        handleKeyPress("BACKSPACE");
      } else if (e.key.length === 1 && /[A-Za-z]/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-lg font-semibold">
        Время: {formatTime(elapsedTime)}
      </div>

      <div className="flex flex-col gap-2">
        {guesses.map((guess, index) => (
          <WordRow key={index} guess={guess.letters} />
        ))}
        {gameState === "playing" && (
          <WordRow currentWord={currentGuess} isActive={true} />
        )}
        {Array.from({ length: 6 - guesses.length - (gameState === "playing" ? 1 : 0) }).map(
          (_, index) => (
            <WordRow key={`empty-${index}`} />
          )
        )}
      </div>

      <AnimatePresence>
        {gameState === "won" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-base-blue text-white px-8 py-4 rounded-lg text-xl font-bold"
          >
            Поздравляем! Вы угадали слово за {guesses.length} попыт{guesses.length === 1 ? "ку" : guesses.length < 5 ? "ки" : "ок"}!
          </motion.div>
        )}
        {gameState === "lost" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-500 text-white px-8 py-4 rounded-lg text-xl font-bold"
          >
            Игра окончена! Слово было: {targetWord}
          </motion.div>
        )}
      </AnimatePresence>

      <Keyboard onKeyPress={handleKeyPress} letterStates={letterStates} />
    </div>
  );
}

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, gameState]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState !== "playing") return;

      if (key === "ENTER") {
        if (currentGuess.length === 5 && isValidWord(currentGuess, gameMode)) {
          const evaluation = evaluateGuess(currentGuess, targetWord);
          const newGuess: Guess = {
            word: currentGuess,
            letters: evaluation,
          };

          const newGuesses = [...guesses, newGuess];
          setGuesses(newGuesses);

          // Обновляем состояния букв для клавиатуры
          const newLetterStates = { ...letterStates };
          evaluation.forEach(({ letter, state }) => {
            const currentState = newLetterStates[letter];
            if (!currentState || state === "correct") {
              newLetterStates[letter] = state;
            } else if (currentState === "absent" && state === "present") {
              newLetterStates[letter] = state;
            }
          });
          setLetterStates(newLetterStates);

          if (currentGuess === targetWord) {
            setGameState("won");
            const time = Date.now() - startTime;
            onGameEnd(time, newGuesses.length);
            // Эффект конфетти
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } else if (newGuesses.length >= 6) {
            setGameState("lost");
            const time = Date.now() - startTime;
            onGameEnd(time, newGuesses.length);
          }

          setCurrentGuess("");
        }
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, targetWord, guesses, gameState, startTime, letterStates, onGameEnd]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleKeyPress("ENTER");
      } else if (e.key === "Backspace") {
        handleKeyPress("BACKSPACE");
      } else if (e.key.length === 1 && /[A-Za-z]/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-lg font-semibold">
        Время: {formatTime(elapsedTime)}
      </div>

      <div className="flex flex-col gap-2">
        {guesses.map((guess, index) => (
          <WordRow key={index} guess={guess.letters} />
        ))}
        {gameState === "playing" && (
          <WordRow currentWord={currentGuess} isActive={true} />
        )}
        {Array.from({ length: 6 - guesses.length - (gameState === "playing" ? 1 : 0) }).map(
          (_, index) => (
            <WordRow key={`empty-${index}`} />
          )
        )}
      </div>

      <AnimatePresence>
        {gameState === "won" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-base-blue text-white px-8 py-4 rounded-lg text-xl font-bold"
          >
            Поздравляем! Вы угадали слово за {guesses.length} попыт{guesses.length === 1 ? "ку" : guesses.length < 5 ? "ки" : "ок"}!
          </motion.div>
        )}
        {gameState === "lost" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-500 text-white px-8 py-4 rounded-lg text-xl font-bold"
          >
            Игра окончена! Слово было: {targetWord}
          </motion.div>
        )}
      </AnimatePresence>

      <Keyboard onKeyPress={handleKeyPress} letterStates={letterStates} />
    </div>
  );
}
