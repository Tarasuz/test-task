import { Box, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { GameBoard } from "./components/GameBoard";
import { Lobby } from "./components/Lobby";
import { useSocket } from "./useSocket";

function App() {
  const [screen, setScreen] = useState<"lobby" | "game">("lobby");
  const [roomId, setRoomId] = useState("");

  const socket = useSocket();

  const handleRoomCreated = (id: string, name: string) => {
    setRoomId(id);
    setScreen("game");
    socket.createRoom(id, name);
  };

  const handleRoomJoined = (id: string, name: string) => {
    setRoomId(id);
    setScreen("game");
    socket.joinRoom(id, name);
  };

  const handleBackToLobby = () => {
    setScreen("lobby");
    setRoomId("");
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#0b1510">
      <Box
        as="header"
        py={5}
        px={6}
        borderBottom="1px solid"
        borderColor="whiteAlpha.200"
        bg="blackAlpha.300"
        backdropFilter="blur(8px)"
      >
        <Heading
          as="h1"
          size="xl"
          textAlign="center"
          color="brand.300"
          letterSpacing="0.02em"
        >
          Memory Card Battle
        </Heading>
        <Text textAlign="center" fontSize="sm" color="whiteAlpha.600" mt={1}>
          Match pairs. Sabotage your opponent. Win.
        </Text>
      </Box>

      <Box as="main" flex={1} p={{ base: 4, md: 6 }}>
        {screen === "lobby" ? (
          <Lobby
            onCreateRoom={handleRoomCreated}
            onJoinRoom={handleRoomJoined}
            connected={socket.connected}
            error={socket.error}
          />
        ) : (
          <GameBoard {...socket} roomId={roomId} onBack={handleBackToLobby} />
        )}
      </Box>
    </Box>
  );
}

export default App;
