import { Lock } from "lucide-react";
import { ACHIEVEMENTS, useRewards, type Achievement } from "@/hooks/use-rewards";

const groupLabels: Record<Achievement["group"], string> = {
  quiz: "Learning milestones",
  streak: "Streak milestones",
  daily: "Daily goals",
  coins: "Coin collector",
  focus: "Focus & wellbeing",
};

const BadgesGrid = () => {
  const { state } = useRewards();
  const unlocked = new Set(state.unlockedBadges);
  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlocked.has(a.id)).length;

  const groups = (Object.keys(groupLabels) as Achievement["group"][]).map((g) => ({
    group: g,
    label: groupLabels[g],
    items: ACHIEVEMENTS.filter((a) => a.group === g),
  }));

  return (
    <section
      aria-labelledby="badges-heading"
      className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 id="badges-heading" className="text-xl font-heading font-extrabold text-primary">
          Achievements
        </h2>
        <span className="text-xs font-bold text-muted-foreground">
          {unlockedCount} of {totalCount} unlocked
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Badges unlock automatically when you hit a milestone. No pressure — they'll be
        here whenever you get to them.
      </p>

      <div className="space-y-6">
        {groups.map(({ group, label, items }) => (
          <div key={group}>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
              {label}
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((a) => {
                const earned = unlocked.has(a.id);
                const prog = a.progress?.(state);
                const pct = prog ? Math.min(100, (prog.current / prog.target) * 100) : earned ? 100 : 0;
                return (
                  <li
                    key={a.id}
                    className={`relative rounded-2xl border p-4 flex flex-col items-center text-center transition-colors ${
                      earned
                        ? "bg-primary/10 border-primary/40"
                        : "bg-background border-border opacity-80"
                    }`}
                    aria-label={`${a.name}: ${earned ? "unlocked" : "locked"}. ${a.description}`}
                  >
                    <div
                      className={`text-3xl mb-1 ${earned ? "" : "grayscale"}`}
                      aria-hidden
                    >
                      {earned ? a.emoji : "🔒"}
                    </div>
                    <div className="text-sm font-bold text-foreground leading-tight">
                      {a.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
                      {a.description}
                    </div>
                    {prog && !earned && (
                      <div className="w-full mt-3">
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full gradient-primary rounded-full ${
                              state.settings.lowStim ? "" : "transition-all duration-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground mt-1">
                          {prog.current} / {prog.target}
                        </div>
                      </div>
                    )}
                    {earned && (
                      <div className="text-[10px] font-bold text-primary mt-2 uppercase tracking-wide">
                        +{a.coinReward} coins
                      </div>
                    )}
                    {!earned && !prog && (
                      <Lock className="h-3 w-3 text-muted-foreground absolute top-2 right-2" aria-hidden />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BadgesGrid;
