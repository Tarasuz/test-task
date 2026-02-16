import { Box } from '@chakra-ui/react';

interface OpponentCardProps {
  emoji: string;
  isMatched: boolean;
  isFlipped: boolean;
}

export function OpponentCard({ emoji, isMatched, isFlipped }: OpponentCardProps) {
  const showFront = isFlipped || isMatched;

  return (
    <Box
      position="relative"
      w="full"
      aspectRatio={1}
      borderRadius="xl"
      borderWidth={2}
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderColor={isMatched ? 'green.500' : 'whiteAlpha.200'}
      bg={isMatched ? 'green.500/20' : 'whiteAlpha.50'}
    >
      <Box as="span" fontSize="3xl">
        {showFront ? emoji : '?'}
      </Box>
    </Box>
  );
}
