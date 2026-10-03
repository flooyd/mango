// Interactive app — root with state, routing, theme, header

const { useState: useStateA, useEffect: useEffectA } = React;

// Persist a value in localStorage
function useLocalState(key, initial) {
  const [v, setV] = useStateA(() => {
    try {
      const stored = localStorage.getItem('mango.' + key);
      return stored != null ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  useEffectA(() => {
    try { localStorage.setItem('mango.' + key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV];
}

// Hash routing: # → list, #match/<id> → match detail
function useHashRoute() {
  const parse = (h) => {
    const clean = (h || '').replace(/^#/, '');
    if (clean.startsWith('match/')) return { name: 'match', id: clean.slice(6) };
    return { name: 'list' };
  };
  const [route, setRoute] = useStateA(() => parse(location.hash));
  useEffectA(() => {
    const handler = () => setRoute(parse(location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const navigate = (next) => {
    if (next.name === 'list') location.hash = '';
    else if (next.name === 'match') location.hash = 'match/' + next.id;
  };
  return [route, navigate];
}

// Interactive theme toggle
function InteractiveThemeToggle({ theme, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      background: 'var(--bg-3)', border: '1px solid var(--line-strong)',
      borderRadius: 4, padding: 2,
    }}>
      {['LIGHT', 'DARK'].map(t => {
        const active = (t === 'DARK') === (theme === 'dark');
        return (
          <div key={t}
            onClick={() => onChange(t === 'DARK' ? 'dark' : 'light')}
            style={{
              padding: '4px 9px', borderRadius: 3, cursor: 'pointer',
              background: active ? 'var(--bg-5)' : 'transparent',
              color: active ? 'var(--text-1)' : 'var(--text-3)',
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em', fontWeight: 600,
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

// Interactive profile chip + dropdown
function InteractiveProfile({ theme, onThemeChange }) {
  const [open, setOpen] = useStateA(false);
  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 10px 4px 4px',
          background: open ? 'var(--bg-4)' : 'transparent',
          border: '1px solid ' + (open ? 'var(--line-strong)' : 'transparent'),
          borderRadius: 4, cursor: 'pointer',
          transition: 'all 150ms ease',
        }}>
        <HeroIcon name="lion" size={28} />
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-1)', fontWeight: 600 }}>philly</span>
        <Caret dir={open ? 'up' : 'down'} size={5} color="var(--text-3)" />
      </div>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 7 }} onClick={() => setOpen(false)}></div>
          <div style={{
            position: 'absolute', top: 40, right: 0,
            width: 232, background: 'var(--bg-3)',
            border: '1px solid var(--line-strong)', borderRadius: 6,
            boxShadow: 'var(--shadow-lg)', padding: 6, zIndex: 10,
          }}>
            <div style={{
              display: 'flex', gap: 10, padding: '8px 8px 10px',
              borderBottom: '1px solid var(--line)',
            }}>
              <HeroIcon name="lion" size={36} />
              <div>
                <div className="mono t-1" style={{ fontSize: 12, fontWeight: 700 }}>philly</div>
                <div className="mono t-3" style={{ fontSize: 10 }}>76561198000…</div>
              </div>
            </div>
            <div
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 8px', borderRadius: 3, cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-4)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <Glyph w={14} color="var(--text-2)">{theme === 'dark' ? '☾' : '☀'}</Glyph>
              <span className="t-1" style={{ fontSize: 12, flex: 1 }}>Theme</span>
              <span className="mono t-3" style={{ fontSize: 10 }}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </div>
            {[
              { icon: '⚙', label: 'Settings' },
              { icon: '↻', label: 'Reparse all replays' },
              { icon: '⌂', label: 'Replay folder…' },
              { icon: '?', label: 'Help & shortcuts' },
            ].map((item, i) => (
              <div key={i}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-4)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 8px', borderRadius: 3, cursor: 'pointer',
                  transition: 'background 120ms ease',
                }}>
                <Glyph w={14} color="var(--text-2)">{item.icon}</Glyph>
                <span className="t-1" style={{ fontSize: 12 }}>{item.label}</span>
              </div>
            ))}
            <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--line)' }}>
              <div
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-4)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 8px', borderRadius: 3, cursor: 'pointer',
                  transition: 'background 120ms ease',
                }}>
                <Glyph w={14} color="var(--dire)">⎋</Glyph>
                <span style={{ fontSize: 12, color: 'var(--dire)', fontWeight: 600 }}>Log out</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Interactive header
function InteractiveHeader({ theme, onThemeChange, running, runningContext = 'In Menu' }) {
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
        <InteractiveThemeToggle theme={theme} onChange={onThemeChange} />
        <InteractiveProfile theme={theme} onThemeChange={onThemeChange} />
      </div>
    </div>
  );
}

// ============================================================
// App root
// ============================================================
function App() {
  const [theme, setTheme]                   = useLocalState('theme', 'dark');
  const [density, setDensity]               = useLocalState('density', 'cards');
  const [heroFilter, setHeroFilter]         = useStateA(null);
  const [sortBy, setSortBy]                 = useLocalState('sortBy', 'date');
  const [expandedRows, setExpandedRows]     = useStateA(new Set());
  const [route, navigate]                   = useHashRoute();

  // Sync data-theme on root for the artboard styles
  useEffectA(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const running = true; // For the prototype, assume Dota 2 is running so users see live state

  return (
    <div className="ab" data-theme={theme} style={{ minHeight: '100vh', height: 'auto', overflow: 'visible' }}>
      <InteractiveHeader
        theme={theme}
        onThemeChange={setTheme}
        running={running}
        runningContext={route.name === 'match' ? 'Watching Replay' : 'In Menu'}
      />
      {route.name === 'list' && (
        <InteractiveListView
          density={density} onDensityChange={setDensity}
          heroFilter={heroFilter} onHeroFilterChange={setHeroFilter}
          sortBy={sortBy} onSortByChange={setSortBy}
          expandedRows={expandedRows} onToggleRowExpand={toggleRowExpand}
          onOpenMatch={(id) => navigate({ name: 'match', id })}
        />
      )}
      {route.name === 'match' && (
        <InteractiveDetailView
          matchId={route.id}
          running={running}
          onBack={() => navigate({ name: 'list' })}
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
