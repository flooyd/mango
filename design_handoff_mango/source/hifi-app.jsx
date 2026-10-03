// Hi-fi app — assemble all screens into the design canvas

function App() {
  return (
    <DesignCanvas>
      {/* ============= Cover ============= */}
      <DCSection
        id="cover"
        title="Mango · Dota Replays · Hi-fi"
        subtitle="Real hero & item assets · Dota R/B/G accents · serif headers + mono data · light & dark themes"
      >
        <DCArtboard id="cover-readme" label="Read me" width={720} height={520}>
          <div className="ab" data-theme="dark" style={{ padding: 40 }}>
            <div className="label" style={{ marginBottom: 10 }}>Mango</div>
            <h1 className="serif" style={{ fontSize: 44, fontWeight: 900, marginBottom: 18, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              Hi-fi designs
            </h1>
            <p className="t-2" style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, marginBottom: 28, maxWidth: 520 }}>
              Incorporating your feedback: rank removed from profile, table density dropped,
              kill-nav variations B &amp; C dropped (kept the per-row strip), and the
              loading state no longer mimics a realtime progress bar — it's
              indeterminate per replay.
            </p>

            <div style={{ display: 'flex', gap: 28, marginBottom: 32, flexWrap: 'wrap' }}>
              <div>
                <div className="label" style={{ marginBottom: 6 }}>Dota R / B / G</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { c: 'var(--radiant)', n: 'RADIANT' },
                    { c: 'var(--dire)',    n: 'DIRE' },
                    { c: 'var(--blue)',    n: 'ACCENT' },
                  ].map(s => (
                    <div key={s.n} style={{
                      width: 90, height: 56, background: s.c,
                      display: 'flex', alignItems: 'flex-end', padding: 6,
                      fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,0.95)',
                      letterSpacing: '0.12em', borderRadius: 4,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}>{s.n}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="label" style={{ marginBottom: 6 }}>Type</div>
                <div className="serif" style={{ fontSize: 26, fontWeight: 900, lineHeight: 1 }}>Crimson Pro</div>
                <div className="mono t-3" style={{ fontSize: 10, marginBottom: 10 }}>headers · titles</div>
                <div className="mono" style={{ fontSize: 14, fontWeight: 700 }}>JetBrains Mono</div>
                <div className="mono t-3" style={{ fontSize: 10 }}>IDs · times · numbers</div>
              </div>
            </div>

            <div className="mono t-3" style={{ fontSize: 11, lineHeight: 1.7 }}>
              Scroll right ↦ five sections: header system · matches list · match detail ·
              kill strip detail · empty / loading.
            </div>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ============= ① Header ============= */}
      <DCSection
        id="header"
        title="① Header system"
        subtitle="Brand · connection status · theme toggle · profile chip with dropdown (settings + reparse all + log out — no rank)."
      >
        <DCArtboard id="hdr-dark" label="Dark" width={780} height={780}>
          <HifiHeaderSystem theme="dark" />
        </DCArtboard>
        <DCArtboard id="hdr-light" label="Light" width={780} height={780}>
          <HifiHeaderSystem theme="light" />
        </DCArtboard>
      </DCSection>

      {/* ============= ② Matches list ============= */}
      <DCSection
        id="matches"
        title="② Matches list · Cards + Rows"
        subtitle="Two selectable densities. Hero filter dropdown shown open on one card variant. Each match shows score, mode, first blood, parse status, net-worth split."
      >
        <DCArtboard id="list-cards-dark" label="Cards · dark" width={1280} height={1180}>
          <HifiMatchesCards theme="dark" />
        </DCArtboard>
        <DCArtboard id="list-cards-light" label="Cards · light" width={1280} height={1180}>
          <HifiMatchesCards theme="light" />
        </DCArtboard>
        <DCArtboard id="list-cards-filter" label="Cards · hero filter open" width={1280} height={1180}>
          <HifiMatchesCards theme="dark" heroFilterOpen />
        </DCArtboard>
        <DCArtboard id="list-rows-dark" label="Rows · dark (expanded match 2)" width={1280} height={920}>
          <HifiMatchesRows theme="dark" expandedIdx={1} />
        </DCArtboard>
        <DCArtboard id="list-rows-light" label="Rows · light" width={1280} height={920}>
          <HifiMatchesRows theme="light" expandedIdx={1} />
        </DCArtboard>
      </DCSection>

      {/* ============= ③ Match detail ============= */}
      <DCSection
        id="match"
        title="③ Match detail · Teams"
        subtitle="Map &amp; PiP removed. New columns: GPM, XPM, Net Worth, Kill Participation %. Default + row-expanded + light theme."
      >
        <DCArtboard id="detail-default" label="Default · dark" width={1280} height={900}>
          <HifiMatchDetail theme="dark" expandedRow={null} />
        </DCArtboard>
        <DCArtboard id="detail-expanded" label="Row expanded · Faceless Void kills" width={1280} height={1080}>
          <HifiMatchDetail theme="dark" expandedRow="r1" hoveredKill={3} />
        </DCArtboard>
        <DCArtboard id="detail-light" label="Default · light" width={1280} height={900}>
          <HifiMatchDetail theme="light" expandedRow={null} />
        </DCArtboard>
      </DCSection>

      {/* ============= ④ Kill strip detail ============= */}
      <DCSection
        id="kills"
        title="④ Kill strip · detail"
        subtitle="Zoom on the per-row kill strip and its hover state. Each chip = inflictor (ability / item / attack) + arrow + victim + timestamp. Click jumps Dota 2 to that tick."
      >
        <DCArtboard id="kill-detail" label="Hero row expanded · hover state" width={1180} height={420}>
          <div className="ab" data-theme="dark" style={{ padding: 28 }}>
            <div style={{ marginBottom: 14 }}>
              <div className="label" style={{ marginBottom: 4 }}>Per-row kill strip</div>
              <p className="mono t-3" style={{ fontSize: 11, lineHeight: 1.6, maxWidth: 620, margin: 0 }}>
                Lives directly under the player row in match detail. Inflictor icon shows what
                killed the victim — ability, item, or basic attack.
              </p>
            </div>
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
              {/* The hero row */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 18px', background: 'var(--bg-3)', borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 220 }}>
                  <HeroIcon name="chaos_knight" size={40} />
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13 }}>Chaos Knight</div>
                    <div className="mono t-3" style={{ fontSize: 10 }}>Pomcake Link</div>
                  </div>
                </div>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>
                  <span className="t-1">12</span><span className="t-3"> / </span>
                  <span className="t-1">5</span><span className="t-3"> / </span>
                  <span className="t-1">7</span>
                </span>
                <span className="mono t-3" style={{ fontSize: 10, marginLeft: 'auto' }}>12 kills</span>
                <Caret dir="up" size={5} color="var(--text-3)" />
              </div>
              <KillStripForHero
                heroKey="chaos_knight"
                kills={[
                  { inflictorType: 'attack', victim: 'lion',          time: '04:12' },
                  { inflictor: 'chaos_knight_phantasm', inflictorType: 'ability', victim: 'earthshaker',   time: '07:45' },
                  { inflictor: 'chaos_knight_chaos_strike', inflictorType: 'ability', victim: 'silencer', time: '11:03' },
                  { inflictor: 'chaos_knight_reality_rift', inflictorType: 'ability', victim: 'faceless_void', time: '13:28' },
                  { inflictor: 'aghanims_scepter', inflictorType: 'item', victim: 'invoker',     time: '15:50' },
                  { inflictorType: 'attack', victim: 'lion',          time: '18:11' },
                  { inflictor: 'chaos_knight_phantasm', inflictorType: 'ability', victim: 'silencer',     time: '21:34' },
                  { inflictorType: 'attack', victim: 'earthshaker',   time: '24:02' },
                  { inflictor: 'chaos_knight_reality_rift', inflictorType: 'ability', victim: 'invoker',  time: '26:48' },
                  { inflictorType: 'attack', victim: 'faceless_void', time: '29:15' },
                  { inflictor: 'chaos_knight_phantasm', inflictorType: 'ability', victim: 'silencer',     time: '32:40' },
                  { inflictorType: 'attack', victim: 'lion',          time: '35:09' },
                ]}
                hoverIdx={2}
              />
            </div>
          </div>
        </DCArtboard>
        <DCArtboard id="kill-tooltip" label="Kill chip · anatomy" width={480} height={420}>
          <div className="ab" data-theme="dark" style={{ padding: 28 }}>
            <div className="label" style={{ marginBottom: 14 }}>Anatomy</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Ability kill */}
              <div>
                <div className="mono t-3" style={{ fontSize: 10, marginBottom: 6 }}>Ability kill</div>
                <HifiKillChip
                  inflictor="lion_finger_of_death"
                  inflictorType="ability"
                  victim="ogre_magi"
                  time="11:03"
                />
              </div>

              {/* Item kill */}
              <div>
                <div className="mono t-3" style={{ fontSize: 10, marginBottom: 6 }}>Item kill</div>
                <HifiKillChip
                  inflictor="dagon_5"
                  inflictorType="item"
                  victim="centaur"
                  time="15:50"
                />
              </div>

              {/* Basic attack */}
              <div>
                <div className="mono t-3" style={{ fontSize: 10, marginBottom: 6 }}>Basic attack</div>
                <HifiKillChip
                  inflictorType="attack"
                  victim="bloodseeker"
                  time="04:12"
                />
              </div>

              {/* Hover */}
              <div>
                <div className="mono t-3" style={{ fontSize: 10, marginBottom: 6 }}>Hover · click target</div>
                <HifiKillChip
                  inflictor="lion_finger_of_death"
                  inflictorType="ability"
                  victim="ogre_magi"
                  time="11:03"
                  hover
                />
              </div>
            </div>

            <div style={{
              marginTop: 24, padding: 12,
              background: 'var(--bg-2)', borderRadius: 4,
              border: '1px solid var(--line)',
            }}>
              <div className="mono t-3" style={{ fontSize: 10, lineHeight: 1.7 }}>
                <span className="t-blue">→</span> Inflictor · what killed them<br/>
                <span className="t-blue">→</span> Victim portrait · whose health bar hit 0<br/>
                <span className="t-blue">→</span> Timestamp · game clock<br/>
                <span className="t-blue">→</span> Click · jumps Dota 2 to that tick
              </div>
            </div>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ============= ⑤ States ============= */}
      <DCSection
        id="states"
        title="⑤ Empty &amp; loading"
        subtitle="First-run + parsing queue. Loading state is indeterminate — spinner + stage label per replay, no realtime progress bar."
      >
        <DCArtboard id="empty-dark" label="Empty · dark" width={1280} height={840}>
          <HifiEmptyState theme="dark" />
        </DCArtboard>
        <DCArtboard id="empty-light" label="Empty · light" width={1280} height={840}>
          <HifiEmptyState theme="light" />
        </DCArtboard>
        <DCArtboard id="loading-dark" label="Loading · dark" width={1280} height={920}>
          <HifiLoadingState theme="dark" />
        </DCArtboard>
        <DCArtboard id="loading-light" label="Loading · light" width={1280} height={920}>
          <HifiLoadingState theme="light" />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
