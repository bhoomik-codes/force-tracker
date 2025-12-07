import { type User, type InsertUser, type Visit, type InsertVisit, type TimeSheet, type InsertTimeSheet, type Employee, type InsertEmployee } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Employee methods
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployees(): Promise<Employee[]>;
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private employees: Map<string, Employee>;
  private visits: Map<string, Visit>;
  private timesheets: Map<string, TimeSheet>;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.visits = new Map();
    this.timesheets = new Map();
    
    // Initialize with sample employee
    this.employees.set("emp-001", {
      id: "emp-001",
      userId: "user-001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@techcorp.com",
      phone: "+91 98765 43210",
      position: "Field Technician",
      department: "Operations",
      location: "Gurugram, India",
      avatar: "RK",
      employeeId: "TC-2024-001",
      joinDate: new Date("2024-01-15"),
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Employee);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Employee CRUD
  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = {
      ...insertEmployee,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Employee;
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | undefined> {
    const existing = this.employees.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...employee, updatedAt: new Date() };
    this.employees.set(id, updated);
    return updated;
  }

  // Visit CRUD
  async createVisit(insertVisit: InsertVisit): Promise<Visit> {
    const id = randomUUID();
    const visit: Visit = { 
      ...insertVisit, 
      id,
      createdAt: new Date(),
      visitDate: insertVisit.visitDate || new Date(),
    } as Visit;
    this.visits.set(id, visit);
    return visit;
  }

  async getVisitsByUserId(userId: string): Promise<Visit[]> {
    return Array.from(this.visits.values()).filter(v => v.userId === userId);
  }

  async getVisit(id: string): Promise<Visit | undefined> {
    return this.visits.get(id);
  }

  async updateVisit(id: string, visit: Partial<Visit>): Promise<Visit | undefined> {
    const existing = this.visits.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...visit };
    this.visits.set(id, updated);
    return updated;
  }

  // TimeSheet CRUD
  async createTimeSheet(insertTimesheet: InsertTimeSheet): Promise<TimeSheet> {
    const id = randomUUID();
    const timesheet: TimeSheet = {
      ...insertTimesheet,
      id,
      createdAt: new Date(),
      date: insertTimesheet.date || new Date(),
    } as TimeSheet;
    this.timesheets.set(id, timesheet);
    return timesheet;
  }

  async getTimeSheetsByUserId(userId: string): Promise<TimeSheet[]> {
    return Array.from(this.timesheets.values()).filter(t => t.userId === userId);
  }

  async getTimeSheet(id: string): Promise<TimeSheet | undefined> {
    return this.timesheets.get(id);
  }

  async updateTimeSheet(id: string, timesheet: Partial<TimeSheet>): Promise<TimeSheet | undefined> {
    const existing = this.timesheets.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...timesheet };
    this.timesheets.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
