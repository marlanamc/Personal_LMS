// Static content for the Sparks page
// A safe space for AuDHD brains - interest-based nervous system support

export type SparkCategory = 'wonder' | 'memory' | 'sensory' | 'future' | 'micro';

export type SparkPrompt = {
  id: string;
  text: string;
  category: SparkCategory;
};

export type RandomDelight = {
  id: string;
  text: string;
  duration?: number; // optional duration in seconds
};

export type BodyFeeling = {
  id: string;
  label: string;
  emoji: string;
};

// Body check-in options - includes "I don't know" for alexithymia/interoception support
export const BODY_FEELINGS: BodyFeeling[] = [
  { id: 'tight', label: 'Tight', emoji: '😣' },
  { id: 'heavy', label: 'Heavy', emoji: '😔' },
  { id: 'buzzy', label: 'Buzzy', emoji: '⚡' },
  { id: 'floaty', label: 'Floaty', emoji: '☁️' },
  { id: 'numb', label: 'Numb', emoji: '😶' },
  { id: 'okay', label: 'Okay', emoji: '😌' },
  { id: 'unknown', label: "I don't know", emoji: '🤷' },
];

// Spark prompts organized by category
export const SPARK_PROMPTS: SparkPrompt[] = [
  // Wonder - curiosity about the world
  { id: 'wonder-1', text: "What's something you've always wanted to understand?", category: 'wonder' },
  { id: 'wonder-2', text: 'If you could become an expert in anything overnight, what would it be?', category: 'wonder' },
  { id: 'wonder-3', text: 'What question keeps popping into your head?', category: 'wonder' },
  { id: 'wonder-4', text: "What's a topic you could happily fall down a Wikipedia rabbit hole about?", category: 'wonder' },
  { id: 'wonder-5', text: 'What makes you go "huh, I wonder how that works?"', category: 'wonder' },
  { id: 'wonder-6', text: "What's something most people don't think about that fascinates you?", category: 'wonder' },

  // Memory - reconnecting with past interests
  { id: 'memory-1', text: 'Remember a time you lost track of time doing something you loved.', category: 'memory' },
  { id: 'memory-2', text: 'What did 10-year-old you love that adult you forgot about?', category: 'memory' },
  { id: 'memory-3', text: "What's a project you abandoned that still lives in your head?", category: 'memory' },
  { id: 'memory-4', text: 'When did you last feel genuinely excited about something?', category: 'memory' },
  { id: 'memory-5', text: "What's something you used to collect or obsess over?", category: 'memory' },
  { id: 'memory-6', text: "What's a skill you forgot you had?", category: 'memory' },

  // Sensory - grounding through senses
  { id: 'sensory-1', text: 'What texture do you find yourself drawn to?', category: 'sensory' },
  { id: 'sensory-2', text: 'What sound makes you feel most alive?', category: 'sensory' },
  { id: 'sensory-3', text: 'What smell instantly changes your mood?', category: 'sensory' },
  { id: 'sensory-4', text: "What's a color that always catches your eye?", category: 'sensory' },
  { id: 'sensory-5', text: "What's a food texture that brings you comfort?", category: 'sensory' },
  { id: 'sensory-6', text: 'What sounds help you think or focus?', category: 'sensory' },

  // Future - possibilities without pressure
  { id: 'future-1', text: "What would you learn if there were absolutely no stakes?", category: 'future' },
  { id: 'future-2', text: 'If you had a free Saturday with no responsibilities, what would you explore?', category: 'future' },
  { id: 'future-3', text: "What's something you'd try if no one was watching?", category: 'future' },
  { id: 'future-4', text: "What skill sounds fun but you've never given yourself permission to try?", category: 'future' },
  { id: 'future-5', text: 'If you could take a class in anything, just for fun, what would it be?', category: 'future' },
  { id: 'future-6', text: "What's a creative thing you've always wanted to make?", category: 'future' },

  // Micro-interests - small sparks
  { id: 'micro-1', text: 'What made you stop scrolling today, even for a second?', category: 'micro' },
  { id: 'micro-2', text: "Name something you saw recently that was oddly satisfying.", category: 'micro' },
  { id: 'micro-3', text: "What's a random fact you've been wanting to share?", category: 'micro' },
  { id: 'micro-4', text: "What's something small that made you smile this week?", category: 'micro' },
  { id: 'micro-5', text: "What's a tiny thing you noticed that others probably missed?", category: 'micro' },
  { id: 'micro-6', text: "What's something you recently learned that surprised you?", category: 'micro' },
];

// Random delight activities - novelty-seeking micro-activities
export const RANDOM_DELIGHTS: RandomDelight[] = [
  { id: 'delight-1', text: 'Spin in a circle for 10 seconds', duration: 10 },
  { id: 'delight-2', text: 'Write three words that sound good together', duration: 60 },
  { id: 'delight-3', text: 'Look up one random Wikipedia article', duration: 120 },
  { id: 'delight-4', text: 'Send someone a single emoji with no context', duration: 30 },
  { id: 'delight-5', text: 'Draw a squiggle with your eyes closed', duration: 30 },
  { id: 'delight-6', text: 'Name 5 things the same color as your shirt', duration: 60 },
  { id: 'delight-7', text: 'Open a window and just listen for 30 seconds', duration: 30 },
  { id: 'delight-8', text: "Text someone 'thinking of you' (that's it)", duration: 30 },
  { id: 'delight-9', text: 'Stand up and stretch like a cat', duration: 20 },
  { id: 'delight-10', text: 'Make up a word and define it', duration: 60 },
  { id: 'delight-11', text: 'Hum a song you like for 15 seconds', duration: 15 },
  { id: 'delight-12', text: 'Look at something blue and describe it in your head', duration: 20 },
  { id: 'delight-13', text: 'Wiggle your toes and notice how it feels', duration: 10 },
  { id: 'delight-14', text: 'Take 3 slow breaths and count them', duration: 20 },
  { id: 'delight-15', text: 'Name your current emotion out loud (any emotion counts)', duration: 10 },
  { id: 'delight-16', text: 'Touch something soft nearby', duration: 10 },
  { id: 'delight-17', text: 'Say something nice about yourself (even if you mumble it)', duration: 15 },
  { id: 'delight-18', text: 'Pick up an object and notice its weight', duration: 10 },
];

// AuDHD-positive affirmations
export const AFFIRMATIONS: string[] = [
  "Your brain runs on interest. That's not a flaw.",
  'Executive dysfunction is not laziness. Full stop.',
  "You've survived 100% of your worst days.",
  'Parallel thinking is a superpower.',
  'Rest is not earned. It is required.',
  'Your hyperfocus has created amazing things.',
  'Interest is your engine. Protect it.',
  "You don't have to feel motivated to start.",
  'Transition is hard. Be patient with yourself.',
  'Your worth is not measured in productivity.',
  "Being 'too much' means you're enough for the right people.",
  'Your need for novelty is valid.',
  'Stimming is self-regulation, not something to hide.',
  "It's okay to need more time to process.",
  'Your sensitivity is a feature, not a bug.',
  'Needing routine and craving novelty can coexist.',
  "Masking is exhausting. You don't owe anyone neurotypical performance.",
  "Some days surviving is the accomplishment. That's enough.",
  'Your brain works differently. Different is not broken.',
  "You're allowed to take up space.",
];

// Category metadata for styling
export const CATEGORY_CONFIG: Record<SparkCategory, { label: string; color: string; bgClass: string }> = {
  wonder: {
    label: 'Wonder',
    color: 'var(--color-accent-teal)',
    bgClass: 'bg-teal-500/10',
  },
  memory: {
    label: 'Memory',
    color: 'var(--color-accent-sakura)',
    bgClass: 'bg-pink-500/10',
  },
  sensory: {
    label: 'Sensory',
    color: 'var(--color-accent-mint)',
    bgClass: 'bg-emerald-500/10',
  },
  future: {
    label: 'Future',
    color: 'var(--color-accent-amethyst)',
    bgClass: 'bg-purple-500/10',
  },
  micro: {
    label: 'Micro',
    color: 'var(--color-accent-warning)',
    bgClass: 'bg-amber-500/10',
  },
};

// Sensory Reset techniques - grounding through the senses without timers
export type SensoryResetType = 'grounding' | 'pressure' | 'movement' | 'focus' | 'texture';

export type SensoryReset = {
  id: string;
  title: string;
  instruction: string;
  type: SensoryResetType;
  followUp?: string; // optional gentle follow-up prompt
};

export const SENSORY_RESETS: SensoryReset[] = [
  // Grounding - 5-4-3-2-1 variations and alternatives
  {
    id: 'ground-1',
    title: 'Five Things',
    instruction: 'Look around. Name 5 things you can see right now. Say them out loud or in your head.',
    type: 'grounding',
    followUp: 'Now pick one and really look at it for a moment.',
  },
  {
    id: 'ground-2',
    title: 'Sound Hunt',
    instruction: 'Close your eyes. How many different sounds can you hear? The obvious ones and the quiet ones underneath.',
    type: 'grounding',
  },
  {
    id: 'ground-3',
    title: 'Feet on Floor',
    instruction: 'Press your feet flat against the floor. Feel the pressure. Notice which parts of your feet are touching.',
    type: 'grounding',
  },
  {
    id: 'ground-4',
    title: 'Temperature Check',
    instruction: "What's the temperature of the air on your skin right now? Your face, your hands, anywhere exposed.",
    type: 'grounding',
  },
  {
    id: 'ground-5',
    title: 'Anchor Point',
    instruction: 'Find one object in the room that feels solid and real. Describe it to yourself like you\'re explaining it to someone who can\'t see it.',
    type: 'grounding',
  },

  // Pressure/proprioception - body awareness
  {
    id: 'pressure-1',
    title: 'Self Hug',
    instruction: 'Wrap your arms around yourself and squeeze. Hold it. Feel where the pressure is.',
    type: 'pressure',
  },
  {
    id: 'pressure-2',
    title: 'Wall Push',
    instruction: 'Find a wall. Push against it with both hands, hard. Feel your muscles engage.',
    type: 'pressure',
  },
  {
    id: 'pressure-3',
    title: 'Fist Squeeze',
    instruction: 'Make tight fists with both hands. Squeeze as hard as you can. Then release and notice the difference.',
    type: 'pressure',
  },
  {
    id: 'pressure-4',
    title: 'Heavy Hands',
    instruction: 'Let your hands rest on your thighs. Press down gently but firmly. Feel the weight and warmth.',
    type: 'pressure',
  },
  {
    id: 'pressure-5',
    title: 'Face Press',
    instruction: 'Press your palms against your face - cheeks, forehead, jaw. Firm pressure. Your face exists.',
    type: 'pressure',
  },

  // Movement - small physical resets
  {
    id: 'move-1',
    title: 'Shake It',
    instruction: 'Shake your hands out like you\'re flicking water off them. Let them be floppy.',
    type: 'movement',
  },
  {
    id: 'move-2',
    title: 'Shoulder Drop',
    instruction: 'Raise your shoulders up to your ears. Hold. Now drop them. Notice where they were vs where they are.',
    type: 'movement',
  },
  {
    id: 'move-3',
    title: 'Jaw Release',
    instruction: 'Let your jaw drop open. Move it side to side. Unclench.',
    type: 'movement',
  },
  {
    id: 'move-4',
    title: 'Starfish',
    instruction: 'Spread your fingers wide like a starfish. Stretch them apart. Then relax.',
    type: 'movement',
  },
  {
    id: 'move-5',
    title: 'Twist',
    instruction: 'Sitting or standing, twist your torso gently left, then right. Your spine can move.',
    type: 'movement',
  },

  // Focus - attention anchors
  {
    id: 'focus-1',
    title: 'Smallest Detail',
    instruction: 'Pick any object near you. Find the smallest detail on it. A scratch, a speck, a shadow.',
    type: 'focus',
  },
  {
    id: 'focus-2',
    title: 'Color Scan',
    instruction: 'Pick a color. Find everything in your space that contains that color.',
    type: 'focus',
  },
  {
    id: 'focus-3',
    title: 'Edge Trace',
    instruction: 'Pick an object. Trace its outline with your eyes, slowly, like you\'re drawing it.',
    type: 'focus',
  },
  {
    id: 'focus-4',
    title: 'Light Source',
    instruction: 'Where is the light coming from right now? Trace the shadows it creates.',
    type: 'focus',
  },

  // Texture - tactile grounding
  {
    id: 'texture-1',
    title: 'Fabric Feel',
    instruction: 'Touch the fabric you\'re wearing. Rub it between your fingers. Rough or smooth? Thick or thin?',
    type: 'texture',
  },
  {
    id: 'texture-2',
    title: 'Surface Explore',
    instruction: 'Run your hand over the nearest surface. Notice temperature, texture, any imperfections.',
    type: 'texture',
  },
  {
    id: 'texture-3',
    title: 'Contrast Touch',
    instruction: 'Find two things with different textures. Touch them one after the other. Notice the difference.',
    type: 'texture',
  },
  {
    id: 'texture-4',
    title: 'Hair or Skin',
    instruction: 'Touch your own hair, or run a finger along your arm. Your body is here.',
    type: 'texture',
  },
];

export const SENSORY_TYPE_CONFIG: Record<SensoryResetType, { label: string; emoji: string; color: string }> = {
  grounding: { label: 'Grounding', emoji: '🌱', color: 'var(--color-accent-mint)' },
  pressure: { label: 'Pressure', emoji: '🤲', color: 'var(--color-accent-amethyst)' },
  movement: { label: 'Movement', emoji: '🌊', color: 'var(--color-accent-teal)' },
  focus: { label: 'Focus', emoji: '👁', color: 'var(--color-accent-warning)' },
  texture: { label: 'Texture', emoji: '✋', color: 'var(--color-accent-sakura)' },
};

// Helper to get random item from array
export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Helper to shuffle array (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
