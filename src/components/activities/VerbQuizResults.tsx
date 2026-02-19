'use client';

import { motion } from 'framer-motion';
import { VerbQuizContent, VerbQuizSubmission } from '@/types/verb-quiz';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Star } from 'lucide-react';

interface VerbQuizResultsProps {
  content: VerbQuizContent;
  submission: VerbQuizSubmission;
  onRetake?: () => void;
}

export default function VerbQuizResults({ content, submission, onRetake }: VerbQuizResultsProps) {
  const percentage = submission.score;
  const isPerfect = percentage === 100;
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 80;

  const getGrade = () => {
    if (isPerfect) return { text: 'Perfect!', color: 'text-terracotta', icon: Trophy };
    if (isExcellent) return { text: 'Excellent!', color: 'text-sage', icon: Star };
    if (isGood) return { text: 'Good Job!', color: 'text-gold', icon: CheckCircle2 };
    return { text: 'Keep Practicing', color: 'text-neutral-600', icon: RotateCcw };
  };

  const grade = getGrade();
  const GradeIcon = grade.icon;

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg border border-sage/20 p-8 text-center"
      >
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
          isPerfect ? 'bg-terracotta/10' : isExcellent ? 'bg-sage/10' : 'bg-gold/10'
        } mb-4`}>
          <GradeIcon className={`w-10 h-10 ${grade.color}`} />
        </div>

        <h2 className={`text-4xl font-display font-bold mb-2 ${grade.color}`}>
          {percentage}%
        </h2>
        <p className="text-2xl font-semibold text-neutral-800 mb-4">{grade.text}</p>

        <div className="flex items-center justify-center gap-6 text-sm text-neutral-600">
          <div>
            <span className="font-semibold text-sage">{submission.correctCount}</span> correct
          </div>
          <div className="w-1 h-1 bg-neutral-300 rounded-full"></div>
          <div>
            <span className="font-semibold text-neutral-800">{submission.totalForms}</span> total
          </div>
          <div className="w-1 h-1 bg-neutral-300 rounded-full"></div>
          <div>
            <span className="font-semibold text-terracotta">+{submission.totalPoints}</span> points
          </div>
        </div>
      </motion.div>

      {/* Detailed Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-sage/20 p-6"
      >
        <h3 className="text-xl font-display font-bold text-terracotta mb-4">
          Detailed Results
        </h3>

        <div className="space-y-4">
          {Object.entries(content.verbs).map(([verb, correctAnswers], idx) => {
            const userAnswers = submission.answers[verb];
            const results = submission.results[verb];
            const verbCorrect = Object.values(results).filter(Boolean).length;
            const verbTotal = 4;
            const isVerbPerfect = verbCorrect === verbTotal;

            return (
              <motion.div
                key={verb}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className={`rounded-xl border-2 p-4 ${
                  isVerbPerfect
                    ? 'border-green-300 bg-green-50'
                    : 'border-neutral-200 bg-neutral-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-neutral-800 capitalize">To {verb}</h4>
                  <div className="text-sm font-semibold">
                    <span className={verbCorrect === verbTotal ? 'text-green-700' : 'text-neutral-600'}>
                      {verbCorrect}/{verbTotal}
                    </span>
                  </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-4 gap-3">
                  {['v1_3rd', 'v1_ing', 'v2', 'v3'].map((form) => {
                    const formKey = form as keyof typeof results;
                    const isCorrect = results[formKey];
                    const userAnswer = userAnswers[formKey];
                    const correctAnswer = correctAnswers[formKey];

                    return (
                      <div
                        key={form}
                        className={`p-3 rounded-lg border ${
                          isCorrect
                            ? 'border-green-300 bg-green-50'
                            : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-xs font-semibold text-neutral-600 uppercase">
                            {form.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="font-mono text-sm">
                          <div className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-600 line-through'}>
                            {userAnswer}
                          </div>
                          {!isCorrect && (
                            <div className="text-green-700 font-semibold mt-1">
                              ✓ {correctAnswer}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Stack */}
                <div className="md:hidden space-y-2">
                  {['v1_3rd', 'v1_ing', 'v2', 'v3'].map((form) => {
                    const formKey = form as keyof typeof results;
                    const isCorrect = results[formKey];
                    const userAnswer = userAnswers[formKey];
                    const correctAnswer = correctAnswers[formKey];

                    return (
                      <div
                        key={form}
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          isCorrect
                            ? 'border-green-300 bg-green-50'
                            : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-xs font-semibold text-neutral-600 uppercase">
                            {form.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="font-mono text-sm text-right">
                          <div className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-600 line-through'}>
                            {userAnswer}
                          </div>
                          {!isCorrect && (
                            <div className="text-green-700 font-semibold">
                              ✓ {correctAnswer}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      {onRetake && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={onRetake}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-terracotta hover:bg-terracotta/90 transition-[background-color,transform,box-shadow] duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      )}

      {/* Study Tips */}
      {!isPerfect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-gold/10 to-terracotta/10 rounded-2xl border border-gold/30 p-6"
        >
          <h3 className="text-lg font-bold text-terracotta mb-3 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Study Tips
          </h3>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-terracotta font-bold">•</span>
              <span>Review the verbs you missed and practice writing them out</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta font-bold">•</span>
              <span>Create flashcards for irregular verbs to help memorize the forms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta font-bold">•</span>
              <span>Try using the verbs in sentences to understand their context better</span>
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}
