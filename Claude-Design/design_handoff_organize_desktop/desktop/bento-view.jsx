// bento-view.jsx — BentoViewDesktop with 3 variations
// v1: Focus-hero (largest project top-left + supporting cards)
// v2: Uniform-grid (3-col grid, all equal)
// v3: Adaptive-masonry (columns flowing by task count)

const { useState: useStateB, useMemo: useMemoB } = React;

function BentoViewDesktop({ bullets, projects, onToggleDone, variant = 'focus' }) {
  const [laneFilter, setLaneFilter] = useStateB('all');
  const [expanded, setExpanded] = useStateB(new Set());

  const projectBulletMap = useMemoB(() => {
    const m = {};
    projects.forEach(p => {
      m[p.id] = bullets.filter(b => b.project === p.id && b.lane !== 'done');
    });
    return m;
  }, [bullets, projects]);

  const filter = bs => laneFilter === 'all' ? bs : bs.filter(b => b.lane === laneFilter);

  const toggleExpand = id => setExpanded(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.bg }}>
      {/* Lane filter bar */}
      <div style={{
        padding: '14px 24px 12px', display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: `1px solid ${T.borderSubtle}`,
      }}>
        <div style={{
          display: 'flex', gap: 3, padding: 3, borderRadius: 9,
          background: 'rgba(255,255,255,0.025)', border: `1px solid ${T.borderSubtle}`,
        }}>
          {['all', 'now', 'next', 'later'].map(f => {
            const active = laneFilter === f;
            const color = f === 'all' ? T.text : LANE_CONFIG[f].color;
            return (
              <button key={f} onClick={() => setLaneFilter(f)} style={{
                padding: '5px 13px', borderRadius: 6, border: 'none',
                background: active ? (f === 'all' ? 'rgba(255,255,255,0.06)' : LANE_CONFIG[f]?.bg) : 'transparent',
                color: active ? color : T.textMuted,
                fontFamily: T.fontDisplay, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {f !== 'all' && <LaneDot lane={f} size={6} glow={active && f === 'now'} />}
                {f === 'all' ? 'All' : LANE_CONFIG[f].label}
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 11, color: T.textMuted,
          fontWeight: 500, letterSpacing: '0.03em',
        }}>
          Click a card to expand · Drag between projects to move
        </div>
      </div>

      {/* Variant content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 32px' }}>
        {variant === 'focus'    && <BentoFocus projects={projects} projectBulletMap={projectBulletMap} filter={filter} expanded={expanded} toggleExpand={toggleExpand} onToggleDone={onToggleDone} laneFilter={laneFilter} />}
        {variant === 'uniform'  && <BentoUniform projects={projects} projectBulletMap={projectBulletMap} filter={filter} expanded={expanded} toggleExpand={toggleExpand} onToggleDone={onToggleDone} laneFilter={laneFilter} />}
        {variant === 'masonry'  && <BentoMasonry projects={projects} projectBulletMap={projectBulletMap} filter={filter} expanded={expanded} toggleExpand={toggleExpand} onToggleDone={onToggleDone} laneFilter={laneFilter} />}
      </div>
    </div>
  );
}

// ─── V1: FOCUS-HERO ──────────────────────────────────────────────────────────
function BentoFocus({ projects, projectBulletMap, filter, expanded, toggleExpand, onToggleDone, laneFilter }) {
  // Hero = project with most 'now' bullets
  const hero = [...projects].sort((a, b) => {
    const aNow = projectBulletMap[a.id].filter(x => x.lane === 'now').length;
    const bNow = projectBulletMap[b.id].filter(x => x.lane === 'now').length;
    return bNow - aNow;
  })[0];
  const rest = projects.filter(p => p.id !== hero.id);

  return (
    <div style={{
      display: 'grid', gap: 14,
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridAutoRows: 'min-content',
    }}>
      {/* Hero */}
      <div style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
        <ProjectCard
          project={hero}
          bullets={filter(projectBulletMap[hero.id])}
          allBullets={projectBulletMap[hero.id]}
          onToggleDone={onToggleDone}
          laneFilter={laneFilter}
          size="hero"
        />
      </div>
      {rest.slice(0, 2).map(p => (
        <div key={p.id} style={{ gridColumn: 'span 1' }}>
          <ProjectCard project={p} bullets={filter(projectBulletMap[p.id])}
            allBullets={projectBulletMap[p.id]} onToggleDone={onToggleDone}
            laneFilter={laneFilter} size="md" />
        </div>
      ))}
      {rest.slice(2).map(p => (
        <div key={p.id} style={{ gridColumn: 'span 1' }}>
          <ProjectCard project={p} bullets={filter(projectBulletMap[p.id])}
            allBullets={projectBulletMap[p.id]} onToggleDone={onToggleDone}
            laneFilter={laneFilter} size="md" />
        </div>
      ))}
    </div>
  );
}

// ─── V2: UNIFORM GRID ────────────────────────────────────────────────────────
function BentoUniform({ projects, projectBulletMap, filter, onToggleDone, laneFilter }) {
  return (
    <div style={{
      display: 'grid', gap: 14,
      gridTemplateColumns: 'repeat(3, 1fr)',
    }}>
      {projects.map(p => (
        <ProjectCard key={p.id} project={p} bullets={filter(projectBulletMap[p.id])}
          allBullets={projectBulletMap[p.id]} onToggleDone={onToggleDone}
          laneFilter={laneFilter} size="md" />
      ))}
    </div>
  );
}

// ─── V3: ADAPTIVE MASONRY ────────────────────────────────────────────────────
function BentoMasonry({ projects, projectBulletMap, filter, onToggleDone, laneFilter }) {
  // Distribute across 3 columns by round-robin (could balance by task count)
  const cols = [[], [], []];
  [...projects].sort((a, b) => projectBulletMap[b.id].length - projectBulletMap[a.id].length)
    .forEach((p, i) => cols[i % 3].push(p));
  return (
    <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'start' }}>
      {cols.map((col, ci) => (
        <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {col.map(p => (
            <ProjectCard key={p.id} project={p} bullets={filter(projectBulletMap[p.id])}
              allBullets={projectBulletMap[p.id]} onToggleDone={onToggleDone}
              laneFilter={laneFilter} size="auto" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ project, bullets, allBullets, onToggleDone, laneFilter, size = 'md' }) {
  const c = PROJECT_COLORS[project.color];
  const [hover, setHover] = useStateB(false);

  const counts = {
    now: allBullets.filter(b => b.lane === 'now').length,
    next: allBullets.filter(b => b.lane === 'next').length,
    later: allBullets.filter(b => b.lane === 'later').length,
  };

  const showAll = size === 'hero' || size === 'auto';
  const maxShow = size === 'hero' ? 999 : size === 'auto' ? 999 : 5;
  const shown = bullets.slice(0, maxShow);

  // Group by lane for hero
  const byLane = lane => bullets.filter(b => b.lane === lane);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: size === 'hero' ? 20 : 16,
        borderRadius: 16,
        background: hover
          ? `linear-gradient(145deg, ${c.bgStrong} 0%, ${c.bg} 100%)`
          : `linear-gradient(145deg, ${c.bg} 0%, rgba(255,255,255,0.01) 100%)`,
        border: `1px solid ${hover ? c.border : T.borderSubtle}`,
        transition: 'all 0.18s',
        minHeight: size === 'hero' ? 420 : size === 'auto' ? 'unset' : 220,
        display: 'flex', flexDirection: 'column',
      }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: size === 'hero' ? 18 : 12,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
            <span style={{
              width: size === 'hero' ? 11 : 9, height: size === 'hero' ? 11 : 9,
              borderRadius: '50%', background: c.dot,
              boxShadow: `0 0 ${size === 'hero' ? 14 : 10}px ${c.glow}`,
            }} />
            <h3 style={{
              fontFamily: T.fontDisplay,
              fontSize: size === 'hero' ? 22 : 16, fontWeight: 700,
              color: c.text, margin: 0, letterSpacing: '-0.01em',
            }}>{project.label}</h3>
            {size === 'hero' && (
              <span style={{
                padding: '2px 8px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', color: T.textSecondary,
                fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Focus</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {counts.now > 0 && <LaneCountBadge lane="now" count={counts.now} glow />}
            {counts.next > 0 && <LaneCountBadge lane="next" count={counts.next} />}
            {counts.later > 0 && <LaneCountBadge lane="later" count={counts.later} />}
          </div>
        </div>
        <button style={{...iconBtnStyle(), opacity: hover ? 1 : 0.4}}>
          <Icon name="more" size={14} />
        </button>
      </div>

      {/* Body */}
      {bullets.length === 0 ? (
        <div style={{
          padding: '24px 16px', textAlign: 'center',
          border: `1px dashed ${T.borderSubtle}`, borderRadius: 10, marginTop: 4,
        }}>
          <p style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textMuted, margin: 0 }}>
            {laneFilter === 'all' ? 'No bullets here' : `No ${laneFilter} bullets`}
          </p>
        </div>
      ) : size === 'hero' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['now', 'next', 'later'].map(lane => {
            const items = byLane(lane);
            if (items.length === 0) return null;
            return (
              <div key={lane}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                  <LaneDot lane={lane} size={6} glow={lane === 'now'} />
                  <span style={{
                    fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 800,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: LANE_CONFIG[lane].color,
                  }}>{LANE_CONFIG[lane].label}</span>
                  <span style={{ fontFamily: T.fontDisplay, fontSize: 10, color: T.textMuted }}>
                    {items.length}
                  </span>
                </div>
                <div>
                  {items.map(b => (
                    <BentoBulletRow key={b.id} bullet={b} color={c} lane={lane}
                      onToggleDone={onToggleDone} hero />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {shown.map(b => (
            <BentoBulletRow key={b.id} bullet={b} color={c} lane={b.lane}
              onToggleDone={onToggleDone} />
          ))}
          {bullets.length > maxShow && (
            <button style={{
              marginTop: 4, padding: '6px 8px', width: '100%', textAlign: 'left',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: T.fontDisplay, fontSize: 11, fontWeight: 600,
              color: c.text, opacity: 0.8,
            }}>+ {bullets.length - maxShow} more</button>
          )}
        </div>
      )}
    </div>
  );
}

function BentoBulletRow({ bullet, color, lane, onToggleDone, hero = false }) {
  const [hover, setHover] = useStateB(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: hero ? '6px 0' : '6px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
      <TaskCheck done={false} onToggle={() => onToggleDone(bullet.id)} size={15}
        laneColor={LANE_CONFIG[lane]?.color} />
      <p style={{
        flex: 1, minWidth: 0, margin: 0,
        fontFamily: T.fontBody, fontSize: hero ? 13.5 : 12.5, fontWeight: 500,
        color: T.text, lineHeight: 1.4,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{bullet.text}</p>
      {hover && <LaneDot lane={lane} size={5} glow={lane === 'now'} />}
    </div>
  );
}

function LaneCountBadge({ lane, count, glow = false }) {
  const conf = LANE_CONFIG[lane];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: conf.color,
        boxShadow: glow ? `0 0 6px ${conf.glow}` : 'none',
      }} />
      <span style={{
        fontFamily: T.fontDisplay, fontSize: 11, fontWeight: 700,
        color: conf.color,
      }}>{count}</span>
      <span style={{
        fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 600,
        color: T.textMuted, letterSpacing: '0.08em',
      }}>{conf.label.toLowerCase()}</span>
    </div>
  );
}

Object.assign(window, { BentoViewDesktop });
