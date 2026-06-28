/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserSettings,
  Workout,
  WeightEntry,
  BodyMeasurement,
  MealEntry,
  WaterEntry,
} from '../types';

const KEYS = {
  USER_SETTINGS: 'fittrack_user_settings',
  WORKOUTS: 'fittrack_workouts',
  WEIGHT_ENTRIES: 'fittrack_weight_entries',
  BODY_MEASUREMENTS: 'fittrack_body_measurements',
  MEALS: 'fittrack_meals',
  WATER_ENTRIES: 'fittrack_water_entries',
  ONBOARDING_COMPLETED: 'fittrack_onboarding_completed',
};

// Default User Settings
const DEFAULT_SETTINGS: UserSettings = {
  nickname: 'Sporcu',
  height: 180,
  currentWeight: 80,
  targetWeight: 75,
  dailyCalorieGoal: 2200,
  dailyWaterGoal: 3000,
  theme: 'dark',
  createdAt: new Date().toISOString().split('T')[0],
};

export const storageService = {
  // User Settings
  getUserSettings(): UserSettings {
    const data = localStorage.getItem(KEYS.USER_SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveUserSettings(settings: UserSettings): void {
    localStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(settings));
  },

  // Onboarding
  isOnboardingCompleted(): boolean {
    return localStorage.getItem(KEYS.ONBOARDING_COMPLETED) === 'true';
  },

  setOnboardingCompleted(completed: boolean): void {
    localStorage.setItem(KEYS.ONBOARDING_COMPLETED, completed ? 'true' : 'false');
  },

  // Workouts
  getWorkouts(): Workout[] {
    const data = localStorage.getItem(KEYS.WORKOUTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveWorkouts(workouts: Workout[]): void {
    localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
  },

  // Weight Entries
  getWeightEntries(): WeightEntry[] {
    const data = localStorage.getItem(KEYS.WEIGHT_ENTRIES);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveWeightEntries(entries: WeightEntry[]): void {
    localStorage.setItem(KEYS.WEIGHT_ENTRIES, JSON.stringify(entries));
  },

  // Body Measurements
  getBodyMeasurements(): BodyMeasurement[] {
    const data = localStorage.getItem(KEYS.BODY_MEASUREMENTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveBodyMeasurements(measurements: BodyMeasurement[]): void {
    localStorage.setItem(KEYS.BODY_MEASUREMENTS, JSON.stringify(measurements));
  },

  // Meals
  getMeals(): MealEntry[] {
    const data = localStorage.getItem(KEYS.MEALS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveMeals(meals: MealEntry[]): void {
    localStorage.setItem(KEYS.MEALS, JSON.stringify(meals));
  },

  // Water Entries
  getWaterEntries(): WaterEntry[] {
    const data = localStorage.getItem(KEYS.WATER_ENTRIES);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveWaterEntries(entries: WaterEntry[]): void {
    localStorage.setItem(KEYS.WATER_ENTRIES, JSON.stringify(entries));
  },

  addWater(date: string, amountMl: number): void {
    const entries = this.getWaterEntries();
    const existingIndex = entries.findIndex((e) => e.date === date);

    if (existingIndex > -1) {
      const existing = entries[existingIndex];
      existing.amountMl = Math.max(0, (existing.amountMl || 0) + amountMl);
    } else {
      entries.push({
        id: Math.random().toString(36).substring(2, 9),
        date,
        amountMl: Math.max(0, amountMl),
        createdAt: new Date().toISOString()
      });
    }
    this.saveWaterEntries(entries);
  },

  // Clear All
  clearAllData(): void {
    localStorage.removeItem(KEYS.USER_SETTINGS);
    localStorage.removeItem(KEYS.WORKOUTS);
    localStorage.removeItem(KEYS.WEIGHT_ENTRIES);
    localStorage.removeItem(KEYS.BODY_MEASUREMENTS);
    localStorage.removeItem(KEYS.MEALS);
    localStorage.removeItem(KEYS.WATER_ENTRIES);
    localStorage.removeItem(KEYS.ONBOARDING_COMPLETED);
  },

  // Export Data
  exportDataJSON(): string {
    const data = {
      userSettings: this.getUserSettings(),
      workouts: this.getWorkouts(),
      weightEntries: this.getWeightEntries(),
      bodyMeasurements: this.getBodyMeasurements(),
      meals: this.getMeals(),
      waterEntries: this.getWaterEntries(),
      onboardingCompleted: this.isOnboardingCompleted(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import Data
  importDataJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.userSettings) this.saveUserSettings(data.userSettings);
      if (data.workouts) this.saveWorkouts(data.workouts);
      if (data.weightEntries) this.saveWeightEntries(data.weightEntries);
      if (data.bodyMeasurements) this.saveBodyMeasurements(data.bodyMeasurements);
      if (data.meals) this.saveMeals(data.meals);
      if (data.waterEntries) this.saveWaterEntries(data.waterEntries);
      if (data.onboardingCompleted !== undefined) {
        this.setOnboardingCompleted(data.onboardingCompleted);
      }
      return true;
    } catch (e) {
      console.error('Data import failed', e);
      return false;
    }
  },

  // Loading Demo Data
  loadDemoData(): void {
    const today = new Date();
    const formatDate = (daysAgo: number) => {
      const d = new Date();
      d.setDate(today.getDate() - daysAgo);
      return d.toISOString().split('T')[0];
    };

    // User Settings
    const demoSettings: UserSettings = {
      nickname: 'Caner Özdemir',
      height: 182,
      currentWeight: 82.5,
      targetWeight: 78,
      dailyCalorieGoal: 2300,
      dailyWaterGoal: 3000,
      theme: 'dark',
      createdAt: formatDate(30),
    };
    this.saveUserSettings(demoSettings);
    this.setOnboardingCompleted(true);

    // Kilo Geçmişi (Weight entries covering last 4 weeks)
    const demoWeight: WeightEntry[] = [
      { id: 'w1', date: formatDate(25), weight: 84.2, notes: 'İlk ölçüm, sabah aç karnına.' },
      { id: 'w2', date: formatDate(20), weight: 83.8, notes: 'Beslenme temiz, su tüketimi iyi.' },
      { id: 'w3', date: formatDate(15), weight: 83.1, notes: 'Metabolizma hızlandı.' },
      { id: 'w4', date: formatDate(10), weight: 82.9, notes: 'Bacak günü sonrası hafif ödem var.' },
      { id: 'w5', date: formatDate(5), weight: 82.6, notes: 'Hedefe doğru istikrarlı ilerleme.' },
      { id: 'w6', date: formatDate(0), weight: 82.1, notes: 'Bugünkü tartı sonucu.' },
    ];
    this.saveWeightEntries(demoWeight);

    // Ölçüler (Body measurements)
    const demoMeasurements: BodyMeasurement[] = [
      {
        id: 'm1',
        date: formatDate(25),
        waist: 88,
        chest: 104,
        arm: 37.5,
        shoulder: 118,
        hip: 102,
        leg: 58,
        neck: 39,
        bodyFat: 18.5,
        notes: 'Spora başlama ölçülerim.',
      },
      {
        id: 'm2',
        date: formatDate(10),
        waist: 86.5,
        chest: 105,
        arm: 38.1,
        shoulder: 119.5,
        hip: 101,
        leg: 58.5,
        neck: 38.5,
        bodyFat: 17.2,
        notes: 'Gözle görülür sıkılaşma ve omuzda genişleme var.',
      },
      {
        id: 'm3',
        date: formatDate(0),
        waist: 85.0,
        chest: 106,
        arm: 38.4,
        shoulder: 120.5,
        hip: 100,
        leg: 59,
        neck: 38,
        bodyFat: 16.0,
        notes: 'Son durum harika, yağ oranı düştü, kas kütlesi arttı.',
      },
    ];
    this.saveBodyMeasurements(demoMeasurements);

    // Water entries
    const demoWater: WaterEntry[] = [
      { id: 'w1', userId: 'demo-user', date: formatDate(4), amountMl: 2500, createdAt: new Date().toISOString() },
      { id: 'w2', userId: 'demo-user', date: formatDate(3), amountMl: 3250, createdAt: new Date().toISOString() },
      { id: 'w3', userId: 'demo-user', date: formatDate(2), amountMl: 3000, createdAt: new Date().toISOString() },
      { id: 'w4', userId: 'demo-user', date: formatDate(1), amountMl: 3500, createdAt: new Date().toISOString() },
      { id: 'w5', userId: 'demo-user', date: formatDate(0), amountMl: 1750, createdAt: new Date().toISOString() }, // today, partial
    ];
    this.saveWaterEntries(demoWater);

    // Meals (Today's foods + some historical for statistics)
    const demoMeals: MealEntry[] = [
      // Today (0 days ago)
      {
        id: 'f1',
        userId: 'demo-user',
        date: formatDate(0),
        mealType: 'Kahvaltı',
        foodName: 'Yulaflı Omlet (4 Yumurta, 50g Yulaf)',
        calories: 520,
        protein: 36,
        carbs: 35,
        fat: 18,
        notes: 'Antrenman öncesi harika karbonhidrat ve protein kaynağı.',
      },
      {
        id: 'f2',
        userId: 'demo-user',
        date: formatDate(0),
        mealType: 'Öğle',
        foodName: 'Izgara Tavuk Göğsü (200g) ve Basmati Pirinç Pilavı (150g)',
        calories: 640,
        protein: 52,
        carbs: 60,
        fat: 8,
        notes: 'Klasik sporcu öğünü.',
      },
      {
        id: 'f3',
        userId: 'demo-user',
        date: formatDate(0),
        mealType: 'Ara Öğün',
        foodName: 'Muz, Çiğ Badem (30g) ve Whey Protein Shake',
        calories: 420,
        protein: 30,
        carbs: 38,
        fat: 14,
        notes: 'Antrenman sonrasındaki ilk 1 saat içinde tüketildi.',
      },
      // Yesterday (1 days ago)
      {
        id: 'f4',
        userId: 'demo-user',
        date: formatDate(1),
        mealType: 'Kahvaltı',
        foodName: 'Fıstık Ezmeli Tost & Süzme Peynir',
        calories: 480,
        protein: 22,
        carbs: 45,
        fat: 20,
      },
      {
        id: 'f5',
        userId: 'demo-user',
        date: formatDate(1),
        mealType: 'Öğle',
        foodName: 'Dana Kıyma (180g) & Makarna (200g)',
        calories: 820,
        protein: 44,
        carbs: 85,
        fat: 18,
      },
      {
        id: 'f6',
        userId: 'demo-user',
        date: formatDate(1),
        mealType: 'Akşam',
        foodName: 'Fırında Somon (200g) & Karışık Yeşil Salata',
        calories: 560,
        protein: 40,
        carbs: 10,
        fat: 32,
      },
    ];
    this.saveMeals(demoMeals);

    // Workouts (with nested exercises)
    const demoWorkouts: Workout[] = [
      {
        id: 'wk1',
        name: 'Göğüs ve Ön Kol (Push Day)',
        date: formatDate(4),
        type: 'Göğüs',
        duration: 65,
        caloriesBurned: 520,
        difficulty: 'Zor',
        notes: 'Güç artışı hissettim, son setlerde pump efsaneydi.',
        exercises: [
          { id: 'ex1_1', name: 'Incline Dumbbell Press', sets: 4, reps: 10, weight: 30, restSeconds: 90, notes: 'Son sette yardım aldım.' },
          { id: 'ex1_2', name: 'Z-Bar Biceps Curl', sets: 3, reps: 12, weight: 25, restSeconds: 60 },
          { id: 'ex1_3', name: 'Cable Crossover', sets: 3, reps: 15, weight: 15, restSeconds: 45 },
        ],
      },
      {
        id: 'wk2',
        name: 'Sırt ve Arka Kol (Pull Day)',
        date: formatDate(3),
        type: 'Sırt',
        duration: 70,
        caloriesBurned: 580,
        difficulty: 'Orta',
        notes: 'Kanat aktivasyonu mükemmeldi. Tricepsleri iyice tükettim.',
        exercises: [
          { id: 'ex2_1', name: 'Barfiks (Lat Pulldown)', sets: 4, reps: 8, weight: 0, restSeconds: 90, notes: 'Vücut ağırlığıyla.' },
          { id: 'ex2_2', name: 'T-Bar Row', sets: 4, reps: 10, weight: 50, restSeconds: 90 },
          { id: 'ex2_3', name: 'Pushdown (Arka Kol)', sets: 3, reps: 12, weight: 30, restSeconds: 60 },
        ],
      },
      {
        id: 'wk3',
        name: 'Alt Vücut (Leg Day)',
        date: formatDate(2),
        type: 'Bacak',
        duration: 60,
        caloriesBurned: 650,
        difficulty: 'Zor',
        notes: 'Squat rekor denemesi yaptım ve başardım!',
        exercises: [
          { id: 'ex3_1', name: 'Squat', sets: 4, reps: 8, weight: 100, restSeconds: 120, notes: 'Kemer kullandım.' },
          { id: 'ex3_2', name: 'Leg Press', sets: 3, reps: 12, weight: 180, restSeconds: 90 },
          { id: 'ex3_3', name: 'Walking Lunges', sets: 3, reps: 20, weight: 15, restSeconds: 60 },
        ],
      },
      {
        id: 'wk4',
        name: 'Aktif Kardiyo & Karın',
        date: formatDate(1),
        type: 'Kardiyo',
        duration: 45,
        caloriesBurned: 400,
        difficulty: 'Kolay',
        notes: 'Eğimli koşu bandı yürüyüşü ve ardından yoğun karın devresi.',
        exercises: [
          { id: 'ex4_1', name: 'Koşu Bandı (Eğlimli Yürüyüş)', sets: 1, reps: 1, weight: 0, restSeconds: 0, notes: '6.0 km/s hız, %8 eğim.' },
          { id: 'ex4_2', name: 'Plank', sets: 3, reps: 60, weight: 0, restSeconds: 45, notes: 'Saniye cinsinden.' },
          { id: 'ex4_3', name: 'Hanging Leg Raise', sets: 3, reps: 15, weight: 0, restSeconds: 45 },
        ],
      },
    ];
    this.saveWorkouts(demoWorkouts);
  },
};
