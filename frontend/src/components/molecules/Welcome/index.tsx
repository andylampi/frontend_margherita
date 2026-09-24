import { dictionary } from "../../../i18n";
import "./index.css";

function Welcome() {
  return (
    <div className="welcome">
      <svg
        className="welcome-figure"
        viewBox="0 0 120 160"
        width="120"
        height="160"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="60" cy="30" r="16" />
        <circle cx="54" cy="27" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="66" cy="27" r="1.5" fill="currentColor" stroke="none" />
        <path d="M53 35 Q60 41 67 35" strokeWidth="3" />
        <line x1="60" y1="46" x2="60" y2="100" />
        <line x1="60" y1="60" x2="36" y2="84" />
        <g className="welcome-arm">
          <line x1="60" y1="60" x2="86" y2="36" />
        </g>
        <line x1="60" y1="100" x2="42" y2="140" />
        <line x1="60" y1="100" x2="78" y2="140" />
      </svg>
      <p className="welcome-text">{dictionary.chat.welcome}</p>
    </div>
  );
}

export default Welcome;
