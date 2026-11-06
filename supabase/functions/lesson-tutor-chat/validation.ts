export const lessonTutorContexts = {
  "parts-of-speech": {
    title: "Parts of Speech",
    subject: "English",
    context:
      "Teach the eight parts of speech: nouns name people, places, things, or ideas; pronouns replace nouns; verbs express actions or states; adjectives describe nouns or pronouns; adverbs modify verbs, adjectives, or other adverbs; prepositions show relationships; conjunctions connect words or clauses; interjections express strong feeling. Use simple examples and distinguish common confusions, such as adjectives vs. adverbs.",
  },
  tenses: {
    title: "Tenses",
    subject: "English",
    context:
      "Teach past, present, and future verb tenses, including regular -ed forms and common irregular verbs. Use clear examples to show when actions happen.",
  },
  "cell-biology": {
    title: "The Cell",
    subject: "Biology",
    context:
      "Teach cell structures and their functions: cell membrane, nucleus, DNA, mitochondria, ribosomes, endoplasmic reticulum, and Golgi apparatus. Keep explanations age-appropriate and distinguish cell parts accurately.",
  },
  "newtons-laws": {
    title: "Newton's Laws of Motion",
    subject: "Physics",
    context:
      "Teach Newton's three laws: inertia; net force equals mass times acceleration; and action-reaction force pairs. Use everyday examples and distinguish balanced from unbalanced forces.",
  },
  algebra: {
    title: "Algebra",
    subject: "Mathematics",
    context:
      "Teach algebra as using symbols for unknown values, then solving equations by keeping both sides balanced. Use simple numerical examples and explain each step.",
  },
} as const;

export type LessonTutorId = keyof typeof lessonTutorContexts;

export interface LessonTutorRequest {
  lessonId: LessonTutorId;
  threadId: string;
  messages: unknown[];
}

export function parseLessonTutorRequest(value: unknown):
  | { success: true; data: LessonTutorRequest }
  | { success: false; error: string } {
  if (!value || typeof value !== "object") {
    return { success: false, error: "This chat request is incomplete." };
  }

  const body = value as Record<string, unknown>;
  if (typeof body.lessonId !== "string" || !(body.lessonId in lessonTutorContexts)) {
    return { success: false, error: "Choose a lesson before asking the tutor." };
  }

  if (
    typeof body.threadId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.threadId)
  ) {
    return { success: false, error: "This conversation link is invalid. Start a new chat." };
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 100) {
    return { success: false, error: "This conversation is too long. Start a new chat to continue." };
  }

  const messages = body.messages;
  if (messages.some((message) => !message || typeof message !== "object" || !["user", "assistant"].includes((message as Record<string, unknown>).role as string))) {
    return { success: false, error: "This conversation contains an unsupported message." };
  }

  const lastMessage = messages[messages.length - 1] as Record<string, unknown>;
  if (lastMessage.role !== "user") {
    return { success: false, error: "Send a question before asking the tutor to reply." };
  }

  let totalTextLength = 0;
  let latestUserTextLength = 0;
  for (const rawMessage of messages) {
    const message = rawMessage as Record<string, unknown>;
    if (!Array.isArray(message.parts)) {
      return { success: false, error: "This conversation contains an unsupported message." };
    }
    for (const rawPart of message.parts) {
      if (!rawPart || typeof rawPart !== "object") {
        return { success: false, error: "This conversation contains an unsupported message." };
      }
      const part = rawPart as Record<string, unknown>;
      const isText = part.type === "text" && typeof part.text === "string";
      const isReasoning = message.role === "assistant" && part.type === "reasoning" && typeof part.text === "string";
      if (!isText && !isReasoning) {
        return { success: false, error: "This chat only supports text messages." };
      }
      const length = (part.text as string).length;
      totalTextLength += length;
      if (message.role === "user") latestUserTextLength += length;
    }
  }

  if (latestUserTextLength === 0) {
    return { success: false, error: "Type a question before sending." };
  }
  if (latestUserTextLength > 4000 || totalTextLength > 60000) {
    return { success: false, error: "This message or conversation is too long. Start a new chat or shorten your message." };
  }

  return {
    success: true,
    data: {
      lessonId: body.lessonId as LessonTutorId,
      threadId: body.threadId,
      messages,
    },
  };
}