import { useCallback, useEffect, useState } from "react";

/**
 * Local-only rewards store.
 * Keeps things predictable for neurodivergent learners:
 * - Rewards effort (any attempt earns a small coin) AND accuracy (bigger reward for correct).
 * - Streak counts a "day" as any day with at least one activity — no punishment for effort days.
 * - All celebrations respect the `lowStim` setting.
 */

export type RoomItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  slot: "hat" | "accessory" | "background" | "companion";
};

export const SHOP_ITEMS: RoomItem[] = [
  { id: "hat-crown", name: "Sparkle Crown", emoji: "👑", price: 30, slot: "hat" },
  { id: "hat-beanie", name: "Cozy Beanie", emoji: "🧢", price: 15, slot: "hat" },
  { id: "hat-flower", name: "Flower Wreath", emoji: "🌸", price: 20, slot: "hat" },
  { id: "acc-headphones", name: "Focus Headphones", emoji: "🎧", price: 25, slot: "accessory" },
  { id: "acc-scarf", name: "Rainbow Scarf", emoji: "🧣", price: 20, slot: "accessory" },
  { id: "acc-glasses", name: "Reading Glasses", emoji: "🤓", price: 15, slot: "accessory" },
  { id: "bg-forest", name: "Calm Forest", emoji: "🌲", price: 40, slot: "background" },
  { id: "bg-space", name: "Starry Space", emoji: "🌌", price: 50, slot: "background" },
  { id: "bg-beach", name: "Sunny Beach", emoji: "🏝️", price: 40, slot: "background" },
  { id: "pet-cat", name: "Study Cat", emoji: "🐱", price: 35, slot: "companion" },
  { id: "pet-dog", name: "Loyal Pup", emoji: "🐶", price: 35, slot: "companion" },
  { id: "pet-owl", name: "Wise Owl", emoji: "🦉", price: 45, slot: "companion" },
];

export type RewardsState = {
  coins: number;
  streak: number;
  lastActiveDate: string | null; // yyyy-mm-dd
  dailyGoal: number; // number of activities per day
  todayCount: number;
  todayDate: string | null;
  totalActivities: number;
  ownedItems: string[];
  equipped: Partial<Record<RoomItem["slot"], string>>;
  settings: {
    lowStim: boolean; // gentle animations, no confetti
    sound: boolean;
  };
};

const STORAGE_KEY = "edurapport.rewards.v1";

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const dayDiff = (a: string, b: string) => {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86_400_000);
};

const defaultState: RewardsState = {
  coins: 0,
  streak: 0,
  lastActiveDate: null,
  dailyGoal: 3,
  todayCount: 0,
  todayDate: null,
  totalActivities: 0,
  ownedItems: [],
  equipped: {},
  settings: { lowStim: false, sound: true },
};

function readState(): RewardsState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<RewardsState>;
    return { ...defaultState, ...parsed, settings: { ...defaultState.settings, ...(parsed.settings || {}) } };
  } catch {
    return defaultState;
  }
}

function writeState(s: RewardsState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent("rewards:update"));
  } catch {
    /* ignore */
  }
}

export type RewardEvent = {
  coinsDelta: number;
  message: string;
  celebrate: boolean;
};

let lastEvent: RewardEvent | null = null;
const eventListeners = new Set<(e: RewardEvent) => void>();

function emit(e: RewardEvent) {
  lastEvent = e;
  eventListeners.forEach((l) => l(e));
}

export function useRewardEvents(cb: (e: RewardEvent) => void) {
  useEffect(() => {
    eventListeners.add(cb);
    return () => {
      eventListeners.delete(cb);
    };
  }, [cb]);
}

export function getLastRewardEvent() {
  return lastEvent;
}

export function useRewards() {
  const [state, setState] = useState<RewardsState>(() => readState());

  useEffect(() => {
    const sync = () => setState(readState());
    window.addEventListener("rewards:update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("rewards:update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Reset today's counter when the calendar day flips.
  useEffect(() => {
    const t = todayStr();
    if (state.todayDate !== t) {
      const next = { ...state, todayDate: t, todayCount: 0 };
      writeState(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyActivity = useCallback(
    (opts: { correct?: boolean; effortOnly?: boolean; kind?: string }): RewardEvent => {
      const t = todayStr();
      const current = readState();

      // Streak update: any activity today keeps or advances streak.
      let streak = current.streak;
      if (current.lastActiveDate === t) {
        // already counted today
      } else if (current.lastActiveDate && dayDiff(current.lastActiveDate, t) === 1) {
        streak += 1;
      } else {
        streak = 1;
      }

      // Coin logic: base effort coin, bonus for correct.
      let coinsDelta = 1;
      if (opts.correct) coinsDelta = 5;
      if (opts.effortOnly) coinsDelta = 1;

      const todayCount = (current.todayDate === t ? current.todayCount : 0) + 1;
      const reachedGoal = todayCount === current.dailyGoal;
      if (reachedGoal) coinsDelta += 10;

      const next: RewardsState = {
        ...current,
        coins: current.coins + coinsDelta,
        streak,
        lastActiveDate: t,
        todayDate: t,
        todayCount,
        totalActivities: current.totalActivities + 1,
      };
      writeState(next);
      setState(next);

      const message = reachedGoal
        ? `Daily goal reached! +${coinsDelta} coins`
        : opts.correct
        ? `Nice thinking! +${coinsDelta} coins`
        : `Good effort! +${coinsDelta} coin`;

      const evt: RewardEvent = {
        coinsDelta,
        message,
        celebrate: reachedGoal,
      };
      emit(evt);
      return evt;
    },
    []
  );

  const buyItem = useCallback((id: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === id);
    if (!item) return false;
    const current = readState();
    if (current.ownedItems.includes(id)) return false;
    if (current.coins < item.price) return false;
    const next: RewardsState = {
      ...current,
      coins: current.coins - item.price,
      ownedItems: [...current.ownedItems, id],
      equipped: { ...current.equipped, [item.slot]: id },
    };
    writeState(next);
    setState(next);
    return true;
  }, []);

  const equipItem = useCallback((id: string | null, slot: RoomItem["slot"]) => {
    const current = readState();
    const equipped = { ...current.equipped };
    if (id === null) {
      delete equipped[slot];
    } else {
      equipped[slot] = id;
    }
    const next = { ...current, equipped };
    writeState(next);
    setState(next);
  }, []);

  const setDailyGoal = useCallback((n: number) => {
    const current = readState();
    const next = { ...current, dailyGoal: Math.max(1, Math.min(10, n)) };
    writeState(next);
    setState(next);
  }, []);

  const updateSettings = useCallback((patch: Partial<RewardsState["settings"]>) => {
    const current = readState();
    const next = { ...current, settings: { ...current.settings, ...patch } };
    writeState(next);
    setState(next);
  }, []);

  const resetAll = useCallback(() => {
    writeState(defaultState);
    setState(defaultState);
  }, []);

  return { state, applyActivity, buyItem, equipItem, setDailyGoal, updateSettings, resetAll };
}
