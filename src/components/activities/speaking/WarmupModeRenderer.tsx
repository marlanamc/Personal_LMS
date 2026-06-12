'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { Props } from './shared';

export function WarmupModeRenderer({ content, activityId, assignmentId }: Props) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if already completed
  useEffect(() => {
    const checkCompletionStatus = async () => {
      try {
        const response = await fetch(`/api/activities/progress?activityId=${activityId}&assignmentId=${assignmentId || ''}`);
        if (response.ok) {
          const data = await response.json();
          if (data.progress?.status === 'completed') {
            setIsCompleted(true);
          }
        }
      } catch (error) {
        console.error('Error checking completion status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkCompletionStatus();
  }, [activityId, assignmentId]);

  const handleComplete = async () => {
    if (isCompleting) return;

    setIsCompleting(true);
    setCompletionError(null);

    try {
      const response = await fetch('/api/speaking/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          assignmentId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to complete warmup');
      }

      setIsCompleted(true);
      // Could show success message with points awarded
    } catch (error) {
      console.error('Completion error:', error);
      setCompletionError(error instanceof Error ? error.message : 'Failed to complete warmup');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="relative lg:fixed lg:inset-0 bg-bg flex flex-col min-h-screen lg:h-screen lg:w-screen">
      {/* Header */}
      <header className="sticky lg:relative top-0 flex-none px-4 sm:px-6 py-4 sm:py-5 border-b border-border/60 bg-bg-secondary/90 backdrop-blur-md z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <BackButton onClick={() => router.back()} className="flex-shrink-0 mt-1 sm:mt-1.5" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-1.5 sm:mb-2 font-display leading-tight">
              {content.title}
            </h1>
            {content.description && (
              <p className="text-sm sm:text-base text-text-muted">{content.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">🗣️ Speaking Warmup</h2>
            <p className="text-blue-800">Choose your warmup style! Work with a partner when available.</p>
          </div>

          {/* Key Phrases */}
          {content.keyPhrases && content.keyPhrases.length > 0 && (
            <div className="bg-bg-secondary/90 border border-border rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                🗣️ Key Phrases to Practice
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {content.keyPhrases.map((phrase, index) => (
                  <div key={index} className="text-sm text-text p-3 bg-gray-50 rounded-lg border-l-4 border-primary">
                    {phrase.phrase}
                    {phrase.example && (
                      <div className="text-xs text-text-muted mt-1 italic">
                        "{phrase.example}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speaking Prompts */}
          {content.prompts && content.prompts.length > 0 && (
            <div className="bg-bg-secondary/90 border border-border rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                💬 Speaking Prompts
              </h3>
              <p className="text-sm text-text-muted mb-4">Choose any that interest you</p>
              <div className="space-y-3">
                {content.prompts.map((prompt) => (
                  <div key={prompt.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        // Optional: could track selected prompts for engagement metrics
                      />
                      <div className="flex-1">
                        <div className="font-medium text-text mb-2">
                          {prompt.text}
                        </div>
                        <div className="text-sm text-text-muted space-y-1">
                          <div>
                            <strong>Solo:</strong> {prompt.soloInstructions || "Think through what you'd say"}
                          </div>
                          <div>
                            <strong>Partner:</strong> {prompt.partnerInstructions || "Speak for 2 minutes, get questions"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Practice (Optional) */}
          <div className="bg-bg-secondary/90 border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              ✏️ Quick Practice (Optional)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Write one sentence using today's phrases:
                </label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                  placeholder="Example: I have a headache so I need to see a doctor."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Think of a follow-up question:
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Example: Can you recommend a good doctor?"
                />
              </div>
            </div>
          </div>

          {/* Completion Section */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  🎯 You did great warmup work!
                </h3>
                <p className="text-green-800">
                  Mark complete when you've practiced for a few minutes (alone or partnered)
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {isLoading ? (
                  <div className="text-sm text-text-muted">Checking status...</div>
                ) : !isCompleted ? (
                  <button
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCompleting ? 'Completing…' : 'Mark as Complete'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Completed!
                  </div>
                )}
                <div className="text-sm text-green-700">
                  Earn {content.participationPoints || 3} points!
                </div>
              </div>
            </div>
            {completionError && (
              <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {completionError}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

