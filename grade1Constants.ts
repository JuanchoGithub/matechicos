
import { SubjectId, Exercise } from './types';
import { firstGradeNumerosExercises } from './firstGradeNumerosData';
import { firstGradeOperacionesExercises } from './firstGradeOperacionesData';
import { firstGradeProblemasExercises } from './firstGradeProblemasData'; 
import { firstGradeMedidasExercises } from './firstGradeMedidasData';
import { firstGradeGeometriaExercises } from './firstGradeGeometriaData';
import { firstGradeEstadisticaExercises } from './firstGradeEstadisticaData'; 
import { firstGradeProbabilidadExercises } from './firstGradeProbabilidadData'; // New Import

export interface GradeExerciseData {
  [key: string]: Exercise[] | undefined; // Allow string keys for SubjectId
  [SubjectId.NUMEROS]?: Exercise[];
  [SubjectId.OPERACIONES]?: Exercise[];
  [SubjectId.PROBLEMAS]?: Exercise[];
  [SubjectId.MEDIDAS]?: Exercise[];
  [SubjectId.GEOMETRIA]?: Exercise[];
  [SubjectId.ESTADISTICA]?: Exercise[];
  [SubjectId.PROBABILIDAD]?: Exercise[];
}

export const grade1ExerciseData: GradeExerciseData = {
  [SubjectId.NUMEROS]: firstGradeNumerosExercises,
  [SubjectId.OPERACIONES]: firstGradeOperacionesExercises,
  [SubjectId.PROBLEMAS]: firstGradeProblemasExercises, 
  [SubjectId.MEDIDAS]: firstGradeMedidasExercises,
  [SubjectId.GEOMETRIA]: firstGradeGeometriaExercises,
  [SubjectId.ESTADISTICA]: firstGradeEstadisticaExercises,
  [SubjectId.PROBABILIDAD]: firstGradeProbabilidadExercises, // Added Probabilidad
};
