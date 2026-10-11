/* global React */

const ROWS = [
  { id: "mem_8af3c1", name: "credit-scoring-v3", region: "af-west-1", owner: "Ada O.", size: "12.4 MB", status: "live", updated: "2m ago" },
  { id: "mem_7c2e90", name: "kyc-doc-extractor", region: "af-west-1", owner: "Tunde A.", size: "3.1 MB", status: "live", updated: "14m ago" },
  { id: "mem_9bd417", name: "agent-policy-store", region: "af-east-1", owner: "Ngozi E.", size: "84.0 MB", status: "live", updated: "1h ago" },
  { id: "mem_2fa088", name: "merchant-risk-graph", region: "af-west-1", owner: "Ada O.", size: "208.3 MB", status: "syncing", updated: "3h ago" },
  { id: "mem_1ce302", name: "doyen-fleet-trips", region: "af-east-1", owner: "Kemi A.", size: "44.7 MB", status: "live", updated: "1d ago" },
  { id: "mem_5dd711", name: "legacy-core-banking", region: "eu-west-3", owner: "Tunde A.", size: "1.2 GB", status: "paused", updated: "3d ago" },
  { id: "mem_4ab209", name: "support-faq-cache", region: "af-west-1", owner: "Ngozi E.", size: "0.9 MB", status: "error", updated: "5d ago" },
];

const STATUS = {
  live: { c: "ok", l: "Live" },
  syncing: { c: "info", l: "Syncing" },
  paused: { c: "warn", l: "Paused" },
  error: { c: "err", l: "Error" },
};

function MemoriesTable({ query }) {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const q = (query || "").toLowerCase();
  const rows = ROWS.filter((r) =>
    !q || r.name.includes(q) || r.id.includes(q) || r.owner.toLowerCase().includes(q)
  );
  return (
    <section className="card">
      <header className="card-head">
        <div>
          <h2 className="card-title">Memories</h2>
          <div className="card-sub">{rows.length} of {ROWS.length} shown</div>
        </div>
        <div className="card-actions">
          <button className="btn btn-outline btn-sm"><i data-lucide="filter"></i>Filter</button>
          <button className="btn btn-primary btn-sm"><i data-lucide="plus"></i>New memory</button>
        </div>
      </header>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Region</th>
              <th>Owner</th>
              <th>Size</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const s = STATUS[r.status];
              return (
                <tr key={r.id}>
                  <td><div className="tbl-name">{r.name}</div></td>
                  <td><code>{r.id}</code></td>
                  <td>{r.region}</td>
                  <td>{r.owner}</td>
                  <td className="tbl-num">{r.size}</td>
                  <td>
                    <span className={"pill pill-" + s.c}>
                      <span className="pill-dot" />{s.l}
                    </span>
                  </td>
                  <td className="tbl-muted">{r.updated}</td>
                  <td><button className="tbl-row-action"><i data-lucide="more-horizontal"></i></button></td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan="8" className="tbl-empty">No memories match "{query}"</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

window.MemoriesTable = MemoriesTable;
