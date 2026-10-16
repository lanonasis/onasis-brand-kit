/* App shell: hash router, sidebar, top bar, command palette, theme. */
const NAV = [
  { group: "Start", items: [
    { path: "/", label: "Overview", icon: "layout-grid" },
    { path: "/brand", label: "Brand", icon: "badge-check" },
  ]},
  { group: "Foundations", items: [
    { path: "/colors", label: "Colors", icon: "palette" },
    { path: "/typography", label: "Typography", icon: "type" },
    { path: "/foundations", label: "Space & motion", icon: "ruler" },
    { path: "/iconography", label: "Iconography", icon: "shapes" },
  ]},
  { group: "Build", items: [
    { path: "/components", label: "Components", icon: "component", count: "8" },
    { path: "/patterns", label: "Patterns", icon: "panels-top-left" },
  ]},
  { group: "Guidance", items: [
    { path: "/channels", label: "Channels", icon: "at-sign" },
    { path: "/guidelines", label: "Guidelines", icon: "book-open" },
  ]},
];
const FLAT = NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));

function parseHash() {
  const h = (location.hash || "#/").replace(/^#/, "") || "/";
  const parts = h.split("/").filter(Boolean);
  const path = "/" + (parts[0] || "");
  return { path: FLAT.some((i) => i.path === path) ? path : "/", sub: parts[1] || null };
}
function go(path, sub) { location.hash = path + (sub ? "/" + sub : ""); }

function useRoute() {
  const [route, setRoute] = React.useState(parseHash);
  React.useEffect(() => {
    const on = () => setRoute(parseHash());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

/* Theme: persisted, defaults to the OS preference. */
function initTheme() {
  let t = null;
  try { t = localStorage.getItem("ln-ds-theme"); } catch (e) {}
  if (!t) t = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
}
initTheme();
function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem("ln-ds-theme", next); } catch (e) {}
}

function Palette({ onClose }) {
  const [q, setQ] = React.useState("");
  const [i, setI] = React.useState(0);
  const items = React.useMemo(() => {
    const pages = FLAT.map((p) => ({ label: p.label, hint: p.group, icon: p.icon, run: () => go(p.path) }));
    const comps = (window.SITE_COMPONENTS || []).map((c) => ({ label: c.name, hint: "Component", icon: "component", run: () => go("/components", c.id) }));
    const acts = [{ label: "Toggle light / dark theme", hint: "Action", icon: "sun-moon", run: toggleTheme }];
    const all = [...pages, ...comps, ...acts];
    const s = q.trim().toLowerCase();
    return s ? all.filter((x) => x.label.toLowerCase().includes(s) || x.hint.toLowerCase().includes(s)) : all;
  }, [q]);
  React.useEffect(() => setI(0), [q]);
  const pick = (x) => { onClose(); setTimeout(x.run, 0); };
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setI((v) => Math.min(v + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setI((v) => Math.max(v - 1, 0)); }
    else if (e.key === "Enter" && items[i]) { e.preventDefault(); pick(items[i]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };
  return (
    <div className="pal-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Search the design system">
        <input autoFocus placeholder="Jump to a page, component or action…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} role="combobox" aria-expanded="true" aria-controls="pal-list" aria-activedescendant={"pal-" + i} />
        <ul id="pal-list" role="listbox">
          {items.map((x, n) => (
            <li key={x.label + n}>
              <button id={"pal-" + n} role="option" aria-selected={n === i} onMouseEnter={() => setI(n)} onClick={() => pick(x)}>
                <Icon name={x.icon} size={16} />{x.label}<small>{x.hint}</small>
              </button>
            </li>
          ))}
          {!items.length && <li className="empty">Nothing matches “{q}”.</li>}
        </ul>
      </div>
    </div>
  );
}

function Shell({ route, children }) {
  const [open, setOpen] = React.useState(false);
  const [pal, setPal] = React.useState(false);
  const theme = useTheme();
  const cur = FLAT.find((x) => x.path === route.path) || FLAT[0];
  const idx = FLAT.indexOf(cur);
  const prev = FLAT[idx - 1], next = FLAT[idx + 1];

  React.useEffect(() => {
    const on = (e) => {
      const typing = /input|textarea|select/i.test(document.activeElement && document.activeElement.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); setPal(true); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  React.useEffect(() => { setOpen(false); }, [route.path, route.sub]);

  /* Smooth navigation: new page → top; deep link → its section. */
  React.useEffect(() => {
    if (route.sub) {
      const t = setTimeout(() => {
        const el = document.getElementById(route.sub);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: "smooth" });
      }, 60);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route.path, route.sub]);

  return (
    <div className="app">
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main").focus(); }}>Skip to content</a>
      <aside className={"side" + (open ? " open" : "")} aria-label="Design system navigation">
        <a className="brand" href="#/">
          <img src="assets/logos/app-icon-64.png" width="36" height="36" alt="" style={{ borderRadius: "var(--r-md)" }} />
          <span><b>LAN Onasis</b><small>Design system · v2.0</small></span>
        </a>
        <button type="button" className="side-search" onClick={() => setPal(true)}><Icon name="search" size={15} />Search<kbd>⌘K</kbd></button>
        {NAV.map((g) => (
          <nav key={g.group} aria-label={g.group}>
            <div className="nav-h">{g.group}</div>
            {g.items.map((it) => (
              <a key={it.path} className="nav-a" href={"#" + it.path} aria-current={it.path === route.path ? "page" : undefined}>
                <Icon name={it.icon} size={17} />{it.label}{it.count && <span className="n">{it.count}</span>}
              </a>
            ))}
          </nav>
        ))}
        <div className="side-foot">
          Lan Onasis LLC<br />
          <a href="https://www.lanonasis.com" target="_blank" rel="noreferrer">lanonasis.com</a> · <a href="https://github.com/lanonasis/onasis-brand-kit" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </aside>
      {open && <div className="scrim-m" onClick={() => setOpen(false)}></div>}
      <div className="main">
        <header className="top">
          <div className="crumbs">
            <button type="button" className="icon-btn menu-btn" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? "x" : "menu"} size={19} /></button>
            <span>{cur.group}</span><Icon name="chevron-right" size={14} /><b>{cur.label}</b>
          </div>
          <div className="top-r">
            <button type="button" className="icon-btn" aria-label="Search" title="Search (⌘K)" onClick={() => setPal(true)}><Icon name="search" size={17} /></button>
            <button type="button" className="icon-btn" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} title="Toggle theme" onClick={toggleTheme}><Icon name={theme === "dark" ? "sun" : "moon"} size={17} /></button>
            <a className="icon-btn" href="https://github.com/lanonasis/onasis-brand-kit" target="_blank" rel="noreferrer" aria-label="Source on GitHub" title="Source on GitHub"><Icon name="github" size={17} /></a>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="content" key={route.path} style={{ outline: "none" }}>
          {children}
          <nav className="pn" aria-label="Pagination">
            {prev && <a href={"#" + prev.path}><span>← Previous</span><b>{prev.label}</b></a>}
            {next && <a className="nx" href={"#" + next.path}><span>Next →</span><b>{next.label}</b></a>}
          </nav>
        </main>
        <footer className="foot">
          <span>© 2026 Lan Onasis LLC · Future · Strategy · Tech</span>
          <nav aria-label="Lan Onasis elsewhere">
            <a href="mailto:info@lanonasis.com">info@lanonasis.com</a>
            <a href="https://www.linkedin.com/company/lan-onasis" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://x.com/lanonasis" target="_blank" rel="noreferrer">X</a>
            <a href="https://instagram.com/lanonasis" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://facebook.com/lanonasis" target="_blank" rel="noreferrer">Facebook</a>
          </nav>
        </footer>
      </div>
      {pal && <Palette onClose={() => setPal(false)} />}
      <Toaster />
    </div>
  );
}

Object.assign(window, { NAV, FLAT, go, useRoute, Shell, toggleTheme });
