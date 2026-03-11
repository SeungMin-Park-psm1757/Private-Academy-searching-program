import { NextRequest } from "next/server";
import { getServerEnv } from "@/shared/lib/env";

export function isAuthorizedCronRequest(request: NextRequest): boolean {
  const env = getServerEnv();
  const authorization = request.headers.get("authorization");

  if (env.cronSecret) {
    return authorization === `Bearer ${env.cronSecret}`;
  }

  if (request.headers.has("x-vercel-cron")) {
    return true;
  }

  return env.deploymentEnvironment !== "production";
}
