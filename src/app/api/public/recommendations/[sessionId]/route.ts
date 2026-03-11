import { NextRequest, NextResponse } from "next/server";
import { GetRecommendationSessionUseCase } from "@/modules/recommendation/application/use-cases/get-recommendation-session.use-case";
import { InMemoryRecommendationRepository } from "@/modules/recommendation/infrastructure/repositories/in-memory-recommendation.repository";
import { toRecommendationResponse } from "@/modules/recommendation/presentation/transformers/recommendation-card.transformer";
import { ApiErrorResponse } from "@/modules/recommendation/presentation/recommendation-api.contract";
import { createRequestId } from "@/shared/lib/request-id";
import { getPublicSessionId } from "@/shared/security/public-session";

export const runtime = "nodejs";

const getRecommendationSessionUseCase = new GetRecommendationSessionUseCase(
  new InMemoryRecommendationRepository(),
);

function errorResponse(
  status: number,
  payload: ApiErrorResponse["error"],
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: payload }, { status });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> },
) {
  const requestId = createRequestId();
  const { sessionId } = await context.params;
  const publicSessionId = getPublicSessionId(request);
  const session = await getRecommendationSessionUseCase.execute(sessionId);

  if (
    !session ||
    !publicSessionId ||
    !session.publicSessionId ||
    session.publicSessionId !== publicSessionId
  ) {
    return errorResponse(404, {
      code: "SESSION_NOT_FOUND",
      message: "추천 세션을 찾을 수 없습니다.",
      requestId,
    });
  }

  return NextResponse.json(toRecommendationResponse(session));
}
