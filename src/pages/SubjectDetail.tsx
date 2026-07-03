import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, PlayCircle, Music } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ednaAsset from "@/assets/edna-wave5.gif.asset.json";
import { Button } from "@/components/ui/button";
import { getLessonsForSubject } from "@/data/lessons";

const EDNA_SEEN_KEY = "edurapport-edna-animated";

const SubjectDetail = () => {
  const { name } = useParams<{ name: string }>();
  const subjectName = decodeURIComponent(name || "");
  const lessons = getLessonsForSubject(subjectName);
  const [playAnimation] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(EDNA_SEEN_KEY);
  });

  useEffect(() => {
    if (playAnimation) sessionStorage.setItem(EDNA_SEEN_KEY, "1");
  }, [playAnimation]);

  const anim = (cls: string) => (playAnimation ? cls : "");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="container max-w-5xl">
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            Back to Subjects
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
            <div className="relative flex-shrink-0 w-64 md:w-[360px] flex justify-center">
              <div className="relative">
                <img
                  src={playAnimation ? ednaAsset.url : `${ednaAsset.url}#static`}
                  alt="Edna waving hello"
                  className={`w-56 md:w-72 drop-shadow-xl ${anim("animate-float")}`}
                  style={{ animationDuration: "4s", animationIterationCount: "1" }}
                />
                <div className={`absolute -top-4 -right-4 md:-right-8 bg-card border-2 border-primary rounded-2xl rounded-bl-none px-4 py-2 shadow-lg max-w-[180px] origin-bottom-left hover:scale-105 hover:-rotate-2 transition-transform duration-300 cursor-default group ${anim("animate-scale-in")}`} style={{ animationIterationCount: "1" }}>
                  <span className={`absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent ${anim("animate-ping")}`} style={{ animationIterationCount: "1" }} />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent" />
                  <p className="font-heading font-bold text-sm text-foreground leading-tight">
                    Hello, Durling. Let's have a{" "}
                    <span className="inline-block text-primary group-hover:animate-bounce" style={{ animationIterationCount: "1" }}>Rapport</span>
                    <span className={`inline-block ml-1 ${anim("animate-pulse")}`} style={{ animationIterationCount: "1" }}>👋</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground mb-4">
                {subjectName}
              </h1>
              <p className="text-muted-foreground font-body text-base md:text-lg mb-8 max-w-lg">
                Explore interactive lessons, practice questions, and resources to master {subjectName}. Let's build rapport through learning!
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
                {[
                  { value: `${lessons.length}`, label: "Lessons" },
                  { value: "50+", label: "Questions" },
                  { value: "Free", label: "Access" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-muted rounded-xl p-4 text-center">
                    <div className="text-xl font-heading font-extrabold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <h2 className="text-2xl font-heading font-extrabold text-foreground mb-6">
            Available <span className="text-gradient">Lessons</span>
          </h2>
          {lessons.length === 0 ? (
            <div className="text-center py-16 bg-muted rounded-2xl">
              <Music size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-semibold">Lessons coming soon for {subjectName}!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={`/lessons/${lesson.id}`}
                  className="flex items-center gap-4 bg-muted hover:bg-muted/70 rounded-2xl p-4 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow">
                    <span className="text-primary-foreground text-[9px] font-bold text-center leading-tight px-1">
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {lesson.artist} · {lesson.date} · {(lesson.plays / 1000).toFixed(1)}k plays
                    </p>
                  </div>
                  <PlayCircle size={28} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubjectDetail;
