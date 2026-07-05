import React, { useState, useMemo } from 'react';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { databaseService } from '../../services/databaseService';
import { 
  Search, 
  Dumbbell, 
  Star, 
  BookOpen, 
  Filter, 
  ChevronRight, 
  SlidersHorizontal,
  Info 
} from 'lucide-react';

interface ExerciseLibraryViewProps {
  userId: string;
  favorites: string[];
  onShowToast: (msg: string) => void;
}

const MUSCLE_GROUPS: { label: string; value: string }[] = [
  { label: 'Tüm Kaslar', value: 'All' },
  { label: 'Göğüs (Chest)', value: 'Chest' },
  { label: 'Sırt (Back)', value: 'Back' },
  { label: 'Omuz (Shoulders)', value: 'Shoulders' },
  { label: 'Ön Kol (Biceps)', value: 'Biceps' },
  { label: 'Arka Kol (Triceps)', value: 'Triceps' },
  { label: 'Ön Bacak (Quads)', value: 'Quads' },
  { label: 'Arka Bacak (Hamstrings)', value: 'Hamstrings' },
  { label: 'Kalf (Calves)', value: 'Calves' },
  { label: 'Karın (Abs)', value: 'Abs' }
];

const EQUIPMENT_TYPES: { label: string; value: string }[] = [
  { label: 'Tüm Ekipmanlar', value: 'All' },
  { label: 'Barbell (Bar)', value: 'Barbell' },
  { label: 'Dumbbell (Dambıl)', value: 'Dumbbell' },
  { label: 'Kablo (Cable)', value: 'Cable' },
  { label: 'Vücut Ağırlığı', value: 'Bodyweight' },
  { label: 'Makine (Machine)', value: 'Machine' },
  { label: 'Plaka (Plate)', value: 'Plate' }
];

export default function ExerciseLibraryView({
  userId,
  favorites,
  onShowToast
}: ExerciseLibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [compoundFilter, setCompoundFilter] = useState<'all' | 'compound' | 'isolation'>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Selected item details
  const [selectedExId, setSelectedExId] = useState<string | null>(null);

  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      if (!ex) return false;
      
      const exName = ex.name || '';
      const matchSearch = 
        exName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.keywords || []).some(k => k && k.toLowerCase().includes(searchTerm.toLowerCase()));

      const primaryMusclesArr = Array.isArray(ex.primaryMuscles) ? ex.primaryMuscles : [];
      const secondaryMusclesArr = Array.isArray(ex.secondaryMuscles) ? ex.secondaryMuscles : [];
      const matchMuscle = 
        selectedMuscle === 'All' || 
        primaryMusclesArr.includes(selectedMuscle) || 
        secondaryMusclesArr.includes(selectedMuscle);

      const equipmentArr = Array.isArray(ex.equipment) ? ex.equipment : [ex.equipment].filter(Boolean);
      const matchEquipment = selectedEquipment === 'All' || equipmentArr.includes(selectedEquipment as any);
      
      const matchCompound = 
        compoundFilter === 'all' || 
        (compoundFilter === 'compound' && ex.isCompound) ||
        (compoundFilter === 'isolation' && !ex.isCompound);

      const isFav = favorites.includes(ex.id);
      const matchFav = !showOnlyFavorites || isFav;

      return matchSearch && matchMuscle && matchEquipment && matchCompound && matchFav;
    });
  }, [searchTerm, selectedMuscle, selectedEquipment, compoundFilter, favorites, showOnlyFavorites]);

  // Log counts when exercise list is empty
  React.useEffect(() => {
    if (filteredExercises.length === 0) {
      console.warn('Exercise list is empty. Filters state:', {
        searchTerm,
        selectedMuscle,
        selectedEquipment,
        compoundFilter,
        totalLibrary: EXERCISE_LIBRARY.length
      });
    }
  }, [filteredExercises.length, searchTerm, selectedMuscle, selectedEquipment, compoundFilter]);

  const selectedEx = useMemo(() => {
    if (selectedExId) {
      const found = EXERCISE_LIBRARY.find(e => e.id === selectedExId);
      if (found) return found;
    }
    return filteredExercises[0] || EXERCISE_LIBRARY[0];
  }, [selectedExId, filteredExercises]);

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = favorites.includes(id);

    try {
      if (isFav) {
        await databaseService.removeFavoriteExercise(userId, id);
        onShowToast('Egzersiz favorilerden çıkarıldı.');
      } else {
        await databaseService.saveFavoriteExercise(userId, id);
        onShowToast('Egzersiz favorilerinize eklendi! ⭐️');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safely extract instructions array supporting .en and regular array format
  const instructionsToRender = useMemo(() => {
    if (!selectedEx) return [];
    if (Array.isArray(selectedEx.instructions)) {
      return selectedEx.instructions;
    }
    if (selectedEx.instructions && typeof selectedEx.instructions === 'object' && Array.isArray((selectedEx.instructions as any).en)) {
      return (selectedEx.instructions as any).en;
    }
    return [];
  }, [selectedEx]);

  return (
    <div id="exercise-library-view" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Kapsamlı Egzersiz Kütüphanesi</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">Nizami form videoları, birincil kas grupları ve doğru form talimatlarını inceleyin.</p>
        </div>

        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
            showOnlyFavorites 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
          Sadece Favoriler ({favorites.length})
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Arama (Türkçe)</label>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Egzersiz ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-300 focus:outline-none w-full placeholder-slate-500"
            />
          </div>
        </div>

        {/* Muscle Filter */}
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Hedef Kas Grubu</label>
          <select
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-400"
          >
            {MUSCLE_GROUPS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Equipment Filter */}
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Ekipman Tipi</label>
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-400"
          >
            {EQUIPMENT_TYPES.map(eq => (
              <option key={eq.value} value={eq.value}>{eq.label}</option>
            ))}
          </select>
        </div>

        {/* Compound / Isolation Filter */}
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Egzersiz Sınıfı</label>
          <div className="grid grid-cols-3 gap-1">
            {(['all', 'compound', 'isolation'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCompoundFilter(type)}
                className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                  compoundFilter === type
                    ? 'bg-emerald-400 text-slate-950 border-emerald-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {type === 'all' ? 'Tümü' : type === 'compound' ? 'Bileşik' : 'İzole'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT LIST: Filtered Exercises */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-4 max-h-[500px] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {filteredExercises.map((ex) => {
              const isFav = favorites.includes(ex.id);
              const isActive = selectedEx && selectedEx.id === ex.id;
              const primaryMuscleDisplay = Array.isArray(ex.primaryMuscles) ? ex.primaryMuscles[0] : '';
              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExId(ex.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive 
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-inner' 
                      : 'bg-slate-900/60 border-slate-850 hover:border-slate-750'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/40 text-emerald-400 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{ex.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400">{primaryMuscleDisplay}</span>
                        <span className="text-[8px] bg-slate-850 text-slate-500 px-1 py-0.2 rounded font-bold uppercase">
                          {ex.isCompound ? 'Bileşik' : 'İzole'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggleFavorite(ex.id, e)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition-all"
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              );
            })}

            {filteredExercises.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-xs">
                Egzersiz bulunamadı. Filtreleri temizleyip tekrar deneyin.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PREVIEW: Detail Card */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          {selectedEx ? (
            <div>
              <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-black text-white">{selectedEx.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/20">
                      {Array.isArray(selectedEx.equipment)
                        ? (selectedEx.equipment.find(e => ['Dambıl', 'Barbell', 'Kablo', 'Vücut ağırlığı', 'Makine', 'Direnç bandı', 'Kettlebell', 'Pilates topu', 'Sağlık topu', 'EZ Barbell', 'Foam Roller', 'Sehpa', 'Barfiks Demiri'].includes(e)) || selectedEx.equipment[0])
                        : selectedEx.equipment}
                    </span>
                    <span className="bg-slate-900 text-slate-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-slate-800">
                      {(selectedEx as any).unilateral ? 'Tek Kollu (Unilateral)' : 'Bilateral'}
                    </span>
                    {(selectedEx as any).source === 'free-exercise-db' && (
                      <span className="bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-sky-500/20">
                        Free Exercise DB
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleToggleFavorite(selectedEx.id, e)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl transition-all"
                >
                  <Star className={`w-4.5 h-4.5 ${favorites.includes(selectedEx.id) ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                </button>
              </div>

              {/* Muscles visualization */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-0.5">Birincil Çalışan Kas</span>
                  <span className="font-bold text-slate-200 text-xs">{(selectedEx as any).primaryMuscle || (selectedEx.primaryMuscles && selectedEx.primaryMuscles[0]) || 'Belirtilmemiş'}</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-0.5">Yardımcı Kaslar</span>
                  <span className="font-bold text-slate-400 text-xs">
                    {(Array.isArray(selectedEx.secondaryMuscles) && selectedEx.secondaryMuscles.join(', ')) || 'Yok'}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block mb-2">Doğru Uygulanış Talimatı</span>
                <ol className="text-xs text-slate-400 flex flex-col gap-2.5 list-decimal pl-4 leading-relaxed">
                  {instructionsToRender.map((step, idx) => (
                    <li key={idx} className="marker:text-emerald-400 pl-1">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 text-xs">
              <Info className="w-8 h-8 text-emerald-400/40 mb-2" />
              <span>Lütfen ayrıntılarını görmek için sol taraftan bir egzersiz seçin.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
