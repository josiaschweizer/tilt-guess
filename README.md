## TiltGuess

TiltGuess is a mobile party guessing game developed using React Native and Expo.  
Players hold the smartphone to their forehead while teammates explain terms without saying the actual word. By tilting the device forward or backward, the active player can mark a term as "guessed correctly" or "skipped". Points are counted automatically, game states are stored locally, and evaluated in a leaderboard at the end of each game.

---

### Abstract (Short Description)

TiltGuess serves as a fast and simple digital alternative to traditional party guessing games.  
The main focus of the application lies on:

- **Intuitive Controls**  
  Terms are evaluated exclusively by tilting the device.

- **Instant Playability**  
  Quick setup without registration or backend infrastructure.

- **Clear Evaluation**  
  Points, players, and rounds are displayed in a leaderboard and game history.

---

## Features

### Game Setup
- Freely selectable game name
- Any number of players with individual names
- Configurable number of rounds

### Tilt-Based Controls
- Device movement detection via accelerometer (`expo-sensors`)
- Tilt forward: term guessed correctly
- Tilt backward: term skipped
- Configurable axis, thresholds, and cooldown using `TiltConfig`

### Word Generation
- Fetching random German terms via an external Web API
- Normalization and cleanup of terms before display

### Round Logic & Timer
- 60 seconds playtime per round (configurable)
- Automatic countdown with visual display
- After time expires:
  - Saving player results
  - Automatic progression to next player or round
  - Leaderboard display after all rounds are completed

### Leaderboard & Statistics
- Ranking based on:
  - Number of correctly guessed terms (descending)
  - Number of skipped terms (ascending)
  - Player name as tie-breaker
- Displays:
  - Winner
  - Ranking of all players
  - Game statistics (e.g. number of players and rounds)

### Game History
- Overview of all saved games with date
- Detailed view of each game including leaderboard
- Deletion of single games or entire history

### Persistence
- Local storage of games and rounds in `AsyncStorage`
- Load, update, and delete via a centralized persistence layer

### Audio Feedback
- Sound effects for correct and skipped terms
- Audio signal at the end of each round

### User Interface
- Minimal UI design with Tailwind / NativeWind
- Component-based structure (buttons, cards, input fields)
- Separate screens for setup, instructions, gameplay, leaderboard, and history
- Orientation warning during gameplay if device is held incorrectly

---

## Tech Stack

- **Framework:** React Native with Expo (`expo-router`)
- **Programming Language:** TypeScript
- **Styling:** Tailwind CSS with NativeWind
- **Sensors:** `expo-sensors` (Accelerometer)
- **Audio:** `expo-audio`
- **Persistence:** `@react-native-async-storage/async-storage`
- **Navigation:** `expo-router`
- **Code Quality:** ESLint, Prettier

---

## Architecture Overview

### Domain Model

- **Game**
  - `id`, `name`, `createdAtIso`, `status`, `rounds`
  - List of `players`
  - `currentRoundIndex`, `currentPlayerIndex`

- **Turn**
  - References to `gameId`, `roundId`, `playerId`
  - `startedAtIso`, `endedAtIso`
  - Number of correct and skipped terms

The combination of a game (`Game`) and its associated turns (`Turn`) represents the full state of a match.

---

### Persistence

The persistence layer is implemented in `src/lib/game/games.ts` and provides the following functionality:

- Creating a new game
- Loading a game by ID
- Updating a game including round results
- Loading all saved games (history)
- Deleting single or all games

---

### Tilt Detection

Device movement is captured using the accelerometer (`expo-sensors`).

The low-level function `detectTilt`:
- Determines a baseline for the selected axis
- Calculates deviation from the current measurement
- Compares it with defined thresholds
- Prevents multiple triggers using a cooldown

The React hook `useTiltGesture`:
- Subscribes to accelerometer data
- Interprets movement direction
- Triggers corresponding game actions

During gameplay:
- `forward` → term guessed correctly
- `backward` → term skipped

---

## Notes

- Game states are stored entirely locally.
- An active internet connection is required to fetch new terms (API call).
- Gameplay is primarily designed for landscape orientation.

---

## Authors

Project work by **Josia & Marko** as part of Module 335.
