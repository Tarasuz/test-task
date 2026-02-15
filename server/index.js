import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

const CARD_EMOJIS = ['🦊', '🐻', '🦁', '🐸', '🦉', '🐙'];
const SABOTAGE_COSTS = {
  unflip: 1,
  shuffle: 2,
  freeze: 2,
};
const MISMATCH_HIDE_DELAY_MS = 900;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck() {
  const pairs = CARD_EMOJIS.flatMap((emoji, i) => [
    { id: `${i}-a`, emoji, pairId: i },
    { id: `${i}-b`, emoji, pairId: i },
  ]);
  return shuffle(pairs);
}

const rooms = new Map();

function getRoom(roomId) {
  return rooms.get(roomId);
}

function createRoom(roomId, playerId, playerName) {
  const deck = createDeck();
  const room = {
    id: roomId,
    players: new Map([
      [
        playerId,
        {
          id: playerId,
          name: playerName,
          deck: deck.map((c, i) => ({ ...c, index: i })),
          flipped: [],
          matched: [],
          points: 0,
          consecutiveMatches: 0,
          frozenUntil: 0,
          resolvingFlip: false,
        },
      ],
    ]),
    started: false,
  };
  rooms.set(roomId, room);
  return room;
}

function joinRoom(roomId, playerId, playerName) {
  const room = rooms.get(roomId);
  if (!room || room.players.size >= 2) return null;
  const deck = createDeck();
  room.players.set(playerId, {
    id: playerId,
    name: playerName,
    deck: deck.map((c, i) => ({ ...c, index: i })),
    flipped: [],
    matched: [],
    points: 0,
    consecutiveMatches: 0,
    frozenUntil: 0,
    resolvingFlip: false,
  });
  room.started = true;
  return room;
}

function getOpponent(room, playerId) {
  for (const [id, _] of room.players) {
    if (id !== playerId) return id;
  }
  return null;
}

io.on('connection', (socket) => {
  socket.on('create-room', (roomId, playerName) => {
    const room = createRoom(roomId, socket.id, playerName || 'Player 1');
    socket.join(roomId);
    socket.roomId = roomId;
    socket.emit('room-created', roomId);
    socket.emit('game-state', {
      player: serializePlayer(room.players.get(socket.id)),
      opponent: null,
      roomId,
    });
  });

  socket.on('join-room', (roomId, playerName) => {
    const room = joinRoom(roomId, socket.id, playerName || 'Player 2');
    if (!room) {
      socket.emit('error', 'Room full or not found');
      return;
    }
    socket.join(roomId);
    socket.roomId = roomId;

    const p1 = [...room.players.keys()][0];
    const p2 = [...room.players.keys()][1];

    io.to(roomId).emit('game-started');
    io.to(p1).emit('game-state', {
      player: serializePlayer(room.players.get(p1)),
      opponent: serializePlayer(room.players.get(p2)),
      roomId,
    });
    io.to(p2).emit('game-state', {
      player: serializePlayer(room.players.get(p2)),
      opponent: serializePlayer(room.players.get(p1)),
      roomId,
    });
  });

  socket.on('flip', (cardIndex) => {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = getRoom(roomId);
    if (!room || !room.started) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    if (Date.now() < player.frozenUntil) {
      socket.emit('error', 'You are frozen!');
      return;
    }
    if (player.resolvingFlip || player.flipped.length >= 2) return;

    const card = player.deck[cardIndex];
    if (!card || player.matched.some((m) => m.index === cardIndex) || player.flipped.some((f) => f.index === cardIndex)) {
      return;
    }

    player.flipped.push({ ...card, index: cardIndex });

    if (player.flipped.length === 2) {
      const [a, b] = player.flipped;
      const isMatch = a.pairId === b.pairId;

      const opponentId = getOpponent(room, socket.id);
      io.to(roomId).emit('flip-result', {
        playerId: socket.id,
        playerName: player.name,
        cardIndex,
        secondCard: { index: a.index, emoji: a.emoji },
        isMatch,
      });

      if (isMatch) {
        player.matched.push(...player.flipped);
        player.consecutiveMatches++;
        player.points += player.consecutiveMatches;
        player.flipped = [];
        player.resolvingFlip = false;

        if (player.matched.length === 12) {
          io.to(roomId).emit('game-over', { winnerId: socket.id, winnerName: player.name });
          rooms.delete(roomId);
          return;
        }
        broadcastGameState(room);
      } else {
        player.consecutiveMatches = 0;
        player.resolvingFlip = true;
        broadcastGameState(room);
        setTimeout(() => {
          const currentRoom = getRoom(roomId);
          if (!currentRoom) return;
          const currentPlayer = currentRoom.players.get(socket.id);
          if (!currentPlayer) return;
          currentPlayer.flipped = [];
          currentPlayer.resolvingFlip = false;
          broadcastGameState(currentRoom);
        }, MISMATCH_HIDE_DELAY_MS);
      }
    } else {
      io.to(roomId).emit('flip', {
        playerId: socket.id,
        playerName: player.name,
        cardIndex,
        emoji: card.emoji,
      });
      broadcastGameState(room);
    }
  });

  socket.on('sabotage', (action) => {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = getRoom(roomId);
    if (!room) return;

    const player = room.players.get(socket.id);
    const opponentId = getOpponent(room, socket.id);
    if (!player || !opponentId) return;

    const cost = SABOTAGE_COSTS[action];
    if (cost === undefined || player.points < cost) {
      socket.emit('error', 'Not enough points');
      return;
    }

    const opponent = room.players.get(opponentId);
    if (!opponent) return;

    let success = false;
    switch (action) {
      case 'unflip':
        if (opponent.flipped.length > 0) {
          const last = opponent.flipped.pop();
          success = true;
          io.to(opponentId).emit('sabotage-unflip', { cardIndex: last.index });
        }
        break;
      case 'shuffle': {
        const matchedIndices = new Set(opponent.matched.map((m) => m.index));
        const unmatchedCards = opponent.deck.filter((_, i) => !matchedIndices.has(i));
        const shuffled = shuffle(unmatchedCards);
        let j = 0;
        opponent.deck = opponent.deck.map((c, i) =>
          matchedIndices.has(i) ? c : { ...shuffled[j++], index: i }
        );
        opponent.flipped = [];
        success = true;
        io.to(opponentId).emit('sabotage-shuffle');
        break;
      }
      case 'freeze':
        opponent.frozenUntil = Date.now() + 5000;
        success = true;
        io.to(opponentId).emit('sabotage-freeze', { duration: 5000 });
        break;
    }

    if (success) {
      player.points -= cost;
      io.to(roomId).emit('sabotage-used', {
        fromId: socket.id,
        fromName: player.name,
        action,
        targetId: opponentId,
      });
      broadcastGameState(room);
    }
  });

  socket.on('disconnect', () => {
    const roomId = socket.roomId;
    if (roomId) {
      const room = getRoom(roomId);
      if (room) {
        const opponentId = getOpponent(room, socket.id);
        if (opponentId) {
          io.to(opponentId).emit('opponent-left');
        }
        rooms.delete(roomId);
      }
    }
  });
});

function serializePlayer(p) {
  if (!p) return null;
  const flippedIndices = new Set(p.flipped.map((f) => f.index));
  const matchedIndices = new Set(p.matched.map((m) => m.index));
  return {
    id: p.id,
    name: p.name,
    deck: p.deck.map((c, i) => ({
      index: i,
      emoji: flippedIndices.has(i) || matchedIndices.has(i) ? c.emoji : '?',
      pairId: c.pairId,
    })),
    flipped: p.flipped,
    matched: p.matched,
    points: p.points,
    consecutiveMatches: p.consecutiveMatches,
  };
}

function broadcastGameState(room) {
  const [p1, p2] = [...room.players.keys()];
  io.to(p1).emit('game-state', {
    player: serializePlayer(room.players.get(p1)),
    opponent: serializePlayer(room.players.get(p2)),
    roomId: room.id,
  });
  io.to(p2).emit('game-state', {
    player: serializePlayer(room.players.get(p2)),
    opponent: serializePlayer(room.players.get(p1)),
    roomId: room.id,
  });
}

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
