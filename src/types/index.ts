/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserSettings {
  nickname: string;
  height: number; // cm
  currentWeight: number; // kg
  targetWeight: number; // kg
  dailyCalorieGoal: number; // kcal
  dailyWaterGoal: number; // ml
  theme: 'dark' | 'light';
  createdAt: string;
  gender?: string;
  weeklyWorkoutTarget?: number;
  activityLevel?: string;
}

export type WorkoutType =
  | 'Göğüs'
  | 'Sırt'
  | 'Omuz'
  | 'Kol'
  | 'Bacak'
  | 'Kardiyo'
  | 'Full Body'
  | 'Karın'
  | 'Diğer';

export type WorkoutDifficulty = 'Kolay' | 'Orta' | 'Zor';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number; // kg
  restSeconds: number;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: WorkoutSet[] | number;
  reps?: number;
  weight?: number; // kg
  restSeconds?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: WorkoutType;
  duration: number; // minutes
  caloriesBurned: number; // kcal
  difficulty: WorkoutDifficulty;
  notes?: string;
  exercises: Exercise[];
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string; // YYYY-MM-DD
  waist?: number; // cm
  chest?: number; // cm
  arm?: number; // cm
  shoulder?: number; // cm
  hip?: number; // cm
  leg?: number; // cm
  neck?: number; // cm
  bodyFat?: number; // %
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MealType = 'Kahvaltı' | 'Öğle' | 'Akşam' | 'Ara Öğün';

export interface MealFoodItem {
  id: string;
  foodId?: string;
  name: string;
  amountGram: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foodName: string;
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fat: number; // g;
  notes?: string;
  items?: MealFoodItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WaterEntry {
  date: string; // YYYY-MM-DD
  amountMl: number; // ml
}
