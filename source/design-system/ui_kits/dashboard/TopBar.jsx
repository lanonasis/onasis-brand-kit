/* global React */

function TopBar({ title, query, setQuery }) {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  return (
    <header className="tb">
      <div className="tb-l">
        <h1 className="tb-title">{title}</h1>
      </div>
      <div className="tb-r">
        <div className="tb-search">
          <i data-lucide="search"></i>
          <input
            placeholder="Search memories, keys, requests…"
            value={query || ""}
            onChange={(e) => setQuery && setQuery(e.target.value)}
          />
          <kbd>⌘K</kbd>
        </div>
        <button className="tb-icon" title="Region">
          <span className="tb-region"><span className="dot" />af-west-1</span>
        </button>
        <button className="tb-icon" title="Notifications">
          <i data-lucide="bell"></i>
          <span className="tb-icon-dot" />
        </button>
        <button className="tb-avatar" title="Account">
          <span>AO</span>
        </button>
      </div>
    </header>
  );
}

window.TopBar = TopBar;
