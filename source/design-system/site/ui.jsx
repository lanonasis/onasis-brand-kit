/* Shared site primitives. Exported to window at the bottom (Babel scripts don't share scope). */

const NS = "LANOnasisDesignSystem_320289";
/* Read a design-system component; render a calm placeholder if the bundle is still compiling. */
function ds(name) {
  const lib = window[NS] || {};
  return lib[name] || function Pending() {
    return <span className="cap" style={{ padding: "8px 12px", border: "1px dashed var(--border-default)", borderRadius: "var(--r-md)" }}>{name} is rebuilding — refresh in a moment</span>;
  };
}

/* Lucide icon, rendered directly from lucide's icon data as React SVG.
   (lucide.createIcons() rescans the whole document on every call, which janked
   theme switches and page changes — this renders each icon once, in React.) */
const iconCache = {};
function iconNode(name) {
  if (iconCache[name] !== undefined) return iconCache[name];
  const L = window.lucide || {};
  const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  let node = (L.icons && L.icons[pascal]) || L[pascal] || null;
  if (node && node[0] === "svg") node = node[2];
  iconCache[name] = node;
  return node;
}
const camel = (k) => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
function Icon({ name, size = 18, stroke = 2, className = "", label }) {
  const node = iconNode(name);
  return (
    <svg className={"ic " + className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : "true"} style={{ flexShrink: 0, display: "inline-block" }}>
      {node && node.map(([tag, attrs], i) => {
        const p = {};
        for (const k in attrs) if (k !== "key") p[camel(k)] = attrs[k];
        return React.createElement(tag, { key: i, ...p });
      })}
    </svg>
  );
}

/* Toast via a window event so any page can announce. */
function notify(msg) { window.dispatchEvent(new CustomEvent("ln-toast", { detail: msg })); }
function copy(text, label) {
  const done = () => notify((label || "Copied") + " — " + (text.length > 40 ? text.slice(0, 40) + "…" : text));
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => notify("Copy unavailable in this browser"));
  else {
    const t = document.createElement("textarea");
    t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); done(); } catch (e) { notify("Copy unavailable in this browser"); }
    t.remove();
  }
}
function Toaster() {
  const [msg, setMsg] = React.useState(null);
  React.useEffect(() => {
    let t;
    const on = (e) => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(null), 2200); };
    window.addEventListener("ln-toast", on);
    return () => window.removeEventListener("ln-toast", on);
  }, []);
  return msg ? <div className="toast" role="status"><i></i>{msg}</div> : <div className="sr" role="status"></div>;
}

/* Page scaffolding */
function Page({ eyebrow, title, desc, children }) {
  React.useEffect(() => { document.title = title + " — LAN Onasis Design System"; }, [title]);
  return (
    <>
      <header className="ph">
        {eyebrow && <div className="eb">{eyebrow}</div>}
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </header>
      {children}
    </>
  );
}
function Sec({ id, title, lead, children }) {
  return (
    <section className="sec" id={id}>
      {title && <h2>{title}</h2>}
      {lead && <p className="lead">{lead}</p>}
      {children}
    </section>
  );
}
function Code({ code, lang = "jsx" }) {
  return (
    <div className="code">
      <pre><code style={{ background: "none", padding: 0, color: "inherit", fontSize: "inherit" }}>{code}</code></pre>
      <button type="button" className="icon-btn" aria-label="Copy code" title="Copy code" onClick={() => copy(code, "Code copied")}><Icon name="copy" size={15} /></button>
    </div>
  );
}

/* Tokens are parsed from the canonical stylesheet at runtime, so this site can
   never drift from colors_and_type.css. Values are resolved through computed style,
   which means the dark theme is reflected live. */
let tokenCache = null;
function useTokens(themeKey) {
  const [names, setNames] = React.useState(tokenCache);
  React.useEffect(() => {
    if (tokenCache) return;
    fetch("colors_and_type.css").then((r) => r.text()).then((css) => {
      /* Parse every :root block — colors_and_type.css has two (brand tokens
         and semantic aliases) and the token list must reflect both. */
      const re = /:root\s*\{([^}]*)\}/g;
      const out = [];
      const decl = /--([a-z0-9-]+)\s*:\s*([^;]+);(?:\s*\/\*\s*([^*]*?)\s*\*\/)?/gi;
      let block, m;
      while ((block = re.exec(css)) !== null) {
        while ((m = decl.exec(block[1])) !== null) {
          out.push({ name: "--" + m[1], raw: m[2].trim(), note: (m[3] || "").replace(/@kind\s+\w+/, "").trim() });
        }
        decl.lastIndex = 0;
      }
      tokenCache = out;
      setNames(out);
    }).catch(() => setNames([]));
  }, []);
  return React.useMemo(() => {
    if (!names) return null;
    const cs = getComputedStyle(document.documentElement);
    return names.map((t) => ({ ...t, value: cs.getPropertyValue(t.name).trim() || t.raw }));
  }, [names, themeKey]);
}
function useTheme() {
  const [theme, setThemeState] = React.useState(() => document.documentElement.getAttribute("data-theme") || "light");
  React.useEffect(() => {
    const obs = new MutationObserver(() => setThemeState(document.documentElement.getAttribute("data-theme") || "light"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

/* Readable ink for a swatch background */
function inkFor(hex) {
  const h = (hex || "").replace("#", "");
  if (h.length !== 6) return "var(--fg-1)";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.4 ? "#0D1C2F" : "#FFFFFF";
}

Object.assign(window, { NS, ds, Icon, notify, copy, Toaster, Page, Sec, Code, useTokens, useTheme, inkFor });
