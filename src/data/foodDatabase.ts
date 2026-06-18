/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FoodDatabaseItem = {
    id: string;
    name: string;
    category: string;
    servingGram: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    keywords: string[];
  };
  
  export const foodDatabase: FoodDatabaseItem[] = [
    // Protein Kaynakları
    {
      id: 'f1',
      name: 'Tavuk Göğsü (Pişmiş)',
      category: 'Protein',
      servingGram: 100,
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      keywords: ['tavuk', 'göğüs', 'chicken', 'breast', 'protein', 'haşlama', 'ızgara']
    },
    {
      id: 'f2',
      name: 'Tavuk But (Izgara, Derisiz)',
      category: 'Protein',
      servingGram: 100,
      calories: 180,
      protein: 26,
      carbs: 0,
      fat: 9,
      keywords: ['tavuk', 'but', 'baget', 'chicken', 'thigh', 'kırmızı et']
    },
    {
      id: 'f3',
      name: 'Hindi Göğsü (Pişmiş)',
      category: 'Protein',
      servingGram: 100,
      calories: 135,
      protein: 30,
      carbs: 0,
      fat: 1.5,
      keywords: ['hindi', 'göğüs', 'turkey', 'breast', 'protein', 'diyet', 'fırın']
    },
    {
      id: 'f4',
      name: 'Dana Eti (Izgara, Yağsız)',
      category: 'Protein',
      servingGram: 100,
      calories: 220,
      protein: 28,
      carbs: 0,
      fat: 11,
      keywords: ['dana', 'eti', 'kırmızı', 'beef', 'steak', 'antrikot', 'bonfile', 'ızgara']
    },
    {
      id: 'f5',
      name: 'Dana Kıyma (Az Yağlı %10)',
      category: 'Protein',
      servingGram: 100,
      calories: 200,
      protein: 26,
      carbs: 0,
      fat: 10,
      keywords: ['kıyma', 'dana', 'mutton', 'kofte', 'kıyma', 'kıyma', 'protein']
    },
    {
      id: 'f6',
      name: 'Izgara Köfte',
      category: 'Protein',
      servingGram: 100,
      calories: 230,
      protein: 22,
      carbs: 4,
      fat: 14,
      keywords: ['köfte', 'kofte', 'ızgara', 'meatball', 'dana', 'protein']
    },
    {
      id: 'f7',
      name: 'Ton Balığı Konservesi (Yağ süzülmüş)',
      category: 'Protein',
      servingGram: 100,
      calories: 130,
      protein: 28,
      carbs: 0,
      fat: 1.5,
      keywords: ['ton', 'balığı', 'tuna', 'konserve', 'balık', 'fish', 'diyet', 'salata']
    },
    {
      id: 'f8',
      name: 'Somon Balığı (Fırın)',
      category: 'Protein',
      servingGram: 100,
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 12,
      keywords: ['somon', 'salmon', 'balık', 'fish', 'omega', 'yağlı', 'fırın']
    },
    {
      id: 'f9',
      name: 'Levrek (Izgara)',
      category: 'Protein',
      servingGram: 100,
      calories: 125,
      protein: 24,
      carbs: 0,
      fat: 3,
      keywords: ['levrek', 'seabass', 'balık', 'fish', 'hafif', 'ızgara']
    },
    {
      id: 'f10',
      name: 'Haşlanmış Yumurta',
      category: 'Protein',
      servingGram: 100,
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      keywords: ['yumurta', 'egg', 'haslanmis', 'haşlama', 'kahvaltı', 'protein']
    },
    {
      id: 'f11',
      name: 'Yumurta Beyazı',
      category: 'Protein',
      servingGram: 100,
      calories: 52,
      protein: 11,
      carbs: 0.7,
      fat: 0.2,
      keywords: ['yumurta', 'beyazı', 'white', 'egg', 'saf', 'protein', 'diyet', 'omlet']
    },
    {
      id: 'f12',
      name: 'Lor Peyniri (Yağsız)',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 85,
      protein: 17,
      carbs: 2.5,
      fat: 0.5,
      keywords: ['lor', 'peyniri', 'cottage', 'cheese', 'peynir', 'sporcu', 'yağsız']
    },
    {
      id: 'f13',
      name: 'Tam Yağlı Beyaz Peynir',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 260,
      protein: 15,
      carbs: 2,
      fat: 21,
      keywords: ['beyaz', 'peynir', 'cheese', 'feta', 'kahvaltı', 'klasik']
    },
    {
      id: 'f14',
      name: 'Taze Kaşar Peyniri',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 350,
      protein: 25,
      carbs: 1.5,
      fat: 27,
      keywords: ['kaşar', 'peyniri', 'tost', 'peynir', 'yellow', 'cheese', 'kashar']
    },
  
    // Süt Ürünleri
    {
      id: 'f15',
      name: 'Yarım Yağlı Yoğurt',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 60,
      protein: 3.5,
      carbs: 4.7,
      fat: 3,
      keywords: ['yoğurt', 'yogurt', 'süt', 'sade', 'ev yoğurdu']
    },
    {
      id: 'f16',
      name: 'Süzme Yoğurt',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 115,
      protein: 8,
      carbs: 4,
      fat: 7.5,
      keywords: ['süzme', 'yoğurt', 'yogurt', 'koyu', 'protein', 'meze']
    },
    {
      id: 'f17',
      name: 'Yayık Ayranı',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 38,
      protein: 2,
      carbs: 2.8,
      fat: 1.8,
      keywords: ['ayran', 'yoghurt', 'drink', 'tuzlu', 'soğuk', 'içecek']
    },
    {
      id: 'f18',
      name: 'Yarım Yağlı Süt (%1.5)',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 47,
      protein: 3.1,
      carbs: 4.8,
      fat: 1.5,
      keywords: ['süt', 'milk', 'yarım', 'yağlı', 'kahve']
    },
    {
      id: 'f19',
      name: 'Sade Kefir',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 55,
      protein: 3.2,
      carbs: 4.5,
      fat: 2.5,
      keywords: ['kefir', 'prebiyotik', 'bağırsak', 'süt', 'içecek']
    },
  
    // Karbonhidrat Kaynakları
    {
      id: 'f20',
      name: 'Beyaz Pirinç Pilavı',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 160,
      protein: 2.5,
      carbs: 34,
      fat: 1.5,
      keywords: ['pirinç', 'pilavı', 'pilav', 'rice', 'beyaz', 'enerji']
    },
    {
      id: 'f21',
      name: 'Haşlanmış Esmer Pirinç',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      keywords: ['esmer', 'pirinç', 'brown', 'rice', 'diyet', 'lif', 'haşlama']
    },
    {
      id: 'f22',
      name: 'Bulgur Pilavı',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 150,
      protein: 4,
      carbs: 28,
      fat: 2,
      keywords: ['bulgur', 'pilavı', 'pilav', 'wheat', 'lif', 'tok', 'tutan']
    },
    {
      id: 'f23',
      name: 'Haşlanmış Makarna',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 131,
      protein: 5,
      carbs: 25,
      fat: 1.1,
      keywords: ['makarna', 'pasta', 'haşlanmış', 'spagetti', 'italyan']
    },
    {
      id: 'f24',
      name: 'Tam Buğday Makarna (Haşlanmış)',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 124,
      protein: 5.3,
      carbs: 24,
      fat: 1.0,
      keywords: ['tam', 'buğday', 'makarna', 'whole', 'wheat', 'pasta', 'diyet']
    },
    {
      id: 'f25',
      name: 'Beyaz Ekmek',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 265,
      protein: 9,
      carbs: 49,
      fat: 3.2,
      keywords: ['beyaz', 'ekmek', 'bread', 'un', 'fırın', 'dilim']
    },
    {
      id: 'f26',
      name: 'Tam Buğday Ekmeği',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 247,
      protein: 12,
      carbs: 41,
      fat: 3.4,
      keywords: ['tam', 'buğday', 'ekmeği', 'bread', 'lifli', 'diyet', 'kepek']
    },
    {
      id: 'f27',
      name: 'Lavaş Ekmek',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 290,
      protein: 8,
      carbs: 55,
      fat: 4,
      keywords: ['lavaş', 'lavas', 'tortilla', 'dürüm', 'kebap', 'ekmek']
    },
    {
      id: 'f28',
      name: 'Yulaf Ezmesi',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 389,
      protein: 16.9,
      carbs: 66,
      fat: 6.9,
      keywords: ['yulaf', 'ezmesi', 'oat', 'oatmeal', 'kahvaltı', 'sporcu', 'lif']
    },
    {
      id: 'f29',
      name: 'Haşlanmış Patates',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 87,
      protein: 1.9,
      carbs: 20,
      fat: 0.1,
      keywords: ['patates', 'potato', 'haşlanmış', 'haşlama', 'püre', 'nişasta']
    },
    {
      id: 'f30',
      name: 'Tatlı Patates (Fırın)',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 103,
      protein: 2,
      carbs: 24,
      fat: 0.2,
      keywords: ['tatlı', 'patates', 'sweet', 'potato', 'potasyum', 'fırın']
    },
  
    // Bakliyatlar
    {
      id: 'f31',
      name: 'Yeşil Mercimekli Haşlama',
      category: 'Bakliyat',
      servingGram: 100,
      calories: 116,
      protein: 9,
      carbs: 20,
      fat: 0.4,
      keywords: ['yeşil', 'mercimek', 'lentil', 'protein', 'bakliyat', 'diyet']
    },
    {
      id: 'f32',
      name: 'Haşlanmış Nohut',
      category: 'Bakliyat',
      servingGram: 100,
      calories: 164,
      protein: 8.9,
      carbs: 27,
      fat: 2.6,
      keywords: ['nohut', 'chickpea', 'humus', 'haşlama', 'bakliyat']
    },
    {
      id: 'f33',
      name: 'Kuru Fasulye (Yağsız Haşlanmış)',
      category: 'Bakliyat',
      servingGram: 100,
      calories: 139,
      protein: 9.7,
      carbs: 25,
      fat: 0.5,
      keywords: ['kuru', 'fasulye', 'bean', 'piyaz', 'bakliyat']
    },
    {
      id: 'f34',
      name: 'Haşlanmış Barbunya',
      category: 'Bakliyat',
      servingGram: 100,
      calories: 143,
      protein: 9.2,
      carbs: 26,
      fat: 0.8,
      keywords: ['barbunya', 'kidney', 'beans', 'zeytinyağlı', 'bakliyat']
    },
  
    // Meyveler
    {
      id: 'f35',
      name: 'Muz',
      category: 'Meyve',
      servingGram: 100,
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      keywords: ['muz', 'banana', 'potasyum', 'antrenman', 'öncesi', 'meyve']
    },
    {
      id: 'f36',
      name: 'Kırmızı Elma',
      category: 'Meyve',
      servingGram: 100,
      calories: 52,
      protein: 0.3,
      carbs: 13.8,
      fat: 0.2,
      keywords: ['elma', 'apple', 'yeşil elma', 'lif', 'meyve']
    },
    {
      id: 'f37',
      name: 'Portakal',
      category: 'Meyve',
      servingGram: 100,
      calories: 47,
      protein: 0.9,
      carbs: 11.8,
      fat: 0.1,
      keywords: ['portakal', 'orange', 'c', 'vitamini', 'narenciye', 'meyve']
    },
    {
      id: 'f38',
      name: 'Çilek',
      category: 'Meyve',
      servingGram: 100,
      calories: 32,
      protein: 0.7,
      carbs: 7.7,
      fat: 0.3,
      keywords: ['çilek', 'cilek', 'strawberry', 'antioksidan', 'hafif', 'meyve']
    },
    {
      id: 'f39',
      name: 'Üzüm (Taze)',
      category: 'Meyve',
      servingGram: 100,
      calories: 69,
      protein: 0.7,
      carbs: 18,
      fat: 0.2,
      keywords: ['üzüm', 'uzum', 'grape', 'tatlı', 'früktoz', 'meyve']
    },
    {
      id: 'f40',
      name: 'Avokado',
      category: 'Meyve',
      servingGram: 100,
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
      keywords: ['avokado', 'avocado', 'sağlıklı', 'yağ', 'salata', 'kahvaltı']
    },
    {
      id: 'f41',
      name: 'Armut',
      category: 'Meyve',
      servingGram: 100,
      calories: 57,
      protein: 0.4,
      carbs: 15,
      fat: 0.1,
      keywords: ['armut', 'pear', 'sulu', 'lifli', 'meyve']
    },
    {
      id: 'f42',
      name: 'Karpuz',
      category: 'Meyve',
      servingGram: 100,
      calories: 30,
      protein: 0.6,
      carbs: 7.6,
      fat: 0.2,
      keywords: ['karpuz', 'watermelon', 'yaz', 'serin', 'su', 'meyve']
    },
    {
      id: 'f43',
      name: 'Kavun',
      category: 'Meyve',
      servingGram: 100,
      calories: 34,
      protein: 0.8,
      carbs: 8.2,
      fat: 0.2,
      keywords: ['kavun', 'melon', 'yaz', 'meyve', 'tatlı']
    },
  
    // Sebzeler
    {
      id: 'f44',
      name: 'Taze Domates',
      category: 'Sebze',
      servingGram: 100,
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      keywords: ['domates', 'tomato', 'menemen', 'salata', 'sebze']
    },
    {
      id: 'f45',
      name: 'Salatalık (Kabuklu)',
      category: 'Sebze',
      servingGram: 100,
      calories: 15,
      protein: 0.7,
      carbs: 3.6,
      fat: 0.1,
      keywords: ['salatalık', 'salatalik', 'cucumber', 'diyet', 'salata', 'su', 'sebze']
    },
    {
      id: 'f46',
      name: 'Kıvırcık Marul',
      category: 'Sebze',
      servingGram: 100,
      calories: 15,
      protein: 1.4,
      carbs: 2.9,
      fat: 0.2,
      keywords: ['marul', 'kıvırcık', 'lettuce', 'yeşillik', 'salata', 'sebze']
    },
    {
      id: 'f47',
      name: 'Haşlanmış Brokoli',
      category: 'Sebze',
      servingGram: 100,
      calories: 35,
      protein: 2.4,
      carbs: 7,
      fat: 0.4,
      keywords: ['brokoli', 'broccoli', 'fitness', 'haşlama', 'yeşil', 'diyet', 'sebze']
    },
    {
      id: 'f48',
      name: 'Zeytinyağlı Ispanak Yemek',
      category: 'Sebze',
      servingGram: 100,
      calories: 65,
      protein: 2,
      carbs: 4.5,
      fat: 4.8,
      keywords: ['ıspanak', 'ispanak', 'spinach', 'demir', 'sebze', 'ev yemeği']
    },
    {
      id: 'f49',
      name: 'Fırınlanmış Kabak Mücver',
      category: 'Sebze',
      servingGram: 100,
      calories: 95,
      protein: 4,
      carbs: 8,
      fat: 5,
      keywords: ['kabak', 'mücver', 'zucchini', 'fırın', 'diyet', 'sebze']
    },
    {
      id: 'f50',
      name: 'Taze Havuç',
      category: 'Sebze',
      servingGram: 100,
      calories: 41,
      protein: 0.9,
      carbs: 9.6,
      fat: 0.2,
      keywords: ['havuç', 'havuc', 'carrot', 'göz', 'a', 'vitamini', 'sebze']
    },
    {
      id: 'f51',
      name: 'Kırmızı Biber (Kapya)',
      category: 'Sebze',
      servingGram: 100,
      calories: 31,
      protein: 1,
      carbs: 6,
      fat: 0.3,
      keywords: ['biber', 'kapya', 'kırmızı', 'pepper', 'c vitamini', 'sebze']
    },
  
    // Yağ / Kuruyemiş
    {
      id: 'f52',
      name: 'Zeytinyağı (Ekstra Sızma)',
      category: 'Yağ',
      servingGram: 100,
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100,
      keywords: ['zeytinyağı', 'olive', 'oil', 'sızma', 'sağlıklı', 'yağ']
    },
    {
      id: 'f53',
      name: 'Eritilmiş Tereyağı',
      category: 'Yağ',
      servingGram: 100,
      calories: 717,
      protein: 0.9,
      carbs: 0.1,
      fat: 81,
      keywords: ['tereyağı', 'tereyag', 'butter', 'hayvansal', 'yağ']
    },
    {
      id: 'f54',
      name: 'Fıstık Ezmesi (Sade, Katkısız)',
      category: 'Kuruyemiş',
      servingGram: 100,
      calories: 588,
      protein: 25,
      carbs: 20,
      fat: 50,
      keywords: ['fıstık', 'ezmesi', 'peanut', 'butter', 'sporcu', 'hacim', 'bulking']
    },
    {
      id: 'f55',
      name: 'Çiğ Badem',
      category: 'Kuruyemiş',
      servingGram: 100,
      calories: 579,
      protein: 21,
      carbs: 22,
      fat: 49,
      keywords: ['badem', 'almond', 'çiğ', 'kuruyemiş', 'sağlıklı', 'yağ', 'ara öğün']
    },
    {
      id: 'f56',
      name: 'Ceviz İçi',
      category: 'Kuruyemiş',
      servingGram: 100,
      calories: 654,
      protein: 15,
      carbs: 14,
      fat: 65,
      keywords: ['ceviz', 'walnut', 'omega3', 'beyin', 'kuruyemiş', 'yağ']
    },
    {
      id: 'f57',
      name: 'Çiğ Fındık',
      category: 'Kuruyemiş',
      servingGram: 100,
      calories: 628,
      protein: 15,
      carbs: 17,
      fat: 61,
      keywords: ['fındık', 'hazelnut', 'çiğ', 'kuruyemiş', 'enerji']
    },
    {
      id: 'f58',
      name: 'Sarı Leblebi',
      category: 'Kuruyemiş',
      servingGram: 100,
      calories: 368,
      protein: 19,
      carbs: 58,
      fat: 5,
      keywords: ['leblebi', 'nohut', 'sarı', 'ara öğün', 'lifli', 'mide', 'bastıran']
    },
  
    // Türk Yemekleri ve Günlük Hazır Besinler
    {
      id: 'f59',
      name: 'Süzme Mercimek Çorbası',
      category: 'Çorba',
      servingGram: 100,
      calories: 85,
      protein: 4.8,
      carbs: 13,
      fat: 1.5,
      keywords: ['mercimek', 'çorbası', 'corba', 'soup', 'başlangıç', 'bakliyat']
    },
    {
      id: 'f60',
      name: 'Ezogelin Çorbası',
      category: 'Çorba',
      servingGram: 100,
      calories: 90,
      protein: 4.5,
      carbs: 14,
      fat: 2,
      keywords: ['ezogelin', 'çorbası', 'corba', 'soup', 'başlangıç', 'bulgur']
    },
    {
      id: 'f61',
      name: 'Tavuk Suyu Çorba',
      category: 'Çorba',
      servingGram: 100,
      calories: 75,
      protein: 6.2,
      carbs: 5,
      fat: 3,
      keywords: ['tavuk', 'suyu', 'çorbası', 'corba', 'chicken', 'soup', 'şifa']
    },
    {
      id: 'f62',
      name: 'Tavuk Döner (Lavaş Dürüm)',
      category: 'Fast Food',
      servingGram: 100,
      calories: 215,
      protein: 16,
      carbs: 23,
      fat: 6.5,
      keywords: ['tavuk', 'döner', 'durum', 'dürüm', 'doner', 'wrap', 'fast food']
    },
    {
      id: 'f63',
      name: 'Et Döner (Lavaş Dürüm)',
      category: 'Fast Food',
      servingGram: 100,
      calories: 240,
      protein: 18,
      carbs: 22,
      fat: 9,
      keywords: ['et', 'döner', 'dürüm', 'durum', 'doner', 'beef', 'wrap', 'kebap']
    },
    {
      id: 'f64',
      name: 'Lahmacun (Tek adet)',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 220,
      protein: 9.5,
      carbs: 28,
      fat: 7.7,
      keywords: ['lahmacun', 'pide', 'kıyma', 'turkish', 'pizza', 'fast food']
    },
    {
      id: 'f65',
      name: 'Karışık Pizza (Orta Boy Dilim)',
      category: 'Fast Food',
      servingGram: 100,
      calories: 266,
      protein: 11,
      carbs: 30,
      fat: 11,
      keywords: ['pizza', 'karışık', 'sucuk', 'fast food', 'cheat']
    },
    {
      id: 'f66',
      name: 'Klasik Hamburger',
      category: 'Fast Food',
      servingGram: 100,
      calories: 295,
      protein: 14,
      carbs: 28,
      fat: 14,
      keywords: ['hamburger', 'burger', 'fast food', 'burger köftesi', 'cheat']
    },
    {
      id: 'f67',
      name: 'Patates Kızartması',
      category: 'Fast Food',
      servingGram: 100,
      calories: 312,
      protein: 3.4,
      carbs: 41,
      fat: 15,
      keywords: ['patates', 'kızartması', 'french', 'fries', 'kızarmış', 'fast food']
    },
    {
      id: 'f68',
      name: 'Sokak Simiti',
      category: 'Kahvaltılık',
      servingGram: 100,
      calories: 275,
      protein: 8,
      carbs: 58,
      fat: 3.5,
      keywords: ['simit', 'susam', 'kahvaltı', 'pastane', 'fırın']
    },
    {
      id: 'f69',
      name: 'Peynirli Poğaça',
      category: 'Kahvaltılık',
      servingGram: 100,
      calories: 360,
      protein: 8.5,
      carbs: 42,
      fat: 18,
      keywords: ['poğaça', 'pogaca', 'peynirli', 'pastane', 'yağlı', 'kahvaltı']
    },
    {
      id: 'f70',
      name: 'Kıymalı Kol Böreği',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 330,
      protein: 10,
      carbs: 36,
      fat: 16,
      keywords: ['börek', 'borek', 'kıymalı', 'yufka', 'pastane']
    },
    {
      id: 'f71',
      name: 'Cevizli Baklava',
      category: 'Tatlı',
      servingGram: 100,
      calories: 410,
      protein: 4.5,
      carbs: 55,
      fat: 19,
      keywords: ['baklava', 'tatlı', 'serbetli', 'fıstıklı', 'cevizli', 'cheat']
    },
    {
      id: 'f72',
      name: 'Fırın Sütlaç',
      category: 'Tatlı',
      servingGram: 100,
      calories: 140,
      protein: 3.5,
      carbs: 23,
      fat: 3.8,
      keywords: ['sütlaç', 'sutlac', 'sütlü', 'tatlı', 'fırın', 'pirinç']
    },
    {
      id: 'f73',
      name: 'Kazandibi',
      category: 'Tatlı',
      servingGram: 100,
      calories: 165,
      protein: 4,
      carbs: 31,
      fat: 3,
      keywords: ['kazandibi', 'tatlı', 'sütlü', 'geleneksel']
    },
  
    // İçecekler
    {
      id: 'f74',
      name: 'İçme Suyu',
      category: 'İçecek',
      servingGram: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      keywords: ['su', 'içme', 'water', 'sıvı', 'hydration']
    },
    {
      id: 'f75',
      name: 'Sade Doğal Maden Suyu',
      category: 'İçecek',
      servingGram: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      keywords: ['mineral', 'soda', 'maden', 'suyu', 'sparkling', 'magnezyum']
    },
    {
      id: 'f76',
      name: 'Pepsi Zero / Coca Cola Zero',
      category: 'İçecek',
      servingGram: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      keywords: ['cola', 'zero', 'diyet', 'asitli', 'pepsi', 'şekersiz', 'seker']
    },
    {
      id: 'f77',
      name: 'Sade Türk Kahvesi',
      category: 'İçecek',
      servingGram: 100,
      calories: 2,
      protein: 0.1,
      carbs: 0.2,
      fat: 0.1,
      keywords: ['kahve', 'türk', 'turk', 'kafein', 'sade', 'preworkout']
    },
    {
      id: 'f78',
      name: 'Sade Filtre Kahve',
      category: 'İçecek',
      servingGram: 100,
      calories: 2,
      protein: 0.1,
      carbs: 0,
      fat: 0,
      keywords: ['filtre', 'kahve', 'filter', 'coffee', 'black', 'kafein']
    },
    {
      id: 'f79',
      name: 'Şekersiz Siyah Çay (Cam demleme)',
      category: 'İçecek',
      servingGram: 100,
      calories: 1,
      protein: 0,
      carbs: 0.2,
      fat: 0,
      keywords: ['çay', 'cay', 'tea', 'demleme', 'şekersiz']
    },
    {
      id: 'f80',
      name: 'Karışık Meyve Suyu',
      category: 'İçecek',
      servingGram: 100,
      calories: 45,
      protein: 0.4,
      carbs: 11,
      fat: 0.1,
      keywords: ['meyve', 'suyu', 'portakal', 'juice', 'şekerli', 'sakkaroz']
    },
  
    // Kalan 20 Çeşit ve İleri Seviye Diyet Ürünleri (Hızlıca 100 barajını geçiyoruz)
    {
      id: 'f81',
      name: 'Soya Sütü',
      category: 'İçecek',
      servingGram: 100,
      calories: 54,
      protein: 3.3,
      carbs: 6,
      fat: 1.8,
      keywords: ['soya', 'sütü', 'soy', 'milk', 'vegan', 'bitkisel']
    },
    {
      id: 'f82',
      name: 'Badem Sütü (Şekersiz)',
      category: 'İçecek',
      servingGram: 100,
      calories: 15,
      protein: 0.5,
      carbs: 0.3,
      fat: 1.1,
      keywords: ['badem', 'sütü', 'almond', 'milk', 'vegan', 'şekersiz']
    },
    {
      id: 'f83',
      name: 'Whey Protein Tozu (Suda karışım)',
      category: 'Protein',
      servingGram: 100,
      calories: 390,
      protein: 78,
      carbs: 5,
      fat: 4,
      keywords: ['protein', 'tozu', 'whey', 'izole', 'supplement', 'sporcu']
    },
    {
      id: 'f84',
      name: 'Kreatin Monohidrat',
      category: 'Supplement',
      servingGram: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      keywords: ['kreatin', 'creatine', 'güç', 'supplement']
    },
    {
      id: 'f85',
      name: 'BCAA Suda Çözünen',
      category: 'Supplement',
      servingGram: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      keywords: ['bcaa', 'aminoasit', 'supplement', 'kas']
    },
    {
      id: 'f86',
      name: 'Yulaf Unu',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 380,
      protein: 13,
      carbs: 68,
      fat: 6.5,
      keywords: ['yulaf', 'unu', 'un', 'oat', 'flour', 'pancake', 'tarif']
    },
    {
      id: 'f87',
      name: 'Tarhana Çorbası',
      category: 'Çorba',
      servingGram: 100,
      calories: 110,
      protein: 3.5,
      carbs: 16,
      fat: 3,
      keywords: ['tarhana', 'çorbası', 'corba', 'geleneksel']
    },
    {
      id: 'f88',
      name: 'İmambayıldı (Zeytinyağlı)',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 120,
      protein: 1.5,
      carbs: 8,
      fat: 9,
      keywords: ['patlıcan', 'biber', 'imambayıldı', 'zeytinyağlı', 'ev yemeği']
    },
    {
      id: 'f89',
      name: 'Karnıyarık (Kıymalı)',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 180,
      protein: 7,
      carbs: 6,
      fat: 14,
      keywords: ['karnıyarık', 'patlıcan', 'kıyma', 'kızartma', 'akşam yemeği']
    },
    {
      id: 'f90',
      name: 'Zeytinyağlı Yaprak Sarması',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 160,
      protein: 2.2,
      carbs: 26,
      fat: 5.5,
      keywords: ['sarma', 'yaprak', 'pirinç', 'zeytinyağlı', 'meze']
    },
    {
      id: 'f91',
      name: 'Humus',
      category: 'Bakliyat',
      servingGram: 100,
      calories: 166,
      protein: 7.9,
      carbs: 14,
      fat: 9.6,
      keywords: ['humus', 'nohut', 'tahin', 'meze', 'sağlıklı', 'yağ']
    },
    {
      id: 'f92',
      name: 'Tahin Pekmez Karışımı',
      category: 'Tatlı',
      servingGram: 100,
      calories: 460,
      protein: 8,
      carbs: 52,
      fat: 25,
      keywords: ['tahin', 'pekmez', 'enerji', 'kahvaltı', 'tatlı']
    },
    {
      id: 'f93',
      name: 'Tahin',
      category: 'Yağ',
      servingGram: 100,
      calories: 595,
      protein: 17,
      carbs: 21,
      fat: 54,
      keywords: ['tahin', 'susam', 'susame', 'yağ', 'kalorili']
    },
    {
      id: 'f94',
      name: 'Süzme Çiçek Balı',
      category: 'Tatlı',
      servingGram: 100,
      calories: 304,
      protein: 0.3,
      carbs: 82,
      fat: 0,
      keywords: ['bal', 'honey', 'tatlandırıcı', 'doğal', 'kahvaltı']
    },
    {
      id: 'f95',
      name: 'Çilek Reçeli',
      category: 'Tatlı',
      servingGram: 100,
      calories: 278,
      protein: 0.4,
      carbs: 68,
      fat: 0.1,
      keywords: ['reçel', 'recel', 'çilek', 'kahvaltı', 'şekerli']
    },
    {
      id: 'f96',
      name: 'Kinoa (Haşlanmış)',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 120,
      protein: 4.4,
      carbs: 21,
      fat: 1.9,
      keywords: ['kinoa', 'quinoa', 'proteinli', 'salata', 'glütensiz']
    },
    {
      id: 'f97',
      name: 'Chia Tohumu',
      category: 'Superfood',
      servingGram: 100,
      calories: 486,
      protein: 16.5,
      carbs: 42,
      fat: 30.7,
      keywords: ['chia', 'tohumu', 'puding', 'lif', 'omega3']
    },
    {
      id: 'f98',
      name: 'Speras (Kabak Çekirdeği)',
      category: 'Kuruyemiş',
      servingGram: 100,
      calories: 559,
      protein: 30,
      carbs: 10,
      fat: 49,
      keywords: ['kabak', 'çekirdeği', 'kuruyemiş', 'çinko', 'magnezyum']
    },
    {
      id: 'f99',
      name: 'Yeşil Zeytin',
      category: 'Kahvaltılık',
      servingGram: 100,
      calories: 115,
      protein: 0.8,
      carbs: 6.3,
      fat: 10.7,
      keywords: ['zeytin', 'yeşil', 'kahvaltı', 'tuzlu']
    },
    {
      id: 'f100',
      name: 'Siyah Zeytin',
      category: 'Kahvaltılık',
      servingGram: 100,
      calories: 145,
      protein: 1.2,
      carbs: 3.5,
      fat: 15.3,
      keywords: ['zeytin', 'siyah', 'kahvaltı', 'yağlı']
    },
    {
      id: 'f101',
      name: 'Tavuk Pirzola (Pişmiş, Derisiz)',
      category: 'Protein',
      servingGram: 100,
      calories: 185,
      protein: 24.5,
      carbs: 0,
      fat: 9.8,
      keywords: ['tavuk', 'pirzola', 'chicken', 'ızgara', 'protein', 'yağlı']
    },
    {
      id: 'f102',
      name: 'Kuzu Eti (Izgara, Yağsız)',
      category: 'Protein',
      servingGram: 100,
      calories: 226,
      protein: 27,
      carbs: 0,
      fat: 12.5,
      keywords: ['kuzu', 'eti', 'lamb', 'ızgara', 'protein', 'kırmızı et']
    },
    {
      id: 'f103',
      name: 'Hindi Füme Dilim',
      category: 'Protein',
      servingGram: 100,
      calories: 104,
      protein: 16.5,
      carbs: 1.5,
      fat: 3.5,
      keywords: ['hindi', 'füme', 'smoked', 'turkey', 'dilim', 'sandviç', 'protein']
    },
    {
      id: 'f104',
      name: 'Sardalya (Konserve, süzülmüş yağ)',
      category: 'Protein',
      servingGram: 100,
      calories: 208,
      protein: 25,
      carbs: 0,
      fat: 11.5,
      keywords: ['sardalya', 'balık', 'fish', 'konserve', 'omega3', 'kalsiyum']
    },
    {
      id: 'f105',
      name: 'Karides (Haşlanmış)',
      category: 'Protein',
      servingGram: 100,
      calories: 99,
      protein: 24,
      carbs: 0.2,
      fat: 0.3,
      keywords: ['karides', 'shrimp', 'prawn', 'deniz ürünü', 'haşlama', 'protein']
    },
    {
      id: 'f106',
      name: 'Dana Bonfile (Pişmiş)',
      category: 'Protein',
      servingGram: 100,
      calories: 189,
      protein: 29,
      carbs: 0,
      fat: 8,
      keywords: ['bonfile', 'dana', 'kırmızı', 'beef', 'steak', 'yağsız', 'protein']
    },
    {
      id: 'f107',
      name: 'Çipura (Izgara)',
      category: 'Protein',
      servingGram: 100,
      calories: 135,
      protein: 22.5,
      carbs: 0,
      fat: 4.9,
      keywords: ['çipura', 'cipura', 'balık', 'fish', 'ızgara', 'deniz', 'protein']
    },
    {
      id: 'f108',
      name: 'Süzme Peynir',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 195,
      protein: 11.5,
      carbs: 2.5,
      fat: 15,
      keywords: ['süzme', 'peynir', 'kahvaltı', 'yumuşak', 'tuzsuz']
    },
    {
      id: 'f109',
      name: 'Quark (Sade, Yüksek Proteinli)',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 65,
      protein: 10,
      carbs: 4,
      fat: 0.2,
      keywords: ['quark', 'yoğurt', 'peynir', 'yüksek', 'protein', 'ara öğün', 'light']
    },
    {
      id: 'f110',
      name: 'Labne Peyniri (Yarım Yağlı)',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 160,
      protein: 5.5,
      carbs: 4.8,
      fat: 13,
      keywords: ['labne', 'peynir', 'sürülebilir', 'krema', 'kahvaltı']
    },
    {
      id: 'f111',
      name: 'Keçi Peyniri',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 268,
      protein: 18,
      carbs: 1.5,
      fat: 21,
      keywords: ['keçi', 'peyniri', 'peynir', 'goat', 'cheese', 'doğal']
    },
    {
      id: 'f112',
      name: 'Proteinli Kakao Sütü (Spora Özel)',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 68,
      protein: 7.2,
      carbs: 8,
      fat: 0.5,
      keywords: ['protein', 'süt', 'kakaolu', 'çikolatalı', 'shaker', 'antrenman']
    },
    {
      id: 'f113',
      name: 'Yoğurt (Süzme, Light/Yağsız)',
      category: 'Süt Ürünleri',
      servingGram: 100,
      calories: 55,
      protein: 7.5,
      carbs: 4.2,
      fat: 0.1,
      keywords: ['yoğurt', 'süzme', 'yağsız', 'light', 'protein', 'diyet']
    },
    {
      id: 'f114',
      name: 'Karabuğday (Greçka - Haşlanmış)',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 120,
      protein: 4.3,
      carbs: 25,
      fat: 0.9,
      keywords: ['karabuğday', 'grecka', 'greçka', 'buckwheat', 'lif', 'glütensiz']
    },
    {
      id: 'f115',
      name: 'Basmati Pirinç (Haşlanmış)',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      keywords: ['basmati', 'pirinç', 'rice', 'diyet', 'fitness', 'pilav']
    },
    {
      id: 'f116',
      name: 'Çavdar Ekmeği',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 220,
      protein: 8.5,
      carbs: 45,
      fat: 1.8,
      keywords: ['çavdar', 'ekmek', 'rye', 'bread', 'lifli', 'diyet']
    },
    {
      id: 'f117',
      name: 'Kepekli Bisküvi (Eti Form tarzı)',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 395,
      protein: 8,
      carbs: 72,
      fat: 7,
      keywords: ['eti', 'form', 'bisküvi', 'kepekli', 'diyet', 'ara öğün']
    },
    {
      id: 'f118',
      name: 'Pirinç Patlağı (Eti Lifalif vb.)',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 382,
      protein: 8.2,
      carbs: 82,
      fat: 2.1,
      keywords: ['pirinç', 'patlağı', 'rice', 'cake', 'diyabetik', 'fıstık ezmesi']
    },
    {
      id: 'f119',
      name: 'Tam Buğday Galeta',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 360,
      protein: 11,
      carbs: 68,
      fat: 3,
      keywords: ['galeta', 'atıştırmalık', 'tam buğday', 'kahvaltı', 'diyet']
    },
    {
      id: 'f120',
      name: 'Konserve Tatlı Mısır',
      category: 'Karbonhidrat',
      servingGram: 100,
      calories: 86,
      protein: 3.2,
      carbs: 19,
      fat: 1.2,
      keywords: ['mısır', 'tatlı', 'konserve', 'pirinç', 'salata', 'corn']
    },
    {
      id: 'f121',
      name: 'Kırmızı Mercimek Yemeği',
      category: 'Bakliyat',
      servingGram: 100,
      calories: 124,
      protein: 9.2,
      carbs: 18,
      fat: 1.5,
      keywords: ['mercimek', 'kırmızı', 'lentil', 'ev yemeği', 'protein']
    },
    {
      id: 'f122',
      name: 'Barbunya Pilaki (Zeytinyağlı)',
      category: 'Bakliyat',
      servingGram: 100,
      calories: 155,
      protein: 7,
      carbs: 21,
      fat: 4.8,
      keywords: ['barbunya', 'pilaki', 'zeytinyağlı', 'soğuk', 'meze', 'bakliyat']
    },
    {
      id: 'f123',
      name: 'Bezelye Yemeği (Zeytinyağlı)',
      category: 'Bakliyat',
      servingGram: 100,
      calories: 88,
      protein: 4.2,
      carbs: 12.8,
      fat: 2.2,
      keywords: ['bezelye', 'pea', 'havuç', 'patates', 'ev yemeği', 'zeytinyağlı']
    },
    {
      id: 'f124',
      name: 'Yeşil Elma',
      category: 'Meyve',
      servingGram: 100,
      calories: 48,
      protein: 0.3,
      carbs: 12.5,
      fat: 0.1,
      keywords: ['elma', 'yeşil', 'green', 'apple', 'ekşi', 'diyet']
    },
    {
      id: 'f125',
      name: 'Kuru Kayısı (Gün Kurusu)',
      category: 'Meyve',
      servingGram: 100,
      calories: 241,
      protein: 3.4,
      carbs: 62.5,
      fat: 0.5,
      keywords: ['kayısı', 'kuru', 'gun kuru', 'tatlı', 'lif', 'bağırsak']
    },
    {
      id: 'f126',
      name: 'Kuru Üzüm',
      category: 'Meyve',
      servingGram: 100,
      calories: 299,
      protein: 3,
      carbs: 79,
      fat: 0.5,
      keywords: ['üzüm', 'kuru', 'raisin', 'tatlı', 'enerji', 'karbonhidrat']
    },
    {
      id: 'f127',
      name: 'Kuru İncir',
      category: 'Meyve',
      servingGram: 100,
      calories: 249,
      protein: 3.3,
      carbs: 63.8,
      fat: 0.9,
      keywords: ['incir', 'kuru', 'fig', 'tatlı', 'kabızlık', 'lif']
    },
    {
      id: 'f128',
      name: 'Şeftali',
      category: 'Meyve',
      servingGram: 100,
      calories: 39,
      protein: 0.9,
      carbs: 9.5,
      fat: 0.3,
      keywords: ['şeftali', 'seftali', 'peach', 'yaz', 'sulu']
    },
    {
      id: 'f129',
      name: 'Kiraz',
      category: 'Meyve',
      servingGram: 100,
      calories: 50,
      protein: 1,
      carbs: 12,
      fat: 0.3,
      keywords: ['kiraz', 'cherry', 'sapı', 'antioksidan', 'meyve']
    },
    {
      id: 'f130',
      name: 'Yeşil Erik (Can Erik)',
      category: 'Meyve',
      servingGram: 100,
      calories: 46,
      protein: 0.8,
      carbs: 11.4,
      fat: 0.3,
      keywords: ['erik', 'yeşil', 'can', 'ekşi', 'tuzlu']
    },
    {
      id: 'f131',
      name: 'Mandalina',
      category: 'Meyve',
      servingGram: 100,
      calories: 53,
      protein: 0.8,
      carbs: 13.3,
      fat: 0.3,
      keywords: ['mandalina', 'mandarin', 'c', 'vitamini', 'kış', 'meyve']
    },
    {
      id: 'f132',
      name: 'Kültür Mantarı (Pişmiş)',
      category: 'Sebze',
      servingGram: 100,
      calories: 28,
      protein: 3,
      carbs: 3.3,
      fat: 0.4,
      keywords: ['mantar', 'sote', 'mushroom', 'sebze', 'ızgara', 'hafif']
    },
    {
      id: 'f133',
      name: 'Kuşkonmaz (Fırın)',
      category: 'Sebze',
      servingGram: 100,
      calories: 20,
      protein: 2.2,
      carbs: 3.9,
      fat: 0.2,
      keywords: ['kuşkonmaz', 'asparagus', 'fitness', 'ızgara', 'diyet']
    },
    {
      id: 'f134',
      name: 'Semizotu (Taze)',
      category: 'Sebze',
      servingGram: 100,
      calories: 16,
      protein: 1.3,
      carbs: 3.4,
      fat: 0.1,
      keywords: ['semizotu', 'yeşillik', 'salata', 'yoğurtlu', 'omega3']
    },
    {
      id: 'f135',
      name: 'Közlenmiş Patlıcan Konservesi',
      category: 'Sebze',
      servingGram: 100,
      calories: 25,
      protein: 1,
      carbs: 5.5,
      fat: 0.2,
      keywords: ['patlıcan', 'közleme', 'salata', 'babağanuş', 'yoğurtlu']
    },
    {
      id: 'f136',
      name: 'Zeytinyağlı Enginar Yemeği',
      category: 'Sebze',
      servingGram: 100,
      calories: 98,
      protein: 3.2,
      carbs: 11.5,
      fat: 4.5,
      keywords: ['enginar', 'karaciğer', 'zeytinyağlı', 'garnitür', 'sağlıklı']
    },
    {
      id: 'f137',
      name: 'Antep Fıstığı (Kavrulmuş)',
      category: 'Kuruyemiş',
      servingGram: 100,
      calories: 562,
      protein: 20.2,
      carbs: 27.5,
      fat: 45.3,
      keywords: ['antep', 'fıstığı', 'kuruyemiş', 'kabuklu', 'lezzetli']
    },
    {
      id: 'f138',
      name: 'Çiğ Kaju',
      category: 'Kuruyemiş',
      servingGram: 100,
      calories: 553,
      protein: 18.2,
      carbs: 30.1,
      fat: 43.8,
      keywords: ['kaju', 'cashew', 'çiğ', 'kuruyemiş', 'sağlıklı', 'yağ']
    },
    {
      id: 'f139',
      name: 'Domates Çorbası (Kaşarlı)',
      category: 'Çorba',
      servingGram: 100,
      calories: 65,
      protein: 2.2,
      carbs: 8.5,
      fat: 2.5,
      keywords: ['domates', 'çorbası', 'corba', 'soup', 'kaşar']
    },
    {
      id: 'f140',
      name: 'Yayla Çorbası',
      category: 'Çorba',
      servingGram: 100,
      calories: 78,
      protein: 2.8,
      carbs: 11,
      fat: 2.4,
      keywords: ['yayla', 'çorbası', 'corba', 'yoğurtlu', 'pirinç', 'nane']
    },
    {
      id: 'f141',
      name: 'Adana Kebap (Sade Et Porsiyon)',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 265,
      protein: 18.5,
      carbs: 0.5,
      fat: 21,
      keywords: ['adana', 'kebap', 'kıyma', 'kuzu', 'ızgara', 'protein']
    },
    {
      id: 'f142',
      name: 'Dana Tas Kebabı',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 175,
      protein: 17.2,
      carbs: 4.5,
      fat: 9.8,
      keywords: ['tas', 'kebabı', 'dana', 'etli', 'sululu', 'akşam yemeği']
    },
    {
      id: 'f143',
      name: 'Etli Kuru Fasulye',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 154,
      protein: 9.8,
      carbs: 18.5,
      fat: 4.9,
      keywords: ['kuru', 'fasulye', 'etli', 'dana', 'bakliyat', 'türk yemeği']
    },
    {
      id: 'f144',
      name: 'Mantı (Kıymalı, Yoğurt ve Soslu)',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 245,
      protein: 8.5,
      carbs: 34,
      fat: 8.5,
      keywords: ['mantı', 'yoğurt', 'sarımsak', 'kıyma', 'soslu', 'hamur']
    },
    {
      id: 'f145',
      name: 'Çiğ Köfte (Etsiz, Soslu)',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 185,
      protein: 4.8,
      carbs: 32,
      fat: 4,
      keywords: ['çiğ', 'köfte', 'etsiz', 'dürüm', 'marul', 'nar ekşisi', 'vejetaryen']
    },
    {
      id: 'f146',
      name: 'Menemen (Peynirli, Zeytinyağlı)',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 135,
      protein: 7.8,
      carbs: 4.5,
      fat: 9.5,
      keywords: ['menemen', 'yumurta', 'peynir', 'domates', 'biber', 'kahvaltı']
    },
    {
      id: 'f147',
      name: 'Tavuklu Bulgur Pilavı',
      category: 'Türk Yemekleri',
      servingGram: 100,
      calories: 178,
      protein: 11.2,
      carbs: 24,
      fat: 4,
      keywords: ['tavuklu', 'bulgur', 'pilav', 'sporcu', 'fitness', 'protein']
    },
    {
      id: 'f148',
      name: 'Dana Kasap Sucuk',
      category: 'Kahvaltılık',
      servingGram: 100,
      calories: 340,
      protein: 16,
      carbs: 1.5,
      fat: 30,
      keywords: ['sucuk', 'dana', 'baharatlı', 'ızgara', 'tava', 'kahvaltı']
    },
    {
      id: 'f149',
      name: 'Dana Pastırma (Çemensiz/Yağsız)',
      category: 'Kahvaltılık',
      servingGram: 100,
      calories: 198,
      protein: 30,
      carbs: 1,
      fat: 8.2,
      keywords: ['pastırma', 'pastirma', 'çemensiz', 'kuru et', 'kahvaltı', 'protein']
    },
    {
      id: 'f150',
      name: 'Vişne Reçeli',
      category: 'Kahvaltılık',
      servingGram: 100,
      calories: 275,
      protein: 0.3,
      carbs: 68,
      fat: 0,
      keywords: ['reçel', 'recel', 'vişne', 'visne', 'şekerli', 'kahvaltı']
    }
  ];
  