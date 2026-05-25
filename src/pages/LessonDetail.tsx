import { useState, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import {
  ArrowLeft, Play, Pause, Heart, Eye, Calendar, Headphones, Send,
  SkipBack, SkipForward, Repeat, Repeat1, Gauge,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getLessonById, getLessonsForSubject, LyricAnnotation } from "@/data/lessons";
import heroCharacter from "@/assets/hero-character.png";
import fractalArt from "@/assets/fractal-art.jpg";
import webDesignMath from "@/assets/web-design-math.jpg";
import partsOfSpeechAudio from "@/assets/parts-of-speech.mp3";

const cardImageMap: Record<string, string> = {
  "/assets/fractal-art.jpg": fractalArt,
  "/assets/web-design-math.jpg": webDesignMath,
};

const lessonAudioMap: Record<string, string> = {
  "parts-of-speech": partsOfSpeechAudio,
};


const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = getLessonById(lessonId || "");
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(lesson?.comments || []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeAnnotation, setActiveAnnotation] = useState<LyricAnnotation | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrc = lesson ? lessonAudioMap[lesson.id] : undefined;

  const navigate = useNavigate();

  // Next / previous lessons within the same subject
  const subjectLessons = lesson ? getLessonsForSubject(lesson.subject) : [];
  const currentIndex = lesson ? subjectLessons.findIndex((l) => l.id === lesson.id) : -1;
  const prevLesson = currentIndex > 1 ? subjectLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex !== -1 && currentIndex < subjectLessons.length - 1 ? subjectLessons[currentIndex + 1] : null;


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
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const handlePrev = () => {
    if (prevLesson) navigate(`/lesson/${prevLesson.id}`);
  };

  const handleNext = () => {
    if (nextLesson) navigate(`/lesson/${nextLesson.id}`);
  };

  const toggleLoop = () => {
    const audio = audioRef.current;
    if (audio) audio.loop = !isLooping;
    setIsLooping((prev) => !prev);
  };

  const cyclePlaybackRate = () => {
    const rates = [0.75, 1, 1.25, 1.5];
    const idx = rates.indexOf(playbackRate);
    const nextRate = rates[(idx + 1) % rates.length];
    const audio = audioRef.current;
    if (audio) audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
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
            <div className="mt-8 bg-muted rounded-2xl p-4 space-y-3">
              {/* Top row — controls */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-1">
                  <span className="text-primary-foreground text-[8px] font-bold leading-tight text-center">
                    {lesson.title.split(" ").slice(1, 3).join("\n")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-heading font-semibold text-foreground truncate">
                    {lesson.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{lesson.artist}</p>
                </div>

                {/* Prev */}
                <button
                  onClick={handlePrev}
                  disabled={!prevLesson}
                  title={prevLesson ? `Previous: ${prevLesson.title}` : "No previous lesson"}
                  className="text-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <SkipBack size={20} />
                </button>

                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  disabled={!audioSrc}
                  className="text-foreground hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>

                {/* Next */}
                <button
                  onClick={handleNext}
                  disabled={!nextLesson}
                  title={nextLesson ? `Next: ${nextLesson.title}` : "No next lesson"}
                  className="text-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <SkipForward size={20} />
                </button>

                {/* Speed */}
                <button
                  onClick={cyclePlaybackRate}
                  title={`Playback speed: ${playbackRate}x`}
                  className="flex items-center gap-0.5 text-[10px] font-bold text-foreground hover:text-primary transition-colors bg-background/60 rounded-md px-1.5 py-0.5"
                >
                  <Gauge size={14} />
                  {playbackRate}x
                </button>

                {/* Loop */}
                <button
                  onClick={toggleLoop}
                  title={isLooping ? "Loop on" : "Loop off"}
                  className={`transition-colors ${isLooping ? "text-primary" : "text-foreground hover:text-primary"}`}
                >
                  {isLooping ? <Repeat1 size={20} /> : <Repeat size={20} />}
                </button>

                {/* Like */}
                <button onClick={() => setLiked(!liked)} className="transition-colors">
                  <Heart
                    size={22}
                    className={liked ? "fill-accent text-accent" : "text-muted-foreground"}
                  />
                </button>
              </div>

              {/* Bottom row — progress */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  onClick={seek}
                  className="relative h-1.5 bg-border rounded-full overflow-hidden cursor-pointer flex-1"
                >
                  <div
                    className="absolute inset-y-0 left-1 gradient-primary rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums w-8">
                  {audioSrc ? formatTime(Math.max(duration - currentTime, 0)) : "0:00"}
                </span>
              </div>

              {audioSrc && (
                <audio
                  ref={audioRef}
                  src={audioSrc}
                  preload="metadata"
                  loop={isLooping}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    if (!isLooping) {
                      setIsPlaying(false);
                      setProgress(0);
                      setCurrentTime(0);
                    }
                  }}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onTimeUpdate={(e) => {
                    const t = e.currentTarget.currentTime;
                    setCurrentTime(t);
                    setProgress(duration ? (t / duration) * 100 : 0);
                  }}
                />
              )}
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

            {/* Design & Art Cards */}
            {lesson.designArtCards && lesson.designArtCards.length > 0 && (
              <div className="mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {lesson.designArtCards.map((card, i) => (
                    <div key={i} className="bg-muted rounded-2xl overflow-hidden group">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={cardImageMap[card.image] || card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-foreground leading-relaxed">
                          {card.description}
                          <button className="text-primary font-semibold ml-1 hover:underline">Read More</button>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz CTA */}
            <div className="mt-10 text-center">
              <Link to={lesson.id === "algebra" ? "/quiz/algebra" : "#"}>
                <Button className="gradient-primary text-primary-foreground font-heading font-bold rounded-full px-10 py-3 text-sm uppercase tracking-wider">
                  Take a Quiz and Earn NNCs
                </Button>
              </Link>
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
