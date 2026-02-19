import type { SpeakingActivityContent } from "@/types/activity";

export const interviewCommonQuestions_2026_03_05: SpeakingActivityContent = {
  type: "speaking",
  title: "3/5/26: Interview Questions (Gerunds & Infinitives)",
  description: "Practice interview language. Focus: gerunds vs infinitives in interview questions.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I enjoy...", example: "I enjoy helping customers and solving problems." },
    { phrase: "I'm good at...", example: "I'm good at working with a team." },
    { phrase: "I want to / hope to...", example: "I want to learn new skills. I hope to grow with the company." },
    { phrase: "I need to / plan to...", example: "I need to improve my computer skills." },
    { phrase: "I'd like to...", example: "I'd like to ask about the schedule." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Answer: What do you enjoy doing at work? What are you good at?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use GERUNDS: I enjoy helping people. I'm good at working with numbers. I enjoy learning new things."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Answer: Why do you want this job? What do you hope to achieve?",
      context: "Use INFINITIVES: I want to learn new skills. I hope to grow in my career. I'd like to work with a good team."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Answer: What are your career goals? What do you plan to do in the next 5 years?",
      context: "Mix INFINITIVES: I plan to finish my degree. I want to become a manager. I hope to start my own business."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Answer: What tasks do you dislike doing? What do you avoid doing if possible?",
      context: "Use GERUNDS: I dislike working late nights. I avoid missing deadlines. I don't enjoy doing repetitive tasks."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Contrast gerunds and infinitives: What do you enjoy doing (gerund) vs. What do you want to do (infinitive) in your next job?",
      context: "I enjoy talking to customers (gerund = like doing). I want to earn more money (infinitive = goal/purpose)."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Complex interview answer: I started... (gerund), but I decided to... (infinitive), so I stopped... (gerund) and began to... (infinitive).",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: I started working in retail, but I decided to change careers, so I stopped applying to stores and began to look for office jobs."
    },
  ],// 

  reflectionPrompt: "When answering interview questions, which is easier to use: gerunds (enjoy -ing) or infinitives (want to)? Why?",// 
  reflectionMinLength: 35,//  released: false
};
