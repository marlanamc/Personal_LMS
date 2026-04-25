// atoms.jsx — shared small components: Icon, TaskCheck, ProjectPill, LaneTag, KeyHint

const { useState: useStateA, useRef: useRefA, useEffect: useEffectA } = React;

// ─── ICONS ────────────────────────────────────────────────────────────────────
// Minimal line-icon set, 1.5 stroke, matching mobile design voice
function Icon({ name, size = 16, color = 'currentColor', style = {} }) {
  const s = { width: size, height: size, color, flexShrink: 0, ...style };
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    check:     <path d="M3 8l3.5 3.5L13 4" {...common}/>,
    plus:      <><path d="M8 3v10M3 8h10" {...common}/></>,
    x:         <path d="M3 3l10 10M13 3L3 13" {...common}/>,
    chevron:   <path d="M4 6l4 4 4-4" {...common}/>,
    chevronR:  <path d="M6 4l4 4-4 4" {...common}/>,
    chevronL:  <path d="M10 4l-4 4 4 4" {...common}/>,
    search:    <><circle cx="7" cy="7" r="4.5" {...common}/><path d="M10.5 10.5L13.5 13.5" {...common}/></>,
    inbox:     <><path d="M2 9h3l1 2h4l1-2h3M2 9l1.5-5h9L14 9v5H2V9z" {...common}/></>,
    list:      <><path d="M4 4h9M4 8h9M4 12h9M1.5 4h.1M1.5 8h.1M1.5 12h.1" {...common}/></>,
    bento:     <><rect x="2" y="2" width="5" height="5" rx="1" {...common}/><rect x="9" y="2" width="5" height="5" rx="1" {...common}/><rect x="2" y="9" width="5" height="5" rx="1" {...common}/><rect x="9" y="9" width="5" height="5" rx="1" {...common}/></>,
    flow:      <><circle cx="4" cy="8" r="2" {...common}/><circle cx="12" cy="8" r="2" {...common}/><path d="M6 8h4" {...common}/></>,
    cmd:       <path d="M5 3h6v6H5zM3 5v6h6M13 5v6h-6M5 13h6" {...common}/>,
    hash:      <path d="M4 2v12M10 2v12M2 5h12M2 11h12" {...common}/>,
    arrowR:    <path d="M3 8h10M9 4l4 4-4 4" {...common}/>,
    dot:       <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none"/>,
    more:      <><circle cx="3" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="13" cy="8" r="1" fill="currentColor" stroke="none"/></>,
    pin:       <path d="M8 1l2 4 4 .5-3 2.8.7 4.2L8 10.5 4.3 12.5 5 8.3 2 5.5 6 5z" {...common}/>,
    drag:      <><circle cx="5" cy="4" r="1" fill="currentColor" stroke="none"/><circle cx="11" cy="4" r="1" fill="currentColor" stroke="none"/><circle cx="5" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="11" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="11" cy="12" r="1" fill="currentColor" stroke="none"/></>,
    sparkle:   <path d="M8 2v4M8 10v4M2 8h4M10 8h4M4 4l2 2M10 10l2 2M4 12l2-2M10 6l2-2" {...common}/>,
    globe:     <><circle cx="8" cy="8" r="6" {...common}/><path d="M2 8h12M8 2c2 2 3 4 3 6s-1 4-3 6c-2-2-3-4-3-6s1-4 3-6z" {...common}/></>,
    code:      <path d="M6 5l-3 3 3 3M10 5l3 3-3 3" {...common}/>,
    heart:     <path d="M8 13s-5-3-5-7a2.8 2.8 0 015-1.8A2.8 2.8 0 0113 6c0 4-5 7-5 7z" {...common}/>,
    book:      <path d="M2.5 3h5a2 2 0 012 2v8.5M2.5 3v9.5a2 2 0 002 2H9.5m4-11.5h-5a2 2 0 00-2 2v8.5m7-10.5v9.5a2 2 0 01-2 2H6.5" {...common}/>,
    edit:      <path d="M10 2.5l3 3L5.5 13l-4 1 1-4z" {...common}/>,
    play:      <path d="M5 3v10l8-5-8-5z" fill="currentColor" stroke="none"/>,
    pause:     <><rect x="4" y="3" width="3" height="10" fill="currentColor" stroke="none"/><rect x="9" y="3" width="3" height="10" fill="currentColor" stroke="none"/></>,
    filter:    <path d="M2 3h12l-4.5 6v5l-3-1.5V9z" {...common}/>,
    eye:       <><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" {...common}/><circle cx="8" cy="8" r="2" {...common}/></>,
    sidebar:   <><rect x="2" y="3" width="12" height="10" rx="1.5" {...common}/><path d="M6 3v10" {...common}/></>,
    archive:   <><rect x="2" y="4" width="12" height="3" rx="1" {...common}/><path d="M3 7v6a1 1 0 001 1h8a1 1 0 001-1V7M6.5 10h3" {...common}/></>,
    keyboard:  <><rect x="1.5" y="4" width="13" height="8" rx="1.5" {...common}/><path d="M4 7h.1M6.5 7h.1M9 7h.1M11.5 7h.1M4 9.5h8" {...common}/></>,
  };
  return <svg viewBox="0 0 16 16" style={s}>{paths[name] ?? null}</svg>;
}

// ─── KEY HINT ─────────────────────────────────────────────────────────────────
function KeyHint({ children, style = {} }) {
  return (
    <kbd style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 18, height: 18, padding: '0 5px',
      borderRadius: 4, background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.09)',
      fontFamily: T.fontMono, fontSize: 10, fontWeight: 500,
      color: T.textMuted, letterSpacing: 0, lineHeight: 1,
      ...style,
    }}>{children}</kbd>
  );
}

// ─── TASK CHECK ───────────────────────────────────────────────────────────────
function TaskCheck({ done, onToggle, size = 18, laneColor = null }) {
  return (
    <button
      onClick={onToggle}
      aria-label={done ? 'Unmark complete' : 'Mark complete'}
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        border: done ? 'none' : `1.5px solid ${laneColor ? laneColor + '55' : 'rgba(255,255,255,0.22)'}`,
        background: done ? T.mint : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s ease', padding: 0,
      }}
    >
      {done && <Icon name="check" size={size * 0.55} color="#0d1a27" />}
    </button>
  );
}

// ─── PROJECT PILL ─────────────────────────────────────────────────────────────
function ProjectPill({ project, size = 'md', showDot = true }) {
  if (!project) return null;
  const c = PROJECT_COLORS[project.color];
  const sizes = {
    sm: { padding: '1px 7px', fontSize: 10, radius: 8, dot: 5 },
    md: { padding: '2px 9px', fontSize: 11, radius: 10, dot: 6 },
    lg: { padding: '4px 11px', fontSize: 12, radius: 12, dot: 6 },
  };
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: s.padding, borderRadius: s.radius,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      fontSize: s.fontSize, fontWeight: 600, fontFamily: T.fontDisplay,
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
    }}>
      {showDot && <span style={{ width: s.dot, height: s.dot, borderRadius: '50%', background: c.dot }} />}
      {project.label}
    </span>
  );
}

// ─── LANE TAG ─────────────────────────────────────────────────────────────────
function LaneTag({ lane, size = 'md', glow = false }) {
  if (!lane) return null;
  const conf = LANE_CONFIG[lane];
  const sizes = {
    sm: { padding: '1px 7px', fontSize: 9,  radius: 8,  dot: 5 },
    md: { padding: '3px 9px', fontSize: 10, radius: 10, dot: 6 },
    lg: { padding: '4px 12px', fontSize: 11, radius: 12, dot: 7 },
  };
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: s.padding, borderRadius: s.radius,
      background: conf.bg, color: conf.color,
      border: `1px solid ${conf.border}`,
      fontSize: s.fontSize, fontWeight: 700, fontFamily: T.fontDisplay,
      letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: s.dot, height: s.dot, borderRadius: '50%',
        background: conf.color,
        boxShadow: glow ? `0 0 ${s.dot * 1.5}px ${conf.glow}` : 'none',
      }} />
      {conf.label}
    </span>
  );
}

// ─── LANE DOT ─────────────────────────────────────────────────────────────────
function LaneDot({ lane, size = 6, glow = false }) {
  if (!lane) return null;
  const conf = LANE_CONFIG[lane];
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: conf.color, flexShrink: 0,
      boxShadow: glow ? `0 0 ${size * 1.8}px ${conf.glow}` : 'none',
      display: 'inline-block',
    }} />
  );
}

// ─── TASK ROW (dense, for lists) ──────────────────────────────────────────────
function TaskRow({ bullet, projects, onToggleDone, showProject = true, compact = false, dense = false }) {
  const [hover, setHover] = useStateA(false);
  const project = bullet.project ? projects.find(p => p.id === bullet.project) : null;
  const isDone = bullet.lane === 'done';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: dense ? '6px 10px' : compact ? '8px 10px' : '10px 12px',
        borderRadius: 8,
        background: hover ? 'rgba(255,255,255,0.035)' : 'transparent',
        transition: 'background 0.12s',
        cursor: 'default',
      }}
    >
      <div style={{
        opacity: hover ? 1 : 0, transition: 'opacity 0.12s',
        display: 'flex', alignItems: 'center', color: T.textFaint,
        marginLeft: -6, marginRight: -4,
      }}>
        <Icon name="drag" size={12} />
      </div>
      <TaskCheck
        done={isDone}
        onToggle={() => onToggleDone(bullet.id)}
        size={compact ? 15 : 17}
        laneColor={bullet.lane ? LANE_CONFIG[bullet.lane]?.color : null}
      />
      <p style={{
        flex: 1, minWidth: 0,
        fontSize: compact ? 13 : 13.5, lineHeight: 1.4,
        fontFamily: T.fontBody, fontWeight: 500,
        color: isDone ? T.textMuted : T.text,
        textDecoration: isDone ? 'line-through' : 'none',
        margin: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{bullet.text}</p>
      {showProject && project && <ProjectPill project={project} size="sm" />}
      <div style={{
        opacity: hover ? 1 : 0, transition: 'opacity 0.12s',
        display: 'flex', gap: 4,
      }}>
        <button style={iconBtnStyle()} title="More">
          <Icon name="more" size={13} />
        </button>
      </div>
    </div>
  );
}

function iconBtnStyle() {
  return {
    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 'none',
    color: T.textMuted, cursor: 'pointer', padding: 0,
  };
}

Object.assign(window, { Icon, KeyHint, TaskCheck, ProjectPill, LaneTag, LaneDot, TaskRow, iconBtnStyle });
