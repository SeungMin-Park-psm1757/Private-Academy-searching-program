import { NextRequest, NextResponse } from "next/server";
import {
  applyRequestIdHeader,
  getOrCreateRequestId,
} from "@/shared/lib/request-id";
import { isAuthorizedCronRequest } from "@/shared/security/cron-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request.headers);

  if (!isAuthorizedCronRequest(request)) {
    return applyRequestIdHeader(
      NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Cron request is not authorized.",
            requestId,
          },
        },
        { status: 403 },
      ),
      requestId,
    );
  }

  const response = NextResponse.json({
    status: "stub_ready",
    job: "place-source-sync",
    executedAt: new Date().toISOString(),
    nextStep: "Connect Kakao Local refresh and claim review seed reconciliation.",
  });

  response.headers.set("Cache-Control", "no-store");

  return applyRequestIdHeader(response, requestId);
}
