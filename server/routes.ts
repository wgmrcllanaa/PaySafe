import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/scan", async (req, res) => {
    try {
      const { message, platform, userId } = req.body;

      if (!message || !platform) {
        return res.status(400).json({ error: "Message and platform are required" });
      }

      const suspiciousKeywords = ['free', 'winner', 'urgent', 'click here', 'congratulations', 'limited time', 'act now', 'claim', 'prize'];
      const messageText = message.toLowerCase();
      const foundKeywords = suspiciousKeywords.filter((keyword: string) => messageText.includes(keyword));
      
      const isScam = foundKeywords.length > 0 || messageText.includes('http') || messageText.includes('verify account');
      const probability = isScam ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 25) + 5;
      
      const reasons = [];
      if (foundKeywords.length > 0) {
        reasons.push(`Suspicious keywords found: ${foundKeywords.join(', ')}`);
      }
      if (messageText.includes('http')) {
        reasons.push('Contains suspicious links');
      }
      if (messageText.includes('verify') || messageText.includes('account')) {
        reasons.push('Requests account verification');
      }
      if (messageText.includes('urgent') || messageText.includes('act now')) {
        reasons.push('Uses urgency tactics');
      }
      if (!isScam) {
        reasons.push('No suspicious patterns detected');
        reasons.push('Language appears legitimate');
      }

      res.json({
        id: "mock-id",
        status: isScam ? "SCAM" : "SAFE",
        probability,
        reasons: reasons.slice(0, 3),
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error scanning message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/scans", async (req, res) => {
    try {
      const { userId } = req.query;
      
      res.json([
        {
          id: "mock-id-1",
          message: "Free money! Click here to claim your prize!",
          platform: "Twitter",
          status: "SCAM",
          probability: 85,
          reasons: ["Suspicious keywords found: free, prize", "Contains suspicious links", "Requests account verification"],
          createdAt: "2023-10-27T10:00:00.000Z",
        },
        {
          id: "mock-id-2",
          message: "Your account has been verified. Click here to log in.",
          platform: "Facebook",
          status: "SAFE",
          probability: 50,
          reasons: ["No suspicious patterns detected", "Language appears legitimate"],
          createdAt: "2023-10-27T11:00:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching scan results:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/scans/:id", async (req, res) => {
    try {
      const scanId = parseInt(req.params.id);
      
      if (isNaN(scanId)) {
        return res.status(400).json({ error: "Invalid scan ID" });
      }

      res.json({ message: "Scan deleted successfully" });
    } catch (error) {
      console.error("Error deleting scan result:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
