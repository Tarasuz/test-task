import { Box, Button, Center, Grid, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SABOTAGE_COSTS, type GameState, type SabotageAction } from "../types";
import { Card } from "./Card";
import { OpponentCard } from "./OpponentCard";

interface GameBoardProps {
  gameState: GameState | null;
  roomId: string;
  lastFlip: {
    playerId: string;
    playerName: string;
    cardIndex?: number;
    emoji?: string;
    secondCard?: { index: number; emoji: string };
    isMatch?: boolean;
  } | null;
  gameOver: { winnerId: string; winnerName: string } | null;
  opponentLeft: boolean;
  sabotageUsed: { fromName: string; action: string } | null;
  sabotageUnflip: number | null;
  sabotageShuffle: boolean;
  sabotageFreeze: number | null;
  flip: (index: number) => void;
  sabotage: (action: SabotageAction) => void;
  onBack: () => void;
}

export function GameBoard({
  gameState,
  roomId,
  lastFlip,
  gameOver,
  opponentLeft,
  sabotageUsed,
  sabotageUnflip,
  sabotageFreeze,
  flip,
  sabotage,
  onBack,
}: GameBoardProps) {
  const [freezeEnd, setFreezeEnd] = useState<number | null>(null);

  useEffect(() => {
    if (sabotageFreeze) setFreezeEnd(sabotageFreeze);
  }, [sabotageFreeze]);

  const isFrozen = freezeEnd ? Date.now() < freezeEnd : false;

  useEffect(() => {
    if (!freezeEnd) return;
    const t = setInterval(() => {
      if (Date.now() >= freezeEnd) setFreezeEnd(null);
    }, 100);
    return () => clearInterval(t);
  }, [freezeEnd]);

  const RoomCodeBlock = () => (
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

  if (!gameState?.player) {
    return (
      <Box textAlign="center" py={12}>
        <Text color="whiteAlpha.700">Loading...</Text>
        {roomId && <RoomCodeBlock />}
        <Button mt={6} variant="ghost" colorScheme="gray" onClick={onBack}>
          Back
        </Button>
      </Box>
    );
  }

  if (!gameState.opponent) {
    return (
      <Center textAlign="center" py={12} flexDir="column">
        <Text color="whiteAlpha.700" fontSize="lg">
          Waiting for opponent...
        </Text>
        <RoomCodeBlock />
        <Button mt={6} variant="ghost" colorScheme="gray" onClick={onBack}>
          Back
        </Button>
      </Center>
    );
  }

  const { player, opponent } = gameState;
  const matchedSet = new Set(player.matched.map((m) => m.index));
  const flippedSet = new Set(player.flipped.map((f) => f.index));
  const opponentMatchedSet = new Set(opponent.matched.map((m) => m.index));
  const opponentFlippedSet = new Set(opponent.flipped.map((f) => f.index));

  return (
    <Box
      maxW="4xl"
      mx="auto"
      p={{ base: 3, md: 4 }}
      borderRadius="2xl"
      bg="blackAlpha.200"
      borderWidth={1}
      borderColor="whiteAlpha.100"
    >
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

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mt={6}>
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
            <Text color="yellow.400">
              Pairs: {opponent.matched.length / 2}/6
            </Text>
            <Text color="brand.300">Points: {opponent.points}</Text>
          </Box>
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {opponent.deck.map((card) => (
              <OpponentCard
                key={card.index}
                emoji={card.emoji}
                isMatched={opponentMatchedSet.has(card.index)}
                isFlipped={opponentFlippedSet.has(card.index)}
              />
            ))}
          </Grid>
        </Box>

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
      </SimpleGrid>

      {opponent && player.points > 0 && (
        <Box
          p={4}
          borderRadius="xl"
          bg="whiteAlpha.50"
          borderWidth={1}
          borderColor="whiteAlpha.200"
          mt={6}
        >
          <Text fontSize="sm" fontWeight="medium" color="whiteAlpha.700" mb={3}>
            Sabotage ({player.points} pts)
          </Text>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {(Object.entries(SABOTAGE_COSTS) as [SabotageAction, number][]).map(
              ([action, cost]) => (
                <Button
                  key={action}
                  size="sm"
                  colorScheme="brand"
                  variant="outline"
                  isDisabled={player.points < cost}
                  onClick={() => sabotage(action)}
                >
                  {action} ({cost} pt{cost > 1 ? "s" : ""})
                </Button>
              ),
            )}
          </Box>
          <Text fontSize="xs" color="whiteAlpha.500" mt={2}>
            Unflip: flip back opponent&apos;s last card • Shuffle: scramble
            their unmatched cards • Freeze: block them for 5s
          </Text>
        </Box>
      )}

      {lastFlip && opponent && (
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
      )}
    </Box>
  );
}
