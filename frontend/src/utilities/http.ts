import type { RequestOptions, StreamRequestOptions } from "../types";

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

// POST con risposta NDJSON: chiama onChunk per ogni riga appena arriva
export async function POST_STREAM<T = unknown>({
  url,
  headers,
  params,
  onChunk,
}: StreamRequestOptions<T>): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: params ? JSON.stringify(params) : undefined,
    credentials: "include",
  });

  if (!response.ok || !response.body) {
    throw new HttpError(response.status);
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += value;
    const lines = buffer.split("\n");
    // l'ultima riga può essere incompleta: resta nel buffer fino al prossimo pezzo
    buffer = lines.pop() ?? "";
    lines.filter(Boolean).forEach((line) => onChunk(JSON.parse(line) as T));
  }

  if (buffer.trim()) {
    onChunk(JSON.parse(buffer) as T);
  }
}
