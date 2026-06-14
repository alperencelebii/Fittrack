/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Dumbbell, Activity, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (settings: UserSettings, loadDemo: boolean) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [nickname, setNickname] = useState('');
  const [height, setHeight] = useState('180');
  const [currentWeight, setCurrentWeight] = useState('80');
  const [targetWeight, setTargetWeight] = useState('75');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState('2200');
  const [dailyWaterGoal, setDailyWaterGoal] = useState('3000');
  const [errorStr, setErrorStr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setErrorStr('Lütfen bir takma ad girin.');
      return;
    }

    const h = parseFloat(height);
    const cw = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    const cg = parseInt(dailyCalorieGoal);
    const wg = parseInt(dailyWaterGoal);

    if (isNaN(h) || h <= 0 || isNaN(cw) || cw <= 0 || isNaN(tw) || tw <= 0 || isNaN(cg) || cg <= 0 || isNaN(wg) || wg <= 0) {
      setErrorStr('Lütfen sıfırdan büyük geçerli sayısal değerler girin.');
      return;
    }

    const settings: UserSettings = {
      nickname: nickname.trim(),
      height: h,
      currentWeight: cw,
      targetWeight: tw,
      dailyCalorieGoal: cg,
      dailyWaterGoal: wg,
      theme: 'dark',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onComplete(settings, false);
  };

  const handleDemoLoad = () => {
    const dummySettings: UserSettings = {
      nickname: 'Caner Özdemir',
      height: 182,
      currentWeight: 82.5,
      targetWeight: 78,
      dailyCalorieGoal: 2300,
      dailyWaterGoal: 3000,
      theme: 'dark',
      createdAt: new Date().toISOString().split('T')[0],
    };
    onComplete(dummySettings, true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_45%)] pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10 my-8">
        <div className="p-6 sm:p-10 border-b border-slate-800 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            FitTrack <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-md">
            Hesap açmadan, tamamen gizli ve güvenli şekilde antrenmanlarınızı, kilo değişimlerinizi ve beslenmenizi cihazınızda takip edin.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">Sıfır Giriş</h3>
                <p className="text-xs text-slate-400 mt-0.5">Üye olmak yok, anında takip başlar.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl flex items-start space-x-3">
              <Activity className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">Yerel Depolama</h3>
                <p className="text-xs text-slate-400 mt-0.5">Verileriniz tamamen cihazınızda kalır.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl flex items-start space-x-3">
              <HeartPulse className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">Akıllı Analiz</h3>
                <p className="text-xs text-slate-400 mt-0.5">Alışkanlıklarınıza göre rehberlik önerileri.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Profil ve Hedeflerini Belirle
            </h2>

            {errorStr && (
              <div className="p-3 bg-red-950/80 border border-red-500/30 text-red-300 rounded-lg text-sm">
                {errorStr}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Takma Adınız / Nickname
                </label>
                <input
                  type="text"
                  placeholder="Örn: Can"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Boy (cm)
                </label>
                <input
                  type="number"
                  min="50"
                  max="300"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Güncel Kilo (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="10"
                  max="500"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Hedef Kilo (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="10"
                  max="500"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Günlük Kalori Hedefi (kcal)
                </label>
                <input
                  type="number"
                  step="50"
                  min="500"
                  max="10000"
                  value={dailyCalorieGoal}
                  onChange={(e) => setDailyCalorieGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Günlük Su Hedefi (ml)
                </label>
                <input
                  type="number"
                  step="100"
                  min="500"
                  max="10000"
                  value={dailyWaterGoal}
                  onChange={(e) => setDailyWaterGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-lg shadow-emerald-500/20 active:translate-y-[1px] cursor-pointer"
              >
                Kurulumu Tamamla ve Başla
              </button>
              <button
                type="button"
                onClick={handleDemoLoad}
                className="bg-slate-800 hover:bg-slate-700 hover:border-slate-600 text-slate-200 border border-slate-700 font-semibold py-3.5 px-6 rounded-xl transition duration-200 shrink-0 cursor-pointer"
              >
                Hazır Demo Veri Yükle
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
            * Verileriniz tarayıcınızın yerel depolama ve önbellek birimine (localStorage) kaydedilir. Hiçbir sunucuya gönderilmez. Bilgilerinizin güvenliği tamamen sizin kontrolünüzdedir.
          </p>
        </div>
      </div>
    </div>
  );
}
