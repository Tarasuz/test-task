import { Box, Button } from '@chakra-ui/react';

interface CardProps {
  index: number;
  emoji: string;
  isMatched: boolean;
  isFlipped: boolean;
  isUnflipping: boolean;
  onFlip: () => void;
  disabled: boolean;
}

export function Card({
  emoji,
  isMatched,
  isFlipped,
  isUnflipping,
  onFlip,
  disabled,
}: CardProps) {
  const showFront = isFlipped || isMatched;
  const canFlip = !isMatched && !isFlipped && !disabled && !isUnflipping;

  return (
    <Button
      type="button"
      onClick={onFlip}
      isDisabled={!canFlip}
      opacity={1}
      variant="unstyled"
      position="relative"
      w="full"
      p={0}
      minH={0}
      h="auto"
      aspectRatio={1}
      borderRadius="xl"
      borderWidth={2}
      overflow="hidden"
      transition="all 0.3s"
      cursor={canFlip ? 'pointer' : 'default'}
      _hover={canFlip ? { transform: 'scale(1.02)', borderColor: 'brand.400' } : {}}
      borderColor={isMatched ? 'green.500' : 'whiteAlpha.200'}
      bg={isMatched ? 'green.500/20' : 'whiteAlpha.50'}
      animation={isUnflipping ? 'pulse 0.5s ease-in-out' : undefined}
      style={{ perspective: '600px' }}
      _disabled={{ opacity: 1, cursor: 'default' }}
    >
      <Box
        position="relative"
        w="full"
        h="full"
        style={{
          transformStyle: 'preserve-3d',
          transform: showFront ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="whiteAlpha.100"
          borderRadius="inherit"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Box as="span" fontSize="3xl" color="whiteAlpha.500" fontWeight="bold">
            ?
          </Box>
        </Box>
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="whiteAlpha.50"
          borderRadius="inherit"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <Box as="span" fontSize="4xl">
            {emoji}
          </Box>
        </Box>
      </Box>
    </Button>
  );
}
