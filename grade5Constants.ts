

import { SubjectId, Exercise } from './types';
import { GradeExerciseData } from './grade1Constants'; // Re-use interface
import { fifthGradeNumerosExercises } from './grade5NumerosData';
import { fifthGradeOperacionesExercises } from './grade5OperacionesData';
import { fifthGradeProblemasExercises } from './grade5ProblemasData';
import { fifthGradeMedidasExercises } from './grade5MedidasData'; 
import { fifthGradeGeometriaExercises } from './grade5GeometriaData';

// Assuming other subjects will be added later
const fifthGradeEstadisticaExercises: Exercise[] = [];
const fifthGradeProbabilidadExercises: Exercise[] = [];

export const grade5ExerciseData: GradeExerciseData = {
  [SubjectId.NUMEROS]: fifthGradeNumerosExercises,
  [SubjectId.OPERACIONES]: fifthGradeOperacionesExercises,
  [SubjectId.PROBLEMAS]: fifthGradeProblemasExercises,
  [SubjectId.MEDIDAS]: fifthGradeMedidasExercises,
  [SubjectId.GEOMETRIA]: fifthGradeGeometriaExercises,
  [SubjectId.ESTADISTICA]: fifthGradeEstadisticaExercises,
  [SubjectId.PROBABILIDAD]: fifthGradeProbabilidadExercises,
};
