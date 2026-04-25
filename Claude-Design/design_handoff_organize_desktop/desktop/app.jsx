// app.jsx — main app: state, routing, keyboard, Tweaks

const { useState, useEffect, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "bentoVariant": "focus",
  "flowVariant": "stage",
  "density": "balanced",
  "showInbox": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState('list');
  const [bullets, setBullets] = useState(INITIAL_BULLETS);
  const [inboxOpen, setInboxOpen] = useState(tweaks.showInbox);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => { setInboxOpen(tweaks.showInbox); }, [tweaks.showInbox]);

  const toggleDone = useCallback(id => {
    setBullets(prev => prev.map(b => b.id === id
      ? { ...b, lane: b.lane === 'done' ? 'now' : 'done' }
      : b));
  }, []);

  const assign = useCallback((id, projectId) => {
    setBullets(prev => prev.map(b => b.id === id
      ? { ...b, project: projectId, lane: b.lane ?? 'next' }
      : b));
  }, []);

  // Quick-add event
  useEffect(() => {
    const h = e => {
      const text = e.detail.text;
      setBullets(prev => [...prev, {
        id: 'b' + Math.random().toString(36).slice(2, 7),
        text, project: null, lane: null,
      }]);
    };
    window.addEventListener('org:quickAdd', h);
    return () => window.removeEventListener('org:quickAdd', h);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const h = e => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(o => !o); }
      if (e.key === '1') setView('list');
      if (e.key === '2') setView('bento');
      if (e.key === '3') setView('flow');
      if (e.key === 'i') setInboxOpen(o => !o);
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const inboxCount = bullets.filter(b => !b.project && b.lane !== 'done').length;

  return (
    <div style={{
      display: 'flex', width: 1920, height: 1080,
      background: T.bg, color: T.text,
      fontFamily: T.fontBody,
      overflow: 'hidden',
    }}>
      <LeftRail />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopHeader
          view={view}
          onViewChange={setView}
          onOpenCmd={() => setCmdOpen(true)}
          onToggleInbox={() => setInboxOpen(o => !o)}
          inboxOpen={inboxOpen}
          inboxCount={inboxCount}
          bulletCount={bullets.filter(b => b.lane !== 'done').length}
        />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {view === 'list' && (
              <ListViewDesktop bullets={bullets} projects={PROJECTS}
                onToggleDone={toggleDone} onAssign={assign} />
            )}
            {view === 'bento' && (
              <BentoViewDesktop bullets={bullets} projects={PROJECTS}
                onToggleDone={toggleDone} variant={tweaks.bentoVariant} />
            )}
            {view === 'flow' && (
              <FlowViewDesktop bullets={bullets} projects={PROJECTS}
                onToggleDone={toggleDone} variant={tweaks.flowVariant} />
            )}
          </div>
          {inboxOpen && (
            <InboxPanel bullets={bullets} projects={PROJECTS}
              onClose={() => setInboxOpen(false)}
              onAssign={assign} onToggleDone={toggleDone} />
          )}
        </div>
      </div>

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection title="View variants">
          <TweakRadio
            label="Bento layout"
            value={tweaks.bentoVariant}
            onChange={v => { setTweaks({ bentoVariant: v }); setView('bento'); }}
            options={[
              { value: 'focus',   label: 'Focus-hero' },
              { value: 'uniform', label: 'Uniform grid' },
              { value: 'masonry', label: 'Adaptive masonry' },
            ]}
          />
          <TweakRadio
            label="Flow layout"
            value={tweaks.flowVariant}
            onChange={v => { setTweaks({ flowVariant: v }); setView('flow'); }}
            options={[
              { value: 'stage',    label: 'Centered stage' },
              { value: 'cockpit',  label: 'Three-zone cockpit' },
              { value: 'timeline', label: 'Horizontal timeline' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Layout">
          <TweakToggle
            label="Inbox panel open"
            value={tweaks.showInbox}
            onChange={v => setTweaks({ showInbox: v })}
          />
        </TweakSection>
      </TweaksPanel>

      {cmdOpen && <CommandPalette bullets={bullets} projects={PROJECTS} onClose={() => setCmdOpen(false)} onJump={(v) => { setView(v); setCmdOpen(false); }} />}
    </div>
  );
}

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────────
function CommandPalette({ bullets, projects, onClose, onJump }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const needle = q.toLowerCase();
    const items = [];
    [
      { label: 'List view',  icon: 'list',  action: () => onJump('list'),  hint: '1' },
      { label: 'Bento view', icon: 'bento', action: () => onJump('bento'), hint: '2' },
      { label: 'Flow view',  icon: 'flow',  action: () => onJump('flow'),  hint: '3' },
    ].forEach(c => {
      if (!needle || c.label.toLowerCase().includes(needle)) items.push({ kind: 'cmd', ...c });
    });
    projects.forEach(p => {
      if (!needle || p.label.toLowerCase().includes(needle)) {
        items.push({ kind: 'project', label: `Jump to ${p.label}`, project: p });
      }
    });
    if (needle) {
      bullets.filter(b => b.text.toLowerCase().includes(needle)).slice(0, 6).forEach(b => {
        items.push({ kind: 'bullet', bullet: b });
      });
    }
    return items;
  }, [q, bullets, projects, onJump]);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(6,12,22,0.55)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: 140,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 640, maxHeight: 520, borderRadius: 16,
        background: T.elevated, border: `1px solid ${T.borderStrong}`,
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', borderBottom: `1px solid ${T.borderSubtle}`,
        }}>
          <Icon name="search" size={16} color={T.textMuted} />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search bullets, projects, or jump anywhere…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: T.text, fontFamily: T.fontBody, fontSize: 15, fontWeight: 500,
            }} />
          <KeyHint>esc</KeyHint>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {results.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: T.textMuted, fontFamily: T.fontBody, fontSize: 13 }}>
              No matches.
            </div>
          ) : results.map((r, i) => (
            <div key={i} onClick={r.action} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 12px', borderRadius: 9, cursor: 'pointer',
              background: i === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
            }}>
              {r.kind === 'cmd' && <Icon name={r.icon} size={14} color={T.textSecondary} />}
              {r.kind === 'project' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: PROJECT_COLORS[r.project.color].dot }} />}
              {r.kind === 'bullet' && <Icon name="dot" size={8} color={LANE_CONFIG[r.bullet.lane]?.color ?? T.textMuted} />}
              <span style={{ flex: 1, fontFamily: T.fontBody, fontSize: 13, fontWeight: 500, color: T.text }}>
                {r.kind === 'bullet' ? r.bullet.text : r.label}
              </span>
              {r.kind === 'bullet' && r.bullet.project && (() => {
                const p = projects.find(pp => pp.id === r.bullet.project);
                return p ? <ProjectPill project={p} size="sm" /> : null;
              })()}
              {r.hint && <KeyHint>{r.hint}</KeyHint>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
