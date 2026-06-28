/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { databaseService } from './services/databaseService';
import { UserSettings, Workout, WeightEntry, BodyMeasurement, MealEntry, WaterEntry } from './types';

// Auth Components
import LoginView from './components/auth/LoginView';
import RegisterView from './components/auth/RegisterView';

// Coach Components
import CoachDashboard from './components/coach/CoachDashboard';
import MyAthletesList from './components/coach/MyAthletesList';
import AthleteDetailsView from './components/coach/AthleteDetailsView';

// Athlete Components
import ConnectCoachView from './components/athlete/ConnectCoachView';
import TrainingCenterView from './components/athlete/TrainingCenterView';

// Existing Views
import DashboardView from './components/DashboardView';
import WorkoutsView from './components/WorkoutsView';
import WeightView from './components/WeightView';
import MeasurementsView from './components/MeasurementsView';
import NutritionView from './components/NutritionView';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';

import {
  LayoutDashboard,
  Dumbbell,
  Ruler,
  Scale,
  Zap,
  BarChart3,
  Settings,
  X,
  BellRing,
  Award,
  Users,
  LogOut,
  Sparkles,
  Link,
  Loader2
} from 'lucide-react';

type TabType = 'dashboard' | 'workouts' | 'measurements' | 'weight' | 'nutrition' | 'stats' | 'settings' | 'coach-connect' | 'training-center';
type CoachTabType = 'coach-dashboard' | 'coach-athletes' | 'coach-athlete-detail' | 'settings';

function MainApp() {
  const { currentUser, userProfile, logout, reloadProfile } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeCoachTab, setActiveCoachTab] = useState<CoachTabType>('coach-dashboard');
  const [prevCoachTab, setPrevCoachTab] = useState<CoachTabType>('coach-dashboard');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');

  // Application Data States (for Athletes)
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);

  // Coach-specific related data (notes/goals of athlete if loaded)
  const [coachProfile, setCoachProfile] = useState<any | null>(null);
  const [coachNotes, setCoachNotes] = useState<any[]>([]);
  const [coachGoals, setCoachGoals] = useState<any[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick actions signals
  const [quickActionWorkout, setQuickActionWorkout] = useState(false);
  const [quickActionWeight, setQuickActionWeight] = useState(false);
  const [quickActionMeasurement, setQuickActionMeasurement] = useState(false);
  const [quickActionMeal, setQuickActionMeal] = useState(false);

  // Firebase Real-time listeners hook for active athlete
  useEffect(() => {
    if (!currentUser || userProfile?.role !== 'athlete') {
      setWorkouts([]);
      setWeightEntries([]);
      setBodyMeasurements([]);
      setMeals([]);
      setWaterEntries([]);
      setCoachNotes([]);
      setCoachGoals([]);
      setCoachProfile(null);
      return;
    }

    const userId = currentUser.uid;

    // Listen child collections with snapshots
    const unsubWorkouts = databaseService.listenWorkouts(userId, setWorkouts);
    const unsubWeights = databaseService.listenWeightEntries(userId, setWeightEntries);
    const unsubMeasurements = databaseService.listenBodyMeasurements(userId, setBodyMeasurements);
    const unsubMeals = databaseService.listenMealEntries(userId, setMeals);
    const unsubWater = databaseService.listenWaterEntries(userId, setWaterEntries);
    const unsubNotes = databaseService.listenCoachNotes(userId, setCoachNotes);
    const unsubGoals = databaseService.listenCoachGoals(userId, setCoachGoals);

    return () => {
      unsubWorkouts();
      unsubWeights();
      unsubMeasurements();
      unsubMeals();
      unsubWater();
      unsubNotes();
      unsubGoals();
    };
  }, [currentUser, userProfile?.role]);

  // Read trainer profile details when connected
  useEffect(() => {
    if (!userProfile?.coachId || userProfile?.role !== 'athlete') {
      setCoachProfile(null);
      return;
    }

    databaseService.getUserProfile(userProfile.coachId)
      .then(profile => {
        setCoachProfile(profile);
      })
      .catch(err => {
        console.error(err);
      });
  }, [userProfile?.coachId, userProfile?.role]);

  // Translate user settings from profile
  const athleteSettings = useMemo((): UserSettings => {
    if (!userProfile) {
      return {
        nickname: 'Sporcu',
        gender: 'Erkek',
        height: 180,
        currentWeight: 80,
        targetWeight: 75,
        weeklyWorkoutTarget: 4,
        dailyCalorieGoal: 2500,
        dailyWaterGoal: 3000,
        activityLevel: 'Orta',
        theme: 'dark',
        createdAt: new Date().toISOString(),
      };
    }
    return {
      nickname: userProfile.name || 'Sporcu',
      gender: userProfile.gender || 'Erkek',
      height: userProfile.height || 180,
      currentWeight: userProfile.currentWeight || 84,
      targetWeight: userProfile.targetWeight || 80,
      weeklyWorkoutTarget: userProfile.weeklyWorkoutTarget || 4,
      dailyCalorieGoal: userProfile.dailyCalorieGoal || 2500,
      dailyWaterGoal: userProfile.dailyWaterGoal || 3000,
      activityLevel: userProfile.activityLevel || 'Orta',
      theme: userProfile.theme || 'dark',
      createdAt: userProfile.createdAt || new Date().toISOString(),
    };
  }, [userProfile]);

  // Toast trigger
  const showToast = (message: string) => {
    setToastMessage(message);
  };

  // Close toast automatically after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Water adjustments
  const handleAddWater = async (amountMl: number) => {
    if (!currentUser) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const existing = waterEntries.find(w => w.date === todayStr);
    const targetAmount = (existing?.amountMl || 0) + amountMl;

    try {
      await databaseService.saveSingleWaterEntry(todayStr, targetAmount, currentUser.uid);
      showToast(`İçilen suya +${amountMl} ml başarıyla eklendi! 💧`);
    } catch (err) {
      console.error(err);
      showToast('Su verisi kaydedilirken hata oluştu.');
    }
  };

  const handleResetWater = async () => {
    if (!currentUser) return;
    if (confirm('Bugünkü su tüketim bilginizi sıfırlamak istiyor musunuz?')) {
      const todayStr = new Date().toISOString().split('T')[0];
      try {
        await databaseService.saveSingleWaterEntry(todayStr, 0, currentUser.uid);
        showToast('Bugünkü su girişiniz sıfırlandı.');
      } catch (err) {
        console.error(err);
        showToast('Su verisi sıfırlanırken hata oluştu.');
      }
    }
  };

  // Quick actions trigger from Dashboard
  const handleQuickAction = (actionType: 'workout' | 'weight' | 'measurement' | 'meal') => {
    switch (actionType) {
      case 'workout':
        setQuickActionWorkout(true);
        setActiveTab('workouts');
        break;
      case 'weight':
        setQuickActionWeight(true);
        setActiveTab('weight');
        break;
      case 'measurement':
        setQuickActionMeasurement(true);
        setActiveTab('measurements');
        break;
      case 'meal':
        setQuickActionMeal(true);
        setActiveTab('nutrition');
        break;
    }
  };

  // Settings updating hooks
  const handleUpdateSettings = async (updated: UserSettings) => {
    if (!currentUser) return;
    try {
      await databaseService.saveUserProfile(currentUser.uid, {
        name: updated.nickname,
        gender: updated.gender,
        height: updated.height,
        currentWeight: updated.currentWeight,
        targetWeight: updated.targetWeight,
        weeklyWorkoutTarget: updated.weeklyWorkoutTarget,
        dailyCalorieGoal: updated.dailyCalorieGoal,
        dailyWaterGoal: updated.dailyWaterGoal,
        activityLevel: updated.activityLevel,
      });
      showToast('Profil ayarlarınız bulut veritabanında güncellendi! 🌐');
      reloadProfile();
    } catch (err) {
      console.error(err);
      showToast('Profil güncellenirken hata oluştu.');
    }
  };

  // Reset demo / clean
  const handleResetData = async () => {
    if (confirm('DİKKAT: Hesabınıza bağlı tüm verileriniz kalıcı olarak sıfırlanacaktır. Emin misiniz?')) {
      try {
        // Delete all workouts of user
        for (const w of workouts) {
          await databaseService.deleteWorkout(w.id);
        }
        for (const wt of weightEntries) {
          await databaseService.deleteWeightEntry(wt.id);
        }
        for (const m of bodyMeasurements) {
          await databaseService.deleteBodyMeasurement(m.id);
        }
        for (const ml of meals) {
          await databaseService.deleteMealEntry(ml.id);
        }
        for (const wat of waterEntries) {
          await databaseService.saveSingleWaterEntry(wat.date, 0, currentUser.uid);
        }
        showToast('Verileriniz tamamen sıfırlandı.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleExportData = () => {
    // Generate JSON local mirror
    const exportObj = {
      fittrack_applet_version: '2.0.0',
      user: userProfile,
      workouts,
      weightEntries,
      bodyMeasurements,
      meals,
      waterEntries
    };
    const jsonStr = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittrack_cloud_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Yedek dosyanız indirildi 💾');
  };

  const handleImportData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.workouts) {
        parsed.workouts.forEach((w: any) => databaseService.saveWorkout(w, currentUser!.uid));
      }
      if (parsed.weightEntries) {
        parsed.weightEntries.forEach((w: any) => databaseService.saveWeightEntry(w, currentUser!.uid));
      }
      showToast('Kayıtlı yedek veritabanına aktarıldı!');
      return true;
    } catch {
      showToast('Yedek aktarma başarısız.');
      return false;
    }
  };

  // Helper to extract a clean string from JSON-stringified firestore errors
  const getFriendlyErrorMessage = (err: any): string => {
    if (err instanceof Error) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed && typeof parsed === 'object' && parsed.error) {
          return parsed.error;
        }
      } catch {
        return err.message;
      }
      return err.message;
    }
    return String(err);
  };

  // Child changes direct synchronizations
  const handleSaveWorkouts = async (updated: Workout[]) => {
    if (!currentUser) return;
    try {
      if (updated.length > workouts.length) {
        const added = updated.find(u => !workouts.some(w => w.id === u.id));
        if (added) await databaseService.saveWorkout(added, currentUser.uid);
      } else if (updated.length < workouts.length) {
        const removed = workouts.find(w => !updated.some(u => u.id === w.id));
        if (removed) await databaseService.deleteWorkout(removed.id);
      } else {
        const edited = updated.find(u => {
          const match = workouts.find(w => w.id === u.id);
          return match && JSON.stringify(match) !== JSON.stringify(u);
        });
        if (edited) await databaseService.saveWorkout(edited, currentUser.uid);
      }
    } catch (err) {
      console.error(err);
      showToast(`Antrenman kaydedilemedi: ${getFriendlyErrorMessage(err)}`);
    }
  };

  const handleSaveWeightEntries = async (updated: WeightEntry[]) => {
    if (!currentUser) return;
    try {
      if (updated.length > weightEntries.length) {
        const added = updated.find(u => !weightEntries.some(w => w.id === u.id));
        if (added) await databaseService.saveWeightEntry(added, currentUser.uid);
      } else if (updated.length < weightEntries.length) {
        const removed = weightEntries.find(w => !updated.some(u => u.id === w.id));
        if (removed) await databaseService.deleteWeightEntry(removed.id);
      } else {
        const edited = updated.find(u => {
          const match = weightEntries.find(w => w.id === u.id);
          return match && JSON.stringify(match) !== JSON.stringify(u);
        });
        if (edited) await databaseService.saveWeightEntry(edited, currentUser.uid);
      }
    } catch (err) {
      console.error(err);
      showToast(`Ağırlık kaydedilemedi: ${getFriendlyErrorMessage(err)}`);
    }
  };

  const handleSaveBodyMeasurements = async (updated: BodyMeasurement[]) => {
    if (!currentUser) return;
    try {
      if (updated.length > bodyMeasurements.length) {
        const added = updated.find(u => !bodyMeasurements.some(w => w.id === u.id));
        if (added) await databaseService.saveBodyMeasurement(added, currentUser.uid);
      } else if (updated.length < bodyMeasurements.length) {
        const removed = bodyMeasurements.find(w => !updated.some(u => u.id === w.id));
        if (removed) await databaseService.deleteBodyMeasurement(removed.id);
      } else {
        const edited = updated.find(u => {
          const match = bodyMeasurements.find(w => w.id === u.id);
          return match && JSON.stringify(match) !== JSON.stringify(u);
        });
        if (edited) await databaseService.saveBodyMeasurement(edited, currentUser.uid);
      }
    } catch (err) {
      console.error(err);
      showToast(`Ölçüm kaydedilemedi: ${getFriendlyErrorMessage(err)}`);
    }
  };

  const handleSaveMeals = async (updated: MealEntry[]) => {
    if (!currentUser) return;
    try {
      if (updated.length > meals.length) {
        const added = updated.find(u => !meals.some(w => w.id === u.id));
        if (added) await databaseService.saveMealEntry(added, currentUser.uid);
      } else if (updated.length < meals.length) {
        const removed = meals.find(w => !updated.some(u => u.id === w.id));
        if (removed) await databaseService.deleteMealEntry(removed.id);
      } else {
        const edited = updated.find(u => {
          const match = meals.find(w => w.id === u.id);
          return match && JSON.stringify(match) !== JSON.stringify(u);
        });
        if (edited) await databaseService.saveMealEntry(edited, currentUser.uid);
      }
    } catch (err) {
      console.error(err);
      showToast(`Öğün kaydedilemedi: ${getFriendlyErrorMessage(err)}`);
    }
  };

  const handleToggleGoalStatus = async (goalId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      await databaseService.updateCoachGoalStatus(goalId, nextStatus);
      showToast('Hedef durumu başarıyla güncellendi!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      await logout();
      showToast('Oturum sonlandırıldı.');
    }
  };

  // CHECK AUTH STATE CONTROL FLOWS
  if (!currentUser) {
    return isRegistering ? (
      <RegisterView onToggleToLogin={() => setIsRegistering(false)} onShowToast={showToast} />
    ) : (
      <LoginView onToggleToRegister={() => setIsRegistering(true)} onShowToast={showToast} />
    );
  }

  // 1. COACH PORTAL LAYOUT BOARD
  if (userProfile?.role === 'coach') {
    const coachNavItems = [
      { id: 'coach-dashboard', label: 'Koç Paneli', icon: LayoutDashboard },
      { id: 'coach-athletes', label: 'Sporcularım', icon: Users },
      { id: 'settings', label: 'Profil Ayarları', icon: Settings },
    ] as const;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
        {/* TOAST SYSTEM */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className="bg-slate-900 border border-emerald-500/30 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3 backdrop-blur-md">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <BellRing className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 text-xs font-semibold leading-normal pt-1">{toastMessage}</div>
              <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white shrink-0"><X className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* BACKGROUND EFFECT */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_40%)] pointer-events-none" />

        {/* SIDEBAR FOR COACH */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 hidden md:flex flex-col justify-between sticky top-0 h-screen z-20">
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black">
                <Dumbbell className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-widest text-white uppercase leading-none">FitTrack</h2>
                <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">COACH SYSTEM</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5 pt-3">
              {coachNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeCoachTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveCoachTab(item.id);
                    }}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition group cursor-pointer ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-850 bg-slate-950/40 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                {userProfile?.name?.charAt(0).toUpperCase() || 'K'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-200 truncate">{userProfile?.name || 'Koç'}</p>
                <span className="text-[9px] text-emerald-400 font-extrabold uppercase">Eğitmen</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 bg-slate-850 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 rounded-xl transition duration-150 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Oturumu Kapat
            </button>
          </div>
        </aside>

        {/* MOBILE HEADER */}
        <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-20 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center text-slate-950"><Dumbbell className="w-4 h-4 text-slate-950" /></div>
            <h1 className="text-xs font-black text-white tracking-widest uppercase">FitTrack AI - Coach</h1>
          </div>
          <button onClick={handleLogout} className="p-2 bg-slate-950 text-slate-400 hover:text-rose-400 rounded-lg"><LogOut className="w-4 h-4" /></button>
        </header>

        {/* VIEW ENGINE FOR COACH */}
        <main className="flex-1 overflow-x-hidden relative h-auto z-10 flex flex-col min-h-[calc(100vh-120px)] md:min-h-screen">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-1 pb-24 md:pb-8">
            {activeCoachTab === 'coach-dashboard' && (
              <CoachDashboard
                onSelectAthlete={(athleteId) => {
                  setSelectedAthleteId(athleteId);
                  setPrevCoachTab('coach-dashboard');
                  setActiveCoachTab('coach-athlete-detail');
                }}
                onNavigateToAthletes={() => setActiveCoachTab('coach-athletes')}
                onShowToast={showToast}
              />
            )}

            {activeCoachTab === 'coach-athletes' && (
              <MyAthletesList
                onSelectAthlete={(athleteId) => {
                  setSelectedAthleteId(athleteId);
                  setPrevCoachTab('coach-athletes');
                  setActiveCoachTab('coach-athlete-detail');
                }}
                onShowToast={showToast}
              />
            )}

            {activeCoachTab === 'coach-athlete-detail' && (
              <AthleteDetailsView
                athleteId={selectedAthleteId}
                onBack={() => setActiveCoachTab(prevCoachTab)}
                onShowToast={showToast}
              />
            )}

            {activeCoachTab === 'settings' && (
              <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">Koç Bilgileri</h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                      <span className="text-slate-500 block">Davet Kodunuz:</span>
                      <span className="text-lg font-mono font-black text-emerald-400 tracking-wider">
                        {userProfile?.inviteCode}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                      <span className="text-slate-500 block">Ad Soyad:</span>
                      <span className="text-slate-200 font-bold">{userProfile?.name}</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                      <span className="text-slate-500 block">E-posta Adresi:</span>
                      <span className="text-slate-200 font-bold">{userProfile?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer"
                  >
                    Oturumu Güvenli Kapat
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* MOBILE NAVIGATION FOR COACH */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 flex justify-around p-1 shadow-lg">
          {coachNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCoachTab === item.id || (item.id === 'coach-dashboard' && activeCoachTab === 'coach-athlete-detail');
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveCoachTab(item.id);
                }}
                className={`flex flex-col items-center gap-1 py-2 px-1.5 flex-1 transition cursor-pointer select-none ${
                  isActive ? 'text-emerald-400 font-extrabold' : 'text-slate-450 hover:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[9px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // 2. ATHLETE PORTAL NAVIGATION CONTROLLER
  const navItems = [
    { id: 'dashboard', label: 'Takiplerim', icon: LayoutDashboard },
    { id: 'training-center', label: 'AI Antrenman & Gelişim', icon: Sparkles },
    { id: 'workouts', label: 'Antrenmanlar', icon: Dumbbell },
    { id: 'measurements', label: 'Vücut Ölçüleri', icon: Ruler },
    { id: 'weight', label: 'Kilo Takibi', icon: Scale },
    { id: 'nutrition', label: 'Beslenme', icon: Zap },
    { id: 'stats', label: 'Analizler', icon: BarChart3 },
    { id: 'coach-connect', label: 'Koçum', icon: Users },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      {/* TOAST NOTIFICATIONS */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-slow max-w-sm">
          <div className="bg-slate-900 border border-emerald-500/30 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3.5 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <BellRing className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 text-xs font-semibold leading-normal pt-1 pr-1">{toastMessage}</div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white shrink-0"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.04),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.04),transparent_40%)] pointer-events-none" />

      {/* DESKTOP ATHLETE SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 hidden md:flex flex-col justify-between sticky top-0 h-screen z-20">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black">
              <Dumbbell className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-widest text-white uppercase leading-none">FitTrack</h2>
              <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">COACH AI</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1 pr-1 pt-2 max-h-[70vh] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-bold transition group cursor-pointer ${
                    isActive
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-850 bg-slate-950/40 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
              {userProfile?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">{userProfile?.name || 'Sporcu'}</p>
              <span className="text-[9px] text-slate-550 block font-semibold block leading-tight">Müşteri</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 bg-slate-850 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 rounded-xl transition duration-150 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* MOBILE ATHLETE HEADER */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-20 flex justify-between items-center shrink-0 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center text-slate-950"><Dumbbell className="w-4 h-4 text-slate-950" /></div>
          <h1 className="text-xs font-black text-white tracking-widest uppercase">FitTrack AI</h1>
        </div>
        <button onClick={handleLogout} className="p-2 bg-slate-950 text-slate-400 hover:text-rose-400 rounded-lg"><LogOut className="w-4 h-4" /></button>
      </header>

      {/* VIEWPORT CONTROLLER */}
      <main className="flex-1 overflow-x-hidden relative h-auto z-10 flex flex-col min-h-[calc(100vh-120px)] md:min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-1 pb-24 md:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              settings={athleteSettings}
              workouts={workouts}
              weightEntries={weightEntries}
              bodyMeasurements={bodyMeasurements}
              meals={meals}
              waterEntries={waterEntries}
              coachProfile={coachProfile}
              coachNotes={coachNotes}
              coachGoals={coachGoals}
              onAddWater={handleAddWater}
              onResetWater={handleResetWater}
              onNavigate={setActiveTab}
              onTriggerQuickAction={handleQuickAction}
              onToggleGoal={handleToggleGoalStatus}
            />
          )}

          {activeTab === 'training-center' && (
            <TrainingCenterView
              onShowToast={showToast}
              workouts={workouts}
            />
          )}

          {activeTab === 'workouts' && (
            <WorkoutsView
              workouts={workouts}
              onSaveWorkouts={handleSaveWorkouts}
              onShowToast={showToast}
              quickActionTriggered={quickActionWorkout}
              onClearQuickActionTrigger={() => setQuickActionWorkout(false)}
            />
          )}

          {activeTab === 'weight' && (
            <WeightView
              settings={athleteSettings}
              weightEntries={weightEntries}
              onSaveWeightEntries={handleSaveWeightEntries}
              onShowToast={showToast}
              quickActionTriggered={quickActionWeight}
              onClearQuickActionTrigger={() => setQuickActionWeight(false)}
            />
          )}

          {activeTab === 'measurements' && (
            <MeasurementsView
              settings={athleteSettings}
              bodyMeasurements={bodyMeasurements}
              onSaveBodyMeasurements={handleSaveBodyMeasurements}
              onShowToast={showToast}
              quickActionTriggered={quickActionMeasurement}
              onClearQuickActionTrigger={() => setQuickActionMeasurement(false)}
            />
          )}

          {activeTab === 'nutrition' && (
            <NutritionView
              settings={athleteSettings}
              meals={meals}
              onSaveMeals={handleSaveMeals}
              onShowToast={showToast}
              quickActionTriggered={quickActionMeal}
              onClearQuickActionTrigger={() => setQuickActionMeal(false)}
            />
          )}

          {activeTab === 'stats' && (
            <StatsView
              settings={athleteSettings}
              workouts={workouts}
              weightEntries={weightEntries}
              meals={meals}
              bodyMeasurements={bodyMeasurements}
            />
          )}

          {activeTab === 'coach-connect' && (
            <ConnectCoachView onShowToast={showToast} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={athleteSettings}
              onUpdateSettings={handleUpdateSettings}
              onResetData={handleResetData}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onShowToast={showToast}
            />
          )}
        </div>
      </main>

      {/* MOBILE ATHLETE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 flex justify-around p-1 shadow-lg bg-slate-900/95 backdrop-blur-md">
        {navItems.slice(0, 7).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-1 flex-1 transition cursor-pointer select-none ${
                isActive ? 'text-emerald-400 font-extrabold' : 'text-slate-450 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="text-[8.5px] truncate max-w-[50px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
