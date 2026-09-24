import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function AuthRedirect() {
  const { isLogged } = useAuth();

  return <Navigate to={isLogged ? "/chat" : "/login"} replace />;
}

export default AuthRedirect;
