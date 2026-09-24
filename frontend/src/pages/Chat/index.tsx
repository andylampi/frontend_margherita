import { useState } from "react";
import "./index.css";

function Chat() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="chat-page">
      <aside
        className={`chat-menu ${collapsed ? "chat-menu--collapsed" : ""}`.trim()}
      >
        <button
          type="button"
          className="chat-menu-toggle"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Espandi menu" : "Comprimi menu"}
          aria-expanded={!collapsed}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        {!collapsed && <nav className="chat-menu-nav">Menu</nav>}
      </aside>
      <main className="chat-main">Chat</main>
    </div>
  );
}

export default Chat;
