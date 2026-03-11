import { createDb } from "./client";

export async function withDbTransaction<T>(
  callback: Parameters<ReturnType<typeof createDb>["transaction"]>[0],
): Promise<T> {
  const db = createDb();

  return db.transaction(callback) as Promise<T>;
}
