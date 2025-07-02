import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScanResultSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Scan message endpoint
  app.post("/api/scan", async (req, res) => {
    try {
      const { message, platform, userId } = req.body;

      if (!message || !platform) {
        return res.status(400).json({ error: "Message and platform are required" });
      }

      // Mock AI analysis logic
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

      // Save scan result to database
      const scanResult = await storage.createScanResult({
        userId: userId || null,
        message,
        platform,
        isScam,
        scamProbability: probability.toString(),
        reasons: reasons.slice(0, 3), // Limit to 3 reasons
      });

      res.json({
        id: scanResult.id,
        status: isScam ? "SCAM" : "SAFE",
        probability,
        reasons: reasons.slice(0, 3),
        createdAt: scanResult.createdAt,
      });
    } catch (error) {
      console.error("Error scanning message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get scan history endpoint
  app.get("/api/scans", async (req, res) => {
    try {
      const { userId } = req.query;
      const scanResults = await storage.getScanResults(userId ? Number(userId) : undefined);
      
      const formattedResults = scanResults.map(result => ({
        id: result.id,
        message: result.message,
        platform: result.platform,
        status: result.isScam ? "SCAM" : "SAFE",
        probability: Number(result.scamProbability),
        reasons: result.reasons,
        createdAt: result.createdAt,
      }));

      res.json(formattedResults);
    } catch (error) {
      console.error("Error fetching scan results:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete scan result endpoint
  app.delete("/api/scans/:id", async (req, res) => {
    try {
      const scanId = parseInt(req.params.id);
      
      if (isNaN(scanId)) {
        return res.status(400).json({ error: "Invalid scan ID" });
      }

      // Check if scan exists
      const existingScan = await storage.getScanResult(scanId);
      if (!existingScan) {
        return res.status(404).json({ error: "Scan not found" });
      }

      await storage.deleteScanResult(scanId);
      res.json({ message: "Scan deleted successfully" });
    } catch (error) {
      console.error("Error deleting scan result:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
