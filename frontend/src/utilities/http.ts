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
}: RequestOptions): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: params ? JSON.stringify(params) : undefined,
    credentials: "include",
  });

  return parseResponse<T>(response);
}
