import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/molecules/TopBar";
import type { LayoutContext } from "../types";

function Layout() {
  const [busy, setBusy] = useState(false);

  return (
    <div className="layout">
      <TopBar disabled={busy} />
      <div className="layout-content">
        <Outlet context={{ setBusy } satisfies LayoutContext} />
      </div>
    </div>
  );
}

export default Layout;
