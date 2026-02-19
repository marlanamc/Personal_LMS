import { InteractiveGuideContent } from "@/types/activity";

export const gerundsInfinitivesJobsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "Introduction: Gerunds & Infinitives in Job Communication",
      icon: "💼",
      explanation: `
        <p>Gerunds and infinitives are essential for professional communication. Whether you're writing a resume, preparing for an interview, or discussing your qualifications, using the correct form shows your English proficiency and attention to detail.</p>

        <div style="background-color: #fef9f3; border-left: 4px solid #7ba884; padding: 15px; margin: 20px 0;">
          <p><strong>Why This Matters for Your Career:</strong></p>
          <ul>
            <li><strong>Resume writing:</strong> "I enjoy working with customers" vs "I enjoy to work" ❌</li>
            <li><strong>Cover letters:</strong> "Thank you for considering my application" vs "Thank you for consider" ❌</li>
            <li><strong>Interviews:</strong> "I'm eager to start training" vs "I'm eager starting" ❌</li>
            <li><strong>Professional communication:</strong> "I'm interested in learning new software" vs "I'm interested to learn" ❌</li>
          </ul>
        </div>

        <p><strong>What You'll Learn:</strong></p>
        <ul>
          <li><strong>Pattern 1:</strong> Subject = Gerund → "Finding a job is challenging"</li>
          <li><strong>Pattern 2:</strong> Verb + Gerund → "I enjoy working with customers"</li>
          <li><strong>Pattern 3:</strong> Preposition + Gerund → "I'm interested in learning new software"</li>
          <li><strong>Pattern 4:</strong> Adjective + Infinitive → "I'm eager to start training"</li>
          <li><strong>Pattern 5:</strong> Noun + Infinitive → "The ability to multitask is essential"</li>
          <li><strong>Pattern 6:</strong> Verb + Infinitive → "I want to advance in my career"</li>
          <li><strong>Special Cases:</strong> Verbs that take BOTH (stop, remember, try) with meaning changes</li>
        </ul>
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
        <p><strong>Formula:</strong> <span style="background-color: #fef3cd; padding: 5px; border-radius: 4px;"><strong>verb + -ing</strong></span></p>

        <div style="background-color: #f0f8f5; padding: 15px; margin: 15px 0; border-radius: 8px;">
          <p><strong>Job Examples:</strong></p>
          <ul>
            <li><strong>Finding</strong> a job takes time and effort.</li>
            <li>I enjoy <strong>working</strong> with customers.</li>
            <li>I'm interested in <strong>learning</strong> new computer programs.</li>
          </ul>
        </div>

        <h3>What is an Infinitive?</h3>
        <p>An <strong>infinitive</strong> is "to" + base verb.</p>
        <p><strong>Formula:</strong> <span style="background-color: #fef3cd; padding: 5px; border-radius: 4px;"><strong>to + verb</strong></span></p>

        <div style="background-color: #f0f8f5; padding: 15px; margin: 15px 0; border-radius: 8px;">
          <p><strong>Job Examples:</strong></p>
          <ul>
            <li>I'm eager <strong>to start</strong> my new position.</li>
            <li>I have the ability <strong>to multitask</strong> effectively.</li>
            <li>I want <strong>to advance</strong> in my career.</li>
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

        <p><strong>Formula:</strong> <span style="background-color: #fef3cd; padding: 8px; border-radius: 4px; font-size: 1.1em;"><strong>Gerund + verb + ...</strong></span></p>

        <div style="background-color: #f0f8f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h4>Job Searching & Career Development:</h4>
          <ul>
            <li><strong>Finding</strong> a job in healthcare is rewarding.</li>
            <li><strong>Writing</strong> a strong resume takes practice.</li>
            <li><strong>Looking</strong> for a job can be stressful.</li>
            <li><strong>Applying</strong> to multiple positions increases your chances.</li>
          </ul>

          <h4>Skills & Professional Development:</h4>
          <ul>
            <li><strong>Learning</strong> new software improves your job prospects.</li>
            <li><strong>Speaking</strong> English clearly helps in customer service.</li>
            <li><strong>Working</strong> overtime helps you earn extra money.</li>
            <li><strong>Getting</strong> additional training is important for career growth.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "When the verb is the subject (the main topic), it must be a gerund, not an infinitive. ✅ Finding a job is challenging. ❌ To find a job is challenging. (less common)"
      },
      exercises: [
        {
          id: "pattern-1-exercise",
          title: "Practice: Using Gerunds as Subjects",
          instructions: "Choose the correct form to complete each sentence.",
          items: [
            {
              type: "select",
              label: "___ new skills makes you more competitive in the job market.",
              options: ["Learning", "To learn", "Learn"],
              expectedAnswer: "Learning"
            },
            {
              type: "select",
              label: "___ a good resume is the first step in finding a job.",
              options: ["Writing", "To write", "Write"],
              expectedAnswer: "Writing"
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

        <p><strong>Formula:</strong> <span style="background-color: #fef3cd; padding: 8px; border-radius: 4px; font-size: 1.1em;"><strong>Subject + Verb + Gerund</strong></span></p>

        <h3>Common Verbs + Gerund (Professional Context)</h3>

        <div style="background-color: #f0f8f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h4>Preferences & Enjoyment:</h4>
          <ul>
            <li><strong>enjoy:</strong> I enjoy <strong>working</strong> with customers.</li>
            <li><strong>like:</strong> I like <strong>helping</strong> people solve problems.</li>
            <li><strong>prefer:</strong> I prefer <strong>working</strong> the morning shift.</li>
          </ul>

          <h4>Actions & Completion:</h4>
          <ul>
            <li><strong>finish:</strong> I finished <strong>updating</strong> my resume yesterday.</li>
            <li><strong>keep:</strong> I keep <strong>practicing</strong> my interview answers.</li>
            <li><strong>stop:</strong> I stopped <strong>working</strong> at the restaurant last month. (I quit)</li>
          </ul>

          <h4>Avoidance:</h4>
          <ul>
            <li><strong>avoid:</strong> I avoid <strong>making</strong> spelling errors on applications.</li>
          </ul>

          <h4>Consideration & Advice:</h4>
          <ul>
            <li><strong>consider:</strong> I'm considering <strong>changing</strong> careers.</li>
            <li><strong>suggest:</strong> I suggest <strong>reviewing</strong> the job requirements carefully.</li>
            <li><strong>recommend:</strong> I recommend <strong>asking</strong> for a reference letter.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "These verbs ALWAYS take gerunds, never infinitives. ✅ I enjoy working with customers. ❌ I enjoy to work with customers."
      },
      exercises: [
        {
          id: "pattern-2-exercise",
          title: "Practice: Verbs + Gerunds",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I finished ___ my cover letter last night.",
              options: ["writing", "to write", "write"],
              expectedAnswer: "writing"
            },
            {
              type: "select",
              label: "I suggest ___ about the benefits package during the interview.",
              options: ["asking", "to ask", "ask"],
              expectedAnswer: "asking"
            }
          ]
        }
      ]
    },
    {
      id: "pattern-3",
      stepNumber: 4,
      title: "Pattern 3: Preposition + Gerund",
      icon: "3️⃣",
      explanation: `
        <p><strong>Golden Rule:</strong> After a preposition, ALWAYS use a <strong>gerund (-ing)</strong>, never an infinitive.</p>

        <p><strong>Formula:</strong> <span style="background-color: #fef3cd; padding: 8px; border-radius: 4px; font-size: 1.1em;"><strong>Preposition + Gerund</strong></span></p>

        <div style="background-color: #ffe6e6; border: 2px solid #d97757; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p><strong>⚠️ CRITICAL RULE:</strong> After a preposition → ALWAYS gerund</p>
          <p>✅ I'm interested <strong>in learning</strong> new software.<br>
          ❌ I'm interested <strong>in to learn</strong> new software.</p>
        </div>

        <h3>Common Preposition + Gerund Patterns (Jobs)</h3>

        <div style="background-color: #f0f8f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h4>Adjective + Preposition + Gerund:</h4>
          <ul>
            <li><strong>interested in:</strong> I'm interested in <strong>learning</strong> new computer programs.</li>
            <li><strong>good at:</strong> I'm good at <strong>managing</strong> my time.</li>
            <li><strong>worried about:</strong> I'm worried about <strong>making</strong> a good impression.</li>
            <li><strong>excited about:</strong> I'm excited about <strong>starting</strong> my new job.</li>
          </ul>

          <h4>Professional Communication Phrases:</h4>
          <ul>
            <li><strong>thank you for:</strong> Thank you for <strong>considering</strong> my application.</li>
            <li><strong>by:</strong> I improved my skills <strong>by taking</strong> online courses.</li>
          </ul>

          <h4>Time Prepositions:</h4>
          <ul>
            <li><strong>before:</strong> I researched the company <strong>before applying</strong> for the position.</li>
            <li><strong>after:</strong> I'll contact you <strong>after completing</strong> my training.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Common Mistake Alert",
        content: "'to' can be BOTH an infinitive marker AND a preposition! As infinitive marker: I want to learn. As preposition: I look forward to learning. Other examples with 'to' as preposition: be used to, be accustomed to, look forward to"
      },
      exercises: [
        {
          id: "pattern-3-exercise",
          title: "Practice: Preposition + Gerund",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "Thank you for ___ my application for the position.",
              options: ["considering", "to consider", "consider"],
              expectedAnswer: "considering"
            },
            {
              type: "select",
              label: "I'm interested in ___ more about the benefits package.",
              options: ["learning", "to learn", "learn"],
              expectedAnswer: "learning"
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

        <p><strong>Formula:</strong> <span style="background-color: #fef3cd; padding: 8px; border-radius: 4px; font-size: 1.1em;"><strong>Adjective + to + Verb</strong></span></p>

        <div style="background-color: #f0f8f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h4>Professional Enthusiasm & Readiness:</h4>
          <ul>
            <li><strong>eager:</strong> I'm eager <strong>to start</strong> my new position.</li>
            <li><strong>ready:</strong> I'm ready <strong>to take on</strong> more responsibilities.</li>
            <li><strong>happy:</strong> I'm happy <strong>to help</strong> train new employees.</li>
            <li><strong>excited:</strong> I'm excited <strong>to join</strong> your team.</li>
          </ul>

          <h4>Ability & Willingness:</h4>
          <ul>
            <li><strong>able:</strong> I'm able <strong>to work</strong> flexible hours.</li>
            <li><strong>willing:</strong> I'm willing <strong>to relocate</strong> for this position.</li>
          </ul>

          <h4>Job Requirements & Importance:</h4>
          <ul>
            <li><strong>important:</strong> It's important <strong>to arrive</strong> on time.</li>
            <li><strong>necessary:</strong> It's necessary <strong>to submit</strong> your timesheet weekly.</li>
            <li><strong>essential:</strong> It's essential <strong>to follow</strong> safety procedures.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Interview Success Tip",
        content: "Use adjective + infinitive to show enthusiasm and professionalism: 'I'm eager to learn from your experienced team.' 'I'm ready to contribute my skills immediately.' 'I'm willing to work overtime when needed.'"
      },
      exercises: [
        {
          id: "pattern-4-exercise",
          title: "Practice: Adjective + Infinitive",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I'm eager ___ training next week.",
              options: ["to start", "starting", "start"],
              expectedAnswer: "to start"
            },
            {
              type: "select",
              label: "It's important ___ professional during interviews.",
              options: ["to be", "being", "be"],
              expectedAnswer: "to be"
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

        <p><strong>Formula:</strong> <span style="background-color: #fef3cd; padding: 8px; border-radius: 4px; font-size: 1.1em;"><strong>Noun + to + Verb</strong></span></p>

        <div style="background-color: #f0f8f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h4>Professional Abilities & Skills:</h4>
          <ul>
            <li><strong>ability:</strong> I have the ability <strong>to multitask</strong> effectively.</li>
            <li><strong>skill:</strong> I have the skill <strong>to resolve</strong> conflicts.</li>
          </ul>

          <h4>Opportunities & Chances:</h4>
          <ul>
            <li><strong>opportunity:</strong> I have the opportunity <strong>to train</strong> new employees.</li>
            <li><strong>chance:</strong> I have the chance <strong>to advance</strong> in my career.</li>
          </ul>

          <h4>Time & Planning:</h4>
          <ul>
            <li><strong>time:</strong> I need the time <strong>to complete</strong> this certification.</li>
            <li><strong>plan:</strong> I have a plan <strong>to finish</strong> my degree online.</li>
            <li><strong>decision:</strong> I made the decision <strong>to change</strong> careers.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "📝 Resume Language",
        content: "Noun + infinitive is perfect for describing qualifications on resumes: 'Strong ability to communicate with diverse teams' 'Proven capacity to manage multiple projects' 'Excellent skill to solve complex problems'"
      },
      exercises: [
        {
          id: "pattern-5-exercise",
          title: "Practice: Noun + Infinitive",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I have the ability ___ under pressure.",
              options: ["to work", "working", "work"],
              expectedAnswer: "to work"
            },
            {
              type: "select",
              label: "I made the decision ___ my career path.",
              options: ["to change", "changing", "change"],
              expectedAnswer: "to change"
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

        <p><strong>Formula:</strong> <span style="background-color: #fef3cd; padding: 8px; border-radius: 4px; font-size: 1.1em;"><strong>Subject + Verb + to + Verb</strong></span></p>

        <h3>Common Verbs + Infinitive (Professional Context)</h3>

        <div style="background-color: #f0f8f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h4>Goals & Aspirations:</h4>
          <ul>
            <li><strong>want:</strong> I want <strong>to advance</strong> in my career.</li>
            <li><strong>hope:</strong> I hope <strong>to get</strong> a promotion this year.</li>
            <li><strong>expect:</strong> I expect <strong>to receive</strong> my certification in May.</li>
          </ul>

          <h4>Planning & Decisions:</h4>
          <ul>
            <li><strong>plan:</strong> I plan <strong>to complete</strong> my training by June.</li>
            <li><strong>decide:</strong> I decided <strong>to apply</strong> for the supervisor position.</li>
            <li><strong>choose:</strong> I chose <strong>to specialize</strong> in customer service.</li>
          </ul>

          <h4>Learning & Development:</h4>
          <ul>
            <li><strong>learn:</strong> I learned <strong>to use</strong> the new software quickly.</li>
            <li><strong>need:</strong> I need <strong>to update</strong> my resume.</li>
          </ul>

          <h4>Commitments & Promises:</h4>
          <ul>
            <li><strong>agree:</strong> I agreed <strong>to work</strong> overtime this week.</li>
            <li><strong>promise:</strong> I promise <strong>to arrive</strong> on time every day.</li>
            <li><strong>offer:</strong> I offered <strong>to help</strong> train the new employee.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "These verbs ALWAYS take infinitives, never gerunds. ✅ I want to advance in my career. ❌ I want advancing in my career."
      },
      exercises: [
        {
          id: "pattern-6-exercise",
          title: "Practice: Verb + Infinitive",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "select",
              label: "I plan ___ my certification exam next month.",
              options: ["to take", "taking", "take"],
              expectedAnswer: "to take"
            },
            {
              type: "select",
              label: "I learned ___ the cash register on my first day.",
              options: ["to use", "using", "use"],
              expectedAnswer: "to use"
            }
          ]
        }
      ]
    },
    {
      id: "special-cases",
      stepNumber: 8,
      title: "Special Cases: Verbs That Take BOTH",
      icon: "⚠️",
      explanation: `
        <p>Some verbs can take BOTH gerunds and infinitives, but the <strong>meaning changes</strong> depending on which you use.</p>

        <div style="background-color: #ffe6e6; border: 2px solid #d97757; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>⚠️ CRITICAL:</strong> These verbs change meaning! Pay close attention to avoid misunderstandings in professional communication.</p>
        </div>

        <h3>1. STOP</h3>
        <div style="background-color: #f0f8f5; padding: 20px; margin: 15px 0; border-radius: 8px;">
          <p><strong>stop + gerund = quit the activity (permanent)</strong></p>
          <ul>
            <li>I stopped <strong>working</strong> at the restaurant. = <em>I quit my job there.</em></li>
          </ul>

          <p><strong>stop + infinitive = pause to do something else (temporary)</strong></p>
          <ul>
            <li>I stopped <strong>to talk</strong> to my manager. = <em>I paused my work to have a conversation.</em></li>
          </ul>
        </div>

        <h3>2. REMEMBER</h3>
        <div style="background-color: #f0f8f5; padding: 20px; margin: 15px 0; border-radius: 8px;">
          <p><strong>remember + gerund = recall a past action</strong></p>
          <ul>
            <li>I remember <strong>submitting</strong> my application. = <em>I recall doing it in the past.</em></li>
          </ul>

          <p><strong>remember + infinitive = don't forget to do something (future obligation)</strong></p>
          <ul>
            <li>I need to remember <strong>to submit</strong> my timesheet. = <em>I shouldn't forget this future task.</em></li>
          </ul>
        </div>

        <h3>3. TRY</h3>
        <div style="background-color: #f0f8f5; padding: 20px; margin: 15px 0; border-radius: 8px;">
          <p><strong>try + gerund = experiment with a method</strong></p>
          <ul>
            <li>I tried <strong>using</strong> the new software. = <em>I experimented with it to see if it worked.</em></li>
          </ul>

          <p><strong>try + infinitive = attempt/make an effort (may fail)</strong></p>
          <ul>
            <li>I tried <strong>to finish</strong> the project on time. = <em>I made an effort but maybe didn't succeed.</em></li>
          </ul>
        </div>
      `,
      exercises: [
        {
          id: "special-cases-exercise",
          title: "Practice: Special Case Verbs",
          instructions: "Choose the correct form based on the meaning.",
          items: [
            {
              type: "radio",
              label: "I stopped ___ at the warehouse last month. (meaning: I quit the job)",
              options: [
                { value: "working", label: "working (quit permanently)" },
                { value: "to-work", label: "to work (paused temporarily)" }
              ],
              expectedAnswer: "working"
            },
            {
              type: "radio",
              label: "Remember ___ your timesheet before Friday!",
              options: [
                { value: "to-submit", label: "to submit (future obligation)" },
                { value: "submitting", label: "submitting (recall past)" }
              ],
              expectedAnswer: "to-submit"
            }
          ]
        }
      ]
    },
    {
      id: "practice",
      title: "Mixed Practice Exercises",
      icon: "✏️",
      explanation: `
        <p>Test your knowledge with these mixed exercises covering all patterns.</p>
      `,
      exercises: [
        {
          id: "mixed-practice",
          title: "Mixed Pattern Practice",
          instructions: "Choose the correct form for each sentence.",
          items: [
            {
              type: "select",
              label: "___ for a job can be challenging, but don't give up!",
              options: ["Looking", "To look", "Look"],
              expectedAnswer: "Looking"
            },
            {
              type: "select",
              label: "I'm good at ___ multiple projects at once.",
              options: ["managing", "to manage", "manage"],
              expectedAnswer: "managing"
            },
            {
              type: "select",
              label: "I decided ___ for the supervisor position.",
              options: ["to apply", "applying", "apply"],
              expectedAnswer: "to apply"
            },
            {
              type: "select",
              label: "I'm eager ___ my new responsibilities.",
              options: ["to start", "starting", "start"],
              expectedAnswer: "to start"
            },
            {
              type: "select",
              label: "I have the ability ___ complex problems.",
              options: ["to solve", "solving", "solve"],
              expectedAnswer: "to solve"
            },
            {
              type: "select",
              label: "I avoid ___ late to work.",
              options: ["arriving", "to arrive", "arrive"],
              expectedAnswer: "arriving"
            },
            {
              type: "select",
              label: "Thank you for ___ me this opportunity.",
              options: ["giving", "to give", "give"],
              expectedAnswer: "giving"
            }
          ]
        }
      ]
    },
    {
      id: "summary",
      title: "Quick Reference Summary",
      icon: "📚",
      explanation: `
        <h3>Pattern Summary</h3>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #7ba884; color: white;">
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Pattern</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Formula</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>1. Subject = Gerund</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">Gerund + verb</td>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Finding</strong> a job is challenging.</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>2. Verb + Gerund</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">Verb + gerund</td>
              <td style="padding: 10px; border: 1px solid #ddd;">I enjoy <strong>working</strong> with customers.</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>3. Prep + Gerund</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">Prep + gerund</td>
              <td style="padding: 10px; border: 1px solid #ddd;">I'm interested <strong>in learning</strong> new software.</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>4. Adj + Infinitive</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">Adj + to + verb</td>
              <td style="padding: 10px; border: 1px solid #ddd;">I'm eager <strong>to start</strong> training.</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>5. Noun + Infinitive</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">Noun + to + verb</td>
              <td style="padding: 10px; border: 1px solid #ddd;">The ability <strong>to multitask</strong> is essential.</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>6. Verb + Infinitive</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">Verb + to + verb</td>
              <td style="padding: 10px; border: 1px solid #ddd;">I want <strong>to advance</strong> in my career.</td>
            </tr>
          </tbody>
        </table>

        <h3>Golden Rules</h3>
        <div style="background-color: #fef9f3; border: 2px solid #7ba884; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <ul>
            <li><strong>After a preposition → ALWAYS gerund</strong></li>
            <li><strong>After an adjective → infinitive</strong></li>
            <li><strong>After a noun → infinitive</strong></li>
            <li><strong>As a subject → gerund (more common)</strong></li>
            <li><strong>After a verb → check the list!</strong></li>
          </ul>
        </div>

        <h3>Special Cases (Meaning Changes)</h3>
        <ul>
          <li><strong>stop working</strong> = quit (permanent) vs <strong>stop to work</strong> = pause (temporary)</li>
          <li><strong>remember submitting</strong> = recall past vs <strong>remember to submit</strong> = future task</li>
          <li><strong>try using</strong> = experiment vs <strong>try to finish</strong> = attempt</li>
        </ul>
      `,
    },
  ],
  miniQuiz: [
    {
      id: "quiz-1",
      question: "___ a good resume is essential for job hunting.",
      options: [
        { value: "writing", label: "Writing" },
        { value: "to-write", label: "To write" },
        { value: "write", label: "Write" }
      ],
      correctAnswer: "writing",
      explanation: "When the verb is the subject, use a gerund: 'Writing a good resume is essential.'"
    },
    {
      id: "quiz-2",
      question: "I enjoy ___ new challenges at work.",
      options: [
        { value: "tackling", label: "tackling" },
        { value: "to-tackle", label: "to tackle" },
        { value: "tackle", label: "tackle" }
      ],
      correctAnswer: "tackling",
      explanation: "'Enjoy' is always followed by a gerund: 'enjoy tackling'."
    },
    {
      id: "quiz-3",
      question: "I'm good at ___ under pressure.",
      options: [
        { value: "working", label: "working" },
        { value: "to-work", label: "to work" },
        { value: "work", label: "work" }
      ],
      correctAnswer: "working",
      explanation: "After the preposition 'at', always use a gerund: 'good at working'."
    },
    {
      id: "quiz-4",
      question: "Thank you for ___ the time to interview me.",
      options: [
        { value: "taking", label: "taking" },
        { value: "to-take", label: "to take" },
        { value: "take", label: "take" }
      ],
      correctAnswer: "taking",
      explanation: "After the preposition 'for', always use a gerund: 'for taking'."
    },
    {
      id: "quiz-5",
      question: "I'm ready ___ on more responsibilities.",
      options: [
        { value: "to-take", label: "to take" },
        { value: "taking", label: "taking" },
        { value: "take", label: "take" }
      ],
      correctAnswer: "to-take",
      explanation: "After the adjective 'ready', use an infinitive: 'ready to take'."
    },
    {
      id: "quiz-6",
      question: "I have the opportunity ___ in a leadership position.",
      options: [
        { value: "to-work", label: "to work" },
        { value: "working", label: "working" },
        { value: "work", label: "work" }
      ],
      correctAnswer: "to-work",
      explanation: "After the noun 'opportunity', use an infinitive: 'opportunity to work'."
    },
    {
      id: "quiz-7",
      question: "I want ___ my professional network.",
      options: [
        { value: "to-expand", label: "to expand" },
        { value: "expanding", label: "expanding" },
        { value: "expand", label: "expand" }
      ],
      correctAnswer: "to-expand",
      explanation: "'Want' is always followed by an infinitive: 'want to expand'."
    },
    {
      id: "quiz-8",
      question: "I plan ___ additional certifications this year.",
      options: [
        { value: "to-earn", label: "to earn" },
        { value: "earning", label: "earning" },
        { value: "earn", label: "earn" }
      ],
      correctAnswer: "to-earn",
      explanation: "'Plan' is always followed by an infinitive: 'plan to earn'."
    },
    {
      id: "quiz-9",
      question: "I stopped ___ at the retail store. (meaning: I quit)",
      options: [
        { value: "working", label: "working (quit permanently)" },
        { value: "to-work", label: "to work (paused temporarily)" }
      ],
      correctAnswer: "working",
      explanation: "When 'stop' means 'quit permanently', use a gerund: 'stopped working'."
    },
    {
      id: "quiz-10",
      question: "Remember ___ your badge tomorrow!",
      options: [
        { value: "to-bring", label: "to bring (future obligation)" },
        { value: "bringing", label: "bringing (recall past)" }
      ],
      correctAnswer: "to-bring",
      explanation: "When 'remember' refers to a future obligation, use an infinitive: 'remember to bring'."
    }
  ],
};
