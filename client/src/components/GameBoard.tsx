import { useEffect, useState } from 'react';
import { Card } from './Card';
import { OpponentCard } from './OpponentCard';
import { SABOTAGE_COSTS, type GameState, type SabotageAction } from '../types';

interface GameBoardProps {
  gameState: GameState | null;
  roomId: string;
  lastFlip: { playerId: string; playerName: string; cardIndex?: number; emoji?: string; secondCard?: { index: number; emoji: string }; isMatch?: boolean } | null;
  gameOver: { winnerId: string; winnerName: string } | null;
  opponentLeft: boolean;
  sabotageUsed: { fromName: string; action: string } | null;
  sabotageUnflip: number | null;
  sabotageShuffle: boolean;
  sabotageFreeze: number | null;
  flip: (index: number) => void;
  sabotage: (action: SabotageAction) => void;
  onBack: () => void;
}

export function GameBoard({
  gameState,
  roomId,
  lastFlip,
  gameOver,
  opponentLeft,
  sabotageUsed,
  sabotageUnflip,
  sabotageFreeze,
  flip,
  sabotage,
  onBack,
}: GameBoardProps) {
  const [freezeEnd, setFreezeEnd] = useState<number | null>(null);

  useEffect(() => {
    if (sabotageFreeze) setFreezeEnd(sabotageFreeze);
  }, [sabotageFreeze]);

  const isFrozen = freezeEnd ? Date.now() < freezeEnd : false;

  useEffect(() => {
    if (!freezeEnd) return;
    const t = setInterval(() => {
      if (Date.now() >= freezeEnd) setFreezeEnd(null);
    }, 100);
    return () => clearInterval(t);
  }, [freezeEnd]);

  if (!gameState?.player) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">Loading...</p>
        {roomId && (
          <div className="mt-6 p-6 rounded-xl bg-rose-500/10 border-2 border-rose-500/30 inline-block">
            <p className="text-sm text-white/70 mb-2">Room code (share with your friend)</p>
            <p className="text-3xl font-mono font-bold text-rose-400 tracking-[0.3em]">{roomId}</p>
            <button
              onClick={() => navigator.clipboard.writeText(roomId)}
              className="mt-3 px-4 py-2 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 font-medium transition"
            >
              Copy code
            </button>
          </div>
        )}
        <button onClick={onBack} className="mt-6 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
          Back
        </button>
      </div>
    );
  }

  if (!gameState.opponent) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70 text-lg">Waiting for opponent...</p>
        <div className="mt-6 p-6 rounded-xl bg-rose-500/10 border-2 border-rose-500/30 inline-block">
          <p className="text-sm text-white/70 mb-2">Share this room code with your friend</p>
          <p className="text-3xl font-mono font-bold text-rose-400 tracking-[0.3em]">{roomId}</p>
          <button
            onClick={() => navigator.clipboard.writeText(roomId)}
            className="mt-3 px-4 py-2 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 font-medium transition"
          >
            Copy code
          </button>
        </div>
        <button
          onClick={onBack}
          className="mt-6 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          Back
        </button>
      </div>
    );
  }

  const { player, opponent } = gameState;
  const matchedSet = new Set(player.matched.map((m) => m.index));
  const flippedSet = new Set(player.flipped.map((f) => f.index));
  const opponentMatchedSet = new Set(opponent.matched.map((m) => m.index));
  const opponentFlippedSet = new Set(opponent.flipped.map((f) => f.index));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition"
        >
          ← Leave
        </button>
        <div className="font-mono text-sm text-white/60">Room: {roomId}</div>
      </div>

      {sabotageUsed && (
        <div className="p-3 rounded-lg bg-rose-500/20 text-rose-300 text-center animate-pulse">
          ⚡ {sabotageUsed.fromName} used {sabotageUsed.action}!
        </div>
      )}

      {isFrozen && (
        <div className="p-3 rounded-lg bg-cyan-500/20 text-cyan-300 text-center">
          ❄️ You are frozen! Wait...
        </div>
      )}

      {opponentLeft && (
        <div className="p-4 rounded-lg bg-amber-500/20 text-amber-300 text-center">
          Opponent left. You win by default!
        </div>
      )}

      {gameOver && (
        <div className="p-6 rounded-xl bg-rose-500/20 border border-rose-500/50 text-center">
          <h2 className="text-2xl font-bold text-amber-400">
            {gameOver.winnerName} wins!
          </h2>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
          >
            Back to Lobby
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Opponent's board (top on mobile, left on desktop) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="font-medium text-white/80">{opponent.name}</span>
            <span className="text-amber-400">Pairs: {opponent.matched.length / 2}/6</span>
            <span className="text-rose-400">Points: {opponent.points}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {opponent.deck.map((card) => (
              <OpponentCard
                key={card.index}
                emoji={card.emoji}
                isMatched={opponentMatchedSet.has(card.index)}
                isFlipped={opponentFlippedSet.has(card.index)}
              />
            ))}
          </div>
        </div>

        {/* Your board */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="font-medium text-white/80">You: {player.name}</span>
            <span className="text-amber-400 font-semibold">Points: {player.points}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {player.deck.map((card) => (
              <Card
                key={card.index}
                index={card.index}
                emoji={card.emoji}
                isMatched={matchedSet.has(card.index)}
                isFlipped={flippedSet.has(card.index)}
                isUnflipping={sabotageUnflip === card.index}
                onFlip={() => flip(card.index)}
                disabled={isFrozen}
              />
            ))}
          </div>
        </div>
      </div>

      {opponent && player.points > 0 && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-medium text-white/70 mb-3">Sabotage ({player.points} pts)</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(SABOTAGE_COSTS) as [SabotageAction, number][]).map(
              ([action, cost]) => (
                <button
                  key={action}
                  onClick={() => sabotage(action)}
                  disabled={player.points < cost}
                  className="px-4 py-2 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 disabled:opacity-40 disabled:cursor-not-allowed border border-rose-500/50 text-sm font-medium transition"
                >
                  {action} ({cost} pt{cost > 1 ? 's' : ''})
                </button>
              )
            )}
          </div>
          <p className="text-xs text-white/50 mt-2">
            Unflip: flip back opponent&apos;s last card • Shuffle: scramble their unmatched cards • Freeze: block them for 5s
          </p>
        </div>
      )}

      {lastFlip && opponent && (
        <div className="p-3 rounded-lg bg-white/5 text-sm text-white/70">
          {lastFlip.playerName} flipped{' '}
          {lastFlip.emoji && <span>{lastFlip.emoji}</span>}
          {lastFlip.secondCard && (
            <>
              {' '}and {lastFlip.secondCard.emoji}
              {lastFlip.isMatch ? ' ✓ Match!' : ' ✗'}
            </>
          )}
        </div>
      )}
    </div>
  );
}
