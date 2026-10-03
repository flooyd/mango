// Hi-fi matches list — Cards + Rows densities only (Table removed per feedback)

const HIFI_MATCHES = [
  { id: '8716431727', winner: 'radiant', score: [38, 24], ended: '03-05-2026 03:21:35 AM', durationSec: 2487, mode: 'Ranked AP', fb: '01:18', parsed: 'parsed',    nw: [222400, 173600] },
  { id: '8706524802', winner: 'dire',    score: [21, 32], ended: '02-25-2026 16:29:19 PM', durationSec: 1548, mode: 'Turbo',     fb: '00:42', parsed: 'parsed',    nw: [148200, 192100] },
  { id: '8702819942', winner: 'radiant', score: [44, 19], ended: '02-23-2026 02:01:53 AM', durationSec: 1845, mode: 'Ranked AP', fb: '02:04', parsed: 'parsed',    nw: [201300, 132700] },
  { id: '8702708735', winner: 'dire',    score: [28, 41], ended: '02-22-2026 23:59:16 PM', durationSec: 2506, mode: 'Ranked AP', fb: '03:12', parsed: 'parsed',    nw: [175600, 224800] },
  { id: '8702681020', winner: 'radiant', score: [36, 22], ended: '02-22-2026 23:16:13 PM', durationSec: 2348, mode: 'Ranked AP', fb: '01:55', parsed: 'parsed',    nw: [218900, 168400] },
  { id: '8702650058', winner: 'dire',    score: [18, 29], ended: '02-22-2026 22:16:02 PM', durationSec: 1626, mode: 'Turbo',     fb: '00:38', parsed: 'unparsed',  nw: [132100, 178400] },
  { id: '8671127421', winner: 'dire',    score: [24, 35], ended: '01-30-2026 20:36:13 PM', durationSec: 2894, mode: 'Ranked AP', fb: '04:01', parsed: 'parsed',    nw: [188300, 224100] },
  { id: '8664868925', winner: 'dire',    score: [22, 31], ended: '01-25-2026 23:08:48 PM', durationSec: 1983, mode: 'Ranked AP', fb: '02:48', parsed: 'parsed',    nw: [156400, 202900] },
  { id: '8664844861', winner: 'dire',    score: [15, 28], ended: '01-25-2026 22:29:07 PM', durationSec: 2149, mode: 'Ranked AP', fb: '01:32', parsed: 'reparsing', nw: [148800, 199300] },
  { id: '8507366781', winner: 'dire',    score: [19, 33], ended: '10-12-2025 02:45:42 AM', durationSec: 1637, mode: 'Turbo',     fb: '00:54', parsed: 'parsed',    nw: [142200, 187600] },
];

function fmtDur(s) {
  const m = Math.floor(s / 60); const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}
function fmtK(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
}

function ParseBadge({ status }) {
  if (status === 'parsed') return null;
  if (status === 'unparsed') {
    return (
      <span className="pill bare" style={{ fontSize: 9, padding: '1px 6px', color: 'var(--text-3)' }}>
        <span style={{ width: 4, height: 4, background: 'var(--text-3)', borderRadius: '50%' }}></span>
        UNPARSED
      </span>
    );
  }
  if (status === 'reparsing') {
    return (
      <span className="pill blue" style={{ fontSize: 9, padding: '1px 6px', gap: 5 }}>
        <span className="spinner" style={{ width: 8, height: 8, borderWidth: 1.5 }}></span>
        PARSING
      </span>
    );
  }
  return null;
}

// Hero filter selector
function HeroFilter({ open = false, selected = 'All heroes' }) {
  return (
    <div style={{ position: 'relative' }}>
      <div className="pill" style={{ padding: '6px 10px', gap: 8, background: 'var(--bg-2)', cursor: 'pointer' }}>
        <Glyph w={11}>⌕</Glyph>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>HERO</span>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-1)', fontWeight: 600 }}>{selected}</span>
        <Caret dir={open ? 'up' : 'down'} size={5} color="var(--text-3)" />
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 34, left: 0, width: 320,
          background: 'var(--bg-3)', border: '1px solid var(--line-strong)',
          borderRadius: 5, boxShadow: 'var(--shadow-lg)', padding: 10, zIndex: 8,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 8px', background: 'var(--bg-2)',
            borderRadius: 3, marginBottom: 8,
          }}>
            <Glyph w={11} color="var(--text-3)">⌕</Glyph>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>Filter heroes…</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
            {['lion', 'faceless_void', 'silencer', 'earthshaker', 'invoker', 'bloodseeker', 'witch_doctor', 'centaur',
              'chaos_knight', 'ogre_magi', 'pudge', 'juggernaut', 'shadow_fiend', 'crystal_maiden', 'axe', 'mirana'].map((h, i) => (
              <div key={h} style={{
                padding: 2, borderRadius: 3,
                outline: i === 4 ? '2px solid var(--blue)' : 'none',
                outlineOffset: 1,
                cursor: 'pointer',
              }}>
                <HeroIcon name={h} size={32} />
              </div>
            ))}
          </div>
          <div className="mono t-3" style={{ fontSize: 10, marginTop: 8, textAlign: 'center' }}>
            123 heroes · click to filter
          </div>
        </div>
      )}
    </div>
  );
}

// Toolbar
function ListToolbar({ density = 'CARDS', heroFilterOpen = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 28px', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1 }}>
          Replays
        </h2>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="mono" style={{ fontSize: 18, color: 'var(--text-1)', fontWeight: 700 }}>142</span>
          <span className="mono t-3" style={{ fontSize: 10, letterSpacing: '0.12em' }}>MATCHES</span>
        </div>
        <div style={{ width: 1, height: 22, background: 'var(--line-strong)' }}></div>
        <HeroFilter open={heroFilterOpen} />
        <div className="pill" style={{ padding: '6px 10px', gap: 8, background: 'var(--bg-2)' }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>SORT</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-1)', fontWeight: 600 }}>Date</span>
          <Caret dir="down" size={5} color="var(--text-3)" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span className="label">Density</span>
        <div style={{ display: 'inline-flex', background: 'var(--bg-3)', border: '1px solid var(--line-strong)', borderRadius: 4, padding: 2 }}>
          {[{ k: 'CARDS', g: '▦' }, { k: 'ROWS', g: '☰' }].map(d => (
            <div key={d.k} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 3,
              background: density === d.k ? 'var(--bg-5)' : 'transparent',
              color: density === d.k ? 'var(--text-1)' : 'var(--text-3)',
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.05em', fontWeight: 600,
              transition: 'all 150ms ease', cursor: 'pointer',
            }}>
              <Glyph w={10}>{d.g}</Glyph>
              {d.k}
            </div>
          ))}
        </div>
        <button className="btn sm">
          <Glyph w={11}>↻</Glyph>
          Refresh
        </button>
      </div>
    </div>
  );
}

// =============================================================
// A · Card grid (hi-fi)
// =============================================================
function HifiMatchesCards({ theme = 'dark', heroFilterOpen = false }) {
  return (
    <div className="ab" data-theme={theme}>
      <AppHeader theme={theme} />
      <ListToolbar density="CARDS" heroFilterOpen={heroFilterOpen} />
      <div style={{ padding: '0 28px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {HIFI_MATCHES.slice(0, 9).map((m, i) => {
          const radHeroes = heroesFor(m.id + 'r', 5);
          const direHeroes = heroesFor(m.id + 'd', 5);
          const hover = i === 1;
          const [radScore, direScore] = m.score;
          const [radNw, direNw] = m.nw;
          return (
            <div key={m.id} className={'card ' + (hover ? 'hover' : '')} style={{ padding: 16, position: 'relative' }}>
              {/* Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div className="label" style={{ marginBottom: 3, fontSize: 9 }}>Match ID</div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{m.id}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <ParseBadge status={m.parsed} />
                  {hover && (
                    <button className="btn sm" style={{ padding: '3px 8px', fontSize: 10 }}>
                      <Glyph w={9}>↻</Glyph> Reparse
                    </button>
                  )}
                </div>
              </div>

              {/* Score row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="mono" style={{
                    fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em',
                    color: m.winner === 'radiant' ? 'var(--radiant)' : 'var(--text-2)',
                  }}>{radScore}</span>
                  <span className="mono t-3" style={{ fontSize: 18, margin: '0 4px' }}>–</span>
                  <span className="mono" style={{
                    fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em',
                    color: m.winner === 'dire' ? 'var(--dire)' : 'var(--text-2)',
                  }}>{direScore}</span>
                </div>
                <VictoryLabel winner={m.winner} size={10} />
              </div>

              {/* Meta line */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                <span className="pill blue" style={{ fontSize: 10 }}>{fmtDur(m.durationSec)}</span>
                <span className="pill bare" style={{ fontSize: 10 }}>{m.mode}</span>
                <span className="pill bare" style={{ fontSize: 10 }}>
                  <span className="t-3" style={{ marginRight: 3 }}>FB</span>{m.fb}
                </span>
              </div>

              {/* Net worth bar with labels */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="mono t-rad" style={{ fontSize: 10, fontWeight: 600 }}>{fmtK(radNw)}</span>
                  <span className="mono t-3" style={{ fontSize: 9, letterSpacing: '0.08em' }}>NET WORTH</span>
                  <span className="mono t-dire" style={{ fontSize: 10, fontWeight: 600 }}>{fmtK(direNw)}</span>
                </div>
                <NetWorthBar rad={radNw} dire={direNw} />
              </div>

              {/* Lineups */}
              <HeroLineup heroes={radHeroes} opponent={direHeroes} heroW={32} />

              {/* Date footer */}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
                <span className="mono t-3" style={{ fontSize: 10 }}>Ended {m.ended}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================
// C · Hybrid expandable rows (hi-fi)
// =============================================================
function HifiMatchesRows({ theme = 'dark', expandedIdx = 1 }) {
  return (
    <div className="ab" data-theme={theme}>
      <AppHeader theme={theme} />
      <ListToolbar density="ROWS" />
      <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {HIFI_MATCHES.map((m, i) => {
          const expanded = i === expandedIdx;
          const hover = i === 3;
          const radHeroes = heroesFor(m.id + 'r', 5);
          const direHeroes = heroesFor(m.id + 'd', 5);
          const [radScore, direScore] = m.score;
          const isRad = m.winner === 'radiant';
          return (
            <div key={m.id} className={'card ' + (hover ? 'hover' : '')} style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
              {/* Result accent bar on left */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: isRad ? 'var(--radiant)' : 'var(--dire)',
                opacity: 0.85,
              }}></div>

              {/* Compact strip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px 12px 22px',
              }}>
                {/* Result label */}
                <div style={{ width: 78 }}>
                  <div className={isRad ? 't-rad' : 't-dire'} style={{
                    fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                  }}>{isRad ? 'RADIANT' : 'DIRE'}</div>
                  <div className="mono t-3" style={{ fontSize: 9, marginTop: 2 }}>VICTORY</div>
                </div>

                {/* Match ID */}
                <div style={{ width: 110 }}>
                  <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>ID</div>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{m.id}</span>
                </div>

                {/* Score */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, width: 88 }}>
                  <span className="mono" style={{
                    fontSize: 18, fontWeight: 700,
                    color: isRad ? 'var(--radiant)' : 'var(--text-2)',
                  }}>{radScore}</span>
                  <span className="mono t-3" style={{ fontSize: 14 }}>–</span>
                  <span className="mono" style={{
                    fontSize: 18, fontWeight: 700,
                    color: m.winner === 'dire' ? 'var(--dire)' : 'var(--text-2)',
                  }}>{direScore}</span>
                </div>

                {/* Duration */}
                <span className="pill blue" style={{ fontSize: 10 }}>{fmtDur(m.durationSec)}</span>

                {/* Mode */}
                <span className="pill bare" style={{ fontSize: 10 }}>{m.mode}</span>

                {/* FB */}
                <span className="mono t-3" style={{ fontSize: 10 }}>
                  FB <span className="t-1">{m.fb}</span>
                </span>

                {/* Lineups */}
                <div style={{ marginLeft: 'auto' }}>
                  <HeroLineup heroes={radHeroes} opponent={direHeroes} heroW={30} />
                </div>

                {/* Date */}
                <span className="mono t-3" style={{ fontSize: 10, width: 88, textAlign: 'right' }}>
                  {m.ended.split(' ')[0]}
                </span>

                {/* Status */}
                <div style={{ width: 14, display: 'flex', justifyContent: 'flex-end' }}>
                  <Caret dir={expanded ? 'up' : 'down'} size={5} color="var(--text-3)" />
                </div>
              </div>

              {/* Expanded detail strip */}
              {expanded && (
                <div style={{
                  padding: '14px 22px 18px',
                  background: 'var(--bg-3)',
                  borderTop: '1px solid var(--line)',
                  display: 'flex', gap: 24, alignItems: 'center',
                }}>
                  {/* Net worth */}
                  <div style={{ flex: 1, maxWidth: 320 }}>
                    <div className="label" style={{ marginBottom: 6, fontSize: 9 }}>Net worth</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span className="mono t-rad" style={{ fontSize: 11, fontWeight: 600 }}>{fmtK(m.nw[0])}</span>
                      <span className="mono t-dire" style={{ fontSize: 11, fontWeight: 600 }}>{fmtK(m.nw[1])}</span>
                    </div>
                    <NetWorthBar rad={m.nw[0]} dire={m.nw[1]} height={6} />
                  </div>

                  {/* Top performers */}
                  <div>
                    <div className="label" style={{ marginBottom: 6, fontSize: 9 }}>Top performers</div>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <HeroIcon name={direHeroes[3]} size={32} />
                        <div>
                          <div style={{ fontSize: 11, fontFamily: 'var(--sans)', fontWeight: 600 }}>{HEROES[direHeroes[3]]}</div>
                          <div className="mono t-2" style={{ fontSize: 10 }}>
                            <span className="t-1">12</span> / <span className="t-1">5</span> / <span className="t-1">7</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <HeroIcon name={direHeroes[0]} size={32} />
                        <div>
                          <div style={{ fontSize: 11, fontFamily: 'var(--sans)', fontWeight: 600 }}>{HEROES[direHeroes[0]]}</div>
                          <div className="mono t-2" style={{ fontSize: 10 }}>
                            <span className="t-1">8</span> / <span className="t-1">8</span> / <span className="t-1">5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button className="btn sm">
                      <Glyph w={11}>↻</Glyph> Reparse
                    </button>
                    <button className="btn primary sm">
                      Open match
                      <Caret dir="right" size={4} color="white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  HifiMatchesCards, HifiMatchesRows, HIFI_MATCHES, ParseBadge, fmtDur, fmtK,
});
