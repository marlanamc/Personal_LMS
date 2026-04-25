'use client';

type BentoProgressBarProps = {
  value: number;
  className?: string;
};

export function BentoProgressBar({ value, className }: BentoProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={['bento-progress', className].filter(Boolean).join(' ')}>
      <div className="bento-progress__track" aria-hidden />
      <div
        className="bento-progress__fill"
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      />
    </div>
  );
}
