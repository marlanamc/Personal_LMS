import { useEffect, useMemo, useState } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { BackButton } from "@/components/ui/BackButton";
import { PointsToast } from "@/components/ui/PointsToast";

interface FillInBlankQuestion {
    id: number;
    sentence: string;
    correctAnswer: string;
    options: string[];
    explanation?: string;
}

interface Props {
    contentStr: string;
    activityId?: string;
    assignmentId?: string | null;
    vocabType?: string;
}

export default function FillInBlankGame({ contentStr, activityId, assignmentId, vocabType }: Props) {
    const questions = useMemo(
        () => shuffleArray(parseQuestions(contentStr)),
        [contentStr]
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const isComplete = selectedAnswer !== null && isLastQuestion;

    // Calculate progress: count answered questions (current + 1 if answered)
    const answeredCount = currentIndex + (selectedAnswer ? 1 : 0);
    const progress = (answeredCount / questions.length) * 100;

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer) return; // Already answered

        setSelectedAnswer(answer);
        const correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
        }
    };

    useEffect(() => {
        if (!activityId || questions.length === 0) return;
        const value = Math.round(progress);

        const saveProgress = async () => {
            const result = await saveActivityProgress(
                activityId,
                value,
                value >= 100 ? "completed" : "in_progress",
                undefined,
                undefined,
                assignmentId ?? null,
                undefined,
                vocabType
            );
            if (result?.pointsAwarded && result.pointsAwarded > 0) {
                setPointsToast({ points: result.pointsAwarded, key: Date.now() });
            }
        };

        void saveProgress();
    }, [activityId, assignmentId, progress, questions.length, vocabType]);

    // Save 100% progress when quiz is completed
    useEffect(() => {
        if (isComplete && activityId) {
            const finishQuiz = async () => {
                const result = await saveActivityProgress(
                    activityId,
                    100,
                    "completed",
                    undefined,
                    undefined,
                    assignmentId ?? null,
                    undefined,
                    vocabType
                );
                if (result?.pointsAwarded && result.pointsAwarded > 0) {
                    setPointsToast({ points: result.pointsAwarded, key: Date.now() });
                }
            };

            void finishQuiz();
        }
    }, [isComplete, activityId, assignmentId, vocabType]);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
            setShowExplanation(false);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setScore(0);
        setShowExplanation(false);
        if (activityId) {
            void saveActivityProgress(activityId, 0, "in_progress", undefined, undefined, assignmentId ?? null, undefined, vocabType);
        }
    };

    if (questions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <p className="text-gray-500">No questions available.</p>
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
            {/* Header with Progress */}
            <div className="flex-shrink-0 bg-white border-b-2 md:border md:rounded-xl shadow-sm border-gray-200 p-4 flex items-center gap-3">
                <BackButton
                    onClick={() => window.history.back()}
                    className="shrink-0 md:hidden"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-gray-600">
                            Question <span className="text-[var(--color-primary)] font-bold">{currentIndex + 1}</span> of {questions.length}
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            Score: <span className="text-green-600 font-bold">{score}</span> / {questions.length}
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Question Card - Scrollable on mobile */}
            <div className="flex-1 overflow-y-auto px-4 py-4 md:overflow-visible md:px-0 md:py-0">
                <div className="bg-white md:rounded-2xl shadow-lg border-0 md:border border-gray-200 p-6 sm:p-8 mb-6">
                {/* Question Text */}
                <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                        {currentQuestion.sentence.split("_____").map((part, idx, arr) => (
                            <span key={idx}>
                                {part}
                                {idx < arr.length - 1 && (
                                    <span className="inline-block min-w-[88px] sm:min-w-[140px] border-b-4 border-dashed border-[var(--color-primary)] mx-2 pb-1"></span>
                                )}
                            </span>
                        ))}
                    </h3>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectOption = option === currentQuestion.correctAnswer;

                        let bgColor = "bg-white hover:bg-gray-50";
                        let borderColor = "border-gray-300";
                        let textColor = "text-gray-900";

                        if (selectedAnswer) {
                            if (isSelected && isCorrect) {
                                bgColor = "bg-green-50";
                                borderColor = "border-green-500";
                                textColor = "text-green-900";
                            } else if (isSelected && !isCorrect) {
                                bgColor = "bg-red-50";
                                borderColor = "border-red-500";
                                textColor = "text-red-900";
                            } else if (isCorrectOption) {
                                bgColor = "bg-green-50";
                                borderColor = "border-green-400";
                                textColor = "text-green-900";
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={selectedAnswer !== null}
                                className={`p-4 rounded-xl border-2 font-medium text-left transition-[border-color,background-color,color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${bgColor} ${borderColor} ${textColor} ${!selectedAnswer ? "hover:shadow-md hover:-translate-y-0.5" : ""
                                    } disabled:cursor-not-allowed`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-gray-400">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-lg">{option}</span>
                                    {selectedAnswer && isCorrectOption && (
                                        <span className="ml-auto text-green-600">✓</span>
                                    )}
                                    {selectedAnswer && isSelected && !isCorrect && (
                                        <span className="ml-auto text-red-600">✗</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {selectedAnswer && (
                    <div className={`p-4 rounded-xl mb-4 ${isCorrect ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-300"}`}>
                        <p className={`font-bold text-lg mb-2 ${isCorrect ? "text-green-900" : "text-red-900"}`}>
                            {isCorrect ? "🎉 Correct!" : "❌ Not quite right"}
                        </p>
                        {!isCorrect && (
                            <p className="text-gray-700">
                                The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                            </p>
                        )}
                        {currentQuestion.explanation && (
                            <div className="mt-3">
                                <button
                                    onClick={() => setShowExplanation(!showExplanation)}
                                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                                >
                                    {showExplanation ? "Hide explanation" : "Why?"}
                                </button>
                                {showExplanation && (
                                    <p className="mt-2 text-gray-700 text-sm italic">
                                        {currentQuestion.explanation}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Completion Message */}
                {isComplete && (
                    <div className="bg-[var(--color-secondary)] text-white rounded-xl p-6 text-center mb-4">
                        <h2 className="text-3xl font-bold mb-2">🎊 Complete!</h2>
                        <p className="text-xl">
                            You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>
                        </p>
                        <p className="mt-2 text-white/80">
                            {score === questions.length
                                ? "Perfect score! Excellent work!"
                                : score >= questions.length * 0.7
                                    ? "Great job!"
                                    : "Keep practicing!"}
                        </p>
                    </div>
                )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    {!isLastQuestion && selectedAnswer && (
                        <button
                            onClick={handleNext}
                            className="w-full sm:w-auto px-8 py-3 bg-[var(--color-text)] text-white font-semibold rounded-lg hover:bg-black transition-[background-color,box-shadow,transform] shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        >
                            Next Question →
                        </button>
                    )}
                    {isComplete && (
                        <button
                            onClick={handleRestart}
                            className="w-full sm:w-auto px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[#d4865a] transition-[background-color,box-shadow] shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Parse the content string into questions
function parseQuestions(content: string): FillInBlankQuestion[] {
    // Try to parse as JSON first (for consolidated vocab activities)
    try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object' && 'sentences' in parsed && Array.isArray(parsed.sentences)) {
            return parsed.sentences
                .filter((s: any) => s && s.text && s.correctAnswers && s.options)
                .map((s: any, index: number) => ({
                    id: s.id ?? index + 1,
                    sentence: String(s.text).trim(),
                    correctAnswer: Array.isArray(s.correctAnswers) ? s.correctAnswers[0] : String(s.correctAnswers),
                    options: Array.isArray(s.options) ? s.options.map((o: any) => String(o).trim()) : [],
                    explanation: s.explanation ? String(s.explanation).trim() : ''
                }));
        }
    } catch {
        // Not JSON, fall through to plain text parsing
    }

    // Plain text parsing (legacy format)
    const questions: FillInBlankQuestion[] = [];

    // 1. Try resolving standard format
    const blocks = content.trim().split(/\n\n+/);

    let id = 1;
    for (const block of blocks) {
        const lines = block.split("\n").map(l => l.trim()).filter(l => l);

        let sentence = "";
        let correctAnswer = "";
        let options: string[] = [];
        let explanation = "";

        for (const line of lines) {
            if (line.startsWith("Q:")) {
                sentence = line.substring(2).trim();
            } else if (line.startsWith("A:")) {
                correctAnswer = line.substring(2).trim();
            } else if (line.startsWith("OPTIONS:")) {
                options = line.substring(8).split(",").map(o => o.trim());
            } else if (line.startsWith("EXPLAIN:")) {
                explanation = line.substring(8).trim();
            }
        }

        if (sentence && correctAnswer && options.length > 0) {
            questions.push({ id: id++, sentence, correctAnswer, options, explanation });
        }
    }

    if (questions.length > 0) return questions;

    // 2. Fallback: Try generating from Vocab List (Term - Definition - Example)
    return parseVocabToQuestions(content);
}

function parseVocabToQuestions(content: string): FillInBlankQuestion[] {
    const questions: FillInBlankQuestion[] = [];
    const lines = content.split("\n").map(l => l.trim()).filter(Boolean);
    
    interface VocabItem {
        term: string;
        definition: string;
        example?: string;
    }
    
    const items: VocabItem[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let term = "";
        let definition = "";

        // Parse Term line
        if (line.includes("::")) {
            const parts = line.split("::");
            term = parts[0].trim();
            definition = parts[1]?.trim() || "";
        } else if (line.includes("—")) {
             // Term — Definition
             const clean = line.replace(/^\d+\)\s*/, "");
             const parts = clean.split("—");
             term = parts[0].trim();
             definition = parts.slice(1).join("—").trim();
        } else if (line.match(/^\d+\)\s*.+\s+-\s+.+$/)) {
             // Term - Definition
             const clean = line.replace(/^\d+\)\s*/, "");
             const dashIdx = clean.indexOf("-");
             term = clean.substring(0, dashIdx).trim();
             definition = clean.substring(dashIdx + 1).trim();
        }
        
        if (!term) continue;

        // Simplify term (remove PoS)
        term = term.replace(/\s*\([^)]+\)$/, "").trim();
        
        // Look for Example in next line
        let example: string | undefined;
        if (lines[i+1] && lines[i+1].toLowerCase().startsWith("example:")) {
            example = lines[i+1].replace(/^example:\s*/i, "").trim();
            i++; // skip next line
        }
        
        items.push({ term, definition, example });
    }
    
    // Generate questions
    const terms = items.map(i => i.term);
    let id = 1;

    for (const item of items) {
        if (!item.example) continue;
        
        // Find term in example (case insensitive)
        const regex = new RegExp(`\\b${escapeRegExp(item.term)}\\b`, "i");
        if (!regex.test(item.example)) continue;
        
        const sentence = item.example.replace(regex, "_____");
        
        // Generate distractors
        const otherTerms = terms.filter(t => t !== item.term);
        const distractors = shuffleArray(otherTerms).slice(0, 3);
        const options = shuffleArray([item.term, ...distractors]);
        
        questions.push({
             id: id++,
             sentence,
             correctAnswer: item.term,
             options,
             explanation: `Definition: ${item.definition}`
        });
    }
    
    return questions;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}
