import { describe, expect, it } from "vitest";
import {
  createLessonChatThread,
  getLessonChatStorageKey,
  getOrCreateLessonChatThread,
  loadLessonChatThreads,
  saveLessonChatThreads,
  updateLessonChatThread,
} from "@/lib/lesson-chat-storage";

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
};

describe("lesson chat browser history", () => {
  it("keeps each lesson's saved conversations separate", () => {
    const storage = memoryStorage();
    const thread = createLessonChatThread("thread-a", 100);
    saveLessonChatThreads(storage, "parts-of-speech", [thread]);

    expect(loadLessonChatThreads(storage, "parts-of-speech")).toEqual([thread]);
    expect(loadLessonChatThreads(storage, "algebra")).toEqual([]);
    expect(getLessonChatStorageKey("parts-of-speech")).not.toBe(getLessonChatStorageKey("algebra"));
  });

  it("restores an existing lesson conversation without creating a duplicate", () => {
    const storage = memoryStorage();
    const existing = createLessonChatThread("thread-a", 100);
    saveLessonChatThreads(storage, "parts-of-speech", [existing]);

    const result = getOrCreateLessonChatThread(storage, "parts-of-speech", () => "thread-b", 200);

    expect(result.thread.id).toBe("thread-a");
    expect(result.threads).toHaveLength(1);
  });

  it("uses the first learner message as the conversation title", () => {
    const thread = createLessonChatThread("thread-a", 100);
    const updated = updateLessonChatThread(
      [thread],
      "thread-a",
      [{ id: "message-a", role: "user", parts: [{ type: "text", text: "Explain nouns" }] }],
      200,
    );

    expect(updated[0]?.title).toBe("Explain nouns");
    expect(updated[0]?.updatedAt).toBe(200);
  });
});