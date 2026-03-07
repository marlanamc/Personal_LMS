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
    title: 'Switch gears',
    supportCopy:
      'When you know what to do but your body freezes during the handoff.',
    regulatePrompt:
      'Unclench your jaw. Drop your shoulders. Let one slower breath count.',
    tinyActions: ['Stand up', 'Walk to the start spot', 'Open the first thing'],
    launchLabel: 'Start the switch',
    accent: 'var(--color-accent-sakura)',
    softBackground:
      'linear-gradient(160deg, color-mix(in srgb, var(--color-accent-sakura) 16%, transparent) 0%, transparent 72%)',
    border: 'color-mix(in srgb, var(--color-accent-sakura) 28%, var(--color-border-subtle))',
  },
  'cannot-start': {
    title: 'Start tiny',
    supportCopy:
      'When the task feels too big and you do not know where to begin.',
    regulatePrompt:
      'Put both feet down. Let your exhale run a little longer than your inhale.',
    tinyActions: ['Open the thing', 'Do 2 minutes', 'Write the ugly first line'],
    launchLabel: 'Start the tiny start',
    accent: 'var(--color-accent-teal)',
    softBackground:
      'linear-gradient(160deg, color-mix(in srgb, var(--color-accent-teal) 16%, transparent) 0%, transparent 72%)',
    border: 'color-mix(in srgb, var(--color-accent-teal) 28%, var(--color-border-subtle))',
  },
  overwhelmed: {
    title: 'Too flooded',
    supportCopy:
      'When everything feels loud and your brain cannot pick a direction.',
    regulatePrompt:
      'Look at one still thing. Soften your eyes. Let this get quieter for one minute.',
    tinyActions: ['Sip water', 'Close extra inputs', 'Pick one thing'],
    launchLabel: 'Start the quiet landing',
    accent: 'var(--color-accent-mint)',
    softBackground:
      'linear-gradient(160deg, color-mix(in srgb, var(--color-accent-mint) 18%, transparent) 0%, transparent 72%)',
    border: 'color-mix(in srgb, var(--color-accent-mint) 28%, var(--color-border-subtle))',
  },
};

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

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(`Failed to save ${key} to localStorage:`, error);
      }
    },
    [key],
  );

  return [storedValue, setValue];
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
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [customAction, setCustomAction] = useState('');
  const [minimalMode, setMinimalMode] = useState(false);
  const [favoriteMode, setFavoriteMode] = useLocalStorage<ResetMode | null>('unstuck-favorite-mode', null);
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
    setSelectedAction(null);
    regulateTimer.reset();
    launchTimer.reset();
  }, [launchTimer, regulateTimer]);

  const handleSelectMode = useCallback(
    (mode: ResetMode) => {
      setSelectedMode(mode);
      setFavoriteMode(mode);
      resetFlowState();
    },
    [resetFlowState, setFavoriteMode],
  );

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

  const handleGentlerReset = useCallback(() => {
    if (selectedMode === 'overwhelmed') {
      resetFlowState();
      return;
    }

    handleSelectMode('overwhelmed');
  }, [handleSelectMode, resetFlowState, selectedMode]);

  useEffect(() => {
    if (!selectedMode) return;
    scrollToElement(flowRef.current);
  }, [scrollToElement, selectedMode]);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="card-elevated relative overflow-hidden rounded-[2rem] px-4 py-5 sm:px-7 sm:py-7">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${!minimalMode && !prefersReducedMotion ? 'breathe-animation' : ''}`}
          style={{
            opacity: minimalMode ? 0.4 : 0.9,
            background: minimalMode
              ? 'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 98%, white 2%) 0%, var(--color-bg-elevated) 100%)'
              : 'radial-gradient(circle at top right, color-mix(in srgb, var(--color-accent-mint) 12%, transparent) 0%, transparent 34%), radial-gradient(circle at left top, color-mix(in srgb, var(--color-accent-sakura) 10%, transparent) 0%, transparent 42%), linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 96%, white 4%) 0%, color-mix(in srgb, var(--color-bg-elevated) 94%, var(--color-accent-teal) 6%) 100%)',
          }}
        />

        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Focus Reset
              </div>
              <div className="space-y-2">
                <h1 className="text-[2rem] leading-none font-display font-semibold text-text sm:text-[2.5rem]">
                  What kind of stuck is this?
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-[0.97rem]">
                  Pick the closest fit. You do not need the perfect answer. This page is here to
                  lower the friction, not give you more work.
                  {!selectedMode && (
                    <span className="block mt-2 text-xs text-text-muted">
                      Keyboard shortcut: Press <kbd className="px-1.5 py-0.5 rounded bg-bg-base/60 font-mono">1</kbd> for Switch Gears, <kbd className="px-1.5 py-0.5 rounded bg-bg-base/60 font-mono">2</kbd> for Start Tiny, or <kbd className="px-1.5 py-0.5 rounded bg-bg-base/60 font-mono">3</kbd> for Too Flooded
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 self-start">
              {!selectedMode && favoriteMode && (
                <button
                  type="button"
                  onClick={() => handleSelectMode(favoriteMode)}
                  className="inline-flex items-center gap-2 rounded-full border border-accent-mint/35 bg-accent-mint/8 px-4 py-2 text-sm font-semibold text-accent-mint transition-colors hover:border-accent-mint/50 hover:bg-accent-mint/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint/45 focus-visible:ring-offset-2"
                >
                  <Play className="h-4 w-4" />
                  Quick reset: {RESET_MODE_CONFIG[favoriteMode].title}
                </button>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMinimalMode(!minimalMode)}
                  className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-primary/28 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                  title={minimalMode ? 'Enable full visuals' : 'Enable minimal mode (less animations)'}
                >
                  {minimalMode ? 'Full mode' : 'Minimal mode'}
                </button>
                <Link
                  href="/dashboard/timer"
                  className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-primary/28 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Focus Timer
                </Link>
              </div>
            </div>
          </div>

          <div
            ref={modeChooserRef}
            className="grid scroll-mt-24 gap-3 md:grid-cols-3"
            role="group"
            aria-label="Choose the kind of stuck you are in"
          >
            {RESET_MODE_ORDER.map((mode, index) => {
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-bg-base) 84%, transparent)',
                            color: config.accent,
                            border: `1px solid ${config.border}`,
                          }}
                        >
                          0{index + 1}
                        </span>
                        <span className="text-xs text-text-muted font-mono">({index + 1})</span>
                      </div>
                      <span
                        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                        style={{ color: config.accent }}
                      >
                        {isActive ? 'Selected' : 'Choose'}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-xl font-display font-semibold text-text">{config.title}</h2>
                      <p className="text-sm leading-relaxed text-text-secondary">{config.supportCopy}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {selectedConfig && selectedMode ? (
        <section ref={flowRef} className="scroll-mt-24 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: selectedConfig.accent }}
              >
                {selectedConfig.title}
              </p>
              <h2 className="mt-1 text-2xl font-display font-semibold text-text">
                One calm reset, then one tiny move.
              </h2>
            </div>
            <button
              type="button"
              onClick={handleGentlerReset}
              className="inline-flex items-center gap-2 self-start rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/24 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
            >
              {selectedMode === 'overwhelmed' ? 'Start over' : 'Try something gentler'}
            </button>
          </div>

          <p className="text-sm text-text-secondary px-1">
            {selectedAction ? (
              <>
                You picked: <span className="font-semibold text-text">{selectedAction}</span>. That is enough to carry into the next step.
              </>
            ) : (
              'Pick the easiest tiny action. You can ignore the rest.'
            )}
          </p>

          <div className="grid gap-4 xl:grid-cols-3">
            <section
              className="card-elevated rounded-[1.75rem] p-5"
              style={{
                borderColor: selectedConfig.border,
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 96%, white 4%) 0%, color-mix(in srgb, var(--color-bg-elevated) 96%, transparent) 100%)',
              }}
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: selectedConfig.accent }}
                  >
                    01 · Regulate
                  </p>
                  <h3 className="text-xl font-display font-semibold text-text">
                    Give your body one minute.
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-text-secondary">
                  {selectedConfig.regulatePrompt}
                </p>

                <div
                  className="rounded-[1.35rem] border border-border-subtle bg-bg-base/36 p-4"
                  style={{ borderColor: selectedConfig.border }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                        Optional reset
                      </p>
                      <p className="mt-1 text-3xl font-display font-semibold text-text">
                        {formatCountdown(regulateTimer.secondsLeft)}
                      </p>
                    </div>
                    <div
                      className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-bg-base) 76%, transparent)',
                        color: selectedConfig.accent,
                      }}
                    >
                      {regulateTimer.isComplete
                        ? 'Complete'
                        : regulateTimer.isRunning
                          ? 'Running'
                          : 'Ready'}
                    </div>
                  </div>

                  <div
                    className="mt-4 h-2 overflow-hidden rounded-full bg-bg-elevated"
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

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={regulateTimer.toggle}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: selectedConfig.accent,
                      color: 'var(--color-bg-base)',
                      ['--tw-ring-color' as string]: selectedConfig.accent,
                    }}
                    aria-label={
                      regulateTimer.isRunning
                        ? 'Pause the 60 second reset'
                        : regulateTimer.isComplete
                          ? 'Restart the 60 second reset'
                          : 'Start the 60 second reset'
                    }
                  >
                    {regulateTimer.isRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause reset
                      </>
                    ) : regulateTimer.isComplete ? (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        Restart reset
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start 60-second reset
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={regulateTimer.reset}
                    className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/24 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>

                {regulateTimer.isComplete && regulateTimer.completedCount > 0 ? (
                  <div
                    className={`flex items-center gap-2 rounded-[1.2rem] p-3 text-sm font-medium ${
                      !prefersReducedMotion ? 'celebrate-animation' : ''
                    }`}
                    style={{
                      backgroundColor: `color-mix(in srgb, ${selectedConfig.accent} 12%, transparent)`,
                      color: 'var(--color-text)',
                    }}
                  >
                    <Check className="h-5 w-5 shrink-0" style={{ color: selectedConfig.accent }} />
                    That is enough. You can move imperfectly from here.
                  </div>
                ) : null}
              </div>
            </section>

            <section
              className="card-elevated rounded-[1.75rem] p-5"
              style={{
                borderColor: selectedConfig.border,
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 96%, white 4%) 0%, color-mix(in srgb, var(--color-bg-elevated) 96%, transparent) 100%)',
              }}
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: selectedConfig.accent }}
                  >
                    02 · Bridge
                  </p>
                  <h3 className="text-xl font-display font-semibold text-text">
                    Pick one tiny action.
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-text-secondary">
                  One tap. One move. It does not have to be the best option.
                </p>

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
                        className={`flex w-full items-center justify-between gap-3 rounded-[1.2rem] border px-4 py-3 text-left text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                          isChosen ? 'shadow-sm' : 'hover:-translate-y-0.5'
                        }`}
                        style={{
                          background: isChosen
                            ? `linear-gradient(135deg, color-mix(in srgb, ${selectedConfig.accent} 18%, transparent) 0%, color-mix(in srgb, var(--color-bg-elevated) 92%, transparent) 100%)`
                            : 'color-mix(in srgb, var(--color-bg-base) 24%, transparent)',
                          borderColor: isChosen ? selectedConfig.border : 'var(--color-border-subtle)',
                          color: 'var(--color-text)',
                          ['--tw-ring-color' as string]: selectedConfig.accent,
                        }}
                        aria-pressed={isChosen}
                      >
                        <span>{action}</span>
                        <ArrowRight
                          className="h-4 w-4 shrink-0"
                          style={{ color: isChosen ? selectedConfig.accent : 'var(--color-text-muted)' }}
                        />
                      </button>
                    );
                  })}

                  <div className="pt-1">
                    <label className="text-xs uppercase tracking-[0.18em] font-semibold text-text-muted">
                      Or type your own
                    </label>
                    <input
                      type="text"
                      value={customAction}
                      onChange={(e) => {
                        setCustomAction(e.target.value);
                        if (e.target.value) {
                          setSelectedAction(e.target.value);
                        }
                      }}
                      placeholder="What tiny move feels right?"
                      className="w-full mt-1.5 rounded-[1.2rem] border px-4 py-3 text-sm bg-bg-base/24 placeholder-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all"
                      style={{
                        borderColor: customAction ? selectedConfig.border : 'var(--color-border-subtle)',
                        ['--tw-ring-color' as string]: selectedConfig.accent,
                      }}
                    />
                  </div>
                </div>

                {selectedAction ? (
                  <div
                    className="rounded-[1.2rem] border border-dashed p-4 text-sm"
                    style={{
                      borderColor: selectedConfig.border,
                      backgroundColor: 'color-mix(in srgb, var(--color-bg-base) 28%, transparent)',
                    }}
                  >
                    <p className="font-medium text-text">
                      Good enough. Let your next move be{' '}
                      <span style={{ color: selectedConfig.accent, fontWeight: 'bold' }}>
                        {selectedAction}
                      </span>
                      .
                    </p>
                  </div>
                ) : (
                  <div
                    className="rounded-[1.2rem] border border-dashed p-4 text-sm"
                    style={{
                      borderColor: selectedConfig.border,
                      backgroundColor: 'color-mix(in srgb, var(--color-bg-base) 28%, transparent)',
                    }}
                  >
                    <p className="text-text-secondary">
                      Pick whichever one feels least heavy. You can change your mind later.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section
              className="card-elevated rounded-[1.75rem] p-5"
              style={{
                borderColor: selectedConfig.border,
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 96%, white 4%) 0%, color-mix(in srgb, var(--color-bg-elevated) 96%, transparent) 100%)',
              }}
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: selectedConfig.accent }}
                  >
                    03 · Launch
                  </p>
                  <h3 className="text-xl font-display font-semibold text-text">
                    Stay with it for three minutes.
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-text-secondary">
                  {selectedAction
                    ? `${selectedConfig.launchLabel} with "${selectedAction}" and let three minutes be enough for now.`
                    : `${selectedConfig.launchLabel} and keep the bar deliberately low for three minutes.`}
                </p>

                <div
                  className="rounded-[1.35rem] border border-border-subtle bg-bg-base/36 p-4"
                  style={{ borderColor: selectedConfig.border }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                        Landing timer
                      </p>
                      <p className="mt-1 text-3xl font-display font-semibold text-text">
                        {formatCountdown(launchTimer.secondsLeft)}
                      </p>
                    </div>
                    <div
                      className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-bg-base) 76%, transparent)',
                        color: selectedConfig.accent,
                      }}
                    >
                      {launchTimer.isComplete
                        ? 'Complete'
                        : launchTimer.isRunning
                          ? 'Running'
                          : 'Ready'}
                    </div>
                  </div>

                  <div
                    className="mt-4 h-2 overflow-hidden rounded-full bg-bg-elevated"
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

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={launchTimer.toggle}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: selectedConfig.accent,
                      color: 'var(--color-bg-base)',
                      ['--tw-ring-color' as string]: selectedConfig.accent,
                    }}
                    aria-label={
                      launchTimer.isRunning
                        ? 'Pause the 3 minute landing timer'
                        : launchTimer.isComplete
                          ? 'Restart the 3 minute landing timer'
                          : 'Start the 3 minute landing timer'
                    }
                  >
                    {launchTimer.isRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause landing
                      </>
                    ) : launchTimer.isComplete ? (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        Restart landing
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start 3-minute landing
                      </>
                    )}
                  </button>

                  <Link
                    href="/dashboard/timer"
                    className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/24 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                  >
                    Open Focus Timer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {launchTimer.isComplete && launchTimer.completedCount > 0 ? (
                  <div
                    className={`flex items-center gap-2 rounded-[1.2rem] p-3 text-sm font-medium ${
                      !prefersReducedMotion ? 'celebrate-animation' : ''
                    }`}
                    style={{
                      backgroundColor: `color-mix(in srgb, ${selectedConfig.accent} 12%, transparent)`,
                      color: 'var(--color-text)',
                    }}
                  >
                    <Check className="h-5 w-5 shrink-0" style={{ color: selectedConfig.accent }} />
                    Three minutes done. You can stop here or keep going with the timer.
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          {selectedMode !== 'overwhelmed' && (
            <div
              className="card-elevated rounded-[1.75rem] p-5"
              style={{
                borderColor: selectedConfig.border,
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 96%, white 4%) 0%, color-mix(in srgb, var(--color-bg-elevated) 96%, transparent) 100%)',
              }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-text">Still stuck?</p>
                  <p className="text-sm text-text-secondary">
                    Try a gentler reset or choose a different way.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleGentlerReset}
                    className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/24 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                  >
                    Try a gentler reset
                  </button>
                  <button
                    type="button"
                    onClick={handleChooseDifferentState}
                    className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/24 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
                  >
                    Choose a different state
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
