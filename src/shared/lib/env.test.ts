import { afterEach, describe, expect, it } from "vitest";
import { getAppUrl, getServerEnv, resetServerEnvForTests } from "./env";

const originalEnv = { ...process.env };

function restoreEnv() {
  Object.keys(process.env).forEach((key) => {
    if (!(key in originalEnv)) {
      delete process.env[key];
    }
  });

  Object.entries(originalEnv).forEach(([key, value]) => {
    process.env[key] = value;
  });

  resetServerEnvForTests();
}

describe("env helpers", () => {
  afterEach(() => {
    restoreEnv();
  });

  it("uses safe defaults for local development", () => {
    delete process.env.APP_URL;
    delete process.env.VERCEL_URL;
    delete process.env.VERCEL_ENV;
    delete process.env.DATABASE_URL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.KAKAO_LOCAL_REST_API_KEY;
    delete process.env.TOSS_SECRET_KEY;
    delete process.env.TOSS_CLIENT_KEY;
    process.env.NODE_ENV = "development";
    process.env.AUTH_MODE = "mock";
    process.env.NEXT_PUBLIC_ENABLE_BILLING = "false";
    process.env.NEXT_PUBLIC_ENABLE_MESSAGING = "true";
    process.env.ENFORCE_ADMIN_MFA = "false";

    const env = getServerEnv();

    expect(env.deploymentEnvironment).toBe("development");
    expect(env.hasDatabaseUrl).toBe(false);
    expect(env.billingEnabled).toBe(false);
    expect(env.academyMessagingEnabled).toBe(true);
    expect(getAppUrl()).toBe("http://127.0.0.1:3000");
  });

  it("builds the app url from Vercel when APP_URL is not set", () => {
    delete process.env.APP_URL;
    process.env.NODE_ENV = "production";
    process.env.AUTH_MODE = "mock";
    process.env.NEXT_PUBLIC_ENABLE_BILLING = "false";
    process.env.NEXT_PUBLIC_ENABLE_MESSAGING = "true";
    process.env.ENFORCE_ADMIN_MFA = "false";
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_URL = "private-academy-searching-program.vercel.app";

    expect(getAppUrl()).toBe(
      "https://private-academy-searching-program.vercel.app",
    );
  });
});
