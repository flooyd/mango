// Interactive matches list — Cards + Rows densities, fully wired

const { useState: useStateL, useMemo: useMemoL } = React;

function InteractiveListToolbar({
  density, onDensityChange,
  heroFilter, onHeroFilterChange,
  heroFilterOpen, onHeroFilterOpenChange,
  sortBy, onSortByChange,
  sortOpen, onSortOpenChange,
  total, visible,
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 28px', gap: 16, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1 }}>
          Replays
        </h2>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="mono" style={{ fontSize: 18, fontWeight: 700 }}>
            {visible === total ? total : `${visible} / ${total}`}
          </span>
          <span className="mono t-3" style={{ fontSize: 10, letterSpacing: '0.12em' }}>MATCHES</span>
        </div>
        <div style={{ width: 1, height: 22, background: 'var(--line-strong)' }}></div>

        {/* Hero filter */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => onHeroFilterOpenChange(!heroFilterOpen)}
            className="pill" style={{
              padding: '6px 10px', gap: 8, background: 'var(--bg-2)', cursor: 'pointer',
              borderColor: heroFilterOpen || heroFilter ? 'var(--blue)' : 'var(--line-strong)',
            }}>
            {heroFilter
              ? <HeroIcon name={heroFilter} size={18} />
              : <Glyph w={11}>⌕</Glyph>}
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>HERO</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-1)', fontWeight: 600 }}>
              {heroFilter ? HEROES[heroFilter] : 'All heroes'}
            </span>
            {heroFilter && (
              <span onClick={(e) => { e.stopPropagation(); onHeroFilterChange(null); }}
                style={{
                  marginLeft: 2, padding: '0 4px', borderRadius: 2,
                  color: 'var(--text-3)', fontSize: 11,
                }}>✕</span>
            )}
            <Caret dir={heroFilterOpen ? 'up' : 'down'} size={5} color="var(--text-3)" />
          </div>
          {heroFilterOpen && (
            <>
              {/* backdrop to close */}
              <div style={{ position: 'fixed', inset: 0, zIndex: 7 }} onClick={() => onHeroFilterOpenChange(false)}></div>
              <div style={{
                position: 'absolute', top: 38, left: 0, width: 340,
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
                  {['lion', 'faceless_void', 'silencer', 'earthshaker', 'invoker',
                    'bloodseeker', 'witch_doctor', 'centaur', 'chaos_knight', 'ogre_magi',
                    'pudge', 'juggernaut', 'shadow_fiend', 'crystal_maiden', 'axe', 'mirana',
                  ].map((h) => (
                    <div key={h}
                      onClick={() => { onHeroFilterChange(h); onHeroFilterOpenChange(false); }}
                      style={{
                        padding: 2, borderRadius: 3, cursor: 'pointer',
                        outline: heroFilter === h ? '2px solid var(--blue)' : 'none',
                        outlineOffset: 1,
                      }}>
                      <HeroIcon name={h} size={32} />
                    </div>
                  ))}
                </div>
                <div className="mono t-3" style={{ fontSize: 10, marginTop: 8, textAlign: 'center' }}>
                  Click a hero to filter
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => onSortOpenChange(!sortOpen)}
            className="pill" style={{
              padding: '6px 10px', gap: 8, background: 'var(--bg-2)', cursor: 'pointer',
              borderColor: sortOpen ? 'var(--blue)' : 'var(--line-strong)',
            }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>SORT</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-1)', fontWeight: 600 }}>
              {sortBy === 'date' ? 'Date' : sortBy === 'duration' ? 'Duration' : 'Kills'}
            </span>
            <Caret dir={sortOpen ? 'up' : 'down'} size={5} color="var(--text-3)" />
          </div>
          {sortOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 7 }} onClick={() => onSortOpenChange(false)}></div>
              <div style={{
                position: 'absolute', top: 38, left: 0, width: 160,
                background: 'var(--bg-3)', border: '1px solid var(--line-strong)',
                borderRadius: 5, boxShadow: 'var(--shadow-lg)', padding: 4, zIndex: 8,
              }}>
                {[
                  { v: 'date',     l: 'Date (newest)' },
                  { v: 'duration', l: 'Duration' },
                  { v: 'kills',    l: 'Total kills' },
                ].map(o => (
                  <div key={o.v}
                    onClick={() => { onSortByChange(o.v); onSortOpenChange(false); }}
                    style={{
                      padding: '7px 10px', borderRadius: 3, cursor: 'pointer',
                      background: sortBy === o.v ? 'var(--bg-4)' : 'transparent',
                      fontFamily: 'var(--sans)', fontSize: 12,
                      color: sortBy === o.v ? 'var(--text-1)' : 'var(--text-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                    {o.l}
                    {sortBy === o.v && <span className="t-blue" style={{ fontSize: 11 }}>✓</span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span className="label">Density</span>
        <div style={{ display: 'inline-flex', background: 'var(--bg-3)', border: '1px solid var(--line-strong)', borderRadius: 4, padding: 2 }}>
          {[{ k: 'cards', g: '▦', l: 'CARDS' }, { k: 'rows', g: '☰', l: 'ROWS' }].map(d => (
            <div key={d.k}
              onClick={() => onDensityChange(d.k)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 3, cursor: 'pointer',
                background: density === d.k ? 'var(--bg-5)' : 'transparent',
                color: density === d.k ? 'var(--text-1)' : 'var(--text-3)',
                fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.05em', fontWeight: 600,
                transition: 'all 150ms ease',
              }}>
              <Glyph w={10}>{d.g}</Glyph>
              {d.l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Card variant
function MatchCard({ match, onClick }) {
  const radHeroes = useMemoL(() => heroesFor(match.id + 'r', 5), [match.id]);
  const direHeroes = useMemoL(() => heroesFor(match.id + 'd', 5), [match.id]);
  const [hover, setHover] = useStateL(false);
  const [radScore, direScore] = match.score;
  const [radNw, direNw] = match.nw;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={'card ' + (hover ? 'hover' : '')}
      style={{ padding: 16, position: 'relative', cursor: 'pointer' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div className="label" style={{ marginBottom: 3, fontSize: 9 }}>Match ID</div>
          <div className="mono" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{match.id}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <ParseBadge status={match.parsed} />
          {hover && (
            <button onClick={(e) => e.stopPropagation()} className="btn sm" style={{ padding: '3px 8px', fontSize: 10 }}>
              <Glyph w={9}>↻</Glyph> Reparse
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="mono" style={{
            fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em',
            color: match.winner === 'radiant' ? 'var(--radiant)' : 'var(--text-2)',
          }}>{radScore}</span>
          <span className="mono t-3" style={{ fontSize: 18, margin: '0 4px' }}>–</span>
          <span className="mono" style={{
            fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em',
            color: match.winner === 'dire' ? 'var(--dire)' : 'var(--text-2)',
          }}>{direScore}</span>
        </div>
        <VictoryLabel winner={match.winner} size={10} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <span className="pill blue" style={{ fontSize: 10 }}>{fmtDur(match.durationSec)}</span>
        <span className="pill bare" style={{ fontSize: 10 }}>{match.mode}</span>
        <span className="pill bare" style={{ fontSize: 10 }}>
          <span className="t-3" style={{ marginRight: 3 }}>FB</span>{match.fb}
        </span>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="mono t-rad" style={{ fontSize: 10, fontWeight: 600 }}>{fmtK(radNw)}</span>
          <span className="mono t-3" style={{ fontSize: 9, letterSpacing: '0.08em' }}>NET WORTH</span>
          <span className="mono t-dire" style={{ fontSize: 10, fontWeight: 600 }}>{fmtK(direNw)}</span>
        </div>
        <NetWorthBar rad={radNw} dire={direNw} />
      </div>

      <HeroLineup heroes={radHeroes} opponent={direHeroes} heroW={32} />

      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
        <span className="mono t-3" style={{ fontSize: 10 }}>Ended {match.ended}</span>
      </div>
    </div>
  );
}

// Row variant
function MatchRow({ match, expanded, onToggleExpand, onOpen }) {
  const [hover, setHover] = useStateL(false);
  const radHeroes = useMemoL(() => heroesFor(match.id + 'r', 5), [match.id]);
  const direHeroes = useMemoL(() => heroesFor(match.id + 'd', 5), [match.id]);
  const [radScore, direScore] = match.score;
  const isRad = match.winner === 'radiant';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={'card ' + (hover && !expanded ? 'hover' : '')}
      style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>

      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: isRad ? 'var(--radiant)' : 'var(--dire)',
        opacity: 0.85,
      }}></div>

      <div
        onClick={onToggleExpand}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 16px 12px 22px', cursor: 'pointer',
        }}>
        <div style={{ width: 78 }}>
          <div className={isRad ? 't-rad' : 't-dire'} style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
          }}>{isRad ? 'RADIANT' : 'DIRE'}</div>
          <div className="mono t-3" style={{ fontSize: 9, marginTop: 2 }}>VICTORY</div>
        </div>
        <div style={{ width: 110 }}>
          <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>ID</div>
          <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{match.id}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, width: 88 }}>
          <span className="mono" style={{
            fontSize: 18, fontWeight: 700,
            color: isRad ? 'var(--radiant)' : 'var(--text-2)',
          }}>{radScore}</span>
          <span className="mono t-3" style={{ fontSize: 14 }}>–</span>
          <span className="mono" style={{
            fontSize: 18, fontWeight: 700,
            color: match.winner === 'dire' ? 'var(--dire)' : 'var(--text-2)',
          }}>{direScore}</span>
        </div>
        <span className="pill blue" style={{ fontSize: 10 }}>{fmtDur(match.durationSec)}</span>
        <span className="pill bare" style={{ fontSize: 10 }}>{match.mode}</span>
        <span className="mono t-3" style={{ fontSize: 10 }}>
          FB <span className="t-1">{match.fb}</span>
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <HeroLineup heroes={radHeroes} opponent={direHeroes} heroW={30} />
        </div>
        <span className="mono t-3" style={{ fontSize: 10, width: 88, textAlign: 'right' }}>
          {match.ended.split(' ')[0]}
        </span>
        <div style={{ width: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <Caret dir={expanded ? 'up' : 'down'} size={5} color="var(--text-3)" />
        </div>
      </div>

      {expanded && (
        <div style={{
          padding: '14px 22px 18px',
          background: 'var(--bg-3)',
          borderTop: '1px solid var(--line)',
          display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 240, maxWidth: 320 }}>
            <div className="label" style={{ marginBottom: 6, fontSize: 9 }}>Net worth</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span className="mono t-rad" style={{ fontSize: 11, fontWeight: 600 }}>{fmtK(match.nw[0])}</span>
              <span className="mono t-dire" style={{ fontSize: 11, fontWeight: 600 }}>{fmtK(match.nw[1])}</span>
            </div>
            <NetWorthBar rad={match.nw[0]} dire={match.nw[1]} height={6} />
          </div>

          <div>
            <div className="label" style={{ marginBottom: 6, fontSize: 9 }}>Top performers</div>
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                { h: direHeroes[3], k: 12, d: 5, a: 7 },
                { h: direHeroes[0], k: 8,  d: 8, a: 5 },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <HeroIcon name={p.h} size={32} />
                  <div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--sans)', fontWeight: 600 }}>{HEROES[p.h]}</div>
                    <div className="mono t-2" style={{ fontSize: 10 }}>
                      <span className="t-1">{p.k}</span> / <span className="t-1">{p.d}</span> / <span className="t-1">{p.a}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn sm" onClick={(e) => e.stopPropagation()}>
              <Glyph w={11}>↻</Glyph> Reparse
            </button>
            <button className="btn primary sm" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
              Open match
              <Caret dir="right" size={4} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main interactive list view
function InteractiveListView({
  density, onDensityChange,
  heroFilter, onHeroFilterChange,
  sortBy, onSortByChange,
  expandedRows, onToggleRowExpand,
  onOpenMatch,
}) {
  const [heroFilterOpen, setHeroFilterOpen] = useStateL(false);
  const [sortOpen, setSortOpen] = useStateL(false);

  const visible = useMemoL(() => {
    let arr = [...HIFI_MATCHES];
    if (heroFilter) {
      arr = arr.filter(m => {
        const rad = heroesFor(m.id + 'r', 5);
        const dire = heroesFor(m.id + 'd', 5);
        return rad.includes(heroFilter) || dire.includes(heroFilter);
      });
    }
    if (sortBy === 'duration') arr.sort((a, b) => b.durationSec - a.durationSec);
    else if (sortBy === 'kills') arr.sort((a, b) => (b.score[0] + b.score[1]) - (a.score[0] + a.score[1]));
    // date: existing order (newest first)
    return arr;
  }, [heroFilter, sortBy]);

  return (
    <>
      <InteractiveListToolbar
        density={density} onDensityChange={onDensityChange}
        heroFilter={heroFilter} onHeroFilterChange={onHeroFilterChange}
        heroFilterOpen={heroFilterOpen} onHeroFilterOpenChange={setHeroFilterOpen}
        sortBy={sortBy} onSortByChange={onSortByChange}
        sortOpen={sortOpen} onSortOpenChange={setSortOpen}
        total={HIFI_MATCHES.length} visible={visible.length}
      />

      {visible.length === 0 ? (
        <div style={{
          padding: 80, textAlign: 'center',
          color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 13,
        }}>
          No matches with <span className="t-1" style={{ fontWeight: 700 }}>{HEROES[heroFilter]}</span> in your replays.
          <div style={{ marginTop: 12 }}>
            <button className="btn sm" onClick={() => onHeroFilterChange(null)}>Clear filter</button>
          </div>
        </div>
      ) : density === 'cards' ? (
        <div style={{ padding: '0 28px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {visible.map(m => (
            <MatchCard key={m.id} match={m} onClick={() => onOpenMatch(m.id)} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {visible.map(m => (
            <MatchRow
              key={m.id} match={m}
              expanded={expandedRows.has(m.id)}
              onToggleExpand={() => onToggleRowExpand(m.id)}
              onOpen={() => onOpenMatch(m.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

Object.assign(window, { InteractiveListView, InteractiveListToolbar });
