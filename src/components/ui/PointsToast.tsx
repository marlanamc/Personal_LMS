"use client";

import { useEffect, useState } from "react";
import { useSound } from "@/context/SoundContext";

interface PointsToastProps {
  points: number;
  onComplete?: () => void;
}

export function PointsToast({ points, onComplete }: PointsToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; delay: number }>
  >([]);
  const { playSound } = useSound();

  useEffect(() => {
    // Play the points sound
    playSound("points", 0.5);

    // Generate floating particles
    const particleCount = 6;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 40,
      delay: i * 100,
    }));
    setParticles(newParticles);

    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    // Start exit animation after 2 seconds
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 2000);

    // Clean up after exit animation
    const cleanupTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(cleanupTimer);
    };
  }, [onComplete, playSound]);

    return (
        <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
                isVisible && !isLeaving
                    ? "opacity-100 translate-y-0 scale-100"
                    : isLeaving
                        ? "opacity-0 -translate-y-4 scale-95"
                        : "opacity-0 translate-y-4 scale-95"
            }`}
            role="status"
            aria-live="polite"
        >
            {/* Glow background */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 animate-pulse" />

            {/* Main toast card */}
            <div className="relative backdrop-blur-md bg-white/10 border border-primary/30 text-text px-8 py-4 rounded-full shadow-glow-pink flex items-center gap-3 font-bold">
                <span className="text-3xl font-mono animate-glow-pulse">+{points}</span>
                <span className="text-sm uppercase tracking-wider opacity-80">points!</span>
            </div>

            {/* Floating particles */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary pointer-events-none animate-float-up"
                    style={{
                        transform: `translateX(${particle.x}px)`,
                        animationDelay: `${particle.delay}ms`,
                        opacity: 0.6,
                    }}
                />
            ))}
        </div>
    );
}
