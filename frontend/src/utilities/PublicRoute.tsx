import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PublicRoute() {
  const { isLogged } = useAuth();

  if (isLogged) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
