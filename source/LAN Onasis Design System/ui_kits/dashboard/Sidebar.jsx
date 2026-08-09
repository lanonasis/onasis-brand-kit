/* global React */

function SidebarItem({ icon, label, active, badge, onClick }) {
  return (
    <button className="sb-item" data-active={active || undefined} onClick={onClick}>
      <i data-lucide={icon}></i>
      <span>{label}</span>
      {badge && <span className="sb-badge">{badge}</span>}
    </button>
  );
}

function Sidebar({ view, setView }) {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); }, [view]);
  return (
    <aside className="sb">
      <div className="sb-brand">
        <img src="../../assets/logos/app-icon-64.png" alt="" />
        <div>
          <div className="sb-brand-name">VortexCore</div>
          <div className="sb-brand-org">Lan Onasis · af-west-1</div>
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-section-h">Workspace</div>
        <SidebarItem icon="layout-dashboard" label="Overview" active={view === "overview"} onClick={() => setView("overview")} />
        <SidebarItem icon="layers" label="Memories" badge="142" active={view === "memories"} onClick={() => setView("memories")} />
        <SidebarItem icon="bar-chart-3" label="Analytics" />
        <SidebarItem icon="terminal" label="API explorer" />
      </div>

      <div className="sb-section">
        <div className="sb-section-h">Platform</div>
        <SidebarItem icon="key-round" label="API keys" />
        <SidebarItem icon="users" label="Team" />
        <SidebarItem icon="shield-check" label="Audit log" />
        <SidebarItem icon="settings" label="Settings" active={view === "settings"} onClick={() => setView("settings")} />
      </div>

      <div className="sb-foot">
        <div className="sb-status">
          <span className="dot" />
          <div>
            <div className="sb-status-l">All systems operational</div>
            <div className="sb-status-d">99.99% · trailing 30d</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
