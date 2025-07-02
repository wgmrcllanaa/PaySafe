import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scanResults = pgTable("scan_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  message: text("message").notNull(),
  platform: text("platform").notNull(), // SMS, Viber, Telegram
  isScam: boolean("is_scam").notNull(),
  scamProbability: decimal("scam_probability", { precision: 5, scale: 2 }).notNull(),
  reasons: text("reasons").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  scanResults: many(scanResults),
}));

export const scanResultsRelations = relations(scanResults, ({ one }) => ({
  user: one(users, {
    fields: [scanResults.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScanResultSchema = createInsertSchema(scanResults).pick({
  userId: true,
  message: true,
  platform: true,
  isScam: true,
  scamProbability: true,
  reasons: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertScanResult = z.infer<typeof insertScanResultSchema>;
export type ScanResult = typeof scanResults.$inferSelect;
