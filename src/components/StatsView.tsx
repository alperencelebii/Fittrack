/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Workout, WeightEntry, MealEntry, UserSettings, BodyMeasurement } from '../types';
import {
  normalizeExerciseSets,
  calculateWorkoutVolume,
  calculateWorkoutTotalSets,
  calculateWorkoutTotalReps,
} from '../services/databaseService';
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

  // 1b. Additional Training Performance Metrics
  const totalSetsCount = useMemo(() => {
    return workouts.reduce((sum, w) => sum + calculateWorkoutTotalSets(w), 0);
  }, [workouts]);

  const totalRepsCount = useMemo(() => {
    return workouts.reduce((sum, w) => sum + calculateWorkoutTotalReps(w), 0);
  }, [workouts]);

  const totalWorkoutVolume = useMemo(() => {
    return workouts.reduce((sum, w) => sum + calculateWorkoutVolume(w), 0);
  }, [workouts]);

  const weeklyWorkoutVolume = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return workouts
      .filter((w) => new Date(w.date) >= oneWeekAgo)
      .reduce((sum, w) => sum + calculateWorkoutVolume(w), 0);
  }, [workouts]);

  const maxVolumeWorkout = useMemo(() => {
    if (workouts.length === 0) return null;
    let maxWObj = workouts[0];
    let maxVol = calculateWorkoutVolume(workouts[0]);
    for (const w of workouts) {
      const vol = calculateWorkoutVolume(w);
      if (vol > maxVol) {
        maxVol = vol;
        maxWObj = w;
      }
    }
    return maxVol > 0 ? { name: maxWObj.name, date: maxWObj.date, volume: maxVol } : null;
  }, [workouts]);

  const mostPopularExercise = useMemo(() => {
    if (workouts.length === 0) return null;
    const counts: { [key: string]: number } = {};
    workouts.forEach((w) => {
      if (Array.isArray(w.exercises)) {
        w.exercises.forEach((ex) => {
          if (ex.name) {
            counts[ex.name] = (counts[ex.name] || 0) + 1;
          }
        });
      }
    });

    let maxEx = '';
    let maxCount = 0;
    Object.entries(counts).forEach(([name, count]) => {
      if (count > maxCount) {
        maxEx = name;
        maxCount = count;
      }
    });

    return maxCount > 0 ? { name: maxEx, count: maxCount } : null;
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

      {/* Bento Grid 2: Advanced Training Volume & Set Metrics */}
      <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-850">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Detaylı Güç ve Performans Metrikleri
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Metric Box 1: Total Volume */}
          <div className="bg-slate-905 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Toplam Tonaj</span>
            <p className="text-xl font-black text-emerald-400">{totalWorkoutVolume.toLocaleString('tr-TR')} kg</p>
            <span className="text-[10px] text-slate-500 font-medium">Tüm kaldırılan yük</span>
          </div>

          {/* Metric Box 2: Weekly Volume */}
          <div className="bg-slate-905 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Haftalık Yük</span>
            <p className="text-xl font-black text-blue-400">{weeklyWorkoutVolume.toLocaleString('tr-TR')} kg</p>
            <span className="text-[10px] text-slate-500 font-medium">Son 7 günlük tonaj</span>
          </div>

          {/* Metric Box 3: Total Sets */}
          <div className="bg-slate-905 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Toplam Set</span>
            <p className="text-xl font-black text-violet-400">{totalSetsCount}</p>
            <span className="text-[10px] text-slate-500 font-medium">Tamamlanan set</span>
          </div>

          {/* Metric Box 4: Total Reps */}
          <div className="bg-slate-905 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Toplam Tekrar</span>
            <p className="text-xl font-black text-pink-400">{totalRepsCount}</p>
            <span className="text-[10px] text-slate-500 font-medium">Toplam hareket tekrarı</span>
          </div>

          {/* Metric Box 5: Max Volume Workout */}
          <div className="bg-slate-905 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">En Ağır Seans</span>
            {maxVolumeWorkout ? (
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate" title={maxVolumeWorkout.name}>{maxVolumeWorkout.name}</p>
                <p className="text-xs font-bold text-emerald-450 font-mono mt-0.5">{maxVolumeWorkout.volume.toLocaleString('tr-TR')} kg</p>
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-600">—</p>
            )}
            <span className="text-[10px] text-slate-500 font-medium">Tek seanstaki rekor</span>
          </div>

          {/* Metric Box 6: Most Popular Exercise */}
          <div className="bg-slate-905 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Sık Yapılan Hareket</span>
            {mostPopularExercise ? (
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate" title={mostPopularExercise.name}>{mostPopularExercise.name}</p>
                <p className="text-[10px] text-emerald-450 font-bold mt-0.5">{mostPopularExercise.count} kez eklendi</p>
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-600">—</p>
            )}
            <span className="text-[9px] text-slate-500 font-medium">En çok loglanan egzersiz</span>
          </div>

        </div>
      </div>

      {/* Grid: Charts Display Module */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Chart 1: Weight Progress Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="text-blue-400 w-5 h-5" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Ağırlık Takip Grafiği</h3>
          </div>
          <div className="h-64 w-full">
            {weightChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-550 italic border border-dashed border-slate-800 rounded-xl">
                Tarih bazlı gelişim görebilmek için kilo girdisi yapmalısınız.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightChartData}>
                  <defs>
                    <linearGradient id="weightColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['dataMin - 3', 'dataMax + 3']} />
                  <Tooltip content={<CustomWeightTooltip />} />
                  <Area type="monotone" dataKey="Tarti" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#weightColor)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Daily Calories intake */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-400 w-5 h-5" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Günlük Enerji Alımı (kcal)</h3>
          </div>
          <div className="h-64 w-full">
            {calorieChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-550 italic border border-dashed border-slate-800 rounded-xl">
                Kalori grafiği için beslenme günlüğüne öğünler eklemiş olmalısınız.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calorieChartData}>
                  <defs>
                    <linearGradient id="calorieColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomCalorieTooltip />} />
                  <Area type="monotone" dataKey="Kalori" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#calorieColor)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 3: Weekly Workouts frequency split */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-emerald-400 w-5 h-5" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Haftalık Antrenman Sıklık Dağılımı</h3>
          </div>
          <div className="h-64 w-full">
            {totalWorkouts === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-550 italic border border-dashed border-slate-800 rounded-xl">
                Son 7 günün antrenman istatistiğini görmek için antrenman günlüğüne girişler yapın.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workoutChartData}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                  <XAxis dataKey="Günü" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', fontSize: '11px', borderRadius: '6px' }} 
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Bar dataKey="Sıklık" fill="#34d399" radius={[4, 4, 0, 0]} barSize={34} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
