"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { RotateCcw, Clock } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { checkSpanishNumber, getSpanishNumber } from "@/content/spanish/vocabulary/numbers-1-100";

interface SpanishNumbersGameProps {
  difficulty: "easy" | "medium" | "hard" | "mixed";
  timedMode?: boolean;
  timeLimit?: number;
  activityId?: string;
  assignmentId?: string | null;
}

interface GameState {
  score: number;
  streak: number;
  maxStreak: number;
  questionCount: number;
  roundNumber: number;
  questionsInRound: number;
  currentNumber: number | null;
  incorrect: number;
  totalQuestions: number;
}

const DIFFICULTY_RANGES = {
  easy: { min: 0, max: 20, questionsPerRound: 10, label: "0-20" },
  medium: { min: 0, max: 100, questionsPerRound: 12, label: "0-100" },
  hard: { min: 0, max: 100, questionsPerRound: 15, label: "0-100 (Mixed)" },
  mixed: { min: 0, max: 100, questionsPerRound: 15, label: "All Numbers" },
};

function generateNumber(difficulty: "easy" | "medium" | "hard" | "mixed"): number {
  const range = DIFFICULTY_RANGES[difficulty];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

export default function SpanishNumbersGame({
  difficulty,
  timedMode = false,
  timeLimit = 60,
  activityId,
  assignmentId,
}: SpanishNumbersGameProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Timed mode state
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isTimedActive, setIsTimedActive] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    maxStreak: 0,
    questionCount: 0,
    roundNumber: 1,
    questionsInRound: 0,
    currentNumber: null,
    incorrect: 0,
    totalQuestions: 0,
  });

  // Generate new question
  const generateQuestion = useCallback(() => {
    const num = generateNumber(difficulty);
    setGameState((prev) => ({
      ...prev,
      currentNumber: num,
      questionsInRound: prev.questionsInRound + 1,
      totalQuestions: prev.totalQuestions + 1,
    }));
    setUserAnswer("");
    setFeedback(null);
    setShowAnswer(false);
    inputRef.current?.focus();
  }, [difficulty]);

  // Initialize game
  useEffect(() => {
    generateQuestion();
    if (timedMode) {
      setIsTimedActive(true);
    }
  }, [generateQuestion, timedMode]);

  // Timer countdown
  useEffect(() => {
    if (!timedMode || !isTimedActive || isComplete) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsComplete(true);
          setIsTimedActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timedMode, isTimedActive, isComplete]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const checkAnswer = () => {
    if (gameState.currentNumber === null || feedback) return;

    const isCorrect = checkSpanishNumber(gameState.currentNumber, userAnswer);

    if (isCorrect) {
      setGameState((prev) => ({
        ...prev,
        score: prev.score + 1,
        streak: prev.streak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.streak + 1),
        questionCount: prev.questionCount + 1,
      }));

      setFeedback("correct");

      // Auto-advance after correct
      setTimeout(() => {
        const range = DIFFICULTY_RANGES[difficulty];
        if (gameState.questionsInRound >= range.questionsPerRound) {
          // Round complete
          setIsComplete(true);
        } else {
          generateQuestion();
        }
      }, 800);
    } else {
      setGameState((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        streak: 0,
      }));
      setFeedback("incorrect");
      setShowAnswer(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (feedback === "incorrect") {
        // Move to next question after showing answer
        generateQuestion();
      } else {
        checkAnswer();
      }
    }
  };

  const handleRestart = () => {
    setGameState({
      score: 0,
      streak: 0,
      maxStreak: 0,
      questionCount: 0,
      roundNumber: 1,
      questionsInRound: 0,
      currentNumber: null,
      incorrect: 0,
      totalQuestions: 0,
    });
    setIsComplete(false);
    setTimeRemaining(timeLimit);
    if (timedMode) {
      setIsTimedActive(true);
    }
    generateQuestion();
  };

  // Save progress on completion
  useEffect(() => {
    if (!isComplete || !activityId) return;

    const _accuracy =
      gameState.totalQuestions > 0
        ? Math.round((gameState.questionCount / gameState.totalQuestions) * 100)
        : 0;

    const saveProgress = async () => {
      await saveActivityProgress(
        activityId,
        100,
        "completed",
        undefined,
        undefined,
        assignmentId ?? null
      );
    };

    saveProgress();
  }, [isComplete, activityId, assignmentId, gameState.questionCount, gameState.totalQuestions]);

  const range = DIFFICULTY_RANGES[difficulty];
  const progress = (gameState.questionsInRound / range.questionsPerRound) * 100;
  const accuracy =
    gameState.totalQuestions > 0
      ? Math.round((gameState.questionCount / gameState.totalQuestions) * 100)
      : 0;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-700 bg-slate-900/95">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-amber-300 mb-2">¡Excelente!</h2>
            <p className="text-lg text-slate-300 mb-6">Round Complete!</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl p-4 border border-emerald-700 bg-emerald-950/50">
                <div className="text-3xl font-bold text-emerald-300">{gameState.score}</div>
                <div className="text-sm text-emerald-200">Points</div>
              </div>
              <div className="rounded-xl p-4 border border-blue-700 bg-blue-950/50">
                <div className="text-3xl font-bold text-blue-300">{accuracy}%</div>
                <div className="text-sm text-blue-200">Accuracy</div>
              </div>
              <div className="rounded-xl p-4 border border-violet-700 bg-violet-950/50">
                <div className="text-3xl font-bold text-violet-300">{gameState.maxStreak}</div>
                <div className="text-sm text-violet-200">Best Streak</div>
              </div>
              <div className="rounded-xl p-4 border border-amber-700 bg-amber-950/50">
                <div className="text-3xl font-bold text-amber-300">{gameState.questionCount}</div>
                <div className="text-sm text-amber-200">Correct</div>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-950/95 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <BackButton onClick={() => window.history.back()} />

        <div className="flex items-center gap-4">
          {/* Timer (if timed mode) */}
          {timedMode && (
            <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-700 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="font-mono font-bold text-amber-200">{timeRemaining}s</span>
            </div>
          )}

          {/* Score */}
          <div className="bg-emerald-950/60 border border-emerald-700 px-3 py-1.5 rounded-full">
            <span className="font-bold text-emerald-200">{gameState.score} pts</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900/92 shadow-2xl backdrop-blur-sm px-6 py-8">
          <div className="text-center mb-8">
            <p className="text-slate-300 font-medium mb-2">Write this number in Spanish:</p>
            <div className="text-8xl font-bold text-amber-300 mb-4 font-mono">
              {gameState.currentNumber}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="text-amber-200">
                <span className="font-bold text-amber-100">{gameState.questionsInRound}</span> / {range.questionsPerRound}
              </div>
              <div className="text-emerald-200">
                Streak: <span className="font-bold text-emerald-100">{gameState.streak}</span>
              </div>
              <div className="text-blue-200">
                Accuracy: <span className="font-bold text-blue-100">{accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="w-full max-w-md mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type in Spanish..."
              disabled={feedback === "correct"}
              className={`w-full text-2xl p-4 rounded-2xl border-2 text-center font-semibold transition-all outline-none placeholder:text-slate-400
                ${feedback === "correct"
                  ? "border-emerald-500 bg-emerald-950/40 text-emerald-100"
                  : feedback === "incorrect"
                  ? "border-rose-500 bg-rose-950/40 text-rose-100"
                  : "border-slate-500 bg-slate-900 text-slate-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/25"
                }
              `}
            />

            {/* Feedback */}
            {feedback === "correct" && (
              <div className="mt-4 text-center animate-bounce">
                <span className="text-4xl">✓</span>
                <p className="text-emerald-300 font-bold">¡Correcto!</p>
              </div>
            )}

            {feedback === "incorrect" && showAnswer && (
              <div className="mt-4 text-center">
                <p className="text-rose-300 font-medium mb-2">The correct answer was:</p>
                <p className="text-2xl font-bold text-amber-200">
                  {getSpanishNumber(gameState.currentNumber!)}
                </p>
                <p className="text-sm text-slate-400 mt-2">Press Enter to continue</p>
              </div>
            )}

            {/* Submit button */}
            {!feedback && (
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-600 disabled:text-slate-300"
              >
                Check Answer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Difficulty indicator */}
      <div className="text-center pb-4">
        <span className="text-xs text-amber-300 uppercase tracking-wider font-medium">
          {difficulty} mode • Numbers {range.label}
        </span>
      </div>
    </div>
  );
}
