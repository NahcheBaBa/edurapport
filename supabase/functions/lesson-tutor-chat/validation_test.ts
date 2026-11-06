import { lessonTutorContexts, parseLessonTutorRequest } from "./validation.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const threadId = "123e4567-e89b-42d3-a456-426614174000";
const validMessage = { id: "message-1", role: "user", parts: [{ type: "text", text: "Explain nouns" }] };

Deno.test("accepts a text question for a catalog lesson and valid thread", () => {
  const parsed = parseLessonTutorRequest({ lessonId: "parts-of-speech", threadId, messages: [validMessage] });
  assert(parsed.success, "Expected a valid lesson tutor request");
  assert(parsed.data.lessonId === "parts-of-speech", "Unexpected lesson id");
});

Deno.test("rejects lesson ids outside the learner lesson catalog", () => {
  const parsed = parseLessonTutorRequest({ lessonId: "made-up-lesson", threadId, messages: [validMessage] });
  assert(!parsed.success, "Unknown lesson must be rejected");
});

Deno.test("rejects invalid thread IDs and non-user last messages", () => {
  const badId = parseLessonTutorRequest({ lessonId: "parts-of-speech", threadId: "not-a-uuid", messages: [validMessage] });
  const badLastMessage = parseLessonTutorRequest({
    lessonId: "parts-of-speech",
    threadId,
    messages: [validMessage, { id: "message-2", role: "assistant", parts: [{ type: "text", text: "Hello" }] }],
  });
  assert(!badId.success, "Invalid thread id must be rejected");
  assert(!badLastMessage.success, "A request ending with an assistant message must be rejected");
});

Deno.test("provides lesson-specific tutoring context for every current lesson", () => {
  assert(Object.keys(lessonTutorContexts).length === 5, "Expected context for each of the five lessons");
  assert(lessonTutorContexts["parts-of-speech"].context.includes("eight parts of speech"), "Missing grammar lesson context");
});