/* global React */

function Sparkline({ data, up }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 120, H = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg className="sparkline" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={up ? "var(--ln-green-500)" : "var(--status-danger)"} strokeWidth="2" />
    </svg>
  );
}

function KpiCard({ label, value, unit, delta, up, spark }) {
  return (
    <div className="kpi">
      <div className="kpi-l">{label}</div>
      <div className="kpi-line">
        <div className="kpi-v">{value}{unit && <small>{unit}</small>}</div>
        <Sparkline data={spark} up={up} />
      </div>
      <div className={"kpi-d " + (up ? "up" : "down")}>
        <i data-lucide={up ? "trending-up" : "trending-down"}></i>
        {delta} <span>vs last 7 days</span>
      </div>
    </div>
  );
}

function KpiRow() {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const data = [
    { label: "Requests / 24h", value: "8.42", unit: "M", delta: "+12.4%", up: true, spark: [12, 14, 13, 16, 18, 17, 22, 24, 28, 26, 30, 34] },
    { label: "P95 latency", value: "38", unit: "ms", delta: "−4.2 ms", up: true, spark: [48, 46, 44, 45, 42, 40, 41, 39, 40, 38, 38, 37] },
    { label: "Active memories", value: "142", unit: "k", delta: "+1,204", up: true, spark: [120, 122, 125, 128, 130, 132, 134, 136, 138, 140, 141, 142] },
    { label: "Error rate", value: "0.04", unit: "%", delta: "+0.01%", up: false, spark: [0.02, 0.03, 0.02, 0.03, 0.04, 0.05, 0.04, 0.04, 0.05, 0.04, 0.04, 0.04] },
  ];
  return (
    <div className="kpi-grid">
      {data.map((k) => <KpiCard key={k.label} {...k} />)}
    </div>
  );
}

window.KpiRow = KpiRow;
