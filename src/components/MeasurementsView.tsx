/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { BodyMeasurement, UserSettings } from '../types';
import {
  Ruler,
  Plus,
  TrendingDown,
  TrendingUp,
  X,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

interface MeasurementsViewProps {
  settings: UserSettings;
  bodyMeasurements: BodyMeasurement[];
  onSaveBodyMeasurements: (measurements: BodyMeasurement[]) => void;
  onShowToast: (msg: string) => void;
  quickActionTriggered: boolean;
  onClearQuickActionTrigger: () => void;
}

export default function MeasurementsView({
  settings,
  bodyMeasurements,
  onSaveBodyMeasurements,
  onShowToast,
  quickActionTriggered,
  onClearQuickActionTrigger,
}: MeasurementsViewProps) {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BodyMeasurement | null>(null);

  // Form states
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formWaist, setFormWaist] = useState('');
  const [formChest, setFormChest] = useState('');
  const [formArm, setFormArm] = useState('');
  const [formShoulder, setFormShoulder] = useState('');
  const [formHip, setFormHip] = useState('');
  const [formLeg, setFormLeg] = useState('');
  const [formNeck, setFormNeck] = useState('');
  const [formBodyFat, setFormBodyFat] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Auto trigger measurement modal if quick action was called from dashboard
  React.useEffect(() => {
    if (quickActionTriggered) {
      handleOpenNewModal();
      onClearQuickActionTrigger();
    }
  }, [quickActionTriggered]);

  // Sort chronological for differential calculations, descending for log list
  const sortedMeasurementsDesc = useMemo(() => {
    return [...bodyMeasurements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [bodyMeasurements]);

  const latestEntry = sortedMeasurementsDesc[0] || null;
  const previousEntry = sortedMeasurementsDesc[1] || null;

  const handleOpenNewModal = () => {
    setEditingEntry(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    
    // Autofill with latest choices to save time
    setFormWaist(latestEntry?.waist ? String(latestEntry.waist) : '');
    setFormChest(latestEntry?.chest ? String(latestEntry.chest) : '');
    setFormArm(latestEntry?.arm ? String(latestEntry.arm) : '');
    setFormShoulder(latestEntry?.shoulder ? String(latestEntry.shoulder) : '');
    setFormHip(latestEntry?.hip ? String(latestEntry.hip) : '');
    setFormLeg(latestEntry?.leg ? String(latestEntry.leg) : '');
    setFormNeck(latestEntry?.neck ? String(latestEntry.neck) : '');
    setFormBodyFat(latestEntry?.bodyFat ? String(latestEntry.bodyFat) : '');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: BodyMeasurement) => {
    setEditingEntry(entry);
    setFormDate(entry.date);
    setFormWaist(entry.waist ? String(entry.waist) : '');
    setFormChest(entry.chest ? String(entry.chest) : '');
    setFormArm(entry.arm ? String(entry.arm) : '');
    setFormShoulder(entry.shoulder ? String(entry.shoulder) : '');
    setFormHip(entry.hip ? String(entry.hip) : '');
    setFormLeg(entry.leg ? String(entry.leg) : '');
    setFormNeck(entry.neck ? String(entry.neck) : '');
    setFormBodyFat(entry.bodyFat ? String(entry.bodyFat) : '');
    setFormNotes(entry.notes || '');
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Bu ölçü kaydını silmek istediğinizden emin misiniz?')) {
      const updated = bodyMeasurements.filter((m) => m.id !== id);
      onSaveBodyMeasurements(updated);
      onShowToast('Ölçüleriniz başarıyla silindi.');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    const parseNum = (val: string) => {
      if (!val) return undefined;
      const parsed = parseFloat(val);
      return isNaN(parsed) || parsed < 0 ? undefined : parsed;
    };

    const payload: BodyMeasurement = {
      id: editingEntry ? editingEntry.id : Math.random().toString(36).substring(2, 9),
      date: formDate,
      waist: parseNum(formWaist),
      chest: parseNum(formChest),
      arm: parseNum(formArm),
      shoulder: parseNum(formShoulder),
      hip: parseNum(formHip),
      leg: parseNum(formLeg),
      neck: parseNum(formNeck),
      bodyFat: parseNum(formBodyFat),
      notes: formNotes.trim() || undefined,
    };

    let updatedList: BodyMeasurement[];
    if (editingEntry) {
      updatedList = bodyMeasurements.map((m) => (m.id === editingEntry.id ? payload : m));
      onShowToast('Ölçü kaydı başarıyla güncellendi.');
    } else {
      updatedList = [payload, ...bodyMeasurements];
      onShowToast('Yeni ölçü kaydı eklendi.');
    }

    onSaveBodyMeasurements(updatedList);
    setIsModalOpen(false);
  };

  // Helper, returns comparison and coloring: (field, betterIsDecreasing)
  const renderTrendBadge = (field: keyof BodyMeasurement, title: string, unit: string, betterIsDecreasing: boolean) => {
    if (!latestEntry || !latestEntry[field]) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{title}</p>
          <p className="text-xl font-black text-slate-550">--</p>
          <p className="text-[10px] text-slate-600">Veri yok</p>
        </div>
      );
    }

    const currentVal = latestEntry[field] as number;
    const prevVal = previousEntry ? (previousEntry[field] as number) : null;

    let diffText = '';
    let isBetter = false;
    let isSame = true;

    if (prevVal) {
      const diff = currentVal - prevVal;
      isSame = diff === 0;
      if (diff > 0) {
        diffText = `+${diff.toFixed(1)} ${unit}`;
        isBetter = !betterIsDecreasing;
      } else if (diff < 0) {
        diffText = `${diff.toFixed(1)} ${unit}`;
        isBetter = betterIsDecreasing;
      }
    }

    return (
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-slate-700 transition">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{title}</p>
        <p className="text-xl font-black text-white">
          {currentVal} <span className="text-xs font-normal text-slate-400">{unit}</span>
        </p>
        {prevVal ? (
          <div className="flex items-center gap-1 text-[10.5px]">
            {isSame ? (
              <span className="text-slate-500 font-bold">— Değişim yok</span>
            ) : isBetter ? (
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5 shrink-0" /> {diffText} (Gelişim)
              </span>
            ) : (
              <span className="text-rose-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" /> {diffText}
              </span>
            )}
          </div>
        ) : (
          <p className="text-[10px] text-slate-500">İlk ölçü (kıyas yok)</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Vücut Ölçüleri Takibi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Kas gelişimini ve yağ yakımını santimetre (cm) bazlı ölçerek şekillenmenizi takip edin.
          </p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer text-sm shadow-sm hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Ölçü Girişi Yap
        </button>
      </div>

      {latestEntry && (
        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 flex items-center gap-2 text-xs text-slate-300">
          <Info className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            Son ölçüm tarihi: <strong className="text-white">{latestEntry.date}</strong>. Bir önceki ölçümle otomatik fark kıyaslamaları aşağıda gösterilmektedir.
          </span>
        </div>
      )}

      {/* Grid structure of metrics */}
      <div className="grid grid-cols-2 shadow-xs sm:grid-cols-4 gap-4">
        {renderTrendBadge('waist', 'Bel Genişliği 🥋', 'cm', true)}
        {renderTrendBadge('chest', 'Göğüs Çevresi 🦍', 'cm', false)}
        {renderTrendBadge('arm', 'Pazu / Kol 💪', 'cm', false)}
        {renderTrendBadge('shoulder', 'Omuz Genişliği 🛡️', 'cm', false)}
        {renderTrendBadge('hip', 'Kalça Genişliği 🍑', 'cm', true)}
        {renderTrendBadge('leg', 'Bacak Çevresi 🦵', 'cm', false)}
        {renderTrendBadge('neck', 'Boyun Çevresi 🧣', 'cm', false)}
        {renderTrendBadge('bodyFat', 'Yağ Oranı % 💧', '%', true)}
      </div>

      {/* History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5 border-b border-slate-850 pb-2">
          <Sparkles className="w-4 h-4 text-purple-400" /> Ölçü Kayıt Geçmişi ({bodyMeasurements.length})
        </h2>

        {sortedMeasurementsDesc.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Ruler className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">Henüz ölçü kaydı girmediniz. Ölçümlerinizi kaydederek gelişimi cm bazında görebilirsiniz.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-850">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-3">Tarih</th>
                  <th className="p-3 text-center">Bel (cm)</th>
                  <th className="p-3 text-center">Göğüs (cm)</th>
                  <th className="p-3 text-center">Kol (cm)</th>
                  <th className="p-3 text-center">Omuz (cm)</th>
                  <th className="p-3 text-center">Yağ (%)</th>
                  <th className="p-3">Açıklama / Not</th>
                  <th className="p-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 bg-slate-900/50">
                {sortedMeasurementsDesc.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-850/50 transition">
                    <td className="p-3 font-semibold text-slate-200">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        {m.date}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-white">{m.waist || '—'}</td>
                    <td className="p-3 text-center text-slate-300">{m.chest || '—'}</td>
                    <td className="p-3 text-center text-slate-350">{m.arm || '—'}</td>
                    <td className="p-3 text-center text-slate-300">{m.shoulder || '—'}</td>
                    <td className="p-3 text-center text-emerald-450 font-bold">{m.bodyFat ? `%${m.bodyFat}` : '—'}</td>
                    <td className="p-3 text-slate-400 italic line-clamp-1 max-w-[200px]" title={m.notes}>
                      {m.notes ? `"${m.notes}"` : '—'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(m)}
                          className="p-1 hover:bg-slate-850 rounded text-slate-450 hover:text-white transition cursor-pointer"
                          title="Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(m.id)}
                          className="p-1 hover:bg-rose-500/10 rounded text-slate-450 hover:text-rose-450 transition cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MEASUREMENTS ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ruler className="text-purple-400" />
                {editingEntry ? 'Ölçü Kaydını Düzenle' : 'Yeni Ölçü Kaydı Gir'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="overflow-y-auto p-6 space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Bel Çevresi (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="300"
                    placeholder="Örn: 82.5"
                    value={formWaist}
                    onChange={(e) => setFormWaist(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Göğüs Çevresi (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="300"
                    placeholder="Örn: 102"
                    value={formChest}
                    onChange={(e) => setFormChest(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Kol / Pazu Çevresi (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="100"
                    placeholder="Örn: 37"
                    value={formArm}
                    onChange={(e) => setFormArm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Omuz Çevresi (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="300"
                    placeholder="Örn: 118"
                    value={formShoulder}
                    onChange={(e) => setFormShoulder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Kalça Çevresi (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="350"
                    placeholder="Örn: 98"
                    value={formHip}
                    onChange={(e) => setFormHip(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Uyluk / Bacak (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="150"
                    placeholder="Örn: 58"
                    value={formLeg}
                    onChange={(e) => setFormLeg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Boyun Çevresi (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="100"
                    placeholder="Örn: 38"
                    value={formNeck}
                    onChange={(e) => setFormNeck(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Yağ Oranı (% - Body Fat)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="80"
                    placeholder="Örn: 15.4"
                    value={formBodyFat}
                    onChange={(e) => setFormBodyFat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Özel Notlar
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Su içtikten sonra alındı"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 font-bold px-4 py-2 rounded-lg text-xs text-slate-300 transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-400 text-white font-extrabold px-5 py-2 rounded-lg text-xs transition cursor-pointer"
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
