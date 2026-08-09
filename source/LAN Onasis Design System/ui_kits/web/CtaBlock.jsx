/* global React */

function CtaBlock({ onPrimary }) {
  return (
    <section className="cta-block">
      <div className="cta-inner">
        <h2 className="h1 h1-on-dark">Ready when you are.</h2>
        <p className="lede lede-on-dark">
          A 30-minute walk-through with a solutions engineer. No slides — just
          your stack and our platform.
        </p>
        <div className="cta-actions">
          <button className="btn btn-primary btn-lg" onClick={onPrimary}>
            Get a demo
          </button>
          <a className="btn btn-ghost-on-dark btn-lg" href="#">Talk to sales</a>
        </div>
      </div>
    </section>
  );
}

window.CtaBlock = CtaBlock;
