import { InteractiveGuideContent } from "@/types/activity";

export const gerundsInfinitivesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "Gerunds & Infinitives: The -ING vs TO Choice",
      icon: "🔄",
      explanation: `
        <div style="background: linear-gradient(135deg, rgba(217, 119, 87, 0.1) 0%, rgba(3, 105, 161, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
          <h3 style="margin-top: 0; color: #d97757; font-size: 1.25rem;">🎯 The Big Idea</h3>
          <p style="font-size: 1.05rem; margin-bottom: 0;">English verbs can act like nouns, but you must choose: add <strong style="color: #d97757;">-ING</strong> (gerund) or add <strong style="color: #0369a1;">TO</strong> (infinitive). The secret? <strong>Look at what comes BEFORE the verb</strong>. That tells you which form to use!</p>
        </div>

        <p><strong>What You'll Learn:</strong></p>
        <ul>
          <li><strong>Pattern 1:</strong> Subject = Gerund → "Swimming is fun"</li>
          <li><strong>Pattern 2:</strong> Verb + Gerund → "I enjoy reading"</li>
          <li><strong>Pattern 3:</strong> Preposition + Gerund → "I'm interested in learning Spanish"</li>
          <li><strong>Pattern 4:</strong> Adjective + Infinitive → "I'm happy to help"</li>
          <li><strong>Pattern 5:</strong> Noun + Infinitive → "The ability to speak three languages"</li>
          <li><strong>Pattern 6:</strong> Verb + Infinitive → "I want to travel"</li>
          <li><strong>Special Cases:</strong> Verbs that take BOTH (stop, remember, try) with meaning changes</li>
        </ul>

        <div style="background: rgba(3, 105, 161, 0.1); border-left: 4px solid #0369a1; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
          <h3 style="color: #0369a1; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
          <p style="margin-bottom: 0.5rem;"><strong>In daily life:</strong></p>
          <ul style="margin: 0.5rem 0 0 0;">
            <li>Talking about hobbies and interests</li>
            <li>Making plans and setting goals</li>
            <li>Expressing feelings and preferences</li>
            <li>Giving thanks and showing appreciation</li>
          </ul>
          <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 The pattern BEFORE the verb tells you which form to use!</p>
        </div>
      `,
    },
    {
      id: "definitions",
      stepNumber: 1,
      title: "Quick Definitions",
      icon: "📖",
      explanation: `
        <h3>What is a Gerund?</h3>
        <p>A <strong>gerund</strong> is a verb + -ing that acts as a noun.</p>
        <p><strong>Formula:</strong> <span style="background-color: #fed7aa; color: #d97757; padding: 5px 10px; border-radius: 4px; font-weight: 600;"><strong>verb + -ing</strong></span></p>

        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2);">
          <p><strong>Everyday Examples:</strong></p>
          <ul>
            <li><strong>Swimming</strong> is my favorite exercise.</li>
            <li>I enjoy <strong>reading</strong> mystery novels.</li>
            <li>I'm interested in <strong>learning</strong> French.</li>
          </ul>
        </div>

        <h3>What is an Infinitive?</h3>
        <p>An <strong>infinitive</strong> is "to" + base verb.</p>
        <p><strong>Formula:</strong> <span style="background-color: #bae6fd; color: #0369a1; padding: 5px 10px; border-radius: 4px; font-weight: 600;"><strong>to + verb</strong></span></p>

        <div style="background-color: rgba(3, 105, 161, 0.05); padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid rgba(3, 105, 161, 0.2);">
          <p><strong>Everyday Examples:</strong></p>
          <ul>
            <li>I'm happy <strong>to help</strong> you.</li>
            <li>I have the ability <strong>to speak</strong> three languages.</li>
            <li>I want <strong>to visit</strong> Japan someday.</li>
          </ul>
        </div>

        <div style="background-color: #fff3cd; border-left: 4px solid #f4d35e; padding: 15px; margin: 20px 0;">
          <p><strong>💡 Key Point:</strong> Both gerunds and infinitives are verb forms used as nouns, but they follow different rules depending on what comes before them.</p>
        </div>
      `,
    },
    {
      id: "pattern-1",
      stepNumber: 2,
      title: "Pattern 1: Subject = Gerund",
      icon: "1️⃣",
      explanation: `
        <p>When a verb is the <strong>subject</strong> of a sentence, use the <strong>gerund (-ing)</strong> form.</p>

        <p><strong>Formula:</strong> <span style="background-color: #fed7aa; color: #d97757; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Gerund + verb + ...</strong></span></p>

        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2);">
          <h4>Sports & Exercise:</h4>
          <ul>
            <li><strong>Swimming</strong> is excellent exercise.</li>
            <li><strong>Running</strong> every morning keeps you healthy.</li>
            <li><strong>Dancing</strong> is a fun way to stay active.</li>
          </ul>

          <h4>Hobbies & Interests:</h4>
          <ul>
            <li><strong>Reading</strong> helps you improve your English.</li>
            <li><strong>Cooking</strong> at home saves money.</li>
            <li><strong>Traveling</strong> teaches you about other cultures.</li>
            <li><strong>Painting</strong> is very relaxing.</li>
          </ul>

          <h4>Daily Life:</h4>
          <ul>
            <li><strong>Learning</strong> a new language takes time.</li>
            <li><strong>Saving</strong> money is important for the future.</li>
            <li><strong>Finding</strong> a good apartment in Boston can be challenging.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "When the verb is the subject (the main topic), it must be a gerund, not an infinitive. ✅ Swimming is fun. ❌ To swim is fun. (less common)"
      },
      exercises: [
        {
          id: "pattern-1-exercise",
          title: "Practice: Using Gerunds as Subjects",
          instructions: "Choose the correct form to complete each sentence.",
          items: [
            {
              type: "select",
              label: "___ a new language takes practice and patience.",
              options: ["Learning", "To learn", "Learn"],
              expectedAnswer: "Learning"
            },
            {
              type: "select",
              label: "___ is my favorite hobby.",
              options: ["Reading", "To read", "Read"],
              expectedAnswer: "Reading"
            },
            {
              type: "select",
              label: "___ helps you stay healthy.",
              options: ["Exercising", "To exercise", "Exercise"],
              expectedAnswer: "Exercising"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-2",
      stepNumber: 3,
      title: "Pattern 2: Verb + Gerund",
      icon: "2️⃣",
      explanation: `
        <p>Certain verbs are always followed by <strong>gerunds (-ing)</strong>, never infinitives.</p>

        <p><strong>Formula:</strong> <span style="background-color: #fed7aa; color: #d97757; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Subject + Verb + Gerund</strong></span></p>

        <h3>Common Verbs + Gerund</h3>

        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2);">
          <h4>Preferences & Enjoyment:</h4>
          <ul>
            <li><strong>enjoy:</strong> I enjoy <strong>reading</strong> mystery novels.</li>
            <li><strong>like:</strong> I like <strong>cooking</strong> new recipes.</li>
            <li><strong>love:</strong> She loves <strong>listening</strong> to music.</li>
            <li><strong>prefer:</strong> I prefer <strong>walking</strong> to driving.</li>
          </ul>

          <h4>Actions & Completion:</h4>
          <ul>
            <li><strong>finish:</strong> I finished <strong>cleaning</strong> the house yesterday.</li>
            <li><strong>keep:</strong> Keep <strong>practicing</strong> your English!</li>
            <li><strong>stop:</strong> I stopped <strong>drinking</strong> coffee at night. (I quit)</li>
            <li><strong>quit:</strong> She quit <strong>smoking</strong> last year.</li>
          </ul>

          <h4>Avoidance:</h4>
          <ul>
            <li><strong>avoid:</strong> I avoid <strong>eating</strong> too much sugar.</li>
            <li><strong>miss:</strong> I miss <strong>spending</strong> time with my family.</li>
          </ul>

          <h4>Consideration & Advice:</h4>
          <ul>
            <li><strong>consider:</strong> I'm considering <strong>moving</strong> to a bigger apartment.</li>
            <li><strong>suggest:</strong> I suggest <strong>taking</strong> the train instead of driving.</li>
            <li><strong>recommend:</strong> I recommend <strong>visiting</strong> the museum on weekdays.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "These verbs ALWAYS take gerunds, never infinitives. ✅ I enjoy swimming. ❌ I enjoy to swim."
      },
      exercises: [
        {
          id: "pattern-2-exercise",
          title: "Practice: Verbs + Gerunds",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I finished ___ the book last night.",
              options: ["reading", "to read", "read"],
              expectedAnswer: "reading"
            },
            {
              type: "select",
              label: "I suggest ___ the museum on Saturday.",
              options: ["visiting", "to visit", "visit"],
              expectedAnswer: "visiting"
            },
            {
              type: "select",
              label: "She loves ___ to music while she works.",
              options: ["listening", "to listen", "listen"],
              expectedAnswer: "listening"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-3",
      stepNumber: 4,
      title: "Pattern 3: Preposition + Gerund (CRITICAL RULE!)",
      icon: "3️⃣",
      explanation: `
        <p><strong>Golden Rule:</strong> After a preposition, ALWAYS use a <strong>gerund (-ing)</strong>, never an infinitive.</p>

        <p><strong>Formula:</strong> <span style="background-color: #fed7aa; color: #d97757; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Preposition + Gerund</strong></span></p>

        <div style="background-color: #ffe6e6; border: 2px solid #d97757; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p><strong>⚠️ CRITICAL RULE:</strong> After a preposition → ALWAYS gerund</p>
          <p>✅ I'm interested <strong>in learning</strong> French.<br>
          ❌ I'm interested <strong>in to learn</strong> French.</p>
        </div>

        <h3>Common Preposition + Gerund Patterns</h3>

        <div style="background-color: rgba(217, 119, 87, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(217, 119, 87, 0.2);">
          <h4>Adjective + Preposition + Gerund:</h4>
          <ul>
            <li><strong>interested in:</strong> I'm interested in <strong>learning</strong> to play guitar.</li>
            <li><strong>good at:</strong> She's good at <strong>solving</strong> puzzles.</li>
            <li><strong>worried about:</strong> I'm worried about <strong>forgetting</strong> my password.</li>
            <li><strong>excited about:</strong> We're excited about <strong>visiting</strong> New York.</li>
            <li><strong>tired of:</strong> I'm tired of <strong>waiting</strong> in line.</li>
            <li><strong>afraid of:</strong> She's afraid of <strong>flying</strong>.</li>
          </ul>

          <h4>Common Phrases with Prepositions:</h4>
          <ul>
            <li><strong>thank you for:</strong> Thank you for <strong>helping</strong> me.</li>
            <li><strong>look forward to:</strong> I look forward to <strong>seeing</strong> you. (to = preposition here!)</li>
            <li><strong>by:</strong> I improved my English <strong>by reading</strong> every day.</li>
            <li><strong>instead of:</strong> Let's walk <strong>instead of driving</strong>.</li>
          </ul>

          <h4>Time Prepositions:</h4>
          <ul>
            <li><strong>before:</strong> Wash your hands <strong>before eating</strong>.</li>
            <li><strong>after:</strong> I'll call you <strong>after finishing</strong> my homework.</li>
            <li><strong>without:</strong> She left <strong>without saying</strong> goodbye.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Common Mistake Alert",
        content: "'to' can be BOTH an infinitive marker AND a preposition! As infinitive marker: I want to learn. As preposition: I look forward to learning. Other examples with 'to' as preposition: be used to, be accustomed to, object to"
      },
      exercises: [
        {
          id: "pattern-3-exercise",
          title: "Practice: Preposition + Gerund",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "Thank you for ___ me with my homework.",
              options: ["helping", "to help", "help"],
              expectedAnswer: "helping"
            },
            {
              type: "select",
              label: "I'm interested in ___ more about Italian culture.",
              options: ["learning", "to learn", "learn"],
              expectedAnswer: "learning"
            },
            {
              type: "select",
              label: "I look forward to ___ you next week.",
              options: ["seeing", "to see", "see"],
              expectedAnswer: "seeing"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-4",
      stepNumber: 5,
      title: "Pattern 4: Adjective + Infinitive",
      icon: "4️⃣",
      explanation: `
        <p>After certain adjectives, use the <strong>infinitive (to + verb)</strong>.</p>

        <p><strong>Formula:</strong> <span style="background-color: #bae6fd; color: #0369a1; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Adjective + to + Verb</strong></span></p>

        <div style="background-color: rgba(3, 105, 161, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(3, 105, 161, 0.2);">
          <h4>Feelings & Emotions:</h4>
          <ul>
            <li><strong>happy:</strong> I'm happy <strong>to help</strong> you.</li>
            <li><strong>excited:</strong> I'm excited <strong>to travel</strong> to Paris.</li>
            <li><strong>glad:</strong> I'm glad <strong>to meet</strong> you.</li>
            <li><strong>sad:</strong> I'm sad <strong>to leave</strong> my friends.</li>
            <li><strong>surprised:</strong> I'm surprised <strong>to see</strong> you here!</li>
          </ul>

          <h4>Readiness & Eagerness:</h4>
          <ul>
            <li><strong>ready:</strong> I'm ready <strong>to go</strong> now.</li>
            <li><strong>eager:</strong> She's eager <strong>to learn</strong> Spanish.</li>
            <li><strong>willing:</strong> I'm willing <strong>to wait</strong> if needed.</li>
          </ul>

          <h4>Ability & Difficulty:</h4>
          <ul>
            <li><strong>able:</strong> I'm able <strong>to swim</strong> one mile.</li>
            <li><strong>easy:</strong> This book is easy <strong>to read</strong>.</li>
            <li><strong>hard/difficult:</strong> Chinese is difficult <strong>to learn</strong>.</li>
          </ul>

          <h4>Importance & Necessity:</h4>
          <ul>
            <li><strong>important:</strong> It's important <strong>to exercise</strong> regularly.</li>
            <li><strong>necessary:</strong> It's necessary <strong>to wear</strong> a coat in winter.</li>
            <li><strong>essential:</strong> It's essential <strong>to drink</strong> water every day.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "Adjective + to + verb is perfect for expressing feelings and opinions: 'I'm happy to help!' 'It's important to study.' 'I'm excited to see you!'"
      },
      exercises: [
        {
          id: "pattern-4-exercise",
          title: "Practice: Adjective + Infinitive",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I'm happy ___ you.",
              options: ["to help", "helping", "help"],
              expectedAnswer: "to help"
            },
            {
              type: "select",
              label: "It's important ___ healthy food.",
              options: ["to eat", "eating", "eat"],
              expectedAnswer: "to eat"
            },
            {
              type: "select",
              label: "She's excited ___ her grandmother next month.",
              options: ["to visit", "visiting", "visit"],
              expectedAnswer: "to visit"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-5",
      stepNumber: 6,
      title: "Pattern 5: Noun + Infinitive",
      icon: "5️⃣",
      explanation: `
        <p>After certain nouns, use the <strong>infinitive (to + verb)</strong>.</p>

        <p><strong>Formula:</strong> <span style="background-color: #bae6fd; color: #0369a1; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Noun + to + Verb</strong></span></p>

        <div style="background-color: rgba(3, 105, 161, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(3, 105, 161, 0.2);">
          <h4>Abilities & Skills:</h4>
          <ul>
            <li><strong>ability:</strong> I have the ability <strong>to speak</strong> three languages.</li>
            <li><strong>skill:</strong> She has the skill <strong>to play</strong> piano beautifully.</li>
            <li><strong>talent:</strong> He has a talent <strong>to make</strong> people laugh.</li>
          </ul>

          <h4>Opportunities & Chances:</h4>
          <ul>
            <li><strong>opportunity:</strong> I have the opportunity <strong>to study</strong> abroad.</li>
            <li><strong>chance:</strong> This is your chance <strong>to learn</strong> something new.</li>
          </ul>

          <h4>Time & Planning:</h4>
          <ul>
            <li><strong>time:</strong> I don't have time <strong>to cook</strong> tonight.</li>
            <li><strong>plan:</strong> I have a plan <strong>to save</strong> $5,000 this year.</li>
            <li><strong>decision:</strong> I made the decision <strong>to move</strong> to Boston.</li>
            <li><strong>promise:</strong> I made a promise <strong>to call</strong> my mother every week.</li>
          </ul>

          <h4>Need & Desire:</h4>
          <ul>
            <li><strong>need:</strong> I have a need <strong>to exercise</strong> more often.</li>
            <li><strong>desire:</strong> She has a strong desire <strong>to travel</strong> the world.</li>
            <li><strong>way:</strong> There's no way <strong>to finish</strong> this by tomorrow.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "Noun + infinitive is perfect for describing abilities and plans: 'I have the ability to swim.' 'I made a plan to save money.' 'She has a talent to sing.'"
      },
      exercises: [
        {
          id: "pattern-5-exercise",
          title: "Practice: Noun + Infinitive",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I have the ability ___ very fast.",
              options: ["to run", "running", "run"],
              expectedAnswer: "to run"
            },
            {
              type: "select",
              label: "I made the decision ___ to California.",
              options: ["to move", "moving", "move"],
              expectedAnswer: "to move"
            },
            {
              type: "select",
              label: "This is your chance ___ a new language.",
              options: ["to learn", "learning", "learn"],
              expectedAnswer: "to learn"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-6",
      stepNumber: 7,
      title: "Pattern 6: Verb + Infinitive",
      icon: "6️⃣",
      explanation: `
        <p>Certain verbs are always followed by <strong>infinitives (to + verb)</strong>, never gerunds.</p>

        <p><strong>Formula:</strong> <span style="background-color: #bae6fd; color: #0369a1; padding: 8px 12px; border-radius: 4px; font-size: 1.1em; font-weight: 600;"><strong>Subject + Verb + to + Verb</strong></span></p>

        <h3>Common Verbs + Infinitive</h3>

        <div style="background-color: rgba(3, 105, 161, 0.05); padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid rgba(3, 105, 161, 0.2);">
          <h4>Goals & Aspirations:</h4>
          <ul>
            <li><strong>want:</strong> I want <strong>to visit</strong> Japan someday.</li>
            <li><strong>hope:</strong> I hope <strong>to see</strong> you soon.</li>
            <li><strong>expect:</strong> I expect <strong>to arrive</strong> around 6pm.</li>
            <li><strong>would like:</strong> I would like <strong>to order</strong> pizza tonight.</li>
          </ul>

          <h4>Planning & Decisions:</h4>
          <ul>
            <li><strong>plan:</strong> I plan <strong>to study</strong> medicine.</li>
            <li><strong>decide:</strong> I decided <strong>to buy</strong> a new car.</li>
            <li><strong>choose:</strong> She chose <strong>to stay</strong> home tonight.</li>
            <li><strong>intend:</strong> I intend <strong>to finish</strong> this book by Friday.</li>
          </ul>

          <h4>Learning & Skills:</h4>
          <ul>
            <li><strong>learn:</strong> I'm learning <strong>to cook</strong> Italian food.</li>
            <li><strong>need:</strong> I need <strong>to practice</strong> my pronunciation.</li>
            <li><strong>try:</strong> I'm trying <strong>to eat</strong> healthier. (attempting)</li>
          </ul>

          <h4>Offers & Promises:</h4>
          <ul>
            <li><strong>offer:</strong> She offered <strong>to drive</strong> me to the airport.</li>
            <li><strong>promise:</strong> I promise <strong>to call</strong> you tomorrow.</li>
            <li><strong>agree:</strong> We agreed <strong>to meet</strong> at 7pm.</li>
            <li><strong>refuse:</strong> He refused <strong>to answer</strong> the question.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "These verbs ALWAYS take infinitives, never gerunds. ✅ I want to travel. ❌ I want traveling."
      },
      exercises: [
        {
          id: "pattern-6-exercise",
          title: "Practice: Verbs + Infinitives",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I hope ___ you at the party.",
              options: ["to see", "seeing", "see"],
              expectedAnswer: "to see"
            },
            {
              type: "select",
              label: "She decided ___ a new apartment.",
              options: ["to rent", "renting", "rent"],
              expectedAnswer: "to rent"
            },
            {
              type: "select",
              label: "I need ___ more English.",
              options: ["to practice", "practicing", "practice"],
              expectedAnswer: "to practice"
            }
          ]
        }
      ]
    },
    {
      id: "special-cases",
      stepNumber: 8,
      title: "Special Cases: Stop, Remember, Try",
      icon: "⚠️",
      explanation: `
        <p>Some verbs can be followed by BOTH gerunds and infinitives, but the <strong>meaning changes</strong>!</p>

        <h3>Stop + Gerund vs Stop + Infinitive</h3>
        <div style="background-color: #fef3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #f4d35e;">
          <p><strong>stop + gerund</strong> = quit doing something</p>
          <p>Example: I stopped <strong>smoking</strong>. (I quit the habit)</p>
          <p style="margin-top: 1rem;"><strong>stop + infinitive</strong> = pause one activity to do another</p>
          <p>Example: I stopped <strong>to buy</strong> gas. (I paused my trip to buy gas)</p>
        </div>

        <h3>Remember + Gerund vs Remember + Infinitive</h3>
        <div style="background-color: #fef3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #f4d35e;">
          <p><strong>remember + gerund</strong> = recall a past event</p>
          <p>Example: I remember <strong>meeting</strong> you at the party. (I have a memory of it)</p>
          <p style="margin-top: 1rem;"><strong>remember + infinitive</strong> = not forget to do something (future/present)</p>
          <p>Example: Remember <strong>to call</strong> your mother. (Don't forget!)</p>
        </div>

        <h3>Try + Gerund vs Try + Infinitive</h3>
        <div style="background-color: #fef3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #f4d35e;">
          <p><strong>try + gerund</strong> = experiment with something to see if it works</p>
          <p>Example: I'm tired. I'll try <strong>drinking</strong> coffee. (Let's see if coffee helps)</p>
          <p style="margin-top: 1rem;"><strong>try + infinitive</strong> = make an effort, attempt</p>
          <p>Example: I'm trying <strong>to learn</strong> Spanish. (I'm making an effort)</p>
        </div>
      `,
      tipBox: {
        title: "💡 Quick Test",
        content: "Is it about the PAST (gerund) or FUTURE (infinitive)? 'I remember seeing you' (past memory) vs 'Remember to call' (future action)"
      },
      exercises: [
        {
          id: "special-cases-exercise",
          title: "Practice: Stop, Remember, Try",
          instructions: "Choose the correct form based on the meaning.",
          items: [
            {
              type: "radio",
              label: "I stopped ___ TV at midnight. (I quit the habit)",
              options: [
                { value: "watching", label: "watching (quit the habit)" },
                { value: "to-watch", label: "to watch (paused to do it)" }
              ],
              expectedAnswer: "watching"
            },
            {
              type: "radio",
              label: "Remember ___ your keys before leaving. (Don't forget!)",
              options: [
                { value: "taking", label: "taking (past memory)" },
                { value: "to-take", label: "to take (don't forget)" }
              ],
              expectedAnswer: "to-take"
            },
            {
              type: "radio",
              label: "If you have a headache, try ___ some water. (Experiment)",
              options: [
                { value: "drinking", label: "drinking (experiment)" },
                { value: "to-drink", label: "to drink (make an effort)" }
              ],
              expectedAnswer: "drinking"
            }
          ]
        }
      ]
    },
    {
      id: "summary",
      title: "Summary: Quick Reference Guide",
      icon: "✓",
      explanation: `
        <h3>Pattern Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
          <thead>
            <tr style="background: rgba(217, 119, 87, 0.15);">
              <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Pattern</th>
              <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Use</th>
              <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; background: rgba(217, 119, 87, 0.05);">Subject = Gerund</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Gerund (-ing)</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Swimming is fun.</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; background: rgba(217, 119, 87, 0.05);">Verb + Gerund</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Gerund (-ing)</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I enjoy reading.</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; background: rgba(217, 119, 87, 0.05);">Preposition + Gerund</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">ALWAYS Gerund (-ing)</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I'm interested in learning.</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; background: rgba(3, 105, 161, 0.05);">Adjective + Infinitive</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Infinitive (to + verb)</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I'm happy to help.</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; background: rgba(3, 105, 161, 0.05);">Noun + Infinitive</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Infinitive (to + verb)</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I have the ability to swim.</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; background: rgba(3, 105, 161, 0.05);">Verb + Infinitive</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Infinitive (to + verb)</td>
              <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I want to travel.</td>
            </tr>
          </tbody>
        </table>

        <h3 style="margin-top: 2rem;">Key Reminders</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>After a preposition → ALWAYS gerund!</strong> This is the most important rule.</li>
          <li><strong>Look what comes BEFORE the verb</strong> to decide gerund or infinitive.</li>
          <li>Certain verbs always take gerunds: enjoy, finish, keep, stop, avoid, consider, suggest, recommend</li>
          <li>Certain verbs always take infinitives: want, hope, plan, decide, learn, need, offer, promise, agree</li>
          <li>Special cases (stop, remember, try) change meaning depending on gerund or infinitive</li>
          <li>Subject of sentence = gerund (Swimming is fun)</li>
        </ul>
      `,
      tipBox: {
        title: "💡 Final Tip",
        content: "When in doubt, ask: 'What comes BEFORE the verb?' A preposition? Use gerund. An adjective or noun? Usually infinitive. A specific verb? Check the list!"
      },
    },
  ],

  miniQuiz: [
    {
      id: "quiz-1",
      question: "What should you use after a preposition?",
      options: [
        { value: "b", label: "Always infinitive (to + verb)" },
        { value: "a", label: "Always gerund (-ing)" },
        { value: "c", label: "Either one" },
    ],
    correctAnswer: "a",
      explanation:
        "After a preposition, you MUST use a gerund. Example: 'I'm interested in learning' (not 'in to learn').",
      skillTag: "prep-plus-gerund-core-rule",
      difficulty: "easy",
    },
    {
      id: "quiz-2",
      question: "Which is correct?",
      options: [
        { value: "a", label: "I enjoy to read books." },
        { value: "c", label: "I enjoy read books." },
        { value: "b", label: "I enjoy reading books." },
    ],
    correctAnswer: "b",
      explanation:
        "'Enjoy' is always followed by a gerund, never an infinitive. Correct: 'I enjoy reading books.'",
      skillTag: "verb-plus-gerund-enjoy-like-love",
      difficulty: "easy",
    },
    {
      id: "quiz-3",
      question: "Which is correct?",
      options: [
        { value: "b", label: "I want to visit Japan." },
        { value: "a", label: "I want visiting Japan." },
        { value: "c", label: "I want visit Japan." },
    ],
    correctAnswer: "b",
      explanation:
        "'Want' is always followed by an infinitive, never a gerund. Correct: 'I want to visit Japan.'",
      skillTag: "verb-plus-infinitive-want-hope-plan",
      difficulty: "easy",
    },
    {
      id: "quiz-4",
      question: "When the verb is the subject, which form is more natural in modern English?",
      options: [
        { value: "b", label: "Infinitive: 'To swim is fun'" },
        { value: "a", label: "Gerund: 'Swimming is fun'" },
        { value: "c", label: "Both are equally wrong" },
    ],
    correctAnswer: "a",
      explanation:
        "When a verb is the subject, we usually use the gerund: 'Swimming is fun.' 'To swim is fun' is possible but sounds more formal or old‑fashioned.",
      skillTag: "subject-gerund-choice",
      difficulty: "easy",
    },
    {
      id: "quiz-5",
      question: "What's the difference: 'I stopped smoking' vs 'I stopped to smoke'?",
      options: [
        { value: "a", label: "No difference – same meaning" },
        { value: "c", label: "'stopped smoking' is wrong in English" },
        { value: "b", label: "'stopped smoking' = quit the habit, 'stopped to smoke' = paused to have a cigarette" },
    ],
    correctAnswer: "b",
      explanation:
        "Stop + gerund = quit doing something. Stop + infinitive = pause one activity to do another. The meaning completely changes.",
      skillTag: "special-stop-gerund-vs-infinitive",
      difficulty: "medium",
    },
    {
      id: "quiz-6",
      question: "Which sentence is correct?",
      options: [
        { value: "c", label: "Thank you for helping me." },
        { value: "a", label: "Thank you for help me." },
        { value: "b", label: "Thank you for to help me." },
    ],
    correctAnswer: "c",
      explanation:
        "'For' is a preposition, so it must be followed by a gerund: 'Thank you for helping me.'",
      skillTag: "prep-for-plus-gerund",
      difficulty: "easy",
    },
    {
      id: "quiz-7",
      question: "Choose the correct: 'I'm happy ___ you.'",
      options: [
        { value: "a", label: "seeing" },
        { value: "b", label: "to see" },
        { value: "c", label: "see" },
      ],
      correctAnswer: "b",
      explanation:
        "After an adjective (happy), we use an infinitive: 'I'm happy to see you.'",
      skillTag: "adjective-plus-infinitive-feelings",
      difficulty: "easy",
    },
    {
      id: "quiz-8",
      question: "Which is correct for a past memory?",
      options: [
        { value: "a", label: "I remember to meet you at the party." },
        { value: "c", label: "I remember meet you at the party." },
        { value: "b", label: "I remember meeting you at the party." },
    ],
    correctAnswer: "b",
      explanation:
        "Remember + gerund = recall a past event. 'I remember meeting you' means you have a memory of that event.",
      skillTag: "special-remember-gerund-past-memory",
      difficulty: "medium",
    },
    {
      id: "quiz-9",
      question: "Choose the correct: 'I look forward ___ you soon.'",
      options: [
        { value: "b", label: "to seeing" },
        { value: "a", label: "to see" },
        { value: "c", label: "seeing" },
    ],
    correctAnswer: "b",
      explanation:
        "'To' in 'look forward to' is a preposition, not an infinitive marker. After prepositions, always use a gerund: 'I look forward to seeing you.'",
      skillTag: "phrase-look-forward-to-plus-gerund",
      difficulty: "medium",
    },
    {
      id: "quiz-10",
      question: "What is the best strategy for choosing gerund or infinitive?",
      options: [
        { value: "a", label: "Use your favorite form" },
        { value: "b", label: "Look at what comes BEFORE the verb (preposition, adjective, specific verbs, etc.)" },
        { value: "c", label: "Always use gerunds with long verbs and infinitives with short verbs" },
      ],
      correctAnswer: "b",
      explanation:
        "The key is to look at what comes BEFORE the verb. Prepositions, specific verbs, adjectives, and nouns usually decide gerund vs infinitive.",
      skillTag: "meta-look-before-verb-strategy",
      difficulty: "easy",
    },
    {
      id: "quiz-11",
      question: "Which sentence correctly follows 'adjective + preposition + gerund'?",
      options: [
        { value: "a", label: "She is good at to solve problems." },
        { value: "c", label: "She is good to solving problems." },
        { value: "b", label: "She is good at solving problems." },
    ],
    correctAnswer: "b",
      explanation:
        "After a preposition (at), we must use a gerund: 'good at solving problems.'",
      skillTag: "adj-prep-plus-gerund",
      difficulty: "medium",
    },
    {
      id: "quiz-12",
      question: "Which sentence is a correct example of noun + infinitive?",
      options: [
        { value: "b", label: "I have the ability to speak three languages." },
        { value: "a", label: "I have the ability speaking three languages." },
        { value: "c", label: "I have the ability speak three languages." },
    ],
    correctAnswer: "b",
      explanation:
        "Certain nouns are followed by an infinitive: 'the ability to speak three languages.'",
      skillTag: "noun-plus-infinitive-ability-chance-time",
      difficulty: "medium",
    },
    {
      id: "quiz-13",
      question: "Which is correct?",
      options: [
        { value: "a", label: "I plan studying nursing next year." },
        { value: "b", label: "I plan to study nursing next year." },
        { value: "c", label: "I plan study nursing next year." },
      ],
      correctAnswer: "b",
      explanation:
        "'Plan' is followed by an infinitive: 'plan to study nursing next year.'",
      skillTag: "verb-plus-infinitive-plan-decide-hope",
      difficulty: "medium",
    },
    {
      id: "quiz-14",
      question: "Which sentence uses 'try' to show an experiment (see if it helps)?",
      options: [
        { value: "a", label: "I'll try to drink more water every day." },
        { value: "c", label: "I'll try drink more water." },
        { value: "b", label: "I'll try drinking more water to see if it helps." },
    ],
    correctAnswer: "b",
      explanation:
        "Try + gerund is used for experiments (see if it helps). Try + infinitive is used for effort.",
      skillTag: "special-try-gerund-vs-infinitive",
      difficulty: "medium",
    },
    {
      id: "quiz-15",
      question: "Which is correct if you don’t want to forget an action?",
      options: [
        { value: "b", label: "Remember to call your mother tonight." },
        { value: "a", label: "Remember calling your mother tonight." },
        { value: "c", label: "Remember call your mother tonight." },
    ],
    correctAnswer: "b",
      explanation:
        "Remember + infinitive is used for not forgetting to do something: 'Remember to call your mother tonight.'",
      skillTag: "special-remember-infinitive-future-duty",
      difficulty: "medium",
    },
    {
      id: "quiz-16",
      question: "Which sentence has a gerund as the subject?",
      options: [
        { value: "a", label: "To study late at night is hard for me." },
        { value: "b", label: "Studying late at night is hard for me." },
        { value: "c", label: "I study late at night." },
      ],
      correctAnswer: "b",
      explanation:
        "'Studying' is a gerund used as the subject of the sentence.",
      skillTag: "subject-gerund-identification",
      difficulty: "easy",
    },
  ],
  /*
  TEACHER DIAGNOSTIC NOTES – Gerunds & Infinitives Mini Quiz

  This mini quiz checks whether students can:
  - Apply the core rule: after a preposition → ALWAYS gerund.
  - Recognize common verb + gerund and verb + infinitive patterns.
  - Use subject = gerund naturally.
  - Use adjective + infinitive and noun + infinitive patterns.
  - Understand meaning changes with stop / remember / try.
  - Use the strategy “look at what comes BEFORE the verb” to choose form.

  Skill tags:

  Core rule & strategy:
  - prep-plus-gerund-core-rule
  - meta-look-before-verb-strategy

  Preposition + gerund patterns:
  - prep-for-plus-gerund
  - phrase-look-forward-to-plus-gerund
  - adj-prep-plus-gerund

  Verb + gerund patterns:
  - verb-plus-gerund-enjoy-like-love
  - special-stop-gerund-vs-infinitive
  - special-remember-gerund-past-memory
  - special-try-gerund-vs-infinitive

  Verb + infinitive patterns:
  - verb-plus-infinitive-want-hope-plan
  - verb-plus-infinitive-plan-decide-hope
  - special-remember-infinitive-future-duty

  Adjective / noun + infinitive patterns:
  - adjective-plus-infinitive-feelings
  - noun-plus-infinitive-ability-chance-time

  Subject = gerund:
  - subject-gerund-choice
  - subject-gerund-identification

  How to read the diagnostics:
  - If prep-plus-gerund tags are weak → Re-teach the golden rule: after a preposition, always -ing. Use color-coding to highlight the prepositions and circle the gerunds (in, at, about, for, without, before, after, to in “look forward to”).
  - If verb-plus-gerund tags are weak → Focus on the high-frequency set (enjoy, like, love, finish, keep, avoid, consider, suggest, recommend). Build a verb wall where students add their own examples with gerunds.
  - If verb-plus-infinitive tags are weak → Revisit the “goal and plan” verbs (want, hope, plan, decide, need, learn, agree, offer). Have students write 3 true sentences about their goals using these verbs + to + verb.
  - If adjective/noun + infinitive tags are weak → Practice common frames: happy to…, ready to…, important to…, ability to…, time to…, chance to…. Use sentence stems your students can personalize (I’m happy to…, I don’t have time to…).
  - If special stop/remember/try tags are weak → Re-teach using short contrast pairs on the board: stop smoking vs stop to smoke, remember meeting vs remember to meet, try drinking vs try to drink. Ask students which one is about PAST memory, which is about FUTURE duty, and which is about EXPERIMENT vs EFFORT.
  - If subject-gerund tags are weak → Give pairs like “Cooking at home saves money” / “To cook at home saves money” and have students choose the more natural version. Emphasize that in modern English, gerunds are the normal choice for subjects.

  Suggested use:
  - Use this mini quiz after students have worked through the main patterns (subject = gerund, verb + gerund, preposition + gerund, adjective/noun/verb + infinitive, and the special-case verbs).
  - Use class-level skillTag results to decide which pattern to revisit:
    • Many errors on preposition tags → do more “preposition + -ing” drills.
    • Many errors on verb group tags → slow down and sort VERB CARDS into “+ gerund” and “+ infinitive” piles together as a class.
    • Many errors on special-case tags → spend a short focused day on stop / remember / try with timeline drawings.
  */
};
