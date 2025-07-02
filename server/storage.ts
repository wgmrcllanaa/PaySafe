import { users, scanResults, type User, type InsertUser, type ScanResult, type InsertScanResult } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createScanResult(scanResult: InsertScanResult): Promise<ScanResult>;
  getScanResults(userId?: number): Promise<ScanResult[]>;
  getScanResult(id: number): Promise<ScanResult | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createScanResult(insertScanResult: InsertScanResult): Promise<ScanResult> {
    const [scanResult] = await db
      .insert(scanResults)
      .values(insertScanResult)
      .returning();
    return scanResult;
  }

  async getScanResults(userId?: number): Promise<ScanResult[]> {
    if (userId) {
      return await db.select().from(scanResults).where(eq(scanResults.userId, userId));
    }
    return await db.select().from(scanResults);
  }

  async getScanResult(id: number): Promise<ScanResult | undefined> {
    const [scanResult] = await db.select().from(scanResults).where(eq(scanResults.id, id));
    return scanResult || undefined;
  }
}

export const storage = new DatabaseStorage();
