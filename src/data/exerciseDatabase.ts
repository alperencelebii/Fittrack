/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ExerciseDatabaseItem = {
    id: string;
    name: string;
    category: string;
    muscleGroup: string;
    equipment: string;
    defaultSets: number;
    defaultReps: number;
    keywords: string[];
  };
  
  export const exerciseDatabase: ExerciseDatabaseItem[] = [
    // Chest (Göğüs)
    {
      id: 'e1',
      name: 'Bench Press',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['bench', 'bench press', 'göğüs', 'gogus', 'itme', 'barbell', 'halter']
    },
    {
      id: 'e2',
      name: 'Incline Bench Press',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['incline', 'bench press', 'üst göğüs', 'ust gogus', 'itme', 'barbell', 'halter']
    },
    {
      id: 'e3',
      name: 'Decline Bench Press',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 10,
      keywords: ['decline', 'bench press', 'alt göğüs', 'alt gogus', 'barbell', 'halter']
    },
    {
      id: 'e4',
      name: 'Dumbbell Press',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['dumbbell press', 'göğüs press', 'dambıl press', 'dambil press', 'itme']
    },
    {
      id: 'e5',
      name: 'Incline Dumbbell Press',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['incline dumbbell', 'üst göğüs press', 'ust gogus', 'dambıl', 'dambil']
    },
    {
      id: 'e6',
      name: 'Chest Press Machine',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['chest press', 'göğüs makinesi', 'itme makinesi', 'machine', 'makine']
    },
    {
      id: 'e7',
      name: 'Pec Deck Fly',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Machine',
      defaultSets: 3,
      defaultReps: 15,
      keywords: ['pec deck', 'butterfly', 'kelebek', 'göğüs açış', 'gogus acis', 'fly']
    },
    {
      id: 'e8',
      name: 'Dumbbell Fly',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['dumbbell fly', 'göğüs açış', 'dambıl açış', 'yana açış', 'diyet']
    },
    {
      id: 'e9',
      name: 'Incline Dumbbell Fly',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['incline fly', 'üst göğüs açış', 'ust gogus acis', 'dambıl açış']
    },
    {
      id: 'e10',
      name: 'Cable Crossover',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Cable',
      defaultSets: 3,
      defaultReps: 15,
      keywords: ['cable crossover', 'kablo', 'göğüs sıkıştırma', 'alt göğüs kablo', 'istasyon']
    },
    {
      id: 'e11',
      name: 'Push Up',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Bodyweight',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['push up', 'şınav', 'sinav', 'vücut ağırlığı', 'badyveyt']
    },
  
    // Back (Sırt / Kanat)
    {
      id: 'e12',
      name: 'Lat Pulldown',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['lat', 'pulldown', 'sırt', 'kanat', 'çekiş', 'makine', 'machine']
    },
    {
      id: 'e13',
      name: 'Seated Cable Row',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Cable',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['seated row', 'kablo çekiş', 'sırt', 'kürek', 'karnına çekiş', 'cable']
    },
    {
      id: 'e14',
      name: 'Barbell Row',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['barbell row', 'sırt', 'bar çekiş', 'eğilerek çekiş', 'halter', 'kanat']
    },
    {
      id: 'e15',
      name: 'Dumbbell Row',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['dumbbell row', 'tek kol çekiş', 'dambıl çekiş', 'sırt', 'testere']
    },
    {
      id: 'e16',
      name: 'Pull Up',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Bodyweight',
      defaultSets: 4,
      defaultReps: 8,
      keywords: ['pull up', 'barfiks', 'sırt Çekiş', 'vücut ağırlığı', 'kanat']
    },
    {
      id: 'e17',
      name: 'T-Bar Row',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['t bar row', 't-bar', 'sırt', 'makine', 'itme', 'çekiş']
    },
    {
      id: 'e18',
      name: 'Hyper Extension',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 15,
      keywords: ['hyper extension', 'bel', 'bölgesi', 'fıtık', 'omurga', 'ters mekik']
    },
    {
      id: 'e19',
      name: 'Deadlift',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 6,
      keywords: ['deadlift', 'bel', 'arka bacak', 'powerlifting', 'güç', 'halter']
    },
    {
      id: 'e251',
      name: 'Straight Arm Cable Pull-down',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Cable',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['straight arm', 'kanat', 'sırt', 'kablo düz kol', 'pulldown']
    },
  
    // Shoulder (Omuz)
    {
      id: 'e20',
      name: 'Shoulder Press Machine',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['shoulder press', 'omuz press', 'makine', 'itme', 'omuz']
    },
    {
      id: 'e21',
      name: 'Dumbbell Shoulder Press',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['dumbbell press', 'omuz press', 'dambıl omuz', 'oturarak press']
    },
    {
      id: 'e22',
      name: 'Barbell Shoulder Press',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 8,
      keywords: ['barbell press', 'militer', 'military press', 'ayakta omuz', 'halter']
    },
    {
      id: 'e23',
      name: 'Lateral Raise',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['lateral raise', 'yana açış', 'omuz', 'orta omuz', 'yana acis', 'dambıl']
    },
    {
      id: 'e24',
      name: 'Cable Lateral Raise',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Cable',
      defaultSets: 3,
      defaultReps: 15,
      keywords: ['cable lateral', 'kablo omuz', 'yana açış kablo', 'yan omuz']
    },
    {
      id: 'e25',
      name: 'Front Raise',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['front raise', 'ön omuz', 'on omuz', 'öne açış', 'one acis', 'dambıl']
    },
    {
      id: 'e26',
      name: 'Rear Delt Fly',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['rear delt', 'arka omuz', 'ters kelebek', 'reverse butterfly', 'fly']
    },
    {
      id: 'e27',
      name: 'Dumbbell Rear Delt Raise',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['rear delt raise', 'arka omuz dambıl', 'eğilerek açış', 'dambıl omuz']
    },
    {
      id: 'e28',
      name: 'Face Pull',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Cable',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['face pull', 'arka omuz kablo', 'ip', 'halat', 'yüze çekiş', 'kablo']
    },
    {
      id: 'e29',
      name: 'Upright Row',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['upright row', 'trapez', 'çeneye çekiş', 'ceneye cekis', 'omuz']
    },
  
    // Legs (Bacak)
    {
      id: 'e30',
      name: 'Squat (Barbell)',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 8,
      keywords: ['squat', 'çökme', 'serbest squat', 'bacak', 'quadriceps', 'halter']
    },
    {
      id: 'e31',
      name: 'Leg Press',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['leg press', 'bacak pres', 'itme', 'bacak makinesi', 'baldır']
    },
    {
      id: 'e32',
      name: 'Hack Squat',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['hack squat', 'bacak', 'makine squat', 'quads', 'ön bacak']
    },
    {
      id: 'e33',
      name: 'Smith Machine Squat',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['smith machine', 'squat', 'güvenli squat', 'makine', 'bacak']
    },
    {
      id: 'e34',
      name: 'Leg Extension',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['leg extension', 'ön bacak açış', 'bacak germe', 'makine', 'quads']
    },
    {
      id: 'e35',
      name: 'Lying Leg Curl',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['lying leg curl', 'arka bacak bükme', 'yatarak bacak', 'hamstrings']
    },
    {
      id: 'e36',
      name: 'Seated Leg Curl',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['seated leg curl', 'oturarak arka bacak', 'bükme', 'isb']
    },
    {
      id: 'e37',
      name: 'Romanian Deadlift',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['romanian deadlift', 'rdl', 'arka bacak', 'kalça', 'hamstrings', 'glutes']
    },
    {
      id: 'e38',
      name: 'Walking Lunge',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['lunge', 'adım', 'yürüme lunge', 'bacak', 'kalça', 'dambıl']
    },
    {
      id: 'e39',
      name: 'Standing Calf Raise',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['calf raise', 'kalf', 'baldır', 'parmak ucu', 'calf']
    },
    {
      id: 'e40',
      name: 'Seated Calf Raise',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['seated calf', 'oturarak kalf', 'baldır', 'kalf makinesi']
    },
    {
      id: 'e41',
      name: 'Hip Thrust',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['hip thrust', 'kalça', 'basen', 'glute', 'kalça köprüsü', 'barbell']
    },
  
    // Arms (Kol - Biceps & Triceps)
    {
      id: 'e42',
      name: 'Biceps Curl (Barbell)',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['biceps curl', 'pazı', 'barbell curl', 'ön kol', 'on kol', 'pazi']
    },
    {
      id: 'e43',
      name: 'Dumbbell Curl',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['dumbbell curl', 'pazı dambıl', 'ön kol dambıl', 'biceps']
    },
    {
      id: 'e44',
      name: 'Hammer Curl',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['hammer curl', 'çekiç', 'cekic curl', 'ön kol dış', 'biceps']
    },
    {
      id: 'e45',
      name: 'Incline Dumbbell Curl',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['incline curl', 'eğimli ön kol', 'biceps', 'pazı açma']
    },
    {
      id: 'e46',
      name: 'Preacher Curl',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Machine',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['preacher', 'sehpa ön kol', 'skat sehpa', 'pazı', 'ez bar']
    },
    {
      id: 'e47',
      name: 'Cable Curl',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Cable',
      defaultSets: 3,
      defaultReps: 15,
      keywords: ['cable curl', 'kablo ön kol', 'biceps kablo', 'pazı']
    },
    {
      id: 'e48',
      name: 'Triceps Pushdown',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Cable',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['pushdown', 'arka kol', 'triceps', 'itme kablo', 'istasyon']
    },
    {
      id: 'e49',
      name: 'Overhead Triceps Extension',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['overhead triceps', 'enseye triceps', 'arka kol dambıl', 'fransız']
    },
    {
      id: 'e50',
      name: 'Skull Crusher',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 10,
      keywords: ['skull crusher', 'alna triceps', 'arka kol halter', 'ez bar']
    },
    {
      id: 'e511',
      name: 'Triceps Dips',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 10,
      keywords: ['dips', 'arka kol dips', 'sehpa dips', 'bench dips']
    },
  
    // Core (Karın / Merkez Bölge)
    {
      id: 'e52',
      name: 'Plank',
      category: 'Core',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 60, // seconds
      keywords: ['plank', 'merkez', 'karın', 'karin', 'vücut duruşu', 'dayanıklılık']
    },
    {
      id: 'e53',
      name: 'Abdominal Crunch',
      category: 'Core',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      defaultSets: 4,
      defaultReps: 20,
      keywords: ['crunch', 'mekik', 'yarım mekik', 'karın sıkıştırma', 'üst karın']
    },
    {
      id: 'e54',
      name: 'Cable Crunch',
      category: 'Core',
      muscleGroup: 'Core',
      equipment: 'Cable',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['cable crunch', 'kablo mekik', 'secdeli mekik', 'karın kablo']
    },
    {
      id: 'e55',
      name: 'Hanging Leg Raise',
      category: 'Core',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['hanging leg', 'asılı bacak kaldırma', 'alt karın', 'barfiks karın']
    },
    {
      id: 'e56',
      name: 'Lying Leg Raise',
      category: 'Core',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 15,
      keywords: ['leg raise', 'yatarak bacak kaldırma', 'alt karın', 'karin']
    },
    {
      id: 'e57',
      name: 'Russian Twist',
      category: 'Core',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 20,
      keywords: ['russian twist', 'oblik', 'yan karın', 'twist', 'dönüş']
    },
  
    // Cardio (Kardiyo)
    {
      id: 'e58',
      name: 'Treadmill Running',
      category: 'Cardio',
      muscleGroup: 'Full Body',
      equipment: 'Cardio',
      defaultSets: 1,
      defaultReps: 30, // mins
      keywords: ['koşu', 'koşu bandı', 'treadmill', 'running', 'kardiyo', 'yağ yakımı']
    },
    {
      id: 'e59',
      name: 'Stationary Bike',
      category: 'Cardio',
      muscleGroup: 'Legs',
      equipment: 'Cardio',
      defaultSets: 1,
      defaultReps: 30,
      keywords: ['bisiklet', 'yatay bisiklet', 'bike', 'kardiyo', 'kondisyon']
    },
    {
      id: 'e60',
      name: 'Elliptical Trainer',
      category: 'Cardio',
      muscleGroup: 'Full Body',
      equipment: 'Cardio',
      defaultSets: 1,
      defaultReps: 25,
      keywords: ['eliptik', 'elliptical', 'kardiyo', 'kondisyon', 'tüm vücut']
    },
    {
      id: 'e61',
      name: 'Stairmaster (Climber)',
      category: 'Cardio',
      muscleGroup: 'Legs',
      equipment: 'Cardio',
      defaultSets: 1,
      defaultReps: 20,
      keywords: ['stairmaster', 'merdiven', 'climb', 'kardiyo', 'kalça bacak', 'yağ yakımı']
    },
    {
      id: 'e62',
      name: 'Rowing Machine',
      category: 'Cardio',
      muscleGroup: 'Full Body',
      equipment: 'Cardio',
      defaultSets: 1,
      defaultReps: 15,
      keywords: ['kürek', 'kurek makinesi', 'rowing', 'kondisyon', 'kondusyon']
    },
    {
      id: 'e63',
      name: 'Jump Rope',
      category: 'Cardio',
      muscleGroup: 'Full Body',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 100,
      keywords: ['ip atlama', 'rope', 'hız', 'kalp ritmi', 'kondisyon']
    },
  
    // Ekstra 17 Egzersiz ve Spor Makinesi (Hızlıca 80 barajını tamamlıyoruz)
    {
      id: 'e64',
      name: 'Incline Chest Press Machine',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['ust gogus pres', 'incline press', 'makine', 'göğüs']
    },
    {
      id: 'e65',
      name: 'Dumbbell Pull-over',
      category: 'Chest',
      muscleGroup: 'Chest',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['pullover', 'açış', 'göğüs sırt', 'dambıl', 'gogus sirt']
    },
    {
      id: 'e66',
      name: 'Chin Up',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 8,
      keywords: ['barfiks', 'çekiş', 'avziç', 'chin up', 'biceps sırt']
    },
    {
      id: 'e67',
      name: 'Close Grip Lat Pulldown',
      category: 'Back',
      muscleGroup: 'Back',
      equipment: 'Machine',
      defaultSets: 4,
      defaultReps: 12,
      keywords: ['dar tutuş', 'lat pulldown', 'sırt çekiş', 'kanat']
    },
    {
      id: 'e68',
      name: 'Cable Rope Face Pull',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Cable',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['halat çekiş omuz', 'face pull', 'arka omuz']
    },
    {
      id: 'e69',
      name: 'Arnold Press',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 10,
      keywords: ['arnold press', 'çevirmeli omuz', 'dambıl omuz press', 'biceps']
    },
    {
      id: 'e70',
      name: 'Dumbbell Shrug',
      category: 'Shoulder',
      muscleGroup: 'Shoulder',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 15,
      keywords: ['shrug', 'trapez omuz', 'silkme dambıl', 'boyun']
    },
    {
      id: 'e71',
      name: 'Goblet Squat',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['goblet squat', 'dambıl squat', 'bacak öne', 'basen']
    },
    {
      id: 'e72',
      name: 'Bulgarian Split Squat',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 10,
      keywords: ['bulgarian squat', 'tek bacak squat', 'kalça kor', 'adım']
    },
    {
      id: 'e73',
      name: 'Sumo Deadlift',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Free Weight',
      defaultSets: 4,
      defaultReps: 6,
      keywords: ['sumo deadlift', 'ic bacak bacak', 'kalça güç', 'halter']
    },
    {
      id: 'e74',
      name: 'Glute Kickback (Cable)',
      category: 'Legs',
      muscleGroup: 'Legs',
      equipment: 'Cable',
      defaultSets: 3,
      defaultReps: 15,
      keywords: ['kickback kablo', 'kalça geriye', 'glutes', 'arka bacak']
    },
    {
      id: 'e75',
      name: 'Concentration Curl',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['konsantre ön kol', 'biceps tepe', 'pazı dambıl']
    },
    {
      id: 'e76',
      name: 'Cable Overhead Triceps',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Cable',
      defaultSets: 3,
      defaultReps: 12,
      keywords: ['kablo enseye', 'triceps uzatma', 'arka kol ip']
    },
    {
      id: 'e77',
      name: 'Barbell Wrist Curl',
      category: 'Arms',
      muscleGroup: 'Arms',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 15,
      keywords: ['bilek bükme', 'bilek kası', 'barbell wrist', 'ön kol bilek']
    },
    {
      id: 'e78',
      name: 'Bicycle Crunch',
      category: 'Core',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 20,
      keywords: ['bisiklet mekik', 'yan karın', 'oblik', 'karin']
    },
    {
      id: 'e79',
      name: 'Mountain Climbers',
      category: 'Core',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      defaultSets: 3,
      defaultReps: 30,
      keywords: ['tırmanma', 'merdiven karın', 'full body', 'oblik kondisyon']
    },
    {
      id: 'e80',
      name: 'Ab Wheel Rollout',
      category: 'Core',
      muscleGroup: 'Core',
      equipment: 'Free Weight',
      defaultSets: 3,
      defaultReps: 10,
      keywords: ['karın tekerleği', 'ab wheel', 'rollout', 'merkez kuvveti']
    }
  ];
  