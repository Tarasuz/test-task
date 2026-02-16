import { Box, Grid, Text } from "@chakra-ui/react";
import type { PlayerState } from "../../types";
import { OpponentCard } from "../OpponentCard";

interface OpponentBoardSectionProps {
  opponent: PlayerState;
  matchedSet: Set<number>;
  flippedSet: Set<number>;
}

export function OpponentBoardSection({
  opponent,
  matchedSet,
  flippedSet,
}: OpponentBoardSectionProps) {
  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={3}
        borderRadius="lg"
        bg="whiteAlpha.50"
        borderWidth={1}
        borderColor="whiteAlpha.200"
        mb={3}
      >
        <Text fontWeight="medium" color="whiteAlpha.800">
          {opponent.name}
        </Text>
        <Text color="yellow.400">Pairs: {opponent.matched.length / 2}/6</Text>
        <Text color="brand.300">Points: {opponent.points}</Text>
      </Box>
      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {opponent.deck.map((card) => (
          <OpponentCard
            key={card.index}
            emoji={card.emoji}
            isMatched={matchedSet.has(card.index)}
            isFlipped={flippedSet.has(card.index)}
          />
        ))}
      </Grid>
    </Box>
  );
}
