import React, { useState, useMemo } from 'react';
import { TrainingCalendarEntry, GeneratedTrainingProgram } from '../../types';
import { databaseService } from '../../services/databaseService';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Dumbbell, 
  Trash2, 
  Coffee 
} from 'lucide-react';

interface TrainingCalendarProps {
  userId: string;
  entries: TrainingCalendarEntry[];
  activeProgram?: GeneratedTrainingProgram;
  onShowToast: (msg: string) => void;
}

export default function TrainingCalendar({
  userId,
  entries,
  activeProgram,
  onShowToast
}: TrainingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formSessionName, setFormSessionName] = useState('');
  const [formStatus, setFormStatus] = useState<'planned' | 'completed' | 'rest_day'>('planned');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const firstDayIndex = useMemo(() => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Align to Monday
  }, [year, month]);

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Auster', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const map: Record<string, TrainingCalendarEntry[]> = {};
    for (const e of entries) {
      if (!map[e.date]) {
        map[e.date] = [];
      }
      map[e.date].push(e);
    }
    return map;
  }, [entries]);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    if (!formSessionName && formStatus !== 'rest_day') {
      onShowToast('Lütfen antrenman adı girin.');
      return;
    }

    try {
      const entry: TrainingCalendarEntry = {
        id: Math.random().toString(36).substring(2, 9),
        userId,
        date: formDate,
        sessionName: formStatus === 'rest_day' ? 'Dinlenme Günü' : formSessionName,
        status: formStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await databaseService.saveTrainingCalendarEntry(entry);
      onShowToast('Takvim planı başarıyla eklendi! 🗓️');
      setIsAddOpen(false);
      setFormSessionName('');
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'Takvim kaydı oluşturulamadı.';
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

  const handleDeleteEntry = async (id: string) => {
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    try {
      await databaseService.deleteTrainingCalendarEntry(id);
      onShowToast('Takvim kaydı silindi.');
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'Takvim kaydı silinemedi.';
      if (!userId || userId.trim() === '') {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message && err.message.includes('kullanıcı oturumu bulunamadı')) {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      }
      onShowToast(msg);
    }
  };

  const handleAutoSchedule = async () => {
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    if (!activeProgram) {
      onShowToast('Takvim oluşturmak için önce aktif bir antrenman programı seçmelisiniz.');
      return;
    }

    try {
      const startDateStr = activeProgram.startDate || new Date().toISOString().split('T')[0];
      await databaseService.generateCalendarFromProgram(userId, activeProgram, startDateStr);
      onShowToast(`${activeProgram.durationWeeks || 8} haftalık antrenman planınız otomatik olarak takvime yerleştirildi! 🗓️⚡`);
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'Otomatik planlama başarısız oldu.';
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
    <div id="training-calendar" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Antrenman Takvimi</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">Gelecek seansları planlayın ve antrenman takibinizi görselleştirin.</p>
        </div>

        <div className="flex items-center gap-2">
          {activeProgram && (
            <button
              onClick={handleAutoSchedule}
              className="bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Dumbbell className="w-3.5 h-3.5" /> Haftalık Plan Oluştur
            </button>
          )}
          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Manuel Plan Ekle
          </button>
        </div>
      </div>

      {isAddOpen && (
        <form onSubmit={handleAddEntry} className="mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Tarih</label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Antrenman / Aktivite Adı</label>
            <input
              type="text"
              value={formSessionName}
              onChange={(e) => setFormSessionName(e.target.value)}
              placeholder="Örn: Göğüs & Biceps Günü"
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
              disabled={formStatus === 'rest_day'}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Durum</label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="planned">Planlandı</option>
              <option value="completed">Tamamlandı</option>
              <option value="rest_day">Dinlenme Günü</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all"
            >
              Ekle
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

      {/* MONTHLY CALENDAR GRID */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            {monthNames[month]} {year}
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400">
          <div>Pzt</div>
          <div>Sal</div>
          <div>Çar</div>
          <div>Per</div>
          <div>Cum</div>
          <div>Cmt</div>
          <div>Paz</div>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-24 bg-slate-900/10 rounded-xl" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayEntries = entriesByDate[dayStr] || [];

            return (
              <div
                key={`day-${dayNum}`}
                className="h-24 p-2 bg-slate-900/60 border border-slate-850 hover:border-slate-700 rounded-xl flex flex-col justify-between transition-all group relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{dayNum}</span>
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto max-h-[50px]">
                  {dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`text-[9px] px-1.5 py-0.5 rounded-md flex items-center justify-between gap-1 group/item ${
                        entry.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : entry.status === 'rest_day'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700/50'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      <span className="truncate font-medium max-w-[45px] sm:max-w-none flex items-center gap-1">
                        {entry.status === 'completed' ? (
                          <Check className="w-2.5 h-2.5 shrink-0" />
                        ) : entry.status === 'rest_day' ? (
                          <Coffee className="w-2.5 h-2.5 shrink-0" />
                        ) : (
                          <Dumbbell className="w-2.5 h-2.5 shrink-0" />
                        )}
                        {entry.sessionName}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntry(entry.id);
                        }}
                        className="opacity-0 group-hover/item:opacity-100 text-rose-400 hover:text-rose-300 transition-all"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
