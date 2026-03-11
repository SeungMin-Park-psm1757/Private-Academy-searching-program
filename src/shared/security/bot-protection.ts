import { NextRequest } from "next/server";

export interface BotProtectionResult {
  allowed: boolean;
  provider: "stub";
  score: number;
  reason?: string;
}

export async function runPublicBotProtection(
  request: NextRequest,
): Promise<BotProtectionResult> {
  if (request.headers.get("x-bot-check") === "block") {
    return {
      allowed: false,
      provider: "stub",
      score: 0,
      reason: "manual_block_header",
    };
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const suspiciousAgent = /bot|crawler|spider/i.test(userAgent);

  return {
    allowed: true,
    provider: "stub",
    score: suspiciousAgent ? 0.45 : 0.95,
    reason: suspiciousAgent ? "suspicious_user_agent" : undefined,
  };
}
