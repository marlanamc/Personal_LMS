import type { InteractiveGuideContent } from "@/types/activity";

export const punctuationCapitalizationContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Punctuation & Capitalization: Writing Conventions",
            icon: "✍️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Correct punctuation and capitalization make your writing look professional and easy to read. Without them, your writing can be confusing or look careless - even if your grammar is perfect!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Punctuation and capitalization are essential for:</p>
                <ul>
                    <li><strong>Professional communication:</strong> Emails, job applications, and workplace documents</li>
                    <li><strong>Academic writing:</strong> Essays, assignments, and reports</li>
                    <li><strong>Clarity:</strong> Helping readers understand your meaning</li>
                    <li><strong>Credibility:</strong> Showing attention to detail and professionalism</li>
                </ul>
            `,
            exercises: [
                {
                    id: "punctuation-intro-1",
                    title: "Practice: Understanding Punctuation and Capitalization",
                    instructions: "Answer questions about why punctuation and capitalization matter.",
                    items: [
                        {
                            type: "radio",
                            label: "Why are punctuation and capitalization important?",
                            options: [
                                { value: "b", label: "They're only important in formal writing" },
                                { value: "a", label: "They make writing professional, clear, and show attention to detail" },
                                { value: "c", label: "They don't matter" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Where are punctuation and capitalization essential?",
                            options: [
                                { value: "b", label: "Only in emails" },
                                { value: "c", label: "Only in essays" },
                                { value: "a", label: "Professional communication, academic writing, clarity, credibility" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What happens without correct punctuation and capitalization?",
                            options: [
                                { value: "a", label: "Writing can be confusing or look careless" },
                                { value: "b", label: "Nothing happens" },
                                { value: "c", label: "Writing becomes clearer" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "end-punctuation",
            stepNumber: 1,
            title: "End Punctuation: . ? !",
            icon: "⏹️",
            explanation: `
                <h3>Three Types of End Punctuation</h3>

                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4 style="color: #7ba884;">Period (.) - Statements</h4>
                    <p>Use for statements and commands:</p>
                    <ul>
                        <li>I live in East Boston<strong>.</strong></li>
                        <li>Please submit your timesheet by Friday<strong>.</strong></li>
                        <li>The doctor said I need to rest<strong>.</strong></li>
                    </ul>
                </div>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4 style="color: #d97757;">Question Mark (?) - Questions</h4>
                    <p>Use for direct questions:</p>
                    <ul>
                        <li>Where do you live<strong>?</strong></li>
                        <li>Can you help me<strong>?</strong></li>
                        <li>What time is your appointment<strong>?</strong></li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>⚠️ BUT:</strong> Indirect questions use periods:</p>
                    <ul>
                        <li>I wonder where you live<strong>.</strong> (NOT ?)</li>
                        <li>She asked if I could help<strong>.</strong> (NOT ?)</li>
                    </ul>
                </div>

                <div style="background: rgba(244, 211, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4 style="color: #d4a843;">Exclamation Point (!) - Strong Emotion</h4>
                    <p>Use sparingly for strong emotion or urgency:</p>
                    <ul>
                        <li>Help<strong>!</strong></li>
                        <li>Watch out<strong>!</strong></li>
                        <li>I got the job<strong>!</strong></li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>⚠️ Caution:</strong> Don't overuse in professional writing!</p>
                </div>
            `,
            exercises: [
                {
                    id: "end-punctuation-1",
                    title: "Practice: End Punctuation",
                    instructions: "Choose the correct end punctuation for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: '"I live in East Boston" — choose: <span class=\'eg-punctuation\'>.</span> <span class=\'eg-punctuation\'>?</span> <span class=\'eg-punctuation\'>!</span>',
                            options: [
                                { value: "question", label: "Question mark (<span class='eg-punctuation'>?</span>) - question" },
                                { value: "period", label: "Period (<span class='eg-punctuation'>.</span>) - statement" },
                                { value: "exclamation", label: "Exclamation point (<span class='eg-punctuation'>!</span>) - strong emotion" },
                            ],
                            expectedAnswer: "period",
                        },
                        {
                            type: "radio",
                            label: '"Where do you live" — choose: <span class=\'eg-punctuation\'>.</span> <span class=\'eg-punctuation\'>?</span> <span class=\'eg-punctuation\'>!</span>',
                            options: [
                                { value: "period", label: "Period (<span class='eg-punctuation'>.</span>)" },
                                { value: "exclamation", label: "Exclamation point (<span class='eg-punctuation'>!</span>)" },
                                { value: "question", label: "Question mark (<span class='eg-punctuation'>?</span>) - direct question" },
                            ],
                            expectedAnswer: "question",
                        },
                        {
                            type: "radio",
                            label: '"I wonder where you live" (indirect question) — choose: <span class=\'eg-punctuation\'>.</span> <span class=\'eg-punctuation\'>?</span> <span class=\'eg-punctuation\'>!</span>',
                            options: [
                                { value: "period", label: "Period (<span class='eg-punctuation'>.</span>) - indirect question" },
                                { value: "question", label: "Question mark (<span class='eg-punctuation'>?</span>)" },
                                { value: "exclamation", label: "Exclamation point (<span class='eg-punctuation'>!</span>)" },
                            ],
                            expectedAnswer: "period",
                        },
                    ],
                },
            ],
        },

        {
            id: "commas",
            stepNumber: 2,
            title: "Commas (,)",
            icon: "📍",
            explanation: `
                <h3>When to Use Commas</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>1. Lists (3+ items)</h4>
                    <p>I need bread<strong>,</strong> milk<strong>,</strong> and eggs.</p>
                    <p>She speaks English<strong>,</strong> Spanish<strong>,</strong> and Portuguese.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>2. After introductory words/phrases</h4>
                    <p>However<strong>,</strong> I disagree.</p>
                    <p>After work<strong>,</strong> I'm going to the gym.</p>
                    <p>If I have time<strong>,</strong> I'll call you.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>3. Compound sentences (two independent clauses)</h4>
                    <p>I wanted to go<strong>,</strong> but I was too tired.</p>
                    <p>She studied hard<strong>,</strong> and she passed the test.</p>
                    <p>(Pattern: sentence<strong>,</strong> FANBOYS sentence)</p>
                    <p style="font-style: italic;">FANBOYS = for, and, nor, but, or, yet, so</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>4. Between city and state/country</h4>
                    <p>I live in Boston<strong>,</strong> Massachusetts.</p>
                    <p>He's from Chelsea<strong>,</strong> Massachusetts.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>5. Dates</h4>
                    <p>My appointment is on June 15<strong>,</strong> 2026.</p>
                    <p>(But: June 2026 - no comma when no day)</p>
                </div>
            `,
            tipBox: {
                title: "💡 Common Error",
                content: "DON'T use a comma between subject and verb: ❌ 'The doctor, said I need rest.' ✅ 'The doctor said I need rest.'",
            },
            exercises: [
                {
                    id: "punctuation-capitalization-commas-1",
                    title: "Practice: Using Commas",
                    instructions: "Choose the correctly punctuated sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Add commas (<span class='eg-punctuation'>,</span>) to this list: I need bread milk and eggs",
                            options: [
                                {
                                    value: "a",
                                    label: "I need bread<span class='eg-punctuation'>,</span> milk<span class='eg-punctuation'>,</span> and eggs<span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "I need bread milk and eggs<span class='eg-punctuation'>.</span>" },
                                { value: "c", label: "I need bread<span class='eg-punctuation'>,</span> milk and eggs<span class='eg-punctuation'>.</span>" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Add a comma (<span class='eg-punctuation'>,</span>) after the intro phrase: After work I'm taking the Blue Line home",
                            options: [
                                {
                                    value: "a",
                                    label: "After work<span class='eg-punctuation'>,</span> I<span class='eg-punctuation'>&apos;</span>m taking the Blue Line home<span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "After work I<span class='eg-punctuation'>&apos;</span>m taking the Blue Line home<span class='eg-punctuation'>.</span>" },
                                {
                                    value: "c",
                                    label: "After<span class='eg-punctuation'>,</span> work I<span class='eg-punctuation'>&apos;</span>m taking the Blue Line home<span class='eg-punctuation'>.</span>",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Add a comma (<span class='eg-punctuation'>,</span>) in this compound sentence: I wanted to go but I was too tired",
                            options: [
                                {
                                    value: "a",
                                    label: "I wanted to go<span class='eg-punctuation'>,</span> but I was too tired<span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "I wanted to go but I was too tired<span class='eg-punctuation'>.</span>" },
                                {
                                    value: "c",
                                    label: "I wanted<span class='eg-punctuation'>,</span> to go but I was too tired<span class='eg-punctuation'>.</span>",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Add a comma (<span class='eg-punctuation'>,</span>) in this date: My appointment is on June 15 2026",
                            options: [
                                {
                                    value: "a",
                                    label: "My appointment is on June 15<span class='eg-punctuation'>,</span> 2026<span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "My appointment is on June 15 2026<span class='eg-punctuation'>.</span>" },
                                { value: "c", label: "My appointment is on June<span class='eg-punctuation'>,</span> 15 2026<span class='eg-punctuation'>.</span>" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "apostrophes",
            stepNumber: 3,
            title: "Apostrophes (')",
            icon: "'",
            explanation: `
                <h3>Two Uses of Apostrophes</h3>

                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>1. Contractions (showing missing letters)</h4>
                    <p>do not → don<strong>'</strong>t</p>
                    <p>I am → I<strong>'</strong>m</p>
                    <p>she is → she<strong>'</strong>s</p>
                    <p>they are → they<strong>'</strong>re</p>
                    <p>cannot → can<strong>'</strong>t</p>
                    <p>will not → won<strong>'</strong>t</p>
                </div>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>2. Possession (showing ownership)</h4>
                    <p><strong>Singular nouns:</strong> add <strong>'s</strong></p>
                    <ul>
                        <li>the doctor<strong>'s</strong> office</li>
                        <li>Maria<strong>'s</strong> book</li>
                        <li>my boss<strong>'s</strong> email</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Plural nouns ending in -s:</strong> add <strong>'</strong> only</p>
                    <ul>
                        <li>the doctors<strong>'</strong> offices (multiple doctors)</li>
                        <li>my parents<strong>'</strong> house</li>
                        <li>the teachers<strong>'</strong> lounge</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Irregular plurals:</strong> add <strong>'s</strong></p>
                    <ul>
                        <li>children<strong>'s</strong> toys</li>
                        <li>women<strong>'s</strong> clothing</li>
                    </ul>
                </div>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ its' → ✅ <strong>its</strong> (possessive, no apostrophe!)</li>
                    <li>❌ it's book → ✅ <strong>its</strong> book (possessive)</li>
                    <li>✅ <strong>it's</strong> raining (it is raining - contraction)</li>
                    <li>❌ your' → ✅ <strong>your</strong> (possessive, no apostrophe!)</li>
                    <li>❌ you're book → ✅ <strong>your</strong> book (possessive)</li>
                    <li>✅ <strong>you're</strong> late (you are late - contraction)</li>
                </ul>
            `,
            tipBox: {
                title: "⚠️ Critical Rule",
                content: "Never use apostrophes to make plurals! ❌ apple's → ✅ apples (plural, no apostrophe)",
            },
            exercises: [
                {
                    id: "punctuation-capitalization-apostrophes-1",
                    title: "Practice: Using Apostrophes",
                    instructions: "Choose the correct apostrophe usage for contractions and possession.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence uses an apostrophe (<span class='eg-punctuation'>&apos;</span>) correctly for a contraction?",
                            options: [
                                { value: "b", label: "Im going to the store." },
                                { value: "a", label: "I<span class='eg-punctuation'>&apos;</span>m going to the store<span class='eg-punctuation'>.</span>" },
                                { value: "c", label: "I,m going to the store." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence uses an apostrophe (<span class='eg-punctuation'>&apos;</span>) correctly for possession?",
                            options: [
                                {
                                    value: "a",
                                    label: "The doctor<span class='eg-punctuation'>&apos;</span>s office is on <span class='eg-capital'>Bennington Street</span><span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "The doctors office is on Bennington Street." },
                                {
                                    value: "c",
                                    label: "The doctors<span class='eg-punctuation'>&apos;</span> office is on Bennington Street<span class='eg-punctuation'>.</span>",
                                },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly shows plural possession?",
                            options: [
                                {
                                    value: "a",
                                    label: "The doctors<span class='eg-punctuation'>&apos;</span> offices are on Bennington Street<span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "The doctors's offices are on Bennington Street." },
                                { value: "c", label: "The doctors offices are on Bennington Street." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses 'its' vs 'it's'?",
                            options: [
                                {
                                    value: "a",
                                    label: "The dog wagged its tail<span class='eg-punctuation'>.</span> It<span class='eg-punctuation'>&apos;</span>s raining<span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "The dog wagged it's tail." },
                                { value: "c", label: "Its raining." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "capitalization",
            stepNumber: 4,
            title: "Capitalization Rules",
            icon: "🔤",
            explanation: `
                <h3>When to Use Capital Letters</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>1. Beginning of sentences</h4>
                    <p><strong>T</strong>he doctor said I need to rest.</p>
                    <p><strong>I</strong> live in East Boston.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>2. The pronoun "I"</h4>
                    <p>My friend and <strong>I</strong> went to the store.</p>
                    <p><strong>I</strong> am a student.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>3. Proper nouns (specific names)</h4>
                    <p><strong>People:</strong> Maria, Dr. Smith, President Biden</p>
                    <p><strong>Places:</strong> East Boston, Massachusetts, United States, Bennington Street</p>
                    <p><strong>Days/Months:</strong> Monday, January (NOT seasons: spring, summer)</p>
                    <p><strong>Organizations:</strong> Bunker Hill Community College, Google, Red Cross</p>
                    <p><strong>Languages/Nationalities:</strong> English, Spanish, American, Mexican</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>4. Titles (when before a name)</h4>
                    <p><strong>Doctor</strong> Smith (✓ - title before name)</p>
                    <p>my doctor (✗ - no capital, not before name)</p>
                    <p><strong>Professor</strong> Johnson</p>
                    <p>my professor</p>
                </div>

                <h3>When NOT to Capitalize</h3>
                <ul>
                    <li><strong>Seasons:</strong> spring, summer, fall, winter</li>
                    <li><strong>General nouns:</strong> the hospital, the university, my doctor</li>
                    <li><strong>Job titles alone:</strong> I am a teacher. (NOT Teacher)</li>
                    <li><strong>Subjects (except languages):</strong> math, science, history (BUT: English, Spanish)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "punctuation-capitalization-capitalization-1",
                    title: "Practice: Capitalization Rules",
                    instructions: "Choose the correct capitalization for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence capitalizes correctly?",
                            options: [
                                {
                                    value: "a",
                                    label: "<span class='eg-capital'>I</span> live in <span class='eg-capital'>East Boston</span><span class='eg-punctuation'>,</span> <span class='eg-capital'>Massachusetts</span><span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "I live in east boston, massachusetts." },
                                { value: "c", label: "I Live In East Boston, Massachusetts." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence capitalizes the title correctly?",
                            options: [
                                { value: "b", label: "doctor Rivera is my Doctor." },
                                { value: "c", label: "Doctor Rivera is my Doctor." },
                                { value: "a", label: "<span class='eg-capital'>Doctor</span> Rivera is my doctor<span class='eg-punctuation'>.</span>" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly capitalizes seasons?",
                            options: [
                                { value: "a", label: "I love spring and summer." },
                                { value: "b", label: "I love Spring and Summer." },
                                { value: "c", label: "I Love Spring And Summer." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly capitalizes subjects?",
                            options: [
                                { value: "b", label: "I study Math, Science, and english." },
                                { value: "a", label: "I study math, science, and English." },
                                { value: "c", label: "I study math, science, and english." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "quotation-marks",
            stepNumber: 5,
            title: "Quotation Marks (\" \")",
            icon: "💬",
            explanation: `
                <h3>When to Use Quotation Marks</h3>

                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>1. Direct Speech (exact words)</h4>
                    <p>The doctor said, <strong>"You need to rest."</strong></p>
                    <p><strong>"I feel better,"</strong> she said.</p>
                    <p>He asked, <strong>"When is your appointment?"</strong></p>
                </div>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>2. Punctuation with Quotation Marks</h4>
                    <p><strong>Periods and commas:</strong> INSIDE the quotes</p>
                    <ul>
                        <li>She said, "I'm tired<strong>."</strong></li>
                        <li>"I'll call you later<strong>,"</strong> he said.</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Question marks and exclamation points:</strong></p>
                    <ul>
                        <li>If the quote is a question: "Where are you<strong>?"</strong> she asked.</li>
                        <li>If the sentence is a question: Did she say "I'm tired"<strong>?</strong></li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "punctuation-capitalization-quotation-marks-1",
                    title: "Practice: Using Quotation Marks",
                    instructions: "Choose the correct use of quotation marks.",
                    items: [
                        {
                            type: "radio",
                            label: "When should you use quotation marks?",
                            options: [
                                { value: "b", label: "For all sentences" },
                                { value: "c", label: "Only for questions" },
                                { value: "a", label: "For direct speech (exact words someone said)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
	                            label: "Which sentence uses quotation marks correctly?",
	                            options: [
	                                {
	                                    value: "a",
	                                    label: "The nurse said<span class='eg-punctuation'>,</span> \"You need to rest<span class='eg-punctuation'>.</span>\"",
	                                },
	                                { value: "b", label: 'The nurse said, "You need to rest".' },
	                                { value: "c", label: 'The nurse said "You need to rest".' },
	                            ],
	                            expectedAnswer: "a",
	                        },
                        {
                            type: "radio",
                            label: "Where does the comma go when a quote comes before 'she said'?",
                            options: [
                                { value: "a", label: 'Inside the quotes - "I&apos;ll call you later<span class=\'eg-punctuation\'>,</span>" he said<span class=\'eg-punctuation\'>.</span>' },
                                { value: "b", label: 'Outside the quotes - "I&apos;ll call you later"<span class=\'eg-punctuation\'>,</span> he said<span class=\'eg-punctuation\'>.</span>' },
                                { value: "c", label: "No comma needed" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Where does the question mark go when the quote itself is a question?",
                            options: [
                                { value: "a", label: 'Inside the quotes - "Where are you<span class=\'eg-punctuation\'>?</span>" she asked<span class=\'eg-punctuation\'>.</span>' },
                                { value: "b", label: 'Outside the quotes - "Where are you"<span class=\'eg-punctuation\'>?</span> she asked<span class=\'eg-punctuation\'>.</span>' },
                                { value: "c", label: "No question mark needed" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "practice",
            title: "Editing Practice",
            icon: "✏️",
            exercises: [
                {
                    id: "punctuation-capitalization-ex-1",
                    title: "Exercise 1: Commas in a List",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Add commas (<span class='eg-punctuation'>,</span>): I need bread milk and eggs",
                            options: [
                                {
                                    value: "a",
                                    label: "I need bread<span class='eg-punctuation'>,</span> milk<span class='eg-punctuation'>,</span> and eggs<span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "I need bread milk and eggs." },
                                { value: "c", label: "I need bread, milk and eggs" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-2",
                    title: "Exercise 2: Capital Letters",
                    instructions: "Choose the correctly capitalized sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix capitalization: i live in east boston, massachusetts.",
                            options: [
                                {
                                    value: "a",
                                    label: "<span class='eg-capital'>I</span> live in <span class='eg-capital'>East Boston</span><span class='eg-punctuation'>,</span> <span class='eg-capital'>Massachusetts</span><span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "I live in east boston, massachusetts." },
                                { value: "c", label: "i live in East Boston, Massachusetts." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-3",
                    title: "Exercise 3: Apostrophes (Contractions + Possessive)",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Add apostrophes: Thats my doctors office.",
                            options: [
                                { value: "a", label: "That's my doctor's office." },
                                { value: "b", label: "Thats my doctors office." },
                                { value: "c", label: "That's my doctors office." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-4",
                    title: "Exercise 4: Quotation Marks",
                    instructions: "Choose the correctly punctuated sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: The teacher said bring your notebook (add quotation marks)",
                            options: [
                                { value: "a", label: 'The teacher said<span class=\'eg-punctuation\'>,</span> "Bring your notebook<span class=\'eg-punctuation\'>.</span>"' },
                                { value: "b", label: 'The teacher said "Bring your notebook".' },
                                { value: "c", label: "The teacher said, bring your notebook." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-5",
                    title: "Exercise 5: Comma After an Intro Clause",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Add a comma (<span class='eg-punctuation'>,</span>): If I have time I'll call you.",
                            options: [
                                { value: "b", label: "If I have time I'll call you." },
                                { value: "a", label: "If I have time<span class='eg-punctuation'>,</span> I<span class='eg-punctuation'>&apos;</span>ll call you<span class='eg-punctuation'>.</span>" },
                                { value: "c", label: "If I have time; I'll call you." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-6",
                    title: "Exercise 6: Possessive (Children's)",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: The childrens toys are in the box.",
                            options: [
                                { value: "b", label: "The childrens toys are in the box." },
                                { value: "c", label: "The childrens' toys are in the box." },
                                { value: "a", label: "The children's toys are in the box." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-7",
                    title: "Exercise 7: Proper Nouns",
                    instructions: "Choose the correctly capitalized sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Capitalize correctly: i study english and math at bunker hill community college.",
                            options: [
                                { value: "a", label: "I study English and math at Bunker Hill Community College." },
                                { value: "b", label: "I study english and Math at bunker hill community college." },
                                { value: "c", label: "i study English and math at Bunker hill Community college." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-8",
                    title: "Exercise 8: It's vs Its",
                    instructions: "Choose the correct sentence (it is = it's).",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: Its a beautiful day. (it is a beautiful day)",
                            options: [
                                { value: "b", label: "Its a beautiful day." },
                                { value: "a", label: "It's a beautiful day." },
                                { value: "c", label: "It's a beautiful day" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Quick Reference Guide",
            icon: "📋",
            explanation: `
                <h3>End Punctuation</h3>
                <ul>
                    <li><strong>Period (.):</strong> Statements and commands</li>
                    <li><strong>Question Mark (?):</strong> Direct questions only</li>
                    <li><strong>Exclamation Point (!):</strong> Strong emotion (use sparingly)</li>
                </ul>

                <h3>Commas (,)</h3>
                <ul>
                    <li>Lists: bread, milk, and eggs</li>
                    <li>After intro: However, I disagree.</li>
                    <li>Compound: I tried, but I failed.</li>
                    <li>Location: Chelsea, Massachusetts</li>
                    <li>Dates: June 15, 2026</li>
                </ul>

                <h3>Apostrophes (')</h3>
                <ul>
                    <li>Contractions: don't, I'm, she's</li>
                    <li>Singular possessive: doctor's office</li>
                    <li>Plural possessive (ending in -s): doctors' offices</li>
                    <li>Irregular plural possessive: children's toys</li>
                </ul>

                <h3>Capitalization</h3>
                <ul>
                    <li>Beginning of sentences</li>
                    <li>Pronoun "I"</li>
                    <li>Proper nouns (names, places, organizations)</li>
                    <li>Days/months (NOT seasons)</li>
                    <li>Languages/nationalities</li>
                    <li>Titles before names</li>
                </ul>

                <h3>Common Errors</h3>
                <ul>
                    <li>❌ its' → ✅ its (possessive)</li>
                    <li>❌ it's book → ✅ its book / it's = it is</li>
                    <li>❌ apple's → ✅ apples (plural, no apostrophe!)</li>
                    <li>❌ i live in east boston → ✅ I live in East Boston</li>
                    <li>❌ I study Math and english → ✅ I study math and English</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Pro Tip",
                content: "Read your writing out loud. Pause at commas, stop at periods, and listen for questions (?).",
            },
            exercises: [
                {
                    id: "punctuation-capitalization-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of punctuation and capitalization rules.",
                    items: [
                        {
                            type: "radio",
                            label: "When do you use a period (.)?",
                            options: [
                                { value: "b", label: "For questions only" },
                                { value: "c", label: "For strong emotions" },
                                { value: "a", label: "For statements and commands" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When do you use a comma in a compound sentence?",
                            options: [
                                { value: "a", label: "Before FANBOYS (for, and, nor, but, or, yet, so) connecting two independent clauses" },
                                { value: "b", label: "After every verb" },
                                { value: "c", label: "Never use commas in compound sentences" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the difference between 'its' and 'it's'?",
                            options: [
                                { value: "b", label: "They mean the same thing" },
                                { value: "a", label: "'its' = possessive (no apostrophe) | 'it's' = contraction for 'it is'" },
                                { value: "c", label: "'its' = contraction | 'it's' = possessive" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What should be capitalized?",
                            options: [
                                { value: "b", label: "Only the first word of every sentence" },
                                { value: "c", label: "All nouns" },
                                { value: "a", label: "Beginning of sentences, pronoun 'I', proper nouns, days/months, languages/nationalities, titles before names" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "That's my doctor's office." },
                                { value: "b", label: "Thats my doctors office." },
                                { value: "c", label: "That's my doctors' office." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

	    // Mini Quiz (15 questions)
	    miniQuiz: [
	        {
	            id: "quiz-1",
	            question:
	                "Which needs a comma? 'I wanted to go to class but the Blue Line was delayed.'",
	            options: [
	                { value: "a", label: "No comma needed" },
	                { value: "b", label: "After 'class'" },
	                { value: "c", label: "After 'but'" },
	            ],
	            correctAnswer: "b",
	            explanation:
	                "This is a compound sentence with two complete ideas. Use a comma before FANBOYS: 'I wanted to go to class, but the Blue Line was delayed.'",
	            skillTag: "comma-compound-fanboys",
	            difficulty: "medium",
	        },
	        {
	            id: "quiz-2",
	            question: "Which is correct?",
	            options: [
	                { value: "a", label: "That's my doctors office." },
	                { value: "b", label: "Thats my doctor's office." },
	                { value: "c", label: "That's my doctor's office." },
	            ],
	            correctAnswer: "c",
	            explanation:
	                "You need apostrophes for both: 'That's' (that is) and 'doctor's' (possessive).",
	            skillTag: "apostrophe-contraction-plus-possession",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-3",
	            question: "Which is capitalized correctly?",
	            options: [
	                { value: "c", label: "I study English at Bunker Hill Community College." },
	                { value: "a", label: "i study english at bunker hill community college." },
	                { value: "b", label: "I study English at bunker hill community college." },
	            ],
	            correctAnswer: "c",
	            explanation:
	                "Capitalize the pronoun I, languages, and proper names of schools: Bunker Hill Community College.",
	            skillTag: "capitalization-proper-nouns-school-language",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-4",
	            question: "What's wrong? 'The childrens toys are here.'",
	            options: [
	                { value: "a", label: "Nothing, it's correct" },
	                { value: "b", label: "Needs apostrophe: children's" },
	                { value: "c", label: "Should be: childrens'" },
	            ],
	            correctAnswer: "b",
	            explanation:
	                "Irregular plurals add 's for possession: 'The children's toys are here.'",
	            skillTag: "apostrophe-irregular-plural-childrens",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-5",
	            question: "Which is correct?",
	            options: [
	                { value: "a", label: "Its a beautiful day." },
	                { value: "c", label: "Its' a beautiful day." },
	                { value: "b", label: "It's a beautiful day." },
	            ],
	            correctAnswer: "b",
	            explanation:
	                "'It's' is the contraction for 'it is'. 'Its' is possessive and has no apostrophe.",
	            skillTag: "apostrophe-its-vs-its",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-6",
	            question: "Where do commas go? 'I need bread milk eggs and cheese.'",
	            options: [
	                { value: "a", label: "After bread, milk, and eggs" },
	                { value: "b", label: "After bread and milk only" },
	                { value: "c", label: "No commas needed" },
	            ],
	            correctAnswer: "a",
	            explanation:
	                "Lists with three or more items need commas: 'I need bread, milk, eggs, and cheese.'",
	            skillTag: "comma-list-items",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-7",
	            question:
	                "Which end punctuation is correct? 'I wonder where Maverick Station is___'",
	            options: [
	                { value: "b", label: "Question mark (?)" },
	                { value: "a", label: "Period (.)" },
	                { value: "c", label: "Exclamation point (!)" },
	            ],
	            correctAnswer: "a",
	            explanation:
	                "This is an indirect question inside a statement, so it ends with a period, not a question mark.",
	            skillTag: "end-punctuation-indirect-question",
	            difficulty: "medium",
	        },
	        {
	            id: "quiz-8",
	            question:
	                "Where should the comma go? 'After work ___ I'm taking the Blue Line home.'",
	            options: [
	                { value: "b", label: "After 'Line'" },
	                { value: "c", label: "No comma needed" },
	                { value: "a", label: "After 'After work'" },
	            ],
	            correctAnswer: "a",
	            explanation:
	                "Put a comma after an introductory phrase: 'After work, I'm taking the Blue Line home.'",
	            skillTag: "comma-after-intro-phrase",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-9",
	            question: "Which is correct?",
	            options: [
	                { value: "b", label: "I live in Chelsea, Massachusetts." },
	                { value: "a", label: "I live in Chelsea Massachusetts." },
	                { value: "c", label: "I live in Chelsea, massachusetts." },
	            ],
	            correctAnswer: "b",
	            explanation:
	                "Use a comma between city and state, and capitalize the state name: Chelsea, Massachusetts.",
	            skillTag: "capitalization-city-state-comma",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-10",
	            question: "Which sentence uses quotation marks correctly?",
	            options: [
	                { value: "a", label: 'The teacher said, "Bring your notebook."' },
	                { value: "b", label: 'The teacher said, "Bring your notebook".' },
	                { value: "c", label: 'The teacher said "Bring your notebook".' },
	            ],
	            correctAnswer: "a",
	            explanation:
	                "For direct speech, use quotation marks and put the period inside the quotes.",
	            skillTag: "quotation-marks-direct-speech-period-inside",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-11",
	            question: "Which sentence is capitalized correctly?",
	            options: [
	                { value: "b", label: "We have class on monday." },
	                { value: "a", label: "We have class on Monday." },
	                { value: "c", label: "We Have Class On Monday." },
	            ],
	            correctAnswer: "a",
	            explanation:
	                "Capitalize days of the week and only the first word of the sentence.",
	            skillTag: "capitalization-days-of-week",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-12",
	            question: "Which sentence is correct?",
	            options: [
	                { value: "b", label: "I like Spring and Fall." },
	                { value: "c", label: "I Like spring and fall." },
	                { value: "a", label: "I like spring and fall." },
	            ],
	            correctAnswer: "a",
	            explanation:
	                "Seasons are not capitalized in English unless they start a sentence.",
	            skillTag: "capitalization-seasons-lowercase",
	            difficulty: "easy",
	        },
	        {
	            id: "quiz-13",
	            question: "Which shows plural possession (more than one nurse)?",
	            options: [
	                { value: "b", label: "the nurses' station" },
	                { value: "a", label: "the nurse's station" },
	                { value: "c", label: "the nurses station" },
	            ],
	            correctAnswer: "b",
	            explanation:
	                "Plural nouns ending in -s add an apostrophe after the s for possession: nurses' station.",
	            skillTag: "apostrophe-plural-possession-nurses",
	            difficulty: "medium",
	        },
	        {
	            id: "quiz-14",
	            question: "Choose the correct word: 'The bus changed ___ route today.'",
	            options: [
	                { value: "b", label: "it's" },
	                { value: "a", label: "its" },
	                { value: "c", label: "its'" },
	            ],
	            correctAnswer: "a",
	            explanation:
	                "'Its' is possessive and means the route belongs to the bus. 'It's' means 'it is'.",
	            skillTag: "apostrophe-its-possessive-thing",
	            difficulty: "medium",
	        },
	        {
	            id: "quiz-15",
	            question:
	                "You email your supervisor. Which ending punctuation is most professional?",
	            options: [
	                { value: "a", label: "Please call me!" },
	                { value: "c", label: "Please call me??" },
	                { value: "b", label: "Please call me." },
	            ],
	            correctAnswer: "b",
	            explanation:
	                "In professional writing, use periods for a calm, clear tone. Avoid extra punctuation like exclamation points or double question marks.",
	            skillTag: "tone-professional-ending-punctuation",
	            difficulty: "medium",
	        },
	    ],

	    /*
	    TEACHER DIAGNOSTIC NOTES – Punctuation and Capitalization Mini Quiz

	    This mini quiz checks whether students can:
	    - Use commas correctly in lists, after introductory phrases, and in compound sentences.
	    - Use apostrophes correctly for contractions, regular plural possession, and irregular plural possession.
	    - Distinguish between its and it's in different contexts.
	    - Apply capitalization rules for proper nouns, cities and states, days, seasons, and school names.
	    - Choose correct end punctuation for indirect questions and professional emails.
	    - Use quotation marks correctly for direct speech.

	    Skill tags:

	    Commas
	    - comma-compound-fanboys
	    - comma-list-items
	    - comma-after-intro-phrase

	    Apostrophes
	    - apostrophe-contraction-plus-possession
	    - apostrophe-irregular-plural-childrens
	    - apostrophe-its-vs-its
	    - apostrophe-plural-possession-nurses
	    - apostrophe-its-possessive-thing

	    Capitalization
	    - capitalization-proper-nouns-school-language
	    - capitalization-city-state-comma
	    - capitalization-days-of-week
	    - capitalization-seasons-lowercase

	    End punctuation and tone
	    - end-punctuation-indirect-question
	    - tone-professional-ending-punctuation

	    Quotation marks
	    - quotation-marks-direct-speech-period-inside

	    How to read the diagnostics:
	    - If comma tags are weak (comma-compound-fanboys, comma-list-items, comma-after-intro-phrase) →
	      Go back to the three core patterns:
	      • Lists: item, item, and item.
	      • Intro phrase + comma: After work, I take the Blue Line.
	      • Compound sentence: sentence, but sentence.
	      Have students read sentences out loud and raise a hand where they feel a natural pause. Then show that most natural pauses are commas, not random.

	    - If apostrophe tags are weak (apostrophe-contraction-plus-possession, apostrophe-irregular-plural-childrens, apostrophe-plural-possession-nurses, apostrophe-its-vs-its, apostrophe-its-possessive-thing) →
	      Build a simple chart:
	      • Contractions: it is → it's, that is → that's.
	      • Singular possession: doctor's office.
	      • Plural possession: nurses' station.
	      • Irregular plural possession: children's toys, women's clothing.
	      • Its vs it's: its tail (belongs to it) versus it's raining (it is raining).
	      Give quick correction drills with real phrases from class or workplace English.

	    - If capitalization tags are weak (capitalization-proper-nouns-school-language, capitalization-city-state-comma, capitalization-days-of-week, capitalization-seasons-lowercase) →
	      Rebuild the capitalization list:
	      • Always: first word of sentences, I, names of people, cities, countries, languages, schools, organizations, days and months.
	      • Not usually: seasons, jobs, school subjects except languages.
	      Use student information sheets. Have them write three sentences about themselves and then edit only for capital letters.

	    - If end punctuation and tone tags are weak (end-punctuation-indirect-question, tone-professional-ending-punctuation) →
	      Contrast pairs:
	      • Direct question: Where do you live?
	      • Indirect: I wonder where you live.
	      Have students transform questions into indirect statements and choose period versus question mark.
	      For tone, compare email endings: Please call me. versus Please call me!! and talk about how the punctuation changes the feeling.

	    - If quotation mark tags are weak (quotation-marks-direct-speech-period-inside) →
	      Use color to separate the reporting verb from the quote:
	      • The teacher said, "Bring your notebook."
	      Show that:
	      • Commas and periods stay inside the quotes in American English.
	      • Capitalize the first word inside the quotation when it is a full sentence.

	    Suggested use:
	    - Use this mini quiz after students have worked through the end punctuation, commas, apostrophes, capitalization, and quotation mark sections.
	    - At the class level:
	      • If commas and apostrophes are red, slow down and do short daily editing warm ups with one or two sentences.
	      • If capitalization is red, have students rewrite a short paragraph with no capital letters and fix it together.
	      • If punctuation and tone are red, practice rewriting texts and WhatsApp messages into more professional email style.
	    */
};
