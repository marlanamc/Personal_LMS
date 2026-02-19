import type { SpeakingActivityContent } from "@/types/activity";

export const healthcareBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "4/14/26: Healthcare & Doctor Visits (Advice Modals)",
  description: "Practice advice modals. Focus: should/shouldn't, must/have to, need to for health advice.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "You should...", example: "You should see a doctor if you have a high fever." },
    { phrase: "You shouldn't...", example: "You shouldn't go to work if you're contagious." },
    { phrase: "You must / have to...", example: "You must take antibiotic three times a day." },
    { phrase: "You need to...", example: "You need to schedule a follow-up appointment." },
    { phrase: "I should have...", example: "I should have called doctor sooner." },
    { phrase: "Do I have to...?", example: "Do I have to fast before blood test?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Give 3 pieces of health advice using should/shouldn't. What should people do when they feel sick?",
      context: "Examples: You should drink water. You should rest. You shouldn't go to work. You shouldn't ignore a high fever.",
      soloInstructions: "List 3 pieces of health advice using should/shouldn't and practice saying them with key phrases",
      partnerInstructions: "Partner A: Give health advice for 2 minutes. Partner B: Ask follow-up questions about the advice."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Doctor's instructions: The doctor says you have a cold. What must you do? What should you do? What shouldn't you do?",
      context: "Use: I must take medicine. I should rest. I shouldn't exercise. I have to stay home for 3 days.",
      soloInstructions: "Write down doctor's instructions using modals (must, should, shouldn't) and practice reading them aloud",
      partnerInstructions: "Role-play: One is doctor giving instructions, one is patient asking questions about the treatment."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Emergency room advice: Your friend has a bad cut. Give them advice using modals. When should they go to the ER? What do they have to bring?",
      context: "You should go to the emergency room immediately. You must bring your insurance card. You need to apply pressure to stop the bleeding.",
      soloInstructions: "Think through emergency advice: When to go to ER? What to bring? Practice saying it with key phrases",
      partnerInstructions: "Partner A: Describe an injury and ask for advice. Partner B: Give detailed emergency advice using modals."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Medication instructions: The doctor prescribed medicine. Explain what you have to do, what you should do, and what you must not do.",
      context: "I have to take it twice a day. I should take it with food. I must not drink alcohol. I need to finish all the pills.",
      soloInstructions: "List medication instructions using different modals and practice explaining them clearly",
      partnerInstructions: "Role-play: One is pharmacist explaining medication, one is patient asking questions about how to take it."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Preventive health: What should people do to stay healthy? What do they have to do every year? What shouldn't they do?",
      context: "You should exercise 3 times a week. You have to get a flu shot every year. You must see a dentist twice a year. You shouldn't eat too much sugar.",
      soloInstructions: "List preventive health advice using should/shouldn't and have to/must for regular checkups",
      partnerInstructions: "Take turns: Each person gives 3 pieces of preventive health advice, then discuss why it's important."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Past regret (should have): Think about a time you were sick. What should you have done differently? What shouldn't you have done?",
      context: "I should have called the doctor sooner. I should have rested more. I shouldn't have gone to work. I should have taken the medicine on time.",
      soloInstructions: "Think about a past illness: What should you have done differently? Write 3 should have/shouldn't have sentences",
      partnerInstructions: "Share a past health experience: 'I should have...' statements, then partner gives advice for what to do now."
    },
  ],
};
