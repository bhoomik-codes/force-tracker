import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertVisitSchema,
  insertTimesheetSchema,
  insertEmployeeSchema,
  insertTaskSchema,
  insertUserSchema,
} from "@shared/schema";
import { sendEmployeeCredentials } from "./mail";


// Friendly error handler to obscure DB errors
function handleError(res, error) {
  console.error("API Error:", error);
  let message = error.message || "An unexpected error occurred.";
  // Check for common DB errors
  if (message.includes("ENOTFOUND") || message.includes("ECONNREFUSED") || message.includes("tenant/user")) {
    message = "Unable to connect to the database. Please try again later.";
  } else if (message.includes("duplicate key")) {
    message = "This record already exists.";
  }
  // Default to 400 or 500 depending on if we know it is a client error, but we just use 400 for generic
  res.status(400).json({ error: message });
}

export async function registerRoutes(

  httpServer: Server,
  app: Express
): Promise<Server> {
  // ─── Auth Routes ──────────────────────────────────────────────────────────
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      // Store user in session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;
      res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password || username.length < 3 || password.length < 6) {
        return res.status(400).json({ error: "Invalid username or password" });
      }
      
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Create admin user
      const user = await storage.createUser({ username, password, role: "admin" });
      
      // Auto login
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;
      res.status(201).json({ id: user.id, username: user.username, role: user.role });
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/me", async (req, res) => {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    const user = await storage.getUser(userId);
    if (!user) return res.status(401).json({ error: "User not found" });
    // If employee, also return their employee record
    const allEmployees = await storage.getEmployees();
    const employee = allEmployees.find(e => e.userId === userId);
    res.json({ id: user.id, username: user.username, role: user.role, employeeId: employee?.id ?? null, employeeName: employee?.name ?? null });
  });

  // ─── Employee Routes ───────────────────────────────────────────────────────
  app.get("/api/employees", async (req, res) => {
    try {
      const adminId = (req.session as any)?.userId;
      if (!adminId) return res.status(401).json({ error: "Unauthorized" });
      
      const emps = await storage.getEmployeesByAdmin(adminId);
      res.json(emps);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) return res.status(404).json({ error: "Employee not found" });
      res.json(employee);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const adminId = (req.session as any)?.userId;
      if (!adminId) return res.status(401).json({ error: "Unauthorized" });

      const data = insertEmployeeSchema.parse(req.body);
      
      // Generate employee credentials
      const username = data.email.split("@")[0] + Math.floor(Math.random() * 1000);
      const password = Math.random().toString(36).slice(-8) + "!";
      
      // Create User account first
      const newUser = await storage.createUser({
        username,
        password,
        role: "employee"
      });

      // Create Employee record
      const employee = await storage.createEmployee({
        ...data,
        userId: newUser.id,
        adminId: adminId
      });

      // Send Email
      await sendEmployeeCredentials(data.email, data.name, username, password);

      res.status(201).json(employee);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      if (!employee) return res.status(404).json({ error: "Employee not found" });
      res.json(employee);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  // ─── Task Routes ───────────────────────────────────────────────────────────
  app.get("/api/tasks", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      const userRole = (req.session as any)?.userRole;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      let userTasks: any[] = [];
      if (userRole === "admin") {
        userTasks = await storage.getTasksByAdmin(userId);
      } else {
        // If employee, we could fetch only their tasks, but for now we'll fetch all tasks 
        // since we haven't linked them cleanly to adminId on the employee side in this route.
        // Usually, we'd fetch the employee record, get its adminId, and fetch tasks for that adminId.
        const allEmployees = await storage.getEmployees();
        const me = allEmployees.find(e => e.userId === userId);
        if (me && me.adminId) {
          userTasks = await storage.getTasksByAdmin(me.adminId);
        }
      }
      res.json(userTasks);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const adminId = (req.session as any)?.userId;
      if (!adminId) return res.status(401).json({ error: "Unauthorized" });

      const data = insertTaskSchema.parse({ ...req.body, adminId });
      const task = await storage.createTask(data);
      res.status(201).json(task);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Task not found" });
      res.json({ success: true });
    } catch (error: any) {
      handleError(res, error);
    }
  });

  // ─── Visit Routes ───────────────────────────────────────────────────────────
  app.post("/api/visits", async (req, res) => {
    try {
      const data = insertVisitSchema.parse(req.body);
      const visit = await storage.createVisit(data);
      res.status(201).json(visit);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/visits/:userId", async (req, res) => {
    try {
      const visitList = await storage.getVisitsByUserId(req.params.userId);
      res.json(visitList);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/visit/:id", async (req, res) => {
    try {
      const visit = await storage.getVisit(req.params.id);
      if (!visit) return res.status(404).json({ error: "Visit not found" });
      res.json(visit);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.put("/api/visit/:id", async (req, res) => {
    try {
      const visit = await storage.updateVisit(req.params.id, req.body);
      if (!visit) return res.status(404).json({ error: "Visit not found" });
      res.json(visit);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  // ─── TimeSheet Routes ──────────────────────────────────────────────────────
  app.post("/api/timesheets/punch-in", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: "userId required" });

      // Check if already punched in
      const existing = await storage.getOpenTimeSheet(userId);
      if (existing) return res.status(409).json({ error: "Already punched in", timesheet: existing });

      const now = new Date();
      const timesheet = await storage.createTimeSheet({
        userId,
        date: now,
        checkInTime: now,
        status: "open",
        breaksMinutes: "0",
      });
      res.status(201).json(timesheet);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/timesheets/punch-out", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const open = await storage.getOpenTimeSheet(userId);
      if (!open) return res.status(404).json({ error: "No active check-in found" });

      const now = new Date();
      const checkIn = open.checkInTime ? new Date(open.checkInTime) : new Date(open.date);
      const workHours = ((now.getTime() - checkIn.getTime()) / 3600000).toFixed(2);

      const updated = await storage.updateTimeSheet(open.id, {
        checkOutTime: now,
        status: "closed",
        workHours,
      });
      res.json(updated);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/timesheets/active/:userId", async (req, res) => {
    try {
      const open = await storage.getOpenTimeSheet(req.params.userId);
      res.json(open ?? null);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/timesheets", async (req, res) => {
    try {
      const data = insertTimesheetSchema.parse(req.body);
      const timesheet = await storage.createTimeSheet(data);
      res.status(201).json(timesheet);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/timesheets/:userId", async (req, res) => {
    try {
      const tsList = await storage.getTimeSheetsByUserId(req.params.userId);
      res.json(tsList);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/timesheet/:id", async (req, res) => {
    try {
      const ts = await storage.getTimeSheet(req.params.id);
      if (!ts) return res.status(404).json({ error: "TimeSheet not found" });
      res.json(ts);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.put("/api/timesheet/:id", async (req, res) => {
    try {
      const ts = await storage.updateTimeSheet(req.params.id, req.body);
      if (!ts) return res.status(404).json({ error: "TimeSheet not found" });
      res.json(ts);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  // ─── Dashboard Stats ───────────────────────────────────────────────────────
  app.get("/api/stats/dashboard", async (req, res) => {
    try {
      const adminId = (req.session as any)?.userId;
      if (!adminId) return res.status(401).json({ error: "Unauthorized" });

      const stats = await storage.getDashboardStats(adminId);
      res.json(stats);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  return httpServer;
}
