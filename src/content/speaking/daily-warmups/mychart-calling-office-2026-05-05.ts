import type { SpeakingActivityContent } from "@/types/activity";

export const myChartCallingOffice_2026_05_05: SpeakingActivityContent = {
  type: "speaking",
  title: "5/5/26: MyChart / Calling Office (Reported Speech Intro)",
  description: "Practice reported speech. Focus: reporting messages from MyChart and doctor's office.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "The doctor said (that)...", example: "The doctor said that I need to come back in two weeks." },
    { phrase: "The nurse told me (that)...", example: "The nurse told me that my results are ready." },
    { phrase: "They asked if...", example: "They asked if I had any allergies." },
    { phrase: "The message said (that)...", example: "The MyChart message said that I should schedule a follow-up." },
    { phrase: "She wanted to know...", example: "She wanted to know my date of birth." },
    { phrase: "They asked me to...", example: "They asked me to call back tomorrow." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "MyChart message relay: You got a MyChart message. Tell your partner what the message said using reported speech.",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Example: 'I got a message yesterday. The doctor said that my test results are normal. They told me to schedule a follow-up in 6 months.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Phone call relay: You called the doctor's office. Tell your roommate what they said using reported speech.",
      context: "Example: 'I called the office. The receptionist said that they have an opening on Tuesday. She asked if 2pm works for me.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'said that' and 'told me that': Report what your doctor told you at your last visit.",
      context: "Example: 'The doctor said that I need to take this medicine. She told me that I should rest. She said that I should come back if it gets worse.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'they asked if' and 'they asked me to': Report the questions the nurse asked you.",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "Example: 'They asked if I had any allergies. They asked me to update my insurance information. They asked if I was taking any medications.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Use 'wanted to know': Report what information they requested from you.",
      context: "Example: 'They wanted to know my date of birth. They wanted to know when my symptoms started. They wanted to know if I have a pharmacy preference.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full MyChart/office call conversation using reported speech: Report a complete conversation (what they said, what they told you, what they asked).",
      context: "Example: 'I got a MyChart message. The doctor said that my blood pressure is high. She told me to reduce salt. She asked me to schedule a follow-up. They wanted to know if I'm exercising. The nurse said that they will send a referral.'"
    },
  ],// 

  reflectionPrompt: "When relaying doctor's messages, which is harder: changing 'I' to 'he/she' or changing the verb tense? Why?",// 
  reflectionMinLength: 35,//  released: false
};
