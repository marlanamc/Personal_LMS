import type { SpeakingActivityContent } from "@/types/activity";

export const symptomsDuration_2026_04_16: SpeakingActivityContent = {
  type: "speaking",
  title: "4/16/26: Symptoms + Advice (Advice Modals)",
  description: "Practice describing symptoms and giving/receiving health advice using modals (should, shouldn't, must, have to, need to)",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "You should...", example: "You should see a doctor if you have a high fever." },
    { phrase: "You shouldn't...", example: "You shouldn't go to work if you're contagious." },
    { phrase: "You must / have to...", example: "You must take the medicine three times a day. You have to rest." },
    { phrase: "You need to...", example: "You need to drink more water. You need to make an appointment." },
    { phrase: "You could...", example: "You could try taking ibuprofen. You could call the doctor's office." },
    { phrase: "It might be...", example: "It might be a cold. It might be serious—you should get checked." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Give advice using 'should' and 'shouldn't': If someone has a headache, what should they do? What shouldn't they do?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "You should rest. You should drink water. You shouldn't look at screens. You shouldn't skip meals."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Give advice using 'need to': If someone has a fever, what do they need to do?",
      context: "You need to take your temperature. You need to rest. You need to call the doctor if it's over 103°F."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'must' and 'have to' for strong advice: What must you do if you have a serious symptom?",
      context: "You must see a doctor immediately. You have to go to the emergency room. You must take the medicine exactly as prescribed."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'could' for suggestions: If someone has a cold, what could they try?",
      context: "You could drink tea with honey. You could take vitamin C. You could rest for a few days. You could try over-the-counter medicine."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Roleplay: Partner describes a symptom → You give 3 pieces of advice using different modals (should, need to, could).",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'I have a bad cough.' → 'You should rest. You need to drink lots of water. You could try cough medicine.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare modals: When do you use 'should' vs 'must' vs 'could'? Give examples for each with health advice.",
      context: "'Should' = recommendation. 'Must/have to' = necessary/required. 'Could' = suggestion/possibility. Example: 'You should rest' (advice) vs 'You must take this medicine' (required) vs 'You could try tea' (suggestion).'"
    },
  ],// 

  reflectionPrompt: "Which advice modal is most useful in health situations: should, must, have to, need to, or could? Why?",// 
  reflectionMinLength: 35,//  released: false
};
