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
} from '../types';

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
    try {
      await setDoc(doc(db, 'users', userId), data, { merge: true });
    } catch (error) {
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
    const path = `workouts/${workout.id}`;
    try {
      await setDoc(doc(db, 'workouts', workout.id), {
        ...workout,
        userId,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteWorkout(workoutId: string): Promise<void> {
    const path = `workouts/${workoutId}`;
    try {
      await deleteDoc(doc(db, 'workouts', workoutId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenWorkouts(userId: string, callback: (workouts: Workout[]) => void, errorCallback?: (err: any) => void) {
    const q = query(collection(db, 'workouts'), where('userId', '==', userId));
    return onSnapshot(q, (snap) => {
      const list: Workout[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Workout);
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
    const path = `weightEntries/${entry.id}`;
    try {
      await setDoc(doc(db, 'weightEntries', entry.id), {
        ...entry,
        userId,
      });
    } catch (error) {
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
    const path = `bodyMeasurements/${measurement.id}`;
    try {
      await setDoc(doc(db, 'bodyMeasurements', measurement.id), {
        ...measurement,
        userId,
      });
    } catch (error) {
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
    const path = `mealEntries/${meal.id}`;
    try {
      await setDoc(doc(db, 'mealEntries', meal.id), {
        ...meal,
        userId,
      });
    } catch (error) {
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
        await setDoc(doc(db, 'waterEntries', id), {
          ...entry,
          userId,
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveSingleWaterEntry(date: string, amountMl: number, userId: string): Promise<void> {
    const id = `${userId}_${date}`;
    const path = `waterEntries/${id}`;
    try {
      await setDoc(doc(db, 'waterEntries', id), {
        date,
        amountMl,
        userId,
      });
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
    const q = query(collection(db, 'users'), where('coachId', '==', coachId));
    return onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      callback(list);
    }, (err) => {
      console.error("listenConnectedAthletes error", err);
      if (errorCallback) {
        errorCallback(err);
      } else {
        handleFirestoreError(err, OperationType.LIST, 'users');
      }
    });
  },

  // --- COACH NOTES ---
  async saveCoachNote(note: { id: string; coachId: string; athleteId: string; title: string; note: string; createdAt: string }): Promise<void> {
    const path = `coachNotes/${note.id}`;
    try {
      await setDoc(doc(db, 'coachNotes', note.id), note);
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
    try {
      await setDoc(doc(db, 'coachGoals', goal.id), goal);
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
      await updateDoc(doc(db, 'coachGoals', id), { status });
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
