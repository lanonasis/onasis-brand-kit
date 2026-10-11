/* global React */

function Footer() {
  const cols = [
    {
      h: "Platform",
      links: ["VortexCore AI", "Memory as a Service", "OnasisGateway", "Pricing"],
    },
    {
      h: "Solutions",
      links: ["Financial Services", "Logistics", "Enterprise", "Developers"],
    },
    {
      h: "Resources",
      links: ["Docs", "Status", "Changelog", "Blog"],
    },
    {
      h: "Company",
      links: ["About", "Customers", "Careers", "Contact"],
    },
  ];
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="../../assets/logos/wordmark-lockup-on-dark.png" alt="LAN Onasis" />
          <p className="footer-tag">
            Powering Africa's digital future. Enterprise SaaS — built local,
            built for scale.
          </p>
          <div className="footer-region">
            <span className="dot" /> All systems operational · af-west-1
          </div>
        </div>
        <div className="footer-cols">
          {cols.map((c) => (
            <div className="footer-col" key={c.h}>
              <div className="footer-col-h">{c.h}</div>
              {c.links.map((l) => (
                <a href="#" key={l}>{l}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-sub">
        <div>© 2026 LAN Onasis. All rights reserved.</div>
        <div className="footer-sub-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
