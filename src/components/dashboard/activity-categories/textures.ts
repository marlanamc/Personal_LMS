import { type Activity } from "./types";
import { getVocabUnitNumberFromActivity } from "./helpers";

// =============================================================================
// SYNESTHESIA TEXTURE SYSTEM
// Each activity category and sub-type has a unique visual language:
// - Color palette that evokes the concept
// - Pattern/texture that reinforces the meaning
// - Icon that provides quick visual identification
// =============================================================================

export type TexturePattern = 'solid' | 'wave' | 'dots' | 'diagonal' | 'mixed' | 'grid' | 'bubbles' | 'lines' | 'pulse' | 'scatter';

export interface ActivityTexture {
    id: string;              // Unique identifier
    color: string;           // Primary accent color
    bgColor: string;         // Subtle background tint
    pattern: TexturePattern;
    icon: string;            // Small visual indicator
}

// -----------------------------------------------------------------------------
// GRAMMAR TENSE TEXTURES
// Visual metaphors for time and aspect
// -----------------------------------------------------------------------------
export type TenseFamily = 'simple' | 'continuous' | 'perfect' | 'perfect-continuous' | 'review' | 'grammar-other';

export const TENSE_TEXTURES: Record<TenseFamily, ActivityTexture> = {
    simple: {
        id: 'simple',
        color: '#d97757',           // Warm terracotta - grounded, basic
        bgColor: 'rgba(217, 119, 87, 0.04)',
        pattern: 'solid',
        icon: '●',                   // Solid dot - single point in time
    },
    continuous: {
        id: 'continuous',
        color: '#4a90a4',           // Flowing blue - ongoing, in motion
        bgColor: 'rgba(74, 144, 164, 0.04)',
        pattern: 'wave',
        icon: '〰',                  // Wave - ongoing action
    },
    perfect: {
        id: 'perfect',
        color: '#7ba884',           // Fresh green - completed, accomplished
        bgColor: 'rgba(123, 168, 132, 0.04)',
        pattern: 'dots',
        icon: '✓',                   // Check - completed connection
    },
    'perfect-continuous': {
        id: 'perfect-continuous',
        color: '#8b7aa8',           // Soft purple - blend of perfect + continuous
        bgColor: 'rgba(139, 122, 168, 0.04)',
        pattern: 'diagonal',
        icon: '↻',                   // Cycle - duration leading to now
    },
    review: {
        id: 'review',
        color: '#e09f3e',           // Golden amber - synthesis, mastery
        bgColor: 'rgba(224, 159, 62, 0.04)',
        pattern: 'mixed',
        icon: '◈',                   // Diamond - bringing it together
    },
    'grammar-other': {
        id: 'grammar-other',
        color: '#9a8478',           // Warm gray-brown
        bgColor: 'rgba(154, 132, 120, 0.03)',
        pattern: 'solid',
        icon: '◦',
    },
};

// -----------------------------------------------------------------------------
// VOCABULARY TEXTURES
// Visual metaphors for words, meaning, and memory
// -----------------------------------------------------------------------------
export type VocabFamily = 'flashcard' | 'matching' | 'fill-blank' | 'word-scramble' | 'vocab-unit' | 'vocab-other';

export const VOCAB_TEXTURES: Record<VocabFamily, ActivityTexture> = {
    flashcard: {
        id: 'flashcard',
        color: '#1565c0',           // Deep blue - memory, recall
        bgColor: 'rgba(21, 101, 192, 0.04)',
        pattern: 'grid',
        icon: '▢',                   // Card shape
    },
    matching: {
        id: 'matching',
        color: '#7c3aed',           // Vibrant purple - connections
        bgColor: 'rgba(124, 58, 237, 0.04)',
        pattern: 'dots',
        icon: '⟷',                   // Connection arrows
    },
    'fill-blank': {
        id: 'fill-blank',
        color: '#0891b2',           // Cyan - filling gaps
        bgColor: 'rgba(8, 145, 178, 0.04)',
        pattern: 'lines',
        icon: '___',                 // Blank line
    },
    'word-scramble': {
        id: 'word-scramble',
        color: '#ea580c',           // Orange - puzzle, rearrange
        bgColor: 'rgba(234, 88, 12, 0.04)',
        pattern: 'scatter',
        icon: '⟲',                   // Shuffle symbol
    },
    'vocab-unit': {
        id: 'vocab-unit',
        color: '#2563eb',           // Royal blue - structured learning
        bgColor: 'rgba(37, 99, 235, 0.04)',
        pattern: 'grid',
        icon: '📖',
    },
    'vocab-other': {
        id: 'vocab-other',
        color: '#64748b',           // Slate
        bgColor: 'rgba(100, 116, 139, 0.03)',
        pattern: 'solid',
        icon: '○',
    },
};

export const VOCAB_UNIT_TEXTURES: Record<number, ActivityTexture> = {
    1: {
        id: 'vocab-unit-1',
        color: '#2563eb',
        bgColor: 'rgba(37, 99, 235, 0.04)',
        pattern: 'grid',
        icon: '📘',
    },
    2: {
        id: 'vocab-unit-2',
        color: '#0891b2',
        bgColor: 'rgba(8, 145, 178, 0.04)',
        pattern: 'wave',
        icon: '📗',
    },
    3: {
        id: 'vocab-unit-3',
        color: '#0d9488',
        bgColor: 'rgba(13, 148, 136, 0.04)',
        pattern: 'dots',
        icon: '📙',
    },
    4: {
        id: 'vocab-unit-4',
        color: '#16a34a',
        bgColor: 'rgba(22, 163, 74, 0.04)',
        pattern: 'solid',
        icon: '📕',
    },
    5: {
        id: 'vocab-unit-5',
        color: '#65a30d',
        bgColor: 'rgba(101, 163, 13, 0.04)',
        pattern: 'diagonal',
        icon: '🏠',
    },
    6: {
        id: 'vocab-unit-6',
        color: '#d97706',
        bgColor: 'rgba(217, 119, 6, 0.04)',
        pattern: 'lines',
        icon: '💼',
    },
    7: {
        id: 'vocab-unit-7',
        color: '#ea580c',
        bgColor: 'rgba(234, 88, 12, 0.04)',
        pattern: 'mixed',
        icon: '🧭',
    },
    8: {
        id: 'vocab-unit-8',
        color: '#dc2626',
        bgColor: 'rgba(220, 38, 38, 0.04)',
        pattern: 'pulse',
        icon: '🩺',
    },
    9: {
        id: 'vocab-unit-9',
        color: '#c026d3',
        bgColor: 'rgba(192, 38, 211, 0.04)',
        pattern: 'bubbles',
        icon: '🌿',
    },
    10: {
        id: 'vocab-unit-10',
        color: '#7c3aed',
        bgColor: 'rgba(124, 58, 237, 0.04)',
        pattern: 'scatter',
        icon: '🎓',
    },
};

export const getVocabTextureByActivity = (activity: Activity): ActivityTexture | undefined => {
    const vocabType = detectVocabType(activity.id, activity.title);
    if (vocabType !== 'vocab-unit') {
        return VOCAB_TEXTURES[vocabType];
    }

    const unitNumber = getVocabUnitNumberFromActivity(activity);
    if (unitNumber && VOCAB_UNIT_TEXTURES[unitNumber]) {
        return VOCAB_UNIT_TEXTURES[unitNumber];
    }

    return VOCAB_TEXTURES['vocab-unit'];
};

export const getVocabTextureBySection = (sectionLabel: string): ActivityTexture | undefined => {
    const unitMatch = sectionLabel.match(/unit\s+(\d+)/i);
    if (unitMatch?.[1]) {
        const unitNumber = Number.parseInt(unitMatch[1], 10);
        if (Number.isFinite(unitNumber) && VOCAB_UNIT_TEXTURES[unitNumber]) {
            return VOCAB_UNIT_TEXTURES[unitNumber];
        }
    }

    return undefined;
};

// -----------------------------------------------------------------------------
// GAMES TEXTURES
// Visual metaphors for play, challenge, and fun
// -----------------------------------------------------------------------------
export type GameFamily = 'numbers' | 'verb-forms' | 'matching-game' | 'game-other';

export const GAME_TEXTURES: Record<GameFamily, ActivityTexture> = {
    numbers: {
        id: 'numbers',
        color: '#dc2626',           // Red - excitement, challenge
        bgColor: 'rgba(220, 38, 38, 0.04)',
        pattern: 'pulse',
        icon: '🔢',
    },
    'verb-forms': {
        id: 'verb-forms',
        color: '#7c3aed',           // Purple - transformation
        bgColor: 'rgba(124, 58, 237, 0.04)',
        pattern: 'wave',
        icon: '🔄',
    },
    'matching-game': {
        id: 'matching-game',
        color: '#059669',           // Emerald - success, pairs
        bgColor: 'rgba(5, 150, 105, 0.04)',
        pattern: 'dots',
        icon: '🎯',
    },
    'game-other': {
        id: 'game-other',
        color: '#f59e0b',           // Amber - playful
        bgColor: 'rgba(245, 158, 11, 0.04)',
        pattern: 'bubbles',
        icon: '🎮',
    },
};

// -----------------------------------------------------------------------------
// QUIZZES TEXTURES
// Visual metaphors for testing and achievement
// -----------------------------------------------------------------------------
export type QuizFamily = 'weekly-quiz' | 'assessment' | 'quiz-other';

export const QUIZ_TEXTURES: Record<QuizFamily, ActivityTexture> = {
    'weekly-quiz': {
        id: 'weekly-quiz',
        color: '#be123c',           // Rose - important, graded
        bgColor: 'rgba(190, 18, 60, 0.04)',
        pattern: 'diagonal',
        icon: '📋',
    },
    assessment: {
        id: 'assessment',
        color: '#9333ea',           // Purple - evaluation
        bgColor: 'rgba(147, 51, 234, 0.04)',
        pattern: 'lines',
        icon: '✎',
    },
    'quiz-other': {
        id: 'quiz-other',
        color: '#c2410c',           // Burnt orange
        bgColor: 'rgba(194, 65, 12, 0.04)',
        pattern: 'solid',
        icon: '✎',
    },
};

// -----------------------------------------------------------------------------
// SPEAKING TEXTURES
// Visual metaphors for voice and communication
// -----------------------------------------------------------------------------
export type SpeakingFamily = 'pronunciation' | 'conversation' | 'speaking-other';

export const SPEAKING_TEXTURES: Record<SpeakingFamily, ActivityTexture> = {
    pronunciation: {
        id: 'pronunciation',
        color: '#ea580c',           // Orange - warmth, voice
        bgColor: 'rgba(234, 88, 12, 0.04)',
        pattern: 'wave',
        icon: '🔊',
    },
    conversation: {
        id: 'conversation',
        color: '#0d9488',           // Teal - dialogue, exchange
        bgColor: 'rgba(13, 148, 136, 0.04)',
        pattern: 'bubbles',
        icon: '💬',
    },
    'speaking-other': {
        id: 'speaking-other',
        color: '#f97316',           // Bright orange
        bgColor: 'rgba(249, 115, 22, 0.04)',
        pattern: 'solid',
        icon: '🎤',
    },
};

// -----------------------------------------------------------------------------
// PERSONAL LEARNING TEXTURES
// -----------------------------------------------------------------------------
export type PersonalFamily = 'planning' | 'thinking' | 'focus' | 'learning' | 'cleaning' | 'meals' | 'skincare' | 'spanish' | 'coding' | 'personal-other';

export const PERSONAL_TEXTURES: Record<PersonalFamily, ActivityTexture> = {
    planning: {
        id: 'planning',
        color: '#6CD1F0',           // Aquamarine
        bgColor: 'rgba(108, 209, 240, 0.04)',
        pattern: 'grid',
        icon: '🗓️',
    },
    thinking: {
        id: 'thinking',
        color: '#A1A1F7',           // Grape Soda
        bgColor: 'rgba(161, 161, 247, 0.04)',
        pattern: 'bubbles',
        icon: '🧠',
    },
    focus: {
        id: 'focus',
        color: '#EFCCEA',           // Pink Diamond
        bgColor: 'rgba(239, 204, 234, 0.04)',
        pattern: 'pulse',
        icon: '🎯',
    },
    learning: {
        id: 'learning',
        color: '#89D385',           // Botanist
        bgColor: 'rgba(137, 211, 133, 0.04)',
        pattern: 'diagonal',
        icon: '🌱',
    },
    cleaning: {
        id: 'cleaning',
        color: '#D1EFBD',           // Matcha / Bright Green
        bgColor: 'rgba(209, 239, 189, 0.04)',
        pattern: 'solid',
        icon: '✨',
    },
    meals: {
        id: 'meals',
        color: '#ff9b7a',           // Warm Pink/Coral
        bgColor: 'rgba(255, 155, 122, 0.04)',
        pattern: 'dots',
        icon: '🍱',
    },
    skincare: {
        id: 'skincare',
        color: '#6CD1F0',           // Aquamarine
        bgColor: 'rgba(108, 209, 240, 0.04)',
        pattern: 'wave',
        icon: '🫧',
    },
    spanish: {
        id: 'spanish',
        color: '#d946ef',           // Pink/Fuchsia
        bgColor: 'rgba(217, 70, 239, 0.04)',
        pattern: 'pulse',
        icon: '🇪🇸',
    },
    coding: {
        id: 'coding',
        color: '#0ea5e9',           // Sky blue
        bgColor: 'rgba(14, 165, 233, 0.04)',
        pattern: 'grid',
        icon: '💻',
    },
    'personal-other': {
        id: 'personal-other',
        color: '#ec4899',           // Pink
        bgColor: 'rgba(236, 72, 153, 0.04)',
        pattern: 'solid',
        icon: '✨',
    },
};

// -----------------------------------------------------------------------------
// WRITING TEXTURES
// Visual metaphors for composition and expression
// -----------------------------------------------------------------------------
export type WritingFamily = 'paragraph' | 'sentence' | 'writing-other';

export const WRITING_TEXTURES: Record<WritingFamily, ActivityTexture> = {
    paragraph: {
        id: 'paragraph',
        color: '#4f46e5',           // Indigo - depth, structure
        bgColor: 'rgba(79, 70, 229, 0.04)',
        pattern: 'lines',
        icon: '¶',
    },
    sentence: {
        id: 'sentence',
        color: '#0284c7',           // Sky blue - clarity
        bgColor: 'rgba(2, 132, 199, 0.04)',
        pattern: 'lines',
        icon: '—',
    },
    'writing-other': {
        id: 'writing-other',
        color: '#475569',           // Slate - ink
        bgColor: 'rgba(71, 85, 105, 0.04)',
        pattern: 'solid',
        icon: '✏',
    },
};

// -----------------------------------------------------------------------------
// TEXTURE DETECTION FUNCTIONS
// -----------------------------------------------------------------------------

// Detect tense family from activity title (for grammar)
export const detectTenseFamily = (title: string): TenseFamily => {
    const t = title.toLowerCase();

    if (t.includes('review') || t.includes(' vs ') || t.includes('mixed')) {
        return 'review';
    }
    if (t.includes('perfect continuous') || t.includes('perfect progressive')) {
        return 'perfect-continuous';
    }
    if (t.includes('perfect') && !t.includes('continuous') && !t.includes('progressive')) {
        return 'perfect';
    }
    if ((t.includes('continuous') || t.includes('progressive')) && !t.includes('perfect')) {
        return 'continuous';
    }
    if (t.includes('simple')) {
        return 'simple';
    }
    return 'grammar-other';
};

// Detect vocab activity type
export const detectVocabType = (activityId: string, title: string): VocabFamily => {
    const id = activityId.toLowerCase();
    const t = title.toLowerCase();

    if (id.includes('flashcard') || t.includes('flashcard')) return 'flashcard';
    if (id.includes('matching') || t.includes('matching')) return 'matching';
    if (id.includes('fill') || t.includes('fill in') || t.includes('fill-in')) return 'fill-blank';
    if (id.includes('scramble') || t.includes('scramble')) return 'word-scramble';
    if (id.startsWith('vocab-')) return 'vocab-unit';
    return 'vocab-other';
};

// Detect game type
export const detectGameType = (activityId: string, ui: string | null): GameFamily => {
    const id = activityId.toLowerCase();

    if (id === 'numbers-game') return 'numbers';
    if (ui === 'verb-forms' || ui === 'verbforms') return 'verb-forms';
    if (id.includes('matching') || id.includes('match')) return 'matching-game';
    return 'game-other';
};

// Detect quiz type
export const detectQuizType = (title: string): QuizFamily => {
    const t = title.toLowerCase();

    if (t.includes('week')) return 'weekly-quiz';
    if (t.includes('assessment') || t.includes('test')) return 'assessment';
    return 'quiz-other';
};

// Detect speaking type
export const detectSpeakingType = (title: string): SpeakingFamily => {
    const t = title.toLowerCase();

    if (t.includes('pronuncia') || t.includes('sound')) return 'pronunciation';
    if (t.includes('conversation') || t.includes('dialogue') || t.includes('talk')) return 'conversation';
    return 'speaking-other';
};

// Detect writing type
export const detectWritingType = (title: string): WritingFamily => {
    const t = title.toLowerCase();

    if (t.includes('paragraph')) return 'paragraph';
    if (t.includes('sentence')) return 'sentence';
    return 'writing-other';
};

// Detect personal type
export const detectPersonalType = (title: string): PersonalFamily => {
    const t = title.toLowerCase();
    if (t.includes('plan') || t.includes('schedule')) return 'planning';
    if (t.includes('think') || t.includes('reflect') || t.includes('brain')) return 'thinking';
    if (t.includes('focus') || t.includes('deep work') || t.includes('session')) return 'focus';
    if (t.includes('learn') || t.includes('study') || t.includes('read')) return 'learning';
    if (t.includes('clean') || t.includes('tidy') || t.includes('chore')) return 'cleaning';
    if (t.includes('meal') || t.includes('eat') || t.includes('cook') || t.includes('dinner') || t.includes('lunch') || t.includes('breakfast')) return 'meals';
    if (t.includes('skin') || t.includes('face') || t.includes('routine')) return 'skincare';
    if (t.includes('spanish') || t.includes('español')) return 'spanish';
    if (t.includes('coding') || t.includes('js') || t.includes('ts') || t.includes('javascript') || t.includes('typescript')) return 'coding';
    return 'personal-other';
};

// Master function to get texture for any activity
export const getActivityTexture = (activity: Activity, sectionLabel?: string): ActivityTexture | undefined => {
    const category = activity.category?.toLowerCase() || '';
    const type = activity.type?.toLowerCase() || '';

    // Grammar activities
    if (category === 'grammar') {
        const family = detectTenseFamily(activity.title);
        if (family !== 'grammar-other') {
            return TENSE_TEXTURES[family];
        }
        // Try section label for non-tense grammar
        if (sectionLabel) {
            const sectionFamily = detectTenseFamily(sectionLabel);
            if (sectionFamily !== 'grammar-other') {
                return TENSE_TEXTURES[sectionFamily];
            }
        }
        return TENSE_TEXTURES['grammar-other'];
    }

    // Vocabulary activities
    if (category === 'vocabulary' || activity.id?.startsWith('vocab-')) {
        // Use per-activity unit texture so cards can vary within a section (e.g., Cycle 1).
        return getVocabTextureByActivity(activity);
    }

    // Game activities
    if (type === 'game' || category === 'games') {
        const gameType = detectGameType(activity.id, activity.ui);
        return GAME_TEXTURES[gameType];
    }

    // Quiz activities
    if (category === 'quizzes' || type === 'quiz') {
        const quizType = detectQuizType(activity.title);
        return QUIZ_TEXTURES[quizType];
    }

    // Speaking activities
    if (category === 'speaking') {
        const speakingType = detectSpeakingType(activity.title);
        return SPEAKING_TEXTURES[speakingType];
    }

    // Writing activities
    if (category === 'writing' || category === 'writing-reading') {
        const writingType = detectWritingType(activity.title);
        return WRITING_TEXTURES[writingType];
    }

    // Personal Learning activities
    if (category === 'personal') {
        const personalType = detectPersonalType(activity.title);
        return PERSONAL_TEXTURES[personalType];
    }

    return undefined;
};

// Get texture for a section label (used in section headers)
export const getSectionTexture = (sectionLabel: string, filterCategory?: string): ActivityTexture | undefined => {
    const label = sectionLabel.toLowerCase();

    // Grammar section textures
    if (filterCategory === 'grammar') {
        if (label.includes('simple')) return TENSE_TEXTURES.simple;
        if (label.includes('perfect continuous')) return TENSE_TEXTURES['perfect-continuous'];
        if (label.includes('continuous')) return TENSE_TEXTURES.continuous;
        if (label.includes('perfect')) return TENSE_TEXTURES.perfect;
        if (label.includes('review') || label.includes('mixed')) return TENSE_TEXTURES.review;
        return TENSE_TEXTURES['grammar-other'];
    }

    // Vocabulary section textures
    if (filterCategory === 'vocabulary') {
        const vocabSectionTexture = getVocabTextureBySection(sectionLabel);
        if (vocabSectionTexture) return vocabSectionTexture;
        if (label.includes('unit')) return VOCAB_TEXTURES['vocab-unit'];
        return VOCAB_TEXTURES['vocab-other'];
    }

    // Quiz section textures
    if (filterCategory === 'quizzes') {
        if (label.includes('week')) return QUIZ_TEXTURES['weekly-quiz'];
        return QUIZ_TEXTURES['quiz-other'];
    }

    // Personal Learning section textures
    if (filterCategory === 'personal' || filterCategory === 'spanish' || filterCategory === 'coding') {
        if (label.includes('spanish')) return PERSONAL_TEXTURES.spanish;
        if (label.includes('coding')) return PERSONAL_TEXTURES.coding;
        return PERSONAL_TEXTURES['personal-other'];
    }

    return undefined;
};

// Legacy type alias for backward compatibility
export type TenseTexture = ActivityTexture;
