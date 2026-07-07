import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/databaseService';
import { 
  GeneratedTrainingProgram, 
  TrainingCalendarEntry, 
  WorkoutSetEntry, 
  PersonalRecord, 
  ProgressPhoto, 
  RecoveryEntry, 
  DeloadSuggestion,
  Workout,
  BodyMeasurement
} from '../../types';

// Importing sub-components
import TrainingProgramGenerator from './TrainingProgramGenerator';
import TrainingCalendar from './TrainingCalendar';
import PRTracker from './PRTracker';
import RecoveryTracker from './RecoveryTracker';
import ProgressPhotosView from './ProgressPhotosView';
import ExerciseLibraryView from './ExerciseLibraryView';
import MuscleVolumeCharts from './MuscleVolumeCharts';
import ProgressReportGenerator from './ProgressReportGenerator';
import CoachProgramsView from './CoachProgramsView';
import WeeklyCheckInView from './WeeklyCheckInView';

import { 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Camera, 
  BookOpen, 
  BarChart3, 
  FileDown, 
  Loader2,
  User,
  ClipboardCheck
} from 'lucide-react';

interface TrainingCenterViewProps {
  onShowToast: (msg: string) => void;
  workouts: Workout[]; // Pass primary workouts list for report stats
}

type SubTabType = 'coach_programs' | 'generator' | 'calendar' | 'pr' | 'recovery' | 'photos' | 'library' | 'volume' | 'report' | 'checkin';

export default function TrainingCenterView({ onShowToast, workouts }: TrainingCenterViewProps) {
  const { currentUser, userProfile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('coach_programs');
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [programs, setPrograms] = useState<GeneratedTrainingProgram[]>([]);
  const [calendarEntries, setCalendarEntries] = useState<TrainingCalendarEntry[]>([]);
  const [workoutSets, setWorkoutSets] = useState<WorkoutSetEntry[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [recoveryLogs, setRecoveryLogs] = useState<RecoveryEntry[]>([]);
  const [deloadSuggestions, setDeloadSuggestions] = useState<DeloadSuggestion[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const userId = currentUser.uid;

    // Real-time snapshot listeners
    const unsubPrograms = databaseService.listenGeneratedTrainingPrograms(userId, setPrograms);
    const unsubCalendar = databaseService.listenTrainingCalendarEntries(userId, setCalendarEntries);
    const unsubSets = databaseService.listenWorkoutSetEntries(userId, setWorkoutSets);
    const unsubRecords = databaseService.listenPersonalRecords(userId, setPersonalRecords);
    const unsubPhotos = databaseService.listenProgressPhotos(userId, setProgressPhotos);
    const unsubRecovery = databaseService.listenRecoveryEntries(userId, setRecoveryLogs);
    const unsubDeload = databaseService.listenDeloadSuggestions(userId, setDeloadSuggestions);
    const unsubFavorites = databaseService.listenFavoriteExercises(userId, setFavorites);
    const unsubMeasurements = databaseService.listenBodyMeasurements(userId, setBodyMeasurements);

    // Turn off loader once initial snaps are set
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => {
      unsubPrograms();
      unsubCalendar();
      unsubSets();
      unsubRecords();
      unsubPhotos();
      unsubRecovery();
      unsubDeload();
      unsubFavorites();
      unsubMeasurements();
      clearTimeout(timer);
    };
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-xs font-semibold tracking-wider font-mono">Gelişmiş Antrenman Portalı Yükleniyor...</p>
      </div>
    );
  }

  const subTabs = [
    { id: 'coach_programs', label: 'Koçumun Programları', icon: User },
    { id: 'checkin', label: 'Haftalık Check-in', icon: ClipboardCheck },
    { id: 'generator', label: 'AI Program', icon: Sparkles },
    { id: 'calendar', label: 'Antrenman Takvimi', icon: Calendar },
    { id: 'pr', label: 'PR / Güç Takibi', icon: TrendingUp },
    { id: 'recovery', label: 'Hazırlık & Toparlanma', icon: Heart },
    { id: 'photos', label: 'Gelişim Fotoğrafları', icon: Camera },
    { id: 'library', label: 'Egzersiz Kütüphanesi', icon: BookOpen },
    { id: 'volume', label: 'Hacim Analizi', icon: BarChart3 },
    { id: 'report', label: 'PDF Raporu', icon: FileDown },
  ] as const;

  return (
    <div id="training-center-view" className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            AI Antrenman & Gelişim Merkezi <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">Premium</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
            Yapay zekâ program oluşturucu, antrenman takvimi, PR takibi, toparlanma analizleri ve kas grubu hacim verilerinizin tamamı tek bir yerde.
          </p>
        </div>
      </div>

      {/* SUB TAB SELECTOR */}
      <div className="flex overflow-x-auto pb-3 scrollbar-none gap-2 border-b border-slate-850 -mx-4 px-4 md:mx-0 md:px-0">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer select-none border shrink-0 ${
                isActive 
                  ? 'bg-emerald-400 text-slate-950 border-emerald-500 shadow-md shadow-emerald-400/10' 
                  : 'bg-slate-900/40 border-slate-850 text-slate-400 hover:text-white hover:border-slate-750'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ACTIVE SUB TAB CONTENT */}
      <div className="mt-6">
        {activeSubTab === 'coach_programs' && (
          <CoachProgramsView 
            userId={currentUser?.uid || ''} 
            programs={programs}
            onShowToast={onShowToast}
          />
        )}

        {activeSubTab === 'checkin' && (
          <WeeklyCheckInView 
            userId={currentUser?.uid || ''} 
            coachId={userProfile?.coachId}
            onShowToast={onShowToast}
          />
        )}

        {activeSubTab === 'generator' && (
          <TrainingProgramGenerator 
            userId={currentUser?.uid || ''} 
            programs={programs}
            userSettings={userProfile?.settings}
            onShowToast={onShowToast} 
          />
        )}

        {activeSubTab === 'calendar' && (
          <TrainingCalendar 
            userId={currentUser?.uid || ''} 
            entries={calendarEntries} 
            activeProgram={programs.find(p => p.isActive)}
            onShowToast={onShowToast} 
          />
        )}

        {activeSubTab === 'pr' && (
          <PRTracker 
            userId={currentUser?.uid || ''} 
            personalRecords={personalRecords} 
            workoutSets={workoutSets}
            deloadSuggestions={deloadSuggestions}
            onShowToast={onShowToast} 
          />
        )}

        {activeSubTab === 'recovery' && (
          <RecoveryTracker 
            userId={currentUser?.uid || ''} 
            recoveryLogs={recoveryLogs} 
            workoutSets={workoutSets} 
            deloadSuggestions={deloadSuggestions} 
            onShowToast={onShowToast} 
          />
        )}

        {activeSubTab === 'photos' && (
          <ProgressPhotosView 
            userId={currentUser?.uid || ''} 
            photos={progressPhotos} 
            onShowToast={onShowToast} 
          />
        )}

        {activeSubTab === 'library' && (
          <ExerciseLibraryView 
            userId={currentUser?.uid || ''} 
            favorites={favorites} 
            onShowToast={onShowToast} 
          />
        )}

        {activeSubTab === 'volume' && (
          <MuscleVolumeCharts 
            workoutSets={workoutSets} 
          />
        )}

        {activeSubTab === 'report' && (
          <ProgressReportGenerator 
            username={userProfile?.name || 'Sporcu'} 
            userSettings={userProfile?.settings}
            workouts={workouts} 
            measurements={bodyMeasurements}
            personalRecords={personalRecords}
            recoveryLogs={recoveryLogs}
            onShowToast={onShowToast} 
          />
        )}
      </div>
    </div>
  );
}
