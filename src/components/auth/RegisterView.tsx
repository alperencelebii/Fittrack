/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { databaseService } from '../../services/databaseService';
import { Dumbbell, KeyRound, Mail, User, Shield, Sparkles, Loader2, Users } from 'lucide-react';

interface RegisterViewProps {
  onToggleToLogin: () => void;
  onShowToast: (msg: string) => void;
}

export default function RegisterView({ onToggleToLogin, onShowToast }: RegisterViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'athlete' | 'coach'>('athlete');
  const [inviteCode, setInviteCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateInviteCode = () => {
    // Generate a secure 6-digit uppercase invite code for coaches
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || password.length < 6) {
      setError('Lütfen tüm zorunlu alanları doldurun ve en az 6 haneli şifre girin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. If Athlete has entered an invite code, check if that coach actually exists first
      let resolvedCoachId = '';
      if (role === 'athlete' && inviteCode.trim()) {
        const foundCoach = await databaseService.findCoachByInviteCode(inviteCode.trim());
        if (!foundCoach) {
          setError('Girdiğiniz davet koduna ait bir koç bulunamadı. Lütfen kontrol edin veya boş bırakın.');
          setLoading(false);
          return;
        }
        resolvedCoachId = foundCoach.id;
      }

      // 2. Create the user in Auth
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const userId = cred.user.uid;

      // 3. Setup User document details
      const userProfile: any = {
        id: userId,
        email: email.trim(),
        name: name.trim(),
        role,
        createdAt: new Date().toISOString(),
        // Core Athlete target defaults
        height: 175,
        currentWeight: 75,
        targetWeight: 70,
        dailyCalorieGoal: 2000,
        dailyWaterGoal: 2500,
        theme: 'dark',
      };

      if (role === 'coach') {
        userProfile.inviteCode = generateInviteCode();
      } else if (resolvedCoachId) {
        userProfile.coachId = resolvedCoachId;
      }

      // 4. Save to Firestore
      await databaseService.saveUserProfile(userId, userProfile);

      // 5. If athlete is connected to a coach, create the relation sync doc too
      if (role === 'athlete' && resolvedCoachId) {
        await databaseService.connectToCoach(userId, resolvedCoachId);
      }

      onShowToast('Hesabınız başarıyla oluşturuldu! Hoş geldiniz.');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda.');
      } else if (err.code === 'auth/invalid-email') {
        setError('E-posta adresi geçersiz.');
      } else {
        setError('Kayıt oluşturulurken beklenmedik bir hata meydana geldi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.03),transparent_40%)] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-5">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black mx-auto">
            <Dumbbell className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Kayıt Ol</h2>
          <span className="text-xs text-slate-450 font-medium block">
            Kişiselleştirilmiş gelişim takibine başlayın
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Ad Soyad */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Adınız Soyadınız *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder="Örn: Ahmet Can"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* E-posta */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              E-posta Adresi *
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Şifre */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Giriş Şifresi *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="•••••• (En az 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Hesap Türü Seçimi */}
          <div className="grid grid-cols-2 gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => setRole('athlete')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer text-xs font-semibold ${
                role === 'athlete'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-5 h-5 shrink-0" />
              <span>Sporcuyum</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('coach')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer text-xs font-semibold ${
                role === 'coach'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>Koç / Eğitmenim</span>
            </button>
          </div>

          {/* Athlete Optional Coach Invite Code */}
          {role === 'athlete' && (
            <div className="space-y-1.5 animate-fade-in p-3 bg-slate-950 rounded-xl border border-slate-850">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Koç Davet Kodu (Opsiyonel)
              </label>
              <input
                type="text"
                placeholder="Örn: FR38KA"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 uppercase font-mono tracking-widest text-center"
              />
              <p className="text-[10px] text-slate-500 font-medium leading-normal leading-relaxed">
                Eğer eğitmeninizin bir kodu varsa buraya girerek ona anında bağlanabilirsiniz.
              </p>
            </div>
          )}

          {/* Coach Invite Info */}
          {role === 'coach' && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-center space-y-1 animate-fade-in">
              <p className="text-[11px] text-emerald-400 font-bold uppercase flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Koç Davet Kodu Üretici
              </p>
              <p className="text-[10.5px] text-slate-400 leading-normal font-normal">
                Kaydolduktan sonra, panonuzda size özel 6 haneli bir davet kodu üretilecektir. Sporcularınız bu kodu girerek size bağlanabilir.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl transition duration-150 inline-flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Hesap Açılıyor...
              </>
            ) : (
              <>
                Hesabımı Oluştur ve Başla
              </>
            )}
          </button>
        </form>

        <div className="border-t border-slate-850 pt-4 text-center">
          <p className="text-xs text-slate-400">
            Zaten hesabınız var mı?{' '}
            <button
              onClick={onToggleToLogin}
              className="text-emerald-400 font-extrabold hover:underline cursor-pointer"
            >
              Giriş Yap
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
