import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { storage } from "./storage";
import { log } from "./index";

interface ConnectedClient {
  ws: WebSocket;
  userId?: string;
  role?: string;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });
  const clients = new Set<ConnectedClient>();

  wss.on("connection", (ws, req) => {
    log("New WebSocket connection established", "ws");
    
    const client: ConnectedClient = { ws };
    clients.add(client);

    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "AUTH") {
          client.userId = message.userId;
          client.role = message.role;
          log(`Client authenticated via WS: ${client.userId} (${client.role})`, "ws");
        } 
        else if (message.type === "LOCATION_UPDATE") {
          const { latitude, longitude, employeeId } = message.payload;
          
          if (!employeeId) {
            return;
          }

          // 1. Update the database
          await storage.updateEmployee(employeeId, {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });

          // 2. Broadcast to all connected admins
          const updateMessage = JSON.stringify({
            type: "LOCATION_UPDATE",
            payload: { employeeId, latitude, longitude },
          });

          clients.forEach((c) => {
            if (c.role === "admin" && c.ws.readyState === WebSocket.OPEN) {
              c.ws.send(updateMessage);
            }
          });
        }
      } catch (err) {
        log(`Failed to process WS message: ${err}`, "ws");
      }
    });

    ws.on("close", () => {
      clients.delete(client);
    });
  });

  return wss;
}
