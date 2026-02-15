import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState } from './types';

const SOCKET_URL = ''; // Use same origin - Vite proxy forwards /socket.io to backend

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFlip, setLastFlip] = useState<{
    playerId: string;
    playerName: string;
    cardIndex?: number;
    emoji?: string;
    secondCard?: { index: number; emoji: string };
    isMatch?: boolean;
  } | null>(null);
  const [gameOver, setGameOver] = useState<{ winnerId: string; winnerName: string } | null>(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [sabotageUsed, setSabotageUsed] = useState<{
    fromName: string;
    action: string;
  } | null>(null);
  const [sabotageUnflip, setSabotageUnflip] = useState<number | null>(null);
  const [sabotageShuffle, setSabotageShuffle] = useState(false);
  const [sabotageFreeze, setSabotageFreeze] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
    });
    socket.on('disconnect', () => {
      setConnected(false);
    });
    socket.on('error', (msg: string) => setError(msg));

    socket.on('game-state', (state: GameState) => {
      setGameState(state);
      setLastFlip(null);
    });

    socket.on('flip', (data: { playerId: string; playerName: string; cardIndex: number; emoji: string }) => {
      setLastFlip(data);
    });

    socket.on('flip-result', (data: {
      playerId: string;
      playerName: string;
      cardIndex?: number;
      secondCard?: { index: number; emoji: string };
      isMatch?: boolean;
    }) => {
      setLastFlip(data);
    });

    socket.on('game-over', (data: { winnerId: string; winnerName: string }) => {
      setGameOver(data);
    });

    socket.on('opponent-left', () => setOpponentLeft(true));

    socket.on('sabotage-used', (data: { fromName: string; action: string }) => {
      setSabotageUsed(data);
      setTimeout(() => setSabotageUsed(null), 2000);
    });

    socket.on('sabotage-unflip', (data: { cardIndex: number }) => {
      setSabotageUnflip(data.cardIndex);
      setTimeout(() => setSabotageUnflip(null), 500);
    });

    socket.on('sabotage-shuffle', () => setSabotageShuffle(true));
    socket.on('sabotage-freeze', (data: { duration: number }) => {
      setSabotageFreeze(Date.now() + data.duration);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const createRoom = (roomId: string, playerName: string) => {
    setError(null);
    setGameOver(null);
    setOpponentLeft(false);
    console.log('createRoom', roomId, playerName);
    socketRef.current?.emit('create-room', roomId, playerName);
  };

  const joinRoom = (roomId: string, playerName: string) => {
    setError(null);
    setGameOver(null);
    setOpponentLeft(false);
    socketRef.current?.emit('join-room', roomId, playerName);
  };

  const flip = (cardIndex: number) => {
    socketRef.current?.emit('flip', cardIndex);
  };

  const sabotage = (action: 'unflip' | 'shuffle' | 'freeze') => {
    socketRef.current?.emit('sabotage', action);
  };

  return {
    socket: socketRef.current,
    connected,
    gameState,
    error,
    lastFlip,
    gameOver,
    opponentLeft,
    sabotageUsed,
    sabotageUnflip,
    sabotageShuffle,
    sabotageFreeze,
    createRoom,
    joinRoom,
    flip,
    sabotage,
  };
}
