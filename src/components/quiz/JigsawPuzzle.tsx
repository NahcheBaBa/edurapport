import { useMemo } from "react";
import pollockPainting from "@/assets/pollock-painting.jpg";

interface JigsawPuzzleProps {
  revealedPieces: Set<number>;
  totalPieces: number;
  imageSrc?: string;
  cols?: number;
  rows?: number;
}

const JigsawPuzzle = ({ revealedPieces, totalPieces, imageSrc, cols, rows }: JigsawPuzzleProps) => {
  const COLS = cols ?? 5;
  const ROWS = rows ?? 4;
  const src = imageSrc ?? pollockPainting;
  const allRevealed = revealedPieces.size === totalPieces;

  // Shuffle mapping: question index -> grid position (deterministic)
  const pieceMap = useMemo(() => {
    const order = Array.from({ length: totalPieces }, (_, i) => i);
    // Simple seeded shuffle
    for (let i = order.length - 1; i > 0; i--) {
      const j = (i * 7 + 3) % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }, [totalPieces]);

  return (
    <div className="w-full">
      <div
        className={`relative w-full overflow-hidden rounded-2xl border-2 transition-all duration-700 ${
          allRevealed ? "border-primary shadow-lg" : "border-border"
        }`}
        style={{ aspectRatio: `${COLS}/${ROWS}` }}
      >
        {/* Full image behind */}
        <img
          src={src}
          alt="Puzzle artwork"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Grid overlay of masks */}
        {!allRevealed && (
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {Array.from({ length: totalPieces }, (_, gridIdx) => {
              const isRevealed = Array.from(revealedPieces).some(
                (qIdx) => pieceMap[qIdx] === gridIdx
              );
              return (
                <div
                  key={gridIdx}
                  className={`border border-border/60 transition-all duration-500 ${
                    isRevealed
                      ? "bg-transparent"
                      : "bg-background/95 backdrop-blur-sm"
                  }`}
                  style={{
                    boxShadow: isRevealed
                      ? "inset 0 0 0 1px hsl(var(--primary) / 0.3)"
                      : "none",
                  }}
                >
                  {!isRevealed && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-sm border-2 border-dashed border-muted-foreground/20" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Celebration overlay */}
        {allRevealed && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 bg-gradient-to-t from-black/40 to-transparent">
            <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              <p className="text-primary-foreground font-heading font-extrabold text-lg md:text-xl drop-shadow-lg">
                🎉 Well done! You unlocked the full picture!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Progress counter */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-heading font-bold text-foreground">
          Puzzle Progress
        </span>
        <span className="font-body font-semibold text-primary">
          {revealedPieces.size} / {totalPieces} pieces
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full gradient-primary rounded-full transition-all duration-500"
          style={{
            width: `${(revealedPieces.size / totalPieces) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default JigsawPuzzle;
