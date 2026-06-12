// organize-mobile-data.js
// Mock data & design tokens for the Organize Mobile Redesign prototype

window.PROJECTS = [
  { id: 'p-spanish', label: 'Spanish',  color: 'mint'     },
  { id: 'p-coding',  label: 'Coding',   color: 'sky'      },
  { id: 'p-health',  label: 'Health',   color: 'sage'     },
  { id: 'p-reading', label: 'Reading',  color: 'peach'    },
];

window.INITIAL_BULLETS = [
  { id: 'b01', text: 'Review ser vs estar decision rules',         project: 'p-spanish', lane: 'now'  },
  { id: 'b02', text: 'Listen to podcast episode 14',               project: 'p-spanish', lane: 'now'  },
  { id: 'b03', text: 'Complete grammar exercise 5',                project: 'p-spanish', lane: 'next' },
  { id: 'b04', text: 'Practice subjunctive triggers with examples',project: 'p-spanish', lane: 'next' },
  { id: 'b05', text: 'Vocabulary deck: food & restaurants',        project: 'p-spanish', lane: 'later'},
  { id: 'b06', text: 'Write reflection on B1 progress',           project: 'p-spanish', lane: 'later'},
  { id: 'b07', text: 'Fix mobile layout on organize page',         project: 'p-coding',  lane: 'now'  },
  { id: 'b08', text: 'Write unit tests for planner API',           project: 'p-coding',  lane: 'next' },
  { id: 'b09', text: 'Refactor media hub components',              project: 'p-coding',  lane: 'next' },
  { id: 'b10', text: 'Audit and update dependencies',              project: 'p-coding',  lane: 'later'},
  { id: 'b11', text: 'Morning walk — 30 min',                      project: 'p-health',  lane: 'now'  },
  { id: 'b12', text: 'Log meals in health tracker',                project: 'p-health',  lane: 'next' },
  { id: 'b13', text: 'Schedule annual checkup',                    project: 'p-health',  lane: 'later'},
  { id: 'b14', text: 'Read chapter 4 of Atomic Habits',            project: 'p-reading', lane: 'now'  },
  { id: 'b15', text: 'Take notes on key highlights',               project: 'p-reading', lane: 'next' },
  { id: 'b16', text: 'Call dentist to reschedule appointment',     project: null,        lane: null   },
  { id: 'b17', text: 'Research flights for June trip',             project: null,        lane: null   },
  { id: 'b18', text: 'Pick up dry cleaning before Friday',         project: null,        lane: null   },
];

window.PROJECT_COLORS = {
  mint:     { dot: 'hsl(162,38%,58%)', bg: 'hsla(162,38%,58%,0.1)',  border: 'hsla(162,38%,58%,0.28)', text: 'hsl(162,40%,72%)' },
  sky:      { dot: 'hsl(205,58%,72%)', bg: 'hsla(205,58%,72%,0.1)',  border: 'hsla(205,58%,72%,0.28)', text: 'hsl(205,60%,80%)' },
  sage:     { dot: 'hsl(167,34%,63%)', bg: 'hsla(167,34%,63%,0.1)',  border: 'hsla(167,34%,63%,0.28)', text: 'hsl(167,36%,74%)' },
  peach:    { dot: 'hsl(24,44%,70%)',  bg: 'hsla(24,44%,70%,0.1)',   border: 'hsla(24,44%,70%,0.28)',  text: 'hsl(24,46%,78%)' },
  lavender: { dot: 'hsl(270,25%,66%)', bg: 'hsla(270,25%,66%,0.1)',  border: 'hsla(270,25%,66%,0.28)', text: 'hsl(270,26%,76%)' },
  rose:     { dot: 'hsl(343,32%,64%)', bg: 'hsla(343,32%,64%,0.1)',  border: 'hsla(343,32%,64%,0.28)', text: 'hsl(343,34%,74%)' },
};

window.LANE_CONFIG = {
  now:   { label: 'Now',   color: '#d48aa6' },
  next:  { label: 'Next',  color: '#4f8c9e' },
  later: { label: 'Later', color: '#78bfa5' },
  done:  { label: 'Done',  color: '#5fba7d' },
};
