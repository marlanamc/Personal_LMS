import type { InteractiveGuideContent } from "@/types/activity";

export const paragraphFormatContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Paragraph Format: Building Strong Paragraphs",
            icon: "📄",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">A paragraph is more than just a bunch of sentences! It has a clear structure: topic sentence → supporting details → conclusion. Strong paragraphs make your writing clear, organized, and professional.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Good paragraph structure is essential for:</p>
                <ul>
                    <li><strong>Academic writing:</strong> Essays, reports, and assignments</li>
                    <li><strong>Professional communication:</strong> Emails, reports, and proposals</li>
                    <li><strong>Clarity:</strong> Helping readers follow your ideas</li>
                    <li><strong>Organization:</strong> Presenting information logically</li>
                </ul>
            `,
            exercises: [
                {
                    id: "paragraph-intro-1",
                    title: "Practice: Understanding Paragraph Structure",
                    instructions: "Read each statement and identify what it describes about paragraphs.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the main purpose of a paragraph?",
                            options: [
                                { value: "b", label: "To include as many ideas as possible" },
                                { value: "a", label: "To present ONE main idea clearly" },
                                { value: "c", label: "To use complex vocabulary" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What are the three parts of a paragraph?",
                            options: [
                                { value: "b", label: "Introduction, middle, end" },
                                { value: "c", label: "First sentence, second sentence, last sentence" },
                                { value: "a", label: "Topic sentence, supporting details, conclusion sentence" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When should you start a new paragraph?",
                            options: [
                                { value: "a", label: "When you have a new main idea" },
                                { value: "b", label: "After every sentence" },
                                { value: "c", label: "Only at the end of a page" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "what-is-paragraph",
            stepNumber: 1,
            title: "What Is a Paragraph?",
            icon: "❓",
            explanation: `
                <h3>Definition</h3>
                <p>A <strong>paragraph</strong> is a group of sentences about <strong>ONE main idea</strong>.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>The Three-Part Structure:</h4>
                    <ol style="font-size: 1.125rem;">
                        <li><strong>Topic Sentence</strong> - introduces the main idea</li>
                        <li><strong>Supporting Details</strong> - explain, describe, or prove the main idea (3-5 sentences)</li>
                        <li><strong>Conclusion Sentence</strong> - wraps up or restates the main idea</li>
                    </ol>
                </div>

                <h3>Example Paragraph</h3>
                <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 2px solid #7ba884; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #7ba884; margin: 0 0 0.5rem 0;">Topic Sentence:</p>
                    <p style="margin: 0 0 1rem 0; padding-left: 1rem; border-left: 3px solid #7ba884;"><span class='eg-verb'>Exercise</span> <span class='eg-helper'>is</span> important for good health.</p>

                    <p style="font-weight: bold; color: #d97757; margin: 1rem 0 0.5rem 0;">Supporting Details:</p>
                    <p style="margin: 0 0 0.5rem 0; padding-left: 1rem; border-left: 3px solid #d97757;">First, it helps you walk from Maverick Station to the Harborwalk. Second, it reduces stress after a long Blue Line commute and makes you feel happier. Finally, it lowers your risk of health problems like diabetes and heart disease.</p>

                    <p style="font-weight: bold; color: #d4a843; margin: 1rem 0 0.5rem 0;">Conclusion Sentence:</p>
                    <p style="margin: 0; padding-left: 1rem; border-left: 3px solid #d4a843;">For these reasons, everyone should try to exercise at least 30 minutes a day.</p>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "ONE paragraph = ONE main idea. If you have a new idea, start a new paragraph!",
            },
            exercises: [
                {
                    id: "what-is-paragraph-1",
                    title: "Practice: Identifying Paragraph Parts",
                    instructions: "Read the example paragraph and identify which part is which.",
                    items: [
                        {
                            type: "radio",
                            label: "In the example paragraph, which sentence is the topic sentence?",
                            options: [
                                { value: "b", label: "First, it helps you lose weight and stay in shape." },
                                { value: "a", label: "Exercise is important for good health." },
                                { value: "c", label: "For these reasons, everyone should try to exercise at least 30 minutes a day." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "How many supporting detail sentences are in a typical paragraph?",
                            options: [
                                { value: "b", label: "1-2 sentences" },
                                { value: "c", label: "10 or more sentences" },
                                { value: "a", label: "3-5 sentences" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What does the conclusion sentence do?",
                            options: [
                                { value: "a", label: "Wraps up or restates the main idea" },
                                { value: "b", label: "Introduces a new topic" },
                                { value: "c", label: "Asks a question" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "topic-sentence",
            stepNumber: 2,
            title: "Topic Sentence: The Main Idea",
            icon: "🎯",
            explanation: `
                <h3>What Is a Topic Sentence?</h3>
                <p>The <strong>topic sentence</strong> is the FIRST sentence of a paragraph. It tells the reader what the paragraph is about.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Characteristics of a Good Topic Sentence:</h4>
                    <ul>
                        <li>✅ States the main idea clearly</li>
                        <li>✅ Is a complete sentence (subject + verb)</li>
                        <li>✅ Is not too specific (needs room for details)</li>
                        <li>✅ Is not too general (needs a clear focus)</li>
                    </ul>
                </div>

                <h3>Good vs Bad Topic Sentences</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">❌ Too General</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">✅ Just Right</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">East Boston <span class='eg-verb'>exercise</span> is good.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><span class='eg-verb'>Exercise</span> is important for good health.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Food is important.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Eating breakfast helps you concentrate on the Blue Line commute.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I like things.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I enjoy walking along the Harborwalk every morning.</td>
                        </tr>
                    </tbody>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">❌ Too Specific</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">✅ Just Right</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I walk for exactly 32 minutes.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Walking along the Harborwalk has many health benefits.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">On Tuesday I ate oatmeal at 7:15am at the community center.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Eating a healthy breakfast improves my energy.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "topic-sentence-1",
                    title: "Practice: Good vs Bad Topic Sentences",
                    instructions: "Choose which topic sentence is better and why.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is a better topic sentence?",
                            options: [
                                {
                                    value: "a",
                                    label: "<span class='eg-verb'>Exercise</span> <span class='eg-helper'>is</span> important for good health on the Harborwalk.",
                                },
                                { value: "b", label: "<span class='eg-verb'>Exercise</span> <span class='eg-helper'>is</span> good." },
                                { value: "c", label: "Things." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Why is 'Exercise is good' not a good topic sentence?",
                            options: [
                                { value: "b", label: "It's too long" },
                                { value: "a", label: "It's too general and doesn't give a clear focus" },
                                { value: "c", label: "It uses the wrong words" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What makes a good topic sentence?",
                            options: [
                                { value: "b", label: "Uses difficult vocabulary" },
                                { value: "c", label: "Is very short" },
                                { value: "a", label: "States the main idea clearly, is complete, not too specific or general" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "supporting-details",
            stepNumber: 3,
            title: "Supporting Details: The Body",
            icon: "📝",
            explanation: `
                <h3>What Are Supporting Details?</h3>
                <p><strong>Supporting details</strong> are sentences that explain, describe, or prove your topic sentence. They make up the "body" of the paragraph.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Types of Supporting Details:</h4>
                    <ul>
                        <li><strong>Examples:</strong> "For example, I walk 30 minutes every day."</li>
                        <li><strong>Reasons:</strong> "First, it helps me lose weight."</li>
                        <li><strong>Facts:</strong> "Exercise reduces the risk of heart disease."</li>
                        <li><strong>Personal experience:</strong> "When I started walking, I felt less stressed."</li>
                    </ul>
                </div>

                <h3>How Many Supporting Details?</h3>
                <p>Usually <strong>3-5 sentences</strong> - enough to fully explain your main idea.</p>

                <h3>Using Transition Words</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p><strong>Transition words help connect your ideas:</strong></p>
                    <ul>
                        <li><strong>Listing:</strong> First, Second, Third, Finally</li>
                        <li><strong>Adding:</strong> Also, In addition, Furthermore</li>
                        <li><strong>Giving examples:</strong> For example, For instance</li>
                        <li><strong>Showing results:</strong> Therefore, As a result, Consequently</li>
                    </ul>
                </div>

                <h3>Example: Supporting Details with Transitions</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; margin: 0 0 0.5rem 0;">Topic: Exercise is important for good health.</p>
                    <p><strong>First,</strong> it helps you lose weight and stay in shape. <strong>Second,</strong> exercise reduces stress and makes you feel happier. <strong>Finally,</strong> it lowers your risk of serious diseases like diabetes and heart disease.</p>
                </div>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "ALL supporting details must relate to your topic sentence. If a sentence doesn't support the main idea, delete it or move it to a different paragraph!",
            },
            exercises: [
                {
                    id: "supporting-details-1",
                    title: "Practice: Understanding Supporting Details",
                    instructions: "Answer questions about supporting details.",
                    items: [
                        {
                            type: "radio",
                            label: "What are supporting details?",
                            options: [
                                { value: "a", label: "Sentences that explain, describe, or prove the topic sentence" },
                                { value: "b", label: "The first sentence of a paragraph" },
                                { value: "c", label: "The last sentence of a paragraph" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "How many supporting detail sentences are usually in a paragraph?",
                            options: [
                                { value: "b", label: "1-2 sentences" },
                                { value: "a", label: "3-5 sentences" },
                                { value: "c", label: "10 or more sentences" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What do transition words do?",
                            options: [
                                { value: "b", label: "Replace the topic sentence" },
                                { value: "c", label: "Are not necessary" },
                                { value: "a", label: "Help connect ideas and organize supporting details" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "conclusion-sentence",
            stepNumber: 4,
            title: "Conclusion Sentence: Wrapping Up",
            icon: "🏁",
            explanation: `
                <h3>What Is a Conclusion Sentence?</h3>
                <p>The <strong>conclusion sentence</strong> is the LAST sentence of a paragraph. It wraps up the paragraph by restating the main idea or summarizing the key points.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem;">
                    <h4>Ways to Write a Conclusion Sentence:</h4>
                    <ol>
                        <li><strong>Restate the topic sentence</strong> (in different words)</li>
                        <li><strong>Summarize key points</strong></li>
                        <li><strong>Give a final thought</strong> or recommendation</li>
                    </ol>
                </div>

                <h3>Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Topic: Exercise is important for good health.</p>
                    <p style="margin-top: 0.5rem;"><strong>Option 1 (Restate):</strong> For these reasons, exercise is essential for staying healthy.</p>
                    <p style="margin-top: 0.5rem;"><strong>Option 2 (Recommend):</strong> Everyone should try to exercise at least 30 minutes a day.</p>
                    <p style="margin-top: 0.5rem;"><strong>Option 3 (Summary):</strong> In short, regular exercise helps you lose weight, reduce stress, and prevent disease.</p>
                </div>

                <h3>Common Conclusion Starters</h3>
                <ul>
                    <li>For these reasons,...</li>
                    <li>In conclusion,...</li>
                    <li>In short,...</li>
                    <li>Therefore,...</li>
                    <li>As a result,...</li>
                    <li>That is why...</li>
                </ul>
            `,
            exercises: [
                {
                    id: "conclusion-sentence-1",
                    title: "Practice: Understanding Conclusion Sentences",
                    instructions: "Answer questions about conclusion sentences.",
                    items: [
                        {
                            type: "radio",
                            label: "What is a conclusion sentence?",
                            options: [
                                { value: "a", label: "The last sentence that wraps up the paragraph by restating the main idea or summarizing key points" },
                                { value: "b", label: "The first sentence of a paragraph" },
                                { value: "c", label: "A supporting detail" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What are ways to write a conclusion sentence?",
                            options: [
                                { value: "b", label: "Introduce a new topic" },
                                { value: "a", label: "Restate the topic sentence, summarize key points, or give a final thought/recommendation" },
                                { value: "c", label: "Ask a question" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which is a good conclusion starter?",
                            options: [
                                { value: "b", label: "First..." },
                                { value: "c", label: "For example..." },
                                { value: "a", label: "For these reasons..." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "unity-coherence",
            stepNumber: 5,
            title: "Unity & Coherence",
            icon: "🔗",
            explanation: `
                <h3>Unity: One Main Idea</h3>
                <p><strong>Unity</strong> means all sentences in a paragraph support the SAME main idea.</p>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold;">❌ Paragraph WITHOUT Unity:</p>
                    <p>Exercise is important for good health. <span style="background: yellow;">I also like pizza.</span> Exercise helps you lose weight. <span style="background: yellow;">My friend doesn't like to exercise.</span> It also reduces stress.</p>
                    <p style="margin-top: 0.75rem; font-style: italic;">Problem: The highlighted sentences don't support the main idea (exercise is important).</p>
                </div>

                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold;">✅ Paragraph WITH Unity:</p>
                    <p>Exercise is important for good health. First, it helps you lose weight and stay in shape. Second, exercise reduces stress and makes you feel happier. Finally, it lowers your risk of serious diseases.</p>
                    <p style="margin-top: 0.75rem; font-style: italic;">Better: All sentences support the main idea.</p>
                </div>

                <h3>Coherence: Logical Flow</h3>
                <p><strong>Coherence</strong> means your ideas are connected in a logical order that's easy to follow.</p>

                <h4>Tips for Coherence:</h4>
                <ul>
                    <li>Use transition words (First, Second, Finally)</li>
                    <li>Put sentences in logical order</li>
                    <li>Repeat key words from the topic sentence</li>
                    <li>Use pronouns to refer back (it, they, this)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "paragraph-unity-coherence-1",
                    title: "Practice: Unity and Coherence",
                    instructions: "Identify paragraphs with unity and coherence issues.",
                    items: [
                        {
                            type: "radio",
                            label: "What does 'unity' mean in a paragraph?",
                            options: [
                                { value: "a", label: "All sentences support the same main idea" },
                                { value: "b", label: "All sentences are the same length" },
                                { value: "c", label: "All sentences use the same words" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What does 'coherence' mean in a paragraph?",
                            options: [
                                { value: "b", label: "All sentences are about different topics" },
                                { value: "a", label: "Ideas are connected in a logical order that's easy to follow" },
                                { value: "c", label: "The paragraph has exactly five sentences" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which paragraph has a unity problem?",
                            options: [
                                { value: "b", label: "Exercise is important. First, it helps you lose weight. Second, it reduces stress. (all support main idea)" },
                                { value: "c", label: "Exercise is important. It helps you lose weight. It also reduces stress. (all support main idea)" },
                                { value: "a", label: "Exercise is important. I also like pizza. Exercise helps you lose weight. (pizza doesn't support main idea)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "How can you improve coherence in a paragraph?",
                            options: [
                                { value: "a", label: "Use transition words, logical order, and repeat key words" },
                                { value: "b", label: "Make all sentences very short" },
                                { value: "c", label: "Use different topics in each sentence" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-mistakes",
            stepNumber: 6,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: No Topic Sentence</h3>
                <p>❌ Starting with details without stating the main idea first</p>
                <p>✅ Start with a clear topic sentence</p>

                <h3>Mistake #2: Too Many Ideas in One Paragraph</h3>
                <p>❌ Talking about exercise, food, AND sleep in one paragraph</p>
                <p>✅ One paragraph = one main idea. Use separate paragraphs for different ideas.</p>

                <h3>Mistake #3: No Conclusion</h3>
                <p>❌ Ending abruptly without wrapping up</p>
                <p>✅ Add a conclusion sentence to finish the paragraph</p>

                <h3>Mistake #4: Off-Topic Sentences</h3>
                <p>❌ Including sentences that don't relate to the topic sentence</p>
                <p>✅ Every sentence must support the main idea</p>

                <h3>Mistake #5: No Transitions</h3>
                <p>❌ Listing ideas without connecting them</p>
                <p>✅ Use transition words to connect sentences smoothly</p>

                <h3>Mistake #6: One or Two Sentences</h3>
                <p>❌ Writing only 1-2 sentences and calling it a paragraph</p>
                <p>✅ A paragraph needs at least 5-7 sentences (topic + 3-5 details + conclusion)</p>
            `,
            exercises: [
                {
                    id: "paragraph-format-common-mistakes-1",
                    title: "Practice: Common Paragraph Mistakes",
                    instructions: "Identify common mistakes by thinking about an East Boston community newsletter.",
                    items: [
                        {
                            type: "radio",
                            label: "When an East Boston newsletter starts with a detail about the Harborwalk without a clear focus, what mistake is happening?",
                            options: [
                                { value: "b", label: "Too many transition words crowd the paragraph." },
                                { value: "a", label: "No topic sentence: the main idea is missing." },
                                { value: "c", label: "Every sentence is too long." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "A writer lists the Harborwalk, the community garden, and the ferry schedule in the same paragraph. What mistake is that?",
                            options: [
                                { value: "b", label: "Using simple vocabulary." },
                                { value: "c", label: "Writing all short sentences." },
                                { value: "a", label: "Jumping between too many ideas instead of sticking to one." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which mistake happens when a paragraph about the Harborwalk ends with a sentence about the Red Line, unrelated to the main idea?",
                            options: [
                                { value: "a", label: "Off-topic sentence that breaks unity." },
                                { value: "b", label: "Too many examples about trains." },
                                { value: "c", label: "Not enough adjectives to describe the view." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "If you write a paragraph about East Boston activities, how many sentences should it usually include?",
                            options: [
                                { value: "b", label: "Exactly 3 sentences." },
                                { value: "a", label: "At least 5-7 sentences (topic + details + ending)." },
                                { value: "c", label: "As many as possible until you run out of paper." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "paragraph-format-ex-1",
                    title: "Exercise 1: Topic Sentence",
                    instructions: "Choose the topic sentence (the main idea).",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence introduces the main idea for an East Boston Harborwalk paragraph?",
                            options: [
                                { value: "b", label: "Today, we passed the Harborwalk entrance twice." },
                                { value: "c", label: "We stop for coffee after walking." },
                                { value: "d", label: "Finally, the Harborwalk connects to the ferry." },
                                { value: "a", label: "The Harborwalk helps neighbors stay active and friendly." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-2",
                    title: "Exercise 2: Off-Topic Sentence",
                    instructions: "Choose the sentence that does NOT belong.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence does NOT belong in a paragraph about the Harborwalk?",
                            options: [
                                { value: "c", label: "I like pizza." },
                                { value: "a", label: "Walking on the Harborwalk is important for health." },
                                { value: "b", label: "It builds stamina before a Blue Line commute." },
                                { value: "d", label: "It keeps residents calmer on busy days." },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-3",
                    title: "Exercise 3: What's Missing?",
                    instructions: "Choose what the paragraph needs.",
                    items: [
                        {
                            type: "select",
                            label: "The Harborwalk is free, clean, and full of plants. We see more neighbors there every day. The path shines after a fresh rain. (What is missing?)",
                            options: ["Topic sentence", "Supporting details", "Conclusion sentence"],
                            expectedAnswer: "Conclusion sentence",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-4",
                    title: "Exercise 4: Transition Word",
                    instructions: "Choose the best transition word for the blank.",
                    items: [
                        {
                            type: "select",
                            label: "_____, walking along the Harborwalk reduces stress.",
                            options: ["Also", "Yesterday", "Because", "But"],
                            expectedAnswer: "Also",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-5",
                    title: "Exercise 5: Conclusion Sentence",
                    instructions: "Choose the best conclusion sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Topic: The East Boston community garden keeps neighbors healthy.",
                            options: [
                                { value: "a", label: "The garden brings people together." },
                                { value: "b", label: "For these reasons, the garden deserves more support from the council." },
                                { value: "c", label: "Gardeners water plants every morning." },
                                { value: "d", label: "I like coffee." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-6",
                    title: "Exercise 6: Too General or Too Specific?",
                    instructions: "Choose the best answer.",
                    items: [
                        {
                            type: "select",
                            label: "The Harborwalk is a great place to meet neighbors.",
                            options: ["too general", "too specific"],
                            expectedAnswer: "too general",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-7",
                    title: "Exercise 7: Improve the Topic Sentence",
                    instructions: "Choose the better topic sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Fix this topic sentence: "I walk the Harborwalk."',
                            options: [
                                { value: "a", label: "I walk." },
                                { value: "c", label: "Yesterday I walked at 7:15 AM." },
                                { value: "b", label: "Walking the Harborwalk daily keeps my heart strong." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-8",
                    title: "Exercise 8: Paragraph Length",
                    instructions: "Choose the best answer.",
                    items: [
                        {
                            type: "select",
                            label: "How many sentences should a paragraph about East Boston community projects have?",
                            options: ["1–2", "3–4", "5–7", "10–12"],
                            expectedAnswer: "5–7",
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
                <h3>Paragraph Structure</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ol style="font-size: 1.125rem; margin: 0;">
                        <li><strong>Topic Sentence</strong> - States the main idea (1 sentence)</li>
                        <li><strong>Supporting Details</strong> - Explain/prove the main idea (3-5 sentences)</li>
                        <li><strong>Conclusion Sentence</strong> - Wraps up the paragraph (1 sentence)</li>
                    </ol>
                    <p style="margin-top: 1rem; font-weight: bold;">Total: 5-7 sentences minimum</p>
                </div>

                <h3>Topic Sentence</h3>
                <ul>
                    <li>First sentence of paragraph</li>
                    <li>States main idea clearly</li>
                    <li>Not too general, not too specific</li>
                    <li>Complete sentence (subject + verb)</li>
                </ul>

                <h3>Supporting Details</h3>
                <ul>
                    <li>Explain, describe, or prove topic sentence</li>
                    <li>Use examples, reasons, facts, or personal experience</li>
                    <li>Use transition words (First, Second, Also, For example)</li>
                    <li>All sentences must relate to the main idea</li>
                </ul>

                <h3>Conclusion Sentence</h3>
                <ul>
                    <li>Last sentence of paragraph</li>
                    <li>Restate main idea OR summarize key points</li>
                    <li>Use: For these reasons, In conclusion, Therefore, etc.</li>
                </ul>

                <h3>Unity & Coherence</h3>
                <ul>
                    <li><strong>Unity:</strong> One paragraph = ONE main idea</li>
                    <li><strong>Coherence:</strong> Ideas flow logically with transitions</li>
                </ul>

                <h3>Common Errors to Avoid</h3>
                <ul>
                    <li>❌ No topic sentence</li>
                    <li>❌ Too many ideas in one paragraph</li>
                    <li>❌ Off-topic sentences</li>
                    <li>❌ No conclusion</li>
                    <li>❌ No transition words</li>
                    <li>❌ Too short (1-2 sentences)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Pro Tip",
                content: "Before you start writing, ask: What is my ONE main idea? Then build everything around that!",
            },
            exercises: [
                {
                    id: "paragraph-format-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of paragraph structure.",
                    items: [
                        {
                            type: "radio",
                            label: "What are the three parts of a paragraph?",
                            options: [
                                { value: "a", label: "Topic sentence, supporting details, conclusion sentence" },
                                { value: "b", label: "Introduction, body, end" },
                                { value: "c", label: "First sentence, middle sentences, last sentence" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What does a topic sentence do?",
                            options: [
                                { value: "b", label: "Gives examples" },
                                { value: "a", label: "States the main idea clearly (first sentence)" },
                                { value: "c", label: "Asks a question" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "How many supporting detail sentences are usually in a paragraph?",
                            options: [
                                { value: "b", label: "1-2 sentences" },
                                { value: "c", label: "10 or more sentences" },
                                { value: "a", label: "3-5 sentences" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What does 'unity' mean in a paragraph?",
                            options: [
                                { value: "a", label: "All sentences support the same main idea" },
                                { value: "b", label: "All sentences are the same length" },
                                { value: "c", label: "All sentences use transition words" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is a common mistake to avoid?",
                            options: [
                                { value: "b", label: "Using transition words" },
                                { value: "a", label: "Including sentences that don't relate to the topic sentence (off-topic sentences)" },
                                { value: "c", label: "Having a conclusion sentence" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz (16 questions)
    miniQuiz: [
        {
            id: "quiz-1",
            question:
                "A paragraph about the East Boston Harborwalk should include which three parts?",
            options: [
                { value: "a", label: "Beginning, middle, end" },
                {
                    value: "b",
                    label: "Topic sentence, supporting details, conclusion",
                },
                { value: "c", label: "Introduction, examples, summary" },
            ],
            correctAnswer: "b",
            explanation:
                "A strong paragraph, even about the Harborwalk, needs a topic sentence, supporting details, and a conclusion sentence.",
            skillTag: "paragraph-structure-three-parts",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question:
                "Where should the topic sentence usually appear in a paragraph about community gardens?",
            options: [
                { value: "a", label: "At the end" },
                { value: "b", label: "In the middle" },
                { value: "c", label: "At the beginning" },
            ],
            correctAnswer: "c",
            explanation:
                "The topic sentence typically comes first so readers immediately understand the main idea.",
            skillTag: "topic-sentence-position-first",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question:
                "Which sentence is the best topic sentence for a Harborwalk paragraph?",
            options: [
                { value: "a", label: "I like walking the Harborwalk with friends." },
                {
                    value: "b",
                    label: "Walking the Harborwalk daily keeps my heart strong.",
                },
                { value: "c", label: "Yesterday I walked for 32 minutes." },
            ],
            correctAnswer: "b",
            explanation:
                "Option b states a clear main idea that many supporting details can explain and expand.",
            skillTag: "topic-sentence-quality-clear-main-idea",
            difficulty: "medium",
        },
        {
            id: "quiz-4",
            question:
                "What does 'unity' mean when describing East Boston stories?",
            options: [
                {
                    value: "a",
                    label: "Every sentence uses transition words like 'First' and 'Next'",
                },
                {
                    value: "b",
                    label: "All sentences support the same main idea",
                },
                {
                    value: "c",
                    label: "Each sentence is about a different topic",
                },
            ],
            correctAnswer: "b",
            explanation:
                "Unity means every sentence in the paragraph helps explain the same main idea.",
            skillTag: "unity-all-sentences-support-main-idea",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question:
                "How many sentences should a typical paragraph about the Blue Line schedule include?",
            options: [
                { value: "b", label: "At least 5-7 sentences" },
                { value: "a", label: "1-2 sentences" },
                { value: "c", label: "10-12 sentences" },
            ],
            correctAnswer: "b",
            explanation:
                "A well-developed paragraph usually has 5-7 sentences: topic sentence, 3-5 supporting details, and a conclusion.",
            skillTag: "paragraph-length-5-to-7-sentences",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question:
                "How do transition words help a paragraph about East Boston events?",
            options: [
                { value: "a", label: "They replace the topic sentence." },
                { value: "b", label: "They make sentences longer." },
                {
                    value: "c",
                    label: "They connect ideas and guide the reader through the paragraph.",
                },
            ],
            correctAnswer: "c",
            explanation:
                "Transition words like 'First,' 'Also,' and 'Finally' connect ideas and help readers follow the order.",
            skillTag: "transitions-purpose-connect-ideas",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question:
                "Which sentence is off-topic in a paragraph about Harborwalk benefits?",
            options: [
                {
                    value: "a",
                    label: "Walking the Harborwalk improves our mood.",
                },
                {
                    value: "b",
                    label: "It helps us meet neighbors after work.",
                },
                {
                    value: "c",
                    label: "The Red Sox won last night’s game.",
                },
            ],
            correctAnswer: "c",
            explanation:
                "A sentence about a baseball score does not support the main idea of Harborwalk benefits.",
            skillTag: "unity-identify-off-topic-sentence",
            difficulty: "medium",
        },
        {
            id: "quiz-8",
            question:
                "Which sentence is a good supporting detail for 'The community garden keeps neighbors healthy'?",
            options: [
                {
                    value: "a",
                    label: "Gardening takes place next to the Harborwalk.",
                },
                {
                    value: "b",
                    label: "Volunteers plant vegetables every Saturday.",
                },
                {
                    value: "c",
                    label: "The garden is open once a year.",
                },
            ],
            correctAnswer: "b",
            explanation:
                "Planting vegetables regularly shows how the garden supports health through fresh food and activity.",
            skillTag: "supporting-detail-identify-relevant-example",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question:
                "What is the main job of a conclusion sentence about Logan Airport shuttles?",
            options: [
                {
                    value: "a",
                    label: "Introduce a new idea about a different shuttle route",
                },
                {
                    value: "b",
                    label: "Summarize the main idea or restate the reasons",
                },
                { value: "c", label: "Ask the reader a new question" },
            ],
            correctAnswer: "b",
            explanation:
                "The conclusion wraps up the paragraph by restating the main idea or summarizing the key points.",
            skillTag: "conclusion-function-restatement-summary",
            difficulty: "easy",
        },
        {
            id: "quiz-10",
            question:
                "You want to write about a different topic (East Boston schools) instead of the Harborwalk. What should you do?",
            options: [
                { value: "b", label: "Keep writing in the same paragraph" },
                { value: "a", label: "Start a new paragraph" },
                { value: "c", label: "Repeat the same topic sentence" },
            ],
            correctAnswer: "a",
            explanation:
                "A new main idea belongs in a new paragraph to keep unity and organization.",
            skillTag: "paragraph-break-new-topic-new-paragraph",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question:
                "What does 'coherence' mean after describing Harborwalk improvements?",
            options: [
                {
                    value: "a",
                    label: "Ideas flow in a logical order that is easy to follow",
                },
                {
                    value: "b",
                    label: "Every sentence is the same length",
                },
                {
                    value: "c",
                    label: "All sentences use the same verb tense",
                },
            ],
            correctAnswer: "a",
            explanation:
                "Coherence means sentences are ordered and connected so the paragraph feels smooth and logical.",
            skillTag: "coherence-logical-flow-of-ideas",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question:
                "Which transition word best shows that you are adding another idea about community safety?",
            options: [
                { value: "b", label: "Yesterday" },
                { value: "c", label: "However" },
                { value: "a", label: "Also" },
            ],
            correctAnswer: "a",
            explanation:
                "'Also' adds another idea to the same point, which is useful when listing safety reasons.",
            skillTag: "transitions-adding-ideas-also",
            difficulty: "easy",
        },
        {
            id: "quiz-13",
            question:
                "Why is 'Walking daily keeps the Harborwalk clean' a strong topic sentence?",
            options: [
                {
                    value: "a",
                    label: "Because it introduces a clear main idea and prepares for details",
                },
                { value: "b", label: "Because it is a question" },
                { value: "c", label: "Because it lists exact times and dates" },
            ],
            correctAnswer: "a",
            explanation:
                "It clearly states a focus (clean Harborwalk) that supporting sentences can explain.",
            skillTag: "topic-sentence-explainable-main-idea",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question:
                "Which sentence works best as a conclusion for a paragraph about neighborhood meetings?",
            options: [
                {
                    value: "a",
                    label: "Meetings happen in the community center Tuesday nights.",
                },
                {
                    value: "b",
                    label: "These meetings help neighbors solve parking problems.",
                },
                {
                    value: "c",
                    label: "For these reasons, we should keep meeting every week.",
                },
            ],
            correctAnswer: "c",
            explanation:
                "This sentence summarizes the idea and gives a final recommendation, which is ideal for a conclusion.",
            skillTag: "conclusion-identify-strong-ending",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question:
                "What is an example of a strong supporting detail for safety improvements on the Harborwalk?",
            options: [
                { value: "a", label: "The Harborwalk is a great place." },
                {
                    value: "b",
                    label: "New lights now cover the path from Maverick to Bremen Street.",
                },
                { value: "c", label: "Portland has a wide pathway." },
            ],
            correctAnswer: "b",
            explanation:
                "This sentence gives a specific example (new lights) that supports the idea of safety improvements.",
            skillTag: "supporting-detail-specific-evidence",
            difficulty: "medium",
        },
        {
            id: "quiz-16",
            question:
                "Read this short paragraph: 'The Harborwalk is free, clean, and full of plants. We see more neighbors there every day. The path shines after a fresh rain.' What is missing?",
            options: [
                { value: "c", label: "Conclusion sentence" },
                { value: "a", label: "Topic sentence" },
                { value: "b", label: "Supporting details" },
            ],
            correctAnswer: "c",
            explanation:
                "The paragraph already has a clear main idea and details, but it needs a final conclusion sentence to wrap it up.",
            skillTag: "paragraph-missing-conclusion-identification",
            difficulty: "medium",
        },
    ],

    /*
    TEACHER DIAGNOSTIC NOTES – Paragraph Format Mini Quiz

    This mini quiz checks whether students can:
    - Identify the three main parts of a paragraph (topic sentence, supporting details, conclusion).
    - Recognize a strong topic sentence (clear, focused, explainable main idea).
    - Distinguish supporting details from off-topic sentences.
    - Understand the roles of unity and coherence.
    - Use and recognize transition words for adding and organizing ideas.
    - Recognize the purpose of a conclusion sentence and when a paragraph is missing one.
    - Apply these skills to real-world East Boston topics (Harborwalk, community gardens, neighborhood meetings).

    Skill tags:

    Paragraph structure and length
    - paragraph-structure-three-parts
    - paragraph-length-5-to-7-sentences
    - paragraph-break-new-topic-new-paragraph

    Topic sentence skills
    - topic-sentence-position-first
    - topic-sentence-quality-clear-main-idea
    - topic-sentence-explainable-main-idea

    Supporting details and evidence
    - supporting-detail-identify-relevant-example
    - supporting-detail-specific-evidence

    Unity and off-topic sentences
    - unity-all-sentences-support-main-idea
    - unity-identify-off-topic-sentence

    Coherence and transitions
    - coherence-logical-flow-of-ideas
    - transitions-purpose-connect-ideas
    - transitions-adding-ideas-also

    Conclusion awareness
    - conclusion-function-restatement-summary
    - conclusion-identify-strong-ending
    - paragraph-missing-conclusion-identification

    How to read the diagnostics:
    - If paragraph structure and length tags are weak (paragraph-structure-three-parts, paragraph-length-5-to-7-sentences, paragraph-break-new-topic-new-paragraph) →
      Revisit the basic structure:
      • Topic sentence → Supporting details → Conclusion.
      Draw a visual “paragraph sandwich” or 3-box diagram and have students label each part and write one example sentence in each box.

    - If topic sentence tags are weak (topic-sentence-position-first, topic-sentence-quality-clear-main-idea, topic-sentence-explainable-main-idea) →
      Practice sorting and rewriting:
      • Give several topic sentence options and ask: Too general? Too specific? Just right?
      • Have students fix weak topic sentences for real East Boston topics (Harborwalk, Logan Airport shuttles, community garden).

    - If supporting detail tags are weak (supporting-detail-identify-relevant-example, supporting-detail-specific-evidence) →
      Use a T-chart:
      • LEFT: Possible supporting details.
      • RIGHT: Does this support the main idea? YES/NO.
      Ask students to explain why each detail belongs or does not belong in the paragraph.

    - If unity tags are weak (unity-all-sentences-support-main-idea, unity-identify-off-topic-sentence) →
      Show short paragraphs that mix on-topic and off-topic sentences.
      • Have students highlight or delete off-topic sentences.
      • Ask them to write a new sentence that better supports the main idea.

    - If coherence and transition tags are weak (coherence-logical-flow-of-ideas, transitions-purpose-connect-ideas, transitions-adding-ideas-also) →
      Give a list of scrambled sentences and have students put them in logical order using transitions.
      • Build a small transition word bank on the board by function (First, Next, Also, Finally).
      • Have students add transitions to bare paragraphs that feel “choppy.”

    - If conclusion tags are weak (conclusion-function-restatement-summary, conclusion-identify-strong-ending, paragraph-missing-conclusion-identification) →
      Practice writing only conclusion sentences:
      • Give a topic sentence and 2-3 supporting details and ask students to write a one-sentence conclusion.
      • Compare weak vs strong endings (“I like it.” vs “For these reasons, we should keep meeting every week.”).

    Suggested use:
    - Use this mini quiz after students complete the paragraph structure and unity/coherence sections.
    - At the class level:
      • If structure and topic sentence tags are red → slow down and do more guided practice building paragraphs from sentence strips.
      • If unity/coherence and transition tags are red → focus on editing and rearranging activities (fixing paragraphs instead of writing from zero).
      • If conclusion tags are red → model multiple conclusion options and have students choose and improve them before writing their own.
    */
};
