import {
  BookOpen,
  Sparkles,
  Scale,
  Clock,
  Timer,
  Repeat,
  Star,
  CheckCircle2,
  Pencil,
  Brain,
  BookMarked,
  Check,
  Lightbulb,
  Award,
  ThumbsUp,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

// Map emoji strings to Lucide icons with semantic meaning
const iconMap: Record<string, LucideIcon> = {
  // Section icons
  '📚': BookOpen,        // Introduction, reading sections
  '⭐': Sparkles,        // Key concepts, important points
  '🌟': Star,            // Highlights, featured content
  '⚖️': Scale,           // Comparisons, balancing concepts
  '⏳': Clock,           // Time-related content, duration
  '⏰': Timer,           // Time expressions, deadlines
  '🔄': Repeat,         // Reviews, loops, refreshers
  '📝': Pencil,          // Writing, practice, exercises
  '🧠': Brain,           // Quiz, thinking, comprehension
  '📘': BookMarked,      // Lessons, study material

  // Feedback icons
  '✓': Check,            // Completion, success
  '✅': CheckCircle2,    // Correct answer, validation
  '💡': Lightbulb,       // Tips, hints, ideas
  '🎉': Award,           // Perfect score, celebration
  '👍': ThumbsUp,        // Good job, approval
  '🎓': GraduationCap,   // Learning, education, graduation
};

// Default icon for unmapped emojis
const DefaultIcon = BookOpen;

interface GrammarIconProps {
  emoji?: string;
  className?: string;
  size?: number;
}

/**
 * GrammarIcon component - Replaces emoji strings with appropriate Lucide icons
 *
 * Usage:
 * <GrammarIcon emoji="📚" size={24} />
 * <GrammarIcon emoji="⭐" className="text-yellow-500" />
 */
export function GrammarIcon({ emoji, className = '', size = 20 }: GrammarIconProps) {
  if (!emoji) {
    return <DefaultIcon className={className} size={size} />;
  }

  const IconComponent = iconMap[emoji] || DefaultIcon;

  return <IconComponent className={className} size={size} />;
}

// Export individual icons for direct use
export {
  BookOpen,
  Sparkles,
  Scale,
  Clock,
  Timer,
  Star,
  CheckCircle2,
  Pencil,
  Brain,
  BookMarked,
  Check,
  Lightbulb,
  Award,
  ThumbsUp,
  GraduationCap,
};
