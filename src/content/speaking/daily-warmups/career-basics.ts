import type { SpeakingActivityContent } from "@/types/activity";

export const careerBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "2/24/26: Resume & Cover Letter Basics",
  description: "Practice resume and cover letter language. Focus: describing skills and experience clearly.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I'm looking for a job in...", example: "I'm looking for a job in healthcare." },
    { phrase: "I have experience in...", example: "I have experience in customer service." },
    { phrase: "My goal is to...", example: "My goal is to become a manager." },
    { phrase: "I've been working as...", example: "I've been working as a cashier for two years." },
    { phrase: "What are your strengths?", example: "What are your strengths and weaknesses?" },
    { phrase: "I'm interested in learning...", example: "I'm interested in learning new skills." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Resume section practice: What is your most recent job? What were your main responsibilities?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use 3 bullet-style sentences: 'I worked as...' 'I was responsible for...' 'I helped...'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Skills talk: Name 3 skills you have for a job and give one example for each.",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Examples: teamwork, reliability, customer service, patience, problem-solving."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Cover letter language: Why do you want this job? Why are you a good fit?",
      context: "Use: I'm interested in..., I have experience in..., I enjoy..., I’m reliable because..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Resume gaps/challenges: What challenges have you faced in finding work? What is one solution you tried?",
      context: "Examples: language, schedule, childcare, transportation, credentials."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Tell a success story: Describe a time you solved a problem at work. What happened and what was the result?",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Use: At first..., then..., so..., as a result..."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Short elevator pitch (30 seconds): Introduce yourself for a job, including experience + a strength + your goal.",
      context: "End with a question: 'Could you tell me more about the schedule/training/next steps?'"
    },
  ],// 

  reflectionPrompt: "What career topic was easiest to talk about? What was most difficult? Why?",// 
  reflectionMinLength: 30,//  released: false
};
