import { Workout, MuscleVolumeSummary } from '../types';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

export const calculateMuscleVolume = (
  workouts: Workout[],
  daysLimit = 7
): Record<string, MuscleVolumeSummary> => {
  const result: Record<string, MuscleVolumeSummary> = {};
  
  // Initialize standard muscle groups
  const muscleGroups = [
    'Göğüs', 'Sırt', 'Omuz', 'Biceps', 'Triceps', 
    'Ön kol', 'Quadriceps', 'Hamstring', 'Kalça', 'Baldır', 'Karın', 'Bel'
  ];

  for (const mg of muscleGroups) {
    result[mg] = {
      muscleGroup: mg,
      totalSets: 0,
      effectiveSets: 0,
      totalReps: 0,
      totalVolume: 0,
      workoutCount: 0
    };
  }

  // Filter workouts by date limit
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - daysLimit);
  const relevantWorkouts = workouts.filter(w => new Date(w.date) >= limitDate);

  // Track which workouts touch which muscle groups
  const mgWorkouts: Record<string, Set<string>> = {};
  for (const mg of muscleGroups) {
    mgWorkouts[mg] = new Set<string>();
  }

  for (const w of relevantWorkouts) {
    for (const ex of w.exercises) {
      // Find matching library item
      const libItem = EXERCISE_LIBRARY.find(
        li => li.id === ex.id || li.name.toLowerCase() === ex.name.toLowerCase()
      );

      const primaries = libItem?.primaryMuscles || [];
      const secondaries = libItem?.secondaryMuscles || [];

      // Get sets
      const setsList = Array.isArray(ex.sets) ? ex.sets : [];
      if (setsList.length === 0) continue;

      for (const set of setsList) {
        // Skip warmups or incomplete if recorded
        const isWarmup = (set as any).isWarmup === true || (set as any).notes?.toLowerCase().includes('warmup') || (set as any).notes?.toLowerCase().includes('ısınma');
        const isCompleted = (set as any).isCompleted !== false;

        if (!isCompleted) continue;

        const reps = Number(set.reps) || 0;
        const weight = Number(set.weight) || 0;
        const volume = weight * reps;

        // Primary Muscle Groups
        for (const pm of primaries) {
          if (result[pm]) {
            result[pm].totalSets += 1;
            if (!isWarmup) result[pm].effectiveSets += 1;
            result[pm].totalReps += reps;
            result[pm].totalVolume += volume;
            mgWorkouts[pm].add(w.id);
          }
        }

        // Secondary Muscle Groups (add 0.5 set)
        for (const sm of secondaries) {
          if (result[sm]) {
            result[sm].totalSets += 0.5;
            if (!isWarmup) result[sm].effectiveSets += 0.5;
            result[sm].totalReps += reps;
            result[sm].totalVolume += volume * 0.5;
            mgWorkouts[sm].add(w.id);
          }
        }
      }
    }
  }

  // Populate workout counts
  for (const mg of muscleGroups) {
    if (result[mg]) {
      result[mg].workoutCount = mgWorkouts[mg].size;
    }
  }

  return result;
};

export const getVolumeLevelLabel = (
  sets: number,
  level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): { label: string; color: string; feedback: string } => {
  let low = 10;
  let optimal = 20;

  if (level === 'beginner') {
    low = 6;
    optimal = 12;
  } else if (level === 'advanced') {
    low = 12;
    optimal = 24;
  }

  if (sets === 0) {
    return { label: 'Çalışılmadı', color: 'text-slate-500 bg-slate-950', feedback: 'Bu kas grubu için henüz çalışma yapılmadı.' };
  } else if (sets < low) {
    return { label: 'Düşük Hacim', color: 'text-yellow-400 bg-yellow-450/10 border border-yellow-400/20', feedback: 'Gelişim için haftalık set sayısını biraz artırabilirsiniz.' };
  } else if (sets <= optimal) {
    return { label: 'Optimal Hacim', color: 'text-emerald-400 bg-emerald-450/10 border border-emerald-400/20', feedback: 'Mükemmel! Kas grubunu tam olarak ideal aralıkta uyarıyorsunuz.' };
  } else {
    return { label: 'Aşırı Hacim', color: 'text-rose-400 bg-rose-450/10 border border-rose-400/20', feedback: 'Dikkat! Overtraining riski yüksek. Hacmi biraz azaltıp dinlenmeye odaklanın.' };
  }
};

export interface WeeklyVolumeItem {
  sets: number;
  primaryExercises: number;
  secondaryExercises: number;
}

export const getWeeklyMuscleVolumes = (
  workoutSets: any[]
): Record<string, WeeklyVolumeItem> => {
  const result: Record<string, WeeklyVolumeItem> = {
    'Göğüs': { sets: 0, primaryExercises: 0, secondaryExercises: 0 },
    'Sırt': { sets: 0, primaryExercises: 0, secondaryExercises: 0 },
    'Omuz': { sets: 0, primaryExercises: 0, secondaryExercises: 0 },
    'Biceps': { sets: 0, primaryExercises: 0, secondaryExercises: 0 },
    'Triceps': { sets: 0, primaryExercises: 0, secondaryExercises: 0 },
    'Quads': { sets: 0, primaryExercises: 0, secondaryExercises: 0 },
    'Hamstrings': { sets: 0, primaryExercises: 0, secondaryExercises: 0 },
    'Karın': { sets: 0, primaryExercises: 0, secondaryExercises: 0 }
  };

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  for (const set of workoutSets) {
    if (!set.isCompleted || set.isWarmup) continue;
    
    // Check if within last 7 days
    if (new Date(set.date) < sevenDaysAgo) continue;

    const libItem = EXERCISE_LIBRARY.find(
      li => li.id === set.exerciseId || li.name.toLowerCase() === set.exerciseName.toLowerCase()
    );

    if (libItem) {
      // Primary Muscles
      const pmList = libItem.primaryMuscles || [];
      for (const pm of pmList) {
        let key = pm;
        if (pm === 'Göğüs' || pm === 'Sırt' || pm === 'Omuz' || pm === 'Biceps' || pm === 'Triceps' || pm === 'Quads' || pm === 'Hamstrings' || pm === 'Karın') {
          result[key].sets += 1;
          result[key].primaryExercises += 1;
        }
      }

      // Secondary Muscles (contribute 0.5 set)
      const smList = libItem.secondaryMuscles || [];
      for (const sm of smList) {
        let key = sm;
        if (sm === 'Göğüs' || sm === 'Sırt' || sm === 'Omuz' || sm === 'Biceps' || sm === 'Triceps' || sm === 'Quads' || sm === 'Hamstrings' || sm === 'Karın') {
          result[key].sets += 0.5;
          result[key].secondaryExercises += 1;
        }
      }
    }
  }

  return result;
};

export const getVolumeLevel = (sets: number): 'under_trained' | 'optimal' | 'maintenance' | 'overtrained' => {
  if (sets < 6) return 'under_trained';
  if (sets <= 15) return 'optimal';
  if (sets <= 20) return 'maintenance';
  return 'overtrained';
};

export const getLoadOptimalLabel = (sets: number): string => {
  if (sets < 6) return 'Yetersiz';
  if (sets <= 15) return 'Optimal';
  if (sets <= 20) return 'Koruma';
  return 'Aşırı Yükleme';
};
