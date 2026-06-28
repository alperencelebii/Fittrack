import React, { useState, useMemo } from 'react';
import { ProgressPhoto } from '../../types';
import { databaseService } from '../../services/databaseService';
import { 
  Camera, 
  Trash2, 
  Plus, 
  Columns, 
  Tag, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

interface ProgressPhotosViewProps {
  userId: string;
  photos: ProgressPhoto[];
  onShowToast: (msg: string) => void;
}

export default function ProgressPhotosView({
  userId,
  photos,
  onShowToast
}: ProgressPhotosViewProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form states
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pose, setPose] = useState<'front' | 'side' | 'back'>('front');
  const [notes, setNotes] = useState('');
  
  // Custom mock illustration image generator based on choice or file base64
  const [photoUrl, setPhotoUrl] = useState('');

  // Comparison states
  const [compareIdA, setCompareIdA] = useState<string>('');
  const [compareIdB, setCompareIdB] = useState<string>('');

  const photoA = useMemo(() => photos.find(p => p.id === compareIdA), [photos, compareIdA]);
  const photoB = useMemo(() => photos.find(p => p.id === compareIdB), [photos, compareIdB]);

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalUrl = photoUrl;
    if (!finalUrl) {
      // Generate standard high-quality premium visual placeholders depending on pose
      if (pose === 'front') {
        finalUrl = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=60';
      } else if (pose === 'side') {
        finalUrl = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60';
      } else {
        finalUrl = 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=600&auto=format&fit=crop&q=60';
      }
    }

    try {
      const newPhoto: ProgressPhoto = {
        id: Math.random().toString(36).substring(2, 9),
        userId,
        date,
        url: finalUrl,
        pose,
        notes,
        createdAt: new Date().toISOString()
      };

      await databaseService.saveProgressPhoto(newPhoto);
      onShowToast('Gelişim fotoğrafı başarıyla eklendi! 📸💪');
      setIsUploadOpen(false);
      setPhotoUrl('');
      setNotes('');
    } catch (err: any) {
      console.error('AI Antrenman/Gelişim gerçek hata:', err);
      let msg = 'Fotoğraf eklenemedi.';
      if (!userId) {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message && err.message.includes('kullanıcı oturumu bulunamadı')) {
        msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      } else if (err.message) {
        msg = err.message;
      }
      onShowToast(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) {
      try {
        await databaseService.deleteProgressPhoto(id);
        onShowToast('Fotoğraf silindi.');
        if (compareIdA === id) setCompareIdA('');
        if (compareIdB === id) setCompareIdB('');
      } catch (err: any) {
        console.error('AI Antrenman/Gelişim gerçek hata:', err);
        let msg = 'Fotoğraf silinemedi.';
        if (!userId) {
          msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
        } else if (err.message && err.message.includes('kullanıcı oturumu bulunamadı')) {
          msg = 'Bu işlem için kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
        }
        onShowToast(msg);
      }
    }
  };

  return (
    <div id="progress-photos-view" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Gelişim Fotoğrafları & Değişim Karşılaştırma</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">Fiziksel değişiminizi görselleştirin ve istediğiniz iki tarihi yan yana karşılaştırın.</p>
        </div>

        <button
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-lg shadow-indigo-500/15"
        >
          <Plus className="w-4 h-4" /> Yeni Fotoğraf Ekle
        </button>
      </div>

      {isUploadOpen && (
        <form onSubmit={handleAddPhoto} className="mb-6 bg-slate-950 p-5 rounded-xl border border-indigo-500/20 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Tarih</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Duruş / Poz Tipi</label>
            <select
              value={pose}
              onChange={(e) => setPose(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="front">Ön (Front)</option>
              <option value="side">Yan (Side)</option>
              <option value="back">Arka (Back)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-400 block mb-1 font-medium">Fotoğraf URL (Boş bırakılırsa örnek görsel atanır)</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-slate-400 block mb-1 font-medium">Notlar</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Aç karnına, antrenman öncesi ışık altında."
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all"
            >
              Kaydet
            </button>
          </div>
        </form>
      )}

      {/* SIDE BY SIDE SPLIT SCREEN VIEW */}
      {photos.length >= 2 && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 mb-8">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
            <Columns className="w-4 h-4 text-indigo-400" /> Yan Yana Karşılaştır
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Önceki Tarih (Fotoğraf A)</label>
              <select
                value={compareIdA}
                onChange={(e) => setCompareIdA(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              >
                <option value="">Seçin...</option>
                {photos.map(p => (
                  <option key={p.id} value={p.id}>{p.date} - {p.pose.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Sonraki Tarih (Fotoğraf B)</label>
              <select
                value={compareIdB}
                onChange={(e) => setCompareIdB(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              >
                <option value="">Seçin...</option>
                {photos.map(p => (
                  <option key={p.id} value={p.id}>{p.date} - {p.pose.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* S-B-S Frame */}
          {photoA && photoB ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 p-4 rounded-xl border border-slate-850">
              <div className="flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] max-h-[350px] overflow-hidden rounded-xl border border-slate-800">
                  <img
                    src={photoA.url}
                    alt="A"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-400" /> {photoA.date} ({photoA.pose})
                  </div>
                </div>
                {photoA.notes && <p className="text-xs text-slate-400 italic text-center mt-2">"{photoA.notes}"</p>}
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] max-h-[350px] overflow-hidden rounded-xl border border-slate-800">
                  <img
                    src={photoB.url}
                    alt="B"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-400" /> {photoB.date} ({photoB.pose})
                  </div>
                </div>
                {photoB.notes && <p className="text-xs text-slate-400 italic text-center mt-2">"{photoB.notes}"</p>}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs flex flex-col items-center gap-1 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl">
              <Info className="w-5 h-5 text-indigo-400/40" />
              <span>Görsel bir gelişim farkı incelemek için yukarıdan iki farklı fotoğraf seçin.</span>
            </div>
          )}
        </div>
      )}

      {/* ALL PHOTOS GRID */}
      <h3 className="text-sm font-bold text-slate-300 mb-4">Tüm Fotoğraf Arşiviniz</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative bg-slate-950 border border-slate-850 hover:border-slate-750 transition-all rounded-xl overflow-hidden">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={photo.url}
                alt={photo.pose}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-1 rounded text-[9px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-2.5 h-2.5 text-indigo-400" /> {photo.pose}
              </div>
              
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 bg-rose-950/80 p-1.5 rounded text-rose-400 hover:bg-rose-900 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="p-3">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Calendar className="w-3 h-3" /> {photo.date}
              </div>
              {photo.notes && <p className="text-[10px] text-slate-500 italic mt-1 line-clamp-2">{photo.notes}</p>}
            </div>
          </div>
        ))}

        {photos.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 text-xs bg-slate-950/20 rounded-xl border border-dashed border-slate-800">
            Henüz kayıt yok. İlk kaydınızı ekleyerek takibe başlayın.
          </div>
        )}
      </div>
    </div>
  );
}
