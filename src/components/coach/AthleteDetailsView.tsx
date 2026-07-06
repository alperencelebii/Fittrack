/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useMemo } from 'react';
import { databaseService, normalizeExerciseSets } from '../../services/databaseService';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { 
  Workout, 
  WeightEntry, 
  BodyMeasurement, 
  MealEntry, 
  WaterEntry,
  GeneratedTrainingProgram,
  WorkoutSetEntry,
  PersonalRecord,
  DeloadSuggestion,
  RecoveryEntry
} from '../../types';
import { calculateDailyReadinessScore } from '../../utils/readinessCalculations';
import { getProgressiveOverloadSuggestions } from '../../utils/progressiveOverloadCalculations';
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
  Loader2,
  Heart,
  Award,
  Calendar,
  Search,
  Filter,
  X,
  Archive
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
  
  // Coach set nutrition goals state
  const [coachCalorieGoal, setCoachCalorieGoal] = useState('');
  const [coachProteinGoal, setCoachProteinGoal] = useState('');
  const [coachCarbGoal, setCoachCarbGoal] = useState('');
  const [coachFatGoal, setCoachFatGoal] = useState('');
  const [coachWaterGoal, setCoachWaterGoal] = useState('');
  const [coachTargetWeight, setCoachTargetWeight] = useState('');

  // Coach nutrition notes states
  const [coachNutritionNote, setCoachNutritionNote] = useState('');
  const [coachNoteDate, setCoachNoteDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [nutritionCoachNotes, setNutritionCoachNotes] = useState<any[]>([]);

  // UI Controllers
  const [activeTab, setActiveTab] = useState<'summary' | 'workouts' | 'nutrition' | 'measurements' | 'training_status'>('summary');
  const [loading, setLoading] = useState(true);

  // Training Module States
  const [trainingPrograms, setTrainingPrograms] = useState<GeneratedTrainingProgram[]>([]);
  const [workoutSetEntries, setWorkoutSetEntries] = useState<WorkoutSetEntry[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [deloadSuggestions, setDeloadSuggestions] = useState<DeloadSuggestion[]>([]);
  const [recoveryLogs, setRecoveryLogs] = useState<RecoveryEntry[]>([]);

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

  // Coach Program Writer States
  const [isWritingProgram, setIsWritingProgram] = useState(false);
  const [progName, setProgName] = useState('Haftalık Güç ve Hipertrofi Programı');
  const [progGoal, setProgGoal] = useState('Kas kazanımı');
  const [progLevel, setProgLevel] = useState('Intermediate');
  const [progDurationWeeks, setProgDurationWeeks] = useState(8);
  const [progCoachNote, setProgCoachNote] = useState('');
  const [progSessions, setProgSessions] = useState<any[]>([]);
  const [programSubmitting, setProgramSubmitting] = useState(false);

  // Exercise Search / Selector States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');
  const [activeSessionIndexForAdding, setActiveSessionIndexForAdding] = useState<number | null>(null);
  const [viewingProgramId, setViewingProgramId] = useState<string | null>(null);

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

    // 8. Listen Nutrition Coach notes
    const unsubNutritionNotes = databaseService.listenNutritionCoachNotes(athleteId, (list) => {
      setNutritionCoachNotes(list);
    });

    // 9. Listen Training Programs
    const unsubPrograms = databaseService.listenGeneratedTrainingPrograms(athleteId, (list) => {
      setTrainingPrograms(list);
    });

    // 10. Listen Workout Sets
    const unsubSets = databaseService.listenWorkoutSetEntries(athleteId, (list) => {
      setWorkoutSetEntries(list);
    });

    // 11. Listen Personal Records
    const unsubPRs = databaseService.listenPersonalRecords(athleteId, (list) => {
      setPersonalRecords(list);
    });

    // 12. Listen Deload Suggestions
    const unsubDeload = databaseService.listenDeloadSuggestions(athleteId, (list) => {
      setDeloadSuggestions(list);
    });

    // 13. Listen Recovery logs
    const unsubRecovery = databaseService.listenRecoveryEntries(athleteId, (list) => {
      setRecoveryLogs(list);
    });

    return () => {
      unsubWorkouts();
      unsubWeight();
      unsubMeasurements();
      unsubMeals();
      unsubWater();
      unsubNotes();
      unsubGoals();
      unsubNutritionNotes();
      unsubPrograms();
      unsubSets();
      unsubPRs();
      unsubDeload();
      unsubRecovery();
    };
  }, [athleteId]);

  // Sync athlete nutrition goals to inputs
  useEffect(() => {
    if (athleteDoc?.nutritionGoals) {
      setCoachCalorieGoal(String(athleteDoc.nutritionGoals.calories || ''));
      setCoachProteinGoal(String(athleteDoc.nutritionGoals.protein || ''));
      setCoachCarbGoal(String(athleteDoc.nutritionGoals.carbs || ''));
      setCoachFatGoal(String(athleteDoc.nutritionGoals.fat || ''));
      setCoachWaterGoal(String(athleteDoc.nutritionGoals.waterMl || ''));
      setCoachTargetWeight(String(athleteDoc.nutritionGoals.targetWeight || ''));
    } else if (athleteDoc) {
      setCoachCalorieGoal(String(athleteDoc.dailyCalorieGoal || '2000'));
      setCoachProteinGoal('');
      setCoachCarbGoal('');
      setCoachFatGoal('');
      setCoachWaterGoal(String(athleteDoc.dailyWaterGoal || '2500'));
      setCoachTargetWeight(String(athleteDoc.targetWeight || ''));
    }
  }, [athleteDoc]);

  // Helper Metrics calculations
  const totalCalBurned = useMemo(() => {
    return workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  }, [workouts]);

  const avgWorkoutDuration = useMemo(() => {
    if (workouts.length === 0) return 0;
    return Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length);
  }, [workouts]);

  const allMuscles = useMemo(() => {
    const muscles = new Set<string>();
    EXERCISE_LIBRARY.forEach(ex => {
      if (ex.primaryMuscles) {
        ex.primaryMuscles.forEach(m => {
          if (m) muscles.add(m);
        });
      }
    });
    return Array.from(muscles).sort();
  }, []);

  const allEquipments = useMemo(() => {
    const equipments = new Set<string>();
    EXERCISE_LIBRARY.forEach(ex => {
      if (Array.isArray(ex.equipment)) {
        ex.equipment.forEach(e => {
          if (e) equipments.add(e);
        });
      } else if (typeof ex.equipment === 'string' && ex.equipment) {
        equipments.add(ex.equipment);
      }
    });
    return Array.from(equipments).sort();
  }, []);

  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter(ex => {
      const matchesSearch = searchQuery.trim() === '' || 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.alternativeNames && ex.alternativeNames.some(n => n.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesMuscle = !filterMuscle || 
        (ex.primaryMuscles && ex.primaryMuscles.includes(filterMuscle));

      const matchesEquipment = !filterEquipment || 
        (Array.isArray(ex.equipment) ? ex.equipment.includes(filterEquipment) : ex.equipment === filterEquipment);

      return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [searchQuery, filterMuscle, filterEquipment]);

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

  const handleUpdateNutritionGoals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachProfile?.id) return;
    try {
      const goalsPayload = {
        calories: Math.round(Number(coachCalorieGoal)) || 2000,
        protein: Math.round(Number(coachProteinGoal)) || 150,
        carbs: Math.round(Number(coachCarbGoal)) || 250,
        fat: Math.round(Number(coachFatGoal)) || 60,
        waterMl: Math.round(Number(coachWaterGoal)) || 2500,
        targetWeight: Number(coachTargetWeight) || undefined,
        setByCoachId: coachProfile.id,
        updatedAt: new Date().toISOString()
      };
      await databaseService.saveCoachAthleteGoals(athleteId, coachProfile.id, goalsPayload);
      onShowToast("Sporcunun beslenme ve su hedefleri güncellendi! 🎯");
      const updatedProfile = await databaseService.getUserProfile(athleteId);
      setAthleteDoc(updatedProfile);
    } catch (err) {
      console.error(err);
      onShowToast("Hedefler güncellenirken hata oluştu.");
    }
  };

  const handleResetNutritionGoals = async () => {
    if (confirm("Sporcunun tüm koç beslenme hedeflerini sıfırlamak istediğinizden emin misiniz?")) {
      try {
        await databaseService.removeCoachAthleteGoals(athleteId, coachProfile?.id);
        onShowToast("Koç beslenme hedefleri sıfırlandı.");
        const updatedProfile = await databaseService.getUserProfile(athleteId);
        setAthleteDoc(updatedProfile);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddNutritionCoachNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachProfile?.id || !coachNutritionNote.trim()) return;
    try {
      const notePayload = {
        id: Math.random().toString(36).substring(2, 9),
        coachId: coachProfile.id,
        athleteId,
        date: coachNoteDate || new Date().toISOString().split('T')[0],
        note: coachNutritionNote.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await databaseService.saveNutritionCoachNote(notePayload);
      setCoachNutritionNote('');
      onShowToast("Beslenme notu başarıyla kaydedildi! 📝");
    } catch (err) {
      console.error(err);
      onShowToast("Beslenme notu kaydedilirken hata oluştu.");
    }
  };

  const handleDeleteNutritionNote = async (id: string) => {
    if (confirm("Bu beslenme notunu silmek istediğinizden emin misiniz?")) {
      try {
        await databaseService.deleteNutritionCoachNote(id);
        onShowToast("Not başarıyla silindi.");
      } catch (err) {
        console.error(err);
        onShowToast("Not silinirken hata oluştu.");
      }
    }
  };

  // Program Management Handlers for Coach
  const handleAssignProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachProfile?.id) return;
    if (!progName.trim()) {
      onShowToast("Lütfen geçerli bir program adı girin.");
      return;
    }
    
    // Check if sessions list is empty or if all sessions have 0 exercises
    const hasAnyExercise = progSessions.some(session => session.exercises && session.exercises.length > 0);
    if (progSessions.length === 0 || !hasAnyExercise) {
      onShowToast("En az bir gün ve egzersiz eklemelisiniz.");
      return;
    }

    setProgramSubmitting(true);

    // Deep sanitizer function to remove undefined/NaN values
    const removeUndefinedDeep = (obj: any): any => {
      if (obj === undefined || obj === null) return '';
      if (typeof obj === 'number') {
        if (Number.isNaN(obj) || !Number.isFinite(obj)) return 0;
        return obj;
      }
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'boolean') return obj;
      if (obj instanceof Date) return obj.toISOString();
      if (Array.isArray(obj)) {
        return obj
          .map(item => removeUndefinedDeep(item))
          .filter(item => item !== undefined && item !== null);
      }
      if (typeof obj === 'object') {
        const cleaned: any = {};
        for (const [k, v] of Object.entries(obj)) {
          cleaned[k] = removeUndefinedDeep(v);
        }
        return cleaned;
      }
      return obj;
    };

    const programDataRaw = {
      id: `cp_${Math.random().toString(36).substring(2, 9)}`,
      name: progName.trim(),
      goal: progGoal,
      level: progLevel,
      weeklyDays: progSessions.length,
      durationWeeks: Number(progDurationWeeks) || 8,
      userId: athleteId,
      athleteId: athleteId,
      assignedToUserId: athleteId,
      coachId: coachProfile.id,
      createdBy: 'coach',
      status: 'assigned',
      isActive: false,
      coachNote: progCoachNote.trim() || '',
      equipment: [],
      priorityMuscles: [],
      restrictions: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 * (Number(progDurationWeeks) || 8)).toISOString().split('T')[0],
      sessions: progSessions.map((session, sIdx) => ({
        dayNumber: sIdx + 1,
        name: session.name || `${sIdx + 1}. Gün Antrenmanı`,
        exercises: (session.exercises || [])
          .filter((ex: any) => ex && ex.name && ex.name.trim() !== '')
          .map((ex: any) => ({
            id: ex.id || `ex_${Math.random().toString(36).substring(2, 9)}`,
            name: ex.name,
            sets: Number(ex.sets) || 3,
            reps: ex.reps ? String(ex.reps) : '10',
            restSeconds: Number(ex.restSeconds) || 60,
            rpe: ex.rpe !== undefined && ex.rpe !== null && String(ex.rpe).trim() !== '' ? String(ex.rpe) : '',
            notes: ex.notes || ''
          }))
      })),
      days: progSessions.map((session, sIdx) => ({
        dayNumber: sIdx + 1,
        name: session.name || `${sIdx + 1}. Gün Antrenmanı`,
        exercises: (session.exercises || [])
          .filter((ex: any) => ex && ex.name && ex.name.trim() !== '')
          .map((ex: any) => ({
            id: ex.id || `ex_${Math.random().toString(36).substring(2, 9)}`,
            name: ex.name,
            sets: Number(ex.sets) || 3,
            reps: ex.reps ? String(ex.reps) : '10',
            restSeconds: Number(ex.restSeconds) || 60,
            rpe: ex.rpe !== undefined && ex.rpe !== null && String(ex.rpe).trim() !== '' ? String(ex.rpe) : '',
            notes: ex.notes || ''
          }))
      }))
    };

    const sanitizedProgramPayload = removeUndefinedDeep(programDataRaw);

    try {
      await databaseService.createCoachAssignedTrainingProgram(coachProfile.id, athleteId, sanitizedProgramPayload);
      onShowToast("Program sporcuya başarıyla atandı.");
      // Reset form
      setProgName('Haftalık Güç ve Hipertrofi Programı');
      setProgGoal('Kas kazanımı');
      setProgLevel('Intermediate');
      setProgDurationWeeks(8);
      setProgCoachNote('');
      setProgSessions([]);
      setIsWritingProgram(false);
    } catch (error) {
      console.error('Koç program atama hatası:', error);
      console.error('Program payload:', sanitizedProgramPayload);
      console.error('Coach ID:', coachProfile.id);
      console.error('Athlete ID:', athleteId);
      onShowToast("Program atanırken bir sorun oluştu.");
    } finally {
      setProgramSubmitting(false);
    }
  };

  const handleAddSession = () => {
    setProgSessions(prev => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        name: `${prev.length + 1}. Gün Antrenmanı`,
        exercises: []
      }
    ]);
  };

  const handleRemoveSession = (index: number) => {
    setProgSessions(prev => prev.filter((_, i) => i !== index).map((s, idx) => ({ ...s, dayNumber: idx + 1 })));
  };

  const handleUpdateSessionName = (index: number, name: string) => {
    setProgSessions(prev => prev.map((s, i) => i === index ? { ...s, name } : s));
  };

  const handleAddExerciseToSession = (sessionIndex: number, exercise: any) => {
    setProgSessions(prev => prev.map((s, i) => {
      if (i === sessionIndex) {
        return {
          ...s,
          exercises: [
            ...s.exercises,
            {
              id: exercise.id,
              name: exercise.name,
              sets: 3,
              reps: 10,
              restSeconds: 60,
              rpe: '',
              notes: ''
            }
          ]
        };
      }
      return s;
    }));
    // Clear search and index selection
    setSearchQuery('');
    setActiveSessionIndexForAdding(null);
  };

  const handleRemoveExerciseFromSession = (sessionIndex: number, exerciseIndex: number) => {
    setProgSessions(prev => prev.map((s, i) => {
      if (i === sessionIndex) {
        return {
          ...s,
          exercises: s.exercises.filter((_: any, idx: number) => idx !== exerciseIndex)
        };
      }
      return s;
    }));
  };

  const handleUpdateExerciseInSession = (sessionIndex: number, exerciseIndex: number, field: string, value: any) => {
    setProgSessions(prev => prev.map((s, i) => {
      if (i === sessionIndex) {
        return {
          ...s,
          exercises: s.exercises.map((ex: any, idx: number) => idx === exerciseIndex ? { ...ex, [field]: value } : ex)
        };
      }
      return s;
    }));
  };

  const handleArchiveProgram = async (programId: string) => {
    if (!confirm("Bu antrenman programını arşivlemek istediğinize emin misiniz?")) return;
    try {
      await databaseService.archiveTrainingProgram(programId);
      onShowToast("Program başarıyla arşivlendi.");
    } catch (error) {
      console.error("Program arşivleme hatası:", error);
      onShowToast("Program arşivlenirken hata oluştu.");
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
          { id: 'training_status', name: 'Antrenman & Güç Analizi', icon: Award },
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

      {/* TAB CONTENT: ANTRENMAN & GÜÇ ANALİZİ (COACH VIEW) */}
      {activeTab === 'training_status' && (
        <div className="space-y-6">
          
          {/* Row 1: Active Program & Recovery Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Active Training Program */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-800">
                <Dumbbell className="w-4 h-4 text-emerald-400" /> Aktif Antrenman Programı
              </h4>
              
              {(() => {
                const activeProg = trainingPrograms.find(p => p.isActive);
                if (!activeProg) {
                  return (
                    <div className="p-8 text-center bg-slate-950/40 rounded-xl text-xs text-slate-500 border border-dashed border-slate-850">
                      Sporcunun şu anda aktif bir antrenman programı bulunmuyor.
                    </div>
                  );
                }
                return (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold rounded uppercase tracking-wider">
                          {activeProg.splitName}
                        </span>
                        <h5 className="text-sm font-bold text-slate-200 mt-1">{activeProg.programName}</h5>
                      </div>
                      <div className="text-right text-[10px] text-slate-400 font-bold">
                        <span>{activeProg.weeklyDays} Gün / {activeProg.durationWeeks} Hafta</span>
                        <span className="block text-[9.5px] text-slate-500 mt-0.5">Hedef: {activeProg.goal}</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-800/50 pt-3">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Program Seansları:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeProg.sessions.map((s, i) => (
                          <div key={i} className="p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                            <span className="text-[9px] font-bold text-slate-500 block uppercase">Gün {i + 1}</span>
                            <span className="text-xs font-bold text-slate-200 block mt-0.5">{s.name}</span>
                            <span className="text-[9.5px] text-emerald-400 font-bold mt-1 block">{s.exercises.length} Egzersiz</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Recovery & Readiness Status */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-800">
                <Heart className="w-4 h-4 text-rose-500" /> Günlük Hazırlık & Toparlanma Durumu
              </h4>

              {(() => {
                const latestRecovery = recoveryLogs[0];
                if (!latestRecovery) {
                  return (
                    <div className="p-8 text-center bg-slate-950/40 rounded-xl text-xs text-slate-500 border border-dashed border-slate-850">
                      Henüz toparlanma/recovery günlüğü girilmemiş.
                    </div>
                  );
                }
                const scoreResult = calculateDailyReadinessScore(latestRecovery);
                const activeDeloadRecord = deloadSuggestions.find(d => {
                  if (d.status !== 'accepted') return false;
                  const today = new Date();
                  const start = new Date(d.suggestedStartDate);
                  const end = new Date(start);
                  end.setDate(start.getDate() + (d.suggestedDurationDays || 7));
                  return today >= start && today <= end;
                });

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-950 p-4 border border-slate-850 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Son Ölçülen Readiness</span>
                        <span className="text-2xl font-black text-white font-mono mt-0.5">{scoreResult.score}%</span>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg ${
                        scoreResult.score >= 85 ? 'bg-emerald-500/15 text-emerald-400' :
                        scoreResult.score >= 70 ? 'bg-emerald-500/15 text-emerald-400' :
                        scoreResult.score >= 50 ? 'bg-amber-500/15 text-amber-400' :
                        'bg-rose-500/15 text-rose-400'
                      }`}>
                        {scoreResult.score >= 85 ? 'SÜPER' : scoreResult.score >= 70 ? 'İYİ' : scoreResult.score >= 50 ? 'ORTA' : 'YORGUN'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg">
                        <span className="text-[9px] text-slate-500 block uppercase">Uyku</span>
                        <span className="font-extrabold text-slate-300 block mt-0.5">{latestRecovery.sleepHours} sa ({latestRecovery.sleepQuality}/10)</span>
                      </div>
                      <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg">
                        <span className="text-[9px] text-slate-500 block uppercase">Yorgunluk</span>
                        <span className="font-extrabold text-rose-400 block mt-0.5">{latestRecovery.fatigueLevel}/10</span>
                      </div>
                      <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg">
                        <span className="text-[9px] text-slate-500 block uppercase">Kas Ağrısı</span>
                        <span className="font-extrabold text-amber-400 block mt-0.5">{latestRecovery.muscleSoreness}/10</span>
                      </div>
                    </div>

                    {activeDeloadRecord ? (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-slate-300">
                        <span className="font-extrabold text-emerald-400 uppercase tracking-wider block mb-0.5">⚠️ Deload Devresi Devrede</span>
                        Sporcu deload programını kabul etti. Ağırlık önerileri otomatik olarak düşürülmüştür.
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-850/50">
                        "{scoreResult.recommendation}"
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>

          {/* Coach Assigned Programs & Program Writer section */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Koç Tarafından Atanan Antrenman Programları
              </h4>
              {!isWritingProgram && (
                <button
                  onClick={() => {
                    setIsWritingProgram(true);
                    setProgSessions([
                      { dayNumber: 1, name: "1. Gün Antrenmanı", exercises: [] }
                    ]);
                  }}
                  className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-[11px] rounded-lg transition cursor-pointer"
                >
                  Yeni Program Yaz & Ata
                </button>
              )}
            </div>

            {/* List of already assigned programs */}
            {!isWritingProgram && (
              <div className="space-y-3">
                {(() => {
                  const coachPrograms = trainingPrograms.filter(p => p.createdBy === 'coach');
                  if (coachPrograms.length === 0) {
                    return (
                      <p className="text-xs text-slate-500 italic py-4">Bu sporcuya henüz program atanmadı.</p>
                    );
                  }
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {coachPrograms.map(p => {
                        const isThisActive = p.isActive;
                        const isViewing = viewingProgramId === p.id;
                        return (
                          <div key={p.id} className={`p-4 rounded-xl border transition ${isThisActive ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-950/45 border-slate-850'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-1.5 py-0.5 bg-slate-900 text-slate-400 text-[8px] font-bold uppercase rounded border border-slate-800">
                                    Koç Programı
                                  </span>
                                  <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded ${
                                    p.status === 'active' || isThisActive ? 'bg-emerald-400/20 text-emerald-400' :
                                    p.status === 'archived' ? 'bg-rose-400/20 text-rose-400' :
                                    'bg-amber-400/20 text-amber-400'
                                  }`}>
                                    {isThisActive ? 'AKTİF' : p.status === 'assigned' ? 'ATANDI' : p.status === 'archived' ? 'ARŞİVLENDİ' : (p.status || 'ATANDI').toUpperCase()}
                                  </span>
                                </div>
                                <h5 className="text-xs font-bold text-white mt-1.5">{p.name}</h5>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono font-semibold">
                                {p.weeklyDays || p.sessions?.length || 0} Gün / {p.durationWeeks || 8} Hafta
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-slate-400">
                              <div><span className="text-slate-500">Hedef:</span> <span className="font-bold text-slate-300">{p.goal}</span></div>
                              <div><span className="text-slate-500">Seviye:</span> <span className="font-bold text-slate-300">{p.level}</span></div>
                            </div>

                            {p.coachNote && (
                              <p className="mt-2.5 text-[10.5px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-900 italic">
                                "{p.coachNote}"
                              </p>
                            )}

                            {/* View Sessions Toggle */}
                            {isViewing && p.sessions && (
                              <div className="mt-3 pt-3 border-t border-slate-900 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                                {p.sessions.map((s: any, sIdx: number) => (
                                  <div key={sIdx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                                    <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider block">{s.name || `${sIdx+1}. Gün`}</span>
                                    <div className="mt-1.5 space-y-1">
                                      {s.exercises?.map((ex: any, eIdx: number) => (
                                        <div key={eIdx} className="text-[11px] text-slate-300 flex justify-between gap-2 border-b border-slate-900/40 pb-1 last:border-0 last:pb-0">
                                          <span className="font-medium text-slate-200">{ex.name}</span>
                                          <span className="text-slate-450 font-mono text-[10px]">
                                            {ex.sets}x{ex.reps} {ex.restSeconds ? `| ${ex.restSeconds}s` : ''} {ex.rpe ? `| RPE ${ex.rpe}` : ''}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-900/60">
                              <button
                                type="button"
                                onClick={() => setViewingProgramId(isViewing ? null : p.id)}
                                className="flex-1 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-[10px] rounded-lg transition cursor-pointer"
                              >
                                {isViewing ? "Detayları Kapat" : "İçeriği & Detayları Gör"}
                              </button>
                              {p.status !== 'archived' && (
                                <button
                                  type="button"
                                  onClick={() => handleArchiveProgram(p.id)}
                                  className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-[10px] rounded-lg transition cursor-pointer"
                                  title="Arşive Gönder"
                                >
                                  Arşivle
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Program Writer Form */}
            {isWritingProgram && (
              <form onSubmit={handleAssignProgram} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">YENİ ANTRENMAN PROGRAMI OLUŞTURMA</span>
                  <button
                    type="button"
                    onClick={() => setIsWritingProgram(false)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-900 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PROGRAM ADI</label>
                    <input
                      type="text"
                      required
                      placeholder="Haftalık Güç ve Hipertrofi Programı"
                      value={progName}
                      onChange={(e) => setProgName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HEDEF</label>
                    <input
                      type="text"
                      required
                      placeholder="Kas kazanımı, yağ yakımı, güçlenme..."
                      value={progGoal}
                      onChange={(e) => setProgGoal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SEVİYE</label>
                    <select
                      value={progLevel}
                      onChange={(e) => setProgLevel(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Beginner">Beginner (Başlangıç)</option>
                      <option value="Intermediate">Intermediate (Orta)</option>
                      <option value="Advanced">Advanced (İleri)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SÜRE (HAFTA)</label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      required
                      value={progDurationWeeks}
                      onChange={(e) => setProgDurationWeeks(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">KOÇ NOTU / GENEL TALİMATLAR</label>
                    <input
                      type="text"
                      placeholder="Isınma protokolleri, haftalık progresyon talimatları, rpe detayları..."
                      value={progCoachNote}
                      onChange={(e) => setProgCoachNote(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Sessions Section */}
                <div className="space-y-4 pt-3 border-t border-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">PROGRAM SEANSLARI / GÜNLERİ ({progSessions.length} GÜN)</span>
                    <button
                      type="button"
                      onClick={handleAddSession}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-[10px] rounded transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Gün Ekle
                    </button>
                  </div>

                  {progSessions.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-850 rounded-lg text-slate-500 text-xs">
                      Lütfen program günleri eklemek için yukarıdaki "Gün Ekle" butonuna tıklayın.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {progSessions.map((session, sIdx) => (
                        <div key={sIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-xs font-mono font-bold text-slate-500">GÜN {sIdx + 1}:</span>
                              <input
                                type="text"
                                required
                                value={session.name}
                                onChange={(e) => handleUpdateSessionName(sIdx, e.target.value)}
                                className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-200 font-bold focus:outline-none focus:border-emerald-500 flex-1 max-w-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSession(sIdx)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-950 transition"
                              title="Bu Günü Sil"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Exercise List in Session */}
                          <div className="space-y-2">
                            {session.exercises.length === 0 ? (
                              <p className="text-[10px] text-slate-500 italic pl-1">Henüz egzersiz eklenmedi.</p>
                            ) : (
                              <div className="space-y-2">
                                <div className="hidden sm:grid sm:grid-cols-12 gap-2 px-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                  <div className="col-span-4">EGZERSİZ</div>
                                  <div className="col-span-1 text-center">SET</div>
                                  <div className="col-span-1 text-center">REPS / TEKRAR</div>
                                  <div className="col-span-1.5 text-center">DİNLENME (sn)</div>
                                  <div className="col-span-1 text-center">RPE</div>
                                  <div className="col-span-3">NOTLAR</div>
                                  <div className="col-span-0.5"></div>
                                </div>

                                {session.exercises.map((ex: any, eIdx: number) => (
                                  <div key={eIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-850">
                                    <div className="col-span-4 font-bold text-xs text-slate-200 truncate pl-1">
                                      {ex.name}
                                    </div>
                                    <div className="col-span-1">
                                      <input
                                        type="number"
                                        min={1}
                                        required
                                        value={ex.sets}
                                        onChange={(e) => handleUpdateExerciseInSession(sIdx, eIdx, 'sets', Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-center text-xs text-slate-200 focus:outline-none"
                                        placeholder="Set"
                                      />
                                    </div>
                                    <div className="col-span-1">
                                      <input
                                        type="text"
                                        required
                                        value={ex.reps}
                                        onChange={(e) => handleUpdateExerciseInSession(sIdx, eIdx, 'reps', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-center text-xs text-slate-200 focus:outline-none"
                                        placeholder="Tekrar"
                                      />
                                    </div>
                                    <div className="col-span-1.5">
                                      <input
                                        type="number"
                                        min={0}
                                        required
                                        value={ex.restSeconds}
                                        onChange={(e) => handleUpdateExerciseInSession(sIdx, eIdx, 'restSeconds', Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-center text-xs text-slate-200 focus:outline-none"
                                        placeholder="Dinlenme"
                                      />
                                    </div>
                                    <div className="col-span-1">
                                      <input
                                        type="text"
                                        value={ex.rpe || ''}
                                        onChange={(e) => handleUpdateExerciseInSession(sIdx, eIdx, 'rpe', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-center text-xs text-slate-200 focus:outline-none"
                                        placeholder="RPE"
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <input
                                        type="text"
                                        value={ex.notes || ''}
                                        onChange={(e) => handleUpdateExerciseInSession(sIdx, eIdx, 'notes', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                        placeholder="Egzersiz notu..."
                                      />
                                    </div>
                                    <div className="col-span-0.5 text-right">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveExerciseFromSession(sIdx, eIdx)}
                                        className="text-slate-500 hover:text-rose-400 p-1"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Exercise Selector Trigger */}
                          <div className="pt-2 border-t border-slate-950">
                            {activeSessionIndexForAdding === sIdx ? (
                              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Search className="w-3.5 h-3.5" /> EGZERSİZ KÜTÜPHANESİNDE ARA
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setActiveSessionIndexForAdding(null)}
                                    className="text-xs text-slate-400 hover:text-white font-semibold"
                                  >
                                    Aramayı Kapat
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                  <input
                                    type="text"
                                    placeholder="Egzersiz adı ile ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                                  />

                                  <select
                                    value={filterMuscle}
                                    onChange={(e) => setFilterMuscle(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                                  >
                                    <option value="">Kas Grubu Filtresi (Tümü)</option>
                                    {allMuscles.map(m => (
                                      <option key={m} value={m}>{m.toUpperCase()}</option>
                                    ))}
                                  </select>

                                  <select
                                    value={filterEquipment}
                                    onChange={(e) => setFilterEquipment(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                                  >
                                    <option value="">Ekipman Filtresi (Tümü)</option>
                                    {allEquipments.map(e => (
                                      <option key={e} value={e}>{e.toUpperCase()}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* Results display */}
                                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                  {filteredExercises.length === 0 ? (
                                    <p className="text-[11px] text-slate-500 italic py-2">Kriterlere uygun egzersiz bulunamadı.</p>
                                  ) : (
                                    filteredExercises.slice(0, 8).map(ex => (
                                      <div key={ex.id} className="p-2 bg-slate-900 border border-slate-850 rounded-lg flex items-center justify-between gap-3 hover:border-slate-700 transition">
                                        <div className="min-w-0">
                                          <span className="font-bold text-xs text-slate-200 block truncate">{ex.name}</span>
                                          <div className="flex gap-1.5 items-center mt-0.5 text-[9px] text-slate-500">
                                            <span>Primary: <strong className="text-slate-400">{(ex.primaryMuscles || []).join(', ')}</strong></span>
                                            <span>•</span>
                                            <span>Ekipman: <strong className="text-slate-400">{Array.isArray(ex.equipment) ? ex.equipment.join(', ') : ex.equipment}</strong></span>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleAddExerciseToSession(sIdx, ex)}
                                          className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] rounded"
                                        >
                                          Seç & Ekle
                                        </button>
                                      </div>
                                    ))
                                  )}
                                  {filteredExercises.length > 8 && (
                                    <p className="text-[9px] text-slate-500 text-center italic mt-1">Daha spesifik arama yaparak diğer egzersizleri görebilirsiniz.</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveSessionIndexForAdding(sIdx);
                                  setSearchQuery('');
                                  setFilterMuscle('');
                                  setFilterEquipment('');
                                }}
                                className="py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white font-bold text-[10.5px] rounded-lg border border-slate-850 border-dashed w-full transition flex items-center justify-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" /> Bu Güne Egzersiz Ekle
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-900 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsWritingProgram(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={programSubmitting}
                    className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    {programSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    {programSubmitting ? "Program Kaydediliyor..." : "Antrenman Programını Sporcuya Ata"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Row 2: PR & Power tracking & Progressive Overload suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* PR list (Left column) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-800">
                <Award className="w-4 h-4 text-amber-400" /> Kişisel Güç Rekorları (PR)
              </h4>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {personalRecords.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-xl">
                    Kayıtlı PR verisi bulunmuyor.
                  </div>
                ) : (
                  personalRecords.map((r) => (
                    <div key={r.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block">{r.exerciseName}</span>
                          <span className="text-[9.5px] text-slate-500 block">{r.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-amber-400 block">{r.value} {r.recordType === 'max_reps' ? 'Tekrar' : 'kg'}</span>
                        <span className="text-[9px] text-slate-550 uppercase tracking-wider">
                          {r.recordType === 'max_weight' ? 'Maks Ağırlık' : r.recordType === 'max_reps' ? 'Maks Tekrar' : r.recordType === 'estimated_1rm' ? 'Tahmini 1RM' : 'Maks Hacim'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Overload Suggestions (Right column) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-800">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Progressive Overload Önerileri
              </h4>

              {(() => {
                const overloads = getProgressiveOverloadSuggestions(workoutSetEntries);
                if (overloads.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-xl">
                      Overload analizi için yeterli antrenman seti verisi bulunmuyor.
                    </div>
                  );
                }
                return (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {overloads.map((s) => (
                      <div key={s.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{s.exerciseName}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider ${
                            s.suggestionType === 'increase_weight' ? 'bg-emerald-500/10 text-emerald-400' :
                            s.suggestionType === 'increase_reps' ? 'bg-sky-500/10 text-sky-400' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                            {s.suggestionType === 'increase_weight' ? 'Ağırlık Artır' : s.suggestionType === 'increase_reps' ? 'Tekrar Artır' : 'Form Odağı'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                          <div className="bg-slate-900 p-1 rounded">
                            <span className="text-slate-500 block">Önceki</span>
                            <span className="font-bold text-slate-400">{s.currentWeight} kg x {s.currentReps} t</span>
                          </div>
                          <div className="bg-slate-900 p-1 border border-emerald-500/20 rounded">
                            <span className="text-emerald-400 font-extrabold block">Öneri</span>
                            <span className="font-bold text-emerald-400">{s.suggestedWeight} kg x {s.suggestedReps} t</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-900/30 p-1.5 rounded">
                          {s.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Nutrition Goals Setting Form */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-teal-400" /> Sporcu Beslenme ve Su Hedefleri
                </h3>
                {athleteDoc?.nutritionGoals?.setByCoachId && (
                  <button
                    type="button"
                    onClick={handleResetNutritionGoals}
                    className="text-[9px] font-black text-rose-400 hover:underline uppercase tracking-wide cursor-pointer"
                  >
                    Hedefleri Sıfırla
                  </button>
                )}
              </div>

              {athleteDoc?.nutritionGoals?.setByCoachId ? (
                <div className="bg-teal-950/20 border border-teal-500/10 text-teal-300 p-2.5 rounded-lg text-[10px] font-medium">
                  ✓ Bu sporcuya ait hedefler şu an sizin tarafınızdan yönetilmektedir.
                </div>
              ) : (
                <div className="bg-slate-950 p-2.5 rounded-lg text-[10px] text-slate-400 font-medium">
                  Sporcu şu an kendi onboarding/varsayılan hedeflerini kullanıyor. Aşağıdan özel hedefler atayabilirsiniz.
                </div>
              )}

              <form onSubmit={handleUpdateNutritionGoals} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Günlük Kalori (kcal) *
                    </label>
                    <input
                      type="number"
                      required
                      value={coachCalorieGoal}
                      onChange={(e) => setCoachCalorieGoal(e.target.value)}
                      placeholder="Örn: 2500"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Hedef Su (ml) *
                    </label>
                    <input
                      type="number"
                      required
                      value={coachWaterGoal}
                      onChange={(e) => setCoachWaterGoal(e.target.value)}
                      placeholder="Örn: 3000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Protein Hedefi (g) *
                    </label>
                    <input
                      type="number"
                      required
                      value={coachProteinGoal}
                      onChange={(e) => setCoachProteinGoal(e.target.value)}
                      placeholder="Örn: 160"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Karb Hedefi (g) *
                    </label>
                    <input
                      type="number"
                      required
                      value={coachCarbGoal}
                      onChange={(e) => setCoachCarbGoal(e.target.value)}
                      placeholder="Örn: 250"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Yağ Hedefi (g) *
                    </label>
                    <input
                      type="number"
                      required
                      value={coachFatGoal}
                      onChange={(e) => setCoachFatGoal(e.target.value)}
                      placeholder="Örn: 70"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Hedef Vücut Kilosu (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={coachTargetWeight}
                      onChange={(e) => setCoachTargetWeight(e.target.value)}
                      placeholder="Örn: 78"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-2 rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Hedefleri Güncelle
                </button>
              </form>
            </div>

            {/* Right Column: Coach Nutrition Notes and Logs */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-400" /> Beslenme & Diyet Notu Ekle
              </h3>

              <form onSubmit={handleAddNutritionCoachNote} className="space-y-3">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-0.5">
                      Tarih
                    </label>
                    <input
                      type="date"
                      required
                      value={coachNoteDate}
                      onChange={(e) => setCoachNoteDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-0.5">
                      Not / Detay *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Bu hafta karbonhidrat oranını arttır, antrenman öncesi ye."
                      value={coachNutritionNote}
                      onChange={(e) => setCoachNutritionNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Beslenme Notunu Kaydet
                </button>
              </form>

              {/* List of coach nutrition notes */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest block">KAYITLI BESLENME NOTLARINIZ:</span>
                {nutritionCoachNotes.length === 0 ? (
                  <p className="text-[10px] text-slate-500 italic">Kayıtlı bir beslenme notunuz bulunmamaktadır.</p>
                ) : (
                  nutritionCoachNotes.map((n) => (
                    <div key={n.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="bg-slate-900 border border-slate-800/80 px-1.5 py-0.5 rounded text-[9px] text-teal-400 font-bold font-mono font-normal">
                          {n.date}
                        </span>
                        <p className="text-slate-300 font-medium italic">"{n.note}"</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteNutritionNote(n.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition shrink-0 cursor-pointer animate-fade-in"
                        title="Notu Sil"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Meals & Diet entries list (bottom full width) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Sporcunun Öğün & Yemek Girişleri ({meals.length} Giriş)</h3>

            {meals.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-6 text-center bg-slate-900 border border-slate-850 rounded-xl">Herhangi bir besin kaydı bulunamadı.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {meals.map(m => (
                  <div key={m.id} className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-orange-400/10 text-orange-400 text-[9px] font-extrabold rounded">
                          {m.mealType}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold font-mono">{m.date}</span>
                      </div>
                      <span className="text-xs font-bold text-teal-400">{m.calories} kcal</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{m.foodName}</h4>
                      {m.notes && <p className="text-[10px] text-slate-450 font-medium italic mt-0.5">"{m.notes}"</p>}
                    </div>

                    {/* Macros info */}
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                      <div className="bg-slate-950 p-1.5 rounded text-center border border-slate-850/40">
                        <span className="text-rose-400 block font-bold">Protein</span>
                        <span className="text-slate-300 font-bold">{m.protein}g</span>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded text-center border border-slate-850/40">
                        <span className="text-blue-400 block font-bold">Karb</span>
                        <span className="text-slate-300 font-bold">{m.carbs}g</span>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded text-center border border-slate-850/40">
                        <span className="text-yellow-500 block font-bold">Yağ</span>
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
