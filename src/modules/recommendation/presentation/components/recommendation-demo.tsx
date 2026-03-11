"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ApiErrorResponse,
  RecommendationResponse,
} from "../recommendation-api.contract";

type DistanceBasis = "home" | "school";

const weekdayOptions = [
  { label: "월", value: 1 },
  { label: "화", value: 2 },
  { label: "수", value: 3 },
  { label: "목", value: 4 },
  { label: "금", value: 5 },
];

const teachingStyleOptions = [
  { label: "개념 위주", value: "concept-first" },
  { label: "문제 풀이", value: "problem-solving" },
  { label: "소수정예", value: "small-group" },
  { label: "집중반", value: "intensive" },
] as const;

export function RecommendationDemo() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 3, 5]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    "concept-first",
    "small-group",
  ]);

  const [form, setForm] = useState({
    regionCode: "seoul-gangnam",
    gradeBand: "middle-2",
    budgetMinKrw: "200000",
    budgetMaxKrw: "350000",
    preferredStartMinuteOfDay: "1140",
    preferredEndMinuteOfDay: "1320",
    radiusMeters: "3000",
    distanceBasis: "home" as DistanceBasis,
    lat: "37.5007",
    lng: "127.0473",
    needsShuttleSupport: true,
    freeText:
      "중2 수학이고 개념이 약한 편입니다. 너무 빡센 분위기보다는 차분하게 설명해주는 곳이면 좋겠어요. 평일 저녁 7시 이후 가능하고 차량 지원도 있으면 좋겠습니다.",
  });

  function toggleWeekday(value: number) {
    setSelectedWeekdays((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value].sort((left, right) => left - right),
    );
  }

  function toggleStyle(value: string) {
    setSelectedStyles((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/public/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            regionCode: form.regionCode,
            lat: Number(form.lat),
            lng: Number(form.lng),
            radiusMeters: Number(form.radiusMeters),
            distanceBasis: form.distanceBasis,
          },
          student: {
            gradeBand: form.gradeBand,
          },
          filters: {
            subjects: ["math"],
            budgetMinKrw: Number(form.budgetMinKrw),
            budgetMaxKrw: Number(form.budgetMaxKrw),
            preferredWeekdays: selectedWeekdays,
            preferredTimeWindow: {
              startMinuteOfDay: Number(form.preferredStartMinuteOfDay),
              endMinuteOfDay: Number(form.preferredEndMinuteOfDay),
            },
            teachingStyles: selectedStyles,
            needsShuttleSupport: form.needsShuttleSupport,
          },
          freeText: form.freeText,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as ApiErrorResponse;
        setErrorMessage(payload.error.message);
        return;
      }

      const payload = (await response.json()) as RecommendationResponse;
      router.push(`/recommend/result/${payload.sessionId}`);
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-[28px] border border-amber-100 bg-[linear-gradient(180deg,_rgba(255,252,245,0.98)_0%,_rgba(255,248,235,0.94)_100%)] p-6 shadow-[0_24px_80px_rgba(56,44,24,0.10)]"
      >
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-700">
            Parent Intake
          </p>
          <h2 className="text-2xl font-semibold text-slate-950">
            학생 조건과 통학 기준을 입력해 주세요
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            추천은 익명으로 진행되고, 메시지 상담은 이후 부모 회원 전환 시점에만 열리도록 설계했습니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>런칭 지역</span>
            <select
              value={form.regionCode}
              onChange={(event) =>
                setForm((current) => ({ ...current, regionCode: event.target.value }))
              }
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
            >
              <option value="seoul-gangnam">서울 강남</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>학년대</span>
            <select
              value={form.gradeBand}
              onChange={(event) =>
                setForm((current) => ({ ...current, gradeBand: event.target.value }))
              }
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
            >
              <option value="middle-2">중2</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>예산 최소</span>
            <input
              value={form.budgetMinKrw}
              onChange={(event) =>
                setForm((current) => ({ ...current, budgetMinKrw: event.target.value }))
              }
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              inputMode="numeric"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>예산 최대</span>
            <input
              value={form.budgetMaxKrw}
              onChange={(event) =>
                setForm((current) => ({ ...current, budgetMaxKrw: event.target.value }))
              }
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              inputMode="numeric"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-2 text-sm text-slate-700">
            <span>가능 시작 시간</span>
            <input
              value={form.preferredStartMinuteOfDay}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  preferredStartMinuteOfDay: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              inputMode="numeric"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>가능 종료 시간</span>
            <input
              value={form.preferredEndMinuteOfDay}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  preferredEndMinuteOfDay: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              inputMode="numeric"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>탐색 반경(m)</span>
            <input
              value={form.radiusMeters}
              onChange={(event) =>
                setForm((current) => ({ ...current, radiusMeters: event.target.value }))
              }
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              inputMode="numeric"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>위도</span>
            <input
              value={form.lat}
              onChange={(event) =>
                setForm((current) => ({ ...current, lat: event.target.value }))
              }
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              inputMode="decimal"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>경도</span>
            <input
              value={form.lng}
              onChange={(event) =>
                setForm((current) => ({ ...current, lng: event.target.value }))
              }
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
              inputMode="decimal"
            />
          </label>
        </div>

        <div className="space-y-3">
          <span className="text-sm font-medium text-slate-800">거리 기준</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["home", "school"] as const).map((distanceBasis) => {
              const selected = form.distanceBasis === distanceBasis;

              return (
                <button
                  key={distanceBasis}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, distanceBasis }))}
                  className={`rounded-[20px] border px-4 py-4 text-left transition ${
                    selected
                      ? "border-teal-700 bg-teal-700 text-white shadow-[0_16px_30px_rgba(15,118,110,0.2)]"
                      : "border-amber-200 bg-white text-slate-700 hover:border-amber-300"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {distanceBasis === "home" ? "집 기준" : "학교 기준"}
                  </p>
                  <p className={`mt-1 text-xs ${selected ? "text-teal-50" : "text-slate-500"}`}>
                    {distanceBasis === "home"
                      ? "학생 집에서 학원까지의 이동 거리"
                      : "학생 학교 기준의 이동 거리"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-sm font-medium text-slate-800">차량 지원 필요 여부</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "필요", value: true, body: "셔틀이나 차량 지원 여부가 중요합니다." },
              { label: "필수 아님", value: false, body: "거리와 시간표 적합성을 더 우선합니다." },
            ].map((option) => {
              const selected = form.needsShuttleSupport === option.value;

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      needsShuttleSupport: option.value,
                    }))
                  }
                  className={`rounded-[20px] border px-4 py-4 text-left transition ${
                    selected
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-amber-200 bg-white text-slate-700 hover:border-amber-300"
                  }`}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className={`mt-1 text-xs ${selected ? "text-slate-300" : "text-slate-500"}`}>
                    {option.body}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-sm font-medium text-slate-800">가능 요일</span>
          <div className="flex flex-wrap gap-2">
            {weekdayOptions.map((option) => {
              const selected = selectedWeekdays.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleWeekday(option.value)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selected
                      ? "bg-teal-700 text-white"
                      : "bg-white text-slate-700 ring-1 ring-amber-200 hover:bg-amber-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-sm font-medium text-slate-800">선호 수업 스타일</span>
          <div className="flex flex-wrap gap-2">
            {teachingStyleOptions.map((option) => {
              const selected = selectedStyles.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleStyle(option.value)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selected
                      ? "bg-slate-950 text-white"
                      : "bg-white text-slate-700 ring-1 ring-amber-200 hover:bg-amber-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block space-y-2 text-sm text-slate-700">
          <span>자유문장</span>
          <textarea
            value={form.freeText}
            onChange={(event) =>
              setForm((current) => ({ ...current, freeText: event.target.value }))
            }
            className="min-h-36 w-full rounded-[20px] border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-teal-700"
          />
        </label>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-3 rounded-[20px] bg-teal-700 px-5 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(15,118,110,0.24)] transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <span>{isPending ? "추천 결과 생성 중..." : "Top 3 추천 보기"}</span>
          <span aria-hidden="true">-&gt;</span>
        </button>
      </form>

      <div className="space-y-5">
        <section className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_80px_rgba(10,37,64,0.06)]">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
            Matching Rules
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            LLM은 해석하고, 백엔드는 판정합니다
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            자연어는 구조화 JSON으로 바꾸고, 실제 추천 순위는 과목 적합도, 시간표, 거리,
            예산, 차량 지원, 데이터 신뢰도 같은 결정 로직으로 계산합니다.
          </p>
        </section>

        <section className="rounded-[28px] bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(8,47,73,0.96)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(2,8,23,0.26)]">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-300">
            Result Policy
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
            <li>외부에는 Top 3만 반환하고, 내부에는 Top 20을 저장합니다.</li>
            <li>정원이 찼거나 최소 개강 인원 미달이면 waitlist_only로 안내합니다.</li>
            <li>차량 지원이 필요한 경우 셔틀 여부를 패널티와 경고에 함께 반영합니다.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
