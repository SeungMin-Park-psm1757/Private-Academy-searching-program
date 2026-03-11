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
import { createRequestId } from "@/shared/lib/request-id";
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
  payload: ApiErrorResponse["error"],
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: payload }, { status });
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  const clientKey = getClientKey(request);
  const rateLimit = checkRateLimit(`recommend:${clientKey}`, {
    windowMs: 60_000,
    maxRequests: 12,
  });

  if (!rateLimit.allowed) {
    return errorResponse(429, {
      code: "RATE_LIMITED",
      message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      requestId,
    });
  }

  const parsed = recommendationRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return errorResponse(400, {
      code: "VALIDATION_ERROR",
      message: "요청 값이 올바르지 않습니다.",
      fieldErrors: toFieldErrors(parsed.error),
      requestId,
    });
  }

  if (
    !SUPPORTED_REGION_CODES.some(
      (regionCode) => regionCode === parsed.data.location.regionCode,
    )
  ) {
    return errorResponse(400, {
      code: "UNSUPPORTED_REGION",
      message: "현재는 선택한 지역에서만 추천을 제공합니다.",
      requestId,
    });
  }

  try {
    const { publicSessionId } = getOrCreatePublicSessionId(request);
    const session = await createRecommendationSessionUseCase.execute({
      publicSessionId,
      request: parsed.data,
    });

    const response = NextResponse.json(toRecommendationResponse(session));

    return applyPublicSessionCookie(response, publicSessionId);
  } catch {
    return errorResponse(500, {
      code: "INTERNAL_ERROR",
      message: "추천 결과를 생성하지 못했습니다.",
      requestId,
    });
  }
}
