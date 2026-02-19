import type { SpeakingActivityContent } from "@/types/activity";

export const finalPresentationRehearsal_2026_06_16: SpeakingActivityContent = {
  type: "speaking",
  title: "6/16/26: Final Presentation Rehearsal",
  description: "Rehearse a short end-of-year talk and practice asking and answering questions",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "My goal is...", example: "My goal is to get a better job." },
    { phrase: "I've learned...", example: "I've learned how to advocate for myself." },
    { phrase: "One example is...", example: "One example is calling the doctor to make an appointment." },
    { phrase: "My next step is...", example: "My next step is to study for a certification." },
    { phrase: "Do you have any questions?", example: "Do you have any questions?" },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Plan your talk (60–90 seconds): goal, what you learned, one success, next steps.",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Write 4 bullet points only."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Rehearse with a partner. Partner asks 2 questions.",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "Practice clear answers and follow-up questions."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Improve: Add one detail (a number, date, time, or example).",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: 'I studied 2 times a week.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Small group rehearsal: Present to 3–4 classmates and answer questions.",
      context: "Focus on volume, pace, and eye contact."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Feedback round: Give one compliment and one suggestion to a partner.",
      context: "Use: I liked..., Next time you could..."
    },
  ],// 

  reflectionPrompt: "What part of your presentation do you want to improve before the final day?",// 
  reflectionMinLength: 30,//  released: false
};
