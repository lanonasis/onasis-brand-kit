/* global React */
const { useState } = React;

function NavLink({ href, children, active }) {
  return (
    <a href={href} className="nav-link" data-active={active || undefined}>
      {children}
    </a>
  );
}

function Nav({ onCta }) {
  const [open, setOpen] = useState(null);
  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#" className="nav-brand">
          <img src="../../assets/logos/app-icon-64.png" alt="LAN Onasis" className="nav-brand-icon" />
          <span className="nav-brand-word">LAN ONASIS</span>
        </a>
        <nav className="nav-links">
          <div
            className="nav-item"
            onMouseEnter={() => setOpen("products")}
            onMouseLeave={() => setOpen(null)}
          >
            <NavLink active={open === "products"}>Products ▾</NavLink>
            {open === "products" && (
              <div className="nav-menu">
                <div className="nav-menu-col">
                  <div className="nav-menu-eyebrow">Platform</div>
                  <a href="#">VortexCore AI</a>
                  <a href="#">Memory as a Service</a>
                  <a href="#">OnasisGateway</a>
                </div>
                <div className="nav-menu-col">
                  <div className="nav-menu-eyebrow">Verticals</div>
                  <a href="#">Financial Services</a>
                  <a href="#">Logistics</a>
                  <a href="#">Enterprise</a>
                </div>
              </div>
            )}
          </div>
          <NavLink>Solutions</NavLink>
          <NavLink>Developers</NavLink>
          <NavLink>Customers</NavLink>
          <NavLink>Pricing</NavLink>
        </nav>
        <div className="nav-actions">
          <a href="#" className="nav-link">Sign in</a>
          <button className="btn btn-primary" onClick={onCta}>
            Get a demo
          </button>
        </div>
      </div>
    </header>
  );
}

window.Nav = Nav;
