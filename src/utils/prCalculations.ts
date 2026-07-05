import { PersonalRecord, WorkoutSetEntry } from '../types';

export const calculateEstimatedOneRepMax = (
  weight: number,
  reps: number
): number => {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

export const calculateEstimated1RM = calculateEstimatedOneRepMax;

export const checkForNewPRs = (
  userId: string,
  existingPRs: PersonalRecord[],
  setEntries: WorkoutSetEntry[],
  workoutId?: string
): PersonalRecord[] => {
  const newPRs: PersonalRecord[] = [];
  const exerciseGroups: Record<string, WorkoutSetEntry[]> = {};

  for (const entry of setEntries) {
    if (!entry.isCompleted || entry.isWarmup) continue;
    if (!exerciseGroups[entry.exerciseId]) {
      exerciseGroups[entry.exerciseId] = [];
    }
    exerciseGroups[entry.exerciseId].push(entry);
  }

  for (const [exerciseId, entries] of Object.entries(exerciseGroups)) {
    const exerciseName = entries[0].exerciseName;
    const date = entries[0].date;

    const currentMaxWeight = entries.reduce((max, e) => Math.max(max, e.weight), 0);
    const currentMaxReps = entries.reduce((max, e) => Math.max(max, e.reps), 0);
    const currentMaxVolume = entries.reduce((max, e) => Math.max(max, e.weight * e.reps), 0);
    const currentMax1RM = entries.reduce((max, e) => Math.max(max, calculateEstimatedOneRepMax(e.weight, e.reps)), 0);

    const prevPRs = existingPRs.filter(p => p.exerciseId === exerciseId);

    const prevMaxWeight = prevPRs.filter(p => p.recordType === 'max_weight')[0]?.value || 0;
    const prevMaxReps = prevPRs.filter(p => p.recordType === 'max_reps')[0]?.value || 0;
    const prevMaxVolume = prevPRs.filter(p => p.recordType === 'max_volume')[0]?.value || 0;
    const prevMax1RM = prevPRs.filter(p => p.recordType === 'estimated_1rm')[0]?.value || 0;

    const nowStr = new Date().toISOString();

    if (currentMaxWeight > prevMaxWeight && currentMaxWeight > 0) {
      newPRs.push({
        id: Math.random().toString(36).substring(2, 9),
        userId,
        exerciseId,
        exerciseName,
        recordType: 'max_weight',
        value: currentMaxWeight,
        weight: currentMaxWeight,
        date,
        workoutId,
        createdAt: nowStr
      });
    }

    if (currentMaxReps > prevMaxReps && currentMaxReps > 0) {
      newPRs.push({
        id: Math.random().toString(36).substring(2, 9),
        userId,
        exerciseId,
        exerciseName,
        recordType: 'max_reps',
        value: currentMaxReps,
        reps: currentMaxReps,
        date,
        workoutId,
        createdAt: nowStr
      });
    }

    if (currentMaxVolume > prevMaxVolume && currentMaxVolume > 0) {
      newPRs.push({
        id: Math.random().toString(36).substring(2, 9),
        userId,
        exerciseId,
        exerciseName,
        recordType: 'max_volume',
        value: currentMaxVolume,
        volume: currentMaxVolume,
        date,
        workoutId,
        createdAt: nowStr
      });
    }

    if (currentMax1RM > prevMax1RM && currentMax1RM > 0) {
      newPRs.push({
        id: Math.random().toString(36).substring(2, 9),
        userId,
        exerciseId,
        exerciseName,
        recordType: 'estimated_1rm',
        value: currentMax1RM,
        estimatedOneRepMax: currentMax1RM,
        date,
        workoutId,
        createdAt: nowStr
      });
    }
  }

  return newPRs;
};
