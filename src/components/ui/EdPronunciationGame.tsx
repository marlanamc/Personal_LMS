'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  Target,
  Coins,
  Lightbulb,
  Ear,
  ArrowLeft,
  ArrowLeftRight,
  Info,
  X
} from 'lucide-react';
import { saveActivityProgress } from '@/lib/activityProgress';
import { PointsToast } from '@/components/ui/PointsToast';
import {
  EdVerb,
  EdSound,
  SOUND_RULES,
  getGameRound,
  getMinimalPairs,
} from '@/lib/ed-pronunciation-data';

type GameMode = 'sorting' | 'minimal-pairs';
type GamePhase = 'menu' | 'playing' | 'feedback' | 'results';
type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

interface GameState {
  mode: GameMode;
  phase: GamePhase;
  difficulty: Difficulty;
  verbs: EdVerb[];
  currentIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  answers: Array<{ verb: EdVerb; userAnswer: EdSound | 'base' | 'past'; correct: boolean }>;
  selectedAnswer: EdSound | 'base' | 'past' | null;
  showFeedback: boolean;
  discoveryPhase: number; // 0-5: no hints, 5-10: pattern hints, 10+: full rules
  pointsToast: { points: number; key: number } | null;
  // For minimal pairs mode
  minimalPairTarget: 'base' | 'past' | null;
  audioPlayed: boolean;
  showInfo: boolean;
}

interface Props {
  contentStr: string;
  activityId?: string;
  assignmentId?: string | null;
}

// Sound button colors
const SOUND_COLORS: Record<EdSound, { bg: string; hover: string; active: string; text: string }> = {
  d: { bg: 'bg-emerald-100', hover: 'hover:bg-emerald-200', active: 'bg-emerald-500', text: 'text-emerald-700' },
  t: { bg: 'bg-sky-100', hover: 'hover:bg-sky-200', active: 'bg-sky-500', text: 'text-sky-700' },
  id: { bg: 'bg-amber-100', hover: 'hover:bg-amber-200', active: 'bg-amber-500', text: 'text-amber-700' },
};

export default function EdPronunciationGame({ contentStr, activityId, assignmentId }: Props) {
  const [state, setState] = useState<GameState>({
    mode: 'sorting',
    phase: 'menu',
    difficulty: 'mixed',
    verbs: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    answers: [],
    selectedAnswer: null,
    showFeedback: false,
    discoveryPhase: 0,
    pointsToast: null,
    minimalPairTarget: null,
    audioPlayed: false,
    showInfo: false,
  });

  const [isAudioSupported, setIsAudioSupported] = useState(true);

  // Check for Web Speech API support
  useEffect(() => {
    setIsAudioSupported('speechSynthesis' in window);
  }, []);

  // Parse content for custom settings
  useEffect(() => {
    try {
      const content = JSON.parse(contentStr);
      if (content.mode) {
        setState(prev => ({ ...prev, mode: content.mode }));
      }
      if (content.difficulty) {
        setState(prev => ({ ...prev, difficulty: content.difficulty }));
      }
    } catch {
      // Use defaults
    }
  }, [contentStr]);

  const playAudio = useCallback(async (word: string) => {
    // Try pre-recorded audio first
    const audioPath = `/audio/verbs/${word.toLowerCase()}.mp3`;

    try {
      const audio = new Audio(audioPath);

      // Check if the file exists by trying to load it
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject();
        audio.load();
      });

      audio.play();
      setState(prev => ({ ...prev, audioPlayed: true }));
      return;
    } catch {
      // File doesn't exist, fall back to Web Speech API
    }

    // Fallback to Web Speech API
    if (!isAudioSupported) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.lang = 'en-US';

    // Try to get an American English voice
    const voices = window.speechSynthesis.getVoices();
    const americanVoice = voices.find(v =>
      v.lang.startsWith('en-US') ||
      v.name.includes('US') ||
      v.name.includes('American')
    );
    if (americanVoice) {
      utterance.voice = americanVoice;
    }

    window.speechSynthesis.speak(utterance);
    setState(prev => ({ ...prev, audioPlayed: true }));
  }, [isAudioSupported]);

  const startGame = useCallback((mode: GameMode) => {
    const roundSize = 15;
    let verbs: EdVerb[];

    if (mode === 'sorting') {
      verbs = getGameRound(roundSize, state.difficulty);
    } else {
      // For minimal pairs, we need base/past pairs
      const pairs = getMinimalPairs(roundSize);
      verbs = pairs.map(p => p.verb);
    }

    setState(prev => ({
      ...prev,
      mode,
      phase: 'playing',
      verbs,
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: [],
      selectedAnswer: null,
      showFeedback: false,
      discoveryPhase: 0,
      minimalPairTarget: mode === 'minimal-pairs' ? (Math.random() > 0.5 ? 'base' : 'past') : null,
      audioPlayed: false,
    }));
  }, [state.difficulty]);

  const handleSortingAnswer = useCallback((answer: EdSound) => {
    if (state.showFeedback) return;

    const currentVerb = state.verbs[state.currentIndex];
    const isCorrect = answer === currentVerb.sound;

    setState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : 0),
      discoveryPhase: prev.discoveryPhase + 1,
      answers: [...prev.answers, { verb: currentVerb, userAnswer: answer, correct: isCorrect }],
    }));
  }, [state.currentIndex, state.verbs, state.showFeedback]);

  const handleMinimalPairAnswer = useCallback((answer: 'base' | 'past') => {
    if (state.showFeedback) return;

    const isCorrect = answer === state.minimalPairTarget;

    setState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : 0),
      answers: [...prev.answers, {
        verb: prev.verbs[prev.currentIndex],
        userAnswer: answer,
        correct: isCorrect
      }],
    }));
  }, [state.showFeedback, state.minimalPairTarget]);

  const nextQuestion = useCallback(async () => {
    if (state.currentIndex >= state.verbs.length - 1) {
      // Game complete
      setState(prev => ({ ...prev, phase: 'results' }));

      if (activityId) {
        const accuracy = (state.score / state.verbs.length) * 100;
        const result = await saveActivityProgress(
          activityId,
          100,
          'completed',
          accuracy,
          state.mode,
          assignmentId
        );

        if (result?.pointsAwarded && result.pointsAwarded > 0) {
          setState(prev => ({
            ...prev,
            pointsToast: { points: result.pointsAwarded!, key: Date.now() }
          }));
        }
      }
    } else {
      // Next question
      const nextTarget = state.mode === 'minimal-pairs'
        ? (Math.random() > 0.5 ? 'base' : 'past')
        : null;

      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedAnswer: null,
        showFeedback: false,
        minimalPairTarget: nextTarget,
        audioPlayed: false,
      }));
    }
  }, [state.currentIndex, state.verbs.length, state.score, state.mode, activityId, assignmentId]);

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'menu',
      verbs: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: [],
      selectedAnswer: null,
      showFeedback: false,
      discoveryPhase: 0,
      pointsToast: null,
      minimalPairTarget: null,
      audioPlayed: false,
    }));
  }, []);

  // Get feedback message based on discovery phase
  const getFeedbackMessage = useCallback((verb: EdVerb, isCorrect: boolean): string => {
    if (isCorrect) {
      if (state.discoveryPhase < 5) {
        return "Correct!";
      } else if (state.discoveryPhase < 10) {
        // Show pattern hint
        const sameSound = state.answers.filter(a => a.verb.sound === verb.sound && a.correct);
        if (sameSound.length >= 2) {
          const examples = sameSound.slice(-2).map(a => a.verb.past).join(', ');
          return `Yes! Notice: ${examples}, ${verb.past} all end in ${SOUND_RULES[verb.sound].symbol}`;
        }
        return `Correct! ${verb.past} ends in ${SOUND_RULES[verb.sound].symbol}`;
      } else {
        // Show full rule
        return `Correct! ${SOUND_RULES[verb.sound].shortRule}`;
      }
    } else {
      if (state.discoveryPhase < 5) {
        return `Not quite. Listen again to "${verb.past}"`;
      } else if (state.discoveryPhase < 10) {
        return `The -ed in "${verb.past}" sounds like ${SOUND_RULES[verb.sound].symbol}`;
      } else {
        return `${verb.past} → ${SOUND_RULES[verb.sound].symbol}. ${SOUND_RULES[verb.sound].shortRule}`;
      }
    }
  }, [state.discoveryPhase, state.answers]);

  // Menu screen
  if (state.phase === 'menu') {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto md:relative md:inset-auto md:z-auto md:bg-transparent md:max-w-4xl md:mx-auto md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-full md:min-h-0 bg-white md:rounded-3xl md:shadow-xl md:overflow-hidden md:border border-sage/20"
        >
          <div className="bg-gradient-to-br from-fuchsia-200 to-rose-300 p-6 sm:p-8 text-white text-center pb-12 rounded-b-[2.5rem] md:rounded-b-none shadow-lg md:shadow-none relative">
            <button 
              onClick={() => window.history.back()}
              className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setState(prev => ({ ...prev, showInfo: true }))}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors flex items-center gap-2 px-3"
            >
              <Info className="w-5 h-5" />
              <span className="text-sm font-bold hidden sm:inline">Rules</span>
            </button>
            <Volume2 className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">-ed Sounds</h1>
            <p className="text-white/90 font-medium">Master the three pronunciations of -ed endings</p>
          </div>

          <div className="px-4 pb-8 -mt-6 md:mt-0 md:p-8 space-y-6 md:space-y-8 max-w-lg mx-auto md:max-w-none">
            {/* The three sounds explanation (Quick View) */}
            <div className="grid grid-cols-3 gap-3 text-center bg-white rounded-2xl p-4 shadow-lg md:shadow-none border border-neutral-100 md:border-0 relative z-10">
              <div className="p-3 md:p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="text-xl md:text-2xl font-black text-emerald-600">/d/</div>
                <div className="text-[10px] md:text-xs text-emerald-600/70 mt-1 font-bold">played</div>
              </div>
              <div className="p-3 md:p-4 rounded-2xl bg-sky-50 border border-sky-100">
                <div className="text-xl md:text-2xl font-black text-sky-600">/t/</div>
                <div className="text-[10px] md:text-xs text-sky-600/70 mt-1 font-bold">walked</div>
              </div>
              <div className="p-3 md:p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="text-xl md:text-2xl font-black text-amber-600">/ɪd/</div>
                <div className="text-[10px] md:text-xs text-amber-600/70 mt-1 font-bold">decided</div>
              </div>
            </div>

            {/* Info Modal */}
            <AnimatePresence>
              {state.showInfo && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                  >
                    <div className="bg-violet-50 p-6 text-violet-900 flex items-center justify-between shrink-0 border-b border-violet-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          <Lightbulb className="w-5 h-5 text-violet-600 fill-violet-100" />
                        </div>
                        <h2 className="text-xl font-bold">How to Pronounce -ed</h2>
                      </div>
                      <button 
                        onClick={() => setState(prev => ({ ...prev, showInfo: false }))}
                        className="p-2 hover:bg-violet-100 rounded-full transition-colors text-violet-400 hover:text-violet-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-6 overflow-y-auto">
                      {/* Rule 1: /ɪd/ */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <span className="text-lg font-black text-amber-700">/ɪd/</span>
                          </div>
                          <h3 className="font-bold text-neutral-800 text-lg">The "Extra Syllable" Rule</h3>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-sm md:text-base">
                          <p className="text-neutral-700 mb-2">Use this when the verb ends in <strong>T</strong> or <strong>D</strong>.</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-white rounded border border-amber-200 text-amber-800 font-medium">want ➝ wanted</span>
                            <span className="px-2 py-1 bg-white rounded border border-amber-200 text-amber-800 font-medium">need ➝ needed</span>
                          </div>
                        </div>
                      </div>

                      {/* Rule 2: /t/ */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                            <span className="text-lg font-black text-sky-700">/t/</span>
                          </div>
                          <h3 className="font-bold text-neutral-800 text-lg">The "Soft" Rule</h3>
                        </div>
                        <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-sm md:text-base">
                          <p className="text-neutral-700 mb-2">Use this after "voiceless" sounds like <strong>P, K, F, S, SH, CH</strong>.</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-white rounded border border-sky-200 text-sky-800 font-medium">help ➝ helped</span>
                            <span className="px-2 py-1 bg-white rounded border border-sky-200 text-sky-800 font-medium">wash ➝ washed</span>
                          </div>
                        </div>
                      </div>

                      {/* Rule 3: /d/ */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <span className="text-lg font-black text-emerald-700">/d/</span>
                          </div>
                          <h3 className="font-bold text-neutral-800 text-lg">The "Vibration" Rule</h3>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-sm md:text-base">
                          <p className="text-neutral-700 mb-2">Use this for all other sounds (vowels, n, m, v, z, etc.). </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-white rounded border border-emerald-200 text-emerald-800 font-medium">play ➝ played</span>
                            <span className="px-2 py-1 bg-white rounded border border-emerald-200 text-emerald-800 font-medium">love ➝ loved</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t border-neutral-100 bg-neutral-50 shrink-0">
                      <button 
                         onClick={() => setState(prev => ({ ...prev, showInfo: false }))}
                         className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-violet-200"
                      >
                        Got it!
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Difficulty selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <Target className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Difficulty</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map((level) => {
                  const isSelected = state.difficulty === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setState(prev => ({ ...prev, difficulty: level }))}
                      className={`px-4 py-3 sm:py-2 rounded-xl font-bold capitalize transition-all border text-sm sm:text-base ${
                        isSelected
                          ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white border-fuchsia-700 shadow-lg ring-2 ring-fuchsia-200 -translate-y-0.5'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-fuchsia-300 hover:bg-fuchsia-50'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Game mode buttons */}
            <div className="space-y-4">
              <button
                onClick={() => startGame('sorting')}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 border-b-4 border-fuchsia-800 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:brightness-105 transition-all flex items-center justify-center gap-3 active:scale-95 active:border-b-0 active:translate-y-1"
              >
                <ArrowLeftRight className="w-7 h-7" />
                Sound Sorting
              </button>
              <button
                onClick={() => startGame('minimal-pairs')}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 border-b-4 border-violet-800 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:brightness-105 transition-all flex items-center justify-center gap-3 active:scale-95 active:border-b-0 active:translate-y-1"
              >
                <Ear className="w-7 h-7" />
                Minimal Pairs
              </button>
            </div>

            {/* Mode descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                <div className="font-bold text-violet-700 mb-1">Sound Sorting</div>
                <p className="text-violet-600/80">See a verb, categorize into /t/, /d/, or /ɪd/.</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="font-bold text-indigo-700 mb-1">Minimal Pairs</div>
                <p className="text-indigo-600/80">Hear a word - is it "walk" or "walked"?</p>
              </div>
            </div>

            {!isAudioSupported && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <VolumeX className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Audio not supported in this browser. The game will still work, but without sound.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Results screen
  if (state.phase === 'results') {
    const accuracy = Math.round((state.score / state.verbs.length) * 100);

    // Group answers by sound for summary
    const bySound: Record<EdSound, { correct: number; total: number }> = {
      d: { correct: 0, total: 0 },
      t: { correct: 0, total: 0 },
      id: { correct: 0, total: 0 },
    };

    state.answers.forEach(a => {
      bySound[a.verb.sound].total++;
      if (a.correct) bySound[a.verb.sound].correct++;
    });

    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto md:relative md:inset-auto md:z-auto md:bg-transparent md:max-w-2xl md:mx-auto md:p-6">
        {state.pointsToast && (
          <PointsToast
            key={state.pointsToast.key}
            points={state.pointsToast.points}
            onComplete={() => setState(prev => ({ ...prev, pointsToast: null }))}
          />
        )}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="min-h-full md:min-h-0 bg-white md:rounded-3xl md:shadow-2xl md:overflow-hidden md:border border-sage/20"
        >
          <div className="bg-gradient-to-br from-fuchsia-200 to-rose-300 p-10 text-white text-center">
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-4xl font-display font-bold mb-1">Great Practice!</h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase">
              {state.mode === 'sorting' ? 'Sound Sorting' : 'Minimal Pairs'}
            </span>
          </div>

          <div className="p-6 md:p-10 max-w-lg mx-auto md:max-w-none">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                <div className="text-2xl font-black text-neutral-800 tracking-tight">{accuracy}%</div>
                <div className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Accuracy</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                <div className="text-2xl font-black text-neutral-800 tracking-tight">{state.maxStreak}</div>
                <div className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Best Streak</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <div className="text-2xl font-black text-neutral-800 tracking-tight">{state.score}/{state.verbs.length}</div>
                <div className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Correct</div>
              </div>
              <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 shadow-sm text-center">
                <Coins className="w-6 h-6 mx-auto mb-2 text-violet-600" />
                <div className="text-2xl font-black text-violet-600 tracking-tight">6</div>
                <div className="text-[10px] text-violet-600 uppercase font-black tracking-widest">Points</div>
              </div>
            </div>

            {/* Sound breakdown (for sorting mode) */}
            {state.mode === 'sorting' && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">By Sound</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['d', 't', 'id'] as EdSound[]).map(sound => (
                    <div key={sound} className={`p-3 rounded-xl ${SOUND_COLORS[sound].bg} text-center`}>
                      <div className={`text-xl font-black ${SOUND_COLORS[sound].text}`}>
                        {SOUND_RULES[sound].symbol}
                      </div>
                      <div className={`text-sm font-bold ${SOUND_COLORS[sound].text}`}>
                        {bySound[sound].correct}/{bySound[sound].total}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules summary */}
            <div className="bg-neutral-50 rounded-2xl p-4 mb-8 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-neutral-700">Remember the Rules</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-emerald-700"><strong>/d/</strong> — After voiced sounds (b, g, v, z, m, n, l, r, vowels)</p>
                <p className="text-sky-700"><strong>/t/</strong> — After voiceless sounds (p, k, f, s, sh, ch)</p>
                <p className="text-amber-700"><strong>/ɪd/</strong> — After /t/ or /d/ sounds (adds a syllable)</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetGame}
                className="flex-1 border-2 border-sage/20 text-neutral-600 py-4 rounded-2xl font-bold hover:bg-sage/5 transition-all flex items-center justify-center gap-2"
              >
                Change Mode
              </button>
              <button
                onClick={() => startGame(state.mode)}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
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

  // Playing screen
  const currentVerb = state.verbs[state.currentIndex];
  const progress = ((state.currentIndex + 1) / state.verbs.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-white md:relative md:inset-auto md:z-auto md:bg-transparent max-w-2xl mx-auto md:p-6 min-h-[100dvh] md:min-h-[calc(100dvh-14rem)] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-white md:hidden">
        <button
          onClick={resetGame}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full">
             <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
               {state.currentIndex + 1}/{state.verbs.length}
             </span>
           </div>
           
           <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold">{state.streak}</span>
           </div>
           
           <div className="min-w-[40px] text-right font-black text-violet-600">
             {state.score}
           </div>
        </div>
      </div>
      
      {/* Mobile progress bar added to top */}
      <div className="h-1 bg-neutral-100 md:hidden">
        <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
          />
      </div>

      <div className="hidden sm:flex items-center justify-between gap-2 mb-6">
        <button
          onClick={resetGame}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-neutral-200 bg-white text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Settings
        </button>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Question</span>
            <span className="text-xl font-bold text-neutral-800">
              {state.currentIndex + 1} / {state.verbs.length}
            </span>
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
          <div className="text-xl font-bold text-violet-600">{state.score}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-5 sm:mb-8">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
        />
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 pb-2 sm:pb-4">
        {state.mode === 'sorting' ? (
          // Sound Sorting Mode
          <>
            {/* Word display */}
            <motion.div
              key={state.currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-2"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-800 mb-3">
                {currentVerb.past}
              </div>
              <button
                onClick={() => playAudio(currentVerb.past)}
                disabled={!isAudioSupported}
                className={`flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full font-bold transition-all ${
                  isAudioSupported
                    ? 'bg-violet-100 text-violet-700 hover:bg-violet-200 active:scale-95'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                Listen
              </button>
            </motion.div>

            {/* Sound buttons */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md mb-2">
              {(['d', 't', 'id'] as EdSound[]).map((sound) => {
                const isSelected = state.selectedAnswer === sound;
                const isCorrect = state.showFeedback && sound === currentVerb.sound;
                const isWrong = state.showFeedback && isSelected && sound !== currentVerb.sound;

                return (
                  <button
                    key={sound}
                    onClick={() => handleSortingAnswer(sound)}
                    disabled={state.showFeedback}
                    className={`
                      p-4 sm:p-6 rounded-2xl font-black text-xl sm:text-2xl transition-all border-2
                      ${state.showFeedback
                        ? isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                          : isWrong
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                        : `${SOUND_COLORS[sound].bg} ${SOUND_COLORS[sound].text} ${SOUND_COLORS[sound].hover} border-transparent hover:border-neutral-200 active:scale-95`
                      }
                    `}
                  >
                    {SOUND_RULES[sound].symbol}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // Minimal Pairs Mode
          <>
            {/* Audio prompt */}
            <motion.div
              key={state.currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-2"
            >
              <div className="text-lg sm:text-xl text-neutral-500 mb-3">What did you hear?</div>
              <button
                onClick={() => playAudio(state.minimalPairTarget === 'base' ? currentVerb.base : currentVerb.past)}
                disabled={!isAudioSupported}
                className={`flex items-center gap-3 mx-auto px-6 py-3 rounded-full font-bold text-lg sm:text-xl transition-all ${
                  isAudioSupported
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 shadow-lg'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <Volume2 className="w-6 h-6" />
                {state.audioPlayed ? 'Play Again' : 'Play Sound'}
              </button>
            </motion.div>

            {/* Choice buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mb-2">
              {(['base', 'past'] as const).map((choice) => {
                const word = choice === 'base' ? currentVerb.base : currentVerb.past;
                const isSelected = state.selectedAnswer === choice;
                const isCorrect = state.showFeedback && choice === state.minimalPairTarget;
                const isWrong = state.showFeedback && isSelected && choice !== state.minimalPairTarget;

                return (
                  <button
                    key={choice}
                    onClick={() => handleMinimalPairAnswer(choice)}
                    disabled={state.showFeedback}
                    className={`
                      p-4 sm:p-6 rounded-2xl font-black text-xl sm:text-2xl transition-all border-2
                      ${state.showFeedback
                        ? isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                          : isWrong
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                        : 'bg-white text-neutral-800 border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50 active:scale-95'
                      }
                    `}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Feedback */}
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
                    state.answers[state.answers.length - 1]?.correct
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}>
                    {state.mode === 'sorting'
                      ? getFeedbackMessage(currentVerb, state.answers[state.answers.length - 1]?.correct)
                      : state.answers[state.answers.length - 1]?.correct
                        ? "Correct!"
                        : `It was "${state.minimalPairTarget === 'base' ? currentVerb.base : currentVerb.past}"`
                    }
                  </p>
                  {state.mode === 'sorting' && (
                    <p className="text-sm text-neutral-600 mt-1">
                      &quot;{currentVerb.example}&quot;
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        {state.showFeedback && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextQuestion}
            className="w-full max-w-xs bg-neutral-800 text-white px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {state.currentIndex < state.verbs.length - 1 ? 'Next' : 'See Results'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
