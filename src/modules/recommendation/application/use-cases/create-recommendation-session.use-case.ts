import { CreateRecommendationRequest } from "../../presentation/recommendation-api.contract";
import {
  RecommendationRequestSummary,
  StoredRecommendationSession,
} from "../../domain/types";
import { RequirementParserPort } from "../ports/requirement-parser.port";
import { RecommendationRepositoryPort } from "../ports/recommendation-repository.port";
import { GetTopRecommendationsUseCase } from "./get-top-recommendations.use-case";

export interface CreateRecommendationSessionInput {
  publicSessionId?: string;
  parentUserId?: string;
  request: CreateRecommendationRequest;
}

function buildRequestSummary(
  request: CreateRecommendationRequest,
): RecommendationRequestSummary {
  return {
    regionCode: request.location.regionCode,
    gradeBand: request.student.gradeBand,
    subjects: request.filters.subjects,
    radiusMeters: request.location.radiusMeters,
    distanceBasis: request.location.distanceBasis,
    needsShuttleSupport: request.filters.needsShuttleSupport ?? false,
    budgetMinKrw: request.filters.budgetMinKrw,
    budgetMaxKrw: request.filters.budgetMaxKrw,
    preferredWeekdays: request.filters.preferredWeekdays,
    preferredTimeWindow: request.filters.preferredTimeWindow,
  };
}

export class CreateRecommendationSessionUseCase {
  private readonly getTopRecommendationsUseCase: GetTopRecommendationsUseCase;

  constructor(
    private readonly requirementParser: RequirementParserPort,
    private readonly recommendationRepository: RecommendationRepositoryPort,
  ) {
    this.getTopRecommendationsUseCase = new GetTopRecommendationsUseCase(
      recommendationRepository,
    );
  }

  async execute(
    input: CreateRecommendationSessionInput,
  ): Promise<StoredRecommendationSession> {
    const structuredRequirement = await this.requirementParser.parse({
      freeText: input.request.freeText ?? "",
      selectedFilters: input.request,
    });

    const ranked = await this.getTopRecommendationsUseCase.execute(
      structuredRequirement,
    );

    const storedSession = await this.recommendationRepository.saveRecommendationSession({
      publicSessionId: input.publicSessionId,
      parentUserId: input.parentUserId,
      requestSummary: buildRequestSummary(input.request),
      structuredRequirement,
      rankedResults: ranked.internalTop20,
      parserVersion: "v1",
      rankingVersion: "v1",
    });

    return storedSession;
  }
}
