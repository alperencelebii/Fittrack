import React, { useState, useMemo } from 'react';
import { PersonalRecord, WorkoutSetEntry, DeloadSuggestion } from '../../types';
import { databaseService } from '../../services/databaseService';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { calculateEstimated1RM } from '../../utils/prCalculations';
import { getProgressiveOverloadSuggestions } from '../../utils/progressiveOverloadCalculations';
import { 
  Award, 
  TrendingUp, 
  Plus, 
  Search, 
  Trash2, 
  ChevronRight, 
  Activity, 
  Dumbbell,
  Sparkles,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface PRTrackerProps {
  userId: string;
  personalRecords: PersonalRecord[];
  workoutSets?: WorkoutSetEntry[];
  deloadSuggestions?: DeloadSuggestion[];
  onShowToast: (msg: string) => void;
}

export default function PRTracker({
  userId,
  personalRecords,
  workoutSets = [],
  deloadSuggestions = [],
  onShowToast
}: PRTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [exerciseId, setExerciseId] = useState('');
  const [recordType, setRecordType] = useState<'max_weight' | 'max_reps' | 'estimated_1rm' | 'max_volume'>('max_weight');
  const [recordValue, setRecordValue] = useState<number>(0);
  const [recordDate, setRecordDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const filteredRecords = useMemo(() => {
    return personalRecords.filter(p => 
      p.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [personalRecords, searchTerm]);

  // Group records to show the absolute BEST for each exercise
  const bestRecordsByExercise = useMemo(() => {
    const map: Record<string, PersonalRecord> = {};
    for (const r of personalRecords) {
      const existing = map[r.exerciseId];
      if (!existing || r.value > existing.value) {
        map[r.exerciseId] = r;
      }
    }
    return Object.values(map);
  }, [personalRecords]);

  // Active accepted deload check
  const activeDeload = useMemo(() => {
    return deloadSuggestions.find(d => {
      if (d.status !== 'accepted') return false;
      const today = new Date();
      const start = new Date(d.suggestedStartDate);
      const end = new Date(start);
      end.setDate(start.getDate() + (d.suggestedDurationDays || 7));
      return today >= start && today <= end;
    });
  }, [deloadSuggestions]);

  // Calculate overload suggestions
  const rawSuggestions = useMemo(() => {
    return getProgressiveOverloadSuggestions(workoutSets);
  }, [workoutSets]);

  // Adjust suggestions based on deload suggestions
  const overloadSuggestions = useMemo(() => {
    if (!activeDeload) return rawSuggestions;

    return rawSuggestions.map(s => {
      const reduction = 1 - (activeDeload.intensityReductionPercent || 15) / 100;
      const adjustedWeight = Math.round((s.suggestedWeight * reduction) * 4) / 4;
      const adjustedReps = Math.max(6, Math.round(s.suggestedReps * (1 - (activeDeload.volumeReductionPercent || 40) / 100)));

      return {
        ...s,
        suggestedWeight: adjustedWeight,
        suggestedReps: adjustedReps,
        reason: `[Deload Uygulandı - Toparlanma Modu] ${s.reason} (Ağırlık -%${activeDeload.intensityReductionPercent || 15}, tekrar hacmi azaltıldı.)`
      };
    });
  }, [rawSuggestions, activeDeload]);

  const handleAddPR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    if (!exerciseId || recordValue <= 0) {
      onShowToast('Lütfen geçerli bir egzersiz ve değer girin.');
      return;
    }

    const selectedEx = EXERCISE_LIBRARY.find(ex => ex.id === exerciseId);
    if (!selectedEx) return;

    try {
      const record: PersonalRecord = {
        id: Math.random().toString(36).substring(2, 9),
        userId,
        exerciseId,
        exerciseName: selectedEx.name,
        recordType,
        value: recordValue,
        date: recordDate,
        notes,
        createdAt: new Date().toISOString()
      };

      await databaseService.savePersonalRecord(record);
      onShowToast(`Tebrikler! Yeni PR kaydedildi: ${selectedEx.name} ${recordValue} ${recordType === 'max_reps' ? 'Tekrar' : 'kg'} 🏆`);
      setIsAddOpen(false);
      setRecordValue(0);
      setNotes('');
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'PR kaydı eklenirken hata oluştu.';
      if (!userId || userId.trim() === '') {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message && err.message.includes('kullanıcı oturumu bulunamadı')) {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message) {
        msg = err.message;
      }
      onShowToast(msg);
    }
  };

  return (
    <div id="pr-tracker" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Kişisel Rekorlar (PR) ve Güç Takibi</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">Egzersizlerdeki maksimum ağırlık ve tahmini tek tekrar (1RM) gücünüzü takip edin.</p>
        </div>

        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/15"
        >
          <Plus className="w-4 h-4" /> Manuel PR Güncelle
        </button>
      </div>

      {/* ACTIVE DELOAD ALERT */}
      {activeDeload && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wide">Aktif Deload Evresi Tespit Edildi</span>
            <p className="text-[11px] text-slate-300 mt-1">
              Toparlanma verileriniz doğrultusunda aktif deload planı uygulanmaktadır. Aşağıdaki Progressive Overload önerileri, eklem ve sinir sisteminizin dinlenmesini sağlamak amacıyla otomatik olarak **-%{activeDeload.intensityReductionPercent || 15} ağırlık ve azaltılmış set hacmi** ile revize edilmiştir.
            </p>
          </div>
        </div>
      )}

      {/* PR FORM */}
      {isAddOpen && (
        <form onSubmit={handleAddPR} className="bg-slate-950 p-5 rounded-xl border border-amber-500/20 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-xs text-slate-400 block mb-1 font-medium">Egzersiz</label>
            <select
              value={exerciseId}
              onChange={(e) => setExerciseId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              required
            >
              <option value="">Egzersiz Seçin...</option>
              {EXERCISE_LIBRARY.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name} ({ex.primaryMuscles[0]})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Rekor Tipi</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="max_weight">Maks Ağırlık (kg)</option>
              <option value="max_reps">Maks Tekrar (Reps)</option>
              <option value="estimated_1rm">Tahmini 1RM (kg)</option>
              <option value="max_volume">Maksimum Hacim (kg)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Değer ({recordType === 'max_reps' ? 'Tekrar' : 'kg'})</label>
            <input
              type="number"
              value={recordValue || ''}
              onChange={(e) => setRecordValue(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Tarih</label>
            <input
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-slate-400 block mb-1 font-medium">Notlar (Opsiyonel)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Partner desteği olmadan temiz formla yapıldı."
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition-all"
            >
              PR Ekle
            </button>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="bg-slate-900 border border-slate-800 text-slate-400 px-3 py-2 rounded-lg text-xs hover:text-white"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {/* QUICK INSIGHTS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Kırılan Toplam PR</span>
            <span className="text-lg font-extrabold text-slate-200">{personalRecords.length} adet</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Maksimum Güç Gelişimi</span>
            <span className="text-lg font-extrabold text-slate-200">
              {bestRecordsByExercise.length > 0 ? `${bestRecordsByExercise.length} Egzersiz` : 'Analiz Yok'}
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Egzersiz Takibi</span>
            <span className="text-lg font-extrabold text-slate-200">
              {workoutSets.length > 0 ? `${workoutSets.length} Kayıt` : 'Hazır'}
            </span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN CONTENT: PR LIST & OVERLOAD SUGGESTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PR LIST */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Tarihsel Rekorlarım
            </h3>
            <span className="text-[10px] text-slate-500 font-bold">Filtrelenmiş: {filteredRecords.length} PR</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl max-w-md">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Egzersiz rekorlarında ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-300 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="pb-3">Egzersiz</th>
                  <th className="pb-3 text-right">Rekor Değeri</th>
                  <th className="pb-3 text-center">Tip</th>
                  <th className="pb-3 text-right">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-900/30 transition-all">
                    <td className="py-3 font-semibold text-slate-200 flex items-center gap-2">
                      <Dumbbell className="w-3.5 h-3.5 text-indigo-400" />
                      {record.exerciseName}
                    </td>
                    <td className="py-3 font-extrabold text-amber-400 text-right">
                      {record.value} {record.recordType === 'max_reps' ? 'Tekrar' : 'kg'}
                    </td>
                    <td className="py-3 text-center">
                      <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md text-[10px] text-slate-400">
                        {record.recordType === 'max_weight' && 'Maks Ağırlık'}
                        {record.recordType === 'max_reps' && 'Maks Tekrar'}
                        {record.recordType === 'estimated_1rm' && 'Tahmini 1RM'}
                        {record.recordType === 'max_volume' && 'Maks Hacim'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-500">{record.date}</td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">
                      PR hesaplamak için önce set kaydı ekleyin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: PROGRESSIVE OVERLOAD SUGGESTIONS */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Yapay Zekâ Güç ve Aşırı Yükleme Önerileri (Progressive Overload)
          </h3>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {overloadSuggestions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-xl">
                Analiz için yeterli antrenman kaydı bulunmuyor.
              </div>
            ) : (
              overloadSuggestions.map((s) => (
                <div key={s.id} className="p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <Dumbbell className="w-4 h-4 text-indigo-400" />
                      {s.exerciseName}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider ${
                      s.suggestionType === 'increase_weight' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      s.suggestionType === 'increase_reps' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {s.suggestionType === 'increase_weight' && 'Ağırlık Artır'}
                      {s.suggestionType === 'increase_reps' && 'Tekrar Artır'}
                      {s.suggestionType === 'technique_focus' && 'Forma Odaklan'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg">
                      <span className="text-[10px] text-slate-500 block">Önceki En İyi</span>
                      <span className="text-xs font-black text-slate-300">
                        {s.currentWeight} kg x {s.currentReps} tekrar
                      </span>
                    </div>

                    <div className="bg-slate-950 p-2 border border-indigo-500/25 rounded-lg shadow-sm shadow-indigo-500/5">
                      <span className="text-[10px] text-indigo-400 font-extrabold block">Önerilen Hedef</span>
                      <span className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        {s.suggestedWeight} kg x {s.suggestedReps} tekrar
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850/50 leading-relaxed">
                    {s.reason}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
