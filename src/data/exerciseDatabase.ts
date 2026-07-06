import { EXERCISE_LIBRARY } from './exerciseLibrary';

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

export const exerciseDatabase: ExerciseDatabaseItem[] = EXERCISE_LIBRARY.map(ex => {
  const primaryMuscle = ex.primaryMuscles[0] || 'Full Body';
  const equipmentDisplay = Array.isArray(ex.equipment) ? ex.equipment[0] : (ex.equipment || 'Vücut ağırlığı');
  return {
    id: ex.id,
    name: ex.name,
    category: ex.category.charAt(0).toUpperCase() + ex.category.slice(1),
    muscleGroup: primaryMuscle,
    equipment: equipmentDisplay,
    defaultSets: 3,
    defaultReps: 10,
    keywords: ex.keywords || []
  };
});
