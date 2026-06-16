/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MealEntry, MealType, UserSettings } from '../types';
import {
  Zap,
  Plus,
  Calendar,
  X,
  Trash2,
  Edit2,
  ListFilter,
  Sparkles,
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

// Safe meal normalizer to avoid undefined, NaN, null, and empty properties from firestore or user inputs
export function normalizeMeal(meal: any): MealEntry {
  if (!meal) {
    meal = {};
  }
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
  // Graceful state handling for errors list
  const [hasError, setHasError] = useState(false);

  // Current filtering date, defaults to today
  const [filterDate, setFilterDate] = useState(() => {
    try {
      return new Date().toISOString().split('T')[0];
    } catch {
      return '';
    }
  });

  // Modal / Editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);

  // Form fields with safe initial default states
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formMealType, setFormMealType] = useState<MealType>('Ara Öğün');
  const [formFoodName, setFormFoodName] = useState('');
  const [formCalories, setFormCalories] = useState('0');
  const [formProtein, setFormProtein] = useState('0');
  const [formCarbs, setFormCarbs] = useState('0');
  const [formFat, setFormFat] = useState('0');
  const [formNotes, setFormNotes] = useState('');

  // Auto trigger meal modal if quick action was called from dashboard
  React.useEffect(() => {
    if (quickActionTriggered) {
      handleOpenNewModal();
      onClearQuickActionTrigger();
    }
  }, [quickActionTriggered]);

  // Sanitize and derive safe meals list from props
  const safeMeals = useMemo(() => {
    try {
      const source = Array.isArray(meals) ? meals : [];
      return source.map(normalizeMeal);
    } catch (err) {
      console.error("Error normalizing meals array inside NutritionView:", err);
      setHasError(true);
      return [];
    }
  }, [meals]);

  // Filtered meals based on selected date
  const filteredMeals = useMemo(() => {
    const fDate = filterDate || new Date().toISOString().split('T')[0];
    return safeMeals.filter((meal) => meal.date === fDate);
  }, [safeMeals, filterDate]);

  // Calculations for filtered date (completely safe sum reduction without NaN)
  const totalCalories = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
  }, [filteredMeals]);

  const totalProtein = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + Number(m.protein || 0), 0);
  }, [filteredMeals]);

  const totalCarbs = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + Number(m.carbs || 0), 0);
  }, [filteredMeals]);

  const totalFat = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + Number(m.fat || 0), 0);
  }, [filteredMeals]);

  // Calorie calculation with respect to daily user target
  const calorieGoal = Number(settings?.dailyCalorieGoal || 2000);
  const percentOfGoal = Math.min(
    100,
    Math.round((totalCalories / calorieGoal) * 100)
  );

  // Macros total weight in grams for percentages
  const totalMacroGrams = totalProtein + totalCarbs + totalFat || 1;
  const proteinPercent = Math.round((totalProtein / totalMacroGrams) * 100);
  const carbsPercent = Math.round((totalCarbs / totalMacroGrams) * 100);
  const fatPercent = Math.round((totalFat / totalMacroGrams) * 100);

  const handleOpenNewModal = () => {
    const defaultDate = filterDate || new Date().toISOString().split('T')[0];
    setEditingMeal(null);
    setFormDate(defaultDate);
    setFormMealType('Ara Öğün');
    setFormFoodName('');
    setFormCalories('350');
    setFormProtein('20');
    setFormCarbs('35');
    setFormFat('8');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (meal: MealEntry) => {
    const safeM = normalizeMeal(meal);
    setEditingMeal(safeM);
    setFormDate(safeM.date);
    setFormMealType(safeM.mealType);
    setFormFoodName(safeM.foodName);
    setFormCalories(String(safeM.calories));
    setFormProtein(String(safeM.protein));
    setFormCarbs(String(safeM.carbs));
    setFormFat(String(safeM.fat));
    setFormNotes(safeM.notes);
    setIsModalOpen(true);
  };

  const handleDeleteMeal = (id: string) => {
    if (!id) return;
    if (confirm('Bu öğün kaydını silmek istediğinizden emin misiniz?')) {
      const updated = safeMeals.filter((m) => m.id !== id);
      onSaveMeals(updated.map(normalizeMeal));
      onShowToast('Öğe günlükten silindi.');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formFoodName.trim()) {
      alert('Yiyecek adı boş bırakılamaz.');
      return;
    }

    const c = parseInt(formCalories, 10);
    const p = parseInt(formProtein, 10);
    const cb = parseInt(formCarbs, 10);
    const f = parseInt(formFat, 10);

    const validatedCalories = isNaN(c) || c < 0 ? 0 : c;
    const validatedProtein = isNaN(p) || p < 0 ? 0 : p;
    const validatedCarbs = isNaN(cb) || cb < 0 ? 0 : cb;
    const validatedFat = isNaN(f) || f < 0 ? 0 : f;

    const payload: MealEntry = {
      id: editingMeal ? editingMeal.id : Math.random().toString(36).substring(2, 9),
      date: formDate || new Date().toISOString().split('T')[0],
      mealType: formMealType || 'Ara Öğün',
      foodName: formFoodName.trim(),
      calories: validatedCalories,
      protein: validatedProtein,
      carbs: validatedCarbs,
      fat: validatedFat,
      notes: formNotes.trim(),
    };

    let updatedList: MealEntry[];
    if (editingMeal) {
      updatedList = safeMeals.map((m) => (m.id === editingMeal.id ? payload : m));
      onShowToast('Öğün kaydı güncellendi.');
    } else {
      updatedList = [payload, ...safeMeals];
      onShowToast('Yeni öğün başarıyla kaydedildi.');
    }

    // Pass securely normalized list
    onSaveMeals(updatedList.map(normalizeMeal));
    setFilterDate(formDate || new Date().toISOString().split('T')[0]);
    setIsModalOpen(false);
  };

  // Safe recovery trigger
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
            Tükettiğiniz öğünlerin protein, yağ ve karbonhidrat ağırlıklarını girip günlük enerji limitlerinizi aşmayın.
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

      {/* Date Filter Component & Quick stat summaries */}
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

      {/* Core Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Macros Progress Bar & Circle percentages */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> Günlük Makro ve Enerji Dengesi
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-normal leading-relaxed">
              Öğün hedeflerinizin yüzde kaçını tamamladığınız ve makroların birbirine oranı aşağıda özetlenmektedir.
            </p>
          </div>

          {/* Calorie Progress Ring Equivalent */}
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

          {/* Individual Macro metrics */}
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
              <span className="text-[9px] font-bold tracking-wider uppercase text-blue-400">Karbonhidrat</span>
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

        {/* Chronological Food logs list */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-teal-400" /> {filterDate} Öğünleri ({filteredMeals.length})
            </h2>
            <span className="text-xs text-slate-400">Toplam: <strong>{totalCalories} kcal</strong></span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[350px] space-y-2 pr-1">
            {filteredMeals.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <Zap className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">Bu tarih için kaydedilmiş herhangi bir öğün bulunmuyor.</p>
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
                    className="p-3 bg-slate-950 border border-slate-850/80 rounded-xl flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-black uppercase py-0.5 px-2 rounded-full ${badgeColor}`}>
                          {meal.mealType}
                        </span>
                        <h4 className="text-xs font-black text-slate-100">{meal.foodName}</h4>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap text-[10px] text-slate-400 font-semibold font-mono">
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850 text-teal-400">
                          🔥 {meal.calories} kcal
                        </span>
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850">
                          🍗 P: {meal.protein}g
                        </span>
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850">
                          🍚 K: {meal.carbs}g
                        </span>
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850">
                          🥑 Y: {meal.fat}g
                        </span>
                      </div>
                      {meal.notes ? (
                        <p className="text-[10px] text-slate-400 italic">Not: "{meal.notes}"</p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditModal(meal)}
                        className="p-1.5 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="p-1.5 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer"
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
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="text-teal-400" />
                {editingMeal ? 'Öğünü Düzenle' : 'Öğün Ekle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 animate-pulse">
                    Öğün / Yiyecek Adı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 150g Tavuk ve Esmer Pirinç"
                    value={formFoodName}
                    onChange={(e) => setFormFoodName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

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

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Kalori (kcal) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Örn: 420"
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Örn: 30"
                    value={formProtein}
                    onChange={(e) => setFormProtein(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Karbonhidrat (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Örn: 40"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Yağ (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Örn: 12"
                    value={formFat}
                    onChange={(e) => setFormFat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Özel Not
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Antrenman sonrası ara öğün."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
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
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
