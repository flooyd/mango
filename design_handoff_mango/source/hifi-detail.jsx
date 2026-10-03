// Hi-fi match detail — Teams view with embedded per-row kill strip

const HIFI_RAD = [
  { hero: 'lion',         player: 'philly',       lvl: 30, k:  4, d: 6, a: 20, lh:  27, dn:  3, gold: 27950, nw:  31400, gpm: 412, xpm: 502, kp: 60, dmg: 18420 },
  { hero: 'faceless_void', player: 'Gogeta',      lvl: 30, k: 12, d: 4, a: 14, lh: 205, dn: 15, gold: 47400, nw:  52100, gpm: 712, xpm: 658, kp: 65, dmg: 38240 },
  { hero: 'silencer',     player: 'Shark Spector', lvl: 30, k:  6, d: 5, a: 16, lh: 111, dn:  2, gold: 33284, nw:  36800, gpm: 498, xpm: 552, kp: 55, dmg: 22100 },
  { hero: 'earthshaker',  player: 'm0RRA SY',     lvl: 30, k:  3, d: 9, a: 20, lh: 188, dn:  4, gold: 40460, nw:  42900, gpm: 605, xpm: 588, kp: 58, dmg: 24800 },
  { hero: 'invoker',      player: 'Tom',          lvl: 30, k:  6, d: 4, a: 18, lh: 189, dn:  9, gold: 44506, nw:  48200, gpm: 668, xpm: 642, kp: 60, dmg: 41200 },
];

const HIFI_DIRE = [
  { hero: 'bloodseeker',  player: 'Hedonist',     lvl: 26, k:  8, d: 8, a:  5, lh:  72, dn:  2, gold: 24640, nw: 26800, gpm: 380, xpm: 444, kp: 33, dmg: 21400, items: 6 },
  { hero: 'witch_doctor', player: 'Brabus_rocket', lvl: 29, k:  2, d: 6, a: 10, lh: 159, dn:  2, gold: 29976, nw: 31900, gpm: 442, xpm: 510, kp: 50, dmg: 18900, items: 4 },
  { hero: 'centaur',      player: 'BaaLoD',       lvl: 28, k:  2, d: 4, a: 17, lh: 161, dn:  0, gold: 31508, nw: 33700, gpm: 460, xpm: 488, kp: 70, dmg: 15200, items: 5 },
  { hero: 'chaos_knight', player: 'Pomcake Link', lvl: 30, k: 12, d: 5, a:  7, lh: 233, dn: 15, gold: 44256, nw: 47200, gpm: 658, xpm: 618, kp: 65, dmg: 36800, items: 6 },
  { hero: 'ogre_magi',    player: 'Anima',        lvl: 27, k:  3, d: 9, a: 14, lh:  60, dn:  0, gold: 32308, nw: 34400, gpm: 482, xpm: 472, kp: 56, dmg: 19400, items: 6, fb: true },
];

// Kill chip — hi-fi: inflictor icon + arrow + victim icon + time on hover
function HifiKillChip({ inflictor, inflictorType = 'ability', victim, time, hover }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 8px 5px 5px',
      background: hover ? 'var(--bg-4)' : 'var(--bg-2)',
      border: '1px solid ' + (hover ? 'var(--blue)' : 'var(--line)'),
      borderRadius: 4, cursor: 'pointer',
      boxShadow: hover ? '0 0 0 2px var(--blue-soft), var(--shadow-sm)' : 'none',
      transition: 'all 120ms ease',
    }}>
      {inflictorType === 'attack' ? (
        <div style={{
          width: 22, height: 16.5, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-4)', borderRadius: 2,
          fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, color: 'var(--text-3)',
          letterSpacing: '0.05em',
        }}>ATK</div>
      ) : inflictorType === 'item' ? (
        <ItemIcon name={inflictor} size={22} />
      ) : (
        <div className="heroIcon" style={{
          width: 22, height: 22, borderRadius: 2,
          backgroundImage: `url(${ABIL_BASE}${inflictor}.png)`,
          backgroundSize: 'cover',
        }}></div>
      )}
      <Caret dir="right" size={4} color="var(--text-3)" />
      <HeroIcon name={victim} size={22} />
      <span className="mono t-3" style={{ fontSize: 10, marginLeft: 2 }}>{time}</span>
    </div>
  );
}

// Per-row kill strip with a mix of inflictor types
function KillStripForHero({ heroKey, kills, hoverIdx }) {
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
        {kills.map((k, i) => (
          <HifiKillChip key={i} {...k} hover={i === hoverIdx} />
        ))}
      </div>
    </div>
  );
}

function MatchDetailHeader({ id, running }) {
  return (
    <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <button className="btn ghost sm">
          <Caret dir="right" size={4} color="currentColor" style={{ transform: 'rotate(180deg)' }} />
          <span style={{ marginLeft: 2 }}>Back</span>
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

      {/* Summary line — score, time, mode */}
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
        <span className="mono t-3" style={{ fontSize: 11, fontStyle: 'italic', marginLeft: 'auto' }}>
          Click a row to expand kills · click a kill to jump in Dota 2
        </span>
      </div>
    </div>
  );
}

function TeamHeader({ team, score, nw, towers, gpm, xpm }) {
  const isRad = team === 'radiant';
  return (
    <div className={'team-header ' + team}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <h3 className="serif" style={{
          fontSize: 18, fontWeight: 800,
          color: isRad ? 'var(--radiant)' : 'var(--dire)',
          letterSpacing: '0.08em', margin: 0,
          textTransform: 'uppercase',
        }}>{isRad ? 'Radiant' : 'Dire'}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="mono" style={{
            fontSize: 22, fontWeight: 700,
            color: isRad ? 'var(--radiant)' : 'var(--dire)',
          }}>{score}</span>
          <span className="mono t-3" style={{ fontSize: 9, letterSpacing: '0.1em' }}>KILLS</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 22 }}>
          {[['Net worth', nw], ['Towers', towers], ['GPM avg', gpm], ['XPM avg', xpm]].map(([l, v]) => (
            <div key={l}>
              <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>{l}</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerRow({ row, team, expanded, hover, onKillsHover = 4 }) {
  const isRad = team === 'radiant';
  const kpColor = row.kp >= 60 ? 'var(--radiant)' : row.kp >= 40 ? 'var(--text-1)' : 'var(--dire)';
  const items = itemsFor(row.hero, 6).slice(0, row.items != null ? row.items : 6);
  const winning = (isRad && true) || (!isRad && false); // radiant won

  // Generate plausible kills for the strip
  const killTimes = ['01:24', '04:12', '07:45', '11:03', '13:28', '15:50', '18:11', '21:34', '24:02', '26:48', '29:15', '32:40'];
  const inflictors = [
    { type: 'attack', name: null },
    { type: 'ability', name: 'invoker_sun_strike' },
    { type: 'item', name: 'dagon_5' },
    { type: 'ability', name: 'lion_finger_of_death' },
    { type: 'ability', name: 'faceless_void_chronosphere' },
    { type: 'ability', name: 'earthshaker_echo_slam' },
    { type: 'ability', name: 'chaos_knight_phantasm' },
  ];
  const victimPool = isRad
    ? ['bloodseeker', 'witch_doctor', 'centaur', 'chaos_knight', 'ogre_magi']
    : ['lion', 'faceless_void', 'silencer', 'earthshaker', 'invoker'];

  const kills = Array.from({ length: row.k }).map((_, i) => {
    const inf = inflictors[(i + row.hero.length) % inflictors.length];
    return {
      inflictor: inf.name,
      inflictorType: inf.type,
      victim: victimPool[i % victimPool.length],
      time: killTimes[i % killTimes.length],
    };
  });

  return (
    <>
      <tr className={hover ? 'hover' : (expanded ? 'expanded' : '')}>
        <td style={{ width: 220, paddingLeft: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <HeroIcon name={row.hero} size={44} />
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>
                {HEROES[row.hero]}
              </div>
              <div className="mono t-3" style={{ fontSize: 10, marginTop: 1 }}>{row.player}</div>
            </div>
          </div>
        </td>
        <td className="num" style={{ width: 38, fontWeight: 600 }}>{row.lvl}</td>
        <td style={{ width: 110, fontFamily: 'var(--mono)', fontSize: 12 }}>
          <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{row.k}</span>
          <span className="t-3"> / </span>
          <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{row.d}</span>
          <span className="t-3"> / </span>
          <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{row.a}</span>
          {row.fb && <span className="pill dire" style={{ fontSize: 8, padding: '0 4px', marginLeft: 6 }}>FB</span>}
        </td>
        <td style={{ width: 78, fontFamily: 'var(--mono)', fontSize: 12 }}>
          <span style={{ color: 'var(--text-1)' }}>{row.lh}</span>
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
          {row.items != null && row.items === 0 ? (
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
          <td colSpan={10} style={{ padding: 0, background: 'transparent' }}>
            <KillStripForHero
              heroKey={row.hero}
              kills={kills}
              hoverIdx={onKillsHover}
            />
          </td>
        </tr>
      )}
    </>
  );
}

function HifiMatchDetail({ theme = 'dark', running = true, expandedRow = 'r1', hoveredKill = 3 }) {
  // Add items to radiant
  const radWithItems = HIFI_RAD.map(r => ({ ...r, items: 6 }));

  return (
    <div className="ab" data-theme={theme}>
      <AppHeader theme={theme} running={running} />
      <MatchDetailHeader id="8716431727" running={running} />

      {/* Tabs (Teams only — Map and PiP removed) */}
      <div style={{ padding: '14px 28px 0', display: 'flex', gap: 4, alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
        {[
          { k: 'teams', label: 'Teams',         icon: '▤', active: true },
          { k: 'log',   label: 'Kill Log',      icon: '☰', active: false },
        ].map(t => (
          <div key={t.k} style={{
            padding: '10px 14px',
            fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
            color: t.active ? 'var(--text-1)' : 'var(--text-3)',
            borderBottom: '2px solid ' + (t.active ? 'var(--blue)' : 'transparent'),
            marginBottom: -1,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Glyph w={11}>{t.icon}</Glyph>
            {t.label}
          </div>
        ))}
      </div>

      {/* Radiant */}
      <div style={{ padding: '18px 28px 0' }}>
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <TeamHeader team="radiant" score="38" nw="222.4K" towers="11 / 5" gpm="579" xpm="588" />
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
              {radWithItems.map((row, i) => (
                <PlayerRow
                  key={row.hero}
                  row={row}
                  team="radiant"
                  expanded={expandedRow === ('r' + i)}
                  hover={expandedRow == null && i === 1}
                  onKillsHover={hoveredKill}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dire */}
      <div style={{ padding: '18px 28px 28px' }}>
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <TeamHeader team="dire" score="24" nw="173.6K" towers="5 / 0" gpm="484" xpm="506" />
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
              {HIFI_DIRE.map((row, i) => (
                <PlayerRow key={row.hero} row={row} team="dire" expanded={false} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HifiMatchDetail, HifiKillChip, KillStripForHero });
