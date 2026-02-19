import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "2/26/26: Workplace Conversations",
  description: "Practice workplace language. Focus: describing jobs, schedules, and polite requests.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I work as a...", example: "I work as a cashier at a grocery store." },
    { phrase: "My schedule is...", example: "My schedule is Monday through Friday, 9 to 5." },
    { phrase: "I need to request...", example: "I need to request time off next week." },
    { phrase: "Could you please...?", example: "Could you please show me how to do this?" },
    { phrase: "I don't understand...", example: "I don't understand this procedure. Can you explain?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Describe your current job or a job you had before. What are your responsibilities?",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Think about your daily tasks and what you do at work."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Tell me about your work schedule. What days and hours do you work?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
    },
    {
      id: "prompt-3",
      level: "beginner",
      text: "Describe your coworkers or your manager. Who do you work with?",
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "You need to ask your boss for a day off. What will you say?",
      context: "Practice requesting time off politely and explaining why you need it."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "A customer is upset about something at work. How do you handle the situation?",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Practice staying calm, listening to the problem, and offering help."
    },
  ],  released: false
};
