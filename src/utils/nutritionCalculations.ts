import type { MealEntry, NutritionGoals, WaterEntry, WeeklyNutritionSummary } from '../types';

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const EMPTY_NUTRITION_TOTALS: NutritionTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0
};

export const safeNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getMealTotals = (meal: MealEntry): NutritionTotals => {
  if (Array.isArray(meal.items) && meal.items.length > 0) {
    return meal.items.reduce<NutritionTotals>(
      (totals, item) => ({
        calories: totals.calories + safeNumber(item.calories),
        protein: totals.protein + safeNumber(item.protein),
        carbs: totals.carbs + safeNumber(item.carbs),
        fat: totals.fat + safeNumber(item.fat)
      }),
      { ...EMPTY_NUTRITION_TOTALS }
    );
  }
  return {
    calories: safeNumber(meal.calories),
    protein: safeNumber(meal.protein),
    carbs: safeNumber(meal.carbs),
    fat: safeNumber(meal.fat)
  };
};

export const calculateDailyTotals = (
  meals: MealEntry[]
): NutritionTotals =>
  meals.reduce<NutritionTotals>((totals, meal) => {
    const mealTotals = getMealTotals(meal);
    return {
      calories: totals.calories + mealTotals.calories,
      protein: totals.protein + mealTotals.protein,
      carbs: totals.carbs + mealTotals.carbs,
      fat: totals.fat + mealTotals.fat
    };
  }, { ...EMPTY_NUTRITION_TOTALS });

export const getProgressPercent = (
  current: number,
  target: number
): number => {
  const safeTarget = safeNumber(target);
  if (safeTarget <= 0) return 0;
  return Math.min(
    100,
    Math.max(0, (safeNumber(current) / safeTarget) * 100)
  );
};

export const calculateRemainingMacros = (
  totals: NutritionTotals,
  goals: NutritionGoals,
  dailyWater = 0
) => ({
  calories: Math.max(0, safeNumber(goals.calories) - totals.calories),
  protein: Math.max(0, safeNumber(goals.protein) - totals.protein),
  carbs: Math.max(0, safeNumber(goals.carbs) - totals.carbs),
  fat: Math.max(0, safeNumber(goals.fat) - totals.fat),
  waterMl: Math.max(0, safeNumber(goals.waterMl) - safeNumber(dailyWater))
});

export const getGoalScore = (
  current: number,
  target: number
): number => {
  const safeTarget = safeNumber(target);
  if (safeTarget <= 0) return 0;
  const differenceRatio =
    Math.abs(safeNumber(current) - safeTarget) / safeTarget;
  return Math.max(
    0,
    Math.min(100, 100 - differenceRatio * 100)
  );
};

export const calculateNutritionCompliance = (
  totals: NutritionTotals,
  goals: NutritionGoals
): number => {
  const scores = [
    getGoalScore(totals.calories, goals.calories),
    getGoalScore(totals.protein, goals.protein),
    getGoalScore(totals.carbs, goals.carbs),
    getGoalScore(totals.fat, goals.fat)
  ];
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

export const formatCalories = (value: number): string =>
  Math.round(safeNumber(value)).toString();

export const formatMacro = (value: number): string =>
  safeNumber(value).toFixed(1);

export const calculateWeeklySummary = (
  meals: MealEntry[],
  waterEntries: WaterEntry[],
  goals: NutritionGoals
): WeeklyNutritionSummary => {
  const last7Days: string[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const weeklyMeals = meals.filter(m => last7Days.includes(m.date));
  const weeklyWater = waterEntries.filter(w => w.date && last7Days.includes(w.date));

  const totalCalories = weeklyMeals.reduce((sum, m) => sum + safeNumber(m.calories), 0);
  const totalProtein = weeklyMeals.reduce((sum, m) => sum + safeNumber(m.protein), 0);
  const totalCarbs = weeklyMeals.reduce((sum, m) => sum + safeNumber(m.carbs), 0);
  const totalFat = weeklyMeals.reduce((sum, m) => sum + safeNumber(m.fat), 0);
  const totalWater = weeklyWater.reduce((sum, w) => sum + safeNumber(w.amountMl), 0);

  const averageCalories = Math.round(totalCalories / 7);
  const averageProtein = Math.round((totalProtein / 7) * 10) / 10;
  const averageCarbs = Math.round((totalCarbs / 7) * 10) / 10;
  const averageFat = Math.round((totalFat / 7) * 10) / 10;
  const averageWater = Math.round(totalWater / 7);

  let goalMatchedDays = 0;
  for (const date of last7Days) {
    const dayMeals = weeklyMeals.filter(m => m.date === date);
    const dayTotals = calculateDailyTotals(dayMeals);
    if (dayTotals.calories >= safeNumber(goals.calories) * 0.9 && dayTotals.calories <= safeNumber(goals.calories) * 1.1) {
      goalMatchedDays++;
    }
  }

  const foodCounts: Record<string, number> = {};
  for (const m of weeklyMeals) {
    if (Array.isArray(m.items)) {
      for (const item of m.items) {
        foodCounts[item.name] = (foodCounts[item.name] || 0) + 1;
      }
    } else if (m.foodName) {
      foodCounts[m.foodName] = (foodCounts[m.foodName] || 0) + 1;
    }
  }
  let mostConsumedFood = '';
  let maxCount = 0;
  for (const [food, count] of Object.entries(foodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostConsumedFood = food;
    }
  }

  const dailyCalories: Record<string, number> = {};
  for (const m of weeklyMeals) {
    dailyCalories[m.date] = (dailyCalories[m.date] || 0) + safeNumber(m.calories);
  }
  let highestCalorieDay = '';
  let maxCal = 0;
  for (const [date, cal] of Object.entries(dailyCalories)) {
    if (cal > maxCal) {
      maxCal = cal;
      highestCalorieDay = date;
    }
  }

  const dailyProtein: Record<string, number> = {};
  for (const m of weeklyMeals) {
    dailyProtein[m.date] = (dailyProtein[m.date] || 0) + safeNumber(m.protein);
  }
  let lowestProteinDay = '';
  let minProt = Infinity;
  for (const [date, prot] of Object.entries(dailyProtein)) {
    if (prot < minProt) {
      minProt = prot;
      lowestProteinDay = date;
    }
  }

  return {
    averageCalories,
    averageProtein,
    averageCarbs,
    averageFat,
    averageWater,
    goalMatchedDays,
    highestCalorieDay: highestCalorieDay || undefined,
    lowestProteinDay: lowestProteinDay || undefined,
    mostConsumedFood: mostConsumedFood || undefined,
    totalMeals: weeklyMeals.length
  };
};
