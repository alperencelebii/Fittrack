import { MealFoodItem } from '../types';

export interface MealTemplate {
  name: string;
  mealType: string;
  items: MealFoodItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const MEAL_TEMPLATES: MealTemplate[] = [
  {
    name: "Yüksek Protein Kahvaltı",
    mealType: "Kahvaltı",
    calories: 580,
    protein: 48,
    carbs: 45,
    fat: 22,
    items: [
      {
        id: "temp_1_1",
        name: "Yumurta (Haşlanmış)",
        amountGram: 200, // 4 large eggs
        calories: 310,
        protein: 26,
        carbs: 2,
        fat: 22
      },
      {
        id: "temp_1_2",
        name: "Yulaf Ezmesi",
        amountGram: 60,
        calories: 230,
        protein: 8,
        carbs: 40,
        fat: 4
      },
      {
        id: "temp_1_3",
        name: "Whey Protein",
        amountGram: 15,
        calories: 40,
        protein: 14,
        carbs: 3,
        fat: 0
      }
    ]
  },
  {
    name: "Antrenman Öncesi Öğünü",
    mealType: "Ara Öğün",
    calories: 410,
    protein: 15,
    carbs: 82,
    fat: 4,
    items: [
      {
        id: "temp_2_1",
        name: "Muz",
        amountGram: 150,
        calories: 135,
        protein: 1.5,
        carbs: 34,
        fat: 0.3
      },
      {
        id: "temp_2_2",
        name: "Pirinç Unu",
        amountGram: 70,
        calories: 250,
        protein: 5,
        carbs: 56,
        fat: 0.5
      },
      {
        id: "temp_2_3",
        name: "Bal",
        amountGram: 10,
        calories: 25,
        protein: 0.1,
        carbs: 6,
        fat: 0
      }
    ]
  },
  {
    name: "Antrenman Sonrası Öğünü",
    mealType: "Öğle",
    calories: 680,
    protein: 52,
    carbs: 95,
    fat: 8,
    items: [
      {
        id: "temp_3_1",
        name: "Tavuk Göğsü (Izgara)",
        amountGram: 200,
        calories: 330,
        protein: 46,
        carbs: 0,
        fat: 6
      },
      {
        id: "temp_3_2",
        name: "Basmati Pirinç (Haşlanmış)",
        amountGram: 250,
        calories: 310,
        protein: 6,
        carbs: 68,
        fat: 1
      },
      {
        id: "temp_3_3",
        name: "Zeytinyağı",
        amountGram: 5,
        calories: 40,
        protein: 0,
        carbs: 0,
        fat: 5
      }
    ]
  },
  {
    name: "Hafif Akşam Yemeği",
    mealType: "Akşam",
    calories: 490,
    protein: 42,
    carbs: 15,
    fat: 28,
    items: [
      {
        id: "temp_4_1",
        name: "Somon Fileto (Fırında)",
        amountGram: 200,
        calories: 410,
        protein: 40,
        carbs: 0,
        fat: 26
      },
      {
        id: "temp_4_2",
        name: "Brokoli (Buharda)",
        amountGram: 150,
        calories: 50,
        protein: 4,
        carbs: 10,
        fat: 0.5
      },
      {
        id: "temp_4_3",
        name: "Zeytinyağı",
        amountGram: 3,
        calories: 30,
        protein: 0,
        carbs: 0,
        fat: 3
      }
    ]
  },
  {
    name: "Kilo Alma Öğünü",
    mealType: "Ara Öğün",
    calories: 910,
    protein: 44,
    carbs: 102,
    fat: 38,
    items: [
      {
        id: "temp_5_1",
        name: "Yulaf Ezmesi",
        amountGram: 100,
        calories: 380,
        protein: 13,
        carbs: 66,
        fat: 7
      },
      {
        id: "temp_5_2",
        name: "Fıstık Ezmesi",
        amountGram: 40,
        calories: 240,
        protein: 10,
        carbs: 8,
        fat: 20
      },
      {
        id: "temp_5_3",
        name: "Tam Yağlı Süt",
        amountGram: 250,
        calories: 150,
        protein: 8,
        carbs: 12,
        fat: 8
      },
      {
        id: "temp_5_4",
        name: "Muz",
        amountGram: 150,
        calories: 140,
        protein: 1.5,
        carbs: 34,
        fat: 0.3
      }
    ]
  },
  {
    name: "Kalori Kontrollü Öğün",
    mealType: "Öğle",
    calories: 360,
    protein: 38,
    carbs: 30,
    fat: 9,
    items: [
      {
        id: "temp_6_1",
        name: "Ton Balığı (Suda konserve)",
        amountGram: 150,
        calories: 170,
        protein: 36,
        carbs: 0,
        fat: 2
      },
      {
        id: "temp_6_2",
        name: "Kinoa (Haşlanmış)",
        amountGram: 100,
        calories: 120,
        protein: 4,
        carbs: 21,
        fat: 2
      },
      {
        id: "temp_6_3",
        name: "Akdeniz Yeşillikleri Salata",
        amountGram: 150,
        calories: 70,
        protein: 2,
        carbs: 9,
        fat: 5
      }
    ]
  },
  {
    name: "Yüksek Karbonhidrat Öğünü",
    mealType: "Öğle",
    calories: 720,
    protein: 34,
    carbs: 128,
    fat: 8,
    items: [
      {
        id: "temp_7_1",
        name: "Yağsız Sığır Eti (Kıyma)",
        amountGram: 120,
        calories: 210,
        protein: 28,
        carbs: 0,
        fat: 10
      },
      {
        id: "temp_7_2",
        name: "Makarna (Durum buğdayı)",
        amountGram: 350,
        calories: 470,
        protein: 15,
        carbs: 96,
        fat: 2
      },
      {
        id: "temp_7_3",
        name: "Domates Sosu",
        amountGram: 100,
        calories: 40,
        protein: 1,
        carbs: 8,
        fat: 0
      }
    ]
  },
  {
    name: "Düşük Karbonhidrat Öğünü",
    mealType: "Akşam",
    calories: 460,
    protein: 44,
    carbs: 6,
    fat: 28,
    items: [
      {
        id: "temp_8_1",
        name: "Hindi Göğsü (Fırında)",
        amountGram: 200,
        calories: 220,
        protein: 36,
        carbs: 0,
        fat: 8
      },
      {
        id: "temp_8_2",
        name: "Kuşkonmaz (Tavada)",
        amountGram: 150,
        calories: 40,
        protein: 3,
        carbs: 6,
        fat: 0.2
      },
      {
        id: "temp_8_3",
        name: "Tereyağı (Tava için)",
        amountGram: 15,
        calories: 110,
        protein: 0.1,
        carbs: 0,
        fat: 12
      },
      {
        id: "temp_8_4",
        name: "Avokado",
        amountGram: 50,
        calories: 90,
        protein: 1,
        carbs: 4,
        fat: 8
      }
    ]
  }
];
