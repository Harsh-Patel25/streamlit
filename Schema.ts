import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull().default("medium"),
  status: text("status", { enum: ["pending", "completed"] }).notNull().default("pending"),
  dueDate: timestamp("due_date"),
  category: text("category").default("work"),
  subtasks: jsonb("subtasks").$type<Array<{ id: string; title: string; completed: boolean }>>().default([]),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("fas fa-check"),
  targetValue: integer("target_value").default(1),
  currentStreak: integer("current_streak").default(0),
  bestStreak: integer("best_streak").default(0),
  completions: jsonb("completions").$type<Array<{ date: string; value: number }>>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").default("fas fa-trophy"),
  duration: integer("duration").default(30),
  participants: integer("participants").default(1),
  progress: integer("progress").default(0),
  status: text("status", { enum: ["active", "completed", "available"] }).notNull().default("available"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  completions: jsonb("completions").$type<Array<{ date: string; completed: boolean }>>().default([]),
  badges: jsonb("badges").$type<Array<{ id: string; name: string; icon: string; earned: boolean; earnedAt?: string }>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("fas fa-star"),
  type: text("type", { enum: ["streak", "completion", "milestone"] }).notNull(),
  requirement: integer("requirement").notNull(),
  earned: boolean("earned").default(false),
  earnedAt: timestamp("earned_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  createdAt: true,
  currentStreak: true,
  bestStreak: true,
  completions: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
  progress: true,
  completions: true,
  badges: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
  earned: true,
  earnedAt: true,
});

// Types
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
