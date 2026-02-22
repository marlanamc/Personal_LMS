import type { ExerciseItem } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";

interface SelectExerciseProps {
    item: Extract<ExerciseItem, { type: "select" }>;
    userAnswer: string;
    isCorrect: boolean;
    isIncorrect: boolean;
    submitted: boolean;
    onChange: (value: string) => void;
    itemNumber: number;
}

export function SelectExercise({
    item,
    userAnswer,
    isCorrect,
    isIncorrect,
    submitted,
    onChange,
    itemNumber,
}: SelectExerciseProps) {
    return (
        <div className="select-exercise">
            <label htmlFor={`select-${itemNumber}`} className="block mb-2">
                <span className="text-sm text-text font-medium">
                    <span className="font-semibold mr-2">{itemNumber}.</span>
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.label) }} />
                </span>
            </label>
            <select
                id={`select-${itemNumber}`}
                value={userAnswer}
                onChange={(e) => onChange(e.target.value)}
                disabled={submitted}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-[border-color,background-color] ${submitted
                        ? isCorrect
                            ? "border-success bg-success/5"
                            : "border-error bg-error/5"
                        : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    } disabled:cursor-not-allowed`}
            >
                <option value="" disabled>
                    Choose an answer…
                </option>
                {item.options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {submitted && isCorrect && (
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    Correct!
                </p>
            )}
            {submitted && isIncorrect && (
                <p className="text-xs text-error mt-1">
                    Incorrect. Expected: <strong>{item.expectedAnswer}</strong>
                </p>
            )}
        </div>
    );
}
