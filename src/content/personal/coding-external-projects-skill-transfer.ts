import type { InteractiveGuideContent } from "@/types/activity";

export const codingExternalProjectsSkillTransfer: InteractiveGuideContent = {
  id: "coding-external-projects-skill-transfer",
  title: "External Projects for Skill Transfer",
  category: "Advanced Engineering",
  description: "Break free from your comfort zone codebase by contributing to external projects and learning from diverse architectures.",
  level: "intermediate",
  estimatedMinutes: 120,
  sections: [
    {
      id: "intro-external",
      title: "Breaking Free of Your Comfort Zone Codebase",
      stepNumber: undefined,
      icon: "🌍",
      explanation: `You've mastered your own codebase. But external projects force you out of your comfort zone and expose you to new patterns and approaches.`,
    },
    {
      id: "finding-projects",
      stepNumber: 1,
      title: "Finding Open-Source Projects at Your Skill Level",
      icon: "🔍",
      explanation: `Start with projects using your stack, with good documentation, responsive maintainers, and good first issue labels for newcomers.`,
    },
    {
      id: "documentation-contribution",
      stepNumber: 2,
      title: "Making Your First Documentation Contribution",
      icon: "📝",
      explanation: `Your first OSS contribution should be documentation. Fill gaps in README, improve examples, or clarify confusing sections.`,
    },
    {
      id: "bug-hunting",
      stepNumber: 3,
      title: "Bug Hunting in Unfamiliar Code",
      icon: "🐛",
      explanation: `After documentation, move to bug fixes. These are better than starting from scratch because the problem is already defined.`,
    },
    {
      id: "code-reading-external",
      stepNumber: 4,
      title: "Reading Code Across Similar Projects",
      icon: "📚",
      explanation: `Pick 3 projects solving the same problem. Compare architecture, state management, testing, and extract lessons.`,
    },
    {
      id: "public-portfolio",
      stepNumber: 5,
      title: "Building Your Public Learning Portfolio",
      icon: "🎯",
      explanation: `Your GitHub should show growth: pinned projects, quality documentation, open-source contributions, and clear purpose.`,
    },
    {
      id: "lessons-back-to-work",
      stepNumber: 6,
      title: "Extracting Lessons to Bring Back",
      icon: "💡",
      explanation: `Use what you've learned in external projects to improve your day job. Share patterns with your team.`,
    },
    {
      id: "practice-external",
      stepNumber: 99,
      title: "Practice & I Can Now",
      icon: "🎯",
      explanation: `Find OSS projects, make your first contribution, compare similar projects, and build a portfolio that shows your growth.`,
    },
  ],
};
