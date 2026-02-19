'use client';

import React, { useState } from 'react';

interface FeatureToggleButtonProps {
    assignmentId: string;
    initialIsFeatured: boolean;
}

export const FeatureToggleButton: React.FC<FeatureToggleButtonProps> = ({
    assignmentId,
    initialIsFeatured
}) => {
    const [isFeatured, setIsFeatured] = useState(initialIsFeatured);
    const [isLoading, setIsLoading] = useState(false);

    const toggleFeature = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/assignments', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assignmentId,
                    isFeatured: !isFeatured
                })
            });

            if (response.ok) {
                setIsFeatured(!isFeatured);
                // Optionally refresh the page to update student dashboards
                window.location.reload();
            } else {
                console.error('Failed to toggle featured status');
            }
        } catch (error) {
            console.error('Error toggling featured status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFeature}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-[border-color,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                isFeatured
                    ? 'border-accent bg-accent text-text hover:bg-accent/90'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLoading ? (
                <span>...</span>
            ) : (
                <>
                    {isFeatured ? '⭐ Featured' : '☆ Feature'}
                </>
            )}
        </button>
    );
};
