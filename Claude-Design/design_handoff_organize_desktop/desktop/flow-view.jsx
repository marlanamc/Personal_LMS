// flow-view.jsx — FlowViewDesktop with 3 variations
// v1: Centered stage (big Now card + horizontal chain)
// v2: Three-zone cockpit (tray | chain | telemetry)
// v3: Horizontal timeline

const { useState: useStateF, useMemo: useMemoF } = React;

function FlowViewDesktop({ bullets, projects, onToggleDone, variant = 'stage' }) {
  const chain = bullets.filter(b => b.lane === 'now');
  const done  = bullets.filter(b => b.lane === 'done');
  const pool  = bullets.filter(b => b.project && b.lane !== 'now' && b.lane !== 'done');
  const active = chain[0] ?? null;
  const queued = chain.slice(1);

  const total = chain.length + done.length;
  const doneCount = done.length;

  const viewProps = { chain, done, pool, active, queued, total, doneCount, projects, onToggleDone };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.bg }}>
      {variant === 'stage'     && <FlowStage {...viewProps} />}
      {variant === 'cockpit'   && <FlowCockpit {...viewProps} />}
      {variant === 'timeline'  && <FlowTimeline {...viewProps} />}
    </div>
  );
}

// ─── V1: CENTERED STAGE ──────────────────────────────────────────────────────
function FlowStage({ chain, active, queued, pool, total, doneCount, projects, onToggleDone }) {
  const activeProj = active?.project ? projects.find(p => p.id === active.project) : null;
  const ac = activeProj ? PROJECT_COLORS[activeProj.color] : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Progress rail */}
      <div style={{ padding: '18px 32px 10px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.primary, boxShadow: `0 0 10px ${T.primary}88` }} />
          <span style={{ fontFamily: T.fontDisplay, fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.primary }}>Chain active</span>
        </div>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${total ? (doneCount / total) * 100 : 0}%`, background: `linear-gradient(90deg, ${T.mint}, ${T.teal})` }} />
        </div>
        <span style={{ fontFamily: T.fontDisplay, fontSize: 12, fontWeight: 700, color: T.textSecondary, letterSpacing: '0.04em' }}>
          {doneCount} / {total} complete
        </span>
      </div>

      {chain.length === 0 ? (
        <EmptyChain />
      ) : (
        <>
          {/* Live Now stage — centered big card */}
          <div style={{ padding: '24px 32px 18px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%', maxWidth: 760, padding: 32,
              borderRadius: 24,
              background: `radial-gradient(120% 100% at 0% 0%, rgba(212,138,166,0.14) 0%, rgba(212,138,166,0.04) 40%, transparent 70%), ${T.surface}`,
              border: '1.5px solid rgba(212,138,166,0.28)',
              boxShadow: '0 0 60px rgba(212,138,166,0.08), 0 20px 60px rgba(0,0,0,0.3)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Accent corner */}
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 200, height: 200,
                background: 'radial-gradient(circle at top right, rgba(212,138,166,0.14) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: T.primary, boxShadow: `0 0 14px ${T.primary}` }} />
                <span style={{ fontFamily: T.fontDisplay, fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.primary }}>Live Now</span>
                {activeProj && <ProjectPill project={activeProj} size="md" />}
                <div style={{ flex: 1 }} />
                <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.textMuted }}>1 of {chain.length}</span>
              </div>
              <h2 style={{
                fontFamily: T.fontBody, fontSize: 30, fontWeight: 600,
                color: T.text, margin: '0 0 24px', lineHeight: 1.25,
                letterSpacing: '-0.01em',
              }}>{active.text}</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <FlowAction primary icon="check" label="Mark done" hint="X" onClick={() => onToggleDone(active.id)} />
                <FlowAction icon="arrowR" label="Push to Next" hint="N" />
                <FlowAction icon="play" label="Start focus timer" hint="F" />
                <div style={{ flex: 1 }} />
                <FlowAction icon="more" label="Push later" />
              </div>
            </div>
          </div>

          {/* Chain strip — horizontal */}
          <div style={{ padding: '6px 32px 14px' }}>
            <div style={{
              fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textMuted,
              marginBottom: 10,
            }}>Up next in chain</div>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto' }}>
              {queued.length === 0 ? (
                <div style={{
                  padding: '18px 22px', borderRadius: 14,
                  border: `1px dashed ${T.borderSubtle}`,
                  fontFamily: T.fontBody, fontSize: 12, color: T.textMuted,
                }}>Chain ends here. Pull from the tray below.</div>
              ) : queued.map((b, i) => (
                <React.Fragment key={b.id}>
                  <ChainConnector />
                  <ChainCard bullet={b} projects={projects} index={i + 2} />
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Task tray — bottom strip */}
      <div style={{ flex: 1, minHeight: 200, borderTop: `1px solid ${T.borderSubtle}`, background: T.surface, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 32px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="archive" size={14} color={T.textSecondary} />
          <span style={{ fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 700, color: T.text }}>Task Tray</span>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 11, color: T.textMuted }}>{pool.length} ready to chain</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: T.fontBody, fontSize: 11.5, color: T.textMuted }}>
            Click a tile to push it to Now
          </span>
        </div>
        <div style={{ flex: 1, padding: '4px 32px 18px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
            {pool.slice(0, 14).map(b => <TrayTile key={b.id} bullet={b} projects={projects} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── V2: THREE-ZONE COCKPIT ──────────────────────────────────────────────────
function FlowCockpit({ chain, active, queued, pool, done, total, doneCount, projects, onToggleDone }) {
  const activeProj = active?.project ? projects.find(p => p.id === active.project) : null;

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 280px', overflow: 'hidden' }}>
      {/* LEFT — Pool */}
      <div style={{ borderRight: `1px solid ${T.borderSubtle}`, background: T.surface, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px 12px' }}>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 3 }}>Pool</div>
          <h3 style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>Ready to chain</h3>
          <p style={{ fontFamily: T.fontBody, fontSize: 11.5, color: T.textMuted, margin: '3px 0 0' }}>{pool.length} bullets waiting</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 18px' }}>
          {pool.map(b => {
            const proj = projects.find(p => p.id === b.project);
            const c = proj ? PROJECT_COLORS[proj.color] : null;
            return (
              <div key={b.id} style={{
                padding: '10px 11px', borderRadius: 9, marginBottom: 4,
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${T.borderSubtle}`,
                borderLeft: `3px solid ${c ? c.dot : T.textFaint}`,
                display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
              }}>
                <LaneDot lane={b.lane} size={5} />
                <p style={{ flex: 1, margin: 0, fontFamily: T.fontBody, fontSize: 12.5, color: T.text, lineHeight: 1.35,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.text}</p>
                {proj && <ProjectPill project={proj} size="sm" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER — Active & chain */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {chain.length === 0 ? <EmptyChain /> : (
          <>
            <div style={{ padding: '28px 32px 14px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%', padding: 28,
                borderRadius: 20,
                background: `radial-gradient(140% 120% at 0% 0%, rgba(212,138,166,0.12) 0%, transparent 55%), ${T.surface}`,
                border: '1.5px solid rgba(212,138,166,0.28)',
                boxShadow: '0 0 50px rgba(212,138,166,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.primary, boxShadow: `0 0 12px ${T.primary}` }} />
                  <span style={{ fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.primary }}>Live Now</span>
                  {activeProj && <ProjectPill project={activeProj} size="md" />}
                </div>
                <h2 style={{ fontFamily: T.fontBody, fontSize: 26, fontWeight: 600, color: T.text, margin: '0 0 18px', lineHeight: 1.25 }}>{active.text}</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <FlowAction primary icon="check" label="Mark done" hint="X" onClick={() => onToggleDone(active.id)} />
                  <FlowAction icon="arrowR" label="Next" hint="N" />
                  <FlowAction icon="play" label="Focus timer" hint="F" />
                </div>
              </div>
            </div>

            <div style={{ padding: '10px 32px', flex: 1, overflowY: 'auto' }}>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 10 }}>
                Chain — {queued.length} queued
              </div>
              {queued.map((b, i) => {
                const p = b.project ? projects.find(pp => pp.id === b.project) : null;
                const c = p ? PROJECT_COLORS[p.color] : null;
                return (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${T.borderSubtle}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: T.fontMono, fontSize: 11, fontWeight: 600, color: T.textMuted,
                    }}>{i + 2}</div>
                    <div style={{
                      flex: 1, padding: '10px 14px', borderRadius: 10,
                      background: T.surface, border: `1px solid ${T.borderSubtle}`,
                      borderLeft: `3px solid ${c ? c.dot : T.textFaint}`,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <p style={{ flex: 1, margin: 0, fontFamily: T.fontBody, fontSize: 13.5, color: T.text, lineHeight: 1.4,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.text}</p>
                      {p && <ProjectPill project={p} size="sm" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* RIGHT — Telemetry */}
      <div style={{ borderLeft: `1px solid ${T.borderSubtle}`, background: T.bg, padding: '16px 18px', overflowY: 'auto' }}>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 12 }}>Session</div>

        {/* Big ring */}
        <div style={{
          padding: 18, borderRadius: 14,
          background: T.surface, border: `1px solid ${T.borderSubtle}`,
          textAlign: 'center', marginBottom: 14,
        }}>
          <div style={{
            width: 120, height: 120, margin: '0 auto 12px',
            borderRadius: '50%',
            background: `conic-gradient(${T.mint} 0deg ${total ? (doneCount/total)*360 : 0}deg, rgba(255,255,255,0.06) ${total ? (doneCount/total)*360 : 0}deg 360deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 98, height: 98, borderRadius: '50%',
              background: T.surface,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 700, color: T.text }}>{doneCount}</span>
              <span style={{ fontFamily: T.fontDisplay, fontSize: 10, color: T.textMuted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>of {total} done</span>
            </div>
          </div>
          <p style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textSecondary, margin: 0 }}>
            You're {total ? Math.round((doneCount/total)*100) : 0}% through the chain.
          </p>
        </div>

        {/* Streak / stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <StatBox label="In chain" value={chain.length} color={T.primary} />
          <StatBox label="Completed" value={doneCount} color={T.mint} />
          <StatBox label="Pool" value={pool.length} color={T.teal} />
          <StatBox label="Projects" value={new Set(chain.map(b => b.project)).size} color={T.amethyst} />
        </div>

        {/* Last completed */}
        <div style={{ fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 8 }}>Just done</div>
        {done.length === 0 ? (
          <p style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textMuted, margin: 0 }}>Nothing yet — finish your first to unlock the streak.</p>
        ) : done.slice(0, 3).map(b => (
          <div key={b.id} style={{
            padding: '8px 10px', borderRadius: 8, marginBottom: 4,
            background: 'rgba(120,191,165,0.06)', border: '1px solid rgba(120,191,165,0.14)',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <Icon name="check" size={11} color={T.mint} />
            <p style={{ margin: 0, flex: 1, fontFamily: T.fontBody, fontSize: 12, color: T.textSecondary,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── V3: HORIZONTAL TIMELINE ─────────────────────────────────────────────────
function FlowTimeline({ chain, active, queued, pool, total, doneCount, projects, onToggleDone }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 32px 12px' }}>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.primary, marginBottom: 4 }}>Chain timeline</div>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 700, color: T.text, margin: 0, letterSpacing: '-0.01em' }}>
          {chain.length} in flight · {doneCount} complete
        </h2>
      </div>

      {/* Scrolling timeline */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '20px 32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', minWidth: 'max-content', gap: 0 }}>
          {chain.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmptyChain />
            </div>
          ) : chain.map((b, i) => {
            const isActive = i === 0;
            const proj = b.project ? projects.find(p => p.id === b.project) : null;
            const c = proj ? PROJECT_COLORS[proj.color] : null;
            return (
              <React.Fragment key={b.id}>
                {i > 0 && (
                  <div style={{
                    width: 60, height: 2, background: 'rgba(255,255,255,0.1)',
                    position: 'relative', flexShrink: 0,
                  }}>
                    <div style={{ position: 'absolute', right: -2, top: -3, width: 8, height: 8, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.12)' }} />
                  </div>
                )}
                <div style={{
                  width: isActive ? 380 : 260, flexShrink: 0,
                  padding: isActive ? 22 : 16,
                  borderRadius: isActive ? 20 : 14,
                  background: isActive
                    ? `radial-gradient(120% 100% at 0% 0%, rgba(212,138,166,0.14) 0%, transparent 55%), ${T.surface}`
                    : T.surface,
                  border: `1.5px solid ${isActive ? 'rgba(212,138,166,0.3)' : T.borderSubtle}`,
                  borderLeft: `3px solid ${c ? c.dot : T.textFaint}`,
                  boxShadow: isActive ? '0 0 50px rgba(212,138,166,0.08)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    {isActive ? (
                      <>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.primary, boxShadow: `0 0 12px ${T.primary}` }} />
                        <span style={{ fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.primary }}>Live Now</span>
                      </>
                    ) : (
                      <>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1px solid ${T.borderSubtle}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: T.fontMono, fontSize: 10, fontWeight: 600, color: T.textMuted }}>{i + 1}</div>
                        <span style={{ fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textMuted }}>In chain</span>
                      </>
                    )}
                    <div style={{ flex: 1 }} />
                    {proj && <ProjectPill project={proj} size="sm" />}
                  </div>
                  <p style={{
                    margin: 0, fontFamily: T.fontBody,
                    fontSize: isActive ? 20 : 14, fontWeight: isActive ? 600 : 500,
                    color: T.text, lineHeight: 1.3,
                  }}>{b.text}</p>
                  {isActive && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                      <FlowAction primary icon="check" label="Done" hint="X" onClick={() => onToggleDone(b.id)} />
                      <FlowAction icon="arrowR" label="Next" hint="N" />
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
          {/* End marker */}
          {chain.length > 0 && (
            <>
              <div style={{ width: 60, height: 2, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
              <div style={{
                width: 120, height: 120, borderRadius: '50%', flexShrink: 0,
                border: `1.5px dashed ${T.borderSubtle}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 3,
              }}>
                <Icon name="sparkle" size={16} color={T.mint} />
                <span style={{ fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textMuted }}>Chain end</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom tray */}
      <div style={{ borderTop: `1px solid ${T.borderSubtle}`, background: T.surface, padding: '14px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Icon name="archive" size={13} color={T.textSecondary} />
          <span style={{ fontFamily: T.fontDisplay, fontSize: 12, fontWeight: 700, color: T.textSecondary }}>Tray</span>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 11, color: T.textMuted }}>{pool.length} ready to insert into chain</span>
        </div>
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2 }}>
          {pool.slice(0, 10).map(b => <TrayTile key={b.id} bullet={b} projects={projects} narrow />)}
        </div>
      </div>
    </div>
  );
}

// ─── SHARED FLOW ATOMS ───────────────────────────────────────────────────────

function FlowAction({ primary = false, icon, label, hint, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '9px 14px', borderRadius: 10,
      background: primary ? 'rgba(120,191,165,0.14)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${primary ? 'rgba(120,191,165,0.34)' : T.borderSubtle}`,
      color: primary ? T.mint : T.textSecondary,
      fontFamily: T.fontDisplay, fontSize: 12.5, fontWeight: 600,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      transition: 'all 0.12s',
    }}>
      <Icon name={icon} size={13} />
      {label}
      {hint && <KeyHint style={{ marginLeft: 2, background: primary ? 'rgba(120,191,165,0.14)' : 'rgba(255,255,255,0.05)' }}>{hint}</KeyHint>}
    </button>
  );
}

function ChainConnector() {
  return (
    <div style={{
      width: 48, display: 'flex', alignItems: 'center',
      flexShrink: 0, justifyContent: 'center',
    }}>
      <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />
    </div>
  );
}

function ChainCard({ bullet, projects, index }) {
  const proj = bullet.project ? projects.find(p => p.id === bullet.project) : null;
  const c = proj ? PROJECT_COLORS[proj.color] : null;
  return (
    <div style={{
      width: 230, flexShrink: 0, padding: '12px 14px',
      borderRadius: 12, background: T.surface,
      border: `1px solid ${T.borderSubtle}`,
      borderLeft: `3px solid ${c ? c.dot : T.textFaint}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          border: `1px solid ${T.borderSubtle}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.fontMono, fontSize: 10, fontWeight: 600, color: T.textMuted,
        }}>{index}</div>
        {proj && <ProjectPill project={proj} size="sm" />}
      </div>
      <p style={{
        margin: 0, fontFamily: T.fontBody, fontSize: 13, fontWeight: 500,
        color: T.text, lineHeight: 1.35,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{bullet.text}</p>
    </div>
  );
}

function TrayTile({ bullet, projects, narrow = false }) {
  const proj = bullet.project ? projects.find(p => p.id === bullet.project) : null;
  const c = proj ? PROJECT_COLORS[proj.color] : null;
  return (
    <div style={{
      padding: '9px 11px', borderRadius: 9,
      width: narrow ? 240 : 'auto', flexShrink: 0,
      background: 'rgba(255,255,255,0.025)', border: `1px solid ${T.borderSubtle}`,
      borderLeft: `3px solid ${c ? c.dot : T.textFaint}`,
      display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
    }}>
      <LaneDot lane={bullet.lane} size={5} />
      <p style={{
        flex: 1, margin: 0, fontFamily: T.fontBody, fontSize: 12, color: T.textSecondary,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{bullet.text}</p>
      <Icon name="arrowR" size={11} color={T.textFaint} />
    </div>
  );
}

function EmptyChain() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{
        maxWidth: 380, textAlign: 'center',
        padding: 32, borderRadius: 16,
        border: `1px dashed ${T.borderSubtle}`,
      }}>
        <Icon name="flow" size={24} color={T.textMuted} />
        <h3 style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700, color: T.text, margin: '12px 0 6px' }}>Chain is empty</h3>
        <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.textMuted, margin: 0, lineHeight: 1.5 }}>
          Pull bullets from the tray into Now to build a trigger chain — one thing at a time.
        </p>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: T.surface, border: `1px solid ${T.borderSubtle}`,
    }}>
      <div style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontFamily: T.fontDisplay, fontSize: 9.5, color: T.textMuted, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
    </div>
  );
}

Object.assign(window, { FlowViewDesktop });
