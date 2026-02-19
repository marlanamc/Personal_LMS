"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Award, ThumbsUp, BookMarked, CheckCircle2, Sparkles } from "lucide-react";
import type { MiniQuizQuestion, QuestionResponse } from "@/types/activity";
import { Button } from "@/components/ui/Button";

interface MiniQuizSectionProps {
    questions: MiniQuizQuestion[];
    onComplete: (score: number, total: number) => void;
    onScoreSubmit?: (score: number, total: number, responses?: QuestionResponse[]) => void;
    topicTitle?: string;
    onBack?: () => void;
}

export function MiniQuizSection({ questions, onComplete, onScoreSubmit, topicTitle = "this grammar topic", onBack }: MiniQuizSectionProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSubmit = () => {
        const responses: QuestionResponse[] = [];
        let correct = 0;

        questions.forEach((q) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            if (isCorrect) correct++;

            responses.push({
                questionId: q.id,
                userAnswer,
                isCorrect,
                skillTag: q.skillTag,
                difficulty: q.difficulty,
                topic: q.topic,
            });
        });

        setScore(correct);
        setSubmitted(true);

        // Save the grade and detailed responses when quiz is submitted (not waiting for "Finish" click)
        if (onScoreSubmit) {
            onScoreSubmit(correct, questions.length, responses);
        }
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    const allAnswered = questions.every((q) => answers[q.id]);
    const answeredCount = Object.keys(answers).length;
    const percentage = (score / questions.length) * 100;

    return (
        <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col touch-manipulation md:static md:h-auto md:min-h-0 md:bg-transparent">
            {/* Mobile Header - Back + Progress */}
            <div className="flex-shrink-0 bg-white border-b-2 border-[var(--color-border)] px-4 py-3 md:hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="flex items-center justify-center w-10 h-10 -ml-2 rounded-lg hover:bg-[var(--color-bg-light)] transition-colors"
                                aria-label="Back to guide"
                            >
                                <svg className="w-5 h-5 text-[var(--color-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            <span className="font-bold text-[var(--color-text)]">Mini Quiz</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">
                            {submitted ? `${score}/${questions.length}` : `${answeredCount}/${questions.length}`}
                        </span>
                        <div className="h-2 w-16 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-[width] duration-300 ${submitted ? (percentage >= 80 ? "bg-success" : percentage >= 60 ? "bg-warning" : "bg-error") : "bg-[var(--color-primary)]"}`}
                                style={{ width: `${submitted ? percentage : (answeredCount / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <motion.div
                    className="mini-quiz-section relative w-full max-w-4xl mx-auto md:bg-white md:rounded-xl md:shadow-lg md:border md:border-border px-4 py-6 sm:px-8 sm:py-8 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Desktop Header */}
                    <motion.div
                        className="hidden md:block text-center mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                        >
                            <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-primary mb-2 font-display">
                            Mini Quiz
                        </h2>
                        <p className="text-text-muted">
                            Test your understanding of {topicTitle}!
                        </p>
                    </motion.div>

                    <AnimatePresence>
                        {submitted && (
                            <motion.div
                                className={`relative overflow-hidden p-4 sm:p-6 rounded-xl mb-6 ${percentage >= 80
                                        ? "bg-success/10 border-2 border-success"
                                        : percentage >= 60
                                            ? "bg-warning/10 border-2 border-warning"
                                            : "bg-error/10 border-2 border-error"
                                    }`}
                                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <div className="text-center">
                                    <motion.div
                                        className="inline-block"
                                        initial={{ scale: 0, rotate: -360 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 12 }}
                                    >
                                        {percentage >= 80 ? (
                                            <Award className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 text-success" />
                                        ) : percentage >= 60 ? (
                                            <ThumbsUp className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 text-warning" />
                                        ) : (
                                            <BookMarked className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 text-error" />
                                        )}
                                    </motion.div>

                                    {/* Confetti effect for perfect scores */}
                                    {percentage >= 80 && (
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                            {[...Array(20)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute"
                                                    style={{
                                                        left: `${Math.random() * 100}%`,
                                                        top: '50%',
                                                    }}
                                                    initial={{ opacity: 1, y: 0, rotate: 0 }}
                                                    animate={{
                                                        opacity: 0,
                                                        y: [-50, -200],
                                                        rotate: Math.random() * 360,
                                                        x: (Math.random() - 0.5) * 200
                                                    }}
                                                    transition={{ duration: 1.5, delay: i * 0.05 }}
                                                >
                                                    <Sparkles className="w-4 h-4 text-success" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    <motion.h3
                                        className="text-xl sm:text-2xl font-bold mb-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Score: {score} / {questions.length}
                                    </motion.h3>
                                    <motion.p
                                        className="text-base sm:text-lg mb-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {percentage >= 80
                                            ? `Excellent work! You've mastered ${topicTitle}!`
                                            : percentage >= 60
                                                ? "Good job! Review the sections you missed."
                                                : "Keep practicing! Review the guide and try again."}
                                    </motion.p>
                                    <motion.p
                                        className="text-sm text-text-muted mb-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.45 }}
                                    >
                                        Click <span className="font-semibold text-text">Finish</span> to see your certificate.
                                    </motion.p>
                                    {/* Desktop result buttons */}
                                    <motion.div
                                        className="hidden sm:flex flex-row items-center justify-center gap-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Button variant="outline" onClick={handleReset}>
                                            Try Again
                                        </Button>
                                        <Button variant="success" onClick={() => onComplete(score, questions.length)}>
                                            Finish
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        {questions.map((question, index) => {
                            const userAnswer = answers[question.id];
                            const isCorrect = userAnswer === question.correctAnswer;
                            const showFeedback = submitted;

                            return (
                                <motion.div
                                    key={question.id}
                                    className={`quiz-question p-4 sm:p-6 rounded-xl border-2 bg-white ${showFeedback && isCorrect
                                            ? "border-success bg-success/5"
                                            : showFeedback && !isCorrect
                                                ? "border-error bg-error/5"
                                                : "border-border"
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <motion.div
                                            className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                                        >
                                            {index + 1}
                                        </motion.div>
                                        <h4 className="text-base font-semibold text-text flex-1 leading-relaxed min-w-0 pt-1">
                                            {question.question}
                                        </h4>
                                    </div>

                                    <div className="space-y-2 ml-0 sm:ml-11">
                                        {question.options.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex items-center gap-3 rounded-lg border p-3 sm:p-4 text-left transition-[background-color,border-color] cursor-pointer min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!submitted
                                                        ? "hover:bg-bg-light border-border active:scale-[0.99]"
                                                        : showFeedback && option.value === question.correctAnswer
                                                            ? "border-success bg-success/10"
                                                            : showFeedback &&
                                                                option.value === userAnswer &&
                                                                !isCorrect
                                                                ? "border-error bg-error/10"
                                                                : "border-border"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    value={option.value}
                                                    checked={userAnswer === option.value}
                                                    onChange={(e) =>
                                                        setAnswers({ ...answers, [question.id]: e.target.value })
                                                    }
                                                    disabled={submitted}
                                                    className="w-5 h-5 text-primary focus:ring-primary focus:ring-2 flex-shrink-0"
                                                />
                                                <span className="text-sm sm:text-base text-text flex-1">{option.label}</span>

                                                <AnimatePresence>
                                                    {showFeedback && option.value === question.correctAnswer && (
                                                        <motion.div
                                                            className="flex-shrink-0"
                                                            initial={{ scale: 0, rotate: -180 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                        >
                                                            <CheckCircle2 className="w-5 h-5 text-success" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </label>
                                        ))}
                                    </div>

                                    <AnimatePresence>
                                        {showFeedback && question.explanation && (
                                            <motion.div
                                                className="mt-4 ml-0 sm:ml-11 p-3 bg-primary/5 rounded-lg border-l-4 border-primary"
                                                initial={{ opacity: 0, height: 0, y: -10 }}
                                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <p className="text-sm text-text">
                                                    <strong>Explanation:</strong> {question.explanation}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Desktop Submit Button */}
                    {!submitted && (
                        <motion.div
                            className="hidden sm:flex mt-8 flex-col items-center gap-3 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: questions.length * 0.1 + 0.3 }}
                        >
                            <motion.div
                                className="w-full max-w-[360px]"
                                whileHover={{ scale: allAnswered ? 1.05 : 1 }}
                                whileTap={{ scale: allAnswered ? 0.95 : 1 }}
                            >
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleSubmit}
                                    disabled={!allAnswered}
                                    className="w-full"
                                >
                                    Submit Quiz
                                </Button>
                            </motion.div>
                            <AnimatePresence>
                                {!allAnswered && (
                                    <motion.p
                                        className="text-sm text-text-muted mt-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        Please answer all questions before submitting
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Mobile bottom spacer for fixed button */}
                    <div className="h-24 sm:hidden" />
                </motion.div>
            </div>

            {/* Mobile Fixed Bottom Bar */}
            <div className="flex-shrink-0 bg-white border-t-2 border-[var(--color-border)] px-4 py-4 sm:hidden">
                {!submitted ? (
                    <div className="flex flex-col gap-2">
                        {!allAnswered && (
                            <p className="text-xs text-center text-[var(--color-text-muted)]">
                                Answer all {questions.length} questions to submit
                            </p>
                        )}
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            className="w-full min-h-[52px] text-lg font-bold"
                        >
                            Submit Quiz
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleReset} className="flex-1 min-h-[52px]">
                            Try Again
                        </Button>
                        <Button variant="success" onClick={() => onComplete(score, questions.length)} className="flex-1 min-h-[52px]">
                            Finish
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
