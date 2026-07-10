/**
 * Seed script — run once after `npm run db:push` to populate demo data.
 * Usage: npx tsx script/seed.ts
 */
import { db } from "../server/db";
import { users, employees, tasks } from "../shared/schema";

async function seed() {
  console.log("🌱 Clearing old data and seeding database...");

  // ─── Clear All Data ───────────────────────────────────────────────────────
  await db.delete(tasks);
  await db.delete(employees);
  await db.delete(users);

  // ─── Users ────────────────────────────────────────────────────────────────
  console.log("Creating admin user...");
  const [adminUser] = await db
    .insert(users)
    .values({ username: "admin", password: "admin123", role: "admin" })
    .onConflictDoNothing()
    .returning();

  console.log("✅ Seed complete!");
  console.log("\nLogin credentials:");
  console.log("  Admin   → username: admin    password: admin123");
  console.log("\n  (Employees can now be created via the Admin Dashboard)");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
