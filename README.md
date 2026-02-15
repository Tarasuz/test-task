# Memory Card Battle

A real-time multiplayer memory card game with sabotage mechanics. Two players race to match all pairs—first to finish wins. Earn points by matching pairs (bonus for consecutive matches) and spend them to sabotage your opponent!

## Features

- **12 cards** (6 pairs) per player—each player has a different random card layout
- **Real-time sync**—see your opponent's flips as they happen
- **Points system**—1 point per match, +1 bonus for each consecutive match (2 in a row = 2 pts, 3 in a row = 3 pts, etc.)
- **Sabotage actions** (spend points):
  - **Unflip** (1 pt)—flip back your opponent's last flipped card
  - **Shuffle** (2 pts)—scramble their unmatched cards
  - **Freeze** (2 pts)—block them for 5 seconds

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Socket.io-client
- **Backend:** Node.js, Express, Socket.io

## Setup

```bash
npm run install:all
```

## Run

```bash
npm run dev
```

- **Client:** http://localhost:5173
- **Server:** http://localhost:3001

## How to Play

1. **Create** a room and share the room code with a friend
2. **Join** with the room code (or have your friend join)
3. Flip cards to find matching pairs
4. Use sabotage when you have points to slow down your opponent
5. First to match all 6 pairs wins!
