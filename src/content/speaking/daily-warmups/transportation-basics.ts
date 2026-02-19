import type { SpeakingActivityContent } from "@/types/activity";

export const transportationBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "3/3/26: Transportation & Getting Around",
  description: "Practice transportation vocabulary. Focus: present perfect for experiences and future perfect for goals.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "How do you get to...?", example: "How do you get to work every day?" },
    { phrase: "I usually take...", example: "I usually take the bus to school." },
    { phrase: "I've never been to...", example: "I've never been to that neighborhood before." },
    { phrase: "How long does it take?", example: "How long does it take to get there?" },
    { phrase: "By next year, I will have...", example: "By next year, I will have learned to drive." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "How do you get to work or school? Describe your daily commute.",
      context: "Talk about what transportation you use and how long it takes.",
      soloInstructions: "Think through your daily commute: What transportation do you use? How long does it take? Practice saying it with key phrases",
      partnerInstructions: "Partner A: Describe your commute (2 min). Partner B: Ask questions about their transportation routine."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Describe your neighborhood. What places can you walk to?",
      soloInstructions: "List places you can walk to in your neighborhood and practice saying 'I usually walk to...'",
      partnerInstructions: "Take turns describing neighborhoods: What can you walk to? What do you need transportation for?"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Using present perfect: What places in your city have you visited? What places haven't you been to yet?",
      context: "Practice: 'I have been to the library many times, but I haven't visited the museum yet.'",
      soloInstructions: "List places you've been to and haven't been to using present perfect tense",
      partnerInstructions: "Partner A: Share 3 places you've visited with present perfect. Partner B: Ask about places they haven't been."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Using past perfect: Tell me about a time you got lost. Where had you been trying to go? What had happened?",
      context: "Example: 'I had been looking for the post office when I realized I had taken the wrong bus.'",
      soloInstructions: "Think of a time you got lost: Use past perfect to explain what had happened before getting lost",
      partnerInstructions: "Share 'getting lost' stories: Use past perfect to explain the sequence of events that led to getting lost."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Using future perfect: By this time next year, what transportation skills will you have learned or improved?",
      context: "Example: 'By next December, I will have gotten my driver's license and bought a car.'",
      soloInstructions: "Think about transportation goals: What skills will you have learned by next year? Write future perfect sentences",
      partnerInstructions: "Discuss transportation goals: By when will you have learned to drive? Gotten a license? Bought a car?"
    },
  ],  released: false
};
