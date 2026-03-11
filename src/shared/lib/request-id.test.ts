import { describe, expect, it } from "vitest";
import { NextResponse } from "next/server";
import {
  applyRequestIdHeader,
  createRequestId,
  getOrCreateRequestId,
  REQUEST_ID_HEADER,
} from "./request-id";

describe("request id helpers", () => {
  it("reuses the incoming request id when present", () => {
    const headers = new Headers({
      [REQUEST_ID_HEADER]: "req_existing",
    });

    expect(getOrCreateRequestId(headers)).toBe("req_existing");
  });

  it("creates a request id when the header is missing", () => {
    const requestId = getOrCreateRequestId(new Headers());

    expect(requestId).toMatch(/^req_[a-f0-9]{26}$/);
  });

  it("applies the request id to the response headers", () => {
    const response = NextResponse.json({ ok: true });
    const requestId = createRequestId();

    applyRequestIdHeader(response, requestId);

    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
  });
});
