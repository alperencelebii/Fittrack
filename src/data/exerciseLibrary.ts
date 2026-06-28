import { ExerciseLibraryItem } from '../types';

export const EXERCISE_LIBRARY: ExerciseLibraryItem[] = [
  // GÖĞÜS (Chest)
  {
    id: 'bench_press',
    name: 'Flat Barbell Bench Press',
    alternativeNames: ['Bench Press', 'Barbell Bench Press', 'Yatarak Halter Göğüs Pres'],
    category: 'strength',
    primaryMuscles: ['Göğüs'],
    secondaryMuscles: ['Triceps', 'Omuz'],
    equipment: ['barbell', 'bench'],
    difficulty: 'beginner',
    instructions: [
      'Sehpaya sırt üstü uzanın, ayaklarınızı yere sağlam basın.',
      'Halteri omuz genişliğinden biraz daha geniş bir açıyla kavrayın.',
      'Halteri yataktan çıkarın ve göğüs ortanıza kontrollü şekilde indirin.',
      'Göğsünüze hafifçe dokundurduktan sonra kollarınızı kilitlemeden yukarı doğru itin.'
    ],
    commonMistakes: ['Barı göğse çarptırmak', 'Ayakları havaya kaldırmak', 'Dirsekleri çok fazla dışa açmak'],
    safetyTips: ['Ağır kilolarda mutlaka bir yardımcı (spotter) bulundurun.', 'Bileklerinizi bükmeyin, düz tutun.'],
    alternatives: ['Incline Bench Press', 'Dumbbell Bench Press'],
    isCompound: true,
    keywords: ['göğüs', 'bench', 'press', 'barbell', 'halter', 'itme', 'push']
  },
  {
    id: 'dumbbell_press',
    name: 'Dumbbell Bench Press',
    alternativeNames: ['Dambıl Bench Press', 'Dambıl Göğüs Pres'],
    category: 'strength',
    primaryMuscles: ['Göğüs'],
    secondaryMuscles: ['Triceps', 'Omuz'],
    equipment: ['dumbbell', 'bench'],
    difficulty: 'beginner',
    instructions: [
      'Her iki elinizde birer dambılla düz sehpaya uzanın.',
      'Dambılları göğüs seviyenizde, avuç içleriniz ayaklarınıza bakacak şekilde tutun.',
      'Nefes vererek dambılları yukarı doğru itin.',
      'Yavaşça başlangıç pozisyonuna indirin ve göğüs kaslarının esnediğini hissedin.'
    ],
    commonMistakes: ['Dambılları birbirine sertçe çarpmak', 'Yarım hareket açıklığı kullanmak'],
    safetyTips: ['Dambılları düşürürken omuzlarınızı zorlamayın.'],
    alternatives: ['Bench Press', 'Incline Dumbbell Press'],
    isCompound: true,
    keywords: ['göğüs', 'dambıl', 'dumbbell', 'press', 'bench']
  },
  {
    id: 'incline_bench_press',
    name: 'Incline Barbell Bench Press',
    alternativeNames: ['Eğimli Sehpa Bench Press', 'Üst Göğüs Pres'],
    category: 'strength',
    primaryMuscles: ['Göğüs'], // Üst göğüs
    secondaryMuscles: ['Omuz', 'Triceps'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      '30-45 derece eğimli sehpaya uzanın.',
      'Barı omuz genişliğinden biraz daha geniş kavrayıp üst göğse doğru indirin.',
      'Nefes vererek barı yukarı itin.'
    ],
    commonMistakes: ['Sehpa açısını çok dik yapmak (omza biner)', 'Barı köprücük kemiğine çarptırmak'],
    safetyTips: ['Bilek açısını düz tutmaya özen gösterin.'],
    alternatives: ['Incline Dumbbell Press', 'Low Cable Fly'],
    isCompound: true,
    keywords: ['göğüs', 'üst göğüs', 'incline', 'bench', 'barbell']
  },
  {
    id: 'pushup',
    name: 'Push-up (Şınav)',
    alternativeNames: ['Şınav', 'Zemin Şınavı'],
    category: 'strength',
    primaryMuscles: ['Göğüs'],
    secondaryMuscles: ['Triceps', 'Karın', 'Omuz'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Plank pozisyonu alın, eller omuz genişliğinde açık.',
      'Vücudunuzu düz bir çizgi halinde tutarak göğsünüz yere yaklaşana kadar indirin.',
      'Kollarınızı gerginleştirerek kendinizi yukarı itin.'
    ],
    commonMistakes: ['Kalçayı aşağı düşürmek veya aşırı yukarı kaldırmak', 'Boynu zorlamak'],
    safetyTips: ['Core (karın/bel) kaslarınızı sıkı tutarak omurganızı koruyun.'],
    alternatives: ['Knee Push-up', 'Dips'],
    isCompound: true,
    isBodyweight: true,
    keywords: ['şınav', 'pushup', 'vücut ağırlığı', 'göğüs', 'ev']
  },
  {
    id: 'cable_fly',
    name: 'Cable Fly',
    alternativeNames: ['Kablo Göğüs Sıkıştırma', 'Cable Crossover'],
    category: 'strength',
    primaryMuscles: ['Göğüs'],
    secondaryMuscles: ['Omuz'],
    equipment: ['cable'],
    difficulty: 'intermediate',
    instructions: [
      'Kablo istasyonunun ortasında durun ve makaraları göğüs seviyenize ayarlayın.',
      'Tutamakları kavrayıp bir adım öne çıkın, göğsünüzü dik tutun.',
      'Hafif bükülü dirseklerle ellerinizi göğüs hizanızda birleştirin.'
    ],
    commonMistakes: ['Kolları tamamen kilitlemek', 'Sırtı büküp kambur durmak'],
    safetyTips: ['Ağırlığı omuzlarınızın aşırı geriye gitmesine izin vermeyecek şekilde ayarlayın.'],
    alternatives: ['Dumbbell Fly', 'Pec Deck Machine'],
    isCompound: false,
    keywords: ['göğüs', 'kablo', 'cable', 'fly', 'crossover', 'sıkıştırma']
  },

  // SIRT (Back)
  {
    id: 'deadlift',
    name: 'Barbell Deadlift',
    alternativeNames: ['Deadlift', 'Halterle Yerden Kesme'],
    category: 'strength',
    primaryMuscles: ['Sırt', 'Hamstring'],
    secondaryMuscles: ['Kalça', 'Quadriceps', 'Ön kol', 'Bel'],
    equipment: ['barbell'],
    difficulty: 'advanced',
    instructions: [
      'Barın önünde durun, ayaklarınız omuz genişliğinde açık, bar kaval kemiğinize yakın olsun.',
      'Kalçanızı geriye doğru iterek çömelin, sırtınızı tamamen düz tutarak barı kavrayın.',
      'Ayaklarınızla yeri iterek, kalça ve dizlerinizi aynı anda açarak barla birlikte ayağa kalkın.',
      'Barı vücudunuza yakın tutarak kontrollü şekilde yere indirin.'
    ],
    commonMistakes: ['Sırtı yuvarlamak/kamburlaşmak', 'Barı bacaklardan uzak tutmak', 'Hareketi aceleyle yapmak'],
    safetyTips: ['Omurgayı korumak için karın kaslarınızı (core) maksimum seviyede sıkın.', 'Ağır setlerde kemer kullanabilirsiniz.'],
    alternatives: ['Sumo Deadlift', 'Romanian Deadlift'],
    isCompound: true,
    keywords: ['sırt', 'deadlift', 'güç', 'halter', 'barbell', 'bacak', 'arka bacak']
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    alternativeNames: ['Kanat Çekiş', 'Sırt Çekiş'],
    category: 'strength',
    primaryMuscles: ['Sırt'], // Lats
    secondaryMuscles: ['Biceps', 'Omuz'],
    equipment: ['machine', 'cable'],
    difficulty: 'beginner',
    instructions: [
      'Lat pulldown makinesine oturun ve diz pedlerini ayarlayın.',
      'Barı omuz genişliğinden daha geniş bir açıyla kavrayın.',
      'Göğsünüzü hafifçe yukarı kaldırarak barı üst göğsünüze doğru çekin.',
      'Yavaşça ve kontrollü bir şekilde başlangıç pozisyonuna bırakın.'
    ],
    commonMistakes: ['Barı arkaya, enseye doğru çekmek', 'Aşırı geriye sallanmak', 'Yarım hareket yapmak'],
    safetyTips: ['Barı çekerken dirseklerinizin doğrudan aşağıya bakmasına dikkat edin.'],
    alternatives: ['Pull-up', 'Assisted Pull-up'],
    isCompound: true,
    keywords: ['sırt', 'kanat', 'lat', 'pulldown', 'makine', 'biceps']
  },
  {
    id: 'barbell_row',
    name: 'Barbell Row',
    alternativeNames: ['Bent Over Barbell Row', 'Eğilerek Halter Çekiş'],
    category: 'strength',
    primaryMuscles: ['Sırt'],
    secondaryMuscles: ['Biceps', 'Omuz', 'Bel'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Ayakta dururken barı kavrayın, dizlerinizi hafifçe bükün ve kalçadan 45 derece öne eğilin.',
      'Sırtınızı düz tutarak barı göbeğinize doğru çekin.',
      'Sırt kaslarınızı sıkıştırın ve barı kontrollü şekilde indirin.'
    ],
    commonMistakes: ['Belden güç alarak sallanmak', 'Sırtı yuvarlamak'],
    safetyTips: ['Bel ağrınız varsa hareketi hafif kilolarla yapın veya makine varyasyonlarını seçin.'],
    alternatives: ['Dumbbell Row', 'T-Bar Row'],
    isCompound: true,
    keywords: ['sırt', 'row', 'çekiş', 'barbell', 'halter']
  },
  {
    id: 'pullup',
    name: 'Pull-up (Barfiks)',
    alternativeNames: ['Barfiks', 'Chin-up'],
    category: 'strength',
    primaryMuscles: ['Sırt'],
    secondaryMuscles: ['Biceps', 'Omuz', 'Karın'],
    equipment: ['bodyweight', 'pullup_bar'],
    difficulty: 'intermediate',
    instructions: [
      'Barfiks demirini omuz genişliğinden geniş avuç içleriniz karşıya bakacak şekilde kavrayın.',
      'Kendinizi yukarı çekerek çenenizin bar hizasını geçmesini sağlayın.',
      'Yavaşça kendinizi aşağı bırakın.'
    ],
    commonMistakes: ['Kendini çok hızlı aşağı bırakmak', 'Bacakları çok fazla sallamak (momentum kullanmak)'],
    safetyTips: ['Omuz eklemlerini korumak için en dip noktada kendinizi tamamen salmayın, hafif aktif tutun.'],
    alternatives: ['Lat Pulldown', 'Inverted Row'],
    isCompound: true,
    isBodyweight: true,
    keywords: ['sırt', 'barfiks', 'pullup', 'vücut ağırlığı', 'chinup']
  },

  // OMUZ (Shoulders)
  {
    id: 'overhead_press',
    name: 'Barbell Overhead Press',
    alternativeNames: ['Military Press', 'Ayakta Omuz Pres'],
    category: 'strength',
    primaryMuscles: ['Omuz'],
    secondaryMuscles: ['Triceps', 'Karın', 'Omuz'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Barı omuz yüksekliğinde raf konumundan alın.',
      'Karın ve kalçanızı sıkarak barı başınızın üzerine doğru itin.',
      'Barı kontrollü bir şekilde köprücük kemiği hizasına geri indirin.'
    ],
    commonMistakes: ['Beli aşırı bükmek (arkaya eğilmek)', 'Barı tam yukarıda kilitlememek'],
    safetyTips: ['Core kaslarını aktif tutmak belinizi sakatlanmalardan korur.'],
    alternatives: ['Dumbbell Shoulder Press', 'Push Press'],
    isCompound: true,
    keywords: ['omuz', 'shoulder', 'press', 'overhead', 'military', 'barbell', 'halter']
  },
  {
    id: 'lateral_raise',
    name: 'Dumbbell Lateral Raise',
    alternativeNames: ['Yana Açış', 'Omuz Yana Açış'],
    category: 'strength',
    primaryMuscles: ['Omuz'], // Yan omuz
    secondaryMuscles: ['Omuz'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Ayakta dik durun, her iki elinizde dambılları bacaklarınızın yanında tutun.',
      'Dirseklerinizi çok hafif bükülü tutarak dambılları omuz hizasına kadar yana doğru kaldırın.',
      'Yavaşça başlangıç pozisyonuna indirin.'
    ],
    commonMistakes: ['Vücudu sallayarak ivme almak', 'Dambılları omuz hizasından çok yukarı kaldırmak'],
    safetyTips: ['Boyun kaslarınızı (trapez) aşırı sıkmamaya çalışın, odak yan omuzda olmalı.'],
    alternatives: ['Cable Lateral Raise', 'Machine Lateral Raise'],
    isCompound: false,
    keywords: ['omuz', 'yana açış', 'lateral', 'raise', 'dambıl', 'dumbbell']
  },
  {
    id: 'face_pull',
    name: 'Cable Face Pull',
    alternativeNames: ['Face Pull', 'Arka Omuz Çekiş'],
    category: 'strength',
    primaryMuscles: ['Omuz'], // Arka omuz
    secondaryMuscles: ['Sırt'], // Trapez ve rotator manşet
    equipment: ['cable'],
    difficulty: 'beginner',
    instructions: [
      'Halat aparatını üst kablo makarasına bağlayın.',
      'Geriye doğru bir adım atın, kollarınızı uzatıp halatı kavrayın.',
      'Halatın ortasını alnınıza/burnunuza doğru çekerken ellerinizi dışa doğru açın.'
    ],
    commonMistakes: ['Hareketi çok hızlı yapmak', 'Dirsekleri aşağı düşürmek'],
    safetyTips: ['Omuz sağlığı için çok faydalıdır, ağır kilo yerine yüksek tekrar ve kontrol tercih edin.'],
    alternatives: ['Rear Delt Fly', 'Bent Over Lateral Raise'],
    isCompound: false,
    keywords: ['omuz', 'arka omuz', 'face pull', 'kablo', 'cable']
  },

  // KOLLAR - Biceps & Triceps & Ön kol (Arms)
  {
    id: 'biceps_curl',
    name: 'Dumbbell Biceps Curl',
    alternativeNames: ['Pazı Bükme', 'Dambıl Curl'],
    category: 'strength',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Ön kol'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Ayakta dik durun, avuç içleriniz karşıya bakacak şekilde dambılları tutun.',
      'Dirseklerinizi vücudunuza sabit tutarak dambılları yukarı doğru bükün.',
      'Kasınızı tepe noktasında sıkın ve kontrollüce indirin.'
    ],
    commonMistakes: ['Dirsekleri öne arkaya oynatmak', 'Vücudu sallamak'],
    safetyTips: ['Dirseğinizin tam açıldığından emin olun ancak eklemi zorlamayın.'],
    alternatives: ['Barbell Curl', 'Hammer Curl'],
    isCompound: false,
    keywords: ['biceps', 'pazı', 'curl', 'kol', 'dambıl', 'dumbbell']
  },
  {
    id: 'triceps_pushdown',
    name: 'Cable Triceps Pushdown',
    alternativeNames: ['Kablo Arka Kol', 'Triceps Pushdown'],
    category: 'strength',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: [],
    equipment: ['cable'],
    difficulty: 'beginner',
    instructions: [
      'Kablo istasyonuna halat veya düz bar bağlayın.',
      'Dirseklerinizi vücudunuzun yanlarına sabitleyin.',
      'Kollarınızı tamamen aşağı doğru düzleştirerek arka kolu sıkıştırın.',
      'Yavaşça başlangıç noktasına (dirsek 90 derece olana kadar) bırakın.'
    ],
    commonMistakes: ['Dirsekleri yanlardan uzaklaştırmak', 'Omuzlardan güç almak'],
    safetyTips: ['Aşağıda 1 saniye sıkıştırarak maksimum verim alın.'],
    alternatives: ['Dumbbell Overhead Extension', 'Skull Crusher'],
    isCompound: false,
    keywords: ['triceps', 'arka kol', 'kablo', 'pushdown', 'cable']
  },
  {
    id: 'hammer_curl',
    name: 'Dumbbell Hammer Curl',
    alternativeNames: ['Çekiç Curl', 'Brakoradyalis Curl'],
    category: 'strength',
    primaryMuscles: ['Biceps', 'Ön kol'],
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Dambılları avuç içleriniz birbirine bakacak şekilde (nötr tutuş) kavrayın.',
      'Dirsekleri oynatmadan dambılları yukarı bükün ve indirin.'
    ],
    commonMistakes: ['Hareketi sallanarak yapmak'],
    safetyTips: ['Bileğinizi bükmeyin, sabit tutun.'],
    alternatives: ['Biceps Curl', 'Reverse Barbell Curl'],
    isCompound: false,
    keywords: ['biceps', 'ön kol', 'pazı', 'çekiç', 'hammer', 'curl']
  },

  // BACAK - Quadriceps & Hamstring & Kalça & Baldır (Legs)
  {
    id: 'barbell_squat',
    name: 'Barbell Back Squat',
    alternativeNames: ['Squat', 'Halterle Çömelme', 'Back Squat'],
    category: 'strength',
    primaryMuscles: ['Quadriceps', 'Kalça'],
    secondaryMuscles: ['Hamstring', 'Bel', 'Karın'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Barı trapez kaslarınızın üzerine yerleştirin, omuz genişliğinde kavrayın.',
      'Ayaklarınızı omuz genişliğinde açın, ayak parmakları hafifçe dışarı baksın.',
      'Kalçanızı geriye doğru iterek, dizlerinizi büküp çömelin (en azından uyluk kemiği yere paralel olana kadar).',
      'Topuklarınızdan güç alarak yukarı doğru kendinizi itin ve dik pozisyona dönün.'
    ],
    commonMistakes: ['Dizlerin içeri doğru bükülmesi', 'Topukların yerden kalkması', 'Sırtın aşırı öne eğilmesi'],
    safetyTips: ['Dizlerinizin ayak parmak ucu yönünde açıldığından emin olun.', 'Çok ağır girmeden önce formunuzu oturtun.'],
    alternatives: ['Goblet Squat', 'Leg Press'],
    isCompound: true,
    keywords: ['bacak', 'squat', 'quadriceps', 'kalça', 'halter', 'barbell', 'çömelme']
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    alternativeNames: ['Makine Bacak İtme', 'Leg Press Makinesi'],
    category: 'strength',
    primaryMuscles: ['Quadriceps'],
    secondaryMuscles: ['Kalça', 'Hamstring'],
    equipment: ['machine'],
    difficulty: 'beginner',
    instructions: [
      'Leg press makinesine oturun ve sırtınızı tam yaslayın.',
      'Ayaklarınızı platforma omuz genişliğinde yerleştirin.',
      'Güvenlik kilidini açıp dizlerinizi 90 derece bükerek ağırlığı indirin.',
      'Topuklarınızla platformu geri itin, dizlerinizi tam kilitlemeyin.'
    ],
    commonMistakes: ['Dizleri yukarıda tamamen kilitlemek (çok tehlikeli!)', 'Kalçayı koltuktan kaldırmak'],
    safetyTips: ['Dizlerinizi tam kilit konumuna getirmek eklemlere aşırı yük bindirir ve sakatlanmaya yol açabilir.'],
    alternatives: ['Barbell Squat', 'Hack Squat'],
    isCompound: true,
    keywords: ['bacak', 'leg press', 'makine', 'quads', 'itme']
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    alternativeNames: ['RDL', 'Arka Bacak Deadlift'],
    category: 'strength',
    primaryMuscles: ['Hamstring', 'Kalça'],
    secondaryMuscles: ['Bel', 'Sırt'],
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'intermediate',
    instructions: [
      'Ayakta dik durun, barı elinizde tutun.',
      'Dizlerinizi çok hafif büküp kalçanızı geriye iterek barı bacaklarınıza yakın şekilde indirin.',
      'Arka bacaklarınızın esnediğini hissettiğiniz noktada kalçayı sıkarak yukarı doğrulun.'
    ],
    commonMistakes: ['Dizleri çok bükmek (Squatlaşması)', 'Sırtı yuvarlamak'],
    safetyTips: ['Sırtın düz durması ve kalçanın geriye itilmesi hareketin temelidir.'],
    alternatives: ['Lying Leg Curl', 'Good Morning'],
    isCompound: true,
    keywords: ['bacak', 'arka bacak', 'hamstring', 'rdl', 'deadlift', 'romanian', 'kalça']
  },
  {
    id: 'calf_raise',
    name: 'Standing Calf Raise',
    alternativeNames: ['Kalf Kaldırma', 'Baldır Çalışması'],
    category: 'strength',
    primaryMuscles: ['Baldır'], // Calves
    secondaryMuscles: [],
    equipment: ['bodyweight', 'machine', 'dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Bir basamağın kenarında durun, topuklarınız boşlukta olsun.',
      'Parmak uçlarınızda yükselebildiğiniz kadar yükselin.',
      'Yavaşça topuklarınızı basamak hizasının altına indirerek kalf kaslarını esnetin.'
    ],
    commonMistakes: ['Hızlı ve zıplayarak yapmak', 'Yarım hareket açıklığı'],
    safetyTips: ['Yukarıda 1-2 saniye bekleyip kası kasılı tutmak etkiyi artırır.'],
    alternatives: ['Seated Calf Raise'],
    isCompound: false,
    keywords: ['baldır', 'kalf', 'calf', 'raise', 'bacak']
  },

  // KARIN (Abs)
  {
    id: 'crunch',
    name: 'Abdominal Crunch (Mekik)',
    alternativeNames: ['Yarım Mekik', 'Crunch'],
    category: 'strength',
    primaryMuscles: ['Karın'],
    secondaryMuscles: [],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Sırt üstü uzanın, dizlerinizi bükün ve ayaklarınızı yere basın.',
      'Ellerinizi başınızın arkasına hafifçe koyun (boynunuzdan çekmeyin).',
      'Karın kaslarınızı sıkarak kürek kemiklerinizi yerden kaldırın ve yavaşça indirin.'
    ],
    commonMistakes: ['Boynu ellerle öne doğru çekmek', 'Hızlı ve kontrolsüz yapmak'],
    safetyTips: ['Boyun fıtığı olanlar dikkatli olmalı, omuzların kalkması yeterlidir.'],
    alternatives: ['Plank', 'Hanging Leg Raise'],
    isCompound: false,
    isBodyweight: true,
    keywords: ['karın', 'mekik', 'crunch', 'abs', 'vücut ağırlığı', 'ev']
  },
  {
    id: 'plank_exercise',
    name: 'Plank',
    alternativeNames: ['Plank Duruşu', 'Karın Sıkıştırma'],
    category: 'strength',
    primaryMuscles: ['Karın'],
    secondaryMuscles: ['Bel', 'Omuz', 'Kalça'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Ön kollarınız ve ayak parmak uçlarınız üzerinde durun.',
      'Vücudunuz başınızdan topuklarınıza kadar düz bir çizgi oluşturmalıdır.',
      'Karın ve kalça kaslarınızı maksimum seviyede sıkarak bu pozisyonu koruyun.'
    ],
    commonMistakes: ['Kalçayı aşağı sarkıtmak', 'Nefes tutmak'],
    safetyTips: ['Belinizde ağrı hissederseniz hemen hareketi sonlandırın.'],
    alternatives: ['Side Plank', 'Hollow Hold'],
    isCompound: false,
    isBodyweight: true,
    keywords: ['karın', 'plank', 'abs', 'vücut ağırlığı', 'core', 'statik']
  },

  // KARDİYO (Cardio)
  {
    id: 'treadmill_run',
    name: 'Koşu Bandı Koşu / Yürüyüş',
    alternativeNames: ['Treadmill Run', 'Kardiyo Koşu', 'Koşu'],
    category: 'cardio',
    primaryMuscles: ['Kardiyo'],
    secondaryMuscles: ['Quadriceps', 'Hamstring', 'Baldır'],
    equipment: ['cardio_machine'],
    difficulty: 'beginner',
    instructions: [
      'Koşu bandına çıkın, güvenlik klipsini kıyafetinize takın.',
      'Isınma temposuyla başlayın (4-5 km/s yürüyüş).',
      'Hedefinize göre hızı ve eğimi artırarak koşu veya tempolu yürüyüş yapın.'
    ],
    commonMistakes: ['Kolları sürekli bandın kenarlarına dayamak', 'Yanlış ayakkabı kullanmak'],
    safetyTips: ['Hızı aniden artırmayın, aşamalı geçiş yapın.'],
    alternatives: ['Stationary Bike', 'Elliptical'],
    keywords: ['kardiyo', 'koşu', 'yürüyüş', 'treadmill', 'kalori', 'yağ yakımı']
  },
  {
    id: 'jumping_rope',
    name: 'İp Atlama',
    alternativeNames: ['Jump Rope', 'Kardiyo İp Atlama'],
    category: 'cardio',
    primaryMuscles: ['Kardiyo'],
    secondaryMuscles: ['Baldır', 'Omuz'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: [
      'İp saplarını elinize alın, ip arkada dursun.',
      'Bileklerinizi döndürerek ipi başınızın üzerinden geçirin ve ayak parmak uçlarınızla hafifçe zıplayın.'
    ],
    commonMistakes: ['Çok yüksek zıplamak', 'Tüm ayağı yere vurmak'],
    safetyTips: ['Diz eklemlerine yük binmesini azaltmak için yumuşak bir zeminde atlayın.'],
    alternatives: ['Jumping Jacks'],
    isBodyweight: true,
    keywords: ['ip atlama', 'kardiyo', 'yağ yakımı', 'kondisyon']
  },

  // MOBİLİTE & stretching & ısınma
  {
    id: 'cat_cow',
    name: 'Cat-Cow Stretch',
    alternativeNames: ['Kedi Deve Egzersizi', 'Omurga Mobilizasyonu'],
    category: 'mobility',
    primaryMuscles: ['Bel', 'Sırt'],
    secondaryMuscles: ['Karın'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Emekleme pozisyonu alın (eller omuz, dizler kalça hizasında).',
      'Nefes alırken sırtınızı çukurlaştırıp başınızı yukarı kaldırın (Cow/Deve).',
      'Nefes verirken sırtınızı yukarı yuvarlayıp çenenizi göğsünüze yaklaştırın (Cat/Kedi).'
    ],
    commonMistakes: ['Hızlı ve kontrolsüz omurga büküşü'],
    safetyTips: ['Omurlarınızı tek tek hissetmeye çalışarak yavaş yapın.'],
    alternatives: ['Child Pose'],
    isBodyweight: true,
    keywords: ['mobilite', 'esneme', 'bel', 'sırt', 'kedi', 'deve', 'cat cow']
  },
  {
    id: 'world_greatest_stretch',
    name: 'Worlds Greatest Stretch',
    alternativeNames: ['Dünyanın En İyi Esneme Hareketi', 'Full Body Mobility'],
    category: 'warmup',
    primaryMuscles: ['Kalça', 'Hamstring', 'Sırt', 'Omuz'],
    secondaryMuscles: ['Quadriceps'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Büyük bir lunge adımı atın, arkadaki diz düz kalsın.',
      'Öndeki ayağınızın yanına iki elinizi de basın.',
      'İçerideki kolunuzu yukarı, tavan yönünde döndürerek göğsünüzü açın ve parmak uçlarınıza bakın.'
    ],
    commonMistakes: ['Arkadaki dizi aşırı bükmek', 'Göğsü yeterince döndürmemek'],
    safetyTips: ['Dengeyi kaybetmemek için acele etmeyin.'],
    alternatives: ['Hip Opener Stretch'],
    isBodyweight: true,
    keywords: ['ısınma', 'mobilite', 'esneme', 'bacak', 'sırt', 'omuz', 'lunge']
  }
];
