'use client';

type ChainConnectorVariant = 'active' | 'future' | 'done';

type ChainConnectorProps = {
  className?: string;
  variant?: ChainConnectorVariant;
};

export function ChainConnector({ className = '', variant = 'future' }: ChainConnectorProps) {
  const isActive = variant === 'active';
  const isDone = variant === 'done';
  const dashArray = isDone ? undefined : '5 5';
  const trackOpacity = isDone ? 0.85 : isActive ? 0.7 : 0.35;
  const arrowOpacity = isDone ? 1 : isActive ? 0.9 : 0.55;

  return (
    <svg
      className={`flow-chain-connector shrink-0 ${isActive ? 'flow-chain-connector-active' : ''} ${className}`}
      width="40"
      height="24"
      viewBox="0 0 40 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 12 L34 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={dashArray}
        style={{ opacity: trackOpacity }}
      />
      {isActive && (
        <circle
          className="flow-chain-particle"
          cx="0"
          cy="12"
          r="3"
          fill="currentColor"
        />
      )}
      <path
        d="M28 7 L34 12 L28 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ opacity: arrowOpacity }}
      />
    </svg>
  );
}
