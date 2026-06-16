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
} from '../types';

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
    } catch (error) {
      console.error("Workout save error:", error, "Firestore sanitized payload:", JSON.stringify(sanitized));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteWorkout(workoutId: string): Promise<void> {
    const path = `workouts/${workoutId}`;
    try {
      await deleteDoc(doc(db, 'workouts', workoutId));
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
      waist: measurement.waist !== undefined && measurement.waist !== null ? Number(measurement.waist) : null,
      chest: measurement.chest !== undefined && measurement.chest !== null ? Number(measurement.chest) : null,
      arm: measurement.arm !== undefined && measurement.arm !== null ? Number(measurement.arm) : null,
      shoulder: measurement.shoulder !== undefined && measurement.shoulder !== null ? Number(measurement.shoulder) : null,
      hip: measurement.hip !== undefined && measurement.hip !== null ? Number(measurement.hip) : null,
      leg: measurement.leg !== undefined && measurement.leg !== null ? Number(measurement.leg) : null,
      neck: measurement.neck !== undefined && measurement.neck !== null ? Number(measurement.neck) : null,
      bodyFat: measurement.bodyFat !== undefined && measurement.bodyFat !== null ? Number(measurement.bodyFat) : null,
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
    const cleanMeal = {
      id: mealId,
      userId,
      date: meal.date || new Date().toISOString().split('T')[0],
      mealType: meal.mealType || 'Ara Öğün',
      foodName: meal.foodName || 'Öğün',
      calories: Number(meal.calories || 0),
      protein: Number(meal.protein || 0),
      carbs: Number(meal.carbs || 0),
      fat: Number(meal.fat || 0),
      notes: meal.notes || '',
      createdAt: meal.createdAt || new Date().toISOString(),
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
        list.push({ id: d.id, ...d.data() } as MealEntry);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    }, (err) => {
      console.error("listenMealEntries error", err);
      if (errorCallback) {
        errorCallback(err);
      } else {
        handleFirestoreError(err, OperationType.LIST, 'mealEntries');
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
};
