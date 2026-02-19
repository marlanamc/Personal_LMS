import type { SpeakingActivityContent } from "@/types/activity";

export const exitInterviewAdvice_2026_06_18: SpeakingActivityContent = {
  type: "speaking",
  title: "6/18/26: Exit Interview + Advice for New Students",
  description: "Reflect on progress, give feedback, and practice advice language for new students",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I feel more confident about...", example: "I feel more confident about speaking at work." },
    { phrase: "The hardest thing was...", example: "The hardest thing was pronunciation." },
    { phrase: "The most helpful activity was...", example: "The most helpful activity was role-plays." },
    { phrase: "I recommend...", example: "I recommend practicing every day." },
    { phrase: "If you want to improve, you should...", example: "If you want to improve, you should speak as much as possible." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Exit interview: Answer 5 questions about your experience this year.",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "What did you like? What was hard? What helped you?"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Advice for new students: Give 3 tips and explain why.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Use: You should..., Don't be afraid to..., It's helpful to..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Program feedback: What do you want more of next year? What should change?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use: I'd like more..., I suggest..., It would be better if..."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Role-play: Teacher asks follow-up questions. Student answers with details.",
    soloInstructions: "Read the scenario and think about what you would say in this situation",
    partnerInstructions: "Role-play the scenario: Take turns being different characters",
      context: "Use: for example, because, one reason is..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Celebrate: Share one success and give a compliment to a classmate.",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Use: I'm proud of..., I noticed that you..."
    },
  ],// 

  reflectionPrompt: "What is one thing you will keep doing to practice English after today?",// 
  reflectionMinLength: 30,//  released: false
};
