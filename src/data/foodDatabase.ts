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
  {
    "id": "f1",
    "name": "Tavuk Göğsü (Pişmiş)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fat": 3.6,
    "keywords": [
      "tavuk",
      "göğüs",
      "chicken",
      "breast",
      "protein",
      "haşlama",
      "ızgara"
    ]
  },
  {
    "id": "f2",
    "name": "Tavuk But (Izgara, Derisiz)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 180,
    "protein": 26,
    "carbs": 0,
    "fat": 9,
    "keywords": [
      "tavuk",
      "but",
      "baget",
      "chicken",
      "thigh",
      "kırmızı et"
    ]
  },
  {
    "id": "f3",
    "name": "Hindi Göğsü (Pişmiş)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 135,
    "protein": 30,
    "carbs": 0,
    "fat": 1.5,
    "keywords": [
      "hindi",
      "göğüs",
      "turkey",
      "breast",
      "protein",
      "diyet",
      "fırın"
    ]
  },
  {
    "id": "f4",
    "name": "Dana Eti (Izgara, Yağsız)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 220,
    "protein": 28,
    "carbs": 0,
    "fat": 11,
    "keywords": [
      "dana",
      "eti",
      "kırmızı",
      "beef",
      "steak",
      "antrikot",
      "bonfile",
      "ızgara"
    ]
  },
  {
    "id": "f5",
    "name": "Dana Kıyma (Az Yağlı %10)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 200,
    "protein": 26,
    "carbs": 0,
    "fat": 10,
    "keywords": [
      "kıyma",
      "dana",
      "mutton",
      "kofte",
      "kıyma",
      "kıyma",
      "protein"
    ]
  },
  {
    "id": "f6",
    "name": "Izgara Köfte",
    "category": "Protein",
    "servingGram": 100,
    "calories": 230,
    "protein": 22,
    "carbs": 4,
    "fat": 14,
    "keywords": [
      "köfte",
      "kofte",
      "ızgara",
      "meatball",
      "dana",
      "protein"
    ]
  },
  {
    "id": "f7",
    "name": "Ton Balığı Konservesi (Yağ süzülmüş)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 130,
    "protein": 28,
    "carbs": 0,
    "fat": 1.5,
    "keywords": [
      "ton",
      "balığı",
      "tuna",
      "konserve",
      "balık",
      "fish",
      "diyet",
      "salata"
    ]
  },
  {
    "id": "f8",
    "name": "Somon Balığı (Fırın)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 206,
    "protein": 22,
    "carbs": 0,
    "fat": 12,
    "keywords": [
      "somon",
      "salmon",
      "balık",
      "fish",
      "omega",
      "yağlı",
      "fırın"
    ]
  },
  {
    "id": "f9",
    "name": "Levrek (Izgara)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 125,
    "protein": 24,
    "carbs": 0,
    "fat": 3,
    "keywords": [
      "levrek",
      "seabass",
      "balık",
      "fish",
      "hafif",
      "ızgara"
    ]
  },
  {
    "id": "f10",
    "name": "Haşlanmış Yumurta",
    "category": "Protein",
    "servingGram": 100,
    "calories": 155,
    "protein": 13,
    "carbs": 1.1,
    "fat": 11,
    "keywords": [
      "yumurta",
      "egg",
      "haslanmis",
      "haşlama",
      "kahvaltı",
      "protein"
    ]
  },
  {
    "id": "f11",
    "name": "Yumurta Beyazı",
    "category": "Protein",
    "servingGram": 100,
    "calories": 52,
    "protein": 11,
    "carbs": 0.7,
    "fat": 0.2,
    "keywords": [
      "yumurta",
      "beyazı",
      "white",
      "egg",
      "saf",
      "protein",
      "diyet",
      "omlet"
    ]
  },
  {
    "id": "f12",
    "name": "Lor Peyniri (Yağsız)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 85,
    "protein": 17,
    "carbs": 2.5,
    "fat": 0.5,
    "keywords": [
      "lor",
      "peyniri",
      "cottage",
      "cheese",
      "peynir",
      "sporcu",
      "yağsız"
    ]
  },
  {
    "id": "f13",
    "name": "Tam Yağlı Beyaz Peynir",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 260,
    "protein": 15,
    "carbs": 2,
    "fat": 21,
    "keywords": [
      "beyaz",
      "peynir",
      "cheese",
      "feta",
      "kahvaltı",
      "klasik"
    ]
  },
  {
    "id": "f14",
    "name": "Taze Kaşar Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 350,
    "protein": 25,
    "carbs": 1.5,
    "fat": 27,
    "keywords": [
      "kaşar",
      "peyniri",
      "tost",
      "peynir",
      "yellow",
      "cheese",
      "kashar"
    ]
  },
  {
    "id": "f15",
    "name": "Yarım Yağlı Yoğurt",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 60,
    "protein": 3.5,
    "carbs": 4.7,
    "fat": 3,
    "keywords": [
      "yoğurt",
      "yogurt",
      "süt",
      "sade",
      "ev yoğurdu"
    ]
  },
  {
    "id": "f16",
    "name": "Süzme Yoğurt",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 115,
    "protein": 8,
    "carbs": 4,
    "fat": 7.5,
    "keywords": [
      "süzme",
      "yoğurt",
      "yogurt",
      "koyu",
      "protein",
      "meze"
    ]
  },
  {
    "id": "f17",
    "name": "Yayık Ayranı",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 38,
    "protein": 2,
    "carbs": 2.8,
    "fat": 1.8,
    "keywords": [
      "ayran",
      "yoghurt",
      "drink",
      "tuzlu",
      "soğuk",
      "içecek"
    ]
  },
  {
    "id": "f18",
    "name": "Yarım Yağlı Süt (%1.5)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 47,
    "protein": 3.1,
    "carbs": 4.8,
    "fat": 1.5,
    "keywords": [
      "süt",
      "milk",
      "yarım",
      "yağlı",
      "kahve"
    ]
  },
  {
    "id": "f19",
    "name": "Sade Kefir",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 55,
    "protein": 3.2,
    "carbs": 4.5,
    "fat": 2.5,
    "keywords": [
      "kefir",
      "prebiyotik",
      "bağırsak",
      "süt",
      "içecek"
    ]
  },
  {
    "id": "f20",
    "name": "Beyaz Pirinç Pilavı",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 160,
    "protein": 2.5,
    "carbs": 34,
    "fat": 1.5,
    "keywords": [
      "pirinç",
      "pilavı",
      "pilav",
      "rice",
      "beyaz",
      "enerji"
    ]
  },
  {
    "id": "f21",
    "name": "Haşlanmış Esmer Pirinç",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 111,
    "protein": 2.6,
    "carbs": 23,
    "fat": 0.9,
    "keywords": [
      "esmer",
      "pirinç",
      "brown",
      "rice",
      "diyet",
      "lif",
      "haşlama"
    ]
  },
  {
    "id": "f22",
    "name": "Bulgur Pilavı",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 150,
    "protein": 4,
    "carbs": 28,
    "fat": 2,
    "keywords": [
      "bulgur",
      "pilavı",
      "pilav",
      "wheat",
      "lif",
      "tok",
      "tutan"
    ]
  },
  {
    "id": "f23",
    "name": "Haşlanmış Makarna",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 131,
    "protein": 5,
    "carbs": 25,
    "fat": 1.1,
    "keywords": [
      "makarna",
      "pasta",
      "haşlanmış",
      "spagetti",
      "italyan"
    ]
  },
  {
    "id": "f24",
    "name": "Tam Buğday Makarna (Haşlanmış)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 124,
    "protein": 5.3,
    "carbs": 24,
    "fat": 1,
    "keywords": [
      "tam",
      "buğday",
      "makarna",
      "whole",
      "wheat",
      "pasta",
      "diyet"
    ]
  },
  {
    "id": "f25",
    "name": "Beyaz Ekmek",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 265,
    "protein": 9,
    "carbs": 49,
    "fat": 3.2,
    "keywords": [
      "beyaz",
      "ekmek",
      "bread",
      "un",
      "fırın",
      "dilim"
    ]
  },
  {
    "id": "f26",
    "name": "Tam Buğday Ekmeği",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 247,
    "protein": 12,
    "carbs": 41,
    "fat": 3.4,
    "keywords": [
      "tam",
      "buğday",
      "ekmeği",
      "bread",
      "lifli",
      "diyet",
      "kepek"
    ]
  },
  {
    "id": "f27",
    "name": "Lavaş Ekmek",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 290,
    "protein": 8,
    "carbs": 55,
    "fat": 4,
    "keywords": [
      "lavaş",
      "lavas",
      "tortilla",
      "dürüm",
      "kebap",
      "ekmek"
    ]
  },
  {
    "id": "f28",
    "name": "Yulaf Ezmesi",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 389,
    "protein": 16.9,
    "carbs": 66,
    "fat": 6.9,
    "keywords": [
      "yulaf",
      "ezmesi",
      "oat",
      "oatmeal",
      "kahvaltı",
      "sporcu",
      "lif"
    ]
  },
  {
    "id": "f29",
    "name": "Haşlanmış Patates",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 87,
    "protein": 1.9,
    "carbs": 20,
    "fat": 0.1,
    "keywords": [
      "patates",
      "potato",
      "haşlanmış",
      "haşlama",
      "püre",
      "nişasta"
    ]
  },
  {
    "id": "f30",
    "name": "Tatlı Patates (Fırın)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 103,
    "protein": 2,
    "carbs": 24,
    "fat": 0.2,
    "keywords": [
      "tatlı",
      "patates",
      "sweet",
      "potato",
      "potasyum",
      "fırın"
    ]
  },
  {
    "id": "f31",
    "name": "Yeşil Mercimekli Haşlama",
    "category": "Bakliyat",
    "servingGram": 100,
    "calories": 116,
    "protein": 9,
    "carbs": 20,
    "fat": 0.4,
    "keywords": [
      "yeşil",
      "mercimek",
      "lentil",
      "protein",
      "bakliyat",
      "diyet"
    ]
  },
  {
    "id": "f32",
    "name": "Haşlanmış Nohut",
    "category": "Bakliyat",
    "servingGram": 100,
    "calories": 164,
    "protein": 8.9,
    "carbs": 27,
    "fat": 2.6,
    "keywords": [
      "nohut",
      "chickpea",
      "humus",
      "haşlama",
      "bakliyat"
    ]
  },
  {
    "id": "f33",
    "name": "Kuru Fasulye (Yağsız Haşlanmış)",
    "category": "Bakliyat",
    "servingGram": 100,
    "calories": 139,
    "protein": 9.7,
    "carbs": 25,
    "fat": 0.5,
    "keywords": [
      "kuru",
      "fasulye",
      "bean",
      "piyaz",
      "bakliyat"
    ]
  },
  {
    "id": "f34",
    "name": "Haşlanmış Barbunya",
    "category": "Bakliyat",
    "servingGram": 100,
    "calories": 143,
    "protein": 9.2,
    "carbs": 26,
    "fat": 0.8,
    "keywords": [
      "barbunya",
      "kidney",
      "beans",
      "zeytinyağlı",
      "bakliyat"
    ]
  },
  {
    "id": "f35",
    "name": "Muz",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 89,
    "protein": 1.1,
    "carbs": 22.8,
    "fat": 0.3,
    "keywords": [
      "muz",
      "banana",
      "potasyum",
      "antrenman",
      "öncesi",
      "meyve"
    ]
  },
  {
    "id": "f36",
    "name": "Kırmızı Elma",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 52,
    "protein": 0.3,
    "carbs": 13.8,
    "fat": 0.2,
    "keywords": [
      "elma",
      "apple",
      "yeşil elma",
      "lif",
      "meyve"
    ]
  },
  {
    "id": "f37",
    "name": "Portakal",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 47,
    "protein": 0.9,
    "carbs": 11.8,
    "fat": 0.1,
    "keywords": [
      "portakal",
      "orange",
      "c",
      "vitamini",
      "narenciye",
      "meyve"
    ]
  },
  {
    "id": "f38",
    "name": "Çilek",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 32,
    "protein": 0.7,
    "carbs": 7.7,
    "fat": 0.3,
    "keywords": [
      "çilek",
      "cilek",
      "strawberry",
      "antioksidan",
      "hafif",
      "meyve"
    ]
  },
  {
    "id": "f39",
    "name": "Üzüm (Taze)",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 69,
    "protein": 0.7,
    "carbs": 18,
    "fat": 0.2,
    "keywords": [
      "üzüm",
      "uzum",
      "grape",
      "tatlı",
      "früktoz",
      "meyve"
    ]
  },
  {
    "id": "f40",
    "name": "Avokado",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 160,
    "protein": 2,
    "carbs": 8.5,
    "fat": 14.7,
    "keywords": [
      "avokado",
      "avocado",
      "sağlıklı",
      "yağ",
      "salata",
      "kahvaltı"
    ]
  },
  {
    "id": "f41",
    "name": "Armut",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 57,
    "protein": 0.4,
    "carbs": 15,
    "fat": 0.1,
    "keywords": [
      "armut",
      "pear",
      "sulu",
      "lifli",
      "meyve"
    ]
  },
  {
    "id": "f42",
    "name": "Karpuz",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 30,
    "protein": 0.6,
    "carbs": 7.6,
    "fat": 0.2,
    "keywords": [
      "karpuz",
      "watermelon",
      "yaz",
      "serin",
      "su",
      "meyve"
    ]
  },
  {
    "id": "f43",
    "name": "Kavun",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 34,
    "protein": 0.8,
    "carbs": 8.2,
    "fat": 0.2,
    "keywords": [
      "kavun",
      "melon",
      "yaz",
      "meyve",
      "tatlı"
    ]
  },
  {
    "id": "f44",
    "name": "Taze Domates",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 18,
    "protein": 0.9,
    "carbs": 3.9,
    "fat": 0.2,
    "keywords": [
      "domates",
      "tomato",
      "menemen",
      "salata",
      "sebze"
    ]
  },
  {
    "id": "f45",
    "name": "Salatalık (Kabuklu)",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 15,
    "protein": 0.7,
    "carbs": 3.6,
    "fat": 0.1,
    "keywords": [
      "salatalık",
      "salatalik",
      "cucumber",
      "diyet",
      "salata",
      "su",
      "sebze"
    ]
  },
  {
    "id": "f46",
    "name": "Kıvırcık Marul",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 15,
    "protein": 1.4,
    "carbs": 2.9,
    "fat": 0.2,
    "keywords": [
      "marul",
      "kıvırcık",
      "lettuce",
      "yeşillik",
      "salata",
      "sebze"
    ]
  },
  {
    "id": "f47",
    "name": "Haşlanmış Brokoli",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 35,
    "protein": 2.4,
    "carbs": 7,
    "fat": 0.4,
    "keywords": [
      "brokoli",
      "broccoli",
      "fitness",
      "haşlama",
      "yeşil",
      "diyet",
      "sebze"
    ]
  },
  {
    "id": "f48",
    "name": "Zeytinyağlı Ispanak Yemek",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 65,
    "protein": 2,
    "carbs": 4.5,
    "fat": 4.8,
    "keywords": [
      "ıspanak",
      "ispanak",
      "spinach",
      "demir",
      "sebze",
      "ev yemeği"
    ]
  },
  {
    "id": "f49",
    "name": "Fırınlanmış Kabak Mücver",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 95,
    "protein": 4,
    "carbs": 8,
    "fat": 5,
    "keywords": [
      "kabak",
      "mücver",
      "zucchini",
      "fırın",
      "diyet",
      "sebze"
    ]
  },
  {
    "id": "f50",
    "name": "Taze Havuç",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 41,
    "protein": 0.9,
    "carbs": 9.6,
    "fat": 0.2,
    "keywords": [
      "havuç",
      "havuc",
      "carrot",
      "göz",
      "a",
      "vitamini",
      "sebze"
    ]
  },
  {
    "id": "f51",
    "name": "Kırmızı Biber (Kapya)",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 31,
    "protein": 1,
    "carbs": 6,
    "fat": 0.3,
    "keywords": [
      "biber",
      "kapya",
      "kırmızı",
      "pepper",
      "c vitamini",
      "sebze"
    ]
  },
  {
    "id": "f52",
    "name": "Zeytinyağı (Ekstra Sızma)",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "zeytinyağı",
      "olive",
      "oil",
      "sızma",
      "sağlıklı",
      "yağ"
    ]
  },
  {
    "id": "f53",
    "name": "Eritilmiş Tereyağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 717,
    "protein": 0.9,
    "carbs": 0.1,
    "fat": 81,
    "keywords": [
      "tereyağı",
      "tereyag",
      "butter",
      "hayvansal",
      "yağ"
    ]
  },
  {
    "id": "f54",
    "name": "Fıstık Ezmesi (Sade, Katkısız)",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 588,
    "protein": 25,
    "carbs": 20,
    "fat": 50,
    "keywords": [
      "fıstık",
      "ezmesi",
      "peanut",
      "butter",
      "sporcu",
      "hacim",
      "bulking"
    ]
  },
  {
    "id": "f55",
    "name": "Çiğ Badem",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 579,
    "protein": 21,
    "carbs": 22,
    "fat": 49,
    "keywords": [
      "badem",
      "almond",
      "çiğ",
      "kuruyemiş",
      "sağlıklı",
      "yağ",
      "ara öğün"
    ]
  },
  {
    "id": "f56",
    "name": "Ceviz İçi",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 654,
    "protein": 15,
    "carbs": 14,
    "fat": 65,
    "keywords": [
      "ceviz",
      "walnut",
      "omega3",
      "beyin",
      "kuruyemiş",
      "yağ"
    ]
  },
  {
    "id": "f57",
    "name": "Çiğ Fındık",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 628,
    "protein": 15,
    "carbs": 17,
    "fat": 61,
    "keywords": [
      "fındık",
      "hazelnut",
      "çiğ",
      "kuruyemiş",
      "enerji"
    ]
  },
  {
    "id": "f58",
    "name": "Sarı Leblebi",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 368,
    "protein": 19,
    "carbs": 58,
    "fat": 5,
    "keywords": [
      "leblebi",
      "nohut",
      "sarı",
      "ara öğün",
      "lifli",
      "mide",
      "bastıran"
    ]
  },
  {
    "id": "f59",
    "name": "Süzme Mercimek Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 85,
    "protein": 4.8,
    "carbs": 13,
    "fat": 1.5,
    "keywords": [
      "mercimek",
      "çorbası",
      "corba",
      "soup",
      "başlangıç",
      "bakliyat"
    ]
  },
  {
    "id": "f60",
    "name": "Ezogelin Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 90,
    "protein": 4.5,
    "carbs": 14,
    "fat": 2,
    "keywords": [
      "ezogelin",
      "çorbası",
      "corba",
      "soup",
      "başlangıç",
      "bulgur"
    ]
  },
  {
    "id": "f61",
    "name": "Tavuk Suyu Çorba",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 75,
    "protein": 6.2,
    "carbs": 5,
    "fat": 3,
    "keywords": [
      "tavuk",
      "suyu",
      "çorbası",
      "corba",
      "chicken",
      "soup",
      "şifa"
    ]
  },
  {
    "id": "f62",
    "name": "Tavuk Döner (Lavaş Dürüm)",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 215,
    "protein": 16,
    "carbs": 23,
    "fat": 6.5,
    "keywords": [
      "tavuk",
      "döner",
      "durum",
      "dürüm",
      "doner",
      "wrap",
      "fast food"
    ]
  },
  {
    "id": "f63",
    "name": "Et Döner (Lavaş Dürüm)",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 240,
    "protein": 18,
    "carbs": 22,
    "fat": 9,
    "keywords": [
      "et",
      "döner",
      "dürüm",
      "durum",
      "doner",
      "beef",
      "wrap",
      "kebap"
    ]
  },
  {
    "id": "f64",
    "name": "Lahmacun (Tek adet)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 220,
    "protein": 9.5,
    "carbs": 28,
    "fat": 7.7,
    "keywords": [
      "lahmacun",
      "pide",
      "kıyma",
      "turkish",
      "pizza",
      "fast food"
    ]
  },
  {
    "id": "f65",
    "name": "Karışık Pizza (Orta Boy Dilim)",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 266,
    "protein": 11,
    "carbs": 30,
    "fat": 11,
    "keywords": [
      "pizza",
      "karışık",
      "sucuk",
      "fast food",
      "cheat"
    ]
  },
  {
    "id": "f66",
    "name": "Klasik Hamburger",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 295,
    "protein": 14,
    "carbs": 28,
    "fat": 14,
    "keywords": [
      "hamburger",
      "burger",
      "fast food",
      "burger köftesi",
      "cheat"
    ]
  },
  {
    "id": "f67",
    "name": "Patates Kızartması",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 312,
    "protein": 3.4,
    "carbs": 41,
    "fat": 15,
    "keywords": [
      "patates",
      "kızartması",
      "french",
      "fries",
      "kızarmış",
      "fast food"
    ]
  },
  {
    "id": "f68",
    "name": "Sokak Simiti",
    "category": "Kahvaltılık",
    "servingGram": 100,
    "calories": 275,
    "protein": 8,
    "carbs": 58,
    "fat": 3.5,
    "keywords": [
      "simit",
      "susam",
      "kahvaltı",
      "pastane",
      "fırın"
    ]
  },
  {
    "id": "f69",
    "name": "Peynirli Poğaça",
    "category": "Kahvaltılık",
    "servingGram": 100,
    "calories": 360,
    "protein": 8.5,
    "carbs": 42,
    "fat": 18,
    "keywords": [
      "poğaça",
      "pogaca",
      "peynirli",
      "pastane",
      "yağlı",
      "kahvaltı"
    ]
  },
  {
    "id": "f70",
    "name": "Kıymalı Kol Böreği",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 330,
    "protein": 10,
    "carbs": 36,
    "fat": 16,
    "keywords": [
      "börek",
      "borek",
      "kıymalı",
      "yufka",
      "pastane"
    ]
  },
  {
    "id": "f71",
    "name": "Cevizli Baklava",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 410,
    "protein": 4.5,
    "carbs": 55,
    "fat": 19,
    "keywords": [
      "baklava",
      "tatlı",
      "serbetli",
      "fıstıklı",
      "cevizli",
      "cheat"
    ]
  },
  {
    "id": "f72",
    "name": "Fırın Sütlaç",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 140,
    "protein": 3.5,
    "carbs": 23,
    "fat": 3.8,
    "keywords": [
      "sütlaç",
      "sutlac",
      "sütlü",
      "tatlı",
      "fırın",
      "pirinç"
    ]
  },
  {
    "id": "f73",
    "name": "Kazandibi",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 165,
    "protein": 4,
    "carbs": 31,
    "fat": 3,
    "keywords": [
      "kazandibi",
      "tatlı",
      "sütlü",
      "geleneksel"
    ]
  },
  {
    "id": "f74",
    "name": "İçme Suyu",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "su",
      "içme",
      "water",
      "sıvı",
      "hydration"
    ]
  },
  {
    "id": "f75",
    "name": "Sade Doğal Maden Suyu",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "mineral",
      "soda",
      "maden",
      "suyu",
      "sparkling",
      "magnezyum"
    ]
  },
  {
    "id": "f76",
    "name": "Pepsi Zero / Coca Cola Zero",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "cola",
      "zero",
      "diyet",
      "asitli",
      "pepsi",
      "şekersiz",
      "seker"
    ]
  },
  {
    "id": "f77",
    "name": "Sade Türk Kahvesi",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 2,
    "protein": 0.1,
    "carbs": 0.2,
    "fat": 0.1,
    "keywords": [
      "kahve",
      "türk",
      "turk",
      "kafein",
      "sade",
      "preworkout"
    ]
  },
  {
    "id": "f78",
    "name": "Sade Filtre Kahve",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 2,
    "protein": 0.1,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "filtre",
      "kahve",
      "filter",
      "coffee",
      "black",
      "kafein"
    ]
  },
  {
    "id": "f79",
    "name": "Şekersiz Siyah Çay (Cam demleme)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 1,
    "protein": 0,
    "carbs": 0.2,
    "fat": 0,
    "keywords": [
      "çay",
      "cay",
      "tea",
      "demleme",
      "şekersiz"
    ]
  },
  {
    "id": "f80",
    "name": "Karışık Meyve Suyu",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 45,
    "protein": 0.4,
    "carbs": 11,
    "fat": 0.1,
    "keywords": [
      "meyve",
      "suyu",
      "portakal",
      "juice",
      "şekerli",
      "sakkaroz"
    ]
  },
  {
    "id": "f81",
    "name": "Soya Sütü",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 54,
    "protein": 3.3,
    "carbs": 6,
    "fat": 1.8,
    "keywords": [
      "soya",
      "sütü",
      "soy",
      "milk",
      "vegan",
      "bitkisel"
    ]
  },
  {
    "id": "f82",
    "name": "Badem Sütü (Şekersiz)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 15,
    "protein": 0.5,
    "carbs": 0.3,
    "fat": 1.1,
    "keywords": [
      "badem",
      "sütü",
      "almond",
      "milk",
      "vegan",
      "şekersiz"
    ]
  },
  {
    "id": "f83",
    "name": "Whey Protein Tozu (Suda karışım)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 390,
    "protein": 78,
    "carbs": 5,
    "fat": 4,
    "keywords": [
      "protein",
      "tozu",
      "whey",
      "izole",
      "supplement",
      "sporcu"
    ]
  },
  {
    "id": "f84",
    "name": "Kreatin Monohidrat",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "kreatin",
      "creatine",
      "güç",
      "supplement"
    ]
  },
  {
    "id": "f85",
    "name": "BCAA Suda Çözünen",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "bcaa",
      "aminoasit",
      "supplement",
      "kas"
    ]
  },
  {
    "id": "f86",
    "name": "Yulaf Unu",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 380,
    "protein": 13,
    "carbs": 68,
    "fat": 6.5,
    "keywords": [
      "yulaf",
      "unu",
      "un",
      "oat",
      "flour",
      "pancake",
      "tarif"
    ]
  },
  {
    "id": "f87",
    "name": "Tarhana Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 110,
    "protein": 3.5,
    "carbs": 16,
    "fat": 3,
    "keywords": [
      "tarhana",
      "çorbası",
      "corba",
      "geleneksel"
    ]
  },
  {
    "id": "f88",
    "name": "İmambayıldı (Zeytinyağlı)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 120,
    "protein": 1.5,
    "carbs": 8,
    "fat": 9,
    "keywords": [
      "patlıcan",
      "biber",
      "imambayıldı",
      "zeytinyağlı",
      "ev yemeği"
    ]
  },
  {
    "id": "f89",
    "name": "Karnıyarık (Kıymalı)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 180,
    "protein": 7,
    "carbs": 6,
    "fat": 14,
    "keywords": [
      "karnıyarık",
      "patlıcan",
      "kıyma",
      "kızartma",
      "akşam yemeği"
    ]
  },
  {
    "id": "f90",
    "name": "Zeytinyağlı Yaprak Sarması",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 160,
    "protein": 2.2,
    "carbs": 26,
    "fat": 5.5,
    "keywords": [
      "sarma",
      "yaprak",
      "pirinç",
      "zeytinyağlı",
      "meze"
    ]
  },
  {
    "id": "f91",
    "name": "Humus",
    "category": "Bakliyat",
    "servingGram": 100,
    "calories": 166,
    "protein": 7.9,
    "carbs": 14,
    "fat": 9.6,
    "keywords": [
      "humus",
      "nohut",
      "tahin",
      "meze",
      "sağlıklı",
      "yağ"
    ]
  },
  {
    "id": "f92",
    "name": "Tahin Pekmez Karışımı",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 460,
    "protein": 8,
    "carbs": 52,
    "fat": 25,
    "keywords": [
      "tahin",
      "pekmez",
      "enerji",
      "kahvaltı",
      "tatlı"
    ]
  },
  {
    "id": "f93",
    "name": "Tahin",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 595,
    "protein": 17,
    "carbs": 21,
    "fat": 54,
    "keywords": [
      "tahin",
      "susam",
      "susame",
      "yağ",
      "kalorili"
    ]
  },
  {
    "id": "f94",
    "name": "Süzme Çiçek Balı",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 304,
    "protein": 0.3,
    "carbs": 82,
    "fat": 0,
    "keywords": [
      "bal",
      "honey",
      "tatlandırıcı",
      "doğal",
      "kahvaltı"
    ]
  },
  {
    "id": "f95",
    "name": "Çilek Reçeli",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 278,
    "protein": 0.4,
    "carbs": 68,
    "fat": 0.1,
    "keywords": [
      "reçel",
      "recel",
      "çilek",
      "kahvaltı",
      "şekerli"
    ]
  },
  {
    "id": "f96",
    "name": "Kinoa (Haşlanmış)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 120,
    "protein": 4.4,
    "carbs": 21,
    "fat": 1.9,
    "keywords": [
      "kinoa",
      "quinoa",
      "proteinli",
      "salata",
      "glütensiz"
    ]
  },
  {
    "id": "f97",
    "name": "Chia Tohumu",
    "category": "Superfood",
    "servingGram": 100,
    "calories": 486,
    "protein": 16.5,
    "carbs": 42,
    "fat": 30.7,
    "keywords": [
      "chia",
      "tohumu",
      "puding",
      "lif",
      "omega3"
    ]
  },
  {
    "id": "f98",
    "name": "Speras (Kabak Çekirdeği)",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 559,
    "protein": 30,
    "carbs": 10,
    "fat": 49,
    "keywords": [
      "kabak",
      "çekirdeği",
      "kuruyemiş",
      "çinko",
      "magnezyum"
    ]
  },
  {
    "id": "f99",
    "name": "Yeşil Zeytin",
    "category": "Kahvaltılık",
    "servingGram": 100,
    "calories": 115,
    "protein": 0.8,
    "carbs": 6.3,
    "fat": 10.7,
    "keywords": [
      "zeytin",
      "yeşil",
      "kahvaltı",
      "tuzlu"
    ]
  },
  {
    "id": "f100",
    "name": "Siyah Zeytin",
    "category": "Kahvaltılık",
    "servingGram": 100,
    "calories": 145,
    "protein": 1.2,
    "carbs": 3.5,
    "fat": 15.3,
    "keywords": [
      "zeytin",
      "siyah",
      "kahvaltı",
      "yağlı"
    ]
  },
  {
    "id": "f101",
    "name": "Tavuk Pirzola (Pişmiş, Derisiz)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 185,
    "protein": 24.5,
    "carbs": 0,
    "fat": 9.8,
    "keywords": [
      "tavuk",
      "pirzola",
      "chicken",
      "ızgara",
      "protein",
      "yağlı"
    ]
  },
  {
    "id": "f102",
    "name": "Kuzu Eti (Izgara, Yağsız)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 226,
    "protein": 27,
    "carbs": 0,
    "fat": 12.5,
    "keywords": [
      "kuzu",
      "eti",
      "lamb",
      "ızgara",
      "protein",
      "kırmızı et"
    ]
  },
  {
    "id": "f103",
    "name": "Hindi Füme Dilim",
    "category": "Protein",
    "servingGram": 100,
    "calories": 104,
    "protein": 16.5,
    "carbs": 1.5,
    "fat": 3.5,
    "keywords": [
      "hindi",
      "füme",
      "smoked",
      "turkey",
      "dilim",
      "sandviç",
      "protein"
    ]
  },
  {
    "id": "f104",
    "name": "Sardalya (Konserve, süzülmüş yağ)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 208,
    "protein": 25,
    "carbs": 0,
    "fat": 11.5,
    "keywords": [
      "sardalya",
      "balık",
      "fish",
      "konserve",
      "omega3",
      "kalsiyum"
    ]
  },
  {
    "id": "f105",
    "name": "Karides (Haşlanmış)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 99,
    "protein": 24,
    "carbs": 0.2,
    "fat": 0.3,
    "keywords": [
      "karides",
      "shrimp",
      "prawn",
      "deniz ürünü",
      "haşlama",
      "protein"
    ]
  },
  {
    "id": "f106",
    "name": "Dana Bonfile (Pişmiş)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 189,
    "protein": 29,
    "carbs": 0,
    "fat": 8,
    "keywords": [
      "bonfile",
      "dana",
      "kırmızı",
      "beef",
      "steak",
      "yağsız",
      "protein"
    ]
  },
  {
    "id": "f107",
    "name": "Çipura (Izgara)",
    "category": "Protein",
    "servingGram": 100,
    "calories": 135,
    "protein": 22.5,
    "carbs": 0,
    "fat": 4.9,
    "keywords": [
      "çipura",
      "cipura",
      "balık",
      "fish",
      "ızgara",
      "deniz",
      "protein"
    ]
  },
  {
    "id": "f108",
    "name": "Süzme Peynir",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 195,
    "protein": 11.5,
    "carbs": 2.5,
    "fat": 15,
    "keywords": [
      "süzme",
      "peynir",
      "kahvaltı",
      "yumuşak",
      "tuzsuz"
    ]
  },
  {
    "id": "f109",
    "name": "Quark (Sade, Yüksek Proteinli)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 65,
    "protein": 10,
    "carbs": 4,
    "fat": 0.2,
    "keywords": [
      "quark",
      "yoğurt",
      "peynir",
      "yüksek",
      "protein",
      "ara öğün",
      "light"
    ]
  },
  {
    "id": "f110",
    "name": "Labne Peyniri (Yarım Yağlı)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 160,
    "protein": 5.5,
    "carbs": 4.8,
    "fat": 13,
    "keywords": [
      "labne",
      "peynir",
      "sürülebilir",
      "krema",
      "kahvaltı"
    ]
  },
  {
    "id": "f111",
    "name": "Keçi Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 268,
    "protein": 18,
    "carbs": 1.5,
    "fat": 21,
    "keywords": [
      "keçi",
      "peyniri",
      "peynir",
      "goat",
      "cheese",
      "doğal"
    ]
  },
  {
    "id": "f112",
    "name": "Proteinli Kakao Sütü (Spora Özel)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 68,
    "protein": 7.2,
    "carbs": 8,
    "fat": 0.5,
    "keywords": [
      "protein",
      "süt",
      "kakaolu",
      "çikolatalı",
      "shaker",
      "antrenman"
    ]
  },
  {
    "id": "f113",
    "name": "Yoğurt (Süzme, Light/Yağsız)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 55,
    "protein": 7.5,
    "carbs": 4.2,
    "fat": 0.1,
    "keywords": [
      "yoğurt",
      "süzme",
      "yağsız",
      "light",
      "protein",
      "diyet"
    ]
  },
  {
    "id": "f114",
    "name": "Karabuğday (Greçka - Haşlanmış)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 120,
    "protein": 4.3,
    "carbs": 25,
    "fat": 0.9,
    "keywords": [
      "karabuğday",
      "grecka",
      "greçka",
      "buckwheat",
      "lif",
      "glütensiz"
    ]
  },
  {
    "id": "f115",
    "name": "Basmati Pirinç (Haşlanmış)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 130,
    "protein": 2.7,
    "carbs": 28,
    "fat": 0.3,
    "keywords": [
      "basmati",
      "pirinç",
      "rice",
      "diyet",
      "fitness",
      "pilav"
    ]
  },
  {
    "id": "f116",
    "name": "Çavdar Ekmeği",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 220,
    "protein": 8.5,
    "carbs": 45,
    "fat": 1.8,
    "keywords": [
      "çavdar",
      "ekmek",
      "rye",
      "bread",
      "lifli",
      "diyet"
    ]
  },
  {
    "id": "f117",
    "name": "Kepekli Bisküvi (Eti Form tarzı)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 395,
    "protein": 8,
    "carbs": 72,
    "fat": 7,
    "keywords": [
      "eti",
      "form",
      "bisküvi",
      "kepekli",
      "diyet",
      "ara öğün"
    ]
  },
  {
    "id": "f118",
    "name": "Pirinç Patlağı (Eti Lifalif vb.)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 382,
    "protein": 8.2,
    "carbs": 82,
    "fat": 2.1,
    "keywords": [
      "pirinç",
      "patlağı",
      "rice",
      "cake",
      "diyabetik",
      "fıstık ezmesi"
    ]
  },
  {
    "id": "f119",
    "name": "Tam Buğday Galeta",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 360,
    "protein": 11,
    "carbs": 68,
    "fat": 3,
    "keywords": [
      "galeta",
      "atıştırmalık",
      "tam buğday",
      "kahvaltı",
      "diyet"
    ]
  },
  {
    "id": "f120",
    "name": "Konserve Tatlı Mısır",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 86,
    "protein": 3.2,
    "carbs": 19,
    "fat": 1.2,
    "keywords": [
      "mısır",
      "tatlı",
      "konserve",
      "pirinç",
      "salata",
      "corn"
    ]
  },
  {
    "id": "f121",
    "name": "Kırmızı Mercimek Yemeği",
    "category": "Bakliyat",
    "servingGram": 100,
    "calories": 124,
    "protein": 9.2,
    "carbs": 18,
    "fat": 1.5,
    "keywords": [
      "mercimek",
      "kırmızı",
      "lentil",
      "ev yemeği",
      "protein"
    ]
  },
  {
    "id": "f122",
    "name": "Barbunya Pilaki (Zeytinyağlı)",
    "category": "Bakliyat",
    "servingGram": 100,
    "calories": 155,
    "protein": 7,
    "carbs": 21,
    "fat": 4.8,
    "keywords": [
      "barbunya",
      "pilaki",
      "zeytinyağlı",
      "soğuk",
      "meze",
      "bakliyat"
    ]
  },
  {
    "id": "f123",
    "name": "Bezelye Yemeği (Zeytinyağlı)",
    "category": "Bakliyat",
    "servingGram": 100,
    "calories": 88,
    "protein": 4.2,
    "carbs": 12.8,
    "fat": 2.2,
    "keywords": [
      "bezelye",
      "pea",
      "havuç",
      "patates",
      "ev yemeği",
      "zeytinyağlı"
    ]
  },
  {
    "id": "f124",
    "name": "Yeşil Elma",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 48,
    "protein": 0.3,
    "carbs": 12.5,
    "fat": 0.1,
    "keywords": [
      "elma",
      "yeşil",
      "green",
      "apple",
      "ekşi",
      "diyet"
    ]
  },
  {
    "id": "f125",
    "name": "Kuru Kayısı (Gün Kurusu)",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 241,
    "protein": 3.4,
    "carbs": 62.5,
    "fat": 0.5,
    "keywords": [
      "kayısı",
      "kuru",
      "gun kuru",
      "tatlı",
      "lif",
      "bağırsak"
    ]
  },
  {
    "id": "f126",
    "name": "Kuru Üzüm",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 299,
    "protein": 3,
    "carbs": 79,
    "fat": 0.5,
    "keywords": [
      "üzüm",
      "kuru",
      "raisin",
      "tatlı",
      "enerji",
      "karbonhidrat"
    ]
  },
  {
    "id": "f127",
    "name": "Kuru İncir",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 249,
    "protein": 3.3,
    "carbs": 63.8,
    "fat": 0.9,
    "keywords": [
      "incir",
      "kuru",
      "fig",
      "tatlı",
      "kabızlık",
      "lif"
    ]
  },
  {
    "id": "f128",
    "name": "Şeftali",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 39,
    "protein": 0.9,
    "carbs": 9.5,
    "fat": 0.3,
    "keywords": [
      "şeftali",
      "seftali",
      "peach",
      "yaz",
      "sulu"
    ]
  },
  {
    "id": "f129",
    "name": "Kiraz",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 50,
    "protein": 1,
    "carbs": 12,
    "fat": 0.3,
    "keywords": [
      "kiraz",
      "cherry",
      "sapı",
      "antioksidan",
      "meyve"
    ]
  },
  {
    "id": "f130",
    "name": "Yeşil Erik (Can Erik)",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 46,
    "protein": 0.8,
    "carbs": 11.4,
    "fat": 0.3,
    "keywords": [
      "erik",
      "yeşil",
      "can",
      "ekşi",
      "tuzlu"
    ]
  },
  {
    "id": "f131",
    "name": "Mandalina",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 53,
    "protein": 0.8,
    "carbs": 13.3,
    "fat": 0.3,
    "keywords": [
      "mandalina",
      "mandarin",
      "c",
      "vitamini",
      "kış",
      "meyve"
    ]
  },
  {
    "id": "f132",
    "name": "Kültür Mantarı (Pişmiş)",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 28,
    "protein": 3,
    "carbs": 3.3,
    "fat": 0.4,
    "keywords": [
      "mantar",
      "sote",
      "mushroom",
      "sebze",
      "ızgara",
      "hafif"
    ]
  },
  {
    "id": "f133",
    "name": "Kuşkonmaz (Fırın)",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 20,
    "protein": 2.2,
    "carbs": 3.9,
    "fat": 0.2,
    "keywords": [
      "kuşkonmaz",
      "asparagus",
      "fitness",
      "ızgara",
      "diyet"
    ]
  },
  {
    "id": "f134",
    "name": "Semizotu (Taze)",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 16,
    "protein": 1.3,
    "carbs": 3.4,
    "fat": 0.1,
    "keywords": [
      "semizotu",
      "yeşillik",
      "salata",
      "yoğurtlu",
      "omega3"
    ]
  },
  {
    "id": "f135",
    "name": "Közlenmiş Patlıcan Konservesi",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 25,
    "protein": 1,
    "carbs": 5.5,
    "fat": 0.2,
    "keywords": [
      "patlıcan",
      "közleme",
      "salata",
      "babağanuş",
      "yoğurtlu"
    ]
  },
  {
    "id": "f136",
    "name": "Zeytinyağlı Enginar Yemeği",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 98,
    "protein": 3.2,
    "carbs": 11.5,
    "fat": 4.5,
    "keywords": [
      "enginar",
      "karaciğer",
      "zeytinyağlı",
      "garnitür",
      "sağlıklı"
    ]
  },
  {
    "id": "f137",
    "name": "Antep Fıstığı (Kavrulmuş)",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 562,
    "protein": 20.2,
    "carbs": 27.5,
    "fat": 45.3,
    "keywords": [
      "antep",
      "fıstığı",
      "kuruyemiş",
      "kabuklu",
      "lezzetli"
    ]
  },
  {
    "id": "f138",
    "name": "Çiğ Kaju",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 553,
    "protein": 18.2,
    "carbs": 30.1,
    "fat": 43.8,
    "keywords": [
      "kaju",
      "cashew",
      "çiğ",
      "kuruyemiş",
      "sağlıklı",
      "yağ"
    ]
  },
  {
    "id": "f139",
    "name": "Domates Çorbası (Kaşarlı)",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 65,
    "protein": 2.2,
    "carbs": 8.5,
    "fat": 2.5,
    "keywords": [
      "domates",
      "çorbası",
      "corba",
      "soup",
      "kaşar"
    ]
  },
  {
    "id": "f140",
    "name": "Yayla Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 78,
    "protein": 2.8,
    "carbs": 11,
    "fat": 2.4,
    "keywords": [
      "yayla",
      "çorbası",
      "corba",
      "yoğurtlu",
      "pirinç",
      "nane"
    ]
  },
  {
    "id": "f141",
    "name": "Adana Kebap (Sade Et Porsiyon)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 265,
    "protein": 18.5,
    "carbs": 0.5,
    "fat": 21,
    "keywords": [
      "adana",
      "kebap",
      "kıyma",
      "kuzu",
      "ızgara",
      "protein"
    ]
  },
  {
    "id": "f142",
    "name": "Dana Tas Kebabı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 175,
    "protein": 17.2,
    "carbs": 4.5,
    "fat": 9.8,
    "keywords": [
      "tas",
      "kebabı",
      "dana",
      "etli",
      "sululu",
      "akşam yemeği"
    ]
  },
  {
    "id": "f143",
    "name": "Etli Kuru Fasulye",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 154,
    "protein": 9.8,
    "carbs": 18.5,
    "fat": 4.9,
    "keywords": [
      "kuru",
      "fasulye",
      "etli",
      "dana",
      "bakliyat",
      "türk yemeği"
    ]
  },
  {
    "id": "f144",
    "name": "Mantı (Kıymalı, Yoğurt ve Soslu)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 245,
    "protein": 8.5,
    "carbs": 34,
    "fat": 8.5,
    "keywords": [
      "mantı",
      "yoğurt",
      "sarımsak",
      "kıyma",
      "soslu",
      "hamur"
    ]
  },
  {
    "id": "f145",
    "name": "Çiğ Köfte (Etsiz, Soslu)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 185,
    "protein": 4.8,
    "carbs": 32,
    "fat": 4,
    "keywords": [
      "çiğ",
      "köfte",
      "etsiz",
      "dürüm",
      "marul",
      "nar ekşisi",
      "vejetaryen"
    ]
  },
  {
    "id": "f146",
    "name": "Menemen (Peynirli, Zeytinyağlı)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 135,
    "protein": 7.8,
    "carbs": 4.5,
    "fat": 9.5,
    "keywords": [
      "menemen",
      "yumurta",
      "peynir",
      "domates",
      "biber",
      "kahvaltı"
    ]
  },
  {
    "id": "f147",
    "name": "Tavuklu Bulgur Pilavı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 178,
    "protein": 11.2,
    "carbs": 24,
    "fat": 4,
    "keywords": [
      "tavuklu",
      "bulgur",
      "pilav",
      "sporcu",
      "fitness",
      "protein"
    ]
  },
  {
    "id": "f148",
    "name": "Dana Kasap Sucuk",
    "category": "Kahvaltılık",
    "servingGram": 100,
    "calories": 340,
    "protein": 16,
    "carbs": 1.5,
    "fat": 30,
    "keywords": [
      "sucuk",
      "dana",
      "baharatlı",
      "ızgara",
      "tava",
      "kahvaltı"
    ]
  },
  {
    "id": "f149",
    "name": "Dana Pastırma (Çemensiz/Yağsız)",
    "category": "Kahvaltılık",
    "servingGram": 100,
    "calories": 198,
    "protein": 30,
    "carbs": 1,
    "fat": 8.2,
    "keywords": [
      "pastırma",
      "pastirma",
      "çemensiz",
      "kuru et",
      "kahvaltı",
      "protein"
    ]
  },
  {
    "id": "f150",
    "name": "Vişne Reçeli",
    "category": "Kahvaltılık",
    "servingGram": 100,
    "calories": 275,
    "protein": 0.3,
    "carbs": 68,
    "fat": 0,
    "keywords": [
      "reçel",
      "recel",
      "vişne",
      "visne",
      "şekerli",
      "kahvaltı"
    ]
  },
  {
    "id": "f151",
    "name": "Tavuklu Bulgur Pilavı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 178,
    "protein": 11.2,
    "carbs": 24,
    "fat": 4,
    "keywords": [
      "tavuklu bulgur",
      "tavuk bulgur",
      "pilav",
      "chicken bulgur",
      "sporcu",
      "protein"
    ]
  },
  {
    "id": "f152",
    "name": "Domates Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 45,
    "protein": 1.2,
    "carbs": 6.5,
    "fat": 1.8,
    "keywords": [
      "domates",
      "corba",
      "soup",
      "kasarli",
      "domat",
      "kirmizi",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f153",
    "name": "Şehriye Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 42,
    "protein": 1.1,
    "carbs": 7.8,
    "fat": 0.8,
    "keywords": [
      "sehriye",
      "corba",
      "soup",
      "tavuklu",
      "tel",
      "arpa",
      "şehriye",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f154",
    "name": "Mercimek Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 55,
    "protein": 3.2,
    "carbs": 8.5,
    "fat": 1.2,
    "keywords": [
      "mercimek",
      "corba",
      "soup",
      "sari",
      "yesil",
      "limon",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f155",
    "name": "Mantar Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 52,
    "protein": 1.5,
    "carbs": 5.2,
    "fat": 3.1,
    "keywords": [
      "mantar",
      "corba",
      "soup",
      "kremali",
      "mushroom",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f156",
    "name": "Brokoli Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 38,
    "protein": 1.8,
    "carbs": 4.5,
    "fat": 1.5,
    "keywords": [
      "brokoli",
      "corba",
      "soup",
      "diyet",
      "yesil",
      "sebze",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f157",
    "name": "Kelle Paça Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 120,
    "protein": 11.5,
    "carbs": 0.5,
    "fat": 8.2,
    "keywords": [
      "kelle",
      "paca",
      "corba",
      "soup",
      "sarimsak",
      "sirke",
      "protein",
      "paça",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f158",
    "name": "İşkembe Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 95,
    "protein": 8.5,
    "carbs": 0.8,
    "fat": 6.5,
    "keywords": [
      "iskenbe",
      "iskembe",
      "corba",
      "soup",
      "sarimsak",
      "sirke",
      "sakatat",
      "i̇şkembe",
      "i̇skembe",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f159",
    "name": "Sebze Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 32,
    "protein": 1,
    "carbs": 5.4,
    "fat": 0.6,
    "keywords": [
      "sebze",
      "corba",
      "soup",
      "karisik",
      "diyet",
      "hafif",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f160",
    "name": "Tavuk Suyu Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 70,
    "protein": 6.2,
    "carbs": 4.5,
    "fat": 3,
    "keywords": [
      "tavuk",
      "suyu",
      "corba",
      "soup",
      "gogus",
      "tel şehriye",
      "tel sehriye",
      "protein",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f161",
    "name": "Yuvalama Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 142,
    "protein": 8.2,
    "carbs": 12.5,
    "fat": 6.8,
    "keywords": [
      "yuvalama",
      "corba",
      "soup",
      "gaziantep",
      "yogurtlu",
      "kofteli",
      "etli",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f162",
    "name": "Beyran Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 180,
    "protein": 14.2,
    "carbs": 3.5,
    "fat": 12.5,
    "keywords": [
      "beyran",
      "corba",
      "soup",
      "gaziantep",
      "aci",
      "et",
      "kuzu",
      "protein",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f163",
    "name": "Balkabağı Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 42,
    "protein": 1.1,
    "carbs": 7,
    "fat": 1.2,
    "keywords": [
      "balkabagi",
      "balkabaği",
      "corba",
      "soup",
      "tatli",
      "kremali",
      "balkabağı",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f164",
    "name": "Karalahana Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 55,
    "protein": 2,
    "carbs": 8.2,
    "fat": 1.8,
    "keywords": [
      "karalahana",
      "corba",
      "soup",
      "karadeniz",
      "misir",
      "yoresel",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f165",
    "name": "Balık Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 65,
    "protein": 7.2,
    "carbs": 2.5,
    "fat": 3.1,
    "keywords": [
      "balik",
      "corba",
      "soup",
      "levrek",
      "sebzeli",
      "balık",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f166",
    "name": "Badem Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 110,
    "protein": 3.5,
    "carbs": 8.2,
    "fat": 7.5,
    "keywords": [
      "badem",
      "corba",
      "soup",
      "saray",
      "yoresel",
      "osmanli",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f167",
    "name": "Toyga Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 85,
    "protein": 2.8,
    "carbs": 11.5,
    "fat": 3.2,
    "keywords": [
      "toyga",
      "corba",
      "soup",
      "yoresel",
      "yarma",
      "yogurt",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f168",
    "name": "Tutmaç Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 98,
    "protein": 3.4,
    "carbs": 14.5,
    "fat": 3.1,
    "keywords": [
      "tutmac",
      "corba",
      "soup",
      "eriste",
      "yesil mercimek",
      "tutmaç",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f169",
    "name": "Mahluta Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 72,
    "protein": 3.8,
    "carbs": 10.5,
    "fat": 1.8,
    "keywords": [
      "mahluta",
      "corba",
      "soup",
      "yoresel",
      "kimyon",
      "mercimek",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f170",
    "name": "Helle Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 60,
    "protein": 1.5,
    "carbs": 9.5,
    "fat": 1.8,
    "keywords": [
      "helle",
      "corba",
      "soup",
      "unlu",
      "tokat",
      "yoresel",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f171",
    "name": "Erişteli Mercimek Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 88,
    "protein": 4.1,
    "carbs": 13.5,
    "fat": 2,
    "keywords": [
      "eristeli",
      "corba",
      "soup",
      "yesil mercimek",
      "hamurlu",
      "erişteli",
      "mercimek",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f172",
    "name": "Tavuklu Şehriye Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 62,
    "protein": 4.8,
    "carbs": 6.5,
    "fat": 1.8,
    "keywords": [
      "tavuklu",
      "sehriye",
      "corba",
      "soup",
      "haslama",
      "tavuk",
      "şehriye",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f173",
    "name": "Kremalı Kuşkonmaz Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 58,
    "protein": 1.4,
    "carbs": 5.8,
    "fat": 3.5,
    "keywords": [
      "krema",
      "kuskonmaz",
      "kuşkonmaz",
      "corba",
      "soup",
      "kremali",
      "kremalı",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f174",
    "name": "Kremalı Mantar Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 75,
    "protein": 2,
    "carbs": 6.8,
    "fat": 4.5,
    "keywords": [
      "krema",
      "mantar",
      "corba",
      "soup",
      "kremali",
      "kremalı",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f175",
    "name": "Karnabahar Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 36,
    "protein": 1.5,
    "carbs": 5,
    "fat": 1.2,
    "keywords": [
      "karnabahar",
      "corba",
      "soup",
      "diyet",
      "hafif",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f176",
    "name": "Düğün Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 115,
    "protein": 6.8,
    "carbs": 6,
    "fat": 7.5,
    "keywords": [
      "dugun",
      "corba",
      "soup",
      "etli",
      "terbiyeli",
      "düğün",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f177",
    "name": "Analı Kızlı Çorba",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 155,
    "protein": 8.5,
    "carbs": 14,
    "fat": 7.2,
    "keywords": [
      "anali",
      "kizli",
      "corba",
      "soup",
      "yoresel",
      "manti",
      "etli",
      "analı",
      "kızlı",
      "çorba"
    ]
  },
  {
    "id": "f178",
    "name": "Arpa Şehriye Çorbası",
    "category": "Çorba",
    "servingGram": 100,
    "calories": 44,
    "protein": 1.2,
    "carbs": 8,
    "fat": 0.8,
    "keywords": [
      "arpa",
      "sehriye",
      "corba",
      "soup",
      "klasik",
      "şehriye",
      "çorbası",
      "corbasi"
    ]
  },
  {
    "id": "f179",
    "name": "Karnıyarık",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 135,
    "protein": 4.2,
    "carbs": 6.5,
    "fat": 10.5,
    "keywords": [
      "karniyarik",
      "patlican",
      "kiymali",
      "firin",
      "turkish",
      "eggplant",
      "karnıyarık"
    ]
  },
  {
    "id": "f180",
    "name": "İzmir Köfte",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 165,
    "protein": 9.5,
    "carbs": 7.8,
    "fat": 11,
    "keywords": [
      "izmir",
      "kofte",
      "patates",
      "salcali",
      "firin",
      "meatball",
      "i̇zmir",
      "köfte"
    ]
  },
  {
    "id": "f181",
    "name": "Zeytinyağlı Kuru Fasulye",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 122,
    "protein": 5.1,
    "carbs": 16.5,
    "fat": 3.8,
    "keywords": [
      "kuru",
      "fasulye",
      "zeytinyagli",
      "bakliyat",
      "bean",
      "zeytinyağlı"
    ]
  },
  {
    "id": "f182",
    "name": "Zeytinyağlı Enginar",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 85,
    "protein": 2.1,
    "carbs": 9.5,
    "fat": 4.2,
    "keywords": [
      "enginar",
      "zeytinyagli",
      "garnitur",
      "karaciger",
      "diyet",
      "zeytinyağlı"
    ]
  },
  {
    "id": "f183",
    "name": "Nohutlu Yahni",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 158,
    "protein": 8.5,
    "carbs": 18.2,
    "fat": 6,
    "keywords": [
      "nohut",
      "yahni",
      "etli",
      "dana",
      "bakliyat",
      "nohutlu"
    ]
  },
  {
    "id": "f184",
    "name": "Tas Kebabı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 185,
    "protein": 14.5,
    "carbs": 4.2,
    "fat": 12.5,
    "keywords": [
      "tas",
      "kebabi",
      "etli",
      "dana",
      "patatesli",
      "salcali",
      "kebabı"
    ]
  },
  {
    "id": "f185",
    "name": "Kadınbudu Köfte",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 240,
    "protein": 13.2,
    "carbs": 14.5,
    "fat": 14.8,
    "keywords": [
      "kadinbudu",
      "kofte",
      "pirincli",
      "kizartma",
      "yumurtali",
      "kadınbudu",
      "köfte"
    ]
  },
  {
    "id": "f186",
    "name": "Hünkar Beğendi",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 195,
    "protein": 11.2,
    "carbs": 5.5,
    "fat": 14.5,
    "keywords": [
      "hunkar",
      "begendi",
      "patlicanli",
      "besamel",
      "etli",
      "kuzu",
      "hünkar",
      "beğendi"
    ]
  },
  {
    "id": "f187",
    "name": "Ali Nazik Kebabı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 178,
    "protein": 12.8,
    "carbs": 4,
    "fat": 12.2,
    "keywords": [
      "ali",
      "nazik",
      "patlican",
      "sarimsak",
      "yogurt",
      "etli",
      "kiyma",
      "kebabı",
      "kebabi"
    ]
  },
  {
    "id": "f188",
    "name": "Adana Kebap",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 295,
    "protein": 18.5,
    "carbs": 1.2,
    "fat": 24.5,
    "keywords": [
      "adana",
      "kebap",
      "kiyma",
      "acili",
      "sis",
      "kuzu",
      "protein"
    ]
  },
  {
    "id": "f189",
    "name": "Urfa Kebap",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 290,
    "protein": 18.5,
    "carbs": 1.2,
    "fat": 24,
    "keywords": [
      "urfa",
      "kebap",
      "kiyma",
      "acisiz",
      "sis",
      "kuzu"
    ]
  },
  {
    "id": "f190",
    "name": "İskender Kebap",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 240,
    "protein": 12.8,
    "carbs": 14.5,
    "fat": 15.5,
    "keywords": [
      "iskender",
      "kebap",
      "doner",
      "tereyagli",
      "yogurtlu",
      "pide",
      "i̇skender"
    ]
  },
  {
    "id": "f191",
    "name": "Kuzu Tandır",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 280,
    "protein": 24.5,
    "carbs": 0,
    "fat": 20,
    "keywords": [
      "kuzu",
      "tandir",
      "firin",
      "kemikli",
      "yagli",
      "protein",
      "tandır"
    ]
  },
  {
    "id": "f192",
    "name": "Kuzu Gerdan",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 250,
    "protein": 22,
    "carbs": 0,
    "fat": 18,
    "keywords": [
      "kuzu",
      "gerdan",
      "haslama",
      "firin"
    ]
  },
  {
    "id": "f193",
    "name": "Kağıt Kebabı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 175,
    "protein": 13.5,
    "carbs": 4.8,
    "fat": 11.2,
    "keywords": [
      "kagit",
      "kebabi",
      "sebzeli",
      "firin",
      "etli",
      "kağıt",
      "kebabı"
    ]
  },
  {
    "id": "f194",
    "name": "Orman Kebabı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 142,
    "protein": 11.2,
    "carbs": 6.5,
    "fat": 8.5,
    "keywords": [
      "orman",
      "kebabi",
      "bezelyeli",
      "havuclu",
      "etli",
      "kebabı"
    ]
  },
  {
    "id": "f195",
    "name": "Sac Tava",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 220,
    "protein": 16.5,
    "carbs": 2.5,
    "fat": 16.2,
    "keywords": [
      "sac",
      "tava",
      "domatesli",
      "biberli",
      "etli",
      "dana"
    ]
  },
  {
    "id": "f196",
    "name": "Tavuk Sote",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 128,
    "protein": 14.5,
    "carbs": 4.2,
    "fat": 5.8,
    "keywords": [
      "tavuk",
      "sote",
      "biberli",
      "domatesli",
      "hafif",
      "gogus"
    ]
  },
  {
    "id": "f197",
    "name": "Et Sote",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 165,
    "protein": 16.8,
    "carbs": 3.5,
    "fat": 9.2,
    "keywords": [
      "et",
      "sote",
      "dana",
      "biber",
      "domates",
      "tencere"
    ]
  },
  {
    "id": "f198",
    "name": "Biber Dolması (Etli)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 112,
    "protein": 5.8,
    "carbs": 11.2,
    "fat": 4.8,
    "keywords": [
      "biber",
      "dolmasi",
      "etli",
      "kiymali",
      "pirincli",
      "dolması"
    ]
  },
  {
    "id": "f199",
    "name": "Karışık Kızartma",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 195,
    "protein": 2.2,
    "carbs": 16.5,
    "fat": 13.5,
    "keywords": [
      "karisik",
      "kizartma",
      "patlican",
      "kabak",
      "biber",
      "patates",
      "domates soslu",
      "karışık",
      "kızartma"
    ]
  },
  {
    "id": "f200",
    "name": "Kabak Kalye",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 78,
    "protein": 1.5,
    "carbs": 6.8,
    "fat": 5.2,
    "keywords": [
      "kabak",
      "kalye",
      "zeytinyagli",
      "havuclu",
      "dereotu"
    ]
  },
  {
    "id": "f201",
    "name": "Patlıcan Musakka",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 130,
    "protein": 4.8,
    "carbs": 7.2,
    "fat": 9.5,
    "keywords": [
      "musakka",
      "patlican",
      "kiymali",
      "tencere",
      "patlıcan"
    ]
  },
  {
    "id": "f202",
    "name": "Patlıcan Oturtma",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 145,
    "protein": 5.2,
    "carbs": 7.8,
    "fat": 10.8,
    "keywords": [
      "oturtma",
      "patlican",
      "etli",
      "kiyma",
      "firin",
      "patlıcan"
    ]
  },
  {
    "id": "f203",
    "name": "Nohutlu Pilav",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 195,
    "protein": 4.5,
    "carbs": 36,
    "fat": 3.8,
    "keywords": [
      "nohutlu",
      "pilav",
      "pirinc",
      "karbonhidrat"
    ]
  },
  {
    "id": "f204",
    "name": "Perde Pilavı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 285,
    "protein": 8.5,
    "carbs": 34,
    "fat": 13.2,
    "keywords": [
      "perde",
      "pilavi",
      "tavuklu",
      "bademli",
      "hamurlu",
      "firin",
      "pilavı"
    ]
  },
  {
    "id": "f205",
    "name": "Kayseri Mantısı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 210,
    "protein": 8.2,
    "carbs": 28.5,
    "fat": 7.2,
    "keywords": [
      "manti",
      "kayseri",
      "yogurtlu",
      "salcali",
      "sarimsakli",
      "hamur",
      "mantısı",
      "mantisi"
    ]
  },
  {
    "id": "f206",
    "name": "Tepsi Mantısı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 240,
    "protein": 9.5,
    "carbs": 32,
    "fat": 8.5,
    "keywords": [
      "tepsi",
      "manti",
      "firin",
      "yogurtlu",
      "salcali",
      "mantısı",
      "mantisi"
    ]
  },
  {
    "id": "f207",
    "name": "Zeytinyağlı Lahana Sarması",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 148,
    "protein": 1.8,
    "carbs": 22.5,
    "fat": 5.8,
    "keywords": [
      "lahana",
      "sarmasi",
      "zeytinyagli",
      "pirincli",
      "zeytinyağlı",
      "sarması"
    ]
  },
  {
    "id": "f208",
    "name": "Etli Lahana Sarması",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 115,
    "protein": 6.2,
    "carbs": 10.5,
    "fat": 5.2,
    "keywords": [
      "lahana",
      "sarmasi",
      "etli",
      "kiymali",
      "sarması"
    ]
  },
  {
    "id": "f209",
    "name": "Zeytinyağlı Biber Dolması",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 155,
    "protein": 2,
    "carbs": 24.8,
    "fat": 5.2,
    "keywords": [
      "biber",
      "dolmasi",
      "zeytinyagli",
      "pirincli",
      "kus uzumu",
      "zeytinyağlı",
      "dolması"
    ]
  },
  {
    "id": "f210",
    "name": "Kabak Çiçeği Dolması",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 120,
    "protein": 1.8,
    "carbs": 16.5,
    "fat": 5.5,
    "keywords": [
      "kabak",
      "cicegi",
      "dolmasi",
      "ege",
      "zeytinyagli",
      "çiçeği",
      "dolması"
    ]
  },
  {
    "id": "f211",
    "name": "Mumbar Dolması",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 260,
    "protein": 12.5,
    "carbs": 18,
    "fat": 15.5,
    "keywords": [
      "mumbar",
      "bumbar",
      "dolmasi",
      "yoresel",
      "sakatat",
      "dolması"
    ]
  },
  {
    "id": "f212",
    "name": "Şırdan",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 220,
    "protein": 11.2,
    "carbs": 16.5,
    "fat": 12.2,
    "keywords": [
      "sirdan",
      "adana",
      "yoresel",
      "pirincli",
      "şırdan"
    ]
  },
  {
    "id": "f213",
    "name": "İçli Köfte (Haşlama)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 210,
    "protein": 9.8,
    "carbs": 24,
    "fat": 8.5,
    "keywords": [
      "icli",
      "kofte",
      "haslama",
      "diyet",
      "kiymali",
      "cevizli",
      "i̇çli",
      "i̇cli",
      "köfte",
      "haşlama"
    ]
  },
  {
    "id": "f214",
    "name": "İçli Köfte (Kızartma)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 290,
    "protein": 9.2,
    "carbs": 23.5,
    "fat": 18.2,
    "keywords": [
      "icli",
      "kofte",
      "kizartma",
      "yagli",
      "citir",
      "i̇çli",
      "i̇cli",
      "köfte",
      "kızartma"
    ]
  },
  {
    "id": "f215",
    "name": "Kuzu Pirzola",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 265,
    "protein": 22.5,
    "carbs": 0,
    "fat": 19.5,
    "keywords": [
      "kuzu",
      "pirzola",
      "izgara",
      "protein"
    ]
  },
  {
    "id": "f216",
    "name": "Beğendili Tavuk Kebabı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 168,
    "protein": 14.5,
    "carbs": 6.2,
    "fat": 9.2,
    "keywords": [
      "begendili",
      "tavuk",
      "patlican",
      "besamel",
      "beğendili",
      "kebabı",
      "kebabi"
    ]
  },
  {
    "id": "f217",
    "name": "Taze Fasulye (Zeytinyağlı)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 75,
    "protein": 1.5,
    "carbs": 7.2,
    "fat": 4.5,
    "keywords": [
      "taze",
      "fasulye",
      "zeytinyagli",
      "domatesli",
      "diyet",
      "zeytinyağlı"
    ]
  },
  {
    "id": "f218",
    "name": "Taze Fasulye (Etli)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 98,
    "protein": 5.8,
    "carbs": 6.5,
    "fat": 5.5,
    "keywords": [
      "taze",
      "fasulye",
      "etli",
      "tencere"
    ]
  },
  {
    "id": "f219",
    "name": "Kabak Mücver (Fırın)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 95,
    "protein": 4.2,
    "carbs": 11.5,
    "fat": 3.5,
    "keywords": [
      "mucver",
      "mücver",
      "kabak",
      "dereotu",
      "firin",
      "diyet",
      "fırın"
    ]
  },
  {
    "id": "f220",
    "name": "Zeytinyağlı Bamya",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 68,
    "protein": 1.8,
    "carbs": 6.5,
    "fat": 4,
    "keywords": [
      "bamya",
      "zeytinyagli",
      "salcali",
      "limonlu",
      "zeytinyağlı"
    ]
  },
  {
    "id": "f221",
    "name": "Zeytinyağlı Bakla",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 82,
    "protein": 3.5,
    "carbs": 9.8,
    "fat": 3.2,
    "keywords": [
      "bakla",
      "zeytinyagli",
      "dereotlu",
      "yogurtlu",
      "zeytinyağlı"
    ]
  },
  {
    "id": "f222",
    "name": "Zeytinyağlı Pırasa",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 72,
    "protein": 1.2,
    "carbs": 10.2,
    "fat": 3,
    "keywords": [
      "pirasa",
      "zeytinyagli",
      "havuclu",
      "pirincli",
      "zeytinyağlı",
      "pırasa"
    ]
  },
  {
    "id": "f223",
    "name": "Zeytinyağlı Kereviz",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 65,
    "protein": 1.1,
    "carbs": 7.8,
    "fat": 3.2,
    "keywords": [
      "kereviz",
      "zeytinyagli",
      "portakalli",
      "havuclu",
      "zeytinyağlı"
    ]
  },
  {
    "id": "f224",
    "name": "Ekşili Köfte",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 125,
    "protein": 7.8,
    "carbs": 11.2,
    "fat": 5.5,
    "keywords": [
      "eksili",
      "kofte",
      "terbiyeli",
      "kofteli",
      "havuclu",
      "patatesli",
      "ekşili",
      "köfte"
    ]
  },
  {
    "id": "f225",
    "name": "Terbiyeli Tavuk",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 110,
    "protein": 13.8,
    "carbs": 2.5,
    "fat": 5.2,
    "keywords": [
      "terbiyeli",
      "tavuk",
      "haslama",
      "limonlu"
    ]
  },
  {
    "id": "f226",
    "name": "Patates Oturtma",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 148,
    "protein": 6.2,
    "carbs": 14.2,
    "fat": 7.2,
    "keywords": [
      "patates",
      "oturtma",
      "kiymali",
      "firin"
    ]
  },
  {
    "id": "f227",
    "name": "Domatesli Bulgur Pilavı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 135,
    "protein": 3.5,
    "carbs": 24.5,
    "fat": 2.5,
    "keywords": [
      "domatesli",
      "bulgur",
      "pilavi",
      "karbonhidrat",
      "pilavı"
    ]
  },
  {
    "id": "f228",
    "name": "Meyhane Pilavı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 142,
    "protein": 3.8,
    "carbs": 25.2,
    "fat": 2.8,
    "keywords": [
      "meyhane",
      "pilavi",
      "biberli",
      "domatesli",
      "bulgur",
      "pilavı"
    ]
  },
  {
    "id": "f229",
    "name": "Şehriyeli Pirinç Pilavı",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 168,
    "protein": 2.6,
    "carbs": 34.5,
    "fat": 2,
    "keywords": [
      "sehriyeli",
      "pirinc",
      "pilavi",
      "klasik",
      "şehriyeli",
      "pirinç",
      "pilavı"
    ]
  },
  {
    "id": "f230",
    "name": "Alinazik Tavuklu",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 148,
    "protein": 13.5,
    "carbs": 4.5,
    "fat": 8.2,
    "keywords": [
      "alinazik",
      "tavuklu",
      "yogurtlu",
      "patlicanli"
    ]
  },
  {
    "id": "f231",
    "name": "Çökertme Kebabı (Etli)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 260,
    "protein": 15.2,
    "carbs": 14.8,
    "fat": 15.5,
    "keywords": [
      "cokertme",
      "kebabi",
      "patates",
      "yogurt",
      "et",
      "çökertme",
      "kebabı",
      "etli"
    ]
  },
  {
    "id": "f232",
    "name": "Hamsi Tava",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 210,
    "protein": 19,
    "carbs": 4.5,
    "fat": 12,
    "keywords": [
      "hamsi",
      "tava",
      "balik",
      "karadeniz",
      "kizartma"
    ]
  },
  {
    "id": "f233",
    "name": "İstiridye Mantar Sote",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 88,
    "protein": 3.2,
    "carbs": 6.5,
    "fat": 5,
    "keywords": [
      "mantar",
      "sote",
      "vejetaryen",
      "sebze",
      "i̇stiridye"
    ]
  },
  {
    "id": "f234",
    "name": "İzmir Boyoz",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 390,
    "protein": 6.5,
    "carbs": 48,
    "fat": 20,
    "keywords": [
      "boyoz",
      "izmir",
      "hamur",
      "yagli",
      "kahvalti",
      "i̇zmir"
    ]
  },
  {
    "id": "f235",
    "name": "İzmir Gözlemesi (Peynirli)",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 260,
    "protein": 9.5,
    "carbs": 38,
    "fat": 7.5,
    "keywords": [
      "gozleme",
      "gözleme",
      "peynirli",
      "i̇zmir",
      "gözlemesi",
      "gozlemesi"
    ]
  },
  {
    "id": "f236",
    "name": "Ispanaklı Gözleme",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 220,
    "protein": 6.8,
    "carbs": 36,
    "fat": 5.2,
    "keywords": [
      "gozleme",
      "ispanakli",
      "otlu",
      "ispanaklı",
      "gözleme"
    ]
  },
  {
    "id": "f237",
    "name": "Kıymalı Gözleme",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 280,
    "protein": 11.5,
    "carbs": 35,
    "fat": 9.8,
    "keywords": [
      "gozleme",
      "kiymali",
      "kiyma",
      "kıymalı",
      "gözleme"
    ]
  },
  {
    "id": "f238",
    "name": "Patatesli Gözleme",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 240,
    "protein": 5.2,
    "carbs": 44,
    "fat": 4.8,
    "keywords": [
      "gozleme",
      "patatesli",
      "gözleme"
    ]
  },
  {
    "id": "f239",
    "name": "Lahmacun",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 220,
    "protein": 9,
    "carbs": 24,
    "fat": 8.5,
    "keywords": [
      "lahmacun",
      "pide",
      "kiymali",
      "aci",
      "fistik lahmacun"
    ]
  },
  {
    "id": "f240",
    "name": "Fındık Lahmacun",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 240,
    "protein": 9.5,
    "carbs": 25,
    "fat": 9,
    "keywords": [
      "findik",
      "lahmacun",
      "meze",
      "fındık"
    ]
  },
  {
    "id": "f241",
    "name": "Çoban Kavurma",
    "category": "Türk Yemekleri",
    "servingGram": 100,
    "calories": 190,
    "protein": 16.8,
    "carbs": 3.2,
    "fat": 12.8,
    "keywords": [
      "coban",
      "kavurma",
      "etli",
      "dana",
      "tencere",
      "çoban"
    ]
  },
  {
    "id": "f242",
    "name": "İzmir Tulum Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 325,
    "protein": 21,
    "carbs": 2,
    "fat": 26,
    "keywords": [
      "tulum",
      "izmir",
      "peynir",
      "tuzlu",
      "i̇zmir",
      "peyniri"
    ]
  },
  {
    "id": "f243",
    "name": "Erzincan Tulum Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 340,
    "protein": 22,
    "carbs": 1.5,
    "fat": 28,
    "keywords": [
      "tulum",
      "erzincan",
      "peynir",
      "peyniri"
    ]
  },
  {
    "id": "f244",
    "name": "Van Otlu Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 310,
    "protein": 20,
    "carbs": 2,
    "fat": 25,
    "keywords": [
      "otlu",
      "van",
      "peynir",
      "peyniri"
    ]
  },
  {
    "id": "f245",
    "name": "Ezine Beyaz Peyniri (Koyun)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 310,
    "protein": 16,
    "carbs": 2.2,
    "fat": 26,
    "keywords": [
      "ezine",
      "peynir",
      "koyun",
      "klasik",
      "beyaz",
      "peyniri"
    ]
  },
  {
    "id": "f246",
    "name": "Ezine Beyaz Peyniri (Keçi)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 290,
    "protein": 15,
    "carbs": 2.5,
    "fat": 24,
    "keywords": [
      "ezine",
      "peynir",
      "keci",
      "keçi",
      "beyaz",
      "peyniri"
    ]
  },
  {
    "id": "f247",
    "name": "Hellim Peyniri (Izgara)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 320,
    "protein": 22,
    "carbs": 1.8,
    "fat": 25,
    "keywords": [
      "hellim",
      "peynir",
      "izgara",
      "halloumi",
      "peyniri"
    ]
  },
  {
    "id": "f248",
    "name": "Çeçil Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 280,
    "protein": 24,
    "carbs": 1.5,
    "fat": 20,
    "keywords": [
      "cecil",
      "peynir",
      "tel",
      "yagsiz",
      "çeçil",
      "peyniri"
    ]
  },
  {
    "id": "f249",
    "name": "Örgü Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 295,
    "protein": 22,
    "carbs": 2,
    "fat": 22,
    "keywords": [
      "orgu",
      "örgü",
      "peynir",
      "tuzlu",
      "peyniri"
    ]
  },
  {
    "id": "f250",
    "name": "Dil Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 285,
    "protein": 23,
    "carbs": 1.8,
    "fat": 21,
    "keywords": [
      "dil",
      "peynir",
      "kunefe",
      "lifli",
      "peyniri"
    ]
  },
  {
    "id": "f251",
    "name": "Labne Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 190,
    "protein": 5.5,
    "carbs": 4.5,
    "fat": 17,
    "keywords": [
      "labne",
      "peynir",
      "krem",
      "kahvalti",
      "peyniri"
    ]
  },
  {
    "id": "f252",
    "name": "Mihaliç Peyniri",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 345,
    "protein": 23,
    "carbs": 1.5,
    "fat": 28,
    "keywords": [
      "mihalic",
      "peynir",
      "sert",
      "kelle",
      "mihaliç",
      "peyniri"
    ]
  },
  {
    "id": "f253",
    "name": "Gravyer Peyniri (Kars)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 390,
    "protein": 28,
    "carbs": 1.5,
    "fat": 31,
    "keywords": [
      "gravyer",
      "kars",
      "peynir",
      "isvicre",
      "peyniri"
    ]
  },
  {
    "id": "f254",
    "name": "Koyun Yoğurdu (Tam Yağlı)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 95,
    "protein": 5.5,
    "carbs": 4.5,
    "fat": 6,
    "keywords": [
      "koyun",
      "yogurt",
      "yagli",
      "yoğurdu",
      "yogurdu",
      "tam",
      "yağlı"
    ]
  },
  {
    "id": "f255",
    "name": "Keçi Yoğurdu",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 75,
    "protein": 4,
    "carbs": 4.2,
    "fat": 4.5,
    "keywords": [
      "keci",
      "keçi",
      "yogurt",
      "yoğurdu",
      "yogurdu"
    ]
  },
  {
    "id": "f256",
    "name": "Süzme Yoğurt (%10 Yağlı)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 135,
    "protein": 7.2,
    "carbs": 3.8,
    "fat": 10,
    "keywords": [
      "suzme",
      "yogurt",
      "süzme",
      "yagli",
      "yoğurt",
      "yağlı"
    ]
  },
  {
    "id": "f257",
    "name": "Meyveli Yoğurt (Çilekli)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 92,
    "protein": 3.2,
    "carbs": 14.5,
    "fat": 1.8,
    "keywords": [
      "meyveli",
      "yogurt",
      "cilekli",
      "tatli",
      "yoğurt",
      "çilekli"
    ]
  },
  {
    "id": "f258",
    "name": "Meyveli Yoğurt (Muzlu)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 95,
    "protein": 3.1,
    "carbs": 15.2,
    "fat": 1.6,
    "keywords": [
      "meyveli",
      "yogurt",
      "muzlu",
      "tatli",
      "yoğurt"
    ]
  },
  {
    "id": "f259",
    "name": "Çikolatalı Süt",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 75,
    "protein": 3.2,
    "carbs": 10.5,
    "fat": 2,
    "keywords": [
      "cikolatali",
      "çikolatalı",
      "sut",
      "milk",
      "süt"
    ]
  },
  {
    "id": "f260",
    "name": "Muzlu Süt",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 72,
    "protein": 3.1,
    "carbs": 10.2,
    "fat": 1.8,
    "keywords": [
      "muzlu",
      "sut",
      "milk",
      "aromali",
      "süt"
    ]
  },
  {
    "id": "f261",
    "name": "Çilekli Süt",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 70,
    "protein": 3.1,
    "carbs": 9.8,
    "fat": 1.8,
    "keywords": [
      "cilekli",
      "çilekli",
      "sut",
      "milk",
      "aromali",
      "süt"
    ]
  },
  {
    "id": "f262",
    "name": "Süt Kaymağı",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 580,
    "protein": 1.5,
    "carbs": 3.2,
    "fat": 62,
    "keywords": [
      "kaymak",
      "sut",
      "bal",
      "kahvalti",
      "krema",
      "süt",
      "kaymağı",
      "kaymagi"
    ]
  },
  {
    "id": "f263",
    "name": "Yoğurtlu Cacık",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 45,
    "protein": 2.2,
    "carbs": 3.5,
    "fat": 2.5,
    "keywords": [
      "cacik",
      "salatalikli",
      "yogurt",
      "yoğurtlu",
      "yogurtlu",
      "cacık"
    ]
  },
  {
    "id": "f264",
    "name": "Haydari (Meze)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 125,
    "protein": 4.8,
    "carbs": 4.5,
    "fat": 10.2,
    "keywords": [
      "haydari",
      "meze",
      "yogurtlu",
      "nane",
      "sarimsak"
    ]
  },
  {
    "id": "f265",
    "name": "Süzme Süt (%3 Yağlı)",
    "category": "Süt Ürünleri",
    "servingGram": 100,
    "calories": 62,
    "protein": 3.3,
    "carbs": 4.7,
    "fat": 3,
    "keywords": [
      "sut",
      "süzme",
      "suzme",
      "yagli",
      "süt",
      "yağlı"
    ]
  },
  {
    "id": "f266",
    "name": "Amasya Elması",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 50,
    "protein": 0.3,
    "carbs": 13.5,
    "fat": 0.1,
    "keywords": [
      "elma",
      "amasya",
      "yerli",
      "elması",
      "elmasi"
    ]
  },
  {
    "id": "f267",
    "name": "Deveci Armudu",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 57,
    "protein": 0.4,
    "carbs": 15,
    "fat": 0.1,
    "keywords": [
      "armut",
      "pear",
      "deveci",
      "sulu",
      "armudu"
    ]
  },
  {
    "id": "f268",
    "name": "Yerli Muz (Anamur)",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 85,
    "protein": 1.1,
    "carbs": 21,
    "fat": 0.2,
    "keywords": [
      "muz",
      "anamur",
      "yerli",
      "banana"
    ]
  },
  {
    "id": "f269",
    "name": "Vişne",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 50,
    "protein": 1,
    "carbs": 12,
    "fat": 0.3,
    "keywords": [
      "visne",
      "sour",
      "cherry",
      "eksi",
      "vişne"
    ]
  },
  {
    "id": "f270",
    "name": "Yeşil Erik (Papaz)",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 30,
    "protein": 0.5,
    "carbs": 7.5,
    "fat": 0.2,
    "keywords": [
      "erik",
      "yesil",
      "papaz",
      "eksi",
      "tuzlu",
      "yeşil"
    ]
  },
  {
    "id": "f271",
    "name": "Mürdüm Eriği",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 46,
    "protein": 0.8,
    "carbs": 11.5,
    "fat": 0.3,
    "keywords": [
      "erik",
      "mürdüm",
      "murdum",
      "mor",
      "eriği",
      "erigi"
    ]
  },
  {
    "id": "f272",
    "name": "Taze Kayısı",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 48,
    "protein": 1.4,
    "carbs": 11,
    "fat": 0.1,
    "keywords": [
      "kayisi",
      "kayısi",
      "apricot",
      "taze",
      "kayısı"
    ]
  },
  {
    "id": "f273",
    "name": "Nektarin",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 44,
    "protein": 1,
    "carbs": 10.5,
    "fat": 0.3,
    "keywords": [
      "nektarin",
      "nectarine"
    ]
  },
  {
    "id": "f274",
    "name": "Taze İncir",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 74,
    "protein": 0.8,
    "carbs": 19,
    "fat": 0.3,
    "keywords": [
      "incir",
      "taze",
      "fig",
      "i̇ncir"
    ]
  },
  {
    "id": "f275",
    "name": "Trabzon Hurması",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 70,
    "protein": 0.6,
    "carbs": 18.5,
    "fat": 0.2,
    "keywords": [
      "hurma",
      "trabzon",
      "cennet",
      "persimmon",
      "hurması",
      "hurmasi"
    ]
  },
  {
    "id": "f276",
    "name": "Nar",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 83,
    "protein": 1.7,
    "carbs": 19,
    "fat": 1.2,
    "keywords": [
      "nar",
      "pomegranate",
      "kirmizi"
    ]
  },
  {
    "id": "f277",
    "name": "Greyfurt",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 42,
    "protein": 0.8,
    "carbs": 11,
    "fat": 0.1,
    "keywords": [
      "greyfurt",
      "grapefruit",
      "aci",
      "diyet"
    ]
  },
  {
    "id": "f278",
    "name": "Limon",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 29,
    "protein": 1.1,
    "carbs": 9,
    "fat": 0.3,
    "keywords": [
      "limon",
      "lemon",
      "eksi",
      "salata"
    ]
  },
  {
    "id": "f279",
    "name": "Yaban Mersini",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 57,
    "protein": 0.7,
    "carbs": 14.5,
    "fat": 0.3,
    "keywords": [
      "yaban",
      "mersini",
      "blueberry",
      "antioksidan"
    ]
  },
  {
    "id": "f280",
    "name": "Ahududu",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 52,
    "protein": 1.2,
    "carbs": 12,
    "fat": 0.6,
    "keywords": [
      "ahududu",
      "frambuaz",
      "raspberry"
    ]
  },
  {
    "id": "f281",
    "name": "Böğürtlen",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 43,
    "protein": 1.4,
    "carbs": 9.6,
    "fat": 0.5,
    "keywords": [
      "bogurtlen",
      "böğürtlen",
      "blackberry"
    ]
  },
  {
    "id": "f282",
    "name": "Karadut",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 43,
    "protein": 1.4,
    "carbs": 9.8,
    "fat": 0.4,
    "keywords": [
      "karadut",
      "dut",
      "mulberry"
    ]
  },
  {
    "id": "f283",
    "name": "Çekirdeksiz İzmir Üzümü",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 69,
    "protein": 0.7,
    "carbs": 18,
    "fat": 0.2,
    "keywords": [
      "uzum",
      "üzüm",
      "grape",
      "yesil",
      "çekirdeksiz",
      "cekirdeksiz",
      "i̇zmir",
      "üzümü",
      "uzumu"
    ]
  },
  {
    "id": "f284",
    "name": "Kuru Kayısı",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 241,
    "protein": 3.4,
    "carbs": 62,
    "fat": 0.5,
    "keywords": [
      "kayisi",
      "kuru",
      "dried",
      "diyet",
      "kayısı"
    ]
  },
  {
    "id": "f285",
    "name": "Gün Kurusu Kayısı",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 250,
    "protein": 3.5,
    "carbs": 63,
    "fat": 0.4,
    "keywords": [
      "gun kurusu",
      "diyet",
      "kayisi",
      "gün",
      "gun",
      "kurusu",
      "kayısı"
    ]
  },
  {
    "id": "f286",
    "name": "Kuru Erik",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 240,
    "protein": 2.2,
    "carbs": 64,
    "fat": 0.4,
    "keywords": [
      "erik",
      "kuru",
      "dried",
      "prune"
    ]
  },
  {
    "id": "f287",
    "name": "Ananas (Taze)",
    "category": "Meyve",
    "servingGram": 100,
    "calories": 50,
    "protein": 0.5,
    "carbs": 13.1,
    "fat": 0.1,
    "keywords": [
      "ananas",
      "pineapple",
      "diyet",
      "taze"
    ]
  },
  {
    "id": "f288",
    "name": "Salatalık",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 15,
    "protein": 0.6,
    "carbs": 3.6,
    "fat": 0.1,
    "keywords": [
      "salatalik",
      "cucumber",
      "hiyar",
      "diyet",
      "su",
      "salatalık"
    ]
  },
  {
    "id": "f289",
    "name": "Sivri Biber",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 40,
    "protein": 2,
    "carbs": 9,
    "fat": 0.4,
    "keywords": [
      "biber",
      "sivri",
      "pepper",
      "yesil",
      "kahvalti"
    ]
  },
  {
    "id": "f290",
    "name": "Çarliston Biber",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 20,
    "protein": 0.9,
    "carbs": 4.6,
    "fat": 0.2,
    "keywords": [
      "biber",
      "carliston",
      "yesil",
      "çarliston"
    ]
  },
  {
    "id": "f291",
    "name": "Kırmızı Kapya Biber",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 31,
    "protein": 1,
    "carbs": 6,
    "fat": 0.3,
    "keywords": [
      "biber",
      "kapya",
      "kirmizi",
      "kozleme",
      "kırmızı"
    ]
  },
  {
    "id": "f292",
    "name": "Kabak",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 17,
    "protein": 1.2,
    "carbs": 3.1,
    "fat": 0.2,
    "keywords": [
      "kabak",
      "zucchini",
      "diyet",
      "sebze"
    ]
  },
  {
    "id": "f293",
    "name": "Semizotu",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 16,
    "protein": 1.3,
    "carbs": 3.4,
    "fat": 0.1,
    "keywords": [
      "semizotu",
      "purslane",
      "yogurtlu",
      "yesil"
    ]
  },
  {
    "id": "f294",
    "name": "Pazı",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 19,
    "protein": 1.8,
    "carbs": 3.7,
    "fat": 0.2,
    "keywords": [
      "pazi",
      "pazı",
      "yesillik",
      "sarma"
    ]
  },
  {
    "id": "f295",
    "name": "Sarımsak",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 149,
    "protein": 6.4,
    "carbs": 33,
    "fat": 0.5,
    "keywords": [
      "sarimsak",
      "garlic",
      "dogal antibiyotik",
      "sarımsak"
    ]
  },
  {
    "id": "f296",
    "name": "Kuru Soğan",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 40,
    "protein": 1.1,
    "carbs": 9.3,
    "fat": 0.1,
    "keywords": [
      "sogan",
      "soğan",
      "onion",
      "yemeklik",
      "kuru"
    ]
  },
  {
    "id": "f297",
    "name": "Taze Soğan",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 32,
    "protein": 1.8,
    "carbs": 7.3,
    "fat": 0.2,
    "keywords": [
      "sogan",
      "taze",
      "green onion",
      "soğan"
    ]
  },
  {
    "id": "f298",
    "name": "Havuç",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 41,
    "protein": 0.9,
    "carbs": 9.6,
    "fat": 0.2,
    "keywords": [
      "havuc",
      "havuç",
      "carrot",
      "goz"
    ]
  },
  {
    "id": "f299",
    "name": "Kırmızı Turp",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 16,
    "protein": 0.7,
    "carbs": 3.4,
    "fat": 0.1,
    "keywords": [
      "turp",
      "radish",
      "kirmizi",
      "salata",
      "kırmızı"
    ]
  },
  {
    "id": "f300",
    "name": "Şalgam Sebzesi",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 28,
    "protein": 0.9,
    "carbs": 6.4,
    "fat": 0.1,
    "keywords": [
      "salgam",
      "şalgam",
      "turp",
      "sebzesi"
    ]
  },
  {
    "id": "f301",
    "name": "Kırmızı Pancar",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 43,
    "protein": 1.6,
    "carbs": 9.6,
    "fat": 0.2,
    "keywords": [
      "pancar",
      "beetroot",
      "kirmizi",
      "tursu",
      "kırmızı"
    ]
  },
  {
    "id": "f302",
    "name": "Kereviz Sebzesi",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 16,
    "protein": 0.7,
    "carbs": 3,
    "fat": 0.2,
    "keywords": [
      "kereviz",
      "celery",
      "diyet",
      "sebzesi"
    ]
  },
  {
    "id": "f303",
    "name": "Yer Elması",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 73,
    "protein": 2,
    "carbs": 17.4,
    "fat": 0,
    "keywords": [
      "yer elmasi",
      "sebze",
      "inulin",
      "diyet",
      "yer",
      "elması",
      "elmasi"
    ]
  },
  {
    "id": "f304",
    "name": "Kuşkonmaz",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 20,
    "protein": 2.2,
    "carbs": 3.9,
    "fat": 0.1,
    "keywords": [
      "kuskonmaz",
      "kuşkonmaz",
      "aspargus",
      "izgara",
      "diyet"
    ]
  },
  {
    "id": "f305",
    "name": "Karnabahar",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 25,
    "protein": 1.9,
    "carbs": 5,
    "fat": 0.3,
    "keywords": [
      "karnabahar",
      "cauliflower",
      "sebze",
      "haslama"
    ]
  },
  {
    "id": "f306",
    "name": "Brüksel Lahanası",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 43,
    "protein": 3.4,
    "carbs": 9,
    "fat": 0.3,
    "keywords": [
      "bruksel",
      "brüksel",
      "lahana",
      "diyet",
      "lahanası",
      "lahanasi"
    ]
  },
  {
    "id": "f307",
    "name": "Kültür Mantarı",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 22,
    "protein": 3.1,
    "carbs": 3.3,
    "fat": 0.3,
    "keywords": [
      "mantar",
      "mushroom",
      "sote",
      "protein",
      "kültür",
      "kultur",
      "mantarı",
      "mantari"
    ]
  },
  {
    "id": "f308",
    "name": "İstiridye Mantarı",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 33,
    "protein": 3.3,
    "carbs": 6,
    "fat": 0.4,
    "keywords": [
      "mantar",
      "istiridye",
      "kayin",
      "sote",
      "i̇stiridye",
      "mantarı",
      "mantari"
    ]
  },
  {
    "id": "f309",
    "name": "Roka",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 25,
    "protein": 2.6,
    "carbs": 3.7,
    "fat": 0.7,
    "keywords": [
      "roka",
      "arugula",
      "salata",
      "balik"
    ]
  },
  {
    "id": "f310",
    "name": "Maydanoz",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 36,
    "protein": 3,
    "carbs": 6.3,
    "fat": 0.8,
    "keywords": [
      "maydanoz",
      "parsley",
      "limonlu",
      "diyet"
    ]
  },
  {
    "id": "f311",
    "name": "Dereotu",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 43,
    "protein": 3.5,
    "carbs": 7,
    "fat": 1.1,
    "keywords": [
      "dereotu",
      "dill",
      "kabak",
      "salata"
    ]
  },
  {
    "id": "f312",
    "name": "Nane",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 44,
    "protein": 3.3,
    "carbs": 8.4,
    "fat": 0.7,
    "keywords": [
      "nane",
      "mint",
      "ferah",
      "salata"
    ]
  },
  {
    "id": "f313",
    "name": "Tere Yeşilliği",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 32,
    "protein": 2.6,
    "carbs": 5.5,
    "fat": 0.7,
    "keywords": [
      "tere",
      "cress",
      "acimsi",
      "limonlu",
      "yeşilliği",
      "yesilligi"
    ]
  },
  {
    "id": "f314",
    "name": "Enginar Kalbi",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 47,
    "protein": 3,
    "carbs": 10.5,
    "fat": 0.2,
    "keywords": [
      "enginar",
      "artichoke",
      "diyet",
      "kalbi"
    ]
  },
  {
    "id": "f315",
    "name": "Ispanak (Çiğ)",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 23,
    "protein": 2.9,
    "carbs": 3.6,
    "fat": 0.4,
    "keywords": [
      "ispanak",
      "spinach",
      "demir",
      "temel reis",
      "çiğ",
      "cig"
    ]
  },
  {
    "id": "f316",
    "name": "Kereviz Sapı",
    "category": "Sebze",
    "servingGram": 100,
    "calories": 14,
    "protein": 0.7,
    "carbs": 3,
    "fat": 0.1,
    "keywords": [
      "kereviz",
      "sap",
      "detoks",
      "diyet",
      "sapı",
      "sapi"
    ]
  },
  {
    "id": "f317",
    "name": "Erişte (Ev Yapımı)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 165,
    "protein": 5.5,
    "carbs": 31,
    "fat": 1.8,
    "keywords": [
      "eriste",
      "erişte",
      "makarna",
      "hamur",
      "yapımı",
      "yapimi"
    ]
  },
  {
    "id": "f318",
    "name": "Milföy Hamuru",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 558,
    "protein": 6.5,
    "carbs": 46,
    "fat": 38,
    "keywords": [
      "milfoy",
      "milföy",
      "hamur",
      "katmer",
      "hamuru"
    ]
  },
  {
    "id": "f319",
    "name": "Kuskus Makarna",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 112,
    "protein": 3.8,
    "carbs": 23,
    "fat": 0.2,
    "keywords": [
      "kuskus",
      "couscous",
      "makarna"
    ]
  },
  {
    "id": "f320",
    "name": "Siyez Bulguru",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 130,
    "protein": 4.8,
    "carbs": 26,
    "fat": 0.8,
    "keywords": [
      "siyez",
      "bulgurlu",
      "grain",
      "bulguru"
    ]
  },
  {
    "id": "f321",
    "name": "Kepekli Makarna",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 120,
    "protein": 4.8,
    "carbs": 24,
    "fat": 0.8,
    "keywords": [
      "kepekli",
      "makarna",
      "diyet",
      "lif"
    ]
  },
  {
    "id": "f322",
    "name": "Glutensiz Makarna",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 125,
    "protein": 2.4,
    "carbs": 28,
    "fat": 0.5,
    "keywords": [
      "glutensiz",
      "gluten-free",
      "makarna",
      "pirinc",
      "misir"
    ]
  },
  {
    "id": "f323",
    "name": "Pirinç Unu",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 360,
    "protein": 6,
    "carbs": 80,
    "fat": 1.4,
    "keywords": [
      "pirinc",
      "pirinç",
      "un",
      "bebek",
      "mama",
      "unu"
    ]
  },
  {
    "id": "f324",
    "name": "Mutfak Unu (Buğday)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 364,
    "protein": 10.3,
    "carbs": 76,
    "fat": 1,
    "keywords": [
      "un",
      "bugday",
      "wheat",
      "flour",
      "mutfak",
      "unu",
      "buğday"
    ]
  },
  {
    "id": "f325",
    "name": "Kedidili Bisküvi",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 390,
    "protein": 8,
    "carbs": 81,
    "fat": 3.8,
    "keywords": [
      "kedidili",
      "bisküvi",
      "biskuvi",
      "tiramisu",
      "tatli"
    ]
  },
  {
    "id": "f326",
    "name": "Etimek (Sade)",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 380,
    "protein": 11,
    "carbs": 75,
    "fat": 3.5,
    "keywords": [
      "etimek",
      "peksimet",
      "kuru ekmek",
      "diyet",
      "sade"
    ]
  },
  {
    "id": "f327",
    "name": "Mısır Unu",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 362,
    "protein": 8.1,
    "carbs": 77,
    "fat": 3.6,
    "keywords": [
      "misir",
      "mısır",
      "un",
      "kuymak",
      "unu"
    ]
  },
  {
    "id": "f328",
    "name": "Kastamonu Siyez Unu",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 340,
    "protein": 12,
    "carbs": 65,
    "fat": 2.5,
    "keywords": [
      "siyez",
      "un",
      "organik",
      "atalik",
      "kastamonu",
      "unu"
    ]
  },
  {
    "id": "f329",
    "name": "Arpa Şehriye",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 358,
    "protein": 11,
    "carbs": 74,
    "fat": 1.5,
    "keywords": [
      "arpa",
      "sehriye",
      "çorba",
      "corba",
      "pilav",
      "şehriye"
    ]
  },
  {
    "id": "f330",
    "name": "Tel Şehriye",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 358,
    "protein": 11,
    "carbs": 74,
    "fat": 1.5,
    "keywords": [
      "tel",
      "sehriye",
      "çorba",
      "corba",
      "şehriye"
    ]
  },
  {
    "id": "f331",
    "name": "Karabuğday",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 118,
    "protein": 4.3,
    "carbs": 21.5,
    "fat": 1.1,
    "keywords": [
      "karabugday",
      "grecka",
      "haşlama",
      "haslama",
      "diyet",
      "karabuğday"
    ]
  },
  {
    "id": "f332",
    "name": "Kinoa",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 120,
    "protein": 4.4,
    "carbs": 21.3,
    "fat": 1.9,
    "keywords": [
      "kinoa",
      "quinoa",
      "diyet",
      "superfood"
    ]
  },
  {
    "id": "f333",
    "name": "Pirinç Patlağı",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 385,
    "protein": 8.2,
    "carbs": 83,
    "fat": 1.5,
    "keywords": [
      "pirinc",
      "patlak",
      "rice cake",
      "diyet",
      "pirinç",
      "patlağı",
      "patlagi"
    ]
  },
  {
    "id": "f334",
    "name": "Mısır Ekmeği",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 268,
    "protein": 7,
    "carbs": 48,
    "fat": 4.8,
    "keywords": [
      "misir",
      "mısır",
      "ekmek",
      "karadeniz",
      "ekmeği",
      "ekmegi"
    ]
  },
  {
    "id": "f335",
    "name": "Kepekli Ekmek",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 230,
    "protein": 9.2,
    "carbs": 43,
    "fat": 2,
    "keywords": [
      "kepekli",
      "ekmek",
      "fiber",
      "diyet"
    ]
  },
  {
    "id": "f336",
    "name": "Patates Püresi",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 110,
    "protein": 2,
    "carbs": 18,
    "fat": 3.5,
    "keywords": [
      "patates",
      "pure",
      "sade",
      "garnitur",
      "püresi",
      "puresi"
    ]
  },
  {
    "id": "f337",
    "name": "İrmik",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 360,
    "protein": 12,
    "carbs": 73,
    "fat": 1,
    "keywords": [
      "irmik",
      "semolina",
      "tatli",
      "helva",
      "i̇rmik"
    ]
  },
  {
    "id": "f338",
    "name": "Yulaf Kepeği",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 246,
    "protein": 17,
    "carbs": 66,
    "fat": 7,
    "keywords": [
      "yulaf",
      "kepek",
      "bran",
      "diyet",
      "lif",
      "kepeği",
      "kepegi"
    ]
  },
  {
    "id": "f339",
    "name": "Tam Çavdar Unu",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 336,
    "protein": 10.2,
    "carbs": 70,
    "fat": 1.8,
    "keywords": [
      "cavdar",
      "un",
      "rye flour",
      "esmer",
      "tam",
      "çavdar",
      "unu"
    ]
  },
  {
    "id": "f340",
    "name": "Peksimet",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 395,
    "protein": 11.5,
    "carbs": 76,
    "fat": 4.5,
    "keywords": [
      "peksimet",
      "kuru",
      "ekmek",
      "gevrek"
    ]
  },
  {
    "id": "f341",
    "name": "Tombik Ekmek",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 265,
    "protein": 8.8,
    "carbs": 54,
    "fat": 1.8,
    "keywords": [
      "tombik",
      "ekmek",
      "doner",
      "sandvic"
    ]
  },
  {
    "id": "f342",
    "name": "Sarı Buğday Ekmeği",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 248,
    "protein": 10.5,
    "carbs": 46,
    "fat": 2.4,
    "keywords": [
      "sari",
      "bugday",
      "ekmek",
      "geleneksel",
      "sarı",
      "buğday",
      "ekmeği",
      "ekmegi"
    ]
  },
  {
    "id": "f343",
    "name": "Siyez Ekmeği",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 235,
    "protein": 11.2,
    "carbs": 42,
    "fat": 2.8,
    "keywords": [
      "siyez",
      "ekmek",
      "atalik",
      "diyet",
      "ekmeği",
      "ekmegi"
    ]
  },
  {
    "id": "f344",
    "name": "Patates Nişastası",
    "category": "Karbonhidrat",
    "servingGram": 100,
    "calories": 335,
    "protein": 0.1,
    "carbs": 83,
    "fat": 0.1,
    "keywords": [
      "patates",
      "nisasta",
      "gluten free",
      "nişastası",
      "nisastasi"
    ]
  },
  {
    "id": "f345",
    "name": "Kavrulmuş Fındık",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 646,
    "protein": 15,
    "carbs": 17.5,
    "fat": 62.2,
    "keywords": [
      "findik",
      "hazrulmus",
      "kavrulmuş",
      "kavrulmus",
      "giresun",
      "fındık"
    ]
  },
  {
    "id": "f346",
    "name": "Tuzlu Fıstık",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 585,
    "protein": 24,
    "carbs": 21,
    "fat": 48,
    "keywords": [
      "fistik",
      "fıstık",
      "yer fıstığı",
      "yer fistigi",
      "tuzlu"
    ]
  },
  {
    "id": "f347",
    "name": "Antep Fıstığı",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 560,
    "protein": 20,
    "carbs": 27,
    "fat": 45,
    "keywords": [
      "antep",
      "fistigi",
      "fıstık",
      "fistik",
      "yeşil",
      "yesil",
      "gaziantep",
      "fıstığı"
    ]
  },
  {
    "id": "f348",
    "name": "Kabak Çekirdeği",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 559,
    "protein": 30.2,
    "carbs": 10.7,
    "fat": 49,
    "keywords": [
      "kabak",
      "cekirdek",
      "protein",
      "çinko",
      "cinko",
      "çekirdeği",
      "cekirdegi"
    ]
  },
  {
    "id": "f349",
    "name": "Tuzlu Ay Çekirdeği",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 584,
    "protein": 21,
    "carbs": 20,
    "fat": 51.5,
    "keywords": [
      "cekirdek",
      "ay",
      "günebakan",
      "gunebakan",
      "tuzlu",
      "çekirdeği",
      "cekirdegi"
    ]
  },
  {
    "id": "f350",
    "name": "Soslu Mısır",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 440,
    "protein": 7.5,
    "carbs": 72,
    "fat": 12.5,
    "keywords": [
      "misir",
      "soslu",
      "cips",
      "atiştirmalik",
      "atistirmalik",
      "mısır"
    ]
  },
  {
    "id": "f351",
    "name": "Beyaz Leblebi",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 360,
    "protein": 20,
    "carbs": 57,
    "fat": 4.5,
    "keywords": [
      "leblebi",
      "beyaz",
      "mide"
    ]
  },
  {
    "id": "f352",
    "name": "Brezilya Cevizi",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 656,
    "protein": 14.3,
    "carbs": 12.3,
    "fat": 66.4,
    "keywords": [
      "brezilya",
      "cevizi",
      "selenyum"
    ]
  },
  {
    "id": "f353",
    "name": "Pikan Cevizi",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 690,
    "protein": 9.2,
    "carbs": 13.9,
    "fat": 72,
    "keywords": [
      "pican",
      "pikan",
      "cevizi"
    ]
  },
  {
    "id": "f354",
    "name": "Kestane Kebap",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 200,
    "protein": 3.2,
    "carbs": 44,
    "fat": 2.2,
    "keywords": [
      "kestane",
      "firin",
      "kesanekebap",
      "atiştirmalik",
      "atistirmalik",
      "kebap"
    ]
  },
  {
    "id": "f355",
    "name": "Çam Fıstığı",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 673,
    "protein": 13.7,
    "carbs": 13.1,
    "fat": 68.4,
    "keywords": [
      "cam",
      "fistigi",
      "pilavlik",
      "çam",
      "fıstığı"
    ]
  },
  {
    "id": "f356",
    "name": "Kavrulmuş Leblebi",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 375,
    "protein": 19.5,
    "carbs": 59,
    "fat": 5.5,
    "keywords": [
      "leblebi",
      "corum",
      "kavrulmus",
      "kavrulmuş"
    ]
  },
  {
    "id": "f357",
    "name": "Yer Fıstığı (Doğal)",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 567,
    "protein": 25.8,
    "carbs": 16.1,
    "fat": 49.2,
    "keywords": [
      "fistik",
      "yerfistigi",
      "diyet",
      "sporcu",
      "yer",
      "fıstığı",
      "fistigi",
      "doğal",
      "dogal"
    ]
  },
  {
    "id": "f358",
    "name": "Macadamia Fındığı",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 718,
    "protein": 7.9,
    "carbs": 13.8,
    "fat": 75.8,
    "keywords": [
      "macadamia",
      "yagli",
      "findik",
      "fındığı",
      "findigi"
    ]
  },
  {
    "id": "f359",
    "name": "Kaju (Kavrulmuş)",
    "category": "Kuruyemiş",
    "servingGram": 100,
    "calories": 574,
    "protein": 15.3,
    "carbs": 32.7,
    "fat": 46.4,
    "keywords": [
      "kaju",
      "kavrulmus",
      "tuzsuz",
      "kavrulmuş"
    ]
  },
  {
    "id": "f360",
    "name": "Zeytinyağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "zeytinyagi",
      "olive",
      "oil",
      "sizma",
      "saglikli",
      "zeytinyağı"
    ]
  },
  {
    "id": "f361",
    "name": "Tereyağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 717,
    "protein": 0.9,
    "carbs": 0.1,
    "fat": 81,
    "keywords": [
      "tereyagi",
      "butter",
      "yemeklik",
      "kahvalti",
      "tereyağı"
    ]
  },
  {
    "id": "f362",
    "name": "Margarin",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 717,
    "protein": 0.2,
    "carbs": 0.9,
    "fat": 81,
    "keywords": [
      "margarin",
      "yağ",
      "yag"
    ]
  },
  {
    "id": "f363",
    "name": "Hindistan Cevizi Yağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 862,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "coconut",
      "oil",
      "hindistan",
      "cevizi",
      "yağ",
      "yag",
      "yağı",
      "yagi"
    ]
  },
  {
    "id": "f364",
    "name": "Ayçiçek Yağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "aycicek",
      "sunflower",
      "oil",
      "kizartma",
      "ayçiçek",
      "yağı",
      "yagi"
    ]
  },
  {
    "id": "f365",
    "name": "Avokado Yağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "avokado",
      "yaği",
      "yagi",
      "avocado oil",
      "yağı"
    ]
  },
  {
    "id": "f366",
    "name": "Susam Yağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "susam",
      "yaği",
      "yagi",
      "sesame oil",
      "yağı"
    ]
  },
  {
    "id": "f367",
    "name": "Kabak Çekirdeği Yağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "kabak",
      "cekirdegi",
      "yaği",
      "yagi",
      "çekirdeği",
      "yağı"
    ]
  },
  {
    "id": "f368",
    "name": "Fındık Yağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "findik",
      "yaği",
      "yagi",
      "hazelnut oil",
      "fındık",
      "yağı"
    ]
  },
  {
    "id": "f369",
    "name": "Mısırözü Yağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "misirozu",
      "corn oil",
      "kizartma",
      "mısırözü",
      "yağı",
      "yagi"
    ]
  },
  {
    "id": "f370",
    "name": "Kanola Yağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "kanola",
      "canola oil",
      "yağı",
      "yagi"
    ]
  },
  {
    "id": "f371",
    "name": "Truffle Yağı",
    "category": "Yağ",
    "servingGram": 100,
    "calories": 884,
    "protein": 0,
    "carbs": 0,
    "fat": 100,
    "keywords": [
      "truffle",
      "mantar",
      "gurme",
      "yağı",
      "yagi"
    ]
  },
  {
    "id": "f372",
    "name": "Cheeseburger",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 320,
    "protein": 15,
    "carbs": 24,
    "fat": 16,
    "keywords": [
      "cheeseburger",
      "peynirli",
      "burger"
    ]
  },
  {
    "id": "f373",
    "name": "Soğan Halkası",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 275,
    "protein": 3.5,
    "carbs": 33,
    "fat": 14,
    "keywords": [
      "sogan",
      "halkasi",
      "onion rings",
      "citir",
      "soğan",
      "halkası"
    ]
  },
  {
    "id": "f374",
    "name": "Tavuk Nugget",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 290,
    "protein": 15,
    "carbs": 16,
    "fat": 18,
    "keywords": [
      "nugget",
      "tavuk",
      "kizartma",
      "fastfood"
    ]
  },
  {
    "id": "f375",
    "name": "Sosisli Sandviç",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 250,
    "protein": 10.5,
    "carbs": 22,
    "fat": 13.5,
    "keywords": [
      "sosisli",
      "sandvic",
      "hotdog",
      "ekmek",
      "sandviç"
    ]
  },
  {
    "id": "f376",
    "name": "Kumru Sandviç",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 340,
    "protein": 14.5,
    "carbs": 26,
    "fat": 20,
    "keywords": [
      "kumru",
      "cesme",
      "izmir",
      "sosis",
      "salam",
      "kasar",
      "sandviç",
      "sandvic"
    ]
  },
  {
    "id": "f377",
    "name": "Yengen Sandviç",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 310,
    "protein": 13.8,
    "carbs": 24,
    "fat": 17.5,
    "keywords": [
      "yengen",
      "tost",
      "sandviç",
      "sandvic"
    ]
  },
  {
    "id": "f378",
    "name": "Ayvalık Tostu",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 285,
    "protein": 11,
    "carbs": 32,
    "fat": 12,
    "keywords": [
      "ayvalik",
      "tost",
      "karisik",
      "sosis",
      "sayas",
      "ayvalık",
      "tostu"
    ]
  },
  {
    "id": "f379",
    "name": "Islak Hamburger",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 260,
    "protein": 11,
    "carbs": 28,
    "fat": 11,
    "keywords": [
      "islak",
      "hamburger",
      "soslu",
      "taksim"
    ]
  },
  {
    "id": "f380",
    "name": "Kokoreç (Yarım Ekmek)",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 280,
    "protein": 14,
    "carbs": 22,
    "fat": 15,
    "keywords": [
      "kokorec",
      "kokoreç",
      "sakatat",
      "baharatli",
      "yarım",
      "yarim",
      "ekmek"
    ]
  },
  {
    "id": "f381",
    "name": "Midye Dolma",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 175,
    "protein": 9,
    "carbs": 25,
    "fat": 3.8,
    "keywords": [
      "midye",
      "dolma",
      "pirincli",
      "limonlu"
    ]
  },
  {
    "id": "f382",
    "name": "Tantuni (Lavaş)",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 240,
    "protein": 13,
    "carbs": 22,
    "fat": 11,
    "keywords": [
      "tantuni",
      "mersin",
      "lavaş",
      "lavas",
      "dürüm",
      "durum",
      "et"
    ]
  },
  {
    "id": "f383",
    "name": "Lavaş Çiğ Köfte",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 220,
    "protein": 4.5,
    "carbs": 38,
    "fat": 4.8,
    "keywords": [
      "cig kofte",
      "durum",
      "lavaş",
      "lavas",
      "etsiz",
      "limon",
      "çiğ",
      "cig",
      "köfte",
      "kofte"
    ]
  },
  {
    "id": "f384",
    "name": "Falafel Dürüm",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 232,
    "protein": 6.8,
    "carbs": 30,
    "fat": 9.2,
    "keywords": [
      "falafel",
      "dürüm",
      "durum",
      "lavaş",
      "lavas",
      "nohut",
      "vegan"
    ]
  },
  {
    "id": "f385",
    "name": "Pideli Köfte",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 220,
    "protein": 13.5,
    "carbs": 18,
    "fat": 11.2,
    "keywords": [
      "pideli",
      "köfte",
      "kofte",
      "bursa",
      "tereyagli"
    ]
  },
  {
    "id": "f386",
    "name": "Tavuk Döner Dürüm",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 210,
    "protein": 14.5,
    "carbs": 22,
    "fat": 7.5,
    "keywords": [
      "tavuk dener",
      "dürüm",
      "durum",
      "lavaş",
      "lavas",
      "fastfood",
      "tavuk",
      "döner",
      "doner"
    ]
  },
  {
    "id": "f387",
    "name": "Tombik Döner (Et)",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 250,
    "protein": 16,
    "carbs": 24,
    "fat": 10,
    "keywords": [
      "tombik",
      "döner",
      "doner",
      "et",
      "ekmek"
    ]
  },
  {
    "id": "f388",
    "name": "Balık Ekmek",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 220,
    "protein": 12,
    "carbs": 24,
    "fat": 8.2,
    "keywords": [
      "balik",
      "ekmek",
      "uskumru",
      "eminönü",
      "eminonu",
      "sandviç",
      "sandvic",
      "balık"
    ]
  },
  {
    "id": "f389",
    "name": "Yarım Ekmek Köfte",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 240,
    "protein": 13,
    "carbs": 26,
    "fat": 9.5,
    "keywords": [
      "kofte",
      "ekmek",
      "sokak",
      "köfte",
      "yarım",
      "yarim"
    ]
  },
  {
    "id": "f390",
    "name": "Tavuk Şiş Dürüm",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 210,
    "protein": 16,
    "carbs": 22,
    "fat": 6.5,
    "keywords": [
      "tavuk",
      "sis",
      "dürüm",
      "durum",
      "lavaş",
      "lavas",
      "şiş"
    ]
  },
  {
    "id": "f391",
    "name": "Kaşarlı Menemen Tostu",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 280,
    "protein": 11,
    "carbs": 33,
    "fat": 11.5,
    "keywords": [
      "tost",
      "menemen",
      "kaşar",
      "kasar",
      "kahvalti",
      "kaşarlı",
      "kasarli",
      "tostu"
    ]
  },
  {
    "id": "f392",
    "name": "Kaşarlı Sucuklu Tost",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 310,
    "protein": 14,
    "carbs": 31,
    "fat": 14.5,
    "keywords": [
      "tost",
      "sucuklu",
      "kaşarlı",
      "kasarli",
      "tostu"
    ]
  },
  {
    "id": "f393",
    "name": "Salçalı Büfe Tostu",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 265,
    "protein": 9,
    "carbs": 35,
    "fat": 9.2,
    "keywords": [
      "tost",
      "salçalı",
      "salcali",
      "büfe",
      "bufe",
      "ayvalik",
      "tostu"
    ]
  },
  {
    "id": "f394",
    "name": "Tavuk Burger",
    "category": "Fast Food",
    "servingGram": 100,
    "calories": 275,
    "protein": 12,
    "carbs": 28,
    "fat": 12,
    "keywords": [
      "tavuk",
      "burger",
      "chicken",
      "citir"
    ]
  },
  {
    "id": "f395",
    "name": "Siyah Çay (Şekersiz)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 1,
    "protein": 0.1,
    "carbs": 0.2,
    "fat": 0,
    "keywords": [
      "cay",
      "çay",
      "siyah çay",
      "siyah cay",
      "demleme",
      "şekersiz",
      "sekersiz",
      "siyah"
    ]
  },
  {
    "id": "f396",
    "name": "Siyah Çay (Süzme Şekerli)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 16,
    "protein": 0.1,
    "carbs": 4,
    "fat": 0,
    "keywords": [
      "cay",
      "çay",
      "şekerli",
      "sekerli",
      "siyah",
      "süzme",
      "suzme"
    ]
  },
  {
    "id": "f397",
    "name": "Yeşil Çay",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 2,
    "protein": 0.1,
    "carbs": 0.2,
    "fat": 0,
    "keywords": [
      "green tea",
      "yesil",
      "cay",
      "diyet",
      "antioksidan",
      "yeşil",
      "çay"
    ]
  },
  {
    "id": "f398",
    "name": "Türk Kahvesi (Sade)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 2,
    "protein": 0.2,
    "carbs": 0.2,
    "fat": 0.1,
    "keywords": [
      "turk",
      "kahvesi",
      "sade",
      "şekersiz",
      "sekersiz",
      "turkish coffee",
      "türk"
    ]
  },
  {
    "id": "f399",
    "name": "Türk Kahvesi (Orta)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 25,
    "protein": 0.2,
    "carbs": 5.8,
    "fat": 0.1,
    "keywords": [
      "turk",
      "kahvesi",
      "orta",
      "şekerli",
      "sekerli",
      "türk"
    ]
  },
  {
    "id": "f400",
    "name": "Filtre Kahve (Sade)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 2,
    "protein": 0.2,
    "carbs": 0.1,
    "fat": 0,
    "keywords": [
      "filtre",
      "kahve",
      "sade",
      "black coffee"
    ]
  },
  {
    "id": "f401",
    "name": "Americano",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 2,
    "protein": 0.1,
    "carbs": 0.1,
    "fat": 0,
    "keywords": [
      "americano",
      "espresso",
      "kahve"
    ]
  },
  {
    "id": "f402",
    "name": "Caffe Latte",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 45,
    "protein": 2.5,
    "carbs": 4.2,
    "fat": 1.8,
    "keywords": [
      "latte",
      "sütlü",
      "sutlu",
      "kahve",
      "caffe"
    ]
  },
  {
    "id": "f403",
    "name": "Cappuccino",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 48,
    "protein": 2.6,
    "carbs": 4.5,
    "fat": 2,
    "keywords": [
      "cappuccino",
      "köpüklü",
      "kopuklu",
      "kahve"
    ]
  },
  {
    "id": "f404",
    "name": "Flat White",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 42,
    "protein": 2.4,
    "carbs": 4,
    "fat": 1.8,
    "keywords": [
      "flat white",
      "kahve",
      "flat",
      "white"
    ]
  },
  {
    "id": "f405",
    "name": "Caffe Mocha",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 95,
    "protein": 3.2,
    "carbs": 14,
    "fat": 2.8,
    "keywords": [
      "mocha",
      "çikolatalı",
      "cikolatali",
      "sütlü",
      "sutlu",
      "kahve",
      "caffe"
    ]
  },
  {
    "id": "f406",
    "name": "Sıcak Çikolata",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 85,
    "protein": 3.2,
    "carbs": 12,
    "fat": 2.5,
    "keywords": [
      "sicak",
      "cikolata",
      "tatli",
      "sıcak",
      "çikolata"
    ]
  },
  {
    "id": "f407",
    "name": "Soğuk Çay (Şeftalili)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 34,
    "protein": 0,
    "carbs": 8.5,
    "fat": 0,
    "keywords": [
      "ice tea",
      "soguk cay",
      "seftali",
      "tatli",
      "soğuk",
      "soguk",
      "çay",
      "cay",
      "şeftalili",
      "seftalili"
    ]
  },
  {
    "id": "f408",
    "name": "Soğuk Çay (Limonlu)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 33,
    "protein": 0,
    "carbs": 8.2,
    "fat": 0,
    "keywords": [
      "ice tea",
      "soguk cay",
      "limon",
      "tatli",
      "soğuk",
      "soguk",
      "çay",
      "cay",
      "limonlu"
    ]
  },
  {
    "id": "f409",
    "name": "Ev Yapımı Limonata",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 40,
    "protein": 0.1,
    "carbs": 9.8,
    "fat": 0.1,
    "keywords": [
      "limonata",
      "sekersiz",
      "ferah",
      "yaz",
      "yapımı",
      "yapimi"
    ]
  },
  {
    "id": "f410",
    "name": "Şalgam Suyu (Acılı)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 12,
    "protein": 0.5,
    "carbs": 2,
    "fat": 0.1,
    "keywords": [
      "salgam",
      "acili",
      "adana",
      "fermente",
      "şalgam",
      "suyu",
      "acılı"
    ]
  },
  {
    "id": "f411",
    "name": "Şalgam Suyu (Acısız)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 12,
    "protein": 0.5,
    "carbs": 2,
    "fat": 0.1,
    "keywords": [
      "salgam",
      "acisiz",
      "adana",
      "fermente",
      "şalgam",
      "suyu",
      "acısız"
    ]
  },
  {
    "id": "f412",
    "name": "Sade Maden Suyu",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "soda",
      "madensuyu",
      "mineralli",
      "sade",
      "maden",
      "suyu"
    ]
  },
  {
    "id": "f413",
    "name": "Meyveli Soda (Limonlu)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 38,
    "protein": 0,
    "carbs": 9.5,
    "fat": 0,
    "keywords": [
      "soda",
      "limonlu",
      "meyveli"
    ]
  },
  {
    "id": "f414",
    "name": "Kola Klasik",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 42,
    "protein": 0,
    "carbs": 10.6,
    "fat": 0,
    "keywords": [
      "cola",
      "kola",
      "gazli",
      "şekerli",
      "sekerli",
      "klasik"
    ]
  },
  {
    "id": "f415",
    "name": "Kola Şekersiz",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 0.3,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "cola zero",
      "sekersiz",
      "diyet",
      "asitli",
      "kola",
      "şekersiz"
    ]
  },
  {
    "id": "f416",
    "name": "Enerji İçeceği",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 45,
    "protein": 0,
    "carbs": 11.2,
    "fat": 0,
    "keywords": [
      "enerji",
      "energy",
      "taurin",
      "kafein",
      "i̇çeceği",
      "i̇cecegi"
    ]
  },
  {
    "id": "f417",
    "name": "Taze Portakal Suyu",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 45,
    "protein": 0.7,
    "carbs": 10.4,
    "fat": 0.2,
    "keywords": [
      "portakal",
      "juice",
      "taze",
      "vitamin",
      "suyu"
    ]
  },
  {
    "id": "f418",
    "name": "Elma Suyu (Taze)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 46,
    "protein": 0.1,
    "carbs": 11.3,
    "fat": 0.1,
    "keywords": [
      "elma",
      "suyu",
      "apple juice",
      "taze"
    ]
  },
  {
    "id": "f419",
    "name": "Nar Suyu (Taze)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 54,
    "protein": 0.2,
    "carbs": 13,
    "fat": 0.3,
    "keywords": [
      "nar",
      "suyu",
      "pomegranate juice",
      "taze"
    ]
  },
  {
    "id": "f420",
    "name": "Rezene Çayı",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 1,
    "protein": 0.1,
    "carbs": 0.1,
    "fat": 0,
    "keywords": [
      "rezene",
      "cay",
      "bitki",
      "çayı",
      "cayi"
    ]
  },
  {
    "id": "f421",
    "name": "Papatya Çayı",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 1,
    "protein": 0.1,
    "carbs": 0.1,
    "fat": 0,
    "keywords": [
      "papatya",
      "bitki",
      "sakinlestirici",
      "çayı",
      "cayi"
    ]
  },
  {
    "id": "f422",
    "name": "Soğuk Kahve (Sade)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 3,
    "protein": 0.2,
    "carbs": 0.1,
    "fat": 0,
    "keywords": [
      "cold brew",
      "kahve",
      "sooguk",
      "soğuk",
      "soguk",
      "sade"
    ]
  },
  {
    "id": "f423",
    "name": "Domates Suyu",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 17,
    "protein": 0.8,
    "carbs": 3.5,
    "fat": 0.1,
    "keywords": [
      "domates",
      "suyu",
      "diyet"
    ]
  },
  {
    "id": "f424",
    "name": "Kefir (Meyveli)",
    "category": "İçecek",
    "servingGram": 100,
    "calories": 75,
    "protein": 2.8,
    "carbs": 12,
    "fat": 1.8,
    "keywords": [
      "kefir",
      "meyveli",
      "cilek"
    ]
  },
  {
    "id": "f425",
    "name": "Fıstıklı Baklava",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 410,
    "protein": 6.2,
    "carbs": 52,
    "fat": 20,
    "keywords": [
      "baklava",
      "fistikli",
      "serbetli",
      "tatli",
      "antep",
      "fıstıklı"
    ]
  },
  {
    "id": "f426",
    "name": "Künefe",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 350,
    "protein": 8.5,
    "carbs": 48,
    "fat": 14.5,
    "keywords": [
      "kunefe",
      "künefe",
      "peynirli",
      "antep",
      "hatay",
      "serbetli"
    ]
  },
  {
    "id": "f427",
    "name": "Şöbiyet",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 420,
    "protein": 5.8,
    "carbs": 50,
    "fat": 22,
    "keywords": [
      "sobiyet",
      "serbetli",
      "fistikli",
      "kaymakli",
      "şöbiyet"
    ]
  },
  {
    "id": "f428",
    "name": "Tulumba Tatlısı",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 335,
    "protein": 3.2,
    "carbs": 52,
    "fat": 12.8,
    "keywords": [
      "tulumba",
      "citir",
      "serbetli",
      "tatlısı",
      "tatlisi"
    ]
  },
  {
    "id": "f429",
    "name": "Kemalpaşa Tatlısı",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 280,
    "protein": 4.2,
    "carbs": 58,
    "fat": 3.5,
    "keywords": [
      "kemalpasa",
      "şerbetli",
      "serbetli",
      "kemalpaşa",
      "tatlısı",
      "tatlisi"
    ]
  },
  {
    "id": "f430",
    "name": "Şekerpare",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 320,
    "protein": 4,
    "carbs": 56,
    "fat": 9,
    "keywords": [
      "sekerpare",
      "şekerpare",
      "kurabiye",
      "serbetli"
    ]
  },
  {
    "id": "f431",
    "name": "Revani (Sade)",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 310,
    "protein": 5.2,
    "carbs": 58,
    "fat": 6.5,
    "keywords": [
      "revani",
      "irmik",
      "serbetli",
      "sade"
    ]
  },
  {
    "id": "f432",
    "name": "Ekmek Kadayıfı",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 295,
    "protein": 3.8,
    "carbs": 65,
    "fat": 2,
    "keywords": [
      "ekmek",
      "kadayif",
      "serbetli",
      "kaymakli",
      "kadayıfı",
      "kadayifi"
    ]
  },
  {
    "id": "f433",
    "name": "Muhallebi (Sade)",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 120,
    "protein": 3.2,
    "carbs": 18,
    "fat": 3.8,
    "keywords": [
      "muhallebi",
      "sütlü tatli",
      "sutlu tatli",
      "hafif",
      "sade"
    ]
  },
  {
    "id": "f434",
    "name": "Tavukgöğsü Tatlısı",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 130,
    "protein": 6.2,
    "carbs": 21,
    "fat": 2.5,
    "keywords": [
      "tavukgogsu",
      "tatli",
      "sütlü tatli",
      "sutlu tatli",
      "tavukgöğsü",
      "tatlısı",
      "tatlisi"
    ]
  },
  {
    "id": "f435",
    "name": "Keşkül",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 155,
    "protein": 4.2,
    "carbs": 18,
    "fat": 7.5,
    "keywords": [
      "keskul",
      "bademli",
      "sütlü tatli",
      "sutlu tatli",
      "keşkül"
    ]
  },
  {
    "id": "f436",
    "name": "Supangle",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 165,
    "protein": 4.8,
    "carbs": 24,
    "fat": 5.5,
    "keywords": [
      "supangle",
      "cup",
      "çikolatali",
      "cikolatali",
      "puding"
    ]
  },
  {
    "id": "f437",
    "name": "Profiterol",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 240,
    "protein": 4.5,
    "carbs": 28,
    "fat": 12.5,
    "keywords": [
      "profiterol",
      "soslu",
      "çikolata",
      "cikolata",
      "top"
    ]
  },
  {
    "id": "f438",
    "name": "Muzlu Magnolia",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 185,
    "protein": 3.5,
    "carbs": 26,
    "fat": 7.5,
    "keywords": [
      "magnolia",
      "muzlu",
      "bisküvili",
      "biskuvili",
      "kremali"
    ]
  },
  {
    "id": "f439",
    "name": "Güllaç",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 130,
    "protein": 3.8,
    "carbs": 22,
    "fat": 3,
    "keywords": [
      "gullac",
      "ramazan",
      "gül suyu",
      "gul suyu",
      "sütlü tatli",
      "sutlu tatli",
      "güllaç"
    ]
  },
  {
    "id": "f440",
    "name": "İrmik Helvası",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 298,
    "protein": 4.6,
    "carbs": 52,
    "fat": 8.5,
    "keywords": [
      "irmik",
      "helvasi",
      "tatli",
      "i̇rmik",
      "helvası"
    ]
  },
  {
    "id": "f441",
    "name": "Un Helvası",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 310,
    "protein": 3.8,
    "carbs": 48,
    "fat": 11.5,
    "keywords": [
      "un",
      "helvasi",
      "klasik",
      "helvası"
    ]
  },
  {
    "id": "f442",
    "name": "Tahin Helvası (Sade)",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 550,
    "protein": 13,
    "carbs": 48,
    "fat": 34,
    "keywords": [
      "tahin",
      "helva",
      "sade",
      "kahvalti",
      "helvası",
      "helvasi"
    ]
  },
  {
    "id": "f443",
    "name": "Trileçe (Karamelli)",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 195,
    "protein": 4,
    "carbs": 28,
    "fat": 7.5,
    "keywords": [
      "trilece",
      "karamelli",
      "sütlü tatli",
      "sutlu tatli",
      "balkan",
      "trileçe"
    ]
  },
  {
    "id": "f444",
    "name": "San Sebastian",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 285,
    "protein": 6.5,
    "carbs": 22,
    "fat": 19.5,
    "keywords": [
      "cheesecake",
      "san sebastian",
      "yanik",
      "peynirli",
      "san",
      "sebastian"
    ]
  },
  {
    "id": "f445",
    "name": "Çikolatalı Sufle",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 320,
    "protein": 5.8,
    "carbs": 38,
    "fat": 16.5,
    "keywords": [
      "sufle",
      "akişkan",
      "akiskan",
      "sicak",
      "çikolatali",
      "cikolatali",
      "çikolatalı"
    ]
  },
  {
    "id": "f446",
    "name": "Mozaik Pasta",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 340,
    "protein": 5,
    "carbs": 44,
    "fat": 16,
    "keywords": [
      "mozaik",
      "pasta",
      "bisküvili",
      "biskuvili",
      "buzluk"
    ]
  },
  {
    "id": "f447",
    "name": "Zekeriyaköy Katmeri",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 430,
    "protein": 6.8,
    "carbs": 48,
    "fat": 22.5,
    "keywords": [
      "katmer",
      "antep",
      "kaymakli",
      "fistikli",
      "tatli",
      "zekeriyaköy",
      "zekeriyakoy",
      "katmeri"
    ]
  },
  {
    "id": "f448",
    "name": "Aşure",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 162,
    "protein": 3.1,
    "carbs": 31,
    "fat": 2.8,
    "keywords": [
      "asure",
      "aşure",
      "geleneksel",
      "yoresel"
    ]
  },
  {
    "id": "f449",
    "name": "Cezerye",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 320,
    "protein": 2.5,
    "carbs": 74,
    "fat": 1.8,
    "keywords": [
      "cezerye",
      "mersin",
      "havuc",
      "ceviz"
    ]
  },
  {
    "id": "f450",
    "name": "Saray Lokumu",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 295,
    "protein": 1.5,
    "carbs": 71,
    "fat": 0.5,
    "keywords": [
      "lokum",
      "saray",
      "güllü",
      "gullu",
      "lokumu"
    ]
  },
  {
    "id": "f451",
    "name": "Pişmaniye",
    "category": "Tatlı",
    "servingGram": 100,
    "calories": 440,
    "protein": 2,
    "carbs": 85,
    "fat": 10.5,
    "keywords": [
      "pismaniye",
      "kocaeli",
      "tatli",
      "pişmaniye"
    ]
  },
  {
    "id": "f452",
    "name": "Acıbadem Kurabiyesi",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 410,
    "protein": 9.5,
    "carbs": 58,
    "fat": 15,
    "keywords": [
      "acibadem",
      "kurabiye",
      "tatli",
      "bademli",
      "acıbadem",
      "kurabiyesi"
    ]
  },
  {
    "id": "f453",
    "name": "Un Kurabiyesi",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 480,
    "protein": 4.2,
    "carbs": 62,
    "fat": 24,
    "keywords": [
      "un",
      "kurabiyesi",
      "pudra",
      "şekerli",
      "sekerli"
    ]
  },
  {
    "id": "f454",
    "name": "Elmalı Kurabiye",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 380,
    "protein": 3.8,
    "carbs": 58,
    "fat": 14.8,
    "keywords": [
      "elmali",
      "kurabiye",
      "tarçinli",
      "tarcinli",
      "tatli",
      "elmalı"
    ]
  },
  {
    "id": "f455",
    "name": "Sade Anne Keki",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 320,
    "protein": 6.2,
    "carbs": 52,
    "fat": 9.5,
    "keywords": [
      "kek",
      "sade",
      "ev yapimi",
      "anne keki",
      "anne",
      "keki"
    ]
  },
  {
    "id": "f456",
    "name": "Tuzlu Kekikli Kurabiye",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 450,
    "protein": 7.5,
    "carbs": 52,
    "fat": 23.5,
    "keywords": [
      "kurabiye",
      "tuzlu",
      "pastane",
      "çörekotu",
      "corekotu",
      "kekikli"
    ]
  },
  {
    "id": "f457",
    "name": "Sade Galeta",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 380,
    "protein": 11,
    "carbs": 74,
    "fat": 3.5,
    "keywords": [
      "galeta",
      "kuru bisküvi",
      "kuru biskuvi",
      "diyet",
      "sade"
    ]
  },
  {
    "id": "f458",
    "name": "Susamlı Grissini",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 410,
    "protein": 12,
    "carbs": 68,
    "fat": 9.5,
    "keywords": [
      "grissini",
      "susamli",
      "galeta",
      "diyet",
      "susamlı"
    ]
  },
  {
    "id": "f459",
    "name": "Kepekli Diyet Bisküvi",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 420,
    "protein": 7.5,
    "carbs": 66,
    "fat": 13.5,
    "keywords": [
      "biskuvi",
      "diyet",
      "kepekli",
      "lifli",
      "bisküvi"
    ]
  },
  {
    "id": "f460",
    "name": "Çikolatalı Gofret",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 510,
    "protein": 5.5,
    "carbs": 64,
    "fat": 25.5,
    "keywords": [
      "gofret",
      "cikolatali",
      "çikolatalı",
      "market"
    ]
  },
  {
    "id": "f461",
    "name": "Sade Patates Cipsi",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 536,
    "protein": 7,
    "carbs": 53,
    "fat": 35,
    "keywords": [
      "cips",
      "patates",
      "lays",
      "ruffles",
      "atiştirmalik",
      "atistirmalik",
      "sade",
      "cipsi"
    ]
  },
  {
    "id": "f462",
    "name": "Baharatlı Mısır Cipsi",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 495,
    "protein": 7.2,
    "carbs": 58,
    "fat": 24.5,
    "keywords": [
      "cips",
      "misir",
      "doritos",
      "nacho",
      "baharatli",
      "baharatlı",
      "mısır",
      "cipsi"
    ]
  },
  {
    "id": "f463",
    "name": "Bitter Çikolata (%70)",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 540,
    "protein": 7.8,
    "carbs": 43,
    "fat": 38,
    "keywords": [
      "cikolata",
      "bitter",
      "sporcu",
      "saglikli",
      "kakao",
      "çikolata"
    ]
  },
  {
    "id": "f464",
    "name": "Sütlü Çikolata",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 535,
    "protein": 7.5,
    "carbs": 56,
    "fat": 31.5,
    "keywords": [
      "cikolata",
      "sutlu",
      "tatli",
      "market",
      "sütlü",
      "çikolata"
    ]
  },
  {
    "id": "f465",
    "name": "Beyaz Çikolata",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 539,
    "protein": 6,
    "carbs": 59,
    "fat": 31,
    "keywords": [
      "cikolata",
      "beyaz",
      "tatli",
      "çikolata"
    ]
  },
  {
    "id": "f466",
    "name": "Karamel Soslu Bar",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 485,
    "protein": 5.2,
    "carbs": 62,
    "fat": 24,
    "keywords": [
      "cikolata",
      "karamel",
      "bar",
      "snickers",
      "soslu"
    ]
  },
  {
    "id": "f467",
    "name": "Sade Patlamış Mısır",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 387,
    "protein": 12,
    "carbs": 78,
    "fat": 4.2,
    "keywords": [
      "patlamis",
      "misir",
      "popcorn",
      "sinema",
      "sade",
      "patlamış",
      "mısır"
    ]
  },
  {
    "id": "f468",
    "name": "Tuzlu Yağlı Patlamış Mısır",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 500,
    "protein": 9,
    "carbs": 64,
    "fat": 22,
    "keywords": [
      "patlamis",
      "misir",
      "tuzlu",
      "popcorn",
      "yağlı",
      "yagli",
      "patlamış",
      "mısır"
    ]
  },
  {
    "id": "f469",
    "name": "Kestane Şekeri",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 290,
    "protein": 1.5,
    "carbs": 70,
    "fat": 0.5,
    "keywords": [
      "kestane",
      "sekeri",
      "bursa",
      "tatli",
      "şekeri"
    ]
  },
  {
    "id": "f470",
    "name": "Sade Pestil (Dut)",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 280,
    "protein": 2.2,
    "carbs": 68,
    "fat": 1,
    "keywords": [
      "pestil",
      "dut",
      "gümüşhane",
      "gumushane",
      "cevizsiz",
      "sade"
    ]
  },
  {
    "id": "f471",
    "name": "Cevizli Sucuk",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 360,
    "protein": 4.8,
    "carbs": 62,
    "fat": 10.5,
    "keywords": [
      "sucuk",
      "cevizli",
      "kome",
      "pestil"
    ]
  },
  {
    "id": "f472",
    "name": "İncir Uyutması",
    "category": "Atıştırmalık",
    "servingGram": 100,
    "calories": 145,
    "protein": 3.5,
    "carbs": 24,
    "fat": 3.8,
    "keywords": [
      "incir",
      "uyutmasi",
      "tatli",
      "sütlü tatli",
      "sutlu tatli",
      "i̇ncir",
      "uyutması"
    ]
  },
  {
    "id": "f473",
    "name": "Ketçap",
    "category": "Sos",
    "servingGram": 100,
    "calories": 110,
    "protein": 1.2,
    "carbs": 25,
    "fat": 0.1,
    "keywords": [
      "ketcap",
      "ketchup",
      "domates",
      "sos",
      "ketçap"
    ]
  },
  {
    "id": "f474",
    "name": "Mayonez",
    "category": "Sos",
    "servingGram": 100,
    "calories": 680,
    "protein": 1,
    "carbs": 3,
    "fat": 75,
    "keywords": [
      "mayonez",
      "mayonnaise",
      "yagli",
      "sos"
    ]
  },
  {
    "id": "f475",
    "name": "Doğal Süzme Bal",
    "category": "Sos",
    "servingGram": 100,
    "calories": 304,
    "protein": 0.3,
    "carbs": 82,
    "fat": 0,
    "keywords": [
      "bal",
      "honey",
      "tatli",
      "kahvalti",
      "ari",
      "doğal",
      "dogal",
      "süzme",
      "suzme"
    ]
  },
  {
    "id": "f476",
    "name": "Pekmez (Üzüm)",
    "category": "Sos",
    "servingGram": 100,
    "calories": 290,
    "protein": 0,
    "carbs": 74,
    "fat": 0.1,
    "keywords": [
      "pekmez",
      "uzum",
      "şeker",
      "seker",
      "kahvalti",
      "kan yapici",
      "üzüm"
    ]
  },
  {
    "id": "f477",
    "name": "Nar Ekşisi (%100 Doğal)",
    "category": "Sos",
    "servingGram": 100,
    "calories": 280,
    "protein": 0.1,
    "carbs": 68,
    "fat": 0.1,
    "keywords": [
      "nar eksisi",
      "eksi",
      "dogal",
      "salata",
      "nar",
      "ekşisi",
      "eksisi",
      "100",
      "doğal"
    ]
  },
  {
    "id": "f478",
    "name": "Ranch Sos",
    "category": "Sos",
    "servingGram": 100,
    "calories": 430,
    "protein": 1.5,
    "carbs": 7,
    "fat": 44,
    "keywords": [
      "ranch",
      "sarimsakli",
      "sos",
      "yogurtlu"
    ]
  },
  {
    "id": "f479",
    "name": "Barbekü Sos",
    "category": "Sos",
    "servingGram": 100,
    "calories": 130,
    "protein": 1.2,
    "carbs": 31,
    "fat": 0.2,
    "keywords": [
      "barbeku",
      "barbecue",
      "isli",
      "sos",
      "barbekü"
    ]
  },
  {
    "id": "f480",
    "name": "Acı Sos (Sriracha)",
    "category": "Sos",
    "servingGram": 100,
    "calories": 110,
    "protein": 1.5,
    "carbs": 24,
    "fat": 0.5,
    "keywords": [
      "aci sos",
      "sriracha",
      "hot sauce",
      "acı",
      "aci",
      "sos"
    ]
  },
  {
    "id": "f481",
    "name": "Soya Sosu",
    "category": "Sos",
    "servingGram": 100,
    "calories": 53,
    "protein": 8.1,
    "carbs": 4.9,
    "fat": 0.6,
    "keywords": [
      "soya sosu",
      "soy sauce",
      "tuzlu",
      "soya",
      "sosu"
    ]
  },
  {
    "id": "f482",
    "name": "Pesto Sos",
    "category": "Sos",
    "servingGram": 100,
    "calories": 380,
    "protein": 5.2,
    "carbs": 6.8,
    "fat": 38,
    "keywords": [
      "pesto",
      "fesleğenli",
      "feslegenli",
      "makarna",
      "yesil",
      "sos"
    ]
  },
  {
    "id": "f483",
    "name": "Haydari Yeşillikli",
    "category": "Sos",
    "servingGram": 100,
    "calories": 110,
    "protein": 4,
    "carbs": 4,
    "fat": 9,
    "keywords": [
      "haydari",
      "meze",
      "yogurtlu",
      "yeşillikli",
      "yesillikli"
    ]
  },
  {
    "id": "f484",
    "name": "Elma Sirkesi",
    "category": "Sos",
    "servingGram": 100,
    "calories": 21,
    "protein": 0,
    "carbs": 0.9,
    "fat": 0,
    "keywords": [
      "sirke",
      "elma",
      "vinegar",
      "diyet",
      "sirkesi"
    ]
  },
  {
    "id": "f485",
    "name": "Üzüm Sirkesi",
    "category": "Sos",
    "servingGram": 100,
    "calories": 19,
    "protein": 0,
    "carbs": 0.6,
    "fat": 0,
    "keywords": [
      "sirke",
      "uzum",
      "üzüm",
      "sirkesi"
    ]
  },
  {
    "id": "f486",
    "name": "Humus (Meze)",
    "category": "Salata",
    "servingGram": 100,
    "calories": 166,
    "protein": 7.9,
    "carbs": 14.3,
    "fat": 9.6,
    "keywords": [
      "humus",
      "nohutlu",
      "mezeler",
      "tahinli",
      "meze"
    ]
  },
  {
    "id": "f487",
    "name": "Muhammara",
    "category": "Salata",
    "servingGram": 100,
    "calories": 280,
    "protein": 4.5,
    "carbs": 16.5,
    "fat": 22.5,
    "keywords": [
      "muhammara",
      "acuka",
      "kahvaltilik",
      "biberli",
      "cevizli"
    ]
  },
  {
    "id": "f488",
    "name": "Rus Salatası",
    "category": "Salata",
    "servingGram": 100,
    "calories": 180,
    "protein": 2.5,
    "carbs": 11.2,
    "fat": 14.2,
    "keywords": [
      "rus",
      "salatasi",
      "amerikan",
      "mayonezli",
      "garnitur",
      "salatası"
    ]
  },
  {
    "id": "f489",
    "name": "Mercimek Köftesi",
    "category": "Salata",
    "servingGram": 100,
    "calories": 145,
    "protein": 5.8,
    "carbs": 22,
    "fat": 3.8,
    "keywords": [
      "mercimek koftesi",
      "yeşillik",
      "yesillik",
      "atiştirmalik",
      "atistirmalik",
      "meze",
      "mercimek",
      "köftesi",
      "koftesi"
    ]
  },
  {
    "id": "f490",
    "name": "Kısır",
    "category": "Salata",
    "servingGram": 100,
    "calories": 155,
    "protein": 3.2,
    "carbs": 24,
    "fat": 5.5,
    "keywords": [
      "kisir",
      "kısır",
      "bulgur",
      "salata",
      "gün",
      "gun"
    ]
  },
  {
    "id": "f491",
    "name": "Şakşuka",
    "category": "Salata",
    "servingGram": 100,
    "calories": 120,
    "protein": 1.8,
    "carbs": 8.2,
    "fat": 9.2,
    "keywords": [
      "saksuka",
      "meze",
      "patlicanli",
      "biberli",
      "şakşuka"
    ]
  },
  {
    "id": "f492",
    "name": "Çoban Salatası",
    "category": "Salata",
    "servingGram": 100,
    "calories": 42,
    "protein": 1,
    "carbs": 4.5,
    "fat": 2.5,
    "keywords": [
      "coban",
      "salatasi",
      "klasik",
      "diyet",
      "çoban",
      "salatası"
    ]
  },
  {
    "id": "f493",
    "name": "Akdeniz Salatası",
    "category": "Salata",
    "servingGram": 100,
    "calories": 65,
    "protein": 1.8,
    "carbs": 5,
    "fat": 4.5,
    "keywords": [
      "akdeniz",
      "salata",
      "yesil",
      "diyet",
      "salatası",
      "salatasi"
    ]
  },
  {
    "id": "f494",
    "name": "Gavurdağı Salatası",
    "category": "Salata",
    "servingGram": 100,
    "calories": 140,
    "protein": 2.8,
    "carbs": 7.2,
    "fat": 11.5,
    "keywords": [
      "gavurdagi",
      "salata",
      "cevizli",
      "nar eksili",
      "gavurdağı",
      "salatası",
      "salatasi"
    ]
  },
  {
    "id": "f495",
    "name": "Babagannuş",
    "category": "Salata",
    "servingGram": 100,
    "calories": 85,
    "protein": 1.5,
    "carbs": 6.2,
    "fat": 6,
    "keywords": [
      "babagannus",
      "meze",
      "patlican",
      "biber",
      "babagannuş"
    ]
  },
  {
    "id": "f496",
    "name": "Yoğurtlu Semizotu Salatası",
    "category": "Salata",
    "servingGram": 100,
    "calories": 62,
    "protein": 2.5,
    "carbs": 4.8,
    "fat": 3.8,
    "keywords": [
      "semizotu",
      "yogurtlu",
      "salata",
      "diyet",
      "yoğurtlu",
      "salatası",
      "salatasi"
    ]
  },
  {
    "id": "f497",
    "name": "Amerikan Salatası",
    "category": "Salata",
    "servingGram": 100,
    "calories": 175,
    "protein": 2.2,
    "carbs": 10.5,
    "fat": 13.8,
    "keywords": [
      "amerikan",
      "salata",
      "mayonezli",
      "salatası",
      "salatasi"
    ]
  },
  {
    "id": "f498",
    "name": "Yoğurtlu Havuç Tarator",
    "category": "Salata",
    "servingGram": 100,
    "calories": 95,
    "protein": 2,
    "carbs": 6.5,
    "fat": 7,
    "keywords": [
      "tarator",
      "havuc",
      "yogurtlu",
      "meze",
      "yoğurtlu",
      "havuç"
    ]
  },
  {
    "id": "f499",
    "name": "Zeytinyağlı Kırmızı Pancar Salatası",
    "category": "Salata",
    "servingGram": 100,
    "calories": 78,
    "protein": 1.3,
    "carbs": 8,
    "fat": 4.8,
    "keywords": [
      "pancar",
      "salata",
      "tursu",
      "zeytinyagli",
      "zeytinyağlı",
      "kırmızı",
      "kirmizi",
      "salatası",
      "salatasi"
    ]
  },
  {
    "id": "f500",
    "name": "Köz Patlıcan Salatası",
    "category": "Salata",
    "servingGram": 100,
    "calories": 65,
    "protein": 1.5,
    "carbs": 5.8,
    "fat": 4,
    "keywords": [
      "koz",
      "patlican",
      "salata",
      "meze",
      "köz",
      "patlıcan",
      "salatası",
      "salatasi"
    ]
  },
  {
    "id": "f501",
    "name": "Deniz Börülcesi",
    "category": "Salata",
    "servingGram": 100,
    "calories": 90,
    "protein": 1.8,
    "carbs": 4.5,
    "fat": 7.5,
    "keywords": [
      "deniz",
      "borulcesi",
      "zeytinyagli",
      "sarimsak",
      "börülcesi"
    ]
  },
  {
    "id": "f502",
    "name": "Köpoğlu Mezesi",
    "category": "Salata",
    "servingGram": 100,
    "calories": 135,
    "protein": 2.2,
    "carbs": 8.5,
    "fat": 10.5,
    "keywords": [
      "kopoglu",
      "patlican",
      "yogurtlu",
      "meze",
      "köpoğlu",
      "mezesi"
    ]
  },
  {
    "id": "f503",
    "name": "Fava (Bakla Ezmesi)",
    "category": "Salata",
    "servingGram": 100,
    "calories": 148,
    "protein": 6.8,
    "carbs": 18.2,
    "fat": 5.5,
    "keywords": [
      "fava",
      "bakla",
      "meze",
      "zeytinyagli",
      "ezmesi"
    ]
  },
  {
    "id": "f504",
    "name": "Şaraşura Mezesi",
    "category": "Salata",
    "servingGram": 100,
    "calories": 110,
    "protein": 1.8,
    "carbs": 7.5,
    "fat": 8.2,
    "keywords": [
      "sarasura",
      "meze",
      "biber",
      "domates",
      "şaraşura",
      "mezesi"
    ]
  },
  {
    "id": "f505",
    "name": "Atom Salata",
    "category": "Salata",
    "servingGram": 100,
    "calories": 160,
    "protein": 3.2,
    "carbs": 4.5,
    "fat": 14.8,
    "keywords": [
      "atom",
      "meze",
      "aci",
      "süzme yoğurt",
      "suzme yogurt",
      "tereyagli",
      "salata"
    ]
  },
  {
    "id": "f506",
    "name": "Klasik Tofu",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 76,
    "protein": 8,
    "carbs": 1.9,
    "fat": 4.8,
    "keywords": [
      "tofu",
      "vegan peynir",
      "soya",
      "vejetaryen",
      "protein",
      "klasik"
    ]
  },
  {
    "id": "f507",
    "name": "Füme Tofu",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 110,
    "protein": 12,
    "carbs": 2.5,
    "fat": 5.5,
    "keywords": [
      "tofu",
      "fume",
      "soya",
      "vegan",
      "füme"
    ]
  },
  {
    "id": "f508",
    "name": "Pişmiş Soya Kıyması",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 120,
    "protein": 14,
    "carbs": 8.5,
    "fat": 1.5,
    "keywords": [
      "soya kiymasi",
      "kıyma",
      "kiyma",
      "vejetaryen",
      "protein",
      "pişmiş",
      "pismis",
      "soya",
      "kıyması",
      "kiymasi"
    ]
  },
  {
    "id": "f509",
    "name": "Şekersiz Badem Sütü",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 13,
    "protein": 0.4,
    "carbs": 0.3,
    "fat": 1.1,
    "keywords": [
      "badem sutu",
      "almond milk",
      "vegan",
      "diyet",
      "sekersiz",
      "şekersiz",
      "badem",
      "sütü",
      "sutu"
    ]
  },
  {
    "id": "f510",
    "name": "Yulaf Sütü",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 42,
    "protein": 1,
    "carbs": 6.5,
    "fat": 0.8,
    "keywords": [
      "yulaf sutu",
      "oat milk",
      "vegan",
      "bitkisel",
      "yulaf",
      "sütü",
      "sutu"
    ]
  },
  {
    "id": "f511",
    "name": "Hindistan Cevizi Sütü (İçecek)",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 20,
    "protein": 0.2,
    "carbs": 2.8,
    "fat": 0.9,
    "keywords": [
      "hindistan cevizi",
      "coconut milk",
      "vegan",
      "hindistan",
      "cevizi",
      "sütü",
      "sutu",
      "i̇çecek",
      "i̇cecek"
    ]
  },
  {
    "id": "f512",
    "name": "Vegan Mozzarella",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 250,
    "protein": 1,
    "carbs": 22,
    "fat": 18,
    "keywords": [
      "vegan peynir",
      "mozzarella",
      "bitkisel",
      "vegan"
    ]
  },
  {
    "id": "f513",
    "name": "Tofu Sosis",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 180,
    "protein": 13,
    "carbs": 4.5,
    "fat": 11,
    "keywords": [
      "sosis",
      "tofu",
      "vegan",
      "vejetaryen"
    ]
  },
  {
    "id": "f514",
    "name": "Seitan",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 370,
    "protein": 75,
    "carbs": 14,
    "fat": 1.8,
    "keywords": [
      "seitan",
      "bugday eti",
      "vegan et",
      "yüksek protein",
      "yuksek protein"
    ]
  },
  {
    "id": "f515",
    "name": "Humus Dip Sos",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 166,
    "protein": 7.9,
    "carbs": 14.3,
    "fat": 9.6,
    "keywords": [
      "humus",
      "dip",
      "nohut",
      "vegan",
      "sos"
    ]
  },
  {
    "id": "f516",
    "name": "Guacamole Sos",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 157,
    "protein": 2,
    "carbs": 8.5,
    "fat": 14.6,
    "keywords": [
      "guacamole",
      "avokado",
      "vegan",
      "sos"
    ]
  },
  {
    "id": "f517",
    "name": "Siyah Zeytin Ezmesi",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 220,
    "protein": 1.8,
    "carbs": 6.5,
    "fat": 21,
    "keywords": [
      "zeytin",
      "ezmesi",
      "siyah",
      "kahvalti",
      "vegan"
    ]
  },
  {
    "id": "f518",
    "name": "Yeşil Zeytin Ezmesi",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 175,
    "protein": 1.5,
    "carbs": 5.8,
    "fat": 16.5,
    "keywords": [
      "zeytin",
      "ezmesi",
      "yeşil",
      "yesil",
      "kahvalti"
    ]
  },
  {
    "id": "f519",
    "name": "Vegan Mayonez",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 320,
    "protein": 0.2,
    "carbs": 5.5,
    "fat": 33,
    "keywords": [
      "vegan",
      "mayonez",
      "bitkisel",
      "yumurtasiz"
    ]
  },
  {
    "id": "f520",
    "name": "Seitan Nugget",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 230,
    "protein": 25,
    "carbs": 12,
    "fat": 8.5,
    "keywords": [
      "seitan",
      "nugget",
      "vegan",
      "protein"
    ]
  },
  {
    "id": "f521",
    "name": "Mercimek Makarna",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 135,
    "protein": 10.5,
    "carbs": 21,
    "fat": 1,
    "keywords": [
      "makarna",
      "mercimek",
      "glutensiz",
      "protein"
    ]
  },
  {
    "id": "f522",
    "name": "Vegan Çikolata",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 510,
    "protein": 5.2,
    "carbs": 58,
    "fat": 28,
    "keywords": [
      "cikolata",
      "vegan",
      "soya",
      "bitkisel",
      "çikolata"
    ]
  },
  {
    "id": "f523",
    "name": "Besin Mayası (5g)",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 20,
    "protein": 2.5,
    "carbs": 1.8,
    "fat": 0.2,
    "keywords": [
      "besin mayasi",
      "nutritional yeast",
      "b12",
      "vegan",
      "besin",
      "mayası",
      "mayasi"
    ]
  },
  {
    "id": "f524",
    "name": "Hindistan Cevizi Unu",
    "category": "Vegan",
    "servingGram": 100,
    "calories": 354,
    "protein": 18,
    "carbs": 22,
    "fat": 15,
    "keywords": [
      "coconut flour",
      "hindistan cevizi",
      "un",
      "glutensiz",
      "hindistan",
      "cevizi",
      "unu"
    ]
  },
  {
    "id": "f525",
    "name": "Fıstık Ezmesi (Şekersiz)",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 588,
    "protein": 25,
    "carbs": 20,
    "fat": 50,
    "keywords": [
      "fistik ezmesi",
      "peanut butter",
      "şekersiz",
      "sekersiz",
      "sporcu",
      "protein",
      "fıstık",
      "fistik",
      "ezmesi"
    ]
  },
  {
    "id": "f526",
    "name": "Fındık Ezmesi (%100 Fındık)",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 625,
    "protein": 15,
    "carbs": 18,
    "fat": 61,
    "keywords": [
      "findik ezmesi",
      "hazelnut butter",
      "organik",
      "diyet",
      "fındık",
      "findik",
      "ezmesi",
      "100"
    ]
  },
  {
    "id": "f527",
    "name": "Sade Whey Protein",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 380,
    "protein": 80,
    "carbs": 5,
    "fat": 3,
    "keywords": [
      "whey",
      "protein",
      "supplement",
      "toz",
      "kas",
      "sporcu",
      "sade"
    ]
  },
  {
    "id": "f528",
    "name": "Çikolatalı Whey Protein",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 375,
    "protein": 76,
    "carbs": 8,
    "fat": 3.5,
    "keywords": [
      "whey",
      "protein",
      "cikolatali",
      "supplement",
      "toz",
      "kas",
      "çikolatalı"
    ]
  },
  {
    "id": "f529",
    "name": "Kazein Proteini Tozu",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 365,
    "protein": 82,
    "carbs": 3.5,
    "fat": 1.5,
    "keywords": [
      "casein",
      "kazein",
      "gece proteini",
      "slow",
      "proteini",
      "tozu"
    ]
  },
  {
    "id": "f530",
    "name": "BCAA Tozu (%100 Saf)",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "bcaa",
      "toz",
      "aminoasit",
      "kas koruyucu",
      "tozu",
      "100",
      "saf"
    ]
  },
  {
    "id": "f531",
    "name": "L-Karnitin",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "l-carnitine",
      "yag yakici",
      "yağ yakıcı",
      "lkarnitin"
    ]
  },
  {
    "id": "f532",
    "name": "Kolajen Peptit Tozu",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 360,
    "protein": 90,
    "carbs": 0,
    "fat": 0,
    "keywords": [
      "collagen",
      "kolajen",
      "cilt",
      "eklem",
      "saf protein",
      "peptit",
      "tozu"
    ]
  },
  {
    "id": "f533",
    "name": "Protein Bar (Çikolatalı)",
    "category": "Supplement",
    "servingGram": 100,
    "calories": 390,
    "protein": 30,
    "carbs": 38,
    "fat": 12,
    "keywords": [
      "protein bar",
      "atiştirmalik",
      "atistirmalik",
      "çikolata",
      "cikolata",
      "sporcu",
      "tok tutan",
      "protein",
      "bar",
      "çikolatalı",
      "cikolatali"
    ]
  }
];

export const foodCategories = [
  'Protein',
  'Karbonhidrat',
  'Süt Ürünleri',
  'Bakliyat',
  'Meyve',
  'Sebze',
  'Yağ',
  'Kuruyemiş',
  'Türk Yemekleri',
  'Çorba',
  'Kahvaltılık',
  'Fast Food',
  'Tatlı',
  'İçecek',
  'Atıştırmalık',
  'Sos',
  'Salata',
  'Vegan',
  'Vejetaryen',
  'Supplement'
] as const;

export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[s-]+/g, ' ');
}

export function searchFoods(query: string): FoodDatabaseItem[] {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  // Custom Search Enhancements
  // gogus -> göğüs, cig kofte -> Çiğ Köfte, pirinc -> pirinç, yogurt -> yoğurt, protein -> protein
  const targetKeywords: string[] = [normalizedQuery];

  if (normalizedQuery.includes('gogus')) {
    targetKeywords.push('gogus', 'göğüs');
  }
  if (normalizedQuery.includes('cig kofte') || normalizedQuery.includes('cigkofte')) {
    targetKeywords.push('çiğ köfte', 'cig kofte', 'cigkofte', 'etsiz çiğ köfte');
  }
  if (normalizedQuery.includes('pirinc')) {
    targetKeywords.push('pirinç', 'pirinc');
  }
  if (normalizedQuery.includes('yogurt')) {
    targetKeywords.push('yoğurt', 'yogurt');
  }

  const isProteinSearch = normalizedQuery === 'protein';

  return foodDatabase.filter(item => {
    if (isProteinSearch && item.protein >= 15) {
      return true;
    }

    const nameNorm = normalizeText(item.name);
    const catNorm = normalizeText(item.category);

    const matchesName = targetKeywords.some(kw => nameNorm.includes(kw));
    const matchesCategory = targetKeywords.some(kw => catNorm.includes(kw));
    const matchesKeywords = Array.isArray(item.keywords) && item.keywords.some(kw => {
      const kwNorm = normalizeText(kw);
      return targetKeywords.some(tkw => kwNorm.includes(tkw));
    });

    return matchesName || matchesCategory || matchesKeywords;
  });
}

export function calculateFoodByAmount(food: FoodDatabaseItem, amountGram: number): FoodDatabaseItem {
  const factor = amountGram / food.servingGram;
  return {
    ...food,
    servingGram: amountGram,
    calories: Math.round(food.calories * factor),
    protein: Number((food.protein * factor).toFixed(1)),
    carbs: Number((food.carbs * factor).toFixed(1)),
    fat: Number((food.fat * factor).toFixed(1))
  };
}

export function getFoodsByCategory(category: string): FoodDatabaseItem[] {
  return foodDatabase.filter(item => item.category.toLowerCase() === category.toLowerCase());
}

export function getFoodById(id: string): FoodDatabaseItem | undefined {
  return foodDatabase.find(item => item.id === id);
}
