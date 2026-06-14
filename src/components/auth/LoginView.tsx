/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { Dumbbell, KeyRound, Mail, Sparkles, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onToggleToRegister: () => void;
  onShowToast: (msg: string) => void;
}

export default function LoginView({ onToggleToRegister, onShowToast }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || password.length < 6) {
      setError('Lütfen geçerli bir e-posta ve en az 6 karakterli şifre girin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onShowToast('Giriş başarılı! Hoş geldiniz.');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Hatalı e-posta adresi veya şifre girdiniz.');
      } else {
        setError('Giriş yapılırken beklenmedik bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.03),transparent_40%)] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Logo Branding Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black mx-auto">
            <Dumbbell className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">FitTrack AI</h2>
          <span className="text-xs text-slate-400 font-medium block">
            Koç ve Sporcu Antrenman & Gelişim Takip Sistemi
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Input fields form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5 animate-fade-in">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              E-posta Adresi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="ornek@fittrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Şifre
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl transition duration-150 inline-flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-emerald-400/5 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Giriş Yapılıyor...
              </>
            ) : (
              <>
                Giriş Yap ve Başla
              </>
            )}
          </button>
        </form>

        {/* Divider and switch to Sign Up */}
        <div className="border-t border-slate-850 pt-4 text-center">
          <p className="text-xs text-slate-400">
            Hesabınız yok mu?{' '}
            <button
              onClick={onToggleToRegister}
              className="text-emerald-400 font-extrabold hover:underline cursor-pointer"
            >
              Hemen Kaydolun
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
