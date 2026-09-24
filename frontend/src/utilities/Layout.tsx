import { Outlet } from "react-router-dom";
import TopBar from "../components/molecules/TopBar";

function Layout() {
  return (
    <div className="layout">
      <TopBar />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
