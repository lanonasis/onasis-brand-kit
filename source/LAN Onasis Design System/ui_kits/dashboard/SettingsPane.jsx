/* global React */
const { useState } = React;

function SettingsPane({ openModal }) {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const [region, setRegion] = useState("af-west-1");
  return (
    <div className="settings">
      <section className="card">
        <header className="card-head">
          <div>
            <h2 className="card-title">API keys</h2>
            <div className="card-sub">Used by your services to call the LAN Onasis platform.</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openModal}>
            <i data-lucide="plus"></i>Generate key
          </button>
        </header>
        <ul className="key-list">
          <li>
            <div className="key-name">production-af-west</div>
            <code className="key-val">ln_sk_live_•••••••••••••••8a4f</code>
            <span className="pill pill-ok"><span className="pill-dot" />Active</span>
            <button className="btn-icon-sm" title="Rotate"><i data-lucide="rotate-cw"></i></button>
          </li>
          <li>
            <div className="key-name">staging</div>
            <code className="key-val">ln_sk_test_•••••••••••••••2c91</code>
            <span className="pill pill-info"><span className="pill-dot" />Test</span>
            <button className="btn-icon-sm" title="Rotate"><i data-lucide="rotate-cw"></i></button>
          </li>
          <li>
            <div className="key-name">ada@lanonasis.com (personal)</div>
            <code className="key-val">ln_sk_test_•••••••••••••••f018</code>
            <span className="pill pill-warn"><span className="pill-dot" />Expires in 4 days</span>
            <button className="btn-icon-sm" title="Rotate"><i data-lucide="rotate-cw"></i></button>
          </li>
        </ul>
      </section>

      <section className="card">
        <header className="card-head">
          <div>
            <h2 className="card-title">Region</h2>
            <div className="card-sub">Data residency for new memories.</div>
          </div>
        </header>
        <div className="region-grid">
          {["af-west-1 · Lagos", "af-east-1 · Nairobi", "eu-west-3 · Paris", "us-east-1 · Virginia"].map((r) => {
            const id = r.split(" · ")[0];
            return (
              <label key={r} className={"region-card " + (id === region ? "is-active" : "")}>
                <input type="radio" name="region" checked={id === region} onChange={() => setRegion(id)} />
                <div>
                  <div className="region-id">{id}</div>
                  <div className="region-loc">{r.split(" · ")[1]}</div>
                </div>
                {id === region && <i data-lucide="check"></i>}
              </label>
            );
          })}
        </div>
      </section>

      <section className="card card-danger">
        <header className="card-head">
          <div>
            <h2 className="card-title">Danger zone</h2>
            <div className="card-sub">Irreversible. Requires owner confirmation.</div>
          </div>
        </header>
        <div className="danger-row">
          <div>
            <div className="danger-l">Delete workspace</div>
            <div className="danger-d">Removes all memories, keys, and audit logs after a 7-day grace period.</div>
          </div>
          <button className="btn btn-danger btn-sm">Delete workspace…</button>
        </div>
      </section>
    </div>
  );
}

window.SettingsPane = SettingsPane;
