import { dictionary } from "../i18n";
import {
  GET as httpGet,
  HttpError,
  POST as httpPost,
  POST_STREAM as httpPostStream,
} from "./http";
import type { RequestOptions, StreamRequestOptions } from "../types";
import { STATUS_ERROR_MAP } from "../constants";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof HttpError) {
    const key = STATUS_ERROR_MAP[error.status] ?? "unknown";
    return new ApiError(dictionary.errors[key], error.status);
  }

  return new ApiError(dictionary.errors.network);
}

export async function GET<T = unknown>(options: RequestOptions): Promise<T> {
  try {
    return await httpGet<T>(options);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function POST<T = unknown>(options: RequestOptions): Promise<T> {
  try {
    return await httpPost<T>(options);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function POST_STREAM<T = unknown>(
  options: StreamRequestOptions<T>,
): Promise<void> {
  try {
    await httpPostStream<T>(options);
  } catch (error) {
    throw toApiError(error);
  }
}
