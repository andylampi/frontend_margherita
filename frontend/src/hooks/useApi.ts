import { useNavigate } from "react-router-dom";
import type { RequestOptions } from "../types";
import { ApiError, GET as apiGet, POST as apiPost } from "../utilities/api";
import { useAuthState } from "../utilities/Container";

export function useApi() {
  const navigate = useNavigate();
  const { setIsLogged } = useAuthState();

  function handleError(error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      setIsLogged(false);
      navigate("/login");
    }
  }

  async function GET<T = unknown>(options: RequestOptions): Promise<T> {
    try {
      return await apiGet<T>(options);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  async function POST<T = unknown>(options: RequestOptions): Promise<T> {
    try {
      return await apiPost<T>(options);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  return { GET, POST };
}
