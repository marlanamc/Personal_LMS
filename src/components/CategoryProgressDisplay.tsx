'use client';

import { useEffect, useState } from 'react';

interface CategoryProgress {
    completed: boolean;
    accuracy?: number;
    completedAt?: string;
    attempts?: number;
}

interface Props {
    activityId: string;
    categoryNames: string[];
    initialCategoryData?: string | null;
}

export function CategoryProgressDisplay({ activityId, categoryNames, initialCategoryData }: Props) {
    const [categoryData, setCategoryData] = useState<Record<string, CategoryProgress>>({});
    const [loading, setLoading] = useState(!initialCategoryData);

    useEffect(() => {
        // If initial data provided, use it
        if (initialCategoryData) {
            try {
                setCategoryData(JSON.parse(initialCategoryData));
                setLoading(false);
            } catch (error) {
                console.error('Failed to parse category data:', error);
                setLoading(false);
            }
            return;
        }

        // Otherwise fetch from API
        async function fetchProgress() {
            try {
                const response = await fetch(`/api/activity/progress?activityId=${activityId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.categoryData) {
                        setCategoryData(JSON.parse(data.categoryData));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch category progress:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProgress();
    }, [activityId, initialCategoryData]);

    if (loading) {
        return <div className="text-sm text-gray-500">Loading progress...</div>;
    }

    const completedCount = categoryNames.filter(cat => categoryData[cat]?.completed).length;
    const hasAnyProgress = completedCount > 0;

    if (!hasAnyProgress) {
        return null;
    }

    return (
        <div className="space-y-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Category Progress</h3>
                <span className="text-sm text-gray-600">
                    {completedCount} of {categoryNames.length} completed
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryNames.map(category => {
                    const progress = categoryData[category];
                    const isCompleted = progress?.completed || false;

                    if (!isCompleted && !progress) return null; // Hide not-attempted categories

                    return (
                        <div
                            key={category}
                            className={`p-3 rounded-lg border-2 transition-[border-color,background-color] ${
                                isCompleted
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-medium text-gray-900 flex-1">
                                    {category}
                                </span>
                                {isCompleted && (
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            {progress?.accuracy !== undefined && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="text-xs text-gray-600">
                                        Accuracy: {progress.accuracy}%
                                    </div>
                                    {progress.attempts && progress.attempts > 1 && (
                                        <div className="text-xs text-gray-500">
                                            • {progress.attempts} attempt{progress.attempts > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-[width] duration-300"
                    style={{ width: `${(completedCount / categoryNames.length) * 100}%` }}
                />
            </div>
        </div>
    );
}
