import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import {
  users, employees, visits, timesheets, tasks,
  type User, type InsertUser,
  type Employee, type InsertEmployee,
  type Visit, type InsertVisit,
  type TimeSheet, type InsertTimeSheet,
  type Task, type InsertTask,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { role?: string }): Promise<User>;

  // Employee methods
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployees(): Promise<Employee[]>;
  getEmployeesByAdmin(adminId: string): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | undefined>;

  // Visit methods
  createVisit(visit: InsertVisit): Promise<Visit>;
  getVisitsByUserId(userId: string): Promise<Visit[]>;
  getVisit(id: string): Promise<Visit | undefined>;
  updateVisit(id: string, visit: Partial<Visit>): Promise<Visit | undefined>;

  // TimeSheet methods
  createTimeSheet(timesheet: InsertTimeSheet): Promise<TimeSheet>;
  getTimeSheetsByUserId(userId: string): Promise<TimeSheet[]>;
  getTimeSheet(id: string): Promise<TimeSheet | undefined>;
  updateTimeSheet(id: string, timesheet: Partial<TimeSheet>): Promise<TimeSheet | undefined>;
  getOpenTimeSheet(userId: string): Promise<TimeSheet | undefined>;

  // Task methods
  getTasks(): Promise<Task[]>;
  getTasksByAdmin(adminId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // Stats
  getDashboardStats(adminId: string): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    totalVisitsToday: number;
    totalTasksCompleted: number;
    totalTasksPending: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // ─── Users ────────────────────────────────────────────────────────────────
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser & { role?: string }): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // ─── Employees ────────────────────────────────────────────────────────────
  async getEmployee(id: string): Promise<Employee | undefined> {
    const [emp] = await db.select().from(employees).where(eq(employees.id, id));
    return emp;
  }

  async getEmployees(): Promise<Employee[]> {
    return db.select().from(employees).orderBy(desc(employees.createdAt));
  }

  async getEmployeesByAdmin(adminId: string): Promise<Employee[]> {
    return db.select().from(employees).where(eq(employees.adminId, adminId)).orderBy(desc(employees.createdAt));
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [emp] = await db.insert(employees).values(insertEmployee).returning();
    return emp;
  }

  async updateEmployee(id: string, update: Partial<Employee>): Promise<Employee | undefined> {
    const [emp] = await db
      .update(employees)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return emp;
  }

  // ─── Visits ───────────────────────────────────────────────────────────────
  async createVisit(insertVisit: InsertVisit): Promise<Visit> {
    const [visit] = await db.insert(visits).values(insertVisit).returning();
    return visit;
  }

  async getVisitsByUserId(userId: string): Promise<Visit[]> {
    return db.select().from(visits).where(eq(visits.userId, userId)).orderBy(desc(visits.visitDate));
  }

  async getVisit(id: string): Promise<Visit | undefined> {
    const [visit] = await db.select().from(visits).where(eq(visits.id, id));
    return visit;
  }

  async updateVisit(id: string, update: Partial<Visit>): Promise<Visit | undefined> {
    const [visit] = await db.update(visits).set(update).where(eq(visits.id, id)).returning();
    return visit;
  }

  // ─── Timesheets ───────────────────────────────────────────────────────────
  async createTimeSheet(insertTimesheet: InsertTimeSheet): Promise<TimeSheet> {
    const [ts] = await db.insert(timesheets).values(insertTimesheet).returning();
    return ts;
  }

  async getTimeSheetsByUserId(userId: string): Promise<TimeSheet[]> {
    return db.select().from(timesheets).where(eq(timesheets.userId, userId)).orderBy(desc(timesheets.date));
  }

  async getTimeSheet(id: string): Promise<TimeSheet | undefined> {
    const [ts] = await db.select().from(timesheets).where(eq(timesheets.id, id));
    return ts;
  }

  async updateTimeSheet(id: string, update: Partial<TimeSheet>): Promise<TimeSheet | undefined> {
    const [ts] = await db.update(timesheets).set(update).where(eq(timesheets.id, id)).returning();
    return ts;
  }

  async getOpenTimeSheet(userId: string): Promise<TimeSheet | undefined> {
    const [ts] = await db
      .select()
      .from(timesheets)
      .where(and(eq(timesheets.userId, userId), eq(timesheets.status, "open")))
      .orderBy(desc(timesheets.createdAt));
    return ts;
  }

  // ─── Tasks ────────────────────────────────────────────────────────────────
  async getTasks(): Promise<Task[]> {
    return db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTasksByAdmin(adminId: string): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.adminId, adminId)).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: string, update: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return result.length > 0;
  }

  // ─── Dashboard Stats ──────────────────────────────────────────────────────
  async getDashboardStats(adminId: string) {
    const adminEmployees = await db.select().from(employees).where(eq(employees.adminId, adminId));
    const adminTasks = await db.select().from(tasks).where(eq(tasks.adminId, adminId));
    
    // Get all userIds for these employees to filter visits
    const employeeUserIds = adminEmployees.map(e => e.userId).filter(Boolean) as string[];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // We fetch all visits and filter in memory, or we can use `inArray` if we have employeeUserIds
    let todayVisits = [];
    if (employeeUserIds.length > 0) {
      const { inArray } = await import("drizzle-orm");
      todayVisits = await db.select().from(visits).where(
        and(
          eq(visits.status, "completed"),
          inArray(visits.userId, employeeUserIds)
        )
      );
    }

    return {
      totalEmployees: adminEmployees.length,
      activeEmployees: adminEmployees.filter(e => e.status === "active").length,
      totalVisitsToday: todayVisits.length,
      totalTasksCompleted: adminTasks.filter(t => t.status === "Completed").length,
      totalTasksPending: adminTasks.filter(t => t.status === "Pending").length,
    };
  }
}

export const storage = new DatabaseStorage();
