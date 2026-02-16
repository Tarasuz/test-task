import { Box, Button, Center, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { type GameState, type SabotageAction } from "../../types";
import { GameHeader } from "./GameHeader";
import { LastFlipInfo } from "./LastFlipInfo";
import { OpponentBoardSection } from "./OpponentBoardSection";
import { PlayerBoardSection } from "./PlayerBoardSection";
import { RoomCodeBlock } from "./RoomCodeBlock";
import { SabotagePanel } from "./SabotagePanel";
import { StatusBanners } from "./StatusBanners";

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

  if (!gameState?.player) {
    return (
      <Box textAlign="center" py={12}>
        <Text color="whiteAlpha.700">Loading...</Text>
        {roomId && <RoomCodeBlock roomId={roomId} />}
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
        <RoomCodeBlock roomId={roomId} />
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
      <GameHeader roomId={roomId} onBack={onBack} />

      <StatusBanners
        sabotageUsed={sabotageUsed}
        isFrozen={isFrozen}
        opponentLeft={opponentLeft}
        gameOver={gameOver}
        onBack={onBack}
      />

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mt={6}>
        <OpponentBoardSection
          opponent={opponent}
          matchedSet={opponentMatchedSet}
          flippedSet={opponentFlippedSet}
        />

        <PlayerBoardSection
          player={player}
          matchedSet={matchedSet}
          flippedSet={flippedSet}
          sabotageUnflip={sabotageUnflip}
          flip={flip}
          isFrozen={isFrozen}
        />
      </SimpleGrid>

      <SabotagePanel points={player.points} onSabotage={sabotage} />

      {lastFlip && opponent && <LastFlipInfo lastFlip={lastFlip} />}
    </Box>
  );
}
