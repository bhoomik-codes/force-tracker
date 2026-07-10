import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

// Use DIRECT_URL for stable connection, fallback to DATABASE_URL
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Required for Supabase (handles both direct & pooler SSL)
});

export const db = drizzle(pool, { schema });
