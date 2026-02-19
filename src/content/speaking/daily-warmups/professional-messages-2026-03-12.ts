import type { SpeakingActivityContent } from "@/types/activity";

export const professionalMessages_2026_03_12: SpeakingActivityContent = {
  type: "speaking",
  title: "3/12/26: Career Path Stories (Past Perfect Continuous)",
  description: "Practice career storytelling. Focus: past perfect continuous for career journey narration.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I had been working as...", example: "I had been working as a cleaner for three years when I got a new job." },
    { phrase: "I had been looking for...", example: "I had been looking for a better job for six months before I found this one." },
    { phrase: "I had been trying to...", example: "I had been trying to learn English before I came to the U.S." },
    { phrase: "Before I..., I had been...", example: "Before I moved to Boston, I had been studying computer programming." },
    { phrase: "How long had you been...?", example: "How long had you been working there before you quit?" },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Tell your job history: How long had you been working at your last job before you left or changed jobs?",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Past perfect continuous: 'I had been working at a restaurant for two years before I found my current job.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Before you got your current job (or before you came to the U.S.), what had you been doing for work?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use 'had been + -ing': 'I had been working as a teacher in my country. I had been teaching elementary school for five years.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Tell a job search story: How long had you been looking for work before you got an interview? What had you been doing to prepare?",
      context: "Past perfect continuous: 'I had been applying to jobs for three months before I got my first interview. I had been practicing my English every day.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Explain a career change: What had you been doing before you decided to change careers or look for a different type of job?",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'I had been working in construction, but I had been feeling tired every day. So I decided to look for office work.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Before you started ESOL classes, how long had you been trying to improve your English? What had you been doing to learn?",
      context: "Past perfect continuous: 'I had been watching YouTube videos for a year. I had been asking my coworkers to teach me new words.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare present perfect continuous (ongoing now) and past perfect continuous (was ongoing before): What have you been doing vs. what had you been doing before a specific change?",
      context: "Present perfect continuous: 'I have been working at Target since January.' Past perfect continuous: 'Before that, I had been working at Walmart for three years.'"
    },
  ],// 

  reflectionPrompt: "How comfortable are you using past perfect continuous (had been + -ing) to tell your career story? How is it different from past perfect (had worked)?",// 
  reflectionMinLength: 35,//  released: false
};
