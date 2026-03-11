import { NextRequest, NextResponse } from "next/server";

export const PUBLIC_SESSION_COOKIE_NAME = "academy_public_session";
const PUBLIC_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function getPublicSessionId(request: NextRequest): string | undefined {
  return request.cookies.get(PUBLIC_SESSION_COOKIE_NAME)?.value;
}

export function getOrCreatePublicSessionId(request: NextRequest): {
  publicSessionId: string;
  isNew: boolean;
} {
  const current = getPublicSessionId(request);

  if (current) {
    return {
      publicSessionId: current,
      isNew: false,
    };
  }

  return {
    publicSessionId: crypto.randomUUID(),
    isNew: true,
  };
}

export function applyPublicSessionCookie(
  response: NextResponse,
  publicSessionId: string,
): NextResponse {
  response.cookies.set(PUBLIC_SESSION_COOKIE_NAME, publicSessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PUBLIC_SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
