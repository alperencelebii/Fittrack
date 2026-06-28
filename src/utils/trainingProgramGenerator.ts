import { GeneratedTrainingProgram, ProgramWorkoutSession, GeneratedWorkoutDay, GeneratedProgramExercise } from '../types';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

export interface ProgramGeneratorInput {
  userId: string;
  goal: string;
  level?: string;
  experience?: string;
  weeklyDays?: number;
  frequency?: number;
  durationWeeks?: number;
  split?: string;
  equipment?: string[];
  priorityMuscles?: string[];
  restrictions?: string[];
}

const fallbackExercises = [
  {
    id: 'bodyweight_squat',
    name: 'Vücut Ağırlığı Squat',
    primaryMuscles: ['Quadriceps', 'Kalça', 'Quads'],
    equipment: ['bodyweight']
  },
  {
    id: 'push_up',
    name: 'Şınav',
    primaryMuscles: ['Göğüs', 'Triceps'],
    equipment: ['bodyweight']
  },
  {
    id: 'plank',
    name: 'Plank',
    primaryMuscles: ['Karın'],
    equipment: ['bodyweight']
  },
  {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    primaryMuscles: ['Kalça', 'Hamstring', 'Hamstrings'],
    equipment: ['bodyweight']
  }
];

export const generateLocalTrainingProgram = (input: ProgramGeneratorInput): GeneratedTrainingProgram => {
  const userId = input.userId;
  const goal = input.goal || 'general_fitness';
  const level = input.experience || input.level || 'intermediate';
  const weeklyDays = Number(input.frequency || input.weeklyDays || 3);
  const durationWeeks = Number(input.durationWeeks || 8);
  const split = input.split || 'full_body';
  const equipment = (input.equipment || []) as any[];
  const priorityMuscles = input.priorityMuscles || [];
  const restrictions = input.restrictions || [];

  const sessions: ProgramWorkoutSession[] = [];
  const days: GeneratedWorkoutDay[] = [];

  const splitLabels: Record<string, string> = {
    full_body: 'Tüm Vücut (Full Body)',
    upper_lower: 'Üst / Alt (Upper / Lower)',
    ppl: 'İtiş / Çekiş / Bacak (PPL)',
    bro_split: 'Bölgesel (Bro Split)'
  };

  const goalLabels: Record<string, string> = {
    muscle_gain: 'Kas Kazanımı & Hipertrofi',
    fat_loss: 'Yağ Yakımı & Kondisyon',
    strength: 'Saf Güç Gelişimi',
    endurance: 'Dayanıklılık & Sağlık',
    general_fitness: 'Genel Sağlık & Fitness'
  };

  const levelLabels: Record<string, string> = {
    beginner: 'Başlangıç',
    intermediate: 'Orta Seviye',
    advanced: 'İleri Seviye'
  };

  const programName = `AI ${goalLabels[goal] || goal} Programı (${splitLabels[split] || split})`;

  for (let day = 1; day <= weeklyDays; day++) {
    const sessionExercises: any[] = [];
    const dayExercises: GeneratedProgramExercise[] = [];
    let sessionName = `Gün ${day}`;

    if (split === 'full_body') {
      sessionName = `Gelişim Günü ${day} (Tüm Vücut)`;
      const quadEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Quads') || e.primaryMuscles.includes('Bacak')) || fallbackExercises[0];
      const chestEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Göğüs')) || fallbackExercises[1];
      const backEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Sırt')) || fallbackExercises[3];
      const shoulderEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Omuz')) || fallbackExercises[1];
      const armEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Biceps') || e.primaryMuscles.includes('Triceps')) || fallbackExercises[1];
      const coreEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Karın')) || fallbackExercises[2];

      [quadEx, chestEx, backEx, shoulderEx, armEx, coreEx].forEach((ex, index) => {
        const repsRange = goal === 'strength' ? '5-6' : goal === 'fat_loss' ? '12-15' : '8-12';
        const minReps = goal === 'strength' ? 5 : goal === 'fat_loss' ? 12 : 8;
        const maxReps = goal === 'strength' ? 6 : goal === 'fat_loss' ? 15 : 12;
        const setsCount = goal === 'strength' ? 4 : 3;

        sessionExercises.push({
          exerciseId: ex.id,
          name: ex.name,
          sets: setsCount,
          reps: repsRange,
          rpe: goal === 'strength' ? 9 : 8,
          restSeconds: goal === 'strength' ? 180 : 90,
          order: index + 1,
          notes: index === 0 ? 'Bileşik ana hareket, nizami formda yapın.' : 'Tempolu ve kontrollü negatif tekrar.'
        });

        dayExercises.push({
          id: `${day}_ex_${index}`,
          exerciseId: ex.id,
          name: ex.name,
          sets: setsCount,
          minReps,
          maxReps,
          suggestedWeight: 0,
          rpeTarget: goal === 'strength' ? 9 : 8,
          notes: index === 0 ? 'Bileşik ana hareket.' : 'Tempolu ve kontrollü.',
          order: index + 1
        });
      });
    } else if (split === 'upper_lower') {
      const isUpper = day % 2 === 1;
      sessionName = isUpper ? `Üst Vücut (A)` : `Alt Vücut & Karın (B)`;

      if (isUpper) {
        const chestEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Göğüs')) || fallbackExercises[1];
        const backEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Sırt')) || fallbackExercises[3];
        const shoulderEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Omuz')) || fallbackExercises[1];
        const bicepEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Biceps')) || fallbackExercises[1];
        const tricepEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Triceps')) || fallbackExercises[1];

        [chestEx, backEx, shoulderEx, bicepEx, tricepEx].forEach((ex, index) => {
          sessionExercises.push({
            exerciseId: ex.id,
            name: ex.name,
            sets: 4,
            reps: goal === 'strength' ? '6-8' : '8-12',
            rpe: 8,
            restSeconds: 90,
            order: index + 1,
            notes: 'Sıkıştırma noktalarında 1 sn bekleyin.'
          });

          dayExercises.push({
            id: `${day}_ex_${index}`,
            exerciseId: ex.id,
            name: ex.name,
            sets: 4,
            minReps: goal === 'strength' ? 6 : 8,
            maxReps: goal === 'strength' ? 8 : 12,
            suggestedWeight: 0,
            rpeTarget: 8,
            notes: 'Sıkıştırma noktalarında bekleyin.',
            order: index + 1
          });
        });
      } else {
        const quadEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Quads') || e.primaryMuscles.includes('Bacak')) || fallbackExercises[0];
        const hamstringEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Hamstrings')) || fallbackExercises[3];
        const calfEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Calves') || e.primaryMuscles.includes('Kalf')) || fallbackExercises[0];
        const absEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Karın')) || fallbackExercises[2];

        [quadEx, hamstringEx, calfEx, absEx].forEach((ex, index) => {
          sessionExercises.push({
            exerciseId: ex.id,
            name: ex.name,
            sets: 4,
            reps: '10-15',
            rpe: 8,
            restSeconds: 90,
            order: index + 1,
            notes: 'Kalçayı ve omurgayı stabil tutun.'
          });

          dayExercises.push({
            id: `${day}_ex_${index}`,
            exerciseId: ex.id,
            name: ex.name,
            sets: 4,
            minReps: 10,
            maxReps: 15,
            suggestedWeight: 0,
            rpeTarget: 8,
            notes: 'Stabil formda yapın.',
            order: index + 1
          });
        });
      }
    } else {
      sessionName = split === 'ppl' 
        ? (day % 3 === 1 ? 'İtiş Günü (Push)' : day % 3 === 2 ? 'Çekiş Günü (Pull)' : 'Bacak Günü (Legs)')
        : `Antrenman Günü ${day}`;

      const chestEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Göğüs')) || fallbackExercises[1];
      const backEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Sırt')) || fallbackExercises[3];
      const legsEx = EXERCISE_LIBRARY.find(e => e.primaryMuscles.includes('Quads') || e.primaryMuscles.includes('Hamstrings') || e.primaryMuscles.includes('Bacak')) || fallbackExercises[0];

      [legsEx, chestEx, backEx].forEach((ex, index) => {
        sessionExercises.push({
          exerciseId: ex.id,
          name: ex.name,
          sets: 4,
          reps: '8-12',
          rpe: 8,
          restSeconds: 90,
          order: index + 1,
          notes: 'Ağırlık artışı için kendinizi zorlayın.'
        });

        dayExercises.push({
          id: `${day}_ex_${index}`,
          exerciseId: ex.id,
          name: ex.name,
          sets: 4,
          minReps: 8,
          maxReps: 12,
          suggestedWeight: 0,
          rpeTarget: 8,
          notes: 'Ağırlık artışı hedefleyin.',
          order: index + 1
        });
      });
    }

    sessions.push({
      dayNumber: day,
      name: sessionName,
      exercises: sessionExercises,
      isCompleted: false
    });

    days.push({
      id: `day_${day}`,
      dayNumber: day,
      title: sessionName,
      focusMuscles: day === 1 ? ['Göğüs', 'Quads'] : ['Sırt', 'Omuz', 'Bacak'],
      exercises: dayExercises,
      notes: 'Forma odaklanın.'
    });
  }

  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + durationWeeks * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return {
    id: Math.random().toString(36).substring(2, 9),
    userId,
    name: programName,
    goal: goalLabels[goal] || goal,
    level: levelLabels[level] || level,
    weeklyDays,
    durationWeeks,
    equipment,
    priorityMuscles,
    restrictions,
    days,
    startDate,
    endDate,
    difficulty: levelLabels[level] || level,
    daysPerWeek: weeklyDays,
    sessions,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const generateProgramWithAI = async (
  input: ProgramGeneratorInput,
  userId: string
): Promise<GeneratedTrainingProgram> => {
  const response = await fetch("/api/gemini/generate-program", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      goal: input.goal,
      experience: input.experience || input.level || 'intermediate',
      frequency: Number(input.frequency || input.weeklyDays || 3),
      split: input.split || 'full_body',
      userId,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  if (!data.success || !data.program) {
    throw new Error(data.error || "Failed to generate program with AI");
  }

  const aiProgram = data.program;

  const days: GeneratedWorkoutDay[] = (aiProgram.sessions || []).map((session: any, dayIdx: number) => {
    const focusMuscles: string[] = [];
    const exercises: GeneratedProgramExercise[] = (session.exercises || []).map((ex: any, exIdx: number) => {
      let minReps = 8;
      let maxReps = 12;
      if (typeof ex.reps === "string") {
        const parts = ex.reps.split("-").map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          minReps = parts[0];
          maxReps = parts[1];
        } else {
          const single = Number(ex.reps);
          if (!isNaN(single)) {
            minReps = single;
            maxReps = single;
          }
        }
      } else if (typeof ex.reps === "number") {
        minReps = ex.reps;
        maxReps = ex.reps;
      }

      return {
        id: `${session.dayNumber || dayIdx + 1}_ex_${exIdx}`,
        exerciseId: ex.exerciseId || `ex_${exIdx}`,
        name: ex.name || `Egzersiz ${exIdx + 1}`,
        sets: Number(ex.sets || 3),
        minReps,
        maxReps,
        suggestedWeight: Number(ex.suggestedWeight || 0),
        rpeTarget: Number(ex.rpe || 8),
        notes: ex.notes || "Forma dikkat edin.",
        order: Number(ex.order || exIdx + 1)
      };
    });

    return {
      id: `day_${session.dayNumber || dayIdx + 1}`,
      dayNumber: Number(session.dayNumber || dayIdx + 1),
      title: session.name || `Antrenman Günü ${dayIdx + 1}`,
      focusMuscles: focusMuscles.length > 0 ? focusMuscles : ["Tüm Vücut"],
      exercises,
      notes: ""
    };
  });

  const durationWeeks = Number(aiProgram.durationWeeks || input.durationWeeks || 8);
  const weeklyDays = Number(aiProgram.weeklyDays || input.frequency || input.weeklyDays || 3);

  const finalProgram: GeneratedTrainingProgram = {
    id: Math.random().toString(36).substring(2, 9),
    userId,
    name: aiProgram.name || `AI Programı`,
    goal: aiProgram.goal || input.goal,
    level: aiProgram.level || input.experience || 'intermediate',
    weeklyDays,
    durationWeeks,
    equipment: (input.equipment || []) as any[],
    priorityMuscles: input.priorityMuscles || [],
    restrictions: input.restrictions || [],
    days,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + durationWeeks * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    difficulty: aiProgram.level || input.experience || 'intermediate',
    daysPerWeek: weeklyDays,
    sessions: aiProgram.sessions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return finalProgram;
};

export const isValidTrainingProgram = (program: any): boolean => {
  if (!program) return false;
  if (!program.id || !program.userId) return false;
  if (!Array.isArray(program.sessions) || program.sessions.length === 0) return false;
  for (const session of program.sessions) {
    if (!Array.isArray(session.exercises) || session.exercises.length === 0) return false;
  }
  return true;
};

export const generateProgramWithFallback = async (
  input: ProgramGeneratorInput,
  userId: string
): Promise<GeneratedTrainingProgram> => {
  try {
    const aiProgram = await generateProgramWithAI(input, userId);

    if (isValidTrainingProgram(aiProgram)) {
      return aiProgram;
    }

    throw new Error('AI geçerli program formatı üretmedi.');
  } catch (error) {
    console.warn('AI program üretimi başarısız, lokal üretici kullanılacak:', error);

    return generateLocalTrainingProgram({
      ...input,
      userId
    });
  }
};
