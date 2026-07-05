/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { WeightEntry, UserSettings } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Plus,
  Scale,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Award,
  X,
  Trash2,
  Edit2,
  ListOrdered,
} from 'lucide-react';

interface WeightViewProps {
  settings: UserSettings;
  weightEntries: WeightEntry[];
  onSaveWeightEntries: (entries: WeightEntry[]) => void;
  onShowToast: (msg: string) => void;
  quickActionTriggered: boolean;
  onClearQuickActionTrigger: () => void;
}

export default function WeightView({
  settings,
  weightEntries,
  onSaveWeightEntries,
  onShowToast,
  quickActionTriggered,
  onClearQuickActionTrigger,
}: WeightViewProps) {
  // Modal / Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formWeight, setFormWeight] = useState('80');
  const [formNotes, setFormNotes] = useState('');

  // Auto trigger weight modal if quick action was called from dashboard
  React.useEffect(() => {
    if (quickActionTriggered) {
      handleOpenNewModal();
      onClearQuickActionTrigger();
    }
  }, [quickActionTriggered]);

  // Sort weight entries by date (descending for list, ascending for charts)
  const sortedEntriesDesc = useMemo(() => {
    return [...weightEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [weightEntries]);

  const sortedEntriesAsc = useMemo(() => {
    return [...weightEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [weightEntries]);

  // Calculations
  const latestWeight = useMemo(() => {
    if (sortedEntriesDesc.length > 0) return sortedEntriesDesc[0].weight;
    return settings.currentWeight;
  }, [sortedEntriesDesc, settings]);

  const startingWeight = useMemo(() => {
    if (sortedEntriesDesc.length > 0) return sortedEntriesDesc[sortedEntriesDesc.length - 1].weight;
    return settings.currentWeight;
  }, [sortedEntriesDesc, settings]);

  const totalChange = useMemo(() => {
    return latestWeight - startingWeight;
  }, [latestWeight, startingWeight]);

  const distanceToTarget = useMemo(() => {
    return latestWeight - settings.targetWeight;
  }, [latestWeight, settings]);

  const handleOpenNewModal = () => {
    setEditingEntry(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormWeight(String(latestWeight));
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setFormDate(entry.date);
    setFormWeight(String(entry.weight));
    setFormNotes(entry.notes || '');
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Bu kilo kaydını silmek istediğinizden emin misiniz?')) {
      const updated = weightEntries.filter((w) => w.id !== id);
      onSaveWeightEntries(updated);
      onShowToast('Kilo kaydı başarıyla silindi.');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(formWeight);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      alert('Lütfen sıfırdan büyük geçerli bir ağırlık (kg) değeri girin.');
      return;
    }

    const payload: WeightEntry = {
      id: editingEntry ? editingEntry.id : Math.random().toString(36).substring(2, 9),
      date: formDate,
      weight: parsedWeight,
      notes: formNotes.trim(),
    };

    let updatedList: WeightEntry[];
    if (editingEntry) {
      updatedList = weightEntries.map((w) => (w.id === editingEntry.id ? payload : w));
      onShowToast('Kilo kaydı güncellendi.');
    } else {
      updatedList = [payload, ...weightEntries];
      onShowToast('Yeni kilo kaydı eklendi.');
    }

    onSaveWeightEntries(updatedList);
    setIsModalOpen(false);
  };

  // Prepare chart data mapped correctly
  const chartData = useMemo(() => {
    if (sortedEntriesAsc.length === 0) {
      // Return single fallback item so chart is not empty
      return [{ date: settings.createdAt || 'Başlangıç', weight: settings.currentWeight }];
    }
    return sortedEntriesAsc.map((e) => ({
      date: e.date.substring(5), // MM-DD format for brevity
      weight: e.weight,
    }));
  }, [sortedEntriesAsc, settings]);

  // Custom tooltips for Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-400">Tarih: {payload[0].payload.date}</p>
          <p className="font-extrabold text-emerald-400">Kilo: {payload[0].value} kg</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Kilo Değişim Takibi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tartı sonuçlarınızı girerek hedef kilonuza olan yaklaşımınızı grafik üzerinden izleyin.
          </p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer text-sm shadow-sm hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Kilo Girişi Yap
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Current Weight */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Son Ölçülen</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{latestWeight} kg</p>
            <p className="text-xs text-slate-500">En son kilo kaydınız.</p>
          </div>
        </div>

        {/* Card 2: Initial Weight */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Başlangıç</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-350">{startingWeight} kg</p>
            <p className="text-xs text-slate-500">İlk başladığınız kilo.</p>
          </div>
        </div>

        {/* Card 3: Change */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Değişim</span>
            {totalChange <= 0 ? (
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingUp className="w-4 h-4 text-rose-450" />
            )}
          </div>
          <div>
            <p className={`text-2xl font-black ${totalChange <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalChange > 0 ? `+${totalChange.toFixed(1)}` : totalChange.toFixed(1)} kg
            </p>
            <p className="text-xs text-slate-500">İlk ölçüme göre fark.</p>
          </div>
        </div>

        {/* Card 4: Target Goal Diff */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hedefe Kalan</span>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-blue-400">
              {Math.abs(distanceToTarget).toFixed(1)} kg
            </p>
            <p className="text-xs text-slate-500">Hedef: {settings.targetWeight} kg</p>
          </div>
        </div>
      </div>

      {/* Grid: Graph and Log Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Koyu Temalı Trend Grafiği */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5 border-b border-slate-850 pb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Kilo Değişim Grafiği
          </h2>
          {weightEntries.length === 0 ? (
            <div className="h-[280px] bg-slate-950/40 border border-dashed border-slate-800 rounded-xl flex flex-col justify-center items-center text-center p-4">
              <p className="text-xs text-slate-500">Grafik için henüz yeterli veri bulunmuyor.</p>
              <p className="text-[11px] text-slate-650 mt-1">Gireceğiniz kilo kayıtlarına göre gelişim eğrisi burada oluşacaktır.</p>
            </div>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1, fill: '#0f172a' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Tarihsel Kayıt Listesi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5 border-b border-slate-850 pb-2 shrink-0">
            <ListOrdered className="w-4 h-4 text-blue-400" /> Kilo Günlüğü ({weightEntries.length})
          </h2>

          <div className="overflow-y-auto flex-1 max-h-[280px] pr-1 space-y-2">
            {sortedEntriesDesc.length === 0 ? (
              <p className="text-center text-xs text-slate-500 italic py-8">Henüz kilo kaydı girmediniz.</p>
            ) : (
              sortedEntriesDesc.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-white">{entry.weight} kg</p>
                    <div className="flex gap-1.5 text-[10px] text-slate-400 font-medium">
                      <span>📅 {entry.date}</span>
                      {entry.notes && (
                        <span className="text-slate-500 italic">• "{entry.notes}"</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(entry)}
                      className="p-1 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition cursor-pointer"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1 hover:bg-rose-500/10 rounded text-slate-405 hover:text-rose-450 transition cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* WEIGHT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="text-blue-400" />
                {editingEntry ? 'Kilo Kaydını Düzenle' : 'Kilo Kaydı Ekle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tarih *
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Ağırlık (kg) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="10"
                  max="500"
                  value={formWeight}
                  onChange={(e) => setFormWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Not / Açıklama
                </label>
                <input
                  type="text"
                  placeholder="Örn: Sabah aç karnına, uykudan sonra"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
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
                  className="bg-blue-500 hover:bg-blue-400 text-white font-extrabold px-5 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  {editingEntry ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
