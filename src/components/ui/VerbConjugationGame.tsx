"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { RotateCcw, Clock, Zap, Trophy } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { PointsToast } from "@/components/ui/PointsToast";
import CelebrationAnimation from "@/components/ui/CelebrationAnimation";
import {
  verbConjugations,
  getVerbsByType,
  checkConjugation,
} from "@/content/spanish/vocabulary/common-verbs";
import type { SpanishVerbConjugation } from "@/types/activity";
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

type Tense = "present" | "preterite";
type Subject = "yo" | "tu" | "el" | "nosotros" | "ellos";

interface VerbConjugationGameProps {
  tense: "present" | "preterite" | "mixed";
  verbTypes: ("ar" | "er" | "ir" | "irregular")[];
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
  incorrect: number;
  totalQuestions: number;
  currentVerb: SpanishVerbConjugation | null;
  currentSubject: Subject;
  currentTense: Tense;
  filledConjugations: Record<string, string>; // Track filled conjugation table
}

const SUBJECTS: { key: Subject; label: string; spanish: string }[] = [
  { key: "yo", label: "I", spanish: "yo" },
  { key: "tu", label: "you (informal)", spanish: "tú" },
  { key: "el", label: "he/she/it", spanish: "él/ella" },
  { key: "nosotros", label: "we", spanish: "nosotros" },
  { key: "ellos", label: "they", spanish: "ellos/ellas" },
];

const TENSE_LABELS: Record<Tense, string> = {
  present: "Presente",
  preterite: "Pretérito",
};

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function VerbConjugationGame({
  tense,
  verbTypes,
  timedMode = false,
  timeLimit = 60,
  activityId,
  assignmentId,
}: VerbConjugationGameProps) {
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

  // Available verbs based on selected types - memoize to prevent infinite loop
  const availableVerbs = useMemo(() => getVerbsByType(verbTypes), [verbTypes]);

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    maxStreak: 0,
    questionCount: 0,
    incorrect: 0,
    totalQuestions: 0,
    currentVerb: null,
    currentSubject: "yo",
    currentTense: "present",
    filledConjugations: {},
  });

  const questionsPerRound = 15;

  // Generate new question
  const generateQuestion = useCallback(() => {
    const verb = getRandomItem(availableVerbs);
    const subject = getRandomItem(SUBJECTS).key;
    let questionTense: Tense;

    if (tense === "mixed") {
      // For mixed, randomly pick present or preterite (if verb has preterite)
      if (verb.preterite) {
        questionTense = Math.random() > 0.5 ? "present" : "preterite";
      } else {
        questionTense = "present";
      }
    } else {
      questionTense = tense as Tense;
    }

    // If asking for preterite but verb doesn't have it, use present
    if (questionTense === "preterite" && !verb.preterite) {
      questionTense = "present";
    }

    setGameState((prev) => ({
      ...prev,
      currentVerb: verb,
      currentSubject: subject,
      currentTense: questionTense,
      totalQuestions: prev.totalQuestions + 1,
    }));
    setUserAnswer("");
    setFeedback(null);
    setShowAnswer(false);
    inputRef.current?.focus();
  }, [availableVerbs, tense]);

  // Initialize game - only run once on mount
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
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

  const getCorrectAnswer = (): string => {
    if (!gameState.currentVerb) return "";
    const conjugations =
      gameState.currentTense === "present"
        ? gameState.currentVerb.present
        : gameState.currentVerb.preterite;

    if (!conjugations) return "";
    return conjugations[gameState.currentSubject];
  };

  const checkAnswer = () => {
    if (!gameState.currentVerb || feedback) return;

    const correctAnswer = getCorrectAnswer();
    const isCorrect = checkConjugation(correctAnswer, userAnswer);

    if (isCorrect) {
      // Update combo
      const newCombo = incrementCombo(combo);
      setCombo(newCombo);

      // Calculate points
      const basePoints = POINTS.SPANISH_VERB_CORRECT;
      const pointsWithCombo = applyComboBonus(basePoints, newCombo.currentCombo);

      // Streak bonus
      let streakBonus = 0;
      if ((gameState.streak + 1) % 5 === 0) {
        streakBonus = POINTS.SPANISH_VERB_STREAK_5;
      }

      // Update filled conjugations table
      const conjKey = `${gameState.currentVerb.infinitive}-${gameState.currentTense}-${gameState.currentSubject}`;

      setGameState((prev) => ({
        ...prev,
        score: prev.score + pointsWithCombo + streakBonus,
        streak: prev.streak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.streak + 1),
        questionCount: prev.questionCount + 1,
        filledConjugations: {
          ...prev.filledConjugations,
          [conjKey]: correctAnswer,
        },
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

      // Auto-advance
      setTimeout(() => {
        if (gameState.questionCount + 1 >= questionsPerRound) {
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
      incorrect: 0,
      totalQuestions: 0,
      currentVerb: null,
      currentSubject: "yo",
      currentTense: "present",
      filledConjugations: {},
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
  }, [isComplete, activityId, assignmentId]);

  const progress = (gameState.questionCount / questionsPerRound) * 100;
  const accuracy =
    gameState.totalQuestions > 0
      ? Math.round((gameState.questionCount / gameState.totalQuestions) * 100)
      : 0;

  const comboMultiplier = getComboMultiplier(combo.currentCombo);
  const comboLabel = getComboTierLabel(combo.currentCombo);
  const comboColor = getComboTierColor(combo.currentCombo);

  const currentSubjectInfo = SUBJECTS.find((s) => s.key === gameState.currentSubject);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
        {pointsToast && (
          <PointsToast
            key={pointsToast.key}
            points={pointsToast.points}
            onComplete={() => setPointsToast(null)}
          />
        )}

        {celebration && (
          <CelebrationAnimation trigger={true} type={celebration} onComplete={() => setCelebration(null)} />
        )}

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-emerald-200">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-emerald-800 mb-2">¡Muy Bien!</h2>
            <p className="text-lg text-emerald-600 mb-6">Verb Practice Complete!</p>

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
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">{gameState.questionCount}</div>
                <div className="text-sm text-emerald-700">Correct</div>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Practice More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
      {pointsToast && (
        <PointsToast
          key={pointsToast.key}
          points={pointsToast.points}
          onComplete={() => setPointsToast(null)}
        />
      )}

      {celebration && (
        <CelebrationAnimation trigger={true} type={celebration} onComplete={() => setCelebration(null)} />
      )}

      {/* Header */}
      <div className="bg-white border-b-2 border-emerald-200 px-4 py-3 flex items-center justify-between">
        <BackButton onClick={() => window.history.back()} />

        <div className="flex items-center gap-4">
          {timedMode && (
            <div className="flex items-center gap-1 bg-emerald-100 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="font-mono font-bold text-emerald-800">{timeRemaining}s</span>
            </div>
          )}

          {combo.currentCombo >= 3 && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 ${comboColor}`}>
              <Zap className="w-4 h-4" />
              <span className="font-bold">{comboLabel} x{comboMultiplier}</span>
            </div>
          )}

          <div className="bg-green-100 px-3 py-1.5 rounded-full">
            <span className="font-bold text-green-800">{gameState.score} pts</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-emerald-100">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState.currentVerb && (
          <>
            {/* Verb info */}
            <div className="text-center mb-6">
              <div className="inline-block bg-white rounded-2xl shadow-lg px-6 py-5 border-2 border-emerald-200 mb-4">
                <p className="text-6xl sm:text-8xl font-black text-teal-600 leading-none tracking-wide mb-2">
                  {gameState.currentVerb.infinitive}
                </p>
                <p className="text-gray-600 font-medium">({gameState.currentVerb.english})</p>
              </div>

              {/* Tense and Subject */}
              <div className="flex items-center justify-center gap-4">
                <div className="bg-teal-100 px-4 py-2 rounded-xl">
                  <span className="text-sm text-teal-600">Tense:</span>
                  <span className="ml-2 font-bold text-teal-800">{TENSE_LABELS[gameState.currentTense]}</span>
                </div>
                <div className="bg-cyan-100 px-4 py-2 rounded-xl">
                  <span className="text-sm text-cyan-600">Subject:</span>
                  <span className="ml-2 font-bold text-cyan-800">{currentSubjectInfo?.spanish}</span>
                  <span className="ml-1 text-cyan-600 text-sm">({currentSubjectInfo?.label})</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 text-sm mb-6">
              <div className="text-emerald-600">
                <span className="font-bold text-emerald-800">{gameState.questionCount}</span> / {questionsPerRound}
              </div>
              <div className="text-green-600">
                Streak: <span className="font-bold text-green-800">{gameState.streak}</span>
              </div>
              <div className="text-blue-600">
                Accuracy: <span className="font-bold text-blue-800">{accuracy}%</span>
              </div>
            </div>

            {/* Input area */}
            <div className="w-full max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-emerald-800">{currentSubjectInfo?.spanish}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="conjugation..."
                  disabled={feedback === "correct"}
                  className={`flex-1 text-2xl p-4 rounded-2xl border-3 text-center font-medium transition-all
                    ${feedback === "correct"
                      ? "border-green-400 bg-green-50 text-green-800"
                      : feedback === "incorrect"
                      ? "border-red-400 bg-red-50 text-red-800"
                      : "border-emerald-300 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                    }
                  `}
                />
              </div>

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
                  <p className="text-2xl font-bold text-emerald-800">
                    {currentSubjectInfo?.spanish} <span className="text-teal-600">{getCorrectAnswer()}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Press Enter to continue</p>
                </div>
              )}

              {/* Submit button */}
              {!feedback && (
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
              )}
            </div>

            {/* Verb type indicator */}
            {gameState.currentVerb.irregularNote && (
              <div className="mt-6 px-4 py-2 bg-amber-100 rounded-lg text-amber-800 text-sm">
                ⚠️ Irregular: {gameState.currentVerb.irregularNote}
              </div>
            )}
          </>
        )}
      </div>

      {/* Mode indicator */}
      <div className="text-center pb-4">
        <span className="text-xs text-emerald-500 uppercase tracking-wider">
          {tense === "mixed" ? "Mixed Tenses" : TENSE_LABELS[tense as Tense]} • {verbTypes.join(", ")} verbs
        </span>
      </div>
    </div>
  );
}
