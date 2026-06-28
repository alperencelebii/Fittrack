import React, { useState, useMemo } from 'react';
import { GeneratedTrainingProgram, ProgramWorkoutSession, UserSettings } from '../../types';
import { databaseService } from '../../services/databaseService';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
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

  // Generation parameters
  const [goal, setGoal] = useState<'muscle_gain' | 'fat_loss' | 'strength' | 'endurance'>('muscle_gain');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [frequency, setFrequency] = useState<number>(3);
  const [split, setSplit] = useState<'full_body' | 'upper_lower' | 'ppl' | 'bro_split'>('full_body');

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
      // Pick exercises depending on target splits and categories
      const sessions: ProgramWorkoutSession[] = [];
      const days = frequency;

      for (let day = 1; day <= days; day++) {
        const sessionExercises: any[] = [];
        let sessionName = `Gün ${day}`;

        if (split === 'full_body') {
          sessionName = `Gelişim Günü ${day} (Tüm Vücut)`;
          // Squat/Leg, Chest, Back, Shoulders, Arms, Core
          const quadEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Quads')) || EXERCISE_LIBRARY[0];
          const chestEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Göğüs')) || EXERCISE_LIBRARY[2];
          const backEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Sırt')) || EXERCISE_LIBRARY[5];
          const shoulderEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Omuz')) || EXERCISE_LIBRARY[8];
          const armEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Biceps') || e.primaryMuscles.includes('Triceps')) || EXERCISE_LIBRARY[12];
          const coreEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Karın')) || EXERCISE_LIBRARY[15];

          [quadEx, chestEx, backEx, shoulderEx, armEx, coreEx].forEach((ex, index) => {
            if (ex) {
              sessionExercises.push({
                exerciseId: ex.id,
                name: ex.name,
                sets: goal === 'strength' ? 4 : 3,
                reps: goal === 'strength' ? '5-6' : goal === 'fat_loss' ? '12-15' : '8-12',
                rpe: goal === 'strength' ? 9 : 8,
                restSeconds: goal === 'strength' ? 180 : 90,
                order: index + 1,
                notes: index === 0 ? 'Bileşik ana hareket, nizami formda yapın.' : 'Tempolu ve kontrollü negatif tekrar.'
              });
            }
          });
        } else if (split === 'upper_lower') {
          const isUpper = day % 2 === 1;
          sessionName = isUpper ? `Üst Vücut (A)` : `Alt Vücut & Karın (B)`;

          if (isUpper) {
            const chestEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Göğüs')) || EXERCISE_LIBRARY[2];
            const backEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Sırt')) || EXERCISE_LIBRARY[5];
            const shoulderEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Omuz')) || EXERCISE_LIBRARY[8];
            const bicepEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Biceps')) || EXERCISE_LIBRARY[12];
            const tricepEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Triceps')) || EXERCISE_LIBRARY[13];

            [chestEx, backEx, shoulderEx, bicepEx, tricepEx].forEach((ex, index) => {
              if (ex) {
                sessionExercises.push({
                  exerciseId: ex.id,
                  name: ex.name,
                  sets: 4,
                  reps: goal === 'strength' ? '6-8' : '8-12',
                  rpe: 8,
                  restSeconds: 90,
                  order: index + 1,
                  notes: 'Sıkıştırma noktalarında 1 sn bekleyin.'
                });
              }
            });
          } else {
            const quadEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Quads')) || EXERCISE_LIBRARY[0];
            const hamstringEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Hamstrings')) || EXERCISE_LIBRARY[1];
            const calfEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Calves')) || EXERCISE_LIBRARY[11];
            const absEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Karın')) || EXERCISE_LIBRARY[15];

            [quadEx, hamstringEx, calfEx, absEx].forEach((ex, index) => {
              if (ex) {
                sessionExercises.push({
                  exerciseId: ex.id,
                  name: ex.name,
                  sets: 4,
                  reps: '10-15',
                  rpe: 8,
                  restSeconds: 90,
                  order: index + 1,
                  notes: 'Kalçayı ve omurgayı stabil tutun.'
                });
              }
            });
          }
        } else {
          // Bro Split or PPL presets
          sessionName = `Antrenman Günü ${day}`;
          // Standard full-body fallback for other splits to guarantee great exercises
          const mainChest = EXERCISE_LIBRARY.filter(e => e.primaryMuscles.includes('Göğüs'))[day % 3] || EXERCISE_LIBRARY[2];
          const mainBack = EXERCISE_LIBRARY.filter(e => e.primaryMuscles.includes('Sırt'))[day % 3] || EXERCISE_LIBRARY[5];
          const mainLegs = EXERCISE_LIBRARY.filter(e => e.primaryMuscles.includes('Quads') || e.primaryMuscles.includes('Hamstrings'))[day % 3] || EXERCISE_LIBRARY[0];

          [mainLegs, mainChest, mainBack].forEach((ex, index) => {
            if (ex) {
              sessionExercises.push({
                exerciseId: ex.id,
                name: ex.name,
                sets: 4,
                reps: '8-12',
                rpe: 8,
                restSeconds: 90,
                order: index + 1,
                notes: 'Ağırlık artışı için kendinizi zorlayın.'
              });
            }
          });
        }

        sessions.push({
          dayNumber: day,
          name: sessionName,
          exercises: sessionExercises,
          isCompleted: false
        });
      }

      const splitLabels: Record<string, string> = {
        full_body: 'Tüm Vücut (Full Body)',
        upper_lower: 'Üst / Alt (Upper / Lower)',
        ppl: 'İtiş / Çekiş / Bacak (PPL)',
        bro_split: 'Bölgesel (Bro Split)'
      };

      const goalLabels: Record<string, string> = {
        muscle_gain: 'Kas Kazanımı & Hipertrofi',
        fat_loss: 'Yağ Yakımı & Kondisyon',
        strength: 'Saf Güç Gelişimi',
        endurance: 'Dayanıklılık & Sağlık'
      };

      const levelLabels: Record<string, string> = {
        beginner: 'Başlangıç',
        intermediate: 'Orta Seviye',
        advanced: 'İleri Seviye'
      };

      const programName = `AI ${goalLabels[goal]} Programı (${splitLabels[split]})`;

      const newProgram: GeneratedTrainingProgram = {
        id: Math.random().toString(36).substring(2, 9),
        userId,
        name: programName,
        goal: goalLabels[goal],
        level: experience,
        weeklyDays: frequency,
        durationWeeks: 8,
        equipment: [],
        priorityMuscles: [],
        restrictions: [],
        days: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        difficulty: levelLabels[experience],
        daysPerWeek: frequency,
        sessions,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await databaseService.saveGeneratedTrainingProgram(newProgram);
      await databaseService.setActiveTrainingProgram(userId, newProgram.id);

      setSelectedProgramId(newProgram.id);
      setActiveTab('my-program');
      onShowToast('Yeni AI Antrenman Programınız Başarıyla Oluşturuldu! ⚡');
    } catch (err) {
      console.error(err);
      onShowToast('Program oluşturulurken hata yaşandı.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await databaseService.setActiveTrainingProgram(userId, id);
      onShowToast('Seçilen program aktif hale getirildi! 🚀');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu programı silmek istediğinize emin misiniz?')) {
      try {
        await databaseService.deleteGeneratedTrainingProgram(id);
        if (selectedProgramId === id) {
          setSelectedProgramId(null);
        }
        onShowToast('Program silindi.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div id="training-program-generator" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">AI Akıllı Antrenman Programı</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">Hedeflerinize ve spor geçmişinize göre kişiselleştirilmiş rutinler oluşturun.</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => { setActiveTab('my-program'); setSelectedProgramId(null); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'my-program' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Aktif Programım
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tüm Programlarım ({programs.length})
          </button>
        </div>
      </div>

      {activeTab === 'my-program' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Generator Parameters / Controls */}
          <div className="lg:col-span-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-indigo-400" /> Parametreleri Belirleyin
              </h3>

              {/* Goal Selection */}
              <div className="mb-4">
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Hedefiniz</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="muscle_gain">Kas Kazanımı / Hipertrofi</option>
                  <option value="fat_loss">Yağ Yakımı / Kondisyon</option>
                  <option value="strength">Güç Artışı (Powerlifting)</option>
                  <option value="endurance">Dayanıklılık & Mobilite</option>
                </select>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Spor Tecrübeniz</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperience(lvl)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        experience === lvl
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {lvl === 'beginner' ? 'Başlangıç' : lvl === 'intermediate' ? 'Orta' : 'İleri'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly workouts count */}
              <div className="mb-4">
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Haftalık Gün Sayısı</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setFrequency(d);
                        if (d <= 3) setSplit('full_body');
                        else if (d === 4) setSplit('upper_lower');
                        else setSplit('ppl');
                      }}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        frequency === d
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {d} Gün
                    </button>
                  ))}
                </div>
              </div>

              {/* Split selection */}
              <div className="mb-4">
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Antrenman Şablonu (Split)</label>
                <select
                  value={split}
                  onChange={(e) => setSplit(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="full_body">Tüm Vücut (Full Body) - Dengeli hacim dağılımı</option>
                  <option value="upper_lower">Üst / Alt (Upper Lower) - İleri düzey toparlanma</option>
                  <option value="ppl">Push / Pull / Legs (İtiş, Çekiş, Bacak)</option>
                  <option value="bro_split">Bölgesel (Bro Split) - Tek kas odaklı</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? 'AI Oluşturuyor...' : 'Yeni Program Hazırla'}
            </button>
          </div>

          {/* RIGHT: Active Program display */}
          <div className="lg:col-span-8 flex flex-col gap-4">
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
                      <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-indigo-400" /> {displayedProgram.difficulty}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> Haftada {displayedProgram.daysPerWeek} Gün</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-400" /> Hedef: {displayedProgram.goal}</span>
                    </div>
                  </div>

                  {!displayedProgram.isActive && (
                    <button
                      onClick={() => handleSetActive(displayedProgram.id)}
                      className="bg-indigo-600/15 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 font-semibold px-4 py-1.5 rounded-xl text-xs transition-all"
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
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/40 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-900/30 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
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
                                    <span className="font-semibold text-indigo-400">{ex.sets} Set</span> x {ex.reps} tekrar | <span className="text-slate-500">Hedef RPE:</span> {ex.rpe || 8}
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
                <Sparkles className="w-12 h-12 text-indigo-500/40 mb-3" />
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
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 transition-all flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> İncele
                </button>
                <div className="flex items-center gap-2">
                  {!prog.isActive && (
                    <button
                      onClick={() => handleSetActive(prog.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    >
                      Aktif Et
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(prog.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-all"
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
              Kayıtlı herhangi bir antrenman programınız bulunmuyor.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
