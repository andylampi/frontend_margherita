import { useCallback } from "react";
import type { RequestOptions, StreamRequestOptions } from "../types";
import {
  ApiError,
  GET as apiGet,
  POST as apiPost,
  POST_STREAM as apiPostStream,
} from "../utilities/api";
import { useAuth } from "./useAuth";

export function useApi() {
  const { unauthorized } = useAuth();

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        unauthorized();
      }
    },
    [unauthorized],
  );

  const GET = useCallback(
    async <T = unknown>(options: RequestOptions): Promise<T> => {
      try {
        return await apiGet<T>(options);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError],
  );

  const POST = useCallback(
    async <T = unknown>(options: RequestOptions): Promise<T> => {
      try {
        return await apiPost<T>(options);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError],
  );

  const POST_STREAM = useCallback(
    async <T = unknown>(options: StreamRequestOptions<T>): Promise<void> => {
      try {
        await apiPostStream<T>(options);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError],
  );

  return { GET, POST, POST_STREAM };
}
