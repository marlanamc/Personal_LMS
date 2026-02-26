import type { InteractiveGuideContent } from "@/types/activity";

export const codingPersonalLearningMetrics: InteractiveGuideContent = {
  id: "coding-personal-learning-metrics",
  title: "Personal Learning Metrics for Developers",
  category: "Advanced Engineering",
  description: "Define and track measurable learning outcomes to accelerate your growth as a developer.",
  level: "intermediate",
  estimatedMinutes: 120,
  sections: [
    {
      id: "intro-metrics",
      title: "You Can Measure Your Own Growth",
      stepNumber: undefined,
      icon: "📊",
      explanation: `Most developers don't track their own learning. But measurement reveals patterns. You'll learn 5 personal KPIs that matter.`,
    },
    {
      id: "time-to-contribution",
      stepNumber: 1,
      title: "Time-to-First-Contribution Metric",
      icon: "⏱️",
      explanation: `How fast can you ship meaningful code on a new codebase? Track this to measure onboarding speed improvement over time.`,
    },
    {
      id: "debugging-accuracy",
      stepNumber: 2,
      title: "Debugging Layer Accuracy",
      icon: "🎯",
      explanation: `When you encounter a bug, how often is your first guess about where it lives correct? UI layer vs API vs Data layer.`,
    },
    {
      id: "pr-approval-rate",
      stepNumber: 3,
      title: "PR Approval Rate",
      icon: "📋",
      explanation: `What percentage of your PRs pass review on first submission? Track approved vs. revision requests to measure code quality growth.`,
    },
    {
      id: "assumption-vs-clarification",
      stepNumber: 4,
      title: "Assumption vs. Clarification Rate",
      icon: "❓",
      explanation: `When you encounter unclear requirements, do you ask questions or make assumptions? Track your clarification rate.`,
    },
    {
      id: "code-reading-speed",
      stepNumber: 5,
      title: "Code Reading Speed",
      icon: "⚡",
      explanation: `How many features can you trace through a codebase in one hour? Faster reading equals faster onboarding and debugging.`,
    },
    {
      id: "practice-metrics",
      stepNumber: 99,
      title: "Practice & I Can Now",
      icon: "🎯",
      explanation: `Track your personal KPIs, create a learning dashboard, and use metrics to identify blind spots in your development.`,
    },
  ],
};
