type Bucket = {
  count: number;
  resetAt: number;
};

const globalRateLimitStore = globalThis as typeof globalThis & {
  __academyRateLimitBuckets?: Map<string, Bucket>;
};

const buckets =
  globalRateLimitStore.__academyRateLimitBuckets ??
  (globalRateLimitStore.__academyRateLimitBuckets = new Map<string, Bucket>());

export function checkRateLimit(
  key: string,
  options: { windowMs: number; maxRequests: number },
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return {
      allowed: true,
      retryAfterMs: 0,
    };
  }

  if (bucket.count >= options.maxRequests) {
    return {
      allowed: false,
      retryAfterMs: bucket.resetAt - now,
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    allowed: true,
    retryAfterMs: 0,
  };
}
