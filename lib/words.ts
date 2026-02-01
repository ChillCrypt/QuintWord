import { WORDS as HARD_WORDS } from "./words-hard";

export type GameMode = "lite" | "hard";

// Список слов из 5 букв для игры (lite режим)
export const WORDS = [
  "APPLE",
  "BRAVE",
  "CHAOS",
  "DREAM",
  "EARTH",
  "FAITH",
  "GLORY",
  "HEART",
  "IMAGE",
  "JOKER",
  "KNIFE",
  "LIGHT",
  "MAGIC",
  "NIGHT",
  "OCEAN",
  "PEACE",
  "QUICK",
  "RIVER",
  "STORM",
  "TRUTH",
  "UNITY",
  "VOICE",
  "WATER",
  "YOUTH",
  "ZEBRA",
  "BASIC",
  "CHAIN",
  "DANCE",
  "EAGLE",
  "FOCUS",
  "GHOST",
  "HAPPY",
  "IVORY",
  "JAZZY",
  "KNEEL",
  "LEMON",
  "MUSIC",
  "NOVEL",
  "OLIVE",
  "PAPER",
  "QUEEN",
  "ROBOT",
  "SMILE",
  "TIGER",
  "URBAN",
  "VIVID",
  "WHEAT",
  "XENON",
  "YACHT",
  "ZONAL",
];

export function getWordsList(mode: GameMode = "lite"): string[] {
  return mode === "hard" ? HARD_WORDS : WORDS;
}

export function getRandomWord(mode: GameMode = "lite"): string {
  const wordsList = getWordsList(mode);
  return wordsList[Math.floor(Math.random() * wordsList.length)];
}

export function isValidWord(word: string, mode: GameMode = "lite"): boolean {
  if (word.length !== 5 || !/^[A-Z]+$/.test(word)) {
    return false;
  }
  const wordsList = getWordsList(mode);
  return wordsList.includes(word.toUpperCase());
}
