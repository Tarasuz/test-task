export interface Card {
  index: number;
  emoji: string;
  pairId: number;
}

export interface PlayerState {
  id: string;
  name: string;
  deck: Card[];
  flipped: { index: number; emoji: string; pairId: number }[];
  matched: { index: number; emoji: string; pairId: number }[];
  points: number;
  consecutiveMatches: number;
}

export interface GameState {
  player: PlayerState | null;
  opponent: PlayerState | null;
  roomId: string | null;
}

export type SabotageAction = 'unflip' | 'shuffle' | 'freeze';

export const SABOTAGE_COSTS: Record<SabotageAction, number> = {
  unflip: 1,
  shuffle: 2,
  freeze: 2,
};
