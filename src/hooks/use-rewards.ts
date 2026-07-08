import { useCallback, useEffect, useState } from "react";

/**
 * Local-only rewards store.
 * Keeps things predictable for neurodivergent learners:
 * - Rewards effort (any attempt earns a small coin) AND accuracy (bigger reward for correct).
 * - Streak counts a "day" as any day with at least one activity — no punishment for effort days.
 * - Milestone badges are unlocked from the same state, so they stay in sync with progress.
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

export type Achievement = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  group: "streak" | "quiz" | "daily" | "coins" | "focus";
  coinReward: number;
  /** Returns true when the state qualifies for this badge. */
  isEarned: (s: RewardsState) => boolean;
  /** Optional progress display (current / target). */
  progress?: (s: RewardsState) => { current: number; target: number };
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "Complete your very first activity.",
    emoji: "🌱",
    group: "quiz",
    coinReward: 5,
    isEarned: (s) => s.totalActivities >= 1,
    progress: (s) => ({ current: Math.min(s.totalActivities, 1), target: 1 }),
  },
  {
    id: "quiz-rookie",
    name: "Quiz Rookie",
    description: "Finish a full quiz set from start to end.",
    emoji: "📘",
    group: "quiz",
    coinReward: 10,
    isEarned: (s) => s.quizSetsCompleted >= 1,
    progress: (s) => ({ current: Math.min(s.quizSetsCompleted, 1), target: 1 }),
  },
  {
    id: "quiz-explorer",
    name: "Quiz Explorer",
    description: "Complete 5 quiz sets.",
    emoji: "🧭",
    group: "quiz",
    coinReward: 25,
    isEarned: (s) => s.quizSetsCompleted >= 5,
    progress: (s) => ({ current: Math.min(s.quizSetsCompleted, 5), target: 5 }),
  },
  {
    id: "perfect-mind",
    name: "Perfect Mind",
    description: "Score 100% on a quiz set.",
    emoji: "🏆",
    group: "quiz",
    coinReward: 30,
    isEarned: (s) => s.perfectQuizSets >= 1,
    progress: (s) => ({ current: Math.min(s.perfectQuizSets, 1), target: 1 }),
  },
  {
    id: "streak-3",
    name: "Warming Up",
    description: "Show up 3 days in a row.",
    emoji: "🔥",
    group: "streak",
    coinReward: 15,
    isEarned: (s) => s.streak >= 3 || s.longestStreak >= 3,
    progress: (s) => ({ current: Math.min(Math.max(s.streak, s.longestStreak), 3), target: 3 }),
  },
  {
    id: "streak-7",
    name: "Week Strong",
    description: "Show up 7 days in a row.",
    emoji: "💪",
    group: "streak",
    coinReward: 40,
    isEarned: (s) => s.streak >= 7 || s.longestStreak >= 7,
    progress: (s) => ({ current: Math.min(Math.max(s.streak, s.longestStreak), 7), target: 7 }),
  },
  {
    id: "streak-30",
    name: "Monthly Habit",
    description: "A 30-day streak. Wow.",
    emoji: "🌟",
    group: "streak",
    coinReward: 100,
    isEarned: (s) => s.streak >= 30 || s.longestStreak >= 30,
    progress: (s) => ({ current: Math.min(Math.max(s.streak, s.longestStreak), 30), target: 30 }),
  },
  {
    id: "daily-goal-1",
    name: "Goal Getter",
    description: "Hit your daily goal for the first time.",
    emoji: "🎯",
    group: "daily",
    coinReward: 10,
    isEarned: (s) => s.dailyGoalsHit >= 1,
    progress: (s) => ({ current: Math.min(s.dailyGoalsHit, 1), target: 1 }),
  },
  {
    id: "daily-goal-7",
    name: "Consistent",
    description: "Hit your daily goal 7 times.",
    emoji: "📅",
    group: "daily",
    coinReward: 35,
    isEarned: (s) => s.dailyGoalsHit >= 7,
    progress: (s) => ({ current: Math.min(s.dailyGoalsHit, 7), target: 7 }),
  },
  {
    id: "coins-100",
    name: "Coin Collector",
    description: "Earn 100 coins in total.",
    emoji: "🪙",
    group: "coins",
    coinReward: 10,
    isEarned: (s) => s.totalCoinsEarned >= 100,
    progress: (s) => ({ current: Math.min(s.totalCoinsEarned, 100), target: 100 }),
  },
  {
    id: "coins-500",
    name: "Treasure Keeper",
    description: "Earn 500 coins in total.",
    emoji: "💎",
    group: "coins",
    coinReward: 50,
    isEarned: (s) => s.totalCoinsEarned >= 500,
    progress: (s) => ({ current: Math.min(s.totalCoinsEarned, 500), target: 500 }),
  },
  {
    id: "focus-first",
    name: "Deep Focus",
    description: "Finish your first focus timer session.",
    emoji: "⏳",
    group: "focus",
    coinReward: 10,
    isEarned: (s) => s.focusSessionsCompleted >= 1,
    progress: (s) => ({ current: Math.min(s.focusSessionsCompleted, 1), target: 1 }),
  },
];

export type RewardsState = {
  coins: number;
  totalCoinsEarned: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null; // yyyy-mm-dd
  dailyGoal: number; // number of activities per day
  todayCount: number;
  todayDate: string | null;
  totalActivities: number;
  quizSetsCompleted: number;
  perfectQuizSets: number;
  dailyGoalsHit: number;
  focusSessionsCompleted: number;
  completedQuizKeys: string[]; // dedup key per quiz-set completion
  unlockedBadges: string[];
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
  totalCoinsEarned: 0,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  dailyGoal: 3,
  todayCount: 0,
  todayDate: null,
  totalActivities: 0,
  quizSetsCompleted: 0,
  perfectQuizSets: 0,
  dailyGoalsHit: 0,
  focusSessionsCompleted: 0,
  completedQuizKeys: [],
  unlockedBadges: [],
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
    return {
      ...defaultState,
      ...parsed,
      settings: { ...defaultState.settings, ...(parsed.settings || {}) },
    };
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
  badge?: Achievement;
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

/**
 * Unlock any newly-earned badges based on the given state.
 * Returns the updated state plus the list of freshly-unlocked achievements
 * (with their coin rewards already added to `coins` / `totalCoinsEarned`).
 */
function evaluateBadges(state: RewardsState): { state: RewardsState; unlocked: Achievement[] } {
  const unlocked: Achievement[] = [];
  let coins = state.coins;
  let totalCoinsEarned = state.totalCoinsEarned;
  const owned = new Set(state.unlockedBadges);

  for (const a of ACHIEVEMENTS) {
    if (owned.has(a.id)) continue;
    if (a.isEarned(state)) {
      owned.add(a.id);
      coins += a.coinReward;
      totalCoinsEarned += a.coinReward;
      unlocked.push(a);
    }
  }
  return {
    state: { ...state, coins, totalCoinsEarned, unlockedBadges: Array.from(owned) },
    unlocked,
  };
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

      const wasNewDay = current.todayDate !== t;
      const todayCount = (wasNewDay ? 0 : current.todayCount) + 1;
      const reachedGoal = todayCount === current.dailyGoal;
      if (reachedGoal) coinsDelta += 10;

      const merged: RewardsState = {
        ...current,
        coins: current.coins + coinsDelta,
        totalCoinsEarned: current.totalCoinsEarned + coinsDelta,
        streak,
        longestStreak: Math.max(current.longestStreak, streak),
        lastActiveDate: t,
        todayDate: t,
        todayCount,
        totalActivities: current.totalActivities + 1,
        dailyGoalsHit: current.dailyGoalsHit + (reachedGoal ? 1 : 0),
      };

      const { state: next, unlocked } = evaluateBadges(merged);
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
      // Emit a follow-up event for each newly unlocked badge.
      unlocked.forEach((a, i) => {
        window.setTimeout(() => {
          emit({
            coinsDelta: a.coinReward,
            message: `Badge unlocked: ${a.name}! +${a.coinReward} coins`,
            celebrate: true,
            badge: a,
          });
        }, 700 + i * 900);
      });
      return evt;
    },
    []
  );

  /**
   * Called once when a quiz set is finished. Deduped by `key` so replays
   * don't inflate stats. `correct` / `total` count final scored answers.
   */
  const completeQuizSet = useCallback(
    (opts: { key: string; correct: number; total: number }) => {
      const current = readState();
      if (current.completedQuizKeys.includes(opts.key)) return;

      const bonus = opts.correct === opts.total ? 25 : 10;
      const merged: RewardsState = {
        ...current,
        coins: current.coins + bonus,
        totalCoinsEarned: current.totalCoinsEarned + bonus,
        quizSetsCompleted: current.quizSetsCompleted + 1,
        perfectQuizSets: current.perfectQuizSets + (opts.correct === opts.total ? 1 : 0),
        completedQuizKeys: [...current.completedQuizKeys, opts.key],
      };
      const { state: next, unlocked } = evaluateBadges(merged);
      writeState(next);
      setState(next);

      emit({
        coinsDelta: bonus,
        message:
          opts.correct === opts.total
            ? `Perfect set! +${bonus} coins`
            : `Quiz set complete! +${bonus} coins`,
        celebrate: true,
      });
      unlocked.forEach((a, i) => {
        window.setTimeout(() => {
          emit({
            coinsDelta: a.coinReward,
            message: `Badge unlocked: ${a.name}! +${a.coinReward} coins`,
            celebrate: true,
            badge: a,
          });
        }, 700 + i * 900);
      });
    },
    []
  );

  const completeFocusSession = useCallback(() => {
    const current = readState();
    const merged: RewardsState = {
      ...current,
      focusSessionsCompleted: current.focusSessionsCompleted + 1,
      coins: current.coins + 5,
      totalCoinsEarned: current.totalCoinsEarned + 5,
    };
    const { state: next, unlocked } = evaluateBadges(merged);
    writeState(next);
    setState(next);
    emit({ coinsDelta: 5, message: "Focus session done. +5 coins", celebrate: false });
    unlocked.forEach((a, i) => {
      window.setTimeout(() => {
        emit({
          coinsDelta: a.coinReward,
          message: `Badge unlocked: ${a.name}! +${a.coinReward} coins`,
          celebrate: true,
          badge: a,
        });
      }, 700 + i * 900);
    });
  }, []);

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

  return {
    state,
    applyActivity,
    completeQuizSet,
    completeFocusSession,
    buyItem,
    equipItem,
    setDailyGoal,
    updateSettings,
    resetAll,
  };
}
