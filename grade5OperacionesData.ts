import { Exercise, ExerciseComponentType } from './types';
import { operarFraccionesHeterogeneasG5Data } from './exercises/grade5/operarFraccionesHeterogeneasG5Data';
import { multiplicarFraccionesG5Data } from './exercises/grade5/multiplicarFraccionesG5Data';
import { dividirFraccionesG5Data } from './exercises/grade5/dividirFraccionesG5Data';
import { operacionesCombinadasG5Data } from './exercises/grade5/operacionesCombinadasG5Data';

// Specific exercises for Fifth Grade - Operaciones (s2)
// This file is currently a placeholder. Exercises will be added here.
export const fifthGradeOperacionesExercises: Exercise[] = [
  {
    id: 'mega_operaciones_enteros_g5',
    title: 'Operaciones columnares con enteros',
    description: 'Realiza operaciones columnares con números enteros.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.MEGA_OPERACIONES_ENTEROS_G5,
  },
  {
    id: 'operar_fracciones_heterogeneas_g5',
    title: 'Operar fracciones heterogéneas',
    description: 'Suma y resta fracciones con diferente denominador.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.OPERAR_FRACCIONES_HETEROGENEAS_G5,
    data: { challenges: operarFraccionesHeterogeneasG5Data },
  },
  {
    id: 'multiplicar_fracciones_g5',
    title: 'Multiplicar fracciones',
    description: 'Multiplica fracciones.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.MULTIPLICAR_FRACCIONES_G5,
    data: { challenges: multiplicarFraccionesG5Data },
  },
  {
    id: 'dividir_fracciones_g5',
    title: 'Dividir fracciones',
    description: 'Divide fracciones.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.DIVIDIR_FRACCIONES_G5,
    data: { challenges: dividirFraccionesG5Data },
  },
  {
    id: 'columnar_operation_decimal',
    title: 'Operaciones columnares con decimales',
    description: 'Realiza operaciones columnares con decimales.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.COLUMNAR_OPERATION_DECIMAL,
  },
  {
    id: 'multiplicar_decimales_g5',
    title: 'Multiplicar decimales',
    description: 'Multiplica números decimales.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.MULTIPLICAR_DECIMALES_G5,
  },
  {
    id: 'dividir_decimales_por_entero_g5',
    title: 'Dividir decimales por entero',
    description: 'Divide decimales entre números enteros.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.DIVIDIR_DECIMALES_POR_ENTERO_G5,
  },
  {
    id: 'operaciones_combinadas_g5',
    title: 'Operaciones combinadas',
    description: 'Resuelve operaciones combinadas.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.OPERACIONES_COMBINADAS_G5,
    data: { challenges: operacionesCombinadasG5Data },
  },
  {
    id: 'potencias_cuadrados_cubos_g5',
    title: 'Potencias, cuadrados y cubos',
    description: 'Trabaja con potencias, cuadrados y cubos.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.POTENCIAS_CUADRADOS_CUBOS_G5,
    data: {
      baseRangeForSquare: [2, 15],
      baseRangeForCube: [2, 10],
    },
  },
];
