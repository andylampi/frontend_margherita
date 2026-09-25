import { useState, type MouseEvent } from "react";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import { usePopup } from "../../utilities/Container";
import { BASE_URL } from "../../constants";
import "./index.css";

function Login() {
  const { showPopup } = usePopup();
  const { login } = useAuth();
  const { POST } = useApi();
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await POST({
        url: `${BASE_URL}/auth/login`,
        params: { user_id: "test" },
        headers: { "content-type": "application/json" },
      });
      login();
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      showPopup("dangerous", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card">
        <div className="login-avatar">
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </div>
        <Input
          type="email"
          name="email"
          placeholder="Username"
          autoComplete="email"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
        />
        <Button type="submit" onClick={handleLogin} disabled={loading}>
          Accedi
        </Button>
      </form>
    </div>
  );
}

export default Login;
