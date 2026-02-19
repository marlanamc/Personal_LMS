import type { SpeakingActivityContent } from "@/types/activity";

export const healthyHabitTracker_2026_05_26: SpeakingActivityContent = {
  type: "speaking",
  title: "5/26/26: Healthy Habit Tracker (Verbs + Gerunds)",
  description: "Practice using verbs that take gerunds (enjoy, avoid, quit, stop, keep, finish, consider, suggest) to talk about healthy habits",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I enjoy... (gerund)", example: "I enjoy exercising in the morning. I enjoy cooking healthy meals." },
    { phrase: "I avoid / I quit / I stopped... (gerund)", example: "I avoid eating junk food. I quit smoking. I stopped drinking soda." },
    { phrase: "I keep / I continue... (gerund)", example: "I keep forgetting to drink water. I continue working on my goals." },
    { phrase: "I finished... (gerund)", example: "I finished reading a book about health. I finished preparing my meals for the week." },
    { phrase: "I'm considering / I suggest... (gerund)", example: "I'm considering joining a gym. I suggest trying meditation." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Use 'enjoy' and 'like' + gerund: What healthy habits do you enjoy doing? What don't you like doing?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "I enjoy walking every morning. I like cooking healthy meals. I don't enjoy exercising at the gym."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Use 'avoid' and 'quit/stop' + gerund: What unhealthy habits do you avoid? What have you quit or stopped doing?",
      context: "I avoid eating fast food. I quit smoking. I stopped drinking soda every day."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'keep' and 'continue' + gerund: What good habits do you keep doing? What do you keep forgetting to do?",
      context: "I keep drinking water throughout the day. I continue exercising three times a week. I keep forgetting to take my vitamins."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'finish' + gerund: Talk about healthy activities you completed recently.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "I finished reading a health book. I finished preparing my meals for the week. I finished organizing my schedule to include exercise."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Use 'consider' and 'suggest' + gerund: What healthy changes are you considering? What do you suggest to others?",
      context: "I'm considering joining a yoga class. I'm considering trying a new diet. I suggest walking instead of driving. I suggest drinking more water."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full healthy habits conversation: Use multiple verbs + gerunds (enjoy, avoid, quit, keep, finish, consider, suggest) to describe your wellness journey.",
      context: "Example: 'I enjoy cooking healthy meals at home. I avoid eating processed foods. I quit drinking coffee every morning. I keep trying new vegetables. I finished reading a nutrition book. I'm considering starting a meditation practice. I suggest tracking your water intake.'"
    },
  ],// 

  reflectionPrompt: "Which verb + gerund combination is most useful for talking about healthy habits? Which is hardest to remember?",// 
  reflectionMinLength: 35,//  released: false
};
