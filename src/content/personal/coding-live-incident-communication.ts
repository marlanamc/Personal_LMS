import type { InteractiveGuideContent } from "@/types/activity";

export const codingLiveIncidentCommunication: InteractiveGuideContent = {
  id: "coding-live-incident-communication",
  title: "Live Incident Communication",
  category: "Advanced Implementation",
  description: "Master real-time stakeholder communication during system outages and production incidents.",
  level: "advanced",
  estimatedMinutes: 150,
  sections: [
    {
      id: "intro-incident",
      title: "Communication Under Pressure",
      stepNumber: undefined,
      icon: "🚨",
      explanation: `When your system goes down, the next 30 minutes determine stakeholder trust. This lesson teaches you to communicate clearly when you don't have all the answers.`,
    },
    {
      id: "framework",
      stepNumber: 1,
      title: "The Incident Communication Framework",
      icon: "📋",
      explanation: `Every incident update has four components: What we know (facts, not speculation) + What we don't know (transparency) + What we're doing (actions) + Next update time (concrete, not vague).`,
    },
    {
      id: "initial-alert",
      stepNumber: 2,
      title: "Initial Alert Within 5 Minutes",
      icon: "⚠️",
      explanation: `Speed matters. Post within 5 minutes with facts you know. Don't wait for full root cause analysis.`,
    },
    {
      id: "mid-updates",
      stepNumber: 3,
      title: "Mid-Incident Updates",
      icon: "📡",
      explanation: `Describe findings without false hope. Progress without promises. Update on schedule even if nothing changed.`,
    },
    {
      id: "resolution",
      stepNumber: 4,
      title: "Resolution Messages",
      icon: "✅",
      explanation: `After fixing, explain what happened, customer impact, root cause, and prevention steps. Don't blame people.`,
    },
    {
      id: "internal-vs-customer",
      stepNumber: 5,
      title: "Internal vs. Customer Language",
      icon: "🗣️",
      explanation: `Internal: Technical, candid, fast. Customer: Professional, impact-focused, reassuring. Same incident, different framing.`,
    },
    {
      id: "pitfalls",
      stepNumber: 6,
      title: "Common Pitfalls to Avoid",
      icon: "⚠️",
      explanation: `Avoid: Over-promising recovery time, skipping scheduled updates, vague status, blaming people, silent resolution.`,
    },
    {
      id: "practice-incident",
      stepNumber: 99,
      title: "Practice & I Can Now",
      icon: "🎯",
      explanation: `You should now write clear incident updates, distinguish findings from fixes, and handle escalations professionally.`,
    },
  ],
};
