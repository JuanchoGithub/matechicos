
import { GradeLevel, Exercise, ExerciseComponentType, OriginalIconName } from '../types';

// Helper to create a complete exercise object for templated exercises
export const createExercise = (
  grade: GradeLevel,
  subjectIndex: number, // 0-based index of the subject in SUBJECTS_TEMPLATES
  exerciseIndex: number, // 0-based index of the exercise in its subject's template
  baseTitle: string,
  description: string,
  isLocked: boolean = false,
  componentType: ExerciseComponentType = ExerciseComponentType.GENERIC,
  data: any = {},
  question?: string,
  iconName: OriginalIconName = 'BookOpenIcon'
): Exercise => ({
  id: `g${grade}-s${subjectIndex + 1}-e${exerciseIndex + 1}`,
  title: baseTitle,
  description,
  iconName: iconName,
  isLocked,
  content: `Contenido del ejercicio: ${baseTitle}`,
  componentType,
  question: question || baseTitle,
  data,
});