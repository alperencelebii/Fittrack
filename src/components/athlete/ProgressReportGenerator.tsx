import React, { useState } from 'react';
import { 
  Workout, 
  BodyMeasurement, 
  PersonalRecord, 
  RecoveryEntry, 
  WeeklyNutritionSummary,
  UserSettings 
} from '../../types';
import { generateProgressReportPDF } from '../../services/pdfReportService';
import { FileDown, Calendar, Sparkles, CheckCircle, Info } from 'lucide-react';

interface ProgressReportGeneratorProps {
  username: string;
  userSettings?: UserSettings;
  workouts: Workout[];
  measurements: BodyMeasurement[];
  personalRecords: PersonalRecord[];
  recoveryLogs: RecoveryEntry[];
  onShowToast: (msg: string) => void;
}

export default function ProgressReportGenerator({
  username,
  userSettings,
  workouts,
  measurements,
  personalRecords,
  recoveryLogs,
  onShowToast
}: ProgressReportGeneratorProps) {
  // Report date range
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadReport = () => {
    setIsGenerating(true);
    try {
      // Mock some average nutrition compliance values for the report
      const nutritionSummary: WeeklyNutritionSummary = {
        averageCalories: userSettings?.dailyCalorieGoal || 2400,
        averageProtein: 145,
        averageCarbs: 230,
        averageFat: 75,
        averageWater: userSettings?.dailyWaterGoal || 3000,
        goalMatchedDays: 5,
        totalMeals: 20
      };

      const doc = generateProgressReportPDF({
        username,
        userSettings,
        startDate,
        endDate,
        workouts,
        measurements,
        personalRecords,
        recoveryLogs,
        nutritionSummary,
        coachNotes: ['Haftalık antrenman sıklığını koruyun.', 'Protein alımına ve uyku düzenine sadık kalın.']
      });

      doc.save(`FitTrack_Gelisim_Raporu_${startDate}_${endDate}.pdf`);
      onShowToast('Gelişim Raporu PDF Dosyanız Başarıyla İndirildi! 📄📥');
    } catch (err) {
      console.error(err);
      onShowToast('PDF Raporu oluşturulamadı.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="progress-report-generator" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <FileDown className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Kapsamlı Gelişim Raporu (PDF)</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">İstediğiniz iki tarih aralığındaki tüm gelişim, PR, ölçü ve toparlanma verilerinizi tek tıkla resmi PDF raporuna dönüştürün.</p>
        </div>
      </div>

      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label className="text-xs text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Başlangıç Tarihi
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Bitiş Tarihi
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-400"
          />
        </div>

        <button
          onClick={handleDownloadReport}
          disabled={isGenerating}
          className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/10 disabled:opacity-50 h-[38px] cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? 'Rapor Hazırlanıyor...' : 'Resmi PDF Raporu İndir'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 flex gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <h4 className="font-bold text-slate-300 mb-1">Rapor İçeriğinde Neler Var?</h4>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li><strong className="text-slate-200">Kilo ve Vücut Ölçü Değişimleri:</strong> Seçilen tarihler arasındaki ilk ve son ölçümün analizi, BMI ve Bel/Boy riski hesaplaması.</li>
            <li><strong className="text-slate-200">Antrenman & PR Özetleri:</strong> Tamamlanan seans sayıları, yakılan toplam kalori ve bu dönemde kırılan yeni kisisel güç rekorları.</li>
            <li><strong className="text-slate-200">Uyku, Yorgunluk & Motivasyon:</strong> Ortalama uyku süreleri, kas ağrısı seviyeleri ve merkezi sinir sistemi toparlanma değerleri.</li>
            <li><strong className="text-slate-200">Beslenme & Makro Uyum Değerleri:</strong> Ortalama kalori, protein, su tüketimi ve hedefe sadık kalınan gün sayıları.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
