## TiltGuess

TiltGuess ist ein mobiles Party-Ratespiel, das mit React Native und Expo entwickelt wurde.  
Die Spieler halten das Smartphone an die Stirn, lassen sich Begriffe von den Mitspielern erklären und markieren diese durch Kippen des Geräts als „richtig“ oder „übersprungen“. Punkte werden automatisch gezählt, Spielstände lokal gespeichert und am Ende in einem Leaderboard ausgewertet.

---

### Abstract (Kurzbeschreibung)

TiltGuess dient als schnelle und einfache digitale Alternative zu klassischen Party-Ratespielen.  
Der Fokus der Anwendung liegt auf:

- **Intuitiver Steuerung**  
  Begriffe werden ausschließlich über die Neigung des Geräts bewertet.

- **Sofortiger Spielbarkeit**  
  Kurzes Setup ohne Registrierung oder Backend-Infrastruktur.

- **Übersichtlicher Auswertung**  
  Pro Spiel werden Punkte, Spieler und Runden in einem Leaderboard sowie im Spielverlauf dargestellt.

---

## Features

### Spiel-Setup
- Frei wählbarer Spielname
- Beliebig viele Spieler mit individuellen Namen
- Konfigurierbare Anzahl an Spielrunden

### Tilt-basierte Steuerung
- Erkennung der Gerätebewegung über den Beschleunigungssensor (`expo-sensors`)
- Kippen nach vorne: Begriff korrekt erraten
- Kippen nach hinten: Begriff übersprungen
- Konfigurierbare Achse, Schwellwerte und Cooldown über ein `TiltConfig`

### Wort-Generierung
- Abruf zufälliger deutscher Begriffe über eine externe Web-API
- Normalisierung und Bereinigung der Begriffe vor Anzeige

### Rundenlogik & Timer
- 60 Sekunden Spielzeit pro Runde (konfigurierbar)
- Automatischer Countdown mit visueller Anzeige
- Nach Ablauf der Zeit:
    - Speicherung der Spielergebnisse
    - Automatisches Fortschalten zum nächsten Spieler bzw. zur nächsten Runde
    - Anzeige des Leaderboards nach Abschluss aller Runden

### Leaderboard & Statistiken
- Berechnung der Platzierungen pro Spieler anhand:
    - Anzahl korrekt erratener Begriffe (absteigend)
    - Anzahl übersprungener Begriffe (aufsteigend)
    - Spielernamen als Tie-Breaker
- Anzeige von:
    - Gewinner
    - Rangliste aller Spieler
    - Spielstatistiken (z. B. Anzahl Spieler und Runden)

### Spielverlauf (History)
- Übersicht aller gespeicherten Spiele mit Datum
- Detailansicht eines Spiels mit zugehörigem Leaderboard
- Löschen einzelner Spiele oder der gesamten Historie

### Persistenz
- Lokale Speicherung der Spiele und Runden in `AsyncStorage`
- Laden, Aktualisieren und Löschen über eine zentrale Persistenzschicht

### Audio-Feedback
- Soundeffekte für korrekt erratene und übersprungene Begriffe
- Akustisches Signal am Ende einer Runde

### Benutzeroberfläche
- Reduziertes UI-Design mit Tailwind / NativeWind
- Komponentenbasierter Aufbau (Buttons, Karten, Eingabefelder)
- Separate Screens für Setup, Anleitung, Gameplay, Leaderboard und History
- Hinweis bei falscher Geräteorientierung während der Spielrunde

---

## Tech-Stack

- **Framework:** React Native mit Expo (`expo-router`)
- **Programmiersprache:** TypeScript
- **Styling:** Tailwind CSS mit NativeWind
- **Sensoren:** `expo-sensors` (Accelerometer)
- **Audio:** `expo-audio`
- **Persistenz:** `@react-native-async-storage/async-storage`
- **Navigation:** `expo-router`
- **Codequalität:** ESLint, Prettier

---

## Architektur-Überblick

### Domänenmodell

- **Game**
    - `id`, `name`, `createdAtIso`, `status`, `rounds`
    - Liste von `players`
    - `currentRoundIndex`, `currentPlayerIndex`

- **Turn**
    - Referenzen auf `gameId`, `roundId`, `playerId`
    - `startedAtIso`, `endedAtIso`
    - Anzahl korrekt und übersprungen

Die Kombination aus einem Spiel (`Game`) und den zugehörigen Spielrunden (`Turn`) bildet den vollständigen Zustand einer Partie.

---

### Persistenz

Die Persistenzschicht ist in `src/lib/game/games.ts` implementiert und stellt folgende Funktionen bereit:

- Erstellen eines neuen Spiels
- Laden eines Spiels anhand der ID
- Aktualisieren eines Spiels inklusive Rundenresultaten
- Laden aller gespeicherten Spiele (History)
- Löschen einzelner oder aller Spiele

---

### Tilt-Erkennung

Die Gerätebewegung wird über den Beschleunigungssensor (`expo-sensors`) erfasst.

Die Low-Level-Funktion `detectTilt`:
- bestimmt eine Baseline für die gewählte Achse
- berechnet die Abweichung zum aktuellen Messwert
- vergleicht diese mit definierten Schwellwerten
- verhindert Mehrfachauslösungen mittels Cooldown

Der React-Hook `useTiltGesture`:
- abonniert Accelerometer-Daten
- interpretiert diese als Bewegungsrichtung
- löst entsprechende Spielaktionen aus

Im Gameplay gilt:
- `forward` → Begriff korrekt
- `backward` → Begriff übersprungen

---

## Hinweise

- Spielstände werden vollständig lokal gespeichert.
- Für neue Begriffe ist eine aktive Internetverbindung erforderlich (API-Abruf).
- Die Spielrunde ist primär für die Nutzung im Querformat ausgelegt.

---

## Autoren

Projektarbeit von **Josia & Marko** im Rahmen des Moduls 335.