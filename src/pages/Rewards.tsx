import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Volume2, VolumeX } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StreakCard from "@/components/rewards/StreakCard";
import FocusTimer from "@/components/rewards/FocusTimer";
import EdnaRoom from "@/components/rewards/EdnaRoom";
import { useRewards } from "@/hooks/use-rewards";

const Rewards = () => {
  const { state, updateSettings, resetAll } = useRewards();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 md:py-10 px-4">
        <div className="container max-w-5xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary uppercase tracking-wide">
              Your rewards
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              A predictable, low-pressure way to keep showing up. Effort earns coins,
              streaks build gently, and Edna keeps you company while you work.
            </p>
          </header>

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => updateSettings({ lowStim: !state.settings.lowStim })}
              aria-pressed={state.settings.lowStim}
              className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full border transition-colors ${
                state.settings.lowStim
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:border-primary"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Low-stim mode {state.settings.lowStim ? "on" : "off"}
            </button>
            <button
              onClick={() => updateSettings({ sound: !state.settings.sound })}
              aria-pressed={state.settings.sound}
              className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full border transition-colors ${
                state.settings.sound
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:border-primary"
              }`}
            >
              {state.settings.sound ? (
                <Volume2 className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <VolumeX className="h-3.5 w-3.5" aria-hidden />
              )}
              Sound {state.settings.sound ? "on" : "off"}
            </button>
            <button
              onClick={() => {
                if (window.confirm("Reset all rewards, coins, and items?")) resetAll();
              }}
              className="ml-auto text-xs font-semibold text-muted-foreground hover:text-destructive"
            >
              Reset progress
            </button>
          </div>

          <div className="grid gap-6">
            <StreakCard />
            <FocusTimer />
            <EdnaRoom />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rewards;
