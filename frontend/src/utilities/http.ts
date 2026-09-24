import type { RequestOptions } from "../types";

export class HttpError extends Error {
  status: number;

  constructor(status: number) {
    super(`Request failed with status ${status}`);
    this.name = "HttpError";
    this.status = status;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new HttpError(response.status);
  }

  // risposte in streaming (es. chat): per ora si legge il corpo come testo
  if (response.headers.get("content-type")?.includes("application/x-ndjson")) {
    return response.text() as Promise<T>;
  }

  return response.json() as Promise<T>;
}

export async function GET<T = unknown>({
  url,
  headers,
  params,
}: RequestOptions): Promise<T> {
  const query = params
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : "";

  const response = await fetch(`${url}${query}`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  return parseResponse<T>(response);
}

export async function POST<T = unknown>({
  url,
  headers,
  params,
  body,
}: RequestOptions): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    // con FormData il browser imposta da solo il content-type multipart con boundary
    body: body ?? (params ? JSON.stringify(params) : undefined),
    credentials: "include",
  });

  return parseResponse<T>(response);
}
