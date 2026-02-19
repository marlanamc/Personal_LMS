import type { SpeakingActivityContent } from "@/types/activity";

export const reportedSpeechDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Reported Speech Practice (use after 5/5)",
  description: "Practice using reported speech (he said, she told me, they asked) to relay information and conversations - use after reported speech is taught on 5/5",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "He/She said (that)...", example: "The doctor said that I need to rest." },
    { phrase: "He/She told me (that)...", example: "My landlord told me that the rent will increase." },
    { phrase: "He/She asked if...", example: "The nurse asked if I had any allergies." },
    { phrase: "He/She asked me to...", example: "My boss asked me to work overtime." },
    { phrase: "He/She wanted to know...", example: "The pharmacist wanted to know my date of birth." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Doctor visit: Tell me what the doctor said during your last appointment. What did they tell you to do?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use reported speech: The doctor said that I have high blood pressure. She told me to eat less salt. She asked if I exercise regularly."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Workplace message: Your boss called you. Relay the message to your coworker. What did your boss say?",
      context: "Example: My boss called. He said that we have a meeting tomorrow. He told me to bring my notes. He asked if I finished the report."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "MyChart message: You received a message from your doctor's office through MyChart. What did they say? What did they ask you to do?",
      context: "They said that my test results are ready. They told me to schedule a follow-up. They asked me to call if I have questions."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Phone call relay: You called your landlord about a repair. Tell your roommate what the landlord said.",
      context: "Reported speech: I called the landlord. He said that he will send someone tomorrow. He told me to be home between 9-12. He asked if the problem is urgent."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Job interview: Tell me about your last job interview. What did the interviewer ask? What did you say? What did they tell you?",
      context: "They asked me about my experience. I told them that I had worked in retail for three years. They said that they would call me within a week."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Tense changes: Your friend gave you advice yesterday. Report what they said, changing the tenses correctly.",
      context: "Direct: 'You should see a doctor. It might be serious.' Reported: She said that I should see a doctor. She said it might be serious."
    },
  ],// 

  reflectionPrompt: "When using reported speech, what's most challenging: changing 'I' to 'he/she', changing the tense, or remembering when to use 'said' vs 'told'?",// 
  reflectionMinLength: 35,//  released: false
};
