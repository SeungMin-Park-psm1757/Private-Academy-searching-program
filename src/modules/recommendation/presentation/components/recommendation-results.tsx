import Link from "next/link";
import { RecommendationResponse } from "../recommendation-api.contract";

function distanceBasisLabel(distanceBasis: RecommendationResponse["requestSummary"]["distanceBasis"]) {
  return distanceBasis === "school" ? "학교 기준" : "집 기준";
}

function statusLabel(status: RecommendationResponse["results"][number]["status"]) {
  return status === "open" ? "즉시 상담 가능" : "대기열 우선";
}

export function RecommendationResults({
  response,
}: {
  response: RecommendationResponse;
}) {
  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_80px_rgba(10,37,64,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-700">
              Recommendation Snapshot
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              구조화된 추천 조건과 Top 3 결과
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              공개 화면에는 Top 3만 노출하고, 내부에는 더 많은 결과를 저장하는 정책을 반영했습니다.
            </p>
          </div>

          <Link
            href="/recommend"
            className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            조건 다시 입력
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">지역</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {response.requestSummary.regionCode}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">거리 기준</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {distanceBasisLabel(response.requestSummary.distanceBasis)}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">반경</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {(response.requestSummary.radiusMeters / 1000).toFixed(1)} km
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">차량 지원</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {response.requestSummary.needsShuttleSupport ? "필요" : "필수 아님"}
            </p>
          </div>
        </div>
      </section>

      {response.results.map((item) => (
        <article
          key={item.resultId}
          className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_70px_rgba(10,37,64,0.07)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal-700">
                Recommendation {item.rank}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">{item.academyName}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {item.branchName} · {item.programName} · {item.classGroupName}
              </p>
            </div>
            <div className="rounded-[20px] bg-slate-950 px-4 py-3 text-right text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Fit Tier</p>
              <p className="mt-1 text-2xl font-semibold uppercase">{item.fitTier}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {statusLabel(item.status)}
            </span>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-800">
              {distanceBasisLabel(item.distanceBasis)} {item.distanceMeters}m
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                item.supportsShuttle
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {item.supportsShuttle ? "차량 지원 가능" : "차량 지원 정보 없음"}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                item.freshness.verified
                  ? "bg-sky-50 text-sky-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.freshness.verified ? "검수 이력 있음" : "자체 입력 중심"}
            </span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-900">추천 이유</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {item.reasons.map((reason) => (
                    <li key={reason} className="rounded-2xl bg-slate-50 px-4 py-3">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">시간표 요약</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {item.scheduleSummary.map((schedule) => (
                    <li key={schedule} className="rounded-2xl bg-slate-50 px-4 py-3">
                      {schedule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(8,47,73,0.96)_100%)] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-teal-300">비용과 신뢰도</p>
                <div className="mt-4 space-y-3 text-sm text-slate-100">
                  <p>월 수강료: {item.monthlyFeeKrw.toLocaleString("ko-KR")}원</p>
                  <p>정보 갱신: {item.freshness.daysSinceUpdate}일 전</p>
                  <p>상담 CTA: {item.cta.label}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">주의 사항</p>
                {item.warnings.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-700">
                    {item.warnings.map((warning) => (
                      <li key={warning} className="rounded-2xl bg-amber-50 px-4 py-3">
                        {warning}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    현재 기준으로는 별도 경고 없이 상담을 시작할 수 있습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
