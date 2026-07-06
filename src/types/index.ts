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
  weight?: number; // kg
  waist?: number; // cm
  chest?: number; // cm
  arm?: number; // cm
  shoulder?: number; // cm
  shoulders?: number; // cm
  hip?: number; // cm
  leg?: number; // cm
  rightArm?: number; // cm
  leftArm?: number; // cm
  rightForearm?: number; // cm
  leftForearm?: number; // cm
  rightThigh?: number; // cm
  leftThigh?: number; // cm
  rightCalf?: number; // cm
  leftCalf?: number; // cm
  neck?: number; // cm
  bodyFat?: number; // %
  bodyFatPercentage?: number; // %
  muscleMass?: number; // kg
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NutritionGoals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  targetWeight?: number;
  setByCoachId?: string;
  updatedAt?: string;
};

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
  userId: string;
  date: string;
  mealType: string;
  foodName?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  items?: MealFoodItem[];
  createdAt?: string;
  updatedAt?: string;
}

export type FavoriteMeal = {
  id: string;
  userId: string;
  name: string;
  mealType: string;
  items: MealFoodItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
  updatedAt: string;
};

export type WaterEntry = {
  id: string;
  userId?: string;
  date?: string;
  amountMl?: number;
  amount?: number;
  createdAt?: string;
};

export type NutritionCoachNote = {
  id: string;
  coachId: string;
  athleteId: string;
  date: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type NutritionDayStatus = {
  id: string;
  userId: string;
  date: string;
  completed: boolean;
  completedAt?: string;
};

export type WeeklyNutritionSummary = {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageWater: number;
  goalMatchedDays: number;
  highestCalorieDay?: string;
  lowestProteinDay?: string;
  mostConsumedFood?: string;
  totalMeals: number;
};

export type TrainingGoal =
  | 'muscle_gain'
  | 'fat_loss'
  | 'strength'
  | 'conditioning'
  | 'general_fitness';

export type TrainingLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced';

export type EquipmentType = string;

export type GeneratedProgramExercise = {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  minReps: number;
  maxReps: number;
  suggestedWeight?: number;
  rpeTarget?: number;
  rirTarget?: number;
  notes?: string;
  order: number;
};

export type GeneratedWorkoutDay = {
  id: string;
  dayNumber: number;
  title: string;
  focusMuscles: string[];
  exercises: GeneratedProgramExercise[];
  cardioMinutes?: number;
  notes?: string;
};

export type ProgramWorkoutSession = {
  dayNumber: number;
  name: string;
  exercises: any[];
  isCompleted?: boolean;
};

export type GeneratedTrainingProgram = {
  id: string;
  userId: string;
  name: string;
  goal: TrainingGoal | string;
  level: TrainingLevel | string;
  weeklyDays: number;
  durationWeeks: number;
  equipment: EquipmentType[];
  priorityMuscles: string[];
  restrictions: string[];
  days: GeneratedWorkoutDay[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  
  // AI program generator fields compatibility
  difficulty?: string;
  daysPerWeek?: number;
  sessions?: ProgramWorkoutSession[];
};

export type PersonalRecord = {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  recordType:
    | 'max_weight'
    | 'max_reps'
    | 'max_volume'
    | 'estimated_1rm'
    | 'rep_max';
  value: number;
  weight?: number;
  reps?: number;
  volume?: number;
  estimatedOneRepMax?: number;
  date: string;
  workoutId?: string;
  notes?: string;
  createdAt: string;
};

export type ProgressPhoto = {
  id: string;
  userId: string;
  date: string;
  viewType?: 'front' | 'side' | 'back' | 'custom';
  imageUrl?: string;
  storagePath?: string;
  pose?: 'front' | 'side' | 'back' | 'custom';
  url?: string;
  notes?: string;
  createdAt: string;
};

export type TrainingCalendarEntry = {
  id: string;
  userId: string;
  programId?: string;
  workoutId?: string;
  date: string;
  title?: string;
  sessionName?: string;
  status:
    | 'planned'
    | 'completed'
    | 'missed'
    | 'rest'
    | 'rest_day';
  focusMuscles?: string[];
  durationMinutes?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};

export type WorkoutSetEntry = {
  id: string;
  userId: string;
  workoutId: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
  rir?: number;
  isWarmup?: boolean;
  isCompleted: boolean;
  date: string;
  createdAt: string;
};

export type ProgressiveOverloadSuggestion = {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  suggestionType:
    | 'increase_weight'
    | 'increase_reps'
    | 'increase_sets'
    | 'maintain'
    | 'reduce_weight'
    | 'technique_focus'
    | 'deload';
  currentWeight?: number;
  suggestedWeight?: number;
  currentReps?: number;
  suggestedReps?: number;
  currentSets?: number;
  suggestedSets?: number;
  reason: string;
  confidence: number;
  createdAt: string;
};

export type ExerciseLibraryItem = {
  id: string;
  name: string;
  alternativeNames: string[];
  category:
    | 'strength'
    | 'cardio'
    | 'mobility'
    | 'stretching'
    | 'warmup';
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: EquipmentType[];
  difficulty: TrainingLevel;
  instructions: string[] | { en: string[] } | any;
  commonMistakes: string[];
  safetyTips: string[];
  alternatives: string[];
  videoUrl?: string;
  imageUrl?: string;
  isUnilateral?: boolean;
  isCompound?: boolean;
  isBodyweight?: boolean;
  keywords: string[];
};

export type MuscleVolumeSummary = {
  muscleGroup: string;
  totalSets: number;
  effectiveSets: number;
  totalReps: number;
  totalVolume: number;
  workoutCount: number;
};

export type RecoveryEntry = {
  id: string;
  userId: string;
  date: string;
  sleepHours: number;
  sleepQuality: number;
  fatigueLevel: number;
  stressLevel: number;
  muscleSoreness: number;
  motivationLevel: number;
  restingHeartRate?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReadinessResult = {
  score: number;
  level:
    | 'very_low'
    | 'low'
    | 'moderate'
    | 'good'
    | 'excellent';
  recommendation: string;
  factors: {
    sleep: number;
    fatigue: number;
    stress: number;
    soreness: number;
    motivation: number;
    trainingLoad: number;
  };
};

export type DeloadSuggestion = {
  id: string;
  userId: string;
  reason: string[];
  suggestedStartDate: string;
  suggestedDurationDays: number;
  volumeReductionPercent: number;
  intensityReductionPercent: number;
  status:
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'completed';
  createdAt: string;
};

export type BodyCompositionResult = {
  bmi?: number;
  bodyFatPercentage?: number;
  fatMass?: number;
  leanMass?: number;
  muscleMass?: number;
  waistToHeightRatio?: number;
};

