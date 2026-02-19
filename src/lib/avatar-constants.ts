/**
 * Shared avatar constants used across the application.
 * Single source of truth for avatar emojis and colors.
 */

export type AvatarCategory = "animals" | "nature" | "fantasy" | "sea" | "insects" | "food" | "sports" | "symbols";

export interface AvatarOption {
  id: string;
  emoji: string;
  name: string;
  category: AvatarCategory;
}

export interface ColorOption {
  id: string;
  name: string;
  class: string;
}

export const AVATARS: AvatarOption[] = [
  // Animals
  { id: "cat", emoji: "🐱", name: "Cat", category: "animals" },
  { id: "dog", emoji: "🐶", name: "Dog", category: "animals" },
  { id: "rabbit", emoji: "🐰", name: "Rabbit", category: "animals" },
  { id: "bear", emoji: "🐻", name: "Bear", category: "animals" },
  { id: "panda", emoji: "🐼", name: "Panda", category: "animals" },
  { id: "fox", emoji: "🦊", name: "Fox", category: "animals" },
  { id: "lion", emoji: "🦁", name: "Lion", category: "animals" },
  { id: "tiger", emoji: "🐯", name: "Tiger", category: "animals" },
  { id: "elephant", emoji: "🐘", name: "Elephant", category: "animals" },
  { id: "monkey", emoji: "🐵", name: "Monkey", category: "animals" },
  { id: "owl", emoji: "🦉", name: "Owl", category: "animals" },
  { id: "parrot", emoji: "🦜", name: "Parrot", category: "animals" },

  // Nature & Plants
  { id: "butterfly", emoji: "🦋", name: "Butterfly", category: "nature" },
  { id: "flower", emoji: "🌸", name: "Flower", category: "nature" },
  { id: "tree", emoji: "🌳", name: "Tree", category: "nature" },
  { id: "leaf", emoji: "🍃", name: "Leaf", category: "nature" },
  { id: "sun", emoji: "☀️", name: "Sun", category: "nature" },
  { id: "moon", emoji: "🌙", name: "Moon", category: "nature" },
  { id: "star", emoji: "⭐", name: "Star", category: "nature" },
  { id: "rainbow", emoji: "🌈", name: "Rainbow", category: "nature" },

  // Fantasy & Magical
  { id: "unicorn", emoji: "🦄", name: "Unicorn", category: "fantasy" },
  { id: "dragon", emoji: "🐲", name: "Dragon", category: "fantasy" },
  { id: "wizard", emoji: "🧙", name: "Wizard", category: "fantasy" },
  { id: "fairy", emoji: "🧚", name: "Fairy", category: "fantasy" },
  { id: "ghost", emoji: "👻", name: "Ghost", category: "fantasy" },
  { id: "alien", emoji: "👽", name: "Alien", category: "fantasy" },
  { id: "robot", emoji: "🤖", name: "Robot", category: "fantasy" },

  // Sea Creatures
  { id: "octopus", emoji: "🐙", name: "Octopus", category: "sea" },
  { id: "turtle", emoji: "🐢", name: "Turtle", category: "sea" },
  { id: "crab", emoji: "🦀", name: "Crab", category: "sea" },
  { id: "fish", emoji: "🐠", name: "Fish", category: "sea" },
  { id: "shark", emoji: "🦈", name: "Shark", category: "sea" },
  { id: "whale", emoji: "🐋", name: "Whale", category: "sea" },
  { id: "dolphin", emoji: "🐬", name: "Dolphin", category: "sea" },
  { id: "lobster", emoji: "🦞", name: "Lobster", category: "sea" },

  // Insects & Bugs
  { id: "snail", emoji: "🐌", name: "Snail", category: "insects" },
  { id: "bee", emoji: "🐝", name: "Bee", category: "insects" },
  { id: "ladybug", emoji: "🐞", name: "Ladybug", category: "insects" },
  { id: "beetle", emoji: "🪲", name: "Beetle", category: "insects" },

  // Food & Objects
  { id: "pizza", emoji: "🍕", name: "Pizza", category: "food" },
  { id: "hamburger", emoji: "🍔", name: "Hamburger", category: "food" },
  { id: "icecream", emoji: "🍦", name: "Ice Cream", category: "food" },
  { id: "cookie", emoji: "🍪", name: "Cookie", category: "food" },
  { id: "cake", emoji: "🎂", name: "Cake", category: "food" },
  { id: "coffee", emoji: "☕", name: "Coffee", category: "food" },
  { id: "book", emoji: "📚", name: "Book", category: "food" },
  { id: "pencil", emoji: "✏️", name: "Pencil", category: "food" },
  { id: "paintbrush", emoji: "🎨", name: "Paint Brush", category: "food" },
  { id: "music", emoji: "🎵", name: "Music", category: "food" },
  { id: "guitar", emoji: "🎸", name: "Guitar", category: "food" },
  { id: "microphone", emoji: "📱", name: "Phone", category: "food" },
  { id: "camera", emoji: "📷", name: "Camera", category: "food" },
  { id: "gamepad", emoji: "🎮", name: "Gamepad", category: "food" },
  { id: "rocket", emoji: "🚀", name: "Rocket", category: "food" },
  { id: "airplane", emoji: "✈️", name: "Airplane", category: "food" },
  { id: "car", emoji: "🚗", name: "Car", category: "food" },

  // Sports & Activities
  { id: "soccer", emoji: "⚽", name: "Soccer", category: "sports" },
  { id: "basketball", emoji: "🏀", name: "Basketball", category: "sports" },
  { id: "tennis", emoji: "🎾", name: "Tennis", category: "sports" },
  { id: "baseball", emoji: "⚾", name: "Baseball", category: "sports" },
  { id: "football", emoji: "🏈", name: "Football", category: "sports" },
  { id: "bicycle", emoji: "🚴", name: "Bicycle", category: "sports" },
  { id: "skateboard", emoji: "🛹", name: "Skateboard", category: "sports" },
  { id: "surfboard", emoji: "🏄", name: "Surfboard", category: "sports" },

  // Symbols & Emotions
  { id: "heart", emoji: "❤️", name: "Heart", category: "symbols" },
  { id: "thumbsup", emoji: "👍", name: "Thumbs Up", category: "symbols" },
  { id: "fire", emoji: "🔥", name: "Fire", category: "symbols" },
  { id: "lightning", emoji: "⚡", name: "Lightning", category: "symbols" },
  { id: "sparkles", emoji: "✨", name: "Sparkles", category: "symbols" },
  { id: "diamond", emoji: "💎", name: "Diamond", category: "symbols" },
  { id: "crown", emoji: "👑", name: "Crown", category: "symbols" },
  { id: "trophy", emoji: "🏆", name: "Trophy", category: "symbols" },
  { id: "medal", emoji: "🏅", name: "Medal", category: "symbols" },
  { id: "flag", emoji: "🚩", name: "Flag", category: "symbols" },
];

export const COLORS: ColorOption[] = [
  { id: "red", name: "Red", class: "bg-red-400" },
  { id: "orange", name: "Orange", class: "bg-orange-400" },
  { id: "amber", name: "Amber", class: "bg-amber-400" },
  { id: "yellow", name: "Yellow", class: "bg-yellow-300" },
  { id: "lime", name: "Lime", class: "bg-lime-400" },
  { id: "green", name: "Green", class: "bg-green-400" },
  { id: "emerald", name: "Emerald", class: "bg-emerald-400" },
  { id: "teal", name: "Teal", class: "bg-teal-400" },
  { id: "cyan", name: "Cyan", class: "bg-cyan-400" },
  { id: "sky", name: "Sky", class: "bg-sky-400" },
  { id: "blue", name: "Blue", class: "bg-blue-400" },
  { id: "indigo", name: "Indigo", class: "bg-indigo-400" },
  { id: "violet", name: "Violet", class: "bg-violet-400" },
  { id: "purple", name: "Purple", class: "bg-purple-400" },
  { id: "fuchsia", name: "Fuchsia", class: "bg-fuchsia-400" },
  { id: "pink", name: "Pink", class: "bg-pink-400" },
  { id: "rose", name: "Rose", class: "bg-rose-400" },
  { id: "slate", name: "Slate", class: "bg-slate-400" },
  { id: "zinc", name: "Zinc", class: "bg-zinc-400" },
  { id: "gray", name: "Gray", class: "bg-gray-400" },
];

// Lookup maps for quick access
export const AVATAR_MAP: Record<string, string> = Object.fromEntries(
  AVATARS.map((a) => [a.id, a.emoji])
);

export const COLOR_CLASS_MAP: Record<string, string> = Object.fromEntries(
  COLORS.map((c) => [c.id, c.class])
);

// Default values
export const DEFAULT_AVATAR = "cat";
export const DEFAULT_COLOR = "blue";

// Validation helpers
export const VALID_AVATAR_IDS = new Set(AVATARS.map((a) => a.id));
export const VALID_COLOR_IDS = new Set(COLORS.map((c) => c.id));

export function isValidAvatarId(id: string): boolean {
  return VALID_AVATAR_IDS.has(id);
}

export function isValidColorId(id: string): boolean {
  return VALID_COLOR_IDS.has(id);
}

// Helper functions
export function getAvatarEmoji(avatarId: string | null | undefined): string {
  if (!avatarId) return AVATAR_MAP[DEFAULT_AVATAR];
  return AVATAR_MAP[avatarId] || AVATAR_MAP[DEFAULT_AVATAR];
}

export function getColorClass(colorId: string | null | undefined): string {
  if (!colorId) return COLOR_CLASS_MAP[DEFAULT_COLOR];
  return COLOR_CLASS_MAP[colorId] || COLOR_CLASS_MAP[DEFAULT_COLOR];
}

export function getAvatarsByCategory(category: AvatarCategory): AvatarOption[] {
  return AVATARS.filter((a) => a.category === category);
}

export function getAvatarCategoryCount(category: AvatarCategory): number {
  return AVATARS.filter((a) => a.category === category).length;
}
