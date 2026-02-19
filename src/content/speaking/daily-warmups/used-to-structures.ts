import type { SpeakingActivityContent } from "@/types/activity";

export const usedToStructuresDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "4/9/26: Used To / Be Used To / Get Used To",
  description: "Practice used to structures. Focus: past habits vs current comfort vs ongoing adjustment.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I used to...", example: "I used to live in Mexico, but now I live here." },
    { phrase: "I'm (not) used to...", example: "I'm not used to waking up early for work." },
    { phrase: "I'm getting used to...", example: "I'm getting used to the cold weather here." },
    { phrase: "I can't get used to...", example: "I can't get used to the traffic patterns." },
    { phrase: "It used to be...", example: "It used to be difficult to find affordable housing." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "advanced",
      text: "USED TO (past habit): What did you use to do in your home country that you don't do anymore? What didn't you use to do?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Example: 'I used to walk to work every day, but now I take the bus' or 'I didn't use to speak English, but now I do.'"
    },
    {
      id: "prompt-2",
      level: "advanced",
      text: "BE USED TO (accustomed): What are you used to doing now in the U.S.? What are you NOT used to yet?",
      context: "Example: 'I'm used to the food here now' or 'I'm not used to the traffic yet' (followed by noun or -ing)"
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "GET USED TO (becoming accustomed): What are you getting used to? What was hard to get used to when you first arrived?",
      context: "Example: 'I'm getting used to speaking English every day' or 'It was hard to get used to driving on the right side.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "GET TO (have opportunity): What do you get to do this weekend? What do you get to do at your job that you enjoy?",
      context: "Example: 'I get to spend time with my kids' or 'I get to help customers' (get to = have the privilege/opportunity)"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Compare USED TO and BE USED TO: What did you use to eat for breakfast? Are you used to American breakfast now?",
      context: "Notice: 'I used to eat rice for breakfast' (past habit) vs 'I'm used to eating cereal now' (accustomed to current habit)"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Complete these sentences: 'Before I came here, I used to...' 'Now I'm used to...' 'I'm still getting used to...'",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Show the progression: past habit → current comfort → ongoing adjustment. Example: 'I used to speak Spanish all day. Now I'm used to speaking English at work. I'm still getting used to English idioms.'"
    },
  ],// 

  reflectionPrompt: "Which structure is most confusing: used to, be used to, or get used to? Explain the difference in your own words.",// 
  reflectionMinLength: 50,//  released: false
};
