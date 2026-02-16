import { Box } from "@chakra-ui/react";

interface LastFlipInfoProps {
  lastFlip: {
    playerId: string;
    playerName: string;
    cardIndex?: number;
    emoji?: string;
    secondCard?: { index: number; emoji: string };
    isMatch?: boolean;
  };
}

export function LastFlipInfo({ lastFlip }: LastFlipInfoProps) {
  return (
    <Box
      p={3}
      borderRadius="lg"
      bg="whiteAlpha.100"
      borderWidth={1}
      borderColor="whiteAlpha.200"
      fontSize="sm"
      color="whiteAlpha.700"
      mt={4}
    >
      {lastFlip.playerName} flipped{" "}
      {lastFlip.emoji && <span>{lastFlip.emoji}</span>}
      {lastFlip.secondCard && (
        <>
          {" "}
          and {lastFlip.secondCard.emoji}
          {lastFlip.isMatch ? " ✓ Match!" : " ✗"}
        </>
      )}
    </Box>
  );
}
