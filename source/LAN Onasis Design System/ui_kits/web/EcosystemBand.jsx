/* global React */

function EcosystemBand() {
  const stats = [
    { v: "99.99%", k: "Uptime SLA", d: "Trailing 12 mo" },
    { v: "38ms", k: "P95 latency", d: "af-west-1" },
    { v: "₦12.4B+", k: "Processed", d: "Annualized" },
    { v: "4", k: "Regions", d: "Africa + EU edge" },
  ];
  return (
    <section className="band">
      <div className="band-inner">
        <div className="band-head">
          <div className="eyebrow eyebrow-on-dark">Ecosystem</div>
          <h2 className="h2 h2-on-dark">
            Enterprise-grade<br/>by every measure.
          </h2>
        </div>
        <div className="band-stats">
          {stats.map((s) => (
            <div className="band-stat" key={s.k}>
              <div className="band-stat-v">{s.v}</div>
              <div className="band-stat-k">{s.k}</div>
              <div className="band-stat-d">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.EcosystemBand = EcosystemBand;
