export type LetterState = "correct" | "present" | "absent";

export interface LetterGuess {
  letter: string;
  state: LetterState;
}

export interface Guess {
  word: string;
  letters: LetterGuess[];
}

export function evaluateGuess(guess: string, target: string): LetterGuess[] {
  const result: LetterGuess[] = [];
  const targetLetters = target.split("");
  const guessLetters = guess.split("");
  const usedIndices = new Set<number>();

  // Сначала находим правильные позиции (синий)
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = { letter: guessLetters[i], state: "correct" };
      usedIndices.add(i);
    }
  }

  // Затем находим буквы, которые есть в слове, но на другом месте (белый)
  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i]) continue;

    const letter = guessLetters[i];
    const indexInTarget = targetLetters.findIndex(
      (targetLetter, idx) => targetLetter === letter && !usedIndices.has(idx)
    );

    if (indexInTarget !== -1) {
      result[i] = { letter, state: "present" };
      usedIndices.add(indexInTarget);
    } else {
      result[i] = { letter, state: "absent" };
    }
  }

  return result;
}
