import type { Metadata } from "next";
import { Manrope, Noto_Sans_KR } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

const displayFont = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Academy Recommendation Platform",
  description: "Structured academy recommendation MVP demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.12),_transparent_30%),linear-gradient(180deg,_#f8f4ea_0%,_#eef4f3_42%,_#fbfcfd_100%)] text-slate-950">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
              <div className="min-w-0">
                <Link href="/" className="block text-lg font-semibold tracking-tight text-slate-950">
                  Academy Recommendation Platform
                </Link>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Structured Matching MVP
                </p>
              </div>
              <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                <Link className="rounded-full px-4 py-2 hover:bg-slate-100" href="/recommend">
                  추천 테스트
                </Link>
                <Link className="rounded-full px-4 py-2 hover:bg-slate-100" href="/academy">
                  학원 백오피스
                </Link>
                <Link className="rounded-full px-4 py-2 hover:bg-slate-100" href="/admin">
                  관리자 콘솔
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
