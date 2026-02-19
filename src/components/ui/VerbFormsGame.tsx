'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Settings2, 
  Brain,
  Zap,
  Target,
  Coins,
  Loader2
} from 'lucide-react';
import { saveActivityProgress } from '@/lib/activityProgress';
import { PointsToast } from '@/components/ui/PointsToast';

interface VerbData {
  v1: string;
  v1_3rd: string;
  v1_ing: string;
  v2: string;
  v3: string;
}

interface GameState {
  verbs: VerbData[];
  currentIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  totalAnswered: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'custom';
  phase: 'settings' | 'loading' | 'playing' | 'results';
  inputs: {
    v1: string;
    v1_3rd: string;
    v1_ing: string;
    v2: string;
    v3: string;
  };
  validation: {
    v1?: boolean;
    v1_3rd?: boolean;
    v1_ing?: boolean;
    v2?: boolean;
    v3?: boolean;
  } | null;
  hiddenFields: (keyof GameState['inputs'])[][];
  pointsToast: { points: number; key: number } | null;
  irregularOnly: boolean;
  selectedForms: (keyof VerbData)[];
  round: number;
}

interface Props {
  contentStr: string;
  activityId?: string;
}

const DEFAULT_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnWBs92Jmx16VHpbXQECyZ5gK6G-oHSQpsGNB569Hh5PPTGgx4_6U-27ScOmJMdl2XRNifF_FClBqC/pub?output=csv";

export default function VerbFormsGame({ contentStr, activityId }: Props) {
  const [state, setState] = useState<GameState>({
    verbs: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    totalAnswered: 0,
    difficulty: 'medium',
    phase: 'settings',
    inputs: { v1: '', v1_3rd: '', v1_ing: '', v2: '', v3: '' },
    validation: null,
    hiddenFields: [],
    pointsToast: null,
    irregularOnly: false,
    selectedForms: [],
    round: 1
  });

  const startGame = useCallback(async () => {
    setState(prev => ({ ...prev, phase: 'loading' }));
    
    const parseCSV = (csv: string): VerbData[] => {
        // Handle both \n and \r\n line endings
        const lines = csv.replace(/\r/g, '').split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const header = lines[0].toLowerCase().split(',').map(h => h.trim());
        const verbData: VerbData[] = [];

        // Map possible header names
        const getIndex = (names: string[]) => {
            for (const name of names) {
                const idx = header.indexOf(name.toLowerCase());
                if (idx !== -1) return idx;
            }
            return -1;
        };

        const v1Index = getIndex(['v1', 'base', 'present']);
        const v1_3rdIndex = getIndex(['v1-3rd', 'v1_3rd', '3rd person', 'v1 3rd']);
        const v1_ingIndex = getIndex(['v1-ing', 'v1_ing', 'ing', 'v1 ing']);
        const v2Index = getIndex(['v2', 'past']);
        const v3Index = getIndex(['v3', 'past participle', 'participle']);
        const irregularIndex = getIndex(['irregular', 'is_irregular', 'type']);

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            let data: Partial<VerbData> = {};

            if (v1Index !== -1 && cols[v1Index]) {
                data = {
                    v1: cols[v1Index],
                    v1_3rd: cols[v1_3rdIndex],
                    v1_ing: cols[v1_ingIndex],
                    v2: cols[v2Index],
                    v3: cols[v3Index]
                };
            } else if (cols.length >= 6) {
                data = {
                    v1: cols[1],
                    v1_3rd: cols[2],
                    v1_ing: cols[3],
                    v2: cols[4],
                    v3: cols[5]
                };
            } else if (cols.length >= 5) {
                data = {
                    v1: cols[0],
                    v1_3rd: cols[1],
                    v1_ing: cols[2],
                    v2: cols[3],
                    v3: cols[4]
                };
            }

            if (data.v1 && data.v1_3rd && data.v1_ing && data.v2 && data.v3) {
                const isIrregular = irregularIndex !== -1 
                    ? cols[irregularIndex]?.toLowerCase().includes('y') || cols[irregularIndex]?.toLowerCase().includes('irr')
                    : !data.v2.toLowerCase().endsWith('ed');
                
                if (!state.irregularOnly || isIrregular) {
                    verbData.push(data as VerbData);
                }
            }
        }
        return verbData;
    };

    let csvUrl = DEFAULT_CSV_URL;
    try {
        if (contentStr.startsWith('http')) {
            csvUrl = contentStr.trim();
        }
        
        console.log("Fetching CSV from:", csvUrl);
        const response = await fetch(csvUrl);
        const text = await response.text();
        console.log("Raw CSV length:", text.length);
        console.log("CSV Preview (first 100 chars):", text.substring(0, 100).replace(/\n/g, '\\n'));

        const verbs = parseCSV(text);
        
        if (verbs.length === 0) {
            console.error("No valid verbs found. Check CSV format and console logs.");
            throw new Error("No verbs found");
        }

        // Shuffle and take N based on difficulty
        const shuffled = [...verbs].sort(() => Math.random() - 0.5);
        
        let limit = 10; // Default / Easy
        if (state.difficulty === 'medium') limit = 6;
        if (state.difficulty === 'hard') limit = 4;
        if (state.difficulty === 'custom') {
            // formula: 12 - (2 * numHidden), clamped at min 4
            // 1 hidden -> 10 verbs
            // 4 hidden -> 4 verbs
            limit = Math.max(4, 12 - (2 * state.selectedForms.length));
        }
        
        const gameVerbs = shuffled.slice(0, limit);

        // Generate hidden fields based on difficulty
        const hiddenFields = gameVerbs.map(() => {
            const allFields: (keyof GameState['inputs'])[] = ['v1', 'v1_3rd', 'v1_ing', 'v2', 'v3'];
            let toHide: (keyof GameState['inputs'])[] = [];

            if (state.difficulty === 'easy') {
                const shuffledFields = [...allFields].sort(() => Math.random() - 0.5);
                toHide = [shuffledFields[0]];
            } else if (state.difficulty === 'medium') {
                const shuffledFields = [...allFields].sort(() => Math.random() - 0.5);
                toHide = shuffledFields.slice(0, 3);
            } else if (state.difficulty === 'hard') {
                const shuffledFields = [...allFields].sort(() => Math.random() - 0.5);
                toHide = shuffledFields.slice(0, 4);
            } else {
                // Custom mode: hide what is NOT selected (actually, user said "they customize and select what they want to quiz themselves on")
                // So if they select v1 and v2, we should hide v1 and v2.
                toHide = state.selectedForms;
            }
            return toHide;
        });

        // Initialize first verb inputs
        const allFields: (keyof GameState['inputs'])[] = ['v1', 'v1_3rd', 'v1_ing', 'v2', 'v3'];
        const firstHidden = hiddenFields[0] || [];
        const firstVerb = gameVerbs[0];
        const initialInputs = { v1: '', v1_3rd: '', v1_ing: '', v2: '', v3: '' };
        allFields.forEach(f => {
            initialInputs[f] = firstHidden.includes(f) ? '' : (firstVerb[f]?.toLowerCase() || '');
        });

        setState(prev => ({
            ...prev,
            verbs: gameVerbs,
            phase: 'playing',
            currentIndex: 0,
            score: 0,
            streak: 0,
            maxStreak: 0,
            totalAnswered: 0,
            validation: null,
            hiddenFields,
            inputs: initialInputs
        }));
    } catch (error) {
        console.error("Failed to load verbs:", error);
        setState(prev => ({ ...prev, phase: 'settings' }));
    }
  }, [contentStr, state.difficulty, state.irregularOnly, state.selectedForms]);

  const handleInputChange = (field: keyof GameState['inputs'], value: string) => {
    if (state.validation) return;
    setState(prev => ({
      ...prev,
      inputs: { ...prev.inputs, [field]: value.toLowerCase().trim() }
    }));
  };

  const checkAnswer = () => {
    const currentVerb = state.verbs[state.currentIndex];
    const validation = {
      v1: state.inputs.v1 === (currentVerb.v1?.toLowerCase() || ''),
      v1_3rd: state.inputs.v1_3rd === (currentVerb.v1_3rd?.toLowerCase() || ''),
      v1_ing: state.inputs.v1_ing === (currentVerb.v1_ing?.toLowerCase() || ''),
      v2: state.inputs.v2 === (currentVerb.v2?.toLowerCase() || ''),
      v3: state.inputs.v3 === (currentVerb.v3?.toLowerCase() || '')
    };

    const isCorrect = Object.values(validation).every(v => v);

    setState(prev => ({
      ...prev,
      validation,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : 0),
      totalAnswered: prev.totalAnswered + 1
    }));
  };

  const nextVerb = () => {
    if (state.currentIndex >= state.verbs.length - 1) {
      finishGame();
    } else {
      const nextIndex = state.currentIndex + 1;
      const nextVerbData = state.verbs[nextIndex];
      const nextHidden = state.hiddenFields[nextIndex];
      const nextInputs = { v1: '', v1_3rd: '', v1_ing: '', v2: '', v3: '' };
      
      (['v1', 'v1_3rd', 'v1_ing', 'v2', 'v3'] as const).forEach(f => {
        nextInputs[f] = nextHidden.includes(f) ? '' : (nextVerbData[f]?.toLowerCase() || '');
      });

      setState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        inputs: nextInputs,
        validation: null
      }));
    }
  };

  const finishGame = async () => {
    setState(prev => ({ ...prev, phase: 'results' }));

    if (activityId) {
      const accuracy = (state.score / state.verbs.length) * 100;
      
      // Flat 4 points per round as requested
      const totalPoints = 4;

      // Note: saveActivityProgress might award its own points based on the API, 
      // but we pass category and accuracy for the database.
      await saveActivityProgress(
        activityId, 
        100, 
        "completed", 
        accuracy, 
        state.difficulty
      );

      if (totalPoints > 0) {
        setState(prev => ({
          ...prev,
          pointsToast: { points: totalPoints, key: Date.now() }
        }));
      }
    }
  };

  // UI Components
  if (state.phase === 'settings') {
    return (
      <div className="w-full max-w-4xl mx-auto p-0 md:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-none md:rounded-3xl shadow-xl overflow-hidden border-x-0 md:border border-sage/20 min-h-screen md:min-h-0"
        >
          <div className="bg-terracotta p-8 text-white text-center pb-12">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-display font-bold mb-2">Verb Forms Challenge</h1>
            <p className="text-white/80">Master your verbs forms through practice!</p>
          </div>
          
          <div className="p-6 md:p-8 space-y-10 -mt-6 bg-white rounded-t-3xl md:rounded-t-none">
            {/* Challenge Level Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Target className="w-4 h-4 text-terracotta" />
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">1. Choose Challenge Level</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setState(prev => ({ 
                      ...prev, 
                      difficulty: level,
                      selectedForms: [],
                      round: 1
                    }))}
                    className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 overflow-hidden ${
                      state.difficulty === level 
                        ? 'border-terracotta bg-terracotta/5 shadow-md ring-1 ring-terracotta/20 scale-[1.02]' 
                        : 'border-sage/10 hover:border-terracotta/30 bg-white'
                    }`}
                  >
                    <span className={`capitalize font-black text-xl ${
                      state.difficulty === level ? 'text-terracotta' : 'text-neutral-700'
                    }`}>
                      {level}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${
                      state.difficulty === level ? 'text-terracotta/60' : 'text-neutral-400'
                    }`}>
                      {level === 'easy' ? '1 form missing' : level === 'medium' ? '3 forms missing' : 'Only 1 form given'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Settings2 className="w-4 h-4 text-terracotta" />
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">2. Select Missing Forms to Test</h3>
              </div>
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <div className="flex flex-wrap justify-center gap-2">
                  {(['v1', 'v1_3rd', 'v1_ing', 'v2', 'v3'] as (keyof VerbData)[]).map((form) => {
                    const isSelected = state.selectedForms.includes(form) && state.difficulty === 'custom';
                    const labels: Record<string, string> = {
                      v1: 'V1',
                      v1_3rd: 'V1-3rd',
                      v1_ing: 'V1-ing',
                      v2: 'V2',
                      v3: 'V3'
                    };
                    const colorStyles: Record<string, { bg: string; border: string }> = {
                      v1: { bg: '#efb5b0', border: '#d09e99' },
                      v1_3rd: { bg: '#eec99f', border: '#d3b28d' },
                      v1_ing: { bg: '#e6e49e', border: '#cdc98b' },
                      v2: { bg: '#b8d49f', border: '#a2bb8b' },
                      v3: { bg: '#a4ceb5', border: '#8fb59e' }
                    };

                    const style = isSelected ? {
                      backgroundColor: colorStyles[form].bg,
                      borderColor: colorStyles[form].border,
                    } : undefined;

                    return (
                      <button
                        key={form}
                        onClick={() => {
                          setState(prev => {
                            const newForms = prev.selectedForms.includes(form)
                              ? prev.selectedForms.filter(f => f !== form)
                              : prev.selectedForms.length < 4 
                                ? [...prev.selectedForms, form] 
                                : prev.selectedForms;
                            
                            return { ...prev, selectedForms: newForms, difficulty: 'custom' };
                          });
                        }}
                        style={style}
                        className={`px-5 py-3 rounded-xl border-2 font-bold transition-all min-w-[80px] ${
                          isSelected 
                            ? 'text-neutral-900 shadow-md scale-105' 
                            : 'bg-white text-neutral-400 border-neutral-200/50 hover:border-neutral-300'
                        }`}
                      >
                        {labels[form]}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-center text-neutral-400 mt-3 font-medium">
                  {state.difficulty === 'custom' 
                    ? 'Custom mode active: Selected forms will be hidden for the quiz.' 
                    : 'Select any form above to switch to Custom Mode and choose what to hide.'}
                </p>
              </div>
            </div>

            {/* Extra Options Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">3. Extra Challenge</h3>
              </div>
              <div className={`
                flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group
                ${state.irregularOnly 
                  ? 'bg-amber-50 border-amber-200 shadow-sm' 
                  : 'bg-white border-neutral-100 hover:border-neutral-200'}
              `}
              onClick={() => setState(prev => ({ ...prev, irregularOnly: !prev.irregularOnly }))}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all bg-white ${
                    state.irregularOnly 
                      ? 'border-amber-500 text-amber-600 shadow-inner' 
                      : 'border-neutral-200 group-hover:border-neutral-300 text-transparent'
                  }`}>
                    <CheckCircle2 className={`w-6 h-6 transition-transform ${state.irregularOnly ? 'scale-100' : 'scale-50'}`} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`font-black text-lg select-none tracking-tight transition-colors ${
                      state.irregularOnly ? 'text-amber-900' : 'text-neutral-700'
                    }`}>
                      Irregular Verbs only
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${
                      state.irregularOnly ? 'text-amber-600/70' : 'text-neutral-400'
                    }`}>
                      {state.irregularOnly ? 'Focusing on irregulars' : 'Practicing all verbs'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={startGame}
                disabled={state.difficulty === 'custom' && state.selectedForms.length === 0}
                className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:bg-neutral-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Zap className="w-6 h-6 fill-amber-400 text-amber-400" />
                Start Training Session
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (state.phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-terracotta animate-spin" />
        <p className="text-neutral-600 font-medium">Preparing your verb set...</p>
      </div>
    );
  }

  if (state.phase === 'results') {
    const accuracy = Math.round((state.score / state.verbs.length) * 100);
    // pointsPerVerb and bonus removed as they are unused with fixed scoring.
    
    // sessionPoints removed as we use fixed 4 points.
    
    return (
      <div className="max-w-2xl mx-auto p-6">
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
          className="bg-white rounded-3xl shadow-2xl overflow-hidden text-center border border-sage/20"
        >
          <div className="bg-secondary p-10 text-white">
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-4xl font-display font-bold mb-1">Round {state.round} Complete!</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase">
                {state.difficulty} Mode
              </span>
              <span className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider animate-bounce">
                +4 Points
              </span>
            </div>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <Target className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                <div className="text-2xl font-black text-neutral-800 tracking-tight">{accuracy}%</div>
                <div className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Accuracy</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                <div className="text-2xl font-black text-neutral-800 tracking-tight">{state.maxStreak}</div>
                <div className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Best Streak</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <div className="text-2xl font-black text-neutral-800 tracking-tight">{state.score}/{state.verbs.length}</div>
                <div className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Correct</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm">
                <Coins className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <div className="text-2xl font-black text-amber-600 tracking-tight">4</div>
                <div className="text-[10px] text-amber-600 uppercase font-black tracking-widest">Round Points</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setState(prev => ({ ...prev, phase: 'settings', round: 1 }))}
                className="flex-1 border-2 border-sage/20 text-neutral-600 py-4 rounded-2xl font-bold hover:bg-sage/5 transition-all flex items-center justify-center gap-2"
              >
                <Settings2 className="w-5 h-5" />
                Change Settings
              </button>
              <button 
                onClick={() => {
                  setState(prev => ({ ...prev, round: prev.round + 1 }));
                  startGame();
                }}
                className="flex-1 bg-terracotta text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Start Round {state.round + 1}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentVerb = state.verbs[state.currentIndex];
  const progress = ((state.currentIndex + 1) / state.verbs.length) * 100;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1">Round</span>
            <span className="text-2xl font-display font-bold text-neutral-800">
              {state.round}
            </span>
          </div>
          <div className="h-10 w-px bg-neutral-200" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1">Verb</span>
            <span className="text-2xl font-display font-bold text-neutral-800">
              {state.currentIndex + 1} <span className="text-neutral-300 font-light mx-1">/</span> {state.verbs.length}
            </span>
          </div>
          <div className="h-10 w-px bg-neutral-200" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1">Streak</span>
            <div className="flex items-center gap-1.5">
              <Zap className={`w-5 h-5 ${state.streak > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-neutral-300'}`} />
              <span className="text-2xl font-bold text-neutral-800">{state.streak}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xs min-w-[200px]">
          <div className="flex justify-between text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-2">
            <span>Session Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${progress}%` }}
              className="h-full bg-neutral-800"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <InputCard 
          label="V1" 
          sub="present" 
          value={state.inputs.v1} 
          onChange={(v) => handleInputChange('v1', v)}
          isValid={state.validation?.v1}
          correctValue={currentVerb.v1}
          showValidation={!!state.validation}
          isGiven={!state.hiddenFields[state.currentIndex]?.includes('v1')}
          colorClass="bg-[#efb5b0]"
          delay={0}
          onEnter={state.validation ? nextVerb : checkAnswer}
        />
        <InputCard 
          label="V1-3rd" 
          sub="he/she/it" 
          value={state.inputs.v1_3rd} 
          onChange={(v) => handleInputChange('v1_3rd', v)}
          isValid={state.validation?.v1_3rd}
          correctValue={currentVerb.v1_3rd}
          showValidation={!!state.validation}
          isGiven={!state.hiddenFields[state.currentIndex]?.includes('v1_3rd')}
          colorClass="bg-[#eec99f]"
          delay={0.1}
          onEnter={state.validation ? nextVerb : checkAnswer}
        />
        <InputCard 
          label="V1-ing" 
          sub="participle" 
          value={state.inputs.v1_ing} 
          onChange={(v) => handleInputChange('v1_ing', v)}
          isValid={state.validation?.v1_ing}
          correctValue={currentVerb.v1_ing}
          showValidation={!!state.validation}
          isGiven={!state.hiddenFields[state.currentIndex]?.includes('v1_ing')}
          colorClass="bg-[#e6e49e]"
          delay={0.2}
          onEnter={state.validation ? nextVerb : checkAnswer}
        />
        <InputCard 
          label="V2" 
          sub="past" 
          value={state.inputs.v2} 
          onChange={(v) => handleInputChange('v2', v)}
          isValid={state.validation?.v2}
          correctValue={currentVerb.v2}
          showValidation={!!state.validation}
          isGiven={!state.hiddenFields[state.currentIndex]?.includes('v2')}
          colorClass="bg-[#b8d49f]"
          delay={0.3}
          onEnter={state.validation ? nextVerb : checkAnswer}
        />
        <InputCard 
          label="V3" 
          sub="participle" 
          value={state.inputs.v3} 
          onChange={(v) => handleInputChange('v3', v)}
          isValid={state.validation?.v3}
          correctValue={currentVerb.v3}
          showValidation={!!state.validation}
          isGiven={!state.hiddenFields[state.currentIndex]?.includes('v3')}
          colorClass="bg-[#a4ceb5]"
          delay={0.4}
          onEnter={state.validation ? nextVerb : checkAnswer}
        />
      </div>

      <div className="flex justify-center pt-8">
        <AnimatePresence mode="wait">
          {!state.validation ? (
              <button
                onClick={checkAnswer}
                className="bg-neutral-800 text-white px-16 py-5 rounded-full font-bold text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-30 disabled:hover:translate-y-0"
                disabled={Object.keys(state.inputs).some(k => state.hiddenFields[state.currentIndex]?.includes(k as keyof GameState['inputs']) && !state.inputs[k as keyof GameState['inputs']])}
              >
              Verify Forms
            </button>
          ) : (
            <button
              onClick={nextVerb}
              className="bg-terracotta text-white px-16 py-5 rounded-full font-bold text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              {state.currentIndex < state.verbs.length - 1 ? 'Next Verb' : 'Show Results'}
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InputCard({ 
  label, 
  sub, 
  value, 
  onChange, 
  isValid, 
  correctValue, 
  showValidation,
  isGiven,
  colorClass,
  delay,
  onEnter
}: { 
  label: string;
  sub: string;
  value: string;
  onChange: (v: string) => void;
  isValid?: boolean;
  correctValue: string;
  showValidation: boolean;
  isGiven?: boolean;
  colorClass: string;
  delay: number;
  onEnter?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative p-6 rounded-3xl overflow-hidden flex flex-col items-center justify-center min-h-[200px] text-center shadow-sm border border-neutral-200/50 ${colorClass}`}
    >
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-2xl font-black text-neutral-800 tracking-tight">{label}</span>
        <span className="text-[10px] uppercase font-bold text-neutral-600/60 tracking-wider leading-none">{sub}</span>
      </div>

      <div className="w-full relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
          disabled={showValidation || isGiven}
          placeholder={isGiven ? '' : '...'}
          className={`
            w-full bg-white/40 backdrop-blur-sm border-2 rounded-xl py-4 px-2 text-center text-xl font-black transition-all outline-none
            ${showValidation 
              ? (isValid ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50' : 'border-rose-500 text-rose-700 bg-rose-50/50')
              : isGiven
                ? 'border-transparent text-neutral-800 cursor-not-allowed bg-transparent'
                : 'border-white/50 focus:border-white focus:bg-white focus:shadow-lg focus:scale-[1.05]'
            }
          `}
        />
        
        {showValidation && (
          <div className="absolute -top-2 -right-2">
            {isValid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-white" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 fill-white" />
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showValidation && !isValid && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white/90 px-4 py-2 rounded-lg text-xs font-black text-rose-700 border border-rose-100 shadow-sm"
          >
            {correctValue}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
