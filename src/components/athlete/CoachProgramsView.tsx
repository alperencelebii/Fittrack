import React, { useState, useMemo } from 'react';
import { GeneratedTrainingProgram } from '../../types';
import { databaseService } from '../../services/databaseService';
import { 
  Dumbbell, 
  Calendar, 
  Check, 
  Eye, 
  EyeOff, 
  Clock, 
  Award, 
  MessageSquare, 
  User, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface CoachProgramsViewProps {
  userId: string;
  programs: GeneratedTrainingProgram[];
  onShowToast: (msg: string) => void;
}

export default function CoachProgramsView({ userId, programs, onShowToast }: CoachProgramsViewProps) {
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  // Filter coach assigned programs
  const coachPrograms = useMemo(() => {
    return programs.filter(p => 
      (p.assignedToUserId === userId || p.athleteId === userId || p.userId === userId) && 
      p.createdBy === 'coach'
    );
  }, [programs, userId]);

  const handleSetActive = async (id: string) => {
    if (!userId || userId.trim() === '') {
      onShowToast('Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    setActivatingId(id);
    try {
      await databaseService.setActiveTrainingProgram(userId, id);
      onShowToast('Program aktif hale getirildi.');
    } catch (error) {
      console.error('Koç programını aktif yapma hatası:', error);
      onShowToast('Program aktif yapılırken bir sorun oluştu.');
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div id="coach-programs-view" className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Koçumun Programları</h2>
              <p className="text-slate-400 text-xs mt-0.5">Koçunuz tarafından sizin için özel hazırlanmış antrenman programları.</p>
            </div>
          </div>
        </div>
      </div>

      {coachPrograms.length === 0 ? (
        <div className="p-16 text-center bg-slate-950/20 border border-dashed border-slate-850 rounded-2xl space-y-4 shadow-inner">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
            <Dumbbell className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-xs mx-auto">
            <h4 className="text-sm font-extrabold text-slate-200">Atanmış Program Bulunmuyor</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Koçunuz henüz sizin için yeni bir antrenman programı atamadı. İstediğinizde koçunuzla iletişime geçebilirsiniz.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {coachPrograms.map(p => {
            const isThisActive = p.isActive;
            const isExpanded = expandedProgramId === p.id;
            
            return (
              <div 
                key={p.id} 
                className={`border rounded-2xl p-5 transition-all ${
                  isThisActive 
                    ? 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                    : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold rounded-lg uppercase tracking-wider">
                        Koç Programı
                      </span>
                      {isThisActive && (
                        <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 stroke-[4]" /> AKTİF PROGRAM
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{p.name}</h3>
                    {p.coachNote && (
                      <div className="flex items-start gap-1.5 text-xs text-slate-450 bg-slate-950 p-2.5 border border-slate-900 rounded-xl italic">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                        <span>"{p.coachNote}"</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono font-bold block">
                      HAFTALIK: <strong className="text-slate-300">{p.weeklyDays || p.sessions?.length || 0} Gün</strong>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold block">
                      SÜRE: <strong className="text-slate-300">{p.durationWeeks || 8} Hafta</strong>
                    </span>
                  </div>
                </div>

                {/* Specs Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="bg-slate-900/40 p-2.5 border border-slate-850 rounded-xl">
                    <span className="text-[9px] text-slate-500 uppercase block tracking-wider font-bold">Hedef</span>
                    <span className="font-extrabold text-slate-300">{p.goal}</span>
                  </div>
                  <div className="bg-slate-900/40 p-2.5 border border-slate-850 rounded-xl">
                    <span className="text-[9px] text-slate-500 uppercase block tracking-wider font-bold">Seviye</span>
                    <span className="font-extrabold text-slate-300">{p.level}</span>
                  </div>
                  <div className="bg-slate-900/40 p-2.5 border border-slate-850 rounded-xl">
                    <span className="text-[9px] text-slate-500 uppercase block tracking-wider font-bold">Durum</span>
                    <span className="font-extrabold text-emerald-400">
                      {isThisActive ? 'Kullanımda' : 'Hazır / Beklemede'}
                    </span>
                  </div>
                  <div className="bg-slate-900/40 p-2.5 border border-slate-850 rounded-xl">
                    <span className="text-[9px] text-slate-500 uppercase block tracking-wider font-bold">Tasarımcı</span>
                    <span className="font-extrabold text-slate-300">Özel Koç Ataması</span>
                  </div>
                </div>

                {/* Expanded Session / Exercise Details */}
                {isExpanded && p.sessions && (
                  <div className="mt-5 pt-5 border-t border-slate-800 space-y-4 animate-fade-in">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-slate-900">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" /> PROGRAM GÜNLERİ VE SEANSLAR
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {p.sessions.map((s: any, sIdx: number) => (
                        <div key={sIdx} className="bg-slate-950 p-3.5 border border-slate-900 rounded-2xl space-y-2.5">
                          <div className="flex items-center justify-between border-b border-slate-900/80 pb-1.5">
                            <span className="text-xs font-bold text-white">{s.name || `${sIdx + 1}. Gün Antrenmanı`}</span>
                            <span className="text-[9px] font-black text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">
                              {s.exercises?.length || 0} Egzersiz
                            </span>
                          </div>

                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {s.exercises?.map((ex: any, eIdx: number) => (
                              <div key={eIdx} className="bg-slate-900/40 border border-slate-850 p-2.5 rounded-xl space-y-1.5">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="text-[11.5px] font-bold text-slate-200">{ex.name}</span>
                                  <span className="text-[8.5px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                                    Koç Ataması
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
                                  <div className="bg-slate-950/60 p-1.5 border border-slate-900 rounded-lg">
                                    <span className="text-[8px] text-slate-500 block uppercase font-bold">Sets</span>
                                    <span className="font-extrabold text-slate-300">{ex.sets} set</span>
                                  </div>
                                  <div className="bg-slate-950/60 p-1.5 border border-slate-900 rounded-lg">
                                    <span className="text-[8px] text-slate-500 block uppercase font-bold">Reps</span>
                                    <span className="font-extrabold text-slate-300">{ex.reps}</span>
                                  </div>
                                  <div className="bg-slate-950/60 p-1.5 border border-slate-900 rounded-lg">
                                    <span className="text-[8px] text-slate-500 block uppercase font-bold">Dinlenme</span>
                                    <span className="font-extrabold text-slate-300">{ex.restSeconds}s</span>
                                  </div>
                                </div>

                                {ex.rpe !== undefined && ex.rpe !== null && String(ex.rpe).trim() !== '' && (
                                  <div className="text-[10px] text-amber-450 font-bold px-1 py-0.5 bg-amber-500/5 rounded border border-amber-500/10 inline-block">
                                    Hedef Yoğunluk: RPE {ex.rpe}
                                  </div>
                                )}

                                {ex.notes && (
                                  <p className="text-[10px] text-slate-450 italic bg-slate-950/40 p-1.5 rounded border border-slate-900">
                                    Not: {ex.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="flex gap-3 mt-4 pt-3 border-t border-slate-900/60">
                  <button
                    onClick={() => setExpandedProgramId(isExpanded ? null : p.id)}
                    className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-[11px] rounded-xl transition cursor-pointer inline-flex items-center justify-center gap-1.5 select-none"
                  >
                    {isExpanded ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Detayları Kapat
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Detayları Gör
                      </>
                    )}
                  </button>
                  
                  {!isThisActive && (
                    <button
                      onClick={() => handleSetActive(p.id)}
                      disabled={activatingId !== null}
                      className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-black text-[11px] rounded-xl transition cursor-pointer inline-flex items-center justify-center gap-1.5 select-none"
                    >
                      {activatingId === p.id ? (
                        <>Aktif Yapılıyor...</>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif Yap
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
