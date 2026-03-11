import { RecommendationDemo } from "@/modules/recommendation/presentation/components/recommendation-demo";

export default function RecommendPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-8 shadow-[0_18px_90px_rgba(15,23,42,0.07)]">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-teal-700">
          Public Recommendation Flow
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-slate-950">
              부모용 익명 추천 데모
            </h1>
            <p className="text-base leading-8 text-slate-600">
              공개 추천 API를 실제로 호출해서 Top 3 결과를 계산합니다. 현재는 샘플 데이터 기반이지만
              거리 기준, 차량 지원, 시간표 적합성까지 포함한 구조화 매칭 흐름을 그대로 확인할 수 있습니다.
            </p>
          </div>

          <div className="rounded-[24px] bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-teal-300">
              New Variables
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
              <li>학생 후보지 기준 거리를 집 기준 또는 학교 기준으로 전환할 수 있습니다.</li>
              <li>차량 지원이 필요한 경우 셔틀 지원 여부를 별도 변수로 반영합니다.</li>
              <li>결과 전용 페이지가 생겨 새로고침과 재조회가 가능한 형태로 바뀌었습니다.</li>
            </ul>
          </div>
        </div>
      </section>

      <RecommendationDemo />
    </div>
  );
}
