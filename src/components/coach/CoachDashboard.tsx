/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/databaseService';
import { 
  Users, 
  Copy, 
  Sparkles, 
  CheckCircle, 
  Plus, 
  Search, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Target,
  ArrowRight,
  UserCheck2,
  CalendarCheck2
} from 'lucide-react';

interface CoachDashboardProps {
  onSelectAthlete: (athleteId: string) => void;
  onNavigateToAthletes: () => void;
  onShowToast: (msg: string) => void;
}

export default function CoachDashboard({ onSelectAthlete, onNavigateToAthletes, onShowToast }: CoachDashboardProps) {
  const { userProfile } = useAuth();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userProfile?.id) return;
    const unsubscribe = databaseService.listenConnectedAthletes(userProfile.id, (list) => {
      setAthletes(list);
    });
    return () => unsubscribe();
  }, [userProfile?.id]);

  const copyInviteCode = () => {
    if (!userProfile?.inviteCode) return;
    navigator.clipboard.writeText(userProfile.inviteCode);
    setCopied(true);
    onShowToast('Davet kodu panoya kopyalandı!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter athletes
  const filteredAthletes = athletes.filter(a => 
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalAthletes = athletes.length;
  
  // Calculate active athletes this week (Assume they are active if registered or logged)
  const activeThisWeek = athletes.length; // Simply count current connected

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner Greetings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Koç Yönetim Paneli
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Kaptan {userProfile?.name}!</h1>
          <p className="text-slate-400 text-xs">Bağlı sporcularınızın gelişimlerini, hedeflerini ve günlük veri kayıtlarını tek noktadan takip edin.</p>
        </div>

        {/* Copy Invite Code Card inside Header */}
        <div className="relative z-10 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-6 shrink-0 md:max-w-xs w-full">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Davet Kodunuz</span>
            <span className="text-xl font-mono font-black text-emerald-400 tracking-widest">{userProfile?.inviteCode || 'N/A'}</span>
          </div>
          <button
            onClick={copyInviteCode}
            className="p-2.5 bg-slate-850 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-emerald-400 transition cursor-pointer active:scale-95"
            title="Kodu Kopyala"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bento Grid Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Toplam Sporcu</span>
            <span className="text-2xl font-black text-white">{totalAthletes}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-lg">
            <UserCheck2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif Üyeler</span>
            <span className="text-2xl font-black text-white">{activeThisWeek}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-4 col-span-2">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Durum Özeti</span>
            <span className="text-xs text-slate-300 font-semibold block mt-0.5">Tüm öğrencileriniz kararlı bir tempoda kilolarını güncelliyor.</span>
          </div>
        </div>
      </div>

      {/* Main Container Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Search & Athlete Quick Lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Bağlı Sporcularım</h3>
            <button 
              onClick={onNavigateToAthletes}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Hepsini Gör <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Sporcu adı veya e-posta ile arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Athletes List */}
          {filteredAthletes.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-850 border-dashed rounded-xl space-y-3">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400">Herhangi bir sporcu bulunamadı</p>
                <p className="text-[10px] text-slate-500 max-w-md mx-auto">
                  {searchQuery ? 'Aramanıza uyan sporcu yok.' : 'Henüz size bağlı bir sporcu yok. Yukarıdaki davet kodunuzu paylaşarak hemen sporcularınızı bağlayabilirsiniz!'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAthletes.slice(0, 4).map((athlete) => (
                <div 
                  key={athlete.id}
                  onClick={() => onSelectAthlete(athlete.id)}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/45 transition duration-150 cursor-pointer space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition">{athlete.name}</h4>
                      <span className="text-[10px] text-slate-500 block font-medium">{athlete.email}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                      Sporcu
                    </span>
                  </div>

                  <hr className="border-slate-850" />

                  {/* Body Goals Quick Info */}
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div>
                      <span className="text-slate-500 block">Kilo</span>
                      <span className="text-slate-300 font-semibold">{athlete.currentWeight || '80'} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Hedef Kilo</span>
                      <span className="text-slate-300 font-semibold">{athlete.targetWeight || '75'} kg</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-end text-[10px] text-emerald-400 font-bold gap-1 group-hover:translate-x-1 transition-transform">
                    Gelişimi ve Dosyayı İncele <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Invite Instruction Card */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Kurulum & Bilgilendirme</h3>
          
          <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">!</span>
              <h4 className="text-xs font-bold text-white">Sporcu Kodu Nasıl Giriş Yapar?</h4>
            </div>

            <ol className="space-y-3 text-[10.5px] text-slate-450 list-decimal pl-4 font-normal leading-relaxed">
              <li>
                <strong className="text-slate-200">Kodu İletin</strong>: Yukarıdaki 6 haneli davet kodunuzu (<span className="text-emerald-400 font-mono font-semibold">{userProfile?.inviteCode}</span>) sporcunuza mesaj olarak atın.
              </li>
              <li>
                <strong className="text-slate-200">Sporcu Bağlantısı</strong>: Sporcunuz kendi uygulamasında <span className="text-slate-200">"Ayarlar/Profil"</span> veya sol menüdeki <span className="text-slate-200">"Koça Bağlan"</span> sekmesine gelip bu kodu girer.
              </li>
              <li>
                <strong className="text-slate-200">Gözlem & Öneri</strong>: Bağlantı kurulduğu an, sporcu buradaki listenize düşer. Gelişim grafiklerini inceleyebilir, özel notlar ve hedefler iletebilirsiniz. Safe & Sync!
              </li>
            </ol>
          </div>
        </div>

      </div>

    </div>
  );
}
