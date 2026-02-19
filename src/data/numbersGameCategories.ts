export const numbersGameCategoryNames = [
    "Basic Numbers (0-99)",
    "Hundreds (100-999)",
    "One Thousand to Ten Thousand (1,000-9,999)",
    "Ten Thousands (10,000-99,999)",
    "Hundred Thousands (100,000-999,999)",
    "Millions",
    "Billions",
    "Trillions",
    "Round Numbers (1,000 | 5 million | 1 billion)",
    "All Cardinal Numbers (Random Ranges)",
    "Ordinal Numbers (1st, 2nd, 3rd...)",
    "Years (1100-2099)",
];

const numbersGameCategorySet = new Set(numbersGameCategoryNames);

export function isNumbersGameCategoryName(value?: string | null): value is string {
    return typeof value === "string" && numbersGameCategorySet.has(value);
}

export function calculateNumbersGameCompletionPercentage(categoryData: Record<string, unknown>): number {
    if (numbersGameCategoryNames.length === 0) return 0;

    const completedCategories = numbersGameCategoryNames.reduce((count, category) => {
        const entry = categoryData[category];
        if (!entry || typeof entry !== "object") return count;
        if ((entry as { completed?: unknown }).completed === true) {
            return count + 1;
        }
        return count;
    }, 0);

    return Math.round((completedCategories / numbersGameCategoryNames.length) * 100);
}
