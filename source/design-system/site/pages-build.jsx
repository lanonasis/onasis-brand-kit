/* Components · Patterns · Guidelines */

const SITE_COMPONENTS = [
  { id: "button", name: "Button", tag: "Action" },
  { id: "badge", name: "Badge", tag: "Status" },
  { id: "card", name: "Card", tag: "Container" },
  { id: "input", name: "Input", tag: "Form" },
  { id: "select", name: "Select", tag: "Form" },
  { id: "modal", name: "Modal", tag: "Overlay" },
  { id: "brandmark", name: "BrandMark", tag: "Brand" },
  { id: "l0mark", name: "L0Mark", tag: "Brand" },
];
window.SITE_COMPONENTS = SITE_COMPONENTS;

function Props({ rows }) {
  return (
    <table className="props">
      <thead><tr><th>Prop</th><th>Type</th><th>Notes</th></tr></thead>
      <tbody>{rows.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
    </table>
  );
}

function Components({ route }) {
  const Button = ds("Button"), Badge = ds("Badge"), Card = ds("Card"), Input = ds("Input"), Select = ds("Select"), Modal = ds("Modal"), BrandMark = ds("BrandMark"), L0Mark = ds("L0Mark");
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [err, setErr] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [active, setActive] = React.useState(route.sub || "button");

  React.useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-90px 0px -70% 0px" });
    SITE_COMPONENTS.forEach((c) => { const el = document.getElementById(c.id); el && obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const create = (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr(true); return; }
    setErr(false); setBusy(true);
    setTimeout(() => { setBusy(false); setOpen(false); notify(`Memory “${name.trim()}” created`); setName(""); }, 900);
  };

  const S = {
    button: {
      desc: "Gold for corporate actions, green for product actions, navy for secondary. Danger for destructive. Loading disables and shows a spinner.",
      body: <>
        <div className="row">{["primary", "accent", "secondary", "outline", "ghost", "danger"].map((v) => <div key={v} className="vcell"><Button variant={v} onClick={() => notify(v + " clicked")}>{v === "danger" ? "Delete" : "Continue"}</Button><span>{v}</span></div>)}</div>
        <div className="row">{["sm", "md", "lg"].map((s) => <div key={s} className="vcell"><Button variant="outline" size={s}>Save changes</Button><span>{s}</span></div>)}<div className="vcell"><Button variant="outline" size="icon" aria-label="Settings" title="Settings"><Icon name="settings" size={16} /></Button><span>icon</span></div></div>
        <div className="row"><div className="vcell"><Button variant="accent" loading>Saving</Button><span>loading</span></div><div className="vcell"><Button variant="primary" disabled>Unavailable</Button><span>disabled</span></div></div>
      </>,
      code: `<Button variant="accent" onClick={createWorkspace}>Create workspace</Button>\n<Button variant="danger" loading={deleting}>Delete</Button>\n<Button variant="outline" size="icon" aria-label="Settings">…</Button>`,
      props: [["variant", "primary | accent | secondary | outline | ghost | danger", "Default primary (gold)."], ["size", "sm | md | lg | icon", "icon needs aria-label."], ["loading", "boolean", "Disables + spinner + aria-busy."]],
    },
    badge: {
      desc: "Status pill. Always carries a text label — the dot is reinforcement, never the only signal.",
      body: <div className="row">{[["success", "Operational"], ["info", "In review"], ["warning", "Syncing"], ["danger", "Failed"], ["neutral", "Draft"], ["gold", "Enterprise"]].map(([t, l]) => <div key={t} className="vcell"><Badge tone={t}>{l}</Badge><span>{t}</span></div>)}</div>,
      code: `<Badge tone="success">Operational</Badge>\n<Badge tone="gold" dot={false}>Enterprise</Badge>`,
      props: [["tone", "success | info | warning | danger | neutral | gold", ""], ["dot", "boolean", "Default true."]],
    },
    card: {
      desc: "For repeated entities and framed tools — not for wrapping page sections.",
      body: <div className="cols-2"><Card accent="gold" eyebrow="Corporate" title="Connected by design" body="A shared foundation for the next chapter." footer="Explore the platform →" /><Card accent="green" eyebrow="Product" title="Memory as a Service" body="Persistent, queryable memory for AI agents." footer="Open console →" /></div>,
      code: `<Card accent="green" eyebrow="Product" title="Memory as a Service"\n  body="Persistent, queryable memory for AI agents." footer="Open console →" />`,
      props: [["eyebrow / title / body", "string", ""], ["accent", "gold | green", "Colours the eyebrow."], ["footer", "ReactNode", ""]],
    },
    input: {
      desc: "Semantic text field. The label and the help or error text belong to your form.",
      body: <div className="cols-3">
        <label className="field">Workspace name<Input placeholder="Acme Africa" /><span className="h">Lowercase, dashes only.</span></label>
        <label className="field">Email<Input defaultValue="ada@" variant="error" aria-describedby="ex-err" /><span id="ex-err" className="e">Enter a valid email address.</span></label>
        <label className="field">Unavailable<Input placeholder="Locked" disabled /></label>
      </div>,
      code: `<label>\n  Email\n  <Input variant="error" aria-describedby="email-err" />\n  <span id="email-err">Enter a valid email address.</span>\n</label>`,
      props: [["variant", "default | error", "error sets aria-invalid."], ["size", "sm | md", ""], ["…rest", "input attributes", "Forwarded."]],
    },
    select: {
      desc: "A native select, so keyboard and screen-reader behaviour come for free.",
      body: <div className="cols-3">
        <label className="field">Data region<Select><option>Lagos · af-west-1</option><option>Nairobi · af-east-1</option><option>Paris · eu-west-3</option></Select></label>
        <label className="field">With error<Select variant="error"><option>Choose a region</option></Select></label>
        <label className="field">Unavailable<Select disabled><option>Region locked</option></Select></label>
      </div>,
      code: `<Select value={region} onChange={(e) => setRegion(e.target.value)}>\n  <option value="af-west-1">Lagos · af-west-1</option>\n</Select>`,
      props: [["variant", "default | error", ""], ["size", "sm | md", ""]],
    },
    modal: {
      desc: "Traps focus, closes on Escape or scrim click, and returns focus to the opener. Always give it a title, and a description when it changes data.",
      body: <div className="row"><Button variant="outline" onClick={() => setOpen(true)}>Create a memory</Button><span className="cap">Try Tab, Shift+Tab and Escape.</span></div>,
      code: `<Modal open={open} title="Create a memory"\n  description="Adds a new memory to this workspace."\n  onClose={() => setOpen(false)}\n  footer={<Button variant="accent">Create memory</Button>}>\n  …\n</Modal>`,
      props: [["open", "boolean", ""], ["title", "string", "Required — the accessible name."], ["description", "string", ""], ["onClose", "() => void", "Required."], ["footer", "ReactNode", ""], ["size", "sm | md", ""]],
    },
    brandmark: {
      desc: "The product mark, theme-aware. Ink swaps by theme so it never disappears; geometry is id-free so bundlers can't scramble it.",
      split: true,
      light: <><BrandMark variant="icon" theme="light" size={44} /><BrandMark variant="monogram" theme="light" size={32} /><BrandMark variant="wordmark" theme="light" size={70} /><BrandMark variant="tile" size={40} /></>,
      dark: <><BrandMark variant="icon" theme="dark" size={44} /><BrandMark variant="monogram" theme="dark" size={32} /><BrandMark variant="wordmark" theme="dark" size={70} /><BrandMark variant="tile" size={40} /></>,
      code: `<BrandMark variant="icon" theme={isDark ? "dark" : "light"} size={32} />\n<BrandMark variant="tile" size={40} />  {/* favicons, circular avatars */}`,
      props: [["variant", "icon | monogram | wordmark | tile", ""], ["theme", "light | dark", "Navy ink / white ink."], ["size", "number", "Height in px."], ["basePath", "string", "Raster folder for wordmark / tile."]],
    },
    l0mark: {
      desc: "The LZero sub-product glyph. Inherits currentColor, so set colour on its container — no theme prop.",
      split: true,
      light: <span style={{ color: "var(--ln-navy)", display: "flex", gap: 18, alignItems: "center" }}><L0Mark size={40} /><L0Mark size={40} accent /><L0Mark size={40} variant="ellipse" /><L0Mark size={24} /></span>,
      dark: <span style={{ color: "#fff", display: "flex", gap: 18, alignItems: "center" }}><L0Mark size={40} /><L0Mark size={40} accent /><L0Mark size={40} variant="ellipse" /><L0Mark size={24} /></span>,
      code: `<span style={{ color: "var(--fg-1)" }}>\n  <L0Mark size={24} accent />\n</span>`,
      props: [["variant", "circle | ellipse", "Both ship in production."], ["accent", "boolean", "Green meridian."], ["meridian", "boolean", "circle only."], ["size", "number", "Legible 16–40."]],
    },
  };

  return (
    <Page eyebrow="Build" title="Components" desc="Eight exported primitives. Live, themed, and copyable — the same code your product imports.">
      <div className="cmp" style={{ marginTop: 28 }}>
        <nav className="cmp-nav" aria-label="Components">
          {SITE_COMPONENTS.map((c) => <a key={c.id} href={"#/components/" + c.id} className={active === c.id ? "on" : ""}>{c.name}</a>)}
        </nav>
        <div style={{ minWidth: 0 }}>
          {SITE_COMPONENTS.map((c) => {
            const s = S[c.id];
            return (
              <section key={c.id} id={c.id} className="cmp-sec">
                <h2>{c.name}<span className="tag">{c.tag}</span></h2>
                <p>{s.desc}</p>
                {s.split
                  ? <div className="stage split"><div>{s.light}</div><div className="dk">{s.dark}</div></div>
                  : <div className="stage">{s.body}</div>}
                <Code code={s.code} />
                <Props rows={s.props} />
              </section>
            );
          })}
        </div>
      </div>
      <Modal open={open} title="Create a memory" description="Adds a new memory to this workspace. You can rename it later." onClose={() => { setOpen(false); setErr(false); }}
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="accent" loading={busy} onClick={create}>Create memory</Button></>}>
        <form onSubmit={create}>
          <label className="field">Memory name
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="credit-scoring-v4" variant={err ? "error" : "default"} aria-describedby={err ? "m-err" : undefined} autoFocus />
            {err && <span id="m-err" className="e">A name is required.</span>}
          </label>
        </form>
      </Modal>
    </Page>
  );
}

function Patterns() {
  const Button = ds("Button");
  const kits = [
    { src: "ui_kits/web/index.html", t: "Marketing site", d: "Nav, hero, product grid, split feature, ecosystem band, CTA, footer." },
    { src: "ui_kits/dashboard/index.html", t: "Product dashboard", d: "Sidebar, top bar, KPIs, chart, memories table, settings, dialog." },
  ];
  return (
    <Page eyebrow="Build" title="Patterns" desc="Complete surfaces composed from the system. Open one to click through it.">
      <Sec>
        <div className="cols-2">
          {kits.map((k) => (
            <div key={k.src} className="frame kit">
              <div className="pv"><iframe src={k.src} title={k.t + " preview"} loading="lazy" tabIndex={-1} aria-hidden="true"></iframe></div>
              <div className="meta">
                <div><h3>{k.t}</h3><div className="cap">{k.d}</div></div>
                <a href={k.src} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}><Button variant="outline" size="sm" tabIndex={-1}>Open <Icon name="external-link" size={14} /></Button></a>
              </div>
            </div>
          ))}
        </div>
      </Sec>
      <Sec title="Using patterns" lead="Patterns receive data and callbacks; they are not backends.">
        <ul className="rules">
          <li>Specimen numbers (uptime, latency, totals) are examples. Never present them as real.</li>
          <li>Marketing hero and footer use the corporate expression; product sections use the product expression.</li>
          <li>Copy a pattern's markup and wire it to your own data — don't import the kit files.</li>
        </ul>
      </Sec>
    </Page>
  );
}

function Guidelines() {
  return (
    <Page eyebrow="Guidance" title="Guidelines" desc="Voice, accessibility, and the rules that keep the mark intact in code.">
      <Sec title="Voice">
        <div className="dd">
          <div className="do"><h4>Do</h4><p>“Deploy your first memory in under five minutes.”</p><p>“Your key expires in 4 days. Rotate it.”</p><div className="cap">Direct, sentence case, “you”, specific.</div></div>
          <div className="no"><h4>Don't</h4><p>“Leverage our synergistic AI to revolutionise your stack!”</p><p>“Oops! Something went wrong 😬”</p><div className="cap">No buzzwords, exclamations, or emoji in product.</div></div>
        </div>
      </Sec>
      <Sec title="Accessibility">
        <ul className="rules">
          <li><b>Buttons act, links navigate.</b> Labels are linked to controls; tabular data uses real tables.</li>
          <li><b>Contrast</b> — 4.5:1 for text in both themes. Use semantic foreground tokens on their intended surfaces.</li>
          <li><b>Focus</b> stays visible. Never remove outlines.</li>
          <li><b>Status</b> is always text, never only a dot or a colour.</li>
          <li><b>Motion</b> is never required to understand anything, and reduced-motion disables it.</li>
        </ul>
      </Sec>
      <Sec title="Rendering the mark in code" lead="Two specific causes scramble the mark. Both are designed out of BrandMark — these rules matter for any hand-rolled port.">
        <ul className="rules">
          <li><b>Never paste raw SVG into JSX.</b> React drops <code>stroke-width</code>, <code>fill-rule</code> and friends; strokes fall back to 1px and the linework mangles.</li>
          <li><b>Never give an inline mark an id.</b> Masks and clip-paths need ids, which collide, mismatch on hydration, and get rewritten by SVGO.</li>
          <li><b>If you run SVGO</b>, disable <code>cleanupIds</code>, <code>mergePaths</code>, <code>convertShapeToPath</code> and <code>removeViewBox</code>.</li>
          <li><b>Outside React</b>, use <code>assets/logos/brandmark-icon.svg</code> — it inks with <code>currentColor</code>.</li>
        </ul>
      </Sec>
      <Sec title="Token discipline">
        <ul className="rules">
          <li>No raw hex in page code — every colour, size, radius and shadow comes from a named variable.</li>
          <li>Use semantic tokens (<code>--bg</code>, <code>--fg-1</code>, <code>--border-default</code>) for chrome so dark theme works.</li>
          <li>Never recolour or crop a logo to fit a theme — choose the right variant instead.</li>
        </ul>
      </Sec>
    </Page>
  );
}

Object.assign(window, { Components, Patterns, Guidelines, SITE_COMPONENTS });
