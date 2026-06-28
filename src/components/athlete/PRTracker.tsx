import React, { useState, useMemo } from 'react';
import { PersonalRecord, WorkoutSetEntry } from '../../types';
import { databaseService } from '../../services/databaseService';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { 
  Award, 
  TrendingUp, 
  Plus, 
  Search, 
  Trash2, 
  ChevronRight, 
  Activity, 
  Dumbbell 
} from 'lucide-react';

interface PRTrackerProps {
  userId: string;
  personalRecords: PersonalRecord[];
  onShowToast: (msg: string) => void;
}

export default function PRTracker({
  userId,
  personalRecords,
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

  const handleAddPR = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err) {
      console.error(err);
      onShowToast('PR kaydı eklenirken hata oluştu.');
    }
  };

  return (
    <div id="pr-tracker" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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

      {isAddOpen && (
        <form onSubmit={handleAddPR} className="mb-6 bg-slate-950 p-5 rounded-xl border border-amber-500/20 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <span className="text-xs text-slate-500 block">En Sık Çalışılan Kas</span>
            <span className="text-lg font-extrabold text-slate-200">Göğüs / Sırt</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND RECORDS LIST */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-5">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl mb-4 max-w-md">
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
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="pb-3">Egzersiz</th>
                <th className="pb-3">Rekor Değeri</th>
                <th className="pb-3">Tip</th>
                <th className="pb-3">Tarih</th>
                <th className="pb-3">Notlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-900/30 transition-all">
                  <td className="py-3 font-semibold text-slate-200 flex items-center gap-2">
                    <Dumbbell className="w-3.5 h-3.5 text-indigo-400" />
                    {record.exerciseName}
                  </td>
                  <td className="py-3 font-extrabold text-amber-400">
                    {record.value} {record.recordType === 'max_reps' ? 'Tekrar' : 'kg'}
                  </td>
                  <td className="py-3">
                    <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md text-[10px] text-slate-400">
                      {record.recordType === 'max_weight' && 'Maks Agirlik'}
                      {record.recordType === 'max_reps' && 'Maks Tekrar'}
                      {record.recordType === 'estimated_1rm' && 'Tahmini 1RM'}
                      {record.recordType === 'max_volume' && 'Maks Hacim'}
                    </span>
                  </td>
                  <td className="py-3">{record.date}</td>
                  <td className="py-3 italic text-slate-500 max-w-[150px] truncate" title={record.notes}>
                    {record.notes || '-'}
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    Egzersiz rekor kaydı bulunmuyor. Yeni bir PR ekleyerek başlayın!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
