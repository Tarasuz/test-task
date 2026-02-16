import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

interface LobbyProps {
  onCreateRoom: (roomId: string, playerName: string) => void;
  onJoinRoom: (roomId: string, playerName: string) => void;
  connected: boolean;
  error: string | null;
}

export function Lobby({
  onCreateRoom,
  onJoinRoom,
  connected,
  error,
}: LobbyProps) {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [mode, setMode] = useState<"create" | "join">("create");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID().slice(0, 8);
    onCreateRoom(id, playerName || "Player 1");
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) onJoinRoom(roomId.trim(), playerName || "Player 2");
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={{ base: 4, md: 6 }}
      borderRadius="2xl"
      borderWidth={1}
      borderColor="whiteAlpha.200"
      bg="blackAlpha.300"
      boxShadow="0 10px 30px rgba(0, 0, 0, 0.25)"
    >
      <Box display="flex" alignItems="center" gap={2} mb={6}>
        <Box
          w={2}
          h={2}
          borderRadius="full"
          bg={connected ? "green.500" : "red.500"}
          animation={connected ? "pulse 1.5s ease-in-out infinite" : undefined}
        />
        <Text fontSize="sm" color="whiteAlpha.700">
          {connected ? "Connected" : "Connecting..."}
        </Text>
      </Box>

      {error && (
        <Box
          mb={4}
          p={3}
          borderRadius="lg"
          bg="red.500/20"
          color="red.300"
          fontSize="sm"
        >
          {error}
        </Box>
      )}

      <Box
        display="flex"
        gap={2}
        mb={6}
        p={1}
        borderRadius="xl"
        bg="whiteAlpha.50"
      >
        <Button
          flex={1}
          variant={mode === "create" ? "solid" : "outline"}
          colorScheme={mode === "create" ? "brand" : "gray"}
          onClick={() => setMode("create")}
        >
          Create Room
        </Button>
        <Button
          flex={1}
          variant={mode === "join" ? "solid" : "outline"}
          colorScheme={mode === "join" ? "brand" : "gray"}
          onClick={() => setMode("join")}
        >
          Join Room
        </Button>
      </Box>

      <form onSubmit={mode === "create" ? handleCreate : handleJoin}>
        <Box display="flex" flexDirection="column" gap={4}>
          <FormControl>
            <FormLabel fontSize="sm" color="whiteAlpha.700">
              Your name
            </FormLabel>
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={mode === "create" ? "Player 1" : "Player 2"}
            />
          </FormControl>

          {mode === "join" && (
            <FormControl>
              <FormLabel fontSize="sm" color="whiteAlpha.700">
                Room code
              </FormLabel>
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="e.g. ABC12345"
                maxLength={8}
                fontFamily="mono"
              />
            </FormControl>
          )}

          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            isDisabled={!connected || (mode === "join" && !roomId.trim())}
          >
            {mode === "create" ? "Create & Wait for Opponent" : "Join Game"}
          </Button>
        </Box>
      </form>

      {mode === "create" && (
        <Text mt={4} fontSize="xs" color="whiteAlpha.500" textAlign="center">
          Share the room code with your friend after creating
        </Text>
      )}
    </Box>
  );
}
