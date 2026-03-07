'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Add breathing animation styles
if (typeof document !== 'undefined' && !document.getElementById('unstuck-animations')) {
  const style = document.createElement('style');
  style.id = 'unstuck-animations';
  style.textContent = `
    @keyframes breathe {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 1; }
    }

    .breathe-animation {
      animation: breathe 4s ease-in-out infinite;
    }

    @keyframes celebrate {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.08);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .celebrate-animation {
      animation: celebrate 0.6s ease-out;
    }
  `;
  document.head.appendChild(style);
}

type ResetMode = 'transition' | 'cannot-start' | 'overwhelmed';

type ResetModeConfig = {
  title: string;
  supportCopy: string;
  regulatePrompt: string;
  tinyActions: [string, string, string];
  launchLabel: string;
  responseCopy: string;
  randomActions: string[];
  accent: string;
  softBackground: string;
  border: string;
};

type CountdownTimerState = {
  completedCount: number;
  isComplete: boolean;
  isRunning: boolean;
  progressPercent: number;
  reset: () => void;
  secondsLeft: number;
  toggle: () => void;
};

const REGULATE_SECONDS = 60;
const LAUNCH_SECONDS = 180;

const RESET_MODE_ORDER: ResetMode[] = ['transition', 'cannot-start', 'overwhelmed'];

const RESET_MODE_CONFIG: Record<ResetMode, ResetModeConfig> = {
  transition: {
    title: 'Body says absolutely not',
    supportCopy: 'You know what to do. Your body has logged off.',
    regulatePrompt: 'Wiggle your toes. Roll your shoulders. We are getting back online.',
    tinyActions: ['Sit up', 'Put one foot on the floor', 'Move your phone out of reach'],
    launchLabel: 'Small body move first',
    responseCopy: 'Okay. We are not fixing your life. We are just getting your body back in the chat.',
    randomActions: ['Stand up for 10 seconds', 'Walk to the sink', 'Put on shoes', 'Take one thing to its home', 'Open the blinds'],
    accent: 'var(--color-accent-sakura)',
    softBackground:
      'linear-gradient(160deg, color-mix(in srgb, var(--color-accent-sakura) 16%, transparent) 0%, transparent 72%)',
    border: 'color-mix(in srgb, var(--color-accent-sakura) 28%, var(--color-border-subtle))',
  },
  'cannot-start': {
    title: 'Mind cluttered, no door',
    supportCopy: 'Too many tabs open in your head. No entry point.',
    regulatePrompt: 'Touch something cold. Name what you feel. We are shrinking the door.',
    tinyActions: ['Say: "I can start badly"', 'Just open the file', '2-minute timer, then stop'],
    launchLabel: 'Smallest door only',
    responseCopy: 'Okay. Your brain is sprinting. We are making the task embarrassingly small.',
    randomActions: ['Open the doc and do nothing else', 'Write one ugly bullet', 'Rename the file', 'Set a 2-minute timer', 'Move one item off your desk'],
    accent: 'var(--color-accent-teal)',
    softBackground:
      'linear-gradient(160deg, color-mix(in srgb, var(--color-accent-teal) 16%, transparent) 0%, transparent 72%)',
    border: 'color-mix(in srgb, var(--color-accent-teal) 28%, var(--color-border-subtle))',
  },
  overwhelmed: {
    title: 'Everything is too loud',
    supportCopy: 'Too many thoughts. Too many signals. Too much everything.',
    regulatePrompt: 'Close your eyes. Hand on chest. Let the room be boring for one second.',
    tinyActions: ['Mute one thing', 'Name 3 things you can feel', 'Pick what you are NOT doing'],
    launchLabel: 'Quieter first',
    responseCopy: 'Okay. Your brain is yelling. We are turning the volume down before asking anything from you.',
    randomActions: ['Close one tab', 'Put your phone face down', 'Turn off one notification', 'Dim the lights', 'Sit still for three breaths'],
    accent: 'var(--color-accent-mint)',
    softBackground:
      'linear-gradient(160deg, color-mix(in srgb, var(--color-accent-mint) 18%, transparent) 0%, transparent 72%)',
    border: 'color-mix(in srgb, var(--color-accent-mint) 28%, var(--color-border-subtle))',
  },
};

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function formatCountdown(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }
  }, []);

  return prefersReducedMotion;
}

function useCountdownTimer(totalSeconds: number): CountdownTimerState {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  const toggle = useCallback(() => {
    setIsRunning((current) => {
      if (current) {
        return false;
      }

      setSecondsLeft((previous) => (previous === 0 ? totalSeconds : previous));
      return true;
    });
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          setIsRunning(false);
          setCompletedCount((count) => count + 1);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  return {
    completedCount,
    isComplete: secondsLeft === 0,
    isRunning,
    progressPercent: Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100),
    reset,
    secondsLeft,
    toggle,
  };
}

export function GetUnstuckPage() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const modeChooserRef = useRef<HTMLDivElement | null>(null);
  const flowRef = useRef<HTMLDivElement | null>(null);
  const [selectedMode, setSelectedMode] = useState<ResetMode | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [_suggestedAction, setSuggestedAction] = useState<string | null>(null);
  const [customAction, setCustomAction] = useState('');
  const regulateTimer = useCountdownTimer(REGULATE_SECONDS);
  const launchTimer = useCountdownTimer(LAUNCH_SECONDS);

  const selectedConfig = useMemo(
    () => (selectedMode ? RESET_MODE_CONFIG[selectedMode] : null),
    [selectedMode],
  );

  const scrollToElement = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;

      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [prefersReducedMotion],
  );

  const resetFlowState = useCallback(() => {
    setCurrentStep(1);
    setSelectedAction(null);
    setSuggestedAction(null);
    regulateTimer.reset();
    launchTimer.reset();
  }, [launchTimer, regulateTimer]);

  const handleSelectMode = useCallback(
    (mode: ResetMode) => {
      setSelectedMode(mode);
      resetFlowState();
    },
    [resetFlowState],
  );

  const handleSuggestAction = useCallback(() => {
    if (!selectedMode) return;

    const nextAction = getRandomItem(RESET_MODE_CONFIG[selectedMode].randomActions);
    setSuggestedAction(nextAction);
    setSelectedAction(nextAction);
    setCustomAction('');
  }, [selectedMode]);

  // Keyboard shortcuts for mode selection (1, 2, 3)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedMode) return; // Don't allow shortcuts once a mode is selected
      const keyMap: Record<string, ResetMode> = {
        '1': 'transition',
        '2': 'cannot-start',
        '3': 'overwhelmed',
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        handleSelectMode(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedMode, handleSelectMode]);

  const handleChooseDifferentState = useCallback(() => {
    setSelectedMode(null);
    resetFlowState();

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        scrollToElement(modeChooserRef.current);
      });
    }
  }, [resetFlowState, scrollToElement]);

  useEffect(() => {
    if (!selectedMode) return;
    scrollToElement(flowRef.current);
  }, [scrollToElement, selectedMode]);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="card-elevated relative overflow-hidden rounded-[2rem] px-4 py-5 sm:px-7 sm:py-7">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${!prefersReducedMotion ? 'breathe-animation' : ''}`}
          style={{
            opacity: 0.9,
            background: 'radial-gradient(circle at top right, color-mix(in srgb, var(--color-accent-mint) 12%, transparent) 0%, transparent 34%), radial-gradient(circle at left top, color-mix(in srgb, var(--color-accent-sakura) 10%, transparent) 0%, transparent 42%), linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 96%, white 4%) 0%, color-mix(in srgb, var(--color-bg-elevated) 94%, var(--color-accent-teal) 6%) 100%)',
          }}
        />

        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-[2rem] leading-none font-display font-semibold text-text sm:text-[2.5rem]">
                Pick your flavor of stuck.
              </h1>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          <div
            ref={modeChooserRef}
            className="grid scroll-mt-24 gap-3 md:grid-cols-3"
            role="group"
            aria-label="Choose the kind of stuck you are in"
          >
            {RESET_MODE_ORDER.map((mode) => {
              const config = RESET_MODE_CONFIG[mode];
              const isActive = selectedMode === mode;

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleSelectMode(mode)}
                  className={`group relative overflow-hidden rounded-[1.5rem] border px-4 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'translate-y-[-1px] shadow-md'
                      : 'hover:-translate-y-0.5 hover:shadow-sm'
                  }`}
                  style={{
                    background: isActive
                      ? config.softBackground
                      : 'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 94%, white 6%) 0%, color-mix(in srgb, var(--color-bg-elevated) 94%, transparent) 100%)',
                    borderColor: isActive ? config.border : 'var(--color-border-subtle)',
                    boxShadow: isActive ? 'var(--color-card-shadow)' : '0 8px 18px rgba(0, 0, 0, 0.12)',
                    ['--tw-ring-color' as string]: config.accent,
                  }}
                  aria-pressed={isActive}
                >
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-display font-semibold text-text">{config.title}</h2>
                    <p className="text-sm leading-relaxed text-text-secondary">{config.supportCopy}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {selectedConfig && selectedMode ? (
        <section ref={flowRef} className="scroll-mt-24 space-y-4">
          {/* Single step card */}
          <div
            className="card-elevated mx-auto max-w-lg rounded-[1.75rem] p-6"
            style={{
              borderColor: selectedConfig.border,
              background: selectedConfig.softBackground,
            }}
          >
            {/* Step 1: Ground */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-display font-semibold text-text">
                    Ground yourself first
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {selectedConfig.regulatePrompt}
                  </p>
                </div>

                <div
                  className="rounded-[1.35rem] border border-border-subtle bg-bg-base/50 p-5"
                  style={{ borderColor: selectedConfig.border }}
                >
                  <div className="text-center space-y-3">
                    <p className="text-4xl font-display font-semibold text-text">
                      {formatCountdown(regulateTimer.secondsLeft)}
                    </p>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-bg-elevated"
                      role="progressbar"
                      aria-label="60 second reset progress"
                      aria-valuemin={0}
                      aria-valuemax={REGULATE_SECONDS}
                      aria-valuenow={REGULATE_SECONDS - regulateTimer.secondsLeft}
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-500 ease-out"
                        style={{
                          width: `${regulateTimer.progressPercent}%`,
                          background: `linear-gradient(90deg, ${selectedConfig.accent} 0%, color-mix(in srgb, ${selectedConfig.accent} 66%, white) 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={regulateTimer.toggle}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: selectedConfig.accent,
                      color: 'var(--color-bg-base)',
                      ['--tw-ring-color' as string]: selectedConfig.accent,
                    }}
                  >
                    {regulateTimer.isRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : regulateTimer.isComplete ? (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        Run it again
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Run 60-second reset
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/24 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                  >
                    {regulateTimer.isComplete ? 'Next step' : 'Skip to next step'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {regulateTimer.isComplete && regulateTimer.completedCount > 0 && (
                  <div
                    className={`flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium ${
                      !prefersReducedMotion ? 'celebrate-animation' : ''
                    }`}
                    style={{
                      backgroundColor: `color-mix(in srgb, ${selectedConfig.accent} 12%, transparent)`,
                      color: 'var(--color-text)',
                    }}
                  >
                    <Check className="h-4 w-4 shrink-0" style={{ color: selectedConfig.accent }} />
                    Done.
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Pick one */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-display font-semibold text-text">
                    Pick one tiny thing
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {selectedConfig.responseCopy}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {selectedConfig.tinyActions.map((action) => {
                    const isChosen = selectedAction === action;

                    return (
                      <button
                        key={action}
                        type="button"
                        onClick={() => {
                          setSelectedAction(action);
                          setCustomAction('');
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-[1.2rem] border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                          isChosen ? 'shadow-sm' : 'hover:-translate-y-0.5'
                        }`}
                        style={{
                          background: isChosen
                            ? `linear-gradient(135deg, color-mix(in srgb, ${selectedConfig.accent} 18%, transparent) 0%, color-mix(in srgb, var(--color-bg-elevated) 92%, transparent) 100%)`
                            : 'color-mix(in srgb, var(--color-bg-base) 50%, transparent)',
                          borderColor: isChosen ? selectedConfig.border : 'var(--color-border-subtle)',
                          color: 'var(--color-text)',
                          ['--tw-ring-color' as string]: selectedConfig.accent,
                        }}
                        aria-pressed={isChosen}
                      >
                        <span>{action}</span>
                        {isChosen && (
                          <Check
                            className="h-4 w-4 shrink-0"
                            style={{ color: selectedConfig.accent }}
                          />
                        )}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleSuggestAction}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-dashed px-4 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      borderColor: selectedConfig.border,
                      color: selectedConfig.accent,
                      backgroundColor: 'color-mix(in srgb, var(--color-bg-base) 32%, transparent)',
                      ['--tw-ring-color' as string]: selectedConfig.accent,
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    Give me a random one
                  </button>

                  <input
                    type="text"
                    placeholder="Or type your own tiny thing..."
                    value={customAction}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomAction(value);
                      setSelectedAction(value.trim() || null);
                    }}
                    className="w-full rounded-[1.2rem] border px-4 py-3.5 text-sm font-semibold text-text placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-bg-base/50"
                    style={{
                      borderColor: customAction.trim() && selectedAction === customAction.trim() ? selectedConfig.border : 'var(--color-border-subtle)',
                      ['--tw-ring-color' as string]: selectedConfig.accent,
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/24 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!selectedAction}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: selectedConfig.accent,
                      color: 'var(--color-bg-base)',
                      ['--tw-ring-color' as string]: selectedConfig.accent,
                    }}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                </div>
            )}

            {/* Step 3: Do it */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-display font-semibold text-text">
                    Do it for 3 minutes
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    <span style={{ color: selectedConfig.accent, fontWeight: 600 }}>
                      {selectedAction}
                    </span>
                    {' '}until the timer ends. Then you are allowed to stop.
                  </p>
                </div>

                <div
                  className="rounded-[1.35rem] border border-border-subtle bg-bg-base/50 p-5"
                  style={{ borderColor: selectedConfig.border }}
                >
                  <div className="text-center space-y-3">
                    <p className="text-4xl font-display font-semibold text-text">
                      {formatCountdown(launchTimer.secondsLeft)}
                    </p>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-bg-elevated"
                      role="progressbar"
                      aria-label="3 minute landing timer progress"
                      aria-valuemin={0}
                      aria-valuemax={LAUNCH_SECONDS}
                      aria-valuenow={LAUNCH_SECONDS - launchTimer.secondsLeft}
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-500 ease-out"
                        style={{
                          width: `${launchTimer.progressPercent}%`,
                          background: `linear-gradient(90deg, ${selectedConfig.accent} 0%, color-mix(in srgb, ${selectedConfig.accent} 66%, white) 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={launchTimer.toggle}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: selectedConfig.accent,
                      color: 'var(--color-bg-base)',
                      ['--tw-ring-color' as string]: selectedConfig.accent,
                    }}
                  >
                    {launchTimer.isRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : launchTimer.isComplete ? (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        Run it again
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start 3-minute timer
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/24 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Pick something else
                  </button>
                </div>

                {launchTimer.isComplete && launchTimer.completedCount > 0 && (
                  <div
                    className={`flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium ${
                      !prefersReducedMotion ? 'celebrate-animation' : ''
                    }`}
                    style={{
                      backgroundColor: `color-mix(in srgb, ${selectedConfig.accent} 12%, transparent)`,
                      color: 'var(--color-text)',
                    }}
                  >
                    <Check className="h-4 w-4 shrink-0" style={{ color: selectedConfig.accent }} />
                    You moved.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleChooseDifferentState}
              className="text-xs text-text-muted/70 hover:text-text-muted transition-colors"
            >
              Pick another stuck
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
