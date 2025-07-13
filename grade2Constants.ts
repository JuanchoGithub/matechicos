
import { SubjectId, Exercise } from './types';
import { GradeExerciseData } from './grade1Constants'; // Re-use interface
import { secondGradeNumerosExercises } from './grade2NumerosData';
import { secondGradeOperacionesExercises } from './grade2OperacionesData';
import { secondGradeMedidasExercises } from './grade2MedidasData';
import { secondGradeGeometriaExercises } from './grade2GeometriaData';
import { secondGradeEstadisticaExercises } from './grade2EstadisticaData';
import { secondGradeProbabilidadExercises } from './grade2ProbabilidadData';
import { secondGradeProblemasExercises } from './grade2ProblemasData';


export const grade2ExerciseData: GradeExerciseData = {
  [SubjectId.NUMEROS]: secondGradeNumerosExercises,
  [SubjectId.OPERACIONES]: secondGradeOperacionesExercises,
  [SubjectId.MEDIDAS]: secondGradeMedidasExercises,
  [SubjectId.GEOMETRIA]: secondGradeGeometriaExercises,
  [SubjectId.ESTADISTICA]: secondGradeEstadisticaExercises,
  [SubjectId.PROBABILIDAD]: secondGradeProbabilidadExercises,
  [SubjectId.PROBLEMAS]: secondGradeProblemasExercises,
};
