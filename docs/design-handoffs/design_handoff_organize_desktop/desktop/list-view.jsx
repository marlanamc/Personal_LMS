// list-view.jsx — ListViewDesktop
// Layout: Project sidebar (left) + Three-lane kanban (center) + Focus inspector (right)

const { useState: useStateL, useMemo: useMemoL } = React;

function ListViewDesktop({ bullets, projects, onToggleDone, onAssign }) {
  const [selectedProjectId, setSelectedProjectId] = useStateL('all');
  const [focused, setFocused] = useStateL(null); // bullet id

  // Counts
  const projectStats = useMemoL(() => {
    const map = {};
    projects.forEach(p => {
      const projBullets = bullets.filter(b => b.project === p.id && b.lane !== 'done');
      map[p.id] = {
        total: projBullets.length,
        now: projBullets.filter(b => b.lane === 'now').length,
        next: projBullets.filter(b => b.lane === 'next').length,
        later: projBullets.filter(b => b.lane === 'later').length,
      };
    });
    return map;
  }, [bullets, projects]);

  const allNow = bullets.filter(b => b.lane === 'now' && b.project);

  // Filter bullets for middle
  const visibleBullets = useMemoL(() => {
    if (selectedProjectId === 'all') return bullets.filter(b => b.project && b.lane !== 'done');
    if (selectedProjectId === 'now') return bullets.filter(b => b.lane === 'now' && b.project);
    return bullets.filter(b => b.project === selectedProjectId && b.lane !== 'done');
  }, [bullets, selectedProjectId]);

  const byLane = lane => visibleBullets.filter(b => b.lane === lane);

  const focusedBullet = bullets.find(b => b.id === focused);
  const focusedProject = focusedBullet?.project ? projects.find(p => p.id === focusedBullet.project) : null;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: T.bg }}>
      {/* ── PROJECT SIDEBAR ─────────────────────────────────────────── */}
      <div style={{
        width: 260, flexShrink: 0,
        borderRight: `1px solid ${T.borderSubtle}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{
            fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: T.textMuted, marginBottom: 8,
          }}>Filter</div>
          <ProjectFilterRow
            label="All active"
            count={bullets.filter(b => b.project && b.lane !== 'done').length}
            active={selectedProjectId === 'all'}
            onClick={() => setSelectedProjectId('all')}
            iconDot="#ffffff20"
          />
          <ProjectFilterRow
            label="Now across projects"
            count={allNow.length}
            active={selectedProjectId === 'now'}
            onClick={() => setSelectedProjectId('now')}
            iconDot={T.primary}
            glow
          />
        </div>

        <div style={{ padding: '10px 16px 8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <span style={{
              fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: T.textMuted,
            }}>Projects</span>
            <button style={{...iconBtnStyle(), width: 20, height: 20}} title="New project">
              <Icon name="plus" size={12} />
            </button>
          </div>
          {projects.map(p => {
            const c = PROJECT_COLORS[p.color];
            const stats = projectStats[p.id];
            const active = p.id === selectedProjectId;
            return (
              <button key={p.id} onClick={() => setSelectedProjectId(p.id)} style={{
                width: '100%', padding: '8px 10px', marginBottom: 2,
                borderRadius: 8, border: 'none',
                background: active ? c.bg : 'transparent',
                color: active ? c.text : T.textSecondary,
                cursor: 'pointer', transition: 'all 0.12s',
                display: 'flex', alignItems: 'center', gap: 9,
                fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 600,
                textAlign: 'left',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: c.dot, flexShrink: 0,
                  boxShadow: active ? `0 0 8px ${c.glow}` : 'none',
                }} />
                <span style={{ flex: 1 }}>{p.label}</span>
                <span style={{
                  fontFamily: T.fontDisplay, fontSize: 11, fontWeight: 600,
                  color: active ? c.text : T.textMuted,
                  opacity: active ? 0.75 : 1,
                }}>{stats.total}</span>
              </button>
            );
          })}
        </div>

        {/* Keyboard legend pinned bottom */}
        <div style={{ flex: 1 }} />
        <div style={{
          padding: '14px 16px', borderTop: `1px solid ${T.borderSubtle}`,
          display: 'flex', flexDirection: 'column', gap: 7,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Icon name="keyboard" size={12} color={T.textMuted} />
            <span style={{
              fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textMuted,
            }}>Shortcuts</span>
          </div>
          {[
            ['j / k', 'Move'],
            ['n',     'Push to Next'],
            ['l',     'Push to Later'],
            ['x',     'Mark done'],
            ['/',     'Quick add'],
          ].map(([k, label]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: T.fontBody, fontSize: 11, color: T.textSecondary }}>{label}</span>
              <KeyHint>{k}</KeyHint>
            </div>
          ))}
        </div>
      </div>

      {/* ── THREE-LANE KANBAN ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ListHeader
          selectedProjectId={selectedProjectId}
          projects={projects}
          visibleBullets={visibleBullets}
        />
        <div style={{
          flex: 1, overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 1, background: T.borderSubtle,
          borderTop: `1px solid ${T.borderSubtle}`,
        }}>
          <LaneColumn lane="now" bullets={byLane('now')} projects={projects}
            onToggleDone={onToggleDone} onFocus={setFocused} focusedId={focused} showProject={selectedProjectId === 'all' || selectedProjectId === 'now'} />
          <LaneColumn lane="next" bullets={byLane('next')} projects={projects}
            onToggleDone={onToggleDone} onFocus={setFocused} focusedId={focused} showProject={selectedProjectId === 'all' || selectedProjectId === 'now'} />
          <LaneColumn lane="later" bullets={byLane('later')} projects={projects}
            onToggleDone={onToggleDone} onFocus={setFocused} focusedId={focused} showProject={selectedProjectId === 'all' || selectedProjectId === 'now'} />
        </div>
      </div>

      {/* ── FOCUS INSPECTOR ─────────────────────────────────────────── */}
      <FocusInspector bullet={focusedBullet} project={focusedProject} onClose={() => setFocused(null)} onToggleDone={onToggleDone} />
    </div>
  );
}

function ProjectFilterRow({ label, count, active, onClick, iconDot, glow = false }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '8px 10px', marginBottom: 2,
      borderRadius: 8, border: 'none',
      background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
      color: active ? T.text : T.textSecondary,
      cursor: 'pointer', transition: 'all 0.12s',
      display: 'flex', alignItems: 'center', gap: 9,
      fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 600,
      textAlign: 'left',
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: iconDot, flexShrink: 0,
        boxShadow: glow ? `0 0 10px ${iconDot}` : 'none',
      }} />
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>{count}</span>
    </button>
  );
}

function ListHeader({ selectedProjectId, projects, visibleBullets }) {
  let title, subtitle, accentColor;
  if (selectedProjectId === 'all') {
    title = 'All active bullets';
    subtitle = `${visibleBullets.length} across ${projects.length} projects`;
    accentColor = T.text;
  } else if (selectedProjectId === 'now') {
    title = 'Now — across all projects';
    subtitle = `${visibleBullets.length} in flight`;
    accentColor = T.primary;
  } else {
    const p = projects.find(pp => pp.id === selectedProjectId);
    const c = PROJECT_COLORS[p.color];
    title = p.label;
    subtitle = `${visibleBullets.length} open bullets`;
    accentColor = c.text;
  }
  return (
    <div style={{
      padding: '16px 24px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <h2 style={{
          fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700,
          color: accentColor, margin: 0, letterSpacing: '-0.01em',
        }}>{title}</h2>
        <p style={{
          fontFamily: T.fontDisplay, fontSize: 12, color: T.textMuted,
          margin: '3px 0 0', fontWeight: 500,
        }}>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button style={{
          padding: '6px 12px', borderRadius: 8,
          background: 'transparent', border: `1px solid ${T.borderSubtle}`,
          color: T.textSecondary, cursor: 'pointer',
          fontFamily: T.fontDisplay, fontSize: 12, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="filter" size={12} /> Filter
        </button>
        <button style={{
          padding: '6px 12px', borderRadius: 8,
          background: 'transparent', border: `1px solid ${T.borderSubtle}`,
          color: T.textSecondary, cursor: 'pointer',
          fontFamily: T.fontDisplay, fontSize: 12, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="archive" size={12} /> Done log
        </button>
      </div>
    </div>
  );
}

function LaneColumn({ lane, bullets, projects, onToggleDone, onFocus, focusedId, showProject }) {
  const conf = LANE_CONFIG[lane];
  return (
    <div style={{
      background: T.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Lane header */}
      <div style={{
        padding: '12px 18px 10px',
        borderBottom: `1px solid ${T.borderSubtle}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `linear-gradient(180deg, ${conf.bg} 0%, transparent 100%)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: conf.color, boxShadow: lane === 'now' ? `0 0 10px ${conf.glow}` : 'none',
          }} />
          <span style={{
            fontFamily: T.fontDisplay, fontSize: 11, fontWeight: 800,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: conf.color,
          }}>{conf.label}</span>
          <span style={{
            fontFamily: T.fontDisplay, fontSize: 11, fontWeight: 600,
            color: T.textMuted,
          }}>{bullets.length}</span>
        </div>
        <button style={{...iconBtnStyle(), color: T.textMuted}} title="Add to lane">
          <Icon name="plus" size={12} />
        </button>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        {bullets.length === 0 ? (
          <div style={{
            padding: '30px 16px', textAlign: 'center',
            border: `1px dashed ${T.borderSubtle}`, borderRadius: 10, marginTop: 6,
          }}>
            <p style={{
              fontFamily: T.fontBody, fontSize: 12, color: T.textMuted, margin: 0,
            }}>Nothing in {conf.label.toLowerCase()}</p>
          </div>
        ) : bullets.map(b => (
          <LaneCard key={b.id} bullet={b} projects={projects}
            lane={lane} onToggleDone={onToggleDone}
            onFocus={() => onFocus(b.id)}
            isFocused={focusedId === b.id}
            showProject={showProject}
          />
        ))}
      </div>
    </div>
  );
}

function LaneCard({ bullet, projects, lane, onToggleDone, onFocus, isFocused, showProject }) {
  const [hover, setHover] = useStateL(false);
  const project = bullet.project ? projects.find(p => p.id === bullet.project) : null;
  const c = project ? PROJECT_COLORS[project.color] : null;
  const conf = LANE_CONFIG[lane];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onFocus}
      style={{
        padding: '10px 12px 10px 11px', marginBottom: 5,
        borderRadius: 10, cursor: 'pointer',
        background: isFocused ? 'rgba(255,255,255,0.04)' : hover ? 'rgba(255,255,255,0.025)' : T.surface,
        border: `1px solid ${isFocused ? conf.border : T.borderSubtle}`,
        borderLeft: `3px solid ${c ? c.dot : T.textFaint}`,
        transition: 'all 0.12s',
        display: 'flex', alignItems: 'flex-start', gap: 9,
      }}>
      <TaskCheck
        done={false}
        onToggle={(e) => { onToggleDone(bullet.id); }}
        size={16}
        laneColor={conf.color}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontFamily: T.fontBody, fontSize: 13, fontWeight: 500,
          color: T.text, lineHeight: 1.4,
        }}>{bullet.text}</p>
        {showProject && project && (
          <div style={{ marginTop: 6 }}>
            <ProjectPill project={project} size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FOCUS INSPECTOR ──────────────────────────────────────────────────────────
function FocusInspector({ bullet, project, onClose, onToggleDone }) {
  if (!bullet) {
    return (
      <div style={{
        width: 280, flexShrink: 0, borderLeft: `1px solid ${T.borderSubtle}`,
        background: T.bg,
        padding: '24px 20px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: T.textMuted,
        }}>Inspector</div>
        <div style={{
          padding: '24px 16px', textAlign: 'center',
          border: `1px dashed ${T.borderSubtle}`, borderRadius: 12,
        }}>
          <Icon name="eye" size={18} color={T.textMuted} />
          <p style={{
            fontFamily: T.fontBody, fontSize: 12, color: T.textMuted,
            margin: '8px 0 0', lineHeight: 1.5,
          }}>Click a bullet<br/>to inspect & edit.</p>
        </div>

        <TodayGlanceCard />
      </div>
    );
  }

  const c = project ? PROJECT_COLORS[project.color] : null;
  const conf = LANE_CONFIG[bullet.lane];

  return (
    <div style={{
      width: 280, flexShrink: 0, borderLeft: `1px solid ${T.borderSubtle}`,
      background: T.bg,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 18px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${T.borderSubtle}`,
      }}>
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: T.textMuted,
        }}>Inspector</div>
        <button onClick={onClose} style={iconBtnStyle()}><Icon name="x" size={12} /></button>
      </div>

      <div style={{ padding: 18, overflowY: 'auto', flex: 1 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <LaneTag lane={bullet.lane} size="sm" glow={bullet.lane === 'now'} />
          {project && <ProjectPill project={project} size="sm" />}
        </div>
        <p style={{
          fontFamily: T.fontBody, fontSize: 16, fontWeight: 500,
          color: T.text, lineHeight: 1.4, margin: '0 0 18px',
        }}>{bullet.text}</p>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <MetaRow label="Captured" value="Today, 9:14 AM" />
          <MetaRow label="Lane" value={conf?.label ?? '—'} />
          <MetaRow label="Project" value={project?.label ?? 'Inbox'} />
          <MetaRow label="Sessions" value="0" />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <InspectorAction icon="play" label="Start focus session" primary />
          <InspectorAction icon="check" label="Mark done" onClick={() => onToggleDone(bullet.id)} />
          <InspectorAction icon="arrowR" label="Push to Next" />
          <InspectorAction icon="edit" label="Rename" />
          <InspectorAction icon="archive" label="Archive" />
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{
        fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textMuted,
      }}>{label}</span>
      <span style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textSecondary, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function InspectorAction({ icon, label, primary = false, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 10px', borderRadius: 8,
      background: primary ? 'rgba(212,138,166,0.12)' : 'transparent',
      border: `1px solid ${primary ? 'rgba(212,138,166,0.28)' : T.borderSubtle}`,
      color: primary ? T.primary : T.textSecondary, cursor: 'pointer',
      fontFamily: T.fontDisplay, fontSize: 12, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 8,
      textAlign: 'left',
    }}>
      <Icon name={icon} size={13} />
      {label}
    </button>
  );
}

function TodayGlanceCard() {
  return (
    <div style={{
      padding: 14, borderRadius: 12,
      background: T.surface, border: `1px solid ${T.borderSubtle}`,
    }}>
      <div style={{
        fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textMuted,
        marginBottom: 9,
      }}>Today at a glance</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[
          { k: 'In Now', v: '6', color: T.primary },
          { k: 'Captured', v: '2', color: T.amethyst },
          { k: 'Completed', v: '3', color: T.mint },
        ].map(r => (
          <div key={r.k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textSecondary }}>{r.k}</span>
            <span style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 700, color: r.color }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ListViewDesktop });
