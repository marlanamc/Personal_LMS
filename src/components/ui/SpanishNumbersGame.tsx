"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { RotateCcw, Clock, Zap } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { PointsToast } from "@/components/ui/PointsToast";
import CelebrationAnimation from "@/components/ui/CelebrationAnimation";
import { checkSpanishNumber, getSpanishNumber } from "@/content/spanish/vocabulary/numbers-1-100";
import {
  getComboMultiplier,
  getComboTierLabel,
  getComboTierColor,
  createComboState,
  incrementCombo,
  resetCombo,
  applyComboBonus,
  type ComboState,
} from "@/lib/gamification/combo";
import { POINTS } from "@/lib/gamification/constants";

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
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
  const [celebration, setCelebration] = useState<"confetti" | "stars" | "sparkles" | null>(null);
  const [combo, setCombo] = useState<ComboState>(createComboState());

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
      // Update combo
      const newCombo = incrementCombo(combo);
      setCombo(newCombo);

      // Calculate points with combo bonus
      let basePoints: number = POINTS.SPANISH_NUMBERS_EASY;
      if (difficulty === "medium") basePoints = POINTS.SPANISH_NUMBERS_MEDIUM;
      if (difficulty === "hard" || difficulty === "mixed") basePoints = POINTS.SPANISH_NUMBERS_HARD;

      const pointsWithCombo = applyComboBonus(basePoints, newCombo.currentCombo);

      setGameState((prev) => ({
        ...prev,
        score: prev.score + pointsWithCombo,
        streak: prev.streak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.streak + 1),
        questionCount: prev.questionCount + 1,
      }));

      setFeedback("correct");

      // Show celebration at milestones
      if (newCombo.currentCombo === 5) {
        setCelebration("sparkles");
      } else if (newCombo.currentCombo === 10) {
        setCelebration("stars");
      } else if (newCombo.currentCombo === 20) {
        setCelebration("confetti");
      }

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
      setCombo(resetCombo(combo));
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
    setCombo(createComboState());
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

    const accuracy =
      gameState.totalQuestions > 0
        ? Math.round((gameState.questionCount / gameState.totalQuestions) * 100)
        : 0;

    const saveProgress = async () => {
      const result = await saveActivityProgress(
        activityId,
        100,
        "completed",
        undefined,
        undefined,
        assignmentId ?? null
      );
      if (result?.pointsAwarded && result.pointsAwarded > 0) {
        setPointsToast({ points: result.pointsAwarded, key: Date.now() });
      }
    };

    saveProgress();
  }, [isComplete, activityId, assignmentId, gameState.questionCount, gameState.totalQuestions]);

  const range = DIFFICULTY_RANGES[difficulty];
  const progress = (gameState.questionsInRound / range.questionsPerRound) * 100;
  const accuracy =
    gameState.totalQuestions > 0
      ? Math.round((gameState.questionCount / gameState.totalQuestions) * 100)
      : 0;

  const comboMultiplier = getComboMultiplier(combo.currentCombo);
  const comboLabel = getComboTierLabel(combo.currentCombo);
  const comboColor = getComboTierColor(combo.currentCombo);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
        {/* Points Toast */}
        {pointsToast && (
          <PointsToast
            key={pointsToast.key}
            points={pointsToast.points}
            onComplete={() => setPointsToast(null)}
          />
        )}

        {/* Celebration */}
        {celebration && (
          <CelebrationAnimation trigger={true} type={celebration} onComplete={() => setCelebration(null)} />
        )}

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-amber-200">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-amber-800 mb-2">¡Excelente!</h2>
            <p className="text-lg text-amber-600 mb-6">Round Complete!</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-3xl font-bold text-green-600">{gameState.score}</div>
                <div className="text-sm text-green-700">Points</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-sm text-blue-700">Accuracy</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">{gameState.maxStreak}</div>
                <div className="text-sm text-purple-700">Best Streak</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">{gameState.questionCount}</div>
                <div className="text-sm text-amber-700">Correct</div>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Points Toast */}
      {pointsToast && (
        <PointsToast
          key={pointsToast.key}
          points={pointsToast.points}
          onComplete={() => setPointsToast(null)}
        />
      )}

      {/* Celebration */}
      {celebration && (
        <CelebrationAnimation trigger={true} type={celebration} onComplete={() => setCelebration(null)} />
      )}

      {/* Header */}
      <div className="bg-white border-b-2 border-amber-200 px-4 py-3 flex items-center justify-between">
        <BackButton onClick={() => window.history.back()} />

        <div className="flex items-center gap-4">
          {/* Timer (if timed mode) */}
          {timedMode && (
            <div className="flex items-center gap-1 bg-amber-100 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="font-mono font-bold text-amber-800">{timeRemaining}s</span>
            </div>
          )}

          {/* Combo indicator */}
          {combo.currentCombo >= 3 && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-red-100 ${comboColor}`}>
              <Zap className="w-4 h-4" />
              <span className="font-bold">{comboLabel} x{comboMultiplier}</span>
            </div>
          )}

          {/* Score */}
          <div className="bg-green-100 px-3 py-1.5 rounded-full">
            <span className="font-bold text-green-800">{gameState.score} pts</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-amber-100">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <p className="text-amber-600 mb-2">Write this number in Spanish:</p>
          <div className="text-8xl font-bold text-amber-800 mb-4 font-mono">
            {gameState.currentNumber}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-amber-600">
              <span className="font-bold text-amber-800">{gameState.questionsInRound}</span> / {range.questionsPerRound}
            </div>
            <div className="text-green-600">
              Streak: <span className="font-bold text-green-800">{gameState.streak}</span>
            </div>
            <div className="text-blue-600">
              Accuracy: <span className="font-bold text-blue-800">{accuracy}%</span>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="w-full max-w-md">
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type in Spanish..."
            disabled={feedback === "correct"}
            className={`w-full text-2xl p-4 rounded-2xl border-3 text-center font-medium transition-all
              ${feedback === "correct"
                ? "border-green-400 bg-green-50 text-green-800"
                : feedback === "incorrect"
                ? "border-red-400 bg-red-50 text-red-800"
                : "border-amber-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
              }
            `}
          />

          {/* Feedback */}
          {feedback === "correct" && (
            <div className="mt-4 text-center animate-bounce">
              <span className="text-4xl">✓</span>
              <p className="text-green-600 font-bold">¡Correcto!</p>
            </div>
          )}

          {feedback === "incorrect" && showAnswer && (
            <div className="mt-4 text-center">
              <p className="text-red-600 font-medium mb-2">The correct answer was:</p>
              <p className="text-2xl font-bold text-amber-800">
                {getSpanishNumber(gameState.currentNumber!)}
              </p>
              <p className="text-sm text-gray-500 mt-2">Press Enter to continue</p>
            </div>
          )}

          {/* Submit button */}
          {!feedback && (
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          )}
        </div>
      </div>

      {/* Difficulty indicator */}
      <div className="text-center pb-4">
        <span className="text-xs text-amber-500 uppercase tracking-wider">
          {difficulty} mode • Numbers {range.label}
        </span>
      </div>
    </div>
  );
}
