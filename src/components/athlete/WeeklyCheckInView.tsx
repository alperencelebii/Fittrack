import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/databaseService';
import { 
  ClipboardCheck, 
  Weight, 
  Moon, 
  Zap, 
  Smile, 
  Flame, 
  Droplet, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  History,
  Calendar,
  Save,
  Loader2
} from 'lucide-react';

interface WeeklyCheckInViewProps {
  userId: string;
  coachId?: string | null;
  onShowToast: (msg: string) => void;
}

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = now.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(now);
  monday.setDate(diffToMonday);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  
  return {
    weekStartDate: formatDate(monday),
    weekEndDate: formatDate(sunday)
  };
}

export default function WeeklyCheckInView({ userId, coachId, onShowToast }: WeeklyCheckInViewProps) {
  const [allCheckIns, setAllCheckIns] = useState<any[]>([]);
  const [existingCheckIn, setExistingCheckIn] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [sleepHours, setSleepHours] = useState<number | ''>('');
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [hungerLevel, setHungerLevel] = useState<number>(5);
  const [workoutCompliance, setWorkoutCompliance] = useState<number>(80);
  const [nutritionCompliance, setNutritionCompliance] = useState<number>(80);
  const [waterIntakeLiters, setWaterIntakeLiters] = useState<number>(2);
  const [sorenessLevel, setSorenessLevel] = useState<number>(5);
  const [painOrInjury, setPainOrInjury] = useState<string>('');
  const [mood, setMood] = useState<string>('İyi');
  const [note, setNote] = useState<string>('');

  const { weekStartDate, weekEndDate } = getCurrentWeekRange();

  useEffect(() => {
    if (!userId) return;

    const unsub = databaseService.listenWeeklyCheckInsForAthlete(userId, (list) => {
      setAllCheckIns(list);
      const current = list.find(c => c.weekStartDate === weekStartDate);
      
      if (current) {
        setExistingCheckIn(current);
        // Pre-fill form
        setWeightKg(current.weightKg || '');
        setSleepHours(current.sleepHours || '');
        setEnergyLevel(current.energyLevel || 5);
        setStressLevel(current.stressLevel || 5);
        setHungerLevel(current.hungerLevel || 5);
        setWorkoutCompliance(current.workoutCompliance || 80);
        setNutritionCompliance(current.nutritionCompliance || 80);
        setWaterIntakeLiters(current.waterIntakeLiters || 2);
        setSorenessLevel(current.sorenessLevel || 5);
        setPainOrInjury(current.painOrInjury || '');
        setMood(current.mood || 'İyi');
        setNote(current.note || '');
        setIsEditing(false);
      } else {
        setExistingCheckIn(null);
        setIsEditing(true);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [userId, weekStartDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (!weightKg || Number(weightKg) <= 0) {
      onShowToast('Lütfen geçerli bir ağırlık (kg) girin.');
      return;
    }
    if (!sleepHours || Number(sleepHours) < 0) {
      onShowToast('Lütfen uyku saati girin.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        coachId: coachId || null,
        weekStartDate,
        weekEndDate,
        weightKg: Number(weightKg),
        sleepHours: Number(sleepHours),
        energyLevel,
        stressLevel,
        hungerLevel,
        workoutCompliance,
        nutritionCompliance,
        waterIntakeLiters: Number(waterIntakeLiters),
        sorenessLevel,
        painOrInjury,
        mood,
        note,
        createdAt: existingCheckIn?.createdAt || new Date().toISOString()
      };

      await databaseService.submitWeeklyCheckIn(userId, payload);
      onShowToast('Haftalık check-in koçuna gönderildi.');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      onShowToast('Check-in gönderilirken bir sorun oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-xs font-semibold tracking-wider font-mono">Haftalık Raporlar Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-6 translate-x-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10 shrink-0">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Haftalık Check-in</h2>
            <p className="text-slate-400 text-xs mt-1 max-w-xl leading-relaxed">
              Bu haftaki durumunu koçunla paylaş. Ağırlık, uyku kalitesi, stres, antrenman ve beslenme uyumu gibi kritik verileri düzenli girerek koçunun gelişimini en iyi şekilde analiz etmesini sağla.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Check-in Form or Summary */}
        <div className="lg:col-span-2 space-y-6">
          {existingCheckIn && !isEditing ? (
            /* COMPLETED WEEKLY SUMMARY CARD */
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Tamamlandı
              </div>

              <div className="border-b border-slate-800/60 pb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Haftalık Rapor Dönemi</span>
                <h3 className="text-sm font-black text-white mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  {existingCheckIn.weekStartDate} / {existingCheckIn.weekEndDate}
                </h3>
              </div>

              {/* Grid Metrics display */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono block">Vücut Ağırlığı</span>
                  <span className="text-lg font-black text-white flex items-baseline gap-1 mt-1">
                    {existingCheckIn.weightKg} <span className="text-xs font-normal text-slate-500">kg</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono block">Ort. Uyku</span>
                  <span className="text-lg font-black text-white flex items-baseline gap-1 mt-1">
                    {existingCheckIn.sleepHours} <span className="text-xs font-normal text-slate-500">saat</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono block">Su Tüketimi</span>
                  <span className="text-lg font-black text-white flex items-baseline gap-1 mt-1">
                    {existingCheckIn.waterIntakeLiters} <span className="text-xs font-normal text-slate-500">lt</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono block">Ruh Hali / Enerji</span>
                  <span className="text-sm font-bold text-emerald-400 block mt-1">
                    {existingCheckIn.mood} <span className="text-xs text-slate-400 font-normal">({existingCheckIn.energyLevel}/10)</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono block">Stres / Açlık</span>
                  <span className="text-sm font-bold text-white block mt-1">
                    Stres: {existingCheckIn.stressLevel}/10 <br />
                    Açlık: {existingCheckIn.hungerLevel}/10
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono block">Kas Yorgunluğu</span>
                  <span className="text-sm font-bold text-amber-400 block mt-1">
                    {existingCheckIn.sorenessLevel}/10
                  </span>
                </div>
              </div>

              {/* Progress Compliance Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Antrenman Uyumu</span>
                    <span className="text-emerald-400">%{existingCheckIn.workoutCompliance}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${existingCheckIn.workoutCompliance}%` }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Beslenme Uyumu</span>
                    <span className="text-teal-400">%{existingCheckIn.nutritionCompliance}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${existingCheckIn.nutritionCompliance}%` }} />
                  </div>
                </div>
              </div>

              {/* Pain or Injuries */}
              {existingCheckIn.painOrInjury && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Ağrı veya Sakatlık Durumu:
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{existingCheckIn.painOrInjury}</p>
                </div>
              )}

              {/* Athlete Notes */}
              {existingCheckIn.note && (
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-400">Senin Haftalık Notun:</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed italic">"{existingCheckIn.note}"</p>
                </div>
              )}

              {/* Coach Feedback Section */}
              <div className="border-t border-slate-800/80 pt-5 space-y-3">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Koç Yorumu & Geri Bildirim
                </h4>
                {existingCheckIn.coachReply ? (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {existingCheckIn.coachReply}
                    </p>
                    {existingCheckIn.coachReplyAt && (
                      <span className="text-[10px] text-slate-500 block text-right font-mono mt-1">
                        Yanıtlandı: {new Date(existingCheckIn.coachReplyAt).toLocaleDateString('tr-TR')}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Koçunuz henüz bu haftaki check-in raporunuzu değerlendirmedi. Değerlendirince buraya notu yansıyacaktır.
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition"
                >
                  Raporu Güncelle
                </button>
              </div>
            </div>
          ) : (
            /* CHECK-IN SUBMISSION/EDIT FORM */
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white">Bu Haftaki Durumunu Gönder</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hafta Dönemi: {weekStartDate} / {weekEndDate}</p>
                </div>
                {existingCheckIn && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs font-bold text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Vazgeç
                  </button>
                )}
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Body Weight */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                    <Weight className="w-3.5 h-3.5 text-emerald-400" /> Güncel Ağırlık (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="75.5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition font-mono"
                  />
                </div>

                {/* Sleep Hours */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-blue-400" /> Ortalama Uyku (Saat) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="7.5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition font-mono"
                  />
                </div>

                {/* Energy Level Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Enerji Seviyesi (1-10)
                    </label>
                    <span className="text-xs font-bold text-amber-400">{energyLevel}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* Stress Level Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                      <ActivityIcon className="w-3.5 h-3.5 text-red-400" /> Stres Seviyesi (1-10)
                    </label>
                    <span className="text-xs font-bold text-red-400">{stressLevel}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* Hunger Level Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" /> Açlık Seviyesi (1-10)
                    </label>
                    <span className="text-xs font-bold text-orange-400">{hungerLevel}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={hungerLevel}
                    onChange={(e) => setHungerLevel(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* Soreness Level Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                      <ActivityIcon className="w-3.5 h-3.5 text-yellow-500" /> Kas Yorgunluğu / Ağrısı (1-10)
                    </label>
                    <span className="text-xs font-bold text-yellow-500">{sorenessLevel}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sorenessLevel}
                    onChange={(e) => setSorenessLevel(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* Workout Compliance Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs font-black text-slate-400">
                      Antrenman Uyum Oranı (%)
                    </label>
                    <span className="text-xs font-bold text-emerald-400">%{workoutCompliance}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={workoutCompliance}
                    onChange={(e) => setWorkoutCompliance(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* Nutrition Compliance Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs font-black text-slate-400">
                      Beslenme Uyum Oranı (%)
                    </label>
                    <span className="text-xs font-bold text-teal-400">%{nutritionCompliance}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={nutritionCompliance}
                    onChange={(e) => setNutritionCompliance(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* Water Intake */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-sky-400" /> Ortalama Su Tüketimi (Litre)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={waterIntakeLiters}
                    onChange={(e) => setWaterIntakeLiters(Number(e.target.value))}
                    placeholder="2.5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition font-mono"
                  />
                </div>

                {/* Mood Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-pink-400" /> Genel Ruh Hali
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="Mükemmel">Mükemmel - Harika hissediyorum</option>
                    <option value="İyi">İyi - İstikrarlı bir moddayım</option>
                    <option value="Normal">Normal - Rutin bir gün</option>
                    <option value="Yorgun">Yorgun - Bitkin veya uykusuz</option>
                    <option value="Kötü">Kötü - Motivasyonum çok düşük</option>
                  </select>
                </div>
              </div>

              {/* Pain or Injuries Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Ağrı veya Sakatlık Bildirimi (Opsiyonel)
                </label>
                <textarea
                  value={painOrInjury}
                  onChange={(e) => setPainOrInjury(e.target.value)}
                  placeholder="Eklem ağrıları, tendon zorlanması vb. özel bir durum varsa belirtin..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>

              {/* Athlete General Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400">
                  Koçuna İletmek İstediğin Genel Not
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Bu haftaya dair koçuna iletmek istediğin her türlü detay, antrenman hissi veya soru..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-800 text-slate-950 px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-400/10 cursor-pointer active:scale-95"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Check-in Gönder
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar: Past Check-ins History */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/60 pb-3">
              <History className="w-4 h-4 text-slate-400" /> Geçmiş Check-in'ler
            </h3>

            {allCheckIns.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">Bu haftaya kadar henüz check-in göndermediniz.</p>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
                {allCheckIns.map((ci) => (
                  <div 
                    key={ci.id}
                    className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2 hover:border-slate-750 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {ci.weekStartDate}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-bold">
                        {ci.weightKg} kg
                      </span>
                    </div>

                    <div className="flex gap-4 text-[10px] text-slate-500">
                      <span>Uyum: <span className="text-slate-300 font-bold">%{ci.workoutCompliance}</span></span>
                      <span>Mod: <span className="text-slate-300 font-bold">{ci.mood}</span></span>
                      <span>Enerji: <span className="text-slate-300 font-bold">{ci.energyLevel}/10</span></span>
                    </div>

                    {ci.coachReply && (
                      <div className="bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                        <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Koç Yanıtı:
                        </p>
                        <p className="text-[10px] text-slate-300 italic mt-0.5 line-clamp-2">"{ci.coachReply}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple internal icon component to prevent compile error in missing imports
function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
