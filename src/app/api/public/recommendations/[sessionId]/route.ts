import { NextRequest, NextResponse } from "next/server";
import { GetRecommendationSessionUseCase } from "@/modules/recommendation/application/use-cases/get-recommendation-session.use-case";
import { InMemoryRecommendationRepository } from "@/modules/recommendation/infrastructure/repositories/in-memory-recommendation.repository";
import { toRecommendationResponse } from "@/modules/recommendation/presentation/transformers/recommendation-card.transformer";
import { ApiErrorResponse } from "@/modules/recommendation/presentation/recommendation-api.contract";
import { createLogger } from "@/shared/lib/logger";
import {
  applyRequestIdHeader,
  getOrCreateRequestId,
} from "@/shared/lib/request-id";
import { getPublicSessionId } from "@/shared/security/public-session";

export const runtime = "nodejs";

const getRecommendationSessionUseCase = new GetRecommendationSessionUseCase(
  new InMemoryRecommendationRepository(),
);
const logger = createLogger({
  module: "recommendation-public-get",
  route: "/api/public/recommendations/[sessionId]",
});

function errorResponse(
  status: number,
  requestId: string,
  payload: ApiErrorResponse["error"],
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

  return applyRequestIdHeader(response, requestId);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> },
) {
  const requestId = getOrCreateRequestId(request.headers);
  const { sessionId } = await context.params;
  const publicSessionId = getPublicSessionId(request);
  const session = await getRecommendationSessionUseCase.execute(sessionId);

  if (
    !session ||
    !publicSessionId ||
    !session.publicSessionId ||
    session.publicSessionId !== publicSessionId
  ) {
    logger.warn("Recommendation session lookup denied", {
      requestId,
      sessionId,
      hasPublicSession: Boolean(publicSessionId),
    });

    return errorResponse(404, requestId, {
      code: "SESSION_NOT_FOUND",
      message: "추천 세션을 찾을 수 없습니다.",
    });
  }

  const response = NextResponse.json(toRecommendationResponse(session));
  response.headers.set("Cache-Control", "no-store");
  logger.info("Loaded recommendation session", {
    requestId,
    sessionId,
  });

  return applyRequestIdHeader(response, requestId);
}
