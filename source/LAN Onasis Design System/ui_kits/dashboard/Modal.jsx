/* global React */

function Modal({ title, children, onClose, footer }) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);
  return (
    <div className="scrim" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h3>{title}</h3>
          <button className="btn-icon-sm" onClick={onClose}><i data-lucide="x"></i></button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

window.Modal = Modal;
