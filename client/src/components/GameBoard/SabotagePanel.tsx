import { Box, Button, Text } from "@chakra-ui/react";
import { SABOTAGE_COSTS, type SabotageAction } from "../../types";

interface SabotagePanelProps {
  points: number;
  onSabotage: (action: SabotageAction) => void;
}

export function SabotagePanel({ points, onSabotage }: SabotagePanelProps) {
  if (points <= 0) return null;

  return (
    <Box
      p={4}
      borderRadius="xl"
      bg="whiteAlpha.50"
      borderWidth={1}
      borderColor="whiteAlpha.200"
      mt={6}
    >
      <Text fontSize="sm" fontWeight="medium" color="whiteAlpha.700" mb={3}>
        Sabotage ({points} pts)
      </Text>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {(Object.entries(SABOTAGE_COSTS) as [SabotageAction, number][]).map(
          ([action, cost]) => (
            <Button
              key={action}
              size="sm"
              colorScheme="brand"
              variant="outline"
              isDisabled={points < cost}
              onClick={() => onSabotage(action)}
            >
              {action} ({cost} pt{cost > 1 ? "s" : ""})
            </Button>
          ),
        )}
      </Box>
      <Text fontSize="xs" color="whiteAlpha.500" mt={2}>
        Unflip: flip back opponent&apos;s last card • Shuffle: scramble their
        unmatched cards • Freeze: block them for 5s
      </Text>
    </Box>
  );
}
