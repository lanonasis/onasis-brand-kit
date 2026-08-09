/* global React */

function Hero({ onPrimary }) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">Africa-built · Enterprise SaaS</div>
          <h1 className="display">
            Powering Africa's<br />
            <span className="display-accent">digital future.</span>
          </h1>
          <p className="lede">
            LAN Onasis builds intelligent, secure, and scalable infrastructure for
            financial services, logistics, AI, and enterprise platforms. One brand.
            One stack. Built for the continent.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={onPrimary}>
              Get a demo
            </button>
            <a className="btn btn-outline btn-lg" href="#">
              Read the docs <span className="arrow">→</span>
            </a>
          </div>
          <div className="hero-meta">
            <span className="dot" />
            <span>SOC 2 Type II · ISO 27001 · 99.99% uptime SLA</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-card">
            <div className="hero-card-head">
              <img src="../../assets/logos/app-icon-64.png" alt="" />
              <div>
                <div className="hero-card-title">VortexCore</div>
                <div className="hero-card-sub">af-west-1 · operational</div>
              </div>
              <span className="badge badge-success">
                <span className="dot-sm" />Live
              </span>
            </div>
            <div className="hero-card-grid">
              <div className="hero-stat">
                <div className="hero-stat-k">Requests / min</div>
                <div className="hero-stat-v">142,309</div>
                <div className="hero-stat-d up">+12.4% vs avg</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-k">P95 latency</div>
                <div className="hero-stat-v">38<small>ms</small></div>
                <div className="hero-stat-d">af-west-1</div>
              </div>
            </div>
            <div className="hero-spark">
              <svg viewBox="0 0 280 60" preserveAspectRatio="none">
                <path
                  d="M0,42 L20,38 L40,40 L60,32 L80,28 L100,30 L120,22 L140,24 L160,18 L180,12 L200,16 L220,8 L240,12 L260,6 L280,4"
                  fill="none"
                  stroke="#00D4AA"
                  strokeWidth="2"
                />
                <path
                  d="M0,42 L20,38 L40,40 L60,32 L80,28 L100,30 L120,22 L140,24 L160,18 L180,12 L200,16 L220,8 L240,12 L260,6 L280,4 L280,60 L0,60 Z"
                  fill="url(#g)"
                  opacity="0.25"
                />
                <defs>
                  <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#00D4AA" />
                    <stop offset="1" stopColor="#00D4AA" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
