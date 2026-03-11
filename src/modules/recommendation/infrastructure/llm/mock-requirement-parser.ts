import { RequirementParserPort } from "@/modules/recommendation/application/ports/requirement-parser.port";
import {
  CreateRecommendationRequest,
} from "@/modules/recommendation/presentation/recommendation-api.contract";
import {
  StructuredParentRequirement,
  Subject,
  TeachingStyle,
} from "@/modules/recommendation/domain/types";

function detectTeachingStyles(freeText: string, current: TeachingStyle[]): TeachingStyle[] {
  const detected = new Set<TeachingStyle>(current);
  const normalized = freeText.toLowerCase();

  if (normalized.includes("개념") || normalized.includes("concept")) {
    detected.add("concept-first");
  }

  if (
    normalized.includes("소수정예") ||
    normalized.includes("small group") ||
    normalized.includes("작은 반")
  ) {
    detected.add("small-group");
  }

  if (normalized.includes("문제") || normalized.includes("유형") || normalized.includes("problem")) {
    detected.add("problem-solving");
  }

  if (normalized.includes("집중") || normalized.includes("빡센") || normalized.includes("intensive")) {
    detected.add("intensive");
  }

  return [...detected];
}

function detectShuttleNeed(freeText: string, currentValue: boolean): boolean {
  if (currentValue) {
    return true;
  }

  const normalized = freeText.toLowerCase();

  return (
    normalized.includes("차량") ||
    normalized.includes("셔틀") ||
    normalized.includes("픽업") ||
    normalized.includes("drop")
  );
}

function normalizeSubjects(subjects: Subject[]): Subject[] {
  return subjects.length > 0 ? subjects : ["math"];
}

export class MockRequirementParser implements RequirementParserPort {
  async parse(input: {
    freeText: string;
    selectedFilters: unknown;
  }): Promise<StructuredParentRequirement> {
    const request = input.selectedFilters as CreateRecommendationRequest;
    const freeText = input.freeText.trim();
    const teachingStyles = detectTeachingStyles(
      freeText,
      request.filters.teachingStyles ?? [],
    );

    return {
      regionCode: request.location.regionCode,
      requestedLat: request.location.lat,
      requestedLng: request.location.lng,
      radiusMeters: request.location.radiusMeters,
      distanceBasis: request.location.distanceBasis,
      studentProfileId: request.student.studentProfileId,
      subject: normalizeSubjects(request.filters.subjects),
      gradeBand: request.student.gradeBand,
      budgetMinKrw: request.filters.budgetMinKrw,
      budgetMaxKrw: request.filters.budgetMaxKrw,
      preferredWeekdays: request.filters.preferredWeekdays ?? [],
      preferredTimeWindow: request.filters.preferredTimeWindow,
      needsShuttleSupport: detectShuttleNeed(
        freeText,
        Boolean(request.filters.needsShuttleSupport),
      ),
      teachingStyles,
    };
  }
}
