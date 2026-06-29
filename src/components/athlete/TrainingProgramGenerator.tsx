import React, { useState, useMemo } from 'react';
import { GeneratedTrainingProgram, ProgramWorkoutSession, UserSettings } from '../../types';
import { databaseService } from '../../services/databaseService';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { generateProgramWithFallback } from '../../utils/trainingProgramGenerator';
import { 
  Sparkles, 
  Dumbbell, 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  ChevronRight, 
  Eye, 
  Clock, 
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

interface TrainingProgramGeneratorProps {
  userId: string;
  userSettings?: UserSettings;
  programs: GeneratedTrainingProgram[];
  onShowToast: (msg: string) => void;
}

export default function TrainingProgramGenerator({
  userId,
  userSettings,
  programs,
  onShowToast
}: TrainingProgramGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-program' | 'history'>('my-program');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Generation parameters
  const [goal, setGoal] = useState<'muscle_gain' | 'fat_loss' | 'strength' | 'endurance'>('muscle_gain');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [frequency, setFrequency] = useState<number>(3);
  const [split, setSplit] = useState<'full_body' | 'upper_lower' | 'ppl' | 'bro_split'>('full_body');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('gym');

  // Detail view
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(null);

  const activeProgram = useMemo(() => {
    return programs.find(p => p.isActive);
  }, [programs]);

  const displayedProgram = useMemo(() => {
    if (selectedProgramId) {
      return programs.find(p => p.id === selectedProgramId);
    }
    return activeProgram || programs[0];
  }, [selectedProgramId, activeProgram, programs]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      if (!userId || userId.trim() === '') {
        throw new Error('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      }

      const newProgram = await generateProgramWithFallback({
        userId,
        goal,
        experience,
        frequency,
        split,
        equipment: [selectedEquipment],
        priorityMuscles: []
      }, userId);

      await databaseService.saveGeneratedTrainingProgram(newProgram);
      await databaseService.setActiveTrainingProgram(userId, newProgram.id);

      setSelectedProgramId(newProgram.id);
      setActiveTab('my-program');
      onShowToast('Yeni Antrenman Programınız Başarıyla Oluşturuldu! ⚡');
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'Program oluşturulurken hata yaşandı.';
      if (!userId || userId.trim() === '') {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message && err.message.includes('kullanıcı oturumu bulunamadı')) {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message) {
        msg = err.message;
      }
      onShowToast(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetActive = async (id: string) => {
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    try {
      await databaseService.setActiveTrainingProgram(userId, id);
      onShowToast('Seçilen program aktif hale getirildi! 🚀');
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'Program aktif hale getirilemedi.';
      if (!userId || userId.trim() === '') {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message && err.message.includes('kullanıcı oturumu bulunamadı')) {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      }
      onShowToast(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    if (confirm('Bu programı silmek istediğinize emin misiniz?')) {
      try {
        await databaseService.deleteGeneratedTrainingProgram(id);
        if (selectedProgramId === id) {
          setSelectedProgramId(null);
        }
        onShowToast('Program silindi.');
      } catch (err: any) {
        console.error('AI Antrenman/Gelişim gerçek hata:', err);
        let msg = 'Program silinemedi.';
        if (!userId || userId.trim() === '') {
          msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
        } else if (err.message && err.message.includes('kullanıcı oturumu bulunamadı')) {
          msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
        }
        onShowToast(msg);
      }
    }
  };

  return (
    <div id="training-program-generator" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">AI Akıllı Antrenman Programı</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">Hedeflerinize ve spor geçmişinize göre kişiselleştirilmiş rutinler oluşturun.</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => { setActiveTab('my-program'); setSelectedProgramId(null); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my-program' ? 'bg-emerald-400 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Aktif Programım
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-emerald-400 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tüm Programlarım ({programs.length})
          </button>
        </div>
      </div>

      {activeTab === 'my-program' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Generator Parameters / Stepper Controls */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-5">
              {/* Step indicator header */}
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  ADIM {currentStep} / 5
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {currentStep === 1 && 'Hedefinizi Seçin'}
                  {currentStep === 2 && 'Seviyenizi Belirleyin'}
                  {currentStep === 3 && 'Haftalık Gün Sayısı'}
                  {currentStep === 4 && 'Ekipman Tercihleri'}
                  {currentStep === 5 && 'Antrenman Şablonu (Split)'}
                </span>
              </div>

              {/* Step Progress Dots */}
              <div className="flex gap-1.5 justify-start">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step === currentStep 
                        ? 'w-8 bg-emerald-400' 
                        : step < currentStep 
                        ? 'w-3 bg-emerald-600/40' 
                        : 'w-3 bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {/* STEP 1: GOAL */}
              {currentStep === 1 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { id: 'muscle_gain', title: 'Kas Kazanımı / Hipertrofi', desc: 'Kas kütlesini ve hacmini artırmaya yönelik yoğun set çalışmaları.' },
                      { id: 'fat_loss', title: 'Yağ Yakımı / Kondisyon', desc: 'Kalp ritmini yüksek tutarak yağ yakımını hızlandıran yoğun rutinler.' },
                      { id: 'strength', title: 'Güç Artışı (Powerlifting)', desc: 'Bileşik egzersizlerde maksimum güç ve ağırlık kaldırma kapasitesi.' },
                      { id: 'endurance', title: 'Dayanıklılık & Mobilite', desc: 'Kas kondisyonu, eklem sağlığı ve esnekliği ön planda tutan egzersizler.' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGoal(item.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          goal === item.id 
                            ? 'bg-emerald-500/5 border-emerald-400 shadow-sm' 
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          {goal === item.id && <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px]"><Check className="w-3 h-3" /></div>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: EXPERIENCE LEVEL */}
              {currentStep === 2 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { id: 'beginner', title: 'Başlangıç Seviyesi', desc: 'Temel hareket formları, düşük yoğunluklu setler ve eklem adaptasyonu.' },
                      { id: 'intermediate', title: 'Orta Seviye', desc: 'İlerleyen yükleme prensipleri, artan hacim ve kas grubu ayrımı.' },
                      { id: 'advanced', title: 'İleri Seviye', desc: 'Yüksek yoğunluklu teknikler, kişiselleştirilmiş zayıf bölge çalışmaları.' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setExperience(item.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          experience === item.id 
                            ? 'bg-emerald-500/5 border-emerald-400 shadow-sm' 
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          {experience === item.id && <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px]"><Check className="w-3 h-3" /></div>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: WEEKLY DAYS */}
              {currentStep === 3 && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">Haftada kaç gün aktif antrenman yapmak istediğinizi seçin. Seçiminize göre split yapısı otomatik ayarlanabilir.</p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { days: 2, label: 'Haftada 2 Gün', desc: 'Zamanı kısıtlı olanlar için tam vücut (Full Body) adaptasyonu.' },
                      { days: 3, label: 'Haftada 3 Gün', desc: 'Kas gelişimi için en ideal ve popüler gün sayısı.' },
                      { days: 4, label: 'Haftada 4 Gün', desc: 'Yüksek toparlanma süresi sunan Üst/Alt vücut ayrımı.' },
                      { days: 5, label: 'Haftada 5 Gün', desc: 'Profesyoneller için bölgesel ve hedef odaklı programlama.' }
                    ].map((item) => (
                      <button
                        key={item.days}
                        type="button"
                        onClick={() => {
                          setFrequency(item.days);
                          if (item.days <= 3) setSplit('full_body');
                          else if (item.days === 4) setSplit('upper_lower');
                          else setSplit('ppl');
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          frequency === item.days 
                            ? 'bg-emerald-500/5 border-emerald-400 shadow-sm' 
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{item.label}</h4>
                          {frequency === item.days && <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px]"><Check className="w-3 h-3" /></div>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: EQUIPMENT */}
              {currentStep === 4 && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">Antrenmanları yapacağınız ortamdaki ekipman durumunu seçin:</p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { id: 'bodyweight', title: 'Vücut Ağırlığı', desc: 'Hiçbir ekipmana ihtiyaç duymayan calisthenics hareketleri.' },
                      { id: 'home', title: 'Ev / Hafif Ekipman', desc: 'Direnç bandı ve hafif dambıllarla ev ortamı egzersizleri.' },
                      { id: 'gym', title: 'Tam Donanımlı Salon', desc: 'Barbell, makine ve serbest ağırlıkların tamamını kullanın.' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedEquipment(item.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedEquipment === item.id 
                            ? 'bg-emerald-500/5 border-emerald-400 shadow-sm' 
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          {selectedEquipment === item.id && <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px]"><Check className="w-3 h-3" /></div>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: SPLIT TEMPLATE */}
              {currentStep === 5 && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">Kas gruplarının haftalık dağılım şablonu tercihiniz:</p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { id: 'full_body', title: 'Tüm Vücut (Full Body)', desc: 'Her antrenmanda tüm ana kas gruplarını uyarır. Toparlanması çok dengelidir.' },
                      { id: 'upper_lower', title: 'Üst / Alt Vücut Ayrımı', desc: 'Bir gün sadece üst, bir gün sadece alt vücut çalışarak yoğunluğu böler.' },
                      { id: 'ppl', title: 'İtiş / Çekiş / Bacak (PPL)', desc: 'İtiş kasları, çekiş kasları ve bacak olarak 3 ana faza bölen profesyonel rutin.' },
                      { id: 'bro_split', title: 'Bölgesel (Bro Split)', desc: 'Her antrenmanda tek veya en fazla iki kas grubunu yoğun şekilde hedefler.' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSplit(item.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          split === item.id 
                            ? 'bg-emerald-500/5 border-emerald-400 shadow-sm' 
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          {split === item.id && <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px]"><Check className="w-3 h-3" /></div>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step navigation actions */}
            <div className="pt-5 border-t border-slate-850 mt-5 space-y-2">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Geri
                  </button>
                )}
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="flex-1 bg-emerald-400 hover:bg-emerald-300 text-slate-950 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    İleri <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black py-2.5 rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating ? 'AI Oluşturuyor...' : 'Yeni Program Hazırla'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Active Program display */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {displayedProgram ? (
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-white">{displayedProgram.name}</h4>
                      {displayedProgram.isActive && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                          Aktif Program
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-emerald-400" /> {displayedProgram.difficulty}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-400" /> Haftada {displayedProgram.daysPerWeek} Gün</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> Hedef: {displayedProgram.goal}</span>
                    </div>
                  </div>

                  {!displayedProgram.isActive && (
                    <button
                      onClick={() => handleSetActive(displayedProgram.id)}
                      className="bg-emerald-400/15 text-emerald-400 hover:bg-emerald-400 hover:text-slate-950 border border-emerald-500/30 font-bold px-4 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Aktif Program Yap
                    </button>
                  )}
                </div>

                {/* Day-by-day expandable lists */}
                <div className="flex flex-col gap-3">
                  {displayedProgram.sessions.map((session, dayIdx) => {
                    const isExpanded = expandedDayIdx === dayIdx;
                    return (
                      <div key={dayIdx} className="border border-slate-800/60 rounded-xl overflow-hidden bg-slate-950/80">
                        <button
                          onClick={() => setExpandedDayIdx(isExpanded ? null : dayIdx)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/40 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                              {dayIdx + 1}
                            </div>
                            <div>
                              <h5 className="font-semibold text-slate-200 text-sm">{session.name}</h5>
                              <p className="text-slate-400 text-xs mt-0.5">{session.exercises.length} Egzersiz Planı</p>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-800/60 p-4 bg-slate-950/20 flex flex-col gap-3">
                            {session.exercises.map((ex, exIdx) => (
                              <div key={exIdx} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-900/40 border border-slate-850">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-bold font-mono">#{exIdx + 1}</span>
                                    <h6 className="font-semibold text-slate-200 text-sm">{ex.name}</h6>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1">
                                    <span className="font-bold text-emerald-400">{ex.sets} Set</span> x {ex.reps} tekrar | <span className="text-slate-500">Hedef RPE:</span> {ex.rpe || 8}
                                  </p>
                                  {ex.notes && <p className="text-[11px] text-slate-500 italic mt-0.5">Not: {ex.notes}</p>}
                                </div>
                                <div className="text-right text-xs text-slate-500 font-mono">
                                  Süre: ~{ex.restSeconds || 90} sn Dinlenme
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl text-center">
                <Sparkles className="w-12 h-12 text-emerald-500/40 mb-3" />
                <h4 className="text-slate-200 font-bold mb-1">Henüz Aktif Antrenman Programı Yok</h4>
                <p className="text-slate-400 text-xs max-w-sm">Sol taraftaki ayarları belirleyerek kendinize yapay zeka destekli profesyonel bir program oluşturun.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((prog) => (
            <div key={prog.id} className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-white text-sm line-clamp-1">{prog.name}</h4>
                  {prog.isActive && (
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Aktif
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-xs text-slate-400 mb-4">
                  <span>🎯 Hedef: {prog.goal}</span>
                  <span>⚡ Tecrübe: {prog.difficulty}</span>
                  <span>🗓️ Haftada {prog.daysPerWeek} Gün</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 gap-2">
                <button
                  onClick={() => { setSelectedProgramId(prog.id); setActiveTab('my-program'); }}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> İncele
                </button>
                <div className="flex items-center gap-2">
                  {!prog.isActive && (
                    <button
                      onClick={() => handleSetActive(prog.id)}
                      className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Aktif Et
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(prog.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-all cursor-pointer"
                    title="Programı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {programs.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400 text-sm">
              Henüz kayıt yok. İlk kaydınızı ekleyerek takibe başlayın.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
