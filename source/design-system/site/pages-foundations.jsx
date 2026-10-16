/* Colors · Typography · Space & motion · Iconography — all driven by the canonical token file. */

function Colors() {
  const theme = useTheme();
  const tokens = useTokens(theme);
  if (!tokens) return <Page eyebrow="Foundations" title="Colors"><p className="cap">Loading tokens…</p></Page>;
  const by = (n) => tokens.find((t) => t.name === n);
  const scale = (s) => tokens.filter((t) => new RegExp(`^--ln-${s}-\\d+$`).test(t.name));
  const core = [
    ["--ln-navy-deep", "Navy deep", "Corporate field"],
    ["--ln-navy", "Navy", "Product surface"],
    ["--ln-gold", "Gold", "Corporate accent"],
    ["--ln-green", "Green", "Product accent"],
    ["--ln-amber", "Amber", "Marketing wordmark"],
  ];
  const semGroups = [
    ["Surfaces", /^--bg/],
    ["Text", /^--fg/],
    ["Borders", /^--border/],
    ["Status", /^--status/],
  ];
  return (
    <Page eyebrow="Foundations" title="Colors" desc="Trust in navy. Distinction in gold. Momentum in green. Click any swatch to copy its token.">
      <Sec title="Brand core">
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))" }}>
          {core.map(([n, label, role]) => {
            const t = by(n); if (!t) return null;
            return (
              <button key={n} className="sw" onClick={() => copy(`var(${n})`, "Token copied")} aria-label={`Copy ${n}, ${t.value}`}>
                <div className="chip" style={{ background: `var(${n})`, height: 110 }}></div>
                <b>{label}</b><span>{t.value} · {role}</span>
              </button>
            );
          })}
        </div>
      </Sec>
      {["navy", "gold", "green", "grey"].map((s) => {
        const steps = scale(s);
        return (
          <Sec key={s} title={s[0].toUpperCase() + s.slice(1) + " scale"} lead={{ navy: "Product base at 600, corporate field at 800.", gold: "Sampled from the wreath; base at 400. Use 600–700 for gold text on white.", green: "Base at 400. Use 700 for green text on white.", grey: "Neutral ramp for UI chrome." }[s]}>
            <div className="ramp" style={{ "--n": steps.length }}>
              {steps.map((t) => (
                <button key={t.name} style={{ background: `var(${t.name})`, color: inkFor(t.value) }} onClick={() => copy(`var(${t.name})`, "Token copied")} title={`${t.name} · ${t.value}`}>
                  {t.name.split("-").pop()}<small>{t.value.replace("#", "")}</small>
                </button>
              ))}
            </div>
          </Sec>
        );
      })}
      <Sec title="Semantic tokens" lead="Build interface chrome from these, not the raw palette — they switch automatically in dark theme.">
        {semGroups.map(([g, re]) => (
          <div key={g} style={{ marginBottom: 18 }}>
            <div className="eb" style={{ margin: "0 0 10px" }}>{g}</div>
            <div className="sem">
              {tokens.filter((t) => re.test(t.name)).map((t) => (
                <div key={t.name} role="button" tabIndex={0} style={{ cursor: "pointer" }} onClick={() => copy(`var(${t.name})`, "Token copied")} onKeyDown={(e) => e.key === "Enter" && copy(`var(${t.name})`, "Token copied")}>
                  <i style={{ background: `var(${t.name})` }}></i>
                  <div style={{ minWidth: 0 }}><b>{t.name}</b><span>{t.value}</span></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Sec>
    </Page>
  );
}

function Typography() {
  const fams = [
    ["--font-brand", "Cormorant Garamond", "Corporate wordmarks and lockups only — never product UI text.", "500 · 600 · 700", { fontWeight: 600 }],
    ["--font-display", "Plus Jakarta Sans", "Product headings.", "400 – 800", { fontWeight: 700 }],
    ["--font-body", "Inter", "Body copy and interface.", "400 – 700", { fontWeight: 400 }],
    ["--font-mono", "JetBrains Mono", "Code, IDs, API keys, tabular numbers.", "400 · 500", { fontWeight: 400 }],
  ];
  const scale = [
    ["h-display · 72", { font: "800 64px/1.05 var(--font-display)", letterSpacing: "-.025em" }, "Built for possibility."],
    ["h1 · 48", { font: "700 44px/1.1 var(--font-display)", letterSpacing: "-.02em" }, "A connected future."],
    ["h2 · 36", { font: "700 34px/1.2 var(--font-display)" }, "Intelligence, with purpose."],
    ["h3 · 30", { font: "600 28px/1.3 var(--font-display)" }, "One unified platform."],
    ["h4 · 24", { font: "600 22px/1.3 var(--font-display)" }, "Your workspace, connected."],
    ["lede · 20", { font: "400 19px/1.6 var(--font-body)", color: "var(--fg-2)" }, "The infrastructure behind your next idea."],
    ["body · 16", { font: "400 16px/1.65 var(--font-body)", color: "var(--fg-2)" }, "Build reliable services on a shared foundation, with an audit trail you can query."],
    ["body-sm · 14", { font: "400 14px/1.5 var(--font-body)", color: "var(--fg-2)" }, "Your latest changes are live."],
    ["caption · 12", { font: "500 12px/1.5 var(--font-body)", color: "var(--fg-3)" }, "Updated 2 minutes ago"],
    ["eyebrow · 12", { font: "600 12px var(--font-body)", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--ln-green-700)" }, "Enterprise infrastructure"],
    ["mono · 13", { font: "400 13px var(--font-mono)", color: "var(--fg-1)" }, 'memory.query({ region: "af-west-1" })'],
  ];
  return (
    <Page eyebrow="Foundations" title="Typography" desc="Four self-hosted families with distinct jobs. The serif carries the corporate voice; the sans families do the work in product.">
      <Sec title="Families">
        <div className="cols-2">
          {fams.map(([tok, name, role, w, st]) => (
            <div key={tok} className="fam">
              <div className="big" style={{ fontFamily: `var(${tok})`, ...st, color: tok === "--font-brand" ? "var(--ln-gold-600)" : "var(--fg-1)" }}>Aa Bb Cc 0123</div>
              <h3>{name}</h3>
              <div className="cap">{role} · {w}</div>
              <code style={{ display: "inline-block", marginTop: 8 }}>{tok}</code>
            </div>
          ))}
        </div>
      </Sec>
      <Sec title="Corporate wordmark" lead="The only place wide tracking belongs. Elsewhere letter-spacing stays neutral.">
        <div className="frame frame-b" style={{ background: "var(--surface-corporate)", border: 0, padding: "32px 28px" }}>
          <div style={{ font: "700 44px/1 var(--font-brand)", letterSpacing: ".12em", color: "var(--ln-gold)" }}>LAN ONASIS</div>
          <div style={{ font: "500 13px var(--font-brand)", letterSpacing: ".3em", color: "var(--ln-gold-200)", marginTop: 10 }}>FUTURE · STRATEGY · TECH</div>
        </div>
      </Sec>
      <Sec title="Scale">
        {scale.map(([k, st, s]) => (
          <div key={k} className="trow"><span className="cap mono">{k}</span><div style={{ color: "var(--fg-1)", ...st }}>{s}</div></div>
        ))}
      </Sec>
    </Page>
  );
}

function Foundations() {
  const theme = useTheme();
  const tokens = useTokens(theme);
  const [go2, setGo2] = React.useState(false);
  if (!tokens) return <Page eyebrow="Foundations" title="Space & motion"><p className="cap">Loading tokens…</p></Page>;
  const pick = (re) => tokens.filter((t) => re.test(t.name));
  return (
    <Page eyebrow="Foundations" title="Space & motion" desc="A 4-point rhythm, restrained radii, quiet elevation, and motion that never overshoots.">
      <Sec title="Spacing" lead="4-point scale. Sections breathe at 32–48; cards pad at 20–24.">
        {pick(/^--sp-\d+$/).filter((t) => t.value !== "0px").map((t) => (
          <div key={t.name} className="sp-row"><code>{t.name}</code><span className="cap mono">{t.value}</span><i style={{ width: `min(100%, var(${t.name}))` }}></i></div>
        ))}
      </Sec>
      <Sec title="Radii" lead="Controls default to md (8). Larger radii are for containers, not a reason to make every control a pill.">
        <div className="grid-auto">
          {pick(/^--r-/).map((t) => (
            <div key={t.name}><div className="rad" style={{ borderRadius: `var(${t.name})` }}></div><code>{t.name}</code><div className="cap mono">{t.value}</div></div>
          ))}
        </div>
      </Sec>
      <Sec title="Elevation" lead="Navy-tinted, never pure black. xs inputs · sm cards · md hover · lg menus · xl dialogs.">
        <div className="shd-wrap">
          <div className="grid-auto">
            {pick(/^--shadow-/).map((t) => (
              <div key={t.name}><div className="shd" style={{ boxShadow: `var(${t.name})` }}></div><code>{t.name}</code></div>
            ))}
          </div>
        </div>
      </Sec>
      <Sec title="Motion" lead="Enter with ease-out; move with ease-in-out. 120 / 200 / 320 ms. Reduced-motion preference disables all transitions.">
        <div className="cols-3">
          {[["--dur-fast", "--ease-out"], ["--dur-base", "--ease-out"], ["--dur-slow", "--ease-in-out"]].map(([d, e]) => (
            <div key={d}>
              <div className={"motion-demo" + (go2 ? " go" : "")}><i style={{ transition: `left var(${d}) var(${e})` }}></i></div>
              <div className="cap mono" style={{ marginTop: 8 }}>{d} · {e}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>{React.createElement(ds("Button"), { variant: "outline", size: "sm", onClick: () => setGo2((v) => !v) }, "Play")}</div>
      </Sec>
    </Page>
  );
}

const ICONS = ["rocket", "shield-check", "zap", "globe", "building-2", "users", "trophy", "key-round", "brain", "bar-chart-3", "terminal", "code", "cloud", "lock", "layers", "settings", "database", "activity", "bell", "search", "filter", "plus", "check", "x", "arrow-right", "arrow-up-right", "download", "copy", "external-link", "trending-up", "trending-down", "rotate-cw"];
function Iconography() {
  const Input = ds("Input");
  const [q, setQ] = React.useState("");
  const list = ICONS.filter((n) => n.includes(q.trim().toLowerCase()));
  return (
    <Page eyebrow="Foundations" title="Iconography" desc="Lucide, outline only, 2px stroke. Navy by default; green only for state or emphasis. Click an icon to copy its name.">
      <div className="search"><Icon name="search" size={16} /><Input aria-label="Search icons" placeholder="Search icons…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(112px,1fr))" }}>
        {list.map((n) => (
          <button key={n} className="ico" onClick={() => copy(n, "Icon name copied")}><Icon name={n} size={24} /><span>{n}</span></button>
        ))}
      </div>
      {!list.length && <p className="cap">No icons match “{q}”. The full Lucide set is available — this is the curated core.</p>}
      <Sec title="Sizes" lead="16 dense UI · 20 default · 24 body · 32 feature.">
        <div className="row" style={{ gap: 28, alignItems: "flex-end" }}>
          {[16, 20, 24, 32].map((s) => <div key={s} className="vcell" style={{ alignItems: "center" }}><Icon name="shield-check" size={s} /><span>{s}px</span></div>)}
        </div>
      </Sec>
      <Sec title="Rules">
        <ul className="rules">
          <li>Never mix filled and outline icons, or change stroke weight.</li>
          <li>Icon-only buttons need an <code>aria-label</code> and a <code>title</code>.</li>
          <li>Never convey status with an icon or colour alone — pair it with text.</li>
        </ul>
      </Sec>
    </Page>
  );
}

Object.assign(window, { Colors, Typography, Foundations, Iconography });
