import type { SpeakingActivityContent } from "@/types/activity";

export const pharmacyInstructions_2026_04_30: SpeakingActivityContent = {
  type: "speaking",
  title: "4/30/26: Pharmacy Instructions (Passive Voice)",
  description: "Practice pharmacy instructions. Focus: passive voice for medication instructions and procedures.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "This medicine is taken...", example: "This medicine is taken with food." },
    { phrase: "It should be stored...", example: "It should be stored in a cool, dry place." },
    { phrase: "The prescription is refilled...", example: "The prescription is refilled every 30 days." },
    { phrase: "You are advised to...", example: "You are advised to avoid alcohol." },
    { phrase: "Side effects may be experienced.", example: "Drowsiness may be experienced. Nausea may be felt." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Explain medicine instructions using passive voice: 'is taken', 'should be stored'.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'This medicine is taken twice a day. It is taken with food. It should be stored in the refrigerator.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Use passive voice to explain what a medicine is prescribed for: 'is prescribed for...'",
      context: "Example: 'This medicine is prescribed for high blood pressure. It is prescribed for pain. It is prescribed for infections.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use passive voice for pharmacy procedures: 'is refilled', 'is picked up', 'is ready'.",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: 'The prescription is refilled every month. It is picked up at the pharmacy. It is ready in 15 minutes.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use passive voice for warnings and advice: 'You are advised to...', 'You are warned about...'",
    soloInstructions: "Read the scenario and think about what you would say in this situation",
    partnerInstructions: "Role-play the scenario: Take turns being different characters",
      context: "Example: 'You are advised to take this with food. You are advised to avoid alcohol. You are warned about drowsiness.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Use passive voice for side effects: 'may be experienced', 'can be felt'.",
      context: "Example: 'Drowsiness may be experienced. Nausea may be experienced. Dizziness can be felt.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full pharmacy conversation using passive voice: Explain medicine instructions, storage, warnings, and refills.",
      context: "Example: 'This antibiotic is taken three times a day. It is taken with food. It should be stored at room temperature. You are advised to finish all the pills. The prescription is refilled at your doctor's office.'"
    },
  ],// 

  reflectionPrompt: "Why is passive voice useful for pharmacy instructions? How is it different from active voice?",// 
  reflectionMinLength: 35,//  released: false
};
