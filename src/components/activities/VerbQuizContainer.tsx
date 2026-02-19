'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VerbQuizContent, VerbQuizAnswers, VerbQuizSubmission } from '@/types/verb-quiz';
import VerbQuiz from './VerbQuiz';
import VerbQuizResults from './VerbQuizResults';
import { PointsToast } from "@/components/ui/PointsToast";

interface VerbQuizContainerProps {
  content: VerbQuizContent;
  activityId: string;
  assignmentId?: string | null;
  activityTitle?: string;
  existingSubmission?: {
    id: string;
    content: unknown;
    score: number | null;
  } | null;
}

export default function VerbQuizContainer({
  content,
  activityId,
  assignmentId,
  activityTitle,
  existingSubmission
}: VerbQuizContainerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<VerbQuizSubmission | null>(
    existingSubmission?.content ? existingSubmission.content as VerbQuizSubmission : null
  );
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

  const isAnswerCorrect = (userAnswer: string, correctAnswer: string) => {
    const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');
    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(correctAnswer);

    if (!normalizedCorrect.includes('/')) {
      return normalizedUser === normalizedCorrect;
    }

    if (!normalizedUser.includes('/')) {
      return normalizedUser === normalizedCorrect;
    }

    const userParts = normalizedUser.split('/').filter(Boolean);
    const correctParts = normalizedCorrect.split('/').filter(Boolean);

    if (userParts.length !== correctParts.length) return false;

    const userSet = new Set(userParts);
    return correctParts.every((part) => userSet.has(part));
  };

  const handleComplete = async (answers: VerbQuizAnswers, score: number) => {
    setIsSubmitting(true);

    try {
      // Calculate detailed results
      const results: VerbQuizSubmission['results'] = {};
      let correctCount = 0;

      Object.entries(content.verbs).forEach(([verb, correctAnswers]) => {
        const userAnswers = answers[verb];
        results[verb] = {
          v1_3rd: isAnswerCorrect(userAnswers.v1_3rd, correctAnswers.v1_3rd),
          v1_ing: isAnswerCorrect(userAnswers.v1_ing, correctAnswers.v1_ing),
          v2: isAnswerCorrect(userAnswers.v2, correctAnswers.v2),
          v3: isAnswerCorrect(userAnswers.v3, correctAnswers.v3),
        };

        correctCount += Object.values(results[verb]).filter(Boolean).length;
      });

      const totalForms = Object.keys(content.verbs).length * 4;

      // Calculate points based on gamification system
      let totalPoints = 10; // Base points for quiz completion
      if (score === 100) {
        totalPoints += 20; // Perfect score bonus
      } else if (score >= 90) {
        totalPoints += 10; // High score bonus
      } else if (score >= 80) {
        totalPoints += 5; // Good score bonus
      }

      const submissionData: VerbQuizSubmission = {
        answers,
        score,
        totalPoints,
        correctCount,
        totalForms,
        results,
        submittedAt: new Date().toISOString(),
      };

      // Submit to API
      const response = await fetch('/api/activity/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          assignmentId: assignmentId || null,
          content: submissionData,
          score,
          points: totalPoints,
        }),
      });

      const text = await response.text();
      let responseData: { error?: string; points?: number } = {};
      if (text.trim()) {
        try {
          responseData = JSON.parse(text);
        } catch {
          throw new Error(response.ok ? 'Invalid response from server' : 'Failed to submit quiz');
        }
      }

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit quiz');
      }

      setSubmission(submissionData);
      if (responseData.points && responseData.points > 0) {
        setPointsToast({ points: responseData.points, key: Date.now() });
      }
      router.refresh(); // Refresh to update progress badge
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSubmission(null);
    setPointsToast(null);
    router.refresh();
  };

  if (submission) {
    return (
      <>
        {pointsToast && (
          <PointsToast
            key={pointsToast.key}
            points={pointsToast.points}
            onComplete={() => setPointsToast(null)}
          />
        )}
        <VerbQuizResults
          content={content}
          submission={submission}
          onRetake={handleRetake}
        />
      </>
    );
  }

  return (
    <>
      {pointsToast && (
        <PointsToast
          key={pointsToast.key}
          points={pointsToast.points}
          onComplete={() => setPointsToast(null)}
        />
      )}
      <VerbQuiz
        content={content}
        activityId={activityId}
        activityTitle={activityTitle}
        onComplete={handleComplete}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
