import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceAdvocacyRoleplays_2026_03_26: SpeakingActivityContent = {
  type: "speaking",
  title: "3/26/26: Workplace Advocacy Role-Plays (Infinitives vs Gerunds)",
  description: "Practice workplace advocacy conversations using infinitives (want to, need to, plan to) and gerunds (enjoy -ing, avoid -ing, consider -ing)",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I'd like to... (infinitive)", example: "I'd like to discuss my schedule." },
    { phrase: "I need to / I want to... (infinitive)", example: "I need to understand the policy. I want to resolve this issue." },
    { phrase: "Would you consider...? (gerund)", example: "Would you consider changing my shift?" },
    { phrase: "I enjoy... but I need to... (gerund + infinitive)", example: "I enjoy working here, but I need to have consistent hours." },
    { phrase: "I plan to / I agree to... (infinitive)", example: "I plan to document everything. I agree to follow the new policy." },
    { phrase: "I suggest / I recommend... (gerund)", example: "I suggest meeting weekly to discuss this." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Role-play: Employee explains a workplace problem using INFINITIVES (I need to..., I want to..., I'd like to...).",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'I'd like to talk about my schedule. I need to pick up my child at 3pm every day. I want to find a solution that works for both of us.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Role-play: Manager asks politely 'Would you consider...?' (gerund). Employee responds using infinitives OR gerunds.",
    soloInstructions: "Read the scenario and think about what you would say in this situation",
    partnerInstructions: "Role-play the scenario: Take turns being different characters",
      context: "Manager: 'Would you consider working weekends?' Employee: 'I prefer having weekends off (gerund), but I'm willing to work Saturdays (infinitive).'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Mix infinitives and gerunds: What do you ENJOY doing at work (gerund) vs. What do you NEED TO change (infinitive)?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Gerund: 'I enjoy working with customers.' Infinitive: 'But I need to have consistent breaks.' Use both in your answer!"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use verbs that take gerunds: suggest, recommend, avoid, consider. Example: 'I suggest meeting weekly' or 'I recommend reviewing the policy.'",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Practice: 'I suggest changing the schedule.' / 'Would you consider giving me more notice?' / 'I want to avoid working alone at night.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Full advocacy roleplay: Use BOTH infinitives (plan to, agree to, decide to) AND gerunds (suggest, avoid, keep) in one conversation.",
      context: "Example: 'I'd like to discuss my hours. I enjoy working here (gerund), but I need to have a set schedule (infinitive). Would you consider giving me consistent shifts? (gerund) I plan to stay long-term (infinitive) if we can resolve this.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Document the agreement: Say what you AGREED TO do (infinitive) vs. what you will KEEP DOING or AVOID DOING (gerunds).",
      context: "Infinitives: 'I agreed to work Tuesday and Thursday. I decided to request written schedules.' Gerunds: 'I will keep documenting my hours. I will avoid missing shifts.'"
    },
  ],// 

  reflectionPrompt: "When advocating for yourself at work, which grammar is more useful: infinitives (I need to, I want to) or gerunds (I enjoy, I prefer)? Why?",// 
  reflectionMinLength: 35,//  released: false
};
