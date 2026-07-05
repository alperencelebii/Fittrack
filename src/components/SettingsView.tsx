/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSettings } from '../types';
import {
  Settings,
  Scale,
  Sparkles,
  RefreshCw,
  Download,
  Upload,
  ShieldAlert,
  Save,
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onShowToast: (msg: string) => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetData,
  onExportData,
  onImportData,
  onShowToast,
}: SettingsViewProps) {
  // Form values
  const [nickname, setNickname] = useState(settings.nickname);
  const [height, setHeight] = useState(String(settings.height));
  const [currentWeight, setCurrentWeight] = useState(String(settings.currentWeight));
  const [targetWeight, setTargetWeight] = useState(String(settings.targetWeight));
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(String(settings.dailyCalorieGoal));
  const [dailyWaterGoal, setDailyWaterGoal] = useState(String(settings.dailyWaterGoal));
  const [theme, setTheme] = useState(settings.theme || 'dark');

  // JSON Import value
  const [importStr, setImportStr] = useState('');
  const [importError, setImportError] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const h = parseFloat(height);
    const cw = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    const cg = parseInt(dailyCalorieGoal);
    const wg = parseInt(dailyWaterGoal);

    if (
      !nickname.trim() ||
      isNaN(h) || h <= 0 ||
      isNaN(cw) || cw <= 0 ||
      isNaN(tw) || tw <= 0 ||
      isNaN(cg) || cg <= 0 ||
      isNaN(wg) || wg <= 0
    ) {
      alert('Lütfen tüm form alanlarını geçerli ve sıfırdan büyük sayısal değerlerle doldurun.');
      return;
    }

    const payload: UserSettings = {
      nickname: nickname.trim(),
      height: h,
      currentWeight: cw,
      targetWeight: tw,
      dailyCalorieGoal: cg,
      dailyWaterGoal: wg,
      theme: theme as 'dark' | 'light',
      createdAt: settings.createdAt,
    };

    onUpdateSettings(payload);
    onShowToast('Profil ve hedefleriniz başarıyla güncellendi!');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importStr.trim()) {
      setImportError('Lütfen içe aktarılacak JSON kodunu yapıştırın.');
      return;
    }

    const success = onImportData(importStr);
    if (success) {
      setImportStr('');
      setImportError('');
      alert('Tüm verileriniz ve yedeklenen kayıtlarınız başarıyla içe aktarıldı! Sayfa yenilenecektir.');
      window.location.reload();
    } else {
      setImportError('Geçersiz JSON formatı. Lütfen dışa aktardığınız geçerli kod satırlarını aynen iletin.');
    }
  };

  const handleResetClick = () => {
    if (confirm('DİKKAT: Uygulamadaki tüm antrenman, kilo ve kalori kayıtlarınız TAMAMEN SİLİNECEKTİR. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
      if (confirm('Son bir kez onaylıyor musunuz? Tüm cihaz verileriniz sıfırlanacaktır.')) {
        onResetData();
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Kullanıcı & Hedef Ayarları</h1>
        <p className="text-xs text-slate-400 mt-1">
          Kişisel bilgilerinizi düzenleyebilir, günlük planlamalarınızı ayarlayabilir veya verilerinizi yedekleyebilirsiniz.
        </p>
      </div>

      {/* Grid of panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel 1: Profile & Target settings (form) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5 border-b border-slate-850 pb-2">
            <Settings className="w-4 h-4 text-emerald-450" /> Profil ve Hedef Bilgileri
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Takma Adınız / Nickname *
                </label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Boy Uzunluğu (cm) *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="300"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Güncel Ağırlık (kg) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="10"
                  max="500"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Hedef Ağırlık (kg) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="10"
                  max="500"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Günlük Kalori Hedefi (kcal) *
                </label>
                <input
                  type="number"
                  required
                  step="50"
                  min="500"
                  max="10000"
                  value={dailyCalorieGoal}
                  onChange={(e) => setDailyCalorieGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Günlük Su Tüketim Hedefi (ml) *
                </label>
                <input
                  type="number"
                  required
                  step="100"
                  min="500"
                  max="10000"
                  value={dailyWaterGoal}
                  onChange={(e) => setDailyWaterGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Görünüm Teması (Zorunlu Koyu) *
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="dark" className="bg-slate-900 text-white">Koyu Tema (Önerilen 🌌)</option>
                  <option value="light" className="bg-slate-900 text-white">Açık Tema</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition duration-150 inline-flex items-center gap-1.5 cursor-pointer text-sm font-bold shadow-md shadow-emerald-400/5 active:scale-[0.98]"
              >
                <Save className="w-4 h-4" /> Ayarları Kaydet
              </button>
            </div>
          </form>
        </div>

        {/* Panel 2: Backup & Restore (JSON export / import) and safety warning */}
        <div className="space-y-6">
          
          {/* Safeguard security card */}
          <div className="bg-slate-900 border border-emerald-500/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 px-1.5 h-full bg-rose-500" />
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-450" /> Veri Güvenliği Bildirimi
              </h3>
              <p className="text-xs text-slate-350 leading-relaxed font-normal">
                Bu sürümde verileriniz tamamen yerel tarayıcı önbelleğinizde saklanır. Hesap bulut sistemi entegre olmadığı için tarayıcı temizlenirse kayıtlarınız da kaybolabilir.
              </p>
              <p className="text-[11px] text-slate-500">
                Gelişimlerinizi korumak adına haftalık olarak aşağıdan yedek alabilirsiniz.
              </p>
            </div>
          </div>

          {/* Backup Management card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <RefreshCw className="w-4 h-4 text-blue-450" /> Yedekleme Kontrolleri
            </h2>

            <div className="space-y-3.5">
              <button
                onClick={onExportData}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 hover:border-slate-750 text-xs font-bold rounded-lg border border-slate-800 text-slate-200 transition inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-400" /> Cihaza Verileri İndir (JSON)
              </button>

              <form onSubmit={handleImportSubmit} className="space-y-2 border-t border-slate-850 pt-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Yedekten Veri Yükle (Import JSON)
                </label>
                {importError && (
                  <p className="text-[10px] font-bold text-rose-400">{importError}</p>
                )}
                <textarea
                  rows={3}
                  placeholder='Dışa aktardığınız {"userSettings": ...} şeklindeki JSON kodunu buraya yapıştırıp içe aktara basın...'
                  value={importStr}
                  onChange={(e) => setImportStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-slate-300 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 hover:bg-blue-450 text-white text-xs font-bold rounded-lg transition inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Upload className="w-4 h-4" /> İçe Aktarımı Başlat
                </button>
              </form>
            </div>
          </div>

          {/* Destructive actions card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5">
            <h2 className="text-xs font-bold text-rose-450 tracking-widest uppercase">Tehlikeli İşlemler</h2>
            <p className="text-[11.5px] text-slate-400 leading-normal">
              Tüm antrenman geçmişlerinizi, su verilerinizi ve hedeflerinizi kalıcı olarak silip uygulamayı sıfırlayın.
            </p>
            <button
              onClick={handleResetClick}
              className="w-full py-2 bg-rose-500/10 hover:bg-rose-500 hover:text-slate-950 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg transition text-center cursor-pointer active:scale-95"
            >
              Uygulamayı ve Verileri Sıfırla
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
