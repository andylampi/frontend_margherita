import { createContext, useCallback, useContext, useRef, useState } from "react";
import Popup from "../components/molecules/Popup";
import { AUTO_DISMISS_MS } from "../constants";
import type {
  AppContainerProps,
  AuthContextValue,
  PopupContextValue,
  PopupState,
  PopupStatus,
} from "../types";

const PopupContext = createContext<PopupContextValue | null>(null);
const AuthContext = createContext<AuthContextValue | null>(null);

function AppContainer({ children }: AppContainerProps) {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const dismissTimeout = useRef<number | undefined>(undefined);

  const showPopup = useCallback((status: PopupStatus, text?: string) => {
    window.clearTimeout(dismissTimeout.current);
    setPopup({ status, text });
    dismissTimeout.current = window.setTimeout(() => {
      setPopup(null);
    }, AUTO_DISMISS_MS);
  }, []);

  const closePopup = useCallback(() => {
    window.clearTimeout(dismissTimeout.current);
    setPopup(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged }}>
      <PopupContext.Provider value={{ showPopup }}>
        {children}
        {popup && (
          <Popup status={popup.status} text={popup.text} onClose={closePopup} />
        )}
      </PopupContext.Provider>
    </AuthContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopup must be used within an AppContainer");
  }

  return context;
}

export function useAuthState() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthState must be used within an AppContainer");
  }

  return context;
}

export default AppContainer;
