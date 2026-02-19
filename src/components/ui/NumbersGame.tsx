"use client";

import { useState, useEffect, useRef } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { RotateCcw } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { PointsToast } from "@/components/ui/PointsToast";

interface NumbersGameContent {
    type: "numbers-game";
    category?: string;
}

interface Props {
    contentStr: string;
    activityId?: string;
}

interface GameState {
    score: number;
    streak: number;
    questionCount: number;
    roundNumber: number;
    questionsInRound: number;
    currentNumber: number | null;
    displayNumber: string;
    correctAnswer: string;
    incorrect: number;
}

const NUMBER_WORDS: Record<number, string> = {
    0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
    6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
    11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
    16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
    21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
    26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
    31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five',
    36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
    41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five',
    46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine', 50: 'fifty',
    60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety', 100: 'one hundred',
    200: 'two hundred', 300: 'three hundred', 400: 'four hundred', 500: 'five hundred',
    600: 'six hundred', 700: 'seven hundred', 800: 'eight hundred', 900: 'nine hundred',
    1000: 'one thousand', 2000: 'two thousand', 3000: 'three thousand', 4000: 'four thousand',
    5000: 'five thousand', 6000: 'six thousand', 7000: 'seven thousand', 8000: 'eight thousand',
    9000: 'nine thousand', 10000: 'ten thousand', 100000: 'one hundred thousand',
    1000000: 'one million', 1000000000: 'one billion', 1000000000000: 'one trillion'
};

const ORDINAL_NUMBERS: Record<number, string> = {
    1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth',
    6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth',
    11: 'eleventh', 12: 'twelfth', 13: 'thirteenth', 14: 'fourteenth', 15: 'fifteenth',
    16: 'sixteenth', 17: 'seventeenth', 18: 'eighteenth', 19: 'nineteenth', 20: 'twentieth',
    21: 'twenty-first', 22: 'twenty-second', 23: 'twenty-third', 24: 'twenty-fourth', 25: 'twenty-fifth',
    30: 'thirtieth', 40: 'fortieth', 50: 'fiftieth', 60: 'sixtieth', 70: 'seventieth',
    80: 'eightieth', 90: 'ninetieth', 100: 'one hundredth'
};

const ROUND_NUMBERS = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 100000, 1000000, 1000000000, 1000000000000];

const CATEGORIES: Record<string, { min?: number; max?: number; type?: string; questionsPerRound?: number }> = {
    'Basic Numbers (0-99)': { min: 0, max: 99, questionsPerRound: 10 },
    'Hundreds (100-999)': { min: 100, max: 999, questionsPerRound: 10 },
    'One Thousand to Ten Thousand (1,000-9,999)': { min: 1000, max: 9999, questionsPerRound: 8 },
    'Ten Thousands (10,000-99,999)': { min: 10000, max: 99999, questionsPerRound: 8 },
    'Hundred Thousands (100,000-999,999)': { min: 100000, max: 999999, questionsPerRound: 7 },
    'Millions': { min: 1000000, max: 999999999, questionsPerRound: 6 },
    'Billions': { min: 1000000000, max: 999999999999, questionsPerRound: 5 },
    'Trillions': { min: 1000000000000, max: 999999999999999, questionsPerRound: 5 },
    'Round Numbers (1,000 | 5 million | 1 billion)': { type: 'round', questionsPerRound: 8 },
    'All Cardinal Numbers (Random Ranges)': { type: 'all', questionsPerRound: 8 },
    'Ordinal Numbers (1st, 2nd, 3rd...)': { type: 'ordinal', questionsPerRound: 10 },
    'Years (1100-2099)': { type: 'years', questionsPerRound: 10 }
};

function parseContent(contentStr: string): NumbersGameContent {
    try {
        const parsed = JSON.parse(contentStr);
        if (parsed && typeof parsed === 'object' && parsed.type === 'numbers-game') {
            return parsed as NumbersGameContent;
        }
    } catch {
        // If not JSON, treat as legacy format or default
    }
    // Default content
    return {
        type: 'numbers-game',
        category: 'Basic Numbers (0-99)'
    };
}

function numberToWords(num: number): string {
    if (num === 0) return 'zero';
    if (num <= 20) return NUMBER_WORDS[num] || '';
    if (num < 100) {
        const tens = Math.floor(num / 10) * 10;
        const ones = num % 10;
        if (ones === 0) return NUMBER_WORDS[tens] || '';
        return `${NUMBER_WORDS[tens] || ''}-${NUMBER_WORDS[ones] || ''}`;
    }
    if (num < 1000) {
        const hundreds = Math.floor(num / 100);
        const remainder = num % 100;
        if (remainder === 0) return `${NUMBER_WORDS[hundreds] || ''} hundred`;
        return `${NUMBER_WORDS[hundreds] || ''} hundred ${numberToWords(remainder)}`;
    }
    if (num < 1000000) {
        const thousands = Math.floor(num / 1000);
        const remainder = num % 1000;
        if (remainder === 0) return `${numberToWords(thousands)} thousand`;
        return `${numberToWords(thousands)} thousand ${numberToWords(remainder)}`;
    }
    if (num < 1000000000) {
        const millions = Math.floor(num / 1000000);
        const remainder = num % 1000000;
        if (remainder === 0) return `${numberToWords(millions)} million`;
        return `${numberToWords(millions)} million ${numberToWords(remainder)}`;
    }
    if (num < 1000000000000) {
        const billions = Math.floor(num / 1000000000);
        const remainder = num % 1000000000;
        if (remainder === 0) return `${numberToWords(billions)} billion`;
        return `${numberToWords(billions)} billion ${numberToWords(remainder)}`;
    }
    const trillions = Math.floor(num / 1000000000000);
    const remainder = num % 1000000000000;
    if (remainder === 0) return `${numberToWords(trillions)} trillion`;
    return `${numberToWords(trillions)} trillion ${numberToWords(remainder)}`;
}

function yearToWords(year: number): string[] {
    if (year >= 2000) {
        const lastTwo = year % 100;
        const format1 = 'two thousand' + (lastTwo > 0 ? ' and ' + numberToWords(lastTwo) : '');
        
        if (lastTwo < 10) {
            return [format1];
        } else {
            const firstTwo = Math.floor(year / 100);
            const firstPart = numberToWords(firstTwo);
            const secondPart = lastTwo <= 19 ? NUMBER_WORDS[lastTwo] || '' : numberToWords(lastTwo);
            const format2 = firstPart + ' ' + secondPart;
            return [format1, format2];
        }
    } else if (year < 2000) {
        const century = Math.floor(year / 100);
        const remainder = year % 100;
        
        let centuryWord = '';
        if (century >= 20) {
            centuryWord = NUMBER_WORDS[Math.floor(century / 10) * 10] + '-' + NUMBER_WORDS[century % 10];
        } else if (century >= 10) {
            centuryWord = NUMBER_WORDS[century] || '';
        } else {
            centuryWord = NUMBER_WORDS[century] || '';
        }
        
        if (remainder === 0) {
            return [centuryWord + ' hundred'];
        } else {
            if (remainder < 10) {
                return [centuryWord + ' oh ' + NUMBER_WORDS[remainder]];
            } else if (remainder >= 10 && remainder <= 19) {
                return [centuryWord + ' ' + NUMBER_WORDS[remainder]];
            } else {
                let remainderWord = NUMBER_WORDS[Math.floor(remainder / 10) * 10] || '';
                if (remainder % 10 > 0) {
                    remainderWord += '-' + NUMBER_WORDS[remainder % 10];
                }
                return [centuryWord + ' ' + remainderWord];
            }
        }
    }
    
    return [numberToWords(year)];
}

function formatNumber(num: number, category: string): string {
    if (category === 'Years (1100-2099)') {
        return num.toString();
    }
    return num.toLocaleString();
}

function normalizeAnswer(answer: string): string {
    return answer.toLowerCase()
        .replace(/-/g, ' ')  // Remove dashes but keep commas
        .replace(/\s*,\s*/g, ' ')  // Replace commas (with optional spaces) with single space
        .replace(/\band\b/g, '')  // Remove "and" to accept both "one hundred five" and "one hundred and five"
        .replace(/\s+/g, ' ')  // Normalize multiple spaces to single space
        .trim();
}

function formatAnswerForDisplay(answer: string): string {
    return answer.replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\s+(one|two|three|four|five|six|seven|eight|nine)\b/g, '$1-$2');
}

export default function NumbersGame({ contentStr, activityId }: Props) {
    const content = parseContent(contentStr);
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        streak: 0,
        questionCount: 0,
        roundNumber: 1,
        questionsInRound: 0,
        currentNumber: null,
        displayNumber: '',
        correctAnswer: '',
        incorrect: 0
    });

    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        category: content.category || 'Basic Numbers (0-99)'
    });
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

    // Get questions per round based on current category
    const QUESTIONS_PER_ROUND = CATEGORIES[settings.category]?.questionsPerRound || 10;
    
    const inputRef = useRef<HTMLInputElement>(null);

    // Calculate progress based on rounds completed (each round = 5 questions)
    // Progress is based on completing rounds, not individual questions
	    const progress = gameState.roundNumber > 1 
	        ? 100 // Round complete = 100% progress
	        : gameState.questionsInRound > 0
	            ? Math.round((gameState.questionsInRound / QUESTIONS_PER_ROUND) * 100)
	            : 0;
	    
	    const roundStartScore = (gameState.roundNumber - 1) * QUESTIONS_PER_ROUND;
	    const roundScore = gameState.score - roundStartScore;
	    
	    const isRoundComplete = gameState.questionsInRound >= QUESTIONS_PER_ROUND;

    // Save progress when round is completed
    useEffect(() => {
        if (!activityId || !gameStarted || !isRoundComplete) return;

        // Calculate overall accuracy across all rounds
        const overallAccuracy = gameState.questionCount > 0
            ? Math.round((gameState.score / gameState.questionCount) * 100)
            : 0;

        const saveProgress = async () => {
            const result = await saveActivityProgress(
                activityId,
                100, // Round complete = 100% progress
                "completed",
                overallAccuracy,
                settings.category // Pass category for per-category progress tracking
            );
            if (result?.pointsAwarded && result.pointsAwarded > 0) {
                setPointsToast({ points: result.pointsAwarded, key: Date.now() });
            }
        };

        void saveProgress();
    }, [activityId, isRoundComplete, gameStarted, gameState.score, gameState.questionCount, settings.category]);

    const generateNumber = () => {
        const category = CATEGORIES[settings.category];
        let number: number;
        let correctAnswer: string;
        let displayNumber: string;

        if (category?.type === 'round') {
            number = ROUND_NUMBERS[Math.floor(Math.random() * ROUND_NUMBERS.length)]!;
            correctAnswer = numberToWords(number);
            displayNumber = formatNumber(number, settings.category);
        } else if (category?.type === 'all') {
            const ranges = [
                { min: 0, max: 99 },
                { min: 100, max: 999 },
                { min: 1000, max: 9999 },
                { min: 10000, max: 99999 },
                { min: 100000, max: 999999 },
                { min: 1000000, max: 999999999 },
                { min: 1000000000, max: 999999999999 },
                { min: 1000000000000, max: 999999999999999 }
            ];
            const randomRange = ranges[Math.floor(Math.random() * ranges.length)]!;
            number = Math.floor(Math.random() * (randomRange.max - randomRange.min + 1)) + randomRange.min;
            correctAnswer = numberToWords(number);
            displayNumber = formatNumber(number, settings.category);
        } else if (category?.type === 'ordinal') {
            const ordinalKeys = Object.keys(ORDINAL_NUMBERS).map(Number);
            number = ordinalKeys[Math.floor(Math.random() * ordinalKeys.length)]!;
            correctAnswer = ORDINAL_NUMBERS[number] || '';
            displayNumber = formatNumber(number, settings.category);
        } else if (category?.type === 'years') {
            number = Math.floor(Math.random() * (2099 - 1100 + 1)) + 1100;
            const yearAnswers = yearToWords(number);
            correctAnswer = yearAnswers[0] || '';
            displayNumber = formatNumber(number, settings.category);
        } else if (category?.min !== undefined && category?.max !== undefined) {
            number = Math.floor(Math.random() * (category.max - category.min + 1)) + category.min;
            correctAnswer = numberToWords(number);
            displayNumber = formatNumber(number, settings.category);
        } else {
            // Fallback
            number = Math.floor(Math.random() * 100);
            correctAnswer = numberToWords(number);
            displayNumber = formatNumber(number, settings.category);
        }

        setGameState(prev => ({
            ...prev,
            currentNumber: number,
            displayNumber: displayNumber,
            correctAnswer: correctAnswer
        }));
        
        setUserAnswer('');
        setShowFeedback(false);
        setFeedback('');
    };

    // Auto-focus input when new question is generated
    useEffect(() => {
        if (gameState.currentNumber !== null && !showFeedback && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState.currentNumber, showFeedback]);

    const startGame = () => {
        setGameStarted(true);
        generateNumber();
    };

    const checkAnswer = () => {
        if (!userAnswer.trim()) {
            setFeedback('Please enter an answer!');
            setShowFeedback(true);
            return;
        }

        let isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(gameState.correctAnswer);
        
        // For years 2010 and later, also check alternative format
        if (!isCorrect && settings.category === 'Years (1100-2099)' && gameState.currentNumber !== null && gameState.currentNumber >= 2010) {
            const yearAnswers = yearToWords(gameState.currentNumber);
            isCorrect = yearAnswers.some(answer => 
                normalizeAnswer(userAnswer) === normalizeAnswer(answer)
            );
        }
        
        if (isCorrect) {
            setGameState(prev => ({
                ...prev,
                score: prev.score + 1,
                streak: prev.streak + 1,
                questionCount: prev.questionCount + 1,
                questionsInRound: prev.questionsInRound + 1
            }));
            setFeedback(`Correct! Well done! Answer: ${formatAnswerForDisplay(userAnswer)}. +${gameState.streak + 1} point${gameState.streak + 1 !== 1 ? 's' : ''}`);
        } else {
            setGameState(prev => ({
                ...prev,
                streak: 0,
                questionCount: prev.questionCount + 1,
                questionsInRound: prev.questionsInRound + 1,
                incorrect: prev.incorrect + 1
            }));
            
            if (settings.category === 'Years (1100-2099)' && gameState.currentNumber !== null && gameState.currentNumber >= 2010) {
                const yearAnswers = yearToWords(gameState.currentNumber);
                const formattedAnswers = yearAnswers.map(answer => formatAnswerForDisplay(answer));
                const allAnswers = formattedAnswers.join('" or "');
                setFeedback(`Incorrect. The correct answer is "${allAnswers}"`);
            } else {
                setFeedback(`Incorrect. The correct answer is "${formatAnswerForDisplay(gameState.correctAnswer)}"`);
            }
        }
        
        setShowFeedback(true);
    };

    const nextQuestion = () => {
        // Check if round is complete
        if (isRoundComplete) {
            // Start next round
            setGameState(prev => ({
                ...prev,
                roundNumber: prev.roundNumber + 1,
                questionsInRound: 0
            }));
        }
        generateNumber();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (showFeedback) {
                nextQuestion();
            } else {
                checkAnswer();
            }
        } else if (e.key === 'ArrowRight') {
            nextQuestion();
        }
    };

    const resetGame = () => {
        setGameState({
            score: 0,
            streak: 0,
            questionCount: 0,
            roundNumber: 1,
            questionsInRound: 0,
            currentNumber: null,
            displayNumber: '',
            correctAnswer: '',
            incorrect: 0
        });
        setUserAnswer('');
        setFeedback('');
        setShowFeedback(false);
        setGameStarted(false);
        if (activityId) {
            void saveActivityProgress(activityId, 0, "in_progress");
        }
    };

    if (!gameStarted) {
        return (
            <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col md:static md:max-w-4xl md:mx-auto md:px-3 md:py-4">
                {/* Header */}
                <div className="flex-shrink-0 bg-white border-b-2 md:border md:rounded-xl shadow-sm border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <BackButton
                            onClick={() => window.history.back()}
                            className="shrink-0 md:hidden"
                        />
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex-1">
                            Numbers to English Words
                        </h1>
                    </div>
                </div>

                {/* Instructions Toggle */}
                <div className="px-4 py-4 md:px-0">
                    <button 
                        className="w-full md:w-auto px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                        onClick={() => setShowInstructions(!showInstructions)}
                    >
                        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                    </button>
                </div>

                {/* Instructions */}
                {showInstructions && (
                    <div className="px-4 pb-4 md:px-0">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Number Categories Explained</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li><strong>Round Numbers:</strong> Common benchmark numbers (e.g., one thousand, five million, one billion)</li>
                                <li><strong>All Cardinal Numbers:</strong> Any number from 0 to trillions</li>
                                <li><strong>Basic Numbers:</strong> 0 to 99 (e.g., twenty-five)</li>
                                <li><strong>Hundreds:</strong> 100 to 999 (e.g., three hundred and forty-five)</li>
                                <li><strong>Ten Thousands:</strong> 10,000 to 99,999 (e.g., forty-five thousand)</li>
                                <li><strong>Hundred Thousands:</strong> 100,000 to 999,999 (e.g., three hundred and forty-five thousand)</li>
                                <li><strong>Millions/Billions/Trillions:</strong> Numbers in respective ranges</li>
                                <li><strong>Ordinal Numbers:</strong> Numbers showing position or rank (1st → first, 2nd → second)</li>
                                <li><strong>Years:</strong> 1100-2099 (e.g., nineteen oh five, two thousand and one)</li>
                            </ul>
                            
                            <h4 className="text-base font-bold text-gray-900 mt-6 mb-2">Keyboard Shortcuts</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li><strong>Enter:</strong> Check your answer</li>
                                <li><strong>Right Arrow →:</strong> Get next number</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Settings */}
                <div className="flex-1 overflow-y-auto px-4 py-4 md:px-0 md:py-0">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Game Settings</h2>
                        <p className="text-sm text-gray-600 mb-6">Customize your practice session</p>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Number Category
                            </label>
                            <select 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                value={settings.category}
                                onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value }))}
                            >
                                {Object.keys(CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="text-center">
                            <button 
                                className="px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[#d4865a] transition-[background-color,box-shadow] shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                onClick={startGame}
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col md:static md:max-w-4xl md:mx-auto md:px-3 md:py-4">
            {/* Points Toast */}
            {pointsToast && (
                <PointsToast
                    key={pointsToast.key}
                    points={pointsToast.points}
                    onComplete={() => setPointsToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b-2 md:border md:rounded-xl shadow-sm border-[var(--color-border)] p-4">
                <div className="flex items-center gap-3 mb-4">
                    <BackButton
                        onClick={() => window.history.back()}
                        className="shrink-0 md:hidden"
                    />
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
                            Numbers to English Words
                        </h1>
                        <div className="text-xs md:text-sm text-[var(--color-text-muted)] mt-1">
                            Round {gameState.roundNumber} • Question {gameState.questionsInRound + (gameState.currentNumber !== null ? 1 : 0)}/{QUESTIONS_PER_ROUND}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-light)] transition-colors"
                        aria-label="Settings"
                    >
                        <SettingsIcon className="w-6 h-6 text-[var(--color-text-muted)]" />
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-700">{gameState.score}</div>
                        <div className="text-xs text-green-600">Correct</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-700">{gameState.incorrect}</div>
                        <div className="text-xs text-red-600">Incorrect</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-700">
                            {Math.round((gameState.score / Math.max(gameState.questionCount, 1)) * 100)}%
                        </div>
                        <div className="text-xs text-blue-600">Success</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-700">{gameState.streak}</div>
                        <div className="text-xs text-yellow-600">Streak</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-[var(--color-bg-light)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Settings Panel - Collapsible */}
            {showSettings && (
                <div className="flex-shrink-0 bg-[var(--color-bg-light)] border-b-2 border-[var(--color-border)] px-4 py-4 flex flex-col gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                            Number Category
                        </label>
                        <select 
                            className="w-full px-4 py-3 border-2 border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            value={settings.category}
                            onChange={(e) => {
                                setSettings(prev => ({ ...prev, category: e.target.value }));
                                // Reset game when category changes
                                if (gameStarted) {
                                    resetGame();
                                }
                            }}
                        >
                            {Object.keys(CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={resetGame}
                            className="flex-1 py-2.5 px-4 text-sm font-medium rounded-lg bg-white text-[var(--color-text)] hover:bg-[var(--color-border)] transition-[background-color] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset Game
                        </button>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showInstructions}
                            onChange={(e) => setShowInstructions(e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                        />
                        <span className="text-sm font-medium text-[var(--color-text)]">Show instructions</span>
                    </label>
                </div>
            )}

            {/* Instructions */}
            {showInstructions && (
                <div className="px-4 pb-4 md:px-0">
                    <div className="bg-white border border-[var(--color-border)] rounded-xl p-4 shadow-sm text-sm text-[var(--color-text)]">
                        <h4 className="font-bold mb-3 text-[var(--color-text)]">Number Categories Explained</h4>
                        <ul className="space-y-2 mb-4 text-[var(--color-text-muted)]">
                            <li><strong className="text-[var(--color-text)]">Round Numbers:</strong> Common benchmark numbers (e.g., one thousand, five million)</li>
                            <li><strong className="text-[var(--color-text)]">All Cardinal Numbers:</strong> Any number from 0 to trillions</li>
                            <li><strong className="text-[var(--color-text)]">Basic Numbers:</strong> 0 to 99 (e.g., twenty-five)</li>
                            <li><strong className="text-[var(--color-text)]">Hundreds:</strong> 100 to 999 (e.g., three hundred and forty-five)</li>
                            <li><strong className="text-[var(--color-text)]">Ordinal Numbers:</strong> Numbers showing position (1st → first, 2nd → second)</li>
                            <li><strong className="text-[var(--color-text)]">Years:</strong> 1100-2099 (e.g., nineteen oh five, two thousand and one)</li>
                        </ul>
                        <h4 className="font-bold mb-2 text-[var(--color-text)]">Keyboard Shortcuts</h4>
                        <ul className="space-y-1 text-[var(--color-text-muted)]">
                            <li><strong className="text-[var(--color-text)]">Enter:</strong> Check your answer</li>
                            <li><strong className="text-[var(--color-text)]">Right Arrow →:</strong> Get next number</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 md:overflow-visible md:px-0 md:py-0">
                <div className="bg-white md:rounded-2xl shadow-lg border-0 md:border border-[var(--color-border)] p-6 sm:p-8 mb-6">
                    {/* Question */}
                    <div className="mb-8 text-center">
                        <h3 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] mb-6 font-display">
                            {gameState.displayNumber}
                        </h3>
                        <p className="text-lg text-[var(--color-text-muted)] mb-6">
                            Write this number in words:
                        </p>
                        
                        {/* Input */}
                        <div className="max-w-md mx-auto">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your answer…"
                                className="w-full px-6 py-4 text-xl border-2 border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] transition-colors text-center text-[var(--color-text)] bg-white"
                                disabled={showFeedback}
                            />
                        </div>
                    </div>

                    {/* Round Complete Message */}
                    {isRoundComplete && showFeedback && (
                        <div className="bg-[var(--color-secondary)] text-white rounded-xl p-6 text-center mb-4">
                            <h2 className="text-2xl font-bold mb-2">🎊 Round {gameState.roundNumber} Complete!</h2>
                            <p className="text-lg mb-1">
                                Round Score: <strong>{roundScore}</strong> / {QUESTIONS_PER_ROUND}
                            </p>
                            <p className="text-sm text-white/80">
                                {roundScore === QUESTIONS_PER_ROUND
                                    ? "Perfect round! Excellent work!"
                                    : roundScore >= Math.round(QUESTIONS_PER_ROUND * 0.9)
                                        ? "Great job!"
                                        : "Keep practicing!"}
                            </p>
                            <p className="text-xs text-white/70 mt-2">
                                Overall: {gameState.score} correct out of {gameState.questionCount} questions
                            </p>
                        </div>
                    )}

                    {/* Feedback */}
                    {showFeedback && !isRoundComplete && (
                        <div className={`p-4 rounded-xl mb-4 ${
                            feedback.startsWith('Correct') 
                                ? 'bg-green-50 border-2 border-green-300' 
                                : 'bg-red-50 border-2 border-red-300'
                        }`}>
                            <p className={`font-bold text-lg mb-2 ${
                                feedback.startsWith('Correct') ? 'text-green-900' : 'text-red-900'
                            }`}>
                                {feedback.startsWith('Correct') ? '🎉 Correct!' : '❌ Incorrect'}
                            </p>
                            <p className={feedback.startsWith('Correct') ? 'text-green-800' : 'text-red-800'}>
                                {feedback.startsWith('Correct') 
                                    ? feedback.replace('Correct! Well done! ', '')
                                    : feedback.replace('Incorrect. ', '')}
                            </p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {!showFeedback ? (
                            <button
                                onClick={checkAnswer}
                                className="w-full sm:w-auto px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[#d4865a] transition-[background-color,box-shadow,transform] shadow-lg hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            >
                                Check Answer
                            </button>
                        ) : (
                            <button
                                onClick={nextQuestion}
                                className="w-full sm:w-auto px-8 py-3 bg-[var(--color-text)] text-white font-semibold rounded-lg hover:bg-black transition-[background-color,box-shadow,transform] shadow-lg hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            >
                                {isRoundComplete ? `Start Round ${gameState.roundNumber + 1} →` : 'Next Question →'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Settings Icon component
function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6"/>
            <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"/>
            <path d="M1 12h6m6 0h6"/>
            <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"/>
        </svg>
    );
}
