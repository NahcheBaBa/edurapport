import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Loader2, Music2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getLessonById, type Lesson } from "@/data/lessons";
import { useSavedLessons } from "@/hooks/use-saved-lessons";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Recommendation = { lessonId: string; reason: string };

const SavedLessonsPanel = () => {
  const { savedLessonIds, loading, toggleSavedLesson } = useSavedLessons();
  const [mood, setMood] = useState("");
  const [recommending, setRecommending] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState("");

  const savedLessons = useMemo(
    () => savedLessonIds.map((id) => getLessonById(id)).filter((lesson): lesson is Lesson => Boolean(lesson)),
    [savedLessonIds],
  );
  const recommendedLesson = recommendation ? getLessonById(recommendation.lessonId) : undefined;

  const getRecommendation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mood.trim() || savedLessons.length === 0) return;
    setRecommending(true);
    setError("");
    setRecommendation(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("recommend-saved-lesson", {
        body: { mood: mood.trim() },
      });
      if (invokeError) {
        const context = invokeError as Error & { context?: Response };
        const responseBody = await context.context?.clone().json().catch(() => null) as { error?: string } | null;
        throw new Error(responseBody?.error || invokeError.message);
      }
      if (!data?.lessonId || !savedLessonIds.includes(data.lessonId)) {
        throw new Error("No saved song or poem was a close match. Try describing what would help in a different way.");
      }
      setRecommendation({ lessonId: data.lessonId, reason: typeof data.reason === "string" ? data.reason : "" });
    } catch (recommendationError) {
      setError(recommendationError instanceof Error ? recommendationError.message : "We couldn't make a recommendation. Please try again.");
    } finally {
      setRecommending(false);
    }
  };

  const removeLesson = async (lessonId: string, title: string) => {
    try {
      await toggleSavedLesson(lessonId);
      toast({ title: `${title} removed from saved items` });
    } catch {
      toast({ title: "Couldn't remove this saved item", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <section aria-labelledby="saved-lessons-heading" className="mt-8 border-t border-border pt-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
        </div>
        <div>
          <h2 id="saved-lessons-heading" className="font-heading text-xl font-bold text-foreground">Saved songs &amp; poetry</h2>
          <p className="text-sm text-muted-foreground">Your favourites, ready when you need them.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-5 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Loading saved items…</div>
      ) : savedLessons.length === 0 ? (
        <div className="border-y border-border py-5">
          <p className="text-sm text-muted-foreground">No saved songs or poems yet.</p>
          <Link to="/subjects" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Browse lessons <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {savedLessons.map((lesson) => (
            <li key={lesson.id} className="flex items-center gap-3 py-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Music2 className="h-5 w-5" aria-hidden="true" /></div>
              <Link to={`/lessons/${lesson.id}`} className="min-w-0 flex-1 hover:text-primary">
                <span className="block truncate text-sm font-bold text-foreground">{lesson.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{lesson.subject} · {lesson.artist}</span>
              </Link>
              <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${lesson.title} from saved items`} title="Remove from saved items" onClick={() => void removeLesson(lesson.id, lesson.title)}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 border-t border-border pt-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          <h3 className="font-heading text-lg font-bold text-foreground">Find something for this moment</h3>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">Tell us how you feel or what kind of support would help. We’ll choose from your saved items.</p>
        <form onSubmit={getRecommendation} className="space-y-3">
          <Textarea value={mood} onChange={(event) => setMood(event.target.value)} placeholder="I’m feeling overwhelmed and need something calming…" aria-label="Describe your mood or what support you need" maxLength={500} rows={3} disabled={savedLessons.length === 0 || loading || recommending} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{savedLessons.length === 0 ? "Save a song or poem first to get a recommendation." : "Your message is sent to AI for matching and isn’t saved to your profile."}</span>
            <Button type="submit" disabled={!mood.trim() || savedLessons.length === 0 || loading || recommending} className="gradient-primary text-primary-foreground">
              {recommending ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Finding a match…</> : <><Sparkles className="h-4 w-4" aria-hidden="true" />Recommend a saved item</>}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">This can recommend a lesson, but it isn’t emergency or professional support.</p>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
        {recommendedLesson && (
          <div aria-live="polite" className="mt-5 border-l-4 border-primary bg-primary/5 p-4">
            <p className="text-xs font-bold uppercase text-primary">A saved item for you</p>
            <Link to={`/lessons/${recommendedLesson.id}`} className="mt-1 inline-flex items-center gap-1 font-heading font-bold text-foreground hover:text-primary">
              {recommendedLesson.title}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="text-xs text-muted-foreground">{recommendedLesson.subject} · {recommendedLesson.artist}</p>
            {recommendation?.reason && <p className="mt-2 text-sm text-muted-foreground">{recommendation.reason}</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedLessonsPanel;