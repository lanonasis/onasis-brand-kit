/* Overview · Brand · Channels */

/* brand-mark.png carries its own textured-navy field. On a flat navy panel a hard
   seam shows, so it is feathered into the surface with a radial mask. */
const FEATHER = { WebkitMaskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)", maskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)" };

function Overview() {
  const Button = ds("Button");
  const BrandMark = ds("BrandMark");
  const tiles = [
    { path: "/brand", t: "Brand", d: "Three marks, two identities, and which to use where.", art: <img src="assets/logos/app-icon-128.png" width="56" height="56" alt="" style={{ borderRadius: 12 }} /> },
    { path: "/colors", t: "Colors", d: "Navy for trust, gold for distinction, green for momentum.", art: ["--ln-navy-deep", "--ln-navy", "--ln-gold", "--ln-green"].map((v) => <i key={v} style={{ width: 34, height: 34, borderRadius: 8, background: `var(${v})` }}></i>) },
    { path: "/typography", t: "Typography", d: "A brand serif for the corporate voice, clean sans for product.", art: <><span style={{ font: "600 40px var(--font-brand)", color: "var(--ln-gold-600)" }}>Aa</span><span style={{ font: "700 40px var(--font-display)", color: "var(--fg-1)" }}>Aa</span></> },
    { path: "/components", t: "Components", d: "Eight production primitives, live and copyable.", art: <div className="row" style={{ justifyContent: "center" }}><Button size="sm" variant="accent">Create</Button><Button size="sm" variant="outline">Cancel</Button></div> },
    { path: "/patterns", t: "Patterns", d: "Full marketing and dashboard kits built from the system.", art: <Icon name="panels-top-left" size={34} /> },
    { path: "/channels", t: "Channels", d: "Email, web and social — sizes and identity per handle.", art: <Icon name="at-sign" size={34} /> },
  ];
  return (
    <>
      <div className="hero-o">
        <div>
          <div className="eb">LAN Onasis design system</div>
          <h1>One identity.<br />Every experience.</h1>
          <p>The shared language for everything Lan Onasis ships — from the corporate wreath on a press release to a status pill in the dashboard.</p>
          <div className="acts">
            <Button variant="secondary" onClick={() => go("/components")}>Browse components <Icon name="arrow-right" size={15} /></Button>
            <Button variant="outline" onClick={() => go("/brand")}>Brand guidance</Button>
          </div>
        </div>
        <div className="ident" aria-label="The two brand expressions">
          <div className="corp">
            <span className="lab">01 / CORPORATE</span>
            <div className="mid"><img src="assets/logos/brand-mark.png" alt="LAN Onasis gold corporate wreath" style={FEATHER} /></div>
            <div className="bot"><span>Navy deep × Gold</span><span>Formal</span></div>
          </div>
          <div className="prod">
            <span className="lab">02 / PRODUCT</span>
            <div className="mid"><div className="lock"><BrandMark variant="icon" theme="dark" size={56} /><div><b>LAN Onasis</b><small>Intelligence, connected.</small></div></div></div>
            <div className="bot"><span>Navy × Green</span><span>Efficient</span></div>
          </div>
        </div>
      </div>
      <div className="stats">
        <div><b>2</b><span>Brand expressions</span></div>
        <div><b>4</b><span>Type families, self-hosted</span></div>
        <div><b>8</b><span>Exported components</span></div>
        <div><b>6</b><span>Public channels</span></div>
      </div>
      <Sec title="Explore">
        <div className="tiles">
          {tiles.map((x) => (
            <a key={x.path} className="tile" href={"#" + x.path}>
              <div className="art">{x.art}</div>
              <h3>{x.t}<Icon name="arrow-up-right" size={16} /></h3>
              <p>{x.d}</p>
            </a>
          ))}
        </div>
      </Sec>
      <Sec title="Quick start" lead="Link the stylesheet once, then load the bundle. Every component reads its colours, type and spacing from the tokens.">
        <Code code={`<link rel="stylesheet" href="styles.css">\n<script src="_ds_bundle.js"></script>\n\n<script>\n  const { Button, Badge, BrandMark } = window.${NS};\n</script>`} />
      </Sec>
    </>
  );
}

function Brand() {
  const BrandMark = ds("BrandMark");
  const L0Mark = ds("L0Mark");
  const assets = [
    { src: "assets/logos/brand-mark.png", name: "Corporate wreath", meta: "PNG · 1024² · on navy", bg: "var(--surface-corporate)", fill: true },
    { src: "assets/logos/lan-onasis-light-logo.png", name: "Corporate wreath · light", meta: "PNG · 1024² · on white", bg: "#FFFFFF", fill: true },
    { src: "assets/logos/brand-mark-tagline.png", name: "Tagline lockup", meta: "PNG · Future · Strategy · Tech", bg: "var(--surface-corporate)", fill: true },
    { src: "assets/logos/app-icon-512.png", name: "Product app icon", meta: "PNG · 512² · chip", bg: "var(--bg-subtle)" },
    { src: "assets/logos/brandmark-icon.svg", name: "Product icon · vector", meta: "SVG · currentColor · id-free", bg: "var(--bg-subtle)", svg: true },
    { src: "assets/imagery/marketing-hero.png", name: "Marketing hero", meta: "PNG · circuit + globe", bg: "var(--surface-corporate)", fill: true },
  ];
  return (
    <Page eyebrow="Brand" title="Marks & identity" desc="Three marks are in use. They aren't interchangeable — choosing the wrong one is the most common source of brand drift.">
      <Sec title="Mark hierarchy">
        <div>
          <div className="tier">
            <div className="pv" style={{ background: "var(--surface-corporate)" }}><img src="assets/logos/brand-mark.png" alt="" style={{ height: "130%", ...FEATHER }} /></div>
            <div><h3>Corporate — the wreath</h3><p>Gold spirograph wreath with the serif wordmark. Customers, partners and press: social profiles and covers, email signatures, decks, signage. Pair with <code>--ln-gold</code> and <code>--font-brand</code>. On white surfaces use the navy-ink light version.</p></div>
          </div>
          <div className="tier">
            <div className="pv" style={{ background: "var(--bg-subtle)", display: "flex", gap: 22, justifyContent: "center" }}>
              <BrandMark variant="icon" theme="light" size={56} />
              <span style={{ background: "var(--ln-navy-deep)", padding: 12, borderRadius: 12, display: "inline-flex" }}><BrandMark variant="icon" theme="dark" size={44} /></span>
            </div>
            <div><h3>Product — the app icon</h3><p>Serif L, divider and gear-globe with the green accent dot. Inside the product: app chrome, favicons, launchers. Use <code>BrandMark</code> — its ink swaps with <code>theme</code>, so it never vanishes against navy.</p></div>
          </div>
          <div className="tier">
            <div className="pv" style={{ background: "var(--bg-subtle)", color: "var(--fg-1)", display: "flex", gap: 22, justifyContent: "center" }}>
              <L0Mark size={48} accent /><L0Mark size={32} />
            </div>
            <div><h3>Sub-product — L0 / LZero</h3><p>24px line art, “L” + “0” with a meridian. LZero surfaces only. Inherits <code>currentColor</code>. Its source export is named <code>LanoLogo</code> — confirm whether it's the LZero mark before it spreads.</p></div>
          </div>
        </div>
      </Sec>
      <Sec title="Approved assets" lead="Original artwork only — never redraw, recolour or re-letter a mark.">
        <div className="cols-3">
          {assets.map((a) => (
            <div key={a.name} className="frame asset">
              <div className="pv" style={{ background: a.bg, color: "var(--fg-1)" }}>
                <img src={a.src} alt={a.name} style={a.fill ? { width: "100%", height: "100%", objectFit: "cover", ...(a.bg.includes("corporate") && a.src.includes("brand-mark") ? FEATHER : {}) } : { width: a.svg ? 96 : 110, height: "auto" }} />
              </div>
              <div className="meta">
                <div><b>{a.name}</b><span>{a.meta}</span></div>
                <a className="icon-btn" href={a.src} download aria-label={"Download " + a.name} title="Download original"><Icon name="download" size={16} /></a>
              </div>
            </div>
          ))}
        </div>
      </Sec>
      <Sec title="Usage rules">
        <ul className="rules">
          <li><b>Clear space</b> — at least the height of the “L” on every side.</li>
          <li><b>Minimum size</b> — wreath 120px wide on screen; product icon 16px; below 24px use the tile.</li>
          <li><b>Circular crops</b> (social avatars) — use the navy tile or the wreath on its own field, never ink-only marks.</li>
          <li><b>Gold</b> is <code>#C9A24B</code>, sampled from the real wreath. The legacy <code>#FFD700</code> doesn't appear in the artwork.</li>
        </ul>
      </Sec>
      <Sec title="Do not use">
        <details className="dont">
          <summary>Seven files in circulation that must not ship</summary>
          <ul>
            <li><code>brand-mark-light.png</code>, <code>brand-mark-dark.png</code> (also as <code>IMG_6961.png</code>, <code>IMG_8195.jpeg</code>) — tiled with logo-generator watermarks.</li>
            <li><code>logo-horizontal.svg</code>, <code>logo-stacked.svg</code>, <code>logo-inverse.svg</code>, <code>wordmark-only.svg</code> — placeholder stubs: a rectangle and Arial text.</li>
            <li><code>email-signature-template.svg</code>, <code>brand-guidelines.svg</code>, <code>brand-applications.svg</code> — empty image shells; the artwork only exists on the previous host.</li>
          </ul>
        </details>
        <p className="cap" style={{ marginTop: 12 }}>Full classification in <code>ASSET_MANIFEST.md</code>.</p>
      </Sec>
    </Page>
  );
}

function Channels() {
  const Badge = ds("Badge");
  const rows = [
    ["info@lanonasis.com", "Email signature", "—", "corp", "Wordmark", "absent"],
    ["www.lanonasis.com", "Marketing site", "Responsive", "corp", "Wordmark", "partial"],
    ["www.lanonasis.com", "Favicon set", "16 → 512", "prod", "Tile", "partial"],
    ["@lanonasis · Instagram", "Post · Story", "1080² · 1080×1920", "corp", "Wordmark", "absent"],
    ["facebook.com/lanonasis", "Cover · Post", "820×312 · 1200×630", "corp", "Wordmark", "absent"],
    ["company/lan-onasis", "Cover · Post", "1128×191 · 1200×627", "corp", "Wordmark", "absent"],
    ["@lanonasis · X", "Header · Card", "1500×500 · 1200×675", "corp", "Wordmark", "absent"],
    ["All social", "Profile avatar", "400×400", "corp", "Tile — circular", "covered"],
    ["github.com/lanonasis", "Social preview", "1280×640", "prod", "Icon", "absent"],
  ];
  const tone = { covered: "success", partial: "warning", absent: "danger" };
  return (
    <Page eyebrow="Guidance" title="Channels" desc="Every public Lan Onasis handle, the identity it carries, its exact sizes, and which mark is safe there.">
      <Sec title="Namespace map">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Handle</th><th>Surface</th><th>Size</th><th>Identity</th><th>Mark</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="m">{r[0]}</td><td>{r[1]}</td><td className="m" style={{ color: "var(--fg-3)" }}>{r[2]}</td>
                  <td><Badge tone={r[3] === "corp" ? "gold" : "success"} dot={false}>{r[3] === "corp" ? "Corporate" : "Product"}</Badge></td>
                  <td>{r[4]}</td>
                  <td><Badge tone={tone[r[5]]}>{r[5][0].toUpperCase() + r[5].slice(1)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cap" style={{ marginTop: 12 }}>LinkedIn's slug is <code>lan-onasis</code> (hyphenated); every other handle is <code>lanonasis</code>. Keep both exactly as written.</p>
      </Sec>
      <Sec title="Which identity, where" lead="Audience decides. Customers, partners and press see the corporate expression; people using the product see the product expression.">
        <div className="cols-2">
          <div className="frame frame-b" style={{ background: "var(--surface-corporate)", color: "var(--ln-white)", border: 0 }}>
            <div className="eb" style={{ color: "var(--ln-gold)" }}>Corporate</div>
            <p style={{ margin: 0, font: "500 15px/1.6 var(--font-body)" }}>Gold on navy deep, brand serif, the wreath. Social profiles and covers, email signatures, decks, press, the marketing hero and footer.</p>
          </div>
          <div className="frame frame-b" style={{ background: "var(--surface-product)", color: "var(--ln-white)", border: 0 }}>
            <div className="eb" style={{ color: "var(--ln-green)" }}>Product</div>
            <p style={{ margin: 0, font: "500 15px/1.6 var(--font-body)" }}>Green on navy, Plus Jakarta and Inter, the app icon. App UI, dashboard, docs, changelog, in-product email, repository previews.</p>
          </div>
        </div>
      </Sec>
      <Sec title="Crop and safe-area rules">
        <ul className="rules">
          <li><b>Profiles crop to a circle.</b> Ink-only marks lose their outer strokes — use the navy tile.</li>
          <li><b>LinkedIn and Facebook covers</b> are overlapped by the avatar at lower-left and reflow by breakpoint. Keep ~15% clear on the left; centre or right-align the wordmark.</li>
          <li><b>400×400</b> is the safe upload size for every profile; Instagram serves at 320×320.</li>
        </ul>
      </Sec>
    </Page>
  );
}

Object.assign(window, { Overview, Brand, Channels });
