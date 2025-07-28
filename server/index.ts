// server/index.ts
import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import axios from "axios";
import { createServer } from "http"; // ✅ ESM-safe import
import { WebSocketServer } from "ws"; // <-- Added for WebSocket support

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// === WebSocket clipboard sync state ===
let latestClipboard: string | null = null;
let wsClients: Set<any> = new Set();

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// 👇 Inline route registration with Flask proxy
async function registerRoutes(app: express.Express) {
  // React → Express → Flask
  app.post("/api/predict", async (req, res) => {
    try {
      const { message } = req.body;

      const response = await axios.post("http://localhost:5001/predict", {
        message,
      });

      res.json(response.data);
    } catch (error: any) {
      console.error("Error contacting Flask:", error.message);
      res.status(500).json({ error: "Model service unavailable" });
    }
  });

  // Android Clipboard → Express → Flask
  app.post("/api/clipboard", async (req, res) => {
    try {
      const { clipboard } = req.body;
      if (!clipboard || typeof clipboard !== "string" || clipboard.length < 2) {
        return res.status(400).json({ error: "No clipboard text provided" });
      }
      latestClipboard = clipboard; // <-- Store latest clipboard

      // Forward to Flask /predict
      const response = await axios.post("http://localhost:5001/predict", {
        message: clipboard,
      });

      // Broadcast to all WebSocket clients
      const payload = JSON.stringify({ clipboard });
      wsClients.forEach((ws) => {
        if (ws.readyState === 1) ws.send(payload);
      });

      res.json(response.data);
    } catch (error: any) {
      console.error("Error in /api/clipboard:", error.message);
      res.status(500).json({ error: "Clipboard model service unavailable" });
    }
  });

  const server = createServer(app); // ✅ fixed here

  // === WebSocket server setup ===
  const wss = new WebSocketServer({ server, path: "/ws_clipboard" });
  wss.on("connection", (ws) => {
    wsClients.add(ws);
    // Send the latest clipboard on connect
    if (latestClipboard) {
      ws.send(JSON.stringify({ clipboard: latestClipboard }));
    }
    ws.on("close", () => wsClients.delete(ws));
  });

  return server;
}

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5002;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
