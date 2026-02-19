'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export interface DragDropExerciseData {
    type: 'drag-drop';
    prompt: string;
    words: string[];
    correctOrder: string[];
    explanation?: string;
}

interface DragDropExerciseProps {
    exercise: DragDropExerciseData;
    onComplete?: (correct: boolean) => void;
}

export function DragDropExercise({ exercise, onComplete }: DragDropExerciseProps) {
    const [items, setItems] = useState<string[]>([...exercise.words]);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleCheck = () => {
        const correct = items.every((word, index) => word === exercise.correctOrder[index]);
        setIsCorrect(correct);
        setIsChecked(true);
        onComplete?.(correct);
    };

    const handleReset = () => {
        setItems([...exercise.words]);
        setIsChecked(false);
        setIsCorrect(null);
    };

    const allWordsPlaced = items.length === exercise.correctOrder.length;

    return (
        <div className="drag-drop-exercise space-y-4">
            <p className="text-sm font-medium text-text mb-3">{exercise.prompt}</p>

            {/* Drop Zone - Reorderable List */}
            <div className="min-h-[120px] bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg p-4">
                <p className="text-xs text-text-muted mb-3">Drag words into the correct order:</p>

                <Reorder.Group
                    axis="y"
                    values={items}
                    onReorder={setItems}
                    className="space-y-2"
                >
                    {items.map((word, index) => (
                        <Reorder.Item
                            key={word}
                            value={word}
                            className={`
                                flex items-center gap-3 bg-white border-2 rounded-lg p-3 cursor-move
                                transition-colors duration-200
                                ${isChecked
                                    ? word === exercise.correctOrder[index]
                                        ? 'border-success bg-success/5'
                                        : 'border-error bg-error/5'
                                    : 'border-border hover:border-primary/50'
                                }
                            `}
                            whileHover={{ scale: isChecked ? 1 : 1.02 }}
                            whileDrag={{ scale: 1.05, zIndex: 1 }}
                        >
                            <GripVertical className="w-5 h-5 text-text-muted flex-shrink-0" />
                            <span className="flex-1 font-medium text-text">{word}</span>
                            <span className="text-xs text-text-muted bg-border px-2 py-1 rounded">
                                {index + 1}
                            </span>
                            {isChecked && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                >
                                    {word === exercise.correctOrder[index] ? (
                                        <CheckCircle2 className="w-5 h-5 text-success" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-error" />
                                    )}
                                </motion.div>
                            )}
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {items.length === 0 && (
                    <p className="text-sm text-text-muted text-center py-8">
                        Drag words here to build your sentence
                    </p>
                )}
            </div>

            {/* Result Preview */}
            {items.length > 0 && (
                <motion.div
                    className="bg-bg-light border border-border rounded-lg p-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-xs text-text-muted mb-2">Your sentence:</p>
                    <p className="text-base font-medium text-text">
                        {items.join(' ')}
                    </p>
                </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <motion.button
                    onClick={handleCheck}
                    disabled={!allWordsPlaced || isChecked}
                    className={`
                        flex-1 px-4 py-2 rounded-lg font-medium text-white
                        transition-[background-color] duration-200
                        ${allWordsPlaced && !isChecked
                            ? 'bg-primary hover:bg-primary/90 cursor-pointer'
                            : 'bg-border cursor-not-allowed opacity-50'
                        }
                    `}
                    whileHover={allWordsPlaced && !isChecked ? { scale: 1.02 } : {}}
                    whileTap={allWordsPlaced && !isChecked ? { scale: 0.98 } : {}}
                >
                    Check Answer
                </motion.button>

                {isChecked && (
                    <motion.button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-lg font-medium text-text border-2 border-border hover:border-primary/50 transition-colors"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <RotateCcw className="w-5 h-5" />
                    </motion.button>
                )}
            </div>

            {/* Feedback */}
            {isChecked && (
                <motion.div
                    className={`
                        rounded-lg p-4 border-2
                        ${isCorrect
                            ? 'bg-success/10 border-success/30'
                            : 'bg-error/10 border-error/30'
                        }
                    `}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-success" />
                                <span className="font-bold text-success">Perfect!</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-error" />
                                <span className="font-bold text-error">Not quite right</span>
                            </>
                        )}
                    </div>
                    {!isCorrect && (
                        <div className="text-sm text-text">
                            <p className="font-medium mb-1">Correct order:</p>
                            <p className="italic">{exercise.correctOrder.join(' ')}</p>
                        </div>
                    )}
                    {exercise.explanation && isCorrect && (
                        <p className="text-sm text-text mt-2">{exercise.explanation}</p>
                    )}
                </motion.div>
            )}
        </div>
    );
}
