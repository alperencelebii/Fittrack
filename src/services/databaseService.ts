/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteField,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  UserSettings,
  Workout,
  WeightEntry,
  BodyMeasurement,
  MealEntry,
  WaterEntry,
  WorkoutSet,
  Exercise,
  FavoriteMeal,
  NutritionCoachNote,
  NutritionDayStatus,
  NutritionGoals,
  GeneratedTrainingProgram,
  TrainingCalendarEntry,
  WorkoutSetEntry,
  PersonalRecord,
  RecoveryEntry,
  DeloadSuggestion,
  ProgressPhoto,
} from '../types';
import { calculateEstimatedOneRepMax } from '../utils/prCalculations';

// --- HELPERS FOR DATA VALIDATION & COMPATIBILITY ---
export function sanitizeForFirestore(value: any): any {
  if (value === undefined) return '';
  if (value === null) return '';
  if (typeof value === 'number') {
    if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
    return value;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeForFirestore);
  }
  if (typeof value === 'object') {
    if (value.constructor && value.constructor.name !== 'Object' && value.constructor.name !== 'Array') {
      return value;
    }
    const cleaned: any = {};
    for (const [key, val] of Object.entries(value)) {
      if (val === undefined) {
        if (['calories', 'protein', 'carbs', 'fat', 'weight', 'amountMl', 'duration', 'caloriesBurned', 'waist', 'chest', 'arm', 'shoulder', 'hip', 'leg', 'neck', 'bodyFat'].includes(key)) {
          // Keep body measurements null if they are completely unentered, or 0 if we want default.
          // Let's use null for body measurements to distinguish between empty and 0cm pazu or waist!
          // Yes! If they are body measurements, let's return null if not defined, otherwise 0 for calories, carbs, etc.
          if (['waist', 'chest', 'arm', 'shoulder', 'hip', 'leg', 'neck', 'bodyFat'].includes(key)) {
            cleaned[key] = null;
          } else {
            cleaned[key] = 0;
          }
        } else if (['sets', 'exercises'].includes(key)) {
          cleaned[key] = [];
        } else {
          cleaned[key] = '';
        }
      } else {
        cleaned[key] = sanitizeForFirestore(val);
      }
    }
    return cleaned;
  }
  return value;
}

export function normalizeExerciseSets(exercise: any): WorkoutSet[] {
  if (!exercise) return [];
  if (Array.isArray(exercise.sets)) {
    return exercise.sets.map((set: any, index: number) => ({
      id: set.id || Math.random().toString(36).substring(2, 9),
      setNumber: Number(set.setNumber || index + 1),
      reps: Number(set.reps || 0),
      weight: Number(set.weight || 0),
      restSeconds: Number(set.restSeconds || 0),
      notes: set.notes || '',
    }));
  }

  // Legacy fallback (convert sets number to sets array)
  const setsCount = Number(exercise.sets || 0);
  const reps = Number(exercise.reps || 0);
  const weight = Number(exercise.weight || 0);
  const restSeconds = Number(exercise.restSeconds || 60);

  const normalizedSets: WorkoutSet[] = [];
  for (let i = 1; i <= setsCount; i++) {
    normalizedSets.push({
      id: Math.random().toString(36).substring(2, 9),
      setNumber: i,
      reps,
      weight,
      restSeconds,
      notes: '',
    });
  }
  return normalizedSets;
}

export function normalizeExercise(exercise: any): Exercise {
  if (!exercise) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      name: 'Egzersiz',
      sets: [],
      notes: '',
    };
  }
  const sets = normalizeExerciseSets(exercise);
  return {
    id: exercise.id || Math.random().toString(36).substring(2, 9),
    name: exercise.name || 'Egzersiz',
    sets,
    notes: exercise.notes || '',
  } as Exercise;
}

export function normalizeWorkout(workout: any, userId: string): Workout {
  if (!workout) {
    workout = {};
  }
  const id = workout.id || Math.random().toString(36).substring(2, 9);
  const name = workout.name || 'Antrenman';
  const date = workout.date || new Date().toISOString().split('T')[0];
  const type = workout.type || 'Diğer';
  const duration = Number(workout.duration || 0);
  const caloriesBurned = Number(workout.caloriesBurned || 0);
  const difficulty = workout.difficulty || 'Orta';
  const notes = workout.notes || '';
  const rawExercises = Array.isArray(workout.exercises) ? workout.exercises : [];
  const exercises = rawExercises.map((ex: any) => normalizeExercise(ex));
  const createdAt = workout.createdAt || new Date().toISOString();
  const updatedAt = workout.updatedAt || new Date().toISOString();

  // Return values with undefined properties replaced by fallback values to avoid Firestore errors
  return {
    id,
    userId,
    name,
    date,
    type,
    duration,
    caloriesBurned,
    difficulty,
    notes,
    exercises,
    createdAt,
    updatedAt,
  } as any;
}

export function normalizeMeal(meal: any): MealEntry {
  if (!meal) {
    meal = {};
  }
  const rawItems = Array.isArray(meal.items) ? meal.items : [];
  const normalizedItems = rawItems.map((it: any) => ({
    id: it.id || Math.random().toString(36).substring(2, 9),
    foodId: it.foodId || '',
    name: it.name || 'Yiyecek',
    amountGram: Number(it.amountGram || 100),
    calories: Number(it.calories || 0),
    protein: Number(it.protein || 0),
    carbs: Number(it.carbs || 0),
    fat: Number(it.fat || 0)
  }));

  return {
    id: meal.id || Math.random().toString(36).substring(2, 9),
    userId: meal.userId || '',
    date: meal.date || new Date().toISOString().split('T')[0],
    mealType: meal.mealType || 'Ara Öğün',
    foodName: meal.foodName || 'Öğün',
    calories: Number(meal.calories || 0),
    protein: Number(meal.protein || 0),
    carbs: Number(meal.carbs || 0),
    fat: Number(meal.fat || 0),
    notes: meal.notes || '',
    items: normalizedItems,
    createdAt: meal.createdAt || new Date().toISOString(),
    updatedAt: meal.updatedAt || new Date().toISOString()
  };
}

export function calculateWorkoutVolume(workout: any): number {
  if (!workout || !Array.isArray(workout.exercises)) return 0;
  let total = 0;
  for (const ex of workout.exercises) {
    const sets = normalizeExerciseSets(ex);
    for (const s of sets) {
      total += (s.weight || 0) * (s.reps || 0);
    }
  }
  return total;
}

export function calculateWorkoutTotalSets(workout: any): number {
  if (!workout || !Array.isArray(workout.exercises)) return 0;
  let total = 0;
  for (const ex of workout.exercises) {
    const sets = normalizeExerciseSets(ex);
    total += sets.length;
  }
  return total;
}

export function calculateWorkoutTotalReps(workout: any): number {
  if (!workout || !Array.isArray(workout.exercises)) return 0;
  let total = 0;
  for (const ex of workout.exercises) {
    const sets = normalizeExerciseSets(ex);
    for (const s of sets) {
      total += s.reps || 0;
    }
  }
  return total;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.error('Firestore Error Occurred: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const databaseService = {
  // --- USER PROFILES ---
  async saveUserProfile(userId: string, data: any): Promise<void> {
    const path = `users/${userId}`;
    const cleanUser = {
      id: userId,
      email: data.email || '',
      role: data.role || 'athlete',
      name: data.name || '',
      nickname: data.nickname || '',
      inviteCode: data.inviteCode || '',
      coachId: data.coachId || null,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'users', userId), sanitizeForFirestore(cleanUser), { merge: true });
    } catch (error) {
      console.error("User profile save error:", error, "Payload was:", JSON.stringify(cleanUser));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getUserProfile(userId: string): Promise<any | null> {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  // --- WORKOUTS ---
  async saveWorkout(workout: Workout, userId: string): Promise<void> {
    const cleanWorkout = normalizeWorkout(workout, userId);
    // Explicit notes check
    if (cleanWorkout.notes === undefined || cleanWorkout.notes === null) {
      cleanWorkout.notes = '';
    }
    // Also clean individual exercise notes
    if (Array.isArray(cleanWorkout.exercises)) {
      cleanWorkout.exercises = cleanWorkout.exercises.map(ex => {
        const cleanEx = { ...ex };
        if (cleanEx.notes === undefined || cleanEx.notes === null) {
          cleanEx.notes = '';
        }
        if (Array.isArray(cleanEx.sets)) {
          cleanEx.sets = cleanEx.sets.map(s => {
            const cleanSet = { ...s };
            if (cleanSet.notes === undefined || cleanSet.notes === null) {
              cleanSet.notes = '';
            }
            return cleanSet;
          });
        }
        return cleanEx;
      });
    }
    const path = `workouts/${cleanWorkout.id}`;
    const sanitized = sanitizeForFirestore(cleanWorkout);
    try {
      await setDoc(doc(db, 'workouts', cleanWorkout.id), sanitized, { merge: true });

      // 1. Delete previous workoutSetEntries for this workoutId
      const qSets = query(collection(db, 'workoutSetEntries'), where('workoutId', '==', cleanWorkout.id));
      const snapSets = await getDocs(qSets);
      for (const d of snapSets.docs) {
        await deleteDoc(d.ref);
      }

      // 2. Save new workoutSetEntries
      if (Array.isArray(cleanWorkout.exercises)) {
        for (const ex of cleanWorkout.exercises) {
          if (Array.isArray(ex.sets)) {
            for (let i = 0; i < ex.sets.length; i++) {
              const set = ex.sets[i];
              const setEntryId = `${cleanWorkout.id}_${ex.id}_${i}`;
              const setEntry: WorkoutSetEntry = {
                id: setEntryId,
                userId,
                workoutId: cleanWorkout.id,
                exerciseId: ex.id || 'unknown_exercise',
                exerciseName: ex.name,
                setNumber: set.setNumber || (i + 1),
                weight: Number(set.weight) || 0,
                reps: Number(set.reps) || 0,
                isCompleted: true,
                isWarmup: set.notes?.toLowerCase().includes('warmup') || set.notes?.toLowerCase().includes('ısınma') || false,
                date: cleanWorkout.date,
                createdAt: new Date().toISOString()
              };
              await setDoc(doc(db, 'workoutSetEntries', setEntryId), sanitizeForFirestore(setEntry), { merge: true });
            }
          }
        }
      }

      // 3. Recalculate personal records for the user
      await this.recalculatePersonalRecords(userId);

    } catch (error) {
      console.error("Workout save error:", error, "Firestore sanitized payload:", JSON.stringify(sanitized));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteWorkout(workoutId: string): Promise<void> {
    const path = `workouts/${workoutId}`;
    try {
      // Get userId from the workout document before deleting it so we can recalculate PRs
      const snap = await getDoc(doc(db, 'workouts', workoutId));
      const userId = snap.exists() ? snap.data().userId : null;

      await deleteDoc(doc(db, 'workouts', workoutId));

      // Delete corresponding workoutSetEntries
      const qSets = query(collection(db, 'workoutSetEntries'), where('workoutId', '==', workoutId));
      const snapSets = await getDocs(qSets);
      for (const d of snapSets.docs) {
        await deleteDoc(d.ref);
      }

      // Recalculate PRs if userId is available
      if (userId) {
        await this.recalculatePersonalRecords(userId);
      }
    } catch (error) {
      console.error("Firestore deleteWorkout fail details:", error, "Id was:", workoutId);
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenWorkouts(userId: string, callback: (workouts: Workout[]) => void, errorCallback?: (err: any) => void) {
    const q = query(collection(db, 'workouts'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: Workout[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push(normalizeWorkout({ id: d.id, ...data }, userId));
      });
      // Sort client side by date descending
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenWorkouts error", err);
      if (errorCallback) errorCallback(err);
    });
  },

  // --- WEIGHT ENTRIES ---
  async saveWeightEntry(entry: WeightEntry, userId: string): Promise<void> {
    const entryId = entry.id || Math.random().toString(36).substring(2, 9);
    const path = `weightEntries/${entryId}`;
    const cleanEntry = {
      id: entryId,
      userId,
      date: entry.date || new Date().toISOString().split('T')[0],
      weight: Number(entry.weight || 0),
      notes: entry.notes || '',
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const sanitized = sanitizeForFirestore(cleanEntry);
    try {
      await setDoc(doc(db, 'weightEntries', entryId), sanitized, { merge: true });
    } catch (error) {
      console.error("Weight save error:", error, "Firestore sanitized payload:", JSON.stringify(sanitized));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteWeightEntry(id: string): Promise<void> {
    const path = `weightEntries/${id}`;
    try {
      await deleteDoc(doc(db, 'weightEntries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenWeightEntries(userId: string, callback: (entries: WeightEntry[]) => void, errorCallback?: (err: any) => void) {
    const q = query(collection(db, 'weightEntries'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: WeightEntry[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as WeightEntry);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenWeightEntries error", err);
      if (errorCallback) {
        errorCallback(err);
      } else {
        handleFirestoreError(err, OperationType.LIST, 'weightEntries');
      }
    });
  },

  // --- BODY MEASUREMENTS ---
  async saveBodyMeasurement(measurement: BodyMeasurement, userId: string): Promise<void> {
    const measurementId = measurement.id || Math.random().toString(36).substring(2, 9);
    const path = `bodyMeasurements/${measurementId}`;
    const cleanEntry = {
      id: measurementId,
      userId,
      date: measurement.date || new Date().toISOString().split('T')[0],
      weight: measurement.weight !== undefined && measurement.weight !== null ? Number(measurement.weight) : null,
      waist: measurement.waist !== undefined && measurement.waist !== null ? Number(measurement.waist) : null,
      chest: measurement.chest !== undefined && measurement.chest !== null ? Number(measurement.chest) : null,
      arm: measurement.arm !== undefined && measurement.arm !== null ? Number(measurement.arm) : null,
      shoulder: measurement.shoulder !== undefined && measurement.shoulder !== null ? Number(measurement.shoulder) : null,
      shoulders: measurement.shoulders !== undefined && measurement.shoulders !== null ? Number(measurement.shoulders) : null,
      hip: measurement.hip !== undefined && measurement.hip !== null ? Number(measurement.hip) : null,
      leg: measurement.leg !== undefined && measurement.leg !== null ? Number(measurement.leg) : null,
      rightArm: measurement.rightArm !== undefined && measurement.rightArm !== null ? Number(measurement.rightArm) : null,
      leftArm: measurement.leftArm !== undefined && measurement.leftArm !== null ? Number(measurement.leftArm) : null,
      rightForearm: measurement.rightForearm !== undefined && measurement.rightForearm !== null ? Number(measurement.rightForearm) : null,
      leftForearm: measurement.leftForearm !== undefined && measurement.leftForearm !== null ? Number(measurement.leftForearm) : null,
      rightThigh: measurement.rightThigh !== undefined && measurement.rightThigh !== null ? Number(measurement.rightThigh) : null,
      leftThigh: measurement.leftThigh !== undefined && measurement.leftThigh !== null ? Number(measurement.leftThigh) : null,
      rightCalf: measurement.rightCalf !== undefined && measurement.rightCalf !== null ? Number(measurement.rightCalf) : null,
      leftCalf: measurement.leftCalf !== undefined && measurement.leftCalf !== null ? Number(measurement.leftCalf) : null,
      neck: measurement.neck !== undefined && measurement.neck !== null ? Number(measurement.neck) : null,
      bodyFat: measurement.bodyFat !== undefined && measurement.bodyFat !== null ? Number(measurement.bodyFat) : null,
      bodyFatPercentage: measurement.bodyFatPercentage !== undefined && measurement.bodyFatPercentage !== null ? Number(measurement.bodyFatPercentage) : null,
      muscleMass: measurement.muscleMass !== undefined && measurement.muscleMass !== null ? Number(measurement.muscleMass) : null,
      notes: measurement.notes || '',
      createdAt: measurement.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const sanitized = sanitizeForFirestore(cleanEntry);
    try {
      await setDoc(doc(db, 'bodyMeasurements', measurementId), sanitized, { merge: true });
    } catch (error) {
      console.error("Measurement save error:", error, "Firestore sanitized payload:", JSON.stringify(sanitized));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteBodyMeasurement(id: string): Promise<void> {
    const path = `bodyMeasurements/${id}`;
    try {
      await deleteDoc(doc(db, 'bodyMeasurements', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenBodyMeasurements(userId: string, callback: (measurements: BodyMeasurement[]) => void, errorCallback?: (err: any) => void) {
    const q = query(collection(db, 'bodyMeasurements'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: BodyMeasurement[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as BodyMeasurement);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenBodyMeasurements error", err);
      if (errorCallback) {
        errorCallback(err);
      } else {
        handleFirestoreError(err, OperationType.LIST, 'bodyMeasurements');
      }
    });
  },

  // --- MEAL ENTRIES ---
  async saveMealEntry(meal: MealEntry, userId: string): Promise<void> {
    const mealId = meal.id || Math.random().toString(36).substring(2, 9);
    const path = `mealEntries/${mealId}`;
    const normalized = normalizeMeal(meal);
    const cleanMeal = {
      id: mealId,
      userId,
      date: normalized.date,
      mealType: normalized.mealType,
      foodName: normalized.foodName,
      calories: normalized.calories,
      protein: normalized.protein,
      carbs: normalized.carbs,
      fat: normalized.fat,
      notes: normalized.notes,
      items: normalized.items,
      createdAt: normalized.createdAt,
      updatedAt: new Date().toISOString(),
    };
    const sanitized = sanitizeForFirestore(cleanMeal);
    try {
      await setDoc(doc(db, 'mealEntries', mealId), sanitized, { merge: true });
    } catch (error) {
      console.error("Meal save error:", error, "Firestore sanitized payload:", JSON.stringify(sanitized));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteMealEntry(id: string): Promise<void> {
    const path = `mealEntries/${id}`;
    try {
      await deleteDoc(doc(db, 'mealEntries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenMealEntries(userId: string, callback: (meals: MealEntry[]) => void, errorCallback?: (err: any) => void) {
    const q = query(collection(db, 'mealEntries'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: MealEntry[] = [];
      snap.forEach((d) => {
        list.push(normalizeMeal({ id: d.id, ...d.data() }));
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenMealEntries error", err);
      if (errorCallback) {
        errorCallback(err);
      } else {
        callback([]);
      }
    });
  },

  // --- WATER ENTRIES ---
  async saveWaterEntries(entries: WaterEntry[], userId: string): Promise<void> {
    const path = `waterEntries`;
    try {
      // Since waterEntries are stored per-date in a denormalized way, let's write them individually
      for (const entry of entries) {
        const id = `${userId}_${entry.date}`;
        const cleanEntry = {
          date: entry.date,
          amountMl: Number(entry.amountMl || 0),
          userId,
        };
        await setDoc(doc(db, 'waterEntries', id), sanitizeForFirestore(cleanEntry), { merge: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveSingleWaterEntry(date: string, amountMl: number, userId: string): Promise<void> {
    const id = `${userId}_${date}`;
    const path = `waterEntries/${id}`;
    const cleanEntry = {
      date,
      amountMl: Number(amountMl || 0),
      userId,
    };
    try {
      await setDoc(doc(db, 'waterEntries', id), sanitizeForFirestore(cleanEntry), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  listenWaterEntries(userId: string, callback: (water: WaterEntry[]) => void, errorCallback?: (err: any) => void) {
    const q = query(collection(db, 'waterEntries'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: WaterEntry[] = [];
      snap.forEach((d) => {
        list.push({ date: d.data().date, amountMl: d.data().amountMl } as WaterEntry);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenWaterEntries error", err);
      if (errorCallback) {
        errorCallback(err);
      } else {
        handleFirestoreError(err, OperationType.LIST, 'waterEntries');
      }
    });
  },

  // --- COACH SPECIFIC METHODS ---
  async findCoachByInviteCode(code: string): Promise<any | null> {
    const path = `users (query inviteCode)`;
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'coach'), where('inviteCode', '==', code.toUpperCase()));
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0];
      return { id: d.id, ...d.data() };
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async connectToCoach(athleteId: string, coachId: string): Promise<void> {
    const athletePath = `users/${athleteId}`;
    const relationPath = `coachAthleteRelations/${coachId}_${athleteId}`;
    try {
      // 1. Update athlete profile
      await updateDoc(doc(db, 'users', athleteId), { coachId });
      // 2. Create Relation doc
      await setDoc(doc(db, 'coachAthleteRelations', `${coachId}_${athleteId}`), {
        id: `${coachId}_${athleteId}`,
        coachId,
        athleteId,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, relationPath);
    }
  },

  async disconnectFromCoach(athleteId: string, coachId: string): Promise<void> {
    const athletePath = `users/${athleteId}`;
    const relationPath = `coachAthleteRelations/${coachId}_${athleteId}`;
    try {
      await updateDoc(doc(db, 'users', athleteId), { coachId: null });
      await deleteDoc(doc(db, 'coachAthleteRelations', `${coachId}_${athleteId}`));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, relationPath);
    }
  },

  listenConnectedAthletes(coachId: string, callback: (athletes: any[]) => void, errorCallback?: (err: any) => void) {
    let relations: any[] = [];
    let standardAthletes: any[] = [];
    let relationAthletesMap: { [id: string]: any } = {};
    let unsubUsers: (() => void) | null = null;
    let isUnsubscribed = false;

    // Helper to merge, deduplicate and invoke callback
    const emitMergedList = () => {
      if (isUnsubscribed) return;
      const combinedMap = new Map<string, any>();
      
      // 1. Add standard athletes (from users where coachId == coachId)
      standardAthletes.forEach(a => {
        combinedMap.set(a.id, { ...a });
      });

      // 2. Add relation-based athletes (where relationship exists)
      relations.forEach(r => {
        const athleteId = r.athleteId;
        if (athleteId) {
          if (combinedMap.has(athleteId)) {
            // Already there
          } else if (relationAthletesMap[athleteId]) {
            combinedMap.set(athleteId, { ...relationAthletesMap[athleteId] });
          } else {
            // Document loading fallback placeholder until fetched
            combinedMap.set(athleteId, { 
              id: athleteId, 
              name: 'Yükleniyor...', 
              email: '...' 
            });
          }
        }
      });

      const finalList = Array.from(combinedMap.values());
      callback(finalList);
    };

    // Sub 1: Listen to standard coach relations on users
    const qUsers = query(collection(db, 'users'), where('coachId', '==', coachId));
    unsubUsers = onSnapshot(qUsers, (snap) => {
      standardAthletes = [];
      snap.forEach((d) => {
        standardAthletes.push({ id: d.id, ...d.data() });
      });
      emitMergedList();
    }, (err) => {
      console.warn("listenConnectedAthletes - users query error", err);
      if (errorCallback) errorCallback(err);
    });

    // Sub 2: Listen to coachAthleteRelations
    const qRelations = query(collection(db, 'coachAthleteRelations'), where('coachId', '==', coachId));
    const unsubRelations = onSnapshot(qRelations, async (snap) => {
      relations = [];
      const newAthleteIdsToFetch: string[] = [];
      
      snap.forEach((d) => {
        const data = d.data();
        relations.push({ id: d.id, ...data });
        const athleteId = data.athleteId;
        if (athleteId && !relationAthletesMap[athleteId] && !standardAthletes.some(sa => sa.id === athleteId)) {
          newAthleteIdsToFetch.push(athleteId);
        }
      });

      // Fetch newly found athlete details asynchronously
      if (newAthleteIdsToFetch.length > 0) {
        try {
          await Promise.all(newAthleteIdsToFetch.map(async (aid) => {
            const docSnap = await getDoc(doc(db, 'users', aid));
            if (docSnap.exists()) {
              relationAthletesMap[aid] = { id: docSnap.id, ...docSnap.data() };
            }
          }));
          emitMergedList();
        } catch (fetchErr) {
          console.warn("Error fetching relation athlete profiles:", fetchErr);
        }
      } else {
        emitMergedList();
      }
    }, (err) => {
      console.warn("listenConnectedAthletes - relations query error", err);
    });

    return () => {
      isUnsubscribed = true;
      if (unsubUsers) unsubUsers();
      if (unsubRelations) unsubRelations();
    };
  },

  // --- COACH NOTES ---
  async saveCoachNote(note: { id: string; coachId: string; athleteId: string; title: string; note: string; createdAt: string }): Promise<void> {
    const path = `coachNotes/${note.id}`;
    const cleanNote = {
      id: note.id,
      coachId: note.coachId || '',
      athleteId: note.athleteId || '',
      title: note.title || '',
      note: note.note || '',
      createdAt: note.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'coachNotes', note.id), sanitizeForFirestore(cleanNote), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteCoachNote(id: string): Promise<void> {
    const path = `coachNotes/${id}`;
    try {
      await deleteDoc(doc(db, 'coachNotes', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenCoachNotes(athleteId: string, callback: (notes: any[]) => void, errorCallback?: (err: any) => void) {
    const q = query(collection(db, 'coachNotes'), where('athleteId', '==', athleteId));
    return onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    }, (err) => {
      console.error("listenCoachNotes error", err);
      if (errorCallback) {
        errorCallback(err);
      } else {
        handleFirestoreError(err, OperationType.LIST, 'coachNotes');
      }
    });
  },

  // --- COACH GOALS ---
  async saveCoachGoal(goal: { id: string; coachId: string; athleteId: string; goalType: string; title: string; description?: string; targetValue?: string; deadline?: string; status: 'pending' | 'completed' | 'cancelled'; createdAt: string }): Promise<void> {
    const path = `coachGoals/${goal.id}`;
    const cleanGoal = {
      id: goal.id,
      coachId: goal.coachId || '',
      athleteId: goal.athleteId || '',
      goalType: goal.goalType || '',
      title: goal.title || '',
      description: goal.description || '',
      targetValue: goal.targetValue || '',
      deadline: goal.deadline || '',
      status: goal.status || 'pending',
      createdAt: goal.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'coachGoals', goal.id), sanitizeForFirestore(cleanGoal), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteCoachGoal(id: string): Promise<void> {
    const path = `coachGoals/${id}`;
    try {
      await deleteDoc(doc(db, 'coachGoals', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async updateCoachGoalStatus(id: string, status: 'pending' | 'completed' | 'cancelled'): Promise<void> {
    const path = `coachGoals/${id}`;
    try {
      await updateDoc(doc(db, 'coachGoals', id), sanitizeForFirestore({ status, updatedAt: new Date().toISOString() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  listenCoachGoals(athleteId: string, callback: (goals: any[]) => void, errorCallback?: (err: any) => void) {
    const q = query(collection(db, 'coachGoals'), where('athleteId', '==', athleteId));
    return onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    }, (err) => {
      console.error("listenCoachGoals error", err);
      if (errorCallback) {
        errorCallback(err);
      } else {
        handleFirestoreError(err, OperationType.LIST, 'coachGoals');
      }
    });
  },

  // --- NUTRITION GOALS ---
  async updateNutritionGoals(userId: string, goals: NutritionGoals): Promise<void> {
    const path = `users/${userId}`;
    try {
      await updateDoc(doc(db, 'users', userId), {
        nutritionGoals: sanitizeForFirestore(goals)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveCoachAthleteGoals(athleteId: string, coachId: string, goals: NutritionGoals): Promise<void> {
    const path = `users/${athleteId}`;
    try {
      await updateDoc(doc(db, 'users', athleteId), {
        nutritionGoals: sanitizeForFirestore({
          ...goals,
          setByCoachId: coachId,
          updatedAt: new Date().toISOString()
        })
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async removeCoachAthleteGoals(athleteId: string, coachId?: string): Promise<void> {
    const path = `users/${athleteId}`;
    try {
      if (coachId) {
        const snap = await getDoc(doc(db, 'users', athleteId));
        if (snap.exists()) {
          const data = snap.data();
          if (data.nutritionGoals?.setByCoachId && data.nutritionGoals.setByCoachId !== coachId) {
            // Yalnızca setByCoachId mevcut koça aitse koç kilidini kaldır.
            return;
          }
        }
      }
      await updateDoc(doc(db, 'users', athleteId), {
        'nutritionGoals.setByCoachId': deleteField(),
        'nutritionGoals.updatedAt': new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // --- FAVORITE MEALS ---
  async saveFavoriteMeal(meal: FavoriteMeal): Promise<void> {
    const id = meal.id || Math.random().toString(36).substring(2, 9);
    const path = `favoriteMeals/${id}`;
    const clean = {
      ...meal,
      id,
      createdAt: meal.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'favoriteMeals', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteFavoriteMeal(id: string): Promise<void> {
    const path = `favoriteMeals/${id}`;
    try {
      await deleteDoc(doc(db, 'favoriteMeals', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenFavoriteMeals(userId: string, callback: (meals: FavoriteMeal[]) => void) {
    const q = query(collection(db, 'favoriteMeals'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: FavoriteMeal[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as FavoriteMeal);
      });
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      callback(list);
    }, (err) => {
      console.error("listenFavoriteMeals error", err);
      callback([]);
    });
  },

  // --- WATER ENTRIES REDESIGNED ---
  async saveWaterEntry(entry: WaterEntry): Promise<void> {
    const id = entry.id || Math.random().toString(36).substring(2, 9);
    const path = `waterEntries/${id}`;
    const clean = {
      ...entry,
      id,
      createdAt: entry.createdAt || new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'waterEntries', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteWaterEntry(id: string): Promise<void> {
    const path = `waterEntries/${id}`;
    try {
      await deleteDoc(doc(db, 'waterEntries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- NUTRITION COACH NOTES ---
  async saveNutritionCoachNote(note: NutritionCoachNote): Promise<void> {
    const id = note.id || Math.random().toString(36).substring(2, 9);
    const path = `nutritionCoachNotes/${id}`;
    const clean = {
      ...note,
      id,
      createdAt: note.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'nutritionCoachNotes', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteNutritionCoachNote(id: string): Promise<void> {
    const path = `nutritionCoachNotes/${id}`;
    try {
      await deleteDoc(doc(db, 'nutritionCoachNotes', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenNutritionCoachNotes(athleteId: string, callback: (notes: NutritionCoachNote[]) => void) {
    const q = query(collection(db, 'nutritionCoachNotes'), where('athleteId', '==', athleteId));
    return onSnapshot(q, (snap) => {
      const list: NutritionCoachNote[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as NutritionCoachNote);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    }, (err) => {
      console.error("listenNutritionCoachNotes error", err);
      callback([]);
    });
  },

  // --- NUTRITION DAY STATUS ---
  async saveNutritionDayStatus(status: NutritionDayStatus): Promise<void> {
    const id = `${status.userId}_${status.date}`;
    const path = `nutritionDayStatuses/${id}`;
    const clean = {
      ...status,
      id,
      completedAt: status.completedAt || new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'nutritionDayStatuses', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  listenNutritionDayStatuses(userId: string, callback: (statuses: NutritionDayStatus[]) => void) {
    const q = query(collection(db, 'nutritionDayStatuses'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: NutritionDayStatus[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as NutritionDayStatus);
      });
      callback(list);
    }, (err) => {
      console.error("listenNutritionDayStatuses error", err);
      callback([]);
    });
  },

  // --- GENERATED TRAINING PROGRAMS ---
  async saveGeneratedTrainingProgram(program: GeneratedTrainingProgram): Promise<void> {
    const id = program.id || Math.random().toString(36).substring(2, 9);
    const path = `generatedTrainingPrograms/${id}`;
    const clean = {
      ...program,
      id,
      createdAt: program.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'generatedTrainingPrograms', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteGeneratedTrainingProgram(id: string): Promise<void> {
    const path = `generatedTrainingPrograms/${id}`;
    try {
      await deleteDoc(doc(db, 'generatedTrainingPrograms', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenGeneratedTrainingPrograms(userId: string, callback: (programs: GeneratedTrainingProgram[]) => void) {
    const q = query(collection(db, 'generatedTrainingPrograms'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: GeneratedTrainingProgram[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as GeneratedTrainingProgram);
      });
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      callback(list);
    }, (err) => {
      console.error("listenGeneratedTrainingPrograms error", err);
      callback([]);
    });
  },

  async setActiveTrainingProgram(userId: string, programId: string): Promise<void> {
    const path = `generatedTrainingPrograms`;
    try {
      const q = query(collection(db, 'generatedTrainingPrograms'), where('userId', '==', userId));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        const data = d.data();
        const docRef = doc(db, 'generatedTrainingPrograms', d.id);
        if (d.id === programId) {
          await updateDoc(docRef, { isActive: true, updatedAt: new Date().toISOString() });
        } else if (data.isActive) {
          await updateDoc(docRef, { isActive: false, updatedAt: new Date().toISOString() });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // --- TRAINING CALENDAR ENTRIES ---
  async saveTrainingCalendarEntry(entry: TrainingCalendarEntry): Promise<void> {
    const id = entry.id || Math.random().toString(36).substring(2, 9);
    const path = `trainingCalendarEntries/${id}`;
    const clean = {
      ...entry,
      id,
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'trainingCalendarEntries', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteTrainingCalendarEntry(id: string): Promise<void> {
    const path = `trainingCalendarEntries/${id}`;
    try {
      await deleteDoc(doc(db, 'trainingCalendarEntries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenTrainingCalendarEntries(userId: string, callback: (entries: TrainingCalendarEntry[]) => void) {
    const q = query(collection(db, 'trainingCalendarEntries'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: TrainingCalendarEntry[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as TrainingCalendarEntry);
      });
      list.sort((a, b) => a.date.localeCompare(b.date));
      callback(list);
    }, (err) => {
      console.error("listenTrainingCalendarEntries error", err);
      callback([]);
    });
  },

  // --- WORKOUT SET ENTRIES ---
  async saveWorkoutSetEntry(entry: WorkoutSetEntry): Promise<void> {
    const id = entry.id || Math.random().toString(36).substring(2, 9);
    const path = `workoutSetEntries/${id}`;
    const clean = {
      ...entry,
      id,
      createdAt: entry.createdAt || new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'workoutSetEntries', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteWorkoutSetEntry(id: string): Promise<void> {
    const path = `workoutSetEntries/${id}`;
    try {
      await deleteDoc(doc(db, 'workoutSetEntries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenWorkoutSetEntries(userId: string, callback: (entries: WorkoutSetEntry[]) => void) {
    const q = query(collection(db, 'workoutSetEntries'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: WorkoutSetEntry[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as WorkoutSetEntry);
      });
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenWorkoutSetEntries error", err);
      callback([]);
    });
  },

  // --- PERSONAL RECORDS ---
  async savePersonalRecord(record: PersonalRecord): Promise<void> {
    const id = record.id || Math.random().toString(36).substring(2, 9);
    const path = `personalRecords/${id}`;
    const clean = {
      ...record,
      id,
      createdAt: record.createdAt || new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'personalRecords', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  listenPersonalRecords(userId: string, callback: (records: PersonalRecord[]) => void) {
    const q = query(collection(db, 'personalRecords'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: PersonalRecord[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as PersonalRecord);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenPersonalRecords error", err);
      callback([]);
    });
  },

  // --- PROGRESS PHOTOS ---
  async saveProgressPhoto(photo: ProgressPhoto): Promise<void> {
    const id = photo.id || Math.random().toString(36).substring(2, 9);
    const path = `progressPhotos/${id}`;
    const clean = {
      ...photo,
      id,
      createdAt: photo.createdAt || new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'progressPhotos', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteProgressPhoto(id: string): Promise<void> {
    const path = `progressPhotos/${id}`;
    try {
      await deleteDoc(doc(db, 'progressPhotos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenProgressPhotos(userId: string, callback: (photos: ProgressPhoto[]) => void) {
    const q = query(collection(db, 'progressPhotos'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: ProgressPhoto[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as ProgressPhoto);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenProgressPhotos error", err);
      callback([]);
    });
  },

  // --- RECOVERY ENTRIES ---
  async saveRecoveryEntry(entry: RecoveryEntry): Promise<void> {
    const id = `${entry.userId}_${entry.date}`;
    const path = `recoveryEntries/${id}`;
    const clean = {
      ...entry,
      id,
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'recoveryEntries', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  listenRecoveryEntries(userId: string, callback: (entries: RecoveryEntry[]) => void) {
    const q = query(collection(db, 'recoveryEntries'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: RecoveryEntry[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as RecoveryEntry);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenRecoveryEntries error", err);
      callback([]);
    });
  },

  // --- DELOAD SUGGESTIONS ---
  async saveDeloadSuggestion(suggestion: DeloadSuggestion): Promise<void> {
    const id = suggestion.id || Math.random().toString(36).substring(2, 9);
    const path = `deloadSuggestions/${id}`;
    const clean = {
      ...suggestion,
      id,
      createdAt: suggestion.createdAt || new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'deloadSuggestions', id), sanitizeForFirestore(clean), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  listenDeloadSuggestions(userId: string, callback: (suggestions: DeloadSuggestion[]) => void) {
    const q = query(collection(db, 'deloadSuggestions'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: DeloadSuggestion[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as DeloadSuggestion);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    }, (err) => {
      console.error("listenDeloadSuggestions error", err);
      callback([]);
    });
  },

  // --- FAVORITE EXERCISES ---
  async saveFavoriteExercise(userId: string, exerciseId: string): Promise<void> {
    const id = `${userId}_${exerciseId}`;
    const path = `favoriteExercises/${id}`;
    try {
      await setDoc(doc(db, 'favoriteExercises', id), sanitizeForFirestore({ id, userId, exerciseId, createdAt: new Date().toISOString() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async removeFavoriteExercise(userId: string, exerciseId: string): Promise<void> {
    const id = `${userId}_${exerciseId}`;
    const path = `favoriteExercises/${id}`;
    try {
      await deleteDoc(doc(db, 'favoriteExercises', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenFavoriteExercises(userId: string, callback: (ids: string[]) => void) {
    const q = query(collection(db, 'favoriteExercises'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: string[] = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data.exerciseId) list.push(data.exerciseId);
      });
      callback(list);
    }, (err) => {
      console.error("listenFavoriteExercises error", err);
      callback([]);
    });
  },

  // --- COACH ATHLETE NOTES ---
  async saveCoachAthleteNote(note: { id: string, coachId: string, athleteId: string, note: string, createdAt: string, updatedAt: string }): Promise<void> {
    const id = note.id || Math.random().toString(36).substring(2, 9);
    const path = `coachAthleteNotes/${id}`;
    try {
      await setDoc(doc(db, 'coachAthleteNotes', id), sanitizeForFirestore({ ...note, id }), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  listenCoachAthleteNotes(athleteId: string, callback: (notes: any[]) => void) {
    const q = query(collection(db, 'coachAthleteNotes'), where('athleteId', '==', athleteId));
    return onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      callback(list);
    }, (err) => {
      console.error("listenCoachAthleteNotes error", err);
      callback([]);
    });
  },

  // --- COMPREHENSIVE TRAINING SERVICE ADAPTERS & ALIASES ---
  createTrainingProgram: async function(program: GeneratedTrainingProgram): Promise<void> {
    return this.saveGeneratedTrainingProgram(program);
  },

  updateTrainingProgram: async function(programId: string, updates: Partial<GeneratedTrainingProgram>): Promise<void> {
    try {
      await updateDoc(doc(db, 'generatedTrainingPrograms', programId), sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `generatedTrainingPrograms/${programId}`);
    }
  },

  deleteTrainingProgram: async function(id: string): Promise<void> {
    return this.deleteGeneratedTrainingProgram(id);
  },

  listenTrainingPrograms: function(userId: string, callback: (programs: GeneratedTrainingProgram[]) => void) {
    return this.listenGeneratedTrainingPrograms(userId, callback);
  },

  async getTrainingProgram(programId: string): Promise<GeneratedTrainingProgram | null> {
    try {
      const snap = await getDoc(doc(db, 'generatedTrainingPrograms', programId));
      return snap.exists() ? { id: snap.id, ...snap.data() } as GeneratedTrainingProgram : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `generatedTrainingPrograms/${programId}`);
      return null;
    }
  },

  async archiveTrainingProgram(programId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'generatedTrainingPrograms', programId), { isActive: false, updatedAt: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `generatedTrainingPrograms/${programId}`);
    }
  },

  createTrainingCalendarEntry: async function(entry: TrainingCalendarEntry): Promise<void> {
    return this.saveTrainingCalendarEntry(entry);
  },

  async updateTrainingCalendarEntry(id: string, updates: Partial<TrainingCalendarEntry>): Promise<void> {
    try {
      await updateDoc(doc(db, 'trainingCalendarEntries', id), sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `trainingCalendarEntries/${id}`);
    }
  },

  async updateWorkoutSetEntry(id: string, updates: Partial<WorkoutSetEntry>): Promise<void> {
    try {
      await updateDoc(doc(db, 'workoutSetEntries', id), sanitizeForFirestore(updates));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `workoutSetEntries/${id}`);
    }
  },

  async getExerciseHistory(userId: string, exerciseId: string): Promise<WorkoutSetEntry[]> {
    try {
      const q = query(
        collection(db, 'workoutSetEntries'),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId)
      );
      const snap = await getDocs(q);
      const list: WorkoutSetEntry[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as WorkoutSetEntry);
      });
      return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `workoutSetEntries`);
      return [];
    }
  },

  async getLastExercisePerformance(userId: string, exerciseId: string): Promise<WorkoutSetEntry[]> {
    const history = await this.getExerciseHistory(userId, exerciseId);
    if (history.length === 0) return [];
    const latestDate = history[0].date;
    return history.filter(h => h.date === latestDate);
  },

  async getExercisePersonalRecords(userId: string, exerciseId: string): Promise<PersonalRecord[]> {
    try {
      const q = query(
        collection(db, 'personalRecords'),
        where('userId', '==', userId),
        where('exerciseId', '==', exerciseId)
      );
      const snap = await getDocs(q);
      const list: PersonalRecord[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as PersonalRecord);
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `personalRecords`);
      return [];
    }
  },

  async recalculatePersonalRecords(userId: string): Promise<void> {
    try {
      // 1. Fetch and delete existing personal records of the user
      const prColl = collection(db, 'personalRecords');
      const qPr = query(prColl, where('userId', '==', userId));
      const prSnap = await getDocs(qPr);
      for (const docSnap of prSnap.docs) {
        await deleteDoc(docSnap.ref);
      }

      // 2. Fetch all completed non-warmup sets of the user
      const setColl = collection(db, 'workoutSetEntries');
      const qSets = query(setColl, where('userId', '==', userId));
      const setSnap = await getDocs(qSets);
      
      const setsList: WorkoutSetEntry[] = [];
      setSnap.forEach(d => {
        const data = d.data() as any;
        if (data.isCompleted && !data.isWarmup) {
          setsList.push(data);
        }
      });

      if (setsList.length === 0) return;

      // 3. Find the maximum values for each exercise and recordType
      const maxes: Record<string, {
        max_weight?: { val: number; set: WorkoutSetEntry };
        max_reps?: { val: number; set: WorkoutSetEntry };
        max_volume?: { val: number; set: WorkoutSetEntry };
        estimated_1rm?: { val: number; set: WorkoutSetEntry };
      }> = {};

      for (const s of setsList) {
        const exId = s.exerciseId;
        if (!maxes[exId]) {
          maxes[exId] = {};
        }
        const current = maxes[exId];

        // max_weight
        if (!current.max_weight || s.weight > current.max_weight.val) {
          current.max_weight = { val: s.weight, set: s };
        }
        // max_reps
        if (!current.max_reps || s.reps > current.max_reps.val) {
          current.max_reps = { val: s.reps, set: s };
        }
        // max_volume
        const vol = s.weight * s.reps;
        if (!current.max_volume || vol > current.max_volume.val) {
          current.max_volume = { val: vol, set: s };
        }
        // estimated_1rm
        const oneRepMax = calculateEstimatedOneRepMax(s.weight, s.reps);
        if (!current.estimated_1rm || oneRepMax > current.estimated_1rm.val) {
          current.estimated_1rm = { val: oneRepMax, set: s };
        }
      }

      // 4. Save new personal records
      for (const [exId, m] of Object.entries(maxes)) {
        const sFirst = m.max_weight?.set || m.max_reps?.set || m.max_volume?.set || m.estimated_1rm?.set;
        if (!sFirst) continue;
        const exName = sFirst.exerciseName;

        const createRecord = async (type: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm', val: number, refSet: WorkoutSetEntry) => {
          const pr: PersonalRecord = {
            id: Math.random().toString(36).substring(2, 9),
            userId,
            exerciseId: exId,
            exerciseName: exName,
            recordType: type,
            value: Math.round(val * 100) / 100,
            date: refSet.date,
            workoutId: refSet.workoutId,
            notes: '',
            createdAt: new Date().toISOString()
          };
          if (type === 'max_weight') pr.weight = val;
          if (type === 'max_reps') pr.reps = val;
          if (type === 'max_volume') pr.volume = val;
          if (type === 'estimated_1rm') pr.estimatedOneRepMax = val;

          await setDoc(doc(db, 'personalRecords', pr.id), sanitizeForFirestore(pr));
        };

        if (m.max_weight && m.max_weight.val > 0) {
          await createRecord('max_weight', m.max_weight.val, m.max_weight.set);
        }
        if (m.max_reps && m.max_reps.val > 0) {
          await createRecord('max_reps', m.max_reps.val, m.max_reps.set);
        }
        if (m.max_volume && m.max_volume.val > 0) {
          await createRecord('max_volume', m.max_volume.val, m.max_volume.set);
        }
        if (m.estimated_1rm && m.estimated_1rm.val > 0) {
          await createRecord('estimated_1rm', m.estimated_1rm.val, m.estimated_1rm.set);
        }
      }
    } catch (error) {
      console.error("recalculatePersonalRecords failed:", error);
    }
  },

  async updateBodyMeasurement(id: string, updates: Partial<BodyMeasurement>): Promise<void> {
    try {
      await updateDoc(doc(db, 'bodyMeasurements', id), sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `bodyMeasurements/${id}`);
    }
  },

  async getLatestBodyMeasurement(userId: string): Promise<BodyMeasurement | null> {
    try {
      const q = query(collection(db, 'bodyMeasurements'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const list: BodyMeasurement[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as BodyMeasurement);
      });
      if (list.length === 0) return null;
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return list[0];
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `bodyMeasurements`);
      return null;
    }
  },

  async updateRecoveryEntry(id: string, updates: Partial<RecoveryEntry>): Promise<void> {
    try {
      await updateDoc(doc(db, 'recoveryEntries', id), sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `recoveryEntries/${id}`);
    }
  },

  async deleteRecoveryEntry(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'recoveryEntries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `recoveryEntries/${id}`);
    }
  },

  async getRecoveryEntryByDate(userId: string, date: string): Promise<RecoveryEntry | null> {
    try {
      const id = `${userId}_${date}`;
      const snap = await getDoc(doc(db, 'recoveryEntries', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } as RecoveryEntry : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `recoveryEntries/${userId}_${date}`);
      return null;
    }
  },

  async updateDeloadSuggestionStatus(id: string, status: 'pending' | 'accepted' | 'rejected'): Promise<void> {
    try {
      await updateDoc(doc(db, 'deloadSuggestions', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `deloadSuggestions/${id}`);
    }
  },
};
