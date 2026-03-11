import { NextResponse } from "next/server";

export const REQUEST_ID_HEADER = "x-request-id";

export function createRequestId(): string {
  return `req_${crypto.randomUUID().replace(/-/g, "").slice(0, 26)}`;
}

export function getOrCreateRequestId(
  headers: Pick<Headers, "get">,
): string {
  return headers.get(REQUEST_ID_HEADER) ?? createRequestId();
}

export function applyRequestIdHeader(
  response: NextResponse,
  requestId: string,
): NextResponse;
export function applyRequestIdHeader<T>(
  response: NextResponse<T>,
  requestId: string,
): NextResponse<T>;
export function applyRequestIdHeader<T>(
  response: NextResponse<T>,
  requestId: string,
): NextResponse<T> {
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}
