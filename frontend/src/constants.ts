import type { ErrorKey } from "./types";

export const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const STATUS_ERROR_MAP: Record<number, ErrorKey> = {
  400: "badRequest",
  401: "unauthorized",
  403: "forbidden",
  404: "notFound",
  500: "server",
};

export const AUTO_DISMISS_MS = 4000;
