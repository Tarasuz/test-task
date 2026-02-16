import { Box, Grid, Text } from "@chakra-ui/react";
import type { PlayerState } from "../../types";
import { Card } from "../Card";

interface PlayerBoardSectionProps {
  player: PlayerState;
  matchedSet: Set<number>;
  flippedSet: Set<number>;
  sabotageUnflip: number | null;
  flip: (index: number) => void;
  isFrozen: boolean;
}

export function PlayerBoardSection({
  player,
  matchedSet,
  flippedSet,
  sabotageUnflip,
  flip,
  isFrozen,
}: PlayerBoardSectionProps) {
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
          You: {player.name}
        </Text>
        <Text color="yellow.400" fontWeight="semibold">
          Points: {player.points}
        </Text>
      </Box>
      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
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
      </Grid>
    </Box>
  );
}
