/* global React */

function SplitFeature() {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  return (
    <section className="section section-muted">
      <div className="section-inner split">
        <div className="split-art">
          <div className="code-window">
            <div className="code-window-bar">
              <span className="cw-dot" style={{ background: "#FF5F56" }} />
              <span className="cw-dot" style={{ background: "#FFBD2E" }} />
              <span className="cw-dot" style={{ background: "#27C93F" }} />
              <div className="cw-title">vortex-deploy.sh</div>
            </div>
            <pre className="code-block">{`$ npx @lanonasis/cli deploy
  ↳ Building memory store...     ✓ 2.3s
  ↳ Provisioning af-west-1...    ✓ 4.1s
  ↳ Rotating keys...             ✓ 0.8s
  ↳ Health check...              ✓ 38ms

Deployed to https://api.lanonasis.com
`}</pre>
          </div>
        </div>
        <div className="split-copy">
          <div className="eyebrow">Developer experience</div>
          <h2 className="h2">Ship in five minutes.<br/>Audit forever.</h2>
          <p className="lede">
            One CLI, one SDK, one set of credentials. Every call is signed,
            logged, and queryable — no separate audit pipeline to wire up.
          </p>
          <ul className="checks">
            <li>
              <span className="check"><i data-lucide="check"></i></span>
              Native TypeScript, Python, and Go SDKs
            </li>
            <li>
              <span className="check"><i data-lucide="check"></i></span>
              Zero-trust auth with key rotation by default
            </li>
            <li>
              <span className="check"><i data-lucide="check"></i></span>
              Full audit trail surfaced in your existing SIEM
            </li>
            <li>
              <span className="check"><i data-lucide="check"></i></span>
              Region-pinned data residency (af-west-1, af-east-1)
            </li>
          </ul>
          <a href="#" className="btn btn-secondary">
            Read the integration guide
          </a>
        </div>
      </div>
    </section>
  );
}

window.SplitFeature = SplitFeature;
