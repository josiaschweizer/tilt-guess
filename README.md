## TiltGuess

TiltGuess ist ein mobiles Party‑Ratespiel auf Basis von React Native und Expo. Die Spieler halten das Smartphone an die Stirn, lassen sich Begriffe erklären und markieren diese durch Kippen des Geräts als „richtig“ oder „übersprungen“. Punkte werden automatisch gezählt, Spielstände lokal gespeichert und am Ende auf einem Leaderboard angezeigt.

### Abstract (Kurzbeschreibung)

TiltGuess ist als schnelle, einfache und offline‑fähige Alternative zu klassischen Partyspielen gedacht.  
Der Fokus liegt auf:

- **Intuitiver Steuerung**: Begriffe werden ausschließlich über die Neigung des Geräts bewertet.
- **Sofort spielbar**: Kurzes Setup, keine Registrierung, kein Backend.
- **Klarer Auswertung**: Pro Spiel werden Punkte, Spieler und Runden übersichtlich im Leaderboard und im Spielverlauf dargestellt.

---

## Features

- **Spiel‑Setup**
  - Frei wählbarer Spielname.
  - Beliebig viele Spieler mit Namen.
  - Konfigurierbare Anzahl Runden.

- **Tilt‑basierte Steuerung**
  - Erkennung der Neigung über den Beschleunigungssensor (`expo-sensors`).
  - Kippen nach vorne: **Begriff korrekt**.
  - Kippen nach hinten: **Begriff übersprungen**.
  - Konfigurierbare Achse, Schwellwerte und Cooldown über ein `TiltConfig`.

- **Wort-Generierung**
  - Abruf zufälliger deutscher Begriffe über eine externe API (`random-words-api.kushcreates.com`) mit UTF‑8‑Handling.
  - Normalisierung und Trimmen der Wörter vor Anzeige.

- **Rundenlogik & Timer**
  - Pro Runde 60 Sekunden Spielzeit (konfigurierbare Konstante).
  - Automatischer Timer mit visueller `ProgressBar`.
  - Am Ende der Runde:
    - Speicherung des Turns mit korrekten/übersprungenen Begriffen.
    - Automatisches Fortschalten zum nächsten Spieler / zur nächsten Runde.
    - Wechsel zur Anleitung oder zum Leaderboard, sobald alle Runden beendet sind.

- **Leaderboard & Statistiken**
  - Berechnung der Platzierungen pro Spieler anhand:
    - **korrekt** (absteigend),
    - **übersprungen** (aufsteigend),
    - Spielernamen (alphabetisch) als Tie‑Breaker.
  - Anzeige von:
    - Gewinnerkarte (`WinnerCard`),
    - sortierter Rangliste (`LeaderboardCard`),
    - kompakten Spielstatistiken (Rundenanzahl, Spieleranzahl).

- **Spielverlauf (History)**
  - Liste aller gespeicherten Spiele mit Datum.
  - Detailansicht eines Spiels führt direkt ins zugehörige Leaderboard.
  - Löschen einzelner Spiele oder kompletter Historie (mit Sicherheitsabfrage).

- **Persistenz**
  - Lokale Speicherung der Spiele und Turns in `AsyncStorage` (Key‑Prefix `game:`).
  - Laden, Aktualisieren, Löschen und Mass‑Löschen über `lib/game/games.ts`.

- **Audio‑Feedback**
  - Alarm‑Sound beim Rundenende.
  - Sounds für „richtig“ und „übersprungen“.
  - Implementiert mit `expo-audio` und kurzem Reset (`seekTo(0)`).

- **UI/UX**
  - Modernes, reduziertes Design mit Tailwind/Nativwind‑Utility‑Klassen.
  - Farbpalette über CSS‑Variablen (`global.css`).
  - Komponentenbasierte UI (Buttons, Input‑Felder, Karten, Badges).
  - Separate Screens für Setup, Anleitung, Spiel, Leaderboard und History.
  - Orientierungsschutz: Hinweis, wenn das Gerät nicht im Querformat ist.

---

## Tech-Stack

- **Framework**: Expo / React Native (`expo-router`)
- **Sprache**: TypeScript
- **Styling**: `tailwindcss` + `nativewind`, zentrale Farben in `src/styles/global.css`
- **Sensoren**: `expo-sensors` (Accelerometer)
- **Audio**: `expo-audio`
- **Persistenz**: `@react-native-async-storage/async-storage`
- **Navigation**: `expo-router` mit Dateibasierter Routenstruktur
- **Linter/Formatting**: ESLint, Prettier, TypeScript

---

## Projektstruktur (Auszug)

- `src/app/_layout.tsx` – Root‑Layout, globale Screen‑Optionen, globales CSS.
- `src/app/index.tsx` – Startseite mit Logo, Call‑to‑Action und Einstieg ins Setup oder die History.
- `src/app/game/setup/index.tsx` – Spiel‑Setup (Spielname, Spieler, Runden).
- `src/app/game/instruction/[id].tsx` – Anleitungsscreen mit Spieler‑Info und Spielanweisungen.
- `src/app/game/play/[id].tsx` – Hauptspielscreen mit Timer, aktuellem Wort, Tilt‑Steuerung, Score.
- `src/app/leaderboard/[id].tsx` – Resultat/Leaderboard eines Spiels.
- `src/app/history/index.tsx` – Spielverlauf mit Liste vergangener Spiele.

- `src/lib/game/games.ts` – CRUD‑Operationen für Spiele in `AsyncStorage`.
- `src/lib/game/leaderboard.ts` – Berechnung der Rangliste.
- `src/lib/game/gameResult.ts` – Aufbereitung von Spielresultaten für die History.
- `src/lib/game/randomWord.ts` – Abruf zufälliger deutscher Wörter von der API.
- `src/lib/sensors/tiltDetection.ts` – Kernlogik zur Tilt‑Erkennung mit Schwellwerten, Baseline, Cooldown.
- `src/lib/hooks/useTiltGesture.ts` – React‑Hook, der den Accelerometer abonniert und `detectTilt` kapselt.

- `src/interface/entities/Game.ts`, `Turn.ts`, `Player.ts`, `Round.ts` – Domänenmodelle.
- `src/types/tilt/*` und `src/interface/tilt/TiltConfig.ts` – Typsystem rund um Tilt‑Erkennung.
- `src/components/base/*` – generische UI‑Bausteine (Buttons, Inputs).
- `src/components/ui/*` – fachliche UI‑Komponenten für Game, Leaderboard, History, Spieler‑Liste etc.

---

## Installation & Entwicklung

### Voraussetzungen

- Node.js (aktuelle LTS‑Version)
- `npm`, `pnpm` oder `yarn`
- Expo CLI (`npm install -g expo-cli`) – optional, aber hilfreich
- Ein Emulator (Android/iOS) oder ein physisches Gerät mit Expo Go

### Projekt einrichten

```bash
# Abhängigkeiten installieren
npm install
# oder
yarn
# oder
pnpm install
```

### App starten

```bash
# Metro-Bundler/Dev-Server starten
npm run start
# oder
npx expo start
```

Dann:

- Den QR‑Code im Terminal/Browser mit der Expo‑Go‑App (iOS/Android) scannen, **oder**
- `a` für Android‑Emulator bzw. `i` für iOS‑Simulator in der Expo‑Konsole drücken.

---

## Entwicklungsskripte

- **Code formatieren**

  ```bash
  npm run format
  ```

- **Linting**

  ```bash
  npm run lint
  ```

---

## Architektur-Überblick

### Domänenmodell

- **Game**
  - `id`, `name`, `createdAtIso`, `status`, `rounds`
  - Liste von `players`
  - `currentRoundIndex`, `currentPlayerIndex` zur Steuerung des Spielfortschritts.

- **Turn**
  - Referenzen auf `gameId`, `roundId`, `playerId`
  - `startedAtIso`, `endedAtIso`
  - Zähler für `correct` und `skipped`.

Die Kombination aus `Game` und allen `Turn`s bildet den vollständigen Zustand eines Spiels.

### Persistenz-Schicht

Implementiert in `src/lib/game/games.ts`:

- `createGame({ game, turns })` – legt ein neues Spiel mit leerer Turn‑Liste an.
- `loadGameById({ gameId })` – lädt ein konkretes Spiel mit allen zugehörigen Turns.
- `updateGame({ game, turn })` – aktualisiert ein Spiel und hängt optional einen neuen Turn an.
- `loadGames()` – lädt alle gespeicherten Spiele (für die History).
- `deleteGame({ gameId })`, `deleteAllGames()` – entfernen einzelne oder alle Spiele.

### Tilt-Erkennung

- **Low‑Level**: `detectTilt` in `tiltDetection.ts`
  - Nutzt einen Baseline‑Wert für die gewählte Achse (`x`, `y`, `z`).
  - Berechnet Delta, vergleicht mit `threshold` und `resetThreshold`.
  - `cooldownMs` verhindert schnelle Doppel‑Trigger.
  - Gibt `TiltDirection` (`'forward'`, `'backward'`) oder `null` zurück.

- **High‑Level**: `useTiltGesture` Hook
  - Abonniert den Accelerometer (`expo-sensors`).
  - Übersetzt Rohdaten in `TiltDirection` und ruft den Callback des Screens auf.
  - Ermöglicht Konfiguration (invertierte Achse, Schwellwerte etc.) und Deaktivierung.

Im Spielscreen (`/game/play/[id].tsx`) wird daraus die Logik:

- `forward` → `onCorrectPress()` → Score hoch, neues Wort.
- `backward` → `onSkipPress()` → Skip‑Zähler hoch, neues Wort.

---

## Bekannte Einschränkungen / Hinweise

- **Offline-Fähigkeit**: Spielstände sind komplett offline, aber neue Wörter benötigen eine funktionierende Internetverbindung (API‑Call). Fällt die API aus, kann `currentWord` `null` sein.
- **Geräteorientierung**:
  - Setup, History, Leaderboard: primär Hochformat.
  - Spiel/Anleitung: sinnvoll nur im Querformat; `OrientationGuard` weist darauf hin.
- **Plattformen**: Projekt ist für iOS und Android mit Expo vorgesehen; Web‑Support ist nicht explizit optimiert.

---

## Autoren / Credits

- Umsetzung als Schul-/Projektarbeit: **TiltGuess Josia und Marko**.
- Technologie‑Stack und API‑Integration basieren auf Open‑Source‑Bibliotheken (Expo, React Native, Tailwind, Nativewind etc.).

