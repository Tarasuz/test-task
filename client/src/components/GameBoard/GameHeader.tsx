import { Box, Button, Text } from "@chakra-ui/react";

interface GameHeaderProps {
  roomId: string;
  onBack: () => void;
}

export function GameHeader({ roomId, onBack }: GameHeaderProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={6}
    >
      <Button size="sm" variant="ghost" colorScheme="gray" onClick={onBack}>
        ← Leave
      </Button>
      <Text fontFamily="mono" fontSize="sm" color="whiteAlpha.600">
        Room: {roomId}
      </Text>
    </Box>
  );
}
