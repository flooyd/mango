// Hi-fi: header system + empty state + indeterminate loading (no progress bar)

// =============================================================
// Header system — variants and atoms (rank removed per feedback)
// =============================================================
function HifiHeaderSystem({ theme = 'dark' }) {
  return (
    <div className="ab" data-theme={theme}>
      <AppHeader theme={theme} />

      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Variants</div>
          <p className="mono t-3" style={{ fontSize: 11, lineHeight: 1.6 }}>
            Connection status reflects whether the Dota 2 client is reachable.
            Theme toggle and profile dropdown sit on the right.
          </p>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--line)' }}>
            <span className="mono t-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>1 · IDLE — Dota 2 not running</span>
          </div>
          <AppHeader theme={theme} running={false} />
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--line)' }}>
            <span className="mono t-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>2 · CONNECTED — Dota 2 running, in menu</span>
          </div>
          <AppHeader theme={theme} running runningContext="In Menu" />
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--line)' }}>
            <span className="mono t-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>3 · IN-MATCH — viewing a replay</span>
          </div>
          <AppHeader theme={theme} running runningContext="Watching Replay" />
        </div>

        <div className="card" style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--line)' }}>
            <span className="mono t-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>4 · PROFILE MENU OPEN</span>
          </div>
          <div style={{ position: 'relative' }}>
            <AppHeader theme={theme} running profileOpen />
            <div style={{
              position: 'absolute', top: 56, right: 28,
              width: 232, background: 'var(--bg-3)',
              border: '1px solid var(--line-strong)', borderRadius: 6,
              boxShadow: 'var(--shadow-lg)', padding: 6, zIndex: 10,
            }}>
              {/* User block — no rank */}
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
              {[
                { icon: '☾', label: 'Theme', value: theme === 'dark' ? 'Dark' : 'Light', hover: true },
                { icon: '⚙', label: 'Settings' },
                { icon: '↻', label: 'Reparse all replays' },
                { icon: '⌂', label: 'Replay folder…' },
                { icon: '?', label: 'Help & shortcuts' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 8px', borderRadius: 3, cursor: 'pointer',
                  background: item.hover ? 'var(--bg-4)' : 'transparent',
                  transition: 'background 120ms ease',
                }}>
                  <Glyph w={14} color="var(--text-2)">{item.icon}</Glyph>
                  <span className="t-1" style={{ fontSize: 12, fontFamily: 'var(--sans)', flex: 1 }}>{item.label}</span>
                  {item.value && <span className="mono t-3" style={{ fontSize: 10 }}>{item.value}</span>}
                </div>
              ))}
              <div style={{
                marginTop: 4, paddingTop: 4,
                borderTop: '1px solid var(--line)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 8px', borderRadius: 3, cursor: 'pointer',
                }}>
                  <Glyph w={14} color="var(--dire)">⎋</Glyph>
                  <span style={{ fontSize: 12, fontFamily: 'var(--sans)', color: 'var(--dire)', fontWeight: 600 }}>Log out</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Atom showcase */}
        <div style={{ marginTop: 6 }}>
          <div className="label" style={{ marginBottom: 12 }}>Atoms</div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div className="mono t-3" style={{ fontSize: 9, marginBottom: 6 }}>Theme toggle</div>
              <ThemeToggle theme={theme} />
            </div>
            <div>
              <div className="mono t-3" style={{ fontSize: 9, marginBottom: 6 }}>Profile chip</div>
              <ProfileChip />
            </div>
            <div>
              <div className="mono t-3" style={{ fontSize: 9, marginBottom: 6 }}>Status · idle</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-2)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-3)' }}></span>
                Dota 2 not running
              </div>
            </div>
            <div>
              <div className="mono t-3" style={{ fontSize: 9, marginBottom: 6 }}>Status · connected</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-2)' }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: 'var(--radiant)',
                  boxShadow: '0 0 0 3px var(--radiant-glow), 0 0 8px var(--radiant-glow)',
                }}></span>
                Dota 2 running · In Menu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Empty state
// =============================================================
function HifiEmptyState({ theme = 'dark' }) {
  return (
    <div className="ab" data-theme={theme}>
      <AppHeader theme={theme} />
      <div style={{
        padding: '20px 28px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1 }}>
          Replays
        </h2>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="mono t-3" style={{ fontSize: 18, fontWeight: 700 }}>0</span>
          <span className="mono t-3" style={{ fontSize: 10, letterSpacing: '0.12em' }}>MATCHES</span>
        </div>
      </div>

      <div style={{
        padding: '60px 28px',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 580, textAlign: 'center' }}>
          {/* Decorative stacked frames */}
          <div style={{
            position: 'relative', width: 220, height: 134, margin: '0 auto 36px',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              transform: 'translate(14px, 14px) rotate(2.5deg)',
              background: 'var(--bg-2)', border: '1px solid var(--line)',
              borderRadius: 6, opacity: 0.5,
            }}></div>
            <div style={{
              position: 'absolute', inset: 0,
              transform: 'translate(-10px, 8px) rotate(-1.5deg)',
              background: 'var(--bg-2)', border: '1px solid var(--line)',
              borderRadius: 6, opacity: 0.7,
            }}></div>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'var(--bg-3)', border: '1px solid var(--line-strong)',
              borderRadius: 6,
              boxShadow: 'var(--shadow-md)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: 14,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: 60, height: 6, background: 'var(--bg-4)', borderRadius: 1, marginBottom: 6 }}></div>
                  <div style={{ width: 90, height: 12, background: 'var(--bg-5)', borderRadius: 2 }}></div>
                </div>
                <div style={{ width: 38, height: 14, background: 'var(--radiant)', opacity: 0.5, borderRadius: 2 }}></div>
              </div>
              <div style={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{
                      width: 18, height: 13, background: 'var(--bg-5)', opacity: 0.7,
                      borderRadius: 2,
                    }}></div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{
                      width: 18, height: 13, background: 'var(--bg-5)', opacity: 0.7,
                      borderRadius: 2,
                    }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <h3 className="serif" style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            No replays yet
          </h3>
          <p className="t-2" style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.65, margin: '0 0 24px', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
            Point Mango at your Dota 2 replay folder and we'll start indexing your matches.
            Steam usually keeps them at:
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
            borderRadius: 5,
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-2)',
            marginBottom: 28,
          }}>
            <Glyph w={12} color="var(--text-3)">⌂</Glyph>
            …/Steam/steamapps/common/dota 2 beta/game/dota/replays
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn primary">
              <Glyph w={11} color="white">⌂</Glyph>
              Choose replay folder…
            </button>
            <button className="btn">Scan default location</button>
          </div>

          <div style={{
            marginTop: 44, paddingTop: 24,
            borderTop: '1px solid var(--line)',
          }}>
            <div className="label" style={{ marginBottom: 12 }}>Or paste a Match ID</div>
            <div style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto' }}>
              <div style={{
                flex: 1, padding: '9px 12px',
                background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
                borderRadius: 4,
                fontFamily: 'var(--mono)', fontSize: 12,
                color: 'var(--text-3)', textAlign: 'left',
              }}>e.g. 8716431727</div>
              <button className="btn primary">Fetch</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Loading state — indeterminate (no realtime progress bar)
// =============================================================
function HifiLoadingState({ theme = 'dark' }) {
  const parsing = [
    { id: '8716431727', state: 'parsed' },
    { id: '8706524802', state: 'parsing', stage: 'Reading replay header' },
    { id: '8702819942', state: 'parsing', stage: 'Decoding game events' },
    { id: '8702708735', state: 'queued' },
    { id: '8702681020', state: 'queued' },
    { id: '8702650058', state: 'queued' },
  ];

  return (
    <div className="ab" data-theme={theme}>
      <AppHeader theme={theme} />
      <div style={{
        padding: '20px 28px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1 }}>
            Replays
          </h2>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', background: 'var(--blue-soft)',
            border: '1px solid rgba(93,169,233,0.35)', borderRadius: 4,
          }}>
            <span className="spinner"></span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600, letterSpacing: '0.05em' }}>
              PARSING REPLAYS
            </span>
            <span className="mono t-2" style={{ fontSize: 11 }}>
              · 1 of 6 done · 2 in progress
            </span>
          </div>
        </div>
        <button className="btn sm">Cancel queue</button>
      </div>

      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {parsing.map((p, i) => {
          const isParsing = p.state === 'parsing';
          const isDone    = p.state === 'parsed';
          const isQueued  = p.state === 'queued';
          return (
            <div key={p.id} className={'card ' + (isParsing ? 'shimmer' : '')} style={{
              padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 16,
              opacity: isQueued ? 0.6 : 1,
              borderColor: isParsing ? 'var(--blue)' : 'var(--line)',
              boxShadow: isParsing ? '0 0 0 1px var(--blue), var(--shadow-sm)' : 'var(--shadow-sm)',
            }}>
              {/* State indicator */}
              <div style={{
                width: 32, display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}>
                {isDone && (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--radiant-soft)',
                    border: '1px solid var(--radiant)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--radiant)', fontSize: 11, fontWeight: 700,
                  }}>✓</div>
                )}
                {isParsing && <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2.5 }}></span>}
                {isQueued  && (
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--text-3)',
                  }}></div>
                )}
              </div>

              {/* Match ID */}
              <div style={{ width: 130 }}>
                <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>Match ID</div>
                <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{p.id}</span>
              </div>

              {/* State */}
              <div style={{ width: 110 }}>
                <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>Status</div>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em',
                  fontWeight: 700,
                  color: isDone ? 'var(--radiant)' : isParsing ? 'var(--blue)' : 'var(--text-3)',
                }}>
                  {p.state.toUpperCase()}
                </span>
              </div>

              {/* Stage message */}
              <div style={{ flex: 1 }}>
                <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>Stage</div>
                <span className="mono" style={{
                  fontSize: 11,
                  color: isParsing ? 'var(--text-1)' : 'var(--text-3)',
                  fontStyle: isQueued || isDone ? 'italic' : 'normal',
                }}>
                  {isDone ? 'Indexed 62 kills · ready' : isQueued ? 'Waiting in queue…' : p.stage + '…'}
                </span>
              </div>

              {/* Action */}
              <div>
                {isParsing && (
                  <button className="btn ghost sm">Cancel</button>
                )}
                {isDone && (
                  <button className="btn sm">
                    Open match
                    <Caret dir="right" size={4} />
                  </button>
                )}
                {isQueued && (
                  <span className="mono t-3" style={{ fontSize: 10, padding: '6px 10px' }}>—</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Helper note */}
        <div style={{
          marginTop: 12, padding: '10px 16px',
          background: 'var(--bg-2)', borderRadius: 4,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Glyph w={12} color="var(--text-3)">i</Glyph>
          <span className="mono t-3" style={{ fontSize: 11 }}>
            Parsing happens in the background — feel free to keep browsing.
            We'll surface each match as soon as it's ready.
          </span>
        </div>

        {/* Skeleton match cards underneath */}
        <div style={{ marginTop: 18 }}>
          <div className="label" style={{ marginBottom: 10 }}>Coming up next</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card" style={{ padding: 14, opacity: 0.5 }}>
                <div style={{ height: 10, width: '50%', background: 'var(--bg-4)', marginBottom: 12, borderRadius: 2 }}></div>
                <div style={{ height: 22, width: '40%', background: 'var(--bg-4)', marginBottom: 14, borderRadius: 2 }}></div>
                <div style={{ height: 4, background: 'var(--bg-4)', marginBottom: 12, borderRadius: 2 }}></div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 11 }).map((_, j) => (
                    <div key={j} style={{ width: 22, height: 13, background: 'var(--bg-4)', borderRadius: 2 }}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HifiHeaderSystem, HifiEmptyState, HifiLoadingState });
