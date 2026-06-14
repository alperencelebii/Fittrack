/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Workout, WeightEntry, MealEntry, UserSettings, BodyMeasurement } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Sparkles,
  Award,
  Zap,
  Flame,
  Clock,
  Dumbbell,
  Scale,
  Ruler,
} from 'lucide-react';

interface StatsViewProps {
  settings: UserSettings;
  workouts: Workout[];
  weightEntries: WeightEntry[];
  meals: MealEntry[];
  bodyMeasurements: BodyMeasurement[];
}

export default function StatsView({
  settings,
  workouts,
  weightEntries,
  meals,
  bodyMeasurements,
}: StatsViewProps) {
  
  // 1. Core Summary Metrics
  const totalWorkouts = workouts.length;

  const weeklyWorkoutsCount = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return workouts.filter((w) => new Date(w.date) >= oneWeekAgo).length;
  }, [workouts]);

  const monthlyWorkoutsCount = useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(now.getDate() - 30);
    return workouts.filter((w) => new Date(w.date) >= oneMonthAgo).length;
  }, [workouts]);

  const totalCaloriesBurned = useMemo(() => {
    return workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  }, [workouts]);

  const averageDuration = useMemo(() => {
    if (totalWorkouts === 0) return 0;
    const sum = workouts.reduce((acc, w) => acc + w.duration, 0);
    return Math.round(sum / totalWorkouts);
  }, [workouts, totalWorkouts]);

  // Determine favorite workout type
  const favoriteWorkoutType = useMemo(() => {
    if (workouts.length === 0) return '—';
    const counts: { [key: string]: number } = {};
    workouts.forEach((w) => {
      counts[w.type] = (counts[w.type] || 0) + 1;
    });
    let maxType = '—';
    let maxVal = 0;
    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxVal) {
        maxType = type;
        maxVal = count;
      }
    });
    return `${maxType} (${maxVal} kez)`;
  }, [workouts]);

  // 2. Prepare Weight Line Chart Data
  const weightChartData = useMemo(() => {
    const sorted = [...weightEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (sorted.length === 0) return [];
    return sorted.map((w) => ({
      date: w.date.substring(5), // MM-DD for layout sanity
      Tarti: w.weight,
    }));
  }, [weightEntries]);

  // 3. Prepare Caloric Intake Chart Data
  const calorieChartData = useMemo(() => {
    // Group meals by date
    const dailyCalories: { [key: string]: number } = {};
    meals.forEach((m) => {
      dailyCalories[m.date] = (dailyCalories[m.date] || 0) + m.calories;
    });

    // Sort by date key
    const sortedDates = Object.keys(dailyCalories).sort();
    return sortedDates.map((date) => ({
      date: date.substring(5),
      Kalori: dailyCalories[date],
    }));
  }, [meals]);

  // 4. Prepare Weekly Workout Frequency Chart Data
  const workoutChartData = useMemo(() => {
    const weeklyCounts: { [key: string]: number } = {
      Pzt: 0,
      Sal: 0,
      Çar: 0,
      Per: 0,
      Cum: 0,
      Cmt: 0,
      Paz: 0,
    };

    const daysMap = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    workouts.forEach((w) => {
      const d = new Date(w.date);
      if (d >= oneWeekAgo) {
        const dayAbbr = daysMap[d.getDay()];
        if (weeklyCounts[dayAbbr] !== undefined) {
          weeklyCounts[dayAbbr] += 1;
        }
      }
    });

    return Object.entries(weeklyCounts).map(([day, count]) => ({
      Günü: day,
      Sıklık: count,
    }));
  }, [workouts]);

  // Custom chart tooltips
  const CustomWeightTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded shadow text-xs">
          <p className="text-slate-400 font-semibold">Tarih: {payload[0].payload.date}</p>
          <p className="font-bold text-blue-400">Ağırlık: {payload[0].value} kg</p>
        </div>
      );
    }
    return null;
  };

  const CustomCalorieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded shadow text-xs">
          <p className="text-slate-400 font-semibold">Tarih: {payload[0].payload.date}</p>
          <p className="font-bold text-orange-400">Tüketilen: {payload[0].value} kcal</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Gelişim İstatistikleri</h1>
        <p className="text-xs text-slate-400 mt-1">
          Performansınızı, kilo değişim eğrinizi ve beslenme kalıplarınızı tek bir gösterge panelinde analiz edin.
        </p>
      </div>

      {/* Bento Grid: Summary Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Toplam Spor</span>
          <p className="text-xl font-black text-white">{totalWorkouts}</p>
          <span className="text-[10px] text-slate-500 font-medium">Antrenman seansı</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Haftalık Sıklık</span>
          <p className="text-xl font-black text-emerald-450">{weeklyWorkoutsCount}</p>
          <span className="text-[10px] text-slate-500 font-medium">Son 7 günde</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Aylık Sıklık</span>
          <p className="text-xl font-black text-blue-400">{monthlyWorkoutsCount}</p>
          <span className="text-[10px] text-slate-500 font-medium">Son 30 günde</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Yakılan Kalori</span>
          <p className="text-xl font-black text-orange-400">{totalCaloriesBurned} kcal</p>
          <span className="text-[10px] text-slate-500 font-medium">Toplam enerji</span>
        </div>

        {/* Metric 5 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Ortalama Süre</span>
          <p className="text-xl font-black text-white">{averageDuration} dk</p>
          <span className="text-[10px] text-slate-500 font-medium">Seans başına</span>
        </div>

        {/* Metric 6 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Sık Yapılan</span>
          <p className="text-sm font-extrabold text-white truncate max-w-full">{favoriteWorkoutType}</p>
          <span className="text-[9px] text-slate-500 font-medium">Antrenman tipi</span>
        </div>
      </div>

      {/* Grid: Charts Display Module */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Chart 1: Weight Loss Progress Area Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-1.5 pb-2 border-b border-slate-850">
            <Scale className="w-4 h-4 text-blue-400" /> Kilo Değişim Analizi
          </h2>

          {weightChartData.length === 0 ? (
            <div className="h-[220px] rounded-xl bg-slate-950/40 border border-dashed border-slate-850 flex items-center justify-center text-center">
              <p className="text-xs text-slate-500">Henüz kilo verisi yok.</p>
            </div>
          ) : (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip content={<CustomWeightTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Tarti"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 2: Calorie Intake Progression Area Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-1.5 pb-2 border-b border-slate-850">
            <Zap className="w-4 h-4 text-orange-400" /> Günlük Tüketilen Kalori
          </h2>

          {calorieChartData.length === 0 ? (
            <div className="h-[220px] rounded-xl bg-slate-950/40 border border-dashed border-slate-850 flex items-center justify-center text-center">
              <p className="text-xs text-slate-500">Henüz beslenme verisi yok.</p>
            </div>
          ) : (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calorieChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip content={<CustomCalorieTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Kalori"
                    stroke="#eab308"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCalories)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 3: Weekly training frequency (bar chart) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-1.5 pb-2 border-b border-slate-850">
            <Dumbbell className="w-4 h-4 text-emerald-400" /> Son 7 Günlük Antrenman Sıklığı
          </h2>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="Günü" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#1e293b' }} />
                <Bar dataKey="Sıklık" fill="#10b981" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Change summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-1.5 pb-2 border-b border-slate-850">
              <Ruler className="w-4 h-4 text-purple-400" /> Vücut Ölçüm Özetleri Değişimi
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-normal leading-relaxed">
              Ölçülerinizdeki uzun vadeli değişimler genel durum tablonuzu yansıtır.
            </p>
          </div>

          {bodyMeasurements.length < 2 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">Fark analizi için en az 2 ölçü kaydı girmelisiniz.</p>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl space-y-2 text-xs border border-slate-850">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-350">Başlangıç Kaydı:</span>
                  <span className="text-white">{bodyMeasurements[bodyMeasurements.length - 1].date}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-350">Son Güncel Kayıt:</span>
                  <span className="text-purple-400">{bodyMeasurements[0].date}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal leading-relaxed">
                * Kilo verme sürecinde bel çevresindeki azalmalar ve omuz/kol çevresindeki artışlar kas kütlesinin kazanıldığına işaret eden harika göstergelerdir.
              </p>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850/80 flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <Award className="w-4 h-4 text-yellow-500 shrink-0" />
            <span>Hedef kilonuz: <strong>{settings.targetWeight} kg</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
