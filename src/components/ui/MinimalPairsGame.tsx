'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Ear,
  RotateCcw,
  Target,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
  Zap,
  Coins,
} from 'lucide-react';
import { saveActivityProgress, fetchActivityProgress, type FetchedActivityProgress } from '@/lib/activityProgress';
import { PointsToast } from '@/components/ui/PointsToast';
import {
  type MinimalPairContrastId,
  type MinimalPairDifficulty,
  type MinimalPairQuestion,
  type MinimalPairSide,
  MINIMAL_PAIR_CONTRASTS,
  getMinimalPairsRound,
} from '@/lib/minimal-pairs-data';

type ContrastSelection = MinimalPairContrastId | 'mixed';
type DifficultySelection = MinimalPairDifficulty | 'mixed';
type GamePhase = 'menu' | 'playing' | 'results';

interface GameState {
  phase: GamePhase;
  contrast: ContrastSelection;
  difficulty: DifficultySelection;
  roundSize: number;
  questions: MinimalPairQuestion[];
  currentIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  selectedAnswer: MinimalPairSide | null;
  showFeedback: boolean;
  answers: Array<{ question: MinimalPairQuestion; userAnswer: MinimalPairSide; correct: boolean }>;
  pointsToast: { points: number; key: number } | null;
  audioPlayed: boolean;
  completedContrasts: Set<string>;
}

interface ContentConfig {
  type?: string;
  contrastId?: ContrastSelection;
  difficulty?: DifficultySelection;
  roundSize?: number;
}

interface Props {
  contentStr: string;
  activityId?: string;
  assignmentId?: string | null;
}

const ROUND_OPTIONS = [10, 12, 15];

export default function MinimalPairsGame({ contentStr, activityId, assignmentId }: Props) {
  const [state, setState] = useState<GameState>({
    phase: 'menu',
    contrast: 'mixed',
    difficulty: 'mixed',
    roundSize: 12,
    questions: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    selectedAnswer: null,
    showFeedback: false,
    answers: [],
    pointsToast: null,
    audioPlayed: false,
    completedContrasts: new Set(),
  });

  const [isAudioSupported, setIsAudioSupported] = useState(true);

  useEffect(() => {
    setIsAudioSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    try {
      const parsed = JSON.parse(contentStr) as ContentConfig;
      if (!parsed || typeof parsed !== 'object') return;

      setState((prev) => ({
        ...prev,
        contrast: parsed.contrastId ?? prev.contrast,
        difficulty: parsed.difficulty ?? prev.difficulty,
        roundSize: parsed.roundSize && ROUND_OPTIONS.includes(parsed.roundSize) ? parsed.roundSize : prev.roundSize,
      }));
    } catch {
      // Keep defaults if content is not JSON.
    }
  }, [contentStr]);

  const playAudio = useCallback(async (word: string) => {
    const audioPath = `/audio/minimal-pairs/${word.toLowerCase()}.mp3`;

    try {
      const audio = new Audio(audioPath);
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject();
        audio.load();
      });
      await audio.play();
      setState((prev) => ({ ...prev, audioPlayed: true }));
      return;
    } catch {
      // Fall through to speech synthesis.
    }

    if (!isAudioSupported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.75;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const americanVoice = voices.find((voice) =>
      voice.lang.startsWith('en-US') || voice.name.includes('US') || voice.name.includes('American')
    );
    if (americanVoice) utterance.voice = americanVoice;

    window.speechSynthesis.speak(utterance);
    setState((prev) => ({ ...prev, audioPlayed: true }));
  }, [isAudioSupported]);

  const startGame = useCallback(() => {
    let questions = getMinimalPairsRound({
      contrastId: state.contrast,
      difficulty: state.difficulty,
      roundSize: state.roundSize,
    });

    // Fallback for strict filters that produce 0 questions.
    if (questions.length === 0) {
      questions = getMinimalPairsRound({
        contrastId: state.contrast,
        difficulty: 'mixed',
        roundSize: state.roundSize,
      });
    }

    setState((prev) => ({
      ...prev,
      phase: 'playing',
      questions,
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      selectedAnswer: null,
      showFeedback: false,
      answers: [],
      audioPlayed: false,
    }));
  }, [state.contrast, state.difficulty, state.roundSize]);

  const resetToMenu = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'menu',
      questions: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      selectedAnswer: null,
      showFeedback: false,
      answers: [],
      audioPlayed: false,
    }));
  }, []);

  const handleAnswer = useCallback((answer: MinimalPairSide) => {
    if (state.showFeedback || state.phase !== 'playing') return;
    const question = state.questions[state.currentIndex];
    if (!question) return;

    const isCorrect = answer === question.targetSide;

    setState((prev) => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : 0),
      answers: [...prev.answers, { question, userAnswer: answer, correct: isCorrect }],
    }));
  }, [state.currentIndex, state.phase, state.questions, state.showFeedback]);

  // Fetch existing progress
  useEffect(() => {
    if (!activityId) return;
    
    fetchActivityProgress(activityId, assignmentId).then((data: FetchedActivityProgress | null) => {
      if (data?.categoryData) {
        const completed = new Set<string>();
        Object.entries(data.categoryData).forEach(([key, val]) => {
            const castVal = val as { completed?: boolean } | null;
            if (castVal && castVal.completed) {
                completed.add(key);
            }
        });
        setState(prev => ({ ...prev, completedContrasts: completed }));
      }
    });
  }, [activityId, assignmentId]);

  const nextQuestion = useCallback(async () => {
    const isFinalQuestion = state.currentIndex >= state.questions.length - 1;

    if (isFinalQuestion) {
      // Calculate results
      const accuracy = Math.round((state.score / state.questions.length) * 100);
      
      // Update completed contrasts
      const newCompletedContrasts = new Set(state.completedContrasts);
      
      // Only mark as complete if not 'mixed' and accuracy is decent (> 50%?)
      // For now, completion = finishing the round, similar to other games, 
      // but strictly for the specific contrast.
      if (state.contrast !== 'mixed') {
        newCompletedContrasts.add(state.contrast);
      }

      // Calculate overall progress: (completed contrasts / total contrasts) * 100
      const totalContrasts = MINIMAL_PAIR_CONTRASTS.length;
      const percentComplete = Math.min(100, Math.round((newCompletedContrasts.size / totalContrasts) * 100));
      const status = percentComplete >= 100 ? 'completed' : 'in_progress';

      setState((prev) => ({ 
          ...prev, 
          phase: 'results', 
          completedContrasts: newCompletedContrasts 
      }));

      if (activityId) {
        // If it's a specific contrast, save it as a completed category
        const categoryToSave = state.contrast !== 'mixed' ? state.contrast : undefined;

        const result = await saveActivityProgress(
          activityId,
          percentComplete,
          status,
          accuracy,
          categoryToSave,
          assignmentId
        );

        if (result?.pointsAwarded && result.pointsAwarded > 0) {
          setState((prev) => ({
            ...prev,
            pointsToast: { points: result.pointsAwarded!, key: Date.now() },
          }));
        }
      }
      return;
    }

    setState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      selectedAnswer: null,
      showFeedback: false,
      audioPlayed: false,
    }));
  }, [activityId, assignmentId, state.contrast, state.currentIndex, state.questions.length, state.score, state.completedContrasts]);

  if (state.phase === 'menu') {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto md:relative md:inset-auto md:z-auto md:bg-transparent md:max-w-4xl md:mx-auto md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-full md:min-h-0 bg-white md:rounded-3xl md:shadow-xl md:overflow-hidden md:border border-sage/20"
        >
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 sm:p-8 text-white text-center pb-12 rounded-b-[2.5rem] md:rounded-b-none shadow-lg md:shadow-none relative">
            <button 
              onClick={() => window.history.back()}
              className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <Ear className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">Minimal Pairs Lab</h1>
            <p className="text-white/90 font-medium">Train your ear with high-impact contrasts.</p>
          </div>

          <div className="px-4 pb-8 -mt-6 md:mt-0 md:p-8 space-y-6 md:space-y-8 max-w-lg mx-auto md:max-w-none">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 px-1">
                <Target className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Contrast Focus</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white rounded-2xl md:bg-transparent shadow-sm md:shadow-none border border-neutral-100 md:border-0 p-2 md:p-0">
                {(() => {
                  const isSelected = state.contrast === 'mixed';
                  return (
                    <button
                      onClick={() => setState((prev) => ({ ...prev, contrast: 'mixed' }))}
                      className={`text-left p-4 rounded-xl md:rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-cyan-600 bg-cyan-100 shadow-md ring-2 ring-cyan-200'
                          : 'border-neutral-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/40'
                      }`}
                    >
                      <div className={`font-bold ${isSelected ? 'text-cyan-900' : 'text-neutral-800'}`}>Mixed Practice</div>
                      <p className={`text-sm mt-1 ${isSelected ? 'text-cyan-800' : 'text-neutral-600'}`}>
                        Rotate through all contrast types in one round.
                      </p>
                    </button>
                  );
                })()}

                {MINIMAL_PAIR_CONTRASTS.map((contrast) => (
                  (() => {
                    const isSelected = state.contrast === contrast.id;
                    return (
                      <button
                        key={contrast.id}
                        onClick={() => setState((prev) => ({ ...prev, contrast: contrast.id }))}
                        className={`text-left p-4 rounded-xl md:rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-cyan-600 bg-cyan-100 shadow-md ring-2 ring-cyan-200'
                            : 'border-neutral-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/40'
                        }`}
                      >
                        <div className={`font-bold ${isSelected ? 'text-cyan-900' : 'text-neutral-800'}`}>{contrast.label}</div>
                        <p className={`text-sm mt-1 ${isSelected ? 'text-cyan-800' : 'text-neutral-600'}`}>{contrast.description}</p>
                      </button>
                    );
                  })()
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest px-1">Difficulty</h3>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {(['easy', 'medium', 'hard', 'mixed'] as const).map((level) => {
                  const isSelected = state.difficulty === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setState((prev) => ({ ...prev, difficulty: level }))}
                      className={`px-4 py-3 sm:py-2 rounded-xl font-bold capitalize transition-all border text-sm sm:text-base ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-700 shadow-lg ring-2 ring-cyan-200 -translate-y-0.5'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-cyan-300 hover:bg-cyan-50'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest px-1">Round Size</h3>
              <div className="flex flex-wrap gap-2">
                {ROUND_OPTIONS.map((size) => {
                  const isSelected = state.roundSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setState((prev) => ({ ...prev, roundSize: size }))}
                      className={`px-4 py-3 sm:py-2 rounded-xl font-bold transition-all border text-sm sm:text-base ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-700 shadow-lg ring-2 ring-cyan-200 -translate-y-0.5'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-cyan-300 hover:bg-cyan-50'
                      }`}
                    >
                      {size} words
                    </button>
                  );
                })}
              </div>
            </div>

            {state.contrast !== 'mixed' && (
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50">
                <p className="text-sm text-amber-800">
                  {MINIMAL_PAIR_CONTRASTS.find((contrast) => contrast.id === state.contrast)?.spanishTip}
                </p>
              </div>
            )}

            {!isAudioSupported && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <VolumeX className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Web Speech fallback is unavailable in this browser. Pre-recorded audio still works if files exist.
                </p>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 active:translate-y-1 border-b-4 border-cyan-800 active:border-b-0"
            >
              Start Listening Round
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (state.phase === 'results') {
    const total = state.questions.length;
    const accuracy = total === 0 ? 0 : Math.round((state.score / total) * 100);

    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto md:relative md:inset-auto md:z-auto md:bg-transparent md:max-w-2xl md:mx-auto md:p-6">
        {state.pointsToast && (
          <PointsToast
            key={state.pointsToast.key}
            points={state.pointsToast.points}
            onComplete={() => setState((prev) => ({ ...prev, pointsToast: null }))}
          />
        )}

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="min-h-full md:min-h-0 bg-white md:rounded-3xl md:shadow-2xl md:overflow-hidden md:border border-sage/20"
        >
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-10 text-white text-center">
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-4xl font-display font-bold mb-1">Listening Complete</h2>
            <p className="text-white/90">Keep training your ear every day.</p>
          </div>

          <div className="p-6 md:p-10 max-w-lg mx-auto md:max-w-none">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
                <div className="text-2xl font-black text-neutral-800">{accuracy}%</div>
                <div className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Accuracy</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                <div className="text-2xl font-black text-neutral-800">{state.maxStreak}</div>
                <div className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Best Streak</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <div className="text-2xl font-black text-neutral-800">{state.score}/{total}</div>
                <div className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Correct</div>
              </div>
              <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100 shadow-sm text-center">
                <Coins className="w-6 h-6 mx-auto mb-2 text-cyan-700" />
                <div className="text-2xl font-black text-cyan-700">6</div>
                <div className="text-[10px] text-cyan-700 uppercase font-black tracking-widest">Points</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetToMenu}
                className="flex-1 border-2 border-sage/20 text-neutral-700 py-4 rounded-2xl font-bold hover:bg-sage/5 transition-all"
              >
                Change Settings
              </button>
              <button
                onClick={startGame}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = state.questions[state.currentIndex];
  const progress = state.questions.length === 0 ? 0 : ((state.currentIndex + 1) / state.questions.length) * 100;
  const targetWord = question?.targetSide === 'left' ? question.pair.leftWord : question?.pair.rightWord;

  if (!question) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 text-center">
          <p className="text-neutral-700">No pairs found for this setting. Try mixed difficulty.</p>
          <button
            onClick={resetToMenu}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold"
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white md:relative md:inset-auto md:z-auto md:bg-transparent max-w-2xl mx-auto md:p-6 min-h-[100dvh] md:min-h-[calc(100dvh-14rem)] flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-white md:hidden">
        <button
          onClick={resetToMenu}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full">
             <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
               {state.currentIndex + 1}/{state.questions.length}
             </span>
           </div>
           
           <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold">{state.streak}</span>
           </div>
           
           <div className="min-w-[40px] text-right font-black text-cyan-700">
             {state.score}
           </div>
        </div>
      </div>

       {/* Mobile progress bar added to top */}
      <div className="h-1 bg-neutral-100 md:hidden">
        <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-cyan-600 to-blue-600"
          />
      </div>

      <div className="hidden sm:flex items-center justify-between gap-2 mb-6">
        <button
          onClick={resetToMenu}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-neutral-200 bg-white text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Settings
        </button>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Question</span>
            <span className="text-xl font-bold text-neutral-800">{state.currentIndex + 1} / {state.questions.length}</span>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Streak</span>
            <div className="flex items-center gap-1">
              <Zap className={`w-4 h-4 ${state.streak > 0 ? 'text-amber-500 fill-amber-500' : 'text-neutral-300'}`} />
              <span className="text-xl font-bold text-neutral-800">{state.streak}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Score</span>
          <div className="text-xl font-bold text-cyan-700">{state.score}</div>
        </div>
      </div>

      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-5 sm:mb-8">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-cyan-600 to-blue-600"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 pb-2 sm:pb-4">
        <div className="text-center mb-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold mb-4">
            {question.contrastLabel}
          </div>
          <div className="text-lg sm:text-xl text-neutral-600 mb-3">What word did you hear?</div>
          <button
            onClick={() => targetWord && playAudio(targetWord)}
            className="flex items-center gap-3 mx-auto px-6 py-3 rounded-full font-bold text-lg sm:text-xl transition-all bg-cyan-600 text-white hover:bg-cyan-700 active:scale-95 shadow-lg"
          >
            <Volume2 className="w-6 h-6" />
            {state.audioPlayed ? 'Play Again' : 'Play Sound'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mb-2">
          {(['left', 'right'] as const).map((choice) => {
            const word = choice === 'left' ? question.pair.leftWord : question.pair.rightWord;
            const ipa = choice === 'left' ? question.pair.leftIpa : question.pair.rightIpa;
            const isSelected = state.selectedAnswer === choice;
            const isCorrect = state.showFeedback && choice === question.targetSide;
            const isWrong = state.showFeedback && isSelected && choice !== question.targetSide;

            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={state.showFeedback}
                className={`
                  p-4 sm:p-5 rounded-2xl font-black transition-all border-2
                  ${state.showFeedback
                    ? isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                      : isWrong
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                    : 'bg-white text-neutral-800 border-neutral-200 hover:border-cyan-400 hover:bg-cyan-50 active:scale-95'
                  }
                `}
              >
                <div className="text-2xl">{word}</div>
                <div className={`text-sm mt-1 ${state.showFeedback && (isCorrect || isWrong) ? 'text-white/90' : 'text-neutral-500'}`}>
                  {ipa}
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {state.showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`w-full max-w-md p-4 rounded-2xl mb-6 ${
                state.answers[state.answers.length - 1]?.correct
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-rose-50 border border-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {state.answers[state.answers.length - 1]?.correct ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-bold ${
                    state.answers[state.answers.length - 1]?.correct ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {state.answers[state.answers.length - 1]?.correct
                      ? `Correct! You heard "${targetWord}".`
                      : `Not quite. The correct answer was "${targetWord}".`
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {state.showFeedback && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextQuestion}
            className="w-full max-w-xs bg-neutral-800 text-white px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {state.currentIndex < state.questions.length - 1 ? 'Next' : 'See Results'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
