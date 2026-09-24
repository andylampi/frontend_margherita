import { useEffect } from "react";
import { BASE_URL } from "../constants";
import { useAuthState } from "../utilities/Container";
import { GET } from "../utilities/api";

export function useAuth() {
  const { isLogged, setIsLogged } = useAuthState();

  useEffect(() => {
    if (isLogged !== null) {
      return;
    }

    let cancelled = false;

    GET({ url: `${BASE_URL}/auth/me` })
      .then(() => {
        if (!cancelled) {
          setIsLogged(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLogged(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLogged, setIsLogged]);

  return { isLogged };
}
