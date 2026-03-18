import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, VolumeX, ChevronLeft, ChevronRight, Trophy, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import JigsawPuzzle from "@/components/quiz/JigsawPuzzle";
import QuizQuestionComponent from "@/components/quiz/QuizQuestion";
import { algebraQuizQuestions } from "@/data/quizQuestions";
import { useSpeech } from "@/hooks/use-speech";

const TOTAL_QUESTIONS = algebraQuizQuestions.length;

const AlgebraQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [revealedPieces, setRevealedPieces] = useState<Set<number>>(new Set());
  const [audioOn, setAudioOn] = useState(false);
  const { speak, stop, isSpeaking } = useSpeech();

  const correctCount = revealedPieces.size;
  const allAnswered = answers.size === TOTAL_QUESTIONS;
  const allCorrect = correctCount === TOTAL_QUESTIONS;

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      const q = algebraQuizQuestions[currentQuestion];
      if (answers.has(q.id)) return;

      setAnswers((prev) => new Map(prev).set(q.id, optionIndex));

      if (optionIndex === q.correctIndex) {
        setRevealedPieces((prev) => new Set(prev).add(currentQuestion));
      }
    },
    [currentQuestion, answers]
  );

  const goNext = () => {
    if (currentQuestion < TOTAL_QUESTIONS - 1) setCurrentQuestion((c) => c + 1);
  };
  const goPrev = () => {
    if (currentQuestion > 0) setCurrentQuestion((c) => c - 1);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(new Map());
    setRevealedPieces(new Set());
    stop();
    setAudioOn(false);
  };

  // Read question aloud when audioOn changes or question changes
  const readCurrentQuestion = useCallback(() => {
    const q = algebraQuizQuestions[currentQuestion];
    const text = `Question ${q.id}. ${q.question}. Options: ${q.options
      .map((o, i) => `${["A", "B", "C", "D"][i]}, ${o}`)
      .join(". ")}`;
    speak(text);
  }, [currentQuestion, speak]);

  useEffect(() => {
    if (audioOn) {
      readCurrentQuestion();
    } else {
      stop();
    }
  }, [audioOn, currentQuestion]); // intentionally omit readCurrentQuestion/stop to avoid loops

  const question = algebraQuizQuestions[currentQuestion];
  const currentAnswer = answers.get(question.id) ?? null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 md:py-10 px-4">
        <div className="container max-w-6xl">
          {/* Back link */}
          <Link
            to="/subjects/Mathematics"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Mathematics</span>
          </Link>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-primary uppercase tracking-wide">
                Algebra Quiz
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-body">
                Answer correctly to unlock pieces of the hidden artwork!
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 self-start">
              <button
                onClick={() => setAudioOn(!audioOn)}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                  audioOn ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {audioOn ? <Volume2 size={18} className={isSpeaking ? "animate-pulse" : ""} /> : <VolumeX size={18} />}
                {audioOn ? (isSpeaking ? "Reading..." : "Sound On") : "Listen to Quiz"}
              </button>
              {audioOn && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>🐢</span>
                  <input
                    type="range"
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-24 h-1.5 accent-primary cursor-pointer"
                  />
                  <span>🐇</span>
                  <span className="font-semibold text-foreground w-8">{rate}x</span>
                </div>
              )}
            </div>
          </div>

          {/* Main grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Quiz */}
            <div className="flex-1 min-w-0">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-heading font-bold text-foreground">
                    Question {currentQuestion + 1} of {TOTAL_QUESTIONS}
                  </span>
                  <span className="font-body text-muted-foreground">
                    {correctCount} correct
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestion + 1) / TOTAL_QUESTIONS) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm min-h-[320px] flex flex-col justify-between">
                <QuizQuestionComponent
                  question={question}
                  selectedAnswer={currentAnswer}
                  onAnswer={handleAnswer}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={goPrev}
                    disabled={currentQuestion === 0}
                    className="gap-2"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  {currentQuestion < TOTAL_QUESTIONS - 1 ? (
                    <Button onClick={goNext} className="gap-2 gradient-primary text-primary-foreground">
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  ) : (
                    allAnswered && (
                      <Button className="gap-2 gradient-primary text-primary-foreground">
                        <Trophy size={16} />
                        Submit
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Question dots */}
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {algebraQuizQuestions.map((q, idx) => {
                  const ans = answers.get(q.id);
                  const isCorrect = ans === q.correctIndex;
                  const isWrong = ans !== undefined && ans !== q.correctIndex;
                  const isCurrent = idx === currentQuestion;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 ${
                        isCurrent
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : ""
                      } ${
                        isCorrect
                          ? "bg-green-500 text-primary-foreground"
                          : isWrong
                          ? "bg-destructive text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-primary/10"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Jigsaw puzzle */}
            <div className="lg:w-[380px] flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <JigsawPuzzle
                  revealedPieces={revealedPieces}
                  totalPieces={TOTAL_QUESTIONS}
                />

                {/* Completion actions */}
                {allAnswered && (
                  <div className="mt-6 space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
                    <div className="bg-card border border-border rounded-2xl p-5 text-center">
                      <p className="font-heading font-bold text-foreground text-lg mb-1">
                        Quiz Complete!
                      </p>
                      <p className="text-sm text-muted-foreground font-body">
                        You got{" "}
                        <span className="text-primary font-bold">
                          {correctCount}
                        </span>{" "}
                        out of {TOTAL_QUESTIONS} correct
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={resetQuiz}
                        className="flex-1 gap-2"
                      >
                        <RotateCcw size={16} />
                        Retry
                      </Button>
                      <Link to="/subjects/Mathematics" className="flex-1">
                        <Button className="w-full gradient-primary text-primary-foreground font-bold">
                          Take Another Quiz
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AlgebraQuiz;
