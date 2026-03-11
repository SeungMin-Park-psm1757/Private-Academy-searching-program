import {
  RecommendationRepositoryPort,
  SaveRecommendationSessionInput,
} from "@/modules/recommendation/application/ports/recommendation-repository.port";
import {
  CandidateClass,
  StructuredParentRequirement,
  StoredRecommendationSession,
  Subject,
  TeachingStyle,
} from "@/modules/recommendation/domain/types";

const sampleCandidates: CandidateClass[] = [
  {
    classGroupId: "class-01",
    programId: "program-01",
    organizationId: "org-01",
    branchId: "branch-01",
    regionCode: "seoul-gangnam",
    academyName: "한빛수학학원",
    branchName: "대치점",
    programName: "중2 개념완성",
    classGroupName: "월수금 저녁반",
    subject: "math",
    gradeBand: "middle-2",
    deliveryMode: "offline",
    monthlyFeeKrw: 320000,
    homeDistanceMeters: 1200,
    schoolDistanceMeters: 900,
    supportsShuttle: true,
    teachingStyles: ["concept-first", "small-group"],
    schedules: [
      { weekday: 1, startMinuteOfDay: 1140, endMinuteOfDay: 1260 },
      { weekday: 3, startMinuteOfDay: 1140, endMinuteOfDay: 1260 },
      { weekday: 5, startMinuteOfDay: 1140, endMinuteOfDay: 1260 },
    ],
    maxCapacity: 12,
    minOpenThreshold: 4,
    reportedEnrolledCount: 9,
    reservedCount: 1,
    acceptsWaitlist: true,
    freshnessDays: 7,
    verified: true,
    sourceType: "admin_verified",
    reviewStatus: "published",
    messageEnabled: true,
  },
  {
    classGroupId: "class-02",
    programId: "program-02",
    organizationId: "org-02",
    branchId: "branch-02",
    regionCode: "seoul-gangnam",
    academyName: "오름수학전문학원",
    branchName: "도곡캠퍼스",
    programName: "중2 개념+유형",
    classGroupName: "월수 저녁반",
    subject: "math",
    gradeBand: "middle-2",
    deliveryMode: "offline",
    monthlyFeeKrw: 280000,
    homeDistanceMeters: 2100,
    schoolDistanceMeters: 1500,
    supportsShuttle: false,
    teachingStyles: ["small-group", "problem-solving"],
    schedules: [
      { weekday: 1, startMinuteOfDay: 1170, endMinuteOfDay: 1290 },
      { weekday: 3, startMinuteOfDay: 1170, endMinuteOfDay: 1290 },
    ],
    maxCapacity: 10,
    minOpenThreshold: 4,
    reportedEnrolledCount: 7,
    reservedCount: 1,
    acceptsWaitlist: true,
    freshnessDays: 41,
    verified: false,
    sourceType: "academy_self_report",
    reviewStatus: "published",
    messageEnabled: true,
  },
  {
    classGroupId: "class-03",
    programId: "program-03",
    organizationId: "org-03",
    branchId: "branch-03",
    regionCode: "seoul-gangnam",
    academyName: "리드업수학학원",
    branchName: "역삼점",
    programName: "중2 개념기초",
    classGroupName: "화목 저녁반",
    subject: "math",
    gradeBand: "middle-2",
    deliveryMode: "offline",
    monthlyFeeKrw: 240000,
    homeDistanceMeters: 2800,
    schoolDistanceMeters: 1900,
    supportsShuttle: true,
    teachingStyles: ["concept-first"],
    schedules: [
      { weekday: 2, startMinuteOfDay: 1140, endMinuteOfDay: 1260 },
      { weekday: 4, startMinuteOfDay: 1140, endMinuteOfDay: 1260 },
    ],
    maxCapacity: 10,
    minOpenThreshold: 5,
    reportedEnrolledCount: 3,
    reservedCount: 1,
    acceptsWaitlist: true,
    freshnessDays: 12,
    verified: true,
    sourceType: "admin_verified",
    reviewStatus: "published",
    messageEnabled: true,
  },
  {
    classGroupId: "class-04",
    programId: "program-04",
    organizationId: "org-04",
    branchId: "branch-04",
    regionCode: "seoul-gangnam",
    academyName: "정석코어매스",
    branchName: "개포라운지",
    programName: "중2 심화 유형반",
    classGroupName: "월수금 심화반",
    subject: "math",
    gradeBand: "middle-2",
    deliveryMode: "offline",
    monthlyFeeKrw: 360000,
    homeDistanceMeters: 1600,
    schoolDistanceMeters: 1200,
    supportsShuttle: false,
    teachingStyles: ["intensive", "problem-solving"],
    schedules: [
      { weekday: 1, startMinuteOfDay: 1140, endMinuteOfDay: 1260 },
      { weekday: 3, startMinuteOfDay: 1140, endMinuteOfDay: 1260 },
      { weekday: 5, startMinuteOfDay: 1140, endMinuteOfDay: 1260 },
    ],
    maxCapacity: 14,
    minOpenThreshold: 6,
    reportedEnrolledCount: 12,
    reservedCount: 0,
    acceptsWaitlist: false,
    freshnessDays: 8,
    verified: true,
    sourceType: "admin_verified",
    reviewStatus: "published",
    messageEnabled: true,
  },
  {
    classGroupId: "class-05",
    programId: "program-05",
    organizationId: "org-05",
    branchId: "branch-05",
    regionCode: "seoul-gangnam",
    academyName: "세움수학클래스",
    branchName: "삼성본관",
    programName: "중2 개념설명반",
    classGroupName: "월수금 20시반",
    subject: "math",
    gradeBand: "middle-2",
    deliveryMode: "offline",
    monthlyFeeKrw: 260000,
    homeDistanceMeters: 3400,
    schoolDistanceMeters: 2300,
    supportsShuttle: true,
    teachingStyles: ["concept-first", "small-group"],
    schedules: [
      { weekday: 1, startMinuteOfDay: 1200, endMinuteOfDay: 1320 },
      { weekday: 3, startMinuteOfDay: 1200, endMinuteOfDay: 1320 },
      { weekday: 5, startMinuteOfDay: 1200, endMinuteOfDay: 1320 },
    ],
    maxCapacity: 10,
    minOpenThreshold: 4,
    reportedEnrolledCount: 6,
    reservedCount: 1,
    acceptsWaitlist: true,
    freshnessDays: 96,
    verified: false,
    sourceType: "academy_self_report",
    reviewStatus: "published",
    messageEnabled: true,
  },
];

type StoredSessionMap = Map<string, StoredRecommendationSession>;

const globalStore = globalThis as typeof globalThis & {
  __academyRecommendationStore?: StoredSessionMap;
};

const sessionStore =
  globalStore.__academyRecommendationStore ??
  (globalStore.__academyRecommendationStore = new Map<string, StoredRecommendationSession>());

export const SUPPORTED_REGION_CODES = ["seoul-gangnam"] as const;

function includesSubject(subjects: Subject[], candidateSubject: Subject): boolean {
  return subjects.length === 0 || subjects.includes(candidateSubject);
}

function includesTeachingStyle(
  teachingStyles: TeachingStyle[],
  candidateStyles: TeachingStyle[],
): boolean {
  return teachingStyles.length === 0 || teachingStyles.some((style) => candidateStyles.includes(style));
}

export class InMemoryRecommendationRepository
  implements RecommendationRepositoryPort
{
  async findCandidates(requirement: StructuredParentRequirement) {
    return sampleCandidates.filter((candidate) => {
      if (candidate.regionCode !== requirement.regionCode) {
        return false;
      }

      if (!includesSubject(requirement.subject, candidate.subject)) {
        return false;
      }

      if (!includesTeachingStyle(requirement.teachingStyles, candidate.teachingStyles)) {
        return false;
      }

      return true;
    });
  }

  async saveRecommendationSession(
    input: SaveRecommendationSessionInput,
  ): Promise<StoredRecommendationSession> {
    const sessionId = crypto.randomUUID();
    const generatedAt = new Date().toISOString();
    const results = input.rankedResults.map((result, index) => ({
      ...result,
      resultId: crypto.randomUUID(),
      rank: index + 1,
      returnedToUser: index < 3,
    }));

    const storedSession: StoredRecommendationSession = {
      sessionId,
      publicSessionId: input.publicSessionId,
      parentUserId: input.parentUserId,
      generatedAt,
      parserVersion: input.parserVersion,
      rankingVersion: input.rankingVersion,
      requestSummary: input.requestSummary,
      structuredRequirement: input.structuredRequirement,
      results,
    };

    sessionStore.set(sessionId, storedSession);

    return storedSession;
  }

  async getRecommendationSession(
    sessionId: string,
  ): Promise<StoredRecommendationSession | null> {
    return sessionStore.get(sessionId) ?? null;
  }
}
