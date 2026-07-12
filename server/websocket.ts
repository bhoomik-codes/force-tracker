import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { storage } from "./storage";
import { log } from "./index";

interface ConnectedClient {
  ws: WebSocket;
  userId?: string;
  role?: string;
}

export function setupWebSocket(server: Server, sessionParser: any) {
  // Use noServer as we are hooking into the HTTP upgrade event manually
  const wss = new WebSocketServer({ noServer: true, path: "/ws" });
  const clients = new Set<ConnectedClient>();

  // Securely intercept upgrade requests
  server.on("upgrade", (request: any, socket, head) => {
    const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
    
    if (pathname === "/ws") {
      sessionParser(request, {} as any, () => {
        const session = request.session;
        // Block unauthenticated socket upgrades immediately
        if (!session || !session.userId) {
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();
          return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      });
    }
  });

  wss.on("connection", (ws, req: any) => {
    // Authenticate using strictly the HTTP Session data, NOT a client payload
    const session = req.session;
    const client: ConnectedClient = { ws, userId: session.userId, role: session.userRole };
    clients.add(client);
    
    log(`Client authenticated via WS session: ${client.userId} (${client.role})`, "ws");

    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "LOCATION_UPDATE") {
          const { latitude, longitude, employeeId } = message.payload;
          
          if (!employeeId || !latitude || !longitude) return;

          // Strict IDOR Check: Ensure the sender is modifying their own location
          const allEmployees = await storage.getEmployees();
          const me = allEmployees.find(e => e.userId === client.userId);
          if (!me || me.id !== employeeId) {
            log(`Blocked unauthorized location update from user ${client.userId}`, "ws");
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
