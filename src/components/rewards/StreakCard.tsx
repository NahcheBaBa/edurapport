import { Flame, Target, Coins } from "lucide-react";
import { useRewards } from "@/hooks/use-rewards";

const StreakCard = () => {
  const { state, setDailyGoal } = useRewards();
  const pct = Math.min(100, (state.todayCount / state.dailyGoal) * 100);
  const remaining = Math.max(0, state.dailyGoal - state.todayCount);

  return (
    <section
      aria-labelledby="streak-heading"
      className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <h2 id="streak-heading" className="text-xl font-heading font-extrabold text-primary">
          Today's plan
        </h2>
        <div className="flex items-center gap-4 text-sm font-bold text-foreground">
          <span className="inline-flex items-center gap-1.5" aria-label={`${state.streak} day streak`}>
            <Flame className="h-4 w-4 text-primary" aria-hidden />
            {state.streak} day{state.streak === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center gap-1.5" aria-label={`${state.coins} coins`}>
            <Coins className="h-4 w-4 text-primary" aria-hidden />
            {state.coins}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm font-semibold text-foreground inline-flex items-center gap-1.5">
            <Target className="h-4 w-4 text-primary" aria-hidden />
            {state.todayCount} of {state.dailyGoal} activities today
          </span>
          <span className="text-xs text-muted-foreground">
            {remaining === 0 ? "Goal reached — anything else is a bonus." : `${remaining} to go`}
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full gradient-primary rounded-full ${state.settings.lowStim ? "" : "transition-all duration-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
          Daily goal
        </legend>
        <div className="flex gap-2" role="radiogroup" aria-label="Daily goal">
          {[1, 3, 5, 8].map((n) => (
            <button
              key={n}
              role="radio"
              aria-checked={state.dailyGoal === n}
              onClick={() => setDailyGoal(n)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                state.dailyGoal === n
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:border-primary"
              }`}
            >
              {n} / day
            </button>
          ))}
        </div>
      </fieldset>

      <p className="text-xs text-muted-foreground mt-4">
        Any lesson, quiz, or focus session counts. Trying is enough — you earn a coin
        every time you show up, and more when you get answers right.
      </p>
    </section>
  );
};

export default StreakCard;
