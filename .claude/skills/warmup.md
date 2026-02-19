# ESOL Warmup Worksheet Generator

Generate print-ready ESOL warmup worksheets (15-20 minutes) with proper pedagogical scaffolding.

## When to Use

Use `/warmup` when:
- Creating a new printable warmup worksheet for any topic
- Converting existing TypeScript warmup content to printable HTML format
- The user says "create a warmup for [topic]" or "make a worksheet for [topic]"

## Pedagogical Principles

Every warmup MUST follow this structure:

1. **Vocab First** - Pre-teach 6 key words with a matching exercise (3 min)
2. **Phrases + Production** - Phrase starters with examples AND writing lines for student production (8 min)
3. **Partner Practice** - Students share what they wrote, then ask follow-up questions (5 min)
4. **Optional Extension** - Reading passage + comprehension questions + writing homework

### Key Design Rules

- **Production over consumption** - Students must WRITE, not just read
- **Scaffold up** - Vocab → Phrases → Speaking (each builds on previous)
- **Active tasks** - Every section has something students DO
- **Differentiation** - Include "Level up" challenges for advanced students
- **Connect sections** - "Use vocabulary from Part A in your sentences"

## Input Sources

Check for existing content in:
- `src/content/speaking/daily-warmups/[topic]-basics.ts` - May have keyPhrases and prompts to adapt
- Ask the user for the topic if not provided

## Output Format

Generate a standalone HTML file saved to: `worksheets/[unit]/[topic]-warmup.html`

Units: housing, banking, workplace, health, other, grammar

## Date Handling

- **If filename has a date** (e.g., `housing-vocab-2026-01-20.ts`) → Pre-fill: "January 20, 2026"
- **If no date in filename** (e.g., `banking-basics.ts`) → Leave name field blank, no date field

## HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[TOPIC TITLE] (ESOL Level 3/4)</title>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #1a1a1a;
      --gray: #444;
      --light: #666;
      --line: #333;
    }

    body {
      font-family: Georgia, 'Times New Roman', serif;
      color: var(--ink);
      background: #f5f5f5;
      padding: 20px;
      line-height: 1.45;
      font-size: 14px;
    }

    .sheet {
      max-width: 8in;
      margin: 0 auto;
      background: #fff;
      padding: 0.45in 0.55in;
    }

    /* Header */
    .header {
      border-bottom: 2px solid var(--ink);
      padding-bottom: 8px;
      margin-bottom: 16px;
    }

    .header h1 {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .header-fields {
      display: flex;
      gap: 32px;
      font-size: 13px;
    }

    .field {
      display: flex;
      align-items: baseline;
      gap: 5px;
    }

    .field label { font-weight: bold; }

    .field-line {
      border-bottom: 1px solid var(--ink);
      width: 100px;
      height: 16px;
    }

    .date-value {
      font-weight: normal;
    }

    /* Sections */
    .section { margin-bottom: 18px; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid var(--ink);
      padding-bottom: 3px;
      margin-bottom: 10px;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section-time {
      font-size: 12px;
      color: var(--light);
      font-style: italic;
    }

    /* Vocabulary Matching */
    .vocab-matching {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 40px;
      font-size: 14px;
    }

    .vocab-word {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 3px 0;
    }

    .vocab-word .num { font-weight: bold; min-width: 20px; }
    .vocab-word .word { flex: 1; }
    .vocab-word .blank {
      border-bottom: 1px solid var(--line);
      width: 30px;
      margin-left: 10px;
    }

    .vocab-def { padding: 3px 0; }
    .vocab-def .letter { font-weight: bold; margin-right: 6px; }

    /* Phrases */
    .phrase { margin-bottom: 14px; }

    .phrase-starter {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 3px;
    }

    .examples {
      margin-left: 14px;
      font-size: 13px;
      color: var(--gray);
      margin-bottom: 4px;
    }

    .examples li {
      margin-bottom: 1px;
      list-style: none;
    }

    .examples li::before {
      content: "• ";
      color: var(--ink);
    }

    .your-turn {
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-size: 13px;
      margin-left: 14px;
    }

    .your-turn-label {
      font-style: italic;
      color: var(--light);
      white-space: nowrap;
    }

    .writing-line {
      border-bottom: 1px solid var(--line);
      flex: 1;
      height: 20px;
    }

    .instruction {
      font-size: 12px;
      color: var(--light);
      font-style: italic;
      margin-bottom: 12px;
    }

    .level-up {
      font-size: 12px;
      font-style: italic;
      color: var(--light);
      margin-top: 6px;
      padding-left: 14px;
    }

    /* Partner Practice */
    .round { margin-bottom: 8px; font-size: 13px; }
    .round-header { font-weight: bold; }
    .round-content { margin-left: 8px; color: var(--gray); }

    .help-note {
      font-size: 12px;
      font-style: italic;
      color: var(--light);
      margin-top: 8px;
    }

    /* Reading */
    .reading-text {
      font-size: 14px;
      line-height: 1.55;
      margin-bottom: 14px;
    }

    .reading-text p {
      margin-bottom: 8px;
      text-align: justify;
    }

    /* Questions */
    .question { margin-bottom: 12px; }

    .question-text {
      font-size: 13px;
      margin-bottom: 4px;
    }

    .question-text b { font-weight: bold; }

    .answer-line {
      border-bottom: 1px solid var(--line);
      height: 20px;
    }

    /* Writing Homework */
    .writing-prompt {
      font-size: 13px;
      margin-bottom: 10px;
    }

    .requirements {
      font-size: 12px;
      margin-bottom: 12px;
      padding-left: 16px;
      color: var(--gray);
    }

    .requirements li { margin-bottom: 1px; }

    .writing-lines { margin-top: 10px; }

    .homework-line {
      border-bottom: 1px solid var(--line);
      height: 26px;
    }

    .optional-note {
      font-size: 11px;
      font-style: italic;
      color: var(--light);
      margin-top: 10px;
    }

    /* Page sections */
    .front-page { margin-bottom: 24px; }

    /* Print styles */
    @media print {
      @page { size: letter; margin: 0.45in; }
      body { background: #fff; padding: 0; }
      .sheet { padding: 0; max-width: none; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>

<body>
  <div class="sheet">
    <div class="front-page">
      <header class="header">
        <h1>[TOPIC]: [Subtitle]</h1>
        <div class="header-fields">
          <div class="field">
            <label>Name</label>
            <div class="field-line" style="width: 160px;"></div>
          </div>
          <!-- IF DATE IN FILENAME: -->
          <div class="field">
            <label>Date</label>
            <span class="date-value">[Month Day, Year]</span>
          </div>
          <!-- IF NO DATE: omit the date field entirely -->
        </div>
      </header>

      <!-- PART A: VOCABULARY -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Part A: Vocabulary</h2>
          <span class="section-time">3 min</span>
        </div>

        <p class="instruction">Match each word to its meaning. Write the letter on the line.</p>

        <div class="vocab-matching">
          <div class="vocab-words">
            <div class="vocab-word"><span class="num">1.</span> <span class="word">[word1]</span> <span class="blank"></span></div>
            <div class="vocab-word"><span class="num">2.</span> <span class="word">[word2]</span> <span class="blank"></span></div>
            <div class="vocab-word"><span class="num">3.</span> <span class="word">[word3]</span> <span class="blank"></span></div>
            <div class="vocab-word"><span class="num">4.</span> <span class="word">[word4]</span> <span class="blank"></span></div>
            <div class="vocab-word"><span class="num">5.</span> <span class="word">[word5]</span> <span class="blank"></span></div>
            <div class="vocab-word"><span class="num">6.</span> <span class="word">[word6]</span> <span class="blank"></span></div>
          </div>
          <div class="vocab-defs">
            <div class="vocab-def"><span class="letter">a.</span> [definition - shuffled order]</div>
            <div class="vocab-def"><span class="letter">b.</span> [definition]</div>
            <div class="vocab-def"><span class="letter">c.</span> [definition]</div>
            <div class="vocab-def"><span class="letter">d.</span> [definition]</div>
            <div class="vocab-def"><span class="letter">e.</span> [definition]</div>
            <div class="vocab-def"><span class="letter">f.</span> [definition]</div>
          </div>
        </div>
      </section>

      <!-- PART B: PHRASES -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Part B: Phrases</h2>
          <span class="section-time">8 min</span>
        </div>

        <p class="instruction">Read the examples. Then write your own sentence. Try to use vocabulary from Part A.</p>

        <div class="phrase">
          <div class="phrase-starter">1) [Phrase starter]…</div>
          <ul class="examples">
            <li>[Simple example sentence]</li>
            <li>[More complex example with connector or detail]</li>
          </ul>
          <div class="your-turn">
            <span class="your-turn-label">Your turn:</span>
            <div class="writing-line"></div>
          </div>
        </div>

        <!-- Repeat for 4-5 phrase starters total -->

        <p class="level-up">Level up: Add a reason (because, so) or contrast (even though, however).</p>
      </section>

      <!-- PART C: PARTNER PRACTICE -->
      <section class="section page-break">
        <div class="section-header">
          <h2 class="section-title">Part C: Partner Practice</h2>
          <span class="section-time">5 min</span>
        </div>

        <div class="round">
          <span class="round-header">Round 1:</span>
          <span class="round-content">Share your sentences from Part B. Your partner listens and asks one follow-up question.</span>
        </div>

        <div class="round">
          <span class="round-header">Round 2:</span>
          <span class="round-content">Switch roles. Ask your partner: "[topic-specific follow-up questions]"</span>
        </div>

        <p class="help-note">Need help? Say: "Can you repeat that?" or "What does ___ mean?"</p>
      </section>
    </div>

    <!-- EXTENSION: Reading + Writing Homework -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Reading</h2>
      </div>

      <div class="reading-text">
        <p>[2-3 paragraph reading passage on the topic, appropriate for level 3-4]</p>
      </div>

      <div class="question">
        <div class="question-text"><b>1)</b> [Comprehension question]</div>
        <div class="answer-line"></div>
      </div>

      <div class="question">
        <div class="question-text"><b>2)</b> [Comprehension question]</div>
        <div class="answer-line"></div>
      </div>

      <div class="question">
        <div class="question-text"><b>3)</b> [Personal connection question]</div>
        <div class="answer-line"></div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Writing Homework</h2>
        <span class="section-time">6–8 sentences</span>
      </div>

      <div class="writing-prompt">
        <b>Prompt:</b> [Writing prompt that connects to the topic and allows personal response]
      </div>

      <ul class="requirements">
        <li>[Suggestion 1 - could include basic info about topic]</li>
        <li>[Suggestion 2 - might add details or examples]</li>
        <li>[Suggestion 3 - try using connector words]</li>
        <li>[Suggestion 4 - could share personal opinion or future plan]</li>
      </ul>

      <div class="writing-lines">
        <div class="homework-line"></div>
        <div class="homework-line"></div>
        <div class="homework-line"></div>
        <div class="homework-line"></div>
        <div class="homework-line"></div>
        <div class="homework-line"></div>
        <div class="homework-line"></div>
        <div class="homework-line"></div>
      </div>

      <p class="optional-note">Optional challenge: Use present perfect (I've...) and a contrast phrase (even though, however).</p>
    </section>
  </div>
</body>
</html>
```

## Content Guidelines

### Part A: Vocabulary (6 words)
- Choose words students will USE in Part B
- Mix familiar and new words
- Definitions should be simple (5-10 words max)
- Shuffle the definition order so it's not 1=a, 2=b, etc.

### Part B: Phrases (4-5 starters)
- Each starter is an incomplete sentence students finish
- Provide 2 examples: one simple, one with a connector
- Examples should model vocabulary usage
- Writing line follows each starter

Good phrase starters:
- "I [verb]..." (I work..., I live..., I need...)
- "My [noun] has/is..." (My job has..., My doctor is...)
- "The [noun] is..." (The rent is..., The schedule is...)
- "One problem is..." / "One thing I like is..."
- "I [verb] because..." / "Even though..., I..."

### Part C: Partner Practice
- Round 1: Share written sentences
- Round 2: Topic-specific follow-up questions
- Include "How long...?" or "How much...?" or "Why...?"

### Reading Passage
- 80-120 words
- 2-3 short paragraphs
- Real-world context (not textbook-style)
- Include vocabulary from Part A naturally

### Writing Homework
- Connect to the reading or expand on Part B
- 4 specific requirements
- Optional grammar challenge

## Example Topics and Phrase Starters

**Healthcare:**
1. I feel... / I have...
2. My doctor said...
3. I need to...
4. One problem is...
5. I usually... when I'm sick

**Workplace:**
1. I work at... / My job is...
2. My schedule is...
3. I need to... at work
4. One thing I like is...
5. If there's a problem, I...

**Transportation:**
1. I get to work by...
2. It takes... to get to...
3. The bus/train is...
4. One problem is...
5. I prefer... because...

**Banking:**
1. I have a... account
2. I pay my bills by...
3. If I need cash, I...
4. One thing I learned is...
5. My bank charges... for...

## Verification

After generating, remind the user to:
1. Open in browser
2. Cmd+P to check print preview
3. Verify writing lines are wide enough for adult handwriting
4. Check that content fits comfortably (not cramped)
