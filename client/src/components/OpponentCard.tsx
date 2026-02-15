interface OpponentCardProps {
  emoji: string;
  isMatched: boolean;
  isFlipped: boolean;
}

export function OpponentCard({ emoji, isMatched, isFlipped }: OpponentCardProps) {
  const showFront = isFlipped || isMatched;

  return (
    <div
      className={`
        relative w-full aspect-square rounded-xl border-2 overflow-hidden
        flex items-center justify-center
        ${isMatched ? 'border-emerald-500/50 bg-emerald-500/20' : 'border-white/20 bg-white/5'}
      `}
    >
      <span className="text-3xl">
        {showFront ? emoji : '?'}
      </span>
    </div>
  );
}
