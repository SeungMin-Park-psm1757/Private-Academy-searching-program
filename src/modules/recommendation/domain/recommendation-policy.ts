import {
  CandidateClass,
  CandidateSchedule,
  RankedRecommendation,
  RecommendationReasonCode,
  RecommendationStatus,
  RecommendationWarningCode,
  StructuredParentRequirement,
} from "./types";

const SUBJECT_GRADE_WEIGHT = 30;
const SCHEDULE_WEIGHT = 20;
const DISTANCE_WEIGHT = 15;
const BUDGET_WEIGHT = 15;
const STYLE_WEIGHT = 10;
const FRESHNESS_WEIGHT = 10;
const WAITLIST_PENALTY = 10;
const SHUTTLE_BONUS = 6;
const SHUTTLE_PENALTY = 12;

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatMinuteOfDay(minuteOfDay: number): string {
  const hours = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatScheduleSummary(schedules: CandidateSchedule[]): string[] {
  const grouped = new Map<string, number[]>();

  for (const schedule of schedules) {
    const key = `${schedule.startMinuteOfDay}-${schedule.endMinuteOfDay}`;
    const days = grouped.get(key) ?? [];

    days.push(schedule.weekday);
    grouped.set(key, days);
  }

  return [...grouped.entries()].map(([timeKey, weekdays]) => {
    const [startMinuteOfDay, endMinuteOfDay] = timeKey.split("-").map(Number);
    const daySummary = weekdays
      .sort((left, right) => left - right)
      .map((weekday) => weekdayLabels[weekday] ?? "?")
      .join("/");

    return `${daySummary} ${formatMinuteOfDay(startMinuteOfDay)}-${formatMinuteOfDay(endMinuteOfDay)}`;
  });
}

function resolveCandidateDistanceMeters(
  requirement: StructuredParentRequirement,
  candidate: CandidateClass,
): number {
  return requirement.distanceBasis === "school"
    ? candidate.schoolDistanceMeters
    : candidate.homeDistanceMeters;
}

function intersectsSchedule(
  requirement: StructuredParentRequirement,
  schedules: CandidateSchedule[],
): boolean {
  if (
    !requirement.preferredWeekdays.length ||
    requirement.preferredTimeWindow == null
  ) {
    return true;
  }

  return schedules.some((schedule) => {
    const dayMatched = requirement.preferredWeekdays.includes(schedule.weekday);
    const timeMatched =
      schedule.startMinuteOfDay >= requirement.preferredTimeWindow!.startMinuteOfDay &&
      schedule.endMinuteOfDay <= requirement.preferredTimeWindow!.endMinuteOfDay;

    return dayMatched && timeMatched;
  });
}

function calcSubjectGradeFit(
  requirement: StructuredParentRequirement,
  candidate: CandidateClass,
): number {
  const subjectMatched = requirement.subject.includes(candidate.subject);
  const gradeMatched = requirement.gradeBand === candidate.gradeBand;

  if (subjectMatched && gradeMatched) {
    return SUBJECT_GRADE_WEIGHT;
  }

  if (subjectMatched) {
    return 18;
  }

  return 0;
}

function calcScheduleFit(
  requirement: StructuredParentRequirement,
  candidate: CandidateClass,
): number {
  return intersectsSchedule(requirement, candidate.schedules) ? SCHEDULE_WEIGHT : 0;
}

function calcDistanceFit(
  requirement: StructuredParentRequirement,
  candidate: CandidateClass,
): number {
  const distanceMeters = resolveCandidateDistanceMeters(requirement, candidate);

  if (distanceMeters > requirement.radiusMeters) {
    return 0;
  }

  const ratio = 1 - distanceMeters / requirement.radiusMeters;
  return clamp(ratio * DISTANCE_WEIGHT, 0, DISTANCE_WEIGHT);
}

function calcBudgetFit(
  requirement: StructuredParentRequirement,
  candidate: CandidateClass,
): number {
  if (requirement.budgetMinKrw == null && requirement.budgetMaxKrw == null) {
    return BUDGET_WEIGHT;
  }

  if (
    requirement.budgetMinKrw != null &&
    candidate.monthlyFeeKrw < requirement.budgetMinKrw
  ) {
    return 10;
  }

  if (
    requirement.budgetMaxKrw != null &&
    candidate.monthlyFeeKrw > requirement.budgetMaxKrw
  ) {
    return 0;
  }

  return BUDGET_WEIGHT;
}

function calcTeachingStyleFit(
  requirement: StructuredParentRequirement,
  candidate: CandidateClass,
): number {
  if (!requirement.teachingStyles.length) {
    return STYLE_WEIGHT;
  }

  const matchedCount = requirement.teachingStyles.filter((style) =>
    candidate.teachingStyles.includes(style),
  ).length;

  return clamp((matchedCount / requirement.teachingStyles.length) * STYLE_WEIGHT, 0, STYLE_WEIGHT);
}

function calcFreshnessFit(candidate: CandidateClass): number {
  let score = FRESHNESS_WEIGHT;

  if (!candidate.verified) {
    score -= 3;
  }

  if (candidate.freshnessDays > 30) {
    score -= 2;
  }

  if (candidate.freshnessDays > 90) {
    score -= 5;
  }

  return clamp(score, 0, FRESHNESS_WEIGHT);
}

function calcShuttleModifier(
  requirement: StructuredParentRequirement,
  candidate: CandidateClass,
): number {
  if (!requirement.needsShuttleSupport) {
    return 0;
  }

  return candidate.supportsShuttle ? SHUTTLE_BONUS : -SHUTTLE_PENALTY;
}

function resolveStatus(candidate: CandidateClass): RecommendationStatus {
  const availableSeats =
    candidate.maxCapacity - candidate.reportedEnrolledCount - candidate.reservedCount;

  if (availableSeats <= 0 && !candidate.acceptsWaitlist) {
    return "closed";
  }

  if (availableSeats <= 0 || candidate.reportedEnrolledCount < candidate.minOpenThreshold) {
    return "waitlist_only";
  }

  return "open";
}

function canExceedDistanceLimit(
  requirement: StructuredParentRequirement,
  candidate: CandidateClass,
): boolean {
  return requirement.needsShuttleSupport && candidate.supportsShuttle;
}

function buildReasonCodes(
  requirement: StructuredParentRequirement,
  candidate: CandidateClass,
  status: RecommendationStatus,
): {
  reasonCodes: RecommendationReasonCode[];
  warningCodes: RecommendationWarningCode[];
} {
  const reasonCodes: RecommendationReasonCode[] = [];
  const warningCodes: RecommendationWarningCode[] = [];
  const distanceMeters = resolveCandidateDistanceMeters(requirement, candidate);

  if (requirement.subject.includes(candidate.subject)) {
    reasonCodes.push("SUBJECT_MATCH");
  }

  if (requirement.gradeBand === candidate.gradeBand) {
    reasonCodes.push("GRADE_MATCH");
  }

  if (intersectsSchedule(requirement, candidate.schedules)) {
    reasonCodes.push("SCHEDULE_MATCH");
  }

  if (distanceMeters <= requirement.radiusMeters) {
    reasonCodes.push("DISTANCE_MATCH");
  }

  if (
    (requirement.budgetMinKrw == null || candidate.monthlyFeeKrw >= requirement.budgetMinKrw) &&
    (requirement.budgetMaxKrw == null || candidate.monthlyFeeKrw <= requirement.budgetMaxKrw)
  ) {
    reasonCodes.push("BUDGET_MATCH");
  }

  if (
    !requirement.teachingStyles.length ||
    requirement.teachingStyles.some((style) => candidate.teachingStyles.includes(style))
  ) {
    reasonCodes.push("STYLE_MATCH");
  }

  if (candidate.verified) {
    reasonCodes.push("VERIFIED_DATA");
  }

  if (requirement.needsShuttleSupport && candidate.supportsShuttle) {
    reasonCodes.push("SHUTTLE_SUPPORT");
  }

  if (status === "waitlist_only") {
    warningCodes.push("WAITLIST_ONLY");
  }

  if (candidate.freshnessDays > 30) {
    warningCodes.push("STALE_DATA_WARNING");
  }

  if (candidate.sourceType === "academy_self_report") {
    warningCodes.push("SELF_REPORTED_DATA");
  }

  if (requirement.needsShuttleSupport && !candidate.supportsShuttle) {
    warningCodes.push("NO_SHUTTLE_SUPPORT");
  }

  if (distanceMeters > requirement.radiusMeters) {
    warningCodes.push("DISTANCE_OVER_LIMIT");
  }

  return { reasonCodes, warningCodes };
}

export function rankCandidates(
  requirement: StructuredParentRequirement,
  candidates: CandidateClass[],
): RankedRecommendation[] {
  return candidates
    .filter((candidate) => candidate.reviewStatus === "published" && candidate.messageEnabled)
    .map((candidate) => {
      const distanceMeters = resolveCandidateDistanceMeters(requirement, candidate);
      const status = resolveStatus(candidate);
      const scheduleSummary = formatScheduleSummary(candidate.schedules);

      let score =
        calcSubjectGradeFit(requirement, candidate) +
        calcScheduleFit(requirement, candidate) +
        calcDistanceFit(requirement, candidate) +
        calcBudgetFit(requirement, candidate) +
        calcTeachingStyleFit(requirement, candidate) +
        calcFreshnessFit(candidate) +
        calcShuttleModifier(requirement, candidate);

      if (status === "waitlist_only") {
        score -= WAITLIST_PENALTY;
      }

      if (status === "closed") {
        score = 0;
      }

      if (distanceMeters > requirement.radiusMeters && !canExceedDistanceLimit(requirement, candidate)) {
        score = 0;
      }

      const { reasonCodes, warningCodes } = buildReasonCodes(requirement, candidate, status);

      return {
        programId: candidate.programId,
        classGroupId: candidate.classGroupId,
        organizationId: candidate.organizationId,
        branchId: candidate.branchId,
        academyName: candidate.academyName,
        branchName: candidate.branchName,
        programName: candidate.programName,
        classGroupName: candidate.classGroupName,
        subject: candidate.subject,
        gradeBand: candidate.gradeBand,
        deliveryMode: candidate.deliveryMode,
        monthlyFeeKrw: candidate.monthlyFeeKrw,
        score: Number(score.toFixed(2)),
        status,
        distanceMeters,
        distanceBasis: requirement.distanceBasis,
        supportsShuttle: candidate.supportsShuttle,
        scheduleSummary,
        freshnessDays: candidate.freshnessDays,
        verified: candidate.verified,
        reasonCodes,
        warningCodes,
      };
    })
    .filter((item) => item.score > 0 && item.status !== "closed")
    .sort((left, right) => right.score - left.score);
}
