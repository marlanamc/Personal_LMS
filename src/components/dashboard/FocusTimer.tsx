'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Play, Pause, Music, CheckSquare, Check, ExternalLink } from 'lucide-react';

type SpotifyConnectionStatus = {
    configured: boolean;
    connected: boolean;
    displayName: string | null;
};

type DragInputEvent =
    | MouseEvent
    | TouchEvent
    | React.MouseEvent<SVGSVGElement>
    | React.TouchEvent<SVGSVGElement>;

const getEventCoordinates = (event: DragInputEvent): { x: number; y: number } | null => {
    if ('touches' in event) {
        const touch = event.touches[0] ?? event.changedTouches[0];
        if (!touch) return null;
        return { x: touch.clientX, y: touch.clientY };
    }

    return {
        x: event.clientX,
        y: event.clientY,
    };
};

// Helper to format MM:SS
const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Helper to trigger haptic feedback
const triggerHaptic = (duration = 10) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(duration);
    }
};

export const FocusTimer = () => {
    // Spotify Playlist state
    const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<string>('No music');
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [spotifyStatus, setSpotifyStatus] = useState<SpotifyConnectionStatus>({
        configured: true,
        connected: false,
        displayName: null,
    });
    const [isLoadingSpotifyStatus, setIsLoadingSpotifyStatus] = useState(true);
    const [spotifyNotice, setSpotifyNotice] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const tracks = useMemo(() => [
        { id: 'lofi', name: 'Lo-Fi', playlistId: '37i9dQZF1DWWQRwui0ExPn' }, // Lofi Beats
        { id: 'celestial', name: 'Celestial', playlistId: '37i9dQZF1DX8UebIWWIlS6' }, // Mellow Beats
        { id: 'groovy', name: 'Groovy Beats', playlistId: '37i9dQZF1DX0SM0svvH1v0' }, // Jazz Vibes
        { id: 'tiimo', name: 'Deep Focus', playlistId: '37i9dQZF1DWZeKzbqS3Sbi' }, // Deep Focus
        { id: 'acoustic', name: 'Acoustic', playlistId: '37i9dQZF1DWZIOAP995ogX' }, // Acoustic Favorites
        { id: 'none', name: 'No music', playlistId: null },
    ], []);

    const fetchSpotifyStatus = useCallback(async (signal?: AbortSignal) => {
        const response = await fetch('/api/spotify/status', {
            method: 'GET',
            cache: 'no-store',
            signal,
        });

        if (!response.ok && response.status !== 401) {
            throw new Error('Unable to load Spotify status');
        }

        const data = (await response.json()) as Partial<SpotifyConnectionStatus>;
        setSpotifyStatus({
            configured: Boolean(data.configured),
            connected: Boolean(data.connected),
            displayName: typeof data.displayName === 'string' ? data.displayName : null,
        });
    }, []);
    
    // Timer state
    const [selectedMinutes, setSelectedMinutes] = useState<number>(30); // Default to 30 (2 hours scale)
    const [timeLeft, setTimeLeft] = useState<number>(30 * 60);
    const [isActive, setIsActive] = useState(false);
    
    // For drag interaction
    const svgRef = useRef<SVGSVGElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Toggle playing
    const toggleTimer = () => {
        triggerHaptic(20);
        setIsActive(!isActive);
    };

    // Update time when selectedMinutes changes (if not playing)
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(selectedMinutes * 60);
        }
    }, [selectedMinutes, isActive]);

    // Timer interval
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((timeLeft) => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    // Handle clicking outside the music menu to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMusicMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        setIsLoadingSpotifyStatus(true);
        fetchSpotifyStatus(controller.signal)
            .catch(() => {
                setSpotifyStatus({
                    configured: true,
                    connected: false,
                    displayName: null,
                });
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoadingSpotifyStatus(false);
                }
            });

        return () => controller.abort();
    }, [fetchSpotifyStatus]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const currentUrl = new URL(window.location.href);
        const spotifyParam = currentUrl.searchParams.get('spotify');

        if (!spotifyParam) {
            return;
        }

        if (spotifyParam === 'connected') {
            setSpotifyNotice('Spotify connected. Full playback is now available in this player.');
            fetchSpotifyStatus().catch(() => null);
        } else if (spotifyParam === 'connect_failed') {
            setSpotifyNotice('Spotify connection failed. Please try again.');
        } else if (spotifyParam === 'not_configured') {
            setSpotifyNotice('Spotify is not configured yet. Add Spotify environment variables first.');
        } else if (spotifyParam === 'denied') {
            setSpotifyNotice('Spotify connection was canceled.');
        } else {
            setSpotifyNotice('Spotify connection could not be completed. Please try again.');
        }

        currentUrl.searchParams.delete('spotify');
        window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);

        const timeout = window.setTimeout(() => setSpotifyNotice(null), 5000);
        return () => window.clearTimeout(timeout);
    }, [fetchSpotifyStatus]);

    const connectSpotify = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }
        window.location.assign('/api/spotify/connect?returnTo=%2Fdashboard%2Ftimer');
    }, []);

    // Update selected playlist
    useEffect(() => {
        const track = tracks.find(t => t.name === selectedTrack);
        if (track) {
            setSelectedPlaylistId(track.playlistId);
        }
    }, [selectedTrack, tracks]);

    const updateMinutesFromPointer = useCallback(
        (clientX: number, clientY: number) => {
            if (!svgRef.current || isActive) return;

            const svgRect = svgRef.current.getBoundingClientRect();
            const centerX = svgRect.left + svgRect.width / 2;
            const centerY = svgRect.top + svgRect.height / 2;

            const dx = clientX - centerX;
            const dy = clientY - centerY;

            // Angle with 0 at top, increasing clockwise
            let angle = Math.atan2(dx, -dy);
            if (angle < 0) angle += 2 * Math.PI;

            let mins = (angle / (2 * Math.PI)) * 120;
            mins = Math.round(mins / 5) * 5;

            if (mins <= 0) mins = 120;

            setSelectedMinutes((prev) => {
                if (prev !== mins) {
                    triggerHaptic(15);
                }
                return mins;
            });
        },
        [isActive]
    );

    const handleDrag = useCallback(
        (event: DragInputEvent) => {
            if (!isDragging || isActive) return;

            const point = getEventCoordinates(event);
            if (!point) return;

            updateMinutesFromPointer(point.x, point.y);
        },
        [isDragging, isActive, updateMinutesFromPointer]
    );

    const handleDragStart = useCallback(
        (event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
            if (isActive) return;

            const point = getEventCoordinates(event);
            if (!point) return;

            setIsDragging(true);
            updateMinutesFromPointer(point.x, point.y);
        },
        [isActive, updateMinutesFromPointer]
    );

    useEffect(() => {
        const handleDragEnd = () => setIsDragging(false);
        const handleMouseMove = (e: MouseEvent) => handleDrag(e);
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            handleDrag(e);
        };

        if (isDragging) {
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchend', handleDragEnd);
            window.addEventListener('touchcancel', handleDragEnd);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
        }

        return () => {
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchend', handleDragEnd);
            window.removeEventListener('touchcancel', handleDragEnd);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isDragging, handleDrag]);

    // Variables for the SVG Ring
    const radius = 120;
    const strokeWidth = 36;
    const circumference = 2 * Math.PI * radius;
    
    // Calculate how much of the ring is filled. 
    // If playing, we use exact timeLeft. If paused, we show exactly the selected minutes.
    const maxTime = selectedMinutes * 60;
    const currentProgressPercentage = isActive ? (timeLeft / maxTime) : 1; 
    
    // The fraction of the 120 minute circle that our 'selectedMinutes' represents
    const selectedFraction = selectedMinutes / 120;
    
    // Pattern for the Tiimo "ticks"
    // We want roughly 60-120 ticks around the whole 120min circle
    const totalTicks = 120;
    const tickSpacing = circumference / totalTicks;
    const tickDashArray = `${tickSpacing * 0.2} ${tickSpacing * 0.8}`; // 20% line, 80% gap

    return (
        <div className="min-h-screen bg-bg-primary text-text font-display transition-colors duration-300 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2 sm:pt-4 relative">
            {/* Spotify Player Area */}
            {selectedPlaylistId && (
                <div className="flex justify-center px-6 mb-8 animate-fade-in">
                    <iframe 
                        style={{ borderRadius: '12px' }}
                        src={`https://open.spotify.com/embed/playlist/${selectedPlaylistId}?utm_source=generator&theme=0`} 
                        width="100%" 
                        height="80" 
                        frameBorder="0" 
                        allowFullScreen 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                    />
                </div>
            )}

            {/* Header / Top Nav area */}
            <div className="flex items-center justify-between px-6 pt-4 pb-6 sm:pt-8 sm:pb-8 relative">
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMusicMenuOpen(!isMusicMenuOpen)}
                        className={`flex items-center gap-2 px-4 py-2 ${isMusicMenuOpen ? 'bg-bg-light border-primary/50 text-text' : 'bg-bg-secondary hover:bg-bg-light text-text/90'} rounded-full text-sm font-medium transition-colors border shadow-sm z-10`}
                        style={{ borderColor: isMusicMenuOpen ? 'var(--color-primary)' : 'var(--color-border)' }}
                    >
                        <Music className={`w-4 h-4 ${isMusicMenuOpen ? 'text-primary' : 'text-text/70'}`} />
                        <span>{selectedTrack === 'No music' ? 'Tune in' : selectedTrack}</span>
                    </button>

                    {/* Tiimo-Style Dropdown Menu */}
                    {isMusicMenuOpen && (
                        <div className="absolute top-12 left-0 w-64 bg-bg-elevated backdrop-blur-md rounded-3xl p-2 shadow-xl z-50 border border-border/50 animate-fade-in-up">
                            {!isLoadingSpotifyStatus && spotifyStatus.configured && !spotifyStatus.connected && (
                                <div className="px-3 py-2 mb-2 border-b border-border/30">
                                    <button
                                        onClick={connectSpotify}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-xl text-xs font-bold transition-colors shadow-sm"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Connect Spotify Premium
                                    </button>
                                    <p className="text-[10px] text-text-muted mt-2 px-1 text-center leading-tight">
                                        Login to fix the 30s preview limit.
                                    </p>
                                </div>
                            )}
                            {!isLoadingSpotifyStatus && !spotifyStatus.configured && (
                                <div className="px-3 py-2 mb-2 border-b border-border/30">
                                    <p className="text-[11px] text-text-muted text-center leading-tight">
                                        Spotify is not configured yet.
                                    </p>
                                </div>
                            )}
                            {!isLoadingSpotifyStatus && spotifyStatus.connected && (
                                <div className="px-3 py-2 mb-2 border-b border-border/30">
                                    <p className="text-[11px] text-[#1DB954] text-center font-semibold">
                                        {spotifyStatus.displayName
                                            ? `Connected as ${spotifyStatus.displayName}`
                                            : 'Spotify connected'}
                                    </p>
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                {tracks.map((track) => (
                                    <button
                                        key={track.id}
                                        onClick={() => {
                                            setSelectedTrack(track.name);
                                            setIsMusicMenuOpen(false);
                                        }}
                                        className={`flex items-center w-full px-4 py-3 rounded-2xl text-left text-sm font-medium transition-colors ${
                                            selectedTrack === track.name 
                                                ? 'bg-primary/10 text-primary' 
                                                : 'text-text/70 hover:bg-bg-light hover:text-text'
                                        }`}
                                    >
                                        <span className="flex-1">{track.name}</span>
                                        {selectedTrack === track.name && <Check className="w-4 h-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Removed Moon/Sun toggle since theme handles it globally */}

                <button className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-bg-light rounded-full text-sm font-medium transition-colors border border-border/50 shadow-sm">
                    <CheckSquare className="w-4 h-4 text-text/70" />
                    <span className="text-text/90">Tasks</span>
                </button>
            </div>

            {spotifyNotice && (
                <div className="px-6 pb-2">
                    <p className="text-center text-xs font-semibold text-text-muted">{spotifyNotice}</p>
                </div>
            )}

            {/* Title */}
            <h1 className="text-center text-4xl font-display font-bold mb-8 sm:mb-12 tracking-tight">Focus</h1>

            {/* Timer Ring */}
            <div className="relative flex justify-center items-center mb-10 sm:mb-16 select-none touch-none">
                <svg
                    ref={svgRef}
                    width="320"
                    height="320"
                    viewBox="0 0 320 320"
                    className="transform -rotate-90 cursor-pointer drop-shadow-lg"
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                >
                    {/* Background Track (Full Circle) */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        className="stroke-black/5 dark:stroke-white/5 transition-colors duration-300"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    
                    {/* Progress Fill (Base color) */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        className="stroke-primary transition-[stroke-dashoffset] duration-300 ease-linear shadow-glow-lavender"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${currentProgressPercentage * selectedFraction * circumference} ${circumference}`}
                        strokeDashoffset={0}
                    />

                    {/* Progress Fill Ticks (Tiimo texture) */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        className="stroke-black/10 transition-[stroke-dashoffset] duration-300 ease-linear"
                        strokeWidth={strokeWidth - 2}
                        fill="none"
                        strokeLinecap="butt"
                        strokeDasharray={tickDashArray}
                        mask="url(#progress-mask)"
                    />
                    
                    {/* Define an SVG mask to only show ticks where the progress is */}
                    <defs>
                        <mask id="progress-mask">
                            <circle
                                cx="160"
                                cy="160"
                                r={radius}
                                stroke="white"
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${currentProgressPercentage * selectedFraction * circumference} ${circumference}`}
                                strokeDashoffset={0}
                            />
                        </mask>
                    </defs>

                    {/* Draggable Integrated Indicator (Tiimo Arrow) */}
                    <g 
                        className="transition-all duration-100"
                        style={{
                            transformOrigin: '160px 160px',
                            // SVG is rotated -90deg globally; +90 aligns indicator to the arc endpoint.
                            transform: `rotate(${currentProgressPercentage * selectedFraction * 360 + 90}deg)`
                        }}
                    >
                        {/* A very subtle ghost circle to indicate drag area without being a heavy 'ball' */}
                        <circle 
                            cx="160" 
                            cy={160 - radius} 
                            r={strokeWidth/2} 
                            fill="rgba(255,255,255,0.15)"
                            className="transition-colors duration-300"
                        />
                        {/* The chevron/arrow indicator */}
                        <path
                            d={`M154,${160-radius+2} L160,${160-radius-4} L166,${160-radius+2}`}
                            stroke="rgba(255,255,255,0.9)"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                </svg>

                {/* Center Text */}
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-6xl font-display font-light tracking-tighter mb-1 text-text">
                        {isActive ? formatTime(timeLeft).split(':')[0] : selectedMinutes}
                    </span>
                    <span className="text-sm tracking-[0.2em] font-sans uppercase font-bold text-center text-text-muted">
                        MINS
                        {isActive && <div className="text-xl mt-1 opacity-70 text-text">:{formatTime(timeLeft).split(':')[1]}</div>}
                    </span>
                </div>

                {/* Clock Markers */}
                <div className="absolute inset-0 pointer-events-none w-[320px] h-[320px] mx-auto">
                    {[120, 30, 60, 90].map((marker, i) => {
                        const deg = i * 90;
                        const markerRadius = radius - strokeWidth/2 - 20; // Text inside the ring
                        const x = 160 + markerRadius * Math.sin((deg * Math.PI) / 180);
                        const y = 160 - markerRadius * Math.cos((deg * Math.PI) / 180);
                        return (
                            <div 
                                key={marker}
                                className="absolute text-sm font-semibold -translate-x-1/2 -translate-y-1/2 text-text-muted/60"
                                style={{ left: x, top: y }}
                            >
                                {marker}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Play/Pause Button */}
            <div className="flex justify-center flex-col items-center">
                <button 
                    onClick={toggleTimer}
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-white hover:brightness-110 rounded-full text-lg font-bold transition-transform active:scale-95 shadow-md"
                >
                    {isActive ? (
                        <>Pause <Pause className="w-5 h-5 fill-current" /></>
                    ) : (
                        <>Start <Play className="w-5 h-5 fill-current" /></>
                    )}
                </button>
                
                {isActive && (
                    <button 
                        onClick={() => {
                            triggerHaptic(30);
                            setIsActive(false);
                            setTimeLeft(selectedMinutes * 60);
                        }}
                        className="mt-4 text-sm font-semibold underline text-text-muted hover:text-text transition-colors"
                    >
                        Reset Timer
                    </button>
                )}
            </div>
        </div>
    );
};
