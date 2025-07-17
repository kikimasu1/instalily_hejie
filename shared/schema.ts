import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  partNumber: text("part_number").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // 'refrigerator' | 'dishwasher'
  imageUrl: text("image_url").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  reviewCount: integer("review_count").default(0),
  compatibleModels: text("compatible_models").array(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  productCards: text("product_cards").array(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

export const compatibilityMatrix = pgTable("compatibility_matrix", {
  id: serial("id").primaryKey(),
  partNumber: text("part_number").notNull(),
  applianceModel: text("appliance_model").notNull(),
  isCompatible: boolean("is_compatible").notNull(),
});

export const installationGuides = pgTable("installation_guides", {
  id: serial("id").primaryKey(),
  partNumber: text("part_number").notNull(),
  title: text("title").notNull(),
  steps: text("steps").array().notNull(),
  tools: text("tools").array(),
  estimatedTime: text("estimated_time"),
  difficulty: text("difficulty"), // 'easy' | 'medium' | 'hard'
  videoUrl: text("video_url"),
  pdfUrl: text("pdf_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  addedAt: true,
});

export const insertCompatibilitySchema = createInsertSchema(compatibilityMatrix).omit({
  id: true,
});

export const insertInstallationGuideSchema = createInsertSchema(installationGuides).omit({
  id: true,
});

export interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CompatibilityRecord = typeof compatibilityMatrix.$inferSelect;
export type InsertCompatibilityRecord = z.infer<typeof insertCompatibilitySchema>;
export type InstallationGuide = typeof installationGuides.$inferSelect;
export type InsertInstallationGuide = z.infer<typeof insertInstallationGuideSchema>;
