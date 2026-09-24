import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { dictionary } from "../../../i18n";
import "./index.css";

const LINKS = [
  { to: "/chat", label: dictionary.nav.chats },
  { to: "/documents", label: dictionary.nav.documents },
];

function TopBar() {
  const { logout } = useAuth();

  return (
    <header className="top-bar">
      <nav className="top-bar-nav">
        {LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `top-bar-link ${isActive ? "top-bar-link--active" : ""}`.trim()
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <button type="button" className="top-bar-logout" onClick={logout}>
        {dictionary.nav.logout}
      </button>
    </header>
  );
}

export default TopBar;
