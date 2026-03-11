import { GetAdminConsoleUseCase } from "@/modules/audit/application/use-cases/get-admin-console.use-case";
import { InMemoryAdminConsoleRepository } from "@/modules/audit/infrastructure/repositories/in-memory-admin-console.repository";

function riskClassName(riskLevel: "medium" | "high") {
  return riskLevel === "high"
    ? "bg-rose-50 text-rose-800"
    : "bg-amber-50 text-amber-800";
}

export default async function AdminPage() {
  const overview = await new GetAdminConsoleUseCase(
    new InMemoryAdminConsoleRepository(),
  ).execute();

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-[0_18px_90px_rgba(15,23,42,0.07)]">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-teal-700">
          Platform Admin
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h1 className="text-4xl font-semibold text-slate-950">
              검수, 감사, 롤백 콘솔
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              관리자 화면은 고위험 필드 검수, 승인 대기 큐, 감사 이벤트 흐름,
              롤백 준비 상태를 함께 보는 운영 콘솔입니다. 가격, 정원, 노출 상태,
              차량지원 정보 같은 필드는 이 영역에서 통제됩니다.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-teal-300">
              Console Summary
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">검수 큐</p>
                <p className="mt-2 text-3xl font-semibold">{overview.reviewQueueCount}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">고위험</p>
                <p className="mt-2 text-3xl font-semibold">{overview.highRiskCount}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">롤백 준비</p>
                <p className="mt-2 text-3xl font-semibold">{overview.rollbackReadyCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-[0_12px_60px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-teal-700">Review Queue</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                승인 대기 변경 요청
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              {overview.reviewQueueCount}건 대기
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {overview.reviewQueue.map((item) => (
              <article
                key={item.id}
                className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {item.academyName} / {item.branchName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{item.summary}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${riskClassName(item.riskLevel)}`}
                  >
                    {item.riskLevel === "high" ? "고위험" : "중간위험"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.fields.map((field) => (
                    <span
                      key={field}
                      className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                    >
                      {field}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      요청자
                    </p>
                    <p className="mt-2 text-sm text-slate-700">{item.requestedBy}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      요청 시각
                    </p>
                    <p className="mt-2 text-sm text-slate-700">{item.requestedAt}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-[0_12px_60px_rgba(15,23,42,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-teal-700">Audit Feed</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            최근 감사 이벤트
          </h2>
          <div className="mt-5 space-y-4">
            {overview.auditFeed.map((event) => (
              <article
                key={event.id}
                className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {event.action}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                      {event.entityLabel}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
                    {event.actorRole}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{event.summary}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{event.actorName}</span>
                  <span>{event.createdAt}</span>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
