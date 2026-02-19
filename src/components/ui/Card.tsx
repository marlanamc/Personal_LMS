import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  glow?: 'pink' | 'mint' | 'lavender' | 'aqua';
}

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ children, className = '', hover = false, onClick, glow }) => {
  // Glass morphism base styles for dark theme
  const baseStyles = 'backdrop-blur-md bg-white/[0.08] border border-white/10 rounded-xl transition-[box-shadow,transform,border-color,background] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2';

  // Glow effects
  const glowClass = glow ?
    {
      pink: 'hover:shadow-glow-pink hover:border-primary/30',
      mint: 'hover:shadow-glow-mint hover:border-secondary/30',
      lavender: 'hover:shadow-glow-lavender hover:border-accent/30',
      aqua: 'hover:shadow-[0_0_20px_rgba(149,225,211,0.5)] hover:border-success/30',
    }[glow] : '';

  // Hover effects
  const hoverClass = hover ? `${glowClass} hover:-translate-y-1 cursor-pointer` : glowClass;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={`${baseStyles} ${hoverClass} ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${baseStyles} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-white/10 ${className}`}>
    {children}
  </div>
);

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-white/10 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
