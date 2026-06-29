import React, { useState, useMemo } from 'react';
import { RecoveryEntry, DeloadSuggestion, WorkoutSetEntry } from '../../types';
import { databaseService } from '../../services/databaseService';
import { calculateDailyReadinessScore } from '../../utils/readinessCalculations';
import { checkDeloadSuggestions } from '../../utils/progressiveOverloadCalculations';
import { 
  Heart, 
  Activity, 
  Plus, 
  AlertCircle, 
  Moon, 
  Zap, 
  Flame, 
  TrendingUp, 
  Smile 
} from 'lucide-react';

interface RecoveryTrackerProps {
  userId: string;
  recoveryLogs: RecoveryEntry[];
  workoutSets: WorkoutSetEntry[];
  deloadSuggestions: DeloadSuggestion[];
  onShowToast: (msg: string) => void;
}

export default function RecoveryTracker({
  userId,
  recoveryLogs,
  workoutSets,
  deloadSuggestions,
  onShowToast
}: RecoveryTrackerProps) {
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Form states
  const [sleepHours, setSleepHours] = useState<number>(8);
  const [sleepQuality, setSleepQuality] = useState<number>(7);
  const [fatigueLevel, setFatigueLevel] = useState<number>(4);
  const [muscleSoreness, setMuscleSoreness] = useState<number>(3);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [motivationLevel, setMotivationLevel] = useState<number>(8);
  const [notes, setNotes] = useState('');

  // Get today's log if any
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayLog = useMemo(() => {
    return recoveryLogs.find(r => r.date === todayStr);
  }, [recoveryLogs, todayStr]);

  // Calculate dynamic readiness result
  const readinessResult = useMemo(() => {
    return calculateDailyReadinessScore(todayLog);
  }, [todayLog]);

  const currentReadiness = readinessResult.score;
  const recommendationAdvice = readinessResult.recommendation;

  // Check for newly triggered deload recommendation based on logs and sets
  const activeDeloadAlert = useMemo(() => {
    return checkDeloadSuggestions(userId, recoveryLogs, workoutSets);
  }, [userId, recoveryLogs, workoutSets]);

  const pendingDeload = useMemo(() => {
    return deloadSuggestions.find(d => d.status === 'pending');
  }, [deloadSuggestions]);

  const activeDeloadRecord = useMemo(() => {
    return deloadSuggestions.find(d => {
      if (d.status !== 'accepted') return false;
      const today = new Date();
      const start = new Date(d.suggestedStartDate);
      const end = new Date(start);
      end.setDate(start.getDate() + (d.suggestedDurationDays || 7));
      return today >= start && today <= end;
    });
  }, [deloadSuggestions]);

  const handleAcceptDeload = async (id: string) => {
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    try {
      await databaseService.updateDeloadSuggestionStatus(id, 'accepted');
      onShowToast('Deload planı kabul edildi! 1 hafta boyunca antrenman ağırlık ve hacim hedefleriniz otomatik olarak düşürülecektir. 🛡️🧘');
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'Deload kabul edilirken hata oluştu.';
      if (!userId || userId.trim() === '') {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message && err.message.includes('kullanıcı oturumu bulunamadı')) {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      }
      onShowToast(msg);
    }
  };

  const handleRejectDeload = async (id: string) => {
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    try {
      await databaseService.updateDeloadSuggestionStatus(id, 'rejected');
      onShowToast('Deload önerisi reddedildi. Antrenman yoğunluğunu koruyorsunuz. Kendinizi aşırı zorlamamaya dikkat edin! ⚡');
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'Deload reddedilirken hata oluştu.';
      if (!userId || userId.trim() === '') {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message && err.message.includes('kullanıcı oturumu bulunamadı')) {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      }
      onShowToast(msg);
    }
  };

  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    try {
      const entry: RecoveryEntry = {
        id: `${userId}_${todayStr}`,
        userId,
        date: todayStr,
        sleepHours,
        sleepQuality,
        fatigueLevel,
        muscleSoreness,
        stressLevel,
        motivationLevel,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await databaseService.saveRecoveryEntry(entry);
      onShowToast('Günlük toparlanma durumunuz başarıyla kaydedildi! 🩺❤️');
      setIsLogOpen(false);

      // Check if a Deload Suggestion is triggered right after saving
      const triggeredDeload = checkDeloadSuggestions(userId, [entry, ...recoveryLogs], workoutSets);
      if (triggeredDeload) {
        await databaseService.saveDeloadSuggestion(triggeredDeload);
        onShowToast('Sistem tarafından yeni bir DELOAD (Hafifletme) haftası önerildi! ⚠️');
      }
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'Toparlanma verisi kaydedilemedi.';
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
    <div id="recovery-tracker" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Günlük Hazırlık & Toparlanma Analizi</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">Sürdürülebilir gelişim için uyku kalitesi, kas yorgunluğu ve motivasyon verilerinizi takip edin.</p>
        </div>

        {!todayLog && (
          <button
            onClick={() => setIsLogOpen(!isLogOpen)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-lg shadow-emerald-500/15"
          >
            <Plus className="w-4 h-4" /> Bugünün Durumunu Kaydet
          </button>
        )}
      </div>

      {isLogOpen && (
        <form onSubmit={handleSaveLog} className="mb-6 bg-slate-950 p-5 rounded-2xl border border-emerald-500/20 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Bugünün Durumunu Güncelleyin
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-slate-500" /> Uyku Süresi (Saat)
              </label>
              <input
                type="number"
                min="3"
                max="16"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Uyku Kalitesi (1 - 10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
              />
              <span className="text-[10px] text-slate-500 text-right block font-mono mt-1">{sleepQuality}/10</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Yorgunluk Seviyesi (1 - 10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={fatigueLevel}
                onChange={(e) => setFatigueLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
              />
              <span className="text-[10px] text-slate-500 text-right block font-mono mt-1">{fatigueLevel}/10</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Kas Ağrısı (Soreness) (1 - 10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={muscleSoreness}
                onChange={(e) => setMuscleSoreness(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
              />
              <span className="text-[10px] text-slate-500 text-right block font-mono mt-1">{muscleSoreness}/10</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> Stres Seviyesi (1 - 10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
              />
              <span className="text-[10px] text-slate-500 text-right block font-mono mt-1">{stressLevel}/10</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-yellow-500" /> Antrenman Motivasyonu (1 - 10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={motivationLevel}
                onChange={(e) => setMotivationLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
              />
              <span className="text-[10px] text-slate-500 text-right block font-mono mt-1">{motivationLevel}/10</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Hissiyat Notları (Opsiyonel)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Omuzlarımda hafif ağrı var ama genel enerjim yüksek."
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setIsLogOpen(false)}
              className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-4 py-1.5 rounded-lg text-xs"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-1.5 rounded-lg text-xs"
            >
              Durumu Kaydet
            </button>
          </div>
        </form>
      )}

      {/* READINESS VISUALIZER & RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Günlük Hazırlık Skoru (Readiness)</span>
          
          <div className="relative w-36 h-36 flex items-center justify-center mt-4">
            {/* Simple circular background effect */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow opacity-20" />
            
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white font-mono">{currentReadiness}%</span>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-wider">
                {currentReadiness >= 85 ? 'SÜPER' : currentReadiness >= 70 ? 'İYİ' : currentReadiness >= 50 ? 'ORTA' : 'YORGUN'}
              </span>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 max-w-xs leading-relaxed">
            {recommendationAdvice}
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Toparlanma ve Deload Bilgisi
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Yoğun antrenman dönemlerinde kaslar, tendonlar ve merkezi sinir sistemi aşırı yorulur. 
              Sistemimiz yorgunluğunuzun biriktiğini ve PR hızınızın duraksadığını algıladığında, 
              sizi aşırı antrenmandan (overtraining) korumak için hafifletilmiş bir haftalık **Deload** önerisi sunar.
            </p>

            {/* Deload status block */}
            {activeDeloadRecord ? (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
                <Smile className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AKTİF DELOAD EVRESİ (HAFTASI)</h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Deload planını kabul ettiniz. Vücudunuzun toparlanması için antrenman yoğunlukları %15 ve hacimler %40 azaltılmıştır. Bu sürede eklemleriniz ve kaslarınız güçlenecektir.
                  </p>
                </div>
              </div>
            ) : pendingDeload ? (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-3">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">DELOAD ÖNERİLİYOR</h4>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Sistemimiz son verileriniz doğrultusunda bir hafifletme (Deload) haftası yapmanızı şiddetle tavsiye ediyor:
                    </p>
                    {pendingDeload.reason && Array.isArray(pendingDeload.reason) && (
                      <ul className="text-[10px] text-slate-400 mt-2 list-disc pl-4 flex flex-col gap-1">
                        {pendingDeload.reason.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-end border-t border-slate-800/40 pt-3">
                  <button
                    type="button"
                    onClick={() => handleRejectDeload(pendingDeload.id)}
                    className="px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded-lg hover:text-white"
                  >
                    Reddet
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcceptDeload(pendingDeload.id)}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded-lg shadow-sm"
                  >
                    Kabul Et ve Başlat
                  </button>
                </div>
              </div>
            ) : activeDeloadAlert ? (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">DELOAD SEVİYESİ ALGILANDI</h4>
                  <p className="text-[11px] text-slate-300 mt-1 font-semibold text-emerald-400">
                    Mevcut durumunuz deload kriterlerine ulaştı! Yarınki antrenmanda hafif toparlanma hedefleri uygulanacaktır.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-850 flex items-center gap-3">
                <Heart className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-300">Merkezi Sinir Sistemi Dengede</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Yorgunluk ve toparlanma değerleriniz normal sınırlar içinde. Yoğun antrenmanlara güvenle devam edebilirsiniz.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-6 text-xs text-slate-400">
            <span>Bugün veri girişi yapıldı mı:</span>
            <span className={`font-bold uppercase ${todayLog ? 'text-emerald-400' : 'text-rose-400'}`}>
              {todayLog ? 'EVET' : 'HAYIR'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
