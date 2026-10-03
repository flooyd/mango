// Hi-fi primitives — real Steam CDN assets

const HERO_BASE  = 'https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/';
const ICON_BASE  = 'https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/icons/';
const ITEM_BASE  = 'https://steamcdn-a.akamaihd.net/apps/dota2/images/items/';
const ABIL_BASE  = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/';

// Hero key (matches the `npc_dota_hero_<key>` slug Valve uses)
const HEROES = {
  // Mock match teams
  lion:          'Lion',
  faceless_void: 'Faceless Void',
  silencer:      'Silencer',
  earthshaker:   'Earthshaker',
  invoker:       'Invoker',
  bloodseeker:   'Bloodseeker',
  witch_doctor:  'Witch Doctor',
  centaur:       'Centaur Warrunner',
  chaos_knight:  'Chaos Knight',
  ogre_magi:     'Ogre Magi',
  // Extras for matches-list lineups
  pudge:         'Pudge',
  juggernaut:    'Juggernaut',
  drow_ranger:   'Drow Ranger',
  shadow_fiend:  'Shadow Fiend',
  crystal_maiden:'Crystal Maiden',
  axe:           'Axe',
  riki:          'Riki',
  templar_assassin: 'Templar Assassin',
  legion_commander: 'Legion Commander',
  morphling:     'Morphling',
  storm_spirit:  'Storm Spirit',
  ember_spirit:  'Ember Spirit',
  void_spirit:   'Void Spirit',
  enigma:        'Enigma',
  techies:       'Techies',
  zuus:          'Zeus',
  rubick:        'Rubick',
  sniper:        'Sniper',
  weaver:        'Weaver',
  windrunner:    'Windranger',
  tinker:        'Tinker',
  io:            'Io',
  mirana:        'Mirana',
  snapfire:      'Snapfire',
  phoenix:       'Phoenix',
  dark_seer:     'Dark Seer',
  monkey_king:   'Monkey King',
  pangolier:     'Pangolier',
  marci:         'Marci',
  dawnbreaker:   'Dawnbreaker',
};

const ITEMS = [
  'blink', 'black_king_bar', 'aghanims_scepter', 'butterfly', 'manta',
  'mjollnir', 'daedalus', 'scythe_of_vyse', 'refresher', 'force_staff',
  'octarine_core', 'cyclone', 'aether_lens', 'mekansm', 'pipe', 'shivas_guard',
  'satanic', 'heart', 'radiance', 'sange_yasha', 'vladmir', 'travel_boots',
  'phase_boots', 'power_treads', 'arcane_boots', 'guardian_greaves',
  'bloodthorn', 'silver_edge', 'desolator', 'monkey_king_bar',
  'crimson_guard', 'hand_of_midas', 'assault', 'abyssal_blade',
];

// Pick N deterministic items based on a key (so each hero gets consistent items)
function itemsFor(key, count = 6) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const picks = [];
  const pool = [...ITEMS];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = h % pool.length;
    picks.push(pool.splice(idx, 1)[0]);
    h = (h * 1103515245 + 12345) >>> 0;
  }
  return picks;
}

// Pick N deterministic heroes for a team lineup
function heroesFor(seed, count = 5) {
  const keys = Object.keys(HEROES);
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const picks = [];
  const pool = [...keys];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = h % pool.length;
    picks.push(pool.splice(idx, 1)[0]);
    h = (h * 1103515245 + 12345) >>> 0;
  }
  return picks;
}

// ---------- Atom components ----------

function HeroIcon({ name = 'lion', size = 32, square = false }) {
  return (
    <div className="heroIcon" title={HEROES[name] || name} style={{
      width: size, height: size,
      backgroundImage: `url(${ICON_BASE}${name}.png)`,
      borderRadius: square ? 3 : 3,
    }}></div>
  );
}

function HeroPortrait({ name = 'lion', width = 70 }) {
  return (
    <div className="heroPortrait" title={HEROES[name] || name} style={{
      width,
      backgroundImage: `url(${HERO_BASE}${name}.png)`,
    }}></div>
  );
}

function ItemIcon({ name, size = 26 }) {
  if (!name) return <div className="itemSlotEmpty" style={{ width: size, height: size * 0.75 }}></div>;
  return (
    <div className="itemIcon" title={name} style={{
      width: size,
      backgroundImage: `url(${ITEM_BASE}${name}_lg.png)`,
    }}></div>
  );
}

function ItemRow({ items = [], slots = 6, size = 26, gap = 4 }) {
  const filled = [...items];
  while (filled.length < slots) filled.push(null);
  return (
    <div style={{ display: 'flex', gap }}>
      {filled.slice(0, slots).map((it, i) => <ItemIcon key={i} name={it} size={size} />)}
    </div>
  );
}

function HeroLineup({ heroes, heroW = 36, vs = true, opponent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {heroes.slice(0, 5).map((h, i) => <HeroIcon key={i} name={h} size={heroW} />)}
      </div>
      {vs && (
        <span className="mono t-3" style={{ fontSize: 9, letterSpacing: '0.15em', padding: '0 2px' }}>VS</span>
      )}
      {opponent && (
        <div style={{ display: 'flex', gap: 3 }}>
          {opponent.slice(0, 5).map((h, i) => <HeroIcon key={i} name={h} size={heroW} />)}
        </div>
      )}
    </div>
  );
}

// Caret arrow
function Caret({ dir = 'down', size = 6, color }) {
  const transforms = { down: 'rotate(45deg)', up: 'rotate(-135deg)', right: 'rotate(-45deg)' };
  return <span style={{
    display: 'inline-block',
    width: size, height: size,
    borderRight: '1.5px solid ' + (color || 'currentColor'),
    borderBottom: '1.5px solid ' + (color || 'currentColor'),
    transform: transforms[dir],
    marginBottom: dir === 'down' ? 2 : 0,
  }}></span>;
}

// Iconlet (inline SVG-free) - bordered circle with a single char
function Glyph({ children, w = 14, color }) {
  return <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: w, height: w,
    color: color || 'currentColor',
    fontSize: w * 0.78, fontFamily: 'var(--mono)', lineHeight: 1,
  }}>{children}</span>;
}

// Theme toggle
function ThemeToggle({ theme = 'dark' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      background: 'var(--bg-3)', border: '1px solid var(--line-strong)',
      borderRadius: 4, padding: 2,
    }}>
      {['LIGHT', 'DARK'].map((t) => {
        const active = (t === 'DARK') === (theme === 'dark');
        return (
          <div key={t} style={{
            padding: '4px 9px', borderRadius: 3,
            background: active ? 'var(--bg-5)' : 'transparent',
            color: active ? 'var(--text-1)' : 'var(--text-3)',
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em',
            fontWeight: 600,
            transition: 'all 150ms ease',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Glyph w={9} color="currentColor">{t === 'LIGHT' ? '☀' : '☾'}</Glyph>
            {t}
          </div>
        );
      })}
    </div>
  );
}

// Profile chip in header (avatar + name + caret)
function ProfileChip({ name = 'philly', avatar = 'lion', open = false }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '4px 10px 4px 4px',
      background: open ? 'var(--bg-4)' : 'transparent',
      border: '1px solid ' + (open ? 'var(--line-strong)' : 'transparent'),
      borderRadius: 4, cursor: 'pointer',
      transition: 'all 150ms ease',
    }}>
      <HeroIcon name={avatar} size={28} />
      <span className="mono" style={{ fontSize: 11, color: 'var(--text-1)', fontWeight: 600 }}>{name}</span>
      <Caret dir={open ? 'up' : 'down'} size={5} color="var(--text-3)" />
    </div>
  );
}

// App header
function AppHeader({ running = false, runningContext = 'In Menu', theme = 'dark', profileOpen = false }) {
  return (
    <div className="appHeader">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div className="brand">Dota Replays</div>
        <span className="mono t-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>v 0.4.2</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className={'status ' + (running ? 'running' : '')}>
          <span className="dot"></span>
          <span>{running ? 'Dota 2 running · ' + runningContext : 'Dota 2 not running'}</span>
        </div>
        {running && <button className="btn sm">Bring to top</button>}
        <div style={{ width: 1, height: 18, background: 'var(--line-strong)' }}></div>
        <ThemeToggle theme={theme} />
        <ProfileChip open={profileOpen} />
      </div>
    </div>
  );
}

// Net worth bar — Radiant vs Dire
function NetWorthBar({ rad, dire, height = 5 }) {
  return (
    <div className="bar" style={{ height }}>
      <div style={{ width: (rad / (rad + dire) * 100) + '%', background: 'var(--radiant)' }}></div>
      <div style={{ width: (dire / (rad + dire) * 100) + '%', background: 'var(--dire)' }}></div>
    </div>
  );
}

// KP progress bar
function KpBar({ value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="bar" style={{ flex: 1, height: 4 }}>
        <div style={{ width: value + '%', background: color }}></div>
      </div>
      <span className="mono" style={{ fontSize: 11, color, width: 32, textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

function VictoryLabel({ winner, size = 12 }) {
  const isRad = winner === 'radiant';
  return (
    <span className={isRad ? 't-rad' : 't-dire'} style={{
      fontFamily: 'var(--mono)', fontWeight: 700, fontSize: size,
      letterSpacing: '0.16em', textTransform: 'uppercase',
    }}>
      {isRad ? 'RADIANT VICTORY' : 'DIRE VICTORY'}
    </span>
  );
}

Object.assign(window, {
  HERO_BASE, ICON_BASE, ITEM_BASE, HEROES, ITEMS, itemsFor, heroesFor,
  HeroIcon, HeroPortrait, ItemIcon, ItemRow, HeroLineup,
  Caret, Glyph, ThemeToggle, ProfileChip, AppHeader,
  NetWorthBar, KpBar, VictoryLabel,
});
