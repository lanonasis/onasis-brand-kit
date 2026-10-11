/* global React */

function TrustStrip() {
  const items = [
    "DOYEN AUTOS",
    "SOC 2 TYPE II",
    "ISO 27001",
    "PCI DSS",
    "AWS PARTNER",
    "GDPR",
  ];
  return (
    <section className="trust-strip">
      <div className="trust-inner">
        <div className="trust-label">Trusted by partners across the continent</div>
        <div className="trust-row">
          {items.map((t) => (
            <div className="trust-item" key={t}>{t}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.TrustStrip = TrustStrip;
