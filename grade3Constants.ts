import { SubjectId, Exercise } from './types';
import { thirdGradeNumerosExercises } from './thirdGradeNumerosData';
import { thirdGradeOperacionesExercises } from './thirdGradeOperacionesData';
import { thirdGradeProblemasExercises } from './thirdGradeProblemasData';
import { thirdGradeMedidasExercises } from './thirdGradeMedidasData';
import { thirdGradeGeometriaExercises } from './thirdGradeGeometriaData';
import { thirdGradeEstadisticaExercises } from './thirdGradeEstadisticaData';
import { thirdGradeProbabilidadExercises } from './thirdGradeProbabilidadData';
import { GradeExerciseData } from './grade1Constants'; // Re-use interface

export const grade3ExerciseData: GradeExerciseData = {
  [SubjectId.NUMEROS]: thirdGradeNumerosExercises,
  [SubjectId.OPERACIONES]: thirdGradeOperacionesExercises,
  [SubjectId.PROBLEMAS]: thirdGradeProblemasExercises,
  [SubjectId.MEDIDAS]: thirdGradeMedidasExercises,
  [SubjectId.GEOMETRIA]: thirdGradeGeometriaExercises,
  [SubjectId.ESTADISTICA]: thirdGradeEstadisticaExercises,
  [SubjectId.PROBABILIDAD]: thirdGradeProbabilidadExercises,
};
