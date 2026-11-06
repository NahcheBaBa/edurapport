import type { UIMessage } from "ai";

export interface LessonChatThread {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
}

interface LessonChatStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function getLessonChatStorageKey(lessonId: string) {
  return `edurapport.lesson-chat.v1.${encodeURIComponent(lessonId)}`;
}

export function loadLessonChatThreads(storage: LessonChatStorage, lessonId: string): LessonChatThread[] {
  try {
    const saved = storage.getItem(getLessonChatStorageKey(lessonId));
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is LessonChatThread => {
        if (!item || typeof item !== "object") return false;
        const thread = item as Partial<LessonChatThread>;
        return (
          typeof thread.id === "string" &&
          typeof thread.title === "string" &&
          typeof thread.updatedAt === "number" &&
          Array.isArray(thread.messages)
        );
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveLessonChatThreads(storage: LessonChatStorage, lessonId: string, threads: LessonChatThread[]) {
  storage.setItem(getLessonChatStorageKey(lessonId), JSON.stringify(threads));
}

export function createLessonChatThread(id: string, now = Date.now()): LessonChatThread {
  return { id, title: "New conversation", updatedAt: now, messages: [] };
}

export function updateLessonChatThread(
  threads: LessonChatThread[],
  threadId: string,
  messages: UIMessage[],
  now = Date.now(),
): LessonChatThread[] {
  const firstPrompt = messages
    .find((message) => message.role === "user")
    ?.parts.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
    .trim();
  const title = firstPrompt
    ? firstPrompt.length > 36
      ? `${firstPrompt.slice(0, 35).trimEnd()}…`
      : firstPrompt
    : "New conversation";

  return threads
    .map((thread) =>
      thread.id === threadId ? { ...thread, title, updatedAt: now, messages } : thread,
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getOrCreateLessonChatThread(
  storage: LessonChatStorage,
  lessonId: string,
  createId: () => string,
  now = Date.now(),
) {
  const threads = loadLessonChatThreads(storage, lessonId);
  const existing = threads[0];
  if (existing) return { thread: existing, threads };

  const thread = createLessonChatThread(createId(), now);
  const nextThreads = [thread];
  saveLessonChatThreads(storage, lessonId, nextThreads);
  return { thread, threads: nextThreads };
}