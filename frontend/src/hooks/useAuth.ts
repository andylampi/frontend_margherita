import { useCallback } from "react";
import { useAuthState } from "../utilities/Container";

export function useAuth() {
  const { isLogged, setIsLogged } = useAuthState();

  // unico punto in cui isLogged diventa true: login andato a buon fine
  const login = useCallback(() => setIsLogged(true), [setIsLogged]);

  // unico punto in cui isLogged diventa false: una fetch ha restituito 401
  const unauthorized = useCallback(() => setIsLogged(false), [setIsLogged]);

  // logout esplicito dell'utente dalla top bar
  const logout = useCallback(() => setIsLogged(false), [setIsLogged]);

  return { isLogged, login, unauthorized, logout };
}
