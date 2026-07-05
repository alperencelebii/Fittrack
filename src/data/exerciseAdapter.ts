import { ExerciseLibraryItem } from '../types';

export interface FitTrackExercise extends Omit<ExerciseLibraryItem, 'instructions'> {
  nameTr?: string;
  bodyPart: string;
  target: string;
  force?: 'push' | 'pull' | 'static';
  mechanic?: 'compound' | 'isolation';
  source: 'custom' | 'free-exercise-db';
  primaryMuscle: string;
  instructions: string[] & { en?: string[] };
  level: 'beginner' | 'intermediate' | 'advanced';
}

const MUSCLE_TRANSLATIONS: Record<string, { tr: string; altTr?: string; en: string; all: string[] }> = {
  chest: {
    tr: 'Göğüs',
    en: 'Chest',
    all: ['Göğüs', 'Chest', 'chest', 'göğüs']
  },
  lats: {
    tr: 'Sırt',
    altTr: 'Kanat',
    en: 'Back',
    all: ['Sırt', 'Kanat', 'Back', 'back', 'lats', 'kanat', 'sırt']
  },
  'middle back': {
    tr: 'Sırt',
    en: 'Back',
    all: ['Sırt', 'Back', 'back', 'middle back', 'sırt']
  },
  'middle_back': {
    tr: 'Sırt',
    en: 'Back',
    all: ['Sırt', 'Back', 'back', 'middle_back', 'sırt']
  },
  'lower back': {
    tr: 'Sırt',
    altTr: 'Bel',
    en: 'Back',
    all: ['Sırt', 'Bel', 'Back', 'back', 'lower back', 'bel', 'sırt']
  },
  'lower_back': {
    tr: 'Sırt',
    altTr: 'Bel',
    en: 'Back',
    all: ['Sırt', 'Bel', 'Back', 'back', 'lower_back', 'bel', 'sırt']
  },
  traps: {
    tr: 'Sırt',
    altTr: 'Trapez',
    en: 'Back',
    all: ['Sırt', 'Trapez', 'Back', 'back', 'traps', 'trapez', 'sırt']
  },
  shoulders: {
    tr: 'Omuz',
    en: 'Shoulders',
    all: ['Omuz', 'Shoulders', 'shoulders', 'omuz']
  },
  biceps: {
    tr: 'Biceps',
    altTr: 'Ön kol',
    en: 'Biceps',
    all: ['Biceps', 'Ön kol', 'Kol', 'Biceps', 'biceps', 'ön kol', 'kol']
  },
  triceps: {
    tr: 'Triceps',
    altTr: 'Arka kol',
    en: 'Triceps',
    all: ['Triceps', 'Arka kol', 'Kol', 'Triceps', 'triceps', 'arka kol', 'kol']
  },
  forearms: {
    tr: 'Ön kol',
    en: 'Forearms',
    all: ['Ön kol', 'Forearms', 'forearms', 'Kol', 'kol', 'ön kol']
  },
  quadriceps: {
    tr: 'Quadriceps',
    altTr: 'Ön bacak',
    en: 'Quads',
    all: ['Quadriceps', 'Ön bacak', 'Bacak', 'Quads', 'quads', 'quadriceps', 'ön bacak', 'bacak']
  },
  hamstrings: {
    tr: 'Hamstring',
    altTr: 'Arka bacak',
    en: 'Hamstrings',
    all: ['Hamstring', 'Arka bacak', 'Bacak', 'Hamstrings', 'hamstrings', 'hamstring', 'arka bacak', 'bacak']
  },
  glutes: {
    tr: 'Kalça',
    en: 'Glutes',
    all: ['Kalça', 'Bacak', 'Glutes', 'glutes', 'kalça', 'bacak']
  },
  abductors: {
    tr: 'Bacak',
    altTr: 'Dış bacak',
    en: 'Abductors',
    all: ['Bacak', 'Abductors', 'abductors', 'bacak', 'dış bacak']
  },
  adductors: {
    tr: 'Bacak',
    altTr: 'İç bacak',
    en: 'Adductors',
    all: ['Bacak', 'Adductors', 'adductors', 'bacak', 'iç bacak']
  },
  calves: {
    tr: 'Baldır',
    altTr: 'Kalf',
    en: 'Calves',
    all: ['Baldır', 'Kalf', 'Calves', 'calves', 'baldır', 'kalf', 'bacak']
  },
  abdominals: {
    tr: 'Karın',
    en: 'Abs',
    all: ['Karın', 'Abs', 'Abdominals', 'abdominals', 'karın', 'abs']
  },
  obliques: {
    tr: 'Karın',
    altTr: 'Oblik',
    en: 'Abs',
    all: ['Karın', 'Oblik', 'Abs', 'obliques', 'oblik', 'karın', 'abs']
  },
  neck: {
    tr: 'Boyun',
    en: 'Neck',
    all: ['Boyun', 'Neck', 'neck', 'boyun']
  }
};

const EQUIPMENT_TRANSLATIONS: Record<string, string> = {
  'body weight': 'Vücut ağırlığı',
  'bodyweight': 'Vücut ağırlığı',
  'dumbbell': 'Dambıl',
  'barbell': 'Barbell',
  'cable': 'Kablo',
  'machine': 'Makine',
  'band': 'Direnç bandı',
  'kettlebell': 'Kettlebell',
  'stability ball': 'Pilates topu',
  'medicine ball': 'Sağlık topu',
  'ez barbell': 'EZ Barbell',
  'foam roller': 'Foam Roller',
  'bench': 'Sehpa',
  'pullup_bar': 'Barfiks Demiri'
};

export function normalizeEquipment(eq: string | null): string {
  if (!eq) return 'body weight';
  const val = eq.trim().toLowerCase();
  switch (val) {
    case 'none':
    case 'body only':
    case 'bodyweight':
      return 'body weight';
    case 'dumbbell':
      return 'dumbbell';
    case 'barbell':
      return 'barbell';
    case 'cable':
      return 'cable';
    case 'machine':
      return 'machine';
    case 'kettlebells':
      return 'kettlebell';
    case 'bands':
      return 'band';
    case 'medicine ball':
      return 'medicine ball';
    case 'exercise ball':
      return 'stability ball';
    case 'e-z curl bar':
      return 'ez barbell';
    case 'foam roll':
      return 'foam roller';
    default:
      return val;
  }
}

export function normalizeLevel(lvl: string | null): 'beginner' | 'intermediate' | 'advanced' {
  if (!lvl) return 'beginner';
  const val = lvl.trim().toLowerCase();
  if (val === 'beginner') return 'beginner';
  if (val === 'intermediate') return 'intermediate';
  if (val === 'expert' || val === 'advanced') return 'advanced';
  return 'beginner';
}

export function normalizeMechanic(mech: string | null): 'compound' | 'isolation' | undefined {
  if (!mech) return undefined;
  const val = mech.trim().toLowerCase();
  if (val === 'compound') return 'compound';
  if (val === 'isolation') return 'isolation';
  return undefined;
}

export function normalizeForce(f: string | null): 'push' | 'pull' | 'static' | undefined {
  if (!f) return undefined;
  const val = f.trim().toLowerCase();
  if (val === 'push') return 'push';
  if (val === 'pull') return 'pull';
  if (val === 'static') return 'static';
  return undefined;
}

export function getBodyPart(primaryMuscle: string | null): string {
  if (!primaryMuscle) return 'full body';
  const val = primaryMuscle.trim().toLowerCase();
  switch (val) {
    case 'chest':
      return 'chest';
    case 'lats':
    case 'middle back':
    case 'middle_back':
    case 'lower back':
    case 'lower_back':
    case 'traps':
      return 'back';
    case 'shoulders':
      return 'shoulders';
    case 'biceps':
    case 'triceps':
      return 'upper arms';
    case 'forearms':
      return 'lower arms';
    case 'quadriceps':
    case 'hamstrings':
    case 'glutes':
    case 'abductors':
    case 'adductors':
      return 'upper legs';
    case 'calves':
      return 'lower legs';
    case 'abdominals':
    case 'obliques':
      return 'waist';
    case 'neck':
      return 'neck';
    default:
      return 'full body';
  }
}

export function translateMuscle(muscle: string): { tr: string; all: string[] } {
  const normalized = muscle.trim().toLowerCase();
  if (MUSCLE_TRANSLATIONS[normalized]) {
    return {
      tr: MUSCLE_TRANSLATIONS[normalized].tr,
      all: MUSCLE_TRANSLATIONS[normalized].all
    };
  }
  return {
    tr: muscle.charAt(0).toUpperCase() + muscle.slice(1),
    all: [muscle, muscle.toLowerCase()]
  };
}

export function adaptFreeExercises(rawExercises: unknown): FitTrackExercise[] {
  if (!Array.isArray(rawExercises)) {
    console.warn('rawExercises is not an array!');
    return [];
  }

  // Filter and prioritize valid exercises
  const validRaw = rawExercises.filter(ex => {
    return (
      ex &&
      typeof ex === 'object' &&
      ex.id &&
      typeof ex.id === 'string' &&
      ex.name &&
      typeof ex.name === 'string' &&
      Array.isArray(ex.primaryMuscles) &&
      ex.primaryMuscles.length > 0 &&
      Array.isArray(ex.instructions) &&
      ex.instructions.length > 0
    );
  });

  // Sort: Prioritize strength category first, then beginner/intermediate levels
  const sortedRaw = [...validRaw].sort((a, b) => {
    const catA = (a.category || '').trim().toLowerCase();
    const catB = (b.category || '').trim().toLowerCase();
    const isStrengthA = catA === 'strength' || catA === 'powerlifting' || catA === 'olympic weightlifting' || catA === 'strongman' ? 1 : 0;
    const isStrengthB = catB === 'strength' || catB === 'powerlifting' || catB === 'olympic weightlifting' || catB === 'strongman' ? 1 : 0;

    if (isStrengthA !== isStrengthB) {
      return isStrengthB - isStrengthA; // strength first
    }

    const lvlA = (a.level || '').trim().toLowerCase();
    const lvlB = (b.level || '').trim().toLowerCase();
    const orderA = lvlA === 'beginner' ? 0 : lvlA === 'intermediate' ? 1 : 2;
    const orderB = lvlB === 'beginner' ? 0 : lvlB === 'intermediate' ? 1 : 2;

    return orderA - orderB; // beginner/intermediate first
  });

  // Apply the 250 limit
  const slicedRaw = sortedRaw.slice(0, 250);

  return slicedRaw.map(ex => {
    const rawPrimaryMuscle = ex.primaryMuscles[0];
    const bodyPart = getBodyPart(rawPrimaryMuscle);
    const target = rawPrimaryMuscle || 'full body';
    const force = normalizeForce(ex.force);
    const mechanic = normalizeMechanic(ex.mechanic);
    const level = normalizeLevel(ex.level);
    const eqNormalized = normalizeEquipment(ex.equipment);

    // Expand translations & search keywords dynamically
    const translatedPrimary = translateMuscle(rawPrimaryMuscle);
    const primaryMusclesSet = new Set<string>(translatedPrimary.all);
    const primaryList = [
      translatedPrimary.tr,
      ...Array.from(primaryMusclesSet).filter(m => m !== translatedPrimary.tr)
    ];

    const secondaryList: string[] = [];
    const secondaryMusclesSet = new Set<string>();
    if (ex.secondaryMuscles && Array.isArray(ex.secondaryMuscles)) {
      for (const sm of ex.secondaryMuscles) {
        if (typeof sm === 'string') {
          const trSM = translateMuscle(sm);
          trSM.all.forEach(m => secondaryMusclesSet.add(m));
          if (!secondaryList.includes(trSM.tr)) {
            secondaryList.push(trSM.tr);
          }
        }
      }
    }
    Array.from(secondaryMusclesSet).forEach(m => {
      if (!secondaryList.includes(m)) {
        secondaryList.push(m);
      }
    });

    const equipmentTranslation = EQUIPMENT_TRANSLATIONS[eqNormalized] || eqNormalized;
    const equipmentList = [
      eqNormalized,
      eqNormalized.toLowerCase(),
      equipmentTranslation,
      equipmentTranslation.toLowerCase(),
      eqNormalized.charAt(0).toUpperCase() + eqNormalized.slice(1),
      equipmentTranslation.charAt(0).toUpperCase() + equipmentTranslation.slice(1)
    ];
    const uniqueEquipmentList = Array.from(new Set(equipmentList));

    let category: 'strength' | 'cardio' | 'mobility' | 'stretching' | 'warmup' = 'strength';
    const normCat = (ex.category || '').trim().toLowerCase();
    if (normCat === 'strength' || normCat === 'powerlifting' || normCat === 'olympic weightlifting' || normCat === 'strongman') {
      category = 'strength';
    } else if (normCat === 'cardio' || normCat === 'plyometrics') {
      category = 'cardio';
    } else if (normCat === 'stretching') {
      category = 'stretching';
    } else if (normCat === 'warmup') {
      category = 'warmup';
    }

    // Attach .en to instructions array
    const instructionsArr = [...ex.instructions] as string[] & { en?: string[] };
    instructionsArr.en = instructionsArr;

    return {
      id: ex.id,
      name: ex.name,
      nameTr: translatedPrimary.tr + ' Egzersizi',
      alternativeNames: [ex.name, translatedPrimary.tr],
      category,
      primaryMuscles: primaryList,
      secondaryMuscles: secondaryList,
      equipment: uniqueEquipmentList,
      difficulty: level,
      level,
      instructions: instructionsArr,
      commonMistakes: ['Nefes kontrolünü kaybetmek', 'Hareketi aşırı hızlı yapmak', 'Yanlış eklem açısı'],
      safetyTips: ['Formunuzu bozmayacak ağırlıklar seçin.', 'Eklem kilit noktalarına dikkat edin.', 'Ağrı hissettiğinizde hareketi durdurun.'],
      alternatives: [],
      isCompound: mechanic === 'compound',
      isBodyweight: eqNormalized === 'body weight',
      keywords: [
        ex.name.toLowerCase(),
        translatedPrimary.tr.toLowerCase(),
        bodyPart.toLowerCase(),
        eqNormalized.toLowerCase(),
        equipmentTranslation.toLowerCase()
      ],
      source: 'free-exercise-db',
      bodyPart,
      target,
      force,
      mechanic,
      primaryMuscle: translatedPrimary.tr
    };
  });
}
