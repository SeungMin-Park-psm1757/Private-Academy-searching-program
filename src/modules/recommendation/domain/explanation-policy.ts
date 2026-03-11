import {
  RankedRecommendation,
  RecommendationReasonCode,
  RecommendationWarningCode,
} from "./types";

const reasonMessageMap: Record<RecommendationReasonCode, string> = {
  SUBJECT_MATCH: "희망 과목과 일치합니다.",
  GRADE_MATCH: "대상 학년과 맞는 반입니다.",
  SCHEDULE_MATCH: "선호 시간대와 일정이 맞습니다.",
  DISTANCE_MATCH: "선택한 이동 반경 안에 있습니다.",
  BUDGET_MATCH: "예산 범위와 잘 맞습니다.",
  STYLE_MATCH: "원하는 수업 스타일과 가깝습니다.",
  VERIFIED_DATA: "운영 검수 또는 검증 이력이 있습니다.",
  SHUTTLE_SUPPORT: "차량 지원이 확인된 학원입니다.",
};

const warningMessageMap: Record<RecommendationWarningCode, string> = {
  WAITLIST_ONLY: "즉시 등록보다는 대기열 안내가 더 적합합니다.",
  STALE_DATA_WARNING: "최근 정보 갱신일을 한 번 더 확인해 주세요.",
  SELF_REPORTED_DATA: "학원 자체 입력 정보 비중이 높은 데이터입니다.",
  NO_SHUTTLE_SUPPORT: "차량 지원이 필요하지만 확인된 지원 정보가 없습니다.",
  DISTANCE_OVER_LIMIT: "선택 반경을 넘지만 차량 지원 조건으로 후보에 남았습니다.",
};

export function explainRecommendation(recommendation: RankedRecommendation): {
  reasons: string[];
  warnings: string[];
} {
  return {
    reasons: recommendation.reasonCodes.map((code) => reasonMessageMap[code]),
    warnings: recommendation.warningCodes.map((code) => warningMessageMap[code]),
  };
}
