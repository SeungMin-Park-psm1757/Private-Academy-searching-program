export function createRequestId(): string {
  return `req_${crypto.randomUUID().replace(/-/g, "").slice(0, 26)}`;
}
