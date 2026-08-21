/* global React */

function ChartCard() {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  // Generate a smooth synthetic curve
  const W = 760, H = 220, N = 60;
  const data = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    return 50 + 30 * Math.sin(t * 6) + 18 * Math.sin(t * 11) + 22 * t * 100 / 100;
  });
  const max = Math.max(...data) + 10;
  const min = Math.min(...data) - 10;
  const range = max - min;
  const xs = data.map((_, i) => (i / (N - 1)) * W);
  const ys = data.map((v) => H - ((v - min) / range) * H);
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = path + ` L${W},${H} L0,${H} Z`;
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <section className="card chart-card">
      <header className="card-head">
        <div>
          <div className="card-eyebrow">Last 7 days</div>
          <h2 className="card-title">Request volume</h2>
        </div>
        <div className="seg">
          <button>1h</button>
          <button>24h</button>
          <button data-active>7d</button>
          <button>30d</button>
        </div>
      </header>
      <div className="chart">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#00D4AA" stopOpacity="0.32" />
              <stop offset="1" stopColor="#00D4AA" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((p) => (
            <line key={p} x1="0" x2={W} y1={H * p} y2={H * p} stroke="rgba(27,54,93,.06)" strokeDasharray="3 3" />
          ))}
          <path d={area} fill="url(#ag)" />
          <path d={path} fill="none" stroke="#00D4AA" strokeWidth="2.5" />
        </svg>
      </div>
      <div className="chart-x">
        {labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </section>
  );
}

window.ChartCard = ChartCard;
