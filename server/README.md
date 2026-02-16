# Memory Game Server

A real-time multiplayer memory card game backend built with **Express** and **Socket.io**.

## Overview

The server manages 2-player memory matching games. Each player has their own deck of 12 cards (6 emoji pairs). Players take turns flipping cards to find matches, earn points, and can spend points on sabotage actions against their opponent.

## Tech Stack

- **Express** – HTTP server
- **Socket.io** – WebSocket-based real-time communication
- **Node.js** (ES modules)

## Running the Server

```bash
cd server
npm install
npm run dev    # Development (with --watch)
npm start      # Production
```

Default port: **3001**

CORS is configured for `http://localhost:5173` (Vite dev server).

---

## Game Rules

- **Deck**: 6 emoji pairs (🦊 🐻 🦁 🐸 🦉 🐙) = 12 cards per player
- **Turn**: Flip 2 cards per turn. If they match, you keep them and earn points.
- **Points**: 1 point per match, plus bonus for consecutive matches.
- **Win condition**: First player to match all 12 cards wins.

---

## Socket Events

### Client → Server

| Event          | Payload              | Description                                      |
|----------------|----------------------|--------------------------------------------------|
| `create-room`  | `(roomId, playerName)`| Create a new game room                           |
| `join-room`    | `(roomId, playerName)`| Join an existing room (max 2 players)            |
| `flip`         | `(cardIndex)`         | Flip a card at the given index                   |
| `sabotage`     | `(action)`            | Use a sabotage: `'unflip'`, `'shuffle'`, `'freeze'` |

### Server → Client

| Event              | Payload                          | Description                          |
|--------------------|----------------------------------|--------------------------------------|
| `room-created`     | `roomId`                         | Room was created                     |
| `game-started`     | —                                | Both players joined                  |
| `game-state`       | `{ player, opponent, roomId }`  | Full game state update               |
| `flip`             | `{ playerId, playerName, cardIndex, emoji }` | First card flipped           |
| `flip-result`      | `{ playerId, playerName, cardIndex, secondCard, isMatch }` | Second card result |
| `game-over`        | `{ winnerId, winnerName }`       | Game ended                           |
| `sabotage-unflip`  | `{ cardIndex }`                  | Opponent unflipped one of your cards |
| `sabotage-shuffle` | —                                | Your unmatched cards were shuffled   |
| `sabotage-freeze`  | `{ duration }`                   | You are frozen (5000 ms)             |
| `sabotage-used`    | `{ fromId, fromName, action, targetId }` | Sabotage was used             |
| `opponent-left`    | —                                | Opponent disconnected                |
| `error`            | `string`                         | Error message                        |

---

## Sabotage Actions

| Action   | Cost | Effect                                      |
|----------|------|---------------------------------------------|
| `unflip` | 1 pt | Unflip one of opponent's currently flipped cards |
| `shuffle`| 2 pt | Shuffle opponent's unmatched cards          |
| `freeze` | 2 pt | Freeze opponent for 5 seconds               |

---

## Data Structures

### Player State (serialized)

```js
{
  id: string,
  name: string,
  deck: [{ index, emoji, pairId }],  // emoji is "?" if hidden
  flipped: [{ index, emoji, pairId }],
  matched: [{ index, emoji, pairId }],
  points: number,
  consecutiveMatches: number
}
```

### Room

- Stored in memory (`Map`), no persistence
- Deleted when game ends or a player disconnects
- Each player has their own deck and state

---

## Constants

| Constant              | Value |
|-----------------------|-------|
| `MISMATCH_HIDE_DELAY_MS` | 900 ms (delay before hiding mismatched cards) |
| `SABOTAGE_COSTS.unflip`  | 1 point |
| `SABOTAGE_COSTS.shuffle` | 2 points |
| `SABOTAGE_COSTS.freeze`  | 2 points |
| Freeze duration        | 5000 ms |
