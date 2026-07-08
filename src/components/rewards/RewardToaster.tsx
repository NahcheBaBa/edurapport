import { useCallback, useEffect, useState } from "react";
import { Coins, Sparkles } from "lucide-react";
import { useRewardEvents, useRewards, type RewardEvent } from "@/hooks/use-rewards";

/**
 * Gentle, in-place celebration toast. Respects lowStim (no bounce, no confetti).
 * Mount once near the app root.
 */
const RewardToaster = () => {
  const { state } = useRewards();
  const [event, setEvent] = useState<RewardEvent | null>(null);

  const onEvent = useCallback((e: RewardEvent) => {
    setEvent(e);
    const t = window.setTimeout(() => setEvent(null), 2400);
    return () => window.clearTimeout(t);
  }, []);
  useRewardEvents(onEvent);

  if (!event) return null;

  const lowStim = state.settings.lowStim;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-full bg-card border border-border shadow-lg flex items-center gap-2 text-sm font-semibold text-foreground ${
        lowStim ? "" : "animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
      }`}
    >
      {event.badge ? (
        <span className="text-lg leading-none" aria-hidden>{event.badge.emoji}</span>
      ) : event.celebrate ? (
        <Sparkles className={`h-4 w-4 text-primary ${lowStim ? "" : "animate-pulse"}`} aria-hidden />
      ) : (
        <Coins className="h-4 w-4 text-primary" aria-hidden />
      )}
      <span>{event.message}</span>
    </div>
  );
};

export default RewardToaster;
