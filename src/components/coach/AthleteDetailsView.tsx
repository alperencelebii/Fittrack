/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useMemo } from 'react';
import { databaseService, normalizeExerciseSets } from '../../services/databaseService';
import { 
  Workout, 
  WeightEntry, 
  BodyMeasurement, 
  MealEntry, 
  WaterEntry 
} from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from 'recharts';
import {
  ChevronLeft,
  Sparkles,
  Scale,
  Dumbbell,
  Apple,
  Droplet,
  Ruler,
  TrendingDown,
  MessageSquare,
  Target,
  Plus,
  Trash,
  CheckCircle,
  Clock,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface AthleteDetailsViewProps {
  athleteId: string;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export default function AthleteDetailsView({ athleteId, onBack, onShowToast }: AthleteDetailsViewProps) {
  const { userProfile: coachProfile } = useAuth();
  const [athleteDoc, setAthleteDoc] = useState<any | null>(null);
  
  // Athlete Data Logs State
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  
  // Coach specific records
  const [notes, setNotes] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  
  // UI Controllers
  const [activeTab, setActiveTab] = useState<'summary' | 'workouts' | 'nutrition' | 'measurements'>('summary');
  const [loading, setLoading] = useState(true);

  // Forms
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteBody, setNewNoteBody] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalType, setNewGoalType] = useState('Kilo');
  const [newGoalVal, setNewGoalVal] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [goalSubmitting, setGoalSubmitting] = useState(false);

  // Synchronize all items on Snapshot listeners
  useEffect(() => {
    if (!athleteId) return;

    // Loading athlete profile first
    const loadProfile = async () => {
      try {
        const doc = await databaseService.getUserProfile(athleteId);
        setAthleteDoc(doc);
      } catch (err) {
        console.error("Athlete profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();

    // 1. Listen workouts
    const unsubWorkouts = databaseService.listenWorkouts(athleteId, (list) => {
      setWorkouts(list);
    }, (err) => {
      console.warn("Could not load athlete workouts in details:", err);
    });

    // 2. Listen weights
    const unsubWeight = databaseService.listenWeightEntries(athleteId, (list) => {
      setWeightEntries(list);
    }, (err) => {
      console.warn("Could not load athlete weights in details:", err);
    });

    // 3. Listen dimensions
    const unsubMeasurements = databaseService.listenBodyMeasurements(athleteId, (list) => {
      setBodyMeasurements(list);
    }, (err) => {
      console.warn("Could not load athlete body measurements in details:", err);
    });

    // 4. Listen meals
    const unsubMeals = databaseService.listenMealEntries(athleteId, (list) => {
      setMeals(list);
    }, (err) => {
      console.warn("Could not load athlete nutrition logs in details:", err);
    });

    // 5. Listen water
    const unsubWater = databaseService.listenWaterEntries(athleteId, (list) => {
      setWaterEntries(list);
    }, (err) => {
      console.warn("Could not load athlete water logs in details:", err);
    });

    // 6. Listen Coach notes
    const unsubNotes = databaseService.listenCoachNotes(athleteId, (list) => {
      setNotes(list);
    }, (err) => {
      console.warn("Could not load coach notes in details:", err);
    });

    // 7. Listen Coach goals
    const unsubGoals = databaseService.listenCoachGoals(athleteId, (list) => {
      setGoals(list);
    }, (err) => {
      console.warn("Could not load coach goals in details:", err);
    });

    return () => {
      unsubWorkouts();
      unsubWeight();
      unsubMeasurements();
      unsubMeals();
      unsubWater();
      unsubNotes();
      unsubGoals();
    };
  }, [athleteId]);

  // Helper Metrics calculations
  const totalCalBurned = useMemo(() => {
    return workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  }, [workouts]);

  const avgWorkoutDuration = useMemo(() => {
    if (workouts.length === 0) return 0;
    return Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length);
  }, [workouts]);

  // Chart parsers
  const weightChartData = useMemo(() => {
    const list = [...weightEntries].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return list.map(item => ({
      date: item.date.substring(5),
      Kilo: item.weight
    }));
  }, [weightEntries]);

  const caloriesChartData = useMemo(() => {
    const dailyKcal: { [key: string]: number } = {};
    meals.forEach(m => {
      dailyKcal[m.date] = (dailyKcal[m.date] || 0) + m.calories;
    });
    return Object.keys(dailyKcal).sort().map(date => ({
      date: date.substring(5),
      Kalori: dailyKcal[date]
    }));
  }, [meals]);

  // Add coach note action
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteBody.trim()) return;
    if (!coachProfile?.id) return;

    setNoteSubmitting(true);
    const id = `cn_${Math.random().toString(36).substring(2, 9)}`;
    const noteObj = {
      id,
      coachId: coachProfile.id,
      athleteId,
      title: newNoteTitle.trim(),
      note: newNoteBody.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await databaseService.saveCoachNote(noteObj);
      onShowToast('Not sporcuya başarıyla eklendi!');
      setNewNoteTitle('');
      setNewNoteBody('');
    } catch (err) {
      console.error(err);
      onShowToast('Not ekleme esnasında hata oluştu.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  // Delete coach note
  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Bu notu silmek istediğinize emin misiniz?')) return;
    try {
      await databaseService.deleteCoachNote(id);
      onShowToast('Not silindi.');
    } catch (err) {
      console.error(err);
      onShowToast('Not silinirken hata oluştu.');
    }
  };

  // Add coach goal
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    if (!coachProfile?.id) return;

    setGoalSubmitting(true);
    const id = `cg_${Math.random().toString(36).substring(2, 9)}`;
    const goalObj = {
      id,
      coachId: coachProfile.id,
      athleteId,
      goalType: newGoalType,
      title: newGoalTitle.trim(),
      description: newGoalDesc.trim(),
      targetValue: newGoalVal.trim(),
      deadline: newGoalDeadline,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    try {
      await databaseService.saveCoachGoal(goalObj);
      onShowToast('Hedef sporcuya atandı!');
      setNewGoalTitle('');
      setNewGoalVal('');
      setNewGoalDesc('');
      setNewGoalDeadline('');
    } catch (err) {
      console.error(err);
      onShowToast('Hedef atanırken bir hata oluştu.');
    } finally {
      setGoalSubmitting(false);
    }
  };

  // Delete goal
  const handleDeleteGoal = async (id: string) => {
    if (!window.confirm('Bu hedefi iptal etmek/silmek istediğinize emin misiniz?')) return;
    try {
      await databaseService.deleteCoachGoal(id);
      onShowToast('Hedef silindi.');
    } catch (err) {
      console.error(err);
      onShowToast('Hedef silinirken hata oluştu.');
    }
  };

  // Cycle Goal Status
  const handleToggleGoalStatus = async (id: string, currentStatus: any) => {
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      await databaseService.updateCoachGoalStatus(id, nextStatus);
      onShowToast('Hedef durumu güncellendi.');
    } catch (err) {
      console.error(err);
    }
  };

  if (!athleteId) {
    return (
      <div className="h-96 flex flex-col justify-center items-center gap-4 text-center max-w-sm mx-auto p-6 bg-slate-900 border border-slate-805 rounded-2xl">
        <AlertCircle className="w-12 h-12 text-rose-500 animate-pulse" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Sporcu Kimliği Eksik</h3>
          <p className="text-xs text-slate-400">Görüntülemek istediğiniz sporcu bilgisine ulaşılamadı. Lütfen sporcu listesinden yeniden seçim yapın.</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Sporculara Geri Dön
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <span className="text-xs">Sporcu verileri senkronize ediliyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* Header with Back Navigate */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-xl transition cursor-pointer active:scale-95 text-slate-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">{athleteDoc?.name || 'Sporcu'} Detay Profili</h2>
          <span className="text-[10px] text-slate-500 block font-medium">Öğrencinizin tüm fiziksel, beslenme ve spor kayıtlarını inceleyin.</span>
        </div>
      </div>

      {/* Profil Mini Bento */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Boy & Mevcut Ağırlık</span>
          <span className="text-sm font-black text-slate-200">
            {athleteDoc?.height || '—'} cm / {athleteDoc?.currentWeight || '—'} kg
          </span>
        </div>

        <div>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Hedef Ağırlık</span>
          <span className="text-sm font-black text-emerald-400">
            {athleteDoc?.targetWeight || '—'} kg
          </span>
        </div>

        <div>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Hedef Kalori / Su</span>
          <span className="text-sm font-black text-slate-200">
            {athleteDoc?.dailyCalorieGoal || '—'} kcal / {athleteDoc?.dailyWaterGoal || '—'} ml
          </span>
        </div>

        <div>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">E-posta</span>
          <span className="text-xs font-semibold text-slate-400 truncate block">
            {athleteDoc?.email || '—'}
          </span>
        </div>
      </div>

      {/* Dynamic Tabs Navigation */}
      <div className="flex border-b border-slate-850 gap-2 overflow-x-auto pb-px">
        {[
          { id: 'summary', name: 'Gözlem & Öneri', icon: Sparkles },
          { id: 'workouts', name: 'Antrenman Günlüğü', icon: Dumbbell },
          { id: 'nutrition', name: 'Beslenme & Su', icon: Apple },
          { id: 'measurements', name: 'Vücut Ölçüleri', icon: Ruler },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
                active 
                  ? 'border-emerald-500 text-emerald-400' 
                  : 'border-transparent text-slate-450 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: GÖZLEM & ÖNERİ (SUMMARY, CHARTS, ADD GOALS/NOTES) */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          
          {/* Charts section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Kilo analizi */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-850">
                <Scale className="w-4 h-4 text-blue-400" /> Kilo Seans Grafiği
              </h4>
              {weightChartData.length === 0 ? (
                <div className="h-44 bg-slate-950/40 border border-dashed border-slate-850 rounded-xl flex items-center justify-center text-xs text-slate-500">
                  Kayıtlı kilo verisi yok.
                </div>
              ) : (
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weightChartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="cW" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} domain={['dataMin - 1', 'dataMax + 1']} />
                      <ChartTooltip />
                      <Area type="monotone" dataKey="Kilo" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#cW)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Kalori Analizi */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-850">
                <Apple className="w-4 h-4 text-teal-400" /> Kalori Tüketim Eğrisi
              </h4>
              {caloriesChartData.length === 0 ? (
                <div className="h-44 bg-slate-950/40 border border-dashed border-slate-850 rounded-xl flex items-center justify-center text-xs text-slate-500">
                  Kayıtlı beslenme verisi yok.
                </div>
              ) : (
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={caloriesChartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="cC" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} />
                      <ChartTooltip />
                      <Area type="monotone" dataKey="Kalori" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#cC)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>

          {/* Coach notes & active goals listing and creation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT: COACH NOTES SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" /> Koç Önerileri & Notları
                </h4>
              </div>

              {/* Form to add note */}
              <form onSubmit={handleAddNote} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Başlık</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Günlük Kardiyo Önerisi"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Öneri / Mesaj</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Göğüs günü sonrasına 15 dk eğimli yürüyüş ekleyelim..."
                    value={newNoteBody}
                    onChange={(e) => setNewNoteBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={noteSubmitting}
                  className="w-full py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg transition inline-flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {noteSubmitting ? 'Kaydediliyor...' : 'Yeni Tavsiye İlet'}
                </button>
              </form>

              {/* Notes list */}
              {notes.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic">Sporcu için henüz yazılmış koç notu bulunmamakta.</p>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notes.map(note => (
                    <div key={note.id} className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl space-y-1 flex justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-medium block">
                          {new Date(note.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                        <h5 className="text-xs font-bold text-white">{note.title}</h5>
                        <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">{note.note}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-850 transition cursor-pointer self-start"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: COACH ASSIGNED GOALS SECTION */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> Sporcu Hedef & Görevleri
              </h4>

              {/* Form to assign goals */}
              <form onSubmit={handleAddGoal} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Hedef Alıcı</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: 10 Bin Adım Çıtası"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Kategori</label>
                    <select
                      value={newGoalType}
                      onChange={(e) => setNewGoalType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Kilo">Kilo Hedefi</option>
                      <option value="Su">Su Tüketimi</option>
                      <option value="Kalori">Beslenme / Kalori</option>
                      <option value="Antrenman">Antrenman Görevi</option>
                      <option value="Kardiyo">Kardiyo Seansı</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Ölçü Değeri (kg/ml/adet)</label>
                    <input
                      type="text"
                      placeholder="Örn: 74 kg"
                      value={newGoalVal}
                      onChange={(e) => setNewGoalVal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Son Tarih</label>
                    <input
                      type="date"
                      value={newGoalDeadline}
                      onChange={(e) => setNewGoalDeadline(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Ekstra Açıklama</label>
                  <input
                    type="text"
                    placeholder="Örn: Hafta sonuna kadar her gün tamamlanmalı..."
                    value={newGoalDesc}
                    onChange={(e) => setNewGoalDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={goalSubmitting}
                  className="w-full py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg transition inline-flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {goalSubmitting ? 'Kaydediliyor...' : 'Hedefi Kilitle & Ata'}
                </button>
              </form>

              {/* Goals list */}
              {goals.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic">Sporcuya atanmış herhangi bir aktif hedef yok.</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {goals.map(goal => {
                    const completed = goal.status === 'completed';
                    return (
                      <div 
                        key={goal.id} 
                        className={`p-3.5 border rounded-xl flex items-center justify-between gap-3 transition ${
                          completed 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-slate-900 border-slate-850'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-950 px-1.5 py-0.5 rounded text-slate-400">
                              {goal.goalType}
                            </span>
                            {goal.deadline && (
                              <span className="text-[9px] text-slate-500 font-medium">Süre: {goal.deadline}</span>
                            )}
                          </div>
                          <h5 className={`text-xs font-bold ${completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {goal.title}
                          </h5>
                          {goal.targetValue && (
                            <p className="text-[10px] text-emerald-450 font-semibold">Hedef Değer: {goal.targetValue}</p>
                          )}
                          {goal.description && (
                            <p className="text-[11px] text-slate-400">{goal.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleGoalStatus(goal.id, goal.status)}
                            className={`p-1.5 rounded transition cursor-pointer ${
                              completed 
                                ? 'bg-emerald-400/20 text-emerald-400' 
                                : 'bg-slate-850 text-slate-400 hover:text-white'
                            }`}
                            title={completed ? 'Yapılmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-850 transition cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT 2: WORKOUTS */}
      {activeTab === 'workouts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Antrenman Listeleri ({workouts.length} Seans)</h3>
            <span className="text-[10px] text-slate-400">Ortalama süre: {avgWorkoutDuration} dk / Toplam Yakım: {totalCalBurned} kcal</span>
          </div>

          {workouts.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-dashed border-slate-850 rounded-xl text-xs text-slate-500">
              Sporcu henüz hiçbir antrenman kaydı eklememiş.
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map(w => (
                <div key={w.id} className="p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-extrabold rounded text-[9px] uppercase tracking-wider">
                          {w.type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{w.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1">{w.name}</h4>
                    </div>

                    <div className="text-right text-[10px] font-bold text-slate-300">
                      <span>{w.duration} dk</span>
                      <span className="text-slate-500 mx-1">•</span>
                      <span className="text-orange-400">{w.caloriesBurned} kcal</span>
                    </div>
                  </div>

                  {w.notes && (
                    <p className="text-[11px] text-slate-400 bg-slate-950 p-2 border border-slate-850 rounded-lg italic">
                      " {w.notes} "
                    </p>
                  )}

                  {/* Exercises Details */}
                  {w.exercises && w.exercises.length > 0 && (
                    <div className="space-y-1.5 pl-2 border-l-2 border-slate-800">
                      <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest block">Egzersizler:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {w.exercises.map((ex, idx) => {
                          const normalizedSets = normalizeExerciseSets(ex);
                          const totalSetsCount = normalizedSets.length;
                          const firstSet = normalizedSets[0] || { reps: 0, weight: 0 };
                          return (
                            <div key={ex.id || idx} className="p-1.5 bg-slate-950 rounded border border-slate-850/50">
                              <span className="font-bold text-slate-200 block">{ex.name}</span>
                              <span className="text-[10px] text-emerald-400 font-bold">
                                {totalSetsCount} set {firstSet.reps > 0 ? `x ${firstSet.reps} tekrar` : ''} {firstSet.weight > 0 ? `/ ${firstSet.weight} kg` : ''} {ex.notes && <span className="text-slate-400 font-normal">({ex.notes})</span>}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: MEALS & DIET */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          
          {/* Summary values */}
          <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl text-xs space-y-1 flex items-center justify-between gap-6 flex-wrap">
            <div>
              <span className="text-slate-450 font-bold block uppercase tracking-wider text-[9px]">GÜNLÜK SU TÜKETİM ORTALAMASI</span>
              <span className="text-sm font-black text-blue-400">{waterEntries.length > 0 ? (waterEntries.reduce((sum,w)=>sum+w.amountMl,0)/waterEntries.length).toFixed(0) : '—'} ml</span>
            </div>

            <div className="text-right">
              <span className="text-slate-450 font-bold block uppercase tracking-wider text-[9px]">SON GİRİLEN DIET GIDASI</span>
              <p className="font-extrabold text-slate-200">{meals[0]?.foodName || '—'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Öğün & Yemek Girişleri</h3>

            {meals.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-6 text-center">Herhangi bir besin kaydı bulunamadı.</p>
            ) : (
              <div className="space-y-2.5">
                {meals.map(m => (
                  <div key={m.id} className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-orange-400/10 text-orange-400 text-[9px] font-extrabold rounded">
                          {m.mealType}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{m.date}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-450">{m.calories} kcal</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold text-white">{m.foodName}</h4>
                      {m.notes && <p className="text-[10.5px] text-slate-500 font-medium italic mt-0.5">"{m.notes}"</p>}
                    </div>

                    {/* Macros info */}
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div className="bg-slate-950 p-1.5 rounded text-center">
                        <span className="text-slate-550 block">Proteins</span>
                        <span className="text-slate-300 font-bold">{m.protein}g</span>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded text-center">
                        <span className="text-slate-550 block">Carbs</span>
                        <span className="text-slate-300 font-bold">{m.carbs}g</span>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded text-center">
                        <span className="text-slate-550 block">Fats</span>
                        <span className="text-slate-300 font-bold">{m.fat}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: BODY MEASUREMENTS */}
      {activeTab === 'measurements' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Vücut Ölçüm Kayıtları</h3>

          {bodyMeasurements.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-6 text-center">Kayıtlı ölçüm verisi bulunmamakta.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bodyMeasurements.map(m => (
                <div key={m.id} className="p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-purple-400">{m.date} Ölçümü</span>
                    {m.bodyFat && (
                      <span className="px-1.5 py-0.5 bg-purple-500/15 border border-purple-500/10 text-purple-400 text-[10px] font-bold rounded">
                        Yağ Oranı: {m.bodyFat}%
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="p-1.5 bg-slate-950 rounded">
                      <span className="text-slate-500 block">Bel</span>
                      <span className="text-slate-200 font-black">{m.waist || '—'} cm</span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded">
                      <span className="text-slate-500 block">Göğüs</span>
                      <span className="text-slate-200 font-black">{m.chest || '—'} cm</span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded">
                      <span className="text-slate-500 block">Omuz</span>
                      <span className="text-slate-200 font-black">{m.shoulder || '—'} cm</span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded">
                      <span className="text-slate-500 block">Kol</span>
                      <span className="text-slate-200 font-black">{m.arm || '—'} cm</span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded">
                      <span className="text-slate-500 block">Boyun</span>
                      <span className="text-slate-200 font-black">{m.neck || '—'} cm</span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded">
                      <span className="text-slate-500 block">Kalça</span>
                      <span className="text-slate-200 font-black">{m.hip || '—'} cm</span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded">
                      <span className="text-slate-500 block">Bacak</span>
                      <span className="text-slate-200 font-black">{m.leg || '—'} cm</span>
                    </div>
                  </div>

                  {m.notes && (
                    <p className="text-[10px] text-slate-400 p-2 bg-slate-950/60 rounded italic leading-normal font-normal">
                      Notes: {m.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
