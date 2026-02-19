import type { SpeakingActivityContent } from "@/types/activity";

export const classroomBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/6/26: Classroom & School Language",
  description: "Practice asking for help and clarification. Focus: polite classroom phrases.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "Could you please repeat that?", example: "I'm sorry, could you please repeat that?" },
    { phrase: "I don't understand.", example: "I don't understand. Can you explain it again?" },
    { phrase: "Can you say that more slowly?", example: "Excuse me, can you say that more slowly?" },
    { phrase: "How do you spell...?", example: "How do you spell your name?" },
    { phrase: "What does ___ mean?", example: "What does 'assignment' mean?" },
    { phrase: "May I ask a question?", example: "Excuse me, may I ask a question?" },
    { phrase: "I have a question about...", example: "I have a question about homework." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Practice asking your teacher for help. What will you say when you don't understand something?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use phrases like: 'I don't understand', 'Could you repeat that?', 'Can you explain this?'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "You missed class last week. What questions will you ask your teacher or classmates?",
      context: "Think about: What did we do? What's the homework? When is the test?"
    },
    {
      id: "prompt-3",
      level: "beginner",
      text: "You need to leave class early today for an event. What will you tell your teacher?",
      context: "Practice polite explanations: 'I need to leave early today because...' or 'I have an event at...'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "The teacher is speaking too fast and you're confused. What are THREE different ways to ask for clarification?",
      context: "Examples: 'Could you speak more slowly?', 'I'm sorry, I didn't catch that', 'What does that word mean?'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Parts of Speech - Content Words: Describe your classroom using all 4 content words (nouns, verbs, adjectives, adverbs).",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'Students (noun) sit (verb) at comfortable (adjective) desks. They listen (verb) carefully (adverb) to the teacher (noun).'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Parts of Speech Challenge: Make 3 sentences about school. Then identify the parts: circle nouns, underline verbs, highlight adjectives and adverbs.",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Example: 'My teacher explains grammar clearly.' (teacher=noun, explains=verb, grammar=noun, clearly=adverb)"
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Parts of Speech Game: Describe your English learning journey using at least 2 of each content word (2 nouns, 2 verbs, 2 adjectives, 2 adverbs).",
      context: "Track them: I (pronoun) studied (verb) English (noun) slowly (adverb) at first (adverb). Now I speak (verb) more confidently (adverb) in difficult (adjective) conversations (noun)."
    },
  ],  released: false
};
