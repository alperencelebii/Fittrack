import React, { useMemo } from 'react';
import { WorkoutSetEntry } from '../../types';
import { 
  getWeeklyMuscleVolumes, 
  getVolumeLevel, 
  getLoadOptimalLabel 
} from '../../utils/muscleVolumeCalculations';
import { 
  BarChart3, 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info 
} from 'lucide-react';

interface MuscleVolumeChartsProps {
  workoutSets: WorkoutSetEntry[];
}

export default function MuscleVolumeCharts({
  workoutSets
}: MuscleVolumeChartsProps) {
  const muscleVolumes = useMemo(() => {
    return getWeeklyMuscleVolumes(workoutSets);
  }, [workoutSets]);

  // Total completed sets in the last 7 days
  const totalSetsThisWeek = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const completedThisWeek = workoutSets.filter(s => 
      s.isCompleted && !s.isWarmup && new Date(s.date) >= sevenDaysAgo
    );
    return completedThisWeek.length;
  }, [workoutSets]);

  return (
    <div id="muscle-volume-charts" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Kas Grubu Haftalık Hacim Analizi</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">Son 7 günde kas gruplarına uyguladığınız toplam set sayılarını ve gelişim seviyenizi görün.</p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Haftalık Toplam Set</span>
          <span className="text-lg font-black text-white font-mono">{totalSetsThisWeek} Set</span>
        </div>
      </div>

      {/* BENCHMARK / INFORMATION METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span className="text-xs text-slate-200 font-bold">Yetersiz Hacim (0 - 5 Set)</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">Kas büyümesini tetiklemek için haftalık minimum 6 set hedeflenmelidir.</p>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-200 font-bold">Optimal Gelişim (6 - 15 Set)</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">Hipertrofi ve güç artışı için en verimli ve toparlanabilir set aralığıdır.</p>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-xs text-slate-200 font-bold">Koruma / Sınır (16 - 20 Set)</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">Gelişmiş sporcular için uygun, yüksek toparlanma hızı gerektiren sınırdır.</p>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-xs text-slate-200 font-bold">Aşırı Yük / Dikkat (21+ Set)</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">Overtraining riski çok yüksek. Kasın kendini tamir etmesi zorlaşabilir.</p>
        </div>
      </div>

      {/* CORE VOLUME LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(muscleVolumes).map(([muscle, volumeVal]) => {
          const volume = volumeVal as any;
          const level = getVolumeLevel(volume.sets);
          const loadLabel = getLoadOptimalLabel(volume.sets);

          let barColor = 'bg-slate-600';
          let textColor = 'text-slate-400';
          let icon = <Info className="w-4 h-4 text-slate-400" />;

          if (level === 'optimal') {
            barColor = 'bg-emerald-500';
            textColor = 'text-emerald-400';
            icon = <CheckCircle className="w-4 h-4 text-emerald-400" />;
          } else if (level === 'maintenance') {
            barColor = 'bg-orange-500';
            textColor = 'text-orange-400';
            icon = <TrendingUp className="w-4 h-4 text-orange-400" />;
          } else if (level === 'overtrained') {
            barColor = 'bg-rose-500';
            textColor = 'text-rose-400';
            icon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
          }

          const percentage = Math.min(100, (volume.sets / 24) * 100);

          return (
            <div key={muscle} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm">{muscle}</h4>
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {icon}
                    <span className={textColor}>{volume.sets} Set ({loadLabel})</span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500">
                <span>Birincil egzersizler: {volume.primaryExercises} seans</span>
                <span>Yardımcı egzersizler: {volume.secondaryExercises} seans</span>
              </div>
            </div>
          );
        })}

        {Object.keys(muscleVolumes).length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 text-xs bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
            Son 7 günde tamamlanmış antrenman seti verisi bulunmuyor. Antrenmanlarınızı kaydettikçe kas grubu hacimleri burada analiz edilir.
          </div>
        )}
      </div>
    </div>
  );
}
