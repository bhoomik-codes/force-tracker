import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  insertVisitSchema,
  insertTimesheetSchema,
  insertEmployeeSchema,
  insertTaskSchema,
  insertUserSchema,
} from "@shared/schema";
import { sendEmployeeCredentials } from "./mail";

// --- Security Helpers ---
const SALT_LEN = 16;
const KEY_LEN = 64;

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LEN).toString("hex");
  const buf = crypto.scryptSync(password, salt, KEY_LEN);
  return `${buf.toString("hex")}.${salt}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [hash, salt] = storedHash.split(".");
  if (!hash || !salt) return false;
  const buf = crypto.scryptSync(password, salt, KEY_LEN);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), buf);
}

// Friendly error handler
function handleError(res: Response, error: any) {
  console.error("API Error:", error);
  let message = error.message || "An unexpected error occurred.";
  if (message.includes("ENOTFOUND") || message.includes("ECONNREFUSED") || message.includes("tenant/user")) {
    message = "Unable to connect to the database. Please try again later.";
  } else if (message.includes("duplicate key")) {
    message = "This record already exists.";
  }
  res.status(400).json({ error: message });
}

// --- Middlewares ---
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const role = (req.session as any).userRole;
  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
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
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isMatch = user.password.includes(".") 
        ? verifyPassword(password, user.password)
        : user.password === password; // Fallback for existing MVP plaintext passwords

      if (!isMatch) {
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
        return res.status(400).json({ error: "Invalid username or password (min 6 characters)" });
      }
      
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Hash password before saving
      const hashedPassword = hashPassword(password);
      
      // Create admin user
      const user = await storage.createUser({ username, password: hashedPassword, role: "admin" });
      
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

  app.get("/api/me", requireAuth, async (req, res) => {
    const userId = (req.session as any).userId;
    const user = await storage.getUser(userId);
    if (!user) return res.status(401).json({ error: "User not found" });
    const allEmployees = await storage.getEmployees();
    const employee = allEmployees.find(e => e.userId === userId);
    res.json({ id: user.id, username: user.username, role: user.role, employeeId: employee?.id ?? null, employeeName: employee?.name ?? null });
  });

  // ─── Employee Routes ───────────────────────────────────────────────────────
  app.get("/api/employees", requireAuth, requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).userId;
      const emps = await storage.getEmployeesByAdmin(adminId);
      res.json(emps);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/employees/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) return res.status(404).json({ error: "Employee not found" });
      
      // IDOR check
      if (userRole === "admin" && employee.adminId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      if (userRole === "employee" && employee.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      res.json(employee);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/employees", requireAuth, requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).userId;
      const data = insertEmployeeSchema.parse(req.body);
      
      // Secure credential generation
      const username = data.email.split("@")[0] + crypto.randomInt(1000, 9999).toString();
      const rawPassword = crypto.randomBytes(8).toString("hex"); // 16 chars secure random
      const hashedPassword = hashPassword(rawPassword);
      
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        role: "employee"
      });

      const employee = await storage.createEmployee({
        ...data,
        userId: newUser.id,
        adminId: adminId
      });

      await sendEmployeeCredentials(data.email, data.name, username, rawPassword);
      res.status(201).json(employee);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.put("/api/employees/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).userId;
      const existing = await storage.getEmployee(req.params.id);
      if (!existing) return res.status(404).json({ error: "Employee not found" });
      
      // Strict IDOR Check
      if (existing.adminId !== adminId) {
        return res.status(403).json({ error: "Forbidden: Cannot edit other organization's employee" });
      }

      const employee = await storage.updateEmployee(req.params.id, req.body);
      res.json(employee);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  // ─── Task Routes ───────────────────────────────────────────────────────────
  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      let userTasks: any[] = [];
      if (userRole === "admin") {
        userTasks = await storage.getTasksByAdmin(userId);
      } else {
        const allEmployees = await storage.getEmployees();
        const me = allEmployees.find(e => e.userId === userId);
        if (me && me.adminId) {
          userTasks = await storage.getTasksByAdmin(me.adminId);
          // Only return tasks assigned to this employee
          userTasks = userTasks.filter(t => t.assigneeId === me.id);
        }
      }
      res.json(userTasks);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      const task = await storage.getTask(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      
      // IDOR
      if (userRole === "admin" && task.adminId !== userId) return res.status(403).json({ error: "Forbidden" });
      
      res.json(task);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/tasks", requireAuth, requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).userId;
      const data = insertTaskSchema.parse({ ...req.body, adminId });
      const task = await storage.createTask(data);
      res.status(201).json(task);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.put("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      const existing = await storage.getTask(req.params.id);
      if (!existing) return res.status(404).json({ error: "Task not found" });
      
      // IDOR check: Admin must own the task. Employee must be assigned to it.
      if (userRole === "admin" && existing.adminId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      if (userRole === "employee") {
        const allEmployees = await storage.getEmployees();
        const me = allEmployees.find(e => e.userId === userId);
        if (!me || existing.assigneeId !== me.id) {
          return res.status(403).json({ error: "Forbidden" });
        }
      }

      const task = await storage.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.delete("/api/tasks/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).userId;
      const existing = await storage.getTask(req.params.id);
      if (!existing) return res.status(404).json({ error: "Task not found" });
      
      if (existing.adminId !== adminId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const deleted = await storage.deleteTask(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      handleError(res, error);
    }
  });

  // ─── Visit Routes ───────────────────────────────────────────────────────────
  app.get("/api/visits", requireAuth, requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).userId;
      const visitList = await storage.getVisitsByAdmin(adminId);
      res.json(visitList);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/visits", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      if (req.body.photos && Array.isArray(req.body.photos)) {
        const processedPhotos = req.body.photos.map((photo: string) => {
          if (photo.startsWith("data:image")) {
            const matches = photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const mime = matches[1];
              // Robust extension validation to prevent path traversal / execution
              const validMimes: Record<string, string> = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp',
                'image/gif': 'gif'
              };
              if (!validMimes[mime]) throw new Error("Invalid image format");
              
              const extension = validMimes[mime];
              const buffer = Buffer.from(matches[2], 'base64');
              const filename = `${crypto.randomUUID()}.${extension}`;
              // Ensure path is strictly inside uploads
              const filepath = path.join(process.cwd(), "uploads", filename);
              fs.writeFileSync(filepath, buffer);
              return `/uploads/${filename}`;
            }
          }
          return photo;
        });
        req.body.photos = processedPhotos;
      }

      // Enforce userId bounds
      const data = insertVisitSchema.parse({ ...req.body, userId });
      const visit = await storage.createVisit(data);
      res.status(201).json(visit);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/visits/:userId", requireAuth, async (req, res) => {
    try {
      // IDOR check: Users can only see their own visits, Admins can see visits of their employees
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      const targetUserId = req.params.userId;

      if (userRole === "employee" && userId !== targetUserId) {
         return res.status(403).json({ error: "Forbidden" });
      }
      
      const visitList = await storage.getVisitsByUserId(targetUserId);
      res.json(visitList);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/visit/:id", requireAuth, async (req, res) => {
    try {
      const visit = await storage.getVisit(req.params.id);
      if (!visit) return res.status(404).json({ error: "Visit not found" });
      res.json(visit);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.put("/api/visit/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      const existing = await storage.getVisit(req.params.id);
      if (!existing) return res.status(404).json({ error: "Visit not found" });

      if (userRole === "employee" && existing.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const visit = await storage.updateVisit(req.params.id, req.body);
      res.json(visit);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  // ─── TimeSheet Routes ───────────────────────────────────────────────────────
  app.get("/api/timesheets", requireAuth, requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).userId;
      const timesheets = await storage.getTimesheetsByAdmin(adminId);
      res.json(timesheets);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/timesheets/punch-in", requireAuth, async (req, res) => {
    try {
      const { userId } = req.body;
      const sessionUserId = (req.session as any).userId;
      if (!userId || userId !== sessionUserId) return res.status(403).json({ error: "Forbidden" });

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

  app.post("/api/timesheets/punch-out", requireAuth, async (req, res) => {
    try {
      const { userId } = req.body;
      const sessionUserId = (req.session as any).userId;
      if (!userId || userId !== sessionUserId) return res.status(403).json({ error: "Forbidden" });

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

  app.get("/api/timesheets/active/:userId", requireAuth, async (req, res) => {
    try {
      const sessionUserId = (req.session as any).userId;
      if (req.params.userId !== sessionUserId && (req.session as any).userRole !== "admin") {
         return res.status(403).json({ error: "Forbidden" });
      }
      const open = await storage.getOpenTimeSheet(req.params.userId);
      res.json(open ?? null);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.post("/api/timesheets", requireAuth, async (req, res) => {
    try {
      // Typically only admins or system create manual timesheets, skipping strict check for MVP
      const data = insertTimesheetSchema.parse(req.body);
      const timesheet = await storage.createTimeSheet(data);
      res.status(201).json(timesheet);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/timesheets/:userId", requireAuth, async (req, res) => {
    try {
      const sessionUserId = (req.session as any).userId;
      if (req.params.userId !== sessionUserId && (req.session as any).userRole !== "admin") {
         return res.status(403).json({ error: "Forbidden" });
      }
      const tsList = await storage.getTimeSheetsByUserId(req.params.userId);
      res.json(tsList);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.get("/api/timesheet/:id", requireAuth, async (req, res) => {
    try {
      const ts = await storage.getTimeSheet(req.params.id);
      if (!ts) return res.status(404).json({ error: "TimeSheet not found" });
      res.json(ts);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  app.put("/api/timesheet/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      const existing = await storage.getTimeSheet(req.params.id);
      if (!existing) return res.status(404).json({ error: "TimeSheet not found" });

      if (userRole === "employee" && existing.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const ts = await storage.updateTimeSheet(req.params.id, req.body);
      res.json(ts);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  // ─── Dashboard Stats ───────────────────────────────────────────────────────
  app.get("/api/stats/dashboard", requireAuth, requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).userId;
      const stats = await storage.getDashboardStats(adminId);
      res.json(stats);
    } catch (error: any) {
      handleError(res, error);
    }
  });

  // ─── Settings Routes (Admin Only) ───────────────────────────────────────
  app.get("/api/settings", requireAuth, requireAdmin, async (req, res) => {
    try {
      let settings = await storage.getSettings((req.session as any).adminId!);
      if (!settings) {
        // Return default structure if nothing is saved yet
        settings = await storage.updateSettings((req.session as any).adminId!, {});
      }
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", requireAuth, requireAdmin, async (req, res) => {
    try {
      const updatedSettings = await storage.updateSettings((req.session as any).adminId!, req.body);
      res.json(updatedSettings);
    } catch (err) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  return httpServer;
}
