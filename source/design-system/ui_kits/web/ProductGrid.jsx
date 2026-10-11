/* global React */

function ProductCard({ icon, eyebrow, title, body, footer, onClick }) {
  return (
    <button className="product-card" onClick={onClick}>
      <div className="product-icon">
        <i data-lucide={icon}></i>
      </div>
      <div className="product-eyebrow">{eyebrow}</div>
      <div className="product-title">{title}</div>
      <p className="product-body">{body}</p>
      <div className="product-foot">
        {footer} <span className="arrow">→</span>
      </div>
    </button>
  );
}

function ProductGrid({ onSelect }) {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  return (
    <section className="section">
      <div className="section-inner">
        <div className="section-head">
          <div className="eyebrow">Platform</div>
          <h2 className="h2">Three products. One unified stack.</h2>
          <p className="lede lede-narrow">
            From compliance-ready AI to a memory layer for your agents to a
            unified API gateway — every product shares the same auth, audit,
            and observability surface.
          </p>
        </div>
        <div className="product-grid">
          <ProductCard
            icon="brain"
            eyebrow="AI Platform"
            title="VortexCore AI"
            body="Compliance-aware business intelligence for enterprise. Credit assessment, risk, and predictive analytics — built for African markets."
            footer="Explore VortexCore"
            onClick={() => onSelect("VortexCore AI")}
          />
          <ProductCard
            icon="layers"
            eyebrow="Infrastructure"
            title="Memory as a Service"
            body="Persistent, queryable memory for AI agents. Sub-50ms reads in af-west-1, with audit logs and key rotation built in."
            footer="Explore MaaS"
            onClick={() => onSelect("Memory as a Service")}
          />
          <ProductCard
            icon="cloud"
            eyebrow="Integration"
            title="OnasisGateway"
            body="API gateway and workflow automation. One contract for legacy core banking, payments, and your modern microservices."
            footer="Explore Gateway"
            onClick={() => onSelect("OnasisGateway")}
          />
        </div>
      </div>
    </section>
  );
}

window.ProductGrid = ProductGrid;
