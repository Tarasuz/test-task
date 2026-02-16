import { Box, Button, Text } from "@chakra-ui/react";

interface StatusBannersProps {
  sabotageUsed: { fromName: string; action: string } | null;
  isFrozen: boolean;
  opponentLeft: boolean;
  gameOver: { winnerId: string; winnerName: string } | null;
  onBack: () => void;
}

export function StatusBanners({
  sabotageUsed,
  isFrozen,
  opponentLeft,
  gameOver,
  onBack,
}: StatusBannersProps) {
  return (
    <>
      {sabotageUsed && (
        <Box
          p={3}
          borderRadius="lg"
          bg="brand.500/20"
          color="brand.200"
          textAlign="center"
          animation="pulse 1s ease-in-out infinite"
          mb={3}
        >
          ⚡ {sabotageUsed.fromName} used {sabotageUsed.action}!
        </Box>
      )}

      {isFrozen && (
        <Box
          p={3}
          borderRadius="lg"
          bg="cyan.500/20"
          color="cyan.300"
          textAlign="center"
          mb={3}
        >
          ❄️ You are frozen! Wait...
        </Box>
      )}

      {opponentLeft && (
        <Box
          p={4}
          borderRadius="lg"
          bg="yellow.500/20"
          color="yellow.300"
          textAlign="center"
          mb={3}
        >
          Opponent left. You win by default!
        </Box>
      )}

      {gameOver && (
        <Box
          p={6}
          borderRadius="xl"
          bg="brand.500/20"
          borderWidth={1}
          borderColor="brand.500/50"
          textAlign="center"
        >
          <Text fontSize="2xl" fontWeight="bold" color="yellow.400">
            {gameOver.winnerName} wins!
          </Text>
          <Button mt={4} variant="outline" colorScheme="gray" onClick={onBack}>
            Back to Lobby
          </Button>
        </Box>
      )}
    </>
  );
}
