/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/databaseService';
import { 
  Users, 
  Search, 
  UserSquare2, 
  ChevronRight, 
  Target, 
  TrendingDown, 
  Weight, 
  Sparkles,
  Link,
  Loader2
} from 'lucide-react';

interface MyAthletesListProps {
  onSelectAthlete: (athleteId: string) => void;
  onShowToast: (msg: string) => void;
}

export default function MyAthletesList({ onSelectAthlete, onShowToast }: MyAthletesListProps) {
  const { userProfile } = useAuth();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userProfile?.id) return;
    const unsubscribe = databaseService.listenConnectedAthletes(userProfile.id, (list) => {
      setAthletes(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userProfile?.id]);

  const filteredAthletes = athletes.filter(a =>
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-60 flex flex-col justify-center items-center text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span className="text-xs">Sporcular yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Sporcularım Listesi</h2>
          <p className="text-slate-400 text-xs font-normal">Takımınızdaki tüm aktif sporcuların genel durumunu özetleyin.</p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="İsim veya e-posta girin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {filteredAthletes.length === 0 ? (
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto text-slate-600">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-350">Sporcu Yok</h3>
            <p className="text-[10.5px] text-slate-500 max-w-sm mx-auto leading-relaxed">
              {searchQuery ? 'Arama filtresine uyan sporcu kaydı bulunamadı.' : 'Henüz size bağlı bir öğrenci bulunmamakta. Davet kodunuzu paylaşarak öğrencilerinizi sisteme dahil edebilirsiniz!'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAthletes.map((athlete) => {
            const currentW = athlete.currentWeight || 80;
            const targetW = athlete.targetWeight || 75;
            const diff = (currentW - targetW).toFixed(1);

            return (
              <div 
                key={athlete.id}
                className="bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
              >
                {/* Header portion */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm">
                        {athlete.name?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white leading-snug">{athlete.name}</h3>
                        <span className="text-[10px] text-slate-500 block leading-tight font-medium">{athlete.email}</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-850" />

                  {/* Physical attributes metrics display */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-slate-950 rounded-lg text-center">
                      <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Mevcut</span>
                      <span className="text-xs font-black text-slate-200">{currentW} kg</span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-lg text-center">
                      <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Hedef</span>
                      <span className="text-xs font-black text-slate-200">{targetW} kg</span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-lg text-center">
                      <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Kalan</span>
                      <span className={`text-xs font-black ${parseFloat(diff) > 0 ? 'text-teal-400' : 'text-emerald-400'}`}>
                        {diff} kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer details trigger button */}
                <button
                  onClick={() => onSelectAthlete(athlete.id)}
                  className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Gelişim Raporlarını Gör <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
