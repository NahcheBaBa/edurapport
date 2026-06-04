import { useEffect, useState } from "react";
import {
  Menu,
  Volume2,
  VolumeX,
  MinusCircle,
  PlusCircle,
  Type,
  PaintBucket,
  AlignJustify,
  RotateCcw,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const FONTS = [
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier", value: "'Courier New', monospace" },
];

const THEMES = [
  { label: "Default", bg: "", fg: "" },
  { label: "High Contrast", bg: "0 0% 0%", fg: "0 0% 100%" },
  { label: "Sepia", bg: "39 50% 92%", fg: "30 40% 15%" },
  { label: "Soft Blue", bg: "210 60% 96%", fg: "215 40% 18%" },
];

const STEP = 2;
const MIN_FONT = 12;
const MAX_FONT = 24;
const DEFAULT_FONT = 16;

export default function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT);
  const [fontFamily, setFontFamily] = useState("");
  const [theme, setTheme] = useState("Default");
  const [simplified, setSimplified] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    document.body.style.fontFamily = fontFamily;
  }, [fontFamily]);

  useEffect(() => {
    const t = THEMES.find((x) => x.label === theme);
    const root = document.documentElement;
    if (!t || !t.bg) {
      root.style.removeProperty("--background");
      root.style.removeProperty("--foreground");
    } else {
      root.style.setProperty("--background", t.bg);
      root.style.setProperty("--foreground", t.fg);
    }
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle("a11y-simplified", simplified);
  }, [simplified]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleSpeak = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.querySelector("main")?.innerText || document.body.innerText;
    const u = new SpeechSynthesisUtterance(text.slice(0, 4000));
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const reset = () => {
    setFontSize(DEFAULT_FONT);
    setFontFamily("");
    setTheme("Default");
    setSimplified(false);
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Open accessibility menu"
          className="fixed top-4 right-4 z-50 h-11 w-11 rounded-full shadow-md bg-background"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-primary text-primary-foreground border-l-0 w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-primary-foreground text-center text-lg font-bold">
            Accessibility Menu
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-2">
          <MenuItem icon={speaking ? VolumeX : Volume2} label={speaking ? "Stop Speech" : "Text to Speech"} onClick={toggleSpeak} active={speaking} />
          <MenuItem
            icon={MinusCircle}
            label="Decrease Font"
            onClick={() => setFontSize((s) => Math.max(MIN_FONT, s - STEP))}
          />
          <MenuItem
            icon={PlusCircle}
            label="Increase Font"
            onClick={() => setFontSize((s) => Math.min(MAX_FONT, s + STEP))}
          />

          <div className="pt-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <Type className="h-5 w-5" />
              <span className="font-semibold">Font Family</span>
            </div>
            <div className="flex flex-wrap gap-2 px-3 pb-2">
              {FONTS.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setFontFamily(f.value)}
                  style={{ fontFamily: f.value }}
                  className={`px-3 py-1.5 rounded-md border-2 border-primary-foreground text-sm transition-colors ${
                    fontFamily === f.value ? "bg-primary-foreground text-primary" : "bg-transparent"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <PaintBucket className="h-5 w-5" />
              <span className="font-semibold">Color Theme</span>
            </div>
            <div className="flex flex-wrap gap-2 px-3 pb-2">
              {THEMES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setTheme(t.label)}
                  className={`px-3 py-1.5 rounded-md border-2 border-primary-foreground text-sm ${
                    theme === t.label ? "bg-primary-foreground text-primary" : "bg-transparent"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <MenuItem
            icon={AlignJustify}
            label="Simplify Content"
            onClick={() => setSimplified((s) => !s)}
            active={simplified}
          />
          <MenuItem icon={RotateCcw} label="Reset Defaults" onClick={reset} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Menu;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left font-semibold transition-colors ${
        active ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}
