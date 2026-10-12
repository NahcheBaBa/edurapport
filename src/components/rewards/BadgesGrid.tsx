import { Download, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ACHIEVEMENTS, useRewards, type Achievement } from "@/hooks/use-rewards";
import { useToast } from "@/hooks/use-toast";

const canvasText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) => {
  let size = 64;
  ctx.font = `700 ${size}px "Nunito", sans-serif`;
  while (ctx.measureText(text).width > maxWidth && size > 34) {
    size -= 2;
    ctx.font = `700 ${size}px "Nunito", sans-serif`;
  }
  ctx.fillText(text, x, y, maxWidth);
};

const wrapCanvasText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) => {
  const words = text.split(/\s+/);
  let line = "";
  let lineY = y;
  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = nextLine;
    }
  }
  if (line) ctx.fillText(line, x, lineY);
};

const downloadBadgeCard = async (achievement: Achievement) => {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas could not be created");

  const styles = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
  const primary = `hsl(${token("--primary", "28 100% 55%")})`;
  const accent = `hsl(${token("--accent", "330 85% 55%")})`;
  const background = `hsl(${token("--background", "0 0% 100%")})`;
  const foreground = `hsl(${token("--foreground", "270 60% 30%")})`;
  const muted = `hsl(${token("--muted-foreground", "240 5% 45%")})`;
  const border = `hsl(${token("--border", "240 6% 90%")})`;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, 1148, 578);

  const gradient = ctx.createLinearGradient(28, 40, 470, 580);
  gradient.addColorStop(0, primary);
  gradient.addColorStop(1, accent);
  ctx.fillStyle = gradient;
  ctx.fillRect(28, 28, 420, 574);

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = background;
  ctx.beginPath();
  ctx.arc(92, 102, 158, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(422, 554, 184, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = foreground;
  ctx.font = '800 22px "Poppins", sans-serif';
  ctx.fillText("EDURAPPORT", 72, 86);

  ctx.fillStyle = background;
  ctx.beginPath();
  ctx.arc(238, 300, 128, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `${foreground}33`;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = '104px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(achievement.emoji, 238, 300);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = primary;
  ctx.font = '800 20px "Poppins", sans-serif';
  ctx.fillText("ACHIEVEMENT UNLOCKED", 504, 156);

  ctx.fillStyle = foreground;
  canvasText(ctx, achievement.name, 504, 246, 610);

  ctx.fillStyle = muted;
  ctx.font = '500 27px "Nunito", sans-serif';
  wrapCanvasText(ctx, achievement.description, 506, 306, 590, 38);

  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(504, 400);
  ctx.lineTo(1118, 400);
  ctx.stroke();

  ctx.fillStyle = foreground;
  ctx.font = '800 24px "Poppins", sans-serif';
  ctx.fillText(`+${achievement.coinReward} COINS`, 506, 454);
  ctx.fillStyle = muted;
  ctx.font = '600 18px "Nunito", sans-serif';
  ctx.fillText("A little progress adds up.", 506, 506);
  ctx.textAlign = "right";
  ctx.fillText("EDURAPPORT  ·  LEARN AT YOUR PACE", 1118, 558);
  ctx.textAlign = "left";

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("The badge image could not be saved");

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `edurapport-${achievement.id}-badge.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const groupLabels: Record<Achievement["group"], string> = {
  quiz: "Learning milestones",
  streak: "Streak milestones",
  daily: "Daily goals",
  coins: "Coin collector",
  focus: "Focus & wellbeing",
};

const BadgesGrid = () => {
  const { state } = useRewards();
  const { toast } = useToast();
  const [downloadingBadge, setDownloadingBadge] = useState<string | null>(null);
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
                      <>
                        <div className="text-[10px] font-bold text-primary mt-2 uppercase tracking-wide">
                          +{a.coinReward} coins
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full gap-1.5 px-2 text-[11px]"
                          disabled={downloadingBadge !== null}
                          aria-label={`Download share card for ${a.name}`}
                          onClick={async () => {
                            setDownloadingBadge(a.id);
                            try {
                              await downloadBadgeCard(a);
                              toast({ title: "Badge card downloaded", description: `${a.name} is ready to share.` });
                            } catch {
                              toast({ title: "Couldn't create the badge card", description: "Please try downloading it again." });
                            } finally {
                              setDownloadingBadge(null);
                            }
                          }}
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden />
                          {downloadingBadge === a.id ? "Creating…" : "Download card"}
                        </Button>
                      </>
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
