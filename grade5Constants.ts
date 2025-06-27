

import { SubjectId, Exercise } from './types';
import { GradeExerciseData } from './grade1Constants'; // Re-use interface
import { fifthGradeNumerosExercises } from './grade5NumerosData';
import { fifthGradeOperacionesExercises } from './grade5OperacionesData';
import { fifthGradeProblemasExercises } from './grade5ProblemasData';
import { fifthGradeMedidasExercises } from './grade5MedidasData'; // New Import

export const grade5ExerciseData: GradeExerciseData = {
  [SubjectId.NUMEROS]: fifthGradeNumerosExercises,
  [SubjectId.OPERACIONES]: fifthGradeOperacionesExercises,
  [SubjectId.PROBLEMAS]: fifthGradeProblemasExercises,
  [SubjectId.MEDIDAS]: fifthGradeMedidasExercises,
  // Other subjects for 5th grade can be added here
};
