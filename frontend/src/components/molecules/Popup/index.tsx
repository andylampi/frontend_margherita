import { useEffect, useState } from "react";
import { dictionary } from "../../../i18n";
import type { PopupProps } from "../../../types";
import "./index.css";

function Popup({ status, text, onClose }: PopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const message = text ?? dictionary.popup[status];

  return (
    <div className={`popup popup--${status} ${visible ? "popup--visible" : ""}`.trim()} role="alert">
      <span className="popup-text">{message}</span>
      {onClose && (
        <button type="button" className="popup-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
}

export default Popup;
