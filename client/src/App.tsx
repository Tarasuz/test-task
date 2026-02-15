import { useState } from 'react';
import { useSocket } from './useSocket';
import { Lobby } from './components/Lobby';
import { GameBoard } from './components/GameBoard';

function App() {
  const [screen, setScreen] = useState<'lobby' | 'game'>('lobby');
  const [roomId, setRoomId] = useState('');

  const socket = useSocket();

  const handleRoomCreated = (id: string, name: string) => {
    setRoomId(id);
    setScreen('game');
    socket.createRoom(id, name);
  };

  const handleRoomJoined = (id: string, name: string) => {
    setRoomId(id);
    setScreen('game');
    socket.joinRoom(id, name);
  };

  const handleBackToLobby = () => {
    setScreen('lobby');
    setRoomId('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-center text-rose-400">
          Memory Card Battle
        </h1>
        <p className="text-center text-sm text-white/60 mt-1">
          Match pairs. Sabotage your opponent. Win.
        </p>
      </header>

      <main className="flex-1 p-6">
        {screen === 'lobby' ? (
          <Lobby
            onCreateRoom={handleRoomCreated}
            onJoinRoom={handleRoomJoined}
            connected={socket.connected}
            error={socket.error}
          />
        ) : (
          <GameBoard
            {...socket}
            roomId={roomId}
            onBack={handleBackToLobby}
          />
        )}
      </main>
    </div>
  );
}

export default App;
