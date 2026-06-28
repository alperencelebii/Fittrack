import { ProgressiveOverloadSuggestion, WorkoutSetEntry, DeloadSuggestion, RecoveryEntry } from '../types';

export const getProgressiveOverloadSuggestions = (
  sets: WorkoutSetEntry[]
): ProgressiveOverloadSuggestion[] => {
  const suggestions: ProgressiveOverloadSuggestion[] = [];
  
  // Group sets by exercise
  const exerciseSets: Record<string, WorkoutSetEntry[]> = {};
  for (const s of sets) {
    if (!s.isCompleted || s.isWarmup) continue;
    if (!exerciseSets[s.exerciseId]) {
      exerciseSets[s.exerciseId] = [];
    }
    exerciseSets[s.exerciseId].push(s);
  }

  const nowStr = new Date().toISOString();

  for (const [exerciseId, sList] of Object.entries(exerciseSets)) {
    const exerciseName = sList[0].exerciseName;
    const userId = sList[0].userId;

    // Sort by date (latest first) to analyze recent performance
    sList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Filter to latest date session
    const latestDate = sList[0].date;
    const latestSessionSets = sList.filter(s => s.date === latestDate);

    if (latestSessionSets.length === 0) continue;

    const avgWeight = latestSessionSets.reduce((sum, s) => sum + s.weight, 0) / latestSessionSets.length;
    const maxWeight = latestSessionSets.reduce((max, s) => Math.max(max, s.weight), 0);
    const avgReps = latestSessionSets.reduce((sum, s) => sum + s.reps, 0) / latestSessionSets.length;
    const maxReps = latestSessionSets.reduce((max, s) => Math.max(max, s.reps), 0);

    // Calculate average RPE and RIR
    const rpeList = latestSessionSets.filter(s => s.rpe !== undefined).map(s => s.rpe!);
    const avgRpe = rpeList.length > 0 ? rpeList.reduce((sum, r) => sum + r, 0) / rpeList.length : 8;

    const rirList = latestSessionSets.filter(s => s.rir !== undefined).map(s => s.rir!);
    const avgRir = rirList.length > 0 ? rirList.reduce((sum, r) => sum + r, 0) / rirList.length : 2;

    // Standard progression logic:
    if (avgRpe <= 7 || avgRir >= 3) {
      // Very easy session. We suggest increasing weight.
      const suggestedWeight = Math.round((maxWeight * 1.05) * 4) / 4; // +5% weight rounded to nearest 0.25kg
      suggestions.push({
        id: Math.random().toString(36).substring(2, 9),
        userId,
        exerciseId,
        exerciseName,
        suggestionType: 'increase_weight',
        currentWeight: maxWeight,
        suggestedWeight,
        currentReps: maxReps,
        suggestedReps: maxReps,
        reason: 'Son antrenmanda RPE oldukça düşük (kolay) hissedildi. Güç artışı sağlamak adına ağırlığı %5 artırabilirsiniz.',
        confidence: 85,
        createdAt: nowStr
      });
    } else if (avgRpe >= 9.5 || avgRir === 0) {
      // Failure reached. Suggest maintaining weight or reducing slightly to focus on technique.
      suggestions.push({
        id: Math.random().toString(36).substring(2, 9),
        userId,
        exerciseId,
        exerciseName,
        suggestionType: 'technique_focus',
        currentWeight: maxWeight,
        suggestedWeight: maxWeight,
        currentReps: maxReps,
        suggestedReps: Math.max(6, maxReps - 1),
        reason: 'Neredeyse tükenişe (fail) ulaştınız. Formunuzu bozmamak ve eklemlerinizi korumak için ağırlığı koruyup hareket kalitesine odaklanın.',
        confidence: 75,
        createdAt: nowStr
      });
    } else {
      // Moderate difficulty (RPE 8-9, RIR 1-2). Great. Encourage increasing reps by 1.
      suggestions.push({
        id: Math.random().toString(36).substring(2, 9),
        userId,
        exerciseId,
        exerciseName,
        suggestionType: 'increase_reps',
        currentWeight: maxWeight,
        suggestedWeight: maxWeight,
        currentReps: maxReps,
        suggestedReps: maxReps + 1,
        reason: 'Ağırlık seviyeniz hedefiniz için oldukça dengeli görünüyor. Bir sonraki antrenmanda set başına 1 tekrar daha fazla yapmaya çalışın.',
        confidence: 80,
        createdAt: nowStr
      });
    }
  }

  return suggestions;
};

export const checkDeloadSuggestions = (
  userId: string,
  recoveryLogs: RecoveryEntry[],
  sets: WorkoutSetEntry[]
): DeloadSuggestion | null => {
  // Deload conditions:
  // 1. Fatigue levels averaging >= 8 out of 10 in the last 5 logs.
  // 2. Average RPE in sets averaging >= 9 in the last 15 sets.
  // 3. Low sleep quality averaging <= 5/10.

  const recentLogs = [...recoveryLogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const reasons: string[] = [];
  
  if (recentLogs.length >= 3) {
    const avgFatigue = recentLogs.reduce((sum, l) => sum + l.fatigueLevel, 0) / recentLogs.length;
    const avgSleep = recentLogs.reduce((sum, l) => sum + l.sleepQuality, 0) / recentLogs.length;
    const avgSoreness = recentLogs.reduce((sum, l) => sum + l.muscleSoreness, 0) / recentLogs.length;

    if (avgFatigue >= 7.5) {
      reasons.push('Son 5 gün içinde ortalama yorgunluk seviyeniz çok yüksek (>= 7.5/10).');
    }
    if (avgSleep <= 5) {
      reasons.push('Uyku kaliteniz son zamanlarda yetersiz kalıyor (<= 5/10). Toparlanma hızı yavaşlamış olabilir.');
    }
    if (avgSoreness >= 7.5) {
      reasons.push('Kas ağrılarınız (soreness) azalmadan devam ediyor (>= 7.5/10).');
    }
  }

  // Check recent sets
  const recentSets = [...sets]
    .filter(s => s.isCompleted && !s.isWarmup && s.rpe !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15);

  if (recentSets.length >= 8) {
    const avgRpe = recentSets.reduce((sum, s) => sum + (s.rpe || 0), 0) / recentSets.length;
    if (avgRpe >= 8.8) {
      reasons.push('Son setlerinizdeki ortalama RPE (Zorluk Algısı) çok yüksek. Merkezi sinir sisteminiz yorulmuş olabilir.');
    }
  }

  if (reasons.length >= 2) {
    const durationDays = 7;
    const volumeReductionPercent = 40;
    const intensityReductionPercent = 15;
    
    const suggestedStartDate = new Date().toISOString().split('T')[0];

    return {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      reason: reasons,
      suggestedStartDate,
      suggestedDurationDays: durationDays,
      volumeReductionPercent,
      intensityReductionPercent,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }

  return null;
};
