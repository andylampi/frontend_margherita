import { useId, useState } from "react";
import { dictionary } from "../../../i18n";
import type { CitationsAccordionProps } from "../../../types";
import "./index.css";

function CitationsAccordion({ citations, onCitationClick }: CitationsAccordionProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={`citations ${open ? "citations--open" : ""}`.trim()}>
      <button
        type="button"
        className="citations-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>
          {dictionary.citations.title} ({citations.length})
        </span>
        <svg
          className="citations-chevron"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul id={panelId} className="citations-list">
          {citations.map((citation, index) => (
            <li
              key={`${citation.document_id}-${citation.page_number}-${index}`}
              className="citations-item"
            >
              <button
                type="button"
                className="citations-link"
                onClick={() => onCitationClick?.(citation)}
              >
                <span className="citations-filename" title={citation.filename}>
                  {citation.filename}
                </span>
                <span className="citations-page">
                  {dictionary.citations.page} {citation.page_number}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitationsAccordion;
