/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workout, WeightEntry, MealEntry, WaterEntry, UserSettings } from '../types';

export interface AIRecommendation {
  id: string;
  type: 'success' | 'warning' | 'info' | 'motivation';
  title: string;
  message: string;
  actionLabel?: string;
  actionTab?: string;
}

export const aiRecommendationService = {
  /**
   * Generates smart, real-time contextual feedback and fitness coaching tips based on
   * user metrics, without external API calls (but structured for future LLM integration).
   */
  getRecommendations(
    settings: UserSettings,
    workouts: Workout[],
    weightEntries: WeightEntry[],
    meals: MealEntry[],
    waterEntries: WaterEntry[]
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    // Get today's logs
    const todayWater = waterEntries.find((w) => w.date === todayStr)?.amountMl || 0;
    const todayMeals = meals.filter((m) => m.date === todayStr);
    const todayCalorieSum = todayMeals.reduce((sum, m) => sum + m.calories, 0);
    const todayProteinSum = todayMeals.reduce((sum, m) => sum + m.protein, 0);

    // 1. Water Intake Recommendation
    if (todayWater === 0) {
      recommendations.push({
        id: 'water_empty',
        type: 'warning',
        title: 'Su Tüketimini Başlat',
        message: `Bugün henüz su tüketimi kaydetmedin. Günlük hedefin ${settings.dailyWaterGoal} ml. Metabolizmanı hızlandırmak için şimdi bir bardak su içip kaydetmeye ne dersin?`,
        actionLabel: 'Su Ekle',
        actionTab: 'Dashboard',
      });
    } else if (todayWater < settings.dailyWaterGoal * 0.5) {
      recommendations.push({
        id: 'water_low',
        type: 'info',
        title: 'Hidrasyonu Arttır',
        message: `Bugünkü su tüketimin (${todayWater} ml), hedefin olan ${settings.dailyWaterGoal} ml'nin yarısından az. Enerjin ve kas gelişimin için suyu ihmal etme.`,
        actionLabel: 'Su İçtim',
        actionTab: 'Dashboard',
      });
    } else if (todayWater >= settings.dailyWaterGoal) {
      recommendations.push({
        id: 'water_success',
        type: 'success',
        title: 'Harika Hidrasyon! 🎉',
        message: `Bugünkü su hedefini (${todayWater} ml / ${settings.dailyWaterGoal} ml) başarıyla tamamladın! Vücudun sana teşekkür ediyor.`,
      });
    }

    // 2. Workout Activity Check (This Week)
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    
    const weeklyWorkouts = workouts.filter((w) => {
      const workoutDate = new Date(w.date);
      return workoutDate >= oneWeekAgo && workoutDate <= now;
    });

    if (weeklyWorkouts.length === 0) {
      recommendations.push({
        id: 'workout_lazy_weekly',
        type: 'warning',
        title: 'Harekete Geçme Zamanı! 🔥',
        message: 'Bu hafta henüz hiç antrenman yapmadın. Bugün vücudunu uyandırmak için kısa bir "Full Body" veya 20 dakikalık hafif bir kardiyo antrenmanı planlayabilirsin.',
        actionLabel: 'Hemen Antrenman Ekle',
        actionTab: 'Antrenmanlar',
      });
    } else if (weeklyWorkouts.length >= 4) {
      recommendations.push({
        id: 'workout_overwork',
        type: 'motivation',
        title: 'Müthiş İstikrar ve Dinlenme',
        message: `Bu hafta tam ${weeklyWorkouts.length} antrenman yaptın! Kas gelişiminin dinlenirken (recovery) gerçekleştiğini unutma. Bugün hafif bir esneme ve aktif dinlenme günü yapabilirsin.`,
      });
    } else {
      recommendations.push({
        id: 'workout_steady',
        type: 'success',
        title: 'Formunu Koruyorsun',
        message: `Bu hafta ${weeklyWorkouts.length} antrenmanı tamamladın. Disiplinin harika gidiyor! Adım adım hedeflerine yaklaşıyorsun.`,
        actionLabel: 'Antrenman Günlüğü',
        actionTab: 'Antrenmanlar',
      });
    }

    // 3. Nutrition (Protein & Calories) Check for Today
    if (todayMeals.length > 0) {
      const minProteinRecommended = settings.currentWeight * 1.5; // 1.5g per kg
      if (todayProteinSum < minProteinRecommended && todayProteinSum < 100) {
        recommendations.push({
          id: 'nutrition_low_protein',
          type: 'warning',
          title: 'Protein Alımı Yetersiz',
          message: `Bugünkü protein alımın (${todayProteinSum}g), kas koruma ve inşa hedefin için biraz düşük kalmış (Tavsiye edilen minimum: ${Math.round(minProteinRecommended)}g). Bir sonraki öğününe yumurta, tavuk, balık veya baklagil ekleyebilirsin.`,
          actionLabel: 'Öğün Ekle',
          actionTab: 'Beslenme',
        });
      }

      if (todayCalorieSum > settings.dailyCalorieGoal) {
        recommendations.push({
          id: 'nutrition_calories_exceeded',
          type: 'info',
          title: 'Kalori Hedefi Aşıldı',
          message: `Bugünkü kalori alımın (${todayCalorieSum} kcal), hedeflediğin ${settings.dailyCalorieGoal} kcal sınırını geçti. Akşamı daha hafif, sebze veya protein ağırlıklı kapatabilirsin.`,
        });
      } else if (todayCalorieSum > 0 && todayCalorieSum < settings.dailyCalorieGoal * 0.7 && new Date().getHours() > 18) {
        recommendations.push({
          id: 'nutrition_calories_low',
          type: 'info',
          title: 'Yetersiz Kalori Alımı',
          message: `Günün bu saatine göre aldığın kalori miktarı oldukça düşük (${todayCalorieSum} kcal). Sağlıklı yağlar veya kuruyemişler ile öğünlerini destekleyebilirsin.`,
        });
      }
    }

    // 4. Weight Goal Analysis
    if (weightEntries.length > 0) {
      // Sort descending by date
      const sortedWeights = [...weightEntries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestWeight = sortedWeights[0].weight;
      const targetWeight = settings.targetWeight;
      const diff = Math.abs(latestWeight - targetWeight);

      if (diff <= 1 && diff > 0) {
        recommendations.push({
          id: 'weight_goal_close',
          type: 'motivation',
          title: 'Hedefe Son Adım! 🎯',
          message: `Hedef kilonuz olan ${targetWeight} kg'ye sadece ${diff.toFixed(1)} kg kaldı! İnanılmaz bir azim, sakın pes etme ve düzenini koru!`,
        });
      } else if (latestWeight > targetWeight && weightEntries.length > 1) {
        const initialWeight = sortedWeights[weightEntries.length - 1].weight;
        const totalLost = initialWeight - latestWeight;
        if (totalLost > 0) {
          recommendations.push({
            id: 'weight_progress_down',
            type: 'success',
            title: 'Kilo Kaybı Harika Başladı',
            message: `Sürecin başından beri toplamda ${totalLost.toFixed(1)} kg verdin. Kilo kaybı istikrarlı bir şekilde gidiyor, tebrikler!`,
          });
        }
      }
    }

    // Fallback motivating tip if recommendations list is too short
    if (recommendations.length < 2) {
      recommendations.push({
        id: 'motivational_tip',
        type: 'motivation',
        title: 'Bunu Unutma!',
        message: 'Motivasyon seni sadece yola çıkarır. Seni hedefine götürecek olan şey ise her gün sabırla sürdüreceğin alışkanlıklarındır.',
      });
    }

    return recommendations;
  },

  /**
   * Future expandability function for actual Gemini API calls.
   * Can be configured via express endpoint, which calls @google/genai server-side.
   */
  async getGeminiCoachAdvice(prompt: string): Promise<string> {
    try {
      // Currently runs logic-based generation as high reliability fallback
      return "Gelecekte AI antrenörü servisi buradaki Gemini API ile gerçek zamanlı analizler sunacak!";
    } catch {
      return "Öneri alınamadı.";
    }
  },
};
