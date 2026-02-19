import type { SpeakingActivityContent } from "@/types/activity";

export const negotiationSelfAdvocacy_2026_03_24: SpeakingActivityContent = {
  type: "speaking",
  title: "3/24/26: Negotiation & Self-Advocacy (Infinitives vs Gerunds)",
  description: "Practice negotiation language. Focus: infinitives vs gerunds for workplace situations.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I'd like to... (infinitive)", example: "I'd like to change my schedule." },
    { phrase: "I plan to... (infinitive)", example: "I plan to take classes on Tuesdays." },
    { phrase: "I need to... (infinitive)", example: "I need to improve my computer skills." },
    { phrase: "I enjoy... (gerund)", example: "I enjoy working with customers." },
    { phrase: "I can't... (gerund)", example: "I can't avoid working late if my child is sick." },
    { phrase: "Would you consider...? (gerund)", example: "Would you consider changing your shift?" },
    { phrase: "I decided to... (infinitive)", example: "I decided to ask for a schedule change." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Use INFINITIVES to explain what you need and want: I need to... / I want to... / I'd like to... / I plan to...",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'I'd like to change my schedule. I need to pick up my child at 3pm. I want to work mornings instead of evenings.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Use GERUNDS to explain what you prefer and enjoy: I enjoy... / I prefer... / I like...",
      context: "Example: 'I enjoy working with customers. I prefer having weekends off. I like starting early in the morning.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Negotiation: Use both infinitives AND gerunds. What do you WANT TO do vs. What do you ENJOY DOING?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Infinitive (goal): 'I want to work full-time.' Gerund (preference): 'I enjoy working with people.' Mix both in your answer!"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Ask your manager politely: Would you consider...? (gerund) / Would it be possible to...? (infinitive)",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "Gerund: 'Would you consider changing my shift?' Infinitive: 'Would it be possible to work Tuesdays and Thursdays?'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Complex negotiation: Use verbs that take infinitives (decide to, plan to, hope to) AND verbs that take gerunds (avoid, finish, keep, suggest).",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: 'I decided to ask for a schedule change because I need to avoid working Sundays. I hope to keep working here, so I'm suggesting a different shift.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Grammar contrast: Explain what you CAN'T AVOID (gerund) vs. what you NEED TO DO (infinitive).",
      context: "Gerund: 'I can't avoid missing work if my child is sick.' Infinitive: 'I need to find childcare. I want to be reliable.'"
    },
  ],// 

  reflectionPrompt: "When negotiating, which is easier: using infinitives (want to, need to) or gerunds (enjoy -ing, prefer -ing)? Why?",// 
  reflectionMinLength: 35,//  released: false
};
