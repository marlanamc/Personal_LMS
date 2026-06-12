// chrome.jsx — persistent desktop chrome: header bar, project sidebar, inbox panel, command palette

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC, useMemo: useMemoC } = React;

// ─── LEFT NAV RAIL (placeholder for future) ──────────────────────────────────
function LeftRail() {
  const items = [
    { icon: 'sparkle',  active: false, label: 'Home' },
    { icon: 'list',     active: false, label: 'Plan' },
    { icon: 'bento',    active: true,  label: 'Organize' },
    { icon: 'edit',     active: false, label: 'Think' },
    { icon: 'play',     active: false, label: 'Timer' },
  ];
  return (
    <div style={{
      width: T.railWidth, flexShrink: 0,
      borderRight: `1px solid ${T.borderSubtle}`,
      background: T.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', paddingTop: 14, gap: 6,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: 'linear-gradient(135deg, #d48aa6, #a089c7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 14, color: T.bg,
        marginBottom: 10,
      }}>m</div>
      {items.map(it => (
        <button key={it.label} title={it.label} style={{
          width: 36, height: 36, borderRadius: 10, border: 'none', padding: 0,
          background: it.active ? 'rgba(212,138,166,0.12)' : 'transparent',
          color: it.active ? T.primary : T.textMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.12s',
        }}>
          <Icon name={it.icon} size={18} />
        </button>
      ))}
    </div>
  );
}

// ─── TOP HEADER ──────────────────────────────────────────────────────────────
function TopHeader({ view, onViewChange, onOpenCmd, onToggleInbox, inboxOpen, inboxCount, bulletCount }) {
  return (
    <div style={{
      height: 64, flexShrink: 0,
      borderBottom: `1px solid ${T.borderSubtle}`,
      display: 'flex', alignItems: 'center', gap: 20,
      padding: '0 24px', background: T.bg,
    }}>
      {/* Title block */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <h1 style={{
          fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 700,
          color: T.text, margin: 0, letterSpacing: '-0.01em',
        }}>Organize</h1>
        <span style={{ fontFamily: T.fontDisplay, fontSize: 12, color: T.textMuted, fontWeight: 500 }}>
          {bulletCount} bullets · {PROJECTS.length} projects
        </span>
      </div>

      {/* View switcher */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2,
        padding: 3, borderRadius: 10,
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${T.borderSubtle}`,
      }}>
        {[
          { id: 'list',  icon: 'list',  label: 'List',  hint: '1' },
          { id: 'bento', icon: 'bento', label: 'Bento', hint: '2' },
          { id: 'flow',  icon: 'flow',  label: 'Flow',  hint: '3' },
        ].map(v => {
          const active = view === v.id;
          return (
            <button key={v.id} onClick={() => onViewChange(v.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '6px 12px', borderRadius: 7, border: 'none',
              background: active ? T.elevated : 'transparent',
              color: active ? T.text : T.textMuted,
              cursor: 'pointer', transition: 'all 0.12s',
              fontFamily: T.fontDisplay, fontSize: 12.5, fontWeight: 600,
              boxShadow: active ? '0 1px 0 rgba(255,255,255,0.04) inset' : 'none',
            }}>
              <Icon name={v.icon} size={14} />
              {v.label}
              <KeyHint style={{ marginLeft: 2, opacity: active ? 1 : 0.6 }}>{v.hint}</KeyHint>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Quick add (always visible) */}
      <QuickAddBar />

      {/* Command palette trigger */}
      <button onClick={onOpenCmd} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 12px 7px 10px', borderRadius: 9,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${T.borderSubtle}`,
        color: T.textMuted, cursor: 'pointer',
        fontFamily: T.fontDisplay, fontSize: 12.5, fontWeight: 500,
      }}>
        <Icon name="search" size={14} />
        Jump to…
        <KeyHint>⌘K</KeyHint>
      </button>

      {/* Inbox toggle */}
      <button onClick={onToggleInbox} style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '7px 12px', borderRadius: 9,
        background: inboxOpen ? 'rgba(160,137,199,0.14)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${inboxOpen ? 'rgba(160,137,199,0.32)' : T.borderSubtle}`,
        color: inboxOpen ? T.amethyst : T.textSecondary, cursor: 'pointer',
        fontFamily: T.fontDisplay, fontSize: 12.5, fontWeight: 600,
        transition: 'all 0.12s',
      }}>
        <Icon name="inbox" size={14} />
        Inbox
        {inboxCount > 0 && (
          <span style={{
            padding: '0 6px', height: 16, borderRadius: 8,
            background: inboxOpen ? 'rgba(160,137,199,0.25)' : 'rgba(255,255,255,0.08)',
            color: inboxOpen ? T.amethyst : T.textSecondary,
            fontSize: 10, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            letterSpacing: 0,
          }}>{inboxCount}</span>
        )}
      </button>
    </div>
  );
}

// ─── QUICK ADD BAR ────────────────────────────────────────────────────────────
function QuickAddBar() {
  const [text, setText] = useStateC('');
  const [focused, setFocused] = useStateC(false);
  const inputRef = useRefC(null);

  useEffectC(() => {
    const h = e => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 10px 6px 12px', borderRadius: 9,
      background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${focused ? 'rgba(212,138,166,0.35)' : T.borderSubtle}`,
      width: 340, transition: 'all 0.12s',
    }}>
      <Icon name="plus" size={13} color={focused ? T.primary : T.textMuted} />
      <input
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => {
          if (e.key === 'Enter' && text.trim()) {
            window.dispatchEvent(new CustomEvent('org:quickAdd', { detail: { text: text.trim() } }));
            setText('');
          }
          if (e.key === 'Escape') inputRef.current?.blur();
        }}
        placeholder="Capture to Inbox…"
        style={{
          flex: 1, background: 'none', border: 'none', outline: 'none',
          color: T.text, fontFamily: T.fontBody, fontSize: 13, fontWeight: 500,
        }}
      />
      <KeyHint>/</KeyHint>
    </div>
  );
}

// ─── INBOX PANEL (right-side) ────────────────────────────────────────────────
function InboxPanel({ bullets, projects, onClose, onAssign, onToggleDone }) {
  const inbox = bullets.filter(b => !b.project && b.lane !== 'done');

  return (
    <div style={{
      width: 340, flexShrink: 0, borderLeft: `1px solid ${T.borderSubtle}`,
      background: T.surface,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 20px 14px', borderBottom: `1px solid ${T.borderSubtle}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(160,137,199,0.14)', color: T.amethyst,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="inbox" size={15} />
          </div>
          <div>
            <h3 style={{ fontFamily: T.fontDisplay, fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>Inbox</h3>
            <p style={{ fontFamily: T.fontDisplay, fontSize: 11, color: T.textMuted, margin: '2px 0 0' }}>
              {inbox.length} to sort
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{...iconBtnStyle(), width: 28, height: 28}} title="Collapse">
          <Icon name="chevronR" size={14} />
        </button>
      </div>

      {/* Tip */}
      <div style={{
        margin: '12px 20px 8px', padding: '9px 11px',
        borderRadius: 9, background: 'rgba(160,137,199,0.06)',
        border: '1px solid rgba(160,137,199,0.14)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="sparkle" size={12} color={T.amethyst} />
        <p style={{ fontFamily: T.fontBody, fontSize: 11.5, color: T.textSecondary, margin: 0, lineHeight: 1.35 }}>
          Drag items onto a project, or hit <KeyHint style={{ margin: '0 1px' }}>P</KeyHint> to route.
        </p>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 16px' }}>
        {inbox.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', margin: '0 auto 10px',
              background: 'rgba(120,191,165,0.1)', color: T.mint,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={16} />
            </div>
            <p style={{ fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 600, color: T.text, margin: '0 0 4px' }}>Inbox clear</p>
            <p style={{ fontFamily: T.fontBody, fontSize: 11.5, color: T.textMuted, margin: 0 }}>New thoughts land here.</p>
          </div>
        ) : inbox.map(b => (
          <InboxCard key={b.id} bullet={b} projects={projects} onAssign={onAssign} onToggleDone={onToggleDone} />
        ))}
      </div>
    </div>
  );
}

function InboxCard({ bullet, projects, onAssign, onToggleDone }) {
  const [hover, setHover] = useStateC(false);
  const [menu, setMenu] = useStateC(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setMenu(false); }}
      style={{
        padding: '10px 11px', borderRadius: 10, marginBottom: 4,
        background: hover ? 'rgba(255,255,255,0.03)' : 'transparent',
        border: `1px solid ${hover ? T.borderSubtle : 'transparent'}`,
        transition: 'all 0.12s', position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
        <TaskCheck done={false} onToggle={() => onToggleDone(bullet.id)} size={15} />
        <p style={{
          flex: 1, minWidth: 0, margin: 0,
          fontFamily: T.fontBody, fontSize: 13, fontWeight: 500,
          color: T.text, lineHeight: 1.4,
        }}>{bullet.text}</p>
      </div>
      <div style={{
        marginTop: 6, paddingLeft: 24,
        display: 'flex', gap: 4, flexWrap: 'wrap',
        opacity: hover ? 1 : 0, transition: 'opacity 0.15s',
      }}>
        {projects.slice(0, 4).map(p => {
          const c = PROJECT_COLORS[p.color];
          return (
            <button key={p.id} onClick={() => onAssign(bullet.id, p.id)} style={{
              padding: '2px 7px', borderRadius: 8,
              background: 'transparent', border: `1px solid ${c.border}`,
              color: c.text, fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 600,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
              letterSpacing: '0.02em',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot }} />
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── COLLAPSED INBOX TAB (when panel closed) ─────────────────────────────────
function InboxTab({ count, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
      padding: '14px 10px', borderRadius: '12px 0 0 12px',
      background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRight: 'none',
      color: T.textSecondary, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)',
    }}>
      <span style={{
        fontFamily: T.fontDisplay, fontSize: 11.5, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>Inbox</span>
      {count > 0 && (
        <span style={{
          padding: '1px 6px', borderRadius: 8, minWidth: 16,
          background: 'rgba(160,137,199,0.18)', color: T.amethyst,
          fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
          writingMode: 'horizontal-tb',
        }}>{count}</span>
      )}
    </button>
  );
}

Object.assign(window, { LeftRail, TopHeader, InboxPanel, InboxTab, QuickAddBar });
