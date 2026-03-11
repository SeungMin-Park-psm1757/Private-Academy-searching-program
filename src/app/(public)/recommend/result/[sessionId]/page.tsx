import { RecommendationResultPage } from "@/modules/recommendation/presentation/components/recommendation-result-page";

export default async function RecommendationResult({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return <RecommendationResultPage sessionId={sessionId} />;
}
