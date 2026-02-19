"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SpeakingActivityContent, SpeakingSubmission } from "@/types/activity";
import { saveActivityProgress } from "@/lib/activityProgress";
import { PointsToast } from "@/components/ui/PointsToast";
import {
  getSpeakingSubmission,
  saveDraft,
  loadDraft,
  clearDraft,
  submitSpeakingWarmup,
  type SpeakingSubmissionPayload,
} from "@/lib/speakingSubmissions";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";

// WARMUP MODE COMPONENT
function WarmupModeRenderer({ content, activityId, assignmentId }: Props) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

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
      {pointsToast && (
        <PointsToast
          key={pointsToast.key}
          points={pointsToast.points}
          onComplete={() => setPointsToast(null)}
        />
      )}
      {/* Header */}
      <header className="sticky lg:relative top-0 flex-none px-4 sm:px-6 py-4 sm:py-5 border-b border-border/60 bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <BackButton onClick={() => router.back()} className="flex-shrink-0 mt-1 sm:mt-1.5" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 font-display leading-tight">
              {content.title}
            </h1>
            {content.description && (
              <p className="text-sm sm:text-base text-gray-600">{content.description}</p>
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
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🗣️ Key Phrases to Practice
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {content.keyPhrases.map((phrase, index) => (
                  <div key={index} className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg border-l-4 border-primary">
                    {phrase.phrase}
                    {phrase.example && (
                      <div className="text-xs text-gray-500 mt-1 italic">
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
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                💬 Speaking Prompts
              </h3>
              <p className="text-sm text-gray-600 mb-4">Choose any that interest you</p>
              <div className="space-y-3">
                {content.prompts.map((prompt) => (
                  <div key={prompt.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        // Optional: could track selected prompts for engagement metrics
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-2">
                          {prompt.text}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
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
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              ✏️ Quick Practice (Optional)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write one sentence using today's phrases:
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                  placeholder="Example: I have a headache so I need to see a doctor."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Think of a follow-up question:
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  <div className="text-sm text-gray-600">Checking status...</div>
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

const MIN_SENTENCE_LENGTH = 5;

interface Props {
  content: SpeakingActivityContent;
  activityId: string;
  assignmentId?: string | null;
}

interface SoloFormData {
  sentences: [string, string, string];
  followUpQuestions: [string, string];
}

interface SpeakingFormData {
  bestSentence: string;
}

export default function SpeakingActivityRenderer({ content, activityId, assignmentId }: Props) {
  const router = useRouter();

  // WARMUP MODE: Simple participation tracking
  if (content.warmupMode) {
    return <WarmupModeRenderer content={content} activityId={activityId} assignmentId={assignmentId} />;
  }

  // LEGACY MODE: Complex two-phase submission system
  const soloMode = content.soloMode;
  const speakingMode = content.speakingMode;
  const minPrompts = content.minPromptsRequired || 1;

  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
  const [completedSoloSteps, setCompletedSoloSteps] = useState<Set<string>>(new Set());
  const [completedSpeakingSteps, setCompletedSpeakingSteps] = useState<Set<string>>(new Set());
  const [expandedPromptTips, setExpandedPromptTips] = useState<Set<string>>(new Set());
  const [soloData, setSoloData] = useState<SoloFormData>({
    sentences: ["", "", ""],
    followUpQuestions: ["", ""],
  });
  const [speakingData, setSpeakingData] = useState<SpeakingFormData>({ bestSentence: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"draft" | "submitted">("draft");
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showSoloHelp, setShowSoloHelp] = useState(false);
  const [showKeyPhrases, setShowKeyPhrases] = useState(false);
  const [lastSnapshot, setLastSnapshot] = useState<string | null>(null);
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

  const soloChecklistLength = soloMode?.checklist.length ?? 0;
  const speakingChecklistLength = speakingMode?.checklist.length ?? 0;

  const selectedPromptsCount = selectedPrompts.size;
  const soloCompletedCount = completedSoloSteps.size;
  const speakingCompletedCount = completedSpeakingSteps.size;

  const validSentences = soloData.sentences.every((sentence) => sentence.trim().length >= MIN_SENTENCE_LENGTH);
  const validFollowUps = soloData.followUpQuestions.every((question) => question.trim().length > 0);
  const validBestSentence = speakingData.bestSentence.trim().length >= MIN_SENTENCE_LENGTH;

  const soloChecklistThreshold = Math.min(3, soloChecklistLength || 4);
  const speakingChecklistThreshold = Math.min(3, speakingChecklistLength || 4);

  const soloChecklistReady = soloCompletedCount >= soloChecklistThreshold;
  const speakingChecklistReady = speakingCompletedCount >= speakingChecklistThreshold;

  const currentSnapshot = useMemo(() => {
    const snapshot = {
      prompts: Array.from(selectedPrompts).sort(),
      solo: {
        sentences: soloData.sentences,
        followUpQuestions: soloData.followUpQuestions,
        steps: Array.from(completedSoloSteps).sort(),
      },
      speaking: {
        bestSentence: speakingData.bestSentence,
        steps: Array.from(completedSpeakingSteps).sort(),
      },
    };
    return JSON.stringify(snapshot);
  }, [
    selectedPrompts,
    completedSoloSteps,
    completedSpeakingSteps,
    soloData,
    speakingData,
  ]);

  useEffect(() => {
    if (!lastSnapshot) return;
    if (currentSnapshot !== lastSnapshot) {
      setSubmissionStatus("draft");
    }
  }, [currentSnapshot, lastSnapshot]);

  useEffect(() => {
    let isMounted = true;

    const draft = loadDraft(activityId, assignmentId);
    if (draft) {
      if (isMounted) {
        setSelectedPrompts(new Set(draft.selectedPromptIds));
        setSoloData({
          sentences: draft.solo.sentences as [string, string, string],
          followUpQuestions: draft.solo.followUpQuestions as [string, string],
        });
        setSpeakingData({ bestSentence: draft.speaking.bestSentence });
        setCompletedSoloSteps(new Set(draft.solo.completedStepIds));
        setCompletedSpeakingSteps(new Set(draft.speaking.completedStepIds));
      }
    }

    (async () => {
      const submission = await getSpeakingSubmission(activityId, assignmentId);
      if (!submission || !isMounted) return;

      setSelectedPrompts(new Set(submission.selectedPromptIds));
      setSoloData({
        sentences: submission.solo.sentences,
        followUpQuestions: submission.solo.followUpQuestions,
      });
      setSpeakingData({ bestSentence: submission.speaking.bestSentence });
      setCompletedSoloSteps(new Set(submission.solo.completedStepIds));
      setCompletedSpeakingSteps(new Set(submission.speaking.completedStepIds));
      setSubmissionStatus("submitted");
      setSubmittedAt(submission.submittedAt);
      setLastSnapshot(JSON.stringify({
        prompts: Array.from(submission.selectedPromptIds).sort(),
        solo: {
          sentences: submission.solo.sentences,
          followUpQuestions: submission.solo.followUpQuestions,
          steps: submission.solo.completedStepIds.sort(),
        },
        speaking: {
          bestSentence: submission.speaking.bestSentence,
          steps: submission.speaking.completedStepIds.sort(),
        },
      }));
    })();

    return () => {
      isMounted = false;
    };
  }, [activityId, assignmentId]);

  useEffect(() => {
    saveDraft({
      activityId,
      assignmentId,
      selectedPromptIds: Array.from(selectedPrompts),
      solo: {
        sentences: soloData.sentences as [string, string, string],
        followUpQuestions: soloData.followUpQuestions as [string, string],
        completedStepIds: Array.from(completedSoloSteps),
      },
      speaking: {
        bestSentence: speakingData.bestSentence,
        completedStepIds: Array.from(completedSpeakingSteps),
      },
    });
  }, [
    activityId,
    assignmentId,
    selectedPrompts,
    soloData,
    speakingData,
    completedSoloSteps,
    completedSpeakingSteps,
  ]);

  const canSubmit =
    selectedPromptsCount >= minPrompts &&
    soloChecklistReady &&
    validSentences &&
    validFollowUps &&
    speakingChecklistReady &&
    validBestSentence;

  // Step completion tracking
  const step1Complete = true; // Key phrases are always "complete" (just for reference)
  const step2Complete = 
    selectedPromptsCount >= minPrompts &&
    soloChecklistReady &&
    validSentences &&
    validFollowUps;
  const step3Complete = speakingChecklistReady && validBestSentence;

  const handlePromptToggle = (promptId: string) => {
    setSelectedPrompts((prev) => {
      const next = new Set(prev);
      next.has(promptId) ? next.delete(promptId) : next.add(promptId);
      return next;
    });
  };

  const handleSoloStepToggle = (stepId: string) => {
    setCompletedSoloSteps((prev) => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  };

  const handleSpeakingStepToggle = (stepId: string) => {
    setCompletedSpeakingSteps((prev) => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  };

  const togglePromptTips = (promptId: string) => {
    setExpandedPromptTips((prev) => {
      const next = new Set(prev);
      next.has(promptId) ? next.delete(promptId) : next.add(promptId);
      return next;
    });
  };

  const handleSentenceChange = (index: number, value: string) => {
    setSoloData((prev) => {
      const sentences = [...prev.sentences] as [string, string, string];
      sentences[index] = value;
      return { ...prev, sentences };
    });
  };

  const handleQuestionChange = (index: number, value: string) => {
    setSoloData((prev) => {
      const followUpQuestions = [...prev.followUpQuestions] as [string, string];
      followUpQuestions[index] = value;
      return { ...prev, followUpQuestions };
    });
  };

  const handleBestSentenceChange = (value: string) => {
    setSpeakingData((prev) => ({ ...prev, bestSentence: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionError(null);

    const payload: SpeakingSubmissionPayload = {
      activityId,
      assignmentId,
      selectedPromptIds: Array.from(selectedPrompts),
      solo: {
        sentences: soloData.sentences,
        followUpQuestions: soloData.followUpQuestions,
        completedStepIds: Array.from(completedSoloSteps),
      },
      speaking: {
        bestSentence: speakingData.bestSentence,
        completedStepIds: Array.from(completedSpeakingSteps),
      },
    };

    try {
      const result = await submitSpeakingWarmup(payload);
      if (!result.success) {
        setSubmissionError(result.error || "Unable to submit warm-up.");
        return;
      }

      const submissionStamp = result.submission?.submittedAt ?? new Date().toISOString();
      setSubmissionStatus("submitted");
      setSubmittedAt(submissionStamp);
      setLastSnapshot(currentSnapshot);
      const progressResult = await saveActivityProgress(activityId, 100, "submitted");
      if (progressResult?.pointsAwarded && progressResult.pointsAwarded > 0) {
        setPointsToast({ points: progressResult.pointsAwarded, key: Date.now() });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!soloMode || !speakingMode) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-700">
          This speaking warm-up needs to be configured with the new two-phase structure.
        </p>
      </div>
    );
  }

  return (
    <div className="relative lg:fixed lg:inset-0 bg-bg flex flex-col min-h-screen lg:h-screen lg:w-screen">
      {pointsToast && (
        <PointsToast
          key={pointsToast.key}
          points={pointsToast.points}
          onComplete={() => setPointsToast(null)}
        />
      )}
      <header className="sticky lg:relative top-0 flex-none px-4 sm:px-6 py-4 sm:py-5 border-b border-border/60 bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <BackButton onClick={() => router.back()} className="flex-shrink-0 mt-1 sm:mt-1.5" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 font-display leading-tight">
              {content.title}
            </h1>
            {content.description && (
              <p className="text-sm sm:text-base text-gray-600">{content.description}</p>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28 lg:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">

          {/* Quick Overview Card */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 sm:p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                    Step 1: Prepare to Speak (about 10 min)
                  </h2>
                  <p className="text-sm text-gray-700">
                    Do this first. You can work alone or with a partner if someone is here.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pl-11">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                    Step 2: Practice Speaking (about 10 min)
                  </h2>
                  <p className="text-sm text-gray-700">
                    When you have a partner, practice speaking together. If you're alone, keep working on Step 1.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Key Phrases */}
          {content.keyPhrases && content.keyPhrases.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => setShowKeyPhrases(!showKeyPhrases)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step1Complete ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}>
                    {step1Complete ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                  </div>
                  <div className="text-left">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      Step 1: Study Key Phrases
              </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      {showKeyPhrases ? 'Click to hide' : `${content.keyPhrases.length} key phrases`}
                    </p>
                  </div>
                </div>
                {showKeyPhrases ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {showKeyPhrases && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-4 sm:px-6 pb-4 sm:pb-6"
                  >
                    <div className="pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Study these phrases before practicing your speaking prompts.
              </p>
              <div className="grid gap-2.5 sm:gap-3">
                {content.keyPhrases.map((phrase, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                    <p className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      {phrase.phrase}
                    </p>
                    {phrase.example && (
                      <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                        Example: "{phrase.example}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Step 2: Prepare to Speak */}
          <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step2Complete ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {step2Complete ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      Step 1: Prepare to Speak
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Work on your own or with a partner if someone is here. This helps you get ready to speak.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {soloCompletedCount}/{soloChecklistLength} checklist
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Sub-step 1a: Choose Prompts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">1a</span>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    Choose at least {minPrompts} prompt{minPrompts > 1 ? "s" : ""} to practice
                  </h3>
                </div>
            <div className="space-y-3 sm:space-y-4">
              {content.prompts.map((prompt) => {
                const contextParts = prompt.context
                  ? prompt.context.split(/(?:Example:|Practice:|Tricky!|Mix them in your answers!|Same with|Notice:)/i).filter(Boolean)
                  : [];
                const hasMultipleParts = contextParts.length > 1 || (prompt.context && prompt.context.includes("'") && prompt.context.length > 80);

                return (
                  <label
                    key={prompt.id}
                    className={`block border-2 rounded-lg p-3 sm:p-5 cursor-pointer transition-[border-color,background-color,box-shadow] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                      selectedPrompts.has(prompt.id)
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 active:border-primary/50 active:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <input
                        type="checkbox"
                        checked={selectedPrompts.has(prompt.id)}
                        onChange={() => handlePromptToggle(prompt.id)}
                        className="mt-1 sm:mt-1.5 h-5 w-5 sm:h-6 sm:w-6 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                        {prompt.level && (
                          <span className="inline-block text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-gray-700 uppercase tracking-wide">
                            {prompt.level}
                          </span>
                        )}
                        <p className="text-base sm:text-lg font-semibold text-gray-900 leading-snug sm:leading-relaxed">
                          {prompt.text}
                        </p>
                        {prompt.context && (
                          <div className="space-y-2">
                            {!expandedPromptTips.has(prompt.id) ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  togglePromptTips(prompt.id);
                                }}
                                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#4a8ca0] hover:text-[#3a7080] transition-colors duration-200 group"
                                aria-label={`Show tips for: ${prompt.text}`}
                              >
                                <Lightbulb className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                <span>Need help?</span>
                                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-200" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  togglePromptTips(prompt.id);
                                }}
                                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors duration-200 group mb-2"
                                aria-label={`Hide tips for: ${prompt.text}`}
                              >
                                <span>Hide tips</span>
                                <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                              </button>
                            )}
                            <AnimatePresence>
                              {expandedPromptTips.has(prompt.id) && (
                                <motion.div
                                  className="bg-blue-50 border-l-3 sm:border-l-4 border-blue-400 rounded-r-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2"
                                  initial={{ opacity: 0, height: 0, y: -10 }}
                                  animate={{ opacity: 1, height: "auto", y: 0 }}
                                  exit={{ opacity: 0, height: 0, y: -10 }}
                                  transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                  <p className="text-[10px] sm:text-xs font-bold text-blue-900 uppercase tracking-wide mb-1.5 sm:mb-2">
                                    💡 Tips & Examples
                                  </p>
                                  {hasMultipleParts ? (
                                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                                      {prompt.context.split(".").filter((sentence) => sentence.trim().length > 10).map((sentence, idx) => (
                                        <li key={idx} className="flex gap-2">
                                          <span className="text-blue-500 font-bold flex-shrink-0 mt-0.5">•</span>
                                          <span className="leading-relaxed">{sentence.trim()}{sentence.trim().endsWith(".") ? "" : "."}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                      {prompt.context}
                                    </p>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
                <div className="text-sm text-gray-600 pt-2">
              Selected: {selectedPromptsCount} / {minPrompts} prompt{minPrompts > 1 ? "s" : ""}
                </div>
              </div>

              {/* Visual Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Sub-step 1b: Complete Checklist */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">1b</span>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    Complete the checklist
                  </h3>
                </div>
                <div className="space-y-3">
                  {soloMode.checklist.map((step) => {
                    const isCompleted = completedSoloSteps.has(step.id);
                    return (
                      <label
                        key={step.id}
                        className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                          isCompleted
                            ? "border-green-200 bg-green-50/50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => handleSoloStepToggle(step.id)}
                          className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                        />
                        <span className={`text-sm sm:text-base leading-relaxed flex-1 ${
                          isCompleted ? "text-gray-600 line-through" : "text-gray-700"
                        }`}>
                          {step.text}
                          {step.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Visual Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Sub-step 1c: Write Sentences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">1c</span>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    Write 3 sentences using the Key Phrases
                  </h3>
                </div>
                {[0, 1, 2].map((index) => (
                  <div key={index}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Sentence {index + 1}
                    </label>
                    <textarea
                      value={soloData.sentences[index]}
                      onChange={(e) => handleSentenceChange(index, e.target.value)}
                      placeholder="Write your sentence using the Key Phrases…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              {/* Visual Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Sub-step 1d: Write Follow-up Questions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">1d</span>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    Write 2 follow-up questions you can ask a partner
                  </h3>
                </div>
                {[0, 1].map((index) => (
                  <div key={index}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Question {index + 1}
                    </label>
                    <input
                      type="text"
                      value={soloData.followUpQuestions[index]}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      placeholder="Write a question you can ask a partner…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                ))}
              </div>

              {/* Help Section */}
              {soloMode.help && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSoloHelp((prev) => !prev)}
                    className="text-sm font-semibold text-[#4a8ca0] hover:text-[#3a7080] transition-colors flex items-center gap-1"
                  >
                    {showSoloHelp ? (
                      <>
                        <span>Hide help</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Need help?</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <AnimatePresence>
                    {showSoloHelp && (
                      <motion.div
                        key="solo-help"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3 text-xs text-blue-700"
                      >
                        {soloMode.help.sentenceFrames.length > 0 && (
                          <div>
                            <p className="font-semibold text-blue-900 text-[11px] uppercase tracking-wide mb-1">
                              Sentence Frames
                            </p>
                            <ul className="space-y-1">
                              {soloMode.help.sentenceFrames.map((frame, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500 font-bold">•</span>
                                  <span>{frame}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {soloMode.help.questionStems.length > 0 && (
                          <div>
                            <p className="font-semibold text-blue-900 text-[11px] uppercase tracking-wide mb-1">
                              Question Stems
                            </p>
                            <ul className="space-y-1">
                              {soloMode.help.questionStems.map((stem, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500 font-bold">•</span>
                                  <span>{stem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {soloMode.help.wordBank.length > 0 && (
                          <div>
                            <p className="font-semibold text-blue-900 text-[11px] uppercase tracking-wide mb-1">
                              Word Bank
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {soloMode.help.wordBank.map((word, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-900 rounded text-[11px]"
                                >
                                  {word}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Practice Speaking */}
          <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-green-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step3Complete ? 'bg-green-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {step3Complete ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      Step 2: Practice Speaking with a Partner
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      Do this when you have a partner. If you're alone, keep working on Step 1.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {speakingCompletedCount}/{speakingChecklistLength} checklist
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Sub-step 2a: Complete Speaking Checklist */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">2a</span>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    Complete the speaking checklist
                  </h3>
                </div>
            <div className="space-y-3">
                  {speakingMode.checklist.map((step) => {
                    const isCompleted = completedSpeakingSteps.has(step.id);
                    return (
                <label
                  key={step.id}
                        className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                          isCompleted
                            ? "border-green-200 bg-green-50/50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                >
                  <input
                    type="checkbox"
                          checked={isCompleted}
                    onChange={() => handleSpeakingStepToggle(step.id)}
                    className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                  />
                        <span className={`text-sm sm:text-base leading-relaxed flex-1 ${
                          isCompleted ? "text-gray-600 line-through" : "text-gray-700"
                        }`}>
                    {step.text}
                    {step.required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                        {isCompleted && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                </label>
                    );
                  })}
                </div>
            </div>

              {/* Visual Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Sub-step 2b: Write Best Sentence */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">2b</span>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    Write ONE best sentence you said (or heard)
                  </h3>
                </div>
              {speakingMode.inputs.map((input) => (
                <div key={input.id}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {input.label}
                  </label>
                  {input.type === "textarea" ? (
                    <textarea
                      value={speakingData.bestSentence}
                      onChange={(e) => handleBestSentenceChange(e.target.value)}
                      placeholder="Share the best sentence you heard or said during practice…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      value={speakingData.bestSentence}
                      onChange={(e) => handleBestSentenceChange(e.target.value)}
                      placeholder="Share the best sentence you heard or said during practice…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>

            {speakingMode.noPartnerNote && (
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600">
                {speakingMode.noPartnerNote}
              </div>
            )}
            </div>
          </div>

          {content.reflectionPrompt && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🤔</span>
                <span>Quick Reflection</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4">{content.reflectionPrompt}</p>
              <p className="text-xs sm:text-sm text-gray-600">
                Minimum {content.reflectionMinLength || 20} characters
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg p-4 sm:p-6 z-20">
        <div className="max-w-5xl mx-auto">
          {/* Requirements Checklist */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Ready to Submit? Check all requirements:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                {selectedPromptsCount >= minPrompts ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></span>
                )}
                <span className={selectedPromptsCount >= minPrompts ? "text-gray-600" : "text-gray-400"}>
                  {selectedPromptsCount} / {minPrompts} prompt{minPrompts > 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                {soloChecklistReady ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></span>
                )}
                <span className={soloChecklistReady ? "text-gray-600" : "text-gray-400"}>
                  Solo checklist complete ({soloCompletedCount}/{soloChecklistLength})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {validSentences ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></span>
                )}
                <span className={validSentences ? "text-gray-600" : "text-gray-400"}>
                  3 sentences written
                </span>
              </div>
              <div className="flex items-center gap-2">
                {validFollowUps ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></span>
                )}
                <span className={validFollowUps ? "text-gray-600" : "text-gray-400"}>
                  2 follow-up questions written
                </span>
              </div>
              <div className="flex items-center gap-2">
                {speakingChecklistReady ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></span>
                )}
                <span className={speakingChecklistReady ? "text-gray-600" : "text-gray-400"}>
                  Speaking checklist complete ({speakingCompletedCount}/{speakingChecklistLength})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {validBestSentence ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></span>
                )}
                <span className={validBestSentence ? "text-gray-600" : "text-gray-400"}>
                  Best sentence written
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col gap-1">
            {submissionError && (
              <p className="text-xs text-red-600">{submissionError}</p>
            )}
            {submittedAt && (
              <p className="text-xs text-gray-600">
                Last submitted: {new Date(submittedAt).toLocaleString()}
              </p>
            )}
              {submissionStatus === "submitted" && (
                <p className="text-xs text-gray-500">
                  Resubmitting will overwrite your previous response.
                </p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`px-6 py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base font-medium ${
                canSubmit && !isSubmitting
                  ? "bg-primary text-white hover:bg-primary/90 shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting
                ? "Submitting…"
                : submissionStatus === "submitted"
                ? "Submitted ✅"
                : "Submit Warm-Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
