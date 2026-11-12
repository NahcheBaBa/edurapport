import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { AlertCircle, ArrowUp, Brain, MessageCircle, MessageSquarePlus, Plus, UserRound } from "lucide-react";
import heroCharacter from "@/assets/hero-character.png";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  createLessonChatThread,
  getLessonChatStorageKey,
  loadLessonChatThreads,
  saveLessonChatThreads,
  updateLessonChatThread,
  type LessonChatThread,
} from "@/lib/lesson-chat-storage";

interface LessonTutorChatProps {
  lessonId: string;
  lessonTitle: string;
  subject: string;
  isAuthenticated: boolean;
}

interface ChatBootstrap {
  threads: LessonChatThread[];
  initialThreadId: string;
}

const threadIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function makeThreadId() {
  return window.crypto.randomUUID();
}

function bootstrapChat(lessonId: string, routeThreadId?: string): ChatBootstrap {
  const threads = loadLessonChatThreads(window.localStorage, lessonId);
  const requestedId = routeThreadId && threadIdPattern.test(routeThreadId) ? routeThreadId : undefined;
  const existing = requestedId
    ? threads.find((thread) => thread.id === requestedId)
    : threads[0];
  if (existing) return { threads, initialThreadId: existing.id };

  const firstThread = createLessonChatThread(requestedId ?? makeThreadId());
  const nextThreads = [firstThread, ...threads];
  saveLessonChatThreads(window.localStorage, lessonId, nextThreads);
  return { threads: nextThreads, initialThreadId: firstThread.id };
}

function formatThreadTitle(thread: LessonChatThread) {
  return thread.title.length > 34 ? `${thread.title.slice(0, 33).trimEnd()}…` : thread.title;
}

function LessonTutorConversation({
  lessonId,
  lessonTitle,
  thread,
  isAuthenticated,
  onMessagesChange,
}: {
  lessonId: string;
  lessonTitle: string;
  thread: LessonChatThread;
  isAuthenticated: boolean;
  onMessagesChange: (messages: UIMessage[]) => void;
}) {
  const { toast } = useToast();
  const [draft, setDraft] = useState("");
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lesson-tutor-chat`,
        headers: async () => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          };
        },
        body: { lessonId, threadId: thread.id },
      }),
    [lessonId, thread.id],
  );
  const handleError = useCallback(
    (error: Error) => {
      toast({
        title: "Edna couldn’t reply",
        description: error.message || "Your message is still here. Please try again.",
        variant: "destructive",
      });
    },
    [toast],
  );
  const { messages, sendMessage, status, stop, error } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport,
    onError: handleError,
  });
  const isBusy = status === "submitted" || status === "streaming";
  const previousStatus = useRef(status);

  useEffect(() => {
    const updated = updateLessonChatThread(
      loadLessonChatThreads(window.localStorage, lessonId),
      thread.id,
      messages,
    );
    saveLessonChatThreads(window.localStorage, lessonId, updated);
    onMessagesChange(messages);
  }, [lessonId, messages, onMessagesChange, thread.id]);

  useEffect(() => {
    if (previousStatus.current !== "ready" && status === "ready") {
      document.querySelector<HTMLTextAreaElement>("[data-lesson-chat-composer]")?.focus();
    }
    previousStatus.current = status;
  }, [status]);

  useEffect(() => {
    if (isAuthenticated) {
      document.querySelector<HTMLTextAreaElement>("[data-lesson-chat-composer]")?.focus();
    }
  }, [isAuthenticated, thread.id]);

  const ask = useCallback(
    async (text: string) => {
      if (!text.trim() || isBusy || !isAuthenticated) return;
      await sendMessage({ text: text.trim() });
      setDraft("");
    },
    [isAuthenticated, isBusy, sendMessage],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-heading font-bold text-foreground">{lessonTitle}</p>
          <p className="text-xs text-muted-foreground">{subjectLabel(lessonId, lessonTitle)}</p>
        </div>
        <span className="shrink-0 text-[11px] text-muted-foreground">Saved in this browser</span>
      </div>

      <Conversation className="min-h-[330px] flex-1">
        <ConversationContent className="gap-5 p-4 md:p-5">
          {messages.length === 0 ? (
            <ConversationEmptyState
              className="min-h-[270px]"
              icon={<img src={heroCharacter} alt="Edna" className="size-14 object-contain" />}
              title="What would you like to explore?"
              description={`Ask Edna a question about ${lessonTitle.toLowerCase()}.`}
            >
              <div className="flex max-w-sm flex-col items-center gap-4">
                <img src={heroCharacter} alt="Edna" className="size-14 object-contain" />
                <div className="space-y-1">
                  <h3 className="font-heading text-sm font-bold">What would you like to explore?</h3>
                  <p className="text-sm text-muted-foreground">Ask Edna about {lessonTitle.toLowerCase()}.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Explain the main idea with an example",
                    "What should I remember from this lesson?",
                    "Quiz me on this topic",
                  ].map((prompt) => (
                    <Button
                      key={prompt}
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={!isAuthenticated || isBusy}
                      onClick={() => void ask(prompt)}
                      className="h-auto whitespace-normal py-2 text-left text-xs"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message, index) => {
              if (message.role !== "user" && message.role !== "assistant") return null;
              const reasoning = message.parts
                .filter((part) => part.type === "reasoning")
                .map((part) => part.text)
                .join("\n\n");
              const isLastMessage = index === messages.length - 1;
              const reasoningStreaming = isLastMessage && isBusy && message.parts.at(-1)?.type === "reasoning";

              return (
                <Message key={message.id} from={message.role} className="max-w-full">
                  {message.role === "assistant" && reasoning && (
                    <Reasoning className="w-full" isStreaming={reasoningStreaming}>
                      <ReasoningTrigger />
                      <ReasoningContent>{reasoning}</ReasoningContent>
                    </Reasoning>
                  )}
                  <MessageContent className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-transparent p-0"}>
                    {message.parts.map((part, partIndex) => {
                      if (part.type !== "text") return null;
                      return <MessageResponse key={`${message.id}-${partIndex}`}>{part.text}</MessageResponse>;
                    })}
                  </MessageContent>
                </Message>
              );
            })
          )}
          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="size-4" />
              <Shimmer>Edna is thinking…</Shimmer>
            </div>
          )}
          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-foreground">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <span>{error.message || "Your message couldn’t be sent. Please try again."}</span>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-3 md:p-4">
        {isAuthenticated ? (
          <PromptInput
            onSubmit={({ text }) => ask(text)}
            className="rounded-md"
            aria-label="Message Edna"
          >
            <PromptInputTextarea
              data-lesson-chat-composer
              aria-label="Message Edna about this lesson"
              placeholder="Ask a question about this lesson…"
              value={draft}
              disabled={isBusy}
              onChange={(event) => setDraft(event.currentTarget.value)}
              className="min-h-14 px-3"
            />
            <PromptInputFooter className="justify-end border-t border-border px-2 py-2">
              <PromptInputSubmit
                status={status}
                disabled={isBusy ? false : !draft.trim()}
                onStop={stop}
                aria-label={isBusy ? "Stop tutor reply" : "Send message"}
                className="size-8 rounded-md"
              >
                {isBusy ? <span className="sr-only">Stop tutor reply</span> : <ArrowUp className="size-4" />}
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Sign in to chat with Edna. Your chats stay in this browser.</p>
            <Button asChild size="sm" className="shrink-0 gap-2">
              <Link to="/login"><UserRound className="size-4" /> Sign in</Link>
            </Button>
          </div>
        )}
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Edna can make mistakes. Check important details with your lesson.
        </p>
      </div>
    </div>
  );
}

function subjectLabel(lessonId: string, lessonTitle: string) {
  const knownSubjects: Record<string, string> = {
    "parts-of-speech": "English",
    tenses: "English",
    "cell-biology": "Biology",
    "newtons-laws": "Physics",
    algebra: "Mathematics",
  };
  return `${knownSubjects[lessonId] ?? "Lesson"} tutor` || `${lessonTitle} tutor`;
}

const LessonTutorChat = ({ lessonId, lessonTitle, subject, isAuthenticated }: LessonTutorChatProps) => {
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();
  const [bootstrap] = useState(() => bootstrapChat(lessonId, threadId));
  const [threads, setThreads] = useState(bootstrap.threads);
  const activeThreadId = threadId && threadIdPattern.test(threadId) ? threadId : bootstrap.initialThreadId;
  const activeThread = threads.find((thread) => thread.id === activeThreadId);

  useEffect(() => {
    const path = `/lessons/${encodeURIComponent(lessonId)}/chat/${activeThreadId}`;
    if (window.location.pathname !== path) navigate(path, { replace: true });
  }, [activeThreadId, lessonId, navigate]);

  useEffect(() => {
    if (activeThread) return;
    if (!threadId || !threadIdPattern.test(threadId)) return;
    const requestedThread = createLessonChatThread(threadId);
    const nextThreads = [requestedThread, ...threads];
    setThreads(nextThreads);
    saveLessonChatThreads(window.localStorage, lessonId, nextThreads);
  }, [activeThread, lessonId, threadId, threads]);

  const handleMessagesChange = useCallback(
    (messages: UIMessage[]) => {
      setThreads((current) => {
        const updated = updateLessonChatThread(current, activeThreadId, messages);
        saveLessonChatThreads(window.localStorage, lessonId, updated);
        return updated;
      });
    },
    [activeThreadId, lessonId],
  );

  const handleNewChat = () => {
    const thread = createLessonChatThread(makeThreadId());
    const nextThreads = [thread, ...threads];
    setThreads(nextThreads);
    saveLessonChatThreads(window.localStorage, lessonId, nextThreads);
    navigate(`/lessons/${encodeURIComponent(lessonId)}/chat/${thread.id}`);
  };

  const handleSelectChat = (id: string) => {
    navigate(`/lessons/${encodeURIComponent(lessonId)}/chat/${id}`);
  };

  return (
    <section className="mt-10" aria-label="AI lesson tutor">
      <div className="mb-4 flex items-center gap-3">
        <img src={heroCharacter} alt="Edna" className="size-11 shrink-0 object-contain" />
        <div>
          <h2 className="font-heading text-xl font-extrabold text-foreground md:text-2xl">Ask Edna about this lesson</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">A calm place to ask questions, get examples, or practise.</p>
        </div>
      </div>

      <div className="grid min-h-[590px] overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-b border-border bg-muted/30 md:border-b-0 md:border-r" aria-label="Lesson conversations">
          <div className="flex items-center justify-between gap-2 px-3 py-3">
            <span className="font-heading text-xs font-bold uppercase text-muted-foreground">Conversations</span>
            <Button type="button" size="icon" variant="ghost" title="Start a new conversation" aria-label="Start a new conversation" onClick={handleNewChat} className="size-8 rounded-md">
              <MessageSquarePlus className="size-4" />
            </Button>
          </div>
          <div className="flex max-h-36 flex-row gap-1 overflow-x-auto px-2 pb-2 md:max-h-none md:flex-1 md:flex-col md:overflow-y-auto" role="list">
            {threads.map((thread) => (
              <div key={thread.id} role="listitem" className="min-w-0 shrink-0 md:shrink">
                <Button
                  type="button"
                  variant="ghost"
                  aria-current={thread.id === activeThreadId ? "page" : undefined}
                  onClick={() => handleSelectChat(thread.id)}
                  className={`h-auto min-h-10 w-full justify-start gap-2 rounded-md px-2 text-left text-xs font-medium md:whitespace-normal ${thread.id === activeThreadId ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground"}`}
                >
                  <MessageCircle className="size-3.5 shrink-0" />
                  <span className="max-w-40 truncate md:max-w-full">{formatThreadTitle(thread)}</span>
                </Button>
              </div>
            ))}
            {threads.length === 0 && <p className="px-2 py-3 text-xs text-muted-foreground">Start a conversation</p>}
          </div>
          <div className="hidden border-t border-border p-3 md:block">
            <p className="flex items-center gap-2 text-[11px] text-muted-foreground"><Plus className="size-3.5" /> Private to this browser</p>
          </div>
        </aside>

        {activeThread ? (
          <LessonTutorConversation
            key={`${lessonId}:${activeThread.id}`}
            lessonId={lessonId}
            lessonTitle={lessonTitle}
            subject={subject}
            thread={activeThread}
            isAuthenticated={isAuthenticated}
            onMessagesChange={handleMessagesChange}
          />
        ) : (
          <div className="flex min-h-[500px] items-center justify-center text-sm text-muted-foreground">Loading this conversation…</div>
        )}
      </div>
    </section>
  );
};

export default LessonTutorChat;