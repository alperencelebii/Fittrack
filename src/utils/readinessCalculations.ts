import { RecoveryEntry, ReadinessResult } from '../types';

export const calculateDailyReadinessScore = (
  recovery: RecoveryEntry | undefined
): ReadinessResult => {
  if (!recovery) {
    return {
      score: 75,
      level: 'good',
      recommendation: 'Bugün herhangi bir dinlenme kaydı girmediniz. Varsayılan olarak normal şiddette antrenman yapabilirsiniz.',
      factors: {
        sleep: 75,
        fatigue: 75,
        stress: 75,
        soreness: 75,
        motivation: 75,
        trainingLoad: 75
      }
    };
  }

  // Scale calculations (1-10 to 0-100)
  const sleepFactor = Math.min(100, Math.max(0, recovery.sleepQuality * 10));
  // High fatigue is bad, so we invert it
  const fatigueFactor = Math.min(100, Math.max(0, (11 - recovery.fatigueLevel) * 10));
  // High stress is bad, so we invert it
  const stressFactor = Math.min(100, Math.max(0, (11 - recovery.stressLevel) * 10));
  // High soreness is bad, so we invert it
  const sorenessFactor = Math.min(100, Math.max(0, (11 - recovery.muscleSoreness) * 10));
  const motivationFactor = Math.min(100, Math.max(0, recovery.motivationLevel * 10));
  
  // Sleep hours target: 8 hours = 100%
  const sleepHoursFactor = Math.min(100, Math.max(0, (recovery.sleepHours / 8) * 100));
  const combinedSleep = (sleepFactor * 0.4) + (sleepHoursFactor * 0.6);

  // Training load: simulate based on fatigue
  const trainingLoadFactor = Math.min(100, Math.max(0, (11 - (recovery.fatigueLevel + 1) / 2) * 10));

  // Weighted score:
  // Sleep: 25%
  // Fatigue: 20%
  // Stress: 15%
  // Soreness: 15%
  // Motivation: 15%
  // Training Load: 10%
  const finalScore = Math.round(
    (combinedSleep * 0.25) +
    (fatigueFactor * 0.20) +
    (stressFactor * 0.15) +
    (sorenessFactor * 0.15) +
    (motivationFactor * 0.15) +
    (trainingLoadFactor * 0.10)
  );

  let level: ReadinessResult['level'] = 'moderate';
  let recommendation = 'Orta şiddette antrenman yapabilirsiniz.';

  if (finalScore >= 85) {
    level = 'excellent';
    recommendation = 'Harika durumdasınız! Yoğun veya rekor denemeli ağır bir antrenman yapabilirsiniz. 🚀';
  } else if (finalScore >= 70) {
    level = 'good';
    recommendation = 'Vücudunuz iyi dinlenmiş görünüyor. Normal şiddette, planlı antrenmanınızı uygulayabilirsiniz. 💪';
  } else if (finalScore >= 50) {
    level = 'moderate';
    recommendation = 'Orta derecede yorgunluk var. Set veya ağırlıkları biraz düşürerek orta şiddette bir çalışma yapabilirsiniz. ⚡';
  } else if (finalScore >= 30) {
    level = 'low';
    recommendation = 'Düşük hazırlık! Hafif bir kardiyo, esneme veya aktif toparlanma seansı yapmanız önerilir. ⚠️';
  } else {
    level = 'very_low';
    recommendation = 'Aşırı yorgunluk ve düşük toparlanma! Bugün kesinlikle dinlenmeli (rest day) veya sadece hafif mobilite yapmalısınız. 🛑';
  }

  return {
    score: finalScore,
    level,
    recommendation,
    factors: {
      sleep: Math.round(combinedSleep),
      fatigue: Math.round(fatigueFactor),
      stress: Math.round(stressFactor),
      soreness: Math.round(sorenessFactor),
      motivation: Math.round(motivationFactor),
      trainingLoad: Math.round(trainingLoadFactor)
    }
  };
};
