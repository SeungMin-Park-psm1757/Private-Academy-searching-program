import { z } from "zod";

const rawServerEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().optional(),
  DATABASE_URL: z.string().min(1).optional(),
  AUTH_MODE: z.enum(["mock", "provider"]).default("mock"),
  NEXT_PUBLIC_ENABLE_BILLING: z.enum(["true", "false"]).optional().default("false"),
  NEXT_PUBLIC_ENABLE_MESSAGING: z.enum(["true", "false"]).optional().default("true"),
  ENFORCE_ADMIN_MFA: z.enum(["true", "false"]).optional().default("false"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  VERCEL_URL: z.string().min(1).optional(),
  KAKAO_LOCAL_REST_API_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  TOSS_SECRET_KEY: z.string().min(1).optional(),
  TOSS_CLIENT_KEY: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
});

export interface ServerEnv {
  nodeEnv: "development" | "test" | "production";
  deploymentEnvironment: "development" | "preview" | "production";
  appUrl?: string;
  databaseUrl?: string;
  authMode: "mock" | "provider";
  billingEnabled: boolean;
  academyMessagingEnabled: boolean;
  adminMfaEnforced: boolean;
  vercelUrl?: string;
  kakaoLocalRestApiKey?: string;
  openAiApiKey?: string;
  tossSecretKey?: string;
  tossClientKey?: string;
  cronSecret?: string;
  hasDatabaseUrl: boolean;
  hasKakaoLocalKey: boolean;
  hasOpenAiKey: boolean;
  hasTossKeys: boolean;
}

let cachedServerEnv: ServerEnv | null = null;

function resolveDeploymentEnvironment(
  nodeEnv: ServerEnv["nodeEnv"],
  vercelEnv?: "development" | "preview" | "production",
): ServerEnv["deploymentEnvironment"] {
  if (vercelEnv) {
    return vercelEnv;
  }

  return nodeEnv === "production" ? "production" : "development";
}

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = rawServerEnvSchema.parse(process.env);

  cachedServerEnv = {
    nodeEnv: parsed.NODE_ENV,
    deploymentEnvironment: resolveDeploymentEnvironment(
      parsed.NODE_ENV,
      parsed.VERCEL_ENV,
    ),
    appUrl: parsed.APP_URL,
    databaseUrl: parsed.DATABASE_URL,
    authMode: parsed.AUTH_MODE,
    billingEnabled: parsed.NEXT_PUBLIC_ENABLE_BILLING === "true",
    academyMessagingEnabled: parsed.NEXT_PUBLIC_ENABLE_MESSAGING !== "false",
    adminMfaEnforced: parsed.ENFORCE_ADMIN_MFA === "true",
    vercelUrl: parsed.VERCEL_URL,
    kakaoLocalRestApiKey: parsed.KAKAO_LOCAL_REST_API_KEY,
    openAiApiKey: parsed.OPENAI_API_KEY,
    tossSecretKey: parsed.TOSS_SECRET_KEY,
    tossClientKey: parsed.TOSS_CLIENT_KEY,
    cronSecret: parsed.CRON_SECRET,
    hasDatabaseUrl: Boolean(parsed.DATABASE_URL),
    hasKakaoLocalKey: Boolean(parsed.KAKAO_LOCAL_REST_API_KEY),
    hasOpenAiKey: Boolean(parsed.OPENAI_API_KEY),
    hasTossKeys: Boolean(parsed.TOSS_SECRET_KEY && parsed.TOSS_CLIENT_KEY),
  };

  return cachedServerEnv;
}

export function getAppUrl(): string {
  const env = getServerEnv();

  if (env.appUrl) {
    return env.appUrl;
  }

  if (env.vercelUrl) {
    return `https://${env.vercelUrl}`;
  }

  if (env.deploymentEnvironment === "production") {
    return "https://private-academy-searching-program.vercel.app";
  }

  return "http://127.0.0.1:3000";
}

export function resetServerEnvForTests(): void {
  cachedServerEnv = null;
}
