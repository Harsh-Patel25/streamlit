import { type Task, type InsertTask, type Habit, type InsertHabit, type Challenge, type InsertChallenge, type Achievement, type InsertAchievement } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Habits
  getHabits(): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;
  
  // Challenges
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | undefined>;
  deleteChallenge(id: string): Promise<boolean>;
  
  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getAchievement(id: string): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement | undefined>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task> = new Map();
  private habits: Map<string, Habit> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private achievements: Map<string, Achievement> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize with some default achievements
    const defaultAchievements: Achievement[] = [
      {
        id: randomUUID(),
        name: "Fire Starter",
        description: "Complete a 7-day streak",
        icon: "fas fa-fire",
        type: "streak",
        requirement: 7,
        earned: false,
        earnedAt: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "First Win",
        description: "Complete your first challenge",
        icon: "fas fa-trophy",
        type: "completion",
        requirement: 1,
        earned: false,
        earnedAt: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Consistent",
        description: "Maintain a 14-day streak",
        icon: "fas fa-star",
        type: "streak",
        requirement: 14,
        earned: false,
        earnedAt: null,
        createdAt: new Date(),
      },
    ];

    defaultAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date(),
      completedAt: null,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    if (updates.status === "completed" && task.status !== "completed") {
      updatedTask.completedAt = new Date();
    } else if (updates.status === "pending") {
      updatedTask.completedAt = null;
    }
    
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Habits
  async getHabits(): Promise<Habit[]> {
    return Array.from(this.habits.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = randomUUID();
    const habit: Habit = {
      ...insertHabit,
      id,
      currentStreak: 0,
      bestStreak: 0,
      completions: [],
      createdAt: new Date(),
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: string): Promise<boolean> {
    return this.habits.delete(id);
  }

  // Challenges
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = {
      ...insertChallenge,
      id,
      progress: 0,
      completions: [],
      badges: [
        { id: randomUUID(), name: "Starter", icon: "fas fa-play", earned: false },
        { id: randomUUID(), name: "Halfway", icon: "fas fa-star-half-alt", earned: false },
        { id: randomUUID(), name: "Champion", icon: "fas fa-trophy", earned: false },
      ],
      createdAt: new Date(),
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) return undefined;
    
    const updatedChallenge = { ...challenge, ...updates };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  async deleteChallenge(id: string): Promise<boolean> {
    return this.challenges.delete(id);
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getAchievement(id: string): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      earned: false,
      earnedAt: null,
      createdAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    if (!achievement) return undefined;
    
    const updatedAchievement = { ...achievement, ...updates };
    if (updates.earned && !achievement.earned) {
      updatedAchievement.earnedAt = new Date();
    }
    
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }
}

export const storage = new MemStorage();
