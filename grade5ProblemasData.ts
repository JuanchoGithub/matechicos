

import { Exercise, ExerciseComponentType } from './types';
import { ScenarioSetId } from './exercises/problemScenarios/index';
import { fifthGradeMultiStepScenarios } from './exercises/problemScenariosData/fifthGradeMultiStep';
import { fifthGradeProportionsScenarios } from './exercises/problemScenariosData/fifthGradeProportions';
import { fifthGradeRemainderScenarios } from './exercises/problemScenariosData/fifthGradeRemainder';
import { fifthGradeFinanceAdvancedScenarios } from './exercises/problemScenariosData/fifthGradeFinanceAdvanced';

const fifthGradeBaseData = {
  totalStars: 8,
};

export const fifthGradeProblemasExercises: Exercise[] = [
  {
    id: 'g5-s7-e1',
    title: 'Desafíos de Múltiples Pasos',
    description: 'Resuelve problemas que requieren aplicar varias operaciones en secuencia.',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_MULTIPLES_PASOS_G5,
    data: { 
      ...fifthGradeBaseData,
      totalStars: fifthGradeMultiStepScenarios.length,
      scenarios: fifthGradeMultiStepScenarios 
    },
    question: 'Lee el problema y resuélvelo paso a paso:',
  },
  {
    id: 'g5-s7-e2',
    title: 'Problemas Fraccionados y Decimales',
    description: 'Aplica tus conocimientos de fracciones y decimales en situaciones problemáticas.',
    iconName: 'BookOpenIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: {
      ...fifthGradeBaseData,
      numberRange: [0.5, 20.5] as [number, number],
      allowDecimal: true,
      maxDigitsForDataEntry: 4,
      maxDigitsForResultEntry: 5,
      scenarioSetId: ScenarioSetId.FIFTH_GRADE_FRAC_DEC,
      allowedOperations: ['+', '-'],
    },
    question: 'Lee y resuelve el problema con decimales:',
  },
  {
    id: 'g5-s7-e3',
    title: 'Averiguando Proporciones',
    description: 'Resuelve problemas de proporcionalidad directa simples (regla de tres simple).',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PROPORCIONALIDAD_G5,
    data: { 
      ...fifthGradeBaseData,
      totalStars: fifthGradeProportionsScenarios.length,
      scenarios: fifthGradeProportionsScenarios 
    },
    question: 'Encuentra el valor que falta:',
  },
  {
    id: 'g5-s7-e4',
    title: '¿Qué Hacemos con el Resto?',
    description: 'Interpreta el significado del resto en diferentes contextos de división.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_INTERPRETAR_RESTO_G5,
    data: { 
      ...fifthGradeBaseData,
      totalStars: fifthGradeRemainderScenarios.length,
      scenarios: fifthGradeRemainderScenarios 
    },
    question: 'Resuelve y responde ambas preguntas:',
  },
  {
    id: 'g5-s7-e5',
    title: 'Midiendo el Mundo: Problemas con Conversiones',
    description: 'Resuelve problemas convirtiendo unidades de longitud, masa, capacidad y tiempo.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
     data: {
      ...fifthGradeBaseData,
      numberRange: [1, 1000], // Numbers are already converted in problem text
      scenarioSetId: ScenarioSetId.FIFTH_GRADE_CONVERSIONS,
      allowedOperations: ['+', '-'],
    },
    question: 'Lee, convierte si es necesario, y resuelve:',
  },
  {
    id: 'g5-s7-e6',
    title: 'Finanzas para Chicos: Dinero y Presupuestos',
    description: 'Aplica matemáticas para resolver situaciones con dinero, compras y ahorros.',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.FINANZAS_AVANZADO,
    data: { 
      ...fifthGradeBaseData,
      totalStars: fifthGradeFinanceAdvancedScenarios.length,
      scenarios: fifthGradeFinanceAdvancedScenarios,
    },
    question: 'Resuelve el problema de finanzas paso a paso:',
  },
];