import { GetAcademyDashboardUseCase } from "@/modules/academy/application/use-cases/get-academy-dashboard.use-case";
import { InMemoryAcademyDashboardRepository } from "@/modules/academy/infrastructure/repositories/in-memory-academy-dashboard.repository";

function statusLabel(status: "draft" | "pending_review" | "published" | "suspended") {
  switch (status) {
    case "draft":
      return "초안";
    case "pending_review":
      return "검수 대기";
    case "published":
      return "게시 중";
    case "suspended":
      return "중지";
  }
}

function statusClassName(status: "draft" | "pending_review" | "published" | "suspended") {
  switch (status) {
    case "draft":
      return "bg-slate-100 text-slate-700";
    case "pending_review":
      return "bg-amber-50 text-amber-800";
    case "published":
      return "bg-emerald-50 text-emerald-800";
    case "suspended":
      return "bg-rose-50 text-rose-800";
  }
}

export default async function AcademyPage() {
  const dashboard = await new GetAcademyDashboardUseCase(
    new InMemoryAcademyDashboardRepository(),
  ).execute();

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-[0_18px_90px_rgba(15,23,42,0.07)]">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-teal-700">
          Academy Backoffice
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h1 className="text-4xl font-semibold text-slate-950">
              학원 운영 현황 보드
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              지점별 게시 상태, 차량지원, 리드 수, 대기열 규모, 다음 액션을 한
              화면에서 보이게 정리했습니다. 이후 실제 로그인과 CRUD가 붙으면 이
              구조를 그대로 살릴 수 있습니다.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-teal-300">
              Backoffice Summary
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">지점 수</p>
                <p className="mt-2 text-3xl font-semibold">{dashboard.totalBranches}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">게시 중</p>
                <p className="mt-2 text-3xl font-semibold">{dashboard.publishedBranches}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">검수 대기</p>
                <p className="mt-2 text-3xl font-semibold">{dashboard.pendingReviewBranches}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">활성 리드</p>
                <p className="mt-2 text-3xl font-semibold">{dashboard.totalActiveLeads}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-[0_12px_60px_rgba(15,23,42,0.05)] xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-teal-700">Branches</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                지점 운영 상태
              </h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              대기열 {dashboard.totalWaitlist}건
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {dashboard.branches.map((branch) => (
              <article
                key={branch.branchId}
                className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">
                      {branch.academyName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{branch.branchName}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusClassName(branch.reviewStatus)}`}
                  >
                    {statusLabel(branch.reviewStatus)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                    프로그램 {branch.programsCount}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                    클래스 {branch.classesCount}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                    활성 리드 {branch.activeLeadsCount}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                    대기열 {branch.waitlistCount}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      branch.supportsShuttle
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {branch.supportsShuttle ? "차량지원 가능" : "차량지원 없음"}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      다음 액션
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {branch.nextAction}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      차량지원 메모
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {branch.shuttleNotes ?? "현재 운영 메모 없음"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-[0_12px_60px_rgba(15,23,42,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-teal-700">Why This Matters</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            추천 품질에 직접 연결되는 운영값
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
            <li>시간표 변경이 늦으면 추천 신뢰도가 떨어집니다.</li>
            <li>차량지원 여부는 거리 제한 예외 판단에도 영향을 줍니다.</li>
            <li>대기열 수는 `waitlist_only` 노출 품질을 좌우합니다.</li>
            <li>검수 대기 상태가 길어지면 공개 노출 기회가 줄어듭니다.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
