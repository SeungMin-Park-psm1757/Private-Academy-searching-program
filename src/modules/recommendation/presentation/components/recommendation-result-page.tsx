"use client";

import { useEffect, useState } from "react";
import {
  ApiErrorResponse,
  RecommendationResponse,
} from "../recommendation-api.contract";
import { RecommendationResults } from "./recommendation-results";

export function RecommendationResultPage({
  sessionId,
}: {
  sessionId: string;
}) {
  const [response, setResponse] = useState<RecommendationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const apiResponse = await fetch(`/api/public/recommendations/${sessionId}`, {
        cache: "no-store",
      });

      if (!apiResponse.ok) {
        const payload = (await apiResponse.json()) as ApiErrorResponse;

        if (!cancelled) {
          setErrorMessage(payload.error.message);
        }

        return;
      }

      const payload = (await apiResponse.json()) as RecommendationResponse;

      if (!cancelled) {
        setResponse(payload);
      }
    }

    load().catch(() => {
      if (!cancelled) {
        setErrorMessage("추천 결과를 불러오지 못했습니다.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (errorMessage) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
        {errorMessage}
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white/80 px-6 py-8 text-sm text-slate-600 shadow-[0_20px_80px_rgba(10,37,64,0.06)]">
        추천 결과를 불러오는 중입니다.
      </div>
    );
  }

  return <RecommendationResults response={response} />;
}
