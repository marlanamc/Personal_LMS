// Crisis Mode Menu System
// Pre-made decision menus for when executive function is offline

export type CrisisMenuTab = 'food' | 'regulation' | 'task' | 'communication';

export interface CrisisMenuItem {
  id: string;           // `item-${Date.now()}-${random}`
  text: string;
  emoji?: string;
  notes?: string;
}

export interface CrisisMenuStore {
  food: CrisisMenuItem[];
  regulation: CrisisMenuItem[];
  task: CrisisMenuItem[];
  communication: CrisisMenuItem[];
}

export const SUBJECT_KEY = 'crisis-menu';

// Default regulation items sourced from sensory resets
const DEFAULT_REGULATION_ITEMS: CrisisMenuItem[] = [
  {
    id: 'regulation-1',
    text: 'Five Things - Look around. Name 5 things you can see.',
    emoji: '👀',
    notes: 'Grounding technique',
  },
  {
    id: 'regulation-2',
    text: 'Self Hug - Wrap arms around yourself and squeeze.',
    emoji: '🤗',
    notes: 'Pressure/proprioception',
  },
  {
    id: 'regulation-3',
    text: 'Shake It Out - Shake your hands like flicking water off.',
    emoji: '🫨',
    notes: 'Movement/release',
  },
  {
    id: 'regulation-4',
    text: 'Feet on Floor - Press feet flat. Feel the pressure.',
    emoji: '🦶',
    notes: 'Grounding',
  },
  {
    id: 'regulation-5',
    text: 'Fabric Feel - Rub your clothing between your fingers.',
    emoji: '✋',
    notes: 'Tactile grounding',
  },
];

const DEFAULT_FOOD_ITEMS: CrisisMenuItem[] = [
  {
    id: 'food-1',
    text: 'Carrots + peanut butter',
    emoji: '🥕',
    notes: 'Protein + crunch + easy. Literally grab and eat.',
  },
  {
    id: 'food-2',
    text: 'Apple',
    emoji: '🍎',
    notes: 'Zero prep. Crunchy. Gets you moving slightly.',
  },
  {
    id: 'food-3',
    text: 'Ice chips or crushed ice',
    emoji: '🧊',
    notes: 'Cold + crunchy = sensory reset. Dopamine + stimulation.',
  },
  {
    id: 'food-4',
    text: 'Dry cereal/Chex mix',
    emoji: '🥣',
    notes: 'Crunchy, easy, endless snacking. No setup required.',
  },
  {
    id: 'food-5',
    text: 'Hot sauce or pickle juice shots',
    emoji: '🌶️',
    notes: 'Intense sensation. Wakes up the nervous system.',
  },
  {
    id: 'food-6',
    text: 'Frozen grapes or popsicles',
    emoji: '🍇',
    notes: 'Oral stim + cold + sweet. Low effort.',
  },
  {
    id: 'food-7',
    text: 'Salty chips/pretzels/popcorn',
    emoji: '🍿',
    notes: 'Salt craving is real. Hand-to-mouth repetition helps.',
  },
  {
    id: 'food-8',
    text: 'Energy drink or cold caffeine',
    emoji: '⚡',
    notes: 'Dopamine + oral stim + sensory input. Works fast.',
  },
  {
    id: 'food-9',
    text: 'Gum or mints',
    emoji: '🍬',
    notes: 'Oral stim. Flavor/cold sensation. Lasts.',
  },
  {
    id: 'food-10',
    text: 'Something chewy (jerky, gummies)',
    emoji: '🫖',
    notes: 'Proprioceptive input through jaw. Satisfying.',
  },
];

const DEFAULT_TASK_ITEMS: CrisisMenuItem[] = [
  {
    id: 'task-1',
    text: 'Drink water. One glass.',
    emoji: '💧',
    notes: 'Two minutes. Resets something.',
  },
  {
    id: 'task-2',
    text: 'Change position. Lie down or stand up.',
    emoji: '🛏️',
    notes: 'Sometimes the problem is just stuck in one position.',
  },
  {
    id: 'task-3',
    text: 'Open a window. Feel air.',
    emoji: '🪟',
    notes: 'Temperature + light + movement. Sensory reset.',
  },
  {
    id: 'task-4',
    text: 'Put on a song. Just one. Dance if you can.',
    emoji: '🎵',
    notes: 'Movement + dopamine. 3 minutes.',
  },
  {
    id: 'task-5',
    text: 'Close one browser tab or app.',
    emoji: '❌',
    notes: 'Tiny win. Reduces overwhelm.',
  },
  {
    id: 'task-6',
    text: 'Pet the cat/dog or look at a pet.',
    emoji: '🐱',
    notes: 'Soothing. No performance required.',
  },
  {
    id: 'task-7',
    text: 'Lie on the floor for 3 minutes.',
    emoji: '⬇️',
    notes: 'Proprioceptive reset. Gravity helps.',
  },
  {
    id: 'task-8',
    text: 'Wash your hands with cold water.',
    emoji: '🚰',
    notes: 'Extreme sensory input. Can reset the nervous system.',
  },
  {
    id: 'task-9',
    text: 'Stare at something pretty for 1 min.',
    emoji: '👁️',
    notes: 'Doesn\'t have to be productive. Just look.',
  },
  {
    id: 'task-10',
    text: 'Set a timer for 5 min and do nothing.',
    emoji: '⏱️',
    notes: 'Permission to stop trying. Just exist.',
  },
  {
    id: 'task-11',
    text: 'Go grab a latte (or coffee/tea).',
    emoji: '☕',
    notes: 'Change of scenery + caffeine + ritual. Get out of your space.',
  },
  {
    id: 'task-12',
    text: 'Go for a walk. Any length.',
    emoji: '🚶',
    notes: 'Movement + fresh air + away from the problem. Resets everything.',
  },
  {
    id: 'task-13',
    text: 'Sit in the sun (or outside).',
    emoji: '☀️',
    notes: 'Light + warmth + vitamin D. Change of space.',
  },
  {
    id: 'task-14',
    text: 'Sit on the floor with yoga blocks.',
    emoji: '🧱',
    notes: 'Proprioceptive input + support + grounding. Reset mode.',
  },
];

const DEFAULT_COMMUNICATION_ITEMS: CrisisMenuItem[] = [
  {
    id: 'comm-1',
    text: '"Hey, I\'m struggling right now and need space"',
    emoji: '🚩',
    notes: 'Clear boundary. No explanation needed.',
  },
  {
    id: 'comm-2',
    text: '"I can\'t talk but I\'m okay"',
    emoji: '🤐',
    notes: 'Reassure without having to perform.',
  },
  {
    id: 'comm-3',
    text: '"Can you just sit with me for a bit?"',
    emoji: '👥',
    notes: 'Asks for presence, not conversation.',
  },
  {
    id: 'comm-4',
    text: '"I need help with [specific thing]"',
    emoji: '🆘',
    notes: 'Be specific. Don\'t make them guess.',
  },
  {
    id: 'comm-5',
    text: '"Can you remind me to [eat/drink/move]?"',
    emoji: '🔔',
    notes: 'Ask external brain to do the remembering.',
  },
  {
    id: 'comm-6',
    text: 'Crisis line: 988 (Suicide & Crisis Lifeline)',
    emoji: '📞',
    notes: 'Text or call. Available 24/7. You don\'t have to be suicidal.',
  },
];

export const DEFAULT_ITEMS: CrisisMenuStore = {
  food: DEFAULT_FOOD_ITEMS,
  regulation: DEFAULT_REGULATION_ITEMS,
  task: DEFAULT_TASK_ITEMS,
  communication: DEFAULT_COMMUNICATION_ITEMS,
};

/**
 * Validate and normalize crisis menu store from raw JSON
 * Ensures type safety and provides sensible defaults for missing data
 */
export function normalizeCrisisMenuStore(raw: unknown): CrisisMenuStore {
  // If null/undefined, return default
  if (!raw) {
    return JSON.parse(JSON.stringify(DEFAULT_ITEMS));
  }

  // If not an object, return default
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return JSON.parse(JSON.stringify(DEFAULT_ITEMS));
  }

  const obj = raw as Record<string, unknown>;

  // If object is empty or has no valid arrays, return defaults
  if (!obj.food && !obj.regulation && !obj.task && !obj.communication) {
    return JSON.parse(JSON.stringify(DEFAULT_ITEMS));
  }

  // Helper to validate menu array
  const validateMenuArray = (arr: unknown, defaultFallback: CrisisMenuItem[] = []): CrisisMenuItem[] => {
    if (!Array.isArray(arr)) return defaultFallback;
    const validated = arr
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null && !Array.isArray(item))
      .map((item) => ({
        id: typeof item.id === 'string' ? item.id : `item-${Date.now()}-${Math.random()}`,
        text: typeof item.text === 'string' ? item.text : 'Untitled item',
        emoji: typeof item.emoji === 'string' ? item.emoji : undefined,
        notes: typeof item.notes === 'string' ? item.notes : undefined,
      }));
    return validated.length > 0 ? validated : defaultFallback;
  };

  return {
    food: validateMenuArray(obj.food, DEFAULT_FOOD_ITEMS),
    regulation: validateMenuArray(obj.regulation, DEFAULT_REGULATION_ITEMS),
    task: validateMenuArray(obj.task, DEFAULT_TASK_ITEMS),
    communication: validateMenuArray(obj.communication, DEFAULT_COMMUNICATION_ITEMS),
  };
}

/**
 * Generate a new unique ID for menu items
 */
export function newItemId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Trigger haptic feedback on supported devices
 */
export function triggerHaptic(pattern: number | number[] = 12): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern);
  }
}
