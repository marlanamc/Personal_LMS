"use client";

import { useEffect, useState, useMemo } from "react";

interface CelebrationAnimationProps {
    trigger: boolean;
    type?: "confetti" | "stars" | "sparkles" | "milestone";
    onComplete?: () => void;
}

// Simple seeded random function
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export default function CelebrationAnimation({ 
    trigger, 
    type = "confetti", 
    onComplete 
}: CelebrationAnimationProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Generate fixed positions once when component is created
    const confettiPieces = useMemo(() => 
        Array.from({ length: 50 }).map((_, i) => ({
            left: (i * 2) % 100,
            delay: (i * 0.1) % 2,
            duration: 2 + (i * 0.1) % 2,
            color: [
                "#ef4444", "#f97316", "#eab308", "#84cc16",
                "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6",
                "#ec4899", "#f43f5e"
            ][i % 10],
            rotation: (i * 7.2) % 360
        }))
    , []);

    const starPieces = useMemo(() =>
        Array.from({ length: 30 }).map((_, i) => ({
            left: 20 + (i * 3) % 60,
            top: 20 + (i * 2) % 60,
            delay: (i * 0.1) % 1
        }))
    , []);

    const sparklePieces = useMemo(() =>
        Array.from({ length: 20 }).map((_, i) => ({
            left: 10 + (i * 4) % 80,
            top: 10 + (i * 3) % 80,
            delay: (i * 0.15) % 2
        }))
    , []);

    useEffect(() => {
        if (trigger) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                onComplete?.();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [trigger, onComplete]);

    if (!isVisible) return null;

    const renderAnimation = () => {
        switch (type) {
            case "confetti":
                return <ConfettiAnimation pieces={confettiPieces} />;
            case "stars":
                return <StarsAnimation pieces={starPieces} />;
            case "sparkles":
                return <SparklesAnimation pieces={sparklePieces} />;
            case "milestone":
                return <MilestoneAnimation />;
            default:
                return <ConfettiAnimation pieces={confettiPieces} />;
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {renderAnimation()}
        </div>
    );
}

function ConfettiAnimation({ pieces }: { pieces: Array<{
    left: number;
    delay: number;
    duration: number;
    color: string;
    rotation: number;
}> }) {
    return (
        <div className="relative w-full h-full">
            {pieces.map((piece, i) => (
                <div
                    key={i}
                    className="absolute animate-fall"
                    style={{
                        left: `${piece.left}%`,
                        top: `-20px`,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                    }}
                >
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{
                            backgroundColor: piece.color,
                            transform: `rotate(${piece.rotation}deg)`,
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

function StarsAnimation({ pieces }: { pieces: Array<{
    left: number;
    top: number;
    delay: number;
}> }) {
    return (
        <div className="relative w-full h-full">
            {pieces.map((piece, i) => (
                <div
                    key={i}
                    className="absolute animate-star-burst"
                    style={{
                        left: `${piece.left}%`,
                        top: `${piece.top}%`,
                        animationDelay: `${piece.delay}s`,
                    }}
                >
                    <svg
                        className="w-8 h-8 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            ))}
        </div>
    );
}

function SparklesAnimation({ pieces }: { pieces: Array<{
    left: number;
    top: number;
    delay: number;
}> }) {
    return (
        <div className="relative w-full h-full">
            {pieces.map((piece, i) => (
                <div
                    key={i}
                    className="absolute animate-sparkle"
                    style={{
                        left: `${piece.left}%`,
                        top: `${piece.top}%`,
                        animationDelay: `${piece.delay}s`,
                    }}
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-50 animate-ping"></div>
                        <div className="relative w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function MilestoneAnimation() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-bounce">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 animate-fade-in-up">Milestone Reached!</h2>
                <p className="text-lg text-gray-600 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    Great job on your progress!
                </p>
            </div>
        </div>
    );
}

// Add these animations to your globals.css or a separate CSS file
export const animationStyles = `
@keyframes fall {
    0% {
        transform: translateY(-100px) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}

@keyframes star-burst {
    0% {
        transform: scale(0) rotate(0deg);
        opacity: 0;
    }
    50% {
        transform: scale(1.5) rotate(180deg);
        opacity: 1;
    }
    100% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
    }
}

@keyframes sparkle {
    0%, 100% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-fall {
    animation: fall 3s linear forwards;
}

.animate-star-burst {
    animation: star-burst 2s ease-out forwards;
}

.animate-sparkle {
    animation: sparkle 2s ease-in-out infinite;
}
`;
