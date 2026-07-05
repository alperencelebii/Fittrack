/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  UserSettings,
  Workout,
  WeightEntry,
  BodyMeasurement,
  MealEntry,
  WaterEntry,
} from '../types';
import { aiRecommendationService } from '../services/aiRecommendationService';
import {
  Sparkles,
  Flame,
  Plus,
  Droplet,
  CheckCircle2,
  Calendar,
  Scale,
  Ruler,
  TrendingDown,
  Quote,
  Zap,
  ChevronRight,
  MessageSquare,
  Target,
  Users,
  Check,
  UserCheck2,
} from 'lucide-react';

interface DashboardViewProps {
  settings: UserSettings;
  workouts: Workout[];
  weightEntries: WeightEntry[];
  bodyMeasurements: BodyMeasurement[];
  meals: MealEntry[];
  waterEntries: WaterEntry[];
  coachProfile?: any;
  coachNotes?: any[];
  coachGoals?: any[];
  onAddWater: (amountMl: number) => void;
  onResetWater: () => void;
  onNavigate: (
    tab: 'dashboard' | 'workouts' | 'measurements' | 'weight' | 'nutrition' | 'stats' | 'settings' | 'coach-connect'
  ) => void;
  onTriggerQuickAction: (actionType: 'workout' | 'weight' | 'measurement' | 'meal') => void;
  onToggleGoal?: (goalId: string, currentStatus: string) => void;
}

// Beautiful sport motivation quotes
const MOTIVATIONAL_QUOTES = [
  { text: "Zorluklar seni pes ettirmek için değil, daha güçlü olman için vardır.", author: "Arnold Schwarzenegger" },
  { text: "Acı geçicidir. Vazgeçmek ise sonsuza dek sürer.", author: "Lance Armstrong" },
  { text: "Gelecek, bugün ne yaptığına göre şekillenir.", author: "Mahatma Gandhi" },
  { text: "Sınırlar, tıpkı korkular gibi, genellikle sadece birer illüzyondur.", author: "Michael Jordan" },
  { text: "Başlamak için harika olmak zorunda değilsin, ama harika olmak için başlamak zorundasın.", author: "Zig Ziglar" },
];

export default function DashboardView({
  settings,
  workouts,
  weightEntries,
  bodyMeasurements,
  meals,
  waterEntries,
  coachProfile,
  coachNotes = [],
  coachGoals = [],
  onAddWater,
  onResetWater,
  onNavigate,
  onTriggerQuickAction,
  onToggleGoal,
}: DashboardViewProps) {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Today calculations
  const todayWater = useMemo(() => {
    return waterEntries.find((w) => w.date === todayStr)?.amountMl || 0;
  }, [waterEntries, todayStr]);

  const todayMeals = useMemo(() => {
    return meals.filter((m) => m.date === todayStr);
  }, [meals, todayStr]);

  const todayCalories = useMemo(() => {
    return todayMeals.reduce((sum, m) => sum + m.calories, 0);
  }, [todayMeals]);

  const todayProtein = useMemo(() => {
    return todayMeals.reduce((sum, m) => sum + m.protein, 0);
  }, [todayMeals]);

  const todayCarbs = useMemo(() => {
    return todayMeals.reduce((sum, m) => sum + m.carbs, 0);
  }, [todayMeals]);

  const todayFat = useMemo(() => {
    return todayMeals.reduce((sum, m) => sum + m.fat, 0);
  }, [todayMeals]);

  // Today's workout status
  const todayWorkout = useMemo(() => {
    return workouts.find((w) => w.date === todayStr);
  }, [workouts, todayStr]);

  // Weekly workouts
  const weeklyWorkoutsCount = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return workouts.filter((w) => {
      const workoutDate = new Date(w.date);
      return workoutDate >= oneWeekAgo && workoutDate <= now;
    }).length;
  }, [workouts]);

  // Latest weight
  const latestWeight = useMemo(() => {
    if (weightEntries.length === 0) return settings.currentWeight;
    const sorted = [...weightEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0].weight;
  }, [weightEntries, settings]);

  // Starting weight
  const startingWeight = useMemo(() => {
    if (weightEntries.length === 0) return settings.currentWeight;
    const sorted = [...weightEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[0].weight;
  }, [weightEntries, settings]);

  const weightChange = useMemo(() => {
    return latestWeight - startingWeight;
  }, [latestWeight, startingWeight]);

  // Latest body measurements
  const latestMeasurement = useMemo(() => {
    if (bodyMeasurements.length === 0) return null;
    const sorted = [...bodyMeasurements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0];
  }, [bodyMeasurements]);

  // Random motivation quote based on day
  const dailyQuote = useMemo(() => {
    const todayNum = new Date().getDate();
    return MOTIVATIONAL_QUOTES[todayNum % MOTIVATIONAL_QUOTES.length];
  }, []);

  // Today's recommended workout based on rotation
  const recommendedWorkout = useMemo(() => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const dayName = days[new Date().getDay()];
    
    switch (dayName) {
      case 'Pazartesi':
        return { name: 'İtiş Günü (Push Day)', desc: 'Göğüs, Omuz ve Triceps kaslarını hedefler.', type: 'Göğüs', duration: 60 };
      case 'Salı':
        return { name: 'Çekiş Günü (Pull Day)', desc: 'Sırt ve Biceps odaklı güç antrenmanı.', type: 'Sırt', duration: 60 };
      case 'Çarşamba':
        return { name: 'Aktif Kardiyo & Karın', desc: 'Metabolizmayı hızlandırır ve merkez bölgeyi sıkılaştırır.', type: 'Kardiyo', duration: 40 };
      case 'Perşembe':
        return { name: 'Bacak Günü (Lower Body)', desc: 'Squat, Leg Press ile güçlü bacaklar.', type: 'Bacak', duration: 65 };
      case 'Cuma':
        return { name: 'Omuz ve Kol Parçalama', desc: 'Omuz stabilitesi ve kol hacmi odaklı.', type: 'Omuz', duration: 55 };
      case 'Cumartesi':
        return { name: 'Full Body Kondisyon', desc: 'Yüksek yoğunluklu tüm vücut direnç seansı.', type: 'Full Body', duration: 70 };
      default:
        return { name: 'Esneklik ve Hafif Yoğa', desc: 'Vücudun yenilenmesi (recovery) için esneme egzersizleri.', type: 'Diğer', duration: 30 };
    }
  }, []);

  // AI recommendations
  const aiCoachRecommendations = useMemo(() => {
    return aiRecommendationService.getRecommendations(
      settings,
      workouts,
      weightEntries,
      meals,
      waterEntries
    );
  }, [settings, workouts, weightEntries, meals, waterEntries]);

  // Calorie progress percentage
  const caloriePercent = Math.min(100, Math.round((todayCalories / settings.dailyCalorieGoal) * 100));
  // Water progress percentage
  const waterPercent = Math.min(100, Math.round((todayWater / settings.dailyWaterGoal) * 100));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Hero / Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -transtlate-y-12 translate-x-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kişiselleştirilmiş Akıllı Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Hoş geldin, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-extrabold">{settings.nickname}</span>!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Bugün hedeflerine bir adım daha yaklaş. Antrenmanlarını, kilonu ve gelişimini tek bir premium alandan takip et.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onTriggerQuickAction('workout')}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition duration-150 inline-flex items-center gap-2 shadow-lg shadow-emerald-500/10 shrink-0 cursor-pointer text-sm"
            >
              <Plus className="w-4 h-4" /> Yeni Antrenman Günlüğü Ekle
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Buttons */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onTriggerQuickAction('workout')}
            className="flex items-center justify-center gap-2.5 p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition text-slate-200 group cursor-pointer text-sm font-semibold"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950 transition">
              <Plus className="w-4 h-4" />
            </span>
            Antrenman Gir
          </button>
          <button
            onClick={() => onTriggerQuickAction('weight')}
            className="flex items-center justify-center gap-2.5 p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 rounded-xl transition text-slate-200 group cursor-pointer text-sm font-semibold"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-400 group-hover:text-slate-950 transition">
              <Scale className="w-4 h-4" />
            </span>
            Kilo Kaydet
          </button>
          <button
            onClick={() => onTriggerQuickAction('meal')}
            className="flex items-center justify-center gap-2.5 p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 rounded-xl transition text-slate-200 group cursor-pointer text-sm font-semibold"
          >
            <span className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:bg-teal-400 group-hover:text-slate-950 transition">
              <Zap className="w-4 h-4" />
            </span>
            Öğün/Kalori Gir
          </button>
          <button
            onClick={() => onTriggerQuickAction('measurement')}
            className="flex items-center justify-center gap-2.5 p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 rounded-xl transition text-slate-200 group cursor-pointer text-sm font-semibold"
          >
            <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-400 group-hover:text-slate-950 transition">
              <Ruler className="w-4 h-4" />
            </span>
            Ölçülerini Gir
          </button>
        </div>
      </div>

      {/* 3. Today's Dashboard Widgets Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget: Nutrition (Kalori Takip) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Beslenme & Kalori</h3>
                <p className="text-xs text-slate-400">Günlük Enerji Dengesi</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('nutrition')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              Detaylar <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Bar & Percentages */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-white">
                {todayCalories}{' '}
                <span className="text-xs font-normal text-slate-400">/ {settings.dailyCalorieGoal} kcal</span>
              </div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${caloriePercent >= 100 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                %{caloriePercent}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
          </div>

          {/* Macros Mini Overview */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800">
            <div className="text-center p-2 rounded-lg bg-slate-950/40">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Protein</p>
              <p className="text-xs font-bold text-slate-200 mt-0.5">{todayProtein}g</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-950/40">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Karbon.</p>
              <p className="text-xs font-bold text-slate-200 mt-0.5">{todayCarbs}g</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-950/40">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Yağ</p>
              <p className="text-xs font-bold text-slate-200 mt-0.5">{todayFat}g</p>
            </div>
          </div>
        </div>

        {/* Widget: Hydration (Su Takip) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 animate-bounce-slow">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Su Tüketimi</h3>
                <p className="text-xs text-slate-400">Hidrasyon ve Sağlık</p>
              </div>
            </div>
            <button
              onClick={onResetWater}
              className="text-[11px] font-semibold text-slate-400 hover:text-red-400 cursor-pointer"
              title="Bugünkü su girişini sıfırla"
            >
              Sıfırla
            </button>
          </div>

          {/* Circle water tracker representation */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-white">
                {todayWater}{' '}
                <span className="text-xs font-normal text-slate-400">/ {settings.dailyWaterGoal} ml</span>
              </div>
              <div className="text-xs font-bold text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10">
                %{waterPercent}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Water Add Actions */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => onAddWater(250)}
              className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/40 text-[11px] font-semibold py-1.5 px-1 rounded-lg text-slate-300 transition shrink-0 cursor-pointer active:scale-95"
            >
              +250 ml
            </button>
            <button
              onClick={() => onAddWater(500)}
              className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/40 text-[11px] font-semibold py-1.5 px-1 rounded-lg text-slate-300 transition shrink-0 cursor-pointer active:scale-95"
            >
              +500 ml
            </button>
            <button
              onClick={() => onAddWater(750)}
              className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/40 text-[11px] font-semibold py-1.5 px-1 rounded-lg text-slate-300 transition shrink-0 cursor-pointer active:scale-95"
            >
              +750 ml
            </button>
          </div>
        </div>

        {/* Widget: Weight & Measurements Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Son Tartı & Hedef</h3>
                <p className="text-xs text-slate-400">Fiziksel Gelişim</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('weight')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              Geçmiş <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <p className="text-[10px] text-slate-450 uppercase font-semibold">Mevcut Kilo</p>
              <div className="text-lg font-black text-white mt-1">
                {latestWeight} <span className="text-xs font-normal">kg</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] mt-1 font-medium text-slate-400">
                Başlangıç: <span className="text-slate-200">{startingWeight}kg</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <p className="text-[10px] text-slate-450 uppercase font-semibold">Hedef Kilo</p>
              <div className="text-lg font-black text-emerald-400 mt-1">
                {settings.targetWeight} <span className="text-xs font-normal text-slate-400">kg</span>
              </div>
              <div className={`flex items-center gap-0.5 text-[11px] mt-1 font-bold ${weightChange <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span>{weightChange > 0 ? `+${weightChange.toFixed(1)}` : weightChange.toFixed(1)} kg</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
            <span>Kayıtlı Ölçümler:</span>
            <span className="font-semibold text-slate-200">
              {latestMeasurement ? `${latestMeasurement.date} (${latestMeasurement.waist ? `Bel:${latestMeasurement.waist}cm` : 'Ölçü var'})` : 'Belirtilmedi'}
            </span>
          </div>
        </div>
      </div>

      {/* Coach Direct Integration Board */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Users className="w-4 h-4 text-emerald-400" /> Antrenör Takip & Hedef Portalı
        </h2>

        {coachProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Coach info card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">BAĞLI ANTRENÖRÜM</span>
                <h3 className="text-sm font-extrabold text-white">{coachProfile.name || 'Koç'}</h3>
                <p className="text-xs text-slate-450">{coachProfile.email}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/80 text-[11px] text-slate-400 leading-relaxed font-normal">
                Kaydettiğiniz tüm antrenmanlar ve tartılar eşzamanlı olarak hocanıza iletilmektedir.
              </div>

              <button
                onClick={() => onNavigate('coach-connect')}
                className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl transition inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                Yönet & Bağlantı Kes <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Coach Direct Notes (Tavsiyeler) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-teal-400" /> HOCAMIN ÖNERİ VE NOTLARI
                </span>

                {coachNotes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">Antrenörünüz henüz bir özel tavsiyede bulunmadı.</p>
                ) : (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {coachNotes.map((note) => (
                      <div key={note.id} className="p-2 bg-slate-950 border border-slate-850 rounded-lg space-y-0.5">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                          {new Date(note.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-200">{note.title}</h4>
                        <p className="text-[11px] text-slate-450 leading-relaxed font-normal">{note.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Coach Goals (Atanan Görevler) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-purple-400" /> ATANAN ÖZEL GÖREVLERİM
                </span>

                {coachGoals.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">Antrenörünüz henüz bir hedef belirlemedi.</p>
                ) : (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {coachGoals.map((goal) => {
                      const completed = goal.status === 'completed';
                      return (
                        <div 
                          key={goal.id} 
                          className={`p-2.5 border rounded-lg flex items-center justify-between gap-2.5 transition ${
                            completed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-slate-950 border-slate-850'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <h4 className={`text-xs font-extrabold ${completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                              {goal.title}
                            </h4>
                            {goal.targetValue && (
                              <p className="text-[10px] text-emerald-400 font-semibold">Hedef: {goal.targetValue}</p>
                            )}
                          </div>

                          <button
                            onClick={() => onToggleGoal?.(goal.id, goal.status)}
                            className={`p-1 rounded cursor-pointer shrink-0 transition ${
                              completed ? 'bg-emerald-400 text-slate-950' : 'bg-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white">Özel Bir Antrenörle mi Çalışıyorsunuz?</h3>
              <p className="text-[11px] text-slate-450 leading-relaxed font-normal">
                Hocanızın size özel antrenman listesi yazması, kilonuzu takip etmesi ve beslenme tavsiyeleri vermesi için davet kodu ile hocanıza bağlanın.
              </p>
            </div>
            <button
              onClick={() => onNavigate('coach-connect')}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-4 py-2 text-xs font-black rounded-lg transition h-fit shrink-0 cursor-pointer text-center"
            >
              Koça Bağlan
            </button>
          </div>
        )}
      </div>

      {/* 4. Secondary Grid: AI Recommendations list & Today's Workout Status + Motivation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deep AI Smart Recommendations */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-extrabold text-white">Akıllı Coach AI Önerileri</h2>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {aiCoachRecommendations.map((rec) => {
              let alertColor = 'border-slate-850 bg-slate-950/40 text-slate-200';
              let badgeColor = 'bg-slate-800 text-slate-300';
              let icon = '💡';

              if (rec.type === 'success') {
                alertColor = 'border-emerald-500/20 bg-emerald-500/5 text-slate-200';
                badgeColor = 'bg-emerald-500/15 text-emerald-400';
                icon = '🎯';
              } else if (rec.type === 'warning') {
                alertColor = 'border-amber-500/20 bg-amber-500/5 text-slate-200';
                badgeColor = 'bg-amber-500/15 text-amber-400';
                icon = '⚠️';
              } else if (rec.type === 'motivation') {
                alertColor = 'border-blue-500/20 bg-blue-500/5 text-slate-200';
                badgeColor = 'bg-blue-500/15 text-blue-400';
                icon = '⚡';
              }

              return (
                <div
                  key={rec.id}
                  className={`p-4 border rounded-xl flex items-start gap-3.5 transition-all hover:border-slate-700 ${alertColor}`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>
                        Fit Coach
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {rec.message}
                    </p>
                    {rec.actionLabel && rec.actionTab && (
                      <button
                        onClick={() => {
                          if (rec.actionTab === 'Dashboard') {
                            onTriggerQuickAction('workout');
                          } else {
                            onNavigate(rec.actionTab.toLowerCase() as any);
                          }
                        }}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 underline transition mt-1 cursor-pointer"
                      >
                        {rec.actionLabel} <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Motivation & Daily Recommendation */}
        <div className="space-y-6">
          
          {/* Today's Exercise Advisory */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 px-10 h-full bg-emerald-500" />
            <div className="space-y-3.5 z-10 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bugünkü Antrenman Önerisi</span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {recommendedWorkout.type}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition duration-150">
                {recommendedWorkout.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {recommendedWorkout.desc}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-850">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Tahmini: {recommendedWorkout.duration} dk
                </span>
                <button
                  onClick={() => onNavigate('workouts')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  Listeye Git →
                </button>
              </div>
            </div>
          </div>

          {/* Motivation Quote Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative">
            <Quote className="absolute top-4 right-4 w-10 h-10 text-slate-800 pointer-events-none" />
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">Haftalık Motivasyon</span>
              <p className="text-xs text-slate-300 italic leading-relaxed pt-1">
                "{dailyQuote.text}"
              </p>
              <p className="text-right text-[11px] font-bold text-slate-500">
                — {dailyQuote.author}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Brief Stats & Streak Check */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Güvenli Bulut Veri Tabanı Aktif</h3>
            <p className="text-xs text-slate-400">
              Verileriniz bulut veri tabanımızda güvenle saklanır ve antrenörünüz ile anında senkronize olur.
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => onNavigate('settings')}
            className="w-full sm:w-auto px-4 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs font-bold rounded-lg text-slate-300 transition cursor-pointer"
          >
            Yedek Al (JSON)
          </button>
          <button
            onClick={() => onNavigate('stats')}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Grafik Analizleri
          </button>
        </div>
      </div>
    </div>
  );
}
