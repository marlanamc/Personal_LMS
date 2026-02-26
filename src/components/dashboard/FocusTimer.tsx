'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
    Play,
    Pause,
    Music,
    CheckSquare,
    Check,
    ExternalLink,
    BookOpen,
    Code2,
    Gamepad2,
    Languages,
    X,
    Plus,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { useFocusTimer } from '@/context/FocusTimerContext';
import { ActivityPanelContent } from '@/components/dashboard/ActivityPanelContent';
import { getGameEmojiForActivity } from '@/lib/game-emoji';

type SpotifyConnectionStatus = {
    configured: boolean;
    connected: boolean;
    displayName: string | null;
};

type FocusTaskItem = {
    id: string;
    text: string;
    done: boolean;
    source: 'manual' | 'assignment';
    sourceId?: string;
    href?: string;
    activityType?: string;
};

type FeaturedAssignmentTask = {
    id: string;
    title?: string | null;
    activityId: string;
    progress?: number;
    progressStatus?: string;
    submissions?: Array<{ completedAt?: string | null }>;
    class?: { name?: string | null };
    activity: {
        title: string;
        type: string;
    };
};

const FOCUS_TASKS_STORAGE_KEY = 'focus-timer:tasks:v1';
const FOCUS_SESSION_HISTORY_STORAGE_KEY = 'focus-timer:sessions:v1';
const SPOTIFY_CONNECTED_STORAGE_KEY = 'focus-timer:spotify-connected:v1';
const SPOTIFY_AUTO_TRACK_SELECTED_STORAGE_KEY = 'focus-timer:spotify-auto-track-selected:v1';
const MAX_STORED_SESSIONS = 20;

type CompletedFocusSession = {
    id: string;
    title: string;
    durationMinutes: number;
    completedAt: string;
    pointsAwarded?: number;
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

const createTaskId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
    const {
        tracks,
        selectedTrackId,
        selectedTrackName,
        selectedPlaylistId,
        selectedMinutes,
        timeLeft,
        isActive,
        setSelectedTrack,
        setSelectedMinutes,
        toggleTimer,
        resetTimer,
    } = useFocusTimer();

    // Spotify Playlist state
    const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(false);
    const [isTasksPanelOpen, setIsTasksPanelOpen] = useState(false);
    const [spotifyStatus, setSpotifyStatus] = useState<SpotifyConnectionStatus>({
        configured: true,
        connected: false,
        displayName: null,
    });
    const [spotifyConnectedOverride, setSpotifyConnectedOverride] = useState(false);
    const [hasAutoSelectedSpotifyTrack, setHasAutoSelectedSpotifyTrack] = useState(false);
    const [isLoadingSpotifyStatus, setIsLoadingSpotifyStatus] = useState(true);
    const [spotifyNotice, setSpotifyNotice] = useState<string | null>(null);
    const [tasks, setTasks] = useState<FocusTaskItem[]>([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [tasksNotice, setTasksNotice] = useState<string | null>(null);
    const [isImportingTasks, setIsImportingTasks] = useState(false);
    const [tasksHydrated, setTasksHydrated] = useState(false);
    const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
    const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
    const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
    const [sessionTitleInput, setSessionTitleInput] = useState('');
    const [hasCustomSessionTitle, setHasCustomSessionTitle] = useState(false);
    const [activeSessionTitle, setActiveSessionTitle] = useState<string | null>(null);
    const [completedSessions, setCompletedSessions] = useState<CompletedFocusSession[]>([]);
    const [sessionNotice, setSessionNotice] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const prevIsActiveRef = useRef(isActive);

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

    // For drag interaction
    const svgRef = useRef<SVGSVGElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const isSpotifyConnected = spotifyStatus.connected || spotifyConnectedOverride;

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

        const persistedConnected = window.localStorage.getItem(SPOTIFY_CONNECTED_STORAGE_KEY) === 'true';
        if (persistedConnected) {
            setSpotifyConnectedOverride(true);
        }

        const persistedAutoTrackSelected =
            window.localStorage.getItem(SPOTIFY_AUTO_TRACK_SELECTED_STORAGE_KEY) === 'true';
        if (persistedAutoTrackSelected) {
            setHasAutoSelectedSpotifyTrack(true);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (
            isLoadingSpotifyStatus ||
            !isSpotifyConnected ||
            selectedTrackId !== 'none' ||
            hasAutoSelectedSpotifyTrack
        ) {
            return;
        }

        const fallbackTrack = tracks.find((track) => Boolean(track.playlistId));
        if (!fallbackTrack) {
            return;
        }

        setSelectedTrack(fallbackTrack.id);
        setHasAutoSelectedSpotifyTrack(true);
        window.localStorage.setItem(SPOTIFY_AUTO_TRACK_SELECTED_STORAGE_KEY, 'true');
    }, [
        hasAutoSelectedSpotifyTrack,
        isLoadingSpotifyStatus,
        isSpotifyConnected,
        selectedTrackId,
        setSelectedTrack,
        tracks,
    ]);

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
            setSpotifyConnectedOverride(true);
            window.localStorage.setItem(SPOTIFY_CONNECTED_STORAGE_KEY, 'true');
            fetchSpotifyStatus().catch(() => null);
        } else if (spotifyParam === 'connect_failed') {
            setSpotifyNotice('Spotify connection failed. Please try again.');
            setSpotifyConnectedOverride(false);
            window.localStorage.removeItem(SPOTIFY_CONNECTED_STORAGE_KEY);
        } else if (spotifyParam === 'not_configured') {
            setSpotifyNotice('Spotify is not configured yet. Add Spotify environment variables first.');
        } else if (spotifyParam === 'denied') {
            setSpotifyNotice('Spotify connection was canceled.');
            setSpotifyConnectedOverride(false);
            window.localStorage.removeItem(SPOTIFY_CONNECTED_STORAGE_KEY);
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

    const disconnectSpotify = useCallback(async () => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            const response = await fetch('/api/spotify/disconnect', {
                method: 'DELETE',
            });

            if (!response.ok && response.status !== 401) {
                throw new Error('Unable to disconnect Spotify');
            }

            setSpotifyStatus((prev) => ({
                ...prev,
                connected: false,
                displayName: null,
            }));
            setSpotifyConnectedOverride(false);
            setHasAutoSelectedSpotifyTrack(false);
            window.localStorage.removeItem(SPOTIFY_CONNECTED_STORAGE_KEY);
            window.localStorage.removeItem(SPOTIFY_AUTO_TRACK_SELECTED_STORAGE_KEY);
            setSpotifyNotice('Spotify disconnected. Reconnect to restore full playback.');
        } catch {
            setSpotifyNotice('Unable to disconnect Spotify right now. Please try again.');
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            const raw = window.localStorage.getItem(FOCUS_TASKS_STORAGE_KEY);
            if (!raw) {
                setTasks([]);
            } else {
                const parsed = JSON.parse(raw) as FocusTaskItem[];
                if (Array.isArray(parsed)) {
                    setTasks(
                        parsed.filter((item) =>
                            item &&
                            typeof item.id === 'string' &&
                            typeof item.text === 'string' &&
                            typeof item.done === 'boolean' &&
                            (item.source === 'manual' || item.source === 'assignment')
                        )
                    );
                } else {
                    setTasks([]);
                }
            }
        } catch {
            setTasks([]);
        } finally {
            setTasksHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!tasksHydrated || typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem(FOCUS_TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks, tasksHydrated]);

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        if (isTasksPanelOpen || isActivityPanelOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isTasksPanelOpen, isActivityPanelOpen]);

    useEffect(() => {
        if (!tasksNotice) {
            return;
        }

        const timeout = window.setTimeout(() => setTasksNotice(null), 3500);
        return () => window.clearTimeout(timeout);
    }, [tasksNotice]);

    useEffect(() => {
        if (!sessionNotice) {
            return;
        }

        const timeout = window.setTimeout(() => setSessionNotice(null), 4000);
        return () => window.clearTimeout(timeout);
    }, [sessionNotice]);

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

            if (selectedMinutes !== mins) {
                triggerHaptic(15);
            }
            setSelectedMinutes(mins);
        },
        [isActive, selectedMinutes, setSelectedMinutes]
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

    const completedTaskCount = useMemo(
        () => tasks.filter((task) => task.done).length,
        [tasks]
    );
    const sessionTopic = useMemo(() => {
        const taskText = tasks
            .filter((task) => !task.done)
            .map((task) => task.text.toLowerCase())
            .join(' ');

        if (/\b(spanish|preterite|imperfect|verb|conjugation|esol)\b/.test(taskText)) {
            return 'Spanish';
        }

        if (/\b(coding|javascript|typescript|js\/ts|react|next\.js|operator|array)\b/.test(taskText)) {
            return 'Coding';
        }

        if (/\b(game|matching|flashcard|flash card|speed|race|challenge|practice)\b/.test(taskText)) {
            return 'Practice';
        }

        return 'Focus';
    }, [tasks]);
    const suggestedSessionTitle = useMemo(
        () => `${sessionTopic} ${selectedMinutes} min`,
        [sessionTopic, selectedMinutes]
    );

    const addTask = useCallback(() => {
        const trimmed = newTaskText.trim();
        if (!trimmed) return;

        setTasks((prev) => [
            ...prev,
            {
                id: createTaskId(),
                text: trimmed,
                done: false,
                source: 'manual',
            },
        ]);
        setNewTaskText('');
    }, [newTaskText]);

    const toggleTask = useCallback((taskId: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId ? { ...task, done: !task.done } : task
            )
        );
    }, []);

    const deleteTask = useCallback((taskId: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }, []);

    const clearCompletedTasks = useCallback(() => {
        setTasks((prev) => prev.filter((task) => !task.done));
    }, []);

    const saveSessionToServer = useCallback(async (session: CompletedFocusSession) => {
        try {
            const response = await fetch('/api/focus-timer/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: session.id,
                    title: session.title,
                    durationMinutes: session.durationMinutes,
                    completedAt: session.completedAt,
                }),
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json() as {
                pointsAwarded?: number;
                session?: CompletedFocusSession;
            };

            if (data.session) {
                setCompletedSessions((prev) => {
                    const merged = prev.map((entry) =>
                        entry.id === data.session?.id
                            ? { ...entry, pointsAwarded: data.session.pointsAwarded ?? entry.pointsAwarded }
                            : entry
                    );
                    return merged;
                });
            }

            if (typeof data.pointsAwarded === 'number' && data.pointsAwarded > 0) {
                setSessionNotice(`+${data.pointsAwarded} points for focus time`);
            }
        } catch {
            // Keep local history if network sync fails.
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            const raw = window.localStorage.getItem(FOCUS_SESSION_HISTORY_STORAGE_KEY);
            if (!raw) {
                setCompletedSessions([]);
                return;
            }

            const parsed = JSON.parse(raw) as CompletedFocusSession[];
            if (!Array.isArray(parsed)) {
                setCompletedSessions([]);
                return;
            }

            setCompletedSessions(
                parsed.filter((session) =>
                    session &&
                    typeof session.id === 'string' &&
                    typeof session.title === 'string' &&
                    typeof session.durationMinutes === 'number' &&
                    typeof session.completedAt === 'string'
                )
            );
        } catch {
            setCompletedSessions([]);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem(
            FOCUS_SESSION_HISTORY_STORAGE_KEY,
            JSON.stringify(completedSessions.slice(0, MAX_STORED_SESSIONS))
        );
    }, [completedSessions]);

    useEffect(() => {
        let cancelled = false;

        const loadServerSessions = async () => {
            try {
                const response = await fetch('/api/focus-timer/sessions', {
                    method: 'GET',
                    cache: 'no-store',
                });

                if (!response.ok || cancelled) {
                    return;
                }

                const data = await response.json() as { sessions?: CompletedFocusSession[] };
                if (!Array.isArray(data.sessions) || cancelled) {
                    return;
                }

                setCompletedSessions(data.sessions.slice(0, MAX_STORED_SESSIONS));
            } catch {
                // Fall back to local history.
            }
        };

        void loadServerSessions();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const hasStartedSession = isActive || timeLeft < selectedMinutes * 60;

        if (hasStartedSession || hasCustomSessionTitle) {
            return;
        }

        setSessionTitleInput(suggestedSessionTitle);
    }, [isActive, timeLeft, selectedMinutes, hasCustomSessionTitle, suggestedSessionTitle]);

    useEffect(() => {
        const wasActive = prevIsActiveRef.current;
        const sessionCompleted = wasActive && !isActive && timeLeft === 0;

        if (sessionCompleted) {
            const completedTitle = (activeSessionTitle || sessionTitleInput || suggestedSessionTitle).trim();
            const completedSession: CompletedFocusSession = {
                id: `session-${Date.now()}`,
                title: completedTitle,
                durationMinutes: selectedMinutes,
                completedAt: new Date().toISOString(),
            };

            setCompletedSessions((prev) => [completedSession, ...prev].slice(0, MAX_STORED_SESSIONS));
            void saveSessionToServer(completedSession);
            setActiveSessionTitle(null);
            setHasCustomSessionTitle(false);
        }

        prevIsActiveRef.current = isActive;
    }, [isActive, timeLeft, activeSessionTitle, sessionTitleInput, suggestedSessionTitle, selectedMinutes, saveSessionToServer]);

    const importTasksFromSubjects = useCallback(async () => {
        setIsImportingTasks(true);
        setTasksNotice(null);

        try {
            const response = await fetch('/api/assignments/featured', {
                method: 'GET',
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error('Unable to load subject tasks');
            }

            const assignments = (await response.json()) as FeaturedAssignmentTask[];

            const importedTasks: FocusTaskItem[] = assignments.map((assignment) => {
                const title = (assignment.title || assignment.activity.title || 'Assignment').trim();
                const className = assignment.class?.name?.trim();
                const taskText = className ? `${title} (${className})` : title;
                const progress = typeof assignment.progress === 'number' ? assignment.progress : 0;
                const isCompleted =
                    assignment.progressStatus === 'completed' ||
                    progress >= 100 ||
                    Boolean(assignment.submissions?.[0]?.completedAt);

                return {
                    id: `assignment-${assignment.id}`,
                    text: taskText,
                    done: isCompleted,
                    source: 'assignment',
                    sourceId: assignment.id,
                    href: `/activity/${assignment.activityId}?assignment=${assignment.id}`,
                    activityType: assignment.activity.type,
                };
            });

            setTasks((prev) => {
                const manualTasks = prev.filter((task) => task.source !== 'assignment');
                return [...manualTasks, ...importedTasks];
            });

            setTasksNotice(
                importedTasks.length > 0
                    ? `Imported ${importedTasks.length} task${importedTasks.length === 1 ? '' : 's'} from your subjects.`
                    : 'No featured subject tasks found to import.'
            );
        } catch {
            setTasksNotice('Could not import tasks right now. Try again in a moment.');
        } finally {
            setIsImportingTasks(false);
        }
    }, []);

    // Variables for the SVG Ring
    const radius = 120;
    const strokeWidth = 18;
    const circumference = 2 * Math.PI * radius;
    
    // Calculate how much of the ring is filled. 
    // If playing, we use exact timeLeft. If paused, we show exactly the selected minutes.
    const maxTime = selectedMinutes * 60;
    const currentProgressPercentage = isActive ? (timeLeft / maxTime) : 1; 
    const hasSessionProgress = isActive || timeLeft < maxTime;
    
    // The fraction of the 120 minute circle that our 'selectedMinutes' represents
    const selectedFraction = selectedMinutes / 120;
    const selectedArcLength = selectedFraction * circumference;
    const remainingArcLength = currentProgressPercentage * selectedArcLength;
    const elapsedArcLength = Math.max(selectedArcLength - remainingArcLength, 0);

    const getTaskVisualStyle = useCallback((task: FocusTaskItem) => {
        const lower = task.text.toLowerCase();
        const isGame =
            task.activityType === 'game' ||
            /\b(game|matching|flashcard|flash card|speed|race|challenge|practice)\b/.test(lower);
        const isCoding = /\b(coding|javascript|typescript|js\/ts|react|next\.js|operator|array)\b/.test(lower);
        const isSpanish = /\b(spanish|preterite|imperfect|verb|conjugation|esol)\b/.test(lower);

        if (isGame) {
            return {
                accent: 'var(--color-accent-amethyst)',
                soft: 'color-mix(in srgb, var(--color-accent-amethyst) 14%, transparent)',
                border: 'color-mix(in srgb, var(--color-accent-amethyst) 40%, var(--color-border-subtle))',
                label: 'Practice',
                icon: 'game' as const,
                isGame: true,
            };
        }

        if (isCoding) {
            return {
                accent: 'var(--color-accent-teal)',
                soft: 'color-mix(in srgb, var(--color-accent-teal) 14%, transparent)',
                border: 'color-mix(in srgb, var(--color-accent-teal) 40%, var(--color-border-subtle))',
                label: 'Coding',
                icon: 'coding' as const,
                isGame: false,
            };
        }

        if (isSpanish) {
            return {
                accent: 'var(--color-accent-sakura)',
                soft: 'var(--color-accent-sakura-soft)',
                border: 'color-mix(in srgb, var(--color-accent-sakura) 40%, var(--color-border-subtle))',
                label: 'Spanish',
                icon: 'spanish' as const,
                isGame: false,
            };
        }

        return {
            accent: 'var(--color-accent-mint)',
            soft: 'color-mix(in srgb, var(--color-accent-mint) 14%, transparent)',
            border: 'color-mix(in srgb, var(--color-accent-mint) 40%, var(--color-border-subtle))',
            label: task.source === 'assignment' ? 'Subject' : 'Manual',
            icon: 'default' as const,
            isGame: false,
        };
    }, []);
    
    return (
        <div className="min-h-screen bg-bg-base light-ambient-surface focus-timer-ambient text-text font-display transition-colors duration-300 flex flex-col">
            {/* Header / Top Nav area - Fixed at top */}
            <header className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 shrink-0">
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMusicMenuOpen(!isMusicMenuOpen)}
                        className={`flex items-center gap-2 px-4 py-2 ${isMusicMenuOpen ? 'bg-bg-light border-primary/50 text-text' : 'bg-bg-secondary hover:bg-bg-light text-text/90'} rounded-full text-sm font-medium transition-colors border shadow-sm z-10`}
                        style={{ borderColor: isMusicMenuOpen ? 'var(--color-primary)' : 'var(--color-border)' }}
                    >
                        <Music className={`w-4 h-4 ${isMusicMenuOpen ? 'text-primary' : 'text-text/70'}`} />
                        <span>{selectedTrackName === 'No music' ? 'Tune in' : selectedTrackName}</span>
                    </button>

                    {/* Tiimo-Style Dropdown Menu */}
                    {isMusicMenuOpen && (
                        <div className="absolute top-12 left-0 w-64 bg-bg-elevated backdrop-blur-md rounded-3xl p-2 shadow-xl z-50 border border-border/50 animate-fade-in-up">
                            {!isLoadingSpotifyStatus && spotifyStatus.configured && !isSpotifyConnected && (
                                <div className="px-3 py-2 mb-2 border-b border-border/30">
                                    <button
                                        onClick={connectSpotify}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm border"
                                        style={{
                                            backgroundColor: "var(--color-accent-mint)",
                                            color: "var(--color-bg-base)",
                                            borderColor: "color-mix(in srgb, var(--color-accent-mint) 32%, transparent)",
                                        }}
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
                            {!isLoadingSpotifyStatus && isSpotifyConnected && (
                                <div className="px-3 py-2 mb-2 border-b border-border/30">
                                    <p className="text-[11px] text-mineral-mint text-center font-semibold">
                                        {spotifyStatus.displayName
                                            ? `✅ Connected to Spotify (${spotifyStatus.displayName})`
                                            : '✅ Connected to Spotify'}
                                    </p>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={connectSpotify}
                                            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors bg-bg-secondary hover:bg-bg-light text-text"
                                        >
                                            Reconnect
                                        </button>
                                        <button
                                            type="button"
                                            onClick={disconnectSpotify}
                                            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors bg-bg-secondary hover:bg-bg-light text-text"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                {tracks.map((track) => (
                                    <button
                                        key={track.id}
                                        onClick={() => {
                                            setSelectedTrack(track.id);
                                            setIsMusicMenuOpen(false);
                                        }}
                                        className={`flex items-center w-full px-4 py-3 rounded-2xl text-left text-sm font-medium transition-colors ${
                                            selectedTrackId === track.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-text/70 hover:bg-bg-light hover:text-text'
                                        }`}
                                    >
                                        <span className="flex-1">{track.name}</span>
                                        {selectedTrackId === track.id && <Check className="w-4 h-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setIsTasksPanelOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-bg-light rounded-full text-sm font-medium transition-colors border border-border/50 shadow-sm"
                    aria-label="Open tasks panel"
                >
                    <CheckSquare className="w-4 h-4 text-text/70" />
                    <span className="text-text/90">Tasks</span>
                </button>
            </header>

            {/* Centered Content Area */}
            <main className="flex-1 flex items-start justify-center px-6 pt-0 sm:pt-2 pb-[calc(5rem+env(safe-area-inset-bottom))]">
                <div className="w-full max-w-md flex flex-col items-center">
                    {/* Spotify Notice */}
                    {spotifyNotice && (
                        <p className="text-center text-xs font-semibold text-text-muted mb-4">{spotifyNotice}</p>
                    )}
                    {sessionNotice && (
                        <p className="text-center text-xs font-semibold text-mineral-mint mb-4">{sessionNotice}</p>
                    )}

                    {/* Timer Ring */}
                    <div className="focus-timer-well relative flex justify-center items-center mb-8 select-none touch-none">
                <svg
                    ref={svgRef}
                    width="400"
                    height="400"
                    viewBox="0 0 320 320"
                    className="transform -rotate-90 cursor-pointer"
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                >
                    <defs>
                        <linearGradient id="nebula-orbit-gradient" x1="40" y1="40" x2="280" y2="280" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="var(--color-accent-amethyst)" />
                            <stop offset="52%" stopColor="var(--color-accent-sakura)" />
                            <stop offset="100%" stopColor="var(--color-accent-teal)" />
                        </linearGradient>
                    </defs>

                    {/* Background Track (Full Circle) */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        className="transition-colors duration-300"
                        stroke="var(--color-focus-orbit-track)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    
                    {/* Remaining time arc (smooth orbit) */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        className="transition-[stroke-dashoffset] duration-300 ease-linear"
                        stroke="url(#nebula-orbit-gradient)"
                        opacity="0.92"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${remainingArcLength} ${circumference}`}
                        strokeDashoffset={0}
                    />

                    {/* Elapsed segment (quiet mineral trail) */}
                    {hasSessionProgress && elapsedArcLength > 0.5 && (
                        <circle
                            cx="160"
                            cy="160"
                            r={radius}
                            className="transition-[stroke-dasharray,stroke-dashoffset] duration-300 ease-linear"
                            stroke="color-mix(in srgb, var(--color-text-muted) 45%, transparent)"
                            opacity="0.7"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${elapsedArcLength} ${circumference}`}
                            strokeDashoffset={-remainingArcLength}
                        />
                    )}

                    {/* Minimal orbit handle */}
                    <g 
                        className="transition-all duration-100"
                        style={{
                            transformOrigin: '160px 160px',
                            // SVG is rotated -90deg globally; +90 aligns handle to arc endpoint.
                            transform: `rotate(${currentProgressPercentage * selectedFraction * 360 + 90}deg)`
                        }}
                    >
                        <circle 
                            cx="160" 
                            cy={160 - radius} 
                            r="4.5"
                            fill="var(--color-bg-elevated)"
                            stroke="var(--color-accent-sakura)"
                            strokeWidth="1.5"
                            className="transition-colors duration-300"
                        />
                        <circle
                            cx="160"
                            cy={160 - radius}
                            r="1.5"
                            fill="var(--color-accent-sakura)"
                        />
                    </g>
                </svg>

                {/* Center Text */}
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-8xl font-display font-light tracking-tighter mb-1 text-text">
                        {isActive ? formatTime(timeLeft).split(':')[0] : selectedMinutes}
                    </span>
                    <span className="text-base tracking-[0.2em] font-sans uppercase font-bold text-center text-text-muted">
                        MINS
                        {isActive && <div className="text-2xl mt-1 opacity-70 text-text">:{formatTime(timeLeft).split(':')[1]}</div>}
                    </span>
                </div>

                    {/* Clock Markers (positions in viewBox units; scale to match 400px ring) */}
                    <div className="absolute inset-0 pointer-events-none w-[400px] h-[400px] mx-auto">
                        {[120, 30, 60, 90].map((marker, i) => {
                            const deg = i * 90;
                            const markerRadius = radius - strokeWidth/2 - 20; // Text inside the ring
                            const scale = 400 / 320;
                            const x = (160 + markerRadius * Math.sin((deg * Math.PI) / 180)) * scale;
                            const y = (160 - markerRadius * Math.cos((deg * Math.PI) / 180)) * scale;
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
                    <div className="flex justify-center flex-col items-center mb-8">
                        {!isActive && !hasSessionProgress && (
                            <div className="w-full max-w-[300px] mb-4">
                                <label htmlFor="session-title" className="block text-xs font-semibold text-text-muted mb-1">
                                    Session title (optional)
                                </label>
                                <input
                                    id="session-title"
                                    value={sessionTitleInput}
                                    onChange={(event) => {
                                        const nextValue = event.target.value;
                                        setSessionTitleInput(nextValue);
                                        setHasCustomSessionTitle(nextValue.trim() !== '' && nextValue.trim() !== suggestedSessionTitle);
                                    }}
                                    placeholder={suggestedSessionTitle}
                                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg-secondary text-sm text-text placeholder:text-text-muted outline-none focus:border-primary"
                                    maxLength={80}
                                />
                            </div>
                        )}
                        <button
                            onClick={() => {
                                triggerHaptic(20);
                                if (!isActive) {
                                    const normalizedTitle = sessionTitleInput.trim();
                                    setActiveSessionTitle(normalizedTitle || suggestedSessionTitle);
                                }
                                toggleTimer();
                            }}
                            className="focus-timer-main-button flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold transition-transform active:scale-95"
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
                                    setActiveSessionTitle(null);
                                    resetTimer();
                                }}
                                className="mt-4 text-sm font-semibold underline text-text-muted hover:text-text transition-colors"
                            >
                                Reset Timer
                            </button>
                        )}
                    </div>

                    {completedSessions.length > 0 && (
                        <div className="w-full max-w-[300px] mb-8 rounded-2xl border border-border/60 bg-bg-secondary/70 p-4">
                            <h3 className="text-sm font-bold text-text mb-3">Completed Sessions</h3>
                            <div className="space-y-2.5">
                                {completedSessions.slice(0, 3).map((session) => (
                                    <div key={session.id} className="rounded-xl border border-border/50 bg-bg-elevated/70 px-3 py-2">
                                        <p className="text-sm font-semibold text-text truncate">{session.title}</p>
                                        <p className="text-xs text-text-muted">
                                            {session.durationMinutes} min · {new Date(session.completedAt).toLocaleDateString()} {new Date(session.completedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                            {typeof session.pointsAwarded === 'number' && ` · +${session.pointsAwarded} pts`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Spotify Player - Integrated below controls */}
                    {selectedPlaylistId && (
                        <div className="w-full max-w-[300px]">
                            <iframe
                                title="Spotify focus playlist"
                                style={{ borderRadius: '12px' }}
                                src={`https://open.spotify.com/embed/playlist/${selectedPlaylistId}?utm_source=generator&theme=0`}
                                width="100%"
                                height="152"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                        </div>
                    )}
                </div>
            </main>

            <div
                className={`fixed inset-0 z-[60] ${isTasksPanelOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                aria-hidden={!isTasksPanelOpen}
            >
                <button
                    type="button"
                    onClick={() => setIsTasksPanelOpen(false)}
                    className={`absolute inset-0 bg-black/45 transition-opacity duration-200 ${isTasksPanelOpen ? 'opacity-100' : 'opacity-0'}`}
                    tabIndex={isTasksPanelOpen ? 0 : -1}
                    aria-label="Close tasks panel"
                />

                <aside
                    className={`absolute right-0 top-0 h-full w-full max-w-md bg-bg-elevated border-l border-border shadow-2xl transition-transform duration-300 ${isTasksPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Focus tasks"
                >
                    <div className="h-full flex flex-col">
                        <div className="px-5 pt-5 pb-4 border-b border-border/40">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-text">Tasks</h2>
                                    <p className="text-xs text-text-muted mt-1">
                                        {completedTaskCount}/{tasks.length} completed
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsTasksPanelOpen(false)}
                                    className="p-2 rounded-lg bg-bg-secondary hover:bg-bg-light border border-border/40 transition-colors"
                                    aria-label="Close tasks panel"
                                >
                                    <X className="w-4 h-4 text-text-muted" />
                                </button>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <input
                                    value={newTaskText}
                                    onChange={(event) => setNewTaskText(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            addTask();
                                        }
                                    }}
                                    placeholder="Add a focus task..."
                                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-bg-secondary text-sm text-text placeholder:text-text-muted outline-none focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={addTask}
                                    className="px-3 py-2 rounded-xl bg-primary text-bg-base hover:brightness-105 transition-colors"
                                    aria-label="Add task"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={importTasksFromSubjects}
                                    disabled={isImportingTasks}
                                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-bg-secondary hover:bg-bg-light text-sm font-semibold text-text transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isImportingTasks ? 'animate-spin' : ''}`} />
                                    Pull from Subjects
                                </button>
                                <button
                                    type="button"
                                    onClick={clearCompletedTasks}
                                    disabled={completedTaskCount === 0}
                                    className="px-3 py-2 rounded-xl border border-border bg-bg-secondary hover:bg-bg-light text-sm font-semibold text-text transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Clear Done
                                </button>
                            </div>

                            {tasksNotice && (
                                <p className="mt-3 text-xs font-semibold text-text-muted">{tasksNotice}</p>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                            {tasks.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-border/60 bg-bg-secondary/60 p-5 text-center">
                                    <p className="text-sm font-semibold text-text">No tasks yet</p>
                                    <p className="text-xs text-text-muted mt-1">
                                        Add your own tasks or pull from your subject checklist.
                                    </p>
                                </div>
                            )}

                            {tasks.map((task) => (
                                (() => {
                                    const style = getTaskVisualStyle(task);
                                    const match = task.text.match(/^(.*?)(?:\s+\(([^)]+)\))?$/);
                                    const title = (match?.[1] || task.text).trim();
                                    const className = match?.[2]?.trim() || null;
                                    const activityId = task.href
                                        ? task.href.split('?')[0].split('/').pop() || undefined
                                        : undefined;
                                    const gameEmoji = style.isGame
                                        ? getGameEmojiForActivity({ activityId, title: task.text })
                                        : null;

                                    return (
                                        <div
                                            key={task.id}
                                            className="relative overflow-hidden rounded-xl border border-border-subtle bg-bg-surface shadow-sm"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: style.accent }} />

                                            <div className="pl-4 pr-3 py-3 flex items-start gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleTask(task.id)}
                                                    className={`mt-0.5 w-5 h-5 rounded-md border transition-colors flex items-center justify-center ${
                                                        style.isGame
                                                            ? 'border-transparent bg-transparent pointer-events-none'
                                                            : task.done
                                                                ? 'bg-primary border-primary text-bg-base'
                                                                : 'border-border-subtle bg-bg-surface'
                                                    }`}
                                                    aria-label={task.done ? 'Mark task as incomplete' : 'Mark task as complete'}
                                                >
                                                    {style.isGame ? (
                                                        <span className="text-[15px] leading-none">{gameEmoji}</span>
                                                    ) : (
                                                        task.done && <Check className="w-3.5 h-3.5" />
                                                    )}
                                                </button>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md border border-border-subtle bg-bg-elevated/70" aria-hidden>
                                                            {style.icon === 'game' && <Gamepad2 className="w-3 h-3" style={{ color: style.accent }} />}
                                                            {style.icon === 'coding' && <Code2 className="w-3 h-3" style={{ color: style.accent }} />}
                                                            {style.icon === 'spanish' && <Languages className="w-3 h-3" style={{ color: style.accent }} />}
                                                            {style.icon === 'default' && <BookOpen className="w-3 h-3" style={{ color: style.accent }} />}
                                                        </span>
                                                        <span
                                                            className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border"
                                                            style={{ backgroundColor: style.soft, color: style.accent, borderColor: style.border }}
                                                        >
                                                            {style.label}
                                                        </span>
                                                        {className && (
                                                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border border-border-subtle text-text-muted bg-bg-elevated/70">
                                                                {className}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className={`text-base leading-snug font-semibold ${task.done ? 'line-through text-text-muted' : 'text-text'}`}>
                                                        {title}
                                                    </p>

                                                    {task.source === 'assignment' && task.href && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const url = new URL(task.href!, window.location.origin);
                                                                const taskActivityId = url.pathname.split('/').pop();
                                                                const assignmentId = url.searchParams.get('assignment');

                                                                setActiveActivityId(taskActivityId || null);
                                                                setActiveAssignmentId(assignmentId);
                                                                setIsActivityPanelOpen(true);
                                                                setIsTasksPanelOpen(false);
                                                            }}
                                                            className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-semibold transition-colors hover:bg-bg-elevated"
                                                            style={{ color: style.accent, borderColor: style.border }}
                                                        >
                                                            {style.isGame ? 'Play' : 'Open'}
                                                        </button>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteTask(task.id)}
                                                    className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text transition-colors"
                                                    aria-label="Delete task"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Activity Panel - Full Page */}
            <div
                className={`fixed inset-0 z-[65] bg-bg-primary transition-opacity duration-300 ${isActivityPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                aria-hidden={!isActivityPanelOpen}
                role="dialog"
                aria-modal="true"
                aria-label="Activity"
            >
                {isActivityPanelOpen && (
                    <ActivityPanelContent
                        activityId={activeActivityId}
                        assignmentId={activeAssignmentId}
                        onClose={() => setIsActivityPanelOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};
