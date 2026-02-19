import type { SpeakingActivityContent } from "@/types/activity";

export const jobApplicationTalkThrough_2026_03_10: SpeakingActivityContent = {
  type: "speaking",
  title: "3/10/26: Job Application Talk-Through (Present Perfect Continuous)",
  description: "Practice job search language. Focus: present perfect continuous for ongoing activities.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I have been looking for...", example: "I have been looking for a full-time job for three months." },
    { phrase: "I have been working as...", example: "I have been working as a cashier since January." },
    { phrase: "How long have you been...?", example: "How long have you been searching for a job?" },
    { phrase: "I have been applying to...", example: "I have been applying to restaurants and stores every week." },
    { phrase: "I have been trying to...", example: "I have been trying to get an interview at Target." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "How long have you been looking for a job? How long have you been working (if you have a job)?",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Present perfect continuous: 'I have been looking for a job for two months.' or 'I have been working at Market Basket since 2024.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "What have you been doing to find a job? Where have you been applying?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use present perfect continuous: 'I have been checking Indeed every day. I have been applying to CVS, Walgreens, and Stop & Shop.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What skills have you been practicing or learning to get a better job?",
      context: "Present perfect continuous: 'I have been studying English at ESOL class. I have been practicing my computer skills on YouTube.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "If you have a job: How long have you been working there? What have you been doing in that position?",
      context: "Use 'have been + -ing': 'I have been working at Dunkin' for six months. I have been making coffee, cleaning, and helping customers.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "What challenges have you been facing in your job search? What has been difficult?",
      context: "Present perfect continuous: 'I have been having trouble with interviews. I have been getting nervous when they ask questions.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare: What did you do in your last job (past simple) vs. What have you been doing lately to find work (present perfect continuous)?",
      context: "Past simple: 'I worked as a cleaner.' Present perfect continuous: 'I have been looking for office work. I have been taking computer classes.'"
    },
  ],// 

  reflectionPrompt: "How comfortable are you using present perfect continuous (have been + -ing) to talk about your job search? How is it different from present perfect (have worked)?",// 
  reflectionMinLength: 35,//  released: false
};
