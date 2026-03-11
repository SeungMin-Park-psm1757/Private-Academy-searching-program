import { rankCandidates } from "../../domain/recommendation-policy";
import {
  RankedRecommendation,
  StructuredParentRequirement,
} from "../../domain/types";
import { RecommendationRepositoryPort } from "../ports/recommendation-repository.port";

export interface RankedRecommendationSet {
  internalTop20: RankedRecommendation[];
  publicTop3: RankedRecommendation[];
}

export class GetTopRecommendationsUseCase {
  constructor(
    private readonly recommendationRepository: RecommendationRepositoryPort,
  ) {}

  async execute(
    requirement: StructuredParentRequirement,
  ): Promise<RankedRecommendationSet> {
    const candidates = await this.recommendationRepository.findCandidates(requirement);
    const ranked = rankCandidates(requirement, candidates);
    const deduplicatedByBranch = this.deduplicateByBranch(ranked);
    const internalTop20 = deduplicatedByBranch.slice(0, 20);
    const publicTop3 = this.selectPublicTop3(internalTop20);

    return {
      internalTop20,
      publicTop3,
    };
  }

  private deduplicateByBranch(
    items: RankedRecommendation[],
  ): RankedRecommendation[] {
    const seenBranchIds = new Set<string>();
    const result: RankedRecommendation[] = [];

    for (const item of items) {
      if (seenBranchIds.has(item.branchId)) {
        continue;
      }

      seenBranchIds.add(item.branchId);
      result.push(item);
    }

    return result;
  }

  private selectPublicTop3(
    items: RankedRecommendation[],
  ): RankedRecommendation[] {
    const result: RankedRecommendation[] = [];
    const organizationCounts = new Map<string, number>();

    for (const item of items) {
      const count = organizationCounts.get(item.organizationId) ?? 0;

      if (count >= 1) {
        continue;
      }

      result.push(item);
      organizationCounts.set(item.organizationId, count + 1);

      if (result.length === 3) {
        return result;
      }
    }

    for (const item of items) {
      if (result.some((existing) => existing.classGroupId === item.classGroupId)) {
        continue;
      }

      result.push(item);

      if (result.length === 3) {
        break;
      }
    }

    return result;
  }
}
