import type { InteractiveGuideContent } from "@/types/activity";

export const codingStateManagementPatternsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "State Management Patterns Beyond Basics: When and How to Lift State",
      icon: "📦",
      explanation: `
        <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
          <p style="font-size: 1.05rem; margin: 0;"><strong>The wrong state management pattern costs you hours of debugging stale-state bugs, unnecessary re-renders, and confused teammates.</strong> This lesson teaches you to choose confidently.</p>
        </div>

        <h3>The State Management Decision Tree</h3>
        <p>Most teams struggle not with React fundamentals, but with <em>"Where should this state live?"</em> The answer depends on three questions:</p>
        <ol>
          <li><strong>How many components need this state?</strong></li>
          <li><strong>How often does it change?</strong></li>
          <li><strong>Is it derived from other state or data?</strong></li>
        </ol>

        <h3>Common Scenarios You'll Face</h3>
        <ul>
          <li>Form state (input, checkbox, dropdown) → Local state in component</li>
          <li>UI state (modal open/closed, sidebar collapsed) → Could be local or lifted</li>
          <li>Data fetched from API (user profile, assignments) → Should live in parent or context</li>
          <li>Global state (current user, theme, language) → Context API or Redux/Zustand</li>
          <li>Computed state (filtered list, sorted list) → Derived from base state, not stored</li>
        </ul>

        <h3>What You Will Learn</h3>
        <ul>
          <li>When local state is enough vs. when to lift</li>
          <li>How Context API works and when to use it (and when NOT to)</li>
          <li>Reading state management in unfamiliar code</li>
          <li>Debugging stale-state and over-rendering issues</li>
          <li>When to reach for Redux/Zustand vs. Context</li>
          <li>The tradeoffs of different state patterns</li>
        </ul>
      `,
      tipBox: {
        title: "Core Principle",
        content: "Start with local state. Only lift or use Context when multiple components need the same state. Only use Redux/Zustand when Context becomes too cumbersome. Avoid premature abstraction."
      },
      exercises: [
        {
          type: "text",
          label: "Think of a feature in a web app you use (e.g., 'favoriting a post', 'filtering a list'). Where does this state live? Why does it need to live there?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "local-state",
      stepNumber: 1,
      title: "Local State First: When Props and useState Are Enough",
      icon: "🏠",
      explanation: `
        <h3>The Default Answer: Local State</h3>
        <p><strong>99% of the time, start with local state.</strong> If only one component needs to track something, <code>useState</code> is the right tool.</p>

        <h3>What Lives in Local State?</h3>
        <p><strong>Good candidates:</strong></p>
        <ul>
          <li>Form inputs (text field value, checkbox, select option)</li>
          <li>UI toggles (is modal open? Is sidebar collapsed?)</li>
          <li>Transient state (loading spinner, error message)</li>
          <li>Hover/focus states</li>
        </ul>

        <p><strong>Example: Form with local state</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    // Handle success/error
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input value={email} onChange={e => setEmail(e.target.value)} /&gt;
      &lt;button disabled={loading}&gt;{loading ? 'Loading...' : 'Login'}&lt;/button&gt;
    &lt;/form&gt;
  );
}</code>
        </pre>

        <p><strong>Why local state here:</strong> Only LoginForm needs email/password. The parent doesn't care. Sending this state up would be prop-drilling.</p>

        <h3>The Props Pattern: Passing State Up for One Level</h3>
        <p>If a parent needs to coordinate between two children, lift state one level up:</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Parent
function Dashboard() {
  const [activeTab, setActiveTab] = useState('assignments');

  return (
    &lt;&gt;
      &lt;Tabs active={activeTab} onChange={setActiveTab} /&gt;
      &lt;TabContent active={activeTab} /&gt;
    &lt;/&gt;
  );
}

// Children receive it as props
function Tabs({ active, onChange }) {
  return &lt;button onClick={() => onChange('assignments')}&gt;...&lt;/button&gt;;
}

function TabContent({ active }) {
  return active === 'assignments' ? &lt;AssignmentsList /&gt; : ...;
}</code>
        </pre>

        <p><strong>Why lift here:</strong> Both Tabs and TabContent need to know which tab is active. Lifting keeps them synchronized.</p>

        <h3>The Red Flag: Prop Drilling</h3>
        <p>If you pass a prop down through 3+ levels of components that don't use it, you're prop-drilling:</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bad: Drilling through DashboardLayout → TabContent → CardList → Card
&lt;DashboardLayout selectedSubject={subject} setSelectedSubject={setSubject}&gt;
  &lt;TabContent selectedSubject={subject} setSelectedSubject={setSubject}&gt;
    &lt;CardList selectedSubject={subject} setSelectedSubject={setSubject}&gt;
      &lt;Card selectedSubject={subject} onFilter={setSubject} /&gt;
    &lt;/CardList&gt;
  &lt;/TabContent&gt;
&lt;/DashboardLayout&gt;</code>
        </pre>

        <p><strong>Signal:</strong> Props passed through components that don't use them = move to Context or lift to a shallower parent.</p>

        <h3>Testing Local State Components</h3>
        <p>Local state is easy to test:</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>test('form updates email state on input change', () => {
  render(&lt;LoginForm /&gt;);
  const input = screen.getByRole('textbox', { name: /email/i });

  fireEvent.change(input, { target: { value: 'test@example.com' } });

  expect(input.value).toBe('test@example.com');
});</code>
        </pre>

        <p>No mocks, no providers, no setup—just render and test behavior.</p>

        <h3>Performance: When Local State Causes Over-Rendering</h3>
        <p><strong>The problem:</strong> Every keystroke in a text input re-renders the component.</p>
        <p><strong>The fix:</strong> Usually fine for simple components. If you have a LARGE list in the same component, consider splitting:</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bad: Input change re-renders big list
function Dashboard() {
  const [filter, setFilter] = useState('');
  const [assignments] = useState(hugeList); // Re-renders every keystroke

  return (
    &lt;&gt;
      &lt;input value={filter} onChange={e => setFilter(e.target.value)} /&gt;
      &lt;AssignmentsList items={assignments} /&gt;
    &lt;/&gt;
  );
}

// ✅ Good: Split into separate components
function Dashboard() {
  const [filter, setFilter] = useState('');
  return (
    &lt;&gt;
      &lt;FilterInput value={filter} onChange={setFilter} /&gt;
      &lt;AssignmentsList filter={filter} /&gt;
    &lt;/&gt;
  );
}</code>
        </pre>

        <p><strong>Key insight:</strong> The list re-renders anyway (gets new prop), but FilterInput re-renders every keystroke. By splitting, you only re-render what changed.</p>
      `,
      exercises: [
        {
          type: "select",
          label: "Where should 'is the modal open?' state live?",
          options: [
            "In a global Context—it's UI state",
            "In the component that renders the modal (local state)",
            "In the parent of the modal component",
            "It doesn't matter"
          ],
          expectedAnswer: "In the component that renders the modal (local state)"
        },
        {
          type: "text",
          label: "You're building a form with 10 input fields. Each field has its own useState. Is this good or bad? Why?",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You see this pattern in code: three levels of components passing `selectedFilter` prop down. What's the next step?",
          options: [
            { value: "a", label: "This is fine—props are the standard way to pass data" },
            { value: "b", label: "This is prop drilling; consider lifting to a shallower parent or using Context" },
            { value: "c", label: "Convert to Redux immediately" },
            { value: "d", label: "Make selectedFilter a global window variable" }
          ],
          expectedAnswer: "b"
        }
      ]
    },
    {
      id: "lifting-state",
      stepNumber: 2,
      title: "Lifting State: Recognizing the Right Time",
      icon: "🔼",
      explanation: `
        <h3>When to Lift State</h3>
        <p><strong>Lift state when:</strong> Multiple children need the same state, and they need to stay synchronized.</p>

        <p><strong>Example 1: Two list filters that affect each other</strong></p>
        <p>If changing "Subject filter" should update the "Difficulty filter" (e.g., only show available difficulties), they need shared state:</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Parent lifts the state
function AssignmentsDashboard() {
  const [subject, setSubject] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const availableDifficulties = getAvailableDifficulties(subject);

  return (
    &lt;&gt;
      &lt;SubjectFilter value={subject} onChange={setSubject} /&gt;
      &lt;DifficultyFilter
        value={difficulty}
        onChange={setDifficulty}
        available={availableDifficulties}
      /&gt;
      &lt;AssignmentsList subject={subject} difficulty={difficulty} /&gt;
    &lt;/&gt;
  );
}</code>
        </pre>

        <p><strong>Why lift here:</strong> All three children need subject/difficulty state to stay in sync.</p>

        <h3>The Synchronization Problem</h3>
        <p>If each child has its own state, they get out of sync:</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bad: Two children, same state, out of sync
function DashboardWithBug() {
  return (
    &lt;&gt;
      &lt;SubjectFilter /&gt; {/* Has its own state('Math') */}
      &lt;AssignmentsList /&gt; {/* Has its own state('English') */}
    &lt;/&gt;
  );
}
// User changes SubjectFilter to 'Math', but AssignmentsList still shows 'English'</code>
        </pre>

        <p><strong>Solution: Lift to parent, pass as props</strong></p>

        <h3>Lifting Pattern: Callback Functions</h3>
        <p>Children change lifted state by calling callback functions passed as props:</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Parent
function Dashboard() {
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // Optional: validation, logging, side effects
  };

  return (
    &lt;&gt;
      &lt;FilterDropdown value={filter} onChange={handleFilterChange} /&gt;
      &lt;ResultsList filter={filter} /&gt;
    &lt;/&gt;
  );
}

// Child
function FilterDropdown({ value, onChange }) {
  return (
    &lt;select value={value} onChange={e => onChange(e.target.value)}&gt;
      &lt;option&gt;All&lt;/option&gt;
      &lt;option&gt;Math&lt;/option&gt;
    &lt;/select&gt;
  );
}</code>
        </pre>

        <h3>Common Lifting Patterns in This LMS</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: rgba(123, 168, 132, 0.1);">
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Feature</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>State To Lift</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Why</strong></th>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Subject filter</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">selectedSubject</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Multiple cards and lists need to show filtered data</td>
          </tr>
          <tr style="background: rgba(20, 32, 47, 0.03);">
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Modal state</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">isModalOpen</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Button opens modal, modal content closes it</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Tab selection</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">activeTab</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Tab buttons and content must stay in sync</td>
          </tr>
        </table>

        <h3>How High Should You Lift?</h3>
        <p><strong>Lift to the lowest common ancestor.</strong> The smallest component that wraps all children that need the state.</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Example: Where to lift 'selectedSubject'?
&lt;Dashboard&gt;
  &lt;Sidebar&gt;
    &lt;SubjectFilter /&gt;  {/* Needs selectedSubject */}
  &lt;/Sidebar&gt;
  &lt;MainContent&gt;
    &lt;CardList /&gt;      {/* Needs selectedSubject */}
  &lt;/MainContent&gt;
&lt;/Dashboard&gt;

// Lift to Dashboard (common ancestor of Sidebar and MainContent)
// NOT to the global app level (too high)
// NOT to Sidebar alone (CardList wouldn't get it)</code>
        </pre>

        <h3>The Lifting Limit: When Props Get Too Complicated</h3>
        <p><strong>If you're lifting state across 3+ levels, consider Context instead.</strong> This prevents prop drilling:</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// You have:
&lt;Page&gt;
  &lt;Section&gt;
    &lt;Area&gt;
      &lt;FilterButton /&gt;
      &lt;ResultsList /&gt;
    &lt;/Area&gt;
  &lt;/Section&gt;
&lt;/Page&gt;

// Props go through Page → Section → Area
// This is prop drilling. Switch to Context.</code>
        </pre>
      `,
      exercises: [
        {
          type: "text",
          label: "Find a place in this LMS where state is lifted (e.g., a parent component managing state for multiple children). Describe: (1) what state, (2) why it's lifted, (3) how many components need it.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "Two siblings need the same state. Where should it live?",
          options: [
            { value: "a", label: "In each sibling's local state (they can sync via Context)" },
            { value: "b", label: "In their parent component, passed down as props" },
            { value: "c", label: "In a global Redux store" },
            { value: "d", label: "It doesn't matter—React handles it automatically" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "You're reading code with this pattern: data is fetched in Dashboard, passed to Section, passed to Area, passed to Card. Is this good? Why or why not?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "context-api",
      stepNumber: 3,
      title: "Context API: Appropriate Uses and Anti-Patterns",
      icon: "🎁",
      explanation: `
        <h3>What is Context?</h3>
        <p>Context lets you pass data through the component tree <strong>without props</strong>. It's perfect for data that many components at different levels need:</p>

        <ul>
          <li>Current user</li>
          <li>Theme (dark/light mode)</li>
          <li>Language/locale</li>
          <li>Authentication state</li>
        </ul>

        <h3>The Context Pattern</h3>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// 1. Create the context
const ThemeContext = React.createContext(null);

// 2. Create a provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    &lt;ThemeContext.Provider value={{ theme, setTheme }}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  );
}

// 3. Wrap your app
&lt;ThemeProvider&gt;
  &lt;Dashboard /&gt;
&lt;/ThemeProvider&gt;

// 4. Use the context in any child component
function Card() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    &lt;div style={{ background: theme === 'dark' ? '#000' : '#fff' }}&gt;
      &lt;button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}&gt;
        Toggle Theme
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code>
        </pre>

        <h3>When to Use Context</h3>

        <h4>✅ Good Uses of Context</h4>
        <ul>
          <li><strong>Global UI preferences:</strong> theme, language, sidebar collapsed state</li>
          <li><strong>User information:</strong> current user, permissions, roles</li>
          <li><strong>Cross-cutting concerns:</strong> analytics, error tracking</li>
          <li><strong>Data that rarely changes:</strong> app configuration</li>
        </ul>

        <p><strong>Example: Current user context</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>const UserContext = React.createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser().then(setUser).finally(() => setLoading(false));
  }, []);

  return (
    &lt;UserContext.Provider value={{ user, loading }}&gt;
      {children}
    &lt;/UserContext.Provider&gt;
  );
}

// Any component can use it
function ProfileCard() {
  const { user, loading } = useContext(UserContext);

  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  return &lt;div&gt;{user.name}&lt;/div&gt;;
}</code>
        </pre>

        <h4>❌ Bad Uses of Context (Anti-Patterns)</h4>

        <p><strong>1. Frequently-changing state</strong></p>
        <p>Context causes all consumers to re-render when value changes. If theme changes every keystroke, every component re-renders:</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bad: Theme changes on every keystroke, all components re-render
&lt;ThemeProvider&gt;
  &lt;Input value={filterText} onChange={e => setTheme(e.target.value)} /&gt;
&lt;/ThemeProvider&gt;

// ✅ Better: Use local state for frequently-changing data</code>
        </pre>

        <p><strong>2. Replacing prop drilling without good reason</strong></p>
        <p>If only 2-3 levels need data, props are clearer:</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Overkill: Context for data passed 2 levels down
&lt;CurrentPageContext.Provider value={page}&gt;
  &lt;Section page={page}&gt;
&lt;/CurrentPageContext.Provider&gt;

// ✅ Better: Just use props
&lt;Section page={page} /&gt;</code>
        </pre>

        <p><strong>3. Mixing data that changes at different rates</strong></p>
        <p>If some data changes often (filters) and some rarely changes (user), split into two contexts:</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bad: User + filters in one context
const AppContext = createContext({ user, filters, setFilters });
// When filters change, all components re-render (wasting renders of user-aware components)

// ✅ Better: Split into two
const UserContext = createContext(user);
const FilterContext = createContext({ filters, setFilters });
// Components only subscribe to what they need</code>
        </pre>

        <h3>Context Performance: The Re-Render Problem</h3>
        <p><strong>How Context re-renders work:</strong></p>
        <ol>
          <li>Context value changes</li>
          <li>All components using that context re-render</li>
          <li>Even if they only use part of the value</li>
        </ol>

        <p><strong>Example: Why this is inefficient</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code">// This context has two separate concerns
const DashboardContext = createContext({
  selectedSubject: 'math',        // Changes often
  currentUser: { name: 'Alice' }  // Changes rarely
});

function SubjectFilter() {
  const { selectedSubject, setSelectedSubject } = useContext(DashboardContext);
  // Only needs selectedSubject, but re-renders when currentUser changes too
}

function UserProfile() {
  const { currentUser } = useContext(DashboardContext);
  // Only needs currentUser, but re-renders when selectedSubject changes too
}</code>
        </pre>

        <p><strong>The fix: Split into two contexts</strong></p>

        <h3>Reading Context in Unfamiliar Code</h3>
        <p>When you see Context in code, follow this pattern:</p>

        <ol>
          <li>Find the Context creation: <code>createContext()</code></li>
          <li>Find the Provider component that wraps the tree</li>
          <li>Look at the value being provided (what data flows through?)</li>
          <li>Find useContext() calls to see how components consume it</li>
          <li>Check if the value changes (look for setState calls inside Provider)</li>
        </ol>

        <p><strong>Example trace:</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// 1. Context is created here
export const AppContext = createContext(null);

// 2. Provider wraps components
function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    &lt;AppContext.Provider value={{ darkMode, setDarkMode }}&gt;
      {children}
    &lt;/AppContext.Provider&gt;
  );
}

// 3. Consumers use it
function Header() {
  const { darkMode } = useContext(AppContext);
  return &lt;div style={{ background: darkMode ? '#000' : '#fff' }}&gt;...&lt;/div&gt;;
}</code>
        </pre>

        <p><strong>Question to ask:</strong> "When darkMode changes, what re-renders? All components using AppContext."</p>
      `,
      exercises: [
        {
          type: "text",
          label: "Find a Context in this LMS (search for `createContext`). Trace: (1) where it's created, (2) what's in the value, (3) which components use it.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "Should you use Context for 'currently-selected assignment in the assignment editor'?",
          options: [
            { value: "a", label: "Yes, so all editor children can access it" },
            { value: "b", label: "No, it changes frequently—use local state and props instead" },
            { value: "c", label: "Only if more than 5 components need it" },
            { value: "d", label: "Yes, it's UI state" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "You see a Context providing both 'user' and 'currentPage' in the same value. What's the problem with this? How would you fix it?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "reading-state",
      stepNumber: 4,
      title: "Reading State Management in Unfamiliar Code",
      icon: "🔎",
      explanation: `
        <h3>The State Investigation Pattern</h3>
        <p>When you encounter a feature in unfamiliar code, trace the state management this way:</p>

        <h3>Step 1: Find Where State Lives</h3>
        <p>Look for:</p>
        <ul>
          <li><code>useState()</code> → Local state in this component</li>
          <li><code>useContext()</code> → State in a Context somewhere above</li>
          <li><code>useReducer()</code> → Complex state logic in this component</li>
          <li><code>useSelector()</code> (Redux) or <code>useShallow()</code> (Zustand) → Global state store</li>
        </ul>

        <h3>Step 2: Understand the Data Flow</h3>
        <p><strong>Question:</strong> Where does the state come from?</p>
        <ul>
          <li>User input? (<code>onChange</code> handler)</li>
          <li>Props from parent? (passed as prop)</li>
          <li>API response? (fetched in useEffect)</li>
          <li>Another state? (derived)</li>
        </ul>

        <h3>Step 3: Find the State Setters</h3>
        <p>Search for <code>setState</code>, <code>setFilter</code>, <code>dispatch</code>, etc. These show where state changes happen.</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Trace this component
function AssignmentList() {
  // State lives here
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [assignments, setAssignments] = useState([]);

  // State comes from API
  useEffect(() => {
    fetchAssignments(selectedFilter).then(setAssignments);
  }, [selectedFilter]);

  // State changes via user input
  const handleFilterChange = (newFilter) => {
    setSelectedFilter(newFilter);  // ← State setter
  };

  return (
    &lt;&gt;
      &lt;FilterDropdown onChange={handleFilterChange} /&gt;
      &lt;List items={assignments} /&gt;
    &lt;/&gt;
  );
}

// Analysis:
// - selectedFilter: Local state, set by user
// - assignments: Local state, fetched from API
// - Both change together via dependency chain</code>
        </pre>

        <h3>The State Dependency Map</h3>
        <p>Draw a mental map of state dependencies:</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Example dependency chain
selectedSubject (user picks it)
    ↓
fetchAssignments(selectedSubject)  (API call)
    ↓
assignments (displayed in list)
    ↓
filteredAssignments (derived, not stored)

// Questions to ask:
// 1. What triggers selectedSubject to change?
// 2. When selectedSubject changes, what else re-fetches?
// 3. Is assignments stored or derived?
// 4. Is filteredAssignments recalculated every render?</code>
        </pre>

        <h3>Red Flags When Reading State</h3>

        <h4>🚩 Stale State (State is out of date)</h4>
        <p><strong>Pattern:</strong> State is set in useEffect but used before it's updated.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Stale state bug
const [userId, setUserId] = useState(null);
const [userData, setUserData] = useState(null);

useEffect(() => {
  // userId is still null here
  if (userId) {
    fetchUser(userId).then(setUserData);
  }
}, []);

// userId is set later, but useEffect already ran</code>
        </pre>

        <h4>🚩 Derived State (Stored when it should be calculated)</h4>
        <p><strong>Pattern:</strong> State that's always computed from other state, causing sync issues.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bad: filteredList is stored
const [allItems, setAllItems] = useState([]);
const [filteredList, setFilteredList] = useState([]);

// Now filteredList can get out of sync with allItems

// ✅ Good: Derive it
const [allItems, setAllItems] = useState([]);
const filteredList = allItems.filter(item => item.subject === 'math');
// Always in sync</code>
        </pre>

        <h4>🚩 Multiple Sources of Truth</h4>
        <p><strong>Pattern:</strong> Same data stored in multiple places (local state AND Context AND Redux)</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bad: currentUser stored in three places
function Dashboard() {
  const localUser = useState(...);
  const contextUser = useContext(UserContext);
  const reduxUser = useSelector(selectUser);

  // Which is the source of truth? They can diverge.</code>
        </pre>

        <h3>Helpful Questions to Ask When Reading State</h3>
        <ul>
          <li><strong>"Where does this state come from?"</strong> (input, API, derivation)</li>
          <li><strong>"What triggers it to change?"</strong> (event handler, API, parent prop)</li>
          <li><strong>"What else depends on this state?"</strong> (other components, effects)</li>
          <li><strong>"Is this state necessary or could it be derived?"</strong> (remove it if possible)</li>
          <li><strong>"Could this state get out of sync with reality?"</strong> (invalidation/cache issues)</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Find a component in this LMS with multiple useState hooks. For each state variable, answer: (1) where does it come from, (2) what changes it, (3) what depends on it.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You see this pattern: `const filtered = data.filter(...); setFiltered(filtered);` inside an effect. Is this good or bad?",
          options: [
            { value: "a", label: "Good—it keeps derived state in sync" },
            { value: "b", label: "Bad—filtered should be computed, not stored" },
            { value: "c", label: "Depends on how often it changes" },
            { value: "d", label: "Neutral—either way works" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "Trace the state flow for the subject filter feature in this LMS. Map: selectedSubject → what gets fetched → what re-renders.",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "when-to-use-redux",
      stepNumber: 5,
      title: "When to Reach for Redux/Zustand vs. Context",
      icon: "🏗️",
      explanation: `
        <h3>The State Management Hierarchy</h3>
        <p>Know when each tool is the right choice:</p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: rgba(123, 168, 132, 0.1);">
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Tool</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>When to Use</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Tradeoff</strong></th>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">useState</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Single component needs state</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Simplest, isolated, easy to test</td>
          </tr>
          <tr style="background: rgba(20, 32, 47, 0.03);">
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Props (lifted state)</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Multiple children of one parent need state</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Explicit flow, clear dependencies, props drilling if too deep</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Context</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Global state that rarely changes (user, theme, config)</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">No props drilling, but all consumers re-render when value changes</td>
          </tr>
          <tr style="background: rgba(20, 32, 47, 0.03);">
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Redux/Zustand</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Complex global state, many subscriptions, frequent changes</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">More boilerplate, but fine-grained subscriptions and time-travel debugging</td>
          </tr>
        </table>

        <h3>Redux Red Lights 🚨</h3>
        <p>Using Redux when Context is enough:</p>
        <ul>
          <li>Only 2-3 global values stored</li>
          <li>State changes rarely</li>
          <li>No complex logic (reducers)</li>
          <li>App is small-to-medium</li>
        </ul>
        <p><strong>Insight:</strong> Most apps are over-engineered with Redux. Try Context first.</p>

        <h3>Context Red Lights ⚠️</h3>
        <p>When Context becomes painful, switch to Redux/Zustand:</p>
        <ul>
          <li>You have 5+ contexts in one provider</li>
          <li>State changes every keystroke (causes excessive re-renders)</li>
          <li>You need time-travel debugging</li>
          <li>State logic is complex (multiple reducers)</li>
        </ul>

        <h3>The Decision Flow</h3>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Do I need to store this state?
  ├─ YES: Is it specific to one component?
  │   ├─ YES: Use useState
  │   └─ NO: Do multiple children of one parent need it?
  │       ├─ YES: Use lifted state (useState in parent, pass as props)
  │       └─ NO: Do I need to avoid prop drilling?
  │           ├─ YES: Use Context
  │           └─ NO: Keep using props
  │
  ├─ After using Context: Is state changing very frequently?
  │   ├─ YES: Consider Redux/Zustand to avoid excessive re-renders
  │   └─ NO: Context is fine
  │
  └─ NO: Derive it from other state (no state needed!)</code>
        </pre>

        <h3>Real Examples: This LMS</h3>

        <h4>Example 1: Current User</h4>
        <p><strong>Why Context is right:</strong> Needed throughout app, rarely changes, many components need it.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Context is appropriate here
const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  // ... fetch on mount
  return &lt;UserContext.Provider value={user}&gt;{children}&lt;/UserContext.Provider&gt;;
}</code>
        </pre>

        <h4>Example 2: Subject Filter</h4>
        <p><strong>Why local state + props is right:</strong> Only dashboard and its children need it, prop drilling is minimal (2 levels).</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Props is appropriate here
function Dashboard() {
  const [subject, setSubject] = useState('all');

  return (
    &lt;&gt;
      &lt;SubjectFilter value={subject} onChange={setSubject} /&gt;
      &lt;CardGrid subject={subject} /&gt;
    &lt;/&gt;
  );
}</code>
        </pre>

        <h4>Example 3: Form Validation Errors</h4>
        <p><strong>Why local state is right:</strong> Only the form component needs to display errors, can be reset easily.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>function Form() {
  const [errors, setErrors] = useState({});

  function handleSubmit() {
    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // submit
  }
}</code>
        </pre>
      `,
      exercises: [
        {
          type: "text",
          label: "List 3 pieces of state in this LMS. For each, decide: localStorage useState, lifted state, Context, or Redux? Justify your choice.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You have 8 separate Contexts providing different global data. What's the problem?",
          options: [
            { value: "a", label: "Nothing—multiple contexts are fine" },
            { value: "b", label: "Each one causes all subscribers to re-render when value changes; consider consolidating or using Redux" },
            { value: "c", label: "8 contexts is too many, you need exactly 4" },
            { value: "d", label: "Performance is automatically optimized by React" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "Your form state includes 10 input fields. Would you use localStorage, a custom hook, or Context? Why?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "debugging-state",
      stepNumber: 6,
      title: "Debugging State Issues: Stale State and Over-Rendering",
      icon: "🐛",
      explanation: `
        <h3>The Most Common State Bugs</h3>

        <h3>Bug 1: Stale Closure (Stale State in Event Handler)</h3>
        <p><strong>The problem:</strong> A callback captures old state value.</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bug: count is stale in the setTimeout
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      console.log(count); // Always logs 0
    }, 1000);
  };

  return (
    &lt;&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;Click&lt;/button&gt;
      &lt;button onClick={handleClick}&gt;Log after 1s&lt;/button&gt;
    &lt;/&gt;
  );
}

// ✅ Fix: Use a ref or pass state through
const handleClick = () => {
  setTimeout(() => {
    console.log(count); // Still stale
  }, 1000);
};

// Better: useRef to track latest value
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count;
}, [count]);

const handleClick = () => {
  setTimeout(() => {
    console.log(countRef.current); // Current value
  }, 1000);
};</code>
        </pre>

        <h3>Bug 2: Missing Dependency (useEffect runs too often or not enough)</h3>
        <p><strong>The problem:</strong> useEffect dependency array is wrong.</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bug: Effect runs on every render
useEffect(() => {
  fetchUser(userId);
  // Missing dependency array
}, );

// ❌ Bug: Effect never re-runs when dependency changes
useEffect(() => {
  fetchUser(userId);
}, []); // Should be [userId]

// ✅ Correct: Dependency array includes all state/props used
useEffect(() => {
  if (userId) {
    fetchUser(userId);
  }
}, [userId]);</code>
        </pre>

        <h3>Bug 3: State Update in Effects (Infinite loop)</h3>
        <p><strong>The problem:</strong> Effect updates state, which triggers the effect again.</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bug: setData triggers effect again
useEffect(() => {
  fetchData().then(setData);
  // setData is missing from dependency array
}, []); // Should include setData (though it's usually stable)

// Better: ESLint will catch this with proper config
// "react-hooks/exhaustive-deps": "warn"</code>
        </pre>

        <h3>Bug 4: Over-Rendering (Component re-renders when it shouldn't)</h3>
        <p><strong>The problem:</strong> Parent state change causes unnecessary child re-renders.</p>

        <p><strong>How to detect:</strong> Use React DevTools Profiler or add console.log at component top.</p>

        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// ❌ Bug: Every keystroke re-renders big list
function Dashboard() {
  const [filter, setFilter] = useState('');
  const [items] = useState(hugeList);

  console.log('Dashboard rendered'); // Logs on every keystroke

  return (
    &lt;&gt;
      &lt;input onChange={e => setFilter(e.target.value)} /&gt;
      &lt;ItemList items={items} /&gt;
    &lt;/&gt;
  );
}

// ✅ Fix: Split components
function FilterInput({ value, onChange }) {
  console.log('FilterInput rendered'); // Logs on every keystroke (OK for input)
  return &lt;input value={value} onChange={e => onChange(e.target.value)} /&gt;;
}

function Dashboard() {
  const [filter, setFilter] = useState('');
  const [items] = useState(hugeList);

  return (
    &lt;&gt;
      &lt;FilterInput value={filter} onChange={setFilter} /&gt;
      &lt;ItemList items={items} /&gt; {/* Only re-renders if items changes */}
    &lt;/&gt;
  );
}</code>
        </pre>

        <h3>Debugging Tools</h3>

        <h4>1. React DevTools Profiler</h4>
        <p>Record which components re-render and why:</p>
        <ol>
          <li>Open React DevTools (Profiler tab)</li>
          <li>Click "Record"</li>
          <li>Interact with your app</li>
          <li>Stop recording and inspect what re-rendered</li>
          <li>Look for unexpected re-renders</li>
        </ol>

        <h4>2. Console.log at Component Top</h4>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>function MyComponent() {
  console.log('MyComponent rendered', new Date().toLocaleTimeString());
  // Now you can see how often it renders
}</code>
        </pre>

        <h4>3. useWhyDidYouUpdate Hook</h4>
        <p>Custom hook to debug why a component re-rendered:</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();
  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps = {};

      allKeys.forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = { from: previousProps.current[key], to: props[key] };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }

    previousProps.current = props;
  }, [props, name]);
}</code>
        </pre>

        <h3>The Debugging Checklist</h3>
        <p>When you see weird state behavior:</p>
        <ul>
          <li>☑️ Does state change when you expect?</li>
          <li>☑️ Does the component re-render when you expect?</li>
          <li>☑️ Are dependencies in useEffect correct?</li>
          <li>☑️ Is there a stale closure capturing old state?</li>
          <li>☑️ Are there multiple sources of truth for the same data?</li>
          <li>☑️ Is derived state being stored instead of computed?</li>
          <li>☑️ Use React DevTools to profile renders</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Write a small React component with a stale closure bug (like the counter example). Then fix it.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "A component re-renders on every keystroke even though the input is in a different component. What's likely the cause?",
          options: [
            { value: "a", label: "React bug—nothing you can do" },
            { value: "b", label: "Parent component's state changed, causing all children to re-render" },
            { value: "c", label: "The input component has a bug" },
            { value: "d", label: "Context value changed" }
          ],
          expectedAnswer: "b"
        }
      ]
    },
    {
      id: "practice-state-decisions",
      stepNumber: 7,
      title: "Practice: State Pattern Decisions in This LMS",
      icon: "⚖️",
      explanation: `
        <h3>Apply What You've Learned</h3>
        <p>Read real state management in this LMS and make decisions:</p>

        <h3>Exercise 1: Find Local State Decisions</h3>
        <p>Find 3 components with useState. For each, answer:</p>
        <ul>
          <li>What state is stored locally?</li>
          <li>Why is it local and not lifted/contexted?</li>
          <li>What would happen if you lifted it to the parent?</li>
        </ul>

        <h3>Exercise 2: Identify Lifting Opportunities</h3>
        <p>Find 2 sibling components that probably should share state. Describe:</p>
        <ul>
          <li>What state should they share?</li>
          <li>Why do they need shared state?</li>
          <li>What's the current pattern (are they in sync)?</li>
        </ul>

        <h3>Exercise 3: Read Context Usage</h3>
        <p>Find all useContext() calls in this LMS. For each:</p>
        <ul>
          <li>What Context is being used?</li>
          <li>What data flows through it?</li>
          <li>Is this a good use of Context? Why or why not?</li>
        </ul>

        <h3>Exercise 4: Spot Over-Rendering</h3>
        <p>Pick one feature and reason about re-renders:</p>
        <ul>
          <li>When a student clicks "Submit", what components re-render?</li>
          <li>Are there unnecessary re-renders?</li>
          <li>How would you optimize?</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "PRACTICE 1: Find 3 components with useState in this LMS. For each: (1) what state, (2) why is it local, (3) what if you lifted it?",
          acceptAnyAttempt: true
        },
        {
          type: "text",
          label: "PRACTICE 2: Find the main context(s) in this LMS. For each: (1) what's in it, (2) where is it provided, (3) how many components use it?",
          acceptAnyAttempt: true
        },
        {
          type: "text",
          label: "PRACTICE 3: Trace a feature (e.g., 'submit assignment', 'filter by subject'). Identify all state changes and re-renders. Is the pattern efficient?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "practice-cadence",
      stepNumber: 99,
      title: "Practice Cadence + I Can Now",
      icon: "✅",
      explanation: `
        <h3>The State Management Practice Loop</h3>
        <p><strong>Weekly practice:</strong> Pick one component and refactor its state management:</p>
        <ol>
          <li>Identify all useState/useContext/useReducer calls</li>
          <li>Ask: Could this be derived state? Could this be lifted?</li>
          <li>Make one change (lift state, remove unnecessary state, split context)</li>
          <li>Test that the behavior still works</li>
          <li>Note what you learned</li>
        </ol>

        <p><strong>Monthly challenge:</strong> Refactor a complex state pattern:</p>
        <ol>
          <li>Find a feature with prop drilling (props passed through 3+ levels)</li>
          <li>Evaluate: Is Context the right solution?</li>
          <li>If yes, implement Context and remove prop drilling</li>
          <li>If no, reorganize component tree</li>
          <li>Run tests to ensure nothing broke</li>
        </ol>

        <h3>I Can Now...</h3>
        <ul>
          <li>Decide when state should be local, lifted, or contexted</li>
          <li>Recognize prop drilling and know when to fix it</li>
          <li>Use Context appropriately without over-using it</li>
          <li>Read state management patterns in unfamiliar code</li>
          <li>Debug stale state and over-rendering issues</li>
          <li>Make tradeoff decisions between different state patterns</li>
          <li>Know when Context has become too cumbersome and Redux/Zustand is needed</li>
          <li>Use React DevTools to profile and optimize renders</li>
        </ul>

        <h3>The Mental Model</h3>
        <p><strong>State flows downward (parent to children via props).</strong> User interactions flow upward (child event → parent callback). Questions to ask:</p>
        <ul>
          <li>Does this state change together with other state?</li>
          <li>How many components need this state?</li>
          <li>How far down the tree is the deepest consumer?</li>
          <li>Is this state or is it derived?</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Design the state management for a feature YOU want to build (real or fictional). Justify your choice of local state vs. lifted vs. Context.",
          acceptAnyAttempt: true
        }
      ]
    }
  ],
  miniQuiz: [
    {
      id: "local-q1",
      question: "When should you use local state (useState)?",
      options: [
        { value: "a", label: "Always—it's the simplest" },
        { value: "b", label: "When only one component needs that state" },
        { value: "c", label: "Never—use Context instead" },
        { value: "d", label: "Only for forms" }
      ],
      correctAnswer: "b",
      explanation: "Local state is perfect when only one component needs it. It's isolated, easy to test, and doesn't cause unnecessary re-renders of siblings.",
      topic: "local-state",
      skill: "state-management",
      skillTag: "local-state",
      difficulty: "easy"
    },
    {
      id: "lifting-q1",
      question: "Two sibling components need to know the same selected filter. Where should the state live?",
      options: [
        { value: "a", label: "In each sibling (they can sync via Context)" },
        { value: "b", label: "In their shared parent component" },
        { value: "c", label: "In a global Redux store" },
        { value: "d", label: "In a database, queried independently" }
      ],
      correctAnswer: "b",
      explanation: "When siblings need to share state, lift it to the lowest common ancestor (their parent). Pass the state down as props, and pass callbacks up.",
      topic: "lifting-state",
      skill: "state-management",
      skillTag: "lifting",
      difficulty: "easy"
    },
    {
      id: "prop-drill-q1",
      question: "What is 'prop drilling'?",
      options: [
        { value: "a", label: "Using React Drill library" },
        { value: "b", label: "Passing props through components that don't use them" },
        { value: "c", label: "Passing props from child to parent" },
        { value: "d", label: "Any time you use props" }
      ],
      correctAnswer: "b",
      explanation: "Prop drilling is passing data through multiple levels of components where intermediate components don't use it. Context or restructuring often helps.",
      topic: "lifting-state",
      skill: "state-management",
      skillTag: "prop-drilling",
      difficulty: "easy"
    },
    {
      id: "context-q1",
      question: "When is Context the right choice for state?",
      options: [
        { value: "a", label: "Always use Context to avoid prop drilling" },
        { value: "b", label: "When data is global, rarely changes, and many components need it" },
        { value: "c", label: "Only for user data" },
        { value: "d", label: "Context should rarely be used" }
      ],
      correctAnswer: "b",
      explanation: "Context is ideal for global state like user, theme, or language that changes rarely and is needed by many components at different levels.",
      topic: "context-api",
      skill: "state-management",
      skillTag: "context",
      difficulty: "medium"
    },
    {
      id: "context-perf-q1",
      question: "What's the main performance issue with Context?",
      options: [
        { value: "a", label: "Context is always slow" },
        { value: "b", label: "All components using a Context re-render when the value changes" },
        { value: "c", label: "Context prevents React optimization" },
        { value: "d", label: "No performance issues—Context is optimized" }
      ],
      correctAnswer: "b",
      explanation: "When Context value changes, ALL components using that Context re-render, even if they only care about part of it. Split contexts to optimize.",
      topic: "context-api",
      skill: "state-management",
      skillTag: "performance",
      difficulty: "medium"
    },
    {
      id: "reading-q1",
      question: "You see `useState()` in a component. What's the first question to ask?",
      options: [
        { value: "a", label: "Where does this state come from?" },
        { value: "b", label: "Why is this state necessary?" },
        { value: "c", label: "Could this be derived from other state?" },
        { value: "d", label: "All of the above" }
      ],
      correctAnswer: "d",
      explanation: "Understanding state requires asking all three: source (where it comes from), necessity (why store it), and whether it's derivable (or whether it causes sync issues).",
      topic: "reading-state",
      skill: "state-management",
      skillTag: "debugging",
      difficulty: "medium"
    },
    {
      id: "derived-q1",
      question: "You see: `const filtered = data.filter(...); setFiltered(filtered);` in a useEffect. Is this good?",
      options: [
        { value: "a", label: "Good—keeps derived state in sync" },
        { value: "b", label: "Bad—filtered should be computed every render, not stored" },
        { value: "c", label: "Depends on how often data changes" },
        { value: "d", label: "Fine either way" }
      ],
      correctAnswer: "b",
      explanation: "Derived state (computed from other state) shouldn't be stored. Compute it directly: `const filtered = useMemo(() => data.filter(...), [data]);`",
      topic: "reading-state",
      skill: "state-management",
      skillTag: "derived-state",
      difficulty: "medium"
    },
    {
      id: "redux-q1",
      question: "When should you use Redux or Zustand instead of Context?",
      options: [
        { value: "a", label: "Always—they're better than Context" },
        { value: "b", label: "When Context becomes too cumbersome: many values, frequent changes, complex logic" },
        { value: "c", label: "Never—Context is always enough" },
        { value: "d", label: "Only if you're using TypeScript" }
      ],
      correctAnswer: "b",
      explanation: "Redux/Zustand add complexity. Use them when Context limitations become painful: too many re-renders, complex state logic, or needing time-travel debugging.",
      topic: "when-to-use-redux",
      skill: "state-management",
      skillTag: "tools",
      difficulty: "hard"
    },
    {
      id: "stale-q1",
      question: "What's a 'stale closure' in React?",
      options: [
        { value: "a", label: "A component that doesn't update" },
        { value: "b", label: "When a callback captures old state because it was defined before state changed" },
        { value: "c", label: "When a context value is outdated" },
        { value: "d", label: "A React bug that needs fixing" }
      ],
      correctAnswer: "b",
      explanation: "Stale closures happen when callbacks reference old state. The callback was defined with state=X, but now state=Y. Solution: include state in dependencies or use refs.",
      topic: "debugging-state",
      skill: "state-management",
      skillTag: "debugging",
      difficulty: "hard"
    },
    {
      id: "judgment-q1",
      question: "Your app has 7 different Contexts. One change to any context causes many components to re-render. What's your next move?",
      options: [
        { value: "a", label: "This is normal—React optimizes it automatically" },
        { value: "b", label: "Consolidate contexts to reduce re-renders" },
        { value: "c", label: "Split contexts by change frequency and usage patterns, or consider Redux/Zustand" },
        { value: "d", label: "Add more contexts to be more granular" }
      ],
      correctAnswer: "c",
      explanation: "Too many contexts cause performance issues. Split by change frequency (fast-changing vs. slow), or migrate complex state to Redux/Zustand.",
      topic: "when-to-use-redux",
      skill: "state-management",
      skillTag: "architecture",
      difficulty: "hard"
    }
  ]
};
