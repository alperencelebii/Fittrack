/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MealEntry, MealType, UserSettings, MealFoodItem } from '../types';
import { foodDatabase, FoodDatabaseItem } from '../data/foodDatabase';
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
  Sparkle
} from 'lucide-react';

interface NutritionViewProps {
  settings: UserSettings;
  meals: MealEntry[];
  onSaveMeals: (meals: MealEntry[]) => void;
  onShowToast: (msg: string) => void;
  quickActionTriggered: boolean;
  onClearQuickActionTrigger: () => void;
}

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
  const [hasError, setHasError] = useState(false);

  const [filterDate, setFilterDate] = useState(() => {
    try {
      return new Date().toISOString().split('T')[0];
    } catch {
      return '';
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);

  // Form general metadata fields
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formMealType, setFormMealType] = useState<MealType>('Ara Öğün');
  const [formNotes, setFormNotes] = useState('');

  // Selected Foods inside the current meal form
  const [selectedFoods, setSelectedFoods] = useState<MealFoodItem[]>([]);

  // Search local database fields
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [amountGram, setAmountGram] = useState<string>('100');
  const [selectedFoodDbItem, setSelectedFoodDbItem] = useState<FoodDatabaseItem | null>(null);

  // Manual input fields inside the modal (to easily switch mode)
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualAmount, setManualAmount] = useState('100');
  const [manualCalories, setManualCalories] = useState('0');
  const [manualProtein, setManualProtein] = useState('0');
  const [manualCarbs, setManualCarbs] = useState('0');
  const [manualFat, setManualFat] = useState('0');

  // Trigger modal on dashboard click
  React.useEffect(() => {
    if (quickActionTriggered) {
      handleOpenNewModal();
      onClearQuickActionTrigger();
    }
  }, [quickActionTriggered]);

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

  const totalCalories = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
  }, [filteredMeals]);

  const totalProtein = useMemo(() => {
    return Number(filteredMeals.reduce((sum, m) => sum + Number(m.protein || 0), 0).toFixed(1));
  }, [filteredMeals]);

  const totalCarbs = useMemo(() => {
    return Number(filteredMeals.reduce((sum, m) => sum + Number(m.carbs || 0), 0).toFixed(1));
  }, [filteredMeals]);

  const totalFat = useMemo(() => {
    return Number(filteredMeals.reduce((sum, m) => sum + Number(m.fat || 0), 0).toFixed(1));
  }, [filteredMeals]);

  const calorieGoal = Number(settings?.dailyCalorieGoal || 2000);
  const percentOfGoal = Math.min(
    100,
    Math.round((totalCalories / calorieGoal) * 100)
  );

  const totalMacroGrams = Number(totalProtein) + Number(totalCarbs) + Number(totalFat) || 1;
  const proteinPercent = Math.round((Number(totalProtein) / totalMacroGrams) * 100);
  const carbsPercent = Math.round((Number(totalCarbs) / totalMacroGrams) * 100);
  const fatPercent = Math.round((Number(totalFat) / totalMacroGrams) * 100);

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

  // Derived current meal totals
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
    clearManualItemInputs();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (meal: MealEntry) => {
    const safeM = normalizeMeal(meal);
    setEditingMeal(safeM);
    setFormDate(safeM.date);
    setFormMealType(safeM.mealType);
    setFormNotes(safeM.notes || '');

    // Safely parse or translate old format to items list
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

  // Add individual food item to the lists of selected items in the meal
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

    // Combine food names: "150g Tavuk Göğsü, 100g Bulgur Pilavı"
    const combinedFoodsText = selectedFoods.map(it => `${it.name} (${it.amountGram}g)`).join(', ');

    const payload: MealEntry = {
      id: editingMeal ? editingMeal.id : Math.random().toString(36).substring(2, 9),
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

    onSaveMeals(updatedList.map(normalizeMeal));
    setFilterDate(formDate || new Date().toISOString().split('T')[0]);
    setIsModalOpen(false);
  };

  const handleClearBrokenData = () => {
    if (confirm('Bozuk tüm kayıtları kalıcı olarak temizleyip sıfırlamak istiyor musunuz?')) {
      onSaveMeals([]);
      setHasError(false);
      onShowToast('Beslenme verileri sıfırlandı.');
    }
  };

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
      {/* Upper Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Günlük Beslenme ve Makro Takibi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tükettiğiniz öğünlerin protein, yağ ve karbonhidrat ağırlıklarını ekleyip günlük enerji limitlerinizi takip edin.
          </p>
        </div>
        <button
          id="btn-add-meal-main"
          onClick={handleOpenNewModal}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer text-sm shadow-sm hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Yiyecek / Öğün Ekle
        </button>
      </div>

      {/* Date Filter & Quick stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-teal-400 shrink-0" />
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              İnceleme Tarihi
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-slate-950 text-white rounded px-2.5 py-1 text-sm font-semibold focus:outline-none focus:border-teal-500 border border-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <span className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-850">
            Hedef Kalori: <strong className="text-white">{calorieGoal} kcal</strong>
          </span>
          <span className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-850">
            Tüketilen: <strong className="text-teal-400">{totalCalories} kcal</strong>
          </span>
        </div>
      </div>

      {/* Core Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Macros Progress Panels */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> Günlük Makro ve Enerji Dengesi
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-normal leading-relaxed">
              Dengeli ve tutarlı bir diyet için protein, karbonhidrat ve yağ dengesini koruyun.
            </p>
          </div>

          <div className="space-y-2 py-2">
            <div className="flex justify-between items-baseline text-xs font-bold">
              <span className="text-slate-300">Kalori Tüketim Yüzdesi</span>
              <span className="text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">%{percentOfGoal}</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${percentOfGoal}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850/80 text-center">
              <span className="text-[9px] font-bold tracking-wider uppercase text-rose-400">Protein</span>
              <p className="text-lg font-black text-white mt-1">{totalProtein}g</p>
              <p className="text-[10px] text-slate-500 font-bold">{proteinPercent || 0}% oran</p>
              <div className="h-1 bg-slate-900 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-rose-500" style={{ width: `${proteinPercent || 0}%` }} />
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850/80 text-center">
              <span className="text-[9px] font-bold tracking-wider uppercase text-blue-400">Karb</span>
              <p className="text-lg font-black text-white mt-1">{totalCarbs}g</p>
              <p className="text-[10px] text-slate-500 font-bold">{carbsPercent || 0}% oran</p>
              <div className="h-1 bg-slate-900 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-blue-500" style={{ width: `${carbsPercent || 0}%` }} />
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850/80 text-center">
              <span className="text-[9px] font-bold tracking-wider uppercase text-yellow-500">Yağ</span>
              <p className="text-lg font-black text-white mt-1">{totalFat}g</p>
              <p className="text-[10px] text-slate-500 font-bold">{fatPercent || 0}% oran</p>
              <div className="h-1 bg-slate-900 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-yellow-500" style={{ width: `${fatPercent || 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chronological Meal Logs */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-teal-400" /> {filterDate} Öğünleri ({filteredMeals.length})
            </h2>
            <span className="text-xs text-slate-400 font-semibold font-mono">Toplam: <strong>{totalCalories} kcal</strong></span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[420px] space-y-2 pr-1">
            {filteredMeals.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <Zap className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">Bu tarih için kaydedilmiş herhangi bir öğün bulunmuyor.</p>
                <button
                  id="btn-add-meal-empty"
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
                        <p className="text-[10px] text-slate-400 italic">Not: "{meal.notes}"</p>
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
      </div>

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
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${!isManualMode ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Arama Yap
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsManualMode(true)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${isManualMode ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
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
                            // Deselect selected item if they keep typing
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
                              className="w-full text-left p-2.5 hover:bg-slate-850 flex items-center justify-between text-xs transition gap-2"
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
                          <Plus className="w-4 h-4" /> Yiyeceği Öğüne Ekle
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
                          className="p-1.5 hover:bg-rose-500/10 rounded text-slate-500 hover:text-rose-400 transition"
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
