import { NextRequest, NextResponse } from "next/server";
import { getAppUrl, getServerEnv } from "@/shared/lib/env";
import {
  applyRequestIdHeader,
  getOrCreateRequestId,
} from "@/shared/lib/request-id";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request.headers);
  const env = getServerEnv();
  const response = NextResponse.json({
    status: "ok",
    service: "academy-app-blueprint",
    checkedAt: new Date().toISOString(),
    requestId,
    environment: env.deploymentEnvironment,
    appUrl: getAppUrl(),
    authMode: env.authMode,
    features: {
      billingEnabled: env.billingEnabled,
      academyMessagingEnabled: env.academyMessagingEnabled,
      adminMfaEnforced: env.adminMfaEnforced,
    },
    integrations: {
      databaseConfigured: env.hasDatabaseUrl,
      kakaoLocalConfigured: env.hasKakaoLocalKey,
      openAiConfigured: env.hasOpenAiKey,
      tossConfigured: env.hasTossKeys,
    },
  });

  response.headers.set("Cache-Control", "no-store");

  return applyRequestIdHeader(response, requestId);
}
