// organize-mobile-components.jsx
// Shared atom components: TaskItem, InboxSheet

const { useState, useRef, useEffect } = React;

function TaskItem({ bullet, projects, onToggleDone, compact = false }) {
  const project = bullet.project ? projects.find(p => p.id === bullet.project) : null;
  const c = project ? PROJECT_COLORS[project.color] : null;
  const isDone = bullet.lane === 'done';
  const laneColor = bullet.lane ? LANE_CONFIG[bullet.lane]?.color : null;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: compact ? '9px 0' : '11px 0',
      borderBottom: '1px solid rgba(255,255,255,0.045)',
    }}>
      <button
        onClick={() => onToggleDone(bullet.id)}
        style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
          border: isDone ? 'none' : '1.5px solid rgba(255,255,255,0.18)',
          background: isDone ? '#78bfa5' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s ease',
        }}
        aria-label={isDone ? 'Unmark complete' : 'Mark complete'}
      >
        {isDone && (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5l2.5 2.5L9 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14, lineHeight: 1.42, fontFamily: 'Manrope, sans-serif', fontWeight: 500,
          color: isDone ? '#6e7e91' : '#e6edf6',
          textDecoration: isDone ? 'line-through' : 'none',
          wordBreak: 'break-word',
        }}>{bullet.text}</p>
        {project && !compact && (
          <span style={{
            display: 'inline-block', marginTop: 4,
            padding: '2px 8px', borderRadius: 20,
            fontSize: 11, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            background: c.bg, color: c.text, border: `1px solid ${c.border}`,
          }}>{project.label}</span>
        )}
      </div>

      {laneColor && bullet.lane !== 'done' && (
        <div style={{
          width: 6, height: 6, borderRadius: '50%', background: laneColor,
          flexShrink: 0, marginTop: 7,
        }} />
      )}
    </div>
  );
}

function InboxSheet({ bullets, projects, onClose, onToggleDone, onQuickAdd }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const inboxBullets = bullets.filter(b => !b.project && b.lane !== 'done');

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onQuickAdd(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(6,12,22,0.55)', backdropFilter: 'blur(4px)',
        zIndex: 40,
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#18273a',
        borderRadius: '24px 24px 0 0',
        border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none',
        zIndex: 41, maxHeight: '72%',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.26s cubic-bezier(0.32,0.72,0,1)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
          <div style={{ width: 34, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.13)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#e6edf6' }}>Inbox</span>
            {inboxBullets.length > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                background: 'rgba(160,137,199,0.15)', color: '#a089c7',
                fontFamily: 'Outfit, sans-serif', letterSpacing: '0.02em',
              }}>{inboxBullets.length}</span>
            )}
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
            color: '#6e7e91', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Quick-add row */}
        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="What's on your mind?"
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 12,
              border: '1.5px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e6edf6', fontSize: 14, fontFamily: 'Manrope, sans-serif',
              outline: 'none',
            }}
          />
          <button onClick={handleAdd} disabled={!text.trim()} style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: text.trim() ? '#d48aa6' : 'rgba(255,255,255,0.06)',
            border: 'none', cursor: text.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: text.trim() ? 'white' : '#6e7e91', transition: 'all 0.15s',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 16px 32px', WebkitOverflowScrolling: 'touch' }}>
          {inboxBullets.length === 0 ? (
            <div style={{ padding: '28px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#6e7e91', fontFamily: 'Manrope, sans-serif', marginBottom: 4 }}>Inbox is clear</p>
              <p style={{ fontSize: 12, color: '#4a5a6a', fontFamily: 'Manrope, sans-serif' }}>Type above to capture a thought</p>
            </div>
          ) : (
            inboxBullets.map(b => (
              <TaskItem key={b.id} bullet={b} projects={projects} onToggleDone={onToggleDone} />
            ))
          )}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { TaskItem, InboxSheet });
