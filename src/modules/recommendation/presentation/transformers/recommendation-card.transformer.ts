import { explainRecommendation } from "@/modules/recommendation/domain/explanation-policy";
import { StoredRecommendationResult, StoredRecommendationSession } from "@/modules/recommendation/domain/types";
import {
  RecommendationCardDto,
  RecommendationResponse,
} from "../recommendation-api.contract";

function toFitTier(score: number): "high" | "medium" {
  return score >= 70 ? "high" : "medium";
}

function toRecommendationCardDto(
  recommendation: StoredRecommendationResult,
): RecommendationCardDto {
  const explanation = explainRecommendation(recommendation);

  return {
    resultId: recommendation.resultId,
    rank: recommendation.rank as 1 | 2 | 3,
    academyBranchId: recommendation.branchId,
    academyName: recommendation.academyName,
    branchName: recommendation.branchName,
    programName: recommendation.programName,
    classGroupName: recommendation.classGroupName,
    subject: recommendation.subject,
    gradeBand: recommendation.gradeBand,
    deliveryMode: recommendation.deliveryMode,
    monthlyFeeKrw: recommendation.monthlyFeeKrw,
    distanceMeters: recommendation.distanceMeters,
    distanceBasis: recommendation.distanceBasis,
    supportsShuttle: recommendation.supportsShuttle,
    scheduleSummary: recommendation.scheduleSummary,
    status: recommendation.status === "open" ? "open" : "waitlist_only",
    fitTier: toFitTier(recommendation.score),
    reasons: explanation.reasons.slice(0, 4),
    warnings: explanation.warnings.slice(0, 2),
    freshness: {
      verified: recommendation.verified,
      daysSinceUpdate: recommendation.freshnessDays,
    },
    cta: recommendation.status === "open"
      ? {
          type: "start_message",
          requiresAuth: true,
          label: "플랫폼 메시지로 문의",
        }
      : {
          type: "join_waitlist",
          requiresAuth: true,
          label: "대기열 신청하기",
        },
  };
}

export function toRecommendationResponse(
  session: StoredRecommendationSession,
): RecommendationResponse {
  return {
    sessionId: session.sessionId,
    generatedAt: session.generatedAt,
    requestSummary: session.requestSummary,
    results: session.results
      .filter((result) => result.returnedToUser)
      .slice(0, 3)
      .map(toRecommendationCardDto),
    meta: {
      resultPolicy: "TOP_3_ONLY",
      parserVersion: session.parserVersion,
      rankingVersion: session.rankingVersion,
    },
  };
}
