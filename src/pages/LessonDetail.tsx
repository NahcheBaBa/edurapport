import { useState, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { X } from "lucide-react";
import {
  ArrowLeft, Play, Pause, Heart, Eye, Calendar, Headphones, Send,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getLessonById, LyricAnnotation } from "@/data/lessons";
import heroCharacter from "@/assets/hero-character.png";

const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = getLessonById(lessonId || "");
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(lesson?.comments || []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeAnnotation, setActiveAnnotation] = useState<LyricAnnotation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Build a map of which lines have annotations
  const annotationMap = useMemo(() => {
    const map = new Map<number, LyricAnnotation>();
    if (!lesson) return map;
    const lines = lesson.lyrics.split("\n");
    for (const ann of lesson.annotations) {
      const idx = lines.findIndex((l) => l.includes(ann.matchText));
      if (idx !== -1) map.set(idx, ann);
    }
    return map;
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Lesson not found</h1>
            <Link to="/subjects" className="text-primary font-semibold hover:underline">
              Back to Subjects
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return p + 0.5;
        });
      }, 200);
    }
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        author: "You",
        text: commentText.trim(),
        timeAgo: "Just now",
      },
    ]);
    setCommentText("");
  };

  const subjectSlug = encodeURIComponent(lesson.subject);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="container max-w-4xl">
          {/* Back */}
          <Link
            to={`/subjects/${subjectSlug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="relative">
            {/* Mascot */}
            <img
              src={heroCharacter}
              alt="Edna mascot"
              className="hidden md:block absolute -top-4 right-0 w-24 opacity-90"
            />

            {/* Header Card */}
            <div className="flex items-start gap-5 mb-8">
              {/* Cover */}
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-primary-foreground font-heading font-extrabold text-sm md:text-base text-center leading-tight px-2">
                  {lesson.title}
                </span>
              </div>
              <div className="flex-1 pt-2">
                <p className="text-xs text-muted-foreground mb-1">
                  Song composed and written by <span className="font-semibold text-foreground">{lesson.artist}</span>
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Instrumental produced by {lesson.producer}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {lesson.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Headphones size={13} />
                    {(lesson.plays / 1000).toFixed(1)}k plays
                  </span>
                </div>
              </div>
            </div>

            {/* Content Row — Genius-style lyrics */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Lyrics */}
              <div className="flex-1">
                <div className="text-sm leading-relaxed text-foreground font-body">
                  {lesson.lyrics.split("\n").map((line, i) => {
                    const ann = annotationMap.get(i);
                    const isActive = activeAnnotation === ann && ann != null;
                    if (ann) {
                      return (
                        <div key={i} className="relative">
                          <span
                            onClick={() => setActiveAnnotation(isActive ? null : ann)}
                            className={`cursor-pointer px-1 rounded transition-colors inline ${
                              isActive
                                ? "bg-primary/30 border-b-2 border-primary"
                                : "bg-primary/15 hover:bg-primary/25 border-b-2 border-primary/40"
                            }`}
                          >
                            {line}
                          </span>
                          {/* Inline annotation card (mobile) */}
                          {isActive && (
                            <div className="md:hidden mt-2 mb-3 bg-primary/10 border border-primary/30 rounded-xl p-4 text-xs text-foreground leading-relaxed animate-in fade-in-0 slide-in-from-top-2">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-heading font-bold text-primary">EduRapport Annotations</h4>
                                <button onClick={() => setActiveAnnotation(null)} className="text-muted-foreground hover:text-foreground">
                                  <X size={14} />
                                </button>
                              </div>
                              <p>{ann.body}</p>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div key={i} className={line.trim() === "" ? "h-4" : ""}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Annotation sidebar (desktop) — Genius-style sticky */}
              <div className="hidden md:block md:w-72 flex-shrink-0">
                {activeAnnotation ? (
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-xs text-foreground leading-relaxed sticky top-24 animate-in fade-in-0 slide-in-from-right-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading font-bold text-primary">EduRapport Annotations</h4>
                      <button onClick={() => setActiveAnnotation(null)} className="text-muted-foreground hover:text-foreground">
                        <X size={14} />
                      </button>
                    </div>
                    <p className="whitespace-pre-line">{activeAnnotation.body}</p>
                  </div>
                ) : (
                  <div className="bg-muted/50 border border-border rounded-xl p-4 text-xs text-muted-foreground leading-relaxed sticky top-24">
                    <p className="italic">Click a highlighted line to see its annotation.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Player */}
            <div className="mt-8 bg-muted rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-[8px] font-bold leading-tight text-center">
                  {lesson.title.split(" ").slice(0, 2).join("\n")}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-heading font-semibold text-foreground">{lesson.title}</p>
                <p className="text-[10px] text-muted-foreground">{lesson.artist}</p>
              </div>
              <button onClick={togglePlay} className="text-foreground hover:text-primary transition-colors">
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <div className="flex-1 hidden sm:block">
                <div className="relative h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 gradient-primary rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">-4:25</span>
              <button onClick={() => setLiked(!liked)} className="transition-colors">
                <Heart
                  size={22}
                  className={liked ? "fill-accent text-accent" : "text-muted-foreground"}
                />
              </button>
            </div>

            {/* Video Section */}
            {lesson.videoCaption && (
              <div className="mt-10 text-center">
                <p className="text-sm text-primary font-semibold mb-4">{lesson.videoCaption}</p>
                <div className="bg-muted rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Play size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Video coming soon</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Eye size={14} />
                  <span>1.5k views</span>
                </div>
              </div>
            )}

            {/* Quiz CTA */}
            <div className="mt-10 text-center">
              <Button className="gradient-primary text-primary-foreground font-heading font-bold rounded-full px-10 py-3 text-sm uppercase tracking-wider">
                Take a Quiz and Earn NNCs
              </Button>
            </div>

            {/* Comments */}
            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary mb-6 uppercase">
                Comments
              </h2>

              {/* Add Comment */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-xs font-bold">Y</span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value.slice(0, 30))}
                    onKeyDown={(e) => e.key === "Enter" && addComment()}
                    className="w-full border border-primary/40 rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-primary/50 focus:outline-none focus:border-primary bg-background"
                  />
                  <button
                    onClick={addComment}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-right -mt-4 mb-4">
                {30 - commentText.length} characters left
              </p>

              {/* Comment List */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-muted-foreground text-xs font-bold">
                        {c.author[0]}
                      </span>
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm text-primary">{c.author}</span>
                      <p className="text-sm text-primary/80">{c.text}</p>
                      <span className="text-[10px] text-muted-foreground">{c.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LessonDetail;
