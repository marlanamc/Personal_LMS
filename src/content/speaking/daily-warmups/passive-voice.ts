import type { SpeakingActivityContent } from "@/types/activity";

export const passiveVoiceDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Passive Voice Practice (use after 4/28)",
  description: "Practice passive voice. Focus: when to use passive vs active voice.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "It was built in...", example: "The bridge was built in 1950." },
    { phrase: "I was born in...", example: "I was born in Mexico in 1985." },
    { phrase: "It's made of...", example: "This table is made of wood." },
    { phrase: "The meeting has been canceled.", example: "Unfortunately, the meeting has been canceled." },
    { phrase: "I was told that...", example: "I was told that the office is closed today." },
    { phrase: "The car is being repaired.", example: "My car is being repaired right now." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Where were you born? Where was your hometown founded? Describe some things that were built there.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Practice simple past passive: 'I was born in...' 'The city was founded in...' 'This building was constructed in...'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Describe something that was made or created in your country. What is it made of? How is it made?",
      context: "Use passive to describe processes: 'Coffee is grown in the mountains. The beans are roasted and then ground.'"
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "Tell me about a time something went wrong (a mistake was made, something was forgotten, you were misunderstood).",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: 'My appointment was scheduled for the wrong day' or 'I was given incorrect information.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Describe the hiring process at a job. Use passive voice: 'Applications are reviewed...' 'Candidates are interviewed...'",
      context: "Practice: 'Applications are submitted online. Resumes are screened. Selected candidates are called for interviews.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "What changes have been made in your neighborhood recently? What is being built or renovated?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Present perfect passive: 'A new park has been created' or Present continuous passive: 'The road is being repaired.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "By next year, what will have been accomplished in your community or workplace?",
      context: "Future perfect passive: 'By next summer, the new school will have been built' or 'The project will have been completed.'"
    },
  ],// 

  reflectionPrompt: "When is passive voice useful? Give an example from your own life where you would use passive voice.",// 
  reflectionMinLength: 40,//  released: false
};
