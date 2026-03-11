"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
      <section className="w-full rounded-[32px] border border-amber-100 bg-white/90 p-8 shadow-[0_24px_80px_rgba(38,32,22,0.10)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
          Service Recovery
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          화면을 불러오는 중 문제가 발생했습니다
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          추천 결과나 운영 데이터를 다시 불러오도록 준비했습니다. 잠시 후 다시 시도하거나
          홈으로 이동해 흐름을 이어가실 수 있습니다.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            홈으로 이동
          </Link>
        </div>
      </section>
    </div>
  );
}
