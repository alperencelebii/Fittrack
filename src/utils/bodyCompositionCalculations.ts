import { BodyCompositionResult, BodyMeasurement, UserSettings } from '../types';

export const calculateBMI = (
  weightKg: number,
  heightCm: number
): number => {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  const heightMeter = heightCm / 100;
  const bmi = weightKg / (heightMeter * heightMeter);
  return Math.round(bmi * 10) / 10;
};

export const calculateWaistToHeightRatio = (
  waistCm: number,
  heightCm: number
): number => {
  if (waistCm <= 0 || heightCm <= 0) return 0;
  const ratio = waistCm / heightCm;
  return Math.round(ratio * 100) / 100;
};

export const getLatestBodyComposition = (
  measurement: BodyMeasurement | undefined,
  settings: UserSettings | undefined
): BodyCompositionResult => {
  const height = settings?.height || 180;
  const weight = measurement?.weight || settings?.currentWeight || 0;
  const waist = measurement?.waist || 0;
  const bodyFatPercent = measurement?.bodyFat || 0;

  const result: BodyCompositionResult = {};

  if (weight > 0 && height > 0) {
    result.bmi = calculateBMI(weight, height);
  }

  if (bodyFatPercent > 0) {
    result.bodyFatPercentage = bodyFatPercent;
    if (weight > 0) {
      result.fatMass = Math.round((weight * (bodyFatPercent / 100)) * 10) / 10;
      result.leanMass = Math.round((weight - result.fatMass) * 10) / 10;
      // Estimate muscle mass roughly (usually ~75-80% of lean mass)
      result.muscleMass = Math.round((result.leanMass * 0.78) * 10) / 10;
    }
  }

  if (waist > 0 && height > 0) {
    result.waistToHeightRatio = calculateWaistToHeightRatio(waist, height);
  }

  return result;
};
