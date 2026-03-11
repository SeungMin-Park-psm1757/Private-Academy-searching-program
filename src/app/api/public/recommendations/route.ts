import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateRecommendationSessionUseCase } from "@/modules/recommendation/application/use-cases/create-recommendation-session.use-case";
import { MockRequirementParser } from "@/modules/recommendation/infrastructure/llm/mock-requirement-parser";
import {
  InMemoryRecommendationRepository,
  SUPPORTED_REGION_CODES,
} from "@/modules/recommendation/infrastructure/repositories/in-memory-recommendation.repository";
import { recommendationRequestSchema } from "@/modules/recommendation/presentation/recommendation-request.schema";
import { toRecommendationResponse } from "@/modules/recommendation/presentation/transformers/recommendation-card.transformer";
import { ApiErrorResponse } from "@/modules/recommendation/presentation/recommendation-api.contract";
import { createLogger } from "@/shared/lib/logger";
import {
  applyRequestIdHeader,
  getOrCreateRequestId,
} from "@/shared/lib/request-id";
import { runPublicBotProtection } from "@/shared/security/bot-protection";
import { checkRateLimit } from "@/shared/security/rate-limit";
import {
  applyPublicSessionCookie,
  getOrCreatePublicSessionId,
} from "@/shared/security/public-session";

export const runtime = "nodejs";

const createRecommendationSessionUseCase = new CreateRecommendationSessionUseCase(
  new MockRequirementParser(),
  new InMemoryRecommendationRepository(),
);
const logger = createLogger({
  module: "recommendation-public-post",
  route: "/api/public/recommendations",
});

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "anonymous";
  }

  return "anonymous";
}

function toFieldErrors(error: z.ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((accumulator, issue) => {
    const key = issue.path.join(".");

    if (key) {
      accumulator[key] = issue.message;
    }

    return accumulator;
  }, {});
}

function errorResponse(
  status: number,
  requestId: string,
  payload: ApiErrorResponse["error"],
  extraHeaders: Record<string, string> = {},
): NextResponse {
  const response = NextResponse.json(
    {
      error: {
        ...payload,
        requestId,
      },
    },
    { status },
  );

  response.headers.set("Cache-Control", "no-store");

  Object.entries(extraHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return applyRequestIdHeader(response, requestId);
}

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request.headers);
  const clientKey = getClientKey(request);
  const botProtection = await runPublicBotProtection(request);

  if (!botProtection.allowed) {
    logger.warn("Blocked recommendation request by bot protection", {
      requestId,
      clientKey,
      reason: botProtection.reason,
    });

    return errorResponse(429, requestId, {
      code: "RATE_LIMITED",
      message: "자동화된 요청으로 판단되어 잠시 차단되었습니다.",
    });
  }

  const rateLimit = checkRateLimit(`recommend:${clientKey}`, {
    windowMs: 60_000,
    maxRequests: 12,
  });

  if (!rateLimit.allowed) {
    logger.warn("Blocked recommendation request by rate limit", {
      requestId,
      clientKey,
      retryAfterMs: rateLimit.retryAfterMs,
    });

    return errorResponse(
      429,
      requestId,
      {
      code: "RATE_LIMITED",
      message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      },
      {
        "Retry-After": Math.max(1, Math.ceil(rateLimit.retryAfterMs / 1000)).toString(),
      },
    );
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return errorResponse(400, requestId, {
      code: "VALIDATION_ERROR",
      message: "JSON 본문을 해석하지 못했습니다.",
    });
  }

  const parsed = recommendationRequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    logger.warn("Recommendation request failed validation", {
      requestId,
      issueCount: parsed.error.issues.length,
    });

    return errorResponse(400, requestId, {
      code: "VALIDATION_ERROR",
      message: "요청 값이 올바르지 않습니다.",
      fieldErrors: toFieldErrors(parsed.error),
    });
  }

  if (
    !SUPPORTED_REGION_CODES.some(
      (regionCode) => regionCode === parsed.data.location.regionCode,
    )
  ) {
    logger.warn("Recommendation request used unsupported region", {
      requestId,
      regionCode: parsed.data.location.regionCode,
    });

    return errorResponse(400, requestId, {
      code: "UNSUPPORTED_REGION",
      message: "현재는 선택한 지역에서만 추천을 제공합니다.",
    });
  }

  try {
    const { publicSessionId } = getOrCreatePublicSessionId(request);
    const session = await createRecommendationSessionUseCase.execute({
      publicSessionId,
      request: parsed.data,
    });

    const response = NextResponse.json(toRecommendationResponse(session));
    response.headers.set("Cache-Control", "no-store");
    logger.info("Created recommendation session", {
      requestId,
      sessionId: session.sessionId,
      resultCount: session.results.filter((result) => result.returnedToUser).length,
    });

    return applyRequestIdHeader(
      applyPublicSessionCookie(response, publicSessionId),
      requestId,
    );
  } catch (error) {
    logger.error("Failed to create recommendation session", {
      requestId,
      error: error instanceof Error ? error.message : "unknown_error",
    });

    return errorResponse(500, requestId, {
      code: "INTERNAL_ERROR",
      message: "추천 결과를 생성하지 못했습니다.",
    });
  }
}
