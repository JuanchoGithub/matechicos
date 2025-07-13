
const COMPLETED_EXERCISES_KEY = 'matechicos_completed_exercises';

export const getCompletedExercises = (): Set<string> => {
  const stored = localStorage.getItem(COMPLETED_EXERCISES_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ensure it's an array before creating a Set
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    } catch (e) {
      // console.error("Error parsing completed exercises from localStorage", e);
      localStorage.removeItem(COMPLETED_EXERCISES_KEY); // Clear invalid data
    }
  }
  return new Set();
};

export const markExerciseAsCompletedInStorage = (exerciseId: string): Set<string> => {
  const completed = getCompletedExercises();
  completed.add(exerciseId);
  localStorage.setItem(COMPLETED_EXERCISES_KEY, JSON.stringify(Array.from(completed)));
  return completed;
};

export const isExerciseCompletedInStorage = (exerciseId: string): boolean => {
  return getCompletedExercises().has(exerciseId);
};
