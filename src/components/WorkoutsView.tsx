/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Workout, WorkoutType, WorkoutDifficulty, Exercise } from '../types';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Trash2,
  Edit2,
  X,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface WorkoutsViewProps {
  workouts: Workout[];
  onSaveWorkouts: (workouts: Workout[]) => void;
  onShowToast: (msg: string) => void;
  quickActionTriggered: boolean;
  onClearQuickActionTrigger: () => void;
}

const WORKOUT_TYPES: WorkoutType[] = [
  'Göğüs',
  'Sırt',
  'Omuz',
  'Kol',
  'Bacak',
  'Kardiyo',
  'Full Body',
  'Karın',
  'Diğer',
];

const DIFFICULTIES: WorkoutDifficulty[] = ['Kolay', 'Orta', 'Zor'];

export default function WorkoutsView({
  workouts,
  onSaveWorkouts,
  onShowToast,
  quickActionTriggered,
  onClearQuickActionTrigger,
}: WorkoutsViewProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  
  // New Workout Form Fields
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState<WorkoutType>('Full Body');
  const [formDuration, setFormDuration] = useState('45');
  const [formCalories, setFormCalories] = useState('300');
  const [formDifficulty, setFormDifficulty] = useState<WorkoutDifficulty>('Orta');
  const [formNotes, setFormNotes] = useState('');
  
  // Exercises inside the current form
  const [formExercises, setFormExercises] = useState<Exercise[]>([]);

  // Individual Exercise Form state
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState('3');
  const [exReps, setExReps] = useState('10');
  const [exWeight, setExWeight] = useState('20');
  const [exRest, setExRest] = useState('60');
  const [exNotes, setExNotes] = useState('');
  const [exError, setExError] = useState('');

  // Auto trigger modal if quick action was called from dashboard
  React.useEffect(() => {
    if (quickActionTriggered) {
      handleOpenNewModal();
      onClearQuickActionTrigger();
    }
  }, [quickActionTriggered]);

  const handleOpenNewModal = () => {
    setEditingWorkout(null);
    setFormName('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormType('Full Body');
    setFormDuration('45');
    setFormCalories('300');
    setFormDifficulty('Orta');
    setFormNotes('');
    setFormExercises([]);
    clearExerciseInputs();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (w: Workout, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingWorkout(w);
    setFormName(w.name);
    setFormDate(w.date);
    setFormType(w.type);
    setFormDuration(String(w.duration));
    setFormCalories(String(w.caloriesBurned));
    setFormDifficulty(w.difficulty);
    setFormNotes(w.notes || '');
    setFormExercises([...w.exercises]);
    clearExerciseInputs();
    setIsModalOpen(true);
  };

  const clearExerciseInputs = () => {
    setExName('');
    setExSets('3');
    setExReps('10');
    setExWeight('0');
    setExRest('60');
    setExNotes('');
    setExError('');
  };

  const handleAddExerciseToWorkout = () => {
    if (!exName.trim()) {
      setExError('Egzersiz adı boş bırakılamaz.');
      return;
    }

    const setsNum = parseInt(exSets);
    const repsNum = parseInt(exReps);
    const weightNum = parseFloat(exWeight);
    const restNum = parseInt(exRest);

    if (isNaN(setsNum) || setsNum <= 0 || isNaN(repsNum) || repsNum <= 0 || isNaN(weightNum) || weightNum < 0 || isNaN(restNum) || restNum < 0) {
      setExError('Geçersiz sayısal değer girdiniz.');
      return;
    }

    const newEx: Exercise = {
      id: Math.random().toString(36).substring(2, 9),
      name: exName.trim(),
      sets: setsNum,
      reps: repsNum,
      weight: weightNum,
      restSeconds: restNum,
      notes: exNotes.trim() || undefined,
    };

    setFormExercises((prev) => [...prev, newEx]);
    clearExerciseInputs();
    onShowToast('Egzersiz antrenmana eklendi.');
  };

  const handleRemoveExerciseFromWorkout = (exId: string) => {
    setFormExercises((prev) => prev.filter((e) => e.id !== exId));
    onShowToast('Egzersiz kaldırıldı.');
  };

  const handleDeleteWorkout = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bu antrenmanı silmek istediğinizden emin misiniz?')) {
      const updated = workouts.filter((w) => w.id !== id);
      onSaveWorkouts(updated);
      onShowToast('Antrenman kaydı kalıcı olarak silindi.');
    }
  };

  const handleSaveWorkoutForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Lütfen geçerli bir antrenman adı girin.');
      return;
    }

    const durationNum = parseInt(formDuration);
    const caloriesNum = parseInt(formCalories);

    if (isNaN(durationNum) || durationNum <= 0 || isNaN(caloriesNum) || caloriesNum < 0) {
      alert('Süre ve yakılan kalori değerleri sıfırdan küçük olamaz.');
      return;
    }

    const workoutData: Workout = {
      id: editingWorkout ? editingWorkout.id : Math.random().toString(36).substring(2, 9),
      name: formName.trim(),
      date: formDate,
      type: formType,
      duration: durationNum,
      caloriesBurned: caloriesNum,
      difficulty: formDifficulty,
      notes: formNotes.trim() || undefined,
      exercises: formExercises,
    };

    let updatedWorkouts: Workout[];
    if (editingWorkout) {
      updatedWorkouts = workouts.map((w) => (w.id === editingWorkout.id ? workoutData : w));
      onShowToast('Antrenman başarıyla güncellendi.');
    } else {
      updatedWorkouts = [workoutData, ...workouts];
      onShowToast('Yeni antrenman başarıyla eklendi.');
    }

    onSaveWorkouts(updatedWorkouts);
    setIsModalOpen(false);
  };

  // Filter and search workouts
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) => {
      const matchType = selectedType === 'All' || w.type === selectedType;
      const matchSearch =
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.notes && w.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        w.exercises.some((ex) => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [workouts, selectedType, searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedWorkoutId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Head section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Antrenman Takip Günlüğü</h1>
          <p className="text-xs text-slate-400 mt-1">
            Yaptığınız antrenmanları ve egzersiz setlerini loglayarak kas gelişiminizi takip edin.
          </p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer text-sm shadow-lg shadow-emerald-400/5 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Antrenman Girişi Yap
        </button>
      </div>

      {/* Filter and Search actions container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Antrenman, egzersiz veya not ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
          {/* Workout category filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0 text-xs">
            <button
              onClick={() => setSelectedType('All')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition shrink-0 cursor-pointer ${
                selectedType === 'All'
                  ? 'bg-emerald-400 text-slate-950 border-emerald-400'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900'
              }`}
            >
              Tümü
            </button>
            {WORKOUT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition shrink-0 cursor-pointer ${
                  selectedType === t
                    ? 'bg-emerald-400 text-slate-950 border-emerald-400'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workouts Card List */}
      {filteredWorkouts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-10 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center mx-auto text-emerald-400 border border-slate-800">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-white">Gösterilebilecek Antrenman Bulunamadı</h3>
            <p className="text-xs text-slate-400">
              {searchTerm || selectedType !== 'All'
                ? 'Arama kriterlerinize veya kategori filtresine uyan kayıt bulunamadı.'
                : 'Henüz antrenman kaydı girmediniz. Yukarıdaki butona tıklayarak ilk günlüğünüzü oluşturun!'}
            </p>
          </div>
          {(searchTerm || selectedType !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('All');
              }}
              className="text-xs text-emerald-400 underline font-bold cursor-pointer"
            >
              Aramayı Sıfırla
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredWorkouts.map((w) => {
            const isExpanded = expandedWorkoutId === w.id;
            let diffColor = 'bg-slate-800 text-slate-350';
            if (w.difficulty === 'Kolay') diffColor = 'bg-emerald-500/10 text-emerald-400';
            else if (w.difficulty === 'Orta') diffColor = 'bg-blue-500/10 text-blue-400';
            else if (w.difficulty === 'Zor') diffColor = 'bg-rose-500/10 text-rose-400';

            return (
              <div
                key={w.id}
                onClick={() => toggleExpand(w.id)}
                className="bg-slate-900 hover:bg-slate-850/80 border border-slate-800 hover:border-slate-750 rounded-xl shadow-md transition overflow-hidden cursor-pointer"
              >
                {/* Header info bar of card */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 border border-slate-800 text-emerald-400 py-0.5 px-2.5 rounded-full">
                        {w.type}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-full ${diffColor}`}>
                        {w.difficulty}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white">{w.name}</h3>
                    
                    {w.notes && (
                      <p className="text-xs text-slate-400 line-clamp-1 italic font-normal">
                        "{w.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-850 pt-2.5 sm:pt-0">
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                      {w.date}
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                      {w.duration} dk
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                      {w.caloriesBurned} kcal
                    </span>

                    {/* Actions on desktop */}
                    <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenEditModal(w, e)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteWorkout(w.id, e)}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-slate-600 block pl-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Exercises checklist section */}
                {isExpanded && (
                  <div className="border-t border-slate-850 bg-slate-950/40 p-4 sm:p-5 space-y-3.5 transition-all">
                    <h4 className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5" /> Egzersiz Detayları ({w.exercises.length})
                    </h4>
                    {w.exercises.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">Bu antrenmana henüz egzersiz eklenmemiş.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {w.exercises.map((ex, idx) => (
                          <div
                            key={ex.id || idx}
                            className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex justify-between items-start"
                          >
                            <div className="space-y-1">
                              <p className="text-xs font-extrabold text-slate-200">
                                {idx + 1}. {ex.name}
                              </p>
                              <div className="flex gap-2 flex-wrap text-[11px] text-slate-400 font-medium">
                                <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-850">
                                  {ex.sets} Set
                                </span>
                                <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-850">
                                  {ex.reps} Tekrar
                                </span>
                                {ex.weight > 0 && (
                                  <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 font-bold">
                                    {ex.weight} kg
                                  </span>
                                )}
                                <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-850">
                                  ⏱️ {ex.restSeconds} s Dinlenme
                                </span>
                              </div>
                              {ex.notes && <p className="text-[11px] text-slate-400 italic">Not: "{ex.notes}"</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT COMPLEX MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Dumbbell className="text-emerald-400" />
                {editingWorkout ? 'Antrenmanı Düzenle' : 'Yeni Antrenman Logla'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scroll */}
            <form onSubmit={handleSaveWorkoutForm} className="overflow-y-auto p-6 space-y-6 flex-1">
              
              {/* Part 1: Workout General Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Genel Antrenman Bilgileri
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Antrenman Başlığı *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Göğüs & Biceps (A Planı)"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Tarih *
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Antrenman Tipi *
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as WorkoutType)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      {WORKOUT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-slate-900 text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Süre (Dakika) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Yakılan Kalori (Tahmini kcal)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formCalories}
                      onChange={(e) => setFormCalories(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Zorluk Seviyesi *
                    </label>
                    <div className="flex gap-2">
                      {DIFFICULTIES.map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setFormDifficulty(diff)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                            formDifficulty === diff
                              ? 'bg-emerald-400 text-slate-950 border-emerald-400'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Antrenman Notu
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Bugün enerjim çok yüksekti."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Part 2: Nested Exercises Builder */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-800 flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Egzersiz Ekle
                </h4>

                {/* Sub-form fields for an individual exercise */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
                  {exError && <p className="text-xs text-red-400 font-semibold">{exError}</p>}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Egzersiz Adı *
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Bench Press, Lat Pulldown, Squat..."
                        value={exName}
                        onChange={(e) => setExName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Set Sayısı *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exSets}
                        onChange={(e) => setExSets(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Tekrar Sayısı *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exReps}
                        onChange={(e) => setExReps(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Ağırlık (kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={exWeight}
                        onChange={(e) => setExWeight(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Dinlenme (Saniye)
                      </label>
                      <input
                        type="number"
                        step="5"
                        min="0"
                        value={exRest}
                        onChange={(e) => setExRest(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Egzersiz Notu (Opsiyonel)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Son sette drop yapıldı."
                        value={exNotes}
                        onChange={(e) => setExNotes(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleAddExerciseToWorkout}
                      className="bg-slate-800 hover:bg-slate-700 hover:border-emerald-500/50 text-emerald-400 font-bold border border-slate-750 px-4 py-1.5 rounded-lg text-xs transition duration-150 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Antrenmana Ekle
                    </button>
                  </div>
                </div>

                {/* List of currently added exercises inside the form */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Eklenecek Egzersiz Listesi ({formExercises.length})
                  </h5>
                  {formExercises.length === 0 ? (
                    <div className="p-4 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
                      Bu antrenmana henüz hiçbir egzersiz eklenmedi. Yukarıdaki alanlardan hazırlayıp ekleyin.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {formExercises.map((e, index) => (
                        <div
                          key={e.id}
                          className="flex items-center justify-between bg-slate-950/80 border border-slate-850 p-2.5 rounded-lg text-xs"
                        >
                          <div className="flex-1">
                            <span className="font-bold text-emerald-400 mr-1.5">{index + 1}.</span>
                            <span className="text-white font-semibold">{e.name}</span>
                            <span className="text-slate-400 font-medium ml-2">
                              • {e.sets} set x {e.reps} tekrar {e.weight > 0 ? `(${e.weight} kg)` : ''} • {e.restSeconds}sn dinlenme
                            </span>
                            {e.notes && (
                              <span className="text-slate-500 italic block mt-0.5 ml-4">
                                "{e.notes}"
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExerciseFromWorkout(e.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Çıkar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Part 3: Form Global Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 font-bold px-4 py-2 rounded-lg text-xs text-slate-300 transition duration-150 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold px-6 py-2 rounded-lg text-xs transition duration-150 shadow-md shadow-emerald-400/5 cursor-pointer"
                >
                  Antrenmanı Kaydet
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
