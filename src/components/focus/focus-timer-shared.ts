export type SpotifyConnectionStatus = {
    configured: boolean;
    connected: boolean;
    displayName: string | null;
};

export type FocusTaskItem = {
    id: string;
    text: string;
    done: boolean;
    source: 'manual' | 'assignment';
    sourceId?: string;
    href?: string;
    activityType?: string;
};

export type FeaturedAssignmentTask = {
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

export const FOCUS_TASKS_STORAGE_KEY = 'focus-timer:tasks:v1';
export const FOCUS_NOTEPAD_STORAGE_KEY = 'focus-timer:notepad:v1';
export const FOCUS_SESSION_HISTORY_STORAGE_KEY = 'focus-timer:sessions:v1';
export const FOCUS_WEEK_WINDOW_STORAGE_KEY = 'focus-timer:week-window:v1';
export const SPOTIFY_CONNECTED_STORAGE_KEY = 'focus-timer:spotify-connected:v1';
export const SPOTIFY_AUTO_TRACK_SELECTED_STORAGE_KEY = 'focus-timer:spotify-auto-track-selected:v1';
export const PREFERENCES_API = '/api/focus-timer/preferences';
export const PREFERENCES_SAVE_DEBOUNCE_MS = 500;
export const MAX_STORED_SESSIONS = 20;
export type WeekWindowMode = 'calendar-week' | 'last-7-days';

export type CompletedFocusSession = {
    id: string;
    title: string;
    durationMinutes: number;
    completedAt: string;
    pointsAwarded?: number;
};

export type DragInputEvent =
    | MouseEvent
    | TouchEvent
    | React.MouseEvent<SVGSVGElement>
    | React.TouchEvent<SVGSVGElement>;

export const getEventCoordinates = (event: DragInputEvent): { x: number; y: number } | null => {
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

export const createTaskId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Helper to format MM:SS
export const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Helper to trigger haptic feedback
export const triggerHaptic = (duration = 10) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(duration);
    }
};
