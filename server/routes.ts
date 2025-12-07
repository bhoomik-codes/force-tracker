import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVisitSchema, insertTimesheetSchema, insertEmployeeSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Employee Routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }
      res.json(employee);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      if (!employee) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }
      res.json(employee);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Visit Routes
  app.post("/api/visits", async (req, res) => {
    try {
      const visitData = insertVisitSchema.parse(req.body);
      const visit = await storage.createVisit(visitData);
      res.status(201).json(visit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/visits/:userId", async (req, res) => {
    try {
      const visits = await storage.getVisitsByUserId(req.params.userId);
      res.json(visits);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/visit/:id", async (req, res) => {
    try {
      const visit = await storage.getVisit(req.params.id);
      if (!visit) {
        res.status(404).json({ error: "Visit not found" });
        return;
      }
      res.json(visit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/visit/:id", async (req, res) => {
    try {
      const visit = await storage.updateVisit(req.params.id, req.body);
      if (!visit) {
        res.status(404).json({ error: "Visit not found" });
        return;
      }
      res.json(visit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // TimeSheet Routes
  app.post("/api/timesheets", async (req, res) => {
    try {
      const timesheetData = insertTimesheetSchema.parse(req.body);
      const timesheet = await storage.createTimeSheet(timesheetData);
      res.status(201).json(timesheet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/timesheets/:userId", async (req, res) => {
    try {
      const timesheets = await storage.getTimeSheetsByUserId(req.params.userId);
      res.json(timesheets);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/timesheet/:id", async (req, res) => {
    try {
      const timesheet = await storage.getTimeSheet(req.params.id);
      if (!timesheet) {
        res.status(404).json({ error: "TimeSheet not found" });
        return;
      }
      res.json(timesheet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/timesheet/:id", async (req, res) => {
    try {
      const timesheet = await storage.updateTimeSheet(req.params.id, req.body);
      if (!timesheet) {
        res.status(404).json({ error: "TimeSheet not found" });
        return;
      }
      res.json(timesheet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}
