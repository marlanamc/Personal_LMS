import type { SpeakingActivityContent } from "@/types/activity";

export const wellnessPresentationPractice_2026_05_28: SpeakingActivityContent = {
  type: "speaking",
  title: "5/28/26: Wellness Presentation (Verbs + Gerunds)",
  description: "Practice giving a wellness presentation using verbs + gerunds (enjoy, recommend, suggest, avoid, quit, keep, consider) naturally throughout your talk",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I enjoy... / I love... (gerund)", example: "I enjoy practicing meditation every morning." },
    { phrase: "I recommend / I suggest... (gerund)", example: "I recommend trying yoga. I suggest keeping a sleep journal." },
    { phrase: "I avoid / I quit... (gerund)", example: "I avoid eating late at night. I quit drinking coffee after 2pm." },
    { phrase: "I keep / I continue... (gerund)", example: "I keep tracking my water intake. I continue working on my goals." },
    { phrase: "Consider... (gerund)", example: "Consider starting small. Consider joining a walking group." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Choose a wellness topic and share what you enjoy doing and what you recommend: Use 'enjoy' and 'recommend' + gerund.",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Example: 'I enjoy walking every morning. I recommend trying it for at least 20 minutes. I enjoy listening to music while I walk.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Share what you avoid and what you suggest to others: Use 'avoid' and 'suggest' + gerund.",
      context: "Example: 'I avoid eating late at night. I avoid looking at my phone before bed. I suggest turning off screens one hour before sleep.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Share what you quit or stopped doing and what you keep doing: Use 'quit/stop' and 'keep' + gerund.",
      context: "Example: 'I quit drinking soda two years ago. I stopped eating fast food. I keep drinking water throughout the day. I keep exercising three times a week.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Give advice using 'consider' + gerund: What should people consider trying?",
      context: "Example: 'Consider starting with small changes. Consider tracking your sleep for one week. Consider joining a fitness class.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "1-minute wellness presentation: Use at least 5 different verbs + gerunds (enjoy, recommend, suggest, avoid, quit, keep, consider, finish, continue).",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: 'Today I want to talk about stress management. I enjoy practicing meditation for 10 minutes every morning. I recommend trying breathing exercises when you feel stressed. I avoid checking work emails after 7pm. I quit working through my lunch break. I keep a gratitude journal. Consider starting with just 5 minutes of quiet time each day.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Answer Q&A using verbs + gerunds: Partner asks 3 wellness questions. Answer using verbs + gerunds naturally.",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "Q: 'How did you start this habit?' A: 'I started by doing just 5 minutes. I enjoyed it, so I kept adding more time. I recommend starting small.'"
    },
  ],// 

  reflectionPrompt: "When presenting about wellness, which verbs + gerunds are most useful: enjoy, recommend, suggest, avoid, or keep? Why?",// 
  reflectionMinLength: 35,//  released: false
};
