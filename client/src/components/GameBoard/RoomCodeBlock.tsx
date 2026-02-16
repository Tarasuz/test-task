import { Box, Button, Text } from "@chakra-ui/react";

interface RoomCodeBlockProps {
  roomId: string;
}

export function RoomCodeBlock({ roomId }: RoomCodeBlockProps) {
  return (
    <Box
      mt={6}
      p={6}
      borderRadius="xl"
      bg="brand.500/10"
      borderWidth={2}
      borderColor="brand.500/30"
      display="inline-block"
    >
      <Text fontSize="sm" color="whiteAlpha.700" mb={2}>
        Share this room code with your friend
      </Text>
      <Text
        fontSize="3xl"
        fontFamily="mono"
        fontWeight="bold"
        color="brand.400"
        letterSpacing="0.3em"
      >
        {roomId}
      </Text>
      <Button
        mt={3}
        size="sm"
        colorScheme="brand"
        variant="outline"
        onClick={() => navigator.clipboard.writeText(roomId)}
      >
        Copy code
      </Button>
    </Box>
  );
}
