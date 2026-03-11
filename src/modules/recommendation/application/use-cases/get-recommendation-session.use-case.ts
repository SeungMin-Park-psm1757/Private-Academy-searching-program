import { StoredRecommendationSession } from "../../domain/types";
import { RecommendationRepositoryPort } from "../ports/recommendation-repository.port";

export class GetRecommendationSessionUseCase {
  constructor(
    private readonly recommendationRepository: RecommendationRepositoryPort,
  ) {}

  async execute(sessionId: string): Promise<StoredRecommendationSession | null> {
    return this.recommendationRepository.getRecommendationSession(sessionId);
  }
}
