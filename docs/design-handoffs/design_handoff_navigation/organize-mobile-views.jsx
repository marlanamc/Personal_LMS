// organize-mobile-views.jsx
// Three view components: ListViewMobile, BentoViewMobile, FlowViewMobile

const { useState: useStateV, useMemo: useMemoV } = React;

// ─── LIST VIEW ────────────────────────────────────────────────────────────────
function ListViewMobile({ bullets, projects, onToggleDone }) {
  const [selectedProjectId, setSelectedProjectId] = useStateV(projects[0]?.id ?? null);
  const [collapsedLanes, setCollapsedLanes] = useStateV(new Set(['later']));

  const allNow = bullets.filter(b => b.lane === 'now' && b.project);
  const projectBullets = useMemoV(() =>
    bullets.filter(b => b.project === selectedProjectId && b.lane !== 'done'),
    [bullets, selectedProjectId]
  );
  const byLane = lane => projectBullets.filter(b => b.lane === lane);

  const toggleLane = lane => setCollapsedLanes(prev => {
    const next = new Set(prev);
    next.has(lane) ? next.delete(lane) : next.add(lane);
    return next;
  });

  const LaneSection = ({ lane }) => {
    const items = byLane(lane);
    const conf = LANE_CONFIG[lane];
    const collapsed = collapsedLanes.has(lane);
    return (
      <div>
        <button onClick={() => toggleLane(lane)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 0', background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: collapsed ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: conf.color }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a9b7c8', fontFamily: 'Outfit, sans-serif' }}>{conf.label}</span>
            <span style={{ fontSize: 11, color: '#6e7e91', fontFamily: 'Outfit, sans-serif' }}>{items.length}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#6e7e91', transition: 'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : '' }}>
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {!collapsed && (
          <div style={{ paddingBottom: 4 }}>
            {items.length === 0 ? (
              <p style={{ fontSize: 13, color: '#4a5a6a', padding: '6px 0 10px', fontFamily: 'Manrope, sans-serif' }}>Nothing here yet</p>
            ) : (
              items.map(b => <TaskItem key={b.id} bullet={b} projects={projects} onToggleDone={onToggleDone} compact />)
            )}
          </div>
        )}
      </div>
    );
  };

  const sel = projects.find(p => p.id === selectedProjectId);
  const selColor = sel ? PROJECT_COLORS[sel.color] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* NOW spotlight */}
      <div style={{
        margin: '10px 14px 0', padding: '12px 14px', borderRadius: 16,
        background: 'rgba(212,138,166,0.06)', border: '1px solid rgba(212,138,166,0.16)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#d48aa6', boxShadow: '0 0 7px rgba(212,138,166,0.65)' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#d48aa6', fontFamily: 'Outfit, sans-serif' }}>Now</span>
          <span style={{ fontSize: 10, color: '#a9b7c8', fontFamily: 'Outfit, sans-serif' }}>{allNow.length} active</span>
        </div>
        {allNow.length === 0 ? (
          <p style={{ fontSize: 13, color: '#6e7e91', fontFamily: 'Manrope, sans-serif' }}>Pull a task in to get started</p>
        ) : (
          <div>
            {allNow.slice(0, 2).map((b, i) => {
              const proj = projects.find(p => p.id === b.project);
              const c = proj ? PROJECT_COLORS[proj.color] : null;
              return (
                <div key={b.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0',
                  borderBottom: i < Math.min(allNow.length, 2) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: c ? c.dot : '#d48aa6', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#e6edf6', fontFamily: 'Manrope, sans-serif', fontWeight: 500, flex: 1, lineHeight: 1.3 }}>{b.text}</span>
                  {proj && <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: c.bg, color: c.text, fontFamily: 'Outfit, sans-serif', fontWeight: 600, flexShrink: 0 }}>{proj.label}</span>}
                </div>
              );
            })}
            {allNow.length > 2 && (
              <p style={{ fontSize: 11, color: '#6e7e91', marginTop: 5, fontFamily: 'Outfit, sans-serif' }}>+{allNow.length - 2} more across projects</p>
            )}
          </div>
        )}
      </div>

      {/* Project switcher */}
      <div style={{ flexShrink: 0, padding: '10px 14px 6px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 1 }}>
          {projects.map(p => {
            const c = PROJECT_COLORS[p.color];
            const active = p.id === selectedProjectId;
            return (
              <button key={p.id} onClick={() => setSelectedProjectId(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 13px', borderRadius: 20, flexShrink: 0,
                border: `1.5px solid ${active ? c.border : 'rgba(255,255,255,0.08)'}`,
                background: active ? c.bg : 'transparent',
                cursor: 'pointer', transition: 'all 0.15s',
                fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
                color: active ? c.text : '#a9b7c8',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, opacity: active ? 1 : 0.5 }} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lane sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2px 14px 88px', WebkitOverflowScrolling: 'touch' }}>
        {sel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0 2px' }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: selColor?.dot }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: selColor?.text, fontFamily: 'Outfit, sans-serif' }}>{sel.label}</span>
            <span style={{ fontSize: 11, color: '#6e7e91', fontFamily: 'Outfit, sans-serif' }}>{projectBullets.length} tasks</span>
          </div>
        )}
        <LaneSection lane="now" />
        <LaneSection lane="next" />
        <LaneSection lane="later" />
      </div>
    </div>
  );
}

// ─── BENTO VIEW ──────────────────────────────────────────────────────────────
function BentoViewMobile({ bullets, projects, onToggleDone }) {
  const [expanded, setExpanded] = useStateV(new Set([projects[0]?.id]));
  const [laneFilter, setLaneFilter] = useStateV('all');

  const toggle = id => setExpanded(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const filterBullets = bs => laneFilter === 'all' ? bs : bs.filter(b => b.lane === laneFilter);

  const FILTER_LABELS = { all: 'All', now: 'Now', next: 'Next', later: 'Later' };
  const FILTER_COLORS = { all: '#d48aa6', now: '#d48aa6', next: '#4f8c9e', later: '#78bfa5' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Lane filter strip */}
      <div style={{ display: 'flex', gap: 5, padding: '8px 14px', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['all', 'now', 'next', 'later'].map(f => {
          const active = laneFilter === f;
          const col = FILTER_COLORS[f];
          return (
            <button key={f} onClick={() => setLaneFilter(f)} style={{
              padding: '6px 14px', borderRadius: 20, flexShrink: 0,
              border: active ? 'none' : '1px solid rgba(255,255,255,0.09)',
              background: active ? (f === 'all' ? '#d48aa6' : `${col}22`) : 'transparent',
              color: active ? (f === 'all' ? 'white' : col) : '#a9b7c8',
              fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{FILTER_LABELS[f]}</button>
          );
        })}
      </div>

      {/* Project cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2px 14px 88px', display: 'flex', flexDirection: 'column', gap: 7, WebkitOverflowScrolling: 'touch' }}>
        {projects.map(p => {
          const c = PROJECT_COLORS[p.color];
          const allProjBullets = bullets.filter(b => b.project === p.id && b.lane !== 'done');
          const visible = filterBullets(allProjBullets);
          const isExpanded = expanded.has(p.id);
          const counts = { now: allProjBullets.filter(b => b.lane === 'now').length, next: allProjBullets.filter(b => b.lane === 'next').length, later: allProjBullets.filter(b => b.lane === 'later').length };

          return (
            <div key={p.id} style={{
              borderRadius: 18, overflow: 'hidden',
              background: isExpanded ? c.bg : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isExpanded ? c.border : 'rgba(255,255,255,0.07)'}`,
              transition: 'background 0.2s, border-color 0.2s',
            }}>
              <button onClick={() => toggle(p.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center',
                padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', gap: 10,
              }}>
                <div style={{ width: 3, height: 34, borderRadius: 2, background: c.dot, flexShrink: 0 }} />
                <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#e6edf6', fontFamily: 'Outfit, sans-serif', marginBottom: 3 }}>{p.label}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {counts.now > 0 && <span style={{ fontSize: 10, color: '#d48aa6', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{counts.now} now</span>}
                    {counts.next > 0 && <span style={{ fontSize: 10, color: '#4f8c9e', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{counts.next} next</span>}
                    {counts.later > 0 && <span style={{ fontSize: 10, color: '#78bfa5', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{counts.later} later</span>}
                    {allProjBullets.length === 0 && <span style={{ fontSize: 10, color: '#6e7e91', fontFamily: 'Outfit, sans-serif' }}>Empty</span>}
                  </div>
                </div>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: '#6e7e91', transition: 'transform 0.2s', transform: isExpanded ? '' : 'rotate(-90deg)', flexShrink: 0 }}>
                  <path d="M3.5 5.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {isExpanded && (
                <div style={{ padding: '0 16px 12px' }}>
                  {visible.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#6e7e91', padding: '6px 0 4px', fontFamily: 'Manrope, sans-serif' }}>
                      {laneFilter !== 'all' ? `No tasks in ${laneFilter}` : 'No tasks yet'}
                    </p>
                  ) : visible.map(b => (
                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <button onClick={() => onToggleDone(b.id)} style={{
                        width: 19, height: 19, borderRadius: '50%', flexShrink: 0,
                        border: '1.5px solid rgba(255,255,255,0.18)', background: 'transparent', cursor: 'pointer',
                      }} />
                      <span style={{ fontSize: 13, color: '#e6edf6', fontFamily: 'Manrope, sans-serif', fontWeight: 500, flex: 1, lineHeight: 1.35 }}>{b.text}</span>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: LANE_CONFIG[b.lane]?.color, flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Inbox row */}
        {(() => {
          const inboxItems = bullets.filter(b => !b.project && b.lane !== 'done');
          return (
            <div style={{
              borderRadius: 18, padding: '14px 16px',
              background: 'rgba(255,255,255,0.015)', border: '1px dashed rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 3, height: 28, borderRadius: 2, background: '#a089c7', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: inboxItems.length > 0 ? '#e6edf6' : '#6e7e91', fontFamily: 'Outfit, sans-serif' }}>Inbox</p>
                <p style={{ fontSize: 10, color: '#6e7e91', fontFamily: 'Outfit, sans-serif', marginTop: 2 }}>{inboxItems.length} unsorted</p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── FLOW VIEW ────────────────────────────────────────────────────────────────
function FlowViewMobile({ bullets, projects, onToggleDone }) {
  const [showTray, setShowTray] = useStateV(false);

  const chain = bullets.filter(b => b.lane === 'now');
  const done  = bullets.filter(b => b.lane === 'done');
  const pool  = bullets.filter(b => b.project && b.lane !== 'now' && b.lane !== 'done');

  const active   = chain[0] ?? null;
  const queued   = chain.slice(1);
  const total    = chain.length + done.length;
  const doneCount= done.length;

  const ChainConnector = ({ label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 10px 2px 16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{ width: 1, height: 8, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ width: 4, height: 4, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' }} />
        <div style={{ width: 1, height: 8, background: 'rgba(255,255,255,0.1)' }} />
      </div>
      {label && <span style={{ fontSize: 10, color: '#6e7e91', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.07em' }}>{label}</span>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Progress */}
      {total > 0 && (
        <div style={{ padding: '6px 14px 2px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#a9b7c8', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.06em', flexShrink: 0 }}>
              {doneCount} / {total}
            </span>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(doneCount / total) * 100}%`, background: 'linear-gradient(90deg,#78bfa5,#4f8c9e)', borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>
      )}

      {/* Chain scroll area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px 12px', WebkitOverflowScrolling: 'touch' }}>
        {chain.length === 0 ? (
          <div style={{
            marginTop: 24, padding: '32px 20px', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', textAlign: 'center',
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#e6edf6', fontFamily: 'Outfit, sans-serif', marginBottom: 6 }}>Chain is empty</p>
            <p style={{ fontSize: 13, color: '#6e7e91', fontFamily: 'Manrope, sans-serif', lineHeight: 1.5 }}>Move tasks into the Now lane<br/>to build your trigger chain.</p>
          </div>
        ) : (
          <>
            {/* Live Now card */}
            {active && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#d48aa6', boxShadow: '0 0 8px rgba(212,138,166,0.75)' }} />
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#d48aa6', fontFamily: 'Outfit, sans-serif' }}>Live Now</span>
                </div>
                <div style={{
                  borderRadius: 18, padding: 16,
                  background: 'rgba(212,138,166,0.07)', border: '1.5px solid rgba(212,138,166,0.22)',
                  boxShadow: '0 0 28px rgba(212,138,166,0.07)',
                }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#e6edf6', fontFamily: 'Manrope, sans-serif', lineHeight: 1.4, marginBottom: 10 }}>{active.text}</p>
                  {(() => {
                    const proj = projects.find(p => p.id === active.project);
                    const c = proj ? PROJECT_COLORS[proj.color] : null;
                    return proj ? (
                      <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 10, background: c.bg, color: c.text, fontSize: 11, fontWeight: 600, fontFamily: 'Outfit, sans-serif', marginBottom: 12 }}>{proj.label}</span>
                    ) : <div style={{ marginBottom: 12 }} />;
                  })()}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onToggleDone(active.id)} style={{
                      flex: 1, padding: '9px 0', borderRadius: 11,
                      background: 'rgba(120,191,165,0.12)', border: '1px solid rgba(120,191,165,0.3)',
                      color: '#78bfa5', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2 6.5l3 3L11 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Mark done
                    </button>
                    <button style={{
                      flex: 1, padding: '9px 0', borderRadius: 11,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#a9b7c8', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M6.5 2v9M2 9l4.5 2 4.5-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Push later
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Queued chain items */}
            {queued.map((b, i) => {
              const proj = projects.find(p => p.id === b.project);
              const c = proj ? PROJECT_COLORS[proj.color] : null;
              const isNext = i === 0;
              return (
                <div key={b.id}>
                  <ChainConnector label={isNext ? 'up next' : `in ${i + 1}`} />
                  <div style={{
                    borderRadius: 14, padding: '12px 14px',
                    background: isNext ? 'rgba(79,140,158,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isNext ? 'rgba(79,140,158,0.22)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: isNext ? '#e6edf6' : '#a9b7c8', fontFamily: 'Manrope, sans-serif', lineHeight: 1.35, marginBottom: proj ? 5 : 0 }}>{b.text}</p>
                    {proj && <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 8, background: c.bg, color: c.text, fontSize: 10, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{proj.label}</span>}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Task tray */}
      <div style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.05)', background: '#122033' }}>
        <button onClick={() => setShowTray(!showTray)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: '#6e7e91' }}>
              <rect x="1" y="7.5" width="11" height="4.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M3.5 7.5V3M6.5 7.5V1M9.5 7.5V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a9b7c8', fontFamily: 'Outfit, sans-serif' }}>Task Tray</span>
            <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#6e7e91', fontFamily: 'Outfit, sans-serif' }}>{pool.length}</span>
          </div>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: '#6e7e91', transition: 'transform 0.2s', transform: showTray ? '' : 'rotate(180deg)' }}>
            <path d="M2.5 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {showTray && (
          <div style={{ maxHeight: 190, overflowY: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {pool.length === 0 ? (
              <p style={{ fontSize: 13, color: '#6e7e91', textAlign: 'center', padding: '12px 0', fontFamily: 'Manrope, sans-serif' }}>Tray is clear</p>
            ) : pool.slice(0, 7).map(b => {
              const proj = projects.find(p => p.id === b.project);
              const c = proj ? PROJECT_COLORS[proj.color] : null;
              return (
                <div key={b.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 11px', borderRadius: 11,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: c ? c.dot : '#6e7e91', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#a9b7c8', fontFamily: 'Manrope, sans-serif', flex: 1, lineHeight: 1.3 }}>{b.text}</span>
                  {proj && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 7, background: c.bg, color: c.text, fontFamily: 'Outfit, sans-serif', fontWeight: 600, flexShrink: 0 }}>{proj.label}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ListViewMobile, BentoViewMobile, FlowViewMobile });
