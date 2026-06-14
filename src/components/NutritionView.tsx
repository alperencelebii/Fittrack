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

export default function NutritionView({
  settings,
  meals,
  onSaveMeals,
  onShowToast,
  quickActionTriggered,
  onClearQuickActionTrigger,
}: NutritionViewProps) {
  // Current filtering date, defaults to today
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Modal / Editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);

  // Form fields
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formMealType, setFormMealType] = useState<MealType>('Kahvaltı');
  const [formFoodName, setFormFoodName] = useState('');
  const [formCalories, setFormCalories] = useState('400');
  const [formProtein, setFormProtein] = useState('25');
  const [formCarbs, setFormCarbs] = useState('40');
  const [formFat, setFormFat] = useState('10');
  const [formNotes, setFormNotes] = useState('');

  // Auto trigger meal modal if quick action was called from dashboard
  React.useEffect(() => {
    if (quickActionTriggered) {
      handleOpenNewModal();
      onClearQuickActionTrigger();
    }
  }, [quickActionTriggered]);

  // Filtered meals based on selected date
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => meal.date === filterDate);
  }, [meals, filterDate]);

  // Calculations for filtered date
  const totalCalories = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + m.calories, 0);
  }, [filteredMeals]);

  const totalProtein = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + m.protein, 0);
  }, [filteredMeals]);

  const totalCarbs = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + m.carbs, 0);
  }, [filteredMeals]);

  const totalFat = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + m.fat, 0);
  }, [filteredMeals]);

  // Calorie calculation with respect to daily user target
  const percentOfGoal = Math.min(
    100,
    Math.round((totalCalories / settings.dailyCalorieGoal) * 100)
  );

  // Macros total weight in grams for percentages
  const totalMacroGrams = totalProtein + totalCarbs + totalFat || 1;
  const proteinPercent = Math.round((totalProtein / totalMacroGrams) * 100);
  const carbsPercent = Math.round((totalCarbs / totalMacroGrams) * 100);
  const fatPercent = Math.round((totalFat / totalMacroGrams) * 100);

  const handleOpenNewModal = () => {
    setEditingMeal(null);
    setFormDate(filterDate);
    setFormMealType('Kahvaltı');
    setFormFoodName('');
    setFormCalories('350');
    setFormProtein('20');
    setFormCarbs('35');
    setFormFat('8');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (meal: MealEntry) => {
    setEditingMeal(meal);
    setFormDate(meal.date);
    setFormMealType(meal.mealType);
    setFormFoodName(meal.foodName);
    setFormCalories(String(meal.calories));
    setFormProtein(String(meal.protein));
    setFormCarbs(String(meal.carbs));
    setFormFat(String(meal.fat));
    setFormNotes(meal.notes || '');
    setIsModalOpen(true);
  };

  const handleDeleteMeal = (id: string) => {
    if (confirm('Bu öğün kaydını silmek istediğinizden emin misiniz?')) {
      const updated = meals.filter((m) => m.id !== id);
      onSaveMeals(updated);
      onShowToast('Öğe günlükten silindi.');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formFoodName.trim()) {
      alert('Yiyecek adı boş bırakılamaz.');
      return;
    }

    const c = parseInt(formCalories);
    const p = parseInt(formProtein);
    const cb = parseInt(formCarbs);
    const f = parseInt(formFat);

    if (isNaN(c) || c < 0 || isNaN(p) || p < 0 || isNaN(cb) || cb < 0 || isNaN(f) || f < 0) {
      alert('Besin değerleri negatif veya boş olamaz.');
      return;
    }

    const payload: MealEntry = {
      id: editingMeal ? editingMeal.id : Math.random().toString(36).substring(2, 9),
      date: formDate,
      mealType: formMealType,
      foodName: formFoodName.trim(),
      calories: c,
      protein: p,
      carbs: cb,
      fat: f,
      notes: formNotes.trim() || undefined,
    };

    let updatedList: MealEntry[];
    if (editingMeal) {
      updatedList = meals.map((m) => (m.id === editingMeal.id ? payload : m));
      onShowToast('Öğün kaydı güncellendi.');
    } else {
      updatedList = [payload, ...meals];
      onShowToast('Yeni öğün başarıyla kaydedildi.');
    }

    onSaveMeals(updatedList);
    // Sync filter date to form date so user sees what they saved immediately
    setFilterDate(formDate);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upper Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Günlük Beslenme ve Makro Takibi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tükettiğiniz öğünlerin protein, yağ ve karbonhidrat ağırlıklarını girip günlük enerji limitlerinizi aşmayın.
          </p>
        </div>
        <button
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

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-350">
          <span className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-850">
            Hedef Kalori: <strong className="text-white">{settings.dailyCalorieGoal} kcal</strong>
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
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-450 rounded-full transition-all duration-300"
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
                  onClick={handleOpenNewModal}
                  className="text-xs text-teal-400 underline font-semibold cursor-pointer"
                >
                  İlk öğünü şimdi ekleyin
                </button>
              </div>
            ) : (
              filteredMeals.map((meal) => {
                let badgeColor = 'bg-slate-800 text-slate-305';
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
                      
                      <div className="flex gap-2 flex-wrap text-[10px] text-slate-400 font-semibold">
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
                      {meal.notes && (
                        <p className="text-[10px] text-slate-450 italic">Not: "{meal.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditModal(meal)}
                        className="p-1.5 hover:bg-slate-900 rounded text-slate-450 hover:text-white transition cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="p-1.5 hover:bg-rose-500/10 rounded text-slate-450 hover:text-rose-450 transition cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
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
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 font-bold px-4 py-2 rounded-lg text-xs text-slate-300 transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-5 py-2 rounded-lg text-xs transition cursor-pointer"
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
