export interface GrammarTopic {
    id: string;
    title: string;
    week?: number;
    category: 'foundation' | 'tenses' | 'gerunds-infinitives' | 'modals' | 'advanced' | 'writing';
    subcategory?: 'simple' | 'continuous' | 'perfect' | 'perfect-continuous'; // For verb tenses
    prerequisites?: string[]; // IDs of topics that should be completed first
    relatedTopics?: string[]; // IDs of topics that are conceptually related
    activityTitles?: string[]; // Activity title(s) for progress lookup
}

export const grammarTopics: GrammarTopic[] = [
    // Foundation (Week 1)
    {
        id: 'parts-of-speech',
        title: 'Parts of Speech',
        week: 1,
        category: 'foundation',
        activityTitles: ['Parts of Speech Guide'],
    },
    {
        id: 'articles-community-resources',
        title: 'Articles & References for Community Resources',
        week: 1,
        category: 'foundation',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Articles & References for Community Resources Guide'],
    },
    {
        id: 'prepositions-time-place',
        title: 'Prepositions of Time & Place',
        week: 2,
        category: 'foundation',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Prepositions of Time & Place Guide'],
    },

    // Simple Tenses (Weeks 2-4)
    {
        id: 'present-simple',
        title: 'Present Simple',
        week: 2,
        category: 'tenses',
        subcategory: 'simple',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Present Simple Guide'],
    },
    {
        id: 'past-simple',
        title: 'Past Simple',
        week: 3,
        category: 'tenses',
        subcategory: 'simple',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Past Simple Guide'],
    },
    {
        id: 'future-simple',
        title: 'Future Simple',
        week: 4,
        category: 'tenses',
        subcategory: 'simple',
        prerequisites: ['present-simple', 'past-simple'],
        activityTitles: ['Future Simple Guide'],
    },
    {
        id: 'simple-tenses-review',
        title: 'Simple Tenses Review',
        week: 4,
        category: 'tenses',
        subcategory: 'simple',
        prerequisites: ['present-simple', 'past-simple', 'future-simple'],
        relatedTopics: ['present-simple', 'past-simple', 'future-simple'],
        activityTitles: ['Simple Tenses Review', 'Simple Tenses Review - Complete Guide'],
    },

    // Continuous Tenses (Weeks 5-7)
    {
        id: 'present-continuous',
        title: 'Present Continuous',
        week: 5,
        category: 'tenses',
        subcategory: 'continuous',
        prerequisites: ['present-simple'],
        activityTitles: ['Present Continuous Guide'],
    },
    {
        id: 'past-continuous',
        title: 'Past Continuous',
        week: 6,
        category: 'tenses',
        subcategory: 'continuous',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Past Continuous Guide'],
    },
    {
        id: 'future-continuous',
        title: 'Future Continuous',
        week: 7,
        category: 'tenses',
        subcategory: 'continuous',
        prerequisites: ['future-simple', 'present-continuous'],
        activityTitles: ['Future Continuous Guide'],
    },
    {
        id: 'continuous-tenses-review',
        title: 'Continuous Tenses Review',
        week: 7,
        category: 'tenses',
        subcategory: 'continuous',
        prerequisites: ['present-continuous', 'past-continuous', 'future-continuous'],
        relatedTopics: ['present-continuous', 'past-continuous', 'future-continuous'],
        activityTitles: ['Continuous Tenses Review', 'Continuous Tenses Review - Complete Guide'],
    },

    // Gerunds & Infinitives (Week 22)
    {
        id: 'gerunds-infinitives',
        title: 'Gerunds & Infinitives',
        week: 22,
        category: 'gerunds-infinitives',
        prerequisites: ['present-continuous', 'present-simple'],
        activityTitles: ['Gerunds & Infinitives Guide'],
    },
    {
        id: 'gerunds-infinitives-patterns',
        title: 'Gerunds & Infinitives Patterns',
        week: 26,
        category: 'gerunds-infinitives',
        prerequisites: ['parts-of-speech'],
        relatedTopics: ['gerunds-infinitives-jobs'],
        activityTitles: ['Gerunds & Infinitives Patterns Guide'],
    },

    // Modals & Questions (Weeks 9-11)
    {
        id: 'modals-obligation-permission',
        title: 'Modals: Obligation & Permission',
        week: 11,
        category: 'modals',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Modals for Obligation & Permission Guide'],
    },
    {
        id: 'information-questions',
        title: 'Information Questions (Wh- Questions)',
        week: 10,
        category: 'foundation',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Information Questions Guide'],
    },

    // Perfect Tenses (Weeks 12-14)
    {
        id: 'present-perfect',
        title: 'Present Perfect',
        week: 12,
        category: 'tenses',
        subcategory: 'perfect',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Present Perfect Guide'],
    },
    {
        id: 'past-perfect',
        title: 'Past Perfect',
        week: 13,
        category: 'tenses',
        subcategory: 'perfect',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Past Perfect Guide'],
    },
    {
        id: 'future-perfect',
        title: 'Future Perfect',
        week: 14,
        category: 'tenses',
        subcategory: 'perfect',
        prerequisites: ['present-perfect', 'future-simple'],
        activityTitles: ['Future Perfect Guide'],
    },
    {
        id: 'perfect-tenses-review',
        title: 'Perfect Tenses Review',
        week: 14,
        category: 'tenses',
        subcategory: 'perfect',
        prerequisites: ['present-perfect', 'past-perfect', 'future-perfect'],
        relatedTopics: ['present-perfect', 'past-perfect', 'future-perfect'],
        activityTitles: ['Perfect Tenses Review - Complete Guide', 'Perfect Tenses Review'],
    },
    {
        id: 'cycle-1-review',
        title: 'Cycle 1 Review',
        week: 8,
        category: 'tenses',
        subcategory: 'simple',
        relatedTopics: ['present-simple', 'past-simple', 'future-simple', 'present-continuous', 'past-continuous', 'future-continuous', 'present-perfect'],
        activityTitles: ['Cycle 1 Review'],
    },

    // Perfect Continuous Tenses (Weeks 15-17)
    {
        id: 'present-perfect-continuous',
        title: 'Present Perfect Continuous',
        week: 15,
        category: 'tenses',
        subcategory: 'perfect-continuous',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Present Perfect Continuous Guide'],
    },
    {
        id: 'past-perfect-continuous',
        title: 'Past Perfect Continuous',
        week: 16,
        category: 'tenses',
        subcategory: 'perfect-continuous',
        prerequisites: ['past-perfect', 'past-continuous'],
        activityTitles: ['Past Perfect Continuous Guide'],
    },
    {
        id: 'future-perfect-continuous',
        title: 'Future Perfect Continuous',
        week: 17,
        category: 'tenses',
        subcategory: 'perfect-continuous',
        prerequisites: ['future-perfect', 'future-continuous'],
        activityTitles: ['Future Perfect Continuous Guide'],
    },
    {
        id: 'perfect-continuous-tenses-review',
        title: 'Perfect Continuous Review',
        week: 17,
        category: 'tenses',
        subcategory: 'perfect-continuous',
        prerequisites: ['present-perfect-continuous', 'past-perfect-continuous', 'future-perfect-continuous'],
        relatedTopics: ['present-perfect-continuous', 'past-perfect-continuous', 'future-perfect-continuous'],
        activityTitles: ['Perfect Continuous Tenses Review - Complete Guide', 'Perfect Continuous Tenses Review'],
    },

    // Advanced Grammar (Weeks 18-21)
    {
        id: 'conditionals-zero-first',
        title: 'Zero & First Conditionals',
        week: 18,
        category: 'advanced',
        prerequisites: ['present-simple', 'future-simple'],
        activityTitles: ['Zero & First Conditionals Guide'],
    },
    {
        id: 'simple-continuous-review',
        title: 'Simple & Continuous Tenses Review',
        week: 19,
        category: 'tenses',
        prerequisites: ['simple-tenses-review', 'continuous-tenses-review'],
        relatedTopics: ['present-simple', 'past-simple', 'future-simple', 'present-continuous', 'past-continuous', 'future-continuous'],
        activityTitles: ['Simple & Continuous Tenses Review', 'Tenses Review Guide'],
    },
    {
        id: 'conditionals-second-third',
        title: 'Second & Third Conditionals',
        week: 20,
        category: 'advanced',
        prerequisites: ['conditionals-zero-first', 'past-perfect'],
        relatedTopics: ['conditionals-zero-first'],
        activityTitles: ['Second & Third Conditionals Guide'],
    },
    {
        id: 'passive-voice',
        title: 'Passive Voice',
        week: 22,
        category: 'advanced',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Passive Voice Guide'],
    },
    {
        id: 'reported-speech',
        title: 'Reported Speech',
        week: 21,
        category: 'advanced',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Reported Speech Guide'],
    },
    {
        id: 'used-to-would-rather',
        title: 'Used To & Would Rather',
        week: 10,
        category: 'advanced',
        prerequisites: ['past-simple'],
        activityTitles: ['Used To & Would Rather Guide'],
    },

    // Workplace & Professional (Weeks 11-13)
    {
        id: 'workplace-phrasal-verbs',
        title: 'Workplace Phrasal Verbs',
        week: 13,
        category: 'advanced',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Workplace Phrasal Verbs Guide'],
    },
    {
        id: 'superlatives-quantifiers',
        title: 'Superlatives & Quantifiers',
        week: 9,
        category: 'foundation',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Superlatives & Quantifiers Guide'],
    },

    // Writing (Week 2-3)
    {
        id: 'punctuation-capitalization',
        title: 'Punctuation & Capitalization',
        week: 2,
        category: 'writing',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Punctuation & Capitalization Guide'],
    },
    {
        id: 'paragraph-format',
        title: 'Paragraph Format',
        week: 3,
        category: 'writing',
        prerequisites: ['punctuation-capitalization'],
        activityTitles: ['Paragraph Format Guide'],
    },
    {
        id: 'imperatives-declaratives',
        title: 'Imperatives & Declaratives',
        week: 2,
        category: 'foundation',
        prerequisites: ['parts-of-speech'],
        activityTitles: ['Imperatives vs Declaratives Guide'],
    },

    // Comprehensive Review (Week 22-24)
    {
        id: 'all-verb-tenses-overview',
        title: 'All Verb Tenses Overview',
        week: 22,
        category: 'tenses',
        subcategory: 'perfect-continuous', // Placed with perfect-continuous as the final review
        prerequisites: ['simple-tenses-review', 'continuous-tenses-review', 'perfect-tenses-review', 'perfect-continuous-tenses-review'],
        relatedTopics: ['simple-tenses-review', 'continuous-tenses-review', 'perfect-tenses-review', 'perfect-continuous-tenses-review'],
        activityTitles: ['All Verb Tenses Overview Guide'],
    },
];

// Category colors for the network graph
export const categoryColors = {
    foundation: '#3b82f6', // Blue
    tenses: '#22c55e', // Green
    'gerunds-infinitives': '#f59e0b', // Amber
    modals: '#8b5cf6', // Purple
    advanced: '#ec4899', // Pink
    writing: '#14b8a6', // Teal
};

// Category labels
export const categoryLabels = {
    foundation: 'Foundation',
    tenses: 'Verb Tenses',
    'gerunds-infinitives': 'Gerunds & Infinitives',
    modals: 'Modals',
    advanced: 'Advanced',
    writing: 'Writing',
};

// Helper function to get topic by ID
export function getTopicById(id: string): GrammarTopic | undefined {
    return grammarTopics.find(topic => topic.id === id);
}

// Helper function to get prerequisites for a topic
export function getPrerequisites(topicId: string): GrammarTopic[] {
    const topic = getTopicById(topicId);
    if (!topic || !topic.prerequisites) return [];
    return topic.prerequisites.map(id => getTopicById(id)).filter(Boolean) as GrammarTopic[];
}

// Helper function to get topics that depend on this topic
export function getDependents(topicId: string): GrammarTopic[] {
    return grammarTopics.filter(topic =>
        topic.prerequisites?.includes(topicId)
    );
}

// Helper function to get related topics
export function getRelatedTopics(topicId: string): GrammarTopic[] {
    const topic = getTopicById(topicId);
    if (!topic || !topic.relatedTopics) return [];
    return topic.relatedTopics.map(id => getTopicById(id)).filter(Boolean) as GrammarTopic[];
}
