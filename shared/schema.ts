import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, numeric, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("employee"), // "admin" | "employee"
});

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  adminId: varchar("admin_id"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  position: text("position"),
  department: text("department"),
  location: text("location"),
  avatar: varchar("avatar", { length: 10 }),
  employeeId: varchar("employee_id", { length: 50 }).notNull().unique(),
  joinDate: timestamp("join_date").notNull().default(sql`now()`),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id"),
  title: text("title").notNull(),
  address: text("address").notNull(),
  time: varchar("time", { length: 20 }),
  status: varchar("status", { length: 50 }).notNull().default("Pending"), // "Pending" | "In Progress" | "Completed"
  type: varchar("type", { length: 50 }).notNull().default("Visit"),       // "Visit" | "Inspection" | "Delivery" | "Maintenance" | "Survey"
  assigneeId: varchar("assignee_id"),
  assigneeName: text("assignee_name"),
  priority: varchar("priority", { length: 20 }),                          // "High" | "Medium" | "Low"
  dueDate: text("due_date"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const visits = pgTable("visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  clientName: text("client_name").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
  photos: json("photos"),
  status: varchar("status", { length: 50 }).notNull().default("completed"),
  visitDate: timestamp("visit_date").notNull().default(sql`now()`),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const timesheets = pgTable("timesheets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").notNull(),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  workHours: numeric("work_hours"),
  breaksMinutes: numeric("breaks_minutes").default("0"),
  status: varchar("status", { length: 50 }).notNull().default("open"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEmployeeSchema = createInsertSchema(employees);
export const insertVisitSchema = createInsertSchema(visits);
export const insertTimesheetSchema = createInsertSchema(timesheets);
export const insertTaskSchema = createInsertSchema(tasks).omit({ createdAt: true, updatedAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Visit = typeof visits.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type TimeSheet = typeof timesheets.$inferSelect;
export type InsertTimeSheet = z.infer<typeof insertTimesheetSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

