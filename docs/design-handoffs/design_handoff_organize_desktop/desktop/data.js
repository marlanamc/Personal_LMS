// data.js — shared desktop tokens + mock data
// Same DNA as mobile, extended for desktop needs

window.PROJECTS = [
  { id: 'p-spanish', label: 'Spanish',  color: 'mint',     icon: 'globe'   },
  { id: 'p-coding',  label: 'Coding',   color: 'sky',      icon: 'code'    },
  { id: 'p-health',  label: 'Health',   color: 'sage',     icon: 'heart'   },
  { id: 'p-reading', label: 'Reading',  color: 'peach',    icon: 'book'    },
  { id: 'p-writing', label: 'Writing',  color: 'lavender', icon: 'edit'    },
];

window.INITIAL_BULLETS = [
  // Spanish
  { id: 'b01', text: 'Review ser vs estar decision rules',         project: 'p-spanish', lane: 'now'   },
  { id: 'b02', text: 'Listen to podcast episode 14',               project: 'p-spanish', lane: 'now'   },
  { id: 'b03', text: 'Complete grammar exercise 5',                project: 'p-spanish', lane: 'next'  },
  { id: 'b04', text: 'Practice subjunctive triggers with examples',project: 'p-spanish', lane: 'next'  },
  { id: 'b05', text: 'Vocabulary deck: food & restaurants',        project: 'p-spanish', lane: 'later' },
  { id: 'b06', text: 'Write reflection on B1 progress',            project: 'p-spanish', lane: 'later' },
  { id: 'b24', text: 'Watch one Destinos episode',                 project: 'p-spanish', lane: 'later' },
  // Coding
  { id: 'b07', text: 'Fix mobile layout on organize page',         project: 'p-coding',  lane: 'now'   },
  { id: 'b08', text: 'Write unit tests for planner API',           project: 'p-coding',  lane: 'next'  },
  { id: 'b09', text: 'Refactor media hub components',              project: 'p-coding',  lane: 'next'  },
  { id: 'b10', text: 'Audit and update dependencies',              project: 'p-coding',  lane: 'later' },
  { id: 'b25', text: 'Migrate to React 19 & evaluate',             project: 'p-coding',  lane: 'later' },
  // Health
  { id: 'b11', text: 'Morning walk — 30 min',                      project: 'p-health',  lane: 'now'   },
  { id: 'b12', text: 'Log meals in health tracker',                project: 'p-health',  lane: 'next'  },
  { id: 'b13', text: 'Schedule annual checkup',                    project: 'p-health',  lane: 'later' },
  { id: 'b26', text: 'Stretch routine before bed',                 project: 'p-health',  lane: 'next'  },
  // Reading
  { id: 'b14', text: 'Read chapter 4 of Atomic Habits',            project: 'p-reading', lane: 'now'   },
  { id: 'b15', text: 'Take notes on key highlights',               project: 'p-reading', lane: 'next'  },
  { id: 'b27', text: 'Browse library for next pick',               project: 'p-reading', lane: 'later' },
  // Writing
  { id: 'b28', text: 'Draft essay outline: quiet mornings',        project: 'p-writing', lane: 'now'   },
  { id: 'b29', text: 'Edit paragraph 3 of memoir piece',           project: 'p-writing', lane: 'next'  },
  { id: 'b30', text: 'Collect 5 voice-note fragments',             project: 'p-writing', lane: 'later' },
  // Inbox (unsorted)
  { id: 'b16', text: 'Call dentist to reschedule appointment',     project: null,        lane: null    },
  { id: 'b17', text: 'Research flights for June trip',             project: null,        lane: null    },
  { id: 'b18', text: 'Pick up dry cleaning before Friday',         project: null,        lane: null    },
  { id: 'b19', text: 'Idea: newsletter section on rituals',        project: null,        lane: null    },
  { id: 'b20', text: 'Renew passport — photos + form',             project: null,        lane: null    },
];

// Pastel project palette — same mobile hues
window.PROJECT_COLORS = {
  mint:     { dot: 'hsl(162,38%,58%)', bg: 'hsla(162,38%,58%,0.10)', bgStrong: 'hsla(162,38%,58%,0.18)', border: 'hsla(162,38%,58%,0.28)', text: 'hsl(162,40%,74%)', glow: 'hsla(162,38%,58%,0.25)' },
  sky:      { dot: 'hsl(205,58%,72%)', bg: 'hsla(205,58%,72%,0.10)', bgStrong: 'hsla(205,58%,72%,0.18)', border: 'hsla(205,58%,72%,0.28)', text: 'hsl(205,60%,82%)', glow: 'hsla(205,58%,72%,0.25)' },
  sage:     { dot: 'hsl(167,34%,63%)', bg: 'hsla(167,34%,63%,0.10)', bgStrong: 'hsla(167,34%,63%,0.18)', border: 'hsla(167,34%,63%,0.28)', text: 'hsl(167,36%,76%)', glow: 'hsla(167,34%,63%,0.25)' },
  peach:    { dot: 'hsl(24,44%,70%)',  bg: 'hsla(24,44%,70%,0.10)',  bgStrong: 'hsla(24,44%,70%,0.18)',  border: 'hsla(24,44%,70%,0.28)',  text: 'hsl(24,46%,80%)',  glow: 'hsla(24,44%,70%,0.25)'  },
  lavender: { dot: 'hsl(270,25%,66%)', bg: 'hsla(270,25%,66%,0.10)', bgStrong: 'hsla(270,25%,66%,0.18)', border: 'hsla(270,25%,66%,0.28)', text: 'hsl(270,26%,78%)', glow: 'hsla(270,25%,66%,0.25)' },
  rose:     { dot: 'hsl(343,32%,64%)', bg: 'hsla(343,32%,64%,0.10)', bgStrong: 'hsla(343,32%,64%,0.18)', border: 'hsla(343,32%,64%,0.28)', text: 'hsl(343,34%,76%)', glow: 'hsla(343,32%,64%,0.25)' },
};

// Lane semantics
window.LANE_CONFIG = {
  now:   { label: 'Now',   color: '#d48aa6', bg: 'rgba(212,138,166,0.08)',  border: 'rgba(212,138,166,0.22)', glow: 'rgba(212,138,166,0.3)' },
  next:  { label: 'Next',  color: '#4f8c9e', bg: 'rgba(79,140,158,0.08)',   border: 'rgba(79,140,158,0.22)',  glow: 'rgba(79,140,158,0.3)'  },
  later: { label: 'Later', color: '#78bfa5', bg: 'rgba(120,191,165,0.08)',  border: 'rgba(120,191,165,0.22)', glow: 'rgba(120,191,165,0.3)' },
  done:  { label: 'Done',  color: '#5fba7d', bg: 'rgba(95,186,125,0.08)',   border: 'rgba(95,186,125,0.22)',  glow: 'rgba(95,186,125,0.3)'  },
};

// Desktop-specific tokens
window.T = {
  bg: '#122033',
  surface: '#18273a',
  elevated: '#1e3046',
  hover: 'rgba(255,255,255,0.035)',
  borderSubtle: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.1)',
  text: '#e6edf6',
  textSecondary: '#a9b7c8',
  textMuted: '#6e7e91',
  textFaint: '#4a5a6a',
  primary: '#d48aa6',
  teal: '#4f8c9e',
  mint: '#78bfa5',
  amethyst: '#a089c7',
  fontDisplay: "'Outfit', system-ui, sans-serif",
  fontBody: "'Manrope', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
  railWidth: 56,
};
