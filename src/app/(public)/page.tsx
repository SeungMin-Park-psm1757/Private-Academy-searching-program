import Link from "next/link";

const pillars = [
  {
    title: "거리와 동선",
    body: "집 기준 또는 학교 기준 거리로 추천을 계산하고, 통학 범위를 벗어나는 후보는 자연스럽게 밀어냅니다.",
  },
  {
    title: "시간표와 개강 가능성",
    body: "요일, 시작 시간, 종료 시간, 잔여석, 최소 개강 인원까지 함께 판정해서 보여줍니다.",
  },
  {
    title: "학원 운영 신뢰도",
    body: "검수 여부, 데이터 최신성, 버전 이력, 롤백 가능성을 운영 구조 안에 미리 포함합니다.",
  },
];

const previewCards = [
  {
    subject: "중2 수학",
    title: "대치 개념랩",
    meta: "대치 본원",
    badges: ["집 기준 1.2km", "차량지원 가능", "검수 완료"],
  },
  {
    subject: "중등 심화",
    title: "역삼 스몰그룹 수학관",
    meta: "역삼 센터",
    badges: ["학교 기준 1.4km", "대기열 우선", "소수정예"],
  },
  {
    subject: "개념 강화",
    title: "선릉 수학포레",
    meta: "선릉 본관",
    badges: ["차량지원 가능", "데이터 갱신 확인 필요", "예산 적합"],
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_26px_120px_rgba(15,23,42,0.08)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-7">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-teal-700">
              Parent Recommendation + Academy Backoffice + Admin Audit Console
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
              검색보다 선택을 잘 돕는,
              <br />
              학원 추천 플랫폼
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              부모는 익명으로 Top 3 추천을 빠르게 받고, 학원은 정확한 정보로
              노출되며, 운영자는 검수와 감사, 롤백까지 통제하는 구조입니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/recommend"
              className="inline-flex items-center justify-center gap-3 rounded-[18px] bg-teal-700 px-6 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(15,118,110,0.26)] transition hover:bg-teal-800"
            >
              <span>추천 데모 시작</span>
              <span aria-hidden="true">-&gt;</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-[18px] border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
            >
              운영 콘솔 구조 보기
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white">
              중2 수학 샘플 데이터
            </span>
            <span className="rounded-full bg-teal-50 px-4 py-2 text-sm text-teal-800">
              집/학교 거리 기준 지원
            </span>
            <span className="rounded-full bg-amber-50 px-4 py-2 text-sm text-amber-800">
              차량지원 변수 반영
            </span>
          </div>
        </div>

        <div className="rounded-[30px] bg-slate-950 p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-teal-300">
                Top 3 Sample Board
              </p>
              <h2 className="mt-2 text-2xl font-semibold">추천 결과는 이렇게 보입니다</h2>
            </div>
            <div className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
              Academy Fit
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {previewCards.map((card, index) => (
              <article
                key={card.title}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-teal-300">
                      Recommendation {index + 1}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{card.title}</h3>
                    <p className="mt-1 text-sm text-slate-300">{card.meta}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                    {card.subject}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {card.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-[0_12px_60px_rgba(15,23,42,0.05)]"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-teal-700">
              {pillar.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{pillar.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
