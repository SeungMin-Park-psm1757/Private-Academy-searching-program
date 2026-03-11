import {
  DeliveryMode,
  DistanceBasis,
  PreferredTimeWindow,
  StoredRecommendationSession,
  Subject,
  TeachingStyle,
} from "../domain/types";

export interface CreateRecommendationRequest {
  location: {
    regionCode: string;
    lat: number;
    lng: number;
    radiusMeters: number;
    distanceBasis: DistanceBasis;
  };
  student: {
    gradeBand: string;
    studentProfileId?: string;
  };
  filters: {
    subjects: Subject[];
    budgetMinKrw?: number;
    budgetMaxKrw?: number;
    preferredWeekdays?: number[];
    preferredTimeWindow?: PreferredTimeWindow;
    teachingStyles?: TeachingStyle[];
    needsShuttleSupport?: boolean;
  };
  freeText?: string;
}

export type RecommendationResultStatus = "open" | "waitlist_only";

export interface RecommendationCardDto {
  resultId: string;
  rank: 1 | 2 | 3;
  academyBranchId: string;
  academyName: string;
  branchName: string;
  programName: string;
  classGroupName: string;
  subject: Subject;
  gradeBand: string;
  deliveryMode: DeliveryMode;
  monthlyFeeKrw: number;
  distanceMeters: number;
  distanceBasis: DistanceBasis;
  supportsShuttle: boolean;
  scheduleSummary: string[];
  status: RecommendationResultStatus;
  fitTier: "high" | "medium";
  reasons: string[];
  warnings: string[];
  freshness: {
    verified: boolean;
    daysSinceUpdate: number;
  };
  cta: {
    type: "start_message" | "join_waitlist";
    requiresAuth: boolean;
    label: string;
  };
}

export interface RecommendationResponse {
  sessionId: string;
  generatedAt: string;
  requestSummary: {
    regionCode: string;
    gradeBand: string;
    subjects: Subject[];
    radiusMeters: number;
    distanceBasis: DistanceBasis;
    needsShuttleSupport: boolean;
    budgetMinKrw?: number;
    budgetMaxKrw?: number;
    preferredWeekdays?: number[];
    preferredTimeWindow?: PreferredTimeWindow;
  };
  results: RecommendationCardDto[];
  meta: {
    resultPolicy: "TOP_3_ONLY";
    parserVersion: string;
    rankingVersion: string;
  };
}

export interface ApiErrorResponse {
  error: {
    code:
      | "VALIDATION_ERROR"
      | "UNSUPPORTED_REGION"
      | "AUTH_REQUIRED"
      | "FORBIDDEN"
      | "SESSION_NOT_FOUND"
      | "RATE_LIMITED"
      | "RECOMMENDATION_UNAVAILABLE"
      | "INTERNAL_ERROR";
    message: string;
    fieldErrors?: Record<string, string>;
    requestId?: string;
  };
}

export type StoredSessionResponse = RecommendationResponse & {
  _session: StoredRecommendationSession;
};
