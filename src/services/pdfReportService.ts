import { jsPDF } from 'jspdf';
import { 
  Workout, 
  BodyMeasurement, 
  PersonalRecord, 
  RecoveryEntry, 
  WeeklyNutritionSummary,
  UserSettings 
} from '../types';
import { calculateBMI, calculateWaistToHeightRatio } from '../utils/bodyCompositionCalculations';

export const generateProgressReportPDF = (options: {
  username: string;
  userSettings?: UserSettings;
  startDate: string;
  endDate: string;
  workouts: Workout[];
  measurements: BodyMeasurement[];
  personalRecords: PersonalRecord[];
  recoveryLogs: RecoveryEntry[];
  nutritionSummary?: WeeklyNutritionSummary;
  coachNotes?: string[];
}): jsPDF => {
  const {
    username,
    userSettings,
    startDate,
    endDate,
    workouts,
    measurements,
    personalRecords,
    recoveryLogs,
    nutritionSummary,
    coachNotes
  } = options;

  const doc = new jsPDF();
  let y = 20;

  // Header banner
  doc.setFillColor(15, 23, 42); // slate-900 background
  doc.rect(0, 0, 210, 38, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FITTRACK AI - GELISIM RAPORU', 15, 18);
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Tarih Araligi: ${startDate} / ${endDate}`, 15, 26);
  doc.text(`Kullanici: ${username}`, 15, 32);

  y = 48;

  // SECTION 1: VUCUT KOMPOZISYONU & OLCULER
  doc.setTextColor(15, 23, 42);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('1. VUCUT KOMPOZISYONU VE OLCULER', 15, y);
  doc.setLineWidth(0.5);
  doc.setDrawColor(15, 23, 42);
  doc.line(15, y + 2, 195, y + 2);
  y += 10;

  const relevantMeas = measurements.filter(
    m => m.date >= startDate && m.date <= endDate
  );

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);

  if (relevantMeas.length > 0) {
    // Sort oldest to newest to calculate differences
    relevantMeas.sort((a, b) => a.date.localeCompare(b.date));
    const first = relevantMeas[0];
    const last = relevantMeas[relevantMeas.length - 1];

    const weightDiff = (last.weight || 0) - (first.weight || 0);
    const waistDiff = (last.waist || 0) - (first.waist || 0);
    const bfDiff = (last.bodyFatPercentage || last.bodyFat || 0) - (first.bodyFatPercentage || first.bodyFat || 0);

    doc.setFont('Helvetica', 'bold');
    doc.text(`Kilo Degisimi: ${first.weight || '?'} kg -> ${last.weight || '?'} kg (${weightDiff >= 0 ? '+' : ''}${weightDiff.toFixed(1)} kg)`, 15, y);
    doc.text(`Bel Olcusu Degisimi: ${first.waist || '?'} cm -> ${last.waist || '?'} cm (${waistDiff >= 0 ? '+' : ''}${waistDiff.toFixed(1)} cm)`, 15, y + 6);
    doc.text(`Yag Orani Degisimi: ${first.bodyFatPercentage || first.bodyFat || '?'}% -> ${last.bodyFatPercentage || last.bodyFat || '?'}% (${bfDiff >= 0 ? '+' : ''}${bfDiff.toFixed(1)}%)`, 15, y + 12);
    
    // Calculate BMI and Waist/Height
    const h = userSettings?.height || 180;
    const currentBMI = calculateBMI(last.weight || userSettings?.currentWeight || 0, h);
    const currentWHR = calculateWaistToHeightRatio(last.waist || 0, h);

    doc.setFont('Helvetica', 'normal');
    doc.text(`Mevcut VKI (BMI): ${currentBMI} (${currentBMI < 18.5 ? 'Zayif' : currentBMI < 25 ? 'Normal' : currentBMI < 30 ? 'Fazla Kilolu' : 'Obez'})`, 15, y + 18);
    doc.text(`Bel / Boy Orani: ${currentWHR} (${currentWHR < 0.5 ? 'Saglikli' : 'Yuksek Risk'})`, 15, y + 24);
    y += 32;
  } else {
    doc.text('Secilen tarih araliginda kayitli olcu verisi bulunamadi.', 15, y);
    y += 10;
  }

  // SECTION 2: ANTRENMAN VE PERFORMANS OZETI
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('2. ANTRENMAN VE GUZ PERFORMANSI', 15, y);
  doc.line(15, y + 2, 195, y + 2);
  y += 10;

  const relevantWorkouts = workouts.filter(w => w.date >= startDate && w.date <= endDate);
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Tamamlanan Antrenman Sayisi: ${relevantWorkouts.length} seans`, 15, y);
  
  if (relevantWorkouts.length > 0) {
    const totalDuration = relevantWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const avgDuration = Math.round(totalDuration / relevantWorkouts.length);
    const totalCalories = relevantWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    doc.text(`Toplam Antrenman Suresi: ${totalDuration} dakika (Ortalama ${avgDuration} dk/seans)`, 15, y + 6);
    doc.text(`Tahmini Yakilan Kalori: ${totalCalories} kcal`, 15, y + 12);
    y += 20;
  } else {
    y += 8;
  }

  // PR Records
  const prsInPeriod = personalRecords.filter(p => p.date >= startDate && p.date <= endDate);
  doc.setFont('Helvetica', 'bold');
  doc.text(`Donem Icinde Kirilan Kisisel Rekorlar (PR): ${prsInPeriod.length} adet`, 15, y);
  y += 6;
  doc.setFont('Helvetica', 'normal');

  if (prsInPeriod.length > 0) {
    prsInPeriod.slice(0, 5).forEach((pr, idx) => {
      let recordVal = `${pr.value}`;
      if (pr.recordType === 'max_weight') recordVal += ' kg (Maks Agirlik)';
      if (pr.recordType === 'max_reps') recordVal += ' Tekrar (Maks Tekrar)';
      if (pr.recordType === 'estimated_1rm') recordVal += ' kg (Tahmini 1RM)';
      if (pr.recordType === 'max_volume') recordVal += ' kg (Maks Hacim)';

      doc.text(`- ${pr.exerciseName}: ${recordVal} - Tarih: ${pr.date}`, 18, y);
      y += 5;
    });
    if (prsInPeriod.length > 5) {
      doc.text(`... ve ${prsInPeriod.length - 5} rekor daha.`, 18, y);
      y += 5;
    }
    y += 5;
  } else {
    doc.text('Bu donemde yeni PR kaydi bulunmuyor.', 15, y);
    y += 10;
  }

  // SECTION 3: TOPARLANMA VE HAZIRLIK BILGILERI
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('3. UYKU, TOPARLANMA VE RECOVERY ANALIZI', 15, y);
  doc.line(15, y + 2, 195, y + 2);
  y += 10;

  const relevantRec = recoveryLogs.filter(r => r.date >= startDate && r.date <= endDate);
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);

  if (relevantRec.length > 0) {
    const avgSleep = (relevantRec.reduce((sum, r) => sum + r.sleepHours, 0) / relevantRec.length).toFixed(1);
    const avgSleepQ = (relevantRec.reduce((sum, r) => sum + r.sleepQuality, 0) / relevantRec.length).toFixed(1);
    const avgFatigue = (relevantRec.reduce((sum, r) => sum + r.fatigueLevel, 0) / relevantRec.length).toFixed(1);
    const avgStress = (relevantRec.reduce((sum, r) => sum + r.stressLevel, 0) / relevantRec.length).toFixed(1);
    const avgSoreness = (relevantRec.reduce((sum, r) => sum + r.muscleSoreness, 0) / relevantRec.length).toFixed(1);
    const avgMotivation = (relevantRec.reduce((sum, r) => sum + r.motivationLevel, 0) / relevantRec.length).toFixed(1);

    doc.text(`Ortalama Uyku Suresi: ${avgSleep} saat (Kalite: ${avgSleepQ}/10)`, 15, y);
    doc.text(`Ortalama Yorgunluk: ${avgFatigue}/10`, 15, y + 6);
    doc.text(`Ortalama Kas Agrisi (Soreness): ${avgSoreness}/10`, 15, y + 12);
    doc.text(`Ortalama Stress Seviyesi: ${avgStress}/10 | Motivasyon: ${avgMotivation}/10`, 15, y + 18);
    y += 26;
  } else {
    doc.text('Secilen tarih araliginda günlük durum/toparlanma kaydi girilmemis.', 15, y);
    y += 10;
  }

  // SECTION 4: BESLENME UYUMU
  if (nutritionSummary) {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('4. BESLENME VE MAKRO TAKIBI', 15, y);
    doc.line(15, y + 2, 195, y + 2);
    y += 10;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Ortalama Gunluk Kalori: ${nutritionSummary.averageCalories} kcal`, 15, y);
    doc.text(`Ortalama Protein: ${nutritionSummary.averageProtein} g | Karbonhidrat: ${nutritionSummary.averageCarbs} g | Yag: ${nutritionSummary.averageFat} g`, 15, y + 6);
    doc.text(`Ortalama Su Tuketimi: ${nutritionSummary.averageWater} ml`, 15, y + 12);
    doc.text(`Hedef Kaloriye Uyum Saglanan Gun: 7 gun icinde ${nutritionSummary.goalMatchedDays} gun`, 15, y + 18);
    y += 26;
  }

  // SECTION 5: KOC NOTLARI
  if (coachNotes && coachNotes.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('5. AKTIF KOC NOTLARI VE TAVSIYELER', 15, y);
    doc.line(15, y + 2, 195, y + 2);
    y += 10;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    coachNotes.slice(0, 4).forEach((note, idx) => {
      // Split text into multiple lines if too long
      const splitNote = doc.splitTextToSize(`- ${note}`, 180);
      doc.text(splitNote, 15, y);
      y += (splitNote.length * 5) + 2;
    });
    y += 8;
  }

  // Medical Disclaimer Footer
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setLineWidth(0.2);
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 270, 195, 270);
  
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('FitTrack AI - Bilgilendirme Amacli Rapor', 15, 275);
  doc.text('UyarI: Bu rapordaki tum veriler ve hesaplamalar sadece bilgilendirme amaclidir, tibbi teshis veya tavi yerine gecmez.', 15, 280);
  doc.text('Lutfen herhangi bir beslenme veya antrenman programina baslamadan once doktorunuza danisiniz.', 15, 285);

  return doc;
};
