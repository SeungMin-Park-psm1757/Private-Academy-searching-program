import {
  CandidateClass,
  RankedRecommendation,
  RecommendationRequestSummary,
  StoredRecommendationSession,
  StructuredParentRequirement,
} from "../../domain/types";

export interface SaveRecommendationSessionInput {
  publicSessionId?: string;
  parentUserId?: string;
  requestSummary: RecommendationRequestSummary;
  structuredRequirement: StructuredParentRequirement;
  rankedResults: RankedRecommendation[];
  parserVersion: string;
  rankingVersion: string;
}

export interface RecommendationRepositoryPort {
  findCandidates(requirement: StructuredParentRequirement): Promise<CandidateClass[]>;
  saveRecommendationSession(
    input: SaveRecommendationSessionInput,
  ): Promise<StoredRecommendationSession>;
  getRecommendationSession(sessionId: string): Promise<StoredRecommendationSession | null>;
}
