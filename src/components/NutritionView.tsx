/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MealEntry, UserSettings, MealFoodItem, FavoriteMeal, WaterEntry, NutritionCoachNote, NutritionDayStatus, NutritionGoals } from '../types';
import { foodDatabase, FoodDatabaseItem } from '../data/foodDatabase';
import { databaseService } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';
import {
  calculateDailyTotals,
  calculateRemainingMacros,
  getProgressPercent,
  calculateNutritionCompliance,
  calculateWeeklySummary
} from '../utils/nutritionCalculations';
import {
  Zap,
  Plus,
  Calendar,
  X,
  Trash2,
  Edit2,
  ListFilter, 
  Sparkles,
  Search,
  Check,
  ChevronRight,
  Sparkle,
  Droplet,
  Award,
  CheckCircle,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Heart,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface NutritionViewProps {
  settings: UserSettings;
  meals: MealEntry[];
  onSaveMeals: (meals: MealEntry[]) => void;
  onShowToast: (msg: string) => void;
  quickActionTriggered: boolean;
  onClearQuickActionTrigger: () => void;
}

type MealType = 'Kahvaltı' | 'Öğle' | 'Akşam' | 'Ara Öğün';

const MEAL_TYPES: MealType[] = ['Kahvaltı', 'Öğle', 'Akşam', 'Ara Öğün'];

export function normalizeMeal(meal: any): MealEntry {
  if (!meal) {
    meal = {};
  }
  const rawItems = Array.isArray(meal.items) ? meal.items : [];
  const normalizedItems = rawItems.map((it: any) => ({
    id: it.id || Math.random().toString(36).substring(2, 9),
    foodId: it.foodId || '',
    name: it.name || 'Yiyecek',
    amountGram: Number(it.amountGram || 100),
    calories: Number(it.calories || 0),
    protein: Number(it.protein || 0),
    carbs: Number(it.carbs || 0),
    fat: Number(it.fat || 0)
  }));

  return {
    id: meal.id || Math.random().toString(36).substring(2, 9),
    userId: meal.userId || '',
    date: meal.date || new Date().toISOString().split('T')[0],
    mealType: meal.mealType || 'Ara Öğün',
    foodName: meal.foodName || 'Öğün',
    calories: Number(meal.calories || 0) >= 0 ? Number(meal.calories || 0) : 0,
    protein: Number(meal.protein || 0) >= 0 ? Number(meal.protein || 0) : 0,
    carbs: Number(meal.carbs || 0) >= 0 ? Number(meal.carbs || 0) : 0,
    fat: Number(meal.fat || 0) >= 0 ? Number(meal.fat || 0) : 0,
    notes: meal.notes || '',
    items: normalizedItems,
    createdAt: meal.createdAt || new Date().toISOString(),
    updatedAt: meal.updatedAt || new Date().toISOString()
  };
}

export default function NutritionView({
  settings,
  meals,
  onSaveMeals,
  onShowToast,
  quickActionTriggered,
  onClearQuickActionTrigger,
}: NutritionViewProps) {
  const { userProfile } = useAuth();
  const userId = userProfile?.id;

  const [hasError, setHasError] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'today' | 'weekly'>('today');

  const [filterDate, setFilterDate] = useState(() => {
    try {
      return new Date().toISOString().split('T')[0];
    } catch {
      return '';
    }
  });

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);

  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formMealType, setFormMealType] = useState<MealType>('Ara Öğün');
  const [formNotes, setFormNotes] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<MealFoodItem[]>([]);

  // Favorite meal saving states
  const [isFavoriteChecked, setIsFavoriteChecked] = useState(false);
  const [favoriteName, setFavoriteName] = useState('');

  // Local database search fields
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [amountGram, setAmountGram] = useState<string>('100');
  const [selectedFoodDbItem, setSelectedFoodDbItem] = useState<FoodDatabaseItem | null>(null);

  // Manual input fields inside the modal
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualAmount, setManualAmount] = useState('100');
  const [manualCalories, setManualCalories] = useState('0');
  const [manualProtein, setManualProtein] = useState('0');
  const [manualCarbs, setManualCarbs] = useState('0');
  const [manualFat, setManualFat] = useState('0');

  // Custom water log entry
  const [customWaterInput, setCustomWaterInput] = useState('');

  // Subscription-based states
  const [favoriteMeals, setFavoriteMeals] = useState<FavoriteMeal[]>([]);
  const [dayStatuses, setDayStatuses] = useState<NutritionDayStatus[]>([]);
  const [coachNotes, setCoachNotes] = useState<NutritionCoachNote[]>([]);
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);

  // Subscriptions useEffect
  React.useEffect(() => {
    if (!userId) return;

    const unsubFavorites = databaseService.listenFavoriteMeals(userId, (data) => {
      setFavoriteMeals(data);
    });

    const unsubStatuses = databaseService.listenNutritionDayStatuses(userId, (data) => {
      setDayStatuses(data);
    });

    const unsubNotes = databaseService.listenNutritionCoachNotes(userId, (data) => {
      setCoachNotes(data);
    });

    const unsubWater = databaseService.listenWaterEntries(userId, (data) => {
      setWaterEntries(data);
    });

    return () => {
      unsubFavorites();
      unsubStatuses();
      unsubNotes();
      unsubWater();
    };
  }, [userId]);

  // Trigger modal on dashboard click
  React.useEffect(() => {
    if (quickActionTriggered) {
      handleOpenNewModal();
      onClearQuickActionTrigger();
    }
  }, [quickActionTriggered]);

  // Safe meal list normalization
  const safeMeals = useMemo(() => {
    try {
      const source = Array.isArray(meals) ? meals : [];
      return source.map(normalizeMeal);
    } catch (err) {
      console.error("Error normalizing meals inside NutritionView:", err);
      setHasError(true);
      return [];
    }
  }, [meals]);

  const filteredMeals = useMemo(() => {
    const fDate = filterDate || new Date().toISOString().split('T')[0];
    return safeMeals.filter((meal) => meal.date === fDate);
  }, [safeMeals, filterDate]);

  // Custom premium active targets (coach-set OR standard user settings)
  const activeCalorieGoal = useMemo(() => {
    return userProfile?.nutritionGoals?.calories || Number(settings?.dailyCalorieGoal || 2000);
  }, [userProfile?.nutritionGoals?.calories, settings?.dailyCalorieGoal]);

  const activeProteinGoal = useMemo(() => {
    return userProfile?.nutritionGoals?.protein || Math.round((userProfile?.currentWeight || settings?.currentWeight || 75) * 2) || 150;
  }, [userProfile?.nutritionGoals?.protein, userProfile?.currentWeight, settings?.currentWeight]);

  const activeCarbsGoal = useMemo(() => {
    return userProfile?.nutritionGoals?.carbs || Math.round((activeCalorieGoal * 0.5) / 4) || 250;
  }, [userProfile?.nutritionGoals?.carbs, activeCalorieGoal]);

  const activeFatGoal = useMemo(() => {
    return userProfile?.nutritionGoals?.fat || Math.round((activeCalorieGoal * 0.2) / 9) || 50;
  }, [userProfile?.nutritionGoals?.fat, activeCalorieGoal]);

  const activeWaterGoal = useMemo(() => {
    return userProfile?.nutritionGoals?.waterMl || Number(settings?.dailyWaterGoal || 2500);
  }, [userProfile?.nutritionGoals?.waterMl, settings?.dailyWaterGoal]);

  const activeGoals = useMemo<NutritionGoals>(() => ({
    calories: activeCalorieGoal,
    protein: activeProteinGoal,
    carbs: activeCarbsGoal,
    fat: activeFatGoal,
    waterMl: activeWaterGoal
  }), [activeCalorieGoal, activeProteinGoal, activeCarbsGoal, activeFatGoal, activeWaterGoal]);

  // Calculate daily totals for the filtered meals
  const dailyTotals = useMemo(() => {
    return calculateDailyTotals(filteredMeals);
  }, [filteredMeals]);

  const totalCalories = useMemo(() => Math.round(dailyTotals.calories), [dailyTotals]);
  const totalProtein = useMemo(() => Number(dailyTotals.protein.toFixed(1)), [dailyTotals]);
  const totalCarbs = useMemo(() => Number(dailyTotals.carbs.toFixed(1)), [dailyTotals]);
  const totalFat = useMemo(() => Number(dailyTotals.fat.toFixed(1)), [dailyTotals]);

  // Current day water consumption
  const todayWaterAmount = useMemo(() => {
    const fDate = filterDate || new Date().toISOString().split('T')[0];
    return waterEntries
      .filter((w) => w.date === fDate)
      .reduce((sum, w) => sum + Number(w.amountMl || 0), 0);
  }, [waterEntries, filterDate]);

  // Goal progress calculations
  const caloriePercent = useMemo(() => getProgressPercent(totalCalories, activeCalorieGoal), [totalCalories, activeCalorieGoal]);
  const proteinPercent = useMemo(() => getProgressPercent(totalProtein, activeProteinGoal), [totalProtein, activeProteinGoal]);
  const carbsPercent = useMemo(() => getProgressPercent(totalCarbs, activeCarbsGoal), [totalCarbs, activeCarbsGoal]);
  const fatPercent = useMemo(() => getProgressPercent(totalFat, activeFatGoal), [totalFat, activeFatGoal]);
  const waterPercent = useMemo(() => getProgressPercent(todayWaterAmount, activeWaterGoal), [todayWaterAmount, activeWaterGoal]);

  // Day status completion checks
  const isDayCompleted = useMemo(() => {
    const fDate = filterDate || new Date().toISOString().split('T')[0];
    return dayStatuses.some((status) => status.date === fDate && status.completed);
  }, [dayStatuses, filterDate]);

  // Coach notes
  const todayCoachNotes = useMemo(() => {
    const fDate = filterDate || new Date().toISOString().split('T')[0];
    return coachNotes.filter((note) => note.date === fDate);
  }, [coachNotes, filterDate]);

  // Compliance score
  const complianceScore = useMemo(() => {
    return calculateNutritionCompliance(dailyTotals, activeGoals);
  }, [dailyTotals, activeGoals]);

  // Today's remaining calculation
  const remainingMacros = useMemo(() => {
    return calculateRemainingMacros(dailyTotals, activeGoals, todayWaterAmount);
  }, [dailyTotals, activeGoals, todayWaterAmount]);

  // Search Results inside the database
  const searchedFoodItems = useMemo(() => {
    if (!foodSearchQuery.trim()) return [];
    const query = foodSearchQuery.toLowerCase().trim();
    return foodDatabase.filter(item => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (Array.isArray(item.keywords) && item.keywords.some(kw => kw.toLowerCase().includes(query)))
      );
    }).slice(0, 5);
  }, [foodSearchQuery]);

  // Derived current modal form meal totals
  const calculatedTotalCalories = useMemo(() => {
    return Math.round(selectedFoods.reduce((sum, item) => sum + Number(item.calories || 0), 0));
  }, [selectedFoods]);

  const calculatedTotalProtein = useMemo(() => {
    return Number(selectedFoods.reduce((sum, item) => sum + Number(item.protein || 0), 0).toFixed(1));
  }, [selectedFoods]);

  const calculatedTotalCarbs = useMemo(() => {
    return Number(selectedFoods.reduce((sum, item) => sum + Number(item.carbs || 0), 0).toFixed(1));
  }, [selectedFoods]);

  const calculatedTotalFat = useMemo(() => {
    return Number(selectedFoods.reduce((sum, item) => sum + Number(item.fat || 0), 0).toFixed(1));
  }, [selectedFoods]);

  // Toggle Day Complete Handlers
  const handleToggleDayComplete = async () => {
    if (!userId) return;
    const fDate = filterDate || new Date().toISOString().split('T')[0];
    try {
      const targetState = !isDayCompleted;
      await databaseService.saveNutritionDayStatus({
        id: `${userId}_${fDate}`,
        userId,
        date: fDate,
        completed: targetState,
        completedAt: targetState ? new Date().toISOString() : undefined
      });
      onShowToast(targetState ? "Harika! Gün başarıyla tamamlandı olarak işaretlendi! 🎉" : "Gün tamamlanma durumu geri alındı.");
    } catch (err) {
      console.error("handleToggleDayComplete error:", err);
      onShowToast("Durum güncellenirken bir hata oluştu.");
    }
  };

  // Water log handlers
  const handleAddWater = async (amount: number) => {
    if (!userId) return;
    const fDate = filterDate || new Date().toISOString().split('T')[0];
    try {
      const entry: WaterEntry = {
        id: Math.random().toString(36).substring(2, 9),
        userId,
        date: fDate,
        amountMl: amount,
        createdAt: new Date().toISOString()
      };
      await databaseService.saveWaterEntry(entry);
      onShowToast(`${amount} ml su başarıyla eklendi! 💧`);
    } catch (err) {
      console.error("handleAddWater error:", err);
      onShowToast("Su kaydedilirken hata oluştu.");
    }
  };

  const handleCustomWaterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customWaterInput) || 0;
    if (amount <= 0) return;
    await handleAddWater(amount);
    setCustomWaterInput('');
  };

  const handleClearWater = async () => {
    if (!userId) return;
    const fDate = filterDate || new Date().toISOString().split('T')[0];
    if (confirm("Bu güne ait tüm su kayıtlarını temizlemek istediğinizden emin misiniz?")) {
      try {
        const todayEntries = waterEntries.filter((w) => w.date === fDate);
        for (const entry of todayEntries) {
          if (entry.id) {
            await databaseService.deleteWaterEntry(entry.id);
          }
        }
        onShowToast("Tüm su kayıtları temizlendi.");
      } catch (err) {
        console.error("handleClearWater error:", err);
      }
    }
  };

  // Modal actions
  const handleOpenNewModal = () => {
    const defaultDate = filterDate || new Date().toISOString().split('T')[0];
    setEditingMeal(null);
    setFormDate(defaultDate);
    setFormMealType('Ara Öğün');
    setFormNotes('');
    setSelectedFoods([]);
    setFoodSearchQuery('');
    setAmountGram('100');
    setSelectedFoodDbItem(null);
    setIsManualMode(false);
    setIsFavoriteChecked(false);
    setFavoriteName('');
    clearManualItemInputs();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (meal: MealEntry) => {
    const safeM = normalizeMeal(meal);
    setEditingMeal(safeM);
    setFormDate(safeM.date);
    setFormMealType(safeM.mealType);
    setFormNotes(safeM.notes || '');

    const parsedItems = Array.isArray(safeM.items) && safeM.items.length > 0
      ? safeM.items
      : [{
          id: Math.random().toString(36).substring(2, 9),
          name: safeM.foodName || 'Öğün',
          amountGram: 100,
          calories: Number(safeM.calories || 0),
          protein: Number(safeM.protein || 0),
          carbs: Number(safeM.carbs || 0),
          fat: Number(safeM.fat || 0)
        }];

    setSelectedFoods(parsedItems);
    setFoodSearchQuery('');
    setAmountGram('100');
    setSelectedFoodDbItem(null);
    setIsManualMode(false);
    setIsFavoriteChecked(false);
    setFavoriteName('');
    clearManualItemInputs();
    setIsModalOpen(true);
  };

  const clearManualItemInputs = () => {
    setManualName('');
    setManualAmount('100');
    setManualCalories('');
    setManualProtein('');
    setManualCarbs('');
    setManualFat('');
  };

  const handleDeleteMeal = (id: string) => {
    if (!id) return;
    if (confirm('Bu öğün kaydını silmek istediğinizden emin misiniz?')) {
      const updated = safeMeals.filter((m) => m.id !== id);
      onSaveMeals(updated.map(normalizeMeal));
      onShowToast('Öğe günlükten silindi.');
    }
  };

  const handleAddFoodToMeal = () => {
    if (isManualMode) {
      if (!manualName.trim()) {
        alert('Lütfen geçerli bir yiyecek adı girin.');
        return;
      }
      const rawCal = parseFloat(manualCalories) || 0;
      const rawProt = parseFloat(manualProtein) || 0;
      const rawCarbs = parseFloat(manualCarbs) || 0;
      const rawFat = parseFloat(manualFat) || 0;
      const rawAmt = parseFloat(manualAmount) || 100;

      const newItem: MealFoodItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: manualName.trim(),
        amountGram: rawAmt,
        calories: Math.round(rawCal),
        protein: Number(rawProt.toFixed(1)),
        carbs: Number(rawCarbs.toFixed(1)),
        fat: Number(rawFat.toFixed(1))
      };

      setSelectedFoods(prev => [...prev, newItem]);
      clearManualItemInputs();
      onShowToast('Yiyecek öğüne eklendi (Manuel).');
    } else {
      if (!selectedFoodDbItem) {
        alert('Lütfen arama sonucundan bir yiyecek seçin.');
        return;
      }
      const amtNum = parseFloat(amountGram) || 100;
      const factor = amtNum / selectedFoodDbItem.servingGram;

      const newItem: MealFoodItem = {
        id: Math.random().toString(36).substring(2, 9),
        foodId: selectedFoodDbItem.id,
        name: selectedFoodDbItem.name,
        amountGram: amtNum,
        calories: Math.round(selectedFoodDbItem.calories * factor),
        protein: Number((selectedFoodDbItem.protein * factor).toFixed(1)),
        carbs: Number((selectedFoodDbItem.carbs * factor).toFixed(1)),
        fat: Number((selectedFoodDbItem.fat * factor).toFixed(1))
      };

      setSelectedFoods(prev => [...prev, newItem]);
      setSelectedFoodDbItem(null);
      setFoodSearchQuery('');
      setAmountGram('100');
      onShowToast('Yiyecek öğüne başarıyla eklendi.');
    }
  };

  const handleRemoveFoodFromMeal = (itemId: string) => {
    setSelectedFoods(prev => prev.filter(item => item.id !== itemId));
    onShowToast('Yiyecek listeden kaldırıldı.');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFoods.length === 0) {
      alert('Lütfen kaydetmeden önce öğüne en az bir yiyecek ekleyin.');
      return;
    }

    const combinedFoodsText = selectedFoods.map(it => `${it.name} (${it.amountGram}g)`).join(', ');

    const payload: MealEntry = {
      id: editingMeal ? editingMeal.id : Math.random().toString(36).substring(2, 9),
      userId: editingMeal?.userId || userId || '',
      date: formDate || new Date().toISOString().split('T')[0],
      mealType: formMealType || 'Ara Öğün',
      foodName: combinedFoodsText,
      calories: calculatedTotalCalories,
      protein: calculatedTotalProtein,
      carbs: calculatedTotalCarbs,
      fat: calculatedTotalFat,
      notes: formNotes.trim(),
      items: selectedFoods
    };

    let updatedList: MealEntry[];
    if (editingMeal) {
      updatedList = safeMeals.map((m) => (m.id === editingMeal.id ? payload : m));
      onShowToast('Öğün kaydı başarıyla güncellendi.');
    } else {
      updatedList = [payload, ...safeMeals];
      onShowToast('Yeni öğün günlük kaydına eklendi.');
    }

    // Save Favorite meal if checkbox checked
    if (isFavoriteChecked && userId) {
      if (!favoriteName.trim()) {
        alert("Lütfen favori öğün için bir isim girin.");
        return;
      }
      const favPayload: FavoriteMeal = {
        id: Math.random().toString(36).substring(2, 9),
        userId,
        name: favoriteName.trim(),
        mealType: formMealType,
        items: selectedFoods,
        calories: calculatedTotalCalories,
        protein: calculatedTotalProtein,
        carbs: calculatedTotalCarbs,
        fat: calculatedTotalFat,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      databaseService.saveFavoriteMeal(favPayload).catch(err => {
        console.error("Error saving favorite meal:", err);
      });
    }

    onSaveMeals(updatedList.map(normalizeMeal));
    setFilterDate(formDate || new Date().toISOString().split('T')[0]);
    setIsModalOpen(false);
  };

  // Quick action to add custom favorite meal to daily log
  const handleQuickAddFavorite = (fav: FavoriteMeal) => {
    if (!userId) return;
    const defaultDate = filterDate || new Date().toISOString().split('T')[0];

    const payload: MealEntry = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      date: defaultDate,
      mealType: fav.mealType,
      foodName: fav.name,
      calories: fav.calories,
      protein: fav.protein,
      carbs: fav.carbs,
      fat: fav.fat,
      notes: 'Favorilerden hızlı eklendi.',
      items: fav.items || []
    };

    const updatedList = [payload, ...safeMeals];
    onSaveMeals(updatedList.map(normalizeMeal));
    onShowToast(`"${fav.name}" favori öğününüz bugüne başarıyla eklendi! ✨`);
  };

  // Delete favorite meal
  const handleDeleteFavoriteMeal = async (favId: string) => {
    if (confirm("Bu favori öğünü silmek istediğinizden emin misiniz?")) {
      try {
        await databaseService.deleteFavoriteMeal(favId);
        onShowToast("Favori öğün silindi.");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClearBrokenData = () => {
    if (confirm('Bozuk tüm kayıtları kalıcı olarak temizleyip sıfırlamak istiyor musunuz?')) {
      onSaveMeals([]);
      setHasError(false);
      onShowToast('Beslenme verileri sıfırlandı.');
    }
  };

  // Weekly data calculations
  const weeklySummary = useMemo(() => {
    return calculateWeeklySummary(safeMeals, waterEntries, activeGoals);
  }, [safeMeals, waterEntries, activeGoals]);

  const weeklyChartData = useMemo(() => {
    const dates: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
    }

    const mealsByDate = safeMeals.reduce<Record<string, MealEntry[]>>((acc, m) => {
      if (!acc[m.date]) acc[m.date] = [];
      acc[m.date].push(m);
      return acc;
    }, {});

    const waterByDate = waterEntries.reduce<Record<string, number>>((acc, w) => {
      acc[w.date] = (acc[w.date] || 0) + Number(w.amountMl || 0);
      return acc;
    }, {});

    return dates.map((date) => {
      const dayMeals = mealsByDate[date] || [];
      const dayTotals = calculateDailyTotals(dayMeals);
      const dayWater = waterByDate[date] || 0;

      let label = date;
      try {
        const [y, m, d] = date.split('-');
        const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
        label = `${parseInt(d)} ${months[parseInt(m) - 1]}`;
      } catch {}

      return {
        date,
        label,
        Kalori: Math.round(dayTotals.calories),
        Protein: Number(dayTotals.protein.toFixed(1)),
        Karbonhidrat: Number(dayTotals.carbs.toFixed(1)),
        Yağ: Number(dayTotals.fat.toFixed(1)),
        Su: dayWater
      };
    });
  }, [safeMeals, waterEntries]);

  if (hasError) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto text-center space-y-4 shadow-xl my-10">
        <Zap className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
        <h2 className="text-lg font-black text-white">Beslenme Verileri Yüklenemedi</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Veriler içinde uyumsuz, bozuk veya eksik alanlar içeren eski kayıtlar bulunuyor olabilir. Aşağıdaki butona tıklayarak kaydı sıfırlayabilir ya da sayfayı yenileyebilirsiniz.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Sayfayı Yenile
          </button>
          <button
            onClick={handleClearBrokenData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Bozuk Kayıtları Temizle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="nutrition-view-container">
      
      {/* Header and navigation bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-teal-400" /> Beslenme, Makro ve Su Takibi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hedeflerinize göre kalori, protein, karbonhidrat, yağ ve su tüketiminizi izleyin.
          </p>
        </div>

        {/* Section switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto shrink-0 shadow-sm">
          <button
            onClick={() => setActiveTabSection('today')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${activeTabSection === 'today' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Calendar className="w-4 h-4" /> Bugün
          </button>
          <button
            onClick={() => setActiveTabSection('weekly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${activeTabSection === 'weekly' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <BarChart2 className="w-4 h-4" /> Haftalık Analiz & Rapor
          </button>
        </div>
      </div>

      {activeTabSection === 'today' ? (
        <>
          {/* TODAY PANEL */}
          
          {/* Banner if coach has set targets */}
          {userProfile?.nutritionGoals?.setByCoachId && (
            <div className="bg-teal-950/40 border border-teal-500/20 text-teal-300 p-3.5 rounded-xl text-xs flex items-center gap-3 shadow-sm">
              <Award className="w-5 h-5 text-teal-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Koç Hedefleri Aktif</span>
                Bu beslenme ve makro hedefleri koçunuz tarafından sizin için özel olarak planlanmıştır.
              </div>
            </div>
          )}

          {/* Banner if day is completed */}
          {isDayCompleted && (
            <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 p-4 rounded-xl text-xs flex items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                <div>
                  <span className="font-bold text-white block">Tebrikler Sporcu! 🎉</span>
                  Bu günü beslenme ve makro hedeflerine uyarak başarıyla tamamladın!
                </div>
              </div>
              <button
                onClick={handleToggleDayComplete}
                className="text-[10px] font-extrabold uppercase bg-emerald-500/10 hover:bg-emerald-500/25 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 transition cursor-pointer"
              >
                Geri Al
              </button>
            </div>
          )}

          {/* Coach notes for today if any */}
          {todayCoachNotes.length > 0 && (
            <div className="bg-slate-900 border border-teal-500/20 rounded-xl p-4 space-y-2">
              <h4 className="text-[10px] font-black uppercase text-teal-400 tracking-widest flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-400" /> KOÇUNUN BUGÜN İÇİN NOTU
              </h4>
              {todayCoachNotes.map(n => (
                <p key={n.id} className="text-xs text-slate-350 leading-relaxed italic bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                  "{n.note}"
                </p>
              ))}
            </div>
          )}

          {/* Date Picker & Add Meal Action Row */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-teal-400 shrink-0" />
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-0.5">
                  Günün Tarihi
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-slate-950 text-white rounded px-3 py-1 text-sm font-semibold focus:outline-none focus:border-teal-500 border border-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Day completion toggler */}
              {!isDayCompleted && (
                <button
                  onClick={handleToggleDayComplete}
                  className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/25 font-bold px-4 py-2.5 rounded-xl transition cursor-pointer text-xs"
                >
                  ✓ Günü Tamamla
                </button>
              )}

              <button
                id="btn-add-meal-main"
                onClick={handleOpenNewModal}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer text-xs shadow-md hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4 text-slate-950" /> Öğün Ekle
              </button>
            </div>
          </div>

          {/* Premium Progress Cards (Target vs. Actual) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4" id="daily-totals-premium-card">
            {/* Calories Card */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 h-[3px] bg-teal-500" style={{ width: `${caloriePercent}%` }} />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Kalori</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-teal-400 tracking-tight">{totalCalories}</span>
                  <span className="text-slate-500 text-[10px] font-bold font-mono">/ {activeCalorieGoal} kcal</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: `${caloriePercent}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 font-bold mt-1 block">%{Math.round(caloriePercent)} tamamlandı</span>
              </div>
            </div>

            {/* Protein Card */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 h-[3px] bg-rose-500" style={{ width: `${proteinPercent}%` }} />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Protein</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-rose-400 tracking-tight">{totalProtein}</span>
                  <span className="text-slate-500 text-[10px] font-bold font-mono">/ {activeProteinGoal}g</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${proteinPercent}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 font-bold mt-1 block">%{Math.round(proteinPercent)} tamamlandı</span>
              </div>
            </div>

            {/* Carbs Card */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 h-[3px] bg-blue-500" style={{ width: `${carbsPercent}%` }} />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Karb</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-blue-400 tracking-tight">{totalCarbs}</span>
                  <span className="text-slate-500 text-[10px] font-bold font-mono">/ {activeCarbsGoal}g</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${carbsPercent}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 font-bold mt-1 block">%{Math.round(carbsPercent)} tamamlandı</span>
              </div>
            </div>

            {/* Fat Card */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 h-[3px] bg-yellow-500" style={{ width: `${fatPercent}%` }} />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Yağ</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-yellow-500 tracking-tight">{totalFat}</span>
                  <span className="text-slate-500 text-[10px] font-bold font-mono">/ {activeFatGoal}g</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: `${fatPercent}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 font-bold mt-1 block">%{Math.round(fatPercent)} tamamlandı</span>
              </div>
            </div>

            {/* Water Card */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 col-span-2 lg:col-span-1 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 h-[3px] bg-blue-400" style={{ width: `${waterPercent}%` }} />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Su</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-blue-400 tracking-tight">{todayWaterAmount}</span>
                  <span className="text-slate-500 text-[10px] font-bold font-mono">/ {activeWaterGoal} ml</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400" style={{ width: `${waterPercent}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 font-bold mt-1 block">%{Math.round(waterPercent)} tamamlandı</span>
              </div>
            </div>
          </div>

          {/* Today core layout bento grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Compliance ring, Remaining macros, Water tracking widget */}
            <div className="space-y-6">
              
              {/* Compliance & Remaining stats Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-yellow-400" /> Günlük Uyum ve Kalan Makrolar
                  </h3>
                </div>

                {/* Compliance Meter */}
                <div className="flex items-center gap-4 py-1.5">
                  {/* Gauge indicator */}
                  <div className="relative w-16 h-16 shrink-0 bg-slate-950 rounded-full flex items-center justify-center border-2 border-slate-800">
                    <span className="text-sm font-extrabold text-white">{complianceScore}%</span>
                    <div className="absolute inset-0 rounded-full border-2 border-teal-500 border-t-transparent animate-spin-slow opacity-15" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Günlük Diyet Uyum Skoru</span>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">
                      {complianceScore >= 80 ? 'Harika gidiyorsun! Beslenme planına kusursuz uyum sağladın. 🌟' : 
                       complianceScore >= 50 ? 'Fena değil! Günlük hedeflere biraz daha yaklaşmak için protein ve su oranını arttır.' : 
                       'Hedeflerin oldukça gerisindesin. Öğünlerini ve su tüketimini tamamlamayı unutma.'}
                    </p>
                  </div>
                </div>

                {/* Today's Remaining (Bugün Kalan) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2.5">
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">BUGÜN KALAN DEĞERLER:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-850 flex flex-col justify-between">
                      <span className="text-slate-400 font-bold text-[9px] block">KALORİ</span>
                      <strong className={`text-base font-extrabold mt-1 font-mono ${remainingMacros.calories <= 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {remainingMacros.calories <= 0 ? 'Tamamlandı ✓' : `${remainingMacros.calories} kcal`}
                      </strong>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-850 flex flex-col justify-between">
                      <span className="text-slate-400 font-bold text-[9px] block">PROTEİN</span>
                      <strong className={`text-base font-extrabold mt-1 font-mono ${remainingMacros.protein <= 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {remainingMacros.protein <= 0 ? 'Tamamlandı ✓' : `${remainingMacros.protein} g`}
                      </strong>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-850 flex flex-col justify-between">
                      <span className="text-slate-400 font-bold text-[9px] block">KARBONHİDRAT</span>
                      <strong className={`text-base font-extrabold mt-1 font-mono ${remainingMacros.carbs <= 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {remainingMacros.carbs <= 0 ? 'Tamamlandı ✓' : `${remainingMacros.carbs} g`}
                      </strong>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-850 flex flex-col justify-between">
                      <span className="text-slate-400 font-bold text-[9px] block">YAĞ</span>
                      <strong className={`text-base font-extrabold mt-1 font-mono ${remainingMacros.fat <= 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {remainingMacros.fat <= 0 ? 'Tamamlandı ✓' : `${remainingMacros.fat} g`}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Water tracking widget card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-blue-400" /> Su Tüketim Takibi
                  </h3>
                  <button
                    onClick={handleClearWater}
                    className="text-[9px] font-extrabold text-rose-400 hover:underline uppercase tracking-wide cursor-pointer"
                  >
                    Temizle
                  </button>
                </div>

                <div className="text-center py-2 flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/20 mb-2">
                    <Droplet className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-blue-400 tracking-tight">{todayWaterAmount}</span>
                    <span className="text-slate-500 text-xs font-bold">/ {activeWaterGoal} ml</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest font-mono">💧 Günlük Kalan: {remainingMacros.waterMl} ml</span>
                </div>

                {/* Preset Water loggers */}
                <div className="grid grid-cols-3 gap-2 py-1">
                  <button
                    onClick={() => handleAddWater(250)}
                    className="py-1.5 px-2 bg-slate-950 border border-slate-850 hover:border-blue-400 rounded-lg text-[10px] text-slate-300 font-bold transition cursor-pointer"
                  >
                    +250 ml
                  </button>
                  <button
                    onClick={() => handleAddWater(500)}
                    className="py-1.5 px-2 bg-slate-950 border border-slate-850 hover:border-blue-400 rounded-lg text-[10px] text-slate-300 font-bold transition cursor-pointer"
                  >
                    +500 ml
                  </button>
                  <button
                    onClick={() => handleAddWater(750)}
                    className="py-1.5 px-2 bg-slate-950 border border-slate-850 hover:border-blue-400 rounded-lg text-[10px] text-slate-300 font-bold transition cursor-pointer"
                  >
                    +750 ml
                  </button>
                </div>

                {/* Custom Water Form */}
                <form onSubmit={handleCustomWaterSubmit} className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Miktar (ml)"
                    value={customWaterInput}
                    onChange={(e) => setCustomWaterInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-semibold font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer shrink-0"
                  >
                    Ekle
                  </button>
                </form>
              </div>

            </div>

            {/* Column 2: Chronological meal logs list */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Chronological Meal Logs list */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                    <ListFilter className="w-4 h-4 text-teal-400" /> {filterDate} Öğünleri ({filteredMeals.length})
                  </h2>
                  <span className="text-xs text-slate-400 font-semibold font-mono">Toplam: <strong>{totalCalories} kcal</strong></span>
                </div>

                <div className="overflow-y-auto max-h-[460px] space-y-2 pr-1 flex-1">
                  {filteredMeals.length === 0 ? (
                    <div className="p-10 text-center space-y-2">
                      <Zap className="w-10 h-10 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-400 font-medium">Bu tarih için kaydedilmiş herhangi bir öğün bulunmuyor.</p>
                      <button
                        onClick={handleOpenNewModal}
                        className="text-xs text-teal-400 underline font-semibold cursor-pointer"
                      >
                        İlk öğünü şimdi ekleyin
                      </button>
                    </div>
                  ) : (
                    filteredMeals.map((meal) => {
                      let badgeColor = 'bg-slate-800 text-slate-300';
                      if (meal.mealType === 'Kahvaltı') badgeColor = 'bg-orange-500/10 text-orange-400';
                      else if (meal.mealType === 'Öğle') badgeColor = 'bg-blue-500/10 text-blue-400';
                      else if (meal.mealType === 'Akşam') badgeColor = 'bg-purple-500/10 text-purple-400';
                      else if (meal.mealType === 'Ara Öğün') badgeColor = 'bg-teal-500/10 text-teal-400';

                      return (
                        <div
                          key={meal.id}
                          className="p-3.5 bg-slate-950 border border-slate-850/80 rounded-xl flex items-start justify-between gap-3"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex items-start gap-2 flex-col xs:flex-row xs:items-center">
                              <span className={`text-[9px] font-black uppercase py-0.5 px-2 rounded-full tracking-wider shrink-0 ${badgeColor}`}>
                                {meal.mealType}
                              </span>
                              <h4 className="text-xs font-bold text-slate-100 leading-relaxed">{meal.foodName}</h4>
                            </div>
                            
                            <div className="flex gap-2 flex-wrap text-[10px] text-slate-400 font-bold font-mono">
                              <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850/80 text-teal-400">
                                🔥 {meal.calories} kcal
                              </span>
                              <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850/80 text-rose-400">
                                🍗 P: {meal.protein}g
                              </span>
                              <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850/80 text-blue-400">
                                🍚 K: {meal.carbs}g
                              </span>
                              <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850/80 text-yellow-500">
                                🥑 Y: {meal.fat}g
                              </span>
                            </div>

                            {/* Display individual items if present */}
                            {Array.isArray(meal.items) && meal.items.length > 0 ? (
                              <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-850/50 space-y-1">
                                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest block">Öğün Detayları:</span>
                                {meal.items.map((it, idx) => (
                                  <div key={it.id || idx} className="text-[10px] text-slate-400 font-semibold flex justify-between gap-2 border-b border-slate-850/30 pb-0.5 last:border-b-0">
                                    <span>• {it.name} ({it.amountGram}g)</span>
                                    <span className="text-slate-500 font-mono font-normal">
                                      {it.calories}kcal | P:{it.protein}g K:{it.carbs}g Y:{it.fat}g
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : null}

                            {meal.notes ? (
                              <p className="text-[10px] text-slate-450 italic">Not: "{meal.notes}"</p>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditModal(meal)}
                              className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                              title="Düzenle"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMeal(meal.id)}
                              className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Favorite meals list (Favori Öğünlerim) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Favori Öğünlerim ({favoriteMeals.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {favoriteMeals.length === 0 ? (
                    <div className="col-span-2 text-center p-6 text-slate-500 text-xs italic">
                      Henüz herhangi bir favori öğün oluşturulmadı. Öğün oluştururken "Bu Öğünü Favorilerime Kaydet" kutusunu işaretleyebilirsiniz.
                    </div>
                  ) : (
                    favoriteMeals.map((fav) => (
                      <div key={fav.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-start justify-between gap-2 shadow-sm">
                        <div className="space-y-1">
                          <strong className="text-xs text-white block truncate max-w-[150px]">{fav.name}</strong>
                          <span className="text-[9px] text-slate-550 font-extrabold uppercase tracking-wider block">{fav.mealType}</span>
                          <div className="text-[10px] text-slate-400 font-mono font-semibold">
                            🔥 {fav.calories} kcal | P:{fav.protein}g K:{fav.carbs}g
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleQuickAddFavorite(fav)}
                            className="bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-slate-950 p-1.5 rounded-lg border border-teal-500/25 transition text-[9px] font-black uppercase cursor-pointer"
                            title="Öğün Olarak Ekle"
                          >
                            + Ekle
                          </button>
                          <button
                            onClick={() => handleDeleteFavoriteMeal(fav.id)}
                            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition cursor-pointer"
                            title="Favorilerden Sil"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
            
          </div>
        </>
      ) : (
        <>
          {/* WEEKLY ANALYSIS PANEL */}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Average numbers and stats cards */}
            <div className="space-y-6">
              
              {/* Telemetry card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-400" /> Haftalık Ortalama Tüketim
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-lg border border-slate-850">
                    <span className="text-slate-400 font-semibold">Ortalama Kalori:</span>
                    <strong className="text-white font-mono text-sm">{weeklySummary.averageCalories} kcal</strong>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-lg border border-slate-850">
                    <span className="text-slate-400 font-semibold">Ortalama Protein:</span>
                    <strong className="text-rose-400 font-mono text-sm">{weeklySummary.averageProtein} g</strong>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-lg border border-slate-850">
                    <span className="text-slate-400 font-semibold">Ortalama Karbonhidrat:</span>
                    <strong className="text-blue-400 font-mono text-sm">{weeklySummary.averageCarbs} g</strong>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-lg border border-slate-850">
                    <span className="text-slate-400 font-semibold">Ortalama Yağ:</span>
                    <strong className="text-yellow-500 font-mono text-sm">{weeklySummary.averageFat} g</strong>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-lg border border-slate-850">
                    <span className="text-slate-400 font-semibold">Ortalama Su:</span>
                    <strong className="text-blue-450 font-mono text-sm">{weeklySummary.averageWater} ml</strong>
                  </div>
                </div>
              </div>

              {/* Goals & Achievements card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Haftalık Başarı Telemetrisi
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-slate-450 font-bold block uppercase tracking-wider text-[9px] mb-1">HEDEF UYUMU SAĞLANAN GÜNLER</span>
                    <strong className="text-emerald-400 text-sm">7 gün içinde {weeklySummary.goalMatchedDays} gün</strong>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Hedef uyumu %80 ve üzeri olan günler sayılır.</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-slate-450 font-bold block uppercase tracking-wider text-[9px] mb-1">TOPLAM ÖĞÜN ADEDİ</span>
                    <strong className="text-slate-200 text-sm">{weeklySummary.totalMeals} adet öğün</strong>
                  </div>

                  {weeklySummary.mostConsumedFood && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                      <span className="text-slate-450 font-bold block uppercase tracking-wider text-[9px] mb-1">EN ÇOK TÜKETİLEN BESİN</span>
                      <strong className="text-teal-400 text-sm">{weeklySummary.mostConsumedFood}</strong>
                    </div>
                  )}

                  {weeklySummary.highestCalorieDay && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                      <span className="text-slate-450 font-bold block uppercase tracking-wider text-[9px] mb-1">EN YÜKSEK KALORİ ALINAN GÜN</span>
                      <strong className="text-rose-400 text-sm">{weeklySummary.highestCalorieDay}</strong>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Column 2: Recharts Visualization Chart */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-teal-400" /> Son 7 Günlük Trend Grafiği (Kalori & Su)
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Son 7 gün için kalori alımı ve su tüketiminizin dinamik grafik eğrisini inceleyin.
                </p>
              </div>

              {/* Chart container */}
              <div className="h-72 w-full mt-4 bg-slate-950 p-3 rounded-xl border border-slate-850 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorKalori" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="Kalori" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorKalori)" name="Kalori (kcal)" />
                    <Area type="monotone" dataKey="Su" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSu)" name="Su (ml)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="text-slate-450 text-[10px] text-center pt-2 italic font-semibold">
                Grafikteki dalgalanmaları kontrol ederek antrenman günlerindeki kalori/su artış hedeflerinize uyumu analiz edebilirsiniz.
              </div>
            </div>

          </div>
        </>
      )}

      {/* MEAL MODAL WINDOW */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl my-4 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="text-teal-400" />
                {editingMeal ? 'Öğünü Düzenle' : 'Öğün Oluşturucu'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveForm} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* Favorite quick loading dropdown */}
              {favoriteMeals.length > 0 && (
                <div className="bg-teal-500/5 p-3 rounded-xl border border-teal-500/10 space-y-1.5">
                  <label className="block text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                    Favori Öğünlerden Hızlı Yükle
                  </label>
                  <select
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId) {
                        const fav = favoriteMeals.find(f => f.id === selectedId);
                        if (fav) {
                          setSelectedFoods(fav.items.map(it => ({
                            ...it,
                            id: Math.random().toString(36).substring(2, 9)
                          })));
                          setFormMealType(fav.mealType as MealType);
                          onShowToast(`Favori öğün "${fav.name}" başarıyla form içerisine yüklendi!`);
                        }
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">-- Bir favori öğün şablonu seçin --</option>
                    {favoriteMeals.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.calories} kcal • P:{f.protein}g K:{f.carbs}g)</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date & Meal Type Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Öğün Tipi *
                  </label>
                  <select
                    value={formMealType}
                    onChange={(e) => setFormMealType(e.target.value as MealType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    {MEAL_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION: ADD FOODS ENGINE */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkle className="w-3.5 h-3.5" /> Yiyecek Ekleme Ekranı
                  </span>
                  
                  {/* Mode switcher tabs */}
                  <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsManualMode(false)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition cursor-pointer ${!isManualMode ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Arama Yap
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsManualMode(true)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition cursor-pointer ${isManualMode ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Kendin Yaz (Manuel)
                    </button>
                  </div>
                </div>

                {!isManualMode ? (
                  /* DATABASE SEARCH & FILTER MODE */
                  <div className="space-y-3">
                    <div className="relative">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Lokal Veritabanında Ara
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Örn: tavuk, esmer pirinç, yoğurt, avokado..."
                          value={foodSearchQuery}
                          onChange={(e) => {
                            setFoodSearchQuery(e.target.value);
                            if (selectedFoodDbItem) setSelectedFoodDbItem(null);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                        />
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      </div>

                      {/* Dropdown Suggestions */}
                      {searchedFoodItems.length > 0 && !selectedFoodDbItem && (
                        <div className="absolute left-0 right-0 bg-slate-900 border border-slate-800 rounded-lg mt-1 shadow-2xl z-30 divide-y divide-slate-850 max-h-48 overflow-y-auto">
                          {searchedFoodItems.map((food) => (
                            <button
                              key={food.id}
                              type="button"
                              onClick={() => {
                                setSelectedFoodDbItem(food);
                                setFoodSearchQuery(food.name);
                              }}
                              className="w-full text-left p-2.5 hover:bg-slate-850 flex items-center justify-between text-xs transition gap-2 cursor-pointer"
                            >
                              <div>
                                <span className="font-bold text-slate-200 block">{food.name}</span>
                                <span className="text-[10px] text-slate-500 font-semibold">{food.category} • 100g/ml için değerler</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-teal-400 font-bold block">{food.calories} kcal</span>
                                <span className="text-[9px] text-slate-500 font-mono">P:{food.protein} K:{food.carbs} Y:{food.fat}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quantity Input for selected item */}
                    <div className="grid grid-cols-2 gap-3 items-end">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Miktar (Gram / Ml)
                        </label>
                        <input
                          type="number"
                          min="1"
                          required={!isManualMode && !!selectedFoodDbItem}
                          value={amountGram}
                          onChange={(e) => setAmountGram(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleAddFoodToMeal}
                        disabled={!selectedFoodDbItem}
                        className={`w-full font-bold py-2 px-4 rounded-lg text-xs transition flex items-center justify-center gap-1.5 h-[38px] ${
                          selectedFoodDbItem
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Yiyeceği Öğüne Ekle
                      </button>
                    </div>

                    {/* Show selected item specs */}
                    {selectedFoodDbItem && (
                      <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-850 flex flex-col gap-1 text-[11px] text-slate-400 font-semibold">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Hesaplanan Değerler:</span>
                        <div className="flex items-center justify-between text-slate-200">
                          <span>{selectedFoodDbItem.name} ({amountGram}g)</span>
                          <span className="font-mono text-teal-400 font-bold">
                            {Math.round(selectedFoodDbItem.calories * (parseFloat(amountGram || '100') / selectedFoodDbItem.servingGram))} kcal
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap font-mono font-normal">
                          <span>Protein: {((selectedFoodDbItem.protein || 0) * (parseFloat(amountGram || '100') / selectedFoodDbItem.servingGram)).toFixed(1)}g</span>
                          <span>|</span>
                          <span>Karbonhidrat: {((selectedFoodDbItem.carbs || 0) * (parseFloat(amountGram || '100') / selectedFoodDbItem.servingGram)).toFixed(1)}g</span>
                          <span>|</span>
                          <span>Yağ: {((selectedFoodDbItem.fat || 0) * (parseFloat(amountGram || '100') / selectedFoodDbItem.servingGram)).toFixed(1)}g</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* MANUAL ENTRY MODE */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Yiyecek Adı *
                        </label>
                        <input
                          type="text"
                          placeholder="Örn: Ev yapımı fıstıklı bar"
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Miktar (Gram / Ml)
                        </label>
                        <input
                          type="number"
                          placeholder="100"
                          value={manualAmount}
                          onChange={(e) => setManualAmount(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Kalori (kcal)
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={manualCalories}
                          onChange={(e) => setManualCalories(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Protein (g)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="0"
                          value={manualProtein}
                          onChange={(e) => setManualProtein(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Karb (g)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="0"
                          value={manualCarbs}
                          onChange={(e) => setManualCarbs(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Yağ (g)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="0"
                          value={manualFat}
                          onChange={(e) => setManualFat(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddFoodToMeal}
                          className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 h-[38px]"
                        >
                          <Plus className="w-4 h-4" /> Yiyeceği Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* LIST OF CURRENTLY ADDED FOOD ITEMS INSIDE MODAL */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Öğündeki Yiyecekler ({selectedFoods.length})
                </label>

                {selectedFoods.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs font-medium">
                    Öğünde henüz herhangi bir yiyecek yok. Yukarıdaki arama veya manuel panelinden yiyecek ekleyin.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedFoods.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.amountGram}g • {item.calories} kcal | P:{item.protein}g K:{item.carbs}g Y:{item.fat}g
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFoodFromMeal(item.id)}
                          className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* OVERALL SUMMARY OF PENDING MEAL ITEMS */}
              {selectedFoods.length > 0 && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-teal-500/15 flex flex-col gap-2">
                  <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Öğün Makro Toplamları:</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Toplam Kalori:</span>
                    <strong className="text-sm font-black font-mono text-teal-400">{calculatedTotalCalories} kcal</strong>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-850/60 font-mono">
                    <span className="bg-slate-900 border border-slate-850/85 rounded py-1">P: {calculatedTotalProtein}g</span>
                    <span className="bg-slate-900 border border-slate-850/85 rounded py-1">K: {calculatedTotalCarbs}g</span>
                    <span className="bg-slate-900 border border-slate-850/85 rounded py-1">Y: {calculatedTotalFat}g</span>
                  </div>
                </div>
              )}

              {/* Premium Save Favorite Section */}
              {selectedFoods.length > 0 && !editingMeal && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="checkbox-save-fav"
                      checked={isFavoriteChecked}
                      onChange={(e) => setIsFavoriteChecked(e.target.checked)}
                      className="rounded text-teal-500 bg-slate-900 border-slate-800 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="checkbox-save-fav" className="text-xs font-bold text-slate-300 cursor-pointer select-none">
                      Bu Öğünü Favorilerime Kaydet
                    </label>
                  </div>
                  {isFavoriteChecked && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Favori Öğün İsmi *
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Sabah Klasik Yulafım"
                        value={favoriteName}
                        onChange={(e) => setFavoriteName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Custom Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Öğün Notu / Detayları
                </label>
                <input
                  type="text"
                  placeholder="Örn: Kardiyo sonrası, protein ağırlıklı öğün."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-905 hover:bg-slate-850 border border-slate-800 font-bold px-4 py-2 rounded-lg text-xs text-slate-300 transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-5 py-2 rounded-lg text-xs transition cursor-pointer hover:shadow-lg"
                >
                  Öğünü Kaydet
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
