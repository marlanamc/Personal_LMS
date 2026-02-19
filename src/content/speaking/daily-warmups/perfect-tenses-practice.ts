import type { SpeakingActivityContent } from "@/types/activity";

export const perfectTensesPracticeDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "2/5/26: Past Continuous vs Past Simple",
  description: "Practice past tenses. Focus: past continuous for background vs past simple for completed actions.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "While I was...", example: "While I was cooking dinner, power went out." },
    { phrase: "When... happened, I was...", example: "When my landlord called, I was sleeping." },
    { phrase: "I was... when...", example: "I was taking a shower when someone knocked on the door." },
    { phrase: "While... was happening, ...", example: "While repair person was fixing heat, I was waiting in kitchen." },
    { phrase: "At 8pm yesterday, I was...", example: "At 8pm yesterday, I was riding the Red Line home from work." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "What were you doing at 7am this morning? At 12pm? At 6pm yesterday?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use past continuous: I was sleeping at 7am. I was eating lunch at 12pm. I was taking the bus at 6pm."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Tell about an interruption: While you were doing something, what happened that stopped you?",
      context: "Example: While I was studying, my friend called. While I was making dinner, I ran out of salt."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Housing problem with background: Tell about a problem at home. What were you doing when you noticed the problem?",
      context: "When + past simple / past continuous: When the heat stopped, I was watching TV. While I was cooking, the stove broke."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "MBTA story: While you were riding the T or bus, what happened? OR: What were you doing when the train/bus arrived?",
      context: "While I was waiting at Park Street, the Green Line came. I was reading when we arrived at my stop."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Describe last night: What were you doing at different times? Did anything interrupt you?",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "At 7pm, I was making dinner. While I was eating, my neighbor knocked. At 9pm, I was doing homework when I got tired."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Complex problem story: Tell about a housing or bill problem. Use at least 3 while/when sentences to give background details.",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: While I was looking at my Eversource bill, I saw a mistake. When I called them, I was very nervous. They were checking my account when the call dropped."
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Two things at once: What were you and your family/roommates doing at the same time last weekend?",
      context: "While I was cleaning, my roommate was cooking. When I finished, she was still washing dishes. We were both working when our friend arrived."
    },
  ],// 

  reflectionPrompt: "What's harder: using while or when correctly, or remembering to use was/were + -ing for the background action?",// 
  reflectionMinLength: 35,//  released: false
};
