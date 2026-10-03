// Interactive match detail — Teams view + Kill Log tab

const { useState: useStateD, useMemo: useMemoD } = React;

// ============================================================
// Generate a deterministic kill log for the demo match
// ============================================================
const KILL_INFLICTORS = {
  // Radiant heroes' typical kill sources
  lion:           [{ type: 'ability', name: 'lion_finger_of_death' }, { type: 'ability', name: 'lion_impale' }, { type: 'attack' }],
  faceless_void:  [{ type: 'attack' }, { type: 'ability', name: 'faceless_void_chronosphere' }, { type: 'item', name: 'mjollnir' }],
  silencer:       [{ type: 'attack' }, { type: 'ability', name: 'silencer_curse_of_the_silent' }],
  earthshaker:    [{ type: 'ability', name: 'earthshaker_echo_slam' }, { type: 'ability', name: 'earthshaker_enchant_totem' }, { type: 'attack' }],
  invoker:        [{ type: 'ability', name: 'invoker_sun_strike' }, { type: 'ability', name: 'invoker_chaos_meteor' }, { type: 'ability', name: 'invoker_tornado' }],
  // Dire
  bloodseeker:    [{ type: 'attack' }, { type: 'ability', name: 'bloodseeker_rupture' }, { type: 'ability', name: 'bloodseeker_blood_bath' }],
  witch_doctor:   [{ type: 'ability', name: 'witch_doctor_death_ward' }, { type: 'ability', name: 'witch_doctor_paralyzing_cask' }],
  centaur:        [{ type: 'attack' }, { type: 'ability', name: 'centaur_double_edge' }],
  chaos_knight:   [{ type: 'attack' }, { type: 'ability', name: 'chaos_knight_reality_rift' }, { type: 'ability', name: 'chaos_knight_phantasm' }],
  ogre_magi:      [{ type: 'ability', name: 'ogre_magi_fireblast' }, { type: 'ability', name: 'ogre_magi_ignite' }, { type: 'item', name: 'aghanims_scepter' }],
};

const RADIANT_HEROES = ['lion', 'faceless_void', 'silencer', 'earthshaker', 'invoker'];
const DIRE_HEROES    = ['bloodseeker', 'witch_doctor', 'centaur', 'chaos_knight', 'ogre_magi'];

// Per-hero kill counts (from HIFI_RAD / HIFI_DIRE in hifi-detail.jsx)
const HERO_KILL_COUNTS = {
  lion: 4, faceless_void: 12, silencer: 6, earthshaker: 3, invoker: 6,
  bloodseeker: 8, witch_doctor: 2, centaur: 2, chaos_knight: 12, ogre_magi: 3,
};

function generateKillLog() {
  const log = [];
  let h = 0xCAFEBABE;
  const rand = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 0x100000000; };

  for (const killer of [...RADIANT_HEROES, ...DIRE_HEROES]) {
    const count = HERO_KILL_COUNTS[killer];
    const isRad = RADIANT_HEROES.includes(killer);
    const victimPool = isRad ? DIRE_HEROES : RADIANT_HEROES;
    const sources = KILL_INFLICTORS[killer];

    for (let i = 0; i < count; i++) {
      const t = Math.floor(60 + rand() * (41 * 60 - 60)); // 1:00–41:00
      const inf = sources[Math.floor(rand() * sources.length)];
      log.push({
        timeSec: t,
        killer,
        victim: victimPool[Math.floor(rand() * victimPool.length)],
        inflictor: inf.name || null,
        inflictorType: inf.type,
        side: isRad ? 'rad' : 'dire',
        tick: t * 30 + Math.floor(rand() * 30),
      });
    }
  }

  log.sort((a, b) => a.timeSec - b.timeSec);
  // First blood = first entry
  if (log[0]) log[0].firstBlood = true;
  return log.map((k, i) => ({ ...k, n: i + 1 }));
}

const KILL_LOG = generateKillLog();

function fmtTime(sec) {
  const m = Math.floor(sec / 60); const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ============================================================
// Tabs
// ============================================================
function MatchTabs({ active, onChange }) {
  return (
    <div style={{ padding: '14px 28px 0', display: 'flex', gap: 4, alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
      {[
        { k: 'teams', label: 'Teams',    icon: '▤', count: null },
        { k: 'log',   label: 'Kill Log', icon: '☰', count: KILL_LOG.length },
      ].map(t => (
        <div key={t.k}
          onClick={() => onChange(t.k)}
          style={{
            padding: '10px 14px',
            fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
            color: active === t.k ? 'var(--text-1)' : 'var(--text-3)',
            borderBottom: '2px solid ' + (active === t.k ? 'var(--blue)' : 'transparent'),
            marginBottom: -1,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 120ms ease',
          }}>
          <Glyph w={11}>{t.icon}</Glyph>
          {t.label}
          {t.count != null && (
            <span className="mono" style={{
              fontSize: 10, padding: '1px 6px',
              background: active === t.k ? 'var(--blue-soft)' : 'var(--bg-3)',
              color: active === t.k ? 'var(--blue)' : 'var(--text-3)',
              borderRadius: 10,
              fontWeight: 700,
            }}>{t.count}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Match header (interactive back button)
// ============================================================
function MatchHeader({ id, running, onBack }) {
  return (
    <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
        <button className="btn ghost sm" onClick={onBack}>
          <span style={{ display: 'inline-block', transform: 'rotate(180deg)', marginRight: 4 }}>
            <Caret dir="right" size={4} />
          </span>
          Back to replays
        </button>
        <div style={{ width: 1, height: 18, background: 'var(--line-strong)' }}></div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Match</h2>
        <span className="pill blue" style={{ fontSize: 12, padding: '4px 10px', fontWeight: 700 }}>{id}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn sm">
            <Glyph w={11}>↻</Glyph> Reparse
          </button>
          {running && (
            <button className="btn primary sm">
              Open in Dota 2
              <Caret dir="right" size={4} color="white" />
            </button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <VictoryLabel winner="radiant" size={13} />
          <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--radiant)' }}>38</span>
          <span className="mono t-3" style={{ fontSize: 18 }}>–</span>
          <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-2)' }}>24</span>
        </div>
        <div style={{ width: 1, height: 22, background: 'var(--line-strong)' }}></div>
        <span className="pill blue" style={{ fontSize: 11, padding: '4px 8px' }}>41:27</span>
        <span className="pill bare" style={{ fontSize: 11, padding: '4px 8px' }}>Ranked AP</span>
        <span className="pill bare" style={{ fontSize: 11, padding: '4px 8px' }}>
          <span className="t-3" style={{ marginRight: 4 }}>FB</span>01:18
        </span>
        <span className="mono t-3" style={{ fontSize: 11 }}>Ended 03-05-2026 03:21:35 AM</span>
      </div>
    </div>
  );
}

// ============================================================
// Interactive player row
// ============================================================
function InteractivePlayerRow({ row, team, expanded, onToggle }) {
  const isRad = team === 'radiant';
  const kpColor = row.kp >= 60 ? 'var(--radiant)' : row.kp >= 40 ? 'var(--text-1)' : 'var(--dire)';
  const items = useMemoD(() => itemsFor(row.hero, 6).slice(0, row.items != null ? row.items : 6), [row.hero, row.items]);
  const heroKills = useMemoD(
    () => KILL_LOG.filter(k => k.killer === row.hero),
    [row.hero]
  );

  return (
    <>
      <tr onClick={onToggle} className={expanded ? 'expanded' : ''}>
        <td style={{ width: 220, paddingLeft: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <HeroIcon name={row.hero} size={44} />
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13 }}>{HEROES[row.hero]}</div>
              <div className="mono t-3" style={{ fontSize: 10, marginTop: 1 }}>{row.player}</div>
            </div>
          </div>
        </td>
        <td className="num" style={{ width: 38, fontWeight: 600 }}>{row.lvl}</td>
        <td style={{ width: 110, fontFamily: 'var(--mono)', fontSize: 12 }}>
          <span style={{ fontWeight: 600 }}>{row.k}</span>
          <span className="t-3"> / </span>
          <span style={{ fontWeight: 600 }}>{row.d}</span>
          <span className="t-3"> / </span>
          <span style={{ fontWeight: 600 }}>{row.a}</span>
          {row.fb && <span className="pill dire" style={{ fontSize: 8, padding: '0 4px', marginLeft: 6 }}>FB</span>}
        </td>
        <td style={{ width: 78, fontFamily: 'var(--mono)', fontSize: 12 }}>
          <span>{row.lh}</span>
          <span className="t-3"> / </span>
          <span className="t-3">{row.dn}</span>
        </td>
        <td className="num" style={{ width: 60 }}>{row.gpm}</td>
        <td className="num" style={{ width: 60 }}>{row.xpm}</td>
        <td className="num" style={{ width: 80, fontWeight: 600 }}>{row.nw.toLocaleString()}</td>
        <td style={{ width: 110 }}>
          <KpBar value={row.kp} color={kpColor} />
        </td>
        <td>
          {row.items === 0 ? (
            <span className="mono t-3" style={{ fontSize: 10, fontStyle: 'italic' }}>no items</span>
          ) : (
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: 6 }).map((_, i) =>
                items[i]
                  ? <ItemIcon key={i} name={items[i]} size={24} />
                  : <div key={i} className="itemSlotEmpty" style={{ width: 24, height: 18 }}></div>
              )}
            </div>
          )}
        </td>
        <td style={{ width: 22, paddingRight: 18 }}>
          <Caret dir={expanded ? 'up' : 'down'} size={5} color="var(--text-3)" />
        </td>
      </tr>
      {expanded && (
        <tr className="expanded">
          <td colSpan={10} style={{ padding: 0 }}>
            <KillStrip kills={heroKills} />
          </td>
        </tr>
      )}
    </>
  );
}

// Hover-aware kill chip
function KillChip({ kill }) {
  const [hover, setHover] = useStateD(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Click to jump in Dota 2"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 8px 5px 5px',
        background: hover ? 'var(--bg-4)' : 'var(--bg-2)',
        border: '1px solid ' + (hover ? 'var(--blue)' : 'var(--line)'),
        borderRadius: 4, cursor: 'pointer',
        boxShadow: hover ? '0 0 0 2px var(--blue-soft), var(--shadow-sm)' : 'none',
        transition: 'all 120ms ease',
      }}>
      {kill.inflictorType === 'attack' ? (
        <div style={{
          width: 22, height: 16.5, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-4)', borderRadius: 2,
          fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, color: 'var(--text-3)',
        }}>ATK</div>
      ) : kill.inflictorType === 'item' ? (
        <ItemIcon name={kill.inflictor} size={22} />
      ) : (
        <div className="heroIcon" style={{
          width: 22, height: 22, borderRadius: 2,
          backgroundImage: `url(${ABIL_BASE}${kill.inflictor}.png)`,
          backgroundSize: 'cover',
        }}></div>
      )}
      <Caret dir="right" size={4} color="var(--text-3)" />
      <HeroIcon name={kill.victim} size={22} />
      <span className="mono t-3" style={{ fontSize: 10, marginLeft: 2 }}>{fmtTime(kill.timeSec)}</span>
    </div>
  );
}

function KillStrip({ kills }) {
  return (
    <div style={{
      padding: '12px 18px 14px 92px',
      background: 'var(--bg-3)',
      borderTop: '1px solid var(--line)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span className="label" style={{ fontSize: 9 }}>Kills · {kills.length}</span>
        <span className="mono t-3" style={{ fontSize: 10 }}>Click any kill to jump in Dota 2 →</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {kills.map(k => <KillChip key={k.n} kill={k} />)}
      </div>
    </div>
  );
}

// ============================================================
// Teams view
// ============================================================
function TeamHeader({ team, score, nw, towers, gpm, xpm }) {
  const isRad = team === 'radiant';
  return (
    <div className={'team-header ' + team}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <h3 className="serif" style={{
          fontSize: 18, fontWeight: 800,
          color: isRad ? 'var(--radiant)' : 'var(--dire)',
          letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase',
        }}>{isRad ? 'Radiant' : 'Dire'}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="mono" style={{
            fontSize: 22, fontWeight: 700,
            color: isRad ? 'var(--radiant)' : 'var(--dire)',
          }}>{score}</span>
          <span className="mono t-3" style={{ fontSize: 9, letterSpacing: '0.1em' }}>KILLS</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {[['Net worth', nw], ['Towers', towers], ['GPM avg', gpm], ['XPM avg', xpm]].map(([l, v]) => (
            <div key={l}>
              <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>{l}</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamTable({ team, rows, expanded, onToggle }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th style={{ paddingLeft: 18 }}>Hero</th>
          <th className="num">LVL</th>
          <th>K / D / A</th>
          <th>LH / DN</th>
          <th className="num">GPM</th>
          <th className="num">XPM</th>
          <th className="num">Net W.</th>
          <th>KP %</th>
          <th>Items</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <InteractivePlayerRow
            key={row.hero}
            row={row}
            team={team}
            expanded={expanded.has(row.hero)}
            onToggle={() => onToggle(row.hero)}
          />
        ))}
      </tbody>
    </table>
  );
}

function TeamsView({ expanded, onToggle }) {
  const radWithItems = HIFI_RAD.map(r => ({ ...r, items: 6 }));
  return (
    <>
      <div style={{ padding: '18px 28px 0' }}>
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <TeamHeader team="radiant" score="38" nw="222.4K" towers="11 / 5" gpm="579" xpm="588" />
          <TeamTable team="radiant" rows={radWithItems} expanded={expanded} onToggle={onToggle} />
        </div>
      </div>
      <div style={{ padding: '18px 28px 28px' }}>
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <TeamHeader team="dire" score="24" nw="173.6K" towers="5 / 0" gpm="484" xpm="506" />
          <TeamTable team="dire" rows={HIFI_DIRE} expanded={expanded} onToggle={onToggle} />
        </div>
      </div>
    </>
  );
}

// ============================================================
// Kill Log view
// ============================================================
function KillLogView() {
  const [side, setSide]                 = useStateD('both');
  const [killer, setKiller]             = useStateD(null);
  const [victim, setVictim]             = useStateD(null);
  const [inflictorType, setInflictorType] = useStateD('any');
  const [killerOpen, setKillerOpen]     = useStateD(false);
  const [victimOpen, setVictimOpen]     = useStateD(false);
  const [sortCol, setSortCol]           = useStateD('time');
  const [sortDir, setSortDir]           = useStateD('asc');

  const filtered = useMemoD(() => {
    let arr = [...KILL_LOG];
    if (side !== 'both') arr = arr.filter(k => k.side === side);
    if (killer)          arr = arr.filter(k => k.killer === killer);
    if (victim)          arr = arr.filter(k => k.victim === victim);
    if (inflictorType !== 'any') arr = arr.filter(k => k.inflictorType === inflictorType);

    arr.sort((a, b) => {
      let cmp = 0;
      if      (sortCol === 'time')   cmp = a.timeSec - b.timeSec;
      else if (sortCol === 'killer') cmp = a.killer.localeCompare(b.killer);
      else if (sortCol === 'victim') cmp = a.victim.localeCompare(b.victim);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [side, killer, victim, inflictorType, sortCol, sortDir]);

  const sortBy = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const heroOptions = [...RADIANT_HEROES, ...DIRE_HEROES];

  return (
    <div style={{ padding: '18px 28px 28px' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Filter bar */}
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid var(--line)',
          display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
        }}>
          {/* Side filter */}
          <div style={{ display: 'inline-flex', background: 'var(--bg-3)', border: '1px solid var(--line-strong)', borderRadius: 4, padding: 2 }}>
            {[
              { v: 'both', l: 'Both' },
              { v: 'rad',  l: 'Radiant', cls: 't-rad' },
              { v: 'dire', l: 'Dire', cls: 't-dire' },
            ].map(o => (
              <div key={o.v}
                onClick={() => setSide(o.v)}
                className={side === o.v ? '' : o.cls}
                style={{
                  padding: '4px 10px', borderRadius: 3, cursor: 'pointer',
                  background: side === o.v ? 'var(--bg-5)' : 'transparent',
                  color: side === o.v
                    ? (o.v === 'rad' ? 'var(--radiant)' : o.v === 'dire' ? 'var(--dire)' : 'var(--text-1)')
                    : 'var(--text-3)',
                  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em',
                  fontWeight: 600,
                }}>{o.l}</div>
            ))}
          </div>

          {/* Killer filter */}
          <HeroDropdown
            label="Killer" selected={killer} onSelect={setKiller}
            open={killerOpen} onOpenChange={setKillerOpen}
            options={heroOptions}
          />
          {/* Victim filter */}
          <HeroDropdown
            label="Victim" selected={victim} onSelect={setVictim}
            open={victimOpen} onOpenChange={setVictimOpen}
            options={heroOptions}
          />

          {/* Inflictor type */}
          <div style={{ display: 'inline-flex', background: 'var(--bg-3)', border: '1px solid var(--line-strong)', borderRadius: 4, padding: 2 }}>
            {[
              { v: 'any',     l: 'Any' },
              { v: 'attack',  l: 'Attack' },
              { v: 'ability', l: 'Ability' },
              { v: 'item',    l: 'Item' },
            ].map(o => (
              <div key={o.v}
                onClick={() => setInflictorType(o.v)}
                style={{
                  padding: '4px 10px', borderRadius: 3, cursor: 'pointer',
                  background: inflictorType === o.v ? 'var(--bg-5)' : 'transparent',
                  color: inflictorType === o.v ? 'var(--text-1)' : 'var(--text-3)',
                  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em', fontWeight: 600,
                }}>{o.l}</div>
            ))}
          </div>

          <span className="mono t-3" style={{ fontSize: 11, marginLeft: 'auto' }}>
            {filtered.length} of {KILL_LOG.length} kills
          </span>
          {(killer || victim || side !== 'both' || inflictorType !== 'any') && (
            <button className="btn ghost sm" onClick={() => {
              setKiller(null); setVictim(null); setSide('both'); setInflictorType('any');
            }}>Clear filters</button>
          )}
        </div>

        {/* Table */}
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 44, paddingLeft: 18 }}>#</th>
              <th onClick={() => sortBy('time')} style={{ cursor: 'pointer', width: 80 }}>
                Time {sortCol === 'time' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => sortBy('killer')} style={{ cursor: 'pointer' }}>
                Killer {sortCol === 'killer' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ width: 28 }}></th>
              <th onClick={() => sortBy('victim')} style={{ cursor: 'pointer' }}>
                Victim {sortCol === 'victim' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th>Inflictor</th>
              <th style={{ width: 64 }}>Side</th>
              <th style={{ width: 100 }} className="num">Tick</th>
              <th style={{ width: 80, textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 12 }}>
                  No kills match these filters.
                </td>
              </tr>
            )}
            {filtered.map(k => (
              <KillLogRow key={k.n} kill={k} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HeroDropdown({ label, selected, onSelect, open, onOpenChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => onOpenChange(!open)}
        className="pill" style={{
          padding: '4px 9px 4px 6px', gap: 6, background: 'var(--bg-3)', cursor: 'pointer',
          borderColor: open || selected ? 'var(--blue)' : 'var(--line-strong)',
          height: 28,
        }}>
        {selected && <HeroIcon name={selected} size={18} />}
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{label.toUpperCase()}</span>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-1)', fontWeight: 600 }}>
          {selected ? HEROES[selected] : 'Any'}
        </span>
        {selected && (
          <span onClick={(e) => { e.stopPropagation(); onSelect(null); }}
            style={{ marginLeft: 2, color: 'var(--text-3)', fontSize: 11 }}>✕</span>
        )}
        <Caret dir={open ? 'up' : 'down'} size={4} color="var(--text-3)" />
      </div>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 7 }} onClick={() => onOpenChange(false)}></div>
          <div style={{
            position: 'absolute', top: 32, left: 0, width: 220,
            background: 'var(--bg-3)', border: '1px solid var(--line-strong)',
            borderRadius: 5, boxShadow: 'var(--shadow-lg)', padding: 4, zIndex: 8,
            maxHeight: 280, overflowY: 'auto',
          }}>
            {options.map(h => (
              <div key={h}
                onClick={() => { onSelect(h); onOpenChange(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 3, cursor: 'pointer',
                  background: selected === h ? 'var(--bg-4)' : 'transparent',
                }}>
                <HeroIcon name={h} size={22} />
                <span style={{ fontFamily: 'var(--sans)', fontSize: 12 }}>{HEROES[h]}</span>
                {RADIANT_HEROES.includes(h)
                  ? <span className="pill rad" style={{ fontSize: 8, padding: '0 5px', marginLeft: 'auto' }}>R</span>
                  : <span className="pill dire" style={{ fontSize: 8, padding: '0 5px', marginLeft: 'auto' }}>D</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function KillLogRow({ kill }) {
  const [hover, setHover] = useStateD(false);
  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: 'pointer' }}>
      <td className="t-3" style={{ paddingLeft: 18 }}>{String(kill.n).padStart(2, '0')}</td>
      <td style={{ fontWeight: 700 }}>{fmtTime(kill.timeSec)}</td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeroIcon name={kill.killer} size={26} />
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12 }}>{HEROES[kill.killer]}</span>
          {kill.firstBlood && <span className="pill dire" style={{ fontSize: 8, padding: '0 4px', marginLeft: 4 }}>FIRST BLOOD</span>}
        </div>
      </td>
      <td className="t-3">→</td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeroIcon name={kill.victim} size={26} />
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12 }}>{HEROES[kill.victim]}</span>
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {kill.inflictorType === 'attack' ? (
            <div style={{
              width: 22, height: 16.5, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-4)', borderRadius: 2,
              fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, color: 'var(--text-3)',
            }}>ATK</div>
          ) : kill.inflictorType === 'item' ? (
            <ItemIcon name={kill.inflictor} size={22} />
          ) : (
            <div className="heroIcon" style={{
              width: 22, height: 22, borderRadius: 2,
              backgroundImage: `url(${ABIL_BASE}${kill.inflictor}.png)`,
              backgroundSize: 'cover',
            }}></div>
          )}
          <span className="mono t-2" style={{ fontSize: 10 }}>
            {kill.inflictorType === 'attack' ? 'basic attack' : (kill.inflictor || '').replace(/_/g, ' ')}
          </span>
        </div>
      </td>
      <td>
        <span className={'pill ' + (kill.side === 'rad' ? 'rad' : 'dire')} style={{ fontSize: 9, padding: '1px 5px' }}>
          {kill.side === 'rad' ? 'RAD' : 'DIRE'}
        </span>
      </td>
      <td className="num t-3">{kill.tick.toLocaleString()}</td>
      <td style={{ textAlign: 'right', paddingRight: 18 }}>
        <span className="mono" style={{
          fontSize: 10, color: hover ? 'var(--blue)' : 'var(--text-3)',
          opacity: hover ? 1 : 0.6,
          fontWeight: 700,
        }}>
          JUMP →
        </span>
      </td>
    </tr>
  );
}

// ============================================================
// Main interactive detail view
// ============================================================
function InteractiveDetailView({ matchId, running, onBack }) {
  const [tab, setTab] = useStateD('teams');
  const [expanded, setExpanded] = useStateD(new Set());

  const toggleExpand = (heroKey) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(heroKey)) next.delete(heroKey);
      else next.add(heroKey);
      return next;
    });
  };

  return (
    <>
      <MatchHeader id={matchId} running={running} onBack={onBack} />
      <MatchTabs active={tab} onChange={setTab} />
      {tab === 'teams' && <TeamsView expanded={expanded} onToggle={toggleExpand} />}
      {tab === 'log'   && <KillLogView />}
    </>
  );
}

Object.assign(window, { InteractiveDetailView, KILL_LOG });
