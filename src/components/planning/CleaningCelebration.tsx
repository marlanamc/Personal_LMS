'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Star, PartyPopper } from 'lucide-react';

type CleaningCelebrationProps = {
  isVisible: boolean;
  onComplete: () => void;
  message?: string;
};

const CELEBRATION_MESSAGES = [
  'Nice!',
  'Done!',
  'Crushed it!',
  'One down!',
  'You did it!',
  'Clean win!',
  'Boom!',
  'Yes!',
];

const CELEBRATION_ICONS = [Sparkles, Star, PartyPopper];

function getRandomMessage(): string {
  return CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
}

function getRandomIcon() {
  return CELEBRATION_ICONS[Math.floor(Math.random() * CELEBRATION_ICONS.length)];
}

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  delay: number;
  round: boolean;
};

const COLORS = [
  '#f4d35e', // sunny yellow
  '#7ba884', // sage green
  '#d97757', // terracotta
  '#a78bfa', // amethyst
  '#5eead4', // teal
  '#f9a8d4', // pink
];

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20, // Start near center
      y: 50,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 60,
      velocityY: -30 - Math.random() * 40,
      delay: Math.random() * 0.2,
      round: Math.random() > 0.5,
    });
  }
  return particles;
}

export function CleaningCelebration({ isVisible, onComplete, message }: CleaningCelebrationProps) {
  const [displayMessage, setDisplayMessage] = useState(message || getRandomMessage());
  const [particles, setParticles] = useState<Particle[]>([]);
  const [Icon, setIcon] = useState<typeof Sparkles>(() => getRandomIcon());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setDisplayMessage(message || getRandomMessage());
      setIcon(() => getRandomIcon());
      setParticles(generateParticles(24));
      setIsAnimating(true);

      // Auto-dismiss after animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, message, onComplete]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      aria-live="polite"
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: particle.round ? '50%' : '2px',
              transform: `rotate(${particle.rotation}deg)`,
              animationDelay: `${particle.delay}s`,
              '--velocity-x': `${particle.velocityX}px`,
              '--velocity-y': `${particle.velocityY}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Central celebration message */}
      <div className="relative animate-celebration-pop">
        <div className="bg-bg-surface/95 backdrop-blur-md rounded-3xl px-8 py-6 shadow-2xl border border-primary/20 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent-mint/20 flex items-center justify-center animate-bounce-subtle">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <span className="text-2xl font-bold text-text-primary">{displayMessage}</span>
        </div>
      </div>
    </div>
  );
}

// Add these animations to your globals.css or tailwind config:
//
// @keyframes confetti-fall {
//   0% {
//     transform: translateY(0) translateX(0) rotate(0deg);
//     opacity: 1;
//   }
//   100% {
//     transform: translateY(calc(100vh - 50%)) translateX(var(--velocity-x)) rotate(720deg);
//     opacity: 0;
//   }
// }
//
// @keyframes celebration-pop {
//   0% {
//     transform: scale(0.5);
//     opacity: 0;
//   }
//   50% {
//     transform: scale(1.1);
//   }
//   100% {
//     transform: scale(1);
//     opacity: 1;
//   }
// }
//
// @keyframes bounce-subtle {
//   0%, 100% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(-8px);
//   }
// }
//
// .animate-confetti-fall {
//   animation: confetti-fall 1.5s ease-out forwards;
// }
//
// .animate-celebration-pop {
//   animation: celebration-pop 0.4s ease-out forwards;
// }
//
// .animate-bounce-subtle {
//   animation: bounce-subtle 0.6s ease-in-out infinite;
// }
