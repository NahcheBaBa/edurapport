import { useCallback, useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { QuizQuestion as QuizQuestionType } from "@/data/quizQuestions";
import { Button } from "@/components/ui/button";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { parseSpokenOption } from "@/lib/voice-answer";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: number | null;
  onAnswer: (optionIndex: number) => void;
}

const optionLabels = ["A", "B", "C", "D"];

const QuizQuestionComponent = ({
  question,
  selectedAnswer,
  onAnswer,
}: QuizQuestionProps) => {
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctIndex;
  const [voiceMessage, setVoiceMessage] = useState("");
  const handleTranscript = useCallback((transcript: string) => {
    const optionIndex = parseSpokenOption(transcript, question.options);
    if (optionIndex === null) {
      setVoiceMessage("I couldn't match that to an option. Say a letter, like “A”, or the full answer.");
      return;
    }
    setVoiceMessage(`Heard option ${String.fromCharCode(65 + optionIndex)}.`);
    onAnswer(optionIndex);
  }, [onAnswer, question.options]);
  const voiceInput = useVoiceInput(handleTranscript);

  useEffect(() => {
    if (answered) voiceInput.stop();
  }, [answered, voiceInput.stop]);

  return (
    <div className="w-full">
      <p className="text-base md:text-lg font-body font-semibold text-foreground leading-relaxed mb-6">
        {question.id}. {question.question}
      </p>

      {!answered && (
        <div className="mb-5 space-y-2">
          <Button
            type="button"
            variant={voiceInput.isListening ? "secondary" : "outline"}
            onClick={() => {
              setVoiceMessage("");
              if (voiceInput.isListening) voiceInput.stop();
              else voiceInput.start();
            }}
            aria-label={voiceInput.isListening ? "Stop recording answer" : "Answer with your voice"}
            aria-pressed={voiceInput.isListening}
            className="gap-2"
          >
            {voiceInput.isListening ? <MicOff /> : <Mic />}
            {voiceInput.isListening ? "Listening… tap to stop" : "Answer with your voice"}
          </Button>
          {voiceInput.transcript && (
            <p className="text-sm text-muted-foreground" aria-live="polite">Heard: “{voiceInput.transcript}”</p>
          )}
          {(voiceInput.error || voiceMessage) && (
            <p className="text-sm text-muted-foreground" role="status">{voiceInput.error || voiceMessage}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrectOption = idx === question.correctIndex;

          let classes =
            "relative flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border-2 font-body font-semibold text-sm transition-all duration-200 ";

          if (!answered) {
            classes +=
              "border-border bg-background hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
          } else if (isCorrectOption) {
            classes +=
              "border-green-500 bg-green-50 text-green-800 cursor-default";
          } else if (isSelected && !isCorrectOption) {
            classes +=
              "border-destructive bg-red-50 text-red-800 cursor-default";
          } else {
            classes +=
              "border-border bg-muted/50 text-muted-foreground cursor-default opacity-60";
          }

          return (
            <button
              key={idx}
              onClick={() => !answered && onAnswer(idx)}
              disabled={answered}
              className={classes}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  answered && isCorrectOption
                    ? "bg-green-500 text-primary-foreground"
                    : answered && isSelected
                    ? "bg-destructive text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {optionLabels[idx]}
              </span>
              <span className="flex-1">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm font-body animate-in fade-in-0 slide-in-from-top-2 duration-300 ${
            isCorrect
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-destructive/20 text-red-800"
          }`}
        >
          <span className="font-bold">
            {isCorrect ? "✓ Correct! " : "✗ Incorrect. "}
          </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
};

export default QuizQuestionComponent;
