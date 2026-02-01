# QuintWord (Base Wordle) - AI Agent Instructions

## Project Overview
QuintWord is a blockchain-based Wordle game running on the Base chain. It's a Next.js application combining Web3 wallet integration with word puzzle gameplay. The architecture separates game logic, persistent storage, and UI components into distinct layers.

## Architecture & Key Components

### Core Game Logic (`lib/game.ts`)
- **Evaluation System**: `evaluateGuess()` processes guesses and returns letter states (correct/present/absent)
- **State Tracking**: Three-phase letter matching—first find exact matches (correct), then find displaced matches (present), avoiding double-counting with `usedIndices` Set
- **Data Structures**: `LetterGuess` (letter + state), `Guess` (word + letter array)

### Storage Layer (`lib/storage.ts`)
- **Per-Wallet Stats**: All player stats keyed by wallet address (`base_wordle_${address}`)
- **Browser-Only**: Checks `typeof window === "undefined"` to prevent SSR failures
- **GameStats Interface**: Tracks bestTime, totalGames, totalAttempts, averageAttempts
- **Pattern**: Uses localStorage with JSON serialization; gracefully returns default stats on parse errors

### Web3 Integration (`app/providers.tsx`, `app/page.tsx`)
- **Wallet Provider Stack**: WagmiProvider → QueryClientProvider → RainbowKitProvider
- **Chain**: Configured for Base network only (`base` from wagmi/chains)
- **Connected State**: Game only renders when `useAccount().isConnected` is true
- **Project ID**: Requires `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` environment variable

### UI Components
- **GameBoard** (`components/GameBoard.tsx`): Main game orchestrator—manages target word, guesses, keyboard input, timer, game state (playing/won/lost)
- **WordRow** (`components/WordRow.tsx`): Displays individual 5-letter rows with Framer Motion animations; color coding by letter state
- **Keyboard** (`components/Keyboard.tsx`): Virtual keyboard handling key presses and state visualization
- **Stats** (`components/Stats.tsx`): Displays player statistics

## Data Flow
1. **Initialization**: Page reads stats from localStorage via wallet address
2. **Game Session**: GameBoard generates random target word, evaluates guesses against it
3. **End Game**: `onGameEnd` callback triggers `updateStats()`, which recalculates averages and persists to localStorage
4. **State Lift**: Stats bubble up through page component for UI refresh

## Developer Workflows

### Development
```
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Production build
npm run start        # Run production build
npm run lint         # ESLint check
```

### Git
- Repository: `QuintWord` (owner: `ChillCrypt`)
- Current branch: `main`
- Standard Git workflow: commit and push normally

## Project-Specific Patterns

### Naming Conventions
- **Color Variables**: `base-blue` is primary brand color (used in gradients and state indicators)
- **Storage Prefix**: All localStorage keys use `base_wordle_` prefix to avoid conflicts
- **Game States**: Explicit string literals ("playing" | "won" | "lost")
- **Letter States**: "correct" (exact match), "present" (wrong position), "absent" (not in word)

### Component Patterns
- **"use client"**: All interactive components use this directive (page.tsx, GameBoard, WordRow, Keyboard, Stats)
- **State Management**: React hooks (useState, useCallback, useEffect); no Redux/Zustand
- **Animation**: Framer Motion for transitions; canvas-confetti for win celebration
- **Styling**: Tailwind CSS with custom globals.css; `bg-clip-text text-transparent` for gradient text

### Error Handling
- Storage operations catch JSON parse errors and return defaults
- SSR guards prevent window access during server rendering
- Development-only script suppresses wallet extension errors in layout.tsx

## Word Lists
- **Standard**: `lib/words.ts` (common 5-letter words)
- **Hard Mode**: `lib/words-hard.ts` (challenging vocabulary)
- Pattern: Both export arrays for `getRandomWord()` and `isValidWord()` functions

## Key External Dependencies
- **Web3**: wagmi 2.8, viem 2.18, @rainbow-me/rainbowkit 2.0
- **UI**: Framer Motion 11.0, canvas-confetti 1.9.3
- **React**: React 18.3, Next.js 14.2
- **Build**: TypeScript 5.5, Tailwind 3.4, ESLint

## Common Tasks
- **Add Game Feature**: Extend GameBoard state and handlers; update Stats if it affects player metrics
- **Modify Evaluation Logic**: Edit `evaluateGuess()` carefully—impacts all gameplay
- **Persist New Data**: Add to GameStats interface, then update storage read/write functions
- **Style Adjustments**: Tailwind classes in components; brand colors in globals.css
- **Connect External Service**: Inject provider in Providers wrapper; use wagmi hooks in components

## Import Aliases
- `@/*` maps to workspace root (e.g., `@/lib/game` → `lib/game.ts`)

## TypeScript Configuration
- **Target**: ES2020
- **Strict Mode**: Enabled
- **JSX**: Preserve (Next.js handles transformation)
- **No Emit**: TypeScript is checked but Next.js handles build output
