import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import EdnaAvatar from "./EdnaAvatar";
import { useRewards } from "@/hooks/use-rewards";

/**
 * Body-doubling focus timer. Edna sits next to the learner and works "with" them.
 * Predictable structure: fixed focus/break lengths, big "what's next" label,
 * gentle chime (respects sound setting), no surprise transitions.
 */
const PRESETS = [
  { label: "5 min warm-up", focus: 5, brk: 2 },
  { label: "15 min focus", focus: 15, brk: 3 },
  { label: "25 min pomodoro", focus: 25, brk: 5 },
];

const BREAK_PROMPTS = [
  "Stand up and stretch your arms.",
  "Take 3 slow breaths.",
  "Sip some water.",
  "Look at something 20 feet away for 20 seconds.",
  "Wiggle your fingers and toes.",
];

const FocusTimer = () => {
  const { state, applyActivity, completeFocusSession } = useRewards();
  const [presetIdx, setPresetIdx] = useState(1);
  const preset = PRESETS[presetIdx];
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [secondsLeft, setSecondsLeft] = useState(preset.focus * 60);
  const [running, setRunning] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);
  const tickRef = useRef<number | null>(null);
  const awardedRef = useRef(false);

  useEffect(() => {
    setSecondsLeft(preset.focus * 60);
    setPhase("focus");
    setRunning(false);
    awardedRef.current = false;
  }, [presetIdx, preset.focus]);

  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (secondsLeft > 0) return;
    if (phase === "focus" && !awardedRef.current) {
      awardedRef.current = true;
      applyActivity({ effortOnly: true, kind: "focus-session" });
      completeFocusSession();
      if (state.settings.sound) chime();
      setPromptIdx(Math.floor(Math.random() * BREAK_PROMPTS.length));
      setPhase("break");
      setSecondsLeft(preset.brk * 60);
    } else if (phase === "break") {
      if (state.settings.sound) chime();
      setRunning(false);
      setPhase("focus");
      setSecondsLeft(preset.focus * 60);
      awardedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const total = (phase === "focus" ? preset.focus : preset.brk) * 60;
  const pct = ((total - secondsLeft) / total) * 100;

  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setSecondsLeft(preset.focus * 60);
    awardedRef.current = false;
  };

  return (
    <section
      aria-labelledby="focus-timer-heading"
      className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm"
    >
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <EdnaAvatar equipped={state.equipped} size="md" />

        <div className="flex-1 w-full">
          <h2 id="focus-timer-heading" className="text-xl font-heading font-extrabold text-primary">
            Study with Edna
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {phase === "focus"
              ? "Edna sits with you while you work. Next: a short break."
              : `Break time. Next: back to focus. Try: ${BREAK_PROMPTS[promptIdx]}`}
          </p>

          <div className="flex flex-wrap gap-2 mt-4" role="radiogroup" aria-label="Session length">
            {PRESETS.map((p, i) => (
              <button
                key={p.label}
                role="radio"
                aria-checked={presetIdx === i}
                onClick={() => setPresetIdx(i)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                  presetIdx === i
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:border-primary"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                {phase === "break" ? <Coffee className="h-3.5 w-3.5" aria-hidden /> : null}
                {phase === "focus" ? "Focus" : "Break"}
              </span>
              <span className="text-4xl md:text-5xl font-heading font-extrabold tabular-nums text-foreground">
                {mm}:{ss}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${state.settings.lowStim ? "" : "transition-all duration-500"} ${
                  phase === "focus" ? "gradient-primary" : "bg-secondary"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <Button
              onClick={() => setRunning((r) => !r)}
              className="gradient-primary text-primary-foreground gap-2 min-w-32"
            >
              {running ? <Pause size={16} /> : <Play size={16} />}
              {running ? "Pause" : phase === "focus" ? "Start focus" : "Start break"}
            </Button>
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw size={16} />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

function chime() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 660;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    o.stop(ctx.currentTime + 0.65);
    setTimeout(() => ctx.close(), 800);
  } catch {
    /* ignore */
  }
}

export default FocusTimer;
