export type Subject =
  | "math"
  | "english"
  | "science"
  | "korean"
  | "coding"
  | "essay"
  | "social_studies"
  | "other";

export type TeachingStyle =
  | "concept-first"
  | "problem-solving"
  | "small-group"
  | "intensive";

export type DistanceBasis = "home" | "school";

export type DeliveryMode = "offline" | "online" | "hybrid";

export type ReviewStatus = "draft" | "pending_review" | "published" | "suspended";

export type SourceType =
  | "academy_self_report"
  | "admin_verified"
  | "external_enrichment"
  | "system_derived";

export type RecommendationStatus = "open" | "waitlist_only" | "closed";

export type RecommendationReasonCode =
  | "SUBJECT_MATCH"
  | "GRADE_MATCH"
  | "SCHEDULE_MATCH"
  | "DISTANCE_MATCH"
  | "BUDGET_MATCH"
  | "STYLE_MATCH"
  | "VERIFIED_DATA"
  | "SHUTTLE_SUPPORT";

export type RecommendationWarningCode =
  | "WAITLIST_ONLY"
  | "STALE_DATA_WARNING"
  | "SELF_REPORTED_DATA"
  | "NO_SHUTTLE_SUPPORT"
  | "DISTANCE_OVER_LIMIT";

export interface PreferredTimeWindow {
  startMinuteOfDay: number;
  endMinuteOfDay: number;
}

export interface StructuredParentRequirement {
  regionCode: string;
  requestedLat: number;
  requestedLng: number;
  radiusMeters: number;
  distanceBasis: DistanceBasis;
  studentProfileId?: string;
  subject: Subject[];
  gradeBand: string;
  budgetMinKrw?: number;
  budgetMaxKrw?: number;
  preferredWeekdays: number[];
  preferredTimeWindow?: PreferredTimeWindow;
  needsShuttleSupport: boolean;
  teachingStyles: TeachingStyle[];
}

export interface RecommendationRequestSummary {
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
}

export interface CandidateSchedule {
  weekday: number;
  startMinuteOfDay: number;
  endMinuteOfDay: number;
}

export interface CandidateClass {
  classGroupId: string;
  programId: string;
  organizationId: string;
  branchId: string;
  regionCode: string;
  academyName: string;
  branchName: string;
  programName: string;
  classGroupName: string;
  subject: Subject;
  gradeBand: string;
  deliveryMode: DeliveryMode;
  monthlyFeeKrw: number;
  homeDistanceMeters: number;
  schoolDistanceMeters: number;
  supportsShuttle: boolean;
  teachingStyles: TeachingStyle[];
  schedules: CandidateSchedule[];
  maxCapacity: number;
  minOpenThreshold: number;
  reportedEnrolledCount: number;
  reservedCount: number;
  acceptsWaitlist: boolean;
  freshnessDays: number;
  verified: boolean;
  sourceType: SourceType;
  reviewStatus: ReviewStatus;
  messageEnabled: boolean;
}

export interface RankedRecommendation {
  programId: string;
  classGroupId: string;
  organizationId: string;
  branchId: string;
  academyName: string;
  branchName: string;
  programName: string;
  classGroupName: string;
  subject: Subject;
  gradeBand: string;
  deliveryMode: DeliveryMode;
  monthlyFeeKrw: number;
  score: number;
  status: RecommendationStatus;
  distanceMeters: number;
  distanceBasis: DistanceBasis;
  supportsShuttle: boolean;
  scheduleSummary: string[];
  freshnessDays: number;
  verified: boolean;
  reasonCodes: RecommendationReasonCode[];
  warningCodes: RecommendationWarningCode[];
}

export interface StoredRecommendationResult extends RankedRecommendation {
  resultId: string;
  rank: number;
  returnedToUser: boolean;
}

export interface StoredRecommendationSession {
  sessionId: string;
  publicSessionId?: string;
  parentUserId?: string;
  generatedAt: string;
  parserVersion: string;
  rankingVersion: string;
  requestSummary: RecommendationRequestSummary;
  structuredRequirement: StructuredParentRequirement;
  results: StoredRecommendationResult[];
}
