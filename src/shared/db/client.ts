import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getServerEnv } from "@/shared/lib/env";
import { schema } from "./schema";

let pool: Pool | null = null;
let poolConnectionString: string | null = null;

export function createDb() {
  const connectionString = getServerEnv().databaseUrl;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!pool || poolConnectionString !== connectionString) {
    pool = new Pool({ connectionString });
    poolConnectionString = connectionString;
  }

  return drizzle(pool, { schema });
}
