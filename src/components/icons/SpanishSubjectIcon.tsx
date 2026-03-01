import React from 'react';

interface SpanishSubjectIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function SpanishSubjectIcon({ className, size = 20, strokeWidth = 2.5 }: SpanishSubjectIconProps) {
  const weight = strokeWidth / 2.5;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="22" cy="24" r="14" stroke="currentColor" strokeWidth={2.5 * weight} fill="none" />
      <ellipse cx="22" cy="24" rx="6" ry="14" stroke="currentColor" strokeWidth={1.5 * weight} fill="none" />
      <path d="M8 24h28" stroke="currentColor" strokeWidth={1.5 * weight} />
      <path d="M10 17h24M10 31h24" stroke="currentColor" strokeWidth={1 * weight} opacity="0.6" />
      <path
        d="M34 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6c-1.1 0-2.1-.3-3-.8l-3 2.8v-4.5c0-.5 0-1 0-1.5 0-1.1.4-2 1-2"
        fill="currentColor"
        opacity="0.2"
      />
      <circle cx="40" cy="12" r="4" stroke="currentColor" strokeWidth={2 * weight} fill="none" />
    </svg>
  );
}
