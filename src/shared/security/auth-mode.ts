export type AuthMode = "mock" | "provider";

export function getAuthMode(): AuthMode {
  return process.env.AUTH_MODE === "provider" ? "provider" : "mock";
}
