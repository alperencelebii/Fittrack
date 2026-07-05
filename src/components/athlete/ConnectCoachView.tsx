/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/databaseService';
import { 
  Users, 
  UserCheck2, 
  Sparkles, 
  KeyRound, 
  CheckCircle, 
  Loader2, 
  UserMinus,
  ArrowRight
} from 'lucide-react';

interface ConnectCoachViewProps {
  onShowToast: (msg: string) => void;
}

export default function ConnectCoachView({ onShowToast }: ConnectCoachViewProps) {
  const { userProfile, reloadProfile } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [coachDoc, setCoachDoc] = useState<any | null>(null);
  const [fetchingCoach, setFetchingCoach] = useState(false);

  // Load coach details if connected
  useEffect(() => {
    if (!userProfile?.coachId) {
      setCoachDoc(null);
      return;
    }

    const loadCoach = async () => {
      setFetchingCoach(true);
      try {
        const coach = await databaseService.getUserProfile(userProfile.coachId);
        setCoachDoc(coach);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingCoach(false);
      }
    };
    loadCoach();
  }, [userProfile?.coachId]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || inviteCode.trim().length !== 6) {
      onShowToast('Lütfen geçerli bir 6 haneli davet kodu girin.');
      return;
    }

    setLoading(true);
    try {
      const coach = await databaseService.findCoachByInviteCode(inviteCode.trim());
      if (!coach) {
        onShowToast('Girdiğiniz davet koduna ait bir koç bulunamadı.');
        setLoading(false);
        return;
      }

      await databaseService.connectToCoach(userProfile!.id, coach.id);
      onShowToast(`Tebrikler! Koçuz ${coach.name} ile bağlantı kuruldu.`);
      reloadProfile();
    } catch (err) {
      console.error(err);
      onShowToast('Bağlanırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Eğitmeninizle olan bağlantınızı kesmek istediğinize emin misiniz?')) return;
    if (!userProfile?.coachId) return;

    setLoading(true);
    try {
      await databaseService.disconnectFromCoach(userProfile.id, userProfile.coachId);
      onShowToast('Koç bağlantısı kesildi.');
      reloadProfile();
    } catch (err) {
      console.error(err);
      onShowToast('Bağlantı kesilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in text-slate-200">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-white tracking-tight">Kişisel Eğitmene Bağlan</h2>
        <p className="text-xs text-slate-450 font-normal">Bir koça bağlanarak antrenman & kilo gelişimlerinizi onunla eşzamanlı paylaşın.</p>
      </div>

      {fetchingCoach ? (
        <div className="h-28 flex flex-col items-center justify-center text-slate-400 gap-1.5">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          <span className="text-[10px]">Koç bilgileri yükleniyor...</span>
        </div>
      ) : userProfile?.coachId && coachDoc ? (
        // ALREADY CONNECTED VIEW
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-850 rounded-2xl text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider mx-auto">
              <UserCheck2 className="w-3.5 h-3.5" /> BAĞLANDI
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">{coachDoc.name}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{coachDoc.email}</p>
            </div>

            <div className="text-[10.5px] text-slate-400 leading-relaxed font-normal bg-slate-950 p-3 rounded-xl border border-slate-850 border-dashed">
              Eğitmeniniz şu an sizin profilinizi, antrenman geçmişinizi, kilo grafiklerinizi görebilir; size özel notlar ve hedefler atayabilir.
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-rose-400 hover:text-white font-extrabold hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 text-xs rounded-xl transition inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <UserMinus className="w-4 h-4" />
            Koç Bağlantısını Sonlandır
          </button>
        </div>
      ) : (
        // DISCONNECTED - CHOOSE COACH FORM
        <form onSubmit={handleConnect} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">
              Koç Davet Kodu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Örn: AH62KF"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm font-mono tracking-widest text-emerald-400 font-black focus:outline-none focus:border-emerald-500 text-center placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-600 uppercase"
              />
            </div>
            <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed pl-1">
              Koçunuzun size ilettiği 6 haneli özel davet kodunu girerek onunla saniyeler içinde bağlantı kurun.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || inviteCode.length !== 6}
            className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-slate-950 font-black rounded-xl transition duration-150 inline-flex items-center justify-center gap-1.5 cursor-pointer text-sm shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                Bağlanılıyor...
              </>
            ) : (
              <>
                Eğitmene Bağlan <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
}
