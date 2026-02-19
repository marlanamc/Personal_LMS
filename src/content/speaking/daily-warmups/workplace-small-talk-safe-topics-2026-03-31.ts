import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceSmallTalkSafeTopics_2026_03_31: SpeakingActivityContent = {
  type: "speaking",
  title: "3/31/26: Workplace Small Talk (Phrasal Verbs)",
  description: "Practice workplace small talk using common phrasal verbs (show up, catch up, get along with, run into, look forward to, wrap up)",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "catch up", example: "It's nice to catch up with you! We should catch up more often." },
    { phrase: "show up", example: "What time did you show up today? I showed up early." },
    { phrase: "get along with", example: "Do you get along with everyone on your team?" },
    { phrase: "run into", example: "I ran into Maria at the coffee shop yesterday." },
    { phrase: "look forward to", example: "I'm looking forward to the long weekend!" },
    { phrase: "get back to (work)", example: "I should get back to work. Talk later!" },
    { phrase: "hang out", example: "Do you ever hang out with coworkers after work?" },
    { phrase: "work out (exercise)", example: "I try to work out after work. Do you work out?" },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Use 'catch up' and 'show up' in small talk: Talk about arriving at work and catching up with a coworker.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'Hi! What time did you show up today? I showed up at 8. It's nice to catch up with you—we're both always so busy!'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Use 'get along with' and 'hang out': Ask about workplace relationships and socializing.",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "Example: 'Do you get along with everyone on your team? Do you ever hang out with coworkers after work?'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'run into' and 'look forward to': Talk about unexpected meetings and upcoming plans.",
      context: "Example: 'I ran into Sarah at Market Basket yesterday! Are you looking forward to the weekend? I'm looking forward to sleeping in!'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'work out' (exercise) and 'get back to' (return to work): Talk about exercise habits and end the conversation.",
      context: "Example: 'Do you work out after work? I try to work out three times a week. Anyway, I should get back to work. Talk later!'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Full small talk conversation: Use at least 4 different phrasal verbs (show up, catch up, get along with, run into, look forward to, hang out, work out, get back to).",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: 'Hey! What time did you show up? I got here early. Do you get along with the new manager? I ran into him at Dunkin' yesterday. Anyway, I should get back to work. Let's catch up more later!'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Phrasal verbs in context: Use 'figure out' (solve/understand), 'come up' (be mentioned), 'fill in for' (replace someone).",
      context: "Example: 'Did you figure out the new schedule? My name didn't come up on the list. Can you fill in for me on Thursday?'"
    },
  ],// 

  reflectionPrompt: "Which phrasal verb is most useful for workplace small talk? Which one is hardest to remember?",// 
  reflectionMinLength: 35,//  released: false
};
