import { useState } from 'react';

interface LobbyProps {
  onCreateRoom: (roomId: string, playerName: string) => void;
  onJoinRoom: (roomId: string, playerName: string) => void;
  connected: boolean;
  error: string | null;
}

export function Lobby({ onCreateRoom, onJoinRoom, connected, error }: LobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID().slice(0, 8);
    onCreateRoom(id, playerName || 'Player 1');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) onJoinRoom(roomId.trim(), playerName || 'Player 2');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <div
          className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}
        />
        <span className="text-sm text-white/70">
          {connected ? 'Connected' : 'Connecting...'}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/20 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode('create')}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            mode === 'create'
              ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
              : 'bg-white/5 text-white/60 border border-white/10'
          }`}
        >
          Create Room
        </button>
        <button
          type="button"
          onClick={() => setMode('join')}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            mode === 'join'
              ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
              : 'bg-white/5 text-white/60 border border-white/10'
          }`}
        >
          Join Room
        </button>
      </div>

      <form
        onSubmit={mode === 'create' ? handleCreate : handleJoin}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm text-white/70 mb-1">Your name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={mode === 'create' ? 'Player 1' : 'Player 2'}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-rose-500/50 focus:outline-none"
          />
        </div>

        {mode === 'join' && (
          <div>
            <label className="block text-sm text-white/70 mb-1">Room code</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="e.g. ABC12345"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-rose-500/50 focus:outline-none font-mono"
              maxLength={8}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!connected || (mode === 'join' && !roomId.trim())}
          className="w-full py-3 rounded-lg font-semibold bg-rose-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600 transition"
        >
          {mode === 'create' ? 'Create & Wait for Opponent' : 'Join Game'}
        </button>
      </form>

      {mode === 'create' && (
        <p className="mt-4 text-xs text-white/50 text-center">
          Share the room code with your friend after creating
        </p>
      )}
    </div>
  );
}
