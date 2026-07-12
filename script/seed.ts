/**
 * Seed script — run once after `npm run db:push` to populate demo data.
 * Usage: npx tsx script/seed.ts
 */
import { db } from "../server/db";
import { users, employees, tasks } from "../shared/schema";
import crypto from "crypto";

const SALT_LEN = 16;
const KEY_LEN = 64;

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LEN).toString("hex");
  const buf = crypto.scryptSync(password, salt, KEY_LEN);
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  console.log("🌱 Clearing old data and seeding database...");

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error("❌ ERROR: ADMIN_USERNAME and ADMIN_PASSWORD environment variables are strictly required to seed the database.");
    process.exit(1);
  }

  // ─── Clear All Data ───────────────────────────────────────────────────────
  await db.delete(tasks);
  await db.delete(employees);
  await db.delete(users);

  // ─── Users ────────────────────────────────────────────────────────────────
  console.log("Creating admin user...");
  
  const hashedPassword = hashPassword(adminPassword);

  const [adminUser] = await db
    .insert(users)
    .values({ username: adminUsername, password: hashedPassword, role: "admin" })
    .onConflictDoNothing()
    .returning();

  console.log("✅ Seed complete!");
  console.log(`\nLogin credentials:`);
  console.log(`  Admin   → username: ${adminUsername}    password: [HIDDEN]`);
  console.log("\n  (Employees can now be created via the Admin Dashboard)");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
