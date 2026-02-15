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
    <button
      type="button"
      onClick={onFlip}
      disabled={!canFlip}
      className={`
        relative w-full aspect-square rounded-xl border-2 overflow-hidden
        transition-all duration-300
        ${canFlip ? 'cursor-pointer hover:scale-[1.02] hover:border-rose-400/50' : 'cursor-default'}
        ${isMatched ? 'border-emerald-500/50 bg-emerald-500/20' : 'border-white/20 bg-white/5'}
        ${isUnflipping ? 'animate-pulse' : ''}
      `}
      style={{ perspective: '600px' }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: showFront ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/10 border-inherit rounded-[10px]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-3xl text-white/50 font-bold">?</span>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-[10px]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className="text-4xl">{emoji}</span>
        </div>
      </div>
    </button>
  );
}
